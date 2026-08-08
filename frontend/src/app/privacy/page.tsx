import InfoPageShell from '@/components/InfoPageShell'

export const metadata = { title: 'Privacy Policy — Zivanta Luxury Mall' }

export default function PrivacyPage() {
  return (
    <InfoPageShell eyebrow="Legal" title="Privacy Policy">
      <p>
        Zivanta Luxury Mall (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is committed to protecting your
        privacy. This policy explains what information we collect, how we use it, and the choices
        you have.
      </p>

      <h2 className="font-serif text-xl text-[#F0EEF8] pt-2">Information We Collect</h2>
      <p>
        We collect information you provide directly — such as your name and email when joining our
        loyalty programme or submitting a leasing inquiry — as well as limited usage data to improve
        our website experience.
      </p>

      <h2 className="font-serif text-xl text-[#F0EEF8] pt-2">How We Use Your Information</h2>
      <p>
        We use your information to operate the loyalty programme, respond to inquiries, send relevant
        updates, and enhance our services. We never sell your personal data to third parties.
      </p>

      <h2 className="font-serif text-xl text-[#F0EEF8] pt-2">Your Rights</h2>
      <p>
        You may request access to, correction of, or deletion of your personal data at any time by
        contacting{' '}
        <a href="mailto:privacy@zivanta.com" className="text-[#C9A84C] hover:underline">privacy@zivanta.com</a>.
      </p>

      <p className="text-xs text-[#7A7890] pt-4">Last updated: January 2026.</p>
    </InfoPageShell>
  )
}
