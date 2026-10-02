// toomakt Frontend WhatsApp Service — Modular Customer Communication & Invoice Dispatch

export interface WhatsAppConfig {
  phone: string;
  businessName: string;
}

export interface InstaPayInfo {
  address: string;
  accountName: string;
  phone: string;
  bankName: string;
  instructions?: string;
}

export const WhatsAppService = {
  defaultConfig: {
    phone: '201000000000',
    businessName: 'toomakt Atelier',
  },

  defaultInstaPay: {
    address: 'toomakt@instapay',
    accountName: 'toomakt Confectionery',
    phone: '01000000000',
    bankName: 'CIB Egypt',
    instructions: 'Transfer the exact order total via the InstaPay mobile app, then send a screenshot of the transaction receipt.'
  },

  formatPhone(phone: string): string {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('01') && cleaned.length === 11) {
      return '20' + cleaned.slice(1);
    }
    if (cleaned.startsWith('0020')) {
      return cleaned.slice(2);
    }
    return cleaned;
  },

  generateWhatsAppUrl(phone: string, message: string): string {
    const cleanPhone = this.formatPhone(phone);
    const encoded = encodeURIComponent(message);
    if (cleanPhone) {
      return `https://wa.me/${cleanPhone}?text=${encoded}`;
    }
    return `https://wa.me/?text=${encoded}`;
  },

  // 1. Order Created Message
  getOrderCreatedMessage(order: any): string {
    const items = order.items || [];
    const itemsSummary = items.map((it: any) =>
      `- ${it.product_name_snapshot || it.name} x ${it.quantity} pack(s) - ${Number(it.total_price || (it.unit_price * it.quantity)).toFixed(2)} EGP`
    ).join('\n');

    return `*toomakt Atelier — Order Received*
----------------------------------
Dear *${order.customer_name}*,
We have received your order *#${order.order_number}*.

*Ordered Items:*
${itemsSummary || '- Handcrafted Toffee Confections'}

*Subtotal:* ${Number(order.subtotal).toFixed(2)} EGP
*Shipping (${order.governorate || 'Cairo'}):* ${Number(order.shipping_fee).toFixed(2)} EGP
*Discount:* -${Number(order.discount_amount || 0).toFixed(2)} EGP
*Final Total:* ${Number(order.total_amount).toFixed(2)} EGP
*Payment Method:* ${order.payment_method === 'instapay' ? 'InstaPay / Bank Transfer' : (order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment')}

*Shipping To:* ${order.shipping_address}, ${order.governorate || 'Egypt'}
Thank you for choosing toomakt!`;
  },

  // 2. InstaPay Instructions Message
  getPaymentInstructionsMessage(order: any, instapayInfo?: Partial<InstaPayInfo>): string {
    const info = { ...this.defaultInstaPay, ...instapayInfo };
    return `*toomakt — InstaPay Transfer Instructions*
----------------------------------
Order Reference: *#${order.order_number}*
Customer: *${order.customer_name}*
Total Payable: *${Number(order.total_amount).toFixed(2)} EGP*

Please complete your transfer to our official account:
- *InstaPay Address:* \`${info.address}\`
- *Mobile Number:* \`${info.phone}\`
- *Account Name:* ${info.accountName}
- *Bank:* ${info.bankName}

*Important Next Step:*
Once you complete the transfer, reply here with:
1. A clear screenshot of your transfer receipt
2. Your Order Reference: *${order.order_number}*

Our atelier team will verify your payment and start crafting your confections immediately!`;
  },

  // 3. Payment Confirmation Received
  getPaymentConfirmationMessage(order: any, transferRef?: string, amount?: number): string {
    const refText = transferRef ? `\nTransfer Reference: ${transferRef}` : '';
    return `*toomakt — Payment Proof Received*
----------------------------------
Order: *#${order.order_number}*
Customer: *${order.customer_name}*
Amount Submitted: *${Number(amount || order.total_amount).toFixed(2)} EGP*${refText}

Your payment screenshot has been submitted.
Your order is now waiting for admin verification.
You will receive an update as soon as the atelier team approves the transaction.`;
  },

  getWhatsAppChatUrl(phone: string, message: string): string {
    return this.generateWhatsAppUrl(phone, message);
  },

  // 4. Payment Approved Notification
  getPaymentApprovedMessage(orderOrNumber: any, customerName?: string): string {
    const orderNumber = typeof orderOrNumber === 'object' ? orderOrNumber.order_number : orderOrNumber;
    const name = typeof orderOrNumber === 'object' ? orderOrNumber.customer_name : (customerName || 'Valued Customer');
    const amount = typeof orderOrNumber === 'object' && orderOrNumber.total_amount ? `\nAmount Paid: *${Number(orderOrNumber.total_amount).toFixed(2)} EGP*` : '';
    return `*toomakt — Payment Verified & Approved*
----------------------------------
Order: *#${orderNumber}*
Customer: *${name}*${amount}

Your payment has been successfully verified by our atelier management.
Your order is now moving into preparation.
We will notify you with the final preparation invoice shortly!`;
  },

  // 5. Payment Rejected Notification
  getPaymentRejectedMessage(orderOrNumber: any, reason?: string, customerNameOrInfo?: string | Partial<InstaPayInfo>): string {
    const orderNumber = typeof orderOrNumber === 'object' ? orderOrNumber.order_number : orderOrNumber;
    const name = typeof orderOrNumber === 'object' ? orderOrNumber.customer_name : (typeof customerNameOrInfo === 'string' ? customerNameOrInfo : 'Valued Customer');
    const info = typeof customerNameOrInfo === 'object' ? { ...this.defaultInstaPay, ...customerNameOrInfo } : this.defaultInstaPay;
    const reasonText = reason ? `\n*Reason:* ${reason}` : '';
    return `*toomakt — Payment Verification Notice*
----------------------------------
Order Reference: *#${orderNumber}*
Customer: *${name}*${reasonText}

We were unable to verify your recent transfer screenshot.
Your order has NOT been cancelled and is waiting for a valid transfer proof.

Please verify your payment to:
InstaPay: \`${info.address}\` / Phone: \`${info.phone}\`
and send us an updated screenshot.`;
  },

  // 6. Final Order Preparing Invoice
  getOrderPreparingMessage(order: any): string {
    const items = order.items || [];
    const itemsSummary = items.map((it: any) =>
      `- ${it.product_name_snapshot || it.name} x ${it.quantity} pack(s) (${Number(it.unit_price).toFixed(2)} EGP ea.) = ${Number(it.total_price || (it.unit_price * it.quantity)).toFixed(2)} EGP`
    ).join('\n');

    return `*toomakt Atelier — Order In Preparation*
-----------------------------------------
toomakt Fruit-Marbled Toffee Atelier
Cairo & Alexandria, Egypt
Invoice No: *INV-${order.order_number}*
Order Reference: *${order.order_number}*
Date: ${order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Today'}

Client: ${order.customer_name} (${order.customer_phone || 'N/A'})
Delivery Destination: ${order.shipping_address}, ${order.governorate || 'Cairo'}

Confectionery Items:
${itemsSummary || '- Handcrafted Toffee'}

-----------------------------------------
Subtotal: ${Number(order.subtotal).toFixed(2)} EGP
Discount: -${Number(order.discount_amount || 0).toFixed(2)} EGP
Courier Shipping (${order.governorate || 'Cairo'}): ${Number(order.shipping_fee || 50).toFixed(2)} EGP
FINAL TOTAL: ${Number(order.total_amount).toFixed(2)} EGP
Payment Status: PAID (InstaPay / Verified)
Order Status: PREPARING IN ATELIER
-----------------------------------------
Your order is currently being freshly pulled, cut, and packed in an insulated thermal box.
We will send your courier tracking number once dispatched!`;
  },

  // 7. Order Shipped Notification
  getOrderShippedMessage(order: any, trackingNumber?: string): string {
    const trackText = (trackingNumber || order.tracking_number)
      ? `\nTracking Number: *${trackingNumber || order.tracking_number}*`
      : '';
    return `*toomakt — Order Dispatched & On the Way*
----------------------------------
Order: *#${order.order_number}*
Customer: *${order.customer_name}*${trackText}
Courier Service: Express Cold-Chain Delivery (${order.governorate || 'Egypt'})

Your handcrafted toffee has left our atelier and is on its way to:
${order.shipping_address}

Expected arrival within 1-2 business days. Enjoy every bite!`;
  },

  // 8. Order Delivered Notification
  getOrderDeliveredMessage(order: any): string {
    return `*toomakt — Order Delivered*
----------------------------------
Order: *#${order.order_number}*
Customer: *${order.customer_name}*

Your toomakt confectionery package has been successfully delivered!
We hope you delight in our orchard-fruit soft toffee.
Share your review or tag us on Instagram @toomakt!`;
  },

  // 9. Order Cancelled Notification
  getOrderCancelledMessage(order: any, reason?: string): string {
    const reasonText = reason ? `\n*Reason:* ${reason}` : '';
    return `*toomakt — Order Cancelled*
----------------------------------
Order: *#${order.order_number}*
Customer: *${order.customer_name}*${reasonText}

Your order has been cancelled. If you require assistance, please reply to this message directly.`;
  }
};
