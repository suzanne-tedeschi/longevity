'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
      <div className="text-center px-6">
        <Link href="/" className="inline-block text-3xl font-light tracking-wide text-[#1a1a1a]/90 mb-10">evo</Link>
        <h1 className="text-2xl font-semibold text-[#1a1a1a] mb-3">Quelque chose a mal tourné</h1>
        <p className="text-[#1a1a1a]/50 mb-8">Une erreur inattendue s&apos;est produite. Veuillez réessayer.</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-2.5 rounded-xl bg-[#2D6A4F] text-white text-sm font-medium hover:bg-[#2D6A4F]/90 transition-colors"
          >
            Réessayer
          </button>
          <Link
            href="/"
            className="px-6 py-2.5 rounded-xl border border-[#1a1a1a]/10 text-[#1a1a1a]/70 text-sm font-medium hover:bg-[#1a1a1a]/5 transition-colors"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  )
}
