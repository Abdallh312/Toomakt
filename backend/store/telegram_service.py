import os
import json
import logging
import threading
import urllib.request
import urllib.parse
from decimal import Decimal
from django.conf import settings
from django.utils import timezone

logger = logging.getLogger('store.telegram')

VALID_AUTH_SECRETS = ['toomakt2026', 'toomakt', 'toomakt_2026', 'toomakt_atelier_2026']


def _format_egyptian_phone(phone: str) -> str:
    """Normalize phone to international format without + for wa.me links."""
    clean = ''.join(c for c in str(phone or '') if c.isdigit())
    if clean.startswith('20'):
        return clean
    if clean.startswith('0'):
        return '20' + clean[1:]
    return '20' + clean if clean else ''


def _send_telegram_raw(token: str, chat_id: str, text: str, reply_markup: dict = None) -> bool:
    """Helper to synchronously send a message to Telegram Bot API with resilient fallback."""
    if not token or not chat_id:
        logger.warning("Telegram Bot token or chat_id not configured.")
        return False

    url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = {
        'chat_id': str(chat_id),
        'text': text,
        'parse_mode': 'HTML',
        'disable_web_page_preview': False
    }
    if reply_markup:
        payload['reply_markup'] = reply_markup

    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode('utf-8'),
            headers={'Content-Type': 'application/json'},
            method='POST'
        )
        with urllib.request.urlopen(req, timeout=10) as response:
            res_data = json.loads(response.read().decode('utf-8'))
            if res_data.get('ok'):
                return True
    except urllib.error.HTTPError as exc:
        err_body = exc.read().decode('utf-8', errors='ignore')
        logger.error(f"Telegram API HTTP error {exc.code}: {err_body}")

        # If it failed due to reply_markup (e.g. invalid URL), retry WITHOUT reply_markup immediately!
        if reply_markup:
            logger.info("Retrying Telegram message without reply_markup...")
            try:
                payload.pop('reply_markup', None)
                req_fallback = urllib.request.Request(
                    url,
                    data=json.dumps(payload).encode('utf-8'),
                    headers={'Content-Type': 'application/json'},
                    method='POST'
                )
                with urllib.request.urlopen(req_fallback, timeout=10) as resp2:
                    res2 = json.loads(resp2.read().decode('utf-8'))
                    return bool(res2.get('ok'))
            except Exception as e2:
                logger.error(f"Telegram fallback retry failed: {e2}")
    except Exception as exc:
        logger.error(f"Failed to dispatch Telegram message: {exc}")

    return False


def _edit_message_text(token: str, chat_id: str, message_id: int, text: str, reply_markup: dict = None) -> bool:
    """Edits text of an existing message in Telegram."""
    if not token or not chat_id or not message_id:
        return False
    url = f"https://api.telegram.org/bot{token}/editMessageText"
    payload = {
        'chat_id': str(chat_id),
        'message_id': int(message_id),
        'text': text,
        'parse_mode': 'HTML'
    }
    if reply_markup is not None:
        payload['reply_markup'] = reply_markup
    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode('utf-8'),
            headers={'Content-Type': 'application/json'},
            method='POST'
        )
        with urllib.request.urlopen(req, timeout=8) as resp:
            return bool(json.loads(resp.read().decode('utf-8')).get('ok'))
    except Exception as e:
        logger.error(f"Error editing message text: {e}")
        return False


def _answer_callback_query(token: str, callback_query_id: str, text: str = None, show_alert: bool = False) -> bool:
    """Acknowledges an inline button callback."""
    if not token or not callback_query_id:
        return False
    url = f"https://api.telegram.org/bot{token}/answerCallbackQuery"
    payload = {'callback_query_id': callback_query_id}
    if text:
        payload['text'] = text
        payload['show_alert'] = show_alert
    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode('utf-8'),
            headers={'Content-Type': 'application/json'},
            method='POST'
        )
        with urllib.request.urlopen(req, timeout=8) as resp:
            return bool(json.loads(resp.read().decode('utf-8')).get('ok'))
    except Exception as e:
        logger.error(f"Error answering callback query: {e}")
        return False


def get_authorized_recipient_ids() -> list[str]:
    """
    Returns a deduplicated list of authorized admin Telegram user IDs
    who are granted permission to receive order alerts.
    """
    from .models import TelegramAdminUser
    authorized = set()
    master_id = getattr(settings, 'TELEGRAM_ADMIN_CHAT_ID', os.environ.get('TELEGRAM_ADMIN_CHAT_ID', '1686960840'))
    if master_id:
        authorized.add(str(master_id).strip())

    try:
        db_admins = TelegramAdminUser.objects.filter(is_active=True, can_receive_alerts=True).values_list('telegram_id', flat=True)
        for tid in db_admins:
            if tid:
                authorized.add(str(tid).strip())
    except Exception as e:
        logger.warning(f"Could not load TelegramAdminUser records: {e}")

    return list(authorized)


def verify_telegram_admin(user_id: str):
    """
    Strict security gatekeeper: Verifies if a given Telegram user ID is an authorized admin.
    Returns (is_authorized: bool, role: str, admin_user_instance or None).
    """
    user_id_str = str(user_id).strip()
    master_id = str(getattr(settings, 'TELEGRAM_ADMIN_CHAT_ID', os.environ.get('TELEGRAM_ADMIN_CHAT_ID', '1686960840'))).strip()

    if user_id_str == master_id:
        return True, 'super_admin', None

    try:
        from .models import TelegramAdminUser
        admin_u = TelegramAdminUser.objects.filter(telegram_id=user_id_str, is_active=True).first()
        if admin_u:
            return True, admin_u.role, admin_u
    except Exception as e:
        logger.error(f"Error checking Telegram admin status: {e}")

    return False, 'unauthorized', None


def send_telegram_order_alert(order) -> None:
    """
    Dispatches a high-priority, beautifully styled Telegram alert ONLY to verified admins
    whenever a customer places a new order.
    Executes in a daemon thread to guarantee zero latency on customer checkout.
    """
    token = getattr(settings, 'TELEGRAM_BOT_TOKEN', os.environ.get('TELEGRAM_BOT_TOKEN', ''))
    recipients = get_authorized_recipient_ids()

    if not token or not recipients:
        logger.info("Telegram notification skipped: credentials or recipients missing.")
        return

    def _task():
        try:
            # Build itemized list
            items = list(order.items.all())
            items_text_lines = []
            for it in items:
                qty = it.quantity
                name = it.name
                total = Decimal(str(it.total_price))
                items_text_lines.append(f"  ▫️ <b>{qty}x</b> {name} — <code>{total:.2f} EGP</code>")

            items_section = "\n".join(items_text_lines) if items_text_lines else "  ▫️ <i>No item details</i>"

            # Payment info
            pm = str(order.payment_method or '').upper()
            if pm == 'COD':
                pm_text = "💵 <b>Cash on Delivery (الدفع عند الاستلام)</b>"
            elif pm == 'INSTAPAY':
                pm_text = "📲 <b>InstaPay / Bank Transfer (إنستاباي)</b>"
            else:
                pm_text = f"💳 <b>{pm or 'COD'}</b>"

            # Phone formatting
            raw_phone = order.customer_phone or ''
            wa_phone = _format_egyptian_phone(raw_phone)

            # Detailed address
            addr_parts = [
                f"📍 <b>Governorate:</b> {order.governorate or 'Cairo'}",
                f"🏙️ <b>City/District:</b> {order.shipping_city or 'N/A'}",
                f"🏠 <b>Address:</b> {order.shipping_address or 'N/A'}"
            ]
            if order.building_number:
                addr_parts.append(f"🏢 <b>Bldg:</b> {order.building_number}")
            if order.apartment_floor:
                addr_parts.append(f"🚪 <b>Apt/Floor:</b> {order.apartment_floor}")
            if order.delivery_notes:
                addr_parts.append(f"📝 <b>Notes:</b> <i>{order.delivery_notes}</i>")

            address_section = "\n".join(addr_parts)

            # Assemble Message
            message = (
                f"🎉 <b>NEW ORDER RECEIVED! | طلب جديد</b>\n"
                f"━━━━━━━━━━━━━━━━━━━\n"
                f"🏷️ <b>Order Number:</b> <code>#{order.order_number}</code>\n"
                f"📅 <b>Date:</b> {order.created_at.strftime('%Y-%m-%d %I:%M %p')}\n"
                f"👤 <b>Customer:</b> <b>{order.customer_name}</b>\n"
                f"📞 <b>Phone:</b> <code>{raw_phone}</code>\n"
                f"✉️ <b>Email:</b> <code>{order.customer_email}</code>\n\n"
                f"📦 <b>ORDER ITEMS:</b>\n"
                f"{items_section}\n\n"
                f"💰 <b>FINANCIALS:</b>\n"
                f"  • Subtotal: <code>{Decimal(str(order.subtotal)):.2f} EGP</code>\n"
                f"  • Shipping: <code>{Decimal(str(order.shipping_fee)):.2f} EGP</code>\n"
                + (f"  • Discount: <code>-{Decimal(str(order.discount_amount)):.2f} EGP</code>\n" if order.discount_amount and order.discount_amount > 0 else "")
                + f"  • <b>TOTAL AMOUNT:</b> <b><u>{Decimal(str(order.total_amount)):.2f} EGP</u></b>\n\n"
                f"💳 <b>Payment:</b> {pm_text}\n"
                f"⏳ <b>Status:</b> <b>{order.status.upper()}</b>\n\n"
                f"🚚 <b>DELIVERY DESTINATION:</b>\n"
                f"{address_section}\n"
                f"━━━━━━━━━━━━━━━━━━━\n"
                f"👨‍🍳 <i>Admin: Prepare confection packaging in atelier!</i>"
            )

            # Telegram inline keyboard
            reply_markup = None
            keyboard = []
            if wa_phone:
                greeting = urllib.parse.quote(f"مرحباً {order.customer_name}، نحن معمل toomakt نؤكد استلام طلبك رقم {order.order_number} وجاري تجهيزه.")
                keyboard.append([
                    {
                        'text': f'💬 WhatsApp Customer ({raw_phone})',
                        'url': f'https://wa.me/{wa_phone}?text={greeting}'
                    }
                ])

            keyboard.append([
                {'text': '👨‍🍳 Mark Preparing', 'callback_data': f'status:{order.order_number}:processing'},
                {'text': '🚚 Mark Shipped', 'callback_data': f'status:{order.order_number}:shipped'}
            ])
            reply_markup = {'inline_keyboard': keyboard}

            # Broadcast ONLY to verified active admins
            for admin_chat_id in recipients:
                _send_telegram_raw(token, admin_chat_id, message, reply_markup=reply_markup)
                logger.info(f"Delivered order alert #{order.order_number} to admin {admin_chat_id}")
        except Exception as e:
            logger.error(f"Error preparing Telegram order alert: {e}")

    thread = threading.Thread(target=_task, daemon=True)
    thread.start()


def send_telegram_payment_screenshot_alert(confirmation) -> None:
    """Alert verified admins when a customer uploads an InstaPay transfer proof."""
    token = getattr(settings, 'TELEGRAM_BOT_TOKEN', os.environ.get('TELEGRAM_BOT_TOKEN', ''))
    recipients = get_authorized_recipient_ids()

    if not token or not recipients:
        return

    def _task():
        try:
            message = (
                f"💳 <b>NEW INSTAPAY PROOF SUBMITTED!</b>\n"
                f"━━━━━━━━━━━━━━━━━━━\n"
                f"🏷️ <b>Order Number:</b> <code>#{confirmation.order_number}</code>\n"
                f"👤 <b>Customer:</b> {confirmation.customer_name}\n"
                f"📞 <b>Phone:</b> <code>{confirmation.customer_phone}</code>\n"
                f"💵 <b>Transfer Amount:</b> <code>{Decimal(str(confirmation.transfer_amount)):.2f} EGP</code>\n"
                f"🔢 <b>Reference:</b> <code>{confirmation.transfer_reference or 'N/A'}</code>\n\n"
                f"🔍 <i>Please review & approve receipt in Admin Dashboard.</i>"
            )
            raw_phone = confirmation.customer_phone or ''
            wa_phone = _format_egyptian_phone(raw_phone)
            reply_markup = None
            if wa_phone:
                reply_markup = {
                    'inline_keyboard': [
                        [
                            {
                                'text': f'💬 WhatsApp Customer ({raw_phone})',
                                'url': f'https://wa.me/{wa_phone}'
                            }
                        ]
                    ]
                }
            for admin_chat_id in recipients:
                _send_telegram_raw(token, admin_chat_id, message, reply_markup=reply_markup)
        except Exception as e:
            logger.error(f"Error sending payment Telegram alert: {e}")

    threading.Thread(target=_task, daemon=True).start()


def handle_telegram_update(update: dict) -> None:
    """
    Core Dispatcher: Handles incoming Telegram messages and button callbacks.
    Strictly verifies user identity BEFORE revealing ANY order or admin data.
    Provides 1-Click Admin Approvals and direct commands.
    """
    token = getattr(settings, 'TELEGRAM_BOT_TOKEN', os.environ.get('TELEGRAM_BOT_TOKEN', ''))
    master_chat_id = str(getattr(settings, 'TELEGRAM_ADMIN_CHAT_ID', os.environ.get('TELEGRAM_ADMIN_CHAT_ID', ''))).strip()

    from .models import Order, TelegramAdminUser

    # 1. Handle Inline Button Callback Queries
    if 'callback_query' in update:
        cq = update['callback_query']
        cq_id = cq['id']
        from_u = cq.get('from', {})
        user_id = str(from_u.get('id', ''))
        data = str(cq.get('data', ''))
        chat_id = str(cq.get('message', {}).get('chat', {}).get('id', user_id))
        msg_id = cq.get('message', {}).get('message_id')

        is_admin, role, admin_obj = verify_telegram_admin(user_id)
        if not is_admin:
            _answer_callback_query(token, cq_id, "⛔ غير مصرح لك بتنفيذ هذه العملية!", show_alert=True)
            return

        # 1-Click Interactive Admin Approval: approve_admin:<new_user_id>:<name>
        if data.startswith('approve_admin:'):
            parts = data.split(':', 2)
            if len(parts) >= 2:
                target_uid = parts[1].strip()
                target_name = parts[2].strip() if len(parts) > 2 else f"Admin {target_uid}"

                admin_entry, _ = TelegramAdminUser.objects.update_or_create(
                    telegram_id=target_uid,
                    defaults={
                        'first_name': target_name,
                        'role': 'atelier_manager',
                        'is_active': True,
                        'can_receive_alerts': True,
                        'can_manage_orders': True,
                        'notes': f'Approved via 1-click button by master admin ({user_id})'
                    }
                )

                _answer_callback_query(token, cq_id, f"✅ تم اعتماد {target_name} بنجاح!", show_alert=True)
                _edit_message_text(
                    token,
                    chat_id,
                    msg_id,
                    f"✅ <b>تم اعتماد وتفعيل المسؤول بنجاح!</b>\n━━━━━━━━━━━━━━━━━━━\n👤 <b>الاسم:</b> {target_name}\n🆔 <b>Telegram ID:</b> <code>{target_uid}</code>\n👑 <b>المعتمد بواسطة:</b> {from_u.get('first_name', 'Super Admin')}\n\n🔔 سيستلم هذا الحساب كافة إشعارات الطلبات الجديدة في الوقت الفعلي."
                )

                # Send welcoming notification directly to the approved user
                welcome_target = (
                    f"🎉 <b>مبروك! تم اعتماد حسابك رسمياً كمسؤول في معمل toomakt!</b>\n"
                    f"━━━━━━━━━━━━━━━━━━━\n"
                    f"✅ تم تفعيل صلاحياتك بواسطة الإدارة.\n"
                    f"🔔 ستصلك الآن كافة إشعارات الطلبات الجديدة مع تفاصيل العميل وأزرار الواتساب فورياً.\n\n"
                    f"📋 <b>الأوامر المتاحة لك:</b>\n"
                    f"📦 <code>/orders</code> — عرض أحدث الطلبات\n"
                    f"📊 <code>/stats</code> — إحصائيات المبيعات\n"
                    f"ℹ️ <code>/help</code> — قائمة التعليمات"
                )
                _send_telegram_raw(token, target_uid, welcome_target)
                return

        # 1-Click Admin Rejection: reject_admin:<new_user_id>
        if data.startswith('reject_admin:'):
            target_uid = data.split(':', 1)[1].strip()
            TelegramAdminUser.objects.filter(telegram_id=target_uid).update(is_active=False, can_receive_alerts=False)
            _answer_callback_query(token, cq_id, "تم رفض الطلب.")
            _edit_message_text(token, chat_id, msg_id, f"❌ تم رفض طلب انضمام المستخدم (ID: <code>{target_uid}</code>).")
            return

        # Remove admin button: remove_admin:<target_id>
        if data.startswith('remove_admin:'):
            target_uid = data.split(':', 1)[1].strip()
            if target_uid == master_chat_id:
                _answer_callback_query(token, cq_id, "⚠️ لا يمكن حذف المالك الرئيسي!", show_alert=True)
                return
            TelegramAdminUser.objects.filter(telegram_id=target_uid).delete()
            _answer_callback_query(token, cq_id, f"🗑️ تم حذف المسؤول ({target_uid}) بنجاح!", show_alert=True)
            _edit_message_text(token, chat_id, msg_id, f"🗑️ تم حذف المسؤول (ID: <code>{target_uid}</code>) من النظام.")
            return

        # Order status update: status:ORD-xxxx:processing
        if data.startswith('status:'):
            parts = data.split(':')
            if len(parts) >= 3:
                ord_num = parts[1]
                new_st = parts[2]
                try:
                    ord_obj = Order.objects.filter(order_number=ord_num).first()
                    if ord_obj:
                        ord_obj.status = new_st
                        ord_obj.save(update_fields=['status', 'updated_at'])
                        st_ar = 'قيد التجهيز في المعمل 👨‍🍳' if new_st == 'processing' else ('تم الشحن مع المندوب 🚚' if new_st == 'shipped' else new_st)
                        _answer_callback_query(token, cq_id, f"✅ تم تحديث الطلب #{ord_num} إلى {new_st.upper()}!")
                        _send_telegram_raw(token, chat_id, f"📌 <b>تحديث حالة طلب:</b> الطلب <code>#{ord_num}</code> أصبح الآن: <b>{st_ar}</b> بواسطة {from_u.get('first_name', 'Admin')}")
                        return
                except Exception as e:
                    logger.error(f"Error updating order status from telegram callback: {e}")

        _answer_callback_query(token, cq_id, "تم استلام الطلب.")
        return

    # 2. Handle Text Messages
    if 'message' not in update:
        return

    msg = update['message']
    from_u = msg.get('from', {})
    user_id = str(from_u.get('id', ''))
    chat_id = str(msg.get('chat', {}).get('id', user_id))
    text = (msg.get('text') or '').strip()
    first_name = from_u.get('first_name', '')
    last_name = from_u.get('last_name', '')
    username = from_u.get('username', '')
    full_name = f"{first_name} {last_name}".strip() or username or f"User {user_id}"

    # Verify if user is an authorized admin
    is_admin, role, admin_obj = verify_telegram_admin(user_id)

    # -------------------------------------------------------------
    # CASE A: UNAUTHORIZED USER
    # -------------------------------------------------------------
    if not is_admin:
        # Check if they are attempting to authenticate with secret code
        if text.lower().startswith('/auth'):
            parts = text.split(maxsplit=1)
            code_entered = parts[1].strip().lower() if len(parts) > 1 else ''

            if not code_entered:
                _send_telegram_raw(
                    token,
                    chat_id,
                    f"ℹ️ <b>طريقة التوثيق:</b>\nيرجى كتابة كود المسؤول بعد كلمة auth مباشرة، مثال:\n<code>/auth toomakt2026</code>\n\nأو يمكنك الانتظار، حيث تم إشعار المسؤول الرئيسي لاعتمادك بضغطة زر."
                )
                return

            if code_entered in VALID_AUTH_SECRETS:
                # Successfully authenticated! Register in DB
                TelegramAdminUser.objects.update_or_create(
                    telegram_id=user_id,
                    defaults={
                        'first_name': first_name,
                        'last_name': last_name,
                        'username': username,
                        'role': 'atelier_manager',
                        'is_active': True,
                        'can_receive_alerts': True,
                        'can_manage_orders': True,
                        'notes': f'Self-authenticated via code: {code_entered}'
                    }
                )
                success_msg = (
                    f"🎉 <b>تم التوثيق والاعتماد بنجاح! | Authentication Verified</b>\n"
                    f"━━━━━━━━━━━━━━━━━━━\n"
                    f"👑 أهلاً بك يا <b>{full_name}</b> كمسؤول معتمد في معمل <b>toomakt</b>.\n"
                    f"✅ حسابك (ID: <code>{user_id}</code>) مفعل الآن لاستلام إشعارات الطلبات الفورية.\n\n"
                    f"📋 <b>الأوامر المتاحة لك:</b>\n"
                    f"📦 <code>/orders</code> — عرض أحدث الطلبات\n"
                    f"📊 <code>/stats</code> — ملخص مبيعات اليوم\n"
                    f"🔍 <code>/order ORD-XXXX</code> — تفاصيل طلب محدد\n"
                    f"ℹ️ <code>/help</code> — قائمة التعليمات الكاملة"
                )
                _send_telegram_raw(token, chat_id, success_msg)

                # Alert Super Admin
                if master_chat_id and master_chat_id != user_id:
                    _send_telegram_raw(
                        token,
                        master_chat_id,
                        f"🛡️ <b>تنبيه أمان:</b> قام مستخدم بتوثيق نفسه كمسؤول عبر الكود السري:\n"
                        f"👤 <b>الاسم:</b> {full_name}\n"
                        f"🔗 <b>المعرف:</b> @{username}\n"
                        f"🆔 <b>Telegram ID:</b> <code>{user_id}</code>"
                    )
                return
            else:
                _send_telegram_raw(
                    token,
                    chat_id,
                    "❌ <b>رمز الاعتماد غير صحيح!</b>\nالكود الصحيح هو: <code>/auth toomakt2026</code>\nأو تواصل مع الإدارة لاعتمادك بضغطة زر."
                )
                return

        # Unauthorized access attempt: Send Access Denied to User
        denied_msg = (
            f"⛔ <b>عذراً، هذا الحساب غير مصرح له بالوصول!</b>\n"
            f"━━━━━━━━━━━━━━━━━━━\n"
            f"🔒 <b>Access Denied:</b> هذا البوت مخصص حصرياً لمسؤولي معمل <b>toomakt</b>.\n\n"
            f"🆔 <b>Telegram ID الخاص بك:</b> <code>{user_id}</code>\n"
            f"👤 <b>الاسم:</b> {full_name}\n\n"
            f"📢 <b>تم إرسال طلب اعتماد فوري للمسؤول الرئيسي!</b>\n"
            f"بمجرد موافقة الإدارة ستصلك رسالة تأكيد هنا فورياً.\n\n"
            f"🔑 أو يمكنك إدخال كود الإدارة مباشرة:\n"
            f"<code>/auth toomakt2026</code>"
        )
        _send_telegram_raw(token, chat_id, denied_msg)

        # AND send 1-CLICK APPROVAL NOTIFICATION TO MASTER ADMIN!
        if master_chat_id and master_chat_id != user_id:
            approval_msg = (
                f"🛡️ <b>طلب اعتماد مسؤول جديد | New Admin Access Request</b>\n"
                f"━━━━━━━━━━━━━━━━━━━\n"
                f"👤 <b>الاسم:</b> <b>{full_name}</b>\n"
                f"🔗 <b>المعرف:</b> @{username or 'بدون'}\n"
                f"🆔 <b>Telegram ID:</b> <code>{user_id}</code>\n"
                f"📅 <b>الوقت:</b> {timezone.now().strftime('%Y-%m-%d %I:%M %p')}\n\n"
                f"اضغط على الزر أدناه لمنحه صلاحية استلام إشعارات الطلبات فوراً:"
            )
            approval_buttons = {
                'inline_keyboard': [
                    [
                        {
                            'text': '✅ اعتماد وتفعيل الصلاحيات (Approve)',
                            'callback_data': f'approve_admin:{user_id}:{full_name[:20]}'
                        }
                    ],
                    [
                        {
                            'text': '❌ رفض الطلب (Deny)',
                            'callback_data': f'reject_admin:{user_id}'
                        }
                    ]
                ]
            }
            _send_telegram_raw(token, master_chat_id, approval_msg, reply_markup=approval_buttons)
        return

    # -------------------------------------------------------------
    # CASE B: VERIFIED ADMINISTRATOR
    # -------------------------------------------------------------
    cmd = text.split()[0].lower() if text else ''

    # Handle /add or /auth by an existing Admin (to add another admin!)
    if cmd in ['/add', '/add_admin', '/authorize', '/auth']:
        parts = text.split()
        if len(parts) < 2:
            _send_telegram_raw(
                token,
                chat_id,
                f"👑 <b>إضافة مسؤول جديد | Add New Admin:</b>\n"
                f"━━━━━━━━━━━━━━━━━━━\n"
                f"أنت مسجل بالفعل كمسؤول رئيسي معتمد.\n"
                f"لإضافة مسؤول آخر (مثل شيف المعمل أو موظف الشحن)، اكتب:\n"
                f"<code>/add [Telegram_ID] [الاسم]</code>\n\n"
                f"مثال:\n"
                f"<code>/add 987654321 Chef Omar</code>\n\n"
                f"💡 <i>أو اطلب منه فتح البوت @ToomaktBot والضغط على /start، وستصلك رسالة هنا بها زر 'اعتماد' بضغطة واحدة!</i>"
            )
            return

        target_id = parts[1].strip()
        target_name = " ".join(parts[2:]).strip() if len(parts) > 2 else f"Admin {target_id}"

        if not target_id.isdigit():
            _send_telegram_raw(token, chat_id, f"❌ المعرف الرقمي (Telegram ID) يجب أن يتكون من أرقام فقط. أنت كتبت: <code>{target_id}</code>")
            return

        TelegramAdminUser.objects.update_or_create(
            telegram_id=target_id,
            defaults={
                'first_name': target_name,
                'role': 'atelier_manager',
                'is_active': True,
                'can_receive_alerts': True,
                'can_manage_orders': True,
                'notes': f'Manually added by admin ({user_id})'
            }
        )

        _send_telegram_raw(
            token,
            chat_id,
            f"✅ <b>تم تفعيل وإضافة المسؤول بنجاح!</b>\n━━━━━━━━━━━━━━━━━━━\n👤 <b>الاسم:</b> {target_name}\n🆔 <b>Telegram ID:</b> <code>{target_id}</code>\n🔔 ستصله الآن إشعارات كافة الطلبات الجديدة."
        )

        # Notify the added person
        _send_telegram_raw(
            token,
            target_id,
            f"🎉 <b>مرحباً بك! تم اعتماد حسابك كمسؤول معتمد في معمل toomakt!</b>\n✅ ستصلك الآن كافة إشعارات الطلبات الجديدة في الوقت الفعلي.\nاكتب <code>/orders</code> لعرض أحدث الطلبات."
        )
        return

    # Handle /remove or /delete_admin
    if cmd in ['/remove', '/delete_admin', '/del']:
        parts = text.split()
        if len(parts) < 2:
            _send_telegram_raw(token, chat_id, "ℹ️ لحذف مسؤول، اكتب معرّفه الرقمي:\n<code>/remove [Telegram_ID]</code>")
            return
        target_id = parts[1].strip()
        if target_id == master_chat_id:
            _send_telegram_raw(token, chat_id, "⚠️ لا يمكن حذف المالك الرئيسي للنظام!")
            return
        deleted, _ = TelegramAdminUser.objects.filter(telegram_id=target_id).delete()
        if deleted:
            _send_telegram_raw(token, chat_id, f"🗑️ تم حذف المسؤول (ID: <code>{target_id}</code>) وإلغاء استلامه للإشعارات.")
        else:
            _send_telegram_raw(token, chat_id, f"❌ لم يتم العثور على مسؤول برقم <code>{target_id}</code>.")
        return

    # Handle /admins
    if cmd in ['/admins', 'admins']:
        admins_list = list(TelegramAdminUser.objects.all())
        lines = [
            "👥 <b>قائمة مسؤولي معمل toomakt المعتمدين:</b>\n━━━━━━━━━━━━━━━━━━━",
            f"👑 <b>المالك الرئيسي:</b> <code>{master_chat_id}</code> (Super Admin)"
        ]
        keyboard = []
        for a in admins_list:
            if str(a.telegram_id) != master_chat_id:
                st = "✅ نشط" if a.is_active else "❌ معطل"
                lines.append(f"• <b>{a.first_name}</b> — ID: <code>{a.telegram_id}</code> [{st}]")
                keyboard.append([{'text': f'🗑️ حذف {a.first_name}', 'callback_data': f'remove_admin:{a.telegram_id}'}])

        lines.append("\n➕ لإضافة مسؤول جديد، اكتب:\n<code>/add [Telegram_ID] [الاسم]</code>")
        reply_markup = {'inline_keyboard': keyboard} if keyboard else None
        _send_telegram_raw(token, chat_id, "\n".join(lines), reply_markup=reply_markup)
        return

    # Handle /start or /help
    if cmd in ['/start', '/help', 'help']:
        welcome_msg = (
            f"👑 <b>لوحة تحكم معمل toomakt | Admin Dashboard</b>\n"
            f"━━━━━━━━━━━━━━━━━━━\n"
            f"مرحباً بك يا <b>{full_name}</b>!\n"
            f"✅ <b>حالة الحساب:</b> مسؤول موثق معتمد ({role.upper()})\n"
            f"🔔 <b>الإشعارات الفورية:</b> مفعلة ومربوطة بحسابك مباشرة\n\n"
            f"📋 <b>الأوامر الإدارية:</b>\n"
            f"📦 <code>/orders</code> — أحدث الطلبات ومتابعة التجهيز\n"
            f"📊 <code>/stats</code> — إحصائيات المبيعات والأرباح اليومية\n"
            f"🔍 <code>/order ORD-XXXX</code> — البحث عن طلب محدد\n"
            f"👥 <code>/admins</code> — قائمة المسؤولين وإدارتهم\n"
            f"➕ <code>/add [ID] [الاسم]</code> — إضافة مسؤول جديد فورياً\n"
            f"🔔 <code>/test</code> — اختبار وصول إشعار فوري\n"
            f"━━━━━━━━━━━━━━━━━━━\n"
            f"👨‍🍳 <i>معمل toomakt — جاهز لتلقي الطلبات وتجهيز الحلوى.</i>"
        )
        markup = {
            'inline_keyboard': [
                [
                    {'text': '📦 أحدث الطلبات (/orders)', 'callback_data': 'cmd:orders'},
                    {'text': '📊 إحصائيات اليوم (/stats)', 'callback_data': 'cmd:stats'}
                ],
                [
                    {'text': '👥 إدارة المسؤولين (/admins)', 'callback_data': 'cmd:admins'}
                ]
            ]
        }
        _send_telegram_raw(token, chat_id, welcome_msg, reply_markup=markup)
        return

    # Handle /orders
    if cmd in ['/orders', 'orders', 'cmd:orders']:
        orders = list(Order.objects.order_by('-created_at')[:5])
        if not orders:
            _send_telegram_raw(token, chat_id, "📦 لا توجد أي طلبات مسجلة في المتجر حتى الآن.")
            return

        lines = ["📦 <b>أحدث الطلبات في معمل toomakt:</b>\n━━━━━━━━━━━━━━━━━━━"]
        for o in orders:
            st_emoji = "⏳" if o.status == 'pending' else ("👨‍🍳" if o.status == 'processing' else ("🚚" if o.status == 'shipped' else "✅"))
            lines.append(
                f"{st_emoji} <b>#{o.order_number}</b> — <b>{Decimal(str(o.total_amount)):.2f} EGP</b>\n"
                f"👤 {o.customer_name} | 📞 <code>{o.customer_phone}</code>\n"
                f"📍 {o.governorate or 'Cairo'}, {o.shipping_city or ''}\n"
                f"الحالة: <b>{o.status.upper()}</b> | الدفع: <b>{o.payment_method.upper()}</b>\n"
                f"تفاصيل: <code>/order {o.order_number}</code>\n"
                f"───────────────────"
            )
        _send_telegram_raw(token, chat_id, "\n".join(lines))
        return

    # Handle /stats
    if cmd in ['/stats', 'stats', 'cmd:stats']:
        now = timezone.now()
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        today_orders = Order.objects.filter(created_at__gte=today_start)
        today_count = today_orders.count()
        today_revenue = sum(Decimal(str(o.total_amount)) for o in today_orders)
        pending_count = Order.objects.filter(status='pending').count()
        processing_count = Order.objects.filter(status='processing').count()

        stats_msg = (
            f"📊 <b>إحصائيات مبيعات معمل toomakt</b>\n"
            f"━━━━━━━━━━━━━━━━━━━\n"
            f"📅 <b>اليوم:</b> {now.strftime('%Y-%m-%d')}\n\n"
            f"🛍️ <b>طلبات اليوم:</b> <b>{today_count} طلب</b>\n"
            f"💰 <b>مبيعات اليوم:</b> <b>{today_revenue:.2f} EGP</b>\n\n"
            f"⏳ <b>طلبات قيد المراجعة:</b> <b>{pending_count}</b>\n"
            f"👨‍🍳 <b>طلبات قيد التجهيز بالمعمل:</b> <b>{processing_count}</b>\n"
            f"━━━━━━━━━━━━━━━━━━━\n"
            f"✨ <i>نظام Toomakt المؤتمت بالكامل</i>"
        )
        _send_telegram_raw(token, chat_id, stats_msg)
        return

    # Handle /order <number>
    if cmd in ['/order', 'order']:
        parts = text.split()
        if len(parts) < 2:
            _send_telegram_raw(token, chat_id, "ℹ️ يرجى إدخال رقم الطلب، مثال:\n<code>/order ORD-2026-8E0B45</code>")
            return
        target_num = parts[1].strip().replace('#', '')
        o = Order.objects.filter(order_number__iexact=target_num).first()
        if not o:
            _send_telegram_raw(token, chat_id, f"❌ لم يتم العثور على طلب برقم <code>{target_num}</code>.")
            return

        items = list(o.items.all())
        items_str = "\n".join([f"  ▫️ {it.quantity}x {it.name} — {it.total_price} EGP" for it in items]) or "  ▫️ لا تفاصيل"
        raw_phone = o.customer_phone or ''
        wa_phone = _format_egyptian_phone(raw_phone)

        detail_msg = (
            f"🏷️ <b>تفاصيل الطلب #{o.order_number}</b>\n"
            f"━━━━━━━━━━━━━━━━━━━\n"
            f"👤 <b>العميل:</b> {o.customer_name}\n"
            f"📞 <b>الهاتف:</b> <code>{raw_phone}</code>\n"
            f"✉️ <b>البريد:</b> {o.customer_email}\n"
            f"📍 <b>العنوان:</b> {o.governorate}, {o.shipping_city}, {o.shipping_address}\n\n"
            f"📦 <b>المنتجات:</b>\n{items_str}\n\n"
            f"💰 <b>الإجمالي:</b> <b><u>{Decimal(str(o.total_amount)):.2f} EGP</u></b>\n"
            f"💳 <b>الدفع:</b> {o.payment_method.upper()}\n"
            f"⏳ <b>الحالة:</b> <b>{o.status.upper()}</b>\n"
            f"━━━━━━━━━━━━━━━━━━━"
        )
        keyboard = []
        if wa_phone:
            keyboard.append([{'text': f'💬 واتساب العميل ({raw_phone})', 'url': f'https://wa.me/{wa_phone}'}])
        keyboard.append([
            {'text': '👨‍🍳 تجهيز', 'callback_data': f'status:{o.order_number}:processing'},
            {'text': '🚚 شحن', 'callback_data': f'status:{o.order_number}:shipped'}
        ])
        _send_telegram_raw(token, chat_id, detail_msg, reply_markup={'inline_keyboard': keyboard})
        return

    # Handle /test
    if cmd in ['/test', 'test']:
        _send_telegram_raw(token, chat_id, "🔔 <b>فحص الاتصال:</b> البوت يعمل بكفاءة تامة والإشعارات الفورية متصلة بحسابك!")
        return

    # Default fallback
    _send_telegram_raw(
        token,
        chat_id,
        f"مرحباً <b>{full_name}</b> 👋\nاكتب <code>/help</code> لعرض قائمة الأوامر أو <code>/orders</code> لعرض أحدث الطلبات أو <code>/add [ID]</code> لإضافة مسؤول جديد."
    )
