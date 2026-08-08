'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import useStore from '@/store/useStore'
import type { Brand } from '@/types'

export default function SearchModal() {
  const router = useRouter()
  const { brands, searchOpen, setSearchOpen } = useStore()
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (searchOpen) { setQuery(''); setTimeout(() => inputRef.current?.focus(), 100) }
  }, [searchOpen])

  useEffect(() => {
    const handle = (e: KeyboardEvent) => { if (e.key === 'Escape') setSearchOpen(false) }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [setSearchOpen])

  const q = query.trim().toLowerCase()

  const brandResults = brands.filter(b =>
    b.name.toLowerCase().includes(q) || b.type?.toLowerCase().includes(q) || b.floor?.toLowerCase().includes(q)
  )
  const productResults = brands.flatMap(b =>
    (b.products || [])
      .filter(p => p.name.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q))
      .map(p => ({ ...p, brandName: b.name, brandId: b.id }))
  )

  const hasResults = q.length > 0 && (brandResults.length > 0 || productResults.length > 0)
  const noResults  = q.length > 0 && !hasResults

  const handleBrandClick = (id: string) => {
    setSearchOpen(false)
    router.push(`/brand/${id}`)
  }

  const resultItem = 'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-bg-card transition-colors text-left'
  const avatar     = 'w-9 h-9 rounded-lg flex items-center justify-center font-serif text-lg flex-shrink-0 bg-bg-card text-gold'

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={e => { if (e.target === e.currentTarget) setSearchOpen(false) }}
        >
          <motion.div
            className="w-full max-w-xl rounded-2xl overflow-hidden"
            style={{ background: 'var(--bg-accent)', border: '1px solid rgba(201,168,76,0.2)' }}
            initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          >
            {/* Input row */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-[rgba(201,168,76,0.1)]">
              <Search size={20} style={{ color: 'var(--gold)', flexShrink: 0 }} />
              <input ref={inputRef} className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted text-sm outline-none"
                placeholder="Search brands, products, categories…"
                value={query} onChange={e => setQuery(e.target.value)} />
              {query && (
                <button className="text-text-muted hover:text-text-primary transition-colors" onClick={() => setQuery('')}>
                  <X size={16} />
                </button>
              )}
              <button className="px-2 py-1 rounded-md text-[11px] text-text-muted border border-[rgba(201,168,76,0.15)] hover:text-text-primary transition-colors"
                onClick={() => setSearchOpen(false)}>ESC</button>
            </div>

            {/* Results */}
            <div className="max-h-[420px] overflow-y-auto p-3">
              {q.length === 0 && (
                <div className="p-3">
                  <p className="text-xs text-text-muted uppercase tracking-widest mb-3">Popular Searches</p>
                  <div className="flex flex-wrap gap-2">
                    {['Dior', 'Rolex', 'Gucci', 'Watches', 'Jewellery', 'Dining'].map(h => (
                      <button key={h} className="px-3 py-1.5 rounded-full text-xs border border-[rgba(201,168,76,0.2)] text-text-muted hover:text-gold hover:border-gold/40 transition-colors"
                        onClick={() => setQuery(h)}>{h}</button>
                    ))}
                  </div>
                </div>
              )}

              {hasResults && (
                <>
                  {brandResults.length > 0 && (
                    <div className="mb-4">
                      <p className="text-[11px] text-text-muted uppercase tracking-widest px-3 mb-2">Stores</p>
                      {brandResults.slice(0, 5).map(b => (
                        <button key={b.id} className={resultItem} onClick={() => handleBrandClick(b.id)}>
                          <div className={avatar}>{b.name.charAt(0)}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-text-primary text-sm font-medium">{b.name}</p>
                            <p className="text-text-muted text-xs">{b.type} · {b.floor}</p>
                          </div>
                          <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
                        </button>
                      ))}
                    </div>
                  )}
                  {productResults.length > 0 && (
                    <div>
                      <p className="text-[11px] text-text-muted uppercase tracking-widest px-3 mb-2">Products</p>
                      {productResults.slice(0, 6).map(p => (
                        <button key={p.id} className={resultItem} onClick={() => handleBrandClick(p.brandId)}>
                          <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-bg-card">
                            {p.image
                              ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                              : <div className={avatar}>{p.name.charAt(0)}</div>
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-text-primary text-sm font-medium truncate">{p.name}</p>
                            <p className="text-text-muted text-xs">{p.brandName} · {p.price}</p>
                          </div>
                          <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}

              {noResults && (
                <div className="flex flex-col items-center py-10 gap-3">
                  <Search size={36} style={{ color: 'var(--text-light)' }} />
                  <p className="text-text-secondary text-sm">No results for <strong>&ldquo;{query}&rdquo;</strong></p>
                  <span className="text-text-muted text-xs">Try a brand name or product type</span>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
