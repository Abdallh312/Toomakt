export type ProductCategory = 'all' | 'mango' | 'berry' | 'citrus' | 'gift-boxes' | 'chewy' | 'bright' | 'buttery' | 'giftably' | 'berries' | 'tropical' | 'gifts' | string;

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  badge?: string;
  badgeType?: 'primary' | 'gold' | 'berry' | 'limited';
  badgeColor?: string;
  price: number;
  originalPrice?: number;
  weight: string;
  category: ProductCategory;
  tags?: string[];
  mood?: string;
  rating: number;
  reviewsCount: number;
  chewiness: number;
  fruitImpact: {
    label: string;
    score: number;
  };
  fruitNotes: string[];
  image: string;
  altImage?: string;
  accentColor: string;
  lightBgColor: string;
  cardBgColor?: string;
  isPopular?: boolean;
  pieces_per_pack?: number;
  stock_quantity?: number;
  low_stock_threshold?: number;
  allow_backorders?: boolean;
  sold_quantity?: number;
  in_stock?: boolean;
  category_name?: string;
}

export interface BundleItem {
  id: string;
  title: string;
  category: string;
  badge?: string;
  description: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  weight: string;
  pieces_per_pack?: number;
}

export interface Review {
  id: string;
  author: string;
  location: string;
  role: string;
  rating: number;
  title: string;
  content: string;
  productTag: string;
}

export interface CartItem {
  product: Product | {
    id: string;
    name: string;
    price: number;
    weight: string;
    image: string;
    badge?: string;
    pieces_per_pack?: number;
  };
  quantity: number;
}

export interface ShippingRate {
  id: string;
  governorate: string;
  price: number;
  estimated_delivery: string;
  active: boolean;
}

export interface WholesaleRequest {
  id: string;
  name: string;
  company_name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  governorate: string;
  city: string;
  business_type: string;
  products_interested?: string;
  requested_quantity: number;
  monthly_quantity?: number;
  message?: string;
  status: 'new' | 'contacted' | 'quoted' | 'approved' | 'rejected' | 'archived';
  internal_notes?: string;
  created_at?: string;
}

export interface OrderItemRecord {
  id: string;
  name: string;
  sku?: string;
  product_name_snapshot?: string;
  price_snapshot?: number;
  pieces_per_pack_snapshot?: number;
  unit_price: number;
  quantity: number;
  total_price: number;
  image_url?: string;
}

export interface PaymentConfirmationRecord {
  id: string;
  order_id?: string;
  order_number: string;
  customer_name: string;
  customer_phone?: string;
  order_total: number;
  shipping_fee: number;
  payment_method: string;
  transfer_amount: number;
  transfer_reference?: string;
  payment_screenshot?: string;
  submission_date: string;
  payment_status: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  admin_reviewer?: string;
  admin_review_date?: string;
  admin_notes?: string;
  rejection_reason?: string;
}

export interface AdminNotificationRecord {
  id: string;
  notification_type: 'new_order' | 'payment_confirmation' | 'payment_approved' | 'payment_rejected' | 'low_stock' | 'out_of_stock' | 'wholesale_inquiry';
  title: string;
  message: string;
  related_order_id?: string;
  related_order_number?: string;
  related_product_id?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  is_read: boolean;
  created_at: string;
}

export interface OrderRecord {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping_address: string;
  shipping_city: string;
  governorate: string;
  shipping_country: string;
  building_number?: string;
  apartment_floor?: string;
  delivery_notes?: string;
  subtotal: number;
  discount_amount: number;
  shipping_fee: number;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  status: string;
  payment_proof_url?: string;
  payment_reviewed_by?: string;
  payment_reviewed_at?: string;
  payment_rejection_reason?: string;
  tracking_number?: string;
  internal_notes?: string;
  items?: OrderItemRecord[];
  payment_confirmations?: PaymentConfirmationRecord[];
  timeline?: { time: string; title: string; desc: string }[];
  created_at: string;
}


