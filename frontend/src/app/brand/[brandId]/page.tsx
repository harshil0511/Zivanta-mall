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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ background: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-2 border-gold border-t-transparent mx-auto mb-4"
            style={{ animation: 'spin 0.8s linear infinite' }} />
          <p className="text-text-muted text-sm">Loading…</p>
        </div>
      </div>
    )
  }

  const brand = brands.find(b => b.id === brandId)
  if (!brand && !loading) {
    router.replace('/')
    return null
  }

  return (
    <>
      <DataProvider />
      <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
        <Header />
        {brand && <ProductGallery brand={brand} onBack={() => router.back()} />}
        <Footer />
        <CartDrawer />
        <WishlistDrawer />
        <SearchModal />
      </div>
    </>
  )
}
