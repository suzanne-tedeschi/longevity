      
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
  type NutritionTest,
  type SectionIcon,
} from '@/lib/bilan-nutrition-data'
import {
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
function getPersonalizedHeadline(pct: number) {
  if (pct >= 85) return { title: 'Votre santé nutritionnelle est excellente', subtitle: 'Vos habitudes alimentaires et votre confort digestif sont remarquables. Continuez sur cette voie.', heroGradient: 'from-emerald-50 to-teal-50', scoreBg: 'bg-emerald-400' }
  if (pct >= 70) return { title: 'De bonnes bases nutritionnelles', subtitle: 'Votre alimentation est globalement saine, avec quelques points à affiner pour optimiser votre santé.', heroGradient: 'from-sky-50 to-emerald-50', scoreBg: 'bg-sky-400' }
  if (pct >= 55) return { title: 'Des axes d\'amélioration identifiés', subtitle: 'Votre bilan révèle des habitudes à revoir. Des ajustements ciblés peuvent transformer votre santé digestive et alimentaire.', heroGradient: 'from-amber-50 to-yellow-50', scoreBg: 'bg-amber-400' }
  if (pct >= 40) return { title: 'Votre nutrition mérite attention', subtitle: 'Des déséquilibres alimentaires et/ou digestifs sont présents. Agir maintenant protège votre santé à long terme.', heroGradient: 'from-orange-50 to-amber-50', scoreBg: 'bg-orange-400' }
  return { title: 'Votre santé nutritionnelle nécessite une prise en charge', subtitle: 'Des problèmes significatifs ont été identifiés. Un accompagnement professionnel est recommandé.', heroGradient: 'from-red-50 to-orange-50', scoreBg: 'bg-red-400' }
}

function ResultsScreen({ scores, onRestart }: { scores: Record<string, number>; onRestart?: () => void }) {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [expandedInsights, setExpandedInsights] = useState<Set<string>>(new Set())
  const hasSaved = useRef(false)

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

  // Global score — equal weight between digestif (inverted) and alimentaire sub-scores
  const globalTotal = (digestifMaxScore - digestifTotal) + alimentaireTotal
  const globalPct = Math.round((digestifPct + alimentairePct) / 2)
  // All section results for report
  const allResults = [...digestifResults, ...alimentaireResults].map(({ section, score }) => {
    const isDigestif = digestifSections.some(s => s.id === section.id)
    const pct = isDigestif
      ? Math.round(((section.maxScore - score) / section.maxScore) * 100)
      : Math.round((score / section.maxScore) * 100)
    return { sectionId: section.id, pct, score, maxScore: section.maxScore, title: section.title, subtitle: section.subtitle, icon: section.icon, isDigestif }
  })

  const report = useMemo(() => generateFullReport(
    allResults.map(r => ({ sectionId: r.sectionId, pct: r.pct, score: r.score, maxScore: r.maxScore, title: r.title ?? '' })),
    scores
  ), [allResults, scores])

  const hero = getPersonalizedHeadline(globalPct)

  // ── Weakness splits (alimentaire first, digestif subordinate) ──
  const digestifIds = new Set(digestifSections.map(s => s.id))
  const alimentaireWeaknesses = report.weaknesses.filter(w => !digestifIds.has(w.sectionId))
  const digestifWeaknesses = report.weaknesses.filter(w => digestifIds.has(w.sectionId) && w.pct < 50)
  const alimentaireStrengths = report.strengths.filter(s => !digestifIds.has(s.sectionId)).slice(0, 3)

  const toggleInsights = (sectionId: string) =>
    setExpandedInsights(prev => {
      const next = new Set(prev)
      if (next.has(sectionId)) next.delete(sectionId)
      else next.add(sectionId)
      return next
    })

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

      const fullReport = generateFullReport(allResults.map(r => ({ ...r, title: r.title ?? '' })), scores)

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

  const r = 52
  const circ = 2 * Math.PI * r
  const dashOffset = circ - (globalPct / 100) * circ
  const scoreColor = '#3b82f6'

  return (
    <div className="animate-fade-in max-w-2xl mx-auto px-4 py-8">

      {/* ── Hero card ── */}
      <div className={`relative bg-gradient-to-br ${hero.heroGradient} border border-[#1a1a1a]/[0.07] rounded-3xl px-6 py-8 mb-8 overflow-hidden`}>
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/40 blur-3xl pointer-events-none" />
        <div className="relative flex items-center gap-6">
          {/* Circular score */}
          <div className="flex-shrink-0 relative w-28 h-28">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r={r} fill="none" stroke="#e5e0d8" strokeWidth="8" />
              <circle cx="60" cy="60" r={r} fill="none" stroke={scoreColor} strokeWidth="8"
                strokeDasharray={circ} strokeDashoffset={dashOffset} strokeLinecap="round"
                className="transition-all duration-1000 ease-out" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold leading-none" style={{ color: scoreColor }}>{globalPct}</span>
              <span className="text-[10px] text-[#1a1a1a]/30 mt-0.5">/ 100</span>
            </div>
          </div>
          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-400" />
              <span className="text-xs font-semibold tracking-widest uppercase text-[#1a1a1a]/40">Bilan Nutrition</span>
            </div>
            <h2 className="text-xl font-bold text-[#1a1a1a] leading-snug mb-2">{hero.title}</h2>
            <p className="text-xs text-[#1a1a1a]/50 leading-relaxed mb-2">{hero.subtitle}</p>
            <p className="text-xs text-[#2D6A4F] font-medium leading-relaxed">Lisez chaque recommandation et essayez d&apos;en intégrer une à la fois. On revient vers vous sur WhatsApp pour suivre vos progrès et répondre à vos questions.</p>
          </div>
        </div>
        {/* Save status */}
        <div className="relative mt-4 flex items-center justify-end gap-2 min-h-[16px]">
          {saveStatus === 'saving' && <p className="text-[10px] text-[#1a1a1a]/30 animate-pulse">Sauvegarde en cours...</p>}
          {saveStatus === 'saved' && (
            <div className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-emerald-500" />
              <p className="text-[10px] text-emerald-600">Résultats sauvegardés</p>
            </div>
          )}
          {saveStatus === 'error' && (
            <button onClick={doSave} className="text-[10px] text-red-400 underline">Sauvegarde échouée, réessayer</button>
          )}
        </div>
      </div>

      {/* ── Two sub-scores ── */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="bg-white border border-[#1a1a1a]/[0.07] rounded-xl px-4 py-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-lg bg-[#2D6A4F]/10 flex items-center justify-center text-[#2D6A4F]/70 flex-shrink-0">
              <StomachIcon className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs font-semibold text-[#1a1a1a]">Digestif</p>
          </div>
          <p className="text-2xl font-bold text-blue-500">{digestifPct}%</p>
          <div className="h-1 bg-[#1a1a1a]/[0.05] rounded-full mt-1.5 overflow-hidden">
            <div className="h-full rounded-full bg-blue-400 transition-all duration-700" style={{ width: `${digestifPct}%` }} />
          </div>
        </div>
        <div className="bg-white border border-[#1a1a1a]/[0.07] rounded-xl px-4 py-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-lg bg-[#c9a96e]/10 flex items-center justify-center text-[#c9a96e]/70 flex-shrink-0">
              <UtensilsIcon className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs font-semibold text-[#1a1a1a]">Alimentaire</p>
          </div>
          <p className="text-2xl font-bold text-blue-500">{alimentairePct}%</p>
          <div className="h-1 bg-[#1a1a1a]/[0.05] rounded-full mt-1.5 overflow-hidden">
            <div className="h-full rounded-full bg-blue-400 transition-all duration-700" style={{ width: `${alimentairePct}%` }} />
          </div>
        </div>
      </div>

      {/* ── Strengths ── */}
      {alimentaireStrengths.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h3 className="text-sm font-bold text-[#1a1a1a]">Ce qui va bien</h3>
          </div>
          <div className="space-y-3">
            {alimentaireStrengths.map((s) => (
              <div key={s.sectionId} className="relative pl-4 border-l-2 border-emerald-300">
                <p className="text-sm font-semibold text-[#1a1a1a] mb-0.5">{s.title}</p>
                <p className="text-xs text-[#1a1a1a]/55 leading-relaxed">{s.scienceNote}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Weaknesses ── */}
      {report.weaknesses.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
              <InfoIcon className="w-3 h-3 text-amber-600" />
            </div>
            <h3 className="text-sm font-bold text-[#1a1a1a]">Ce qu&apos;on peut améliorer</h3>
          </div>

          {/* Alimentaire weaknesses — primary */}
          <div className="space-y-4">
            {alimentaireWeaknesses.map((w) => {
              const wInfo = getOverallLabel(w.pct)
              const result = allResults.find(r => r.sectionId === w.sectionId)
              const isExpanded = expandedInsights.has(w.sectionId)
              return (
                <div key={w.sectionId} className="bg-white border border-[#1a1a1a]/[0.08] rounded-2xl overflow-hidden">
                  <div className="px-5 py-4 flex items-start gap-3">
                    <div className={`mt-0.5 flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${
                      w.pct < 40 ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'
                    }`}>
                      {result ? renderSectionIcon(result.icon, 'w-4 h-4') : <UtensilsIcon className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="mb-1">
                        <p className="text-sm font-bold text-[#1a1a1a]">{w.title}</p>
                      </div>
                      <p className="text-xs text-[#1a1a1a]/50 leading-relaxed mb-2">{w.concern}</p>
                      {w.triggeredInsights.length > 0 && (
                        <button
                          onClick={() => toggleInsights(w.sectionId)}
                          className="flex items-center gap-1 text-[10px] text-[#2D6A4F] font-semibold"
                        >
                          {isExpanded ? 'Masquer' : `Voir ${w.triggeredInsights.length} recommandation${w.triggeredInsights.length > 1 ? 's' : ''}`}
                          <ChevronRight className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                        </button>
                      )}
                    </div>
                  </div>
                  {isExpanded && w.triggeredInsights.length > 0 && (
                    <div className="divide-y divide-[#1a1a1a]/[0.05] border-t border-[#1a1a1a]/[0.06]">
                      {w.triggeredInsights.map((ins, i) => (
                        <div key={i} className="px-5 py-4">
                          <div className="flex items-start gap-2.5 mb-3">
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-[10px] font-bold text-amber-600 mt-0.5">{i + 1}</span>
                            <p className="text-xs text-[#1a1a1a]/60 leading-relaxed italic">{ins.insight}</p>
                          </div>
                          <div className="ml-7 bg-[#2D6A4F]/[0.05] border border-[#2D6A4F]/[0.15] rounded-xl px-4 py-3">
                            <p className="text-[10px] font-semibold text-[#2D6A4F] uppercase tracking-wider mb-1">Recommandation</p>
                            <p className="text-xs text-[#1a1a1a]/70 leading-relaxed">{ins.recommendation}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Digestif weaknesses — subordinate, linked to nutrition */}
          {digestifWeaknesses.length > 0 && (
            <div className="mt-4">
              {alimentaireWeaknesses.length > 0 && (
                <p className="text-[10px] text-[#1a1a1a]/35 italic mb-3 px-1">
                  Ces inconforts digestifs sont souvent liés à votre alimentation :
                </p>
              )}
              <div className="space-y-3">
                {digestifWeaknesses.map((w) => {
                  const wInfo = getOverallLabel(w.pct)
                  const result = allResults.find(r => r.sectionId === w.sectionId)
                  const isExpanded = expandedInsights.has(w.sectionId)
                  return (
                    <div key={w.sectionId} className="bg-[#1a1a1a]/[0.02] border border-[#1a1a1a]/[0.06] rounded-2xl overflow-hidden">
                      <div className="px-4 py-3 flex items-start gap-3">
                        <div className={`mt-0.5 flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${
                          w.pct < 40 ? 'bg-red-50 text-red-400' : 'bg-amber-50 text-amber-400'
                        }`}>
                          {result ? renderSectionIcon(result.icon, 'w-3.5 h-3.5') : <StomachIcon className="w-3.5 h-3.5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="mb-0.5">
                            <p className="text-xs font-semibold text-[#1a1a1a]/70">{w.title}</p>
                          </div>
                          <p className="text-[10px] text-[#1a1a1a]/40 leading-relaxed mb-1.5">{w.concern}</p>
                          {w.triggeredInsights.length > 0 && (
                            <button
                              onClick={() => toggleInsights(w.sectionId)}
                              className="flex items-center gap-1 text-[10px] text-[#2D6A4F]/70 font-semibold"
                            >
                              {isExpanded ? 'Masquer' : `Voir ${w.triggeredInsights.length} recommandation${w.triggeredInsights.length > 1 ? 's' : ''}`}
                              <ChevronRight className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                            </button>
                          )}
                        </div>
                      </div>
                      {isExpanded && w.triggeredInsights.length > 0 && (
                        <div className="divide-y divide-[#1a1a1a]/[0.05] border-t border-[#1a1a1a]/[0.05]">
                          {w.triggeredInsights.map((ins, i) => (
                            <div key={i} className="px-4 py-3">
                              <div className="flex items-start gap-2 mb-2">
                                <span className="flex-shrink-0 w-4 h-4 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-[9px] font-bold text-amber-600 mt-0.5">{i + 1}</span>
                                <p className="text-[10px] text-[#1a1a1a]/55 leading-relaxed italic">{ins.insight}</p>
                              </div>
                              <div className="ml-6 bg-[#2D6A4F]/[0.04] border border-[#2D6A4F]/[0.12] rounded-xl px-3 py-2.5">
                                <p className="text-[10px] font-semibold text-[#2D6A4F] uppercase tracking-wider mb-1">Recommandation</p>
                                <p className="text-[10px] text-[#1a1a1a]/65 leading-relaxed">{ins.recommendation}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Action plan (phase 1 only) ── */}
      {report.actionPlan.length > 0 && (() => {
        const phase1 = report.actionPlan.find(p => p.phase === 1)
        if (!phase1) return null
        return (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-5 rounded-full bg-[#2D6A4F]/15 flex items-center justify-center flex-shrink-0">
                <ChevronRight className="w-3 h-3 text-[#2D6A4F]" />
              </div>
              <h3 className="text-sm font-bold text-[#1a1a1a]">Votre plan d&apos;action</h3>
              <span className="text-[10px] text-[#1a1a1a]/30 ml-auto">{phase1.timeframe}</span>
            </div>
            <div className="space-y-3">
              {phase1.actions.slice(0, 5).map((action, i) => (
                <div key={i} className="bg-white border border-[#1a1a1a]/[0.08] rounded-2xl overflow-hidden">
                  <div className="flex gap-4 px-5 py-5">
                    <div className="flex-shrink-0 pt-0.5">
                      <div className="w-8 h-8 rounded-full bg-[#2D6A4F] flex items-center justify-center text-white text-sm font-bold leading-none">
                        {i + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#1a1a1a] leading-snug mb-3">{action.action}</p>
                      <div className="bg-[#1a1a1a]/[0.03] border border-[#1a1a1a]/[0.06] rounded-xl px-3 py-2.5">
                        <p className="text-[10px] font-semibold text-[#1a1a1a]/35 uppercase tracking-wider mb-1">Pourquoi</p>
                        <p className="text-xs text-[#1a1a1a]/55 leading-relaxed">{action.why}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })()}

      {/* ── Science cards ── */}
      {globalKeyInsights.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 rounded-full bg-[#1a1a1a]/[0.06] flex items-center justify-center flex-shrink-0">
              <SparklesIcon className="w-2.5 h-2.5 text-[#1a1a1a]/40" />
            </div>
            <h3 className="text-sm font-bold text-[#1a1a1a]">Ce que dit la science</h3>
          </div>
          <div className="grid gap-3">
            {globalKeyInsights.map((ins, i) => (
              <div key={i} className="relative bg-[#1a1a1a]/[0.02] border border-[#1a1a1a]/[0.06] rounded-2xl px-5 py-4 overflow-hidden">
                <div className="absolute top-3 right-4 text-5xl font-serif text-[#1a1a1a]/[0.04] leading-none select-none">&ldquo;</div>
                <p className="text-xs font-bold text-[#1a1a1a] mb-1.5">{ins.title}</p>
                <p className="text-xs text-[#1a1a1a]/55 leading-relaxed mb-3">{ins.description}</p>
                <p className="text-[10px] text-[#1a1a1a]/25 font-medium">{ins.reference}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Disclaimer ── */}
      <div className="mb-6">
        <p className="text-[10px] text-[#1a1a1a]/35 text-center leading-relaxed">
          Ce rapport est fourni à titre informatif et ne se substitue pas à un avis médical professionnel.
        </p>
      </div>

      {/* ── CTA ── */}
      <div className="flex flex-col items-center gap-3 pt-2">
        {onRestart && (
          <button
            onClick={onRestart}
            className="w-full max-w-xs px-10 py-3 text-sm rounded-full border border-[#1a1a1a]/10 text-[#1a1a1a]/40 hover:text-[#1a1a1a]/60 transition-colors"
          >
            Recommencer
          </button>
        )}
        <Link href="/onboarding/bilans" className="btn-primary text-center inline-block px-10 py-4 text-base w-full max-w-xs">
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

  const handleRestart = useCallback(() => {
    clearProgress('nutrition')
    setScores({})
    setSectionIndex(0)
    setTestIndex(0)
    setActivePart('alimentaire')
    setAlimentaireDone(false)
    setDigestifDone(false)
    setPhase('welcome')
  }, [])

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
        // Part finished
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
currentSection && 
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

        {phase === 'results' && <ResultsScreen scores={scores} onRestart={handleRestart} />}
      </main>
    </div>
  )
}
