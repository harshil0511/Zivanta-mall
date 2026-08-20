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

  const money = (v: number) => `$${v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  const lineTotal = (price: string, qty: number) => (parseFloat(String(price).replace(/[$,]/g, '')) || 0) * qty

  const FREE_SHIPPING_THRESHOLD = 500
  const shipping = total === 0 || total >= FREE_SHIPPING_THRESHOLD ? 0 : 25
  const tax = total * 0.08

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
                    <button className="btn-gold mt-2 text-sm" onClick={() => setCartOpen(false)}>Continue shopping</button>
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
                        <p className="text-text-light text-xs mt-1">{item.price} each</p>
                        <div className="flex items-center justify-between gap-2 mt-2">
                          <div className="flex items-center gap-2">
                            <button className="w-6 h-6 flex items-center justify-center rounded-md bg-bg-accent text-text-secondary hover:text-gold transition-colors"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              aria-label={`Decrease quantity of ${item.name}`}>
                              <Minus size={12} />
                            </button>
                            <span className="text-text-primary text-sm w-6 text-center">{item.quantity}</span>
                            <button className="w-6 h-6 flex items-center justify-center rounded-md bg-bg-accent text-text-secondary hover:text-gold transition-colors"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              aria-label={`Increase quantity of ${item.name}`}>
                              <Plus size={12} />
                            </button>
                          </div>
                          <span className="text-gold text-sm font-semibold">{money(lineTotal(item.price, item.quantity))}</span>
                        </div>
                      </div>
                      <button className="text-text-light hover:text-red-400 transition-colors self-start mt-1"
                        aria-label={`Remove ${item.name} from cart`}
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
              <div className="px-6 py-5 border-t border-[rgba(201,168,76,0.1)] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary text-sm">Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''})</span>
                  <span className="text-text-primary text-sm">{money(total)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary text-sm">Estimated tax</span>
                  <span className="text-text-primary text-sm">{money(tax)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary text-sm">Delivery</span>
                  <span className="text-text-primary text-sm">{shipping === 0 ? 'Complimentary' : money(shipping)}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-text-light text-xs pt-1">
                    Add {money(FREE_SHIPPING_THRESHOLD - total)} more for complimentary delivery.
                  </p>
                )}
                <div className="flex items-center justify-between pt-3 mt-2 border-t border-[rgba(201,168,76,0.1)]">
                  <span className="text-text-primary font-medium">Total</span>
                  <span className="text-gold text-lg font-semibold">{money(total + tax + shipping)}</span>
                </div>
                <button className="btn-gold w-full justify-center mt-4 mb-2" onClick={handleCheckout}>
                  Proceed to Checkout
                </button>
                <div className="flex items-center justify-between">
                  <button className="text-text-muted hover:text-text-secondary text-xs py-1 transition-colors"
                    onClick={() => setCartOpen(false)}>
                    Continue shopping
                  </button>
                  <button className="text-text-muted hover:text-red-400 text-xs py-1 transition-colors"
                    onClick={clearCart}>
                    Clear cart
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
