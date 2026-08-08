import InfoPageShell from '@/components/InfoPageShell'

export const metadata = { title: 'Personal Shopping — Zivanta Luxury Mall' }

export default function PersonalShoppingPage() {
  return (
    <InfoPageShell eyebrow="Services" title="Personal Shopping">
      <p>
        Enjoy a bespoke shopping experience tailored entirely to you. Our expert stylists curate
        selections from across Zivanta&apos;s luxury houses, so you discover exactly what you&apos;re
        looking for — and pieces you didn&apos;t know you needed.
      </p>
      <ul className="space-y-2">
        <li>✦ One-on-one sessions with a dedicated style advisor</li>
        <li>✦ Private fitting suites with refreshments</li>
        <li>✦ Curated edits delivered ahead of your appointment</li>
        <li>✦ Wardrobe consultations and special-occasion styling</li>
        <li>✦ Complimentary for Zivanta Elite members</li>
      </ul>
      <p>
        Book your session at{' '}
        <a href="mailto:styling@zivanta.com" className="text-[#C9A84C] hover:underline">styling@zivanta.com</a>{' '}
        or through the Concierge Desk.
      </p>
    </InfoPageShell>
  )
}
