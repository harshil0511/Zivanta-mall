'use client'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { ShoppingCart, Heart, Search, X } from 'lucide-react'
import useStore from '@/store/useStore'

const NAV_ITEMS = ['Brands', 'Dining', 'Entertainment', 'Offers', 'Events']

export default function Header() {
  const router   = useRouter()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const { cart, wishlist, setCartOpen, setWishlistOpen, setSearchOpen } = useStore()
  const cartCount     = cart.reduce((s, i) => s + i.quantity, 0)
  const wishlistCount = wishlist.length

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  const scrollToSection = (item: string) => {
    const map: Record<string, string> = { Brands: 'brands', Dining: 'brands', Entertainment: 'brands', Offers: 'brands', Events: 'events' }
    const el = document.getElementById(map[item])
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNavClick = (e: React.MouseEvent, item: string) => {
    e.preventDefault()
    setMenuOpen(false)
    if (pathname !== '/') {
      router.push('/')
      setTimeout(() => scrollToSection(item), 300)
    } else {
      scrollToSection(item)
    }
  }

  const goHome = () => { router.push('/'); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  const headerBase = 'fixed top-0 left-0 right-0 z-50 transition-all duration-300'
  const headerScrolled = scrolled
    ? 'bg-bg-dark/95 backdrop-blur-xl border-b border-[rgba(201,168,76,0.15)] shadow-lg shadow-black/30'
    : 'bg-transparent'

  const iconBtn = 'relative flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 text-text-secondary hover:text-gold hover:bg-[rgba(201,168,76,0.08)]'
  const badge   = 'absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center rounded-full text-[9px] font-bold text-bg-primary bg-gold'

  return (
    <>
      <header className={`${headerBase} ${headerScrolled}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={goHome}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 2L19.5 10H28L21.5 15L24 23L16 18L8 23L10.5 15L4 10H12.5L16 2Z" fill="url(#goldGrad)" />
              <defs>
                <linearGradient id="goldGrad" x1="4" y1="2" x2="28" y2="23">
                  <stop stopColor="#E8C97A" /><stop offset="1" stopColor="#A07830" />
                </linearGradient>
              </defs>
            </svg>
            <div className="flex flex-col leading-none">
              <span className="font-serif text-lg font-semibold tracking-[0.15em] text-text-primary">ZIVANTA</span>
              <span className="text-[9px] font-medium tracking-[0.3em] uppercase text-gold opacity-80">LUXURY MALL</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map(item => (
              <a key={item} href="#" onClick={e => handleNavClick(e, item)}
                className="text-sm font-medium tracking-wide text-text-secondary hover:text-gold transition-colors duration-200 relative group">
                {item}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button className={iconBtn} aria-label="Search" onClick={() => setSearchOpen(true)}>
              <Search size={18} />
            </button>
            <button className={iconBtn} aria-label="Wishlist" onClick={() => setWishlistOpen(true)}>
              <Heart size={18} />
              {wishlistCount > 0 && <span className={badge}>{wishlistCount}</span>}
            </button>
            <button className={iconBtn} aria-label="Cart" onClick={() => setCartOpen(true)}>
              <ShoppingCart size={18} />
              {cartCount > 0 && <span className={badge}>{cartCount}</span>}
            </button>

            {/* Hamburger */}
            <button className="md:hidden flex flex-col gap-1.5 w-9 h-9 items-center justify-center" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
              <span className={`block h-px w-5 bg-text-secondary transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2.5' : ''}`} />
              <span className={`block h-px w-5 bg-text-secondary transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-px w-5 bg-text-secondary transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-40 bg-bg-dark/98 backdrop-blur-xl flex flex-col transition-all duration-300 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <button className="absolute top-5 right-6 text-text-secondary hover:text-gold transition-colors" onClick={() => setMenuOpen(false)}>
          <X size={24} />
        </button>
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {NAV_ITEMS.map(item => (
            <a key={item} href="#" className="font-serif text-3xl font-light text-text-primary hover:text-gold transition-colors"
              onClick={e => handleNavClick(e, item)}>
              {item}
            </a>
          ))}
          <div className="w-12 h-px bg-[rgba(201,168,76,0.2)]" />
          <a href="/v1/admin" className="text-sm text-text-muted hover:text-gold transition-colors tracking-widest uppercase">Admin Portal</a>
        </div>
      </div>
    </>
  )
}
