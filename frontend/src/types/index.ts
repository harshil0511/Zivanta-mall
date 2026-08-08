export interface Product {
  id: string
  brand_id: string
  name: string
  price: string
  rating: number
  category: string
  image: string
}

export interface Brand {
  id: string
  name: string
  floor: string
  type: string
  description: string
  featured: boolean
  logo_url?: string
  cover_image_url?: string
  priority: number
  is_active: boolean
  website_url?: string
  products: Product[]
}

export interface Category {
  id: string
  name: string
  icon: string
  count: number
}

export interface CartItem extends Product {
  brandName: string
  quantity: number
}

export interface LeasingInquiry {
  full_name: string
  company_name: string
  email: string
  category: string
  message: string
}

export interface LoyaltySignup {
  email: string
  name: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
}

export interface LeasingInquiryRecord extends LeasingInquiry {
  id: string
  created_at?: string
}

export interface LoyaltyMember {
  id: string
  name: string
  email: string
  tier: string
  points: number
  created_at?: string
}

export interface PromotionalCampaign {
  id: string
  name: string
  subtitle?: string
  description?: string
  campaign_type: string
  start_date: string
  end_date: string
  is_active: boolean
  background_image_url?: string
  created_at?: string
}

export interface HeroBanner {
  id: string
  banner_type: string
  image_url: string
  mobile_image_url?: string
  cta_text?: string
  redirect_url?: string
  display_order: number
  start_date?: string
  end_date?: string
  is_active: boolean
  created_at?: string
}

export interface Offer {
  id: string
  brand_id: string
  brand_name?: string
  title: string
  subtitle?: string
  description?: string
  discount_percentage?: number
  flat_discount?: number
  coupon_code?: string
  start_date: string
  end_date: string
  is_active: boolean
  background_color: string
  text_color: string
  display_priority: number
  tags?: string
  banner_url?: string
  mobile_banner_url?: string
  desktop_banner_url?: string
  is_featured: boolean
  is_trending: boolean
  views_count?: number
  clicks_count?: number
  created_at?: string
}

export interface Coupon {
  id: string
  code: string
  description?: string
  discount_value: number
  discount_type: string
  start_date: string
  end_date: string
  is_active: boolean
  created_at?: string
}

export interface FlashSale {
  id: string
  product_id: string
  product_name?: string
  product_price?: string
  product_image?: string
  brand_name?: string
  discount_price: string
  start_date: string
  end_date: string
  is_active: boolean
  created_at?: string
}

export interface MediaImage {
  id: string
  filename: string
  url: string
  created_at: string
}

