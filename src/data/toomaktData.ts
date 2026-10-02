import { Product, BundleItem, Review } from '../types';

export interface ProductLine {
  id: string;
  title: string;
  arabicTitle: string;
  category: string;
  description: string;
  image: string;
  highlights: string;
  foilBadge: string;
  tag: string;
  samplePrice: number;
}

export const TOOMAKT_PRODUCT_LINES: ProductLine[] = [
  {
    id: 'fruit-flavors',
    title: 'Fruit Flavors & Fruity Candy',
    arabicTitle: 'توماكت كاندي الفواكه المشكلة',
    category: 'Fruit Toffee / Fruity Candy',
    description: 'High-resolution artisan fruit toffee with vibrant layers of sun-ripened orchard purée and European butter.',
    image: '/images/toomakt/cat_fruity_candy.webp',
    highlights: 'High-resolution detail shot of colorful, individually wrapped fruit candies.',
    foilBadge: '100% Real Fruit Purée',
    tag: 'Fruity Best Seller',
    samplePrice: 22.00
  },
  {
    id: 'butter-milk',
    title: 'Butter & Milk Toffee Line',
    arabicTitle: 'توماكت حليب وبتر كاندي فاخر',
    category: 'Toffee Milk / Vanilla Cream',
    description: 'Crisp, velvety soft milk toffee crafted with slow-simmered browned butter and European sweet cream.',
    image: '/images/toomakt/cat_butter_milk_toffee.webp',
    highlights: 'Crisp, professional packaging display featuring blue and silver premium foil wrappers.',
    foilBadge: 'Grass-Fed Butter Cream',
    tag: 'Classic Gold Medal',
    samplePrice: 24.00
  },
  {
    id: 'coffee-cappuccino',
    title: 'Coffee & Cappuccino Line',
    arabicTitle: 'توماكت قهوة وكابتشينو كاندي',
    category: 'Coffee & Cappuccino Bonbons',
    description: 'Rich slow-roasted Arabica coffee extracts blended into decadent caramelized toffee bonbons.',
    image: '/images/toomakt/cat_coffee_cappuccino.webp',
    highlights: 'Clean graphic layout with rich coffee bean and chocolate tones.',
    foilBadge: 'Espresso Roasted Bean',
    tag: 'Connoisseur Edition',
    samplePrice: 26.00
  },
  {
    id: 'eclairs-peanut',
    title: 'Eclairs & Stuffed Peanut Line',
    arabicTitle: 'إكليرز وشوكولاتة محشوة بالفول السوداني',
    category: 'Eclairs / Chocolate-Stuffed Toffee',
    description: 'Decadent chocolate-stuffed toffee eclairs layered with crunchy roasted peanut praline center.',
    image: '/images/toomakt/cat_eclairs_peanut.webp',
    highlights: 'Close-up display highlighting gold foil details and rich chocolate texture.',
    foilBadge: 'Molten Chocolate Core',
    tag: 'Luxury Reserve',
    samplePrice: 28.00
  }
];

export const HERO_PRODUCT: Product = {
  id: 'mango-sunbeam',
  name: 'Mango Sunbeam',
  tagline: 'buttery, golden, bright',
  description: 'Pure Alphonso mango purée slow-simmered with Normandy sweet cream butter into an explosive sunny chew.',
  badge: 'NEW ARRIVALS / TASTE LAB',
  badgeType: 'gold',
  price: 220.00,
  weight: '250g Weather Pack',
  category: 'bright',
  tags: ['BRIGHT', 'BUTTERY'],
  mood: 'NEED A SUNBEAM',
  rating: 4.98,
  reviewsCount: 1420,
  chewiness: 9.8,
  fruitImpact: { label: 'Fruit Density', score: 9.9 },
  fruitNotes: ['Alphonso Mango Nectar', 'Normandy Sweet Butter', 'Tahitian Vanilla', 'Citrus Zing'],
  image: '/images/toomakt/cat_fruity_candy.webp',
  accentColor: '#FF5E2B',
  lightBgColor: '#FFE842',
  cardBgColor: '#FFE842',
  isPopular: true,
  pieces_per_pack: 24
};

export const FLAVOR_VAULT_PRODUCTS: Product[] = [
  {
    id: 'mango-sunbeam',
    name: 'Mango Sunbeam',
    tagline: 'buttery, golden, bright',
    description: 'Golden sun-ripened Alphonso mangoes folded into warm European butter caramel with a crisp, clean citrus finish.',
    badge: 'TASTE LAB NO. 01',
    badgeType: 'gold',
    price: 220.00,
    weight: '250g Pack',
    category: 'bright',
    tags: ['BRIGHT', 'BUTTERY'],
    mood: 'NEED A SUNBEAM',
    rating: 4.98,
    reviewsCount: 1230,
    chewiness: 9.8,
    fruitImpact: { label: 'Fruit Tartness', score: 9.5 },
    fruitNotes: ['Alphonso Mango Purée', 'Normandy Sweet Butter', 'Tahitian Vanilla', 'Citrus Zing'],
    image: '/images/toomakt/cat_fruity_candy.webp',
    accentColor: '#1F1127',
    lightBgColor: '#FFFDF5',
    cardBgColor: '#FFE842',
    isPopular: true
  },
  {
    id: 'berry-afterglow',
    name: 'Berry Afterglow',
    tagline: 'juicy, tart, wild',
    description: 'Cold-macerated wild alpine strawberries, raspberries, and dark forest berries swirling in velvety cultured sweet cream.',
    badge: 'MOST POPULAR',
    badgeType: 'berry',
    price: 230.00,
    weight: '250g Pack',
    category: 'chewy',
    tags: ['CHEWY', 'BRIGHT'],
    mood: 'SEND A LOVE NOTE',
    rating: 4.99,
    reviewsCount: 1890,
    chewiness: 10.0,
    fruitImpact: { label: 'Berry Acid Burst', score: 9.9 },
    fruitNotes: ['Wild Alpine Strawberries', 'Tart Forest Raspberries', 'Cultured European Cream'],
    image: '/images/toomakt/cat_fruity_candy.webp',
    accentColor: '#1F1127',
    lightBgColor: '#FFFDF5',
    cardBgColor: '#FF4D8D',
    isPopular: true
  },
  {
    id: 'citrus-comet',
    name: 'Citrus Comet',
    tagline: 'zesty, sparkling',
    description: 'A dazzling cosmic spark of cold-pressed Mediterranean lemons, sun-warmed limes, and slow-churned butter toffee.',
    badge: 'LIMITED DROP',
    badgeType: 'limited',
    price: 210.00,
    weight: '250g Pack',
    category: 'bright',
    tags: ['BRIGHT', 'CHEWY'],
    mood: 'WAKE UP YOUR TONGUE',
    rating: 4.95,
    reviewsCount: 840,
    chewiness: 9.6,
    fruitImpact: { label: 'Citrus Spark', score: 9.8 },
    fruitNotes: ['Sicilian Lemon Zest', 'Mediterranean Lime Purée', 'Whipped Sweet Butter'],
    image: '/images/toomakt/cat_fruity_candy.webp',
    accentColor: '#1F1127',
    lightBgColor: '#FFFDF5',
    cardBgColor: '#C4E86E'
  },
  {
    id: 'peach-daydream',
    name: 'Peach Daydream',
    tagline: 'velvety, soft-baked, floral',
    description: 'White orchard peaches infused with wild apricot honey and slow browned French butter. Tender and fragrant.',
    badge: 'SUMMER FAVORITE',
    badgeType: 'gold',
    price: 200.00,
    weight: '250g Pack',
    category: 'buttery',
    tags: ['BUTTERY', 'CHEWY'],
    mood: 'GO FULL TROPICAL',
    rating: 4.94,
    reviewsCount: 710,
    chewiness: 9.5,
    fruitImpact: { label: 'Peach Velvet', score: 9.6 },
    fruitNotes: ['Sun-Ripened White Peach', 'Orchard Apricot Nectar', 'Browned Butter Caramel'],
    image: '/images/toomakt/cat_butter_milk_toffee.webp',
    accentColor: '#1F1127',
    lightBgColor: '#FFFDF5',
    cardBgColor: '#FFB088'
  },
  {
    id: 'guava-hotline',
    name: 'Guava Hotline',
    tagline: 'tropical, sweet-tangy rush',
    description: 'Egyptian pink guava purée with a squeeze of ruby lime and red sea salt. A direct line to pure island bliss.',
    badge: 'LOCAL HARVEST',
    badgeType: 'berry',
    price: 215.00,
    weight: '250g Pack',
    category: 'bright',
    tags: ['BRIGHT', 'CHEWY'],
    mood: 'GO FULL TROPICAL',
    rating: 4.97,
    reviewsCount: 960,
    chewiness: 9.7,
    fruitImpact: { label: 'Guava Rush', score: 9.9 },
    fruitNotes: ['Egyptian Pink Guava', 'Ruby Citrus Blossom', 'Maldon Sea Salt'],
    image: '/images/toomakt/cat_fruity_candy.webp',
    accentColor: '#1F1127',
    lightBgColor: '#FFFDF5',
    cardBgColor: '#FF6B6B'
  },
  {
    id: 'pineapple-frequency',
    name: 'Pineapple Frequency',
    tagline: 'electric, sun-drenched chew',
    description: 'High-energy caramelized golden pineapple with Tahitian sweet cream and an electric pop of fruit acidity.',
    badge: 'TASTE LAB DROP',
    badgeType: 'primary',
    price: 225.00,
    weight: '250g Pack',
    category: 'chewy',
    tags: ['CHEWY', 'BRIGHT'],
    mood: 'GO FULL TROPICAL',
    rating: 4.96,
    reviewsCount: 820,
    chewiness: 9.9,
    fruitImpact: { label: 'Pineapple Voltage', score: 9.7 },
    fruitNotes: ['Caramelized Golden Pineapple', 'Tahitian Sweet Cream', 'Crushed Cane Sugar'],
    image: '/images/toomakt/cat_fruity_candy.webp',
    accentColor: '#1F1127',
    lightBgColor: '#FFFDF5',
    cardBgColor: '#4AD4DA'
  },
  {
    id: 'sun-chaser-box',
    name: 'The Sun Chaser Box',
    tagline: '4-flavor signature weather box',
    description: 'The definitive toomakt sampler box featuring Mango Sunbeam, Berry Afterglow, Citrus Comet, and Peach Daydream.',
    badge: 'BEST VALUE BOX',
    badgeType: 'gold',
    price: 750.00,
    weight: '1000g Grand Box',
    category: 'giftably',
    tags: ['GIFTABLY', 'ALL'],
    mood: 'NEED A SUNBEAM',
    rating: 5.0,
    reviewsCount: 1540,
    chewiness: 9.8,
    fruitImpact: { label: 'Full Spectrum', score: 10.0 },
    fruitNotes: ['Mango Sunbeam', 'Berry Afterglow', 'Citrus Comet', 'Peach Daydream'],
    image: '/images/toomakt/hero_family_showcase.webp',
    accentColor: '#1F1127',
    lightBgColor: '#FFFDF5',
    cardBgColor: '#FF5E2B'
  },
  {
    id: 'office-weather-kit',
    name: 'Office Weather Kit',
    tagline: 'sharing box with 48 bites',
    description: 'Engineered to transform your entire office team into instant chew connoisseurs. Includes 48 individually sealed treats.',
    badge: 'CORPORATE FAVORITE',
    badgeType: 'primary',
    price: 980.00,
    weight: '1200g Kit',
    category: 'giftably',
    tags: ['GIFTABLY', 'ALL'],
    mood: 'SEND A LOVE NOTE',
    rating: 4.99,
    reviewsCount: 890,
    chewiness: 9.7,
    fruitImpact: { label: 'Office Joy', score: 9.9 },
    fruitNotes: ['Complete Atelier Lineup (48 Pieces)'],
    image: '/images/toomakt/hero_family_showcase.webp',
    accentColor: '#1F1127',
    lightBgColor: '#FFFDF5',
    cardBgColor: '#B497D6'
  },
  {
    id: 'build-own-forecast',
    name: 'Build Your Own Forecast',
    tagline: 'custom 4-pack box creator',
    description: 'Select your base, pick any 4 fruit weather profiles, and personalize the sleeve with your own custom name.',
    badge: 'INTERACTIVE BUILDER',
    badgeType: 'gold',
    price: 850.00,
    weight: '1000g Custom Box',
    category: 'giftably',
    tags: ['GIFTABLY', 'ALL'],
    mood: 'GO FULL TROPICAL',
    rating: 5.0,
    reviewsCount: 2130,
    chewiness: 9.8,
    fruitImpact: { label: 'Personal Match', score: 10.0 },
    fruitNotes: ['Custom Curated 4 Flavors', 'Personalized Box Sleeve'],
    image: '/images/toomakt/hero_family_showcase.webp',
    accentColor: '#FFFDF5',
    lightBgColor: '#1F1127',
    cardBgColor: '#1F1127'
  }
];

export const GRAND_CAROUSEL_BOX: BundleItem = {
  id: 'grand-carousel-box',
  title: 'The Sun Chaser Box — Signature Weather Box',
  category: 'BEST SELLER HARVEST',
  badge: 'Complete 4-Flavor Weather Assortment',
  description: 'Our bespoke collector assortment presenting all flagship fruit weather systems: Mango Sunbeam, Berry Afterglow, Citrus Comet, and Peach Daydream.',
  price: 750.00,
  rating: 4.99,
  reviewCount: 1540,
  image: '/images/toomakt/hero_family_showcase.webp',
  weight: '1000G PRESENTATION BOX'
};

export const CROWD_FAVORITES_ITEMS: BundleItem[] = [
  {
    id: 'mango-sunbeam-item',
    title: 'Mango Sunbeam Pack',
    category: 'Fruit Weather Line',
    description: 'Buttery, golden, bright fruit chew with pure Alphonso mango purée.',
    price: 220.00,
    rating: 5.0,
    reviewCount: 1230,
    image: '/images/toomakt/cat_fruity_candy.webp',
    weight: '250g Pack'
  },
  {
    id: 'berry-afterglow-item',
    title: 'Berry Afterglow Pack',
    category: 'Fruit Weather Line',
    description: 'Wild alpine strawberries and forest raspberries in cultured sweet cream.',
    price: 230.00,
    rating: 4.98,
    reviewCount: 1890,
    image: '/images/toomakt/cat_fruity_candy.webp',
    weight: '250g Pack'
  },
  {
    id: 'citrus-comet-item',
    title: 'Citrus Comet Pack',
    category: 'Fruit Weather Line',
    description: 'Zesty, sparkling Sicilian lemons and Mediterranean lime zest.',
    price: 210.00,
    rating: 4.99,
    reviewCount: 840,
    image: '/images/toomakt/cat_fruity_candy.webp',
    weight: '250g Pack'
  }
];

export const REVIEWS_LIST: Review[] = [
  {
    id: 'rev-1',
    author: 'Maya',
    location: 'Cairo, Egypt',
    role: 'Verified Foodie',
    rating: 5,
    title: '“The mango one tastes like a holiday.”',
    content: 'The mango one tastes like a holiday. The soft chew melts without sticking, and you can tell immediately this is real fruit purée and high-end cultured butter.',
    productTag: 'Mango Sunbeam'
  },
  {
    id: 'rev-2',
    author: 'Omar',
    location: 'Alexandria, Egypt',
    role: 'Verified Buyer',
    rating: 5,
    title: '“The box arrived looking like a tiny party.”',
    content: 'The box arrived looking like a tiny party! The insulated cold-pack kept the candies perfectly chilled in Alexandria summer heat. The Berry Afterglow is pure obsession.',
    productTag: 'The Sun Chaser Box'
  },
  {
    id: 'rev-3',
    author: 'Lina',
    location: 'Giza, Egypt',
    role: 'Verified Confection Fan',
    rating: 5,
    title: '“I bought it for a gift. Kept it.”',
    content: 'I bought it for a gift. Kept it for myself! The texture curve is phenomenal — zero stickiness on teeth and pure explosive fruit flavor. Ordering 3 more boxes today.',
    productTag: 'Citrus Comet'
  }
];

export const CHEW_TIMELINE_STEPS = [
  {
    time: '0s',
    title: 'Warm Butter',
    stage: 'Toffee Melt',
    description: 'As the chew meets your body temperature, cultured Normandy butter releases rich dairy notes and fragrant vanilla warmth without sticking to your teeth.'
  },
  {
    time: '20s',
    title: 'Fruit Peak',
    stage: 'Pure Fruit Acid Burst',
    description: 'Cold-pressed real orchard fruit purée blooms across the palate. High natural pectin creates an exhilarating burst of authentic tart fruitiness.'
  },
  {
    time: '45s',
    title: 'Crisp Toffee',
    stage: 'Salted Finish',
    description: 'Maldon sea salt flakes and caramelized cane sugar crystallize into a smooth, satisfying savory-sweet finish that leaves zero cloying residue.'
  }
];
