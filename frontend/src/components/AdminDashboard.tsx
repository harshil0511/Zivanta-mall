'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Trash2, Save, LogOut, Store, Package, Star, ImageOff, Upload, Link,
  FileText, Users, Loader, Percent, Calendar, Tag, Image, Megaphone, Ticket,
  TrendingUp, BarChart2, Eye, MousePointerClick, RefreshCw, X, Search, Edit2
} from 'lucide-react'
import toast from 'react-hot-toast'
import {
  createBrand, updateBrand, deleteBrand, getBrands, getLeasingInquiries, getLoyaltyMembers,
  getOffers, createOffer, updateOffer, deleteOffer,
  getCampaigns, createCampaign, updateCampaign, deleteCampaign,
  getBanners, createBanner, updateBanner, deleteBanner,
  getCoupons, createCoupon, updateCoupon, deleteCoupon,
  getFlashSales, createFlashSale, updateFlashSale, deleteFlashSale,
  getMediaLibrary, deleteMediaLibrary, uploadImageFile, getDashboardStats, DashboardStats
} from '@/lib/api'
import type {
  Brand, Product, LeasingInquiryRecord, LoyaltyMember,
  Offer, PromotionalCampaign, HeroBanner, Coupon, FlashSale, MediaImage
} from '@/types'

type TabType = 'overview' | 'brands' | 'offers' | 'banners' | 'campaigns' | 'coupons' | 'flash' | 'submissions' | 'media'

interface AdminDashboardProps {
  brands: Brand[]
  onBrandsChange: (brands: Brand[]) => void
  token: string
  onLogout: () => void
}

export default function AdminDashboard({ brands, onBrandsChange, token, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)

  // Media library state
  const [mediaList, setMediaList] = useState<MediaImage[]>([])
  const [mediaLoading, setMediaLoading] = useState(false)
  const [mediaSearch, setMediaSearch] = useState('')
  const [showMediaSelector, setShowMediaSelector] = useState<((url: string) => void) | null>(null)

  // Brands management
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
  const [isEditingBrand, setIsEditingBrand] = useState(false)

  // Offers management
  const [offersList, setOffersList] = useState<Offer[]>([])
  const [offersLoading, setOffersLoading] = useState(false)
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null)
  const [isEditingOffer, setIsEditingOffer] = useState(false)

  // Banners management
  const [bannersList, setBannersList] = useState<HeroBanner[]>([])
  const [bannersLoading, setBannersLoading] = useState(false)
  const [selectedBanner, setSelectedBanner] = useState<HeroBanner | null>(null)
  const [isEditingBanner, setIsEditingBanner] = useState(false)

  // Campaigns management
  const [campaignsList, setCampaignsList] = useState<PromotionalCampaign[]>([])
  const [campaignsLoading, setCampaignsLoading] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<PromotionalCampaign | null>(null)
  const [isEditingCampaign, setIsEditingCampaign] = useState(false)

  // Coupons management
  const [couponsList, setCouponsList] = useState<Coupon[]>([])
  const [couponsLoading, setCouponsLoading] = useState(false)
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null)
  const [isEditingCoupon, setIsEditingCoupon] = useState(false)

  // Flash sales management
  const [flashList, setFlashList] = useState<FlashSale[]>([])
  const [flashLoading, setFlashLoading] = useState(false)
  const [selectedFlash, setSelectedFlash] = useState<FlashSale | null>(null)
  const [isEditingFlash, setIsEditingFlash] = useState(false)

  // Submissions view
  const [submissionSubTab, setSubmissionSubTab] = useState<'leasing' | 'members'>('leasing')

  // Load Overview stats
  const fetchStats = () => {
    setStatsLoading(true)
    getDashboardStats(token)
      .then(setStats)
      .catch((err) => toast.error(`Stats failed: ${err.message}`))
      .finally(() => setStatsLoading(false))
  }

  useEffect(() => {
    fetchStats()
    loadMedia()
  }, [])

  // Dynamic loaders on tab click
  useEffect(() => {
    if (activeTab === 'overview') fetchStats()
    else if (activeTab === 'offers') loadOffers()
    else if (activeTab === 'banners') loadBanners()
    else if (activeTab === 'campaigns') loadCampaigns()
    else if (activeTab === 'coupons') loadCoupons()
    else if (activeTab === 'flash') loadFlash()
    else if (activeTab === 'media') loadMedia()
  }, [activeTab])

  // --- API Loaders ---
  const loadMedia = () => {
    setMediaLoading(true)
    getMediaLibrary()
      .then(setMediaList)
      .catch((err) => toast.error(`Media load failed: ${err.message}`))
      .finally(() => setMediaLoading(false))
  }

  const loadOffers = () => {
    setOffersLoading(true)
    getOffers({ is_active: undefined })
      .then(setOffersList)
      .catch((err) => toast.error(`Offers load failed: ${err.message}`))
      .finally(() => setOffersLoading(false))
  }

  const loadBanners = () => {
    setBannersLoading(true)
    getBanners(false)
      .then(setBannersList)
      .catch((err) => toast.error(`Banners load failed: ${err.message}`))
      .finally(() => setBannersLoading(false))
  }

  const loadCampaigns = () => {
    setCampaignsLoading(true)
    getCampaigns(false)
      .then(setCampaignsList)
      .catch((err) => toast.error(`Campaigns load failed: ${err.message}`))
      .finally(() => setCampaignsLoading(false))
  }

  const loadCoupons = () => {
    setCouponsLoading(true)
    getCoupons(false)
      .then(setCouponsList)
      .catch((err) => toast.error(`Coupons load failed: ${err.message}`))
      .finally(() => setCouponsLoading(false))
  }

  const loadFlash = () => {
    setFlashLoading(true)
    getFlashSales(false)
      .then(setFlashList)
      .catch((err) => toast.error(`Flash sales load failed: ${err.message}`))
      .finally(() => setFlashLoading(false))
  }

  // --- Upload Helper ---
  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>, onUrlAcquired: (url: string) => void) => {
    const file = e.target.files?.[0]
    if (!file) return
    const loadingToast = toast.loading('Uploading image...')
    try {
      const res = await uploadImageFile(file, token)
      onUrlAcquired(res.url)
      toast.success('Uploaded successfully!', { id: loadingToast })
      loadMedia()
    } catch (err: any) {
      toast.error(err.message || 'Upload failed', { id: loadingToast })
    }
  }

  return (
    <div className="flex min-h-screen bg-[#05040F] text-[#F0EEF8] font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[rgba(201,168,76,0.12)] bg-[#08071A] flex flex-col flex-shrink-0">
        {/* Branding */}
        <div className="h-16 flex items-center px-6 border-b border-[rgba(201,168,76,0.12)]">
          <span className="font-serif text-xl font-medium tracking-wide">
            ZIVANTA <span className="gold-text">ADMIN</span>
          </span>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          <SidebarButton active={activeTab === 'overview'} icon={<TrendingUp size={18} />} label="Overview" onClick={() => setActiveTab('overview')} />
          <SidebarButton active={activeTab === 'brands'} icon={<Store size={18} />} label="Brands" onClick={() => setActiveTab('brands')} />
          <SidebarButton active={activeTab === 'offers'} icon={<Percent size={18} />} label="Offers" onClick={() => setActiveTab('offers')} />
          <SidebarButton active={activeTab === 'banners'} icon={<Image size={18} />} label="Hero Banners" onClick={() => setActiveTab('banners')} />
          <SidebarButton active={activeTab === 'campaigns'} icon={<Megaphone size={18} />} label="Campaigns" onClick={() => setActiveTab('campaigns')} />
          <SidebarButton active={activeTab === 'coupons'} icon={<Ticket size={18} />} label="Coupons" onClick={() => setActiveTab('coupons')} />
          <SidebarButton active={activeTab === 'flash'} icon={<Calendar size={18} />} label="Flash Sales" onClick={() => setActiveTab('flash')} />
          <SidebarButton active={activeTab === 'submissions'} icon={<FileText size={18} />} label="Submissions" onClick={() => setActiveTab('submissions')} />
          <SidebarButton active={activeTab === 'media'} icon={<Image size={18} />} label="Media Library" onClick={() => setActiveTab('media')} />
        </nav>

        {/* Footer Logout */}
        <div className="p-4 border-t border-[rgba(201,168,76,0.12)]">
          <button onClick={onLogout} className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto custom-scrollbar">
        {/* Top Header */}
        <header className="h-16 border-b border-[rgba(201,168,76,0.12)] bg-[#08071A]/80 backdrop-blur flex items-center justify-between px-8 sticky top-0 z-20">
          <h2 className="font-serif text-lg text-text-primary capitalize">{activeTab} Panel</h2>
          <div className="flex items-center gap-3 text-xs text-text-muted">
            <span>Server Time: {new Date().toLocaleTimeString()}</span>
          </div>
        </header>

        {/* Module Content Switcher */}
        <div className="flex-grow">
          {activeTab === 'overview' && (
            <OverviewTab stats={stats} loading={statsLoading} onRefresh={fetchStats} />
          )}

          {activeTab === 'brands' && (
            <BrandsTab
              brands={brands}
              selectedBrand={selectedBrand}
              isEditing={isEditingBrand}
              onSelect={setSelectedBrand}
              onEditChange={setIsEditingBrand}
              token={token}
              onBrandsChange={onBrandsChange}
              openMedia={(onSelectUrl) => setShowMediaSelector(() => onSelectUrl)}
            />
          )}

          {activeTab === 'offers' && (
            <OffersTab
              offers={offersList}
              brands={brands}
              loading={offersLoading}
              selectedOffer={selectedOffer}
              isEditing={isEditingOffer}
              onSelect={setSelectedOffer}
              onEditChange={setIsEditingOffer}
              token={token}
              onRefresh={loadOffers}
              openMedia={(onSelectUrl) => setShowMediaSelector(() => onSelectUrl)}
            />
          )}

          {activeTab === 'banners' && (
            <BannersTab
              banners={bannersList}
              loading={bannersLoading}
              selectedBanner={selectedBanner}
              isEditing={isEditingBanner}
              onSelect={setSelectedBanner}
              onEditChange={setIsEditingBanner}
              token={token}
              onRefresh={loadBanners}
              openMedia={(onSelectUrl) => setShowMediaSelector(() => onSelectUrl)}
            />
          )}

          {activeTab === 'campaigns' && (
            <CampaignsTab
              campaigns={campaignsList}
              loading={campaignsLoading}
              selectedCampaign={selectedCampaign}
              isEditing={isEditingCampaign}
              onSelect={setSelectedCampaign}
              onEditChange={setIsEditingCampaign}
              token={token}
              onRefresh={loadCampaigns}
              openMedia={(onSelectUrl) => setShowMediaSelector(() => onSelectUrl)}
            />
          )}

          {activeTab === 'coupons' && (
            <CouponsTab
              coupons={couponsList}
              loading={couponsLoading}
              selectedCoupon={selectedCoupon}
              isEditing={isEditingCoupon}
              onSelect={setSelectedCoupon}
              onEditChange={setIsEditingCoupon}
              token={token}
              onRefresh={loadCoupons}
            />
          )}

          {activeTab === 'flash' && (
            <FlashSalesTab
              sales={flashList}
              brands={brands}
              loading={flashLoading}
              selectedSale={selectedFlash}
              isEditing={isEditingFlash}
              onSelect={setSelectedFlash}
              onEditChange={setIsEditingFlash}
              token={token}
              onRefresh={loadFlash}
            />
          )}

          {activeTab === 'submissions' && (
            <div className="p-8 space-y-6">
              <div className="flex border-b border-[rgba(201,168,76,0.15)] pb-px">
                <button
                  onClick={() => setSubmissionSubTab('leasing')}
                  className={`px-6 py-2.5 text-sm font-medium border-b-2 transition-all ${
                    submissionSubTab === 'leasing' ? 'border-[#C9A84C] text-[#C9A84C]' : 'border-transparent text-text-muted hover:text-text-primary'
                  }`}
                >
                  Leasing Inquiries
                </button>
                <button
                  onClick={() => setSubmissionSubTab('members')}
                  className={`px-6 py-2.5 text-sm font-medium border-b-2 transition-all ${
                    submissionSubTab === 'members' ? 'border-[#C9A84C] text-[#C9A84C]' : 'border-transparent text-text-muted hover:text-text-primary'
                  }`}
                >
                  Loyalty Members
                </button>
              </div>
              <SubmissionsPanel view={submissionSubTab} token={token} />
            </div>
          )}

          {activeTab === 'media' && (
            <MediaTab
              media={mediaList}
              loading={mediaLoading}
              search={mediaSearch}
              onSearchChange={setMediaSearch}
              token={token}
              onRefresh={loadMedia}
              onUpload={handleUploadImage}
            />
          )}
        </div>
      </main>

      {/* Media Library Selector Modal Popup */}
      <AnimatePresence>
        {showMediaSelector && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-8">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#08071A] border border-[rgba(201,168,76,0.2)] rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
            >
              <div className="h-16 border-b border-[rgba(201,168,76,0.12)] flex items-center justify-between px-6 bg-bg-card">
                <h3 className="font-serif text-lg text-text-primary">Select Image from Media Library</h3>
                <button
                  onClick={() => setShowMediaSelector(null)}
                  className="p-2 text-text-muted hover:text-[#C9A84C] transition"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <div className="mb-6 flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search image filename..."
                      value={mediaSearch}
                      onChange={(e) => setMediaSearch(e.target.value)}
                      className="w-full bg-[#110F2A] border border-[rgba(201,168,76,0.15)] pl-10 pr-4 py-2 rounded-xl text-sm outline-none focus:border-[#C9A84C]"
                    />
                  </div>
                  <label className="btn-gold flex items-center gap-2 cursor-pointer text-xs py-2 px-4 whitespace-nowrap">
                    <Upload size={14} /> Upload File
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleUploadImage(e, (url) => {
                        showMediaSelector(url)
                        setShowMediaSelector(null)
                      })}
                      className="hidden"
                    />
                  </label>
                </div>

                {mediaLoading ? (
                  <div className="text-center py-20 text-text-muted">Loading media...</div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                    {mediaList
                      .filter((m) => m.filename.toLowerCase().includes(mediaSearch.toLowerCase()))
                      .map((m) => (
                        <div
                          key={m.id}
                          onClick={() => {
                            showMediaSelector(m.url)
                            setShowMediaSelector(null)
                          }}
                          className="group relative aspect-square bg-[#14122E] rounded-xl border border-[rgba(201,168,76,0.1)] overflow-hidden cursor-pointer hover:border-[#C9A84C] transition-all"
                        >
                          <img
                            src={m.url}
                            alt={m.filename}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all p-2 text-center">
                            <span className="text-xs text-[#C9A84C] font-medium truncate w-full">{m.filename}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Submissions submissions panel from original AdminDashboard
function SubmissionsPanel({ view, token }: { view: 'leasing' | 'members'; token: string }) {
  const [leasing, setLeasing] = useState<LeasingInquiryRecord[]>([])
  const [members, setMembers] = useState<LoyaltyMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)
    const fetcher = view === 'leasing' ? getLeasingInquiries(token) : getLoyaltyMembers(token)
    fetcher
      .then((data) => {
        if (!active) return
        if (view === 'leasing') setLeasing(data as LeasingInquiryRecord[])
        else setMembers(data as LoyaltyMember[])
      })
      .catch((e: unknown) => active && setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [view, token])

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-text-muted text-sm py-16 justify-center">
        <Loader className="w-4 h-4 animate-spin" /> Loading…
      </div>
    )
  }

  if (error) return <div className="text-center py-16 text-red-400 text-sm">{error}</div>

  const list = view === 'leasing' ? leasing : members
  if (list.length === 0) return <div className="text-center py-16 text-text-muted">No submissions found.</div>

  return (
    <div className="rounded-2xl overflow-hidden bg-bg-card border border-[rgba(201,168,76,0.1)]">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-[rgba(201,168,76,0.12)] bg-[#110F2A] text-xs font-semibold text-text-muted uppercase tracking-wider">
            {view === 'leasing' ? (
              <>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Message</th>
              </>
            ) : (
              <>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Tier</th>
                <th className="px-6 py-4">Points</th>
              </>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-[rgba(201,168,76,0.06)] text-sm">
          {view === 'leasing' ? (
            leasing.map((row) => (
              <tr key={row.id} className="hover:bg-[rgba(201,168,76,0.02)] transition">
                <td className="px-6 py-4 font-medium text-text-primary">{row.full_name}</td>
                <td className="px-6 py-4">{row.company_name}</td>
                <td className="px-6 py-4">{row.email}</td>
                <td className="px-6 py-4 text-xs font-semibold text-[#C9A84C]">{row.category}</td>
                <td className="px-6 py-4 text-text-muted leading-relaxed max-w-xs truncate">{row.message}</td>
              </tr>
            ))
          ) : (
            members.map((row) => (
              <tr key={row.id} className="hover:bg-[rgba(201,168,76,0.02)] transition">
                <td className="px-6 py-4 font-medium text-text-primary">{row.name}</td>
                <td className="px-6 py-4">{row.email}</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                    style={{
                      background: row.tier === 'Platinum' ? 'rgba(240,238,248,0.1)' : 'rgba(201,168,76,0.1)',
                      color: row.tier === 'Platinum' ? '#fff' : '#C9A84C'
                    }}>
                    {row.tier}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono font-bold text-[#C9A84C]">{row.points} pts</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

// ── SUB-COMPONENTS & VIEWS ───────────────────────────────────────────────────

function SidebarButton({ active, icon, label, onClick }: { active: boolean; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
        active
          ? 'bg-[#C9A84C] text-[#08071A] font-semibold'
          : 'text-[#B8B4D0] hover:bg-[rgba(201,168,76,0.08)] hover:text-[#C9A84C]'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

// ── OVERVIEW VIEW ────────────────────────────────────────────────────────────

function OverviewTab({ stats, loading, onRefresh }: { stats: DashboardStats | null; loading: boolean; onRefresh: () => void }) {
  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader className="w-8 h-8 text-[#C9A84C] animate-spin" />
          <span className="text-text-muted text-sm">Gathering metrics...</span>
        </div>
      </div>
    )
  }

  const { summary, charts } = stats

  return (
    <div className="p-8 space-y-8">
      {/* Upper bar with refresh */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif text-3xl font-light text-[#F0EEF8]">Dashboard Analytics</h1>
          <p className="text-text-muted text-xs mt-1">Realtime overview of promotional performance across Zivanta.</p>
        </div>
        <button
          onClick={onRefresh}
          className="p-2 border border-[rgba(201,168,76,0.25)] rounded-xl hover:bg-[rgba(201,168,76,0.08)] transition-all flex items-center gap-2 text-xs font-semibold text-[#C9A84C]"
        >
          <RefreshCw size={14} /> Reload Stats
        </button>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <StatsCard icon={<Store className="text-[#C9A84C]" />} title="Total Brands" value={summary.totalBrands} />
        <StatsCard icon={<Percent className="text-[#C9A84C]" />} title="Active Offers" value={summary.activeOffers} subtitle={`${summary.scheduledOffers} Scheduled`} />
        <StatsCard icon={<Calendar className="text-[#C9A84C]" />} title="Expired Offers" value={summary.expiredOffers} />
        <StatsCard icon={<Megaphone className="text-[#C9A84C]" />} title="Active Campaigns" value={summary.activeCampaigns} />
        <StatsCard icon={<Image className="text-[#C9A84C]" />} title="Hero Banners" value={summary.totalBanners} />
        <StatsCard icon={<Ticket className="text-[#C9A84C]" />} title="Active Coupons" value={summary.totalCoupons} />
        <StatsCard icon={<Eye className="text-[#C9A84C]" />} title="Total Views" value={summary.totalViews} />
        <StatsCard icon={<MousePointerClick className="text-[#C9A84C]" />} title="Total Clicks" value={summary.totalClicks} subtitle={`CTR: ${summary.totalViews ? ((summary.totalClicks / summary.totalViews) * 100).toFixed(1) : 0}%`} />
      </div>

      {/* SVG Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Offer Performance */}
        <div className="bg-[#14122E] border border-[rgba(201,168,76,0.12)] p-6 rounded-3xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-lg">Top Offer Performance</h3>
            <span className="text-[10px] text-text-muted">Clicks vs Views</span>
          </div>
          {charts.offerPerformance.length === 0 ? (
            <div className="text-center py-20 text-text-muted text-sm">No offer view data recorded yet.</div>
          ) : (
            <div className="space-y-6">
              {charts.offerPerformance.map((item, idx) => {
                const maxVal = Math.max(...charts.offerPerformance.map((o) => o.views), 1)
                const viewWidth = (item.views / maxVal) * 100
                const clickWidth = (item.clicks / maxVal) * 100
                return (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium truncate max-w-[70%]">{item.title}</span>
                      <span className="text-text-muted">{item.clicks} clicks / {item.views} views</span>
                    </div>
                    <div className="h-3 bg-[#110F2A] rounded-full overflow-hidden relative">
                      <div className="absolute top-0 left-0 h-full bg-[#C9A84C]/25 rounded-full transition-all duration-500" style={{ width: `${viewWidth}%` }} />
                      <div className="absolute top-0 left-0 h-full bg-[#C9A84C] rounded-full transition-all duration-500" style={{ width: `${clickWidth}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Chart 2: Brand Clicks */}
        <div className="bg-[#14122E] border border-[rgba(201,168,76,0.12)] p-6 rounded-3xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-lg">Most Clicked Brands</h3>
            <span className="text-[10px] text-text-muted">Total Clicks</span>
          </div>
          {charts.brandAnalytics.length === 0 ? (
            <div className="text-center py-20 text-text-muted text-sm">No clicks registered on brand offers yet.</div>
          ) : (
            <div className="h-60 flex items-end gap-6 justify-center px-4">
              {charts.brandAnalytics.map((item, idx) => {
                const maxClicks = Math.max(...charts.brandAnalytics.map((b) => b.clicks), 1)
                const pct = (item.clicks / maxClicks) * 100
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-3 h-full justify-end">
                    <span className="text-xs text-[#C9A84C] font-semibold">{item.clicks}</span>
                    <div className="w-full bg-[#C9A84C] rounded-t-lg transition-all duration-500 hover:opacity-80" style={{ height: `${pct * 0.7}%` }} />
                    <span className="text-xs text-text-muted truncate w-full text-center">{item.name}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatsCard({ icon, title, value, subtitle }: { icon: React.ReactNode; title: string; value: number | string; subtitle?: string }) {
  return (
    <div className="bg-[#14122E] border border-[rgba(201,168,76,0.12)] rounded-3xl p-6 flex flex-col justify-between hover:border-[rgba(201,168,76,0.3)] transition">
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-muted font-medium">{title}</span>
        <div className="p-2 rounded-xl bg-[rgba(201,168,76,0.06)] border border-[rgba(201,168,76,0.1)]">{icon}</div>
      </div>
      <div className="mt-4">
        <span className="font-serif text-3xl font-light text-text-primary">{value}</span>
        {subtitle && <p className="text-[10px] text-text-muted mt-1">{subtitle}</p>}
      </div>
    </div>
  )
}

// ── BRANDS TAB ───────────────────────────────────────────────────────────────

interface BrandsTabProps {
  brands: Brand[]
  selectedBrand: Brand | null
  isEditing: boolean
  onSelect: (b: Brand | null) => void
  onEditChange: (val: boolean) => void
  token: string
  onBrandsChange: (b: Brand[]) => void
  openMedia: (onSelectUrl: (url: string) => void) => void
}

function BrandsTab({ brands, selectedBrand, isEditing, onSelect, onEditChange, token, onBrandsChange, openMedia }: BrandsTabProps) {
  const [formData, setFormData] = useState<Partial<Brand>>({})
  const [searchQuery, setSearchQuery] = useState('')

  const openEdit = (b: Brand | null) => {
    onSelect(b)
    onEditChange(true)
    setFormData(b ? { ...b } : { id: '', name: '', floor: 'Level 1', type: 'Fashion', description: '', featured: false, priority: 0, is_active: true, products: [] })
  }

  const handleSave = async () => {
    if (!formData.id || !formData.name) {
      toast.error('ID and Name are required!')
      return
    }
    const cleanId = formData.id.toLowerCase().replace(/[^a-z0-9-]/g, '')
    const payload = { ...formData, id: cleanId }

    const loadingToast = toast.loading('Saving brand info...')
    try {
      if (selectedBrand) {
        await updateBrand(selectedBrand.id, payload, token)
        toast.success('Updated successfully!', { id: loadingToast })
      } else {
        await createBrand(payload, token)
        toast.success('Created brand successfully!', { id: loadingToast })
      }
      onEditChange(false)
      onSelect(null)
      // Trigger list refresh
      const list = await getBrands()
      onBrandsChange(list)
    } catch (err: any) {
      toast.error(err.message || 'Operation failed', { id: loadingToast })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this brand and all its products?')) return
    const loadingToast = toast.loading('Deleting brand...')
    try {
      await deleteBrand(id, token)
      toast.success('Deleted successfully!', { id: loadingToast })
      const list = await getBrands()
      onBrandsChange(list)
    } catch (err: any) {
      toast.error(err.message || 'Delete failed', { id: loadingToast })
    }
  }

  return (
    <div className="p-8 space-y-6">
      {isEditing ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl bg-[#14122E] border border-[rgba(201,168,76,0.15)] p-8 rounded-3xl">
          <div className="flex justify-between items-center border-b border-[rgba(201,168,76,0.12)] pb-4">
            <h3 className="font-serif text-2xl">{selectedBrand ? 'Edit' : 'Create'} Brand</h3>
            <button onClick={() => onEditChange(false)} className="text-xs text-text-muted hover:text-text-primary">Cancel</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs text-text-muted">Unique ID</label>
              <input
                type="text"
                disabled={!!selectedBrand}
                value={formData.id || ''}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                placeholder="e.g. apple, rolex"
                className="w-full bg-[#110F2A] border border-[rgba(201,168,76,0.15)] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none disabled:opacity-50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-text-muted">Brand Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#110F2A] border border-[rgba(201,168,76,0.15)] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-text-muted">Floor location</label>
              <input
                type="text"
                value={formData.floor || ''}
                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                placeholder="e.g. Level 2, Ground Floor"
                className="w-full bg-[#110F2A] border border-[rgba(201,168,76,0.15)] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-text-muted">Category Type</label>
              <input
                type="text"
                value={formData.type || ''}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                placeholder="e.g. Watches, Jewellery, Fashion"
                className="w-full bg-[#110F2A] border border-[rgba(201,168,76,0.15)] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-text-muted">Logo Image URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.logo_url || ''}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                  className="flex-1 bg-[#110F2A] border border-[rgba(201,168,76,0.15)] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none"
                />
                <button
                  onClick={() => openMedia((url) => setFormData({ ...formData, logo_url: url }))}
                  className="p-3 bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.2)] rounded-xl hover:bg-[rgba(201,168,76,0.25)] text-[#C9A84C] transition"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-text-muted">Cover Banner Image URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.cover_image_url || ''}
                  onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                  className="flex-1 bg-[#110F2A] border border-[rgba(201,168,76,0.15)] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none"
                />
                <button
                  onClick={() => openMedia((url) => setFormData({ ...formData, cover_image_url: url }))}
                  className="p-3 bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.2)] rounded-xl hover:bg-[rgba(201,168,76,0.25)] text-[#C9A84C] transition"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-text-muted">Display Priority (Sorting Order)</label>
              <input
                type="number"
                value={formData.priority || 0}
                onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                className="w-full bg-[#110F2A] border border-[rgba(201,168,76,0.15)] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-text-muted">Website URL</label>
              <input
                type="text"
                value={formData.website_url || ''}
                onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                className="w-full bg-[#110F2A] border border-[rgba(201,168,76,0.15)] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured || false}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="rounded border-[rgba(201,168,76,0.2)] accent-[#C9A84C]"
              />
              Featured Brand (Homepage Slider)
            </label>

            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active || false}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="rounded border-[rgba(201,168,76,0.2)] accent-[#C9A84C]"
              />
              Publish (Visible on Site)
            </label>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-text-muted">Description</label>
            <textarea
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#110F2A] border border-[rgba(201,168,76,0.15)] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none"
            />
          </div>

          {/* Product row editors */}
          <div className="border-t border-[rgba(201,168,76,0.12)] pt-6 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-serif text-lg">Products Grid</h4>
              <button
                type="button"
                onClick={() => {
                  const arr = [...(formData.products || [])]
                  arr.push({ id: `p-${Date.now()}`, brand_id: formData.id || '', name: '', price: '$', rating: 5, category: formData.type || '', image: '' })
                  setFormData({ ...formData, products: arr })
                }}
                className="btn-gold flex items-center gap-2 text-xs py-1.5 px-4"
              >
                <Plus size={14} /> Add Product
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(formData.products || []).map((prod, idx) => (
                <div key={prod.id || idx} className="bg-[#110F2A] p-4 rounded-2xl border border-[rgba(201,168,76,0.1)] relative space-y-3">
                  <button
                    type="button"
                    onClick={() => {
                      const arr = (formData.products || []).filter((_, i) => i !== idx)
                      setFormData({ ...formData, products: arr })
                    }}
                    className="absolute top-2 right-2 p-1.5 text-red-400 hover:text-red-300 transition"
                  >
                    <Trash2 size={14} />
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Product Name"
                      value={prod.name}
                      onChange={(e) => {
                        const arr = [...(formData.products || [])]
                        arr[idx].name = e.target.value
                        setFormData({ ...formData, products: arr })
                      }}
                      className="bg-[#14122E] border border-[rgba(201,168,76,0.1)] rounded-lg p-2 text-xs outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Price (e.g. $250)"
                      value={prod.price}
                      onChange={(e) => {
                        const arr = [...(formData.products || [])]
                        arr[idx].price = e.target.value
                        setFormData({ ...formData, products: arr })
                      }}
                      className="bg-[#14122E] border border-[rgba(201,168,76,0.1)] rounded-lg p-2 text-xs outline-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Image URL"
                      value={prod.image}
                      onChange={(e) => {
                        const arr = [...(formData.products || [])]
                        arr[idx].image = e.target.value
                        setFormData({ ...formData, products: arr })
                      }}
                      className="flex-1 bg-[#14122E] border border-[rgba(201,168,76,0.1)] rounded-lg p-2 text-xs outline-none"
                    />
                    <button
                      onClick={() => openMedia((url) => {
                        const arr = [...(formData.products || [])]
                        arr[idx].image = url
                        setFormData({ ...formData, products: arr })
                      })}
                      className="bg-[rgba(201,168,76,0.06)] border border-[rgba(201,168,76,0.15)] px-2.5 rounded-lg text-xs"
                    >
                      Pick
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={handleSave} className="btn-gold flex items-center gap-2 mt-4 px-6 py-2.5">
            <Save size={16} /> Save Brand
          </button>
        </motion.div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
              <input
                type="text"
                placeholder="Search brands name/type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#14122E] border border-[rgba(201,168,76,0.15)] pl-10 pr-4 py-2 rounded-xl text-sm outline-none focus:border-[#C9A84C]"
              />
            </div>
            <button onClick={() => openEdit(null)} className="btn-gold flex items-center gap-2 text-xs py-2 px-4">
              <Plus size={16} /> Add New Brand
            </button>
          </div>

          <div className="rounded-2xl overflow-hidden bg-bg-card border border-[rgba(201,168,76,0.1)]">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-[rgba(201,168,76,0.12)] bg-[#110F2A] text-xs font-semibold text-text-muted uppercase tracking-wider">
                  <th className="px-6 py-4">Brand Logo</th>
                  <th className="px-6 py-4">Brand Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Priority</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(201,168,76,0.06)] text-sm">
                {brands
                  .filter((b) => b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.type.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((b) => (
                    <tr key={b.id} className="hover:bg-[rgba(201,168,76,0.02)] transition">
                      <td className="px-6 py-4">
                        {b.logo_url ? (
                          <img src={b.logo_url} alt="" className="w-8 h-8 rounded-full object-cover border border-[rgba(201,168,76,0.15)]" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[rgba(201,168,76,0.05)] border border-[rgba(201,168,76,0.12)] flex items-center justify-center text-xs text-[#C9A84C]">
                            {b.name.charAt(0)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium text-text-primary">{b.name}</td>
                      <td className="px-6 py-4 text-xs font-semibold text-[#C9A84C]">{b.type}</td>
                      <td className="px-6 py-4">{b.floor}</td>
                      <td className="px-6 py-4 font-mono">{b.priority}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${b.is_active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                          {b.is_active ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-3">
                          <button onClick={() => openEdit(b)} className="p-1.5 text-text-muted hover:text-[#C9A84C] transition">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => handleDelete(b.id)} className="p-1.5 text-text-muted hover:text-red-400 transition">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

// ── OFFERS TAB ───────────────────────────────────────────────────────────────

interface OffersTabProps {
  offers: Offer[]
  brands: Brand[]
  loading: boolean
  selectedOffer: Offer | null
  isEditing: boolean
  onSelect: (o: Offer | null) => void
  onEditChange: (val: boolean) => void
  token: string
  onRefresh: () => void
  openMedia: (onSelectUrl: (url: string) => void) => void
}

function OffersTab({ offers, brands, loading, selectedOffer, isEditing, onSelect, onEditChange, token, onRefresh, openMedia }: OffersTabProps) {
  const [formData, setFormData] = useState<Partial<Offer>>({})
  const [searchQuery, setSearchQuery] = useState('')

  const openEdit = (o: Offer | null) => {
    onSelect(o)
    onEditChange(true)
    setFormData(o ? { ...o } : {
      brand_id: brands[0]?.id || '', title: '', subtitle: '', description: '',
      discount_percentage: undefined, flat_discount: undefined, coupon_code: '',
      start_date: new Date().toISOString().slice(0, 16), end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      is_active: true, background_color: '#14122E', text_color: '#F0EEF8', display_priority: 0,
      tags: '', banner_url: '', mobile_banner_url: '', desktop_banner_url: '', is_featured: false, is_trending: false
    })
  }

  const handleSave = async () => {
    if (!formData.brand_id || !formData.title || !formData.start_date || !formData.end_date) {
      toast.error('Brand Selection, Title, Start Date and End Date are required!')
      return
    }

    const payload = {
      ...formData,
      discount_percentage: formData.discount_percentage ? parseInt(String(formData.discount_percentage)) : undefined,
      flat_discount: formData.flat_discount ? parseFloat(String(formData.flat_discount)) : undefined,
      start_date: new Date(formData.start_date!).toISOString(),
      end_date: new Date(formData.end_date!).toISOString()
    }

    const loadingToast = toast.loading('Saving offer...')
    try {
      if (selectedOffer) {
        await updateOffer(selectedOffer.id, payload, token)
        toast.success('Offer updated successfully!', { id: loadingToast })
      } else {
        await createOffer(payload, token)
        toast.success('Offer created successfully!', { id: loadingToast })
      }
      onEditChange(false)
      onSelect(null)
      onRefresh()
    } catch (err: any) {
      toast.error(err.message || 'Operation failed', { id: loadingToast })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this offer?')) return
    const loadingToast = toast.loading('Deleting offer...')
    try {
      await deleteOffer(id, token)
      toast.success('Offer deleted successfully!', { id: loadingToast })
      onRefresh()
    } catch (err: any) {
      toast.error(err.message || 'Delete failed', { id: loadingToast })
    }
  }

  return (
    <div className="p-8 space-y-6">
      {isEditing ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl bg-[#14122E] border border-[rgba(201,168,76,0.15)] p-8 rounded-3xl">
          <div className="flex justify-between items-center border-b border-[rgba(201,168,76,0.12)] pb-4">
            <h3 className="font-serif text-2xl">{selectedOffer ? 'Edit' : 'Create'} Offer</h3>
            <button onClick={() => onEditChange(false)} className="text-xs text-text-muted hover:text-text-primary">Cancel</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs text-text-muted">Associated Brand</label>
              <select
                value={formData.brand_id || ''}
                onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })}
                className="w-full bg-[#110F2A] border border-[rgba(201,168,76,0.15)] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none"
              >
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-text-muted">Offer Title</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Exclusive 30% Off Winter Coats"
                className="w-full bg-[#110F2A] border border-[rgba(201,168,76,0.15)] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-text-muted">Offer Subtitle</label>
              <input
                type="text"
                value={formData.subtitle || ''}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full bg-[#110F2A] border border-[rgba(201,168,76,0.15)] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-text-muted">Discount Percentage (%)</label>
              <input
                type="number"
                value={formData.discount_percentage === undefined ? '' : formData.discount_percentage}
                onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value ? parseInt(e.target.value) : undefined })}
                className="w-full bg-[#110F2A] border border-[rgba(201,168,76,0.15)] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-text-muted">Flat Discount Value ($)</label>
              <input
                type="number"
                value={formData.flat_discount === undefined ? '' : formData.flat_discount}
                onChange={(e) => setFormData({ ...formData, flat_discount: e.target.value ? parseFloat(e.target.value) : undefined })}
                className="w-full bg-[#110F2A] border border-[rgba(201,168,76,0.15)] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-text-muted">Coupon Promo Code (Optional)</label>
              <input
                type="text"
                value={formData.coupon_code || ''}
                onChange={(e) => setFormData({ ...formData, coupon_code: e.target.value })}
                className="w-full bg-[#110F2A] border border-[rgba(201,168,76,0.15)] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-text-muted">Start Date & Time</label>
              <input
                type="datetime-local"
                value={formData.start_date?.substring(0, 16) || ''}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full bg-[#110F2A] border border-[rgba(201,168,76,0.15)] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-text-muted">End Date & Time</label>
              <input
                type="datetime-local"
                value={formData.end_date?.substring(0, 16) || ''}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full bg-[#110F2A] border border-[rgba(201,168,76,0.15)] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-text-muted">General Banner Image URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.banner_url || ''}
                  onChange={(e) => setFormData({ ...formData, banner_url: e.target.value })}
                  className="flex-1 bg-[#110F2A] border border-[rgba(201,168,76,0.15)] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none"
                />
                <button
                  onClick={() => openMedia((url) => setFormData({ ...formData, banner_url: url }))}
                  className="p-3 bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.2)] rounded-xl hover:bg-[rgba(201,168,76,0.25)] text-[#C9A84C] transition"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-text-muted">Desktop Large Banner URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.desktop_banner_url || ''}
                  onChange={(e) => setFormData({ ...formData, desktop_banner_url: e.target.value })}
                  className="flex-1 bg-[#110F2A] border border-[rgba(201,168,76,0.15)] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none"
                />
                <button
                  onClick={() => openMedia((url) => setFormData({ ...formData, desktop_banner_url: url }))}
                  className="p-3 bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.2)] rounded-xl hover:bg-[rgba(201,168,76,0.25)] text-[#C9A84C] transition"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-text-muted">Mobile Compact Banner URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.mobile_banner_url || ''}
                  onChange={(e) => setFormData({ ...formData, mobile_banner_url: e.target.value })}
                  className="flex-1 bg-[#110F2A] border border-[rgba(201,168,76,0.15)] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none"
                />
                <button
                  onClick={() => openMedia((url) => setFormData({ ...formData, mobile_banner_url: url }))}
                  className="p-3 bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.2)] rounded-xl hover:bg-[rgba(201,168,76,0.25)] text-[#C9A84C] transition"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-text-muted">Display Priority (Sorting Order)</label>
              <input
                type="number"
                value={formData.display_priority || 0}
                onChange={(e) => setFormData({ ...formData, display_priority: parseInt(e.target.value) || 0 })}
                className="w-full bg-[#110F2A] border border-[rgba(201,168,76,0.15)] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-text-muted">Promo Tags (Comma-separated)</label>
              <input
                type="text"
                placeholder="e.g. Winter, Member Special, Limited Time"
                value={formData.tags || ''}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full bg-[#110F2A] border border-[rgba(201,168,76,0.15)] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-text-muted">Background HEX Color</label>
              <input
                type="text"
                value={formData.background_color || '#14122E'}
                onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
                className="w-full bg-[#110F2A] border border-[rgba(201,168,76,0.15)] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-text-muted">Text HEX Color</label>
              <input
                type="text"
                value={formData.text_color || '#F0EEF8'}
                onChange={(e) => setFormData({ ...formData, text_color: e.target.value })}
                className="w-full bg-[#110F2A] border border-[rgba(201,168,76,0.15)] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_featured || false}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="rounded border-[rgba(201,168,76,0.2)] accent-[#C9A84C]"
              />
              Featured Offer
            </label>

            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_trending || false}
                onChange={(e) => setFormData({ ...formData, is_trending: e.target.checked })}
                className="rounded border-[rgba(201,168,76,0.2)] accent-[#C9A84C]"
              />
              Trending Offer
            </label>

            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active || false}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="rounded border-[rgba(201,168,76,0.2)] accent-[#C9A84C]"
              />
              Publish Offer (Visible on site)
            </label>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-text-muted">Description Details</label>
            <textarea
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#110F2A] border border-[rgba(201,168,76,0.15)] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none"
            />
          </div>

          <button onClick={handleSave} className="btn-gold flex items-center gap-2 mt-4 px-6 py-2.5">
            <Save size={16} /> Save Offer
          </button>
        </motion.div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
              <input
                type="text"
                placeholder="Search offer titles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#14122E] border border-[rgba(201,168,76,0.15)] pl-10 pr-4 py-2 rounded-xl text-sm outline-none focus:border-[#C9A84C]"
              />
            </div>
            <button onClick={() => openEdit(null)} className="btn-gold flex items-center gap-2 text-xs py-2 px-4">
              <Plus size={16} /> Create Offer
            </button>
          </div>

          {loading ? (
            <div className="text-center py-20 text-text-muted">Loading Offers list...</div>
          ) : (
            <div className="rounded-2xl overflow-hidden bg-bg-card border border-[rgba(201,168,76,0.1)]">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-[rgba(201,168,76,0.12)] bg-[#110F2A] text-xs font-semibold text-text-muted uppercase tracking-wider">
                    <th className="px-6 py-4">Brand</th>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Discount</th>
                    <th className="px-6 py-4">Promo Code</th>
                    <th className="px-6 py-4">Views/Clicks</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(201,168,76,0.06)] text-sm">
                  {offers
                    .filter((o) => o.title.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((o) => (
                      <tr key={o.id} className="hover:bg-[rgba(201,168,76,0.02)] transition">
                        <td className="px-6 py-4 font-semibold text-[#C9A84C]">{o.brand_name || 'Generic'}</td>
                        <td className="px-6 py-4 font-medium text-text-primary">{o.title}</td>
                        <td className="px-6 py-4">
                          {o.discount_percentage ? `${o.discount_percentage}% Off` : o.flat_discount ? `$${o.flat_discount} Off` : 'Promo'}
                        </td>
                        <td className="px-6 py-4 font-mono text-xs">{o.coupon_code || '—'}</td>
                        <td className="px-6 py-4 text-xs font-mono">{o.views_count} / {o.clicks_count}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${o.is_active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                            {o.is_active ? 'Active' : 'Disabled'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-3">
                            <button onClick={() => openEdit(o)} className="p-1.5 text-text-muted hover:text-[#C9A84C] transition">
                              <Edit2 size={14} />
                            </button>
                            <button onClick={() => handleDelete(o.id)} className="p-1.5 text-text-muted hover:text-red-400 transition">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── BANNERS TAB ──────────────────────────────────────────────────────────────

interface BannersTabProps {
  banners: HeroBanner[]
  loading: boolean
  selectedBanner: HeroBanner | null
  isEditing: boolean
  onSelect: (b: HeroBanner | null) => void
  onEditChange: (val: boolean) => void
  token: string
  onRefresh: () => void
  openMedia: (onSelectUrl: (url: string) => void) => void
}

function BannersTab({ banners, loading, selectedBanner, isEditing, onSelect, onEditChange, token, onRefresh, openMedia }: BannersTabProps) {
  const [formData, setFormData] = useState<Partial<HeroBanner>>({})

  const openEdit = (b: HeroBanner | null) => {
    onSelect(b)
    onEditChange(true)
    setFormData(b ? { ...b } : {
      banner_type: 'hero', image_url: '', mobile_image_url: '', cta_text: '', redirect_url: '', display_order: 0, is_active: true
    })
  }

  const handleSave = async () => {
    if (!formData.image_url) {
      toast.error('Image URL is required!')
      return
    }

    const payload = {
      ...formData,
      display_order: parseInt(String(formData.display_order)) || 0,
      start_date: formData.start_date ? new Date(formData.start_date).toISOString() : undefined,
      end_date: formData.end_date ? new Date(formData.end_date).toISOString() : undefined
    }

    const loadingToast = toast.loading('Saving banner...')
    try {
      if (selectedBanner) {
        await updateBanner(selectedBanner.id, payload, token)
        toast.success('Banner updated successfully!', { id: loadingToast })
      } else {
        await createBanner(payload, token)
        toast.success('Banner created successfully!', { id: loadingToast })
      }
      onEditChange(false)
      onSelect(null)
      onRefresh()
    } catch (err: any) {
      toast.error(err.message || 'Operation failed', { id: loadingToast })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return
    const loadingToast = toast.loading('Deleting banner...')
    try {
      await deleteBanner(id, token)
      toast.success('Banner deleted successfully!', { id: loadingToast })
      onRefresh()
    } catch (err: any) {
      toast.error(err.message || 'Delete failed', { id: loadingToast })
    }
  }

  return (
    <div className="p-8 space-y-6">
      {isEditing ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl bg-[#14122E] border border-[rgba(201,168,76,0.15)] p-8 rounded-3xl">
          <div className="flex justify-between items-center border-b border-[rgba(201,168,76,0.12)] pb-4">
            <h3 className="font-serif text-2xl">{selectedBanner ? 'Edit' : 'Create'} Banner</h3>
            <button onClick={() => onEditChange(false)} className="text-xs text-text-muted hover:text-text-primary">Cancel</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs text-text-muted">Banner Section Type</label>
              <select
                value={formData.banner_type || 'hero'}
                onChange={(e) => setFormData({ ...formData, banner_type: e.target.value })}
                className="w-full bg-[#110F2A] border border-[rgba(201,168,76,0.15)] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none"
              >
                <option value="hero">Hero Slider (Top Banner)</option>
                <option value="middle">Middle Promo Banner</option>
                <option value="footer">Footer Banner</option>
                <option value="sidebar">Sidebar Ad Banner</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-text-muted">Display Order / Position</label>
              <input
                type="number"
                value={formData.display_order || 0}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                className="w-full bg-[#110F2A] border border-[rgba(201,168,76,0.15)] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-text-muted">Desktop Image URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.image_url || ''}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="flex-1 bg-[#110F2A] border border-[rgba(201,168,76,0.15)] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none"
                />
                <button
                  onClick={() => openMedia((url) => setFormData({ ...formData, image_url: url }))}
                  className="p-3 bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.2)] rounded-xl hover:bg-[rgba(201,168,76,0.25)] text-[#C9A84C] transition"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-text-muted">Mobile Image URL (Optional)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.mobile_image_url || ''}
                  onChange={(e) => setFormData({ ...formData, mobile_image_url: e.target.value })}
                  className="flex-1 bg-[#110F2A] border border-[rgba(201,168,76,0.15)] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none"
                />
                <button
                  onClick={() => openMedia((url) => setFormData({ ...formData, mobile_image_url: url }))}
                  className="p-3 bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.2)] rounded-xl hover:bg-[rgba(201,168,76,0.25)] text-[#C9A84C] transition"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-text-muted">CTA Button Text (e.g. Shop Now)</label>
              <input
                type="text"
                value={formData.cta_text || ''}
                onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                className="w-full bg-[#110F2A] border border-[rgba(201,168,76,0.15)] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-text-muted">Redirect Target URL</label>
              <input
                type="text"
                value={formData.redirect_url || ''}
                onChange={(e) => setFormData({ ...formData, redirect_url: e.target.value })}
                className="w-full bg-[#110F2A] border border-[rgba(201,168,76,0.15)] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-text-muted">Schedule Start (Optional)</label>
              <input
                type="datetime-local"
                value={formData.start_date?.substring(0, 16) || ''}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full bg-[#110F2A] border border-[rgba(201,168,76,0.15)] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-text-muted">Schedule End (Optional)</label>
              <input
                type="datetime-local"
                value={formData.end_date?.substring(0, 16) || ''}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full bg-[#110F2A] border border-[rgba(201,168,76,0.15)] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_active || false}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="rounded border-[rgba(201,168,76,0.2)] accent-[#C9A84C]"
            />
            Publish Banner (Visible on Site)
          </label>

          <button onClick={handleSave} className="btn-gold flex items-center gap-2 mt-4 px-6 py-2.5">
            <Save size={16} /> Save Banner
          </button>
        </motion.div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-text-muted text-xs">Manage advertising spaces across homepage template.</span>
            <button onClick={() => openEdit(null)} className="btn-gold flex items-center gap-2 text-xs py-2 px-4">
              <Plus size={16} /> Create Banner slot
            </button>
          </div>

          {loading ? (
            <div className="text-center py-20 text-text-muted">Loading Banners...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {banners.map((b) => (
                <div key={b.id} className="bg-[#14122E] border border-[rgba(201,168,76,0.12)] rounded-3xl overflow-hidden flex flex-col hover:border-[rgba(201,168,76,0.3)] transition">
                  <div className="aspect-video relative bg-[#08071A]">
                    <img src={b.image_url} alt="" className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 bg-[#08071A]/85 text-[#C9A84C] border border-[rgba(201,168,76,0.3)] rounded-full px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                      {b.banner_type}
                    </span>
                  </div>
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <h4 className="font-semibold text-text-primary text-sm truncate">{b.cta_text || 'No CTA Label'}</h4>
                      <p className="text-text-muted text-xs truncate mt-1">Redirect: {b.redirect_url || '—'}</p>
                    </div>
                    <div className="flex justify-between items-center mt-6 border-t border-[rgba(201,168,76,0.08)] pt-4">
                      <span className="text-xs text-text-muted">Position Order: {b.display_order}</span>
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(b)} className="p-2 border border-[rgba(201,168,76,0.15)] rounded-xl hover:bg-[rgba(201,168,76,0.06)] text-text-primary">
                          <Edit2 size={12} />
                        </button>
                        <button onClick={() => handleDelete(b.id)} className="p-2 border border-red-500/25 rounded-xl hover:bg-red-500/10 text-red-400">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── CAMPAIGNS TAB ────────────────────────────────────────────────────────────

interface CampaignsTabProps {
  campaigns: PromotionalCampaign[]
  loading: boolean
  selectedCampaign: PromotionalCampaign | null
  isEditing: boolean
  onSelect: (c: PromotionalCampaign | null) => void
  onEditChange: (val: boolean) => void
  token: string
  onRefresh: () => void
  openMedia: (onSelectUrl: (url: string) => void) => void
}

function CampaignsTab({ campaigns, loading, selectedCampaign, isEditing, onSelect, onEditChange, token, onRefresh, openMedia }: CampaignsTabProps) {
  const [formData, setFormData] = useState<Partial<PromotionalCampaign>>({})

  const openEdit = (c: PromotionalCampaign | null) => {
    onSelect(c)
    onEditChange(true)
    setFormData(c ? { ...c } : {
      name: '', subtitle: '', description: '', campaign_type: 'seasonal',
      start_date: new Date().toISOString().slice(0, 16), end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      is_active: true, background_image_url: ''
    })
  }

  const handleSave = async () => {
    if (!formData.name || !formData.start_date || !formData.end_date) {
      toast.error('Name, Start Date and End Date are required!')
      return
    }

    const payload = {
      ...formData,
      start_date: new Date(formData.start_date).toISOString(),
      end_date: new Date(formData.end_date).toISOString()
    }

    const loadingToast = toast.loading('Saving campaign...')
    try {
      if (selectedCampaign) {
        await updateCampaign(selectedCampaign.id, payload, token)
        toast.success('Campaign updated successfully!', { id: loadingToast })
      } else {
        await createCampaign(payload, token)
        toast.success('Campaign created successfully!', { id: loadingToast })
      }
      onEditChange(false)
      onSelect(null)
      onRefresh()
    } catch (err: any) {
      toast.error(err.message || 'Operation failed', { id: loadingToast })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return
    const loadingToast = toast.loading('Deleting campaign...')
    try {
      await deleteCampaign(id, token)
      toast.success('Campaign deleted successfully!', { id: loadingToast })
      onRefresh()
    } catch (err: any) {
      toast.error(err.message || 'Delete failed', { id: loadingToast })
    }
  }

  return (
    <div className="p-8 space-y-6">
      {isEditing ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl bg-[#14122E] border border-[rgba(201,168,76,0.15)] p-8 rounded-3xl">
          <div className="flex justify-between items-center border-b border-[rgba(201,168,76,0.12)] pb-4">
            <h3 className="font-serif text-2xl">{selectedCampaign ? 'Edit' : 'Create'} Campaign</h3>
            <button onClick={() => onEditChange(false)} className="text-xs text-text-muted hover:text-text-primary">Cancel</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs text-text-muted">Campaign Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Summer Gold Gala 2026"
                className="w-full bg-[#110F2A] border border-[rgba(201,168,76,0.15)] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-text-muted">Campaign Subtitle</label>
              <input
                type="text"
                value={formData.subtitle || ''}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full bg-[#110F2A] border border-[rgba(201,168,76,0.15)] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-text-muted">Campaign Type</label>
              <select
                value={formData.campaign_type || 'seasonal'}
                onChange={(e) => setFormData({ ...formData, campaign_type: e.target.value })}
                className="w-full bg-[#110F2A] border border-[rgba(201,168,76,0.15)] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none"
              >
                <option value="seasonal">Seasonal Event</option>
                <option value="holiday">Holiday Promo</option>
                <option value="flash_sale">Flash Sale Event</option>
                <option value="general">Brand Partnership</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-text-muted">Background Image URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.background_image_url || ''}
                  onChange={(e) => setFormData({ ...formData, background_image_url: e.target.value })}
                  className="flex-1 bg-[#110F2A] border border-[rgba(201,168,76,0.15)] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none"
                />
                <button
                  onClick={() => openMedia((url) => setFormData({ ...formData, background_image_url: url }))}
                  className="p-3 bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.2)] rounded-xl hover:bg-[rgba(201,168,76,0.25)] text-[#C9A84C] transition"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-text-muted">Start Date</label>
              <input
                type="datetime-local"
                value={formData.start_date?.substring(0, 16) || ''}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full bg-[#110F2A] border border-[rgba(201,168,76,0.15)] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-text-muted">End Date</label>
              <input
                type="datetime-local"
                value={formData.end_date?.substring(0, 16) || ''}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full bg-[#110F2A] border border-[rgba(201,168,76,0.15)] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_active || false}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="rounded border-[rgba(201,168,76,0.2)] accent-[#C9A84C]"
            />
            Publish Campaign (Enabled)
          </label>

          <div className="space-y-1">
            <label className="text-xs text-text-muted">Campaign Description</label>
            <textarea
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#110F2A] border border-[rgba(201,168,76,0.15)] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none"
            />
          </div>

          <button onClick={handleSave} className="btn-gold flex items-center gap-2 mt-4 px-6 py-2.5">
            <Save size={16} /> Save Campaign
          </button>
        </motion.div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-text-muted text-xs">Run large-scale promotional campaign banners with scheduled lifespans.</span>
            <button onClick={() => openEdit(null)} className="btn-gold flex items-center gap-2 text-xs py-2 px-4">
              <Plus size={16} /> Create Campaign
            </button>
          </div>

          {loading ? (
            <div className="text-center py-20 text-text-muted">Loading Campaigns...</div>
          ) : (
            <div className="rounded-2xl overflow-hidden bg-bg-card border border-[rgba(201,168,76,0.1)]">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-[rgba(201,168,76,0.12)] bg-[#110F2A] text-xs font-semibold text-text-muted uppercase tracking-wider">
                    <th className="px-6 py-4">Campaign Name</th>
                    <th className="px-6 py-4">Event Type</th>
                    <th className="px-6 py-4">Start Date</th>
                    <th className="px-6 py-4">End Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(201,168,76,0.06)] text-sm">
                  {campaigns.map((c) => (
                    <tr key={c.id} className="hover:bg-[rgba(201,168,76,0.02)] transition">
                      <td className="px-6 py-4 font-medium text-text-primary">{c.name}</td>
                      <td className="px-6 py-4 text-xs font-semibold text-[#C9A84C] uppercase tracking-wider">{c.campaign_type}</td>
                      <td className="px-6 py-4">{new Date(c.start_date).toLocaleDateString()}</td>
                      <td className="px-6 py-4">{new Date(c.end_date).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${c.is_active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                          {c.is_active ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-3">
                          <button onClick={() => openEdit(c)} className="p-1.5 text-text-muted hover:text-[#C9A84C] transition">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => handleDelete(c.id)} className="p-1.5 text-text-muted hover:text-red-400 transition">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── COUPONS TAB ──────────────────────────────────────────────────────────────

interface CouponsTabProps {
  coupons: Coupon[]
  loading: boolean
  selectedCoupon: Coupon | null
  isEditing: boolean
  onSelect: (c: Coupon | null) => void
  onEditChange: (val: boolean) => void
  token: string
  onRefresh: () => void
}

function CouponsTab({ coupons, loading, selectedCoupon, isEditing, onSelect, onEditChange, token, onRefresh }: CouponsTabProps) {
  const [formData, setFormData] = useState<Partial<Coupon>>({})

  const openEdit = (c: Coupon | null) => {
    onSelect(c)
    onEditChange(true)
    setFormData(c ? { ...c } : {
      code: '', description: '', discount_value: 0, discount_type: 'percentage',
      start_date: new Date().toISOString().slice(0, 16), end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      is_active: true
    })
  }

  const handleSave = async () => {
    if (!formData.code || !formData.discount_value || !formData.start_date || !formData.end_date) {
      toast.error('Coupon code, discount value, start/end dates are required!')
      return
    }

    const payload = {
      ...formData,
      discount_value: parseFloat(String(formData.discount_value)) || 0,
      start_date: new Date(formData.start_date).toISOString(),
      end_date: new Date(formData.end_date).toISOString()
    }

    const loadingToast = toast.loading('Saving Coupon info...')
    try {
      if (selectedCoupon) {
        await updateCoupon(selectedCoupon.id, payload, token)
        toast.success('Coupon updated successfully!', { id: loadingToast })
      } else {
        await createCoupon(payload, token)
        toast.success('Coupon created successfully!', { id: loadingToast })
      }
      onEditChange(false)
      onSelect(null)
      onRefresh()
    } catch (err: any) {
      toast.error(err.message || 'Operation failed', { id: loadingToast })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon code?')) return
    const loadingToast = toast.loading('Deleting coupon...')
    try {
      await deleteCoupon(id, token)
      toast.success('Coupon deleted successfully!', { id: loadingToast })
      onRefresh()
    } catch (err: any) {
      toast.error(err.message || 'Delete failed', { id: loadingToast })
    }
  }

  return (
    <div className="p-8 space-y-6">
      {isEditing ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl bg-[#14122E] border border-[rgba(201,168,76,0.15)] p-8 rounded-3xl">
          <div className="flex justify-between items-center border-b border-[rgba(201,168,76,0.12)] pb-4">
            <h3 className="font-serif text-2xl">{selectedCoupon ? 'Edit' : 'Create'} Coupon</h3>
            <button onClick={() => onEditChange(false)} className="text-xs text-text-muted hover:text-text-primary">Cancel</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs text-text-muted">Coupon Code</label>
              <input
                type="text"
                value={formData.code || ''}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase().replace(/\s+/g, '') })}
                placeholder="e.g. SAVE30"
                className="w-full bg-[#110F2A] border border-[rgba(201,168,76,0.15)] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-text-muted">Discount Value</label>
              <input
                type="number"
                value={formData.discount_value || 0}
                onChange={(e) => setFormData({ ...formData, discount_value: parseFloat(e.target.value) || 0 })}
                className="w-full bg-[#110F2A] border border-[rgba(201,168,76,0.15)] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-text-muted">Discount Type</label>
              <select
                value={formData.discount_type || 'percentage'}
                onChange={(e) => setFormData({ ...formData, discount_type: e.target.value })}
                className="w-full bg-[#110F2A] border border-[rgba(201,168,76,0.15)] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Dollar ($)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-text-muted">Active From</label>
              <input
                type="datetime-local"
                value={formData.start_date?.substring(0, 16) || ''}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full bg-[#110F2A] border border-[rgba(201,168,76,0.15)] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-text-muted">Expires On</label>
              <input
                type="datetime-local"
                value={formData.end_date?.substring(0, 16) || ''}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full bg-[#110F2A] border border-[rgba(201,168,76,0.15)] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_active || false}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="rounded border-[rgba(201,168,76,0.2)] accent-[#C9A84C]"
            />
            Active coupon
          </label>

          <div className="space-y-1">
            <label className="text-xs text-text-muted">Coupon details / description</label>
            <textarea
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#110F2A] border border-[rgba(201,168,76,0.15)] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none"
            />
          </div>

          <button onClick={handleSave} className="btn-gold flex items-center gap-2 mt-4 px-6 py-2.5">
            <Save size={16} /> Save Coupon
          </button>
        </motion.div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-text-muted text-xs">Expose dynamic coupon promo codes for users.</span>
            <button onClick={() => openEdit(null)} className="btn-gold flex items-center gap-2 text-xs py-2 px-4">
              <Plus size={16} /> Create Coupon
            </button>
          </div>

          {loading ? (
            <div className="text-center py-20 text-text-muted">Loading Coupons...</div>
          ) : (
            <div className="rounded-2xl overflow-hidden bg-bg-card border border-[rgba(201,168,76,0.1)]">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-[rgba(201,168,76,0.12)] bg-[#110F2A] text-xs font-semibold text-text-muted uppercase tracking-wider">
                    <th className="px-6 py-4">Promo Code</th>
                    <th className="px-6 py-4">Discount Value</th>
                    <th className="px-6 py-4">Expires On</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(201,168,76,0.06)] text-sm">
                  {coupons.map((c) => (
                    <tr key={c.id} className="hover:bg-[rgba(201,168,76,0.02)] transition">
                      <td className="px-6 py-4 font-mono font-bold text-[#C9A84C]">{c.code}</td>
                      <td className="px-6 py-4 font-semibold">
                        {c.discount_type === 'percentage' ? `${c.discount_value}% Off` : `$${c.discount_value} Off`}
                      </td>
                      <td className="px-6 py-4">{new Date(c.end_date).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${c.is_active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                          {c.is_active ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-3">
                          <button onClick={() => openEdit(c)} className="p-1.5 text-text-muted hover:text-[#C9A84C] transition">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => handleDelete(c.id)} className="p-1.5 text-text-muted hover:text-red-400 transition">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── FLASH SALES TAB ──────────────────────────────────────────────────────────

interface FlashSalesTabProps {
  sales: FlashSale[]
  brands: Brand[]
  loading: boolean
  selectedSale: FlashSale | null
  isEditing: boolean
  onSelect: (f: FlashSale | null) => void
  onEditChange: (val: boolean) => void
  token: string
  onRefresh: () => void
}

function FlashSalesTab({ sales, brands, loading, selectedSale, isEditing, onSelect, onEditChange, token, onRefresh }: FlashSalesTabProps) {
  const [formData, setFormData] = useState<Partial<FlashSale>>({})

  // Flatten all products across all brands to allow selector mapping
  const allProducts: Product[] = brands.flatMap((b) =>
    b.products.map((p) => ({ ...p, brandName: b.name }))
  )

  const openEdit = (f: FlashSale | null) => {
    onSelect(f)
    onEditChange(true)
    setFormData(f ? { ...f } : {
      product_id: allProducts[0]?.id || '', discount_price: '$',
      start_date: new Date().toISOString().slice(0, 16), end_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      is_active: true
    })
  }

  const handleSave = async () => {
    if (!formData.product_id || !formData.discount_price || !formData.start_date || !formData.end_date) {
      toast.error('Product Selection, Discount Price, and Start/End Dates are required!')
      return
    }

    const payload = {
      ...formData,
      start_date: new Date(formData.start_date).toISOString(),
      end_date: new Date(formData.end_date).toISOString()
    }

    const loadingToast = toast.loading('Saving Flash Sale Deal...')
    try {
      if (selectedSale) {
        await updateFlashSale(selectedSale.id, payload, token)
        toast.success('Flash Sale updated!', { id: loadingToast })
      } else {
        await createFlashSale(payload, token)
        toast.success('Flash Sale created!', { id: loadingToast })
      }
      onEditChange(false)
      onSelect(null)
      onRefresh()
    } catch (err: any) {
      toast.error(err.message || 'Operation failed', { id: loadingToast })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this flash sale?')) return
    const loadingToast = toast.loading('Deleting Flash Sale...')
    try {
      await deleteFlashSale(id, token)
      toast.success('Flash Sale deleted successfully!', { id: loadingToast })
      onRefresh()
    } catch (err: any) {
      toast.error(err.message || 'Delete failed', { id: loadingToast })
    }
  }

  return (
    <div className="p-8 space-y-6">
      {isEditing ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl bg-[#14122E] border border-[rgba(201,168,76,0.15)] p-8 rounded-3xl">
          <div className="flex justify-between items-center border-b border-[rgba(201,168,76,0.12)] pb-4">
            <h3 className="font-serif text-2xl">{selectedSale ? 'Edit' : 'Create'} Flash Sale Deal</h3>
            <button onClick={() => onEditChange(false)} className="text-xs text-text-muted hover:text-text-primary">Cancel</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs text-text-muted">Target Product</label>
              <select
                value={formData.product_id || ''}
                onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                className="w-full bg-[#110F2A] border border-[rgba(201,168,76,0.15)] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none"
              >
                {allProducts.map((p) => (
                  <option key={p.id} value={p.id}>{(p as any).brandName} - {p.name} ({p.price})</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-text-muted">Discount Promo Price (e.g. $199)</label>
              <input
                type="text"
                value={formData.discount_price || ''}
                onChange={(e) => setFormData({ ...formData, discount_price: e.target.value })}
                className="w-full bg-[#110F2A] border border-[rgba(201,168,76,0.15)] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-text-muted">Start Time</label>
              <input
                type="datetime-local"
                value={formData.start_date?.substring(0, 16) || ''}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full bg-[#110F2A] border border-[rgba(201,168,76,0.15)] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-text-muted">End Time</label>
              <input
                type="datetime-local"
                value={formData.end_date?.substring(0, 16) || ''}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full bg-[#110F2A] border border-[rgba(201,168,76,0.15)] rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_active || false}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="rounded border-[rgba(201,168,76,0.2)] accent-[#C9A84C]"
            />
            Publish Flash Sale (Instantly active)
          </label>

          <button onClick={handleSave} className="btn-gold flex items-center gap-2 mt-4 px-6 py-2.5">
            <Save size={16} /> Save Flash Sale Deal
          </button>
        </motion.div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-text-muted text-xs">Configure short-lived limited flash sales.</span>
            <button onClick={() => openEdit(null)} className="btn-gold flex items-center gap-2 text-xs py-2 px-4">
              <Plus size={16} /> Create Flash Sale Deal
            </button>
          </div>

          {loading ? (
            <div className="text-center py-20 text-text-muted">Loading Flash Sales...</div>
          ) : (
            <div className="rounded-2xl overflow-hidden bg-bg-card border border-[rgba(201,168,76,0.1)]">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-[rgba(201,168,76,0.12)] bg-[#110F2A] text-xs font-semibold text-text-muted uppercase tracking-wider">
                    <th className="px-6 py-4">Brand</th>
                    <th className="px-6 py-4">Product Name</th>
                    <th className="px-6 py-4">Original Price</th>
                    <th className="px-6 py-4">Promo Price</th>
                    <th className="px-6 py-4">Duration</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(201,168,76,0.06)] text-sm">
                  {sales.map((s) => (
                    <tr key={s.id} className="hover:bg-[rgba(201,168,76,0.02)] transition">
                      <td className="px-6 py-4 font-semibold text-[#C9A84C]">{s.brand_name || 'Generic'}</td>
                      <td className="px-6 py-4 font-medium text-text-primary">{s.product_name}</td>
                      <td className="px-6 py-4 line-through text-text-muted">{s.product_price}</td>
                      <td className="px-6 py-4 font-bold text-green-400">{s.discount_price}</td>
                      <td className="px-6 py-4 text-xs font-mono text-text-muted">
                        {new Date(s.start_date).toLocaleTimeString()} - {new Date(s.end_date).toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${s.is_active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                          {s.is_active ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-3">
                          <button onClick={() => openEdit(s)} className="p-1.5 text-text-muted hover:text-[#C9A84C] transition">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => handleDelete(s.id)} className="p-1.5 text-text-muted hover:text-red-400 transition">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── MEDIA LIBRARY VIEW ───────────────────────────────────────────────────────

interface MediaTabProps {
  media: MediaImage[]
  loading: boolean
  search: string
  onSearchChange: (v: string) => void
  token: string
  onRefresh: () => void
  onUpload: (e: React.ChangeEvent<HTMLInputElement>, onUrlAcquired: (url: string) => void) => void
}

function MediaTab({ media, loading, search, onSearchChange, token, onRefresh, onUpload }: MediaTabProps) {
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this media file?')) return
    const loadingToast = toast.loading('Deleting file...')
    try {
      await deleteMediaLibrary(id, token)
      toast.success('Media deleted successfully!', { id: loadingToast })
      onRefresh()
    } catch (err: any) {
      toast.error(err.message || 'Delete failed', { id: loadingToast })
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
          <input
            type="text"
            placeholder="Search image filenames..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#14122E] border border-[rgba(201,168,76,0.15)] pl-10 pr-4 py-2 rounded-xl text-sm outline-none focus:border-[#C9A84C]"
          />
        </div>

        <div className="flex gap-3">
          <label className="btn-gold flex items-center gap-2 cursor-pointer text-xs py-2 px-4">
            <Upload size={16} /> Upload New Image
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onUpload(e, () => {})}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-text-muted">Loading Media Library...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6">
          {media
            .filter((m) => m.filename.toLowerCase().includes(search.toLowerCase()))
            .map((m) => (
              <div key={m.id} className="group bg-[#14122E] border border-[rgba(201,168,76,0.1)] rounded-2xl overflow-hidden shadow-lg relative aspect-square">
                <img src={m.url} alt={m.filename} className="w-full h-full object-cover group-hover:scale-102 transition duration-300" />
                <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 flex flex-col justify-between p-3 transition duration-200">
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="self-end p-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/40 rounded-lg transition"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="space-y-1 w-full">
                    <p className="text-[10px] text-[#C9A84C] font-semibold truncate">{m.filename}</p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(m.url)
                        toast.success('URL copied to clipboard!')
                      }}
                      className="w-full text-center py-1 bg-[#08071A] hover:bg-[#C9A84C] hover:text-[#08071A] text-text-primary text-[10px] rounded-lg transition font-medium"
                    >
                      Copy URL
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
