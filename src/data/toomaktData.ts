import { Product, Review, BundleItem } from '../types';

export interface CategoryItem {
  id: string;
  name: string;
  arabicName: string;
}

export const CATEGORIES: CategoryItem[] = [
  { id: 'all', name: 'All', arabicName: 'الكل' },
  { id: 'mango', name: 'Mango', arabicName: 'مانجو' },
  { id: 'berry', name: 'Berry', arabicName: 'توت' },
  { id: 'citrus', name: 'Citrus', arabicName: 'حمضيات' },
  { id: 'gift-boxes', name: 'Gift boxes', arabicName: 'صناديق هدايا' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'mango-sunbeam',
    sku: 'TMK-MANGO-001',
    name: 'Mango Sunbeam',
    tagline: 'Creamy, bright, buttery finish.',
    description: 'Pure Alphonso mango purée slow-simmered with Normandy sweet cream butter into an explosive sunny chew.',
    badge: 'BEST SELLER',
    badgeType: 'gold',
    price: 260.00,
    weight: '250g',
    weight_value: 250,
    weight_unit: 'g',
    box_quantity: 10,
    box_quantity_label: '10 Boxes / Carton',
    pack_quantity: '250g Pouch',
    pack_quantity_pieces: 24,
    flavor: 'Pure Alphonso Mango',
    tasting_notes: ['Alphonso Mango Purée', 'Normandy Sweet Butter', 'Tahitian Vanilla', 'Citrus Zing'],
    status: 'available',
    category: 'mango',
    tags: ['MANGO', 'BEST SELLER'],
    mood: 'SUNSHINE',
    rating: 4.98,
    reviewsCount: 1420,
    chewiness: 9.8,
    fruitImpact: { label: 'Fruit Density', score: 9.9 },
    fruitNotes: ['Alphonso Mango Purée', 'Normandy Sweet Butter', 'Tahitian Vanilla', 'Citrus Zing'],
    image: '/images/products/mango_sunbeam.jpg',
    images: [
      '/images/products/mango_sunbeam.jpg',
      '/images/products/gallery/confection_img_1.jpg',
      '/images/products/gallery/confection_img_2.jpg',
      '/images/products/gallery/confection_img_4.jpg'
    ],
    accentColor: '#FFD147',
    lightBgColor: '#FFFDF5',
    cardBgColor: '#FAF7F2',
    isPopular: true,
    pieces_per_pack: 24,
    stock_quantity: 85,
    in_stock: true,
    available_flavors: ['Alphonso Mango', 'Passion Mango Twist', 'Golden Honey Mango'],
    flavor_images: {
      'Alphonso Mango': '/images/products/mango_sunbeam.jpg',
      'Passion Mango Twist': '/images/products/gallery/confection_img_1.jpg',
      'Golden Honey Mango': '/images/products/gallery/confection_img_4.jpg'
    }
  },
  {
    id: 'berry-afterglow',
    sku: 'TMK-BERRY-002',
    name: 'Berry Afterglow',
    tagline: 'Layered berries, delicate cream.',
    description: 'Cold-macerated wild alpine strawberries, raspberries, and dark forest berries swirling in velvety cultured sweet cream.',
    badge: 'POPULAR',
    badgeType: 'berry',
    price: 220.00,
    weight: '250g',
    weight_value: 250,
    weight_unit: 'g',
    box_quantity: 10,
    box_quantity_label: '10 Boxes / Carton',
    pack_quantity: '250g Pouch',
    pack_quantity_pieces: 24,
    flavor: 'Dark Forest Blackberry',
    tasting_notes: ['Wild Alpine Strawberries', 'Tart Forest Raspberries', 'Cultured European Cream'],
    status: 'available',
    category: 'berry',
    tags: ['BERRY', 'ORGANIC'],
    mood: 'SERENITY',
    rating: 4.99,
    reviewsCount: 1890,
    chewiness: 10.0,
    fruitImpact: { label: 'Berry Burst', score: 9.9 },
    fruitNotes: ['Wild Alpine Strawberries', 'Tart Forest Raspberries', 'Cultured European Cream'],
    image: '/images/products/berry_afterglow.jpg',
    images: [
      '/images/products/berry_afterglow.jpg',
      '/images/products/gallery/confection_img_2.jpg',
      '/images/products/gallery/confection_img_3.jpg',
      '/images/products/gallery/confection_img_5.jpg'
    ],
    accentColor: '#C84B5B',
    lightBgColor: '#FFF8F9',
    cardBgColor: '#FAF7F2',
    isPopular: true,
    pieces_per_pack: 24,
    stock_quantity: 60,
    in_stock: true,
    available_flavors: ['Wild Alpine Strawberry', 'Tart Forest Raspberry', 'Dark Forest Blackberry'],
    flavor_images: {
      'Wild Alpine Strawberry': '/images/products/gallery/confection_img_2.jpg',
      'Tart Forest Raspberry': '/images/products/gallery/confection_img_3.jpg',
      'Dark Forest Blackberry': '/images/products/gallery/confection_img_5.jpg'
    }
  },
  {
    id: 'citrus-comet',
    sku: 'TMK-CITRUS-003',
    name: 'Citrus Comet',
    tagline: 'Bright citrus, sparkling acidity.',
    description: 'A dazzling spark of cold-pressed Mediterranean lemons, sun-warmed limes, and slow-churned butter toffee.',
    badge: 'FRESH PICK',
    badgeType: 'limited',
    price: 210.00,
    weight: '250g',
    weight_value: 250,
    weight_unit: 'g',
    box_quantity: 10,
    box_quantity_label: '10 Boxes / Carton',
    pack_quantity: '250g Pouch',
    pack_quantity_pieces: 24,
    flavor: 'Mediterranean Lime & Lemon',
    tasting_notes: ['Sicilian Lemon Zest', 'Mediterranean Lime Purée', 'Whipped Sweet Butter'],
    status: 'available',
    category: 'citrus',
    tags: ['CITRUS', 'ZESTY'],
    mood: 'ENERGIZING',
    rating: 4.95,
    reviewsCount: 840,
    chewiness: 9.6,
    fruitImpact: { label: 'Citrus Spark', score: 9.8 },
    fruitNotes: ['Sicilian Lemon Zest', 'Mediterranean Lime Purée', 'Whipped Sweet Butter'],
    image: '/images/products/citrus_comet.jpg',
    images: [
      '/images/products/citrus_comet.jpg',
      '/images/products/gallery/confection_img_1.jpg',
      '/images/products/gallery/confection_img_6.jpg',
      '/images/products/gallery/confection_img_7.jpg'
    ],
    accentColor: '#88C057',
    lightBgColor: '#F7FCF2',
    cardBgColor: '#FAF7F2',
    isPopular: false,
    pieces_per_pack: 24,
    available_flavors: ['Sicilian Lemon Zest', 'Mediterranean Lime', 'Yuzu Butter Chew'],
    flavor_images: {
      'Sicilian Lemon Zest': '/images/products/citrus_comet.jpg',
      'Mediterranean Lime': '/images/products/gallery/confection_img_6.jpg',
      'Yuzu Butter Chew': '/images/products/gallery/confection_img_7.jpg'
    }
  },
  {
    id: 'sun-chaser-box',
    sku: 'TMK-SUNCHASER-004',
    name: 'Sun Chaser Box',
    tagline: 'A bright gathering of fruit-forward favorites.',
    description: 'A curated deluxe gift collection featuring our finest fruit toffees in a keepsake gold-embossed presentation box.',
    badge: 'DELUXE BOX',
    badgeType: 'gold',
    price: 1190.00,
    weight: '1000g',
    weight_value: 1000,
    weight_unit: 'g',
    box_quantity: 6,
    box_quantity_label: '6 Boxes / Carton',
    pack_quantity: '48 Pieces',
    pack_quantity_pieces: 48,
    flavor: 'Orchard Assortment Trio',
    tasting_notes: ['Mango Sunbeam', 'Berry Afterglow', 'Citrus Comet', 'Pecan Toffee'],
    status: 'available',
    category: 'gift-boxes',
    tags: ['GIFT BOXES', 'DELUXE'],
    mood: 'CELEBRATION',
    rating: 5.0,
    reviewsCount: 650,
    chewiness: 9.8,
    fruitImpact: { label: 'Full Spectrum', score: 10.0 },
    fruitNotes: ['Mango Sunbeam', 'Berry Afterglow', 'Citrus Comet', 'Pecan Toffee'],
    image: '/images/products/sun_chaser_box.jpg',
    images: [
      '/images/products/sun_chaser_box.jpg',
      '/images/products/gallery/confection_img_1.jpg',
      '/images/products/gallery/confection_img_2.jpg',
      '/images/products/gallery/confection_img_8.jpg'
    ],
    accentColor: '#D4AF37',
    lightBgColor: '#FCFAF2',
    cardBgColor: '#FAF7F2',
    isPopular: true,
    pieces_per_pack: 48,
    available_flavors: ['Harvest Trio (Mango, Berry, Citrus)', 'Orchard Gold (Mango & Apricot)', 'Berry & Butter Harmony'],
    flavor_images: {
      'Harvest Trio (Mango, Berry, Citrus)': '/images/products/sun_chaser_box.jpg',
      'Orchard Gold (Mango & Apricot)': '/images/products/gallery/confection_img_1.jpg',
      'Berry & Butter Harmony': '/images/products/gallery/confection_img_8.jpg'
    }
  },
  {
    id: 'orchard-reserve',
    sku: 'TMK-ORCHARD-005',
    name: 'Orchard Reserve',
    tagline: 'Deep stone fruit, crisp caramel nuance.',
    description: 'Hand-selected autumn orchard plums, apricots, and caramelized honey cream in an artisan wooden keepsake box.',
    badge: 'ARTISAN RESERVE',
    badgeType: 'primary',
    price: 820.00,
    weight: '750g',
    weight_value: 750,
    weight_unit: 'g',
    box_quantity: 6,
    box_quantity_label: '6 Boxes / Carton',
    pack_quantity: '36 Pieces',
    pack_quantity_pieces: 36,
    flavor: 'Damson Plum & Wild Apricot',
    tasting_notes: ['Sun-Dried Apricots', 'Spiced Damson Plum', 'Wild Clover Honey Butter'],
    status: 'available',
    category: 'gift-boxes',
    tags: ['GIFT BOXES', 'RESERVE'],
    mood: 'KEEPSAKE',
    rating: 4.97,
    reviewsCount: 420,
    chewiness: 9.7,
    fruitImpact: { label: 'Rich Orchard', score: 9.9 },
    fruitNotes: ['Sun-Dried Apricots', 'Spiced Damson Plum', 'Wild Clover Honey Butter'],
    image: '/images/products/orchard_reserve.jpg',
    images: [
      '/images/products/orchard_reserve.jpg',
      '/images/products/gallery/confection_img_9.jpg',
      '/images/products/gallery/confection_img_10.jpg',
      '/images/products/gallery/confection_img_11.jpg'
    ],
    accentColor: '#8D6E63',
    lightBgColor: '#FBF8F5',
    cardBgColor: '#FAF7F2',
    isPopular: false,
    pieces_per_pack: 36,
    available_flavors: ['Sun-Dried Apricot & Plum', 'Damson Honey Glaze', 'Velvet Fig & Butter'],
    flavor_images: {
      'Sun-Dried Apricot & Plum': '/images/products/orchard_reserve.jpg',
      'Damson Honey Glaze': '/images/products/gallery/confection_img_9.jpg',
      'Velvet Fig & Butter': '/images/products/gallery/confection_img_10.jpg'
    }
  },
  {
    id: 'evening-citrus',
    sku: 'TMK-EVENING-006',
    name: 'Evening Citrus',
    tagline: 'Blood orange, bergamot, dark molasses.',
    description: 'Late-harvest Sicilian blood orange and floral bergamot infused with golden clover honey and browned butter toffee.',
    badge: 'LIMITED EDITION',
    badgeType: 'limited',
    price: 310.00,
    weight: '250g',
    weight_value: 250,
    weight_unit: 'g',
    box_quantity: 10,
    box_quantity_label: '10 Boxes / Carton',
    pack_quantity: '250g Pouch',
    pack_quantity_pieces: 24,
    flavor: 'Sicilian Blood Orange',
    tasting_notes: ['Sicilian Blood Orange', 'Calabrian Bergamot', 'Raw Cane Molasses'],
    status: 'available',
    category: 'citrus',
    tags: ['CITRUS', 'LIMITED'],
    mood: 'EVENING',
    rating: 4.96,
    reviewsCount: 510,
    chewiness: 9.8,
    fruitImpact: { label: 'Dark Citrus', score: 9.9 },
    fruitNotes: ['Sicilian Blood Orange', 'Calabrian Bergamot', 'Raw Cane Molasses'],
    image: '/images/products/evening_citrus.jpg',
    images: [
      '/images/products/evening_citrus.jpg',
      '/images/products/gallery/confection_img_12.jpg',
      '/images/products/gallery/confection_img_13.jpg',
      '/images/products/gallery/confection_img_14.jpg'
    ],
    accentColor: '#D35400',
    lightBgColor: '#FDF6F0',
    cardBgColor: '#FAF7F2',
    isPopular: false,
    pieces_per_pack: 24,
    stock_quantity: 50,
    in_stock: true,
    available_flavors: ['Sicilian Blood Orange', 'Calabrian Bergamot', 'Molasses Blood Orange'],
    flavor_images: {
      'Sicilian Blood Orange': '/images/products/evening_citrus.jpg',
      'Calabrian Bergamot': '/images/products/gallery/confection_img_12.jpg',
      'Molasses Blood Orange': '/images/products/gallery/confection_img_13.jpg'
    }
  }
];

export const HERO_PRODUCT = PRODUCTS[0];
export const FLAVOR_VAULT_PRODUCTS = PRODUCTS;

export const APPROACH_PILLARS = [
  {
    number: '01',
    title: 'Real fruit',
    arabicTitle: 'فاكهة طبيعية',
    description: 'Bright, natural fruit flavor balanced with a soft, buttery finish.',
    arabicDescription: 'نكهة فاكهة طبيعية نقية متوازنة مع لمسة زبدية أوروبية ناعمة.'
  },
  {
    number: '02',
    title: 'Small batches',
    arabicTitle: 'دفعات صغيرة',
    description: 'Made slowly, laid carefully, so every piece keeps its character.',
    arabicDescription: 'تُصنع ببطء وعناية فائقة، حتى تحافظ كل قطعة على قوامها ونكهتها الفريدة.'
  },
  {
    number: '03',
    title: 'Thoughtful packaging',
    arabicTitle: 'تغليف مدروس',
    description: 'Considered materials and quiet details designed to be kept.',
    arabicDescription: 'مواد قابلة لإعادة التدوير وتفاصيل أنيقة صُممت لتبقى وتُهدى.'
  }
];

export const RITUAL_STEPS = [
  {
    step: '01',
    title: 'Choose a flavor',
    arabicTitle: 'اختر نكهتك',
    description: 'Follow your instinct. From bright Alphonso mango to layered alpine berries.',
    arabicDescription: 'اتبع ذوقك من المانجو الاستوائية المشرقة إلى التوت الجبلي العميق.'
  },
  {
    step: '02',
    title: 'Open slowly',
    arabicTitle: 'افتحها ببطء',
    description: 'Unwrap the quiet fold. Notice the rich fruit aroma before your first bite.',
    arabicDescription: 'افتح الغلاف برفق ولاحظ شذى الفاكهة الطبيعية قبل القرمشة الأولى.'
  },
  {
    step: '03',
    title: 'Take your time',
    arabicTitle: 'تمهل واستمتع',
    description: 'Let the European butter and fruit purée melt across the palate.',
    arabicDescription: 'دع الزبدة الفاخرة وبيوريه الفاكهة يذوبان بهدوء على لسانك.'
  },
  {
    step: '04',
    title: 'Share the goodwill',
    arabicTitle: 'شارك اللحظة',
    description: 'Confectionery made for company, long conversations, and quiet afternoons.',
    arabicDescription: 'حلوى صنعت للمشاركة، والأحاديث الدافئة، ولحظات الاسترخاء.'
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'Nour El-Din',
    location: 'Zamalek, Cairo',
    role: 'Verified Buyer',
    rating: 5,
    title: 'The cleanest fruit toffee I have ever tasted',
    content: 'Nothing like ordinary candy. The Alphonso mango has real acidity and the texture is remarkably smooth. Beautiful packaging as well.',
    productTag: 'Mango Sunbeam'
  },
  {
    id: 'rev-2',
    author: 'Yasmine Mansour',
    location: 'New Cairo',
    role: 'Verified Buyer',
    rating: 5,
    title: 'The Sun Chaser Box made the perfect Ramadan gift',
    content: 'Everyone in our family kept asking where we ordered it from. The gold embossing and variety of fruit flavors are extraordinary.',
    productTag: 'Sun Chaser Box'
  },
  {
    id: 'rev-3',
    author: 'Karim Fakhry',
    location: 'Maadi',
    role: 'Verified Buyer',
    rating: 5,
    title: 'Sophisticated and not overly sugary',
    content: 'You can actually taste the French butter and the citrus zest. Exceptional craft.',
    productTag: 'Citrus Comet'
  }
];

export const GRAND_CAROUSEL_BOX: BundleItem = {
  id: 'sun-chaser-box',
  title: 'Sun Chaser Gift Box',
  category: 'Deluxe Gift Box',
  badge: 'BEST GIFT',
  description: 'A bright gathering of fruit-forward favorites. Twelve individually wrapped confections in an embossed linen gift box.',
  price: 1190.00,
  rating: 5.0,
  reviewCount: 650,
  image: '/images/products/sun_chaser_box.jpg',
  weight: '1000g Deluxe Box',
  pieces_per_pack: 48
};

export const CROWD_FAVORITES_ITEMS: BundleItem[] = [
  {
    id: 'orchard-reserve',
    title: 'Orchard Reserve Box',
    category: 'Keepsake Box',
    badge: 'Artisan',
    description: 'Deep stone fruit, crisp caramel nuance. Eight signature pieces.',
    price: 820.00,
    rating: 4.97,
    reviewCount: 420,
    image: '/images/products/orchard_reserve.jpg',
    weight: '750g Box',
    pieces_per_pack: 36
  },
  {
    id: 'mango-sunbeam',
    title: 'Mango Sunbeam Duo',
    category: 'Duo Pouch',
    badge: 'Bestseller',
    description: 'Two 250g pouches of Alphonso mango purée slow-simmered with Normandy sweet butter.',
    price: 520.00,
    rating: 4.98,
    reviewCount: 1420,
    image: '/images/products/mango_sunbeam.jpg',
    weight: '500g',
    pieces_per_pack: 48
  },
  {
    id: 'evening-citrus',
    title: 'Evening Citrus Collection',
    category: 'Citrus Box',
    badge: 'Limited',
    description: 'Blood orange, bergamot, dark molasses toffee.',
    price: 310.00,
    rating: 4.96,
    reviewCount: 780,
    image: '/images/products/evening_citrus.jpg',
    weight: '250g',
    pieces_per_pack: 24
  }
];
