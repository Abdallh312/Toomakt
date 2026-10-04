// ============================================================================
// Toomakt 24/7 Telegram Bot Serverless Webhook for Vercel
// Connects directly to Supabase PostgreSQL — Zero server maintenance, runs 24/7!
// ============================================================================


const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || process.env.VITE_TELEGRAM_BOT_TOKEN || '8984704321:AAGDZrlLBD-a407Kj9Sxr7-gpa0EDHnsD94';
const MASTER_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID || '1686960840';
const AUTH_SECRET = process.env.TELEGRAM_AUTH_SECRET || 'toomakt2026';

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://fpabvfwjbxqsrpdglvgt.supabase.co').replace(/\/$/, '');
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_P1RKNGKkCkD4PbauoaFZpA_6GwgJ-Od';

// In-memory cache for authorized admin IDs during lambda lifecycle
const AUTHORIZED_ADMIN_IDS = new Set<string>([MASTER_CHAT_ID]);

async function sendTelegram(endpoint: string, payload: Record<string, any>) {
  if (!TELEGRAM_BOT_TOKEN) return null;
  try {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err) {
    console.error(`Telegram API ${endpoint} error:`, err);
    return null;
  }
}

async function querySupabase(path: string, options: RequestInit = {}) {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      ...options,
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
        ...(options.headers || {}),
      },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error(`Supabase query ${path} error:`, err);
    return null;
  }
}

export default async function handler(req: any, res: any) {
  // Allow health checks via GET
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'ok',
      service: 'Toomakt Telegram Webhook',
      time: new Date().toISOString(),
      token_configured: Boolean(TELEGRAM_BOT_TOKEN),
      supabase_configured: Boolean(SUPABASE_URL && SUPABASE_KEY),
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const update = req.body;
  if (!update) {
    return res.status(200).json({ ok: true });
  }

  try {
    // ------------------------------------------------------------------------
    // 1. Handle Inline Button Callback Queries
    // ------------------------------------------------------------------------
    if (update.callback_query) {
      const cq = update.callback_query;
      const cqId = cq.id;
      const fromUser = cq.from || {};
      const userId = String(fromUser.id);
      const data = String(cq.data || '');
      const chatId = String(cq.message?.chat?.id || userId);
      const msgId = cq.message?.message_id;

      // Handle order status change: status:<order_number>:<new_status>
      if (data.startsWith('status:')) {
        const parts = data.split(':');
        if (parts.length >= 3) {
          const orderNum = parts[1];
          const newStatus = parts[2];
          
          await querySupabase(`toomakt_orders?order_number=eq.${orderNum}`, {
            method: 'PATCH',
            body: JSON.stringify({ status: newStatus }),
          });

          const statusArabic = newStatus === 'processing' 
            ? 'قيد التجهيز في المعمل' 
            : (newStatus === 'shipped' ? 'تم الشحن مع المندوب' : newStatus);

          await sendTelegram('answerCallbackQuery', {
            callback_query_id: cqId,
            text: `[CONFIRMED] تم تحديث الطلب #${orderNum} إلى: ${newStatus.toUpperCase()}`,
            show_alert: true,
          });

          await sendTelegram('sendMessage', {
            chat_id: chatId,
            text: `<b>تحديث حالة طلب:</b>\nالطلب <code>#${orderNum}</code> أصبح الآن: <b>${statusArabic}</b> بواسطة ${fromUser.first_name || 'Admin'}`,
            parse_mode: 'HTML',
          });
          return res.status(200).json({ ok: true });
        }
      }

      await sendTelegram('answerCallbackQuery', { callback_query_id: cqId, text: 'تم استلام الإجراء.' });
      return res.status(200).json({ ok: true });
    }

    // ------------------------------------------------------------------------
    // 2. Handle Text Messages
    // ------------------------------------------------------------------------
    const message = update.message;
    if (!message || !message.text) {
      return res.status(200).json({ ok: true });
    }

    const fromUser = message.from || {};
    const userId = String(fromUser.id);
    const chatId = String(message.chat?.id || userId);
    const text = message.text.trim();
    const fullName = [fromUser.first_name, fromUser.last_name].filter(Boolean).join(' ') || fromUser.username || `User ${userId}`;

    // Admin Authentication command: /auth <code>
    if (text.toLowerCase().startsWith('/auth')) {
      const parts = text.split(/\s+/);
      const code = parts[1] || '';
      if (code.toLowerCase() === AUTH_SECRET.toLowerCase()) {
        AUTHORIZED_ADMIN_IDS.add(userId);
        await sendTelegram('sendMessage', {
          chat_id: chatId,
          text: `<b>[AUTHENTICATION VERIFIED] | تم التوثيق بنجاح</b>\n` +
            `━━━━━━━━━━━━━━━━━━━\n` +
            `أهلاً بك يا <b>${fullName}</b> كمسؤول معتمد في معمل <b>toomakt</b>.\n` +
            `حسابك (ID: <code>${userId}</code>) أصبح مفعلاً الآن.\n\n` +
            `<b>الأوامر المتاحة لك:</b>\n` +
            `• <code>/orders</code> — أحدث الطلبات المستلمة\n` +
            `• <code>/stats</code> — ملخص مبيعات المتجر\n` +
            `• <code>/help</code> — قائمة التعليمات الكاملة`,
          parse_mode: 'HTML',
        });
        return res.status(200).json({ ok: true });
      } else {
        await sendTelegram('sendMessage', {
          chat_id: chatId,
          text: `[ERROR] رمز الاعتماد غير صحيح!\nيرجى كتابة: <code>/auth ${AUTH_SECRET}</code>`,
          parse_mode: 'HTML',
        });
        return res.status(200).json({ ok: true });
      }
    }

    // Command: /start or /help
    if (text.startsWith('/start') || text.startsWith('/help')) {
      await sendTelegram('sendMessage', {
        chat_id: chatId,
        text: `<b>[TOOMAKT ATELIER ADMIN CONSOLE]</b>\n` +
          `━━━━━━━━━━━━━━━━━━━\n` +
          `هذا البوت يعمل <b>24 ساعة سحابياً على Vercel</b> لإشعارك وإدارتك للطلبات والمبيعات فورياً.\n\n` +
          `<b>الأوامر المتاحة:</b>\n` +
          `• <code>/orders</code> — عرض أحدث الطلبات المسجلة\n` +
          `• <code>/stats</code> — إحصائيات المبيعات والأرباح اليوم\n` +
          `• <code>/order TM-XXXXX</code> — تفاصيل طلب محدد\n` +
          `• <code>/auth toomakt2026</code> — تأكيد هوية المسؤول`,
        parse_mode: 'HTML',
        reply_markup: {
          keyboard: [
            [{ text: 'أحدث الطلبات /orders' }, { text: 'إحصائيات المتجر /stats' }],
            [{ text: 'زيارة المتجر toomakt.com' }]
          ],
          resize_keyboard: true
        }
      });
      return res.status(200).json({ ok: true });
    }

    // Command: /orders
    if (text.includes('/orders') || text.includes('أحدث الطلبات')) {
      const orders = await querySupabase('toomakt_orders?select=*&order=created_at.desc&limit=5');
      if (!orders || orders.length === 0) {
        await sendTelegram('sendMessage', {
          chat_id: chatId,
          text: `[NOTICE] لا توجد طلبات مسجلة حتى الآن.`,
          parse_mode: 'HTML',
        });
        return res.status(200).json({ ok: true });
      }

      let msg = `<b>[DISPATCH REPORT] أحدث ${orders.length} طلبات في المتجر:</b>\n━━━━━━━━━━━━━━━━━━━\n\n`;
      for (const ord of orders) {
        const statusLabel = ord.status === 'delivered' ? '[Delivered]' : (ord.status === 'processing' ? '[In Kitchen]' : '[Pending]');
        const phone = ord.customer_phone || '';

        msg += `<b>الطلب:</b> <code>#${ord.order_number}</code>\n` +
          `• <b>العميل:</b> ${ord.customer_name}\n` +
          `• <b>الهاتف:</b> <code>${phone}</code>\n` +
          `• <b>الإجمالي:</b> <b>${Number(ord.total_amount).toFixed(2)} EGP</b>\n` +
          `• <b>المحافظة:</b> ${ord.governorate || 'القاهرة'}\n` +
          `• <b>الحالة:</b> <i>${statusLabel}</i>\n` +
          `━━━━━━━━━━━━━━━━━━━\n\n`;
      }

      await sendTelegram('sendMessage', {
        chat_id: chatId,
        text: msg,
        parse_mode: 'HTML',
      });
      return res.status(200).json({ ok: true });
    }

    // Command: /stats
    if (text.includes('/stats') || text.includes('إحصائيات')) {
      const allOrders = await querySupabase('toomakt_orders?select=total_amount,status,created_at');
      const ordersList = Array.isArray(allOrders) ? allOrders : [];
      
      const totalCount = ordersList.length;
      const totalRevenue = ordersList.reduce((sum: number, o: any) => sum + Number(o.total_amount || 0), 0);
      const pendingCount = ordersList.filter((o: any) => o.status === 'pending').length;
      const processingCount = ordersList.filter((o: any) => o.status === 'processing').length;
      const deliveredCount = ordersList.filter((o: any) => o.status === 'delivered').length;

      const statsMsg = `<b>[FINANCIAL REPORT] إحصائيات معمل toomakt:</b>\n` +
        `━━━━━━━━━━━━━━━━━━━\n` +
        `• إجمالي عدد الطلبات: <code>${totalCount}</code> طلب\n` +
        `• إجمالي الإيرادات: <b><u>${totalRevenue.toFixed(2)} EGP</u></b>\n\n` +
        `• طلبات قيد الانتظار: <code>${pendingCount}</code>\n` +
        `• طلبات قيد التجهيز: <code>${processingCount}</code>\n` +
        `• طلبات تم تسليمها: <code>${deliveredCount}</code>\n` +
        `━━━━━━━━━━━━━━━━━━━\n` +
        `<i>البيانات محدثة في الوقت الفعلي من قاعدة بيانات Supabase.</i>`;

      await sendTelegram('sendMessage', {
        chat_id: chatId,
        text: statsMsg,
        parse_mode: 'HTML',
      });
      return res.status(200).json({ ok: true });
    }

    // General fallback
    await sendTelegram('sendMessage', {
      chat_id: chatId,
      text: `أمر غير معروف. استخدم <code>/orders</code> لعرض الطلبات أو <code>/stats</code> للإحصائيات.`,
      parse_mode: 'HTML',
    });

    return res.status(200).json({ ok: true });
  } catch (err: any) {
    console.error('Webhook error:', err);
    return res.status(200).json({ ok: true, error: err.message });
  }
}
