import InfoPageShell from '@/components/InfoPageShell'

export const metadata = { title: 'Terms of Service — Zivanta Luxury Mall' }

export default function TermsPage() {
  return (
    <InfoPageShell eyebrow="Legal" title="Terms of Service">
      <p>
        Welcome to Zivanta. By accessing our website and visiting our premises, you agree to the
        following terms.
      </p>

      <h2 className="font-serif text-xl text-[#F0EEF8] pt-2">Use of the Website</h2>
      <p>
        Content on this site is provided for general information. Brand listings, offers, and event
        details may change without notice. You agree not to misuse the site or attempt unauthorized
        access to any portion of it.
      </p>

      <h2 className="font-serif text-xl text-[#F0EEF8] pt-2">Loyalty Programme</h2>
      <p>
        Membership in Zivanta Elite is subject to eligibility and may be modified or discontinued.
        Points and benefits hold no cash value and are non-transferable.
      </p>

      <h2 className="font-serif text-xl text-[#F0EEF8] pt-2">Liability</h2>
      <p>
        Zivanta is not liable for any indirect damages arising from use of the website or services
        to the fullest extent permitted by law.
      </p>

      <p className="text-xs text-[#7A7890] pt-4">Last updated: January 2026.</p>
    </InfoPageShell>
  )
}
