'use client'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import useStore from '@/store/useStore'
import DataProvider from '@/components/DataProvider'
import Header from '@/components/Header'
import ProductGallery from '@/components/ProductGallery'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'
import WishlistDrawer from '@/components/WishlistDrawer'
import SearchModal from '@/components/SearchModal'

export default function BrandPage() {
  const { brandId } = useParams<{ brandId: string }>()
  const router      = useRouter()
  const { brands, loading } = useStore()

  const brand = brands.find(b => b.id === brandId)

  useEffect(() => {
    if (!loading && !brand) router.replace('/')
  }, [loading, brand, router])

  return (
    <>
      {/* Mounted unconditionally so the catalogue also loads on a direct visit or refresh. */}
      <DataProvider />
      <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
        <Header />
        {loading ? (
          <div className="flex items-center justify-center" style={{ minHeight: '80vh' }}>
            <div className="text-center">
              <div className="w-10 h-10 rounded-full border-2 border-gold border-t-transparent mx-auto mb-4"
                style={{ animation: 'spin 0.8s linear infinite' }} />
              <p className="text-text-muted text-sm">Loading…</p>
            </div>
          </div>
        ) : brand ? (
          <ProductGallery brand={brand} onBack={() => router.push('/')} />
        ) : (
          <div className="flex flex-col items-center justify-center gap-3" style={{ minHeight: '80vh' }}>
            <p className="font-serif text-2xl text-text-primary">Store not found</p>
            <p className="text-text-muted text-sm">Taking you back to the directory…</p>
          </div>
        )}
        <Footer />
        <CartDrawer />
        <WishlistDrawer />
        <SearchModal />
      </div>
    </>
  )
}
