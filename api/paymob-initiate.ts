import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Serverless API handler to initiate Paymob Card Payment
 * Vercel Route: POST /api/paymob-initiate
 * 
 * Generates Paymob Classic Accept Payment Key and returns the custom
 * atelier-styled iframe URL (ID: 1084110) for seamless in-page card checkout.
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

  const fallbackApiKey = 'ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmpiR0Z6Y3lJNklrMWxjbU5vWVc1MElpd2ljSEp2Wm1sc1pWOXdheUk2TVRJek9EQXlOU3dpYm1GdFpTSTZJbWx1YVhScFlXd2lmUS5GeXJJdUgtS1RsMWN3RnJoSUJRZ0psYjJ5MFJQR3paM251dHY2aVRmZDFxSEdxNTdaYUhvZGNNZ1JxRWpzVVlGUVpLOE9aVWZCUWExaGt0ZEZuYUNDdw==';
  const apiKey = process.env.PAYMOB_API_KEY || process.env.VITE_PAYMOB_API_KEY || fallbackApiKey;
  const publicKey = process.env.PAYMOB_PUBLIC_KEY || process.env.VITE_PAYMOB_PUBLIC_KEY;
  const secretKey = process.env.PAYMOB_SECRET_KEY || process.env.VITE_PAYMOB_SECRET_KEY;
  const rawCardIntegrationId = process.env.PAYMOB_CARD_INTEGRATION_ID || process.env.VITE_PAYMOB_CARD_INTEGRATION_ID || '5963962';
  const rawIframeId = process.env.PAYMOB_IFRAME_ID || process.env.VITE_PAYMOB_IFRAME_ID || '1084110';

  const cardIntegrationId = String(rawCardIntegrationId).replace(/[^0-9]/g, '') || '5963962';
  const iframeId = String(rawIframeId).replace(/[^0-9]/g, '') || '1084110';

  const parsedAmountCents = Math.round(Number(amountCents) || 0);
  if (!parsedAmountCents || parsedAmountCents <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid payment amount specified.' });
  }

  const customerFirst = (customerName || 'Customer').trim().split(' ')[0] || 'Customer';
  const customerLast = (customerName || 'Customer').trim().split(' ').slice(1).join(' ') || 'toomakt';
  const cleanPhone = (customerPhone || '01000000000').replace(/\s+/g, '');
  const cleanEmail = (customerEmail || 'orders@toomakt.com').trim();
  const cleanAddress = (shippingAddress || 'Atelier Delivery').trim();
  const cleanCity = (shippingCity || governorate || 'Cairo').trim();

  // 1. Prioritize Classic Accept API (Directly integrates with Custom Iframe 1084110)
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

      if (!authToken) {
        throw new Error('Authentication with Paymob failed: ' + JSON.stringify(authData));
      }

      // Step B: Order Registration
      const orderRes = await fetch('https://accept.paymob.com/api/ecommerce/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auth_token: authToken,
          delivery_needed: 'false',
          amount_cents: parsedAmountCents,
          currency: 'EGP',
          merchant_order_id: orderNumber || `ORD-TOOMAKT-${Date.now()}`,
          items: items?.map((it: any) => ({
            name: it.name || 'Confectionery',
            amount_cents: Math.round(Number(it.unit_price || 0) * 100),
            quantity: it.quantity || 1,
            description: it.flavor || 'Toomakt Toffee',
          })) || [],
        }),
      });
      const orderData = await orderRes.json();
      const paymobOrderId = orderData.id;

      if (!paymobOrderId) {
        throw new Error('Order registration with Paymob failed: ' + JSON.stringify(orderData));
      }

      // Step C: Payment Key Request
      const keyRes = await fetch('https://accept.paymob.com/api/acceptance/payment_keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auth_token: authToken,
          amount_cents: parsedAmountCents,
          expiration: 3600,
          order_id: paymobOrderId,
          billing_data: {
            first_name: customerFirst,
            last_name: customerLast,
            phone_number: cleanPhone,
            email: cleanEmail,
            street: cleanAddress,
            building: buildingNumber || '1',
            floor: apartmentFloor || '1',
            apartment: apartmentFloor || '1',
            city: cleanCity,
            country: 'EG',
          },
          currency: 'EGP',
          integration_id: cardIntegrationId,
        }),
      });
      const keyData = await keyRes.json();
      const paymentToken = keyData.token;

      if (!paymentToken) {
        throw new Error('Payment key generation failed: ' + JSON.stringify(keyData));
      }

      const ifId = iframeId || '1084110';
      const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${ifId}?payment_token=${paymentToken}`;

      return res.status(200).json({
        success: true,
        paymentUrl: iframeUrl,
        iframeUrl,
        token: paymentToken,
        paymobOrderId,
      });
    } catch (err: any) {
      console.error('Paymob Classic API error in serverless handler:', err);
    }
  }

  // 2. Secondary fallback: Unified Intention API
  if (secretKey && publicKey) {
    try {
      const intentionRes = await fetch('https://accept.paymob.com/v1/intention/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${secretKey}`,
        },
        body: JSON.stringify({
          amount: parsedAmountCents,
          currency: 'EGP',
          payment_methods: cardIntegrationId ? [Number(cardIntegrationId)] : ['card'],
          items: items?.map((it: any) => ({
            name: it.name || 'Confectionery',
            amount: Math.round(Number(it.unit_price || 0) * 100),
            quantity: it.quantity || 1,
          })) || [],
          billing_data: {
            first_name: customerFirst,
            last_name: customerLast,
            phone_number: cleanPhone,
            email: cleanEmail,
            street: cleanAddress,
            building: buildingNumber || '1',
            floor: apartmentFloor || '1',
            apartment: apartmentFloor || '1',
            city: cleanCity,
            country: 'EG',
          },
          special_reference: orderNumber,
        }),
      });

      if (intentionRes.ok) {
        const data = await intentionRes.json();
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
      console.error('Paymob intention fallback error:', err);
    }
  }

  return res.status(502).json({
    success: false,
    message: 'Unable to initialize card session with Paymob gateway. Please verify that Paymob environment variables are set in your deployment.',
  });
}
