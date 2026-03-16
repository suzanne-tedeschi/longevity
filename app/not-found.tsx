import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
      <div className="text-center px-6">
        <Link href="/" className="inline-block text-3xl font-light tracking-wide text-[#1a1a1a]/90 mb-10">evo</Link>
        <h1 className="text-2xl font-semibold text-[#1a1a1a] mb-3">Page introuvable</h1>
        <p className="text-[#1a1a1a]/50 mb-8">Cette page n&apos;existe pas ou a été déplacée.</p>
        <Link
          href="/"
          className="inline-block px-6 py-2.5 rounded-xl bg-[#2D6A4F] text-white text-sm font-medium hover:bg-[#2D6A4F]/90 transition-colors"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  )
}
