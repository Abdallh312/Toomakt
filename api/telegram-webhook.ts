// ============================================================================
// Toomakt 24/7 Telegram Bot Serverless Webhook for Vercel
// Connects directly to Supabase PostgreSQL — Zero server maintenance, runs 24/7!
// ============================================================================

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || process.env.VITE_TELEGRAM_BOT_TOKEN || '8984704321:AAGDZrlLBD-a407Kj9Sxr7-gpa0EDHnsD94';
const MASTER_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID || '1686960840';
const VALID_AUTH_SECRETS = [
  ...(process.env.TELEGRAM_AUTH_SECRET ? [process.env.TELEGRAM_AUTH_SECRET.trim()] : []),
  'toomakt2026', 'toomakt', 'toomakt_2026', 'toomakt_atelier_2026'
];

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://fpabvfwjbxqsrpdglvgt.supabase.co').replace(/\/$/, '');
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_P1RKNGKkCkD4PbauoaFZpA_6GwgJ-Od';

// In-memory cache for authorized admin IDs during lambda lifecycle
const AUTHORIZED_ADMIN_IDS = new Set<string>([MASTER_CHAT_ID]);

function formatEgyptianPhone(phone: string): string {
  const clean = String(phone || '').replace(/\D/g, '');
  if (clean.startsWith('20')) return clean;
  if (clean.startsWith('0')) return '20' + clean.slice(1);
  return clean ? '20' + clean : '';
}

async function sendTelegram(endpoint: string, payload: Record<string, any>) {
  if (!TELEGRAM_BOT_TOKEN) return null;
  try {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!data.ok) {
      console.warn(`Telegram API warning (${endpoint}):`, data.description);
      // If failed due to reply_markup, retry without reply_markup
      if (payload.reply_markup) {
        const fallback = { ...payload };
        delete fallback.reply_markup;
        const res2 = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fallback),
        });
        return await res2.json();
      }
    }
    return data;
  } catch (err) {
    console.error(`Telegram API ${endpoint} network error:`, err);
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
    if (!res.ok) {
      const errText = await res.text();
      console.error(`Supabase query [${path}] HTTP ${res.status}:`, errText);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error(`Supabase query [${path}] exception:`, err);
    return null;
  }
}

async function isUserAuthorized(userId: string): Promise<boolean> {
  const uid = String(userId).trim();
  if (uid === String(MASTER_CHAT_ID).trim() || AUTHORIZED_ADMIN_IDS.has(uid)) {
    return true;
  }
  // Check persisted admin settings in Supabase
  try {
    const res = await querySupabase('toomakt_global_settings?key=eq.authorized_telegram_admins&select=value');
    if (Array.isArray(res) && res.length > 0 && res[0].value) {
      const list = Array.isArray(res[0].value) ? res[0].value : [];
      if (list.includes(uid)) {
        AUTHORIZED_ADMIN_IDS.add(uid);
        return true;
      }
    }
  } catch (e) {
    console.warn('Error reading admin list from Supabase:', e);
  }
  return false;
}

async function persistAuthorizedAdmin(userId: string): Promise<void> {
  const uid = String(userId).trim();
  AUTHORIZED_ADMIN_IDS.add(uid);
  try {
    const existing = await querySupabase('toomakt_global_settings?key=eq.authorized_telegram_admins&select=*');
    let list: string[] = [String(MASTER_CHAT_ID)];
    if (Array.isArray(existing) && existing.length > 0 && existing[0].value) {
      list = Array.isArray(existing[0].value) ? existing[0].value : [];
    }
    if (!list.includes(uid)) {
      list.push(uid);
    }
    await querySupabase('toomakt_global_settings?key=eq.authorized_telegram_admins', {
      method: 'POST',
      headers: { 'Prefer': 'resolution=merge-duplicates' },
      body: JSON.stringify({
        key: 'authorized_telegram_admins',
        category: 'telegram',
        label: 'Authorized Telegram Admin IDs',
        value: list,
        updated_at: new Date().toISOString(),
      }),
    });
  } catch (e) {
    console.error('Failed to persist admin to Supabase:', e);
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

      const authorized = await isUserAuthorized(userId);
      if (!authorized) {
        await sendTelegram('answerCallbackQuery', {
          callback_query_id: cqId,
          text: 'غير مصرح لك بتنفيذ هذه العملية. يرجى التوثيق أولاً.',
          show_alert: true,
        });
        return res.status(200).json({ ok: true });
      }

      // 1.1 Handle order status update: status:<order_number>:<new_status>
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
            : (newStatus === 'shipped' ? 'تم الشحن مع المندوب' : (newStatus === 'delivered' ? 'تم التوصيل' : newStatus));

          await sendTelegram('answerCallbackQuery', {
            callback_query_id: cqId,
            text: `تم تحديث الطلب #${orderNum} إلى: ${newStatus.toUpperCase()}`,
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

      // 1.2 Handle quick menu commands from inline buttons
      if (data === 'cmd:orders') {
        await sendTelegram('answerCallbackQuery', { callback_query_id: cqId, text: 'جاري تحميل الطلبات...' });
        await handleOrdersCommand(chatId);
        return res.status(200).json({ ok: true });
      }

      if (data === 'cmd:stats') {
        await sendTelegram('answerCallbackQuery', { callback_query_id: cqId, text: 'جاري تحميل الإحصائيات...' });
        await handleStatsCommand(chatId);
        return res.status(200).json({ ok: true });
      }

      if (data === 'cmd:products') {
        await sendTelegram('answerCallbackQuery', { callback_query_id: cqId, text: 'جاري تحميل قائمة المنتجات...' });
        await handleProductsCommand(chatId);
        return res.status(200).json({ ok: true });
      }

      if (data.startsWith('prod_info:')) {
        const targetId = data.split(':')[1];
        await sendTelegram('answerCallbackQuery', { callback_query_id: cqId, text: 'جاري جلب تفاصيل المنتج...' });
        await handleProductDetailCommand(chatId, targetId);
        return res.status(200).json({ ok: true });
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
    const rawText = message.text.trim();
    const fullName = [fromUser.first_name, fromUser.last_name].filter(Boolean).join(' ') || fromUser.username || `User ${userId}`;

    // Clean command: remove bot mention (@ToomaktBot)
    const tokens = rawText.split(/\s+/);
    const rawCmd = tokens[0] || '';
    const cmd = rawCmd.toLowerCase().replace(/@.+$/, '');
    const args = tokens.slice(1);

    // ------------------------------------------------------------------------
    // 2.1 Authentication Command (/auth <code>)
    // ------------------------------------------------------------------------
    if (cmd === '/auth') {
      const code = args[0] ? args[0].trim().toLowerCase() : '';
      if (VALID_AUTH_SECRETS.includes(code)) {
        await persistAuthorizedAdmin(userId);
        await sendTelegram('sendMessage', {
          chat_id: chatId,
          text: `<b>[AUTHENTICATION VERIFIED] | تم التوثيق بنجاح</b>\n` +
            `━━━━━━━━━━━━━━━━━━━\n` +
            `أهلاً بك يا <b>${fullName}</b> كمسؤول معتمد في معمل <b>toomakt</b>.\n` +
            `حسابك (ID: <code>${userId}</code>) أصبح مفعلاً الآن 24/7.\n\n` +
            `<b>الأوامر المتاحة لك:</b>\n` +
            `• <code>/orders</code> — أحدث الطلبات المستلمة\n` +
            `• <code>/order TM-XXXX</code> — تفاصيل طلب ومتابعة الشحن\n` +
            `• <code>/products</code> — قائمة المنتجات والأسعار والمخزون\n` +
            `• <code>/product [ID]</code> — تفاصيل منتج ومواصفات العلبة والوزن\n` +
            `• <code>/stock [ID] [الكمية]</code> — تحديث المخزون\n` +
            `• <code>/stats</code> — ملخص مبيعات المتجر\n` +
            `• <code>/help</code> — قائمة التعليمات الكاملة`,
          parse_mode: 'HTML',
        });
        return res.status(200).json({ ok: true });
      } else {
        await sendTelegram('sendMessage', {
          chat_id: chatId,
          text: `<b>[ERROR] رمز الاعتماد غير صحيح!</b>\nيرجى كتابة الكود الصحيح:\n<code>/auth toomakt2026</code>`,
          parse_mode: 'HTML',
        });
        return res.status(200).json({ ok: true });
      }
    }

    // ------------------------------------------------------------------------
    // 2.2 Security Gate: Verify Authorization
    // ------------------------------------------------------------------------
    const authorized = await isUserAuthorized(userId);
    if (!authorized) {
      await sendTelegram('sendMessage', {
        chat_id: chatId,
        text: `<b>[ACCESS RESTRICTED] لوحة تحكم معمل toomakt</b>\n` +
          `━━━━━━━━━━━━━━━━━━━\n` +
          `عذراً، هذا البوت مخصص حصرياً لإدارة معمل toomakt.\n` +
          `المعرف الخاص بك: <code>${userId}</code>\n\n` +
          `للتوثيق يرجى إرسال رمز الاعتماد:\n<code>/auth toomakt2026</code>`,
        parse_mode: 'HTML',
      });
      return res.status(200).json({ ok: true });
    }

    // ------------------------------------------------------------------------
    // 2.3 Command: /start or /help
    // ------------------------------------------------------------------------
    if (cmd === '/start' || cmd === '/help') {
      await sendTelegram('sendMessage', {
        chat_id: chatId,
        text: `<b>[TOOMAKT ATELIER ADMIN CONSOLE]</b>\n` +
          `━━━━━━━━━━━━━━━━━━━\n` +
          `لوحة التحكم السحابية تعمل <b>24/7 سحابياً</b> لإدارة الطلبات والمنتجات والمخزون.\n\n` +
          `<b>أوامر الطلبات:</b>\n` +
          `• <code>/orders</code> — عرض أحدث الطلبات المسجلة\n` +
          `• <code>/order ORD-XXXX</code> — تفاصيل طلب محدد مع أزرار التحكم\n` +
          `• <code>/status ORD-XXXX processing</code> — تغيير حالة الطلب\n\n` +
          `<b>أوامر المنتجات والمخزون:</b>\n` +
          `• <code>/products</code> — استعراض قائمة المنتجات وأسعارها ومخزونها\n` +
          `• <code>/product [ID أو SKU]</code> — فحص مواصفات منتج (الوزن، العلب، الأكياس)\n` +
          `• <code>/stock [ID] [الكمية]</code> — تعديل المخزون فورياً\n` +
          `• <code>/price [ID] [السعر]</code> — تعديل سعر المنتج\n\n` +
          `<b>أوامر الإحصائيات والفحص:</b>\n` +
          `• <code>/stats</code> — إحصائيات المبيعات والأرباح\n` +
          `• <code>/test</code> — فحص اتصال الخادم وقاعدة البيانات`,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              { text: 'أحدث الطلبات (/orders)', callback_data: 'cmd:orders' },
              { text: 'إحصائيات المتجر (/stats)', callback_data: 'cmd:stats' }
            ],
            [
              { text: 'قائمة المنتجات (/products)', callback_data: 'cmd:products' }
            ]
          ]
        }
      });
      return res.status(200).json({ ok: true });
    }

    // ------------------------------------------------------------------------
    // 2.4 Command: /orders
    // ------------------------------------------------------------------------
    if (cmd === '/orders') {
      await handleOrdersCommand(chatId);
      return res.status(200).json({ ok: true });
    }

    // ------------------------------------------------------------------------
    // 2.5 Command: /order <order_number>
    // ------------------------------------------------------------------------
    if (cmd === '/order') {
      if (args.length === 0) {
        await sendTelegram('sendMessage', {
          chat_id: chatId,
          text: `<b>صيغة الأمر غير مكتملة:</b>\nيرجى كتابة رقم الطلب بعد الأمر:\n<code>/order ORD-2026-XXXX</code> أو <code>/order TM-XXXX</code>`,
          parse_mode: 'HTML',
        });
        return res.status(200).json({ ok: true });
      }
      const orderNum = args[0].replace(/^#/, '').trim();
      await handleOrderDetailCommand(chatId, orderNum);
      return res.status(200).json({ ok: true });
    }

    // ------------------------------------------------------------------------
    // 2.6 Command: /status <order_number> <new_status>
    // ------------------------------------------------------------------------
    if (cmd === '/status') {
      if (args.length < 2) {
        await sendTelegram('sendMessage', {
          chat_id: chatId,
          text: `<b>صيغة الأمر غير صحيحة:</b>\nيرجى كتابة رقم الطلب ثم الحالة المطلوبة:\n<code>/status [رقم_الطلب] [الحالة]</code>\n\nالحالات المتاحة:\n• <code>pending</code> (قيد المراجعة)\n• <code>processing</code> (قيد التجهيز في المعمل)\n• <code>shipped</code> (تم الشحن مع المندوب)\n• <code>delivered</code> (تم التسليم بنجاح)\n• <code>cancelled</code> (ملغي)`,
          parse_mode: 'HTML',
        });
        return res.status(200).json({ ok: true });
      }

      const orderNum = args[0].replace(/^#/, '').trim();
      const newStatus = args[1].trim().toLowerCase();
      const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

      if (!validStatuses.includes(newStatus)) {
        await sendTelegram('sendMessage', {
          chat_id: chatId,
          text: `<b>حالة غير صالحة:</b> <code>${newStatus}</code>\nالحالات المقبولة: <code>pending, processing, shipped, delivered, cancelled</code>`,
          parse_mode: 'HTML',
        });
        return res.status(200).json({ ok: true });
      }

      const updated = await querySupabase(`toomakt_orders?order_number=eq.${orderNum}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });

      if (!updated || updated.length === 0) {
        await sendTelegram('sendMessage', {
          chat_id: chatId,
          text: `لم يتم العثور على طلب برقم: <code>#${orderNum}</code>`,
          parse_mode: 'HTML',
        });
        return res.status(200).json({ ok: true });
      }

      await sendTelegram('sendMessage', {
        chat_id: chatId,
        text: `<b>تم تحديث حالة الطلب بنجاح!</b>\nالطلب <code>#${orderNum}</code> أصبح الآن: <b>${newStatus.toUpperCase()}</b>`,
        parse_mode: 'HTML',
      });
      return res.status(200).json({ ok: true });
    }

    // ------------------------------------------------------------------------
    // 2.7 Command: /products
    // ------------------------------------------------------------------------
    if (cmd === '/products') {
      await handleProductsCommand(chatId);
      return res.status(200).json({ ok: true });
    }

    // ------------------------------------------------------------------------
    // 2.8 Command: /product <id_or_sku>
    // ------------------------------------------------------------------------
    if (cmd === '/product') {
      if (args.length === 0) {
        await sendTelegram('sendMessage', {
          chat_id: chatId,
          text: `<b>صيغة الأمر غير مكتملة:</b>\nيرجى كتابة معرّف المنتج أو رمز SKU:\n<code>/product [SKU أو ID]</code>\nمثال: <code>/product TMK-MANGO</code> أو اكتب <code>/products</code> لعرض القائمة.`,
          parse_mode: 'HTML',
        });
        return res.status(200).json({ ok: true });
      }
      const target = args[0].trim();
      await handleProductDetailCommand(chatId, target);
      return res.status(200).json({ ok: true });
    }

    // ------------------------------------------------------------------------
    // 2.9 Command: /stock <id_or_sku> <quantity>
    // ------------------------------------------------------------------------
    if (cmd === '/stock' || cmd === '/setstock') {
      if (args.length < 2) {
        await sendTelegram('sendMessage', {
          chat_id: chatId,
          text: `<b>صيغة غير صحيحة لتحديث المخزون:</b>\nيرجى كتابة معرّف أو رمز SKU المنتج ثم الكمية:\n<code>/stock [ID أو SKU] [الكمية الجديدة]</code>\nمثال:\n<code>/stock TMK-BERRY-001 75</code>`,
          parse_mode: 'HTML',
        });
        return res.status(200).json({ ok: true });
      }

      const target = args[0].trim();
      const rawQty = args[1].trim();
      const newQty = parseInt(rawQty, 10);

      if (isNaN(newQty)) {
        await sendTelegram('sendMessage', {
          chat_id: chatId,
          text: `<b>خطأ في القيمة:</b> <code>${rawQty}</code> ليست قيمة رقمية صحيحة. يرجى إدخال رقم صحيح.`,
          parse_mode: 'HTML',
        });
        return res.status(200).json({ ok: true });
      }

      if (newQty < 0) {
        await sendTelegram('sendMessage', {
          chat_id: chatId,
          text: `<b>خطأ في الكمية:</b> لا يمكن تعيين مخزون بقيمة سالبة. يجب أن تكون الكمية 0 أو أكبر.`,
          parse_mode: 'HTML',
        });
        return res.status(200).json({ ok: true });
      }

      // Find product by id, slug, or sku
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(target);
      const filter = isUUID ? `id=eq.${target}` : `or=(slug.eq.${target},name.ilike.*${target}*)`;
      
      const patchRes = await querySupabase(`toomakt_products?${filter}`, {
        method: 'PATCH',
        body: JSON.stringify({
          stock_quantity: newQty,
          in_stock: newQty > 0,
          updated_at: new Date().toISOString(),
        }),
      });

      if (!patchRes || patchRes.length === 0) {
        await sendTelegram('sendMessage', {
          chat_id: chatId,
          text: `لم يتم العثور على منتج يطابق: <code>${target}</code>. اكتب <code>/products</code> لمعاينة المنتجات المتاحة.`,
          parse_mode: 'HTML',
        });
        return res.status(200).json({ ok: true });
      }

      const prod = patchRes[0];
      await sendTelegram('sendMessage', {
        chat_id: chatId,
        text: `<b>[STOCK UPDATED] تم تحديث مخزون المنتج:</b>\n` +
          `━━━━━━━━━━━━━━━━━━━\n` +
          `• <b>المنتج:</b> ${prod.name}\n` +
          `• <b>المخزون الجديد:</b> <code>${newQty}</code> قطعة\n` +
          `• <b>الحالة:</b> ${newQty > 0 ? 'متوفر للطلب (In Stock)' : 'نفذت الكمية (Out of Stock)'}\n` +
          `• <b>تم التحديث في:</b> ${new Date().toLocaleTimeString('ar-EG')}`,
        parse_mode: 'HTML',
      });
      return res.status(200).json({ ok: true });
    }

    // ------------------------------------------------------------------------
    // 2.10 Command: /price <id_or_sku> <price>
    // ------------------------------------------------------------------------
    if (cmd === '/price') {
      if (args.length < 2) {
        await sendTelegram('sendMessage', {
          chat_id: chatId,
          text: `<b>صيغة الأمر لتعديل السعر:</b>\n<code>/price [ID أو SKU] [السعر بالجنيه]</code>\nمثال:\n<code>/price TMK-MANGO 260</code>`,
          parse_mode: 'HTML',
        });
        return res.status(200).json({ ok: true });
      }

      const target = args[0].trim();
      const rawPrice = args[1].trim();
      const newPrice = parseFloat(rawPrice);

      if (isNaN(newPrice) || newPrice <= 0) {
        await sendTelegram('sendMessage', {
          chat_id: chatId,
          text: `<b>خطأ في السعر:</b> يجب إدخال قيمة رقمية موجبة أكبر من صفر.`,
          parse_mode: 'HTML',
        });
        return res.status(200).json({ ok: true });
      }

      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(target);
      const filter = isUUID ? `id=eq.${target}` : `or=(slug.eq.${target},name.ilike.*${target}*)`;

      const patchRes = await querySupabase(`toomakt_products?${filter}`, {
        method: 'PATCH',
        body: JSON.stringify({
          price: newPrice,
          updated_at: new Date().toISOString(),
        }),
      });

      if (!patchRes || patchRes.length === 0) {
        await sendTelegram('sendMessage', {
          chat_id: chatId,
          text: `لم يتم العثور على منتج يطابق: <code>${target}</code>.`,
          parse_mode: 'HTML',
        });
        return res.status(200).json({ ok: true });
      }

      const prod = patchRes[0];
      await sendTelegram('sendMessage', {
        chat_id: chatId,
        text: `<b>[PRICE UPDATED] تم تعديل سعر المنتج بنجاح:</b>\n` +
          `━━━━━━━━━━━━━━━━━━━\n` +
          `• <b>المنتج:</b> ${prod.name}\n` +
          `• <b>السعر الجديد:</b> <b><u>${newPrice.toFixed(2)} EGP</u></b>`,
        parse_mode: 'HTML',
      });
      return res.status(200).json({ ok: true });
    }

    // ------------------------------------------------------------------------
    // 2.11 Command: /stats
    // ------------------------------------------------------------------------
    if (cmd === '/stats') {
      await handleStatsCommand(chatId);
      return res.status(200).json({ ok: true });
    }

    // ------------------------------------------------------------------------
    // 2.12 Command: /test
    // ------------------------------------------------------------------------
    if (cmd === '/test') {
      const dbCheck = await querySupabase('toomakt_products?select=id&limit=1');
      const dbOk = Array.isArray(dbCheck);
      await sendTelegram('sendMessage', {
        chat_id: chatId,
        text: `<b>[DIAGNOSTIC REPORT] فحص خادم البوت:</b>\n` +
          `━━━━━━━━━━━━━━━━━━━\n` +
          `• خادم Vercel Webhook: <b>يعمل بكفاءة 24/7</b>\n` +
          `• قاعدة بيانات Supabase: <b>${dbOk ? 'متصلة بنجاح' : 'تعذر الاتصال'}</b>\n` +
          `• معرفك الإداري: <code>${userId}</code> (مصرح له)\n` +
          `• الوقت الحالي: ${new Date().toISOString()}`,
        parse_mode: 'HTML',
      });
      return res.status(200).json({ ok: true });
    }

    // Fallback unknown command
    await sendTelegram('sendMessage', {
      chat_id: chatId,
      text: `أمر غير معروف: <code>${rawCmd}</code>\nاستخدم <code>/help</code> لعرض قائمة الأوامر المتاحة أو <code>/orders</code> لعرض الطلبات أو <code>/products</code> للمنتجات.`,
      parse_mode: 'HTML',
    });

    return res.status(200).json({ ok: true });
  } catch (err: any) {
    console.error('Webhook execution error:', err);
    return res.status(200).json({ ok: true, error: err.message });
  }
}

// ----------------------------------------------------------------------------
// Helper Handlers
// ----------------------------------------------------------------------------

async function handleOrdersCommand(chatId: string) {
  const orders = await querySupabase('toomakt_orders?select=*&order=created_at.desc&limit=5');
  if (!orders || orders.length === 0) {
    await sendTelegram('sendMessage', {
      chat_id: chatId,
      text: `<b>[NOTICE] لا توجد طلبات مسجلة حتى الآن.</b>`,
      parse_mode: 'HTML',
    });
    return;
  }

  let msg = `<b>[DISPATCH REPORT] أحدث ${orders.length} طلبات في معمل toomakt:</b>\n━━━━━━━━━━━━━━━━━━━\n\n`;
  for (const ord of orders) {
    const statusLabel = ord.status === 'delivered'
      ? '[تم التسليم]'
      : (ord.status === 'shipped' ? '[تم الشحن]' : (ord.status === 'processing' ? '[قيد التجهيز]' : '[قيد الانتظار]'));
    const phone = ord.customer_phone || '';

    msg += `<b>الطلب:</b> <code>#${ord.order_number}</code>\n` +
      `• <b>العميل:</b> ${ord.customer_name}\n` +
      `• <b>الهاتف:</b> <code>${phone}</code>\n` +
      `• <b>الإجمالي:</b> <b>${Number(ord.total_amount).toFixed(2)} EGP</b>\n` +
      `• <b>المحافظة:</b> ${ord.governorate || 'القاهرة'}\n` +
      `• <b>الحالة:</b> <i>${statusLabel}</i>\n` +
      `• تفاصيل وتحكم: <code>/order ${ord.order_number}</code>\n` +
      `━━━━━━━━━━━━━━━━━━━\n\n`;
  }

  await sendTelegram('sendMessage', {
    chat_id: chatId,
    text: msg,
    parse_mode: 'HTML',
  });
}

async function handleOrderDetailCommand(chatId: string, orderNum: string) {
  const results = await querySupabase(`toomakt_orders?order_number=eq.${orderNum}&select=*,items:toomakt_order_items(*)`);
  if (!results || results.length === 0) {
    await sendTelegram('sendMessage', {
      chat_id: chatId,
      text: `لم يتم العثور على طلب برقم: <code>#${orderNum}</code>. يرجى التحقق من الرقم وكتابته بدقة.`,
      parse_mode: 'HTML',
    });
    return;
  }

  const o = results[0];
  const items = Array.isArray(o.items) ? o.items : [];
  const itemsText = items.map((it: any) => `  ▫️ <b>${it.quantity}x</b> ${it.product_name || it.name || 'حلوى توفي'} — <code>${Number(it.total_price || 0).toFixed(2)} EGP</code>`).join('\n') || '  ▫️ <i>لا توجد تفاصيل للمنتجات</i>';

  const rawPhone = o.customer_phone || '';
  const waPhone = formatEgyptianPhone(rawPhone);

  const detailMsg = (
    `<b>تفاصيل الطلب #${o.order_number}</b>\n` +
    `━━━━━━━━━━━━━━━━━━━\n` +
    `👤 <b>العميل:</b> ${o.customer_name}\n` +
    `📞 <b>الهاتف:</b> <code>${rawPhone}</code>\n` +
    `✉️ <b>البريد:</b> ${o.customer_email || 'غير مسجل'}\n` +
    `📍 <b>العنوان:</b> ${o.governorate || 'القاهرة'}, ${o.shipping_city || ''}, ${o.shipping_address || ''}\n\n` +
    `📦 <b>المنتجات:</b>\n${itemsText}\n\n` +
    `💰 <b>الإجمالي:</b> <b><u>${Number(o.total_amount || 0).toFixed(2)} EGP</u></b>\n` +
    `💳 <b>طريقة الدفع:</b> ${String(o.payment_method || 'COD').toUpperCase()}\n` +
    `⏳ <b>الحالة الحالية:</b> <b>${String(o.status || 'pending').toUpperCase()}</b>\n` +
    `━━━━━━━━━━━━━━━━━━━`
  );

  const keyboard: any[] = [];
  if (waPhone) {
    keyboard.push([{
      text: `مراسلة العميل واتساب (${rawPhone})`,
      url: `https://wa.me/${waPhone}`
    }]);
  }
  keyboard.push([
    { text: 'بدء التجهيز بالمعمل', callback_data: `status:${o.order_number}:processing` },
    { text: 'تسليم لشركة الشحن', callback_data: `status:${o.order_number}:shipped` }
  ]);

  await sendTelegram('sendMessage', {
    chat_id: chatId,
    text: detailMsg,
    parse_mode: 'HTML',
    reply_markup: { inline_keyboard: keyboard }
  });
}

async function handleProductsCommand(chatId: string) {
  const prods = await querySupabase('toomakt_products?select=id,name,slug,price,weight,stock_quantity,in_stock&order=name.asc');
  if (!prods || prods.length === 0) {
    await sendTelegram('sendMessage', {
      chat_id: chatId,
      text: `لا توجد منتجات مسجلة في قاعدة البيانات حالياً.`,
      parse_mode: 'HTML',
    });
    return;
  }

  let msg = `<b>[CONFECTION INVENTORY] قائمة منتجات معمل toomakt:</b>\n━━━━━━━━━━━━━━━━━━━\n\n`;
  for (const p of prods) {
    const stock = p.stock_quantity ?? (p.in_stock ? 50 : 0);
    const stockStatus = stock > 0 ? `المخزون: <code>${stock}</code>` : 'نفذت الكمية';
    const weight = p.weight || '250g Pouch';

    msg += `• <b>${p.name}</b>\n` +
      `  السعر: <b>${Number(p.price).toFixed(2)} EGP</b> | الوزن: ${weight}\n` +
      `  ${stockStatus} | المعرّف: <code>${p.slug || p.id.slice(0, 8)}</code>\n` +
      `  تعديل المخزون: <code>/stock ${p.slug || p.id} [الكمية]</code>\n\n`;
  }

  msg += `━━━━━━━━━━━━━━━━━━━\n<i>لفحص مواصفات منتج تفصيلياً، اكتب: <code>/product [المعرف]</code></i>`;

  await sendTelegram('sendMessage', {
    chat_id: chatId,
    text: msg,
    parse_mode: 'HTML',
  });
}

async function handleProductDetailCommand(chatId: string, target: string) {
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(target);
  const filter = isUUID ? `id=eq.${target}` : `or=(slug.eq.${target},name.ilike.*${target}*)`;

  const prods = await querySupabase(`toomakt_products?${filter}&select=*&limit=1`);
  if (!prods || prods.length === 0) {
    await sendTelegram('sendMessage', {
      chat_id: chatId,
      text: `لم يتم العثور على منتج يطابق: <code>${target}</code>.`,
      parse_mode: 'HTML',
    });
    return;
  }

  const p = prods[0];
  const stock = p.stock_quantity ?? 50;
  const boxQty = p.box_quantity || 10;
  const packQty = p.pack_quantity || p.weight || '250g Pouch';
  const weight = p.weight || '250g';
  const tastingNotes = Array.isArray(p.tasting_notes) && p.tasting_notes.length > 0
    ? p.tasting_notes.join(', ')
    : (Array.isArray(p.fruit_notes) ? p.fruit_notes.join(', ') : 'Orchard fruits, cream');

  const text = `<b>[PRODUCT SPECIFICATION] ${p.name}</b>\n` +
    `━━━━━━━━━━━━━━━━━━━\n` +
    `• <b>السعر:</b> <b><u>${Number(p.price).toFixed(2)} EGP</u></b>\n` +
    `• <b>الوزن الصافي:</b> <code>${weight}</code>\n` +
    `• <b>كمية الكرتونة (Box Quantity):</b> <code>${boxQty} علب / كرتونة</code>\n` +
    `• <b>محتوى العبوة (Pack Quantity):</b> <code>${packQty}</code>\n` +
    `• <b>المخزون المتاح:</b> <code>${stock}</code> قطعة\n` +
    `• <b>الحالة:</b> ${stock > 0 ? 'متوفر للبيع' : 'نفذت الكمية'}\n` +
    `• <b>ملاحظات التذوق:</b> <i>${tastingNotes}</i>\n` +
    `• <b>الوصف:</b> ${p.description || p.tagline || 'حلوى توفي فاخرة مصنوعة ببطء'}\n` +
    `━━━━━━━━━━━━━━━━━━━\n` +
    `لتعديل المخزون: <code>/stock ${p.slug || p.id} [الكمية]</code>\n` +
    `لتعديل السعر: <code>/price ${p.slug || p.id} [السعر]</code>`;

  await sendTelegram('sendMessage', {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
  });
}

async function handleStatsCommand(chatId: string) {
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
    `• طلبات قيد التجهيز بالمعمل: <code>${processingCount}</code>\n` +
    `• طلبات تم تسليمها: <code>${deliveredCount}</code>\n` +
    `━━━━━━━━━━━━━━━━━━━\n` +
    `<i>البيانات محدثة في الوقت الفعلي من قاعدة بيانات Supabase.</i>`;

  await sendTelegram('sendMessage', {
    chat_id: chatId,
    text: statsMsg,
    parse_mode: 'HTML',
  });
}
