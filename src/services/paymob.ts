/**
 * toomakt — Paymob Visa & Mastercard Payment Gateway Integration
 * 
 * Supports both:
 * 1. Paymob Classic Accept API (Auth -> Order -> Payment Key -> Custom Iframe 1084110)
 * 2. Paymob Unified Checkout (Intention API)
 */

export interface PaymobConfig {
  apiKey?: string;
  publicKey?: string;
  secretKey?: string;
  cardIntegrationId?: string;
  iframeId?: string;
  hmacSecret?: string;
}

export interface PaymobInitiateParams {
  orderNumber: string;
  amountEgp: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  governorate?: string;
  shippingAddress: string;
  shippingCity?: string;
  buildingNumber?: string;
  apartmentFloor?: string;
  items?: Array<{
    name: string;
    unit_price: number;
    quantity: number;
    flavor?: string;
  }>;
}

export interface PaymobInitiateResult {
  success: boolean;
  paymentUrl?: string;
  iframeUrl?: string;
  token?: string;
  transactionId?: string;
  paymobOrderId?: number | string;
  isSandboxDemo?: boolean;
  message?: string;
}

export interface PaymobVerifyResult {
  success: boolean;
  isPaid: boolean;
  isDeclined?: boolean;
  status?: string;
  declineReason?: string;
  orderNumber?: string;
  paidAmountCents?: number;
  transactionId?: string | number;
  message?: string;
}

export class PaymobService {
  // Read from Vite environment variables
  private static getConfig(): PaymobConfig {
    const rawCardId = import.meta.env.VITE_PAYMOB_CARD_INTEGRATION_ID || '5963962';
    const rawIframeId = import.meta.env.VITE_PAYMOB_IFRAME_ID || '1084110';
    const fallbackApiKey = 'ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmpiR0Z6Y3lJNklrMWxjbU5vWVc1MElpd2ljSEp2Wm1sc1pWOXdheUk2TVRJek9EQXlOU3dpYm1GdFpTSTZJbWx1YVhScFlXd2lmUS5GeXJJdUgtS1RsMWN3RnJoSUJRZ0psYjJ5MFJQR3paM251dHY2aVRmZDFxSEdxNTdaYUhvZGNNZ1JxRWpzVVlGUVpLOE9aVWZCUWExaGt0ZEZuYUNDdw==';
    return {
      apiKey: import.meta.env.VITE_PAYMOB_API_KEY || fallbackApiKey,
      publicKey: import.meta.env.VITE_PAYMOB_PUBLIC_KEY || '',
      secretKey: import.meta.env.VITE_PAYMOB_SECRET_KEY || '',
      cardIntegrationId: String(rawCardId).replace(/[^0-9]/g, '') || '5963962',
      iframeId: String(rawIframeId).replace(/[^0-9]/g, '') || '1084110',
      hmacSecret: import.meta.env.VITE_PAYMOB_HMAC_SECRET || '',
    };
  }

  public static isConfigured(): boolean {
    const config = this.getConfig();
    return Boolean(
      (config.secretKey && config.publicKey) ||
      (config.apiKey && config.cardIntegrationId)
    );
  }

  /**
   * Initiates a Visa / Mastercard payment with Paymob.
   * Connects to /api/paymob-initiate or direct fallback, returning the custom atelier iframe.
   */
  public static async initiateCardPayment(params: PaymobInitiateParams): Promise<PaymobInitiateResult> {
    const config = this.getConfig();
    const amountCents = Math.round(params.amountEgp * 100);

    // 1. Try serverless backend endpoint first (/api/paymob-initiate)
    try {
      const response = await fetch('/api/paymob-initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...params,
          amountCents,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.iframeUrl) {
          return data;
        }
      }
    } catch {
      // Backend route not available -> proceed with direct fallback
    }

    // 2. Direct Classic Accept API fallback
    if (config.apiKey && config.cardIntegrationId) {
      try {
        const authRes = await fetch('https://accept.paymob.com/api/auth/tokens', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ api_key: config.apiKey }),
        });
        const authData = await authRes.json();
        const authToken = authData.token;

        if (authToken) {
          const orderRes = await fetch('https://accept.paymob.com/api/ecommerce/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              auth_token: authToken,
              delivery_needed: 'false',
              amount_cents: amountCents,
              currency: 'EGP',
              merchant_order_id: params.orderNumber,
              items: [],
            }),
          });
          const orderData = await orderRes.json();
          const paymobOrderId = orderData.id;

          const keyRes = await fetch('https://accept.paymob.com/api/acceptance/payment_keys', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              auth_token: authToken,
              amount_cents: amountCents,
              expiration: 3600,
              order_id: paymobOrderId,
              billing_data: {
                first_name: params.customerName.split(' ')[0] || 'Customer',
                last_name: params.customerName.split(' ').slice(1).join(' ') || 'toomakt',
                phone_number: (params.customerPhone || '01000000000').replace(/\s+/g, ''),
                email: params.customerEmail || 'orders@toomakt.com',
                street: params.shippingAddress || 'Street',
                building: params.buildingNumber || '1',
                floor: params.apartmentFloor || '1',
                apartment: params.apartmentFloor || '1',
                city: params.shippingCity || params.governorate || 'Cairo',
                country: 'EG',
              },
              currency: 'EGP',
              integration_id: config.cardIntegrationId,
            }),
          });
          const keyData = await keyRes.json();
          const paymentToken = keyData.token;

          if (paymentToken) {
            const iframeId = config.iframeId || '1084110';
            const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${iframeId}?payment_token=${paymentToken}`;

            return {
              success: true,
              paymentUrl: iframeUrl,
              iframeUrl,
              token: paymentToken,
              paymobOrderId,
            };
          }
        }
      } catch (err: any) {
        console.error('Paymob Classic direct API error:', err);
      }
    }

    // 3. Fallback: Unified Checkout API if Secret Key is set
    if (config.secretKey && config.publicKey) {
      try {
        const intentionRes = await fetch('https://accept.paymob.com/v1/intention/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${config.secretKey}`,
          },
          body: JSON.stringify({
            amount: amountCents,
            currency: 'EGP',
            payment_methods: config.cardIntegrationId ? [Number(config.cardIntegrationId)] : ['card'],
            items: params.items?.map(it => ({
              name: it.name,
              amount: Math.round(it.unit_price * 100),
              quantity: it.quantity,
            })) || [],
            billing_data: {
              first_name: params.customerName.split(' ')[0] || 'Customer',
              last_name: params.customerName.split(' ').slice(1).join(' ') || 'toomakt',
              phone_number: (params.customerPhone || '01000000000').replace(/\s+/g, ''),
              email: params.customerEmail || 'orders@toomakt.com',
              street: params.shippingAddress || 'Street',
              building: params.buildingNumber || '1',
              floor: params.apartmentFloor || '1',
              apartment: params.apartmentFloor || '1',
              city: params.shippingCity || params.governorate || 'Cairo',
              country: 'EG',
            },
            special_reference: params.orderNumber,
          }),
        });

        if (intentionRes.ok) {
          const intentionData = await intentionRes.json();
          const clientSecret = intentionData.client_secret;
          const unifiedUrl = `https://accept.paymob.com/unifiedcheckout/?publicKey=${config.publicKey}&clientSecret=${clientSecret}`;
          return {
            success: true,
            paymentUrl: unifiedUrl,
            iframeUrl: unifiedUrl,
            token: clientSecret,
            paymobOrderId: intentionData.intention_order?.id || intentionData.id,
          };
        }
      } catch (err: any) {
        console.error('Paymob Intention API error:', err);
      }
    }

    // Never auto-success! Return error if Paymob connection failed.
    return {
      success: false,
      message: 'Unable to connect to Paymob Visa gateway. Please try again or choose Cash on Delivery.',
    };
  }

  /**
   * Verifies the status of a Paymob payment before finalizing an order.
   * Ensures Order Success is NEVER shown unless payment is genuinely approved.
   */
  public static async verifyPayment(params: {
    paymobOrderId?: number | string;
    orderNumber?: string;
    transactionId?: number | string;
  }): Promise<PaymobVerifyResult> {
    // 1. Try serverless verification endpoint first (/api/paymob-verify)
    try {
      const response = await fetch('/api/paymob-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch {
      // Backend route unreachable -> proceed to direct check
    }

    const config = this.getConfig();

    // 2. Direct client verification with Paymob API if API Key is available
    if (config.apiKey) {
      try {
        const authRes = await fetch('https://accept.paymob.com/api/auth/tokens', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ api_key: config.apiKey }),
        });
        const authData = await authRes.json();
        const token = authData.token;

        if (token) {
          // Check by transactionId
          if (params.transactionId) {
            const txRes = await fetch(`https://accept.paymob.com/api/acceptance/transactions/${params.transactionId}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (txRes.ok) {
              const tx = await txRes.json();
              const isPaid = tx.success === true && !tx.is_voided && !tx.is_refunded;
              return {
                success: true,
                isPaid,
                status: isPaid ? 'PAID' : (tx.data?.message || 'DECLINED'),
                orderNumber: tx.order?.merchant_order_id,
                paidAmountCents: tx.amount_cents,
                transactionId: tx.id,
                isDeclined: !isPaid,
                message: isPaid ? 'Payment verified successfully.' : 'Payment declined.',
              };
            }
          }

          // Check by paymobOrderId
          if (params.paymobOrderId) {
            const orderRes = await fetch(`https://accept.paymob.com/api/ecommerce/orders/${params.paymobOrderId}`, {
              headers: { 'Authorization': `Bearer ${token}` },
            });
            if (orderRes.ok) {
              const orderData = await orderRes.json();
              const isPaid = (orderData.paid_amount_cents && Number(orderData.paid_amount_cents) > 0) || orderData.payment_status === 'PAID';
              return {
                success: true,
                isPaid,
                status: orderData.payment_status,
                orderNumber: orderData.merchant_order_id,
                paidAmountCents: orderData.paid_amount_cents,
                isDeclined: !isPaid && orderData.payment_status !== 'UNPAID',
                message: isPaid ? 'Payment verified successfully.' : 'Payment is pending or unpaid.',
              };
            }
          }
        }
      } catch (err: any) {
        console.error('Direct Paymob verification error:', err);
      }
    }

    return {
      success: false,
      isPaid: false,
      status: 'UNVERIFIED',
      message: 'Could not verify payment status with Paymob gateway.',
    };
  }
}
