'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Clock, Percent, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import useStore from '@/store/useStore'
import {
  getOffers, getCampaigns, getFlashSales,
  trackOfferClick, trackOfferView
} from '@/lib/api'
import type { Brand, Category, Offer, PromotionalCampaign, FlashSale } from '@/types'

import CategorySection from './CategorySection'
import FeaturedSlider from './FeaturedSlider'
import BrandsSection from './BrandsSection'

export default function HomeContent() {
  const router = useRouter()
  const { brands: allBrands, categories, loading: initialLoading } = useStore()
  const handleBrandSelect = (id: string) => router.push(`/brand/${id}`)

  // Dynamic States
  const [offers, setOffers] = useState<Offer[]>([])
  const [campaigns, setCampaigns] = useState<PromotionalCampaign[]>([])
  const [flashSales, setFlashSales] = useState<FlashSale[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      getOffers({ is_active: true }),
      getCampaigns(true),
      getFlashSales(true)
    ])
      .then(([offersData, campaignsData, flashSalesData]) => {
        setOffers(offersData)
        setCampaigns(campaignsData)
        setFlashSales(flashSalesData)

        // Track impressions for loaded offers
        offersData.slice(0, 10).forEach(o => {
          trackOfferView(o.id).catch(() => {})
        })
      })
      .catch((err) => {
        console.error('Failed to load promotions:', err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (initialLoading || loading) {
    return <HomeSkeleton />
  }

  // Filter lists dynamically for different home sections
  const featuredOffers = offers.filter(o => o.is_featured)
  const trendingOffers = offers.filter(o => o.is_trending)
  const recommendedOffers = [...offers].sort((a, b) => (b.views_count || 0) - (a.views_count || 0))
  const newPromotions = [...offers].sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())

  // Limited time deals (expiring in next 7 days)
  const limitedTimeDeals = offers.filter(o => {
    const daysLeft = (new Date(o.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    return daysLeft > 0 && daysLeft <= 7
  })

  // Filter active brands by is_active status
  const activeBrands = allBrands.filter(b => b.is_active !== false)
  const trendingBrands = activeBrands.filter(b => b.featured)

  const handleOfferInteraction = (offerId: string) => {
    trackOfferClick(offerId).catch(() => {})
  }

  return (
    <div className="space-y-16">

      {/* ── FLASH SALES SECTION ─────────────────────────────────────────────── */}
      {flashSales.length > 0 && (
        <section className="py-12 px-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 border border-red-500/25 rounded-2xl">
                <Flame className="text-red-400 w-6 h-6 animate-pulse" />
              </div>
              <div>
                <p className="section-eyebrow">Flash Sale</p>
                <h3 className="section-heading">Limited <span className="gold-text">Deals</span></h3>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {flashSales.map((sale) => (
              <div
                key={sale.id}
                className="relative bg-bg-card border border-[rgba(201,168,76,0.12)] p-5 rounded-3xl flex gap-4 overflow-hidden group hover:border-[#C9A84C]/50 transition duration-300"
              >
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-bg-accent flex-shrink-0">
                  <img src={sale.product_image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition" />
                </div>
                <div className="flex flex-col justify-between flex-grow">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-[#C9A84C] font-semibold">{sale.brand_name}</span>
                    <h4 className="text-sm font-semibold text-[#F0EEF8] line-clamp-1 mt-0.5">{sale.product_name}</h4>
                  </div>
                  <div className="flex items-end justify-between mt-2">
                    <div>
                      <span className="text-xs line-through text-text-muted">{sale.product_price}</span>
                      <p className="text-base font-bold text-green-400 leading-none mt-0.5">{sale.discount_price}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-red-400 font-semibold bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
                      <Clock size={12} />
                      <Countdown targetDate={sale.end_date} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── POPULAR CATEGORIES ──────────────────────────────────────────────── */}
      <CategorySection categories={categories} />

      {/* ── FEATURED OFFERS SECTION ─────────────────────────────────────────── */}
      {featuredOffers.length > 0 && (
        <section className="py-12 px-6 bg-bg-section overflow-hidden">
          <div className="max-w-7xl mx-auto mb-8">
            <p className="section-eyebrow">Highlights</p>
            <h3 className="section-heading">Featured <span className="gold-text">Promotions</span></h3>
          </div>

          <div className="max-w-7xl mx-auto relative flex items-center group/row">
            <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar scroll-smooth select-none cursor-grab active:cursor-grabbing w-full">
              {featuredOffers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} onInteract={() => handleOfferInteraction(offer.id)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── SPOTLIGHT SLIDER (TRENDING BRANDS) ────────────────────────────────── */}
      {trendingBrands.length > 0 && (
        <FeaturedSlider brands={trendingBrands} onBrandSelect={handleBrandSelect} />
      )}

      {/* ── NEW PROMOTIONS SECTION ──────────────────────────────────────────── */}
      {newPromotions.length > 0 && (
        <section className="py-12 px-6 max-w-7xl mx-auto">
          <div className="mb-8">
            <p className="section-eyebrow">Just In</p>
            <h3 className="section-heading">Newest <span className="gold-text">Campaigns</span></h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newPromotions.slice(0, 3).map((offer) => (
              <OfferPromoGridCard key={offer.id} offer={offer} onInteract={() => handleOfferInteraction(offer.id)} />
            ))}
          </div>
        </section>
      )}

      {/* ── LIMITED TIME DEALS SECTION ───────────────────────────────────────── */}
      {limitedTimeDeals.length > 0 && (
        <section className="py-12 px-6 bg-bg-section overflow-hidden">
          <div className="max-w-7xl mx-auto mb-8">
            <p className="section-eyebrow font-semibold text-gold">Ending Soon</p>
            <h3 className="section-heading">Limited <span className="gold-text">Time Deals</span></h3>
          </div>
          <div className="max-w-7xl mx-auto flex gap-6 overflow-x-auto pb-4 custom-scrollbar scroll-smooth w-full">
            {limitedTimeDeals.map((offer) => (
              <OfferCard key={offer.id} offer={offer} onInteract={() => handleOfferInteraction(offer.id)} />
            ))}
          </div>
        </section>
      )}

      {/* ── BRANDS SECTION DIRECTORY ────────────────────────────────────────── */}
      <BrandsSection brands={activeBrands} offers={offers} onBrandSelect={handleBrandSelect} />

      {/* ── RECOMMENDED OFFERS SECTION ──────────────────────────────────────── */}
      {recommendedOffers.length > 0 && (
        <section className="py-12 px-6 max-w-7xl mx-auto">
          <div className="mb-8">
            <p className="section-eyebrow">Curated for You</p>
            <h3 className="section-heading">Recommended <span className="gold-text">Deals</span></h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedOffers.slice(0, 4).map((offer) => (
              <OfferPromoGridCard key={offer.id} offer={offer} onInteract={() => handleOfferInteraction(offer.id)} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

// ── AUXILIARY CARDS ──────────────────────────────────────────────────────────

function OfferCard({ offer, onInteract }: { offer: Offer; onInteract: () => void }) {
  return (
    <div
      onClick={onInteract}
      className="flex-shrink-0 w-80 rounded-3xl border border-[rgba(201,168,76,0.12)] bg-[#14122E] overflow-hidden group hover:border-[#C9A84C]/50 hover:-translate-y-1 transition duration-300 relative flex flex-col justify-between"
      style={{ minHeight: '380px' }}
    >
      <div>
        {offer.banner_url ? (
          <div className="aspect-video relative bg-[#08071A]">
            <img src={offer.banner_url} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#14122E] via-transparent to-transparent" />
          </div>
        ) : (
          <div className="aspect-video flex items-center justify-center bg-[#110F2A] relative">
            <Percent className="w-12 h-12 text-[#C9A84C]/25" />
          </div>
        )}

        <div className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#C9A84C] font-semibold">{offer.brand_name}</span>
            {offer.discount_percentage && (
              <span className="text-[10px] bg-green-500/10 text-green-400 font-bold border border-green-500/20 px-2 py-0.5 rounded-full">
                {offer.discount_percentage}% Off
              </span>
            )}
          </div>
          <h4 className="font-serif text-xl text-[#F0EEF8] leading-tight line-clamp-1">{offer.title}</h4>
          <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">{offer.description}</p>
        </div>
      </div>

      <div className="p-6 pt-0 border-t border-[rgba(201,168,76,0.06)] flex items-center justify-between mt-auto">
        <div className="flex flex-col">
          <span className="text-[9px] uppercase tracking-wider text-text-muted">Promo Code</span>
          <span className="text-xs font-mono font-bold text-text-primary mt-0.5">{offer.coupon_code || 'No Code Required'}</span>
        </div>
        <span className="text-xs text-[#C9A84C] group-hover:translate-x-1 transition duration-200">View Details →</span>
      </div>
    </div>
  )
}

function OfferPromoGridCard({ offer, onInteract }: { offer: Offer; onInteract: () => void }) {
  return (
    <div
      onClick={onInteract}
      className="bg-[#14122E] border border-[rgba(201,168,76,0.12)] p-6 rounded-3xl group hover:border-[#C9A84C]/50 hover:-translate-y-1 transition duration-300 flex flex-col justify-between"
    >
      <div>
        <div className="flex justify-between items-start">
          <span className="text-xs font-semibold text-[#C9A84C]">{offer.brand_name}</span>
          {offer.discount_percentage ? (
            <span className="text-[10px] font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
              {offer.discount_percentage}% Off
            </span>
          ) : offer.flat_discount ? (
            <span className="text-[10px] font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
              ${offer.flat_discount} Off
            </span>
          ) : null}
        </div>
        <h4 className="font-serif text-lg text-[#F0EEF8] mt-3 line-clamp-1">{offer.title}</h4>
        <p className="text-xs text-text-muted mt-2 line-clamp-2 leading-relaxed">{offer.description}</p>
      </div>

      <div className="flex items-center justify-between border-t border-[rgba(201,168,76,0.06)] pt-4 mt-6">
        <span className="text-[10px] text-text-muted font-mono">{offer.coupon_code || 'Promo Deal'}</span>
        <button className="text-xs text-[#C9A84C] flex items-center gap-1 group-hover:gap-2 transition-all">
          Details <ArrowRight size={12} />
        </button>
      </div>
    </div>
  )
}

function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = new Date(targetDate).getTime() - Date.now()
      if (diff <= 0) {
        clearInterval(interval)
        return
      }
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff / (1000 * 60)) % 60)
      const seconds = Math.floor((diff / 1000) % 60)
      setTimeLeft({ hours, minutes, seconds })
    }, 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  return (
    <span className="font-mono">
      {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
    </span>
  )
}

// ── FALLBACK SKELETONS ────────────────────────────────────────────────────────

function HomeSkeleton() {
  return (
    <div className="space-y-16 p-8 max-w-7xl mx-auto animate-pulse">
      <div className="h-[60vh] bg-bg-card rounded-3xl" />
      <div className="space-y-4">
        <div className="h-6 w-48 bg-bg-card rounded-full" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="h-44 bg-bg-card rounded-2xl" />
          <div className="h-44 bg-bg-card rounded-2xl" />
          <div className="h-44 bg-bg-card rounded-2xl" />
          <div className="h-44 bg-bg-card rounded-2xl" />
        </div>
      </div>
    </div>
  )
}

