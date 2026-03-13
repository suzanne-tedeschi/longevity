'use client'

import Link from 'next/link'

export default function ChoixBilanPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white border border-[#1a1a1a]/[0.08] rounded-2xl p-6 sm:p-8 shadow-[0_30px_80px_-45px_rgba(26,26,26,0.5)]">
        <div className="text-center mb-7">
          <Link href="/" className="inline-block text-2xl font-light tracking-wide text-[#1a1a1a]/90 mb-4">evo</Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-2">Bienvenue</h1>
          <p className="text-sm text-[#1a1a1a]/55">Choisissez comment vous voulez commencer.</p>
        </div>

        <div className="space-y-3">
          <Link
            href="/onboarding/profil"
            className="w-full inline-flex items-center justify-between rounded-xl border-2 border-[#25D366]/25 bg-[#25D366]/10 px-4 py-4 text-left hover:border-[#25D366]/45 transition-all"
          >
            <span>
              <p className="text-sm font-semibold text-[#1a1a1a]">Configurer mon profil</p>
              <p className="text-xs text-[#1a1a1a]/55">Je suis nouveau, je configure mon profil d’abord.</p>
            </span>
            <span className="text-[#25D366]">→</span>
          </Link>

          <Link
            href="/onboarding/login?mode=login"
            className="w-full inline-flex items-center justify-between rounded-xl border border-[#1a1a1a]/[0.12] bg-white px-4 py-4 text-left hover:border-[#25D366]/45 transition-all"
          >
            <span>
              <p className="text-sm font-semibold text-[#1a1a1a]">J’ai déjà un compte</p>
              <p className="text-xs text-[#1a1a1a]/55">Je me connecte avec email/mot de passe ou Google.</p>
            </span>
            <span className="text-[#1a1a1a]/45">→</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
