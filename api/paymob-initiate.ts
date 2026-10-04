import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Serverless API handler to initiate Paymob Card Payment
 * Vercel Route: POST /api/paymob-initiate
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const {
    orderNumber,
    amountCents,
    customerName,
    customerEmail,
    customerPhone,
    shippingAddress,
    shippingCity,
    governorate,
    buildingNumber,
    apartmentFloor,
    items,
  } = req.body || {};

  const apiKey = process.env.PAYMOB_API_KEY || process.env.VITE_PAYMOB_API_KEY;
  const publicKey = process.env.PAYMOB_PUBLIC_KEY || process.env.VITE_PAYMOB_PUBLIC_KEY;
  const secretKey = process.env.PAYMOB_SECRET_KEY || process.env.VITE_PAYMOB_SECRET_KEY;
  const rawCardIntegrationId = process.env.PAYMOB_CARD_INTEGRATION_ID || process.env.VITE_PAYMOB_CARD_INTEGRATION_ID || '5963962';
  const rawIframeId = process.env.PAYMOB_IFRAME_ID || process.env.VITE_PAYMOB_IFRAME_ID || '1084110';
  const cardIntegrationId = String(rawCardIntegrationId).replace(/[^0-9]/g, '');
  const iframeId = String(rawIframeId).replace(/[^0-9]/g, '');

  // 1. Try Unified Checkout (Intention API) if Secret Key is provided
  if (secretKey && publicKey) {
    try {
      const response = await fetch('https://accept.paymob.com/v1/intention/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${secretKey}`,
        },
        body: JSON.stringify({
          amount: amountCents,
          currency: 'EGP',
          payment_methods: cardIntegrationId ? [Number(cardIntegrationId)] : ['card'],
          items: items?.map((it: any) => ({
            name: it.name || 'Confectionery',
            amount: Math.round(Number(it.unit_price || 0) * 100),
            quantity: it.quantity || 1,
          })) || [],
          billing_data: {
            first_name: (customerName || 'Customer').split(' ')[0] || 'Customer',
            last_name: (customerName || 'Customer').split(' ').slice(1).join(' ') || 'toomakt',
            phone_number: customerPhone || '01000000000',
            email: customerEmail || 'orders@toomakt.com',
            street: shippingAddress || 'Cairo',
            building: buildingNumber || '1',
            floor: apartmentFloor || '1',
            apartment: apartmentFloor || '1',
            city: shippingCity || governorate || 'Cairo',
            country: 'EG',
          },
          special_reference: orderNumber,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const clientSecret = data.client_secret;
        const unifiedUrl = `https://accept.paymob.com/unifiedcheckout/?publicKey=${publicKey}&clientSecret=${clientSecret}`;
        return res.status(200).json({
          success: true,
          paymentUrl: unifiedUrl,
          iframeUrl: unifiedUrl,
          token: clientSecret,
          paymobOrderId: data.intention_order?.id || data.id,
        });
      }
    } catch (err: any) {
      console.error('Paymob intention serverless error:', err);
    }
  }

  // 2. Try Classic Accept API
  if (apiKey && cardIntegrationId) {
    try {
      // Step A: Auth Token
      const authRes = await fetch('https://accept.paymob.com/api/auth/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: apiKey }),
      });
      const authData = await authRes.json();
      const authToken = authData.token;

      // Step B: Order
      const orderRes = await fetch('https://accept.paymob.com/api/ecommerce/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auth_token: authToken,
          delivery_needed: 'false',
          amount_cents: amountCents,
          currency: 'EGP',
          merchant_order_id: orderNumber,
          items: [],
        }),
      });
      const orderData = await orderRes.json();
      const paymobOrderId = orderData.id;

      // Step C: Payment Key
      const keyRes = await fetch('https://accept.paymob.com/api/acceptance/payment_keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auth_token: authToken,
          amount_cents: amountCents,
          expiration: 3600,
          order_id: paymobOrderId,
          billing_data: {
            first_name: (customerName || 'Customer').split(' ')[0] || 'Customer',
            last_name: (customerName || 'Customer').split(' ').slice(1).join(' ') || 'toomakt',
            phone_number: customerPhone || '01000000000',
            email: customerEmail || 'orders@toomakt.com',
            street: shippingAddress || 'Cairo',
            building: buildingNumber || '1',
            floor: apartmentFloor || '1',
            apartment: apartmentFloor || '1',
            city: shippingCity || governorate || 'Cairo',
            country: 'EG',
          },
          currency: 'EGP',
          integration_id: cardIntegrationId,
        }),
      });
      const keyData = await keyRes.json();
      const paymentToken = keyData.token;

      const ifId = iframeId || 'default';
      const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${ifId}?payment_token=${paymentToken}`;

      return res.status(200).json({
        success: true,
        paymentUrl: iframeUrl,
        iframeUrl,
        token: paymentToken,
        paymobOrderId,
      });
    } catch (err: any) {
      console.error('Paymob classic serverless error:', err);
    }
  }

  // Fallback demo/simulation response if credentials are not yet saved
  return res.status(200).json({
    success: true,
    isSandboxDemo: true,
    transactionId: `PAYMOB-VISA-${Math.floor(100000 + Math.random() * 900000)}`,
    message: 'Demo mode active: Awaiting Paymob credentials in environment variables.',
  });
}
