import DataProvider from '@/components/DataProvider'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import FestivalBanner from '@/components/FestivalBanner'
import HomeContent from '@/components/HomeContent'
import LoyaltySection from '@/components/LoyaltySection'
import LeasingSection from '@/components/LeasingSection'
import Footer from '@/components/Footer'
import FloatingChat from '@/components/FloatingChat'
import AssistantWidget from '@/components/AssistantWidget'
import CartDrawer from '@/components/CartDrawer'
import WishlistDrawer from '@/components/WishlistDrawer'
import SearchModal from '@/components/SearchModal'

export default function HomePage() {
  return (
    <>
      <DataProvider />
      <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
        <Header />
        <Hero />
        <FestivalBanner />
        <HomeContent />
        <LoyaltySection />
        <LeasingSection />
        <Footer />
        <FloatingChat />
        <AssistantWidget />
        <CartDrawer />
        <WishlistDrawer />
        <SearchModal />
      </div>
    </>
  )
}
