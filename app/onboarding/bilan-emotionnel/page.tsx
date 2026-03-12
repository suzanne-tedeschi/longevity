"use client"

import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  allSections, totalMaxScore, emotionnelInterpretations,
  type TestSection, type EmotionnelTest, type SectionIcon, type ScoreOption,
} from '@/lib/bilan-emotionnel-data'
import {
  getSectionReport, getSectionRecommendation, getTriggeredInsights, globalKeyInsights,
} from '@/lib/bilan-emotionnel-report'
import { supabase } from '@/lib/supabase'
import { saveProgress, loadProgress, clearProgress } from '@/lib/bilan-progress'

/* ═══════════════════════════════════════════════════════
   INLINE SVG ICONS
   ═══════════════════════════════════════════════════════ */
function HeartIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21.3l7.8-7.8 1-1.1a5.5 5.5 0 0 0 0-7.8z" /></svg>
}
function SmileIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
}
function BrainIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a5 5 0 0 1 5 5c0 .8-.2 1.5-.5 2.2A5 5 0 0 1 19 14a5 5 0 0 1-3 4.6V22h-4v-3.4A5 5 0 0 1 9 14a5 5 0 0 1 2.5-4.3A5 5 0 0 1 12 2z" /><path d="M12 2v4" /><path d="M9 10h6" /></svg>
}
function CheckCircle({ className = 'w-5 h-5' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
}
function ChevronLeft({ className = 'w-4 h-4' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
}
function ChevronRight({ className = 'w-4 h-4' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
}
function InfoIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
}

function renderSectionIcon(icon: SectionIcon, className = 'w-6 h-6') {
  switch (icon) {
    case 'emotions':      return <HeartIcon className={className} />
    case 'satisfaction':   return <SmileIcon className={className} />
    case 'intelligence':   return <BrainIcon className={className} />
  }
}

/* ═══════════════════════════════════════════════════════
   SCORE COLOR HELPERS (dynamic, works with any scale)
   ═══════════════════════════════════════════════════════ */
function getScoreColor(_value: number, _maxValue: number) {
  return { bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-700', ring: 'ring-sky-300' }
}

function getOverallLabel(pct: number) {
  if (pct >= 80) return { label: 'Excellent',    color: 'text-emerald-600', bar: 'bg-emerald-500' }
  if (pct >= 60) return { label: 'Bon',          color: 'text-sky-600',     bar: 'bg-sky-500' }
  if (pct >= 40) return { label: 'Moyen',        color: 'text-amber-600',   bar: 'bg-amber-500' }
  return { label: 'À améliorer', color: 'text-red-600',     bar: 'bg-red-500' }
}

/* ═══════════════════════════════════════════════════════
   PROGRESS BAR
   ═══════════════════════════════════════════════════════ */
function ProgressBar({ current, total, sectionTitle }: { current: number; total: number; sectionTitle: string }) {
  const pct = Math.round((current / total) * 100)
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium tracking-widest uppercase text-[#1a1a1a]/50">{sectionTitle}</span>
        <span className="text-xs tabular-nums text-[#1a1a1a]/40">{current}/{total}</span>
      </div>
      <div className="h-1 w-full bg-[#1a1a1a]/[0.06] rounded-full overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-rose-400 to-rose-600 transition-all duration-700 ease-out" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   LIKERT SCORE BUTTON (adaptive for any scale)
   ═══════════════════════════════════════════════════════ */
function LikertButton({ option, selected, onSelect, maxValue }: {
  option: ScoreOption; selected: boolean; onSelect: () => void; maxValue: number
}) {
  const colors = getScoreColor(option.value, maxValue)
  return (
    <button
      onClick={onSelect}
      className={`group relative w-full text-left rounded-xl border-2 p-3 transition-all duration-300 ease-out ${
        selected
          ? `${colors.bg} ${colors.border} ring-2 ${colors.ring} shadow-md`
          : 'border-[#1a1a1a]/[0.08] bg-white hover:border-[#1a1a1a]/[0.12] hover:shadow-sm'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`flex-shrink-0 w-3 h-3 rounded-full transition-all duration-300 ${
          selected ? `bg-sky-200 border-2 border-sky-300 shadow-sm` : 'bg-[#1a1a1a]/[0.08] border border-[#1a1a1a]/[0.08]'
        }`} />
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-sm transition-colors duration-300 ${selected ? colors.text : 'text-[#1a1a1a]'}`}>{option.label}</p>
        </div>
        {selected && <CheckCircle className={`w-5 h-5 flex-shrink-0 ${colors.text}`} />}
      </div>
    </button>
  )
}

/* ═══════════════════════════════════════════════════════
   SECTION INTRO
   ═══════════════════════════════════════════════════════ */
function SectionIntro({ section, sectionIndex, onStart }: { section: TestSection; sectionIndex: number; onStart: () => void }) {
  return (
    <div className="animate-fade-in flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="mb-6 inline-flex items-center gap-2 bg-[#1a1a1a]/[0.05] border border-[#1a1a1a]/[0.08] rounded-full px-4 py-1.5">
        <span className="text-xs font-medium tracking-widest uppercase text-[#1a1a1a]/40">Section {sectionIndex + 1} / {allSections.length}</span>
      </div>
      <div className="mb-8 w-20 h-20 rounded-2xl bg-gradient-to-br from-rose-500/10 to-rose-600/10 border border-rose-500/15 flex items-center justify-center text-rose-500">
        {renderSectionIcon(section.icon, 'w-10 h-10')}
      </div>
      <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-2 tracking-tight">{section.title}</h2>
      <p className="text-rose-500 font-medium text-sm tracking-wide uppercase mb-6">{section.subtitle}</p>
      <p className="max-w-md text-[#1a1a1a]/50 leading-relaxed mb-4">{section.description}</p>
      <div className="flex items-center gap-6 mb-10">
        <div className="text-center">
          <p className="text-2xl font-bold text-[#1a1a1a]">{section.tests.length}</p>
          <p className="text-xs text-[#1a1a1a]/30 uppercase tracking-wider">Questions</p>
        </div>
        <div className="w-px h-8 bg-[#1a1a1a]/[0.06]" />
        <div className="text-center">
          <p className="text-2xl font-bold text-[#1a1a1a]">{section.maxScore}</p>
          <p className="text-xs text-[#1a1a1a]/30 uppercase tracking-wider">Points max</p>
        </div>
      </div>
      <button onClick={onStart} className="px-8 py-3 rounded-xl bg-rose-500 text-white font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">Commencer cette section</button>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   TEST CARD
   ═══════════════════════════════════════════════════════ */
function TestCard({ test, testIndex, totalTests, sectionTitle, sectionIcon, selectedScore, onScore, onPrev, onNext, canGoNext }: {
  test: EmotionnelTest; testIndex: number; totalTests: number; sectionTitle: string; sectionIcon: SectionIcon
  selectedScore: number | undefined; onScore: (v: number) => void; onPrev: () => void; onNext: () => void; canGoNext: boolean
}) {
  const maxValue = Math.max(...test.scoring.map(o => o.value))
  return (
    <div className="animate-fade-in max-w-lg mx-auto">
      <ProgressBar current={testIndex + 1} total={totalTests} sectionTitle={sectionTitle} />
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-rose-500/8 flex items-center justify-center text-rose-500">
            {renderSectionIcon(sectionIcon, 'w-4 h-4')}
          </div>
          <span className="text-xs font-medium tracking-widest uppercase text-[#1a1a1a]/30">Question {testIndex + 1}</span>
        </div>
        <h3 className="text-2xl font-bold text-[#1a1a1a] tracking-tight mb-1">{test.name}</h3>
      </div>
      <div className="bg-[#1a1a1a]/[0.02] border border-[#1a1a1a]/[0.08] rounded-xl p-4 mb-6">
        <p className="text-base font-semibold text-[#1a1a1a]/80 leading-relaxed">{test.criteria}</p>
      </div>
      <div className="space-y-2 mb-8">
        {test.scoring.map((option, idx) => (
          <LikertButton key={idx} option={option} selected={selectedScore === option.value} onSelect={() => onScore(option.value)} maxValue={maxValue} />
        ))}
      </div>
      <div className="h-20" />
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur border-t border-[#1a1a1a]/[0.08] px-4 py-3 z-50">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button onClick={onPrev} className="flex items-center gap-1 text-sm text-[#1a1a1a]/40 hover:text-[#1a1a1a] transition-colors">
            <ChevronLeft className="w-4 h-4" /> Précédent
          </button>
          <button onClick={onNext} disabled={!canGoNext}
            className={`flex items-center gap-1 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              canGoNext ? 'bg-rose-500 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5' : 'bg-[#1a1a1a]/[0.06] text-[#1a1a1a]/20 cursor-not-allowed'
            }`}
          >
            Suivant <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   SCORE GAUGE
   ═══════════════════════════════════════════════════════ */
function ScoreGauge({ score, maxScore, label, icon, size = 'md' }: {
  score: number; maxScore: number; label: string; icon: SectionIcon; size?: 'sm' | 'md'
}) {
  const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0
  const { color } = getOverallLabel(pct)
  const dims = size === 'sm' ? { box: 'w-28 h-28', r: 44, stroke: 5 } : { box: 'w-36 h-36', r: 56, stroke: 6 }
  const circ = 2 * Math.PI * dims.r
  const dashOffset = circ - (pct / 100) * circ
  return (
    <div className="flex flex-col items-center">
      <div className={`relative ${dims.box}`}>
        <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${(dims.r + dims.stroke) * 2} ${(dims.r + dims.stroke) * 2}`}>
          <circle cx={dims.r + dims.stroke} cy={dims.r + dims.stroke} r={dims.r} fill="none" stroke="#e5e0d8" strokeWidth={dims.stroke} />
          <circle cx={dims.r + dims.stroke} cy={dims.r + dims.stroke} r={dims.r} fill="none" stroke="currentColor" strokeWidth={dims.stroke}
            strokeDasharray={circ} strokeDashoffset={dashOffset} strokeLinecap="round"
            className={`${color} transition-all duration-1000 ease-out`}
            style={{ color: pct >= 80 ? '#10b981' : pct >= 60 ? '#0ea5e9' : pct >= 40 ? '#f59e0b' : '#ef4444' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-bold ${color}`}>{pct}%</span>
          <span className="text-[10px] text-[#1a1a1a]/30 mt-0.5">{score}/{maxScore}</span>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-[#1a1a1a]">
        {renderSectionIcon(icon, 'w-4 h-4')}
        <span className="text-xs font-semibold tracking-wide">{label}</span>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   SECTION FEEDBACK
   ═══════════════════════════════════════════════════════ */
function getSectionFeedback(sectionId: string, pct: number): { title: string; message: string } {
  const level = pct >= 80 ? 'high' : pct >= 50 ? 'mid' : 'low'
  const feedback: Record<string, Record<string, { title: string; message: string }>> = {
    'b-panas': {
      high: { title: 'Bel équilibre émotionnel', message: 'Vos émotions positives prédominent nettement. C\'est un excellent indicateur de bien-être psychologique.' },
      mid:  { title: 'Équilibre émotionnel modéré', message: 'Certaines émotions négatives sont significatives. Le programme identifiera les leviers d\'amélioration.' },
      low:  { title: 'Déséquilibre émotionnel', message: 'Les affects négatifs sont dominants. C\'est un axe prioritaire pour votre bien-être.' },
    },
    'satisfaction-vie': {
      high: { title: 'Grande satisfaction de vie', message: 'Vous êtes très satisfait(e) de votre vie. C\'est un facteur protecteur majeur pour la longévité.' },
      mid:  { title: 'Satisfaction modérée', message: 'Certains aspects de votre vie ne vous satisfont pas pleinement. Des ajustements ciblés peuvent faire la différence.' },
      low:  { title: 'Insatisfaction significative', message: 'Votre satisfaction de vie est faible. Un travail sur vos valeurs et objectifs de vie est recommandé.' },
    },
    'teiq': {
      high: { title: 'Intelligence émotionnelle élevée', message: 'Vous avez une excellente capacité à comprendre et gérer vos émotions et celles des autres.' },
      mid:  { title: 'IE modérée', message: 'Certaines compétences émotionnelles peuvent être renforcées pour améliorer vos relations et votre bien-être.' },
      low:  { title: 'IE à développer', message: 'Des compétences émotionnelles clés nécessitent un développement. C\'est un investissement à fort rendement.' },
    },
  }
  return feedback[sectionId]?.[level] ?? { title: level === 'high' ? 'Très bien' : level === 'mid' ? 'Correct' : 'À améliorer', message: '' }
}

/* ═══════════════════════════════════════════════════════
   SECTION RESULTS SCREEN
   ═══════════════════════════════════════════════════════ */
function SectionResultsScreen({ section, sectionIndex, scores, onContinue }: {
  section: TestSection; sectionIndex: number; scores: Record<string, number>; onContinue: () => void
}) {
  const sectionScore = section.tests.reduce((sum, t) => sum + (scores[t.id] ?? 0), 0)
  const pct = Math.round((sectionScore / section.maxScore) * 100)
  const info = getOverallLabel(pct)
  const feedback = getSectionFeedback(section.id, pct)
  const isLast = sectionIndex === allSections.length - 1
  return (
    <div className="animate-fade-in flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="w-12 h-px bg-gradient-to-r from-transparent via-rose-500 to-transparent mb-8" />
      <div className="mb-6 inline-flex items-center gap-2 bg-[#1a1a1a]/[0.05] border border-[#1a1a1a]/[0.08] rounded-full px-4 py-1.5">
        <span className="text-xs font-medium tracking-widest uppercase text-[#1a1a1a]/40">Section {sectionIndex + 1} terminée</span>
      </div>
      <ScoreGauge score={sectionScore} maxScore={section.maxScore} label={section.title} icon={section.icon} size="md" />
      <div className="mt-8 max-w-sm">
        <h3 className={`text-xl font-bold mb-2 ${info.color}`}>{feedback.title}</h3>
        <p className="text-sm text-[#1a1a1a]/50 leading-relaxed">{feedback.message}</p>
      </div>
      <button onClick={onContinue} className="px-8 py-3 rounded-xl bg-rose-500 text-white font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 mt-10">
        {isLast ? 'Voir mes résultats' : 'Section suivante'}
      </button>
      {!isLast && (
        <p className="mt-4 text-xs text-[#1a1a1a]/20">Encore {allSections.length - sectionIndex - 1} section{allSections.length - sectionIndex - 1 > 1 ? 's' : ''} restante{allSections.length - sectionIndex - 1 > 1 ? 's' : ''}</p>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   WELCOME SCREEN
   ═══════════════════════════════════════════════════════ */
function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="animate-fade-in flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <div className="w-12 h-px bg-gradient-to-r from-transparent via-rose-500 to-transparent mb-10" />
      <div className="mb-8 w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500/10 to-rose-600/10 border border-rose-500/15 flex items-center justify-center text-rose-500">
        <HeartIcon className="w-8 h-8" />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-3 tracking-tight">Bilan Santé Émotionnelle</h1>
      <h2 className="text-sm font-medium tracking-widest uppercase text-rose-500 mb-8">Bien-être émotionnel & intelligence émotionnelle</h2>
      <p className="max-w-md text-[#1a1a1a]/50 leading-relaxed mb-10">
        Ce bilan évalue votre état émotionnel, votre satisfaction de vie et votre intelligence émotionnelle
        à travers {allSections.reduce((sum, s) => sum + s.tests.length, 0)} questions réparties en {allSections.length} sections.
        Il est basé sur les questionnaires validés B-PANAS, Diener (SWLS) et TEIQue.
      </p>
      <div className="w-full max-w-sm space-y-3 mb-10">
        {allSections.map((section) => (
          <div key={section.id} className="flex items-center gap-4 bg-white border border-[#1a1a1a]/[0.08] rounded-xl px-4 py-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500/8 to-rose-600/8 border border-rose-500/10 flex items-center justify-center text-rose-500/70">
              {renderSectionIcon(section.icon, 'w-5 h-5')}
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-[#1a1a1a]">{section.title}</p>
              <p className="text-xs text-[#1a1a1a]/30">{section.tests.length} questions</p>
            </div>
            <span className="text-xs tabular-nums text-[#1a1a1a]/20">{section.maxScore} pts</span>
          </div>
        ))}
      </div>
      <button onClick={onStart} className="px-8 py-3 rounded-xl bg-rose-500 text-white font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">Commencer le bilan</button>
      <p className="mt-6 text-xs text-[#1a1a1a]/20 max-w-xs leading-relaxed">Répondez le plus honnêtement possible en pensant aux dernières semaines.</p>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   RESULTS SCREEN (with auto-save)
   ═══════════════════════════════════════════════════════ */
function ResultsScreen({ scores }: { scores: Record<string, number> }) {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const hasSaved = useRef(false)

  const sectionResults = allSections.map((section) => {
    const score = section.tests.reduce((sum, t) => sum + (scores[t.id] ?? 0), 0)
    return { section, score }
  })
  const totalScore = sectionResults.reduce((sum, r) => sum + r.score, 0)
  const totalPct = Math.round((totalScore / totalMaxScore) * 100)
  const overall = getOverallLabel(totalPct)

  const interpretation = emotionnelInterpretations.find((_, i) => {
    if (totalPct >= 80 && i === 0) return true
    if (totalPct >= 60 && totalPct < 80 && i === 1) return true
    if (totalPct >= 40 && totalPct < 60 && i === 2) return true
    if (totalPct < 40 && i === 3) return true
    return false
  })

  const allResults = sectionResults.map(({ section, score }) => ({
    sectionId: section.id,
    pct: Math.round((score / section.maxScore) * 100),
    score,
    maxScore: section.maxScore,
    title: section.title,
    subtitle: section.subtitle,
    icon: section.icon,
  }))

  // ── Auto-save results to Supabase ──
  useEffect(() => {
    if (hasSaved.current) return
    hasSaved.current = true

    async function saveResults() {
      try {
        const session = await supabase?.auth.getSession()
        const token = session?.data?.session?.access_token
        if (!token) { console.warn('[bilan-save] No auth session'); return }
        setSaveStatus('saving')

        const sectionReports = allResults.map(r => {
          const report = getSectionReport(r.sectionId)
          if (!report) return null
          const rec = getSectionRecommendation(report, r.pct)
          const triggered = getTriggeredInsights(report, scores)
          return {
            sectionId: r.sectionId, title: r.title, pct: r.pct, score: r.score, maxScore: r.maxScore,
            level: rec.level, recommendationTitle: rec.title, recommendationText: rec.text, context: report.context,
            triggeredInsights: triggered.map(t => ({ questionId: t.questionId, insight: t.insight, recommendation: t.recommendation })),
            references: report.references,
          }
        }).filter(Boolean)

        const payload = {
          bilanType: 'emotionnel',
          scores,
          globalScore: totalPct,
          globalPoints: totalScore,
          maxPoints: totalMaxScore,
          subScores: Object.fromEntries(allResults.map(r => [r.sectionId, { score: r.score, max: r.maxScore, pct: r.pct }])),
          sectionResults: allResults.map(r => ({ sectionId: r.sectionId, title: r.title, score: r.score, maxScore: r.maxScore, pct: r.pct })),
          report: { sectionReports, globalInsights: globalKeyInsights },
        }

        const res = await fetch('/api/bilan/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        })
        if (res.ok) { setSaveStatus('saved'); clearProgress('emotionnel') }
        else { setSaveStatus('error') }
      } catch (e) { console.error('[bilan-save] Failed:', e); setSaveStatus('error') }
    }
    saveResults()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="animate-fade-in max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <div className="w-12 h-px bg-gradient-to-r from-transparent via-rose-500 to-transparent mx-auto mb-8" />
        <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] tracking-tight mb-2">Vos résultats</h2>
        <p className="text-sm text-[#1a1a1a]/40">Bilan santé émotionnelle</p>
        {saveStatus === 'saving' && <p className="text-xs text-rose-500/60 mt-2 animate-pulse">Sauvegarde en cours...</p>}
        {saveStatus === 'saved' && <p className="text-xs text-emerald-500 mt-2">Résultats sauvegardés</p>}
        {saveStatus === 'error' && <p className="text-xs text-red-400 mt-2">Sauvegarde échouée</p>}
      </div>

      {/* Global score */}
      <div className="bg-white backdrop-blur-sm border border-[#1a1a1a]/[0.08] rounded-2xl p-8 mb-8 text-center">
        <p className="text-xs font-medium tracking-widest uppercase text-[#1a1a1a]/30 mb-4">Score global</p>
        <div className="flex items-center justify-center gap-1 mb-2">
          <span className={`text-6xl font-bold ${overall.color}`}>{totalPct}</span>
          <span className="text-2xl text-[#1a1a1a]/20 font-light">%</span>
        </div>
        <p className="text-sm text-[#1a1a1a]/40 mb-3">{totalScore} / {totalMaxScore} points</p>
        <span className={`inline-block px-4 py-1 rounded-full text-xs font-semibold tracking-wide ${overall.color} bg-[#1a1a1a]/[0.05]`}>{overall.label}</span>
      </div>

      {/* Interpretation */}
      {interpretation && (
        <div className="bg-white border border-[#1a1a1a]/[0.08] rounded-2xl p-6 mb-8">
          <p className="text-sm text-[#1a1a1a]/50 leading-relaxed mb-3">{interpretation.description}</p>
          <div className="flex items-start gap-2 pt-3 border-t border-[#1a1a1a]/[0.08]">
            <InfoIcon className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-[#1a1a1a]/50 leading-relaxed">{interpretation.recommendation}</p>
          </div>
        </div>
      )}

      {/* Section gauges */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        {sectionResults.map(({ section, score }) => (
          <ScoreGauge key={section.id} score={score} maxScore={section.maxScore} label={section.title.split(' ')[0]} icon={section.icon} size="sm" />
        ))}
      </div>

      {/* Per-section detail */}
      <div className="space-y-4 mb-10">
        {sectionResults.map(({ section, score }) => {
          const pct = Math.round((score / section.maxScore) * 100)
          const info = getOverallLabel(pct)
          return (
            <div key={section.id} className="bg-white border border-[#1a1a1a]/[0.08] rounded-xl px-5 py-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/8 flex items-center justify-center text-rose-500/70">
                    {renderSectionIcon(section.icon, 'w-4 h-4')}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1a1a1a]">{section.title}</p>
                    <p className="text-xs text-[#1a1a1a]/30">{section.subtitle}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${info.color}`}>{pct}%</p>
                  <p className="text-xs text-[#1a1a1a]/30">{score}/{section.maxScore}</p>
                </div>
              </div>
              <div className="h-1.5 bg-[#1a1a1a]/[0.05] rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${info.bar} transition-all duration-700`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
        <Link href="/onboarding/bilans" className="px-10 py-4 rounded-xl bg-rose-500 text-white text-base font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-center inline-block">Retour aux bilans</Link>
      </div>
      <div className="w-12 h-px bg-gradient-to-r from-transparent via-rose-500 to-transparent mx-auto mt-12" />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   MAIN ORCHESTRATOR
   ═══════════════════════════════════════════════════════ */
type Phase = 'welcome' | 'intro' | 'testing' | 'section-results' | 'results'

export default function BilanEmotionnelPage() {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('welcome')
  const [sectionIndex, setSectionIndex] = useState(0)
  const [testIndex, setTestIndex] = useState(0)
  const [scores, setScores] = useState<Record<string, number>>({})
  const hasRestored = useRef(false)

  // ── Restore progress from localStorage ──
  useEffect(() => {
    if (hasRestored.current) return
    hasRestored.current = true
    const saved = loadProgress('emotionnel')
    if (saved && Object.keys(saved.scores).length > 0) {
      setScores(saved.scores)
      setSectionIndex(saved.sectionIndex)
      setTestIndex(saved.testIndex)
      setPhase('testing')
    }
  }, [])

  // ── Auto-save progress to localStorage ──
  useEffect(() => {
    if (phase === 'results') return
    if (Object.keys(scores).length === 0) return
    saveProgress('emotionnel', scores, sectionIndex, testIndex)
  }, [scores, sectionIndex, testIndex, phase])

  const currentSection = allSections[sectionIndex]
  const currentTest: EmotionnelTest | undefined = currentSection?.tests[testIndex]

  const flatIndex = useMemo(() => {
    let idx = 0
    for (let s = 0; s < sectionIndex; s++) idx += allSections[s].tests.length
    return idx + testIndex
  }, [sectionIndex, testIndex])

  const totalTests = useMemo(() => allSections.reduce((sum, s) => sum + s.tests.length, 0), [])

  const handleScore = useCallback((value: number) => {
    if (!currentTest) return
    setScores((prev) => ({ ...prev, [currentTest.id]: value }))
  }, [currentTest])

  const handleNext = useCallback(() => {
    if (!currentTest || scores[currentTest.id] === undefined) return
    if (testIndex < currentSection.tests.length - 1) {
      setTestIndex(testIndex + 1)
    } else {
      // End of section
      setPhase('section-results')
    }
  }, [currentTest, scores, testIndex, currentSection])

  const handleSectionContinue = useCallback(() => {
    if (sectionIndex < allSections.length - 1) {
      setSectionIndex(sectionIndex + 1)
      setTestIndex(0)
      setPhase('intro')
    } else {
      setPhase('results')
    }
  }, [sectionIndex])

  const handlePrev = useCallback(() => {
    if (testIndex > 0) {
      setTestIndex(testIndex - 1)
    } else if (sectionIndex > 0) {
      const prevSection = allSections[sectionIndex - 1]
      setSectionIndex(sectionIndex - 1)
      setTestIndex(prevSection.tests.length - 1)
      setPhase('testing')
    } else {
      router.push('/onboarding/bilans')
    }
  }, [testIndex, sectionIndex, router])

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {phase === 'testing' && (
        <div className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#1a1a1a]/[0.08]">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
            <button onClick={handlePrev} className="flex items-center gap-1 text-sm text-[#1a1a1a]/40 hover:text-[#1a1a1a] transition-colors">
              <ChevronLeft className="w-4 h-4" /><span className="hidden sm:inline">Retour</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs tabular-nums text-[#1a1a1a]/30">{flatIndex + 1}/{totalTests}</span>
              <div className="w-24 h-1 bg-[#1a1a1a]/[0.06] rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-rose-400 to-rose-600 transition-all duration-500"
                  style={{ width: `${Math.round(((flatIndex + 1) / totalTests) * 100)}%` }} />
              </div>
            </div>
            <Link href="/onboarding/bilans" className="text-xs text-[#1a1a1a]/20 hover:text-[#1a1a1a]/50 transition-colors">Quitter</Link>
          </div>
        </div>
      )}

      <main className="max-w-2xl mx-auto px-4 py-6">
        {phase === 'welcome' && <WelcomeScreen onStart={() => setPhase('intro')} />}
        {phase === 'intro' && <SectionIntro section={currentSection} sectionIndex={sectionIndex} onStart={() => setPhase('testing')} />}
        {phase === 'testing' && currentTest && (
          <TestCard
            test={currentTest} testIndex={flatIndex} totalTests={totalTests}
            sectionTitle={currentSection.title} sectionIcon={currentSection.icon}
            selectedScore={scores[currentTest.id]} onScore={handleScore}
            onPrev={handlePrev} onNext={handleNext} canGoNext={scores[currentTest.id] !== undefined}
          />
        )}
        {phase === 'section-results' && (
          <SectionResultsScreen section={currentSection} sectionIndex={sectionIndex} scores={scores} onContinue={handleSectionContinue} />
        )}
        {phase === 'results' && <ResultsScreen scores={scores} />}
      </main>
    </div>
  )
}
