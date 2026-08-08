import Header from './Header'
import Footer from './Footer'

interface InfoPageShellProps {
  eyebrow?: string
  title: string
  children: React.ReactNode
}

/** Shared layout for standalone informational pages (services, legal, etc.). */
export default function InfoPageShell({ eyebrow, title, children }: InfoPageShellProps) {
  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <Header />
      <main className="max-w-3xl mx-auto px-6 pt-32 pb-24">
        {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
        <h1 className="section-heading mb-8">{title}</h1>
        <div className="space-y-5 text-[#B8B4D0] text-sm leading-relaxed">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}
