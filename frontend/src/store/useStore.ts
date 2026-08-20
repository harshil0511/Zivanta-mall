'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Brand, Category, CartItem, Product } from '@/types'

interface StoreState {
  brands: Brand[]
  categories: Category[]
  loading: boolean
  hydrated: boolean
  setHydrated: () => void
  setBrands: (brands: Brand[]) => void
  setCategories: (categories: Category[]) => void
  setLoading: (loading: boolean) => void

  cart: CartItem[]
  addToCart: (product: Product, brandName: string, qty?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, qty: number) => void
  clearCart: () => void
  cartCount: () => number
  cartTotal: () => number
  cartQuantity: (productId: string) => number
  syncWithCatalog: (brands: Brand[]) => void

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
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),
      setBrands: (brands) => {
        set({ brands })
        get().syncWithCatalog(brands)
      },
      setCategories: (categories) => set({ categories }),
      setLoading: (loading) => set({ loading }),

      cart: [],
      addToCart(product, brandName, qty = 1) {
        const { cart } = get()
        const existing = cart.find(i => i.id === product.id)
        if (existing) {
          set({ cart: cart.map(i => i.id === product.id ? { ...i, ...product, brandName, quantity: i.quantity + qty } : i) })
        } else {
          set({ cart: [...cart, { ...product, brandName, quantity: qty }] })
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
      cartQuantity: (productId) => get().cart.find(i => i.id === productId)?.quantity ?? 0,

      // Keeps the persisted cart/wishlist in step with the live catalogue:
      // items the admin edited are refreshed, items removed are dropped.
      syncWithCatalog(brands) {
        if (brands.length === 0) return
        const catalog = new Map<string, { product: Product; brandName: string }>()
        brands.forEach(brand => {
          if (brand.is_active === false) return
          brand.products?.forEach(product => catalog.set(product.id, { product, brandName: brand.name }))
        })

        const reconcile = <T extends CartItem>(items: T[]): T[] =>
          items.reduce<T[]>((acc, item) => {
            const match = catalog.get(item.id)
            if (match) acc.push({ ...item, ...match.product, brandName: match.brandName })
            return acc
          }, [])

        const { cart, wishlist } = get()
        const nextCart = reconcile(cart)
        const nextWishlist = reconcile(wishlist)
        if (JSON.stringify(nextCart) !== JSON.stringify(cart)) set({ cart: nextCart })
        if (JSON.stringify(nextWishlist) !== JSON.stringify(wishlist)) set({ wishlist: nextWishlist })
      },

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
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    }
  )
)

export default useStore
