'use client'
import { useMemo, useState } from 'react'
import { ShoppingBag, ArrowLeft, MapPin, Globe } from 'lucide-react'
import useStore from '@/store/useStore'
import ProductCard from './ProductCard'
import type { Brand } from '@/types'

interface Props { brand: Brand; onBack: () => void }

const SORTS = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Top Rated'] as const
type Sort = (typeof SORTS)[number]

const toNumber = (price: string) => parseFloat(String(price).replace(/[^0-9.]/g, '')) || 0

export default function ProductGallery({ brand, onBack }: Props) {
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState<Sort>('Featured')
  const cart = useStore(s => s.cart)
  const setCartOpen = useStore(s => s.setCartOpen)

  const products = brand.products ?? []

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))],
    [products],
  )

  const visible = useMemo(() => {
    const list = category === 'All' ? [...products] : products.filter(p => p.category === category)
    switch (sort) {
      case 'Price: Low to High': return list.sort((a, b) => toNumber(a.price) - toNumber(b.price))
      case 'Price: High to Low': return list.sort((a, b) => toNumber(b.price) - toNumber(a.price))
      case 'Top Rated':          return list.sort((a, b) => b.rating - a.rating)
      default:                   return list
    }
  }, [products, category, sort])

  const itemsFromBrand = cart.filter(i => i.brand_id === brand.id).reduce((s, i) => s + i.quantity, 0)

  return (
    <section className="pb-20" style={{ background: 'var(--bg-primary)' }}>
      {/* Store hero */}
      <div className="relative overflow-hidden" style={{ minHeight: '320px' }}>
        {brand.cover_image_url ? (
          <img src={brand.cover_image_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #110F2A 0%, #1A1840 100%)' }} />
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(8,7,26,0.85) 0%, rgba(8,7,26,0.7) 40%, var(--bg-primary) 100%)' }} />

        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-10">
          <button
            className="flex items-center gap-2 text-text-muted hover:text-gold transition-colors text-sm mb-8"
            onClick={onBack}>
            <ArrowLeft size={16} /> Back to Directory
          </button>

          <div className="flex flex-wrap items-end gap-5">
            <div className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center font-serif text-3xl flex-shrink-0"
              style={{ background: 'var(--bg-card)', border: '1px solid rgba(201,168,76,0.25)', color: 'var(--gold)' }}>
              {brand.logo_url
                ? <img src={brand.logo_url} alt={brand.name} className="w-full h-full object-cover" />
                : brand.name.charAt(0)}
            </div>

            <div className="flex-1 min-w-[240px]">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="text-xs font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(201,168,76,0.1)', color: 'var(--gold)', border: '1px solid rgba(201,168,76,0.2)' }}>
                  {brand.type}
                </span>
                <span className="flex items-center gap-1 text-text-muted text-xs">
                  <MapPin size={12} /> {brand.floor}
                </span>
                <span className="text-text-muted text-xs">
                  {products.length} product{products.length === 1 ? '' : 's'}
                </span>
                {brand.website_url && (
                  <a href={brand.website_url} target="_blank" rel="noreferrer"
                    className="flex items-center gap-1 text-xs text-text-muted hover:text-gold transition-colors">
                    <Globe size={12} /> Website
                  </a>
                )}
              </div>
              <h1 className="font-serif text-4xl md:text-5xl font-light text-text-primary">{brand.name}</h1>
              {brand.description && (
                <p className="text-text-secondary text-sm mt-2 max-w-2xl leading-relaxed">{brand.description}</p>
              )}
            </div>

            {itemsFromBrand > 0 && (
              <button className="btn-gold flex items-center gap-2 text-sm" onClick={() => setCartOpen(true)}>
                <ShoppingBag size={15} /> {itemsFromBrand} in cart
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <ShoppingBag size={48} style={{ color: 'var(--text-light)' }} />
            <p className="text-text-muted">No products listed for this store yet.</p>
          </div>
        ) : (
          <>
            {/* Filter bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div className="flex flex-wrap gap-2">
                {categories.map(c => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${
                      category === c
                        ? 'bg-[#C9A84C] border-[#C9A84C] text-[#08071A]'
                        : 'border-[rgba(201,168,76,0.2)] text-[#B8B4D0] hover:border-[rgba(201,168,76,0.5)] hover:text-[#C9A84C]'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <select
                value={sort}
                onChange={e => setSort(e.target.value as Sort)}
                aria-label="Sort products"
                className="bg-bg-card border border-[rgba(201,168,76,0.15)] rounded-xl px-3 py-2 text-xs text-text-secondary outline-none focus:border-gold"
              >
                {SORTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {visible.map((product, i) => (
                <ProductCard key={product.id} product={product} brandName={brand.name} index={i} />
              ))}
            </div>

            {visible.length === 0 && (
              <p className="text-center text-text-muted text-sm py-16">No products in this category.</p>
            )}
          </>
        )}
      </div>
    </section>
  )
}
