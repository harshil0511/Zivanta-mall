'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react'
import { login } from '@/lib/api'

interface Props { onSuccess: (token: string) => void }

export default function SecureLogin({ onSuccess }: Props) {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPwd,  setShowPwd]  = useState(false)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { access_token } = await login(email, password)
      onSuccess(access_token)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid credentials. Access denied.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = 'w-full px-4 py-3 rounded-xl text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors'

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: 'var(--bg-primary)' }}>
      <motion.div
        className="w-full max-w-sm rounded-2xl p-8"
        style={{ background: 'var(--bg-card)', border: '1px solid rgba(201,168,76,0.2)' }}
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
            <path d="M16 2L19.5 10H28L21.5 15L24 23L16 18L8 23L10.5 15L4 10H12.5L16 2Z" fill="url(#loginGold)" />
            <defs>
              <linearGradient id="loginGold" x1="4" y1="2" x2="28" y2="23">
                <stop stopColor="#E8C97A" /><stop offset="1" stopColor="#A07830" />
              </linearGradient>
            </defs>
          </svg>
          <div>
            <div className="font-serif text-lg tracking-[0.15em] font-semibold" style={{ color: 'var(--gold)' }}>ZIVANTA</div>
            <div className="text-[9px] tracking-[0.25em] uppercase text-text-muted">MANAGEMENT PORTAL</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="flex items-center gap-1.5 text-xs text-text-secondary mb-1.5">
              <Mail size={12} /> Staff Email
            </label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="admin@zivanta.com" required autoComplete="email"
              className={inputStyle}
              style={{ background: 'var(--bg-accent)', border: '1px solid rgba(201,168,76,0.15)', ['--tw-ring-color' as string]: 'var(--gold)' }}
              onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.15)'}
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs text-text-secondary mb-1.5">
              <Lock size={12} /> Security Password
            </label>
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required autoComplete="current-password"
                className={`${inputStyle} pr-10`}
                style={{ background: 'var(--bg-accent)', border: '1px solid rgba(201,168,76,0.15)' }}
                onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.15)'}
              />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-gold transition-colors"
                onClick={() => setShowPwd(v => !v)}>
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <motion.div className="flex items-center gap-2 text-red-400 text-xs px-3 py-2.5 rounded-xl"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
              <AlertCircle size={14} className="flex-shrink-0" /> {error}
            </motion.div>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 mt-2 flex items-center justify-center gap-2 disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #C9A84C, #A07830)', color: '#08071A' }}>
            {loading ? (
              <span className="w-4 h-4 rounded-full border-2 border-bg-primary/30 border-t-bg-primary" style={{ animation: 'spin 0.8s linear infinite' }} />
            ) : 'Authorize Access'}
          </button>
        </form>

        <p className="text-center text-text-muted text-xs mt-5">
          Demo: chaudharyhp628@gmail.com / Admin@123
        </p>
      </motion.div>

      <p className="mt-6 text-text-light text-xs">Secure Enterprise System © 2025 Zivanta Global</p>
    </div>
  )
}
