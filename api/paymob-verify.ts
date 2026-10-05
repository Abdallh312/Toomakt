import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Serverless API handler to verify Paymob transaction status
 * Vercel Route: POST /api/paymob-verify
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { orderNumber, paymobOrderId, transactionId } = req.body || {};
  const apiKey = process.env.PAYMOB_API_KEY || process.env.VITE_PAYMOB_API_KEY;

  if (!apiKey) {
    return res.status(400).json({ success: false, isPaid: false, message: 'Paymob API key not configured' });
  }

  try {
    // 1. Get Auth Token
    const authRes = await fetch('https://accept.paymob.com/api/auth/tokens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: apiKey }),
    });
    const authData = await authRes.json();
    const token = authData.token;

    if (!token) {
      return res.status(500).json({ success: false, isPaid: false, message: 'Paymob auth failed' });
    }

    // 2. Direct check by transactionId (from Paymob post_pay or return URL ?id=...)
    if (transactionId) {
      try {
        const txRes = await fetch(`https://accept.paymob.com/api/acceptance/transactions/${transactionId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (txRes.ok) {
          const tx = await txRes.json();
          const isPaid = tx.success === true && !tx.is_voided && !tx.is_refunded;
          return res.status(200).json({
            success: true,
            isPaid,
            status: isPaid ? 'PAID' : (tx.data?.message || 'DECLINED'),
            orderNumber: tx.order?.merchant_order_id,
            paymobOrderId: tx.order?.id,
            paidAmountCents: tx.amount_cents,
            transactionId: tx.id,
            isDeclined: !isPaid,
            declineReason: !isPaid ? (tx.data?.message || 'Transaction not approved') : undefined,
          });
        }
      } catch (err: any) {
        console.error('Error fetching transaction by ID:', err);
      }
    }

    // 3. Check Order Status if paymobOrderId is provided
    if (paymobOrderId) {
      const orderRes = await fetch(`https://accept.paymob.com/api/ecommerce/orders/${paymobOrderId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (orderRes.ok) {
        const orderData = await orderRes.json();
        const isPaid = (orderData.paid_amount_cents && Number(orderData.paid_amount_cents) > 0) || orderData.payment_status === 'PAID';
        
        let declineReason = '';
        try {
          const inqRes = await fetch('https://accept.paymob.com/api/ecommerce/orders/transaction_inquiry', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ auth_token: token, order_id: paymobOrderId })
          });
          if (inqRes.ok) {
            const inqData = await inqRes.json();
            if (inqData.success === false) {
              declineReason = inqData.data?.message || inqData.detail || 'Transaction declined by bank or gateway';
            }
          }
        } catch {}

        return res.status(200).json({
          success: true,
          isPaid,
          status: orderData.payment_status,
          paidAmountCents: orderData.paid_amount_cents,
          declineReason,
          isDeclined: Boolean(declineReason && !isPaid),
        });
      }
    }

    // 3. Fallback check by merchant_order_id
    if (orderNumber) {
      const inqRes = await fetch('https://accept.paymob.com/api/ecommerce/orders/transaction_inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auth_token: token, merchant_order_id: orderNumber })
      });
      if (inqRes.ok) {
        const inqData = await inqRes.json();
        return res.status(200).json({
          success: true,
          isPaid: inqData.success === true,
          status: inqData.success ? 'PAID' : 'DECLINED',
          declineReason: inqData.success ? undefined : (inqData.data?.message || 'Transaction declined'),
          isDeclined: inqData.success === false,
        });
      }
    }

    return res.status(200).json({
      success: true,
      isPaid: false,
      status: 'UNPAID',
      message: 'No completed transaction found for this order yet.',
    });
  } catch (err: any) {
    console.error('Paymob verify error:', err);
    return res.status(500).json({ success: false, isPaid: false, message: err.message });
  }
}
