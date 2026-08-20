'use client'

import { useMemo, useState } from 'react'
import useStore from '@/store/useStore'
import ProductCard from './ProductCard'
import type { Brand } from '@/types'

const PAGE_SIZE = 8

interface Props { brands: Brand[] }

/** Shoppable grid pulling products from every active store in the mall. */
export default function ShopSection({ brands }: Props) {
  const [filter, setFilter] = useState('All')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const cartCount = useStore(s => s.cart.length)

  const items = useMemo(
    () =>
      brands.flatMap(brand =>
        (brand.products ?? []).map(product => ({ product, brand })),
      ),
    [brands],
  )

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(items.map(i => i.brand.type).filter(Boolean)))].slice(0, 7),
    [items],
  )

  const filtered = filter === 'All' ? items : items.filter(i => i.brand.type === filter)

  if (items.length === 0) return null

  return (
    <section id="shop" className="py-12 px-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="section-eyebrow">Shop the Mall</p>
          <h3 className="section-heading">Trending <span className="gold-text">Products</span></h3>
          <p className="text-text-secondary text-sm mt-2">
            {items.length} pieces from {brands.length} stores — delivered or ready for in-store pickup.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => { setFilter(c); setVisibleCount(PAGE_SIZE) }}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${
                filter === c
                  ? 'bg-[#C9A84C] border-[#C9A84C] text-[#08071A]'
                  : 'border-[rgba(201,168,76,0.2)] text-[#B8B4D0] hover:border-[rgba(201,168,76,0.5)] hover:text-[#C9A84C]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {filtered.slice(0, visibleCount).map(({ product, brand }, i) => (
          <ProductCard
            key={product.id}
            product={product}
            brandName={brand.name}
            showBrand
            index={i % PAGE_SIZE}
          />
        ))}
      </div>

      {filtered.length > visibleCount && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
            className="px-6 py-2 rounded-full text-xs font-medium border border-[rgba(201,168,76,0.3)] text-[#C9A84C] hover:bg-[rgba(201,168,76,0.08)] transition"
          >
            Load more products
          </button>
        </div>
      )}

      {filtered.length === 0 && (
        <p className="text-center text-text-muted text-sm py-12">No products in this category yet.</p>
      )}

      {cartCount > 0 && (
        <p className="text-center text-text-muted text-xs mt-6">
          Items stay in your cart while you keep browsing.
        </p>
      )}
    </section>
  )
}
