import os
import logging
from django.core.mail import EmailMultiAlternatives
from django.conf import settings

logger = logging.getLogger(__name__)

def send_order_confirmation(order, pdf_bytes=None):
    """
    Sends responsive HTML confirmation email to the customer with attached PDF invoice,
    and also sends notification email to the admin/store owner.
    """
    admin_email = os.getenv('ADMIN_ORDER_EMAIL') or getattr(settings, 'ADMIN_ORDER_EMAIL', 'admin@toomakt.com')
    from_email = os.getenv('DEFAULT_FROM_EMAIL') or getattr(settings, 'DEFAULT_FROM_EMAIL', 'bonjour@toomakt.com')

    # Format item lines
    item_rows = ""
    items = order.items.all() if hasattr(order, 'items') else []
    for item in items:
        p_name = getattr(item, 'product_name_snapshot', '') or item.name
        pieces = getattr(item, 'pieces_per_pack_snapshot', 20)
        item_rows += f"""
        <tr>
            <td style="padding: 10px 12px; border-bottom: 1px solid #F0E6D8; color: #2B170E;"><strong>{p_name}</strong></td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #F0E6D8; text-align: center; color: #555;">{item.quantity} Pack(s)</td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #F0E6D8; text-align: center; color: #555;">{pieces} Pieces/Pack</td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #F0E6D8; text-align: right; color: #2B170E;">{float(item.unit_price):.2f} EGP</td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #F0E6D8; text-align: right; font-weight: bold; color: #994709;">{float(item.total_price):.2f} EGP</td>
        </tr>
        """

    customer_html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF6F0; margin: 0; padding: 20px; }}
            .container {{ max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1px solid #EADCCB; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }}
            .header {{ background: #994709; color: #FFF7EC; padding: 24px; text-align: center; }}
            .header h1 {{ margin: 0; font-size: 26px; letter-spacing: -0.5px; }}
            .content {{ padding: 24px; }}
            .order-badge {{ display: inline-block; background: #FAF0E4; border: 1px solid #E5C39E; color: #994709; padding: 6px 14px; border-radius: 20px; font-weight: bold; font-size: 14px; margin-bottom: 16px; }}
            .table {{ width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px; }}
            .table th {{ background: #FAF0E4; color: #422C20; padding: 10px 12px; text-align: left; font-size: 12px; text-transform: uppercase; }}
            .summary-table {{ width: 100%; margin-top: 15px; font-size: 14px; }}
            .summary-table td {{ padding: 6px 0; }}
            .footer {{ background: #FDFBF7; padding: 20px; text-align: center; font-size: 12px; color: #8A6D55; border-top: 1px solid #F0E6D8; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>toomakt</h1>
                <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.9;">Artisanal Fruit Flavored Toffee Confections</p>
            </div>
            <div class="content">
                <div class="order-badge">Order Confirmed 🎉 #{order.order_number}</div>
                <h2 style="color: #2B170E; margin-top: 0;">Thank you for your order, {order.customer_name}!</h2>
                <p style="color: #5A4738; font-size: 14px; line-height: 1.5;">
                    Your artisanal toffee confections are being freshly prepared in our atelier. We have attached your official PDF invoice to this email.
                </p>

                <div style="background: #FFF9F2; border-left: 4px solid #C26715; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
                    <p style="margin: 0; font-size: 13px; color: #4A3319;">
                        <strong>Payment Method:</strong> Cash on Delivery (COD)<br/>
                        <strong>Shipping Destination:</strong> {getattr(order, 'governorate', 'Cairo')}, Egypt<br/>
                        <strong>Delivery Address:</strong> {order.shipping_address}<br/>
                        <strong>Estimated Delivery:</strong> 1–3 Business Days
                    </p>
                </div>

                <table class="table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th style="text-align: center;">Packs</th>
                            <th style="text-align: center;">Pieces</th>
                            <th style="text-align: right;">Price</th>
                            <th style="text-align: right;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {item_rows}
                    </tbody>
                </table>

                <table class="summary-table">
                    <tr>
                        <td style="color: #666;">Product Subtotal:</td>
                        <td style="text-align: right; font-weight: bold; color: #2B170E;">{float(order.subtotal):.2f} EGP</td>
                    </tr>
                    <tr>
                        <td style="color: #666;">Shipping ({getattr(order, 'governorate', 'Cairo')}):</td>
                        <td style="text-align: right; font-weight: bold; color: #2B170E;">{float(order.shipping_fee):.2f} EGP</td>
                    </tr>
                    <tr style="border-top: 1px solid #EADCCB; font-size: 16px;">
                        <td style="padding-top: 10px; color: #994709; font-weight: bold;">Total Amount Due (COD):</td>
                        <td style="padding-top: 10px; text-align: right; font-weight: bold; color: #994709;">{float(order.total_amount):.2f} EGP</td>
                    </tr>
                </table>
            </div>
            <div class="footer">
                <p style="margin: 0 0 6px 0;">Need assistance? Contact our team at <a href="mailto:bonjour@toomakt.com" style="color: #C26715;">bonjour@toomakt.com</a></p>
                <p style="margin: 0;">© 2026 toomakt Confectionery Atelier. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """

    # Plaintext fallback
    customer_plain = f"""
    Order Confirmed! Order #{order.order_number}
    Thank you for your order, {order.customer_name}!

    Delivery Address: {order.shipping_address}, {getattr(order, 'governorate', 'Cairo')}, Egypt
    Payment: Cash on Delivery (COD)
    Subtotal: {float(order.subtotal):.2f} EGP
    Shipping: {float(order.shipping_fee):.2f} EGP
    Total Due: {float(order.total_amount):.2f} EGP

    Please find your PDF invoice attached.
    """

    # 1. Send to Customer
    try:
        msg = EmailMultiAlternatives(
            subject=f"Order Confirmed #{order.order_number} — toomakt Fruit Toffee",
            body=customer_plain,
            from_email=from_email,
            to=[order.customer_email]
        )
        msg.attach_alternative(customer_html, "text/html")
        if pdf_bytes:
            msg.attach(f"Invoice-{order.order_number}.pdf", pdf_bytes, "application/pdf")
        msg.send(fail_silently=True)
    except Exception as e:
        logger.warning(f"Could not send customer confirmation email: {e}")

    # 2. Send to Admin / Store Owner
    admin_plain = f"""
    New Customer Order: #{order.order_number}
    Customer: {order.customer_name} ({order.customer_email}, {order.customer_phone})
    Governorate: {getattr(order, 'governorate', 'Cairo')}, Egypt
    Address: {order.shipping_address}
    Total Amount: {float(order.total_amount):.2f} EGP
    Payment: Cash on Delivery
    """
    try:
        admin_msg = EmailMultiAlternatives(
            subject=f"🚨 New Order Placed: #{order.order_number} ({float(order.total_amount):.2f} EGP)",
            body=admin_plain,
            from_email=from_email,
            to=[admin_email]
        )
        admin_msg.attach_alternative(customer_html, "text/html")
        if pdf_bytes:
            admin_msg.attach(f"Invoice-{order.order_number}.pdf", pdf_bytes, "application/pdf")
        admin_msg.send(fail_silently=True)
    except Exception as e:
        logger.warning(f"Could not send admin notification email: {e}")


def send_wholesale_notification(req):
    """
    Sends email to admin for new wholesale inquiries and confirmation to the client.
    """
    admin_email = os.getenv('ADMIN_ORDER_EMAIL') or 'admin@toomakt.com'
    from_email = os.getenv('DEFAULT_FROM_EMAIL') or 'bonjour@toomakt.com'

    admin_subject = f"📦 New Wholesale Quote Request from {req.company_name} ({req.requested_quantity} packs)"
    admin_body = f"""
    New Wholesale Inquiry Received:
    
    Company: {req.company_name}
    Contact: {req.name}
    Email: {req.email}
    Phone: {req.phone}
    WhatsApp: {req.whatsapp or 'N/A'}
    Governorate: {req.governorate}, {req.city}
    Business Type: {req.business_type}
    Requested Quantity: {req.requested_quantity} packs
    Monthly Quantity: {req.monthly_quantity or 'N/A'}
    Products: {req.products_interested or 'All Flavors'}
    
    Message:
    {req.message}
    """

    client_subject = "We received your wholesale quote request — toomakt Confectionery"
    client_body = f"""
    Dear {req.name},
    
    Thank you for your interest in ordering toomakt Fruit Flavored Toffee in bulk for {req.company_name}!
    
    Our wholesale corporate team has received your inquiry for {req.requested_quantity} packs.
    We are reviewing your request and will contact you shortly via phone or WhatsApp ({req.phone}) with customized tier pricing.
    
    Warm regards,
    The toomakt B2B Atelier Team
    """

    try:
        msg1 = EmailMultiAlternatives(subject=admin_subject, body=admin_body, from_email=from_email, to=[admin_email])
        msg1.send(fail_silently=True)
    except Exception as e:
        logger.warning(f"Failed to send wholesale admin email: {e}")

    try:
        msg2 = EmailMultiAlternatives(subject=client_subject, body=client_body, from_email=from_email, to=[req.email])
        msg2.send(fail_silently=True)
    except Exception as e:
        logger.warning(f"Failed to send wholesale customer email: {e}")
