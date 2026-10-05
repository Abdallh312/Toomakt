import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

function paymobDevPlugin(env: Record<string, string>) {
  return {
    name: 'paymob-dev-plugin',
    configureServer(server: any) {
      server.middlewares.use('/api/paymob-initiate', async (req: any, res: any) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ success: false, message: 'Method Not Allowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk: any) => { body += chunk; });
        req.on('end', async () => {
          try {
            const data = JSON.parse(body || '{}');
            const apiKey = env.PAYMOB_API_KEY || env.VITE_PAYMOB_API_KEY;
            const publicKey = env.PAYMOB_PUBLIC_KEY || env.VITE_PAYMOB_PUBLIC_KEY;
            const secretKey = env.PAYMOB_SECRET_KEY || env.VITE_PAYMOB_SECRET_KEY;
            const cardId = String(env.PAYMOB_CARD_INTEGRATION_ID || env.VITE_PAYMOB_CARD_INTEGRATION_ID || '5963962').replace(/[^0-9]/g, '');
            const iframeId = String(env.PAYMOB_IFRAME_ID || env.VITE_PAYMOB_IFRAME_ID || '1084110').replace(/[^0-9]/g, '');

            // Try Unified Checkout
            if (secretKey && publicKey) {
              const intentionRes = await fetch('https://accept.paymob.com/v1/intention/', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Token ${secretKey}`,
                },
                body: JSON.stringify({
                  amount: data.amountCents || 22000,
                  currency: 'EGP',
                  payment_methods: [Number(cardId)],
                  items: data.items?.map((it: any) => ({
                    name: it.name || 'Confectionery',
                    amount: Math.round(Number(it.unit_price || 0) * 100),
                    quantity: it.quantity || 1,
                  })) || [],
                  billing_data: {
                    first_name: (data.customerName || 'Customer').split(' ')[0] || 'Customer',
                    last_name: (data.customerName || 'Customer').split(' ').slice(1).join(' ') || 'toomakt',
                    phone_number: data.customerPhone || '01000000000',
                    email: data.customerEmail || 'orders@toomakt.com',
                  },
                  special_reference: data.orderNumber,
                }),
              });

              if (intentionRes.ok) {
                const json = await intentionRes.json();
                const unifiedUrl = `https://accept.paymob.com/unifiedcheckout/?publicKey=${publicKey}&clientSecret=${json.client_secret}`;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  success: true,
                  paymentUrl: unifiedUrl,
                  iframeUrl: unifiedUrl,
                  token: json.client_secret,
                  paymobOrderId: json.intention_order?.id || json.id,
                }));
                return;
              }
            }

            // Fallback Classic API
            if (apiKey && cardId) {
              const authRes = await fetch('https://accept.paymob.com/api/auth/tokens', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ api_key: apiKey }),
              });
              const authData = await authRes.json();
              if (authData.token) {
                const orderRes = await fetch('https://accept.paymob.com/api/ecommerce/orders', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    auth_token: authData.token,
                    delivery_needed: 'false',
                    amount_cents: data.amountCents || 22000,
                    currency: 'EGP',
                    merchant_order_id: data.orderNumber,
                    items: [],
                  }),
                });
                const orderData = await orderRes.json();
                const keyRes = await fetch('https://accept.paymob.com/api/acceptance/payment_keys', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    auth_token: authData.token,
                    amount_cents: data.amountCents || 22000,
                    expiration: 3600,
                    order_id: orderData.id,
                    billing_data: {
                      first_name: (data.customerName || 'Customer').split(' ')[0] || 'Customer',
                      last_name: (data.customerName || 'Customer').split(' ').slice(1).join(' ') || 'toomakt',
                      phone_number: data.customerPhone || '01000000000',
                      email: data.customerEmail || 'orders@toomakt.com',
                      street: data.shippingAddress || 'Cairo',
                      building: data.buildingNumber || '1',
                      floor: data.apartmentFloor || '1',
                      apartment: data.apartmentFloor || '1',
                      city: data.shippingCity || 'Cairo',
                      country: 'EG',
                    },
                    currency: 'EGP',
                    integration_id: Number(cardId),
                  }),
                });
                const keyData = await keyRes.json();
                if (keyData.token) {
                  const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${iframeId}?payment_token=${keyData.token}`;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({
                    success: true,
                    paymentUrl: iframeUrl,
                    iframeUrl,
                    token: keyData.token,
                    paymobOrderId: orderData.id,
                  }));
                  return;
                }
              }
            }

            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, message: 'Failed to initiate Paymob payment' }));
          } catch (e: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, message: e.message }));
          }
        });
      });

      // Verification endpoint for local dev server
      server.middlewares.use('/api/paymob-verify', async (req: any, res: any) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ success: false, message: 'Method Not Allowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk: any) => { body += chunk; });
        req.on('end', async () => {
          try {
            const data = JSON.parse(body || '{}');
            const apiKey = env.PAYMOB_API_KEY || env.VITE_PAYMOB_API_KEY;

            if (!apiKey) {
              res.statusCode = 400;
              res.end(JSON.stringify({ success: false, isPaid: false, message: 'Paymob API key missing' }));
              return;
            }

            const authRes = await fetch('https://accept.paymob.com/api/auth/tokens', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ api_key: apiKey }),
            });
            const authData = await authRes.json();
            const token = authData.token;

            if (!token) {
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, isPaid: false, message: 'Paymob authentication failed' }));
              return;
            }

            if (data.transactionId) {
              try {
                const txRes = await fetch(`https://accept.paymob.com/api/acceptance/transactions/${data.transactionId}`, {
                  headers: { 'Authorization': `Bearer ${token}` }
                });
                if (txRes.ok) {
                  const tx = await txRes.json();
                  const isPaid = tx.success === true && !tx.is_voided && !tx.is_refunded;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({
                    success: true,
                    isPaid,
                    status: isPaid ? 'PAID' : (tx.data?.message || 'DECLINED'),
                    orderNumber: tx.order?.merchant_order_id,
                    paymobOrderId: tx.order?.id,
                    paidAmountCents: tx.amount_cents,
                    transactionId: tx.id,
                    isDeclined: !isPaid,
                    declineReason: !isPaid ? (tx.data?.message || 'Transaction not approved') : undefined,
                  }));
                  return;
                }
              } catch (e: any) {
                console.error('Error verifying transactionId:', e);
              }
            }

            if (data.paymobOrderId) {
              const orderRes = await fetch(`https://accept.paymob.com/api/ecommerce/orders/${data.paymobOrderId}`, {
                headers: { 'Authorization': `Bearer ${token}` },
              });
              if (orderRes.ok) {
                const orderData = await orderRes.json();
                const isPaid = (orderData.paid_amount_cents && Number(orderData.paid_amount_cents) > 0) || orderData.payment_status === 'PAID';
                
                let declineReason = '';
                try {
                  const inqRes = await fetch('https://accept.paymob.com/api/ecommerce/orders/transaction_inquiry', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ auth_token: token, order_id: data.paymobOrderId }),
                  });
                  if (inqRes.ok) {
                    const inqData = await inqRes.json();
                    if (inqData.success === false) {
                      declineReason = inqData.data?.message || inqData.detail || 'Transaction declined';
                    }
                  }
                } catch {}

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  success: true,
                  isPaid,
                  status: orderData.payment_status,
                  paidAmountCents: orderData.paid_amount_cents,
                  declineReason,
                  isDeclined: Boolean(declineReason && !isPaid),
                }));
                return;
              }
            }

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              success: true,
              isPaid: false,
              status: 'UNPAID',
              message: 'Transaction not found or not yet completed.',
            }));
          } catch (e: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, isPaid: false, message: e.message }));
          }
        });
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const supabaseUrl = env.VITE_SUPABASE_URL || 'https://fpabvfwjbxqsrpdglvgt.supabase.co';
  const secretKey = env.SUPABASE_SECRET_KEY || env.VITE_SUPABASE_SERVICE_ROLE_KEY || '';

  return {
    plugins: [react(), paymobDevPlugin(env)],
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
    server: {
      port: 5176,
      host: true,
      proxy: {
        '/supabase-admin': {
          target: supabaseUrl,
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/supabase-admin/, '/rest/v1'),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              // Strip browser client hint headers so Supabase recognizes this as a secure server-to-server request
              proxyReq.removeHeader('sec-ch-ua');
              proxyReq.removeHeader('sec-ch-ua-mobile');
              proxyReq.removeHeader('sec-ch-ua-platform');
              proxyReq.setHeader('User-Agent', 'toomakt-atelier-server/1.0');
              proxyReq.setHeader('apikey', secretKey);
              proxyReq.setHeader('Authorization', `Bearer ${secretKey}`);
            });
          },
        },
      },
    },
  };
});
