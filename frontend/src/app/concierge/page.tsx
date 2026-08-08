import InfoPageShell from '@/components/InfoPageShell'

export const metadata = { title: 'Concierge — Zivanta Luxury Mall' }

export default function ConciergePage() {
  return (
    <InfoPageShell eyebrow="Services" title="Concierge Service">
      <p>
        Our dedicated concierge team is at your service to make every visit seamless and
        memorable — from restaurant reservations to securing the season&apos;s most coveted pieces.
      </p>
      <ul className="space-y-2">
        <li>✦ Restaurant &amp; event reservations across the mall and beyond</li>
        <li>✦ Personal shopping appointments with brand specialists</li>
        <li>✦ Gift wrapping, delivery, and in-store collection</li>
        <li>✦ Multilingual assistance and wheelchair / accessibility support</li>
        <li>✦ Lost &amp; found, currency exchange, and tourist information</li>
      </ul>
      <p>
        Visit the Concierge Desk on the Ground Floor or call{' '}
        <a href="tel:+15550123456" className="text-[#C9A84C] hover:underline">+1 (555) 0123-4567</a>.
      </p>
    </InfoPageShell>
  )
}
