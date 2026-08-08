'use client'

import { useRouter, usePathname } from 'next/navigation'
import toast from 'react-hot-toast'

// `section` = id of an on-page section to smooth-scroll to.
// `href`    = a real route to navigate to.
type FooterLink = { label: string; section?: string; href?: string }

const DISCOVER_LINKS: FooterLink[] = [
  { label: 'Brands', section: 'brands' },
  { label: 'Dining', section: 'brands' },
  { label: 'Entertainment', section: 'brands' },
  { label: 'Events', section: 'events' },
  { label: 'Offers', section: 'brands' },
]

const SERVICES_LINKS: FooterLink[] = [
  { label: 'Loyalty Program', section: 'loyalty' },
  { label: 'Gift Cards', href: '/gift-cards' },
  { label: 'Valet Parking', href: '/valet-parking' },
  { label: 'Concierge', href: '/concierge' },
  { label: 'Personal Shopping', href: '/personal-shopping' },
]

const BOTTOM_LINKS: FooterLink[] = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Sitemap', href: '/sitemap' },
]

const SOCIAL_LINKS = [
  { label: 'Twitter / X', href: 'https://twitter.com/zivanta', Icon: TwitterXIcon },
  { label: 'Instagram', href: 'https://instagram.com/zivanta', Icon: InstagramIcon },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/zivanta', Icon: LinkedInIcon },
]

function TwitterXIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

export default function Footer() {
  const router = useRouter()
  const pathname = usePathname()

  function scrollToSection(id: string) {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleLink(link: FooterLink) {
    if (link.href) {
      router.push(link.href)
      return
    }
    if (link.section) {
      if (pathname !== '/') {
        router.push('/')
        setTimeout(() => scrollToSection(link.section!), 300)
      } else {
        scrollToSection(link.section)
      }
      return
    }
    toast(`${link.label} — coming soon.`)
  }

  return (
    <footer style={{ background: '#05040F' }}>
      {/* Top divider */}
      <div className="border-t border-[rgba(201,168,76,0.05)]" />

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Column 1: Brand */}
          <div>
            <div className="mb-4">
              <span className="font-serif text-2xl tracking-[0.2em] text-[#F0EEF8]">
                ZIVANTA
              </span>
            </div>
            <p className="text-xs text-[#7A7890] leading-relaxed mb-6 max-w-[220px]">
              The pinnacle of luxury retail. An experience beyond shopping — a world of
              refinement, culture, and exclusivity.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-[rgba(201,168,76,0.15)] flex items-center justify-center text-[#7A7890] hover:text-[#C9A84C] hover:border-[rgba(201,168,76,0.5)] transition"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Discover */}
          <div>
            <h4 className="text-xs tracking-widest uppercase text-[#B8B4D0] mb-6">
              Discover
            </h4>
            <ul className="space-y-3">
              {DISCOVER_LINKS.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleLink(link)}
                    className="text-sm text-[#7A7890] hover:text-[#C9A84C] transition text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h4 className="text-xs tracking-widest uppercase text-[#B8B4D0] mb-6">
              Services
            </h4>
            <ul className="space-y-3">
              {SERVICES_LINKS.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleLink(link)}
                    className="text-sm text-[#7A7890] hover:text-[#C9A84C] transition text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="text-xs tracking-widest uppercase text-[#B8B4D0] mb-6">
              Contact
            </h4>
            <address className="not-italic space-y-3">
              <p className="text-sm text-[#7A7890] leading-relaxed">
                Zivanta Luxury Mall
                <br />
                Downtown Financial District
                <br />
                NY 10004
              </p>
              <p>
                <a
                  href="mailto:info@zivanta.com"
                  className="text-sm text-[#7A7890] hover:text-[#C9A84C] transition"
                >
                  info@zivanta.com
                </a>
              </p>
              <p>
                <a
                  href="tel:+15550123456"
                  className="text-sm text-[#7A7890] hover:text-[#C9A84C] transition"
                >
                  +1 555 0123 4567
                </a>
              </p>
            </address>
          </div>
        </div>

        {/* Bottom divider */}
        <div className="border-t border-[rgba(201,168,76,0.05)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#7A7890]">
            © 2025 Zivanta Luxury Mall. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {BOTTOM_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => handleLink(link)}
                className="text-xs text-[#7A7890] hover:text-[#C9A84C] transition"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
