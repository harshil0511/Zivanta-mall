import InfoPageShell from '@/components/InfoPageShell'

export const metadata = { title: 'Gift Cards — Zivanta Luxury Mall' }

export default function GiftCardsPage() {
  return (
    <InfoPageShell eyebrow="Services" title="Zivanta Gift Cards">
      <p>
        Give the gift of luxury. A Zivanta Gift Card is redeemable across all 200+ brands,
        restaurants, and experiences throughout the mall — the perfect present for any occasion.
      </p>
      <ul className="space-y-2">
        <li>✦ Available in denominations from $50 to $5,000</li>
        <li>✦ Physical cards beautifully presented in a signature gold envelope</li>
        <li>✦ Digital e-gift cards delivered instantly by email</li>
        <li>✦ No expiry, no hidden fees, redeemable mall-wide</li>
        <li>✦ Corporate &amp; bulk gifting available with custom branding</li>
      </ul>
      <p>
        Purchase in person at the Concierge Desk on the Ground Floor, or contact{' '}
        <a href="mailto:giftcards@zivanta.com" className="text-[#C9A84C] hover:underline">giftcards@zivanta.com</a>.
      </p>
    </InfoPageShell>
  )
}
