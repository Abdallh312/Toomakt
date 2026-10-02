import os
import logging
from dotenv import load_dotenv

logger = logging.getLogger(__name__)

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

_supabase_client = None

def get_supabase_client():
    global _supabase_client
    if _supabase_client is not None:
        return _supabase_client

    url = os.getenv('SUPABASE_URL')
    key = os.getenv('SUPABASE_SECRET_KEY') or os.getenv('SUPABASE_PUBLISHABLE_KEY')

    if not url or not key:
        return None

    try:
        from supabase import create_client
        _supabase_client = create_client(url, key)
        return _supabase_client
    except Exception as e:
        logger.error(f"Failed to initialize Supabase client: {e}")
        return None


def sync_order_to_supabase(order, items=None):
    """
    Mirror or update an order in Supabase toomakt_orders and toomakt_order_items.
    """
    client = get_supabase_client()
    if not client:
        return False

    try:
        # Check if order already exists in Supabase
        existing = client.table('toomakt_orders').select('id').eq('order_number', order.order_number).execute()
        sup_order_id = existing.data[0]['id'] if existing.data and len(existing.data) > 0 else None

        order_payload = {
            'order_number': order.order_number,
            'customer_name': order.customer_name,
            'customer_email': order.customer_email,
            'customer_phone': order.customer_phone or '',
            'shipping_address': f"{order.shipping_address}, {getattr(order, 'governorate', 'Cairo')}",
            'subtotal': float(order.subtotal),
            'discount_amount': float(order.discount_amount),
            'shipping_fee': float(order.shipping_fee),
            'total_amount': float(order.total_amount),
            'promo_code': order.promo_code,
            'status': order.status if order.status in ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] else 'pending',
        }

        # Attempt to include new columns if schema supports them
        try:
            extra_fields = {
                'payment_method': getattr(order, 'payment_method', 'instapay'),
                'payment_status': getattr(order, 'payment_status', 'pending'),
                'payment_proof_url': getattr(order, 'payment_proof_url', ''),
                'governorate': getattr(order, 'governorate', 'Cairo'),
            }
            order_payload.update(extra_fields)
        except Exception:
            pass

        if sup_order_id:
            client.table('toomakt_orders').update(order_payload).eq('id', sup_order_id).execute()
        else:
            res = client.table('toomakt_orders').insert(order_payload).execute()
            if res.data and len(res.data) > 0:
                sup_order_id = res.data[0].get('id')

        if sup_order_id and items:
            items_payload = []
            for it in items:
                items_payload.append({
                    'order_id': sup_order_id,
                    'item_id': str(it.get('item_id')),
                    'item_type': it.get('item_type', 'product'),
                    'name': it.get('name'),
                    'unit_price': float(it.get('unit_price')),
                    'quantity': it.get('quantity', 1),
                    'total_price': float(it.get('total_price'))
                })
            # Insert order items (ignoring errors if already exist)
            try:
                client.table('toomakt_order_items').insert(items_payload).execute()
            except Exception:
                pass

        return True
    except Exception as e:
        logger.warning(f"Supabase order sync warning: {e}")
        return False


def sync_payment_confirmation_to_supabase(confirmation):
    """
    Mirror a payment confirmation to Supabase toomakt_payment_confirmations.
    """
    client = get_supabase_client()
    if not client:
        return False

    try:
        payload = {
            'order_number': confirmation.order_number,
            'customer_name': confirmation.customer_name,
            'customer_phone': confirmation.customer_phone or '',
            'order_total': float(confirmation.order_total),
            'shipping_fee': float(confirmation.shipping_fee),
            'payment_method': confirmation.payment_method,
            'transfer_amount': float(confirmation.transfer_amount),
            'transfer_reference': confirmation.transfer_reference or '',
            'payment_screenshot': confirmation.payment_screenshot or '',
            'payment_status': confirmation.payment_status,
            'verification_status': confirmation.verification_status,
            'admin_reviewer': confirmation.admin_reviewer or '',
            'admin_notes': confirmation.admin_notes or '',
            'rejection_reason': confirmation.rejection_reason or '',
        }
        client.table('toomakt_payment_confirmations').insert(payload).execute()
        return True
    except Exception as e:
        logger.warning(f"Supabase payment confirmation sync warning: {e}")
        return False


def sync_notification_to_supabase(notification):
    """
    Mirror an admin notification to Supabase toomakt_notifications for real-time alerts.
    """
    client = get_supabase_client()
    if not client:
        return False

    try:
        payload = {
            'notification_type': notification.notification_type,
            'title': notification.title,
            'message': notification.message,
            'related_order_id': str(notification.related_order_id or ''),
            'related_order_number': str(notification.related_order_number or ''),
            'related_product_id': str(notification.related_product_id or ''),
            'priority': notification.priority,
            'is_read': notification.is_read,
        }
        client.table('toomakt_notifications').insert(payload).execute()
        return True
    except Exception as e:
        logger.warning(f"Supabase notification sync warning: {e}")
        return False
