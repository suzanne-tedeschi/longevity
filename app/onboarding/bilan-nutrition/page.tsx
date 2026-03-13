'use client'

import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { saveProgress, loadProgress, clearProgress } from '@/lib/bilan-progress'
import {
  digestifSections,
  alimentaireSections,
  digestifMaxScore,
  alimentaireMaxScore,
  totalMaxScore,
  nutritionInterpretations,
  digestifInterpretations,
  alimentaireInterpretations,
  type TestSection,
  type NutritionTest,
  type SectionIcon,
} from '@/lib/bilan-nutrition-data'
import {
  getSectionReport,
  getSectionRecommendation,
  getTriggeredInsights,
  generateTopActions,
  globalKeyInsights,
  generateFullReport,
} from '@/lib/bilan-nutrition-report'

/* ═══════════════════════════════════════════════════════
   SVG ICON COMPONENTS
   ═══════════════════════════════════════════════════════ */

function FlameIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22c-4.97 0-7-3.58-7-7 0-4 3-7 4-8 0 3 2 4 3 4 0-2 1-6 3-8 .5 2 2 4 2 6s1 4 1 4c1.5-1.5 2-3 2-5 2 2 2 5 2 7s-2.03 7-7 7z" />
    </svg>
  )
}

function BoltIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}

function StomachIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 4h4a6 6 0 016 6v0a4 4 0 01-4 4h-2a4 4 0 00-4 4v2" />
      <path d="M16 10c2 0 4-1 4-3s-1-3-3-3" />
      <path d="M10 14c0 2 1 4 3 5" />
    </svg>
  )
}

function WavesIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
    </svg>
  )
}

function BlockIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 3v18" />
      <path d="M15 3v18" />
      <path d="M3 9h18" />
      <path d="M3 15h18" />
    </svg>
  )
}

function UtensilsIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2v0a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
    </svg>
  )
}

function AppleIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 5-2.5 5-6.5 0-4.5-2.5-7.5-5-7.5-1.25 0-2.5.5-4 .5s-2.75-.5-4-.5c-2.5 0-5 3-5 7.5s2 6.5 5 6.5c1.25 0 2.5-1.06 4-1.06z" />
      <path d="M12 7c1-2 3-3 5-3" />
    </svg>
  )
}

function MoleculeIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <circle cx="19" cy="7" r="2" />
      <circle cx="5" cy="7" r="2" />
      <circle cx="12" cy="20" r="2" />
      <path d="M14.5 10.5l3-2.5" />
      <path d="M9.5 10.5l-3-2.5" />
      <path d="M12 15v3" />
    </svg>
  )
}

function FactoryIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 20h20" />
      <path d="M17 20V4l-5 4V4l-5 4v12" />
      <path d="M10 14h1" />
      <path d="M14 14h1" />
      <path d="M10 18h1" />
      <path d="M14 18h1" />
    </svg>
  )
}

function FireIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />
    </svg>
  )
}

function SparklesIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.937 15.5A2 2 0 008.5 14.063l-6.135-1.582a.5.5 0 010-.962L8.5 9.936A2 2 0 009.937 8.5l1.582-6.135a.5.5 0 01.963 0L14.063 8.5A2 2 0 0015.5 9.937l6.135 1.581a.5.5 0 010 .964L15.5 14.063a2 2 0 00-1.437 1.437l-1.582 6.135a.5.5 0 01-.963 0z" />
      <path d="M20 3v4" />
      <path d="M22 5h-4" />
    </svg>
  )
}

function NutritionIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2c-1.5 0-3 1-3 3v4c0 2-2 3-3 5s0 4 1 5c1.5 1.5 3 2 5 2s3.5-.5 5-2c1-1 2-3 1-5s-3-3-3-5V5c0-2-1.5-3-3-3z" />
      <path d="M10 9h4" />
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

function BookIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      <path d="M8 7h8" />
      <path d="M8 11h6" />
    </svg>
  )
}

function renderSectionIcon(icon: SectionIcon, className = 'w-6 h-6') {
  switch (icon) {
    case 'reflux':            return <FlameIcon className={className} />
    case 'pain':              return <BoltIcon className={className} />
    case 'indigestion':       return <StomachIcon className={className} />
    case 'transit':           return <WavesIcon className={className} />
    case 'constipation':      return <BlockIcon className={className} />
    case 'habitudes':         return <UtensilsIcon className={className} />
    case 'macronutriments':   return <AppleIcon className={className} />
    case 'micronutriments':   return <MoleculeIcon className={className} />
    case 'ultra-transformes': return <FactoryIcon className={className} />
    case 'inflammatoire':     return <FireIcon className={className} />
    case 'bonus':             return <SparklesIcon className={className} />
  }
}

/* ═══════════════════════════════════════════════════════
   SCORE COLOR HELPERS
   ═══════════════════════════════════════════════════════ */
const selectedColor = { bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-700', ring: 'ring-sky-300' }
function getScoreColors(_value: number, _maxValue: number) {
  return selectedColor
}

function getOverallLabel(pct: number) {
  if (pct >= 85) return { label: 'Optimal', color: 'text-emerald-600', bar: 'bg-emerald-500' }
  if (pct >= 70) return { label: 'Satisfaisant', color: 'text-sky-600', bar: 'bg-sky-500' }
  if (pct >= 55) return { label: 'Moyen', color: 'text-amber-600', bar: 'bg-amber-500' }
  if (pct >= 40) return { label: 'À risque', color: 'text-orange-600', bar: 'bg-orange-500' }
  return { label: 'Déstructuré', color: 'text-red-600', bar: 'bg-red-500' }
}

function getDigestifLabel(pct: number) {
  if (pct >= 90) return { label: 'Excellent', color: 'text-emerald-600', bar: 'bg-emerald-500' }
  if (pct >= 75) return { label: 'Bon', color: 'text-sky-600', bar: 'bg-sky-500' }
  if (pct >= 50) return { label: 'Moyen', color: 'text-amber-600', bar: 'bg-amber-500' }
  if (pct >= 30) return { label: 'Significatif', color: 'text-orange-600', bar: 'bg-orange-500' }
  return { label: 'Sévère', color: 'text-red-600', bar: 'bg-red-500' }
}

/* ═══════════════════════════════════════════════════════
   PROGRESS BAR
   ═══════════════════════════════════════════════════════ */
function ProgressBar({ current, total, sectionTitle }: { current: number; total: number; sectionTitle: string }) {
  const pct = Math.round((current / total) * 100)
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium tracking-widest uppercase text-[#1a1a1a]/60">{sectionTitle}</span>
        <span className="text-xs tabular-nums text-[#1a1a1a]/50">{current}/{total}</span>
      </div>
      <div className="h-1 w-full bg-[#1a1a1a]/[0.06] rounded-full overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-[#2D6A4F] to-[#1B4332] transition-all duration-700 ease-out" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   SCORE BUTTON — handles GSRS (4 options) & binary (2 options)
   ═══════════════════════════════════════════════════════ */
function ScoreButton({ value, label, description, selected, onSelect, maxOptionValue }: {
  value: number; label: string; description: string; selected: boolean; onSelect: () => void; maxOptionValue: number
}) {
  const colors = getScoreColors(value, maxOptionValue)
  return (
    <button
      onClick={onSelect}
      className={`group relative w-full text-left rounded-xl border-2 p-4 transition-all duration-300 ease-out ${
        selected
          ? `${colors.bg} ${colors.border} ring-2 ${colors.ring} shadow-md`
          : 'border-[#1a1a1a]/[0.1] bg-white hover:border-[#1a1a1a]/20 hover:shadow-sm'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`flex-shrink-0 w-3 h-3 rounded-full transition-all duration-300 ${
          selected ? `${colors.bg} border-2 ${colors.border}` : 'bg-[#1a1a1a]/[0.1] border-2 border-transparent'
        }`} />
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-sm transition-colors duration-300 ${selected ? colors.text : 'text-[#1a1a1a]'}`}>{label}</p>
        </div>
        {selected && <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${colors.text}`} />}
      </div>
    </button>
  )
}

/* ═══════════════════════════════════════════════════════
   TEST CARD
   ═══════════════════════════════════════════════════════ */
function TestCard({ test, testIndex, totalTests, sectionTitle, sectionIcon, selectedScore, onScore, onPrev }: {
  test: NutritionTest; testIndex: number; totalTests: number; sectionTitle: string; sectionIcon: SectionIcon
  selectedScore: number | undefined; onScore: (v: number) => void; onPrev: () => void
}) {
  const maxOptionValue = Math.max(...test.scoring.map(o => o.value))
  return (
    <div className="animate-fade-in max-w-lg mx-auto">
      <ProgressBar current={testIndex + 1} total={totalTests} sectionTitle={sectionTitle} />

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-[#2D6A4F]/10 flex items-center justify-center text-[#2D6A4F]">
            {renderSectionIcon(sectionIcon, 'w-4 h-4')}
          </div>
          <span className="text-xs font-medium tracking-widest uppercase text-[#1a1a1a]/40">Question {testIndex + 1}</span>
        </div>
        <h3 className="text-2xl font-bold text-[#1a1a1a] tracking-tight mb-1">{test.name}</h3>
      </div>

      <div className="bg-[#1a1a1a]/[0.03] border border-[#1a1a1a]/[0.1] rounded-xl p-4 mb-6">
        <p className="text-base font-semibold text-[#1a1a1a]/80 leading-relaxed">{test.criteria}</p>
      </div>

      <div className="space-y-2.5 mb-8">
        {test.scoring.map((option, idx) => (
          <ScoreButton
            key={idx}
            value={option.value}
            label={option.label}
            description={option.description}
            selected={selectedScore === option.value}
            onSelect={() => onScore(option.value)}
            maxOptionValue={maxOptionValue}
          />
        ))}
      </div>

      <div className="h-20" />
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur border-t border-[#1a1a1a]/[0.08] px-4 py-3 z-50">
        <div className="max-w-lg mx-auto flex items-center">
          <button onClick={onPrev} className="flex items-center gap-1 text-sm text-[#1a1a1a]/50 hover:text-[#1a1a1a] transition-colors">
            <ChevronLeft className="w-4 h-4" /> Précédent
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
            style={{ color: pct >= 85 ? '#10b981' : pct >= 70 ? '#0ea5e9' : pct >= 55 ? '#f59e0b' : pct >= 40 ? '#f97316' : '#ef4444' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-bold ${color}`}>{pct}%</span>
          <span className="text-[10px] text-[#1a1a1a]/40 mt-0.5">{score}/{maxScore}</span>
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
    'reflux': {
      high: { title: 'Pas de reflux significatif', message: 'Vous ne présentez pas de symptômes de reflux gastro-œsophagien.' },
      mid:  { title: 'Reflux occasionnels', message: 'Vous ressentez parfois des brûlures ou remontées acides. Des ajustements alimentaires peuvent aider.' },
      low:  { title: 'Reflux fréquent', message: 'Le reflux est un problème régulier. Un bilan médical et un programme nutritionnel adapté sont recommandés.' },
    },
    'douleurs-abdominales': {
      high: { title: 'Abdomen confortable', message: 'Votre système digestif semble bien fonctionner.' },
      mid:  { title: 'Gênes abdominales modérées', message: 'Certaines douleurs nécessitent attention.' },
      low:  { title: 'Douleurs fréquentes', message: 'Les douleurs abdominales impactent votre quotidien.' },
    },
    'indigestion': {
      high: { title: 'Bonne digestion', message: 'Vos fonctions digestives semblent bien équilibrées.' },
      mid:  { title: 'Digestion à optimiser', message: 'Quelques symptômes de ballonnements perturbent votre confort.' },
      low:  { title: 'Difficultés digestives', message: 'Les ballonnements et gaz sont un problème récurrent.' },
    },
    'diarrhee': {
      high: { title: 'Transit stable', message: 'Votre transit n\u2019est pas accéléré.' },
      mid:  { title: 'Transit parfois accéléré', message: 'Des épisodes de diarrhée surviennent occasionnellement.' },
      low:  { title: 'Transit accéléré fréquent', message: 'La diarrhée est un problème régulier.' },
    },
    'constipation': {
      high: { title: 'Pas de constipation', message: 'Votre transit est régulier et confortable.' },
      mid:  { title: 'Constipation occasionnelle', message: 'Vous rencontrez parfois des difficultés de transit.' },
      low:  { title: 'Constipation fréquente', message: 'La constipation est un problème récurrent.' },
    },
    'habitudes-generales': {
      high: { title: 'Excellentes habitudes', message: 'Vos habitudes alimentaires quotidiennes sont très bien structurées.' },
      mid:  { title: 'Habitudes à améliorer', message: 'Quelques ajustements dans votre routine alimentaire seraient bénéfiques.' },
      low:  { title: 'Habitudes désorganisées', message: 'Votre routine alimentaire nécessite une restructuration importante.' },
    },
    'macronutriments': {
      high: { title: 'Macros bien équilibrés', message: 'Vos apports en protéines, glucides et lipides sont bien répartis.' },
      mid:  { title: 'Macros à rééquilibrer', message: 'Certains déséquilibres en macronutriments ont été identifiés.' },
      low:  { title: 'Déséquilibre important', message: 'Vos apports en macronutriments nécessitent une correction significative.' },
    },
    'micronutriments': {
      high: { title: 'Bonne diversité nutritionnelle', message: 'Votre alimentation est riche en vitamines et minéraux essentiels.' },
      mid:  { title: 'Carences potentielles', message: 'Certains micronutriments pourraient manquer dans votre alimentation.' },
      low:  { title: 'Carences significatives', message: 'Votre alimentation manque de diversité en vitamines et minéraux.' },
    },
    'ultra-transformes': {
      high: { title: 'Alimentation peu transformée', message: 'Vous évitez bien les produits ultra-transformés. Bravo !' },
      mid:  { title: 'Réduire les ultra-transformés', message: 'Votre consommation de produits industriels pourrait être réduite.' },
      low:  { title: 'Trop d\'ultra-transformés', message: 'Votre alimentation est trop riche en produits ultra-transformés.' },
    },
    'inflammatoire': {
      high: { title: 'Profil anti-inflammatoire', message: 'Votre alimentation est plutôt anti-inflammatoire. C\'est excellent pour la longévité.' },
      mid:  { title: 'Équilibre inflammatoire moyen', message: 'Votre alimentation contient des facteurs pro et anti-inflammatoires.' },
      low:  { title: 'Profil pro-inflammatoire', message: 'Votre alimentation favorise l\'inflammation chronique. Des ajustements sont importants.' },
    },
    'bonus-sante': {
      high: { title: 'Habitudes protectrices', message: 'Vous intégrez de nombreuses habitudes alimentaires protectrices.' },
      mid:  { title: 'Bonus partiels', message: 'Vous pourriez intégrer davantage d\'habitudes protectrices avancées.' },
      low:  { title: 'Peu de bonus santé', message: 'De nombreuses habitudes alimentaires protectrices pourraient être ajoutées.' },
    },
  }

  return feedback[sectionId]?.[level] ?? { title: level === 'high' ? 'Très bien' : level === 'mid' ? 'Correct' : 'À améliorer', message: '' }
}

/* ═══════════════════════════════════════════════════════
   WELCOME SCREEN
   ═══════════════════════════════════════════════════════ */
function WelcomeScreen({ onStartAlimentaire, onStartDigestif, alimentaireDone, digestifDone, alimentairePct, digestifPct }: {
  onStartAlimentaire: () => void; onStartDigestif: () => void
  alimentaireDone: boolean; digestifDone: boolean
  alimentairePct: number | null; digestifPct: number | null
}) {
  const totalDigestifTests = digestifSections.reduce((sum, s) => sum + s.tests.length, 0)
  const totalAlimentaireTests = alimentaireSections.reduce((sum, s) => sum + s.tests.length, 0)
  const bothDone = alimentaireDone && digestifDone

  return (
    <div className="animate-fade-in flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <div className="w-12 h-px bg-gradient-to-r from-transparent via-gold to-transparent mb-10" />
      <div className="mb-8 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2D6A4F]/10 to-[#1B4332]/10 border border-[#2D6A4F]/15 flex items-center justify-center text-[#2D6A4F]">
        <NutritionIcon className="w-8 h-8" />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-3 tracking-tight">Bilan Nutrition</h1>
      <h2 className="text-sm font-medium tracking-widest uppercase text-[#2D6A4F] mb-4">Habitudes alimentaires & troubles digestifs</h2>
      <p className="max-w-md text-[#1a1a1a]/60 leading-relaxed mb-10">
        Ce bilan évalue votre profil nutritionnel à travers {totalDigestifTests + totalAlimentaireTests} questions
        réparties en 2 parties. Commencez par celle de votre choix.
      </p>

      {/* Two part cards */}
      <div className="w-full max-w-sm space-y-4 mb-10">
        {/* Alimentaire card */}
        <button
          onClick={onStartAlimentaire}
          className={`w-full text-left group relative rounded-2xl p-5 border-2 transition-all duration-300 ${
            alimentaireDone
              ? 'bg-emerald-50/50 border-emerald-200'
              : 'bg-white border-[#1a1a1a]/[0.08] hover:border-[#c9a96e]/40 hover:shadow-md hover:-translate-y-0.5'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
              alimentaireDone
                ? 'bg-emerald-100 text-emerald-600'
                : 'bg-gradient-to-br from-[#c9a96e]/10 to-[#c9a96e]/20 text-[#c9a96e] group-hover:from-[#c9a96e]/15 group-hover:to-[#c9a96e]/25'
            }`}>
              {alimentaireDone ? <CheckCircle className="w-6 h-6" /> : <UtensilsIcon className="w-6 h-6" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className={`text-base font-semibold ${
                  alimentaireDone ? 'text-emerald-700' : 'text-[#1a1a1a] group-hover:text-[#c9a96e]'
                } transition-colors`}>
                  Habitudes alimentaires
                </h3>
                {alimentaireDone && alimentairePct !== null && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getOverallLabel(alimentairePct).color} bg-[#1a1a1a]/[0.04]`}>
                    {alimentairePct}%
                  </span>
                )}
              </div>
              <p className="text-xs text-[#1a1a1a]/40">
                {totalAlimentaireTests} questions · {alimentaireSections.length} catégories · Oui/Non
              </p>
            </div>
            <div className={`flex-shrink-0 transition-all duration-300 ${
              alimentaireDone ? 'text-emerald-400' : 'text-[#1a1a1a]/20 group-hover:text-[#c9a96e] group-hover:translate-x-0.5'
            }`}>
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>
          {alimentaireDone && (
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-t-2xl" />
          )}
        </button>

        {/* Digestif card */}
        <button
          onClick={onStartDigestif}
          className={`w-full text-left group relative rounded-2xl p-5 border-2 transition-all duration-300 ${
            digestifDone
              ? 'bg-emerald-50/50 border-emerald-200'
              : 'bg-white border-[#1a1a1a]/[0.08] hover:border-[#2D6A4F]/30 hover:shadow-md hover:-translate-y-0.5'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
              digestifDone
                ? 'bg-emerald-100 text-emerald-600'
                : 'bg-gradient-to-br from-[#2D6A4F]/10 to-[#1B4332]/10 text-[#2D6A4F] group-hover:from-[#2D6A4F]/15 group-hover:to-[#1B4332]/15'
            }`}>
              {digestifDone ? <CheckCircle className="w-6 h-6" /> : <NutritionIcon className="w-6 h-6" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className={`text-base font-semibold ${
                  digestifDone ? 'text-emerald-700' : 'text-[#1a1a1a] group-hover:text-[#2D6A4F]'
                } transition-colors`}>
                  Troubles digestifs
                </h3>
                {digestifDone && digestifPct !== null && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getDigestifLabel(digestifPct).color} bg-[#1a1a1a]/[0.04]`}>
                    {digestifPct}%
                  </span>
                )}
              </div>
              <p className="text-xs text-[#1a1a1a]/40">
                {totalDigestifTests} questions · {digestifSections.length} sections · GSRS
              </p>
            </div>
            <div className={`flex-shrink-0 transition-all duration-300 ${
              digestifDone ? 'text-emerald-400' : 'text-[#1a1a1a]/20 group-hover:text-[#2D6A4F] group-hover:translate-x-0.5'
            }`}>
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>
          {digestifDone && (
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-t-2xl" />
          )}
        </button>
      </div>

      {bothDone && (
        <p className="text-sm text-emerald-600 font-medium mb-6 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> Les deux parties sont terminées. Cliquez pour revoir ou continuer.
        </p>
      )}

      <p className="text-xs text-[#1a1a1a]/30 max-w-xs leading-relaxed mb-8">
        Répondez honnêtement en pensant à vos habitudes de la dernière semaine/du dernier mois.
      </p>
      <Link href="/onboarding/bilans" className="text-xs text-[#1a1a1a]/30 hover:text-[#1a1a1a]/60 transition-colors flex items-center gap-1">
        <ChevronLeft className="w-3.5 h-3.5" /> Retour aux bilans
      </Link>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   RESULTS SCREEN
   ═══════════════════════════════════════════════════════ */
function ResultsScreen({ scores }: { scores: Record<string, number> }) {
  const [showReport, setShowReport] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const hasSaved = useRef(false)

  const toggleSection = useCallback((id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }, [])

  // Digestif sub-score
  const digestifResults = digestifSections.map((section) => {
    const score = section.tests.reduce((sum, t) => sum + (scores[t.id] ?? 0), 0)
    return { section, score }
  })
  const digestifTotal = digestifResults.reduce((sum, r) => sum + r.score, 0)
  const digestifPct = Math.round(((digestifMaxScore - digestifTotal) / digestifMaxScore) * 100)
  const digestifInfo = getDigestifLabel(digestifPct)

  // Alimentaire sub-score
  const alimentaireResults = alimentaireSections.map((section) => {
    const score = section.tests.reduce((sum, t) => sum + (scores[t.id] ?? 0), 0)
    return { section, score }
  })
  const alimentaireTotal = alimentaireResults.reduce((sum, r) => sum + r.score, 0)
  const alimentairePct = Math.round((alimentaireTotal / alimentaireMaxScore) * 100)
  const alimentaireInfo = getOverallLabel(alimentairePct)

  // Global score — digestif is inverted (0=best), so convert to positive before summing
  const globalTotal = (digestifMaxScore - digestifTotal) + alimentaireTotal
  const globalPct = Math.round((globalTotal / totalMaxScore) * 100)
  const globalInfo = getOverallLabel(globalPct)

  const findInterpretation = (pct: number, interps: typeof nutritionInterpretations) => {
    if (pct >= 85) return interps[0]
    if (pct >= 70) return interps[1]
    if (pct >= 55) return interps[2]
    if (pct >= 40) return interps[3]
    return interps[4]
  }

  const globalInterpretation = findInterpretation(globalPct, nutritionInterpretations)

  // All section results for report
  const allResults = [...digestifResults, ...alimentaireResults].map(({ section, score }) => {
    const isDigestif = digestifSections.some(s => s.id === section.id)
    const pct = isDigestif
      ? Math.round(((section.maxScore - score) / section.maxScore) * 100)
      : Math.round((score / section.maxScore) * 100)
    return { sectionId: section.id, pct, score, maxScore: section.maxScore, title: section.title, subtitle: section.subtitle, icon: section.icon, isDigestif }
  })

  const topActions = useMemo(() => generateTopActions(
    allResults.map(r => ({ sectionId: r.sectionId, pct: r.pct, score: r.score, maxScore: r.maxScore })),
    scores
  ), [allResults, scores])

  // ── Save logic (callable for retry) ──
  async function doSave() {
    try {
      // Get session token
      const session = await supabase?.auth.getSession()
      const token = session?.data?.session?.access_token
      if (!token) {
        console.warn('[bilan-save] No auth session, skipping save')
        setSaveStatus('error')
        return
      }
      setSaveStatus('saving')

      const fullReport = generateFullReport(allResults, scores)

      const payload = {
        bilanType: 'nutrition',
        scores,
        globalScore: globalPct,
        globalPoints: globalTotal,
        maxPoints: totalMaxScore,
        subScores: {
          digestif: { score: digestifTotal, max: digestifMaxScore, pct: digestifPct },
          alimentaire: { score: alimentaireTotal, max: alimentaireMaxScore, pct: alimentairePct },
        },
        sectionResults: allResults.map(r => ({
          sectionId: r.sectionId,
          title: r.title,
          score: r.score,
          maxScore: r.maxScore,
          pct: r.pct,
          isDigestif: r.isDigestif,
        })),
        report: fullReport,
      }

      const res = await fetch('/api/bilan/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        setSaveStatus('saved')
        clearProgress('nutrition')
      } else {
        const err = await res.json().catch(() => ({}))
        console.error('[bilan-save] API error:', err)
        setSaveStatus('error')
      }
    } catch (e) {
      console.error('[bilan-save] Failed:', e)
      setSaveStatus('error')
    }
  }

  // ── Auto-save on mount ──
  useEffect(() => {
    if (hasSaved.current) return
    hasSaved.current = true
    doSave()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="animate-fade-in max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <div className="w-12 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-8" />
        <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] tracking-tight mb-2">Vos résultats</h2>
        <p className="text-sm text-[#1a1a1a]/50">Bilan Nutrition — Troubles digestifs & habitudes alimentaires</p>
        {saveStatus === 'saving' && <p className="text-xs text-[#2D6A4F]/60 mt-2 animate-pulse">Sauvegarde en cours...</p>}
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
        <p className="text-xs font-medium tracking-widest uppercase text-[#1a1a1a]/40 mb-4">Score global Nutrition</p>
        <div className="flex items-center justify-center gap-1 mb-2">
          <span className={`text-6xl font-bold ${globalInfo.color}`}>{globalPct}</span>
          <span className="text-2xl text-[#1a1a1a]/30 font-light">%</span>
        </div>
        <p className="text-sm text-[#1a1a1a]/50 mb-3">{globalTotal} / {totalMaxScore} points</p>
        <span className={`inline-block px-4 py-1 rounded-full text-xs font-semibold tracking-wide ${globalInfo.color} bg-[#1a1a1a]/[0.04]`}>
          {globalInfo.label}
        </span>
      </div>

      {/* Segmentation: two sub-scores + per-section bars */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-[#1a1a1a]/[0.1] rounded-2xl p-5 text-center">
          <p className="text-xs font-medium tracking-widest uppercase text-[#1a1a1a]/40 mb-1">Digestif</p>
          <p className={`text-3xl font-bold ${digestifInfo.color}`}>{digestifPct}%</p>
          <p className="text-xs text-[#1a1a1a]/40 mt-1">{digestifTotal}/{digestifMaxScore} pts</p>
        </div>
        <div className="bg-white border border-[#1a1a1a]/[0.1] rounded-2xl p-5 text-center">
          <p className="text-xs font-medium tracking-widest uppercase text-[#1a1a1a]/40 mb-1">Alimentaire</p>
          <p className={`text-3xl font-bold ${alimentaireInfo.color}`}>{alimentairePct}%</p>
          <p className="text-xs text-[#1a1a1a]/40 mt-1">{alimentaireTotal}/{alimentaireMaxScore} pts</p>
        </div>
      </div>

      <div className="space-y-3 mb-10">
        {allResults.map((r) => {
          const info = getOverallLabel(r.pct)
          return (
            <div key={r.sectionId} className="bg-white border border-[#1a1a1a]/[0.1] rounded-xl px-5 py-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${r.isDigestif ? 'bg-[#2D6A4F]/10 text-[#2D6A4F]/70' : 'bg-[#c9a96e]/10 text-[#c9a96e]/70'}`}>
                    {renderSectionIcon(r.icon, 'w-4 h-4')}
                  </div>
                  <p className="text-sm font-semibold text-[#1a1a1a]">{r.title}</p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${info.color}`}>{r.pct}%</p>
                  <p className="text-xs text-[#1a1a1a]/40">{r.score}/{r.maxScore}</p>
                </div>
              </div>
              <div className="h-1.5 bg-[#1a1a1a]/[0.04] rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${info.bar} transition-all duration-700`} style={{ width: `${r.pct}%` }} />
              </div>
            </div>
          )
        })}
      </div>

      {!showReport ? (
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => setShowReport(true)}
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] text-white rounded-2xl px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 w-full max-w-sm justify-center"
          >
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <BookIcon className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm">Accéder à mon compte rendu</p>
              <p className="text-xs text-white/60">Recommandations personnalisées & références</p>
            </div>
            <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </button>
          <Link href="/onboarding/bilans" className="text-sm text-[#1a1a1a]/30 hover:text-[#1a1a1a]/50 transition-colors">
            Retour aux bilans
          </Link>
        </div>
      ) : (
        <div className="animate-fade-in">
          {/* Interpretation */}
          {globalInterpretation && (
            <div className="bg-white border border-[#1a1a1a]/[0.1] rounded-2xl p-6 mb-8">
              <p className="text-sm text-[#1a1a1a]/70 leading-relaxed mb-3">{globalInterpretation.description}</p>
              <div className="flex items-start gap-2 pt-3 border-t border-[#1a1a1a]/[0.1]">
                <InfoIcon className="w-4 h-4 text-[#2D6A4F] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[#1a1a1a]/60 leading-relaxed">{globalInterpretation.recommendation}</p>
              </div>
            </div>
          )}

          {/* ═══════════ TOP PRIORITY ACTIONS ═══════════ */}
          {topActions.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center">
                  <BoltIcon className="w-4 h-4 text-amber-600" />
                </div>
                <h3 className="text-lg font-bold text-[#1a1a1a]">Plan d&apos;action prioritaire</h3>
              </div>
              <div className="space-y-3">
                {topActions.map((action) => (
                  <div key={action.priority} className={`flex items-start gap-4 p-4 rounded-xl border-2 ${
                    action.level === 'alerte'
                      ? 'bg-red-50/50 border-red-200'
                      : 'bg-amber-50/50 border-amber-200'
                  }`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                      action.level === 'alerte'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {action.priority}
                    </div>
                    <p className="text-sm text-[#1a1a1a]/80 leading-relaxed flex-1">{action.action}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══════════ KEY INSIGHTS ═══════════ */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center">
                <SparklesIcon className="w-4 h-4 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-[#1a1a1a]">Ce que dit la science</h3>
            </div>
            <div className="space-y-3">
              {globalKeyInsights.map((insight, i) => (
                <div key={i} className="bg-gradient-to-br from-[#FAF8F5] to-white border border-[#1a1a1a]/[0.08] rounded-xl p-5">
                  <h4 className="text-sm font-bold text-[#1a1a1a] mb-1.5">{insight.title}</h4>
                  <p className="text-xs text-[#1a1a1a]/60 leading-relaxed mb-2">{insight.description}</p>
                  <p className="text-[10px] text-[#2D6A4F]/60 italic">{insight.reference}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ═══════════ SECTION-BY-SECTION REPORT ═══════════ */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-[#2D6A4F]/10 border border-[#2D6A4F]/20 flex items-center justify-center">
                <BookIcon className="w-4 h-4 text-[#2D6A4F]" />
              </div>
              <h3 className="text-lg font-bold text-[#1a1a1a]">Analyse détaillée par section</h3>
            </div>

            <div className="space-y-4">
              {allResults.map((result) => {
                const report = getSectionReport(result.sectionId)
                if (!report) return null
                const recommendation = getSectionRecommendation(report, result.pct)
                const triggeredInsights = getTriggeredInsights(report, scores)
                const isExpanded = expandedSections.has(result.sectionId)
                const levelColors = {
                  alerte: { bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-100 text-red-700', dot: 'bg-red-400' },
                  vigilance: { bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-400' },
                  bon: { bg: 'bg-emerald-50', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-400' },
                  excellent: { bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700', dot: 'bg-blue-400' },
                }
                const lc = levelColors[recommendation.level]

                return (
                  <div key={result.sectionId} className={`rounded-2xl border-2 overflow-hidden transition-all duration-300 ${lc.border} ${lc.bg}`}>
                    {/* Header — always visible */}
                    <button
                      onClick={() => toggleSection(result.sectionId)}
                      className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-white/30 transition-colors"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        result.isDigestif ? 'bg-[#2D6A4F]/10 text-[#2D6A4F]' : 'bg-[#c9a96e]/15 text-[#c9a96e]'
                      }`}>
                        {renderSectionIcon(result.icon, 'w-5 h-5')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="text-sm font-bold text-[#1a1a1a]">{result.title}</h4>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${lc.badge}`}>
                            {recommendation.title}
                          </span>
                        </div>
                        <p className="text-xs text-[#1a1a1a]/40">{result.subtitle} — {result.pct}% ({result.score}/{result.maxScore})</p>
                      </div>
                      <div className={`w-6 h-6 flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}>
                        <ChevronRight className="w-4 h-4 text-[#1a1a1a]/30" />
                      </div>
                    </button>

                    {/* Expanded content */}
                    {isExpanded && (
                      <div className="px-5 pb-5 space-y-4 animate-fade-in">
                        {/* Context */}
                        <div className="bg-white/60 rounded-xl p-4">
                          <p className="text-[10px] font-semibold tracking-widest uppercase text-[#1a1a1a]/30 mb-2">Contexte scientifique</p>
                          <p className="text-xs text-[#1a1a1a]/60 leading-relaxed">{report.context}</p>
                        </div>

                        {/* Section recommendation */}
                        <div className="bg-white/80 rounded-xl p-4 border border-[#1a1a1a]/[0.06]">
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-2 h-2 rounded-full ${lc.dot}`} />
                            <p className="text-xs font-bold text-[#1a1a1a]">{recommendation.title}</p>
                          </div>
                          <p className="text-xs text-[#1a1a1a]/70 leading-relaxed">{recommendation.text}</p>
                        </div>

                        {/* Per-question triggered insights */}
                        {triggeredInsights.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-[10px] font-semibold tracking-widest uppercase text-[#1a1a1a]/30">Points d&apos;attention personnalisés</p>
                            {triggeredInsights.map((qi) => (
                              <div key={qi.questionId} className="bg-white rounded-xl p-4 border border-[#1a1a1a]/[0.08]">
                                <div className="flex items-start gap-2 mb-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-1.5" />
                                  <p className="text-xs font-semibold text-[#1a1a1a]">{qi.insight}</p>
                                </div>
                                <p className="text-xs text-[#1a1a1a]/60 leading-relaxed pl-3.5">{qi.recommendation}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* References */}
                        <div>
                          <p className="text-[10px] font-semibold tracking-widest uppercase text-[#1a1a1a]/30 mb-2">Références</p>
                          <div className="space-y-1.5">
                            {report.references.map((ref, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <span className="text-[10px] text-[#2D6A4F]/50 font-mono flex-shrink-0 mt-0.5">[{i + 1}]</span>
                                <p className="text-[10px] text-[#1a1a1a]/40 leading-relaxed">
                                  {ref.authors}. &ldquo;{ref.title}&rdquo; <em>{ref.journal}</em> ({ref.year}).
                                  {ref.pmid && <span className="text-[#2D6A4F]/50"> PMID: {ref.pmid}</span>}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* ═══════════ DISCLAIMER ═══════════ */}
          <div className="bg-[#1a1a1a]/[0.02] border border-[#1a1a1a]/[0.08] rounded-xl p-4 mb-10">
            <div className="flex items-start gap-2">
              <InfoIcon className="w-4 h-4 text-[#1a1a1a]/30 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-semibold text-[#1a1a1a]/40 mb-1">Avertissement</p>
                <p className="text-[10px] text-[#1a1a1a]/40 leading-relaxed">
                  Ce compte-rendu est généré à partir de vos réponses et de la littérature scientifique peer-reviewed.
                  Il ne constitue pas un avis médical. Les recommandations sont des orientations générales s&apos;appuyant
                  sur des méta-analyses et essais contrôlés randomisés publiés dans des revues à comité de lecture
                  (Lancet, NEJM, Gastroenterology, BMJ, etc.). Consultez un professionnel de santé pour un avis personnalisé.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
        <Link href="/onboarding/bilans" className="btn-primary text-center inline-block px-10 py-4 text-base">
          Retour aux bilans
        </Link>
      </div>

      <div className="w-12 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-12" />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   MAIN ORCHESTRATOR
   ═══════════════════════════════════════════════════════ */
type Phase = 'welcome' | 'testing' | 'results'
type ActivePart = 'alimentaire' | 'digestif'

export default function BilanNutritionPage() {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('welcome')
  const [activePart, setActivePart] = useState<ActivePart>('alimentaire')
  const [sectionIndex, setSectionIndex] = useState(0)
  const [testIndex, setTestIndex] = useState(0)
  const [scores, setScores] = useState<Record<string, number>>({})
  const [alimentaireDone, setAlimentaireDone] = useState(false)
  const [digestifDone, setDigestifDone] = useState(false)
  const hasRestored = useRef(false)

  // ── Restore progress from localStorage ──
  useEffect(() => {
    if (hasRestored.current) return
    hasRestored.current = true
    const saved = loadProgress('nutrition')
    if (saved && Object.keys(saved.scores).length > 0) {
      setScores(saved.scores)
      setSectionIndex(saved.sectionIndex)
      setTestIndex(saved.testIndex)
      if (saved.activePart === 'alimentaire' || saved.activePart === 'digestif') {
        setActivePart(saved.activePart)
      }
      if (saved.partsDone) {
        if (saved.partsDone.alimentaire) setAlimentaireDone(true)
        if (saved.partsDone.digestif) setDigestifDone(true)
      }
      // If some answers exist but both parts not done, resume in testing
      // If a part was just completed and we're at welcome to pick next, stay at welcome
      const bothNotDone = !saved.partsDone?.alimentaire || !saved.partsDone?.digestif
      if (bothNotDone && saved.sectionIndex === 0 && saved.testIndex === 0) {
        setPhase('welcome')
      } else if (bothNotDone) {
        setPhase('testing')
      } else {
        setPhase('welcome')
      }
    }
  }, [])

  // ── Auto-save progress to localStorage ──
  useEffect(() => {
    if (phase === 'results') return
    if (Object.keys(scores).length === 0) return
    saveProgress('nutrition', scores, sectionIndex, testIndex, {
      activePart,
      partsDone: { alimentaire: alimentaireDone, digestif: digestifDone },
    })
  }, [scores, sectionIndex, testIndex, activePart, alimentaireDone, digestifDone, phase])

  // Active sections depend on which part is being done
  const activeSections = activePart === 'alimentaire' ? alimentaireSections : digestifSections
  const currentSection = activeSections[sectionIndex]
  const currentTest: NutritionTest | undefined = currentSection?.tests[testIndex]

  const flatIndex = useMemo(() => {
    let idx = 0
    for (let s = 0; s < sectionIndex; s++) idx += activeSections[s].tests.length
    return idx + testIndex
  }, [sectionIndex, testIndex, activeSections])

  const partTotalTests = useMemo(() => activeSections.reduce((sum, s) => sum + s.tests.length, 0), [activeSections])

  const handleScore = useCallback((value: number) => {
    if (!currentTest) return
    setScores((prev) => ({ ...prev, [currentTest.id]: value }))
    setTimeout(() => {
      if (testIndex < currentSection.tests.length - 1) {
        setTestIndex(testIndex + 1)
      } else if (sectionIndex < activeSections.length - 1) {
        setSectionIndex(sectionIndex + 1)
        setTestIndex(0)
      } else {
        if (activePart === 'alimentaire') {
          setAlimentaireDone(true)
        } else {
          setDigestifDone(true)
        }
        const otherDone = activePart === 'alimentaire' ? digestifDone : alimentaireDone
        if (otherDone) {
          setPhase('results')
        } else {
          setPhase('welcome')
        }
      }
    }, 300)
  }, [currentTest, testIndex, currentSection, sectionIndex, activeSections, activePart, alimentaireDone, digestifDone])

  const handlePrev = useCallback(() => {
    if (testIndex > 0) {
      setTestIndex(testIndex - 1)
    } else if (sectionIndex > 0) {
      const prevSection = activeSections[sectionIndex - 1]
      setSectionIndex(sectionIndex - 1)
      setTestIndex(prevSection.tests.length - 1)
    } else {
      setPhase('welcome')
    }
  }, [testIndex, sectionIndex, activeSections])

  const handleStartAlimentaire = useCallback(() => {
    setActivePart('alimentaire')
    setSectionIndex(0)
    setTestIndex(0)
    setPhase('testing')
  }, [])

  const handleStartDigestif = useCallback(() => {
    setActivePart('digestif')
    setSectionIndex(0)
    setTestIndex(0)
    setPhase('testing')
  }, [])

  // Compute sub-scores
  const alimentairePctValue = useMemo(() => {
    const total = alimentaireSections.reduce((sum, s) => sum + s.tests.reduce((a, t) => a + (scores[t.id] ?? 0), 0), 0)
    return alimentaireMaxScore > 0 ? Math.round((total / alimentaireMaxScore) * 100) : 0
  }, [scores])

  const digestifPctValue = useMemo(() => {
    const total = digestifSections.reduce((sum, s) => sum + s.tests.reduce((a, t) => a + (scores[t.id] ?? 0), 0), 0)
    return digestifMaxScore > 0 ? Math.round(((digestifMaxScore - total) / digestifMaxScore) * 100) : 0
  }, [scores])

  const partLabel = activePart === 'alimentaire' ? 'Alimentaire' : 'Digestif'

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {phase === 'testing' && (
        <div className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#1a1a1a]/[0.1]">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
            <button
              onClick={handlePrev}
              className="flex items-center gap-1 text-sm text-[#1a1a1a]/50 hover:text-[#1a1a1a] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Retour</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium tracking-wider uppercase text-[#1a1a1a]/30">
                {partLabel}
              </span>
              <span className="text-xs tabular-nums text-[#1a1a1a]/40">{flatIndex + 1}/{partTotalTests}</span>
              <div className="w-24 h-1 bg-[#1a1a1a]/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#2D6A4F] to-[#1B4332] transition-all duration-500"
                  style={{ width: `${Math.round(((flatIndex + 1) / partTotalTests) * 100)}%` }}
                />
              </div>
            </div>
            <Link href="/onboarding/bilans" className="text-xs text-[#1a1a1a]/30 hover:text-[#1a1a1a]/60 transition-colors">Quitter</Link>
          </div>
        </div>
      )}

      <main className="max-w-2xl mx-auto px-4 py-6">
        {phase === 'welcome' && (
          <WelcomeScreen
            onStartAlimentaire={handleStartAlimentaire}
            onStartDigestif={handleStartDigestif}
            alimentaireDone={alimentaireDone}
            digestifDone={digestifDone}
            alimentairePct={alimentaireDone ? alimentairePctValue : null}
            digestifPct={digestifDone ? digestifPctValue : null}
          />
        )}

        {phase === 'testing' && currentTest && (
          <TestCard
            test={currentTest} testIndex={flatIndex} totalTests={partTotalTests}
            sectionTitle={currentSection.title} sectionIcon={currentSection.icon}
            selectedScore={scores[currentTest.id]} onScore={handleScore}
            onPrev={handlePrev}
          />
        )}

        {phase === 'results' && <ResultsScreen scores={scores} />}
      </main>
    </div>
  )
}
