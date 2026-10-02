import os
import urllib.parse
import logging
from decimal import Decimal

logger = logging.getLogger(__name__)

class WhatsAppService:
    """
    Dedicated, production-ready WhatsApp Service for toomakt Confectionery.
    Manages client communication, order invoices, payment confirmations, and fulfillment notifications.
    Supports modular providers (wa.me direct URL, WhatsApp Business Cloud API, or webhook).
    """

    @classmethod
    def get_whatsapp_config(cls):
        from .models import GlobalSetting
        setting = GlobalSetting.objects.filter(key='whatsapp_settings').first()
        config = {
            'phone': os.getenv('WHATSAPP_PHONE', '201000000000'),
            'business_name': os.getenv('WHATSAPP_BUSINESS_NAME', 'toomakt Atelier'),
            'api_token': os.getenv('WHATSAPP_API_TOKEN', ''),
            'api_url': os.getenv('WHATSAPP_API_URL', ''),
            'auto_invoice_on_preparing': True,
        }
        if setting and isinstance(setting.value, dict):
            config.update(setting.value)
        return config

    @classmethod
    def get_instapay_config(cls):
        from .models import GlobalSetting
        setting = GlobalSetting.objects.filter(key='instapay_settings').first()
        defaults = {
            'address': os.getenv('INSTAPAY_ADDRESS', 'toomakt@instapay'),
            'account_name': os.getenv('INSTAPAY_ACCOUNT_NAME', 'toomakt Confectionery'),
            'phone': os.getenv('INSTAPAY_PHONE', '01000000000'),
            'bank_name': os.getenv('INSTAPAY_BANK_NAME', 'CIB Egypt'),
            'instructions': 'Transfer the exact order total via the InstaPay mobile app, then send a screenshot of the transaction receipt.'
        }
        if setting and isinstance(setting.value, dict):
            defaults.update(setting.value)
        return defaults

    @classmethod
    def format_phone(cls, phone: str) -> str:
        if not phone:
            return ''
        cleaned = ''.join(c for c in phone if c.isdigit())
        if cleaned.startswith('01') and len(cleaned) == 11:
            cleaned = '20' + cleaned[1:]
        elif cleaned.startswith('0020'):
            cleaned = cleaned[2:]
        elif cleaned.startswith('20'):
            pass
        return cleaned

    @classmethod
    def generate_whatsapp_url(cls, phone: str, message: str) -> str:
        clean_phone = cls.format_phone(phone)
        encoded_message = urllib.parse.quote(message)
        if clean_phone:
            return f"https://wa.me/{clean_phone}?text={encoded_message}"
        return f"https://wa.me/?text={encoded_message}"

    # 1. Order Created Notification
    @classmethod
    def get_order_created_message(cls, order) -> str:
        items_summary = []
        if hasattr(order, 'items'):
            for item in order.items.all():
                items_summary.append(f"• {item.name} × {item.quantity} pack(s) - {float(item.total_price):.2f} EGP")
        items_text = "\n".join(items_summary) if items_summary else "• Handcrafted Toffee Confections"

        return (
            f"🍬 *toomakt Atelier — Order Received*\n"
            f"━━━━━━━━━━━━━━━━━━\n"
            f"Dear *{order.customer_name}*,\n"
            f"We have received your order *#{order.order_number}*.\n\n"
            f"📦 *Ordered Items:*\n{items_text}\n\n"
            f"💰 *Subtotal:* {float(order.subtotal):.2f} EGP\n"
            f"🚚 *Shipping ({order.governorate}):* {float(order.shipping_fee):.2f} EGP\n"
            f"🏷️ *Discount:* -{float(order.discount_amount):.2f} EGP\n"
            f"💳 *Final Total:* {float(order.total_amount):.2f} EGP\n"
            f"📌 *Payment Method:* {order.get_payment_method_display() if hasattr(order, 'get_payment_method_display') else order.payment_method}\n\n"
            f"📍 *Shipping To:* {order.shipping_address}, {order.governorate}\n"
            f"Thank you for choosing toomakt!"
        )

    # 2. Payment Instructions (InstaPay / Bank Transfer)
    @classmethod
    def get_payment_instructions_message(cls, order, instapay_info=None) -> str:
        if not instapay_info:
            instapay_info = cls.get_instapay_config()

        return (
            f"💳 *toomakt — InstaPay Transfer Instructions*\n"
            f"━━━━━━━━━━━━━━━━━━\n"
            f"Order Reference: *#{order.order_number}*\n"
            f"Customer: *{order.customer_name}*\n"
            f"Total Payable: *{float(order.total_amount):.2f} EGP*\n\n"
            f"Please complete your transfer to our official account:\n"
            f"🔹 *InstaPay Address:* `{instapay_info.get('address', 'toomakt@instapay')}`\n"
            f"🔹 *Mobile Number:* `{instapay_info.get('phone', '01000000000')}`\n"
            f"🔹 *Account Name:* {instapay_info.get('account_name', 'toomakt Confectionery')}\n"
            f"🔹 *Bank:* {instapay_info.get('bank_name', 'CIB Egypt')}\n\n"
            f"⚠️ *Important Next Step:*\n"
            f"Once you complete the transfer, reply with:\n"
            f"1. A clear *screenshot of your transfer receipt*\n"
            f"2. Your Order Reference: *{order.order_number}*\n\n"
            f"Our atelier team will verify your payment and start crafting your confections immediately!"
        )

    # 3. Payment Confirmation Submitted Message
    @classmethod
    def get_payment_confirmation_message(cls, order, confirmation=None) -> str:
        ref_text = f"\nTransfer Ref: {confirmation.transfer_reference}" if confirmation and confirmation.transfer_reference else ""
        return (
            f"✅ *toomakt — Payment Proof Received*\n"
            f"━━━━━━━━━━━━━━━━━━\n"
            f"Order: *#{order.order_number}*\n"
            f"Customer: *{order.customer_name}*\n"
            f"Amount Submitted: *{float(confirmation.transfer_amount if confirmation else order.total_amount):.2f} EGP*{ref_text}\n\n"
            f"Your payment screenshot has been submitted.\n"
            f"Your order is now *waiting for admin verification*.\n"
            f"You will receive an update as soon as the atelier team approves the transaction."
        )

    # 4. Payment Approved Notification
    @classmethod
    def get_payment_approved_message(cls, order) -> str:
        return (
            f"🎉 *toomakt — Payment Verified & Approved!*\n"
            f"━━━━━━━━━━━━━━━━━━\n"
            f"Order: *#{order.order_number}*\n"
            f"Customer: *{order.customer_name}*\n"
            f"Amount Paid: *{float(order.total_amount):.2f} EGP*\n\n"
            f"Your payment has been successfully verified by our atelier management.\n"
            f"Your order is now moving into preparation.\n"
            f"We will notify you with the final preparation invoice shortly!"
        )

    # 5. Payment Rejected Notification
    @classmethod
    def get_payment_rejected_message(cls, order, reason: str = "") -> str:
        reason_text = f"\n*Reason:* {reason}" if reason else ""
        instapay_info = cls.get_instapay_config()
        return (
            f"⚠️ *toomakt — Payment Verification Notice*\n"
            f"━━━━━━━━━━━━━━━━━━\n"
            f"Order Reference: *#{order.order_number}*\n"
            f"Customer: *{order.customer_name}*{reason_text}\n\n"
            f"We were unable to verify your recent transfer screenshot.\n"
            f"Your order has NOT been cancelled and is waiting for a valid transfer proof.\n\n"
            f"Please verify your payment of *{float(order.total_amount):.2f} EGP* to:\n"
            f"InstaPay: `{instapay_info.get('address', 'toomakt@instapay')}` / Phone: `{instapay_info.get('phone', '01000000000')}`\n"
            f"and send us an updated screenshot."
        )

    # 6. Order Preparing & Final Mobile-Friendly Invoice
    @classmethod
    def get_order_preparing_message(cls, order) -> str:
        items_summary = []
        if hasattr(order, 'items'):
            for item in order.items.all():
                items_summary.append(f"• {item.name} × {item.quantity} pack(s) ({float(item.unit_price):.2f} EGP ea.) = {float(item.total_price):.2f} EGP")
        items_text = "\n".join(items_summary) if items_summary else "• Handcrafted Toffee"

        return (
            f"👩‍🍳 *toomakt Atelier — Order Now In Preparation*\n"
            f"━━━━━━━━━━━━━━━━━━━━━━━━━\n"
            f"🏛️ *toomakt Fruit-Marbled Toffee Atelier*\n"
            f"Cairo & Alexandria, Egypt\n"
            f"Invoice No: *INV-{order.order_number}*\n"
            f"Order Reference: *{order.order_number}*\n"
            f"Date: {order.created_at.strftime('%Y-%m-%d %H:%M') if hasattr(order, 'created_at') and order.created_at else 'Today'}\n\n"
            f"👤 *Client:* {order.customer_name} ({order.customer_phone or 'N/A'})\n"
            f"📍 *Delivery Destination:* {order.shipping_address}, {order.governorate}\n\n"
            f"📋 *Confectionery Items:*\n{items_text}\n\n"
            f"─────────────────────────\n"
            f"Subtotal: {float(order.subtotal):.2f} EGP\n"
            f"Discount: -{float(order.discount_amount):.2f} EGP\n"
            f"Courier Shipping ({order.governorate}): {float(order.shipping_fee):.2f} EGP\n"
            f"⭐️ *FINAL TOTAL:* {float(order.total_amount):.2f} EGP\n"
            f"Payment Status: *PAID (InstaPay / Verified)*\n"
            f"Order Status: *PREPARING IN ATELIER*\n"
            f"─────────────────────────\n"
            f"Your order is currently being freshly pulled, cut, and packed in an insulated thermal box.\n"
            f"We will send your courier tracking number once dispatched!"
        )

    # 7. Order Shipped Notification
    @classmethod
    def get_order_shipped_message(cls, order, tracking_number: str = "") -> str:
        track_text = f"\nTracking Number: *{tracking_number or order.tracking_number}*" if (tracking_number or getattr(order, 'tracking_number', '')) else ""
        return (
            f"🚚 *toomakt — Order Dispatched & On the Way!*\n"
            f"━━━━━━━━━━━━━━━━━━\n"
            f"Order: *#{order.order_number}*\n"
            f"Customer: *{order.customer_name}*{track_text}\n"
            f"Courier Service: Express Cold-Chain Delivery ({order.governorate})\n\n"
            f"Your handcrafted toffee has left our atelier and is on its way to:\n"
            f"{order.shipping_address}\n\n"
            f"Expected arrival within 1–2 business days. Enjoy every bite!"
        )

    # 8. Order Delivered Notification
    @classmethod
    def get_order_delivered_message(cls, order) -> str:
        return (
            f"🎉 *toomakt — Order Delivered!*\n"
            f"━━━━━━━━━━━━━━━━━━\n"
            f"Order: *#{order.order_number}*\n"
            f"Customer: *{order.customer_name}*\n\n"
            f"Your toomakt confectionery package has been successfully delivered!\n"
            f"We hope you delight in our orchard-fruit soft toffee.\n"
            f"Share your review or tag us on Instagram @toomakt!"
        )

    # 9. Order Cancelled Notification
    @classmethod
    def get_order_cancelled_message(cls, order, reason: str = "") -> str:
        reason_text = f"\n*Reason:* {reason}" if reason else ""
        return (
            f"❌ *toomakt — Order Cancelled*\n"
            f"━━━━━━━━━━━━━━━━━━\n"
            f"Order: *#{order.order_number}*\n"
            f"Customer: *{order.customer_name}*{reason_text}\n\n"
            f"Your order has been cancelled. If this was a mistake or you require assistance, please reply to this message directly."
        )

    @classmethod
    def send_notification(cls, event: str, order, extra_data: dict = None) -> dict:
        """
        Dispatches the appropriate message for the event.
        Returns a dict containing message, whatsapp_url, and status.
        """
        extra_data = extra_data or {}
        message = ""
        if event == 'order_created':
            message = cls.get_order_created_message(order)
        elif event == 'payment_instructions':
            message = cls.get_payment_instructions_message(order, extra_data.get('instapay_info'))
        elif event == 'payment_confirmation':
            message = cls.get_payment_confirmation_message(order, extra_data.get('confirmation'))
        elif event == 'payment_approved':
            message = cls.get_payment_approved_message(order)
        elif event == 'payment_rejected':
            message = cls.get_payment_rejected_message(order, extra_data.get('reason', ''))
        elif event == 'order_preparing':
            message = cls.get_order_preparing_message(order)
        elif event == 'order_shipped':
            message = cls.get_order_shipped_message(order, extra_data.get('tracking_number', ''))
        elif event == 'order_delivered':
            message = cls.get_order_delivered_message(order)
        elif event == 'order_cancelled':
            message = cls.get_order_cancelled_message(order, extra_data.get('reason', ''))
        else:
            message = f"toomakt update for Order #{order.order_number}."

        target_phone = order.customer_phone or cls.get_whatsapp_config().get('phone', '')
        url = cls.generate_whatsapp_url(target_phone, message)

        return {
            'event': event,
            'message': message,
            'whatsapp_url': url,
            'target_phone': target_phone,
            'success': True
        }
