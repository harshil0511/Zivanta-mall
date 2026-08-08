'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Mail, Phone, FileText, CheckCircle, Loader } from 'lucide-react'
import toast from 'react-hot-toast'
import { submitLeasingInquiry } from '@/lib/api'

const inputClass =
  'w-full px-4 py-3 rounded-xl bg-bg-card border border-[rgba(201,168,76,0.15)] text-[#F0EEF8] text-sm placeholder:text-[#7A7890] outline-none focus:border-[#C9A84C] transition'

const CATEGORIES = [
  'Luxury Fashion',
  'Jewellery & Watches',
  'Dining & Hospitality',
  'Electronics & Tech',
  'Beauty & Wellness',
  'Entertainment',
  'Art & Culture',
  'Other',
]

interface ContactInfo {
  icon: React.ReactNode
  label: string
  value: string
  href?: string
}

const CONTACT_INFO: ContactInfo[] = [
  {
    icon: <Mail className="w-4 h-4 text-[#C9A84C]" />,
    label: 'Email',
    value: 'leasing@zivanta.com',
    href: 'mailto:leasing@zivanta.com',
  },
  {
    icon: <Phone className="w-4 h-4 text-[#C9A84C]" />,
    label: 'Phone',
    value: '+1 (555) 0123-4567',
    href: 'tel:+15550123456',
  },
  {
    icon: <FileText className="w-4 h-4 text-[#C9A84C]" />,
    label: 'Office',
    value: 'Level 5, Tower A, Zivanta',
  },
]

export default function LeasingSection() {
  const [fullName, setFullName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [email, setEmail] = useState('')
  const [category, setCategory] = useState('Luxury Fashion')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await submitLeasingInquiry({
        full_name: fullName,
        company_name: companyName,
        email,
        category,
        message,
      })
      setSubmitted(true)
      toast.success('Inquiry submitted — our team will be in touch.')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  function handleMediaKit() {
    toast.success('Media Kit 2025 — a download link has been sent to leasing@zivanta.com.')
  }

  function handleReset() {
    setFullName('')
    setCompanyName('')
    setEmail('')
    setCategory('Luxury Fashion')
    setMessage('')
    setSubmitted(false)
  }

  return (
    <section className="py-24 px-6 bg-bg-section">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="section-eyebrow">Partnerships</p>
          <h2 className="section-heading max-w-2xl mx-auto">
            Grow Your Brand with{' '}
            <span className="gold-text">Zivanta</span>
          </h2>
          <p className="text-[#B8B4D0] text-sm mt-3 max-w-xl mx-auto">
            Join the most prestigious luxury retail destination and connect with an affluent audience
            seeking the finest experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: Form */}
          <div>
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4 }}
                  className="glass-card rounded-2xl p-10 flex flex-col items-center text-center"
                >
                  <CheckCircle className="text-[#C9A84C] w-14 h-14 mb-5" />
                  <h3 className="font-serif text-2xl text-[#F0EEF8] mb-3">
                    Inquiry Received
                  </h3>
                  <p className="text-sm text-[#B8B4D0] mb-6 max-w-sm">
                    Thank you for your interest in partnering with Zivanta. Our leasing team will
                    reach out within 2 business days.
                  </p>
                  <button onClick={handleReset} className="btn-outline text-sm">
                    Submit Another Inquiry
                  </button>
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
                  <h3 className="font-serif text-xl text-[#F0EEF8] mb-1">
                    Leasing Enquiry
                  </h3>
                  <p className="text-xs text-[#7A7890] mb-4">
                    Fill out the form and our team will be in touch.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className={inputClass}
                    />
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                      className={inputClass}
                    />
                  </div>

                  <input
                    type="email"
                    placeholder="Business Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={inputClass}
                  />

                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={inputClass}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="bg-[#14122E]">
                        {cat}
                      </option>
                    ))}
                  </select>

                  <textarea
                    placeholder="Tell us about your brand and space requirements…"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    required
                    className={`${inputClass} resize-none`}
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-gold w-full flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Submitting…
                      </>
                    ) : (
                      'Submit Leasing Inquiry'
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Info cards */}
          <div className="space-y-4">
            {CONTACT_INFO.map((info) => (
              <div
                key={info.label}
                className="glass-card rounded-xl p-5 flex items-start gap-4"
              >
                <div className="w-9 h-9 rounded-lg bg-bg-accent flex items-center justify-center flex-shrink-0">
                  {info.icon}
                </div>
                <div>
                  <p className="text-xs text-[#7A7890] uppercase tracking-widest mb-0.5">
                    {info.label}
                  </p>
                  {info.href ? (
                    <a
                      href={info.href}
                      className="text-sm text-[#F0EEF8] hover:text-[#C9A84C] transition"
                    >
                      {info.value}
                    </a>
                  ) : (
                    <p className="text-sm text-[#F0EEF8]">{info.value}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Media Kit download card */}
            <div
              onClick={handleMediaKit}
              className="rounded-xl p-5 flex items-start gap-4 cursor-pointer group border border-[rgba(201,168,76,0.15)] hover:border-[rgba(201,168,76,0.4)] transition"
              style={{ background: 'linear-gradient(135deg, #1a1200, #3d2e00)' }}
            >
              <div className="w-9 h-9 rounded-lg bg-[rgba(201,168,76,0.15)] flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-[#C9A84C]" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-[#F0EEF8] font-medium group-hover:text-[#C9A84C] transition">
                  Media Kit 2025
                </p>
                <p className="text-xs text-[#7A7890] mt-0.5">
                  Download our brand guidelines and partnership deck
                </p>
              </div>
              <span className="text-[#C9A84C] text-lg self-center">↓</span>
            </div>

            {/* Why Zivanta blurb */}
            <div className="rounded-xl p-6 border border-[rgba(201,168,76,0.12)] bg-bg-card">
              <h4 className="font-serif text-base text-[#F0EEF8] mb-3">
                Why Partner with Zivanta?
              </h4>
              <ul className="space-y-2">
                {[
                  '2M+ annual footfall from high-net-worth visitors',
                  'Premium location in Downtown Financial District',
                  'Dedicated marketing & PR support',
                  'Flexible unit sizes from 500 – 10,000 sq ft',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-[#B8B4D0]">
                    <span className="text-[#C9A84C] mt-0.5">✦</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
