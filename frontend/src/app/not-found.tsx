'use client'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()
  return (
    <div className="flex items-center justify-center min-h-screen px-6" style={{ background: 'var(--bg-primary)' }}>
      <div className="text-center">
        <h1 className="font-serif font-light gold-text" style={{ fontSize: '8rem', lineHeight: 1 }}>404</h1>
        <p className="text-text-muted mt-4 mb-8">This area of Zivanta does not exist.</p>
        <button className="btn-gold" onClick={() => router.push('/')}>Return to Mall</button>
      </div>
    </div>
  )
}
