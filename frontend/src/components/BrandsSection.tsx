'use client'

import { useState, useMemo } from 'react'
import toast from 'react-hot-toast'
import useStore from '@/store/useStore'
import type { Brand, Offer } from '@/types'

const FILTER_PILLS = ['All', 'Fashion', 'Jewellery', 'Watches', 'Electronics', 'Dining', 'Entertainment']

// Each offer maps to a concrete action: either filter the brand grid by a
// category, or jump to the loyalty section.
const STATIC_OFFERS: {
  title: string
  desc: string
  badge: string
  gradient: string
  filter?: string
  scrollTo?: string
}[] = [
  {
    title: 'Weekend Dining',
    desc: 'Up to 30% off at select restaurants',
    badge: 'Limited Time',
    gradient: 'linear-gradient(135deg,#1a0e00,#3d2200)',
    filter: 'Dining',
  },
  {
    title: 'Fashion Week',
    desc: 'Exclusive new arrivals from top brands',
    badge: 'New In',
    gradient: 'linear-gradient(135deg,#0d0d1a,#1a1040)',
    filter: 'Fashion',
  },
  {
    title: 'Gold Member Perks',
    desc: 'Earn 3x points on all purchases',
    badge: 'Members Only',
    gradient: 'linear-gradient(135deg,#1a1200,#3d2e00)',
    scrollTo: 'loyalty',
  },
]

const MARQUEE_NAMES = [
  'Louis Vuitton', 'Gucci', 'Prada', 'Hermès', 'Chanel', 'Dior', 'Rolex', 'Cartier',
  'Tiffany & Co.', 'Burberry', 'Versace', 'Valentino', 'Balenciaga', 'Saint Laurent',
  'Bottega Veneta', 'Givenchy', 'Fendi', 'Bulgari', 'Van Cleef', 'Chopard',
]

const TYPE_ICONS: Record<string, string> = {
  fashion: '👗',
  jewellery: '💎',
  watches: '⌚',
  electronics: '📱',
  dining: '🍽️',
  entertainment: '🎬',
}

function getTypeIcon(type: string) {
  return TYPE_ICONS[type.toLowerCase()] ?? '✦'
}

interface BrandsSectionProps {
  brands: Brand[]
  offers?: Offer[]
  onBrandSelect: (id: string) => void
}

export default function BrandsSection({ brands, offers = [], onBrandSelect }: BrandsSectionProps) {
  const [search, setSearch] = useState('')
  const { brandFilter: activeFilter, setBrandFilter: setActiveFilter } = useStore()

  function handleOfferClick(offer: (typeof STATIC_OFFERS)[number]) {
    if (offer.filter) {
      setActiveFilter(offer.filter)
      document.getElementById('brands')?.scrollIntoView({ behavior: 'smooth' })
      toast.success(`Showing ${offer.filter} — ${offer.title}`)
    } else if (offer.scrollTo) {
      document.getElementById(offer.scrollTo)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const filteredBrands = useMemo(() => {
    return brands.filter((b) => {
      const matchesSearch =
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.type.toLowerCase().includes(search.toLowerCase())
      const matchesFilter =
        activeFilter === 'All' ||
        b.type.toLowerCase().includes(activeFilter.toLowerCase())
      return matchesSearch && matchesFilter
    })
  }, [brands, search, activeFilter])

  const [showAll, setShowAll] = useState(false)
  const visibleBrands = showAll ? filteredBrands : filteredBrands.slice(0, 8)

  const marqueeText = [...MARQUEE_NAMES, ...MARQUEE_NAMES].join('  ·  ')

  return (
    <section id="brands" className="py-20 px-6 bg-bg-section">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="section-eyebrow">Curated Selection</p>
          <h2 className="section-heading">
            Discover Our{' '}
            <span className="gold-text">Brands</span>
          </h2>
          <p className="text-[#B8B4D0] text-sm mt-3 max-w-md mx-auto">
            Over 130 of the world&apos;s most coveted brands, all under one roof.
          </p>
        </div>

        {/* Marquee */}
        <div className="overflow-hidden mb-10">
          <div
            className="whitespace-nowrap text-sm font-light text-[rgba(240,238,248,0.12)]"
            style={{ animation: 'marquee 30s linear infinite', display: 'inline-block' }}
          >
            {marqueeText}&nbsp;&nbsp;&nbsp;&nbsp;{marqueeText}
          </div>
          <style>{`
            @keyframes marquee {
              0%   { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
          `}</style>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A7890] text-base pointer-events-none">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search brands…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-bg-card border border-[rgba(201,168,76,0.15)] text-[#F0EEF8] text-sm placeholder:text-[#7A7890] outline-none focus:border-[#C9A84C] transition"
            />
          </div>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          {FILTER_PILLS.map((pill) => (
            <button
              key={pill}
              onClick={() => setActiveFilter(pill)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${
                activeFilter === pill
                  ? 'bg-[#C9A84C] border-[#C9A84C] text-[#08071A]'
                  : 'border-[rgba(201,168,76,0.2)] text-[#B8B4D0] hover:border-[rgba(201,168,76,0.5)] hover:text-[#C9A84C]'
              }`}
            >
              {pill}
            </button>
          ))}
        </div>

        {/* Brands — responsive directory grid */}
        {filteredBrands.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {visibleBrands.map((brand) => {
              const brandOffers = offers?.filter(o => o.brand_id === brand.id && o.is_active !== false) || []
              const hasOffer = brandOffers.length > 0
              let bestOfferTag = null

              if (hasOffer) {
                const withPercent = brandOffers.filter(o => o.discount_percentage !== undefined && o.discount_percentage !== null && o.discount_percentage > 0)
                if (withPercent.length > 0) {
                  const maxPercent = Math.max(...withPercent.map(o => o.discount_percentage!))
                  bestOfferTag = `${maxPercent}% OFF`
                } else {
                  const withFlat = brandOffers.filter(o => o.flat_discount !== undefined && o.flat_discount !== null && o.flat_discount > 0)
                  if (withFlat.length > 0) {
                    const maxFlat = Math.max(...withFlat.map(o => o.flat_discount!))
                    bestOfferTag = `$${maxFlat} OFF`
                  } else {
                    bestOfferTag = 'OFFER'
                  }
                }
              }

              const productCount = brand.products?.length ?? 0

              return (
                <div
                  key={brand.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onBrandSelect(brand.id)}
                  onKeyDown={(e) => { if (e.key === 'Enter') onBrandSelect(brand.id) }}
                  className="group flex flex-col rounded-2xl bg-bg-card border border-[rgba(201,168,76,0.1)] cursor-pointer hover:border-[rgba(201,168,76,0.45)] hover:-translate-y-1 transition-all duration-250 overflow-hidden relative"
                >
                  {/* Offer Badge Overlay */}
                  {bestOfferTag && (
                    <div className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 bg-red-650/90 text-white text-[9px] font-bold rounded-md tracking-wider uppercase shadow-md flex items-center gap-1 border border-red-500/20 animate-pulse">
                      <span className="w-1 h-1 rounded-full bg-white" />
                      <span>{bestOfferTag}</span>
                    </div>
                  )}
                {/* Card header — cover image or monogram block */}
                <div
                  className="relative flex items-center justify-center h-36 flex-shrink-0 overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, #110F2A 0%, #1A1840 100%)' }}
                >
                  {brand.cover_image_url ? (
                    <img
                      src={brand.cover_image_url}
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                    />
                  ) : null}
                  <div className="relative flex flex-col items-center gap-1">
                    {brand.logo_url ? (
                      <img
                        src={brand.logo_url}
                        alt={brand.name}
                        loading="lazy"
                        className="w-14 h-14 rounded-full object-cover border border-[rgba(201,168,76,0.3)]"
                      />
                    ) : (
                      <span
                        className="font-serif text-4xl leading-none group-hover:scale-110 transition-transform duration-300"
                        style={{
                          background: 'linear-gradient(135deg, #E8C97A 0%, #C9A84C 60%, #A07830 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                        }}
                      >
                        {brand.name.charAt(0)}
                      </span>
                    )}
                    <span className="text-lg">{getTypeIcon(brand.type)}</span>
                  </div>
                </div>

                {/* Card body */}
                <div className="flex flex-col flex-1 p-4 gap-2 justify-between">
                  <div>
                    <p className="text-[#F0EEF8] font-semibold text-sm leading-snug truncate">
                      {brand.name}
                    </p>
                    <p className="text-[10px] text-[#7A7890] uppercase tracking-wider truncate">
                      {brand.type} · {productCount} product{productCount === 1 ? '' : 's'}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className="inline-block text-[10px] px-2 py-0.5 rounded-full font-medium"
                      style={{
                        background: 'rgba(201,168,76,0.1)',
                        color: '#C9A84C',
                        border: '1px solid rgba(201,168,76,0.25)',
                      }}
                    >
                      {brand.floor}
                    </span>
                    <span className="text-xs text-[#7A7890] group-hover:text-[#C9A84C] transition-colors duration-200">
                      Shop now →
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
          </div>
        ) : (
          <div className="text-center py-16 text-[#7A7890] text-sm mb-14">
            No brands match your search.
          </div>
        )}

        {filteredBrands.length > 8 && (
          <div className="flex justify-center mb-14">
            <button
              onClick={() => setShowAll((v) => !v)}
              className="px-6 py-2 rounded-full text-xs font-medium border border-[rgba(201,168,76,0.3)] text-[#C9A84C] hover:bg-[rgba(201,168,76,0.08)] transition"
            >
              {showAll ? 'Show less' : `View all ${filteredBrands.length} stores`}
            </button>
          </div>
        )}

        {/* Offers */}
        <div>
          <p className="section-eyebrow mb-2">Exclusive</p>
          <h3 className="text-xl font-serif text-[#F0EEF8] mb-6">
            Current{' '}
            <span className="gold-text">Offers</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {STATIC_OFFERS.map((offer) => (
              <div
                key={offer.title}
                onClick={() => handleOfferClick(offer)}
                className="rounded-2xl p-6 border border-[rgba(201,168,76,0.15)] cursor-pointer hover:border-[rgba(201,168,76,0.4)] transition group"
                style={{ background: offer.gradient }}
              >
                <span
                  className="inline-block text-[10px] tracking-widest uppercase px-2 py-0.5 rounded mb-3 font-medium"
                  style={{
                    background: 'rgba(201,168,76,0.15)',
                    color: '#C9A84C',
                    border: '1px solid rgba(201,168,76,0.3)',
                  }}
                >
                  {offer.badge}
                </span>
                <h4 className="font-serif text-lg text-[#F0EEF8] mb-1 group-hover:text-[#E8C97A] transition">
                  {offer.title}
                </h4>
                <p className="text-xs text-[#B8B4D0]">{offer.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
