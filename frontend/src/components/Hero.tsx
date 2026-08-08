'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ArrowRight } from 'lucide-react'
import { getBanners, trackOfferClick } from '@/lib/api'
import type { HeroBanner } from '@/types'

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  key: i,
  left: `${(i * 5.3 + 3) % 100}%`,
  delay: `${(i * 0.31) % 6}s`,
  duration: `${4 + (i * 0.3) % 6}s`,
  size: `${1 + (i * 0.15) % 2}px`,
}))

export default function Hero() {
  const contentRef = useRef<HTMLDivElement>(null)
  const [banners, setBanners] = useState<HeroBanner[]>([])
  const [heroIndex, setHeroIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  // Fetch banners
  useEffect(() => {
    getBanners(true)
      .then((res) => {
        setBanners(res || [])
      })
      .catch((err) => {
        console.error('Failed to load hero banners:', err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  // Auto slide hero
  useEffect(() => {
    if (banners.length <= 1) return
    const t = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % banners.length)
    }, 6000)
    return () => clearInterval(t)
  }, [banners])

  // Fade-in animation for fallback static content
  useEffect(() => {
    if (loading || banners.length > 0) return
    const el = contentRef.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(40px)'
    const t = setTimeout(() => {
      el.style.transition = 'opacity 1s ease, transform 1s ease'
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
    }, 200)
    return () => clearTimeout(t)
  }, [loading, banners])

  const scrollDown = () => document.getElementById('brands')?.scrollIntoView({ behavior: 'smooth' })

  const handleBannerClick = (bannerId: string) => {
    trackOfferClick(bannerId).catch(() => {})
  }

  if (loading) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-[#05040F] overflow-hidden">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs tracking-widest text-[#C9A84C] uppercase">Loading Luxury...</span>
        </div>
      </section>
    )
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Dynamic Banner Slider */}
      {banners.length > 0 ? (
        <>
          <div className="absolute inset-0 z-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={heroIndex}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0"
              >
                <img
                  src={banners[heroIndex].image_url}
                  alt="Promotion banner"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#05040F]/80 via-[#05040F]/40 to-[#08071A]" />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Particles floating over slider */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
            {PARTICLES.map(p => (
              <span key={p.key} className="absolute rounded-full bg-gold/40"
                style={{ left: p.left, bottom: '-10px', width: p.size, height: p.size,
                  animation: `floatUp ${p.duration} ${p.delay} ease-in-out infinite` }} />
            ))}
          </div>

          <div className="relative z-20 text-center px-6 max-w-4xl mx-auto pt-20">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-[rgba(201,168,76,0.3)] bg-[rgba(201,168,76,0.06)]"
            >
              <Sparkles className="w-4 h-4 text-[#C9A84C]" />
              <span className="text-xs font-medium tracking-widest uppercase text-[#C9A84C]">Exclusive Campaigns</span>
            </motion.div>

            <h1 className="font-serif font-light leading-none mb-6">
              <span className="block text-4xl md:text-6xl text-[#F0EEF8] mb-2 truncate max-w-full">
                {banners[heroIndex].cta_text || 'Luxury Destination'}
              </span>
            </h1>

            {banners[heroIndex].redirect_url && (
              <a
                href={banners[heroIndex].redirect_url}
                onClick={() => handleBannerClick(banners[heroIndex].id)}
                className="btn-gold inline-flex items-center gap-2 mt-4 px-8 py-3.5 hover:scale-105 transition"
              >
                <span>Discover Promotion</span>
                <ArrowRight size={16} />
              </a>
            )}
          </div>

          {/* Dots */}
          {banners.length > 1 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setHeroIndex(idx)}
                  className={`w-8 h-1.5 rounded-full transition-all duration-300 ${
                    idx === heroIndex ? 'bg-[#C9A84C]' : 'bg-[rgba(201,168,76,0.25)]'
                  }`}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        /* Fallback Static Luxury Hero */
        <>
          {/* BG image */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=85&auto=format&fit=crop"
              alt="Luxury mall interior"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/70 via-bg-primary/50 to-bg-primary" />
            <div className="absolute inset-0 bg-gradient-to-r from-bg-primary/40 via-transparent to-bg-primary/40" />
            <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-bg-primary to-transparent" />
          </div>

          {/* Particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {PARTICLES.map(p => (
              <span key={p.key} className="absolute rounded-full bg-gold/40"
                style={{ left: p.left, bottom: '-10px', width: p.size, height: p.size,
                  animation: `floatUp ${p.duration} ${p.delay} ease-in-out infinite` }} />
            ))}
          </div>

          {/* Content */}
          <div ref={contentRef} className="relative z-10 text-center px-6 max-w-4xl mx-auto pt-20">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-[rgba(201,168,76,0.3)] bg-[rgba(201,168,76,0.06)]">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span className="text-xs font-medium tracking-widest uppercase text-gold">Premium Experience</span>
            </div>

            <h1 className="font-serif font-light leading-none mb-6">
              <span className="block text-5xl md:text-7xl text-text-primary mb-2">Where Luxury</span>
              <span className="block text-5xl md:text-7xl gold-text italic">Meets Lifestyle</span>
            </h1>

            <p className="text-base md:text-lg text-text-secondary max-w-xl mx-auto mb-10 leading-relaxed">
              Discover 200+ world-class brands, fine dining, and<br className="hidden md:block" />
              curated experiences under one iconic roof.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button className="btn-gold flex items-center gap-2 justify-center" onClick={scrollDown}>
                <span>Explore Now</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="btn-outline" onClick={scrollDown}>View Directory</button>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-12 md:gap-20">
              {[{ num: '200+', label: 'Premium Brands' }, { num: '50+', label: 'Restaurants' }, { num: '4', label: 'Experience Zones' }].map(s => (
                <div key={s.label} className="text-center">
                  <div className="font-serif text-3xl font-light gold-text">{s.num}</div>
                  <div className="text-xs text-text-muted tracking-wider mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-light z-20">
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-gold/40" />
        <span className="text-[10px] tracking-widest uppercase">Scroll</span>
      </div>

      <style jsx>{`
        @keyframes floatUp {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh); opacity: 0; }
        }
      `}</style>
    </section>
  )
}
