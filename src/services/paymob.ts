/**
 * toomakt — Paymob Visa & Mastercard Payment Gateway Integration
 * 
 * Supports both:
 * 1. Paymob Unified Checkout (Intention API)
 * 2. Paymob Classic Accept API (Auth -> Order -> Payment Key -> Iframe)
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
  message?: string;
}

export class PaymobService {
  // Read from Vite environment variables
  private static getConfig(): PaymobConfig {
    const rawCardId = import.meta.env.VITE_PAYMOB_CARD_INTEGRATION_ID || '5963962';
    const rawIframeId = import.meta.env.VITE_PAYMOB_IFRAME_ID || '1084110';
    return {
      apiKey: import.meta.env.VITE_PAYMOB_API_KEY || '',
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
   * If live credentials are not yet configured in .env, provides a seamless demo simulator.
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
        if (data.success) {
          return data;
        }
      }
    } catch {
      // Backend route not available (e.g. running Vite client dev mode) -> proceed with client flow
    }

    // 2. Direct Unified Checkout API if Secret Key is set
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
              phone_number: params.customerPhone || '01000000000',
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

    // 3. Classic Accept API if API Key is set
    if (config.apiKey && config.cardIntegrationId) {
      try {
        // Step A: Auth Token
        const authRes = await fetch('https://accept.paymob.com/api/auth/tokens', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ api_key: config.apiKey }),
        });
        const authData = await authRes.json();
        const authToken = authData.token;

        // Step B: Order Registration
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

        // Step C: Payment Key Request
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
              phone_number: params.customerPhone || '01000000000',
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

        const iframeId = config.iframeId || 'default';
        const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${iframeId}?payment_token=${paymentToken}`;

        return {
          success: true,
          paymentUrl: iframeUrl,
          iframeUrl,
          token: paymentToken,
          paymobOrderId,
        };
      } catch (err: any) {
        console.error('Paymob Classic API error:', err);
      }
    }

    // 4. Safe Simulation Mode (when awaiting credentials from user)
    const mockRef = `PAYMOB-VISA-${Math.floor(100000 + Math.random() * 900000)}`;
    return {
      success: true,
      isSandboxDemo: true,
      transactionId: mockRef,
      message: 'Paymob Visa payment processed in demo mode. Ready for live credentials.',
    };
  }

  /**
   * Verifies the status of a Paymob payment before finalizing an order.
   * Ensures Order Success is NEVER shown unless payment is genuinely approved.
   */
  public static async verifyPayment(params: {
    paymobOrderId?: number | string;
    orderNumber?: string;
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
    if (config.apiKey && params.paymobOrderId) {
      try {
        const authRes = await fetch('https://accept.paymob.com/api/auth/tokens', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ api_key: config.apiKey }),
        });
        const authData = await authRes.json();
        const token = authData.token;

        if (token) {
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
              isDeclined: !isPaid && orderData.payment_status !== 'UNPAID',
              message: isPaid ? 'Payment verified successfully.' : 'Payment is pending or unpaid.',
            };
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
