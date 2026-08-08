import type {
  Brand,
  Category,
  LeasingInquiry,
  LeasingInquiryRecord,
  LoyaltyMember,
  LoyaltySignup,
  TokenResponse,
  Offer,
  PromotionalCampaign,
  HeroBanner,
  Coupon,
  FlashSale,
  MediaImage,
} from '@/types'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    // Spread init first, then headers — otherwise `...init` overwrites the
    // merged headers and drops Content-Type, breaking authenticated POST/PUT.
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    const detail = err?.detail
    // FastAPI validation errors (422) return detail as an array of objects —
    // flatten them to a readable string instead of "[object Object]".
    const message = Array.isArray(detail)
      ? detail
          .map((d: { msg?: string; loc?: (string | number)[] }) =>
            d.loc ? `${d.loc.slice(1).join('.')}: ${d.msg}` : d.msg)
          .join('; ')
      : typeof detail === 'string'
        ? detail
        : 'Request failed'
    throw new Error(message)
  }
  return res.json() as Promise<T>
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export async function login(email: string, password: string): Promise<TokenResponse> {
  return request<TokenResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

// ── Brands ────────────────────────────────────────────────────────────────────
export async function getBrands(): Promise<Brand[]> {
  return request<Brand[]>('/api/brands')
}

export async function getBrand(id: string): Promise<Brand> {
  return request<Brand>(`/api/brands/${id}`)
}

export async function createBrand(data: Partial<Brand>, token: string): Promise<Brand> {
  return request<Brand>('/api/brands', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  })
}

export async function updateBrand(id: string, data: Partial<Brand>, token: string): Promise<Brand> {
  return request<Brand>(`/api/brands/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  })
}

export async function deleteBrand(id: string, token: string): Promise<void> {
  await request(`/api/brands/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}

// ── Categories ────────────────────────────────────────────────────────────────
export async function getCategories(): Promise<Category[]> {
  return request<Category[]>('/api/categories')
}

// ── Leasing ───────────────────────────────────────────────────────────────────
export async function submitLeasingInquiry(data: LeasingInquiry): Promise<{ id: string }> {
  return request<{ id: string }>('/api/leasing', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function getLeasingInquiries(token: string): Promise<LeasingInquiryRecord[]> {
  return request<LeasingInquiryRecord[]>('/api/leasing', {
    headers: { Authorization: `Bearer ${token}` },
  })
}

// ── Loyalty ───────────────────────────────────────────────────────────────────
export async function joinLoyalty(data: LoyaltySignup): Promise<{ id: string }> {
  return request<{ id: string }>('/api/loyalty/join', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function getLoyaltyMembers(token: string): Promise<LoyaltyMember[]> {
  return request<LoyaltyMember[]>('/api/loyalty', {
    headers: { Authorization: `Bearer ${token}` },
  })
}

// ── Chatbot ───────────────────────────────────────────────────────────────────
export async function sendChatMessage(
  message: string,
  history: Array<{ from: 'user' | 'bot'; text: string }>
): Promise<{ response: string }> {
  return request<{ response: string }>('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ message, history }),
  })
}

// ── Image Upload Direct ───────────────────────────────────────────────────────
export async function uploadImageFile(file: File, token: string): Promise<{ url: string }> {
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch(`${BASE}/api/upload/image`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail ?? 'Upload failed')
  }
  return res.json()
}

// ── Offers ────────────────────────────────────────────────────────────────────
export async function getOffers(params?: {
  brand_id?: string
  category?: string
  tag?: string
  is_active?: boolean
  is_featured?: boolean
  is_trending?: boolean
  sort_by?: string
}): Promise<Offer[]> {
  const q = new URLSearchParams()
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) q.append(k, String(v))
    })
  }
  const qStr = q.toString()
  return request<Offer[]>(`/api/offers${qStr ? '?' + qStr : ''}`)
}

export async function getOffer(id: string): Promise<Offer> {
  return request<Offer>(`/api/offers/${id}`)
}

export async function createOffer(data: Partial<Offer>, token: string): Promise<Offer> {
  return request<Offer>('/api/offers', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  })
}

export async function updateOffer(id: string, data: Partial<Offer>, token: string): Promise<Offer> {
  return request<Offer>(`/api/offers/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  })
}

export async function deleteOffer(id: string, token: string): Promise<void> {
  await request(`/api/offers/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function trackOfferView(id: string): Promise<void> {
  await request(`/api/offers/${id}/view`, { method: 'POST' }).catch(() => {})
}

export async function trackOfferClick(id: string): Promise<void> {
  await request(`/api/offers/${id}/click`, { method: 'POST' }).catch(() => {})
}

// ── Campaigns ─────────────────────────────────────────────────────────────────
export async function getCampaigns(activeOnly = false): Promise<PromotionalCampaign[]> {
  return request<PromotionalCampaign[]>(`/api/campaigns?active_only=${activeOnly}`)
}

export async function getCampaign(id: string): Promise<PromotionalCampaign> {
  return request<PromotionalCampaign>(`/api/campaigns/${id}`)
}

export async function createCampaign(data: Partial<PromotionalCampaign>, token: string): Promise<PromotionalCampaign> {
  return request<PromotionalCampaign>('/api/campaigns', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  })
}

export async function updateCampaign(id: string, data: Partial<PromotionalCampaign>, token: string): Promise<PromotionalCampaign> {
  return request<PromotionalCampaign>(`/api/campaigns/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  })
}

export async function deleteCampaign(id: string, token: string): Promise<void> {
  await request(`/api/campaigns/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}

// ── Hero Banners ──────────────────────────────────────────────────────────────
export async function getBanners(activeOnly = false): Promise<HeroBanner[]> {
  return request<HeroBanner[]>(`/api/banners?active_only=${activeOnly}`)
}

export async function getBanner(id: string): Promise<HeroBanner> {
  return request<HeroBanner>(`/api/banners/${id}`)
}

export async function createBanner(data: Partial<HeroBanner>, token: string): Promise<HeroBanner> {
  return request<HeroBanner>('/api/banners', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  })
}

export async function updateBanner(id: string, data: Partial<HeroBanner>, token: string): Promise<HeroBanner> {
  return request<HeroBanner>(`/api/banners/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  })
}

export async function deleteBanner(id: string, token: string): Promise<void> {
  await request(`/api/banners/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}

// ── Coupons ───────────────────────────────────────────────────────────────────
export async function getCoupons(activeOnly = false): Promise<Coupon[]> {
  return request<Coupon[]>(`/api/coupons?active_only=${activeOnly}`)
}

export async function getCoupon(id: string): Promise<Coupon> {
  return request<Coupon>(`/api/coupons/${id}`)
}

export async function createCoupon(data: Partial<Coupon>, token: string): Promise<Coupon> {
  return request<Coupon>('/api/coupons', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  })
}

export async function updateCoupon(id: string, data: Partial<Coupon>, token: string): Promise<Coupon> {
  return request<Coupon>(`/api/coupons/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  })
}

export async function deleteCoupon(id: string, token: string): Promise<void> {
  await request(`/api/coupons/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}

// ── Flash Sales ───────────────────────────────────────────────────────────────
export async function getFlashSales(activeOnly = false): Promise<FlashSale[]> {
  return request<FlashSale[]>(`/api/flash-sales?active_only=${activeOnly}`)
}

export async function getFlashSale(id: string): Promise<FlashSale> {
  return request<FlashSale>(`/api/flash-sales/${id}`)
}

export async function createFlashSale(data: Partial<FlashSale>, token: string): Promise<FlashSale> {
  return request<FlashSale>('/api/flash-sales', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  })
}

export async function updateFlashSale(id: string, data: Partial<FlashSale>, token: string): Promise<FlashSale> {
  return request<FlashSale>(`/api/flash-sales/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  })
}

export async function deleteFlashSale(id: string, token: string): Promise<void> {
  await request(`/api/flash-sales/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}

// ── Media Library ─────────────────────────────────────────────────────────────
export async function getMediaLibrary(): Promise<MediaImage[]> {
  return request<MediaImage[]>('/api/media')
}

export async function deleteMediaLibrary(id: string, token: string): Promise<void> {
  await request(`/api/media/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}

// ── Dashboard Overview ────────────────────────────────────────────────────────
export interface DashboardStats {
  summary: {
    totalBrands: number
    activeOffers: number
    scheduledOffers: number
    expiredOffers: number
    totalBanners: number
    totalCoupons: number
    activeCampaigns: number
    totalClicks: number
    totalViews: number
  }
  charts: {
    offerPerformance: Array<{ title: string; clicks: number; views: number }>
    brandAnalytics: Array<{ name: string; clicks: number }>
  }
}

export async function getDashboardStats(token: string): Promise<DashboardStats> {
  return request<DashboardStats>('/api/dashboard/stats', {
    headers: { Authorization: `Bearer ${token}` },
  })
}

