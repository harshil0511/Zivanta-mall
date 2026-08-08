'use client'

import { useRef, useEffect, useState } from 'react'
import type { Brand } from '@/types'

// High-quality luxury lifestyle images per brand type
const TYPE_IMAGES: Record<string, string> = {
  fashion:       'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=85',
  jewellery:     'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=900&q=85',
  watches:       'https://images.unsplash.com/photo-1587836374828-4dbaba94ee0e?w=900&q=85',
  electronics:   'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&q=85',
  dining:        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=85',
  entertainment: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=900&q=85',
}

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&q=85',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=85',
  'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=900&q=85',
  'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=900&q=85',
  'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=900&q=85',
]

interface FeaturedSliderProps {
  brands: Brand[]
  onBrandSelect: (id: string) => void
}

export default function FeaturedSlider({ brands, onBrandSelect }: FeaturedSliderProps) {
  const slides = brands.slice(0, 8)
  if (slides.length === 0) return null

  const getImage = (brand: Brand, index: number): string => {
    // 1. Use product image if available
    if (brand.products && brand.products.length > 0 && brand.products[0].image) {
      return brand.products[0].image
    }
    // 2. Use type-specific luxury image
    const typeImg = TYPE_IMAGES[brand.type?.toLowerCase() ?? '']
    if (typeImg) return typeImg
    // 3. Fallback
    return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]
  }

  // Triple slides for seamless infinite loop
  const listItems = [...slides, ...slides, ...slides]

  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const isMouseDownRef = useRef(false)
  const startXRef = useRef(0)
  const scrollLeftStartRef = useRef(0)
  const startPageXRef = useRef(0)

  // Auto-scroll marquee
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    let rafId: number

    const tick = () => {
      if (!isHovered && !isMouseDownRef.current) {
        container.scrollLeft += 0.7

        const secondSetChild = container.children[slides.length] as HTMLElement
        if (secondSetChild) {
          const oneSetWidth = secondSetChild.offsetLeft
          if (container.scrollLeft >= oneSetWidth) {
            container.scrollLeft -= oneSetWidth
          }
        }
      }
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [isHovered, slides.length])

  // Mouse wheel horizontal scrolling redirect
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault()
        container.scrollLeft += e.deltaY * 0.8
      }
    }
    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      container.removeEventListener('wheel', handleWheel)
    }
  }, [])

  // Drag-to-scroll
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const c = containerRef.current
    if (!c) return
    isMouseDownRef.current = true
    startPageXRef.current = e.pageX
    startXRef.current = e.pageX - c.offsetLeft
    scrollLeftStartRef.current = c.scrollLeft
  }
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMouseDownRef.current) return
    e.preventDefault()
    const c = containerRef.current
    if (!c) return
    const x = e.pageX - c.offsetLeft
    c.scrollLeft = scrollLeftStartRef.current - (x - startXRef.current) * 1.5
  }
  const handleMouseUpOrLeave = () => { isMouseDownRef.current = false }

  return (
    <section className="py-20 px-6 bg-bg-primary overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="section-eyebrow">Featured</p>
          <h2 className="section-heading">
            Spotlight{' '}
            <span className="gold-text">Destinations</span>
          </h2>
        </div>

        {/* Scrollable marquee row — no arrow buttons, mouse drag + auto-scroll */}
        <div
          ref={containerRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => { setIsHovered(false); handleMouseUpOrLeave() }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          className="flex gap-6 overflow-x-auto custom-scrollbar select-none cursor-grab active:cursor-grabbing pb-4"
          style={{ scrollBehavior: 'auto' }}
        >
          {listItems.map((brand, idx) => (
            <div
              key={`${brand.id}-${idx}`}
              onClick={(e) => {
                if (Math.abs(e.pageX - startPageXRef.current) > 5) return
                onBrandSelect(brand.id)
              }}
              className="group relative flex-shrink-0 overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
              style={{ width: 340, height: 420 }}
            >
              {/* Full bleed image */}
              <img
                src={getImage(brand, idx % slides.length)}
                alt={brand.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                draggable={false}
              />

              {/* Gradient overlay — always visible */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {/* Gold border glow on hover */}
              <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-[rgba(201,168,76,0.5)] transition-all duration-300" />

              {/* Content at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-2">
                {/* Badge */}
                <span className="self-start text-[10px] tracking-widest uppercase px-2.5 py-0.5 rounded-full font-medium"
                  style={{
                    background: 'rgba(201,168,76,0.15)',
                    color: '#C9A84C',
                    border: '1px solid rgba(201,168,76,0.4)',
                  }}
                >
                  {brand.type}
                </span>

                {/* Brand name */}
                <h3 className="font-serif text-2xl text-[#F0EEF8] leading-tight">
                  {brand.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-[#B8B4D0] line-clamp-2 leading-relaxed">
                  {brand.description}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-3 text-xs text-[#7A7890] mt-1">
                  <span>🕙 10AM – 10PM</span>
                  <span>📍 {brand.floor}</span>
                </div>

                {/* CTA — appears on hover */}
                <button
                  className="btn-gold text-sm mt-2 self-start opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                  onClick={(e) => {
                    e.stopPropagation()
                    onBrandSelect(brand.id)
                  }}
                >
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <p className="text-center text-xs text-[#7A7890] mt-4 select-none">
          Drag to explore · Hover to pause
        </p>
      </div>
    </section>
  )
}
