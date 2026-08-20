'use client'
import { motion } from 'framer-motion'
import { Heart, Minus, Plus, ShoppingCart, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import useStore from '@/store/useStore'
import type { Product } from '@/types'

interface Props {
  product: Product
  brandName: string
  /** Shown above the product name — useful on mixed-brand grids. */
  showBrand?: boolean
  index?: number
}

export default function ProductCard({ product, brandName, showBrand = false, index = 0 }: Props) {
  const { addToCart, updateQuantity, toggleWishlist, isInWishlist, cartQuantity, setCartOpen, hydrated } = useStore()

  const quantity   = hydrated ? cartQuantity(product.id) : 0
  const inWishlist = hydrated && isInWishlist(product.id)

  const handleAdd = () => {
    addToCart(product, brandName)
    toast.success(`${product.name} added to cart`, { icon: '🛍️', duration: 2000 })
  }

  const handleWishlist = () => {
    toggleWishlist(product, brandName)
    toast(inWishlist ? 'Removed from wishlist' : 'Saved to wishlist', {
      icon: inWishlist ? '💔' : '❤️',
      duration: 1800,
    })
  }

  return (
    <motion.article
      className="flex flex-col rounded-2xl overflow-hidden group h-full"
      style={{ background: 'var(--bg-card)', border: '1px solid rgba(201,168,76,0.1)' }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, delay: Math.min(index, 6) * 0.05 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-bg-accent">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-serif text-5xl" style={{ color: 'var(--text-light)' }}>
            {product.name.charAt(0)}
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[rgba(8,7,26,0.85)] to-transparent pointer-events-none" />

        {product.category && (
          <span className="absolute top-3 left-3 text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-medium"
            style={{ background: 'rgba(8,7,26,0.8)', color: 'var(--gold)', border: '1px solid rgba(201,168,76,0.2)' }}>
            {product.category}
          </span>
        )}

        <button
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
          style={{
            background: inWishlist ? 'var(--gold)' : 'rgba(8,7,26,0.7)',
            color: inWishlist ? '#08071A' : 'var(--text-secondary)',
            border: '1px solid rgba(201,168,76,0.3)',
          }}
          onClick={handleWishlist}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={14} fill={inWishlist ? 'currentColor' : 'none'} />
        </button>

        {quantity > 0 && (
          <span className="absolute bottom-3 left-3 text-[10px] font-semibold px-2 py-1 rounded-full"
            style={{ background: 'var(--gold)', color: '#08071A' }}>
            {quantity} in cart
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4">
        {showBrand && (
          <p className="text-[10px] uppercase tracking-[0.18em] mb-1" style={{ color: 'var(--gold)' }}>{brandName}</p>
        )}
        <h3 className="text-text-primary font-medium text-sm leading-snug line-clamp-2">{product.name}</h3>

        <div className="flex items-center justify-between mt-2 mb-3">
          <span className="font-semibold" style={{ color: 'var(--gold)' }}>{product.price}</span>
          <span className="flex items-center gap-1 text-xs text-text-muted">
            <Star size={11} fill="var(--gold)" style={{ color: 'var(--gold)' }} />
            {product.rating}
          </span>
        </div>

        <div className="mt-auto">
          {quantity > 0 ? (
            <div className="flex items-center justify-between gap-2 rounded-xl p-1"
              style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.25)' }}>
              <button
                className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-gold transition-colors"
                onClick={() => updateQuantity(product.id, quantity - 1)}
                aria-label={`Decrease quantity of ${product.name}`}
              >
                <Minus size={14} />
              </button>
              <span className="text-sm font-semibold text-text-primary">{quantity}</span>
              <button
                className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-gold transition-colors"
                onClick={() => addToCart(product, brandName)}
                aria-label={`Increase quantity of ${product.name}`}
              >
                <Plus size={14} />
              </button>
              <button
                className="text-[11px] font-medium px-3 py-1.5 rounded-lg"
                style={{ background: 'linear-gradient(135deg, #C9A84C, #A07830)', color: '#08071A' }}
                onClick={() => setCartOpen(true)}
              >
                View cart
              </button>
            </div>
          ) : (
            <button
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #C9A84C, #A07830)', color: '#08071A' }}
              onClick={handleAdd}
            >
              <ShoppingCart size={14} /> Add to Cart
            </button>
          )}
        </div>
      </div>
    </motion.article>
  )
}
