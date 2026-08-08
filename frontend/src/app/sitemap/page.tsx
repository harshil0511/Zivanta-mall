import Link from 'next/link'
import InfoPageShell from '@/components/InfoPageShell'

export const metadata = { title: 'Sitemap — Zivanta Luxury Mall' }

const GROUPS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: 'Main',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Brand Directory', href: '/#brands' },
      { label: 'Events & Celebrations', href: '/#events' },
      { label: 'Zivanta Elite Loyalty', href: '/#loyalty' },
    ],
  },
  {
    heading: 'Services',
    links: [
      { label: 'Gift Cards', href: '/gift-cards' },
      { label: 'Valet Parking', href: '/valet-parking' },
      { label: 'Concierge', href: '/concierge' },
      { label: 'Personal Shopping', href: '/personal-shopping' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
]

export default function SitemapPage() {
  return (
    <InfoPageShell eyebrow="Navigation" title="Sitemap">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {GROUPS.map((group) => (
          <div key={group.heading}>
            <h2 className="text-xs tracking-widest uppercase text-[#B8B4D0] mb-4">{group.heading}</h2>
            <ul className="space-y-3">
              {group.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-[#7A7890] hover:text-[#C9A84C] transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </InfoPageShell>
  )
}
