import InfoPageShell from '@/components/InfoPageShell'

export const metadata = { title: 'Valet Parking — Zivanta Luxury Mall' }

export default function ValetParkingPage() {
  return (
    <InfoPageShell eyebrow="Services" title="Valet Parking">
      <p>
        Arrive in style. Our signature valet service ensures your visit begins and ends with
        effortless ease — simply hand over your keys at the main entrance and we&apos;ll take care
        of the rest.
      </p>
      <ul className="space-y-2">
        <li>✦ Complimentary 4 hours for Zivanta Elite members</li>
        <li>✦ Available daily, 10:00 AM – 11:00 PM at the North &amp; South entrances</li>
        <li>✦ Premium covered parking with 24/7 security and EV charging</li>
        <li>✦ Car detailing and wash available on request</li>
      </ul>
      <p>
        Standard valet is $25 per visit. Members can link their loyalty card for automatic
        complimentary parking.
      </p>
    </InfoPageShell>
  )
}
