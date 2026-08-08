'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Brand, Category, CartItem, Product } from '@/types'

interface StoreState {
  brands: Brand[]
  categories: Category[]
  loading: boolean
  setBrands: (brands: Brand[]) => void
  setCategories: (categories: Category[]) => void
  setLoading: (loading: boolean) => void

  cart: CartItem[]
  addToCart: (product: Product, brandName: string) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, qty: number) => void
  clearCart: () => void
  cartCount: () => number
  cartTotal: () => number

  wishlist: CartItem[]
  toggleWishlist: (product: Product, brandName: string) => void
  isInWishlist: (productId: string) => boolean
  removeFromWishlist: (productId: string) => void

  brandFilter: string
  setBrandFilter: (v: string) => void

  cartOpen: boolean
  setCartOpen: (v: boolean) => void
  wishlistOpen: boolean
  setWishlistOpen: (v: boolean) => void
  searchOpen: boolean
  setSearchOpen: (v: boolean) => void
  chatOpen: boolean
  setChatOpen: (v: boolean) => void
}

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      brands: [],
      categories: [],
      loading: true,
      setBrands: (brands) => set({ brands }),
      setCategories: (categories) => set({ categories }),
      setLoading: (loading) => set({ loading }),

      cart: [],
      addToCart(product, brandName) {
        const { cart } = get()
        const existing = cart.find(i => i.id === product.id)
        if (existing) {
          set({ cart: cart.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i) })
        } else {
          set({ cart: [...cart, { ...product, brandName, quantity: 1 }] })
        }
      },
      removeFromCart(productId) {
        set({ cart: get().cart.filter(i => i.id !== productId) })
      },
      updateQuantity(productId, qty) {
        if (qty <= 0) { get().removeFromCart(productId); return }
        set({ cart: get().cart.map(i => i.id === productId ? { ...i, quantity: qty } : i) })
      },
      clearCart() { set({ cart: [] }) },
      cartCount: () => get().cart.reduce((t, i) => t + i.quantity, 0),
      cartTotal: () => get().cart.reduce((total, item) => {
        const price = parseFloat(String(item.price).replace(/[$,]/g, '')) || 0
        return total + price * item.quantity
      }, 0),

      wishlist: [],
      toggleWishlist(product, brandName) {
        const inList = get().wishlist.some(i => i.id === product.id)
        if (inList) {
          set({ wishlist: get().wishlist.filter(i => i.id !== product.id) })
        } else {
          set({ wishlist: [...get().wishlist, { ...product, brandName, quantity: 1 }] })
        }
      },
      isInWishlist: (productId) => get().wishlist.some(i => i.id === productId),
      removeFromWishlist: (productId) => set({ wishlist: get().wishlist.filter(i => i.id !== productId) }),

      brandFilter: 'All', setBrandFilter: (v) => set({ brandFilter: v }),

      cartOpen: false, setCartOpen: (v) => set({ cartOpen: v }),
      wishlistOpen: false, setWishlistOpen: (v) => set({ wishlistOpen: v }),
      searchOpen: false, setSearchOpen: (v) => set({ searchOpen: v }),
      chatOpen: false, setChatOpen: (v) => set({ chatOpen: v }),
    }),
    {
      name: 'zivanta-store',
      partialize: (state) => ({ cart: state.cart, wishlist: state.wishlist }),
    }
  )
)

export default useStore
