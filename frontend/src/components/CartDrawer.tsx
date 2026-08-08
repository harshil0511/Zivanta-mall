'use client'
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react'
import toast from 'react-hot-toast'
import useStore from '@/store/useStore'

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, removeFromCart, updateQuantity, clearCart } = useStore()
  const total     = cart.reduce((sum, i) => sum + (parseFloat(String(i.price).replace(/[$,]/g, '')) || 0) * i.quantity, 0)
  const itemCount = cart.reduce((s, i) => s + i.quantity, 0)

  useEffect(() => {
    const handle = (e: KeyboardEvent) => { if (e.key === 'Escape') setCartOpen(false) }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [setCartOpen])

  useEffect(() => {
    document.body.style.overflow = cartOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [cartOpen])

  const handleCheckout = () => {
    toast.success('Order placed! Our team will contact you shortly.', { duration: 4000 })
    clearCart()
    setCartOpen(false)
  }

  const inputStyle = 'w-full px-4 py-3 rounded-xl bg-bg-card border border-[rgba(201,168,76,0.15)] text-text-primary text-sm placeholder:text-text-muted outline-none focus:border-gold transition'

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)} />

          <motion.div
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md flex flex-col"
            style={{ background: 'var(--bg-accent)', borderLeft: '1px solid rgba(201,168,76,0.15)' }}
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(201,168,76,0.1)]">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} style={{ color: 'var(--gold)' }} />
                <span className="font-medium text-text-primary">Your Cart</span>
                {itemCount > 0 && (
                  <span className="w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold text-bg-primary bg-gold">{itemCount}</span>
                )}
              </div>
              <button className="text-text-muted hover:text-text-primary transition-colors" onClick={() => setCartOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              <AnimatePresence initial={false}>
                {cart.length === 0 ? (
                  <motion.div className="flex flex-col items-center justify-center h-64 gap-3"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <ShoppingBag size={48} style={{ color: 'var(--text-light)' }} />
                    <p className="text-text-muted font-medium">Your cart is empty</p>
                    <span className="text-text-light text-sm">Add items from our brand stores</span>
                  </motion.div>
                ) : (
                  cart.map(item => (
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
                        <div className="flex items-center gap-2 mt-2">
                          <button className="w-6 h-6 flex items-center justify-center rounded-md bg-bg-accent text-text-secondary hover:text-gold transition-colors"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                            <Minus size={12} />
                          </button>
                          <span className="text-text-primary text-sm w-6 text-center">{item.quantity}</span>
                          <button className="w-6 h-6 flex items-center justify-center rounded-md bg-bg-accent text-text-secondary hover:text-gold transition-colors"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                      <button className="text-text-light hover:text-red-400 transition-colors self-start mt-1"
                        onClick={() => removeFromCart(item.id)}>
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="px-6 py-5 border-t border-[rgba(201,168,76,0.1)]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-text-secondary text-sm">Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''})</span>
                  <span className="text-text-primary font-semibold">${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <p className="text-text-light text-xs mb-4">Taxes and shipping calculated at checkout</p>
                <button className="btn-gold w-full justify-center mb-2" onClick={handleCheckout}>
                  Proceed to Checkout
                </button>
                <button className="text-text-muted hover:text-text-secondary text-sm w-full text-center py-1 transition-colors"
                  onClick={clearCart}>
                  Clear cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
