'use client'
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, Trash2, ShoppingCart } from 'lucide-react'
import toast from 'react-hot-toast'
import useStore from '@/store/useStore'

export default function WishlistDrawer() {
  const { wishlist, wishlistOpen, setWishlistOpen, removeFromWishlist, addToCart, setCartOpen } = useStore()

  useEffect(() => {
    const handle = (e: KeyboardEvent) => { if (e.key === 'Escape') setWishlistOpen(false) }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [setWishlistOpen])

  useEffect(() => {
    document.body.style.overflow = wishlistOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [wishlistOpen])

  const moveToCart = (item: typeof wishlist[0]) => {
    addToCart(item, item.brandName)
    removeFromWishlist(item.id)
    toast.success(`${item.name} moved to cart`, { icon: '🛍️' })
    setWishlistOpen(false)
    setCartOpen(true)
  }

  return (
    <AnimatePresence>
      {wishlistOpen && (
        <>
          <motion.div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setWishlistOpen(false)} />

          <motion.div
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md flex flex-col"
            style={{ background: 'var(--bg-accent)', borderLeft: '1px solid rgba(201,168,76,0.15)' }}
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(201,168,76,0.1)]">
              <div className="flex items-center gap-3">
                <Heart size={20} style={{ color: 'var(--gold)' }} />
                <span className="font-medium text-text-primary">Wishlist</span>
                {wishlist.length > 0 && (
                  <span className="w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold text-bg-primary bg-gold">{wishlist.length}</span>
                )}
              </div>
              <button className="text-text-muted hover:text-text-primary transition-colors" onClick={() => setWishlistOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              <AnimatePresence initial={false}>
                {wishlist.length === 0 ? (
                  <motion.div className="flex flex-col items-center justify-center h-64 gap-3"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Heart size={48} style={{ color: 'var(--text-light)' }} />
                    <p className="text-text-muted font-medium">Your wishlist is empty</p>
                    <span className="text-text-light text-sm">Save items you love</span>
                  </motion.div>
                ) : (
                  wishlist.map(item => (
                    <motion.div key={item.id} className="flex gap-4 p-4 rounded-xl"
                      style={{ background: 'var(--bg-card)', border: '1px solid rgba(201,168,76,0.08)' }}
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }} layout>
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-bg-accent">
                        {item.image
                          ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center font-serif text-2xl text-gold">{item.name.charAt(0)}</div>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-text-primary text-sm font-medium truncate">{item.name}</p>
                        <p className="text-text-muted text-xs mt-0.5">{item.brandName}</p>
                        <p className="text-gold text-sm font-semibold mt-1">{item.price}</p>
                        <button className="flex items-center gap-1.5 mt-2 text-xs text-text-muted hover:text-gold transition-colors"
                          onClick={() => moveToCart(item)}>
                          <ShoppingCart size={12} /> Move to Cart
                        </button>
                      </div>
                      <button className="text-text-light hover:text-red-400 transition-colors self-start mt-1"
                        onClick={() => removeFromWishlist(item.id)}>
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
