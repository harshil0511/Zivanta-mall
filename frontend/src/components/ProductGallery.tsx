'use client'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, ArrowLeft, Star, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'
import useStore from '@/store/useStore'
import type { Brand } from '@/types'

interface Props { brand: Brand; onBack: () => void }

export default function ProductGallery({ brand, onBack }: Props) {
  const { addToCart, toggleWishlist, isInWishlist, setCartOpen } = useStore()

  const handleAddToCart = (product: Brand['products'][0]) => {
    addToCart(product, brand.name)
    toast.success(`${product.name} added to cart`, { icon: '🛍️', duration: 2500 })
    setCartOpen(true)
  }

  const handleWishlist = (product: Brand['products'][0]) => {
    const inList = isInWishlist(product.id)
    toggleWishlist(product, brand.name)
    toast(inList ? 'Removed from wishlist' : 'Added to wishlist', { icon: inList ? '💔' : '❤️', duration: 2000 })
  }

  return (
    <section className="min-h-screen pt-24 pb-16 px-6" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <button
            className="flex items-center gap-2 text-text-muted hover:text-gold transition-colors text-sm mb-6"
            onClick={onBack}>
            <ArrowLeft size={16} /> Back to Directory
          </button>

          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-serif text-3xl flex-shrink-0"
              style={{ background: 'var(--bg-card)', border: '1px solid rgba(201,168,76,0.2)', color: 'var(--gold)' }}>
              {brand.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xs font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(201,168,76,0.1)', color: 'var(--gold)', border: '1px solid rgba(201,168,76,0.2)' }}>
                  {brand.type}
                </span>
                <span className="flex items-center gap-1 text-text-muted text-xs">
                  <MapPin size={12} /> {brand.floor}
                </span>
              </div>
              <h2 className="font-serif text-4xl font-light text-text-primary">{brand.name}</h2>
              {brand.description && <p className="text-text-secondary text-sm mt-1 max-w-xl">{brand.description}</p>}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {(!brand.products || brand.products.length === 0) ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <ShoppingCart size={48} style={{ color: 'var(--text-light)' }} />
            <p className="text-text-muted">No products listed for this brand yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {brand.products.map((product, i) => {
              const inWishlist = isInWishlist(product.id)
              return (
                <motion.div
                  key={product.id}
                  className="rounded-2xl overflow-hidden group cursor-default"
                  style={{ background: 'var(--bg-card)', border: '1px solid rgba(201,168,76,0.1)' }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden bg-bg-accent">
                    {product.image
                      ? <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      : <div className="w-full h-full flex items-center justify-center font-serif text-5xl" style={{ color: 'var(--text-light)' }}>{product.name.charAt(0)}</div>
                    }
                    <span className="absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{ background: 'rgba(8,7,26,0.8)', color: 'var(--gold)', border: '1px solid rgba(201,168,76,0.2)' }}>
                      {product.category}
                    </span>
                    <button
                      className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                      style={{
                        background: inWishlist ? 'var(--gold)' : 'rgba(8,7,26,0.7)',
                        color: inWishlist ? '#08071A' : 'var(--text-secondary)',
                        border: '1px solid rgba(201,168,76,0.3)',
                      }}
                      onClick={() => handleWishlist(product)}
                      aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}>
                      <Heart size={14} fill={inWishlist ? 'currentColor' : 'none'} />
                    </button>
                  </div>

                  {/* Details */}
                  <div className="p-4">
                    <h3 className="text-text-primary font-medium text-sm leading-snug mb-2 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold" style={{ color: 'var(--gold)' }}>{product.price}</span>
                      <span className="flex items-center gap-1 text-xs text-text-muted">
                        <Star size={11} fill="var(--gold)" style={{ color: 'var(--gold)' }} />
                        {product.rating}
                      </span>
                    </div>
                    <button
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:opacity-90"
                      style={{ background: 'linear-gradient(135deg, #C9A84C, #A07830)', color: '#08071A' }}
                      onClick={() => handleAddToCart(product)}>
                      <ShoppingCart size={14} /> Add to Cart
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
