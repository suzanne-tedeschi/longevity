'use client'

import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  allSections,
  totalMaxScore,
  sommeilInterpretations,
  type TestSection,
  type SommeilTest,
  type SectionIcon,
} from '@/lib/bilan-sommeil-data'
import { supabase } from '@/lib/supabase'
import { saveProgress, loadProgress, clearProgress } from '@/lib/bilan-progress'
import {
  getSectionReport, getSectionRecommendation, getTriggeredInsights, globalKeyInsights,
  generateFullReport,
} from '@/lib/bilan-sommeil-report'

/* ═══════════════════════════════════════════════════════
   SVG ICON COMPONENTS — Sleep-themed line icons
   ═══════════════════════════════════════════════════════ */

function MoonIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  )
}

function StarIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function ShieldIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  )
}

function BrainIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a5 5 0 015 5c0 1.5-.5 2.5-1.5 3.5.6.5 1 1.2 1 2 0 1.5-1.2 2.7-2.5 3 .3.8.5 1.5.5 2.5a3 3 0 01-5 2.24A3 3 0 014.5 18c0-1 .2-1.7.5-2.5C3.7 15.2 2.5 14 2.5 12.5c0-.8.4-1.5 1-2C2.5 9.5 2 8.5 2 7a5 5 0 015-5" />
      <path d="M12 2v20" />
    </svg>
  )
}

function ChevronLeft({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

function ChevronRight({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  )
}

function CheckCircle({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

function InfoIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  )
}

function SleepIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
      <path d="M14 5l3 0" />
      <path d="M14 5l1.5-1.5" />
      <path d="M17 8l2 0" />
      <path d="M17 8l1-1" />
    </svg>
  )
}

function renderSectionIcon(icon: SectionIcon, className = 'w-6 h-6') {
  switch (icon) {
    case 'troubles': return <MoonIcon className={className} />
    case 'quality':  return <StarIcon className={className} />
    case 'hygiene':  return <ShieldIcon className={className} />
    case 'profile':  return <BrainIcon className={className} />
  }
}

/* ═══════════════════════════════════════════════════════
   SCORE COLOR HELPERS
   ═══════════════════════════════════════════════════════ */
const selectedColor = { bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-700', ring: 'ring-sky-300' }
const scoreColors: Record<number, { bg: string; border: string; text: string; ring: string }> = {
  0: selectedColor,
  1: selectedColor,
  2: selectedColor,
  3: selectedColor,
}

function getOverallLabel(pct: number) {
  if (pct >= 80) return { label: 'Excellent', color: 'text-emerald-600', bar: 'bg-emerald-500' }
  if (pct >= 60) return { label: 'Bon', color: 'text-sky-600', bar: 'bg-sky-500' }
  if (pct >= 40) return { label: 'Moyen', color: 'text-amber-600', bar: 'bg-amber-500' }
  return { label: 'À améliorer', color: 'text-red-600', bar: 'bg-red-500' }
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
        <div className="h-full rounded-full bg-gradient-to-r from-supagreen to-supagreen-dark transition-all duration-700 ease-out" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   SCORE BUTTON
   ═══════════════════════════════════════════════════════ */
function ScoreButton({ value, label, description, selected, onSelect }: {
  value: number; label: string; description: string; selected: boolean; onSelect: () => void
}) {
  const colors = scoreColors[value] || scoreColors[0]
  return (
    <button
      onClick={onSelect}
      className={`group relative w-full text-left rounded-xl border-2 p-4 transition-all duration-300 ease-out ${
        selected
          ? `${colors.bg} ${colors.border} ring-2 ${colors.ring} shadow-md`
          : 'border-[#1a1a1a]/[0.08] bg-white hover:border-[#1a1a1a]/[0.12] hover:shadow-sm'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-300 ${
          selected ? `${colors.bg} ${colors.text} ${colors.border} border` : 'bg-[#1a1a1a]/[0.05] text-[#1a1a1a]/30 border border-[#1a1a1a]/[0.08]'
        }`}>
          {value}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-sm transition-colors duration-300 ${selected ? colors.text : 'text-[#1a1a1a]'}`}>{label}</p>
        </div>
        {selected && <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${colors.text}`} />}
      </div>
    </button>
  )
}

/* ═══════════════════════════════════════════════════════
   SECTION INTRO SCREEN
   ═══════════════════════════════════════════════════════ */
function SectionIntro({ section, sectionIndex, onStart }: { section: TestSection; sectionIndex: number; onStart: () => void }) {
  return (
    <div className="animate-fade-in flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="mb-6 inline-flex items-center gap-2 bg-[#1a1a1a]/[0.05] border border-[#1a1a1a]/[0.08] rounded-full px-4 py-1.5">
        <span className="text-xs font-medium tracking-widest uppercase text-[#1a1a1a]/40">
          Section {sectionIndex + 1} / {allSections.length}
        </span>
      </div>
      <div className="mb-8 w-20 h-20 rounded-2xl bg-gradient-to-br from-supagreen/10 to-supagreen-dark/10 border border-supagreen/15 flex items-center justify-center text-supagreen">
        {renderSectionIcon(section.icon, 'w-10 h-10')}
      </div>
      <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-2 tracking-tight">{section.title}</h2>
      <p className="text-supagreen font-medium text-sm tracking-wide uppercase mb-6">{section.subtitle}</p>
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
      <button onClick={onStart} className="btn-secondary">Commencer cette section</button>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   TEST CARD
   ═══════════════════════════════════════════════════════ */
function TestCard({ test, testIndex, totalTests, sectionTitle, sectionIcon, selectedScore, onScore, onPrev, onNext, canGoNext }: {
  test: SommeilTest; testIndex: number; totalTests: number; sectionTitle: string; sectionIcon: SectionIcon
  selectedScore: number | undefined; onScore: (v: number) => void; onPrev: () => void; onNext: () => void; canGoNext: boolean
}) {
  return (
    <div className="animate-fade-in max-w-lg mx-auto">
      <ProgressBar current={testIndex + 1} total={totalTests} sectionTitle={sectionTitle} />

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-supagreen/8 flex items-center justify-center text-supagreen">
            {renderSectionIcon(sectionIcon, 'w-4 h-4')}
          </div>
          <span className="text-xs font-medium tracking-widest uppercase text-[#1a1a1a]/30">Question {testIndex + 1}</span>
        </div>
        <h3 className="text-2xl font-bold text-[#1a1a1a] tracking-tight mb-1">{test.name}</h3>
      </div>

      <div className="bg-[#1a1a1a]/[0.02] border border-[#1a1a1a]/[0.08] rounded-xl p-4 mb-6">
        <p className="text-base font-semibold text-[#1a1a1a]/80 leading-relaxed">{test.criteria}</p>
      </div>

      <div className="space-y-2.5 mb-8">
        {test.scoring.map((option) => (
          <ScoreButton
            key={option.value}
            value={option.value}
            label={option.label}
            description={option.description}
            selected={selectedScore === option.value}
            onSelect={() => onScore(option.value)}
          />
        ))}
      </div>

      <div className="h-20" />
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur border-t border-[#1a1a1a]/[0.08] px-4 py-3 z-50">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button onClick={onPrev} className="flex items-center gap-1 text-sm text-[#1a1a1a]/40 hover:text-[#1a1a1a] transition-colors">
            <ChevronLeft className="w-4 h-4" /> Précédent
          </button>
          <button
            onClick={onNext}
            disabled={!canGoNext}
            className={`flex items-center gap-1 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              canGoNext
                ? 'bg-supagreen text-white shadow-md hover:shadow-lg hover:-translate-y-0.5'
                : 'bg-[#1a1a1a]/[0.06] text-[#1a1a1a]/20 cursor-not-allowed'
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
          <circle
            cx={dims.r + dims.stroke}
            cy={dims.r + dims.stroke}
            r={dims.r}
            fill="none"
            stroke="currentColor"
            strokeWidth={dims.stroke}
            strokeDasharray={circ}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            className={`${color} transition-all duration-1000 ease-out`}
            style={{ color: pct >= 80 ? '#10b981' : pct >= 60 ? '#0ea5e9' : pct >= 40 ? '#f59e0b' : '#ef4444' }}
          />
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
    'troubles-sommeil': {
      high: { title: 'Peu de troubles nocturnes', message: 'Vos nuits semblent peu perturbées. C\u2019est un atout majeur pour votre récupération et votre santé.' },
      mid:  { title: 'Troubles modérés', message: 'Certains facteurs perturbent votre sommeil. Le programme identifiera les leviers d\u2019amélioration prioritaires.' },
      low:  { title: 'Troubles fréquents', message: 'Vos nuits sont significativement perturbées. C\u2019est un axe prioritaire pour améliorer votre bien-être.' },
    },
    'qualite-impact': {
      high: { title: 'Bonne qualité ressentie', message: 'Vous percevez votre sommeil comme satisfaisant et il n\u2019affecte pas votre quotidien.' },
      mid:  { title: 'Impact modéré', message: 'Votre sommeil a un certain impact sur votre énergie et votre motivation. Des ajustements ciblés peuvent aider.' },
      low:  { title: 'Impact quotidien important', message: 'La qualité de votre sommeil affecte significativement votre journée. C\u2019est un enjeu de santé important.' },
    },
    'hygiene-sommeil': {
      high: { title: 'Excellente hygiène de sommeil', message: 'Vos habitudes sont favorables à un bon sommeil. Vous avez une base solide.' },
      mid:  { title: 'Hygiène à améliorer', message: 'Quelques habitudes nuisent à votre sommeil. De petits changements peuvent avoir un grand impact.' },
      low:  { title: 'Hygiène problématique', message: 'Plusieurs habitudes compromettent votre sommeil. Le programme proposera un plan d\u2019action concret.' },
    },
    'profil-complementaire': {
      high: { title: 'Profil rassurant', message: 'Aucun signal d\u2019alerte majeur détecté. Votre terrain physiologique semble favorable.' },
      mid:  { title: 'Quelques points d\u2019attention', message: 'Certains signaux méritent une attention. Le programme tiendra compte de votre profil spécifique.' },
      low:  { title: 'Signaux d\u2019alerte détectés', message: 'Plusieurs indicateurs suggèrent un trouble sous-jacent. Nous vous recommandons un avis médical complémentaire.' },
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
      <div className="w-12 h-px bg-gradient-to-r from-transparent via-supagreen to-transparent mb-8" />
      <div className="mb-6 inline-flex items-center gap-2 bg-[#1a1a1a]/[0.05] border border-[#1a1a1a]/[0.08] rounded-full px-4 py-1.5">
        <span className="text-xs font-medium tracking-widest uppercase text-[#1a1a1a]/40">Section {sectionIndex + 1} terminée</span>
      </div>
      <ScoreGauge score={sectionScore} maxScore={section.maxScore} label={section.title} icon={section.icon} size="md" />
      <div className="mt-8 max-w-sm">
        <h3 className={`text-xl font-bold mb-2 ${info.color}`}>{feedback.title}</h3>
        <p className="text-sm text-[#1a1a1a]/50 leading-relaxed">{feedback.message}</p>
      </div>
      <div className="w-full max-w-sm mt-8 space-y-1.5">
        {section.tests.map((test) => {
          const s = scores[test.id] ?? 0
          const maxTestScore = Math.max(...test.scoring.map(o => o.value))
          const testColors = scoreColors[s] || scoreColors[0]
          return (
            <div key={test.id} className="flex items-center justify-between bg-white border border-[#1a1a1a]/[0.08] rounded-lg px-3 py-2">
              <span className="text-xs text-[#1a1a1a]/50 truncate mr-2">{test.name}</span>
              <span className={`text-xs font-bold tabular-nums ${testColors.text}`}>{s}/{maxTestScore}</span>
            </div>
          )
        })}
      </div>
      <button onClick={onContinue} className="btn-secondary mt-10">
        {isLast ? 'Voir mes résultats' : 'Section suivante'}
      </button>
      {!isLast && (
        <p className="mt-4 text-xs text-[#1a1a1a]/20">
          Encore {allSections.length - sectionIndex - 1} section{allSections.length - sectionIndex - 1 > 1 ? 's' : ''} restante{allSections.length - sectionIndex - 1 > 1 ? 's' : ''}
        </p>
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
      <div className="w-12 h-px bg-gradient-to-r from-transparent via-supagreen to-transparent mb-10" />
      <div className="mb-8 w-16 h-16 rounded-2xl bg-gradient-to-br from-supagreen/10 to-supagreen-dark/10 border border-supagreen/15 flex items-center justify-center text-supagreen">
        <SleepIcon className="w-8 h-8" />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-3 tracking-tight">Bilan Sommeil</h1>
      <h2 className="text-sm font-medium tracking-widest uppercase text-supagreen mb-8">Qualité & hygiène du sommeil</h2>
      <p className="max-w-md text-[#1a1a1a]/50 leading-relaxed mb-10">
        Ce bilan évalue la qualité de votre sommeil, vos habitudes et détecte d&apos;éventuels
        troubles à travers {allSections.reduce((sum, s) => sum + s.tests.length, 0)} questions réparties en {allSections.length} sections.
        Il est basé sur les questionnaires validés PSQI et SHI.
      </p>
      <div className="w-full max-w-sm space-y-3 mb-10">
        {allSections.map((section) => (
          <div key={section.id} className="flex items-center gap-4 bg-white border border-[#1a1a1a]/[0.08] rounded-xl px-4 py-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-supagreen/8 to-supagreen-dark/8 border border-supagreen/10 flex items-center justify-center text-supagreen/70">
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
      <button onClick={onStart} className="btn-secondary">Commencer le bilan</button>
      <p className="mt-6 text-xs text-[#1a1a1a]/20 max-w-xs leading-relaxed">
        Répondez le plus honnêtement possible en pensant au dernier mois écoulé.
      </p>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   RESULTS SCREEN
   ═══════════════════════════════════════════════════════ */
function ResultsScreen({ scores }: { scores: Record<string, number> }) {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [showReport, setShowReport] = useState(false)
  const hasSaved = useRef(false)

  const sectionResults = allSections.map((section) => {
    const score = section.tests.reduce((sum, t) => sum + (scores[t.id] ?? 0), 0)
    return { section, score }
  })
  const totalScore = sectionResults.reduce((sum, r) => sum + r.score, 0)
  const totalPct = Math.round((totalScore / totalMaxScore) * 100)
  const overall = getOverallLabel(totalPct)

  const allResults = sectionResults.map(({ section, score }) => ({
    sectionId: section.id,
    pct: Math.round((score / section.maxScore) * 100),
    score,
    maxScore: section.maxScore,
    title: section.title,
  }))

  // ── Save logic (callable for retry) ──
  async function doSave() {
    try {
      const session = await supabase?.auth.getSession()
      const token = session?.data?.session?.access_token
      if (!token) { console.warn('[bilan-save] No auth session'); setSaveStatus('error'); return }
      setSaveStatus('saving')

      const fullReport = generateFullReport(allResults, scores)

      const payload = {
        bilanType: 'sommeil',
        scores,
        globalScore: totalPct,
        globalPoints: totalScore,
        maxPoints: totalMaxScore,
        subScores: Object.fromEntries(sectionResults.map(r => [r.section.id, { score: r.score, max: r.section.maxScore, pct: Math.round((r.score / r.section.maxScore) * 100) }])),
        sectionResults: sectionResults.map(r => ({ sectionId: r.section.id, title: r.section.title, score: r.score, maxScore: r.section.maxScore, pct: Math.round((r.score / r.section.maxScore) * 100) })),
        report: fullReport,
      }
      const res = await fetch('/api/bilan/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      })
      if (res.ok) { setSaveStatus('saved'); clearProgress('sommeil') }
      else {
        const err = await res.json().catch(() => ({}))
        console.error('[bilan-save] API error:', err)
        setSaveStatus('error')
      }
    } catch (e) { console.error('[bilan-save] Failed:', e); setSaveStatus('error') }
  }

  // ── Auto-save on mount ──
  useEffect(() => {
    if (hasSaved.current) return
    hasSaved.current = true
    doSave()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Find matching interpretation
  const interpretation = sommeilInterpretations.find((interp, i) => {
    if (totalPct >= 80 && i === 0) return true
    if (totalPct >= 60 && totalPct < 80 && i === 1) return true
    if (totalPct >= 40 && totalPct < 60 && i === 2) return true
    if (totalPct < 40 && i === 3) return true
    return false
  })

  return (
    <div className="animate-fade-in max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <div className="w-12 h-px bg-gradient-to-r from-transparent via-supagreen to-transparent mx-auto mb-8" />
        <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] tracking-tight mb-2">Vos résultats</h2>
        <p className="text-sm text-[#1a1a1a]/40">Bilan sommeil — qualité & hygiène</p>
        {saveStatus === 'saving' && <p className="text-xs text-[#a78bfa]/60 mt-2 animate-pulse">Sauvegarde en cours...</p>}
        {saveStatus === 'saved' && <p className="text-xs text-emerald-500 mt-2">Résultats sauvegardés</p>}
        {saveStatus === 'error' && (
          <div className="mt-2">
            <p className="text-xs text-red-400">Sauvegarde échouée</p>
            <button onClick={doSave} className="text-xs text-red-400 underline hover:text-red-500 mt-1">Réessayer</button>
          </div>
        )}
      </div>

      {/* Global score */}
      <div className="bg-white backdrop-blur-sm border border-[#1a1a1a]/[0.08] rounded-2xl p-8 mb-8 text-center">
        <p className="text-xs font-medium tracking-widest uppercase text-[#1a1a1a]/30 mb-4">Score global</p>
        <div className="flex items-center justify-center gap-1 mb-2">
          <span className={`text-6xl font-bold ${overall.color}`}>{totalPct}</span>
          <span className="text-2xl text-[#1a1a1a]/20 font-light">%</span>
        </div>
        <p className="text-sm text-[#1a1a1a]/40 mb-3">{totalScore} / {totalMaxScore} points</p>
        <span className={`inline-block px-4 py-1 rounded-full text-xs font-semibold tracking-wide ${overall.color} bg-[#1a1a1a]/[0.05]`}>
          {overall.label}
        </span>
      </div>

      {/* Segmentation */}
      <div className="space-y-3 mb-10">
        {sectionResults.map(({ section, score }) => {
          const pct = Math.round((score / section.maxScore) * 100)
          const info = getOverallLabel(pct)
          return (
            <div key={section.id} className="bg-white border border-[#1a1a1a]/[0.08] rounded-xl px-5 py-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-supagreen/8 flex items-center justify-center text-supagreen/70">
                    {renderSectionIcon(section.icon, 'w-4 h-4')}
                  </div>
                  <p className="text-sm font-semibold text-[#1a1a1a]">{section.title}</p>
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

      {!showReport ? (
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => setShowReport(true)}
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-supagreen-dark to-supagreen text-white rounded-2xl px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 w-full max-w-sm justify-center"
          >
            <p className="font-semibold text-sm">Accéder à mon compte rendu</p>
            <ChevronRight className="w-5 h-5 text-white/60 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </button>
          <Link href="/onboarding/bilans" className="text-sm text-[#1a1a1a]/30 hover:text-[#1a1a1a]/50 transition-colors">
            Retour aux bilans
          </Link>
        </div>
      ) : (
        <div className="animate-fade-in">
          {/* Interpretation */}
          {interpretation && (
            <div className="bg-white border border-[#1a1a1a]/[0.08] rounded-2xl p-6 mb-8">
              <p className="text-sm text-[#1a1a1a]/50 leading-relaxed mb-3">{interpretation.description}</p>
              <div className="flex items-start gap-2 pt-3 border-t border-[#1a1a1a]/[0.08]">
                <InfoIcon className="w-4 h-4 text-supagreen flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[#1a1a1a]/50 leading-relaxed">{interpretation.recommendation}</p>
              </div>
            </div>
          )}

          {/* Section gauges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">
            {sectionResults.map(({ section, score }) => (
              <ScoreGauge key={section.id} score={score} maxScore={section.maxScore} label={section.title.split(' ')[0]} icon={section.icon} size="sm" />
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
            <Link href="/onboarding/bilans" className="btn-primary text-center inline-block">
              Retour aux bilans
            </Link>
          </div>
        </div>
      )}

      <div className="w-12 h-px bg-gradient-to-r from-transparent via-supagreen to-transparent mx-auto mt-12" />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   MAIN ORCHESTRATOR
   ═══════════════════════════════════════════════════════ */
type Phase = 'testing' | 'results'

export default function BilanSommeilPage() {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('testing')
  const [sectionIndex, setSectionIndex] = useState(0)
  const [testIndex, setTestIndex] = useState(0)
  const [scores, setScores] = useState<Record<string, number>>({})
  const hasRestored = useRef(false)

  // ── Restore progress from localStorage ──
  useEffect(() => {
    if (hasRestored.current) return
    hasRestored.current = true
    const saved = loadProgress('sommeil')
    if (saved && Object.keys(saved.scores).length > 0) {
      setScores(saved.scores)
      setSectionIndex(saved.sectionIndex)
      setTestIndex(saved.testIndex)
    }
  }, [])

  // ── Auto-save progress to localStorage ──
  useEffect(() => {
    if (phase === 'results') return
    if (Object.keys(scores).length === 0) return
    saveProgress('sommeil', scores, sectionIndex, testIndex)
  }, [scores, sectionIndex, testIndex, phase])

  const currentSection = allSections[sectionIndex]
  const currentTest: SommeilTest | undefined = currentSection?.tests[testIndex]

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
    if (!currentTest) return
    if (scores[currentTest.id] === undefined) return
    if (testIndex < currentSection.tests.length - 1) {
      setTestIndex(testIndex + 1)
    } else if (sectionIndex < allSections.length - 1) {
      setSectionIndex(sectionIndex + 1)
      setTestIndex(0)
    } else {
      setPhase('results')
    }
  }, [currentTest, scores, testIndex, currentSection, sectionIndex])

  const handlePrev = useCallback(() => {
    if (testIndex > 0) {
      setTestIndex(testIndex - 1)
    } else if (sectionIndex > 0) {
      const prevSection = allSections[sectionIndex - 1]
      setSectionIndex(sectionIndex - 1)
      setTestIndex(prevSection.tests.length - 1)
    } else {
      router.push('/onboarding/bilans')
    }
  }, [testIndex, sectionIndex, router])

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {phase === 'testing' && (
        <div className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#1a1a1a]/[0.08]">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
            <button
              onClick={handlePrev}
              className="flex items-center gap-1 text-sm text-[#1a1a1a]/40 hover:text-[#1a1a1a] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Retour</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs tabular-nums text-[#1a1a1a]/30">{flatIndex + 1}/{totalTests}</span>
              <div className="w-24 h-1 bg-[#1a1a1a]/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-supagreen to-supagreen-dark transition-all duration-500"
                  style={{ width: `${Math.round(((flatIndex + 1) / totalTests) * 100)}%` }}
                />
              </div>
            </div>
            <Link href="/onboarding/bilans" className="text-xs text-[#1a1a1a]/20 hover:text-[#1a1a1a]/50 transition-colors">Quitter</Link>
          </div>
        </div>
      )}

      <main className="max-w-2xl mx-auto px-4 py-6">
        {phase === 'testing' && currentTest && (
          <TestCard
            test={currentTest} testIndex={flatIndex} totalTests={totalTests}
            sectionTitle={currentSection.title} sectionIcon={currentSection.icon}
            selectedScore={scores[currentTest.id]} onScore={handleScore}
            onPrev={handlePrev} onNext={handleNext} canGoNext={scores[currentTest.id] !== undefined}
          />
        )}
        {phase === 'results' && <ResultsScreen scores={scores} />}
      </main>
    </div>
  )
}
