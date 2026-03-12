"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

/* ── Inline SVG icons ── */
function HeartIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
}
function WindIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>
}
function BrainIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"/><path d="M10 21h4"/><path d="M12 17v4"/></svg>
}
function CheckIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
}
function ChevronLeft({ className = 'w-4 h-4' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
}
function ArrowRight({ className = 'w-4 h-4' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
}

interface BilanStatus {
  emotionnel: number | null
  stress: number | null
}

const questionnaires = [
  {
    id: 'emotionnel',
    title: 'Santé émotionnelle',
    subtitle: 'B-PANAS, Diener & TEIQue',
    description: 'Évalue vos affects positifs et négatifs, votre satisfaction de vie et votre intelligence émotionnelle.',
    questions: 55,
    duration: '15 min',
    href: '/onboarding/bilan-emotionnel',
    icon: HeartIcon,
    color: '#ff6b6b',
  },
  {
    id: 'stress',
    title: 'Gestion du stress',
    subtitle: 'GHQ-12, CD-RISC, PSS & Fatigue',
    description: 'Mesure votre bien-être mental, résilience, stress perçu et niveau de fatigue.',
    questions: 40,
    duration: '12 min',
    href: '/onboarding/bilan-stress',
    icon: WindIcon,
    color: '#60a5fa',
  },
]

export default function BilanMentalPage() {
  const router = useRouter()
  const [status, setStatus] = useState<BilanStatus>({ emotionnel: null, stress: null })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStatus() {
      try {
        const session = await supabase?.auth.getSession()
        const token = session?.data?.session?.access_token
        if (!token) { setLoading(false); return }

        const res = await fetch('/api/bilan/results', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) { setLoading(false); return }
        const data = await res.json()
        const results = data.results || []
        setStatus({
          emotionnel: results.find((r: any) => r.bilan_type === 'emotionnel')?.global_score ?? null,
          stress: results.find((r: any) => r.bilan_type === 'stress')?.global_score ?? null,
        })
      } catch { /* ignore */ }
      setLoading(false)
    }
    fetchStatus()
  }, [])

  const completedCount = [status.emotionnel, status.stress].filter(v => v !== null).length
  const allDone = completedCount === 2
  const avgScore = allDone
    ? Math.round(((status.emotionnel ?? 0) + (status.stress ?? 0)) / 2)
    : null

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#1a1a1a]/[0.08]">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/onboarding/bilans" className="flex items-center gap-1 text-sm text-[#1a1a1a]/40 hover:text-[#1a1a1a] transition-colors">
            <ChevronLeft className="w-4 h-4" /> Bilans
          </Link>
          <span className="text-xs text-[#1a1a1a]/30">{completedCount}/2 terminés</span>
        </div>
      </div>

      <main className="max-w-lg mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-red-400 to-transparent mx-auto mb-8" />
          <div className="mb-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/15 flex items-center justify-center text-red-500 mx-auto">
            <BrainIcon className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-[#1a1a1a] tracking-tight mb-2">Santé mentale</h1>
          <p className="text-sm text-[#1a1a1a]/40 leading-relaxed max-w-sm mx-auto">
            Ce bilan se compose de 2 questionnaires complémentaires pour évaluer en profondeur votre santé mentale.
          </p>
          {avgScore !== null && (
            <div className="mt-6 inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-5 py-2">
              <span className="text-2xl font-bold text-red-500">{avgScore}</span>
              <span className="text-xs text-red-400 font-medium">/100 score global</span>
            </div>
          )}
        </div>

        {/* Questionnaire cards */}
        <div className="space-y-4">
          {questionnaires.map((q) => {
            const score = status[q.id as keyof BilanStatus]
            const done = score !== null
            const Icon = q.icon
            return (
              <div
                key={q.id}
                onClick={() => {
                  if (done) {
                    // Retake or view — go to questionnaire
                    router.push(q.href)
                  } else {
                    router.push(q.href)
                  }
                }}
                className="relative rounded-2xl border bg-white p-5 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group"
                style={{ borderColor: `${q.color}25` }}
              >
                {/* top accent */}
                <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl" style={{ background: `linear-gradient(to right, transparent, ${q.color}66, transparent)` }} />

                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `${q.color}12`, color: q.color }}>
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-[15px] font-semibold text-[#1a1a1a]">{q.title}</h3>
                      {done && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                          <CheckIcon className="w-3 h-3" /> Fait
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-medium mb-1.5" style={{ color: q.color }}>{q.subtitle}</p>
                    <p className="text-xs text-[#1a1a1a]/40 leading-relaxed">{q.description}</p>

                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-[10px] text-[#1a1a1a]/30">{q.questions} questions</span>
                      <span className="text-[10px] text-[#1a1a1a]/30">{q.duration}</span>
                      {done && score !== null && (
                        <span className="text-[11px] font-bold" style={{ color: q.color }}>Score : {score}/100</span>
                      )}
                    </div>
                  </div>

                  {/* Arrow / Score */}
                  <div className="shrink-0 mt-1">
                    {done && score !== null ? (
                      <div className="w-11 h-11 rounded-full flex items-center justify-center"
                        style={{ background: `${q.color}12` }}>
                        <span className="text-sm font-bold" style={{ color: q.color }}>{score}</span>
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#1a1a1a]/[0.04] group-hover:bg-[#1a1a1a]/[0.08] transition-colors">
                        <ArrowRight className="w-4 h-4 text-[#1a1a1a]/30 group-hover:text-[#1a1a1a]/60 transition-colors" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Back button */}
        <div className="mt-10 text-center">
          <Link href="/onboarding/bilans" className="inline-block px-10 py-4 rounded-xl bg-[#1a1a1a]/10 text-[#1a1a1a]/70 text-base font-semibold hover:bg-[#1a1a1a]/15 transition-all duration-300 text-center">
            ← Retour aux bilans
          </Link>
        </div>

        <div className="w-12 h-px bg-gradient-to-r from-transparent via-red-400 to-transparent mx-auto mt-8" />
      </main>
    </div>
  )
}
