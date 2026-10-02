import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';

interface LanguageContextType {
  language: Language;
  direction: Direction;
  isRtl: boolean;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
  formatPrice: (amount: number) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Brand
    brand_name: 'toomakt',
    brand_tagline: 'Artisanal Fruit & Toffee Confectionery',
    brand_motto: 'Big Fruit. Real Toffee. Pure Obsession.',
    brand_motto_sub: 'Slow-cooked in heavy copper cauldrons with 100% real orchard purées and European cultured butter.',

    // Navigation
    nav_company: 'About Us',
    nav_started: 'When We Started',
    nav_provide: 'What We Provide',
    nav_sensory: 'The 45s Chew',
    nav_shop: 'Shop All',
    nav_vault: 'Flavor Vault',
    nav_drop: 'DROP',
    nav_tins: 'Gift Tins',
    nav_story: 'Our Story',
    nav_ingredients: 'Ingredients',
    nav_track: 'Track Order',
    nav_wholesale: 'Wholesale & Gifts',
    nav_search: 'Search flavors',
    nav_wishlist: 'Saved items',
    nav_bag: 'Shopping Bag',
    nav_items_count: 'items',
    nav_item_count: 'item',

    // Announcement Bar
    announcement_shipping: 'Free Express Cooler Shipping on orders over 150 EGP in Egypt',
    announcement_chew: 'Proprietary 45s Non-Sticky Chew Curve',
    announcement_puree: '100% Real Orchard Puree & Normandy Sweet Butter',
    announcement_track: 'Track Order',
    announcement_wholesale: 'Wholesale & Corporate Quotes',

    // Hero Section
    hero_badge: 'Gold Medal Confiserie 2024 • Limited Summer Batch No. 08',
    hero_title_1: 'BIG FRUIT. REAL TOFFEE.',
    hero_title_2: 'PURE OBSESSION.',
    hero_subtitle: 'Egypt’s premier artisan confectionery atelier. Slow-cooked golden caramel infused with sun-ripened orchard purées and European cultured butter. Chewy, luscious, and unforgettable.',
    hero_cta_explore: 'Discover What We Provide',
    hero_cta_story: 'Our Heritage & Journey',
    hero_cta_shop: 'Shop The Harvest Box',
    hero_fast_delivery: 'Express 24-48h Delivery',
    hero_fast_delivery_sub: 'Cairo, Alex & all 27 governorates',
    hero_cooling: 'Insulated Cooler Bags',
    hero_cooling_sub: 'Guaranteed heat-safe delivery',
    hero_real_butter: '84% Cultured Butter',
    hero_real_butter_sub: 'Pure European sweet cream',
    hero_scroll_hint: 'Scroll to explore our confectionery atelier',

    // Describe the Company ("Who We Are")
    company_badge: 'The toomakt Craft Manifesto',
    company_title: 'Redefining Confectionery Through Real Ingredients and Timeless Craft.',
    company_p1: 'toomakt was founded on a simple conviction: everyday luxury confections should be crafted with real food, infinite patience, and honest culinary art — not synthetic flavorings or industrial shortcuts.',
    company_p2: 'In our Cairo atelier, we combine centuries-old French copper-kettle boiling traditions with sun-ripened orchard harvests and cultured sweet cream butter. The result is a clean, velvety, and unforgettable toffee experience that respects your palate.',
    company_atelier_batch: 'Cairo Atelier Batch No. 08',
    company_atelier_sub: 'Hand-pulled daily in small limited cauldrons',
    company_pillar1_title: 'French Copper Cauldrons',
    company_pillar1_desc: 'Slow-simmered at precisely 245°F to achieve an ultra-smooth velvet consistency that never sticks to teeth.',
    company_pillar2_title: '100% Real Fruit Purées',
    company_pillar2_desc: 'Infused with cold-macerated strawberries, Alphonso mangoes, and sun-drenched Mediterranean citrus.',
    company_pillar3_title: 'European Cultured Butter',
    company_pillar3_desc: 'Handcrafted with 84% butterfat sweet cream butter for a luxurious melt-in-mouth texture without palm oils.',
    company_pillar4_title: 'The 45-Second Signature Chew',
    company_pillar4_desc: 'A multi-stage taste evolution from golden butter creaminess to an explosive real fruit burst and caramelized finish.',
    company_btn_story: 'Read Our Full Story',
    company_btn_offerings: 'Explore What We Provide',

    // When We Started (Heritage Timeline)
    timeline_badge: 'Our Atelier Inception',
    timeline_title: 'When We Started: From a Single Copper Kettle to Egypt’s Benchmark Atelier',
    timeline_subtitle: 'The craft journey behind every individually wrapped piece of toomakt.',
    timeline_2021_year: '2021 — The Spark',
    timeline_2021_title: 'The Rebellion Against Industrial Candy',
    timeline_2021_desc: 'Frustrated by the artificial flavorings, synthetic dyes, and high-fructose corn syrup flooding the market, our founders set out in Cairo to make candy the way French confiseurs did two centuries ago — using authentic copper cauldrons and real orchard harvests.',
    timeline_2022_year: '2022 — The Formulation',
    timeline_2022_title: 'Engineering the 45-Second Chew',
    timeline_2022_desc: 'After 180+ micro-batches, we perfected our proprietary temperature curve: a chew that delivers an initial satisfying snap, dissolves into velvety butter caramel, and finishes cleanly without adhering to teeth.',
    timeline_2023_year: '2023 — The Logistics',
    timeline_2023_title: 'Pioneering Nationwide Cold-Chain Delivery',
    timeline_2023_desc: 'To protect our delicate real-butter confections from the Egyptian summer heat, we engineered our signature insulated cooler box packaging, guaranteeing fresh atelier-door delivery to all 27 Egyptian governorates.',
    timeline_2024_year: '2024 — Recognition',
    timeline_2024_title: 'Gold Medal Recognition & Full Family Assortment',
    timeline_2024_desc: 'Awarded the Gold Medal Confiserie 2024 and expanding our signature collection into the Full Atelier Family (عيلة توماكت): Fruit Toffees, Normandy Browned Butter Toffees, Arabica Bonbons, and Belgian Cocoa Eclairs.',
    timeline_quote: '“When you taste real butter and honest fruit purée cooked slowly in copper, you never look at mass-produced candy the same way again.”',
    timeline_quote_author: '— The toomakt Confectionery Atelier, Cairo',

    // What We Provide (Offerings & Products)
    provide_badge: 'Curated Atelier Offerings',
    provide_title: 'What We Provide: Confections Born of Purity and Obsession',
    provide_subtitle: 'Explore our master confectionery lines — crafted fresh daily in small limited batches.',
    provide_tab_all: 'All Confections',
    provide_tab_fruity: 'Fruit Toffee / Candy',
    provide_tab_butter: 'Normandy Butter Toffee',
    provide_tab_boxes: 'Harvest Boxes & Tins',
    provide_tab_wholesale: 'Hospitality & Wholesale',

    provide_card1_title: 'Fruity Soft Toffees & Chews',
    provide_card1_tag: '100% Real Orchard Purée',
    provide_card1_desc: 'Sun-drenched strawberries, Alphonso mangoes, and tart passionfruit cold-marbled into chewy golden caramel.',
    provide_card2_title: 'Normandy Butter & Milk Toffees',
    provide_card2_tag: '84% European Cultured Butter',
    provide_card2_desc: 'Classic slow-cooked golden caramel with fleur de sel, rich milk crumb, and delicate roasted caramel notes.',
    provide_card3_title: 'Coffee Bonbons & Belgian Cocoa Eclairs',
    provide_card3_tag: 'Arabica Espresso & 64% Cocoa',
    provide_card3_desc: 'Freshly roasted Arabica espresso infusion and molten Belgian dark chocolate cores enveloped in soft toffee.',
    provide_card4_title: 'The Harvest Box & Tasting Tins',
    provide_card4_tag: 'Luxury 20-Piece Gift Sets',
    provide_card4_desc: 'Curated assortments in our signature embossed luxury canisters, perfect for gifting and special celebrations.',
    provide_card5_title: 'Cold-Chain Express Delivery',
    provide_card5_tag: 'All 27 Egyptian Governorates',
    provide_card5_desc: 'Shipped in proprietary thermal-insulated foil cooler bags with frozen gel packs to preserve fresh chew texture.',
    provide_card6_title: 'Corporate & Hospitality Gifting',
    provide_card6_tag: 'Custom Branding & Bulk Atelier Rates',
    provide_card6_desc: 'Bespoke confectionery programs for five-star hotels, luxury cafes, VIP weddings, and executive corporate gifts.',

    // Sensory Anatomy (The 45s Chew Curve)
    anatomy_badge: 'Sensory Science',
    anatomy_title: 'The 45-Second Signature Chew Curve',
    anatomy_subtitle: 'Unlike ordinary candies that stick to your teeth, toomakt undergoes a calculated 4-stage sensory journey.',
    anatomy_stage1_time: '00s - 10s',
    anatomy_stage1_title: 'Initial Golden Snap & Butter Aroma',
    anatomy_stage1_desc: 'Firm upon first bite, releasing warm notes of toasted sweet cream butter and browned vanilla.',
    anatomy_stage2_time: '10s - 25s',
    anatomy_stage2_title: 'Velvety Body-Heat Meltdown',
    anatomy_stage2_desc: 'The toffee relaxes into a silky, luscious cream without sticking or tugging on teeth.',
    anatomy_stage3_time: '25s - 40s',
    anatomy_stage3_title: 'Explosive Real Fruit Burst',
    anatomy_stage3_desc: 'Pockets of cold-macerated fruit purée burst open with vibrant natural acidity and true orchard aroma.',
    anatomy_stage4_time: '40s - 45s',
    anatomy_stage4_title: 'Pristine Clean Palate Finish',
    anatomy_stage4_desc: 'Dissolves completely clean, leaving a lingering memory of pure dairy richness and fresh fruit nectar.',

    // Egyptian Delivery & Governorates
    delivery_badge: 'Atelier To Your Door',
    delivery_title: 'Fresh From Our Cairo Atelier to All 27 Governorates in Egypt',
    delivery_subtitle: 'Shipped exclusively in insulated cooler bags so your toffee arrives in pristine tasting condition.',
    delivery_fast: 'Express 24-48h Delivery',
    delivery_fast_desc: 'Cairo, Giza & Alexandria within 24 hours. Delta & Upper Egypt within 48 hours.',
    delivery_cooler: 'Insulated Cold-Pack Bags',
    delivery_cooler_desc: 'Guaranteed protection against heat and humidity during transit.',
    delivery_cod: 'Cash on Delivery (COD)',
    delivery_cod_desc: 'Pay cash upon arrival with inspection before acceptance.',

    // Reviews & Social Proof
    reviews_badge: 'Verified Connoisseurs',
    reviews_title: 'Loved by Discerning Confectionery Lovers Across Egypt',
    review1_quote: 'The texture is astonishing. It never sticks to your teeth like ordinary toffee, and you can instantly taste the real strawberry purée. My family is completely obsessed.',
    review1_author: 'Farida El-Sayed',
    review1_city: 'Zamalek, Cairo',
    review2_quote: 'Ordered the Harvest Box for an Eid celebration. The packaging in the cooler bag was immaculate, and the Alphonso Mango toffee is unlike anything else in Egypt.',
    review2_author: 'Karim Mansour',
    review2_city: 'Gleem, Alexandria',
    review3_quote: 'Finally an Egyptian artisan brand with European standards. Real cultured butter makes all the difference. Beautiful craftsmanship.',
    review3_author: 'Nouran Hegazi',
    review3_city: 'New Cairo',

    // Pack & Content
    pack_pieces: '20 Pieces / Pack',
    pack_inside_title: "What's Inside?",
    pack_inside_desc: '1 Pack = 20 individually wrapped artisanal pieces',
    pack_limit_notice: 'Customer order limit: Maximum 5 packs per item',
    pack_limit_reached: 'Max quantity of 5 packs reached for retail orders',
    btn_add_to_cart: 'Add to Bag',
    btn_buy_now: 'Buy Now',
    btn_added: 'Added to Bag!',

    // Cart Drawer
    cart_title: 'Your Confectionery Bag',
    cart_empty: 'Your shopping bag is empty',
    cart_empty_desc: 'Explore our artisan fruit-marbled toffee confections before proceeding to checkout.',
    cart_explore: 'Explore Confections',
    cart_subtotal: 'Subtotal',
    cart_shipping_calc: 'Calculated at next step for 27 Egyptian Governorates',
    cart_checkout: 'Proceed to Checkout',
    cart_limit_warning: 'Retail customer limit: Max 5 packs per item',

    // Checkout
    checkout_title: 'Checkout & Delivery',
    checkout_subtitle: 'Freshly pulled in our confectionery atelier and delivered straight to your door in Egypt.',
    checkout_back: 'Return to Shopping',
    checkout_egypt_only: 'Shipping Available Exclusively Within Egypt',
    checkout_step1: '1. Contact Details',
    checkout_step2: '2. Delivery Address in Egypt',
    checkout_step3: '3. Payment Method',
    checkout_fullname: 'Full Name',
    checkout_email: 'Email Address',
    checkout_phone: 'Egyptian Mobile Number',
    checkout_governorate: 'Select Egyptian Governorate',
    checkout_city: 'City / District',
    checkout_address: 'Street Address & Details',
    checkout_bldg: 'Building No. (Optional)',
    checkout_apt: 'Apt / Floor (Optional)',
    checkout_notes: 'Delivery Instructions / Notes',
    checkout_cod_title: 'Cash on Delivery (COD)',
    checkout_cod_desc: 'Pay cash upon arrival. Our courier will call before delivery.',
    checkout_place_order: 'Confirm & Place Order',
    checkout_summary_title: 'Order Summary',
    checkout_shipping_fee: 'Shipping Fee',
    checkout_total: 'Total Due (COD)',

    // Order Success
    success_badge: 'Order Confirmed',
    success_title: 'Thank you for your order!',
    success_desc: 'We have received your order. Our confectioners are freshly hand-pulling your batch in the atelier.',
    success_order_number: 'Order Number',
    success_payment_method: 'Payment Method',
    success_destination: 'Destination',
    success_total_due: 'Total Amount Due',
    success_items_title: 'Ordered Confections & Packs',
    success_download_invoice: 'Download Official PDF Invoice',
    success_whatsapp: 'Contact Us on WhatsApp',
    success_continue: 'Continue Shopping',
    success_address: 'Shipping Address',
    success_window: 'Delivery Window',
    success_email_notice: 'Confirmation Email',
    success_cod_notice: 'Payment on Delivery',

    // Wholesale
    wholesale_badge: 'Corporate & Wholesale Atelier Program',
    wholesale_title: 'Wholesale & Bulk Orders',
    wholesale_desc: 'Tailored for luxury retailers, hospitality, boutique cafes, corporate gifting, and distributors across Egypt.',
    wholesale_name: 'Full Name / Contact Person',
    wholesale_company: 'Company / Business Name',
    wholesale_email: 'Business Email',
    wholesale_phone: 'Phone / WhatsApp',
    wholesale_gov: 'Governorate',
    wholesale_qty: 'Estimated Quantity (Packs)',
    wholesale_btn: 'Submit Wholesale Request',
    wholesale_success: 'Thank you! We received your wholesale inquiry.',

    // Footer & Call To Action
    cta_title: 'Experience Pure Confectionery Mastery.',
    cta_subtitle: 'Order fresh from our Cairo atelier or partner with us for corporate gifting and hospitality.',
    cta_btn_shop: 'Shop All Confections',
    cta_btn_wholesale: 'Request Wholesale Quote',
    footer_tagline: 'Artisanal slow-cooked caramel toffee infused with 100% sun-ripened real fruit purées. Handcrafted with European cultured butter in Cairo, Egypt.',
    footer_quick_links: 'Quick Navigation',
    footer_collections: 'Confectionery Collections',
    footer_contact: 'Atelier & Concierge',
    footer_rights: 'All rights reserved. toomakt Artisanal Confectionery.'
  },
  ar: {
    // Brand
    brand_name: 'توماكت',
    brand_tagline: 'حلويات التوفي بالفواكه الطبيعية الفاخرة',
    brand_motto: 'فاكهة طبيعية. كراميل وتوفي أصيل. شغف لا ينتهي.',
    brand_motto_sub: 'مطهو ببطء في مراجل نحاسية ثقيلة مع بيوريه الفواكه الطبيعية 100% والزبدة الأوروبية الفاخرة.',

    // Navigation
    nav_company: 'عن توماكت',
    nav_started: 'مسيرة نشأتنا',
    nav_provide: 'ما نقدمه',
    nav_sensory: 'قوام الـ 45 ثانية',
    nav_shop: 'كل الحلويات',
    nav_vault: 'نكهات حصرية',
    nav_drop: 'جديد',
    nav_tins: 'علب الهدايا',
    nav_story: 'قصتنا وحرفتنا',
    nav_ingredients: 'المكونات النقية',
    nav_track: 'تتبع طلبك',
    nav_wholesale: 'طلبات الجملة والهدايا',
    nav_search: 'بحث عن النكهات',
    nav_wishlist: 'المفضلة',
    nav_bag: 'حقيبة التسوق',
    nav_items_count: 'قطع',
    nav_item_count: 'قطعة',

    // Announcement Bar
    announcement_shipping: 'شحن مبرد مجاني وسريع للطلبات فوق 150 ج.م في جميع أنحاء مصر',
    announcement_chew: 'قوام مضغ ناعم ومميز يدوم 45 ثانية ولا يلتصق بالأسنان',
    announcement_puree: 'بيوريه فواكه طبيعية 100% وزبدة أوروبية فاخرة',
    announcement_track: 'تتبع طلبك',
    announcement_wholesale: 'عروض الجملة والشركات',

    // Hero Section
    hero_badge: 'الميدالية الذهبية للحلويات 2024 • دفعة الصيف الحصرية رقم 08',
    hero_title_1: 'فاكهة حقيقية. توفي أصيل.',
    hero_title_2: 'شغف لا يُقاوم.',
    hero_subtitle: 'أرقى معمل حلويات حرفي في مصر. كراميل ذهبي مطهو ببطء فائق في مراجل نحاسية وممزوج ببيوريه الفواكه الطبيعية الطازجة والزبدة الأوروبية الفاخرة. قوام ساحر لا يُنسى.',
    hero_cta_explore: 'استكشف ما نقدمه',
    hero_cta_story: 'مسيرة نشأتنا وتاريخنا',
    hero_cta_shop: 'تسوق صندوق الحصاد',
    hero_fast_delivery: 'توصيل سريع 24-48 ساعة',
    hero_fast_delivery_sub: 'القاهرة، الإسكندرية وجميع المحافظات',
    hero_cooling: 'شحن في عبوات مبردة',
    hero_cooling_sub: 'حماية كاملة من الحرارة أثناء التوصيل',
    hero_real_butter: '84% زبدة طبيعية',
    hero_real_butter_sub: 'قشطة طبيعية أوروبية فاخرة',
    hero_scroll_hint: 'مرر لأسفل لاكتشاف عالم توماكت الحرفي',

    // Describe the Company ("Who We Are")
    company_badge: 'بيان حرفة توماكت',
    company_title: 'إعادة ابتكار صناعة الحلويات بمكونات طبيعية نقية وحرفة أصيلة.',
    company_p1: 'تأسست توماكت على قناعة راسخة: الحلويات الفاخرة يجب أن تُصنع بمكونات حقيقية دون أدنى مساومة، وبصبر حرفي مطلق وفن طهي أصيل — بعيداً عن النكهات المصنعة أو الشراب الصناعي.',
    company_p2: 'في معملنا بالقاهرة، ندمج تقاليد الطهي الفرنسية العريقة في المراجل النحاسية مع محاصيل البساتين الطبيعية والزبدة الأوروبية الفاخرة. والنتيجة هي تجربة توفي ناعمة، غنية وفاخرة ترتقي بذوقك.',
    company_atelier_batch: 'دفعة معمل القاهرة رقم 08',
    company_atelier_sub: 'يتم سحبها وتجهيزها يدوياً يومياً في مراجل محدودة',
    company_pillar1_title: 'مراجل نحاسية فرنسية',
    company_pillar1_desc: 'طهي هادئ عند 245 درجة فهرنهايت لتحقيق كراميل حريري فائق النعومة لا يلتصق إطلاقاً بالأسنان.',
    company_pillar2_title: 'بيوريه فواكه طبيعية 100%',
    company_pillar2_desc: 'ممزوج بالفراولة المنقوعة، مانجو ألفونسو الغنية، وحمضيات البحر الأبيض المتوسط المشمسة.',
    company_pillar3_title: 'زبدة أوروبية فاخرة',
    company_pillar3_desc: 'حرفة قائمة على زبدة القشطة بنسبة دهن 84% لقوام يذوب في الفم دون استخدام زيوت النخيل المهدرجة.',
    company_pillar4_title: 'قوام الـ 45 ثانية الفريد',
    company_pillar4_desc: 'تدرج حسي متقن يبدأ بدسامة الزبدة الذهبية وينفجر بنكهة الفاكهة الطبيعية وينتهي بنقاء تام.',
    company_btn_story: 'اقرأ قصتنا الكاملة',
    company_btn_offerings: 'استكشف ما نقدمه',

    // When We Started (Heritage Timeline)
    timeline_badge: 'مسيرة المعمل والنشأة',
    timeline_title: 'مسيرة نشأتنا: من مرجل نحاسي صغير إلى أرقى معمل حلويات حرفي في مصر',
    timeline_subtitle: 'القصة الحرفية وراء كل قطعة مغلفة بعناية من حلويات توماكت.',
    timeline_2021_year: '2021 — الشرارة والبداية',
    timeline_2021_title: 'التمرد على الحلويات الصناعية والكيماويات',
    timeline_2021_desc: 'انطلاقاً من استياء مؤسسينا من النكهات الاصطناعية والألوان الكيميائية وشراب الذرة التي أغرقت الأسواق، بدأنا في القاهرة بإعادة إحياء صناعة الحلويات كما كان يفعل طهاة الحلويات الفرنسيون قبل قرنين — بمراجل نحاسية أصلية ومحاصيل بساتين حقيقية.',
    timeline_2022_year: '2022 — الابتكار الحسي',
    timeline_2022_title: 'ابتكار قوام الـ 45 ثانية غير اللاصق',
    timeline_2022_desc: 'بعد أكثر من 180 تجربة معملية ودفعات صغيرة في القاهرة، توصلنا إلى معادلة الحرارة والقوام المثالية: توفي يعطي قرمشة خفيفة أولى، ثم يذوب في كراميل زبدي مخملي، ويتحلل تماماً دون أن يعلق بالأسنان.',
    timeline_2023_year: '2023 — اللوجستيات الذكية',
    timeline_2023_title: 'ابتكار الشحن المبرد الرائد لجميع محافظات مصر',
    timeline_2023_desc: 'لحماية قطع التوفي الحساسة المصنوعة من الزبدة الطبيعية من حرارة الصيف المصري، صممنا أكياس وعبوات الشحن الحرارية المبردة بحزم التبريد، لضمان وصول الحلويات طازجة بحالتها المثالية لـ 27 محافظة.',
    timeline_2024_year: '2024 — التتويج والانتشار',
    timeline_2024_title: 'الميدالية الذهبية للحلويات وإطلاق عيلة توماكت الكاملة',
    timeline_2024_desc: 'الحصول على الميدالية الذهبية للحلويات 2024 وتوسيع التشكيلة إلى عيلة توماكت الكاملة: توفي الفواكه، توفي زبدة نورماندي، بونبون القهوة العربي، وإكلير الشوكولاتة البلجيكية.',
    timeline_quote: '“عندما تتذوق الزبدة الطبيعية وبيوريه الفواكه الحقيقي المطهو ببطء في النحاس، فلن تنظر أبداً إلى الحلويات المصنعة بنفس الطريقة مجدداً.”',
    timeline_quote_author: '— معمل توماكت الحرفي للحلويات، القاهرة',

    // What We Provide (Offerings & Products)
    provide_badge: 'إبداعات وتشكيلات توماكت',
    provide_title: 'ما نقدمه: حلويات وُلدت من النقاء والشغف الحرفي',
    provide_subtitle: 'استكشف تشكيلاتنا الفاخرة — المصنوعة طازجة يومياً في دفعات معملية محدودة.',
    provide_tab_all: 'كل الإبداعات',
    provide_tab_fruity: 'توفي الفواكه الطبيعية',
    provide_tab_butter: 'توفي زبدة نورماندي والحليب',
    provide_tab_boxes: 'صناديق الحصاد والهدايا',
    provide_tab_wholesale: 'الشركات والفنادق والجملة',

    provide_card1_title: 'توفي وكاندي الفواكه الطازجة',
    provide_card1_tag: 'بيوريه فواكه طبيعية 100%',
    provide_card1_desc: 'فراولة برية، مانجو ألفونسو ناضجة، وباشن فروت ممزوجة بطبقات الكراميل الذهبي اللذيذ.',
    provide_card2_title: 'توفي زبدة نورماندي والحليب الأصيل',
    provide_card2_tag: '84% زبدة أوروبية فاخرة',
    provide_card2_desc: 'كراميل ذهبي مطهو ببطء مع لمسة زهرة الملح، حليب مكثف طازج، ونكهات التوفي المحمصة.',
    provide_card3_title: 'بونبون القهوة وإكلير الكاكاو البلجيكي',
    provide_card3_tag: 'إسبريسو أرابيكا وشوكولاتة 64%',
    provide_card3_desc: 'خلاصة قهوة الأرابيكا المحمصة طازجة وقلب الشوكولاتة الداكنة البلجيكية داخل توفي فائق النعومة.',
    provide_card4_title: 'صندوق الحصاد وعلب الهدايا الفاخرة',
    provide_card4_tag: 'مجموعات هدايا فاخرة من 20 قطعة',
    provide_card4_desc: 'تشكيلات منتقاة بعناية في علبنا الأنيقة المحفورة، الخيار الأمثل للهدايا والمناسبات الراقية.',
    provide_card5_title: 'توصيل مبرد سريع لجميع المحافظات',
    provide_card5_tag: 'يغطي 27 محافظة مصرية',
    provide_card5_desc: 'تغليف خاص في حقائب عازلة ومبردة للحفاظ على قوام التوفي الطازج من حرارة الجو.',
    provide_card6_title: 'توريد الشركات والفنادق الراقية',
    provide_card6_tag: 'تغليف خاص وأسعار جملة حصرية',
    provide_card6_desc: 'برامج توريد مخصصة للفنادق الفاخرة، كافيهات البوتيك، هدايا حفلات الزفاف، والشركات الكبرى.',

    // Sensory Anatomy (The 45s Chew Curve)
    anatomy_badge: 'علم الحواس والذوق',
    anatomy_title: 'قوام الـ 45 ثانية: رحلة الحواس الأربعة',
    anatomy_subtitle: 'على عكس الحلويات المعتادة التي تلتصق بالأسنان، يخوض توماكت رحلة حسية مدروسة على 4 مراحل.',
    anatomy_stage1_time: '00 ث - 10 ث',
    anatomy_stage1_title: 'القرمشة الأولى وعبير الزبدة المحمصة',
    anatomy_stage1_desc: 'قوام متماسك عند القَضمة الأولى، يُطلق عبير الزبدة الطبيعية والفانيليا الدافئة.',
    anatomy_stage2_time: '10 ث - 25 ث',
    anatomy_stage2_title: 'الذوبان الحريري بفعل دفء الفم',
    anatomy_stage2_desc: 'يسترخي التوفي ليتحول إلى كريمة كراميل ناعمة مخملية دون أي التصاق بالأسنان.',
    anatomy_stage3_time: '25 ث - 40 ث',
    anatomy_stage3_title: 'انفجار نكهة الفاكهة الطبيعية الحقيقية',
    anatomy_stage3_desc: 'تنطلق طبقات بيوريه الفاكهة الطبيعية بحموضتها المنعشة وعطر بساتين الفواكه الأصيلة.',
    anatomy_stage4_time: '40 ث - 45 ث',
    anatomy_stage4_title: 'النهاية النقية التامة للفم',
    anatomy_stage4_desc: 'يذوب التوفي بالكامل ويترك الفم نظيفاً مع أثر مذاق الزبدة الطبيعية وعسل الفواكه.',

    // Egyptian Delivery & Governorates
    delivery_badge: 'من المعمل حتى باب بيتك',
    delivery_title: 'طازج من معملنا في القاهرة إلى 27 محافظة في مصر',
    delivery_subtitle: 'شحن حصري في عبوات وأكياس مبردة وعازلة لضمان وصول الحلويات بأفضل جودة ممكنة.',
    delivery_fast: 'توصيل سريع خلال 24-48 ساعة',
    delivery_fast_desc: 'القاهرة والجيزة والإسكندرية خلال 24 ساعة. محافظات الدلتا والصعيد خلال 48 ساعة.',
    delivery_cooler: 'حقائب شحن مبردة عازلة',
    delivery_cooler_desc: 'حماية مؤكدة ضد الحرارة والرطوبة أثناء نقل الطلبات.',
    delivery_cod: 'الدفع عند الاستلام (كاش)',
    delivery_cod_desc: 'ادفع نقداً لمندوب الشحن بعد معاينة سلامة الشحنة.',

    // Reviews & Social Proof
    reviews_badge: 'آراء الذواقة في مصر',
    reviews_title: 'نال إعجاب عشاق الحلويات الفاخرة في جميع المحافظات',
    review1_quote: 'القوام مبهر جداً! لا يلتصق بالأسنان إطلاقاً مثل التوفي العادي، ونكهة الفراولة الطبيعية واضحة جداً وطازجة. عائلتي أصبحت مدمنة عليه.',
    review1_author: 'فريدة السيد',
    review1_city: 'الزمالك، القاهرة',
    review2_quote: 'طلبت صندوق الحصاد لعزومة العيد. التغليف المبرد كان في منتهى الاحترافية، وتوفي مانجو ألفونسو لا مثيل له في مصر كلها.',
    review2_author: 'كريم منصور',
    review2_city: 'جليم، الإسكندرية',
    review3_quote: 'أخيراً براند مصري حرفي بمواصفات أوروبية حقيقية. الزبدة الطبيعية بتفرق جداً في الطعم والقوام. شغل راقي ومحترم.',
    review3_author: 'نوران حجازي',
    review3_city: 'القاهرة الجديدة',

    // Pack & Content
    pack_pieces: '20 قطعة في العبوة',
    pack_inside_title: 'محتويات العبوة',
    pack_inside_desc: 'العبوة الواحدة = 20 قطعة فاخرة مغلفة كل واحدة على حدة',
    pack_limit_notice: 'حد طلب العملاء: أقصى كمية 5 عبوات لكل صنف',
    pack_limit_reached: 'تم الوصول للحد الأقصى للطلب الفردي (5 عبوات)',
    btn_add_to_cart: 'أضف للسلة',
    btn_buy_now: 'شراء الآن',
    btn_added: 'تمت الإضافة للسلة!',

    // Cart Drawer
    cart_title: 'حقيبة المشتريات',
    cart_empty: 'حقيبة التسوق فارغة حالياً',
    cart_empty_desc: 'استكشف تشكيلات التوفي الفاخرة بالفواكه الطبيعية قبل إتمام طلبك.',
    cart_explore: 'تصفح التشكيلات',
    cart_subtotal: 'المجموع الفرعي',
    cart_shipping_calc: 'يتم احتساب رسوم الشحن في الخطوة التالية لـ 27 محافظة مصرية',
    cart_checkout: 'المتابعة لإتمام الطلب',
    cart_limit_warning: 'حد الطلب للأفراد: 5 عبوات كحد أقصى لكل صنف',

    // Checkout
    checkout_title: 'إتمام الطلب والتوصيل',
    checkout_subtitle: 'يتم تجهيز طلبك طازجاً في معملنا الحرفي ويصلك مباشرة حتى باب منزلك في مصر.',
    checkout_back: 'العودة للتسوق',
    checkout_egypt_only: 'الشحن متاح حصرياً لجميع محافظات جمهورية مصر العربية',
    checkout_step1: '1. بيانات العميل',
    checkout_step2: '2. عنوان التوصيل في مصر',
    checkout_step3: '3. طريقة الدفع',
    checkout_fullname: 'الاسم بالكامل',
    checkout_email: 'البريد الإلكتروني',
    checkout_phone: 'رقم الموبايل المصري',
    checkout_governorate: 'اختر المحافظة المصرية',
    checkout_city: 'المدينة / المنطقة',
    checkout_address: 'العنوان التفصيلي واسم الشارع',
    checkout_bldg: 'رقم العمارة (اختياري)',
    checkout_apt: 'رقم الشقة / الدور (اختياري)',
    checkout_notes: 'ملاحظات خاصة للمندوب',
    checkout_cod_title: 'الدفع عند الاستلام (كاش)',
    checkout_cod_desc: 'الدفع نقداً عند استلام شحنتك. سيتصل بك مندوب الشحن قبل الوصول.',
    checkout_place_order: 'تأكيد وإرسال الطلب',
    checkout_summary_title: 'ملخص الطلب',
    checkout_shipping_fee: 'رسوم الشحن',
    checkout_total: 'الإجمالي المستحق (عند الاستلام)',

    // Order Success
    success_badge: 'تم تأكيد طلبك بنجاح',
    success_title: 'شكراً لطلبك من توماكت!',
    success_desc: 'تم استلام طلبك بنجاح. طهاتنا الحرفيون يقومون الآن بسحب وتجهيز دفعتك الطازجة.',
    success_order_number: 'رقم الطلب',
    success_payment_method: 'طريقة الدفع',
    success_destination: 'وجهة التوصيل',
    success_total_due: 'الإجمالي المستحق',
    success_items_title: 'الحلويات والعبوات المطلوبة',
    success_download_invoice: 'تحميل الفاتورة الرسمية PDF',
    success_whatsapp: 'تواصل معنا مباشرة عبر واتساب',
    success_continue: 'متابعة التسوق',
    success_address: 'عنوان الشحن والتسليم',
    success_window: 'موعد التوصيل المتوقع',
    success_email_notice: 'تأكيد البريد الإلكتروني',
    success_cod_notice: 'الدفع نقداً للمندوب',

    // Wholesale
    wholesale_badge: 'برنامج توريد الجملة والشركات',
    wholesale_title: 'طلبات الجملة والتوريد التجاري',
    wholesale_desc: 'حلول مخصصة للمتاجر الفاخرة، الفنادق والمقاهي، هدايا الشركات والموزعين في مصر.',
    wholesale_name: 'اسم المسؤول / جهة الاتصال',
    wholesale_company: 'اسم الشركة أو النشاط التجاري',
    wholesale_email: 'البريد الإلكتروني للعمل',
    wholesale_phone: 'رقم الهاتف / واتساب',
    wholesale_gov: 'المحافظة',
    wholesale_qty: 'الكمية التقديرية (بالعبوة)',
    wholesale_btn: 'إرسال طلب عرض أسعار الجملة',
    wholesale_success: 'شكراً لك! تلقينا طلبك بنجاح وسيتواصل معك فريقنا قريباً.',

    // Footer & Call To Action
    cta_title: 'عِش تجربة الحرفة الحقيقية للحلويات.',
    cta_subtitle: 'اطلب دفعتك الطازجة مباشرة من معملنا في القاهرة أو تواصل معنا لطلبات الشركات والمناسبات.',
    cta_btn_shop: 'تصفح جميع الحلويات',
    cta_btn_wholesale: 'طلب عرض أسعار جملة',
    footer_tagline: 'كراميل وتوفي فاخر مطهو ببطء مع بيوريه الفواكه الطبيعية 100% والزبدة الأوروبية الطبيعية. مصنوع يدوياً في القاهرة، مصر.',
    footer_quick_links: 'روابط سريعة',
    footer_collections: 'تشكيلات الحلويات',
    footer_contact: 'المعمل وخدمة العملاء',
    footer_rights: 'جميع الحقوق محفوظة. حلويات توماكت الحرفية.'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('toomakt_lang');
      if (saved === 'ar' || saved === 'en') return saved;
    } catch {}
    return 'en';
  });

  const direction: Direction = language === 'ar' ? 'rtl' : 'ltr';
  const isRtl = direction === 'rtl';

  useEffect(() => {
    try {
      localStorage.setItem('toomakt_lang', language);
    } catch {}

    // Apply document-level language & direction
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
    if (language === 'ar') {
      document.documentElement.classList.add('rtl-mode');
    } else {
      document.documentElement.classList.remove('rtl-mode');
    }
  }, [language, direction]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState(prev => (prev === 'en' ? 'ar' : 'en'));
  };

  const t = (key: string, fallback?: string): string => {
    const dict = translations[language] || translations.en;
    if (dict[key]) return dict[key];
    const fallbackDict = translations.en;
    if (fallbackDict[key]) return fallbackDict[key];
    return fallback || key;
  };

  const formatPrice = (amount: number): string => {
    if (language === 'ar') {
      return `${amount} ج.م`;
    }
    return `${amount} EGP`;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        direction,
        isRtl,
        setLanguage,
        toggleLanguage,
        t,
        formatPrice
      }}
    >
      <div dir={direction} className={isRtl ? 'font-arabic text-right' : 'font-sans text-left'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
