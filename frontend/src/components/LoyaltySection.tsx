'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, Loader } from 'lucide-react'
import toast from 'react-hot-toast'
import { joinLoyalty } from '@/lib/api'

const BENEFITS = [
  'Concierge & Valet Service',
  'Private Member Lounge',
  'Early Access to Events',
  'Personalized Birthday Gifts',
  '3× Points on All Purchases',
]

const inputClass =
  'w-full px-4 py-3 rounded-xl bg-bg-card border border-[rgba(201,168,76,0.15)] text-[#F0EEF8] text-sm placeholder:text-[#7A7890] outline-none focus:border-[#C9A84C] transition'

export default function LoyaltySection() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [joined, setJoined] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    setLoading(true)
    try {
      await joinLoyalty({ name, email })
      setJoined(true)
      toast.success('Welcome to Zivanta Elite!')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="loyalty" className="py-24 px-6 bg-bg-primary">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="section-eyebrow">Zivanta Elite</p>
          <h2 className="section-heading max-w-2xl mx-auto">
            Unrivaled Rewards for the{' '}
            <span className="gold-text">Discerning Shopper</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Form / Success */}
          <div>
            {/* Benefits */}
            <ul className="space-y-3 mb-10">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-center gap-3 text-sm text-[#B8B4D0]">
                  <span className="text-[#C9A84C] text-base leading-none">✦</span>
                  {b}
                </li>
              ))}
            </ul>

            <AnimatePresence mode="wait">
              {joined ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4 }}
                  className="glass-card rounded-2xl p-8 flex flex-col items-center text-center"
                >
                  <CheckCircle className="text-[#C9A84C] w-12 h-12 mb-4" />
                  <h3 className="font-serif text-xl text-[#F0EEF8] mb-2">
                    Welcome to Zivanta Elite
                  </h3>
                  <p className="text-sm text-[#B8B4D0]">
                    Your membership is being processed. Expect a welcome email shortly at{' '}
                    <span className="text-[#C9A84C]">{email}</span>.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4 }}
                  onSubmit={handleSubmit}
                  className="glass-card rounded-2xl p-8 space-y-4"
                >
                  <h3 className="font-serif text-xl text-[#F0EEF8] mb-2">
                    Join the Elite Programme
                  </h3>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className={inputClass}
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={inputClass}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-gold w-full flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Joining…
                      </>
                    ) : (
                      'Join Zivanta Elite'
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Decorative loyalty card */}
          <div className="flex justify-center">
            <div
              className="relative w-[340px] h-[210px] rounded-2xl p-6 flex flex-col justify-between overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #0D0C22 0%, #1A1640 50%, #0D0C22 100%)',
                boxShadow: '0 0 60px rgba(201,168,76,0.15), inset 0 1px 0 rgba(201,168,76,0.2)',
                border: '1px solid rgba(201,168,76,0.25)',
              }}
            >
              {/* Decorative circles */}
              <div
                className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-10"
                style={{ background: 'radial-gradient(circle, #C9A84C, transparent)' }}
              />
              <div
                className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-10"
                style={{ background: 'radial-gradient(circle, #C9A84C, transparent)' }}
              />

              {/* Top row */}
              <div className="flex items-start justify-between relative z-10">
                <div>
                  <p className="font-serif text-lg tracking-[0.3em] text-[#F0EEF8]">ZIVANTA</p>
                  <p className="text-[10px] tracking-[0.15em] text-[#7A7890] uppercase mt-0.5">
                    Luxury Mall
                  </p>
                </div>
                <span
                  className="text-[10px] tracking-widest px-2 py-0.5 rounded font-medium"
                  style={{
                    background: 'rgba(201,168,76,0.15)',
                    color: '#C9A84C',
                    border: '1px solid rgba(201,168,76,0.35)',
                  }}
                >
                  ELITE
                </span>
              </div>

              {/* Chip */}
              <div className="relative z-10">
                <div
                  className="w-10 h-7 rounded-md"
                  style={{
                    background: 'linear-gradient(135deg, #E8C97A, #A07830)',
                    boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.3)',
                  }}
                />
              </div>

              {/* Bottom row */}
              <div className="relative z-10">
                <p className="text-sm tracking-[0.2em] text-[#B8B4D0] font-mono">
                  ●●●● ●●●● ●●●● 8888
                </p>
                <p className="text-xs text-[#7A7890] mt-1 tracking-wider uppercase">
                  Member Name
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
