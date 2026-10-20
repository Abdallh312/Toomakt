import { PRODUCTS } from '../data/toomaktData';

// Bilingual Flavor Mapping (Bidirectional: Arabic <-> English)
const FLAVOR_TRANSLATIONS: Record<string, { ar: string; en: string }> = {
  // 1. Cappuccino Candies
  'سائل القهوة الإيطالية': {
    ar: 'سائل القهوة الإيطالية',
    en: 'Italian Coffee Liquid',
  },
  'كابتشينو بالكريمة': {
    ar: 'كابتشينو بالكريمة',
    en: 'Cappuccino with Cream',
  },
  'كابتشينو وسائل قهوة طبيعية': {
    ar: 'كابتشينو وسائل قهوة طبيعية',
    en: 'Cappuccino & Natural Coffee Liquid',
  },

  // 2. Milk Toffee (Center Milk)
  'حليب طبيعي كامل الدسم': {
    ar: 'حليب طبيعي كامل الدسم',
    en: 'Full-Cream Natural Milk',
  },
  'فانيليا ناعمة': {
    ar: 'فانيليا ناعمة',
    en: 'Velvety Vanilla',
  },
  'توفي حليب وكريمة فانيليا': {
    ar: 'توفي حليب وكريمة فانيليا',
    en: 'Milk Toffee & Vanilla Cream',
  },

  // 3. Eclairs 0.5 EGP
  'شوكولاتة سائلة كلاسيك': {
    ar: 'شوكولاتة سائلة كلاسيك',
    en: 'Classic Molten Chocolate',
  },
  'اكلير زبدة محشو شوكولاتة': {
    ar: 'اكلير زبدة محشو شوكولاتة',
    en: 'Butter Eclair & Molten Chocolate',
  },

  // 4. Butter Eclairs 1 EGP
  'زبدة وشوكولاتة سائلة': {
    ar: 'زبدة وشوكولاتة سائلة',
    en: 'Pure Butter & Molten Chocolate',
  },
  'زبدة فاخرة وشوكولاتة سائلة': {
    ar: 'زبدة فاخرة وشوكولاتة سائلة',
    en: 'Luxury Butter & Molten Chocolate',
  },

  // 5 & 6. Fruit Toffees
  'فراولة (Strawberry)': {
    ar: 'فراولة (Strawberry)',
    en: 'Alpine Strawberry',
  },
  'ليمون (Lemon)': {
    ar: 'ليمون (Lemon)',
    en: 'Sicilian Lemon',
  },
  'تفاح أخضر (Green Apple)': {
    ar: 'تفاح أخضر (Green Apple)',
    en: 'Crisp Green Apple',
  },
  'فواكه مشكلة طبيعية': {
    ar: 'فواكه مشكلة طبيعية',
    en: 'Natural Mixed Fruits',
  },
  'عسل الفواكه المشكلة': {
    ar: 'عسل الفواكه المشكلة',
    en: 'Wild Mixed Fruit Honey',
  },
  'فواكه مشكلة عسلية': {
    ar: 'فواكه مشكلة عسلية',
    en: 'Honey Glazed Orchard Fruits',
  },

  // 7. Peanut Chocolate 0.5 EGP
  'فول سوداني وشوكولاتة': {
    ar: 'فول سوداني وشوكولاتة',
    en: 'Roasted Peanut & Chocolate',
  },
  'توفي زبدة بفول سوداني وشوكولاتة': {
    ar: 'توفي زبدة بفول سوداني وشوكولاتة',
    en: 'Butter Toffee with Peanut & Chocolate',
  },

  // 8. Peanut Eclairs 1 EGP
  'فول سوداني وكاكاو داكن': {
    ar: 'فول سوداني وكاكاو داكن',
    en: 'Roasted Peanut & Dark Cocoa',
  },
  'اكلير كاكاو وفول سوداني': {
    ar: 'اكلير كاكاو وفول سوداني',
    en: 'Cocoa Eclair & Crunchy Peanut',
  },

  // 9. Butterm Caramel
  'كراميل الزبدة الفاخر': {
    ar: 'كراميل الزبدة الفاخر',
    en: 'Luxury Butter Caramel',
  },
  'بونبون زبدة الحليب بكراميل ناعم': {
    ar: 'بونبون زبدة الحليب بكراميل ناعم',
    en: 'Butter Milk Bonbon with Soft Caramel',
  },

  // 10. Coconut Chocolate 1 EGP
  'جوز هند وشوكولاتة': {
    ar: 'جوز هند وشوكولاتة',
    en: 'Tropical Coconut & Chocolate',
  },
  'توفي حليب وجوز هند وشوكولاتة': {
    ar: 'توفي حليب وجوز هند وشوكولاتة',
    en: 'Milk Toffee with Coconut & Chocolate',
  },

  // 11. Mint Fruit (Tomald)
  'نعناع منعش بالفواكه': {
    ar: 'نعناع منعش بالفواكه',
    en: 'Refreshing Mint & Summer Fruits',
  },
  'نعناع بارد وفواكه صيفية': {
    ar: 'نعناع بارد وفواكه صيفية',
    en: 'Cool Mint & Summer Fruits',
  },

  // 12. Fruity Milk Cream (Econocal)
  'بطعم الموز': {
    ar: 'بطعم الموز',
    en: 'Sweet Cream Banana',
  },
  'بطعم الفراولة': {
    ar: 'بطعم الفراولة',
    en: 'Wild Cream Strawberry',
  },
  'بطعم الكنتالوب': {
    ar: 'بطعم الكنتالوب',
    en: 'Fresh Cantaloupe Cream',
  },
  'فواكه مشكلة وكريمة حليب': {
    ar: 'فواكه مشكلة وكريمة حليب',
    en: 'Mixed Fruits & Milk Cream',
  },

  // 13. Butter Chocolate Royal Blue
  'شوكولاتة زبدة رويال': {
    ar: 'شوكولاتة زبدة رويال',
    en: 'Royal Butter Chocolate',
  },
  'توفي زبدة وشوكولاتة ملكية': {
    ar: 'توفي زبدة وشوكولاتة ملكية',
    en: 'Royal Butter Toffee & Chocolate',
  },

  // 14. Zahra Butter Bonbon Chocolate
  'شوكولاتة وكاكاو زهرة': {
    ar: 'شوكولاتة وكاكاو زهرة',
    en: 'Zahra Chocolate & Dark Cocoa',
  },
  'بونبون زبدة وكاكاو غني': {
    ar: 'بونبون زبدة وكاكاو غني',
    en: 'Butter Bonbon & Rich Cocoa',
  },
};

// Fallback direct product name dictionary for exact Arabic titles stored in Supabase
const KNOWN_ARABIC_TITLES_TO_ENGLISH: Record<string, string> = {
  'بونبون كباتشينو والقهوة محشو سائل القهوة الطبيعية': 'Cappuccino & Coffee Bonbon Stuffed with Coffee Liquid',
  'بونبون كابتشينو وقهوة محشو بسائل القهوة الطبيعية': 'Cappuccino & Coffee Bonbon Stuffed with Coffee Liquid',
  'بونبون كباتشينو والقهوة الفاخر': 'Cappuccino & Coffee Bonbon Stuffed with Coffee Liquid',
  'توفي حليب محشو باللبن الطبيعي والفانيليا الفاخرة': 'Milk Toffee Stuffed with Natural Milk & Vanilla (Center Milk)',
  'توفي حليب جودة أوروبا': 'Milk Toffee Stuffed with Natural Milk & Vanilla (Center Milk)',
  'توفي اكلير محشو شوكولاتة': 'Eclairs Toffee Stuffed with Chocolate',
  'توفي اكلير زبدة محشو بالشوكولاتة': 'Butter Eclairs Toffee with Chocolate Filling',
  'توفي بنكهة الفواكه الطبيعية محشو بعسل الفواكه': 'Fruit Flavored Toffee Stuffed with Fruit Honey',
  'توفي بنكهة الفواكه محشو بعسل الفواكه (قطعة كبيرة فئة 1 جنيه)': 'Fruit Flavored Toffee Stuffed with Fruit Honey (Large Piece)',
  'توفي زبدة محشو بالفول السوداني والشوكولاتة': 'Butter Toffee Stuffed with Peanuts & Chocolate',
  'توفي اكلير بالكاكاو محشو بالفول السوداني': 'Peanut & Cocoa Eclairs Toffee',
  'بونبون زبدة محشو كراميل (توماكت بترم)': 'Buttermilk Candy Stuffed with Caramel (Toomakt Butterm)',
  'توفي حليب محشو بجوز الهند والشوكولاتة': 'Coconut & Cocoa Toffee Stuffed with Chocolate',
  'بونبون بنكهة النعناع المنعش والفواكه (تومالد)': 'Refreshing Mint & Fruit Bonbon (Tomald)',
  'بونبون بنكهة الفواكه الطبيعية وكريمة الحليب': 'Fruity Candy with Milk Cream (Econocal)',
  'توفي زبدة محشو بالشوكولاتة (رويال بلو)': 'Butter Toffee Filled with Chocolate (Royal Blue)',
  'بونبون زبدة محشو شوكولاتة وكاكاو (زهرة توماكت)': 'Zahra Butter Bonbon Stuffed with Chocolate & Cacao',
};

/**
 * Find matching master product from static catalog by ID, slug, SKU, or name
 */
export function findCatalogProduct(product: any) {
  if (!product) return null;
  const targetId = product.id || product.slug;
  const targetSlug = product.slug || product.id;
  const targetSku = product.sku;
  const targetName = product.name || product.title;

  return PRODUCTS.find((p) => {
    if (targetId && (p.id === targetId || p.slug === targetId)) return true;
    if (targetSlug && (p.slug === targetSlug || p.id === targetSlug)) return true;
    if (targetSku && p.sku === targetSku) return true;
    if (targetName && (p.name === targetName || p.name_ar === targetName || p.name_en === targetName)) return true;
    return false;
  }) || null;
}

/**
 * Returns localized product name based on current language
 */
export function getProductDisplayName(product: any, isRtl: boolean): string {
  if (!product) return '';

  if (isRtl) {
    return product.name_ar || product.name || product.title || '';
  }

  // English mode
  // 1. Explicit name_en if valid and not identical to an Arabic name
  if (product.name_en && !/[\u0600-\u06FF]/.test(product.name_en)) {
    return product.name_en;
  }

  // 2. Direct catalog match
  const master = findCatalogProduct(product);
  if (master?.name_en) {
    return master.name_en;
  }

  // 3. Known Arabic database title lookup
  const rawName = product.name || product.title || '';
  if (KNOWN_ARABIC_TITLES_TO_ENGLISH[rawName]) {
    return KNOWN_ARABIC_TITLES_TO_ENGLISH[rawName];
  }

  // Partial keyword matches for Arabic titles
  if (/كابتشينو|كباتشينو/i.test(rawName)) return 'Cappuccino & Coffee Bonbon Stuffed with Coffee Liquid';
  if (/سنتر ميلك|حليب/i.test(rawName) && /فانيليا/i.test(rawName)) return 'Milk Toffee Stuffed with Natural Milk & Vanilla (Center Milk)';
  if (/اكلير/i.test(rawName) && /زبدة/i.test(rawName)) return 'Butter Eclairs Toffee with Chocolate Filling';
  if (/اكلير/i.test(rawName) && /شوكولاتة/i.test(rawName)) return 'Eclairs Toffee Stuffed with Chocolate';
  if (/بترم/i.test(rawName) || /كراميل/i.test(rawName)) return 'Buttermilk Candy Stuffed with Caramel (Toomakt Butterm)';
  if (/تومالد|نعناع/i.test(rawName)) return 'Refreshing Mint & Fruit Bonbon (Tomald)';
  if (/فواكه.*عسل/i.test(rawName)) return 'Fruit Flavored Toffee Stuffed with Fruit Honey';
  if (/فول سوداني.*كاكاو/i.test(rawName)) return 'Peanut & Cocoa Eclairs Toffee';
  if (/فول سوداني.*شوكولاتة/i.test(rawName)) return 'Butter Toffee Stuffed with Peanuts & Chocolate';
  if (/جوز هند/i.test(rawName)) return 'Coconut & Cocoa Toffee Stuffed with Chocolate';
  if (/رويال/i.test(rawName)) return 'Butter Toffee Filled with Chocolate (Royal Blue)';
  if (/زهرة/i.test(rawName)) return 'Zahra Butter Bonbon Stuffed with Chocolate & Cacao';

  return rawName;
}

/**
 * Returns localized flavor name based on current language
 */
export function getFlavorDisplayName(flavor: string | undefined | null, isRtl: boolean): string {
  if (!flavor) return '';

  const trimmed = flavor.trim();

  // Check dictionary
  const entry = FLAVOR_TRANSLATIONS[trimmed];
  if (entry) {
    return isRtl ? entry.ar : entry.en;
  }

  // Check reverse (English passed, need Arabic)
  const reverseEntry = Object.values(FLAVOR_TRANSLATIONS).find(
    (e) => e.en.toLowerCase() === trimmed.toLowerCase()
  );
  if (reverseEntry) {
    return isRtl ? reverseEntry.ar : reverseEntry.en;
  }

  // If in English mode and string contains Arabic letters, do smart keyword fallback
  if (!isRtl && /[\u0600-\u06FF]/.test(trimmed)) {
    if (/كابتشينو.*كريمة|كريمة/i.test(trimmed)) return 'Cappuccino with Cream';
    if (/سائل القهوة|قهوة/i.test(trimmed)) return 'Italian Coffee Liquid';
    if (/حليب|لبن/i.test(trimmed)) return 'Full-Cream Natural Milk';
    if (/فانيليا/i.test(trimmed)) return 'Velvety Vanilla';
    if (/شوكولاتة/i.test(trimmed) && /زبدة/i.test(trimmed)) return 'Pure Butter & Molten Chocolate';
    if (/شوكولاتة/i.test(trimmed)) return 'Classic Molten Chocolate';
    if (/فراولة/i.test(trimmed)) return 'Alpine Strawberry';
    if (/ليمون/i.test(trimmed)) return 'Sicilian Lemon';
    if (/تفاح/i.test(trimmed)) return 'Crisp Green Apple';
    if (/كراميل/i.test(trimmed)) return 'Luxury Butter Caramel';
    if (/نعناع/i.test(trimmed)) return 'Refreshing Mint';
    if (/موز/i.test(trimmed)) return 'Sweet Banana';
    if (/كنتالوب/i.test(trimmed)) return 'Fresh Cantaloupe';
    if (/جوز هند/i.test(trimmed)) return 'Tropical Coconut';
    if (/فول سوداني/i.test(trimmed)) return 'Roasted Peanut';
    if (/عسل/i.test(trimmed)) return 'Orchard Honey';
  }

  return trimmed;
}

/**
 * Returns localized pack quantity / weight label
 */
export function getProductPackQuantity(product: any, isRtl: boolean): string {
  if (!product) return '250g';
  if (isRtl) {
    return product.pack_quantity_ar || product.pack_quantity || `${product.weight || '250g'}`;
  }
  return product.pack_quantity_en || product.pack_quantity || `${product.weight || '250g'}`;
}

/**
 * Returns localized badge label
 */
export function getProductBadge(product: any, isRtl: boolean): string | undefined {
  if (!product) return undefined;
  if (isRtl) {
    return product.badge_ar || product.badge;
  }
  return product.badge_en || product.badge;
}
