'use client'

import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  allSections,
  totalMaxScore,
  standard2026Criteria,
  type TestSection,
  type MobilityTest,
  type SectionIcon,
} from '@/lib/bilan-mobilite-data'
import { supabase } from '@/lib/supabase'
import { saveProgress, loadProgress, clearProgress } from '@/lib/bilan-progress'

/* ═══════════════════════════════════════════════════════
   SVG ICON COMPONENTS — Premium line icons
   ═══════════════════════════════════════════════════════ */

function FlexibilityIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C12 2 8 6 8 10c0 2.21 1.79 4 4 4s4-1.79 4-4c0-4-4-8-4-8z" />
      <path d="M12 14v8" />
      <path d="M9 18h6" />
    </svg>
  )
}

function MovementIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="4" r="2" />
      <path d="M7 21l3-9" />
      <path d="M17 21l-3-9" />
      <path d="M10 12l-3-3 2-4" />
      <path d="M14 12l3-3-2-4" />
    </svg>
  )
}

function BalanceIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v4" />
      <path d="M12 6l8 4-2 6H6l-2-6 8-4z" />
      <path d="M12 16v6" />
      <path d="M8 22h8" />
    </svg>
  )
}

function CoreIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 8v8" />
      <path d="M8 12h8" />
    </svg>
  )
}

function StrengthIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 6.5l11 11" />
      <path d="M3 10l1-1 3 3" />
      <path d="M14 3l1-1 4 4-1 1" />
      <path d="M21 14l-1 1-3-3" />
      <path d="M10 21l-1 1-4-4 1-1" />
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

function ClipboardIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="M9 14l2 2 4-4" />
    </svg>
  )
}

function TrophyIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4a2 2 0 01-2-2V5a2 2 0 012-2h2" />
      <path d="M18 9h2a2 2 0 002-2V5a2 2 0 00-2-2h-2" />
      <path d="M6 3h12v6a6 6 0 01-12 0V3z" />
      <path d="M12 15v4" />
      <path d="M8 21h8" />
    </svg>
  )
}

function renderSectionIcon(icon: SectionIcon, className = 'w-6 h-6') {
  switch (icon) {
    case 'flexibility': return <FlexibilityIcon className={className} />
    case 'movement':    return <MovementIcon className={className} />
    case 'balance':     return <BalanceIcon className={className} />
    case 'core':        return <CoreIcon className={className} />
    case 'strength':    return <StrengthIcon className={className} />
  }
}

/* ═══════════════════════════════════════════════════════
   SCORE COLOR HELPERS
   ═══════════════════════════════════════════════════════ */
const scoreColors: Record<number, { bg: string; border: string; text: string; ring: string }> = {
  0: { bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-700',    ring: 'ring-red-300' },
  1: { bg: 'bg-amber-50',  border: 'border-amber-200',  text: 'text-amber-700',  ring: 'ring-amber-300' },
  2: { bg: 'bg-sky-50',    border: 'border-sky-200',    text: 'text-sky-700',    ring: 'ring-sky-300' },
  3: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', ring: 'ring-emerald-300' },
}

function getOverallLabel(pct: number) {
  if (pct >= 80) return { label: 'Excellent', color: 'text-emerald-600', bar: 'bg-emerald-500' }
  if (pct >= 60) return { label: 'Bon', color: 'text-sky-600', bar: 'bg-sky-500' }
  if (pct >= 40) return { label: 'Moyen', color: 'text-amber-600', bar: 'bg-amber-500' }
  return { label: 'À travailler', color: 'text-red-600', bar: 'bg-red-500' }
}

/* ═══════════════════════════════════════════════════════
   PROGRESS BAR
   ═══════════════════════════════════════════════════════ */
function ProgressBar({
  current,
  total,
  sectionTitle,
}: {
  current: number
  total: number
  sectionTitle: string
}) {
  const pct = Math.round((current / total) * 100)
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium tracking-widest uppercase text-[#1a1a1a]/50">
          {sectionTitle}
        </span>
        <span className="text-xs tabular-nums text-[#1a1a1a]/40">
          {current}/{total}
        </span>
      </div>
      <div className="h-1 w-full bg-[#1a1a1a]/[0.06] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#2D6A4F] to-[#1B4332] transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   SCORE BUTTON
   ═══════════════════════════════════════════════════════ */
function ScoreButton({
  value,
  label,
  description,
  selected,
  onSelect,
}: {
  value: number
  label: string
  description: string
  selected: boolean
  onSelect: () => void
}) {
  const colors = scoreColors[value] || scoreColors[0]
  return (
    <button
      onClick={onSelect}
      className={`
        group relative w-full text-left rounded-xl border-2 p-4
        transition-all duration-300 ease-out
        ${selected
          ? `${colors.bg} ${colors.border} ring-2 ${colors.ring} shadow-md`
          : 'border-[#1a1a1a]/[0.08] bg-white hover:border-[#1a1a1a]/[0.12] hover:shadow-sm'
        }
      `}
    >
      <div className="flex items-start gap-3">
        {/* Score indicator */}
        <div
          className={`
            flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold
            transition-all duration-300
            ${selected
              ? `${colors.bg} ${colors.text} ${colors.border} border`
              : 'bg-[#1a1a1a]/[0.05] text-[#1a1a1a]/30 border border-[#1a1a1a]/[0.08]'
            }
          `}
        >
          {value}
        </div>
        <div className="flex-1 min-w-0">
          <p
            className={`font-semibold text-sm transition-colors duration-300 ${
              selected ? colors.text : 'text-[#1a1a1a]'
            }`}
          >
            {label}
          </p>
          <p className="text-xs text-[#1a1a1a]/40 mt-0.5 leading-relaxed">{description}</p>
        </div>
        {selected && (
          <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${colors.text}`} />
        )}
      </div>
    </button>
  )
}

/* ═══════════════════════════════════════════════════════
   SECTION INTRO SCREEN
   ═══════════════════════════════════════════════════════ */
function SectionIntro({
  section,
  sectionIndex,
  onStart,
}: {
  section: TestSection
  sectionIndex: number
  onStart: () => void
}) {
  return (
    <div className="animate-fade-in flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      {/* Section number pill */}
      <div className="mb-6 inline-flex items-center gap-2 bg-[#1a1a1a]/[0.05] border border-[#1a1a1a]/[0.08] rounded-full px-4 py-1.5">
        <span className="text-xs font-medium tracking-widest uppercase text-[#1a1a1a]/40">
          Section {sectionIndex + 1} / {allSections.length}
        </span>
      </div>

      {/* Icon */}
      <div className="mb-8 w-20 h-20 rounded-2xl bg-gradient-to-br from-[#2D6A4F]/10 to-[#1B4332]/10 border border-[#2D6A4F]/15 flex items-center justify-center text-[#2D6A4F]">
        {renderSectionIcon(section.icon, 'w-10 h-10')}
      </div>

      {/* Title */}
      <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-2 tracking-tight">
        {section.title}
      </h2>
      <p className="text-[#2D6A4F] font-medium text-sm tracking-wide uppercase mb-6">
        {section.subtitle}
      </p>

      {/* Description */}
      <p className="max-w-md text-[#1a1a1a]/50 leading-relaxed mb-4">
        {section.description}
      </p>

      {/* Test count & score */}
      <div className="flex items-center gap-6 mb-10">
        <div className="text-center">
          <p className="text-2xl font-bold text-[#1a1a1a]">{section.tests.length}</p>
          <p className="text-xs text-[#1a1a1a]/30 uppercase tracking-wider">Tests</p>
        </div>
        <div className="w-px h-8 bg-[#1a1a1a]/[0.06]" />
        <div className="text-center">
          <p className="text-2xl font-bold text-[#1a1a1a]">{section.maxScore}</p>
          <p className="text-xs text-[#1a1a1a]/30 uppercase tracking-wider">Points max</p>
        </div>
      </div>

      <button onClick={onStart} className="btn-secondary">
        Commencer cette section
      </button>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   COUNTDOWN TIMER COMPONENT
   ═══════════════════════════════════════════════════════ */
function CountdownTimer({
  duration,
  running,
  onComplete,
}: {
  duration: number
  running: boolean
  onComplete: () => void
}) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const completedRef = useRef(false)

  useEffect(() => {
    setTimeLeft(duration)
    completedRef.current = false
  }, [duration])

  useEffect(() => {
    if (!running || timeLeft <= 0) return
    const id = setInterval(() => {
      setTimeLeft((prev) => {
        const next = +(prev - 0.1).toFixed(1)
        if (next <= 0 && !completedRef.current) {
          completedRef.current = true
          setTimeout(onComplete, 0)
          return 0
        }
        return Math.max(0, next)
      })
    }, 100)
    return () => clearInterval(id)
  }, [running, timeLeft, onComplete])

  const pct = (timeLeft / duration) * 100
  const secs = Math.ceil(timeLeft)
  const r = 40, circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  const color = timeLeft > 3 ? '#3ECF8E' : '#ef4444'

  return (
    <div className="flex flex-col items-center">
      <svg width="96" height="96" className="-rotate-90">
        <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="4" />
        <circle
          cx="48" cy="48" r={r} fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          className="transition-all duration-100"
        />
      </svg>
      <span className="absolute text-3xl font-bold text-white tabular-nums" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
        {secs}s
      </span>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   INDIVIDUAL TEST CARD
   ═══════════════════════════════════════════════════════ */
function TestCard({
  test,
  testIndex,
  totalTests,
  sectionTitle,
  sectionIcon,
  selectedScore,
  onScore,
  onPrev,
  onNext,
  canGoNext,
}: {
  test: MobilityTest
  testIndex: number
  totalTests: number
  sectionTitle: string
  sectionIcon: SectionIcon
  selectedScore: number | undefined
  onScore: (value: number) => void
  onPrev: () => void
  onNext: () => void
  canGoNext: boolean
}) {
  const hasVideo = Boolean(test.videoUrl)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerDone, setTimerDone] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const timerStartedRef = useRef(false)

  // Reset timer state when test changes
  useEffect(() => {
    setTimerRunning(false)
    setTimerDone(false)
    setVideoReady(false)
    timerStartedRef.current = false
  }, [test.id])

  // Start timer at specific video time
  useEffect(() => {
    if (!hasVideo || !videoRef.current || !test.timerStartAt) return
    const video = videoRef.current
    const handleTimeUpdate = () => {
      if (!timerStartedRef.current && video.currentTime >= test.timerStartAt!) {
        timerStartedRef.current = true
        setTimerRunning(true)
      }
    }
    video.addEventListener('timeupdate', handleTimeUpdate)
    return () => video.removeEventListener('timeupdate', handleTimeUpdate)
  }, [hasVideo, test.timerStartAt, test.id])

  const handleTimerComplete = useCallback(() => {
    setTimerRunning(false)
    setTimerDone(true)
  }, [])

  // ── VIDEO TEST (immersive full-screen style) ──
  if (hasVideo) {
    return (
      <div className="animate-fade-in -mx-4 -mt-6">
        {/* Full-height container */}
        <div className="relative w-full" style={{ minHeight: 'calc(100vh - 56px)' }}>
          {/* Video background — full screen */}
          <video
            ref={videoRef}
            src={test.videoUrl}
            playsInline
            muted
            autoPlay
            loop
            onCanPlay={() => setVideoReady(true)}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ minHeight: 'calc(100vh - 56px)' }}
          />
          {/* Subtle gradient on the right side for the panel */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/70" />
          {/* Top gradient for text readability */}
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 to-transparent" />

          {/* Content overlay */}
          <div className="relative z-10 flex flex-col h-full" style={{ minHeight: 'calc(100vh - 56px)' }}>

            {/* Top bar: progress + instruction */}
            <div className="px-4 pt-4 pb-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium tracking-widest uppercase text-white/50">
                  {sectionTitle}
                </span>
                <span className="text-xs tabular-nums text-white/40">
                  {testIndex + 1}/{totalTests}
                </span>
              </div>
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full rounded-full bg-[#3ECF8E] transition-all duration-700 ease-out"
                  style={{ width: `${Math.round(((testIndex + 1) / totalTests) * 100)}%` }}
                />
              </div>
              {/* Instruction card — visible over video */}
              <div className="bg-black/50 backdrop-blur-sm rounded-xl border border-white/10 p-3 max-w-[70%]">
                <h3 className="text-base font-bold text-white tracking-tight mb-1">
                  {test.name}
                </h3>
                <p className="text-sm text-white/80 leading-relaxed">
                  {test.criteria}
                </p>
                {test.tip && (
                  <p className="text-xs text-[#3ECF8E]/90 mt-1.5 flex items-start gap-1.5">
                    <InfoIcon className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    {test.tip}
                  </p>
                )}
              </div>
            </div>

            {/* Middle: Timer floating on the left */}
            {test.timerDuration && (
              <div className="flex-1 flex items-center px-6">
                <div className="relative flex items-center justify-center">
                  <CountdownTimer
                    duration={test.timerDuration}
                    running={timerRunning}
                    onComplete={handleTimerComplete}
                  />
                  {timerDone && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-[#3ECF8E]" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                        ✓
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Right side panel: compact score options */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-[140px] flex flex-col gap-2">
              {test.scoring.map((option) => {
                const selected = selectedScore === option.value
                const colors = scoreColors[option.value] || scoreColors[0]
                return (
                  <button
                    key={option.value}
                    onClick={() => onScore(option.value)}
                    className={`
                      rounded-xl border p-2.5 transition-all duration-200 text-center
                      ${selected
                        ? `bg-white/95 ${colors.border} shadow-lg scale-105`
                        : 'bg-black/50 backdrop-blur-md border-white/15 hover:bg-black/60 hover:border-white/25'
                      }
                    `}
                  >
                    <div
                      className={`
                        w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold mx-auto mb-1
                        ${selected
                          ? `${colors.bg} ${colors.text} ${colors.border} border`
                          : 'bg-white/10 text-white/60'
                        }
                      `}
                    >
                      {option.value}
                    </div>
                    <p className={`font-semibold text-xs leading-tight ${selected ? colors.text : 'text-white/90'}`}>
                      {option.label}
                    </p>
                  </button>
                )
              })}
            </div>

            {/* Bottom navigation */}
            <div className="flex items-center justify-between px-4 pb-5 pt-2">
              <button
                onClick={onPrev}
                className="flex items-center gap-1 text-sm text-white/40 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Précédent
              </button>
              <button
                onClick={onNext}
                disabled={!canGoNext}
                className={`
                  flex items-center gap-1 px-6 py-2.5 rounded-xl text-sm font-semibold
                  transition-all duration-300
                  ${canGoNext
                    ? 'bg-[#3ECF8E] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5'
                    : 'bg-white/10 text-white/20 cursor-not-allowed'
                  }
                `}
              >
                Suivant
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── REGULAR TEST (existing design) ──
  return (
    <div className="animate-fade-in max-w-lg mx-auto">
      <ProgressBar
        current={testIndex + 1}
        total={totalTests}
        sectionTitle={sectionTitle}
      />

      {/* Test header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-[#2D6A4F]/8 flex items-center justify-center text-[#2D6A4F]">
            {renderSectionIcon(sectionIcon, 'w-4 h-4')}
          </div>
          <span className="text-xs font-medium tracking-widest uppercase text-[#1a1a1a]/30">
            Test {testIndex + 1}
          </span>
        </div>
        <h3 className="text-2xl font-bold text-[#1a1a1a] tracking-tight mb-1">
          {test.name}
        </h3>
        <p className="text-sm text-[#2D6A4F] font-medium">{test.description}</p>
      </div>

      {/* Criteria */}
      <div className="bg-[#1a1a1a]/[0.02] border border-[#1a1a1a]/[0.08] rounded-xl p-4 mb-6">
        <p className="text-sm text-[#1a1a1a]/50 leading-relaxed">{test.criteria}</p>
        {test.tip && (
          <div className="flex items-start gap-2 mt-3 pt-3 border-t border-[#1a1a1a]/[0.08]">
            <InfoIcon className="w-4 h-4 text-[#2D6A4F] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-[#1a1a1a]/40 leading-relaxed">{test.tip}</p>
          </div>
        )}
      </div>

      {/* Score options */}
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

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onPrev}
          className="flex items-center gap-1 text-sm text-[#1a1a1a]/40 hover:text-[#1a1a1a] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Précédent
        </button>
        <button
          onClick={onNext}
          disabled={!canGoNext}
          className={`
            flex items-center gap-1 px-6 py-2.5 rounded-xl text-sm font-semibold
            transition-all duration-300
            ${canGoNext
              ? 'bg-[#2D6A4F] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5'
              : 'bg-[#1a1a1a]/[0.06] text-[#1a1a1a]/20 cursor-not-allowed'
            }
          `}
        >
          Suivant
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   SCORE GAUGE — Circular progress ring
   ═══════════════════════════════════════════════════════ */
function ScoreGauge({
  score,
  maxScore,
  label,
  icon,
  size = 'md',
}: {
  score: number
  maxScore: number
  label: string
  icon: SectionIcon
  size?: 'sm' | 'md'
}) {
  const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0
  const { color, bar } = getOverallLabel(pct)
  const dims = size === 'sm' ? { box: 'w-28 h-28', r: 44, stroke: 5 } : { box: 'w-36 h-36', r: 56, stroke: 6 }
  const circ = 2 * Math.PI * dims.r
  const dashOffset = circ - (pct / 100) * circ

  return (
    <div className="flex flex-col items-center">
      <div className={`relative ${dims.box}`}>
        <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${(dims.r + dims.stroke) * 2} ${(dims.r + dims.stroke) * 2}`}>
          <circle
            cx={dims.r + dims.stroke}
            cy={dims.r + dims.stroke}
            r={dims.r}
            fill="none"
            stroke="#e5e0d8"
            strokeWidth={dims.stroke}
          />
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
   SECTION FEEDBACK — Messages contextuels par section
   ═══════════════════════════════════════════════════════ */
function getSectionFeedback(sectionId: string, pct: number): { title: string; message: string } {
  const level = pct >= 80 ? 'high' : pct >= 50 ? 'mid' : 'low'

  const feedback: Record<string, Record<string, { title: string; message: string }>> = {
    'mobilite-statique': {
      high: { title: 'Très bonne souplesse', message: 'Vos amplitudes articulaires sont excellentes. Vous avez une bonne base pour progresser en force et en contrôle.' },
      mid: { title: 'Souplesse correcte', message: 'Quelques zones méritent un travail ciblé. Des routines de mobilité quotidiennes de 10 minutes feront une vraie différence.' },
      low: { title: 'Mobilité à développer', message: 'Pas d\u2019inquiétude, c\u2019est un point de départ. La mobilité s\u2019améliore vite avec un travail régulier et adapté.' },
    },
    'mobilite-active': {
      high: { title: 'Excellent contrôle actif', message: 'Vous maîtrisez bien vos mouvements dans l\u2019amplitude. C\u2019est un atout majeur pour la prévention des blessures.' },
      mid: { title: 'Contrôle à renforcer', message: 'Vous avez de la mobilité mais le contrôle dans certaines amplitudes peut progresser. Le renforcement ciblé vous y aidera.' },
      low: { title: 'Contrôle à travailler', message: 'Le contrôle actif demande de la pratique. Nous allons construire ça progressivement dans votre programme.' },
    },
    'proprioception': {
      high: { title: 'Équilibre remarquable', message: 'Votre proprioception est solide. C\u2019est un facteur clé de prévention des chutes et de longévité fonctionnelle.' },
      mid: { title: 'Équilibre dans la moyenne', message: 'Quelques exercices simples au quotidien (se brosser les dents sur un pied, par exemple) peuvent faire une grande différence.' },
      low: { title: 'Équilibre à améliorer', message: 'L\u2019équilibre se travaille très bien à tout âge. Nous intégrerons des exercices progressifs dans votre routine.' },
    },
    'gainage': {
      high: { title: 'Tronc très stable', message: 'Votre gainage est excellent. Un tronc solide protège votre dos et améliore tous vos autres mouvements.' },
      mid: { title: 'Stabilité correcte', message: 'Votre tronc a une bonne base. Quelques exercices ciblés permettront de consolider votre stabilité.' },
      low: { title: 'Gainage à renforcer', message: 'Le gainage est fondamental pour protéger votre dos au quotidien. Nous commencerons par des exercices doux et progressifs.' },
    },
    'prepa-physique': {
      high: { title: 'Très bonne condition', message: 'Votre force et votre endurance sont au-dessus de la moyenne. Vous êtes prêt(e) pour un programme ambitieux.' },
      mid: { title: 'Condition physique correcte', message: 'Vous avez une base solide. Avec un programme adapté, vous pouvez progresser rapidement.' },
      low: { title: 'Condition à développer', message: 'Chaque petit progrès compte. Votre programme sera adapté à votre niveau actuel pour avancer en toute sécurité.' },
    },
  }

  return feedback[sectionId]?.[level] ?? { title: level === 'high' ? 'Très bien' : level === 'mid' ? 'Correct' : 'À travailler', message: '' }
}

/* ═══════════════════════════════════════════════════════
   SECTION RESULTS SCREEN — Bilan intermédiaire
   ═══════════════════════════════════════════════════════ */
function SectionResultsScreen({
  section,
  sectionIndex,
  scores,
  onContinue,
}: {
  section: TestSection
  sectionIndex: number
  scores: Record<string, number>
  onContinue: () => void
}) {
  const sectionScore = section.tests.reduce((sum, t) => sum + (scores[t.id] ?? 0), 0)
  const pct = Math.round((sectionScore / section.maxScore) * 100)
  const info = getOverallLabel(pct)
  const feedback = getSectionFeedback(section.id, pct)
  const isLast = sectionIndex === allSections.length - 1

  return (
    <div className="animate-fade-in flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      {/* Decorative line */}
      <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#2D6A4F] to-transparent mb-8" />

      {/* Section pill */}
      <div className="mb-6 inline-flex items-center gap-2 bg-[#1a1a1a]/[0.05] border border-[#1a1a1a]/[0.08] rounded-full px-4 py-1.5">
        <span className="text-xs font-medium tracking-widest uppercase text-[#1a1a1a]/40">
          Section {sectionIndex + 1} terminée
        </span>
      </div>

      {/* Gauge */}
      <ScoreGauge
        score={sectionScore}
        maxScore={section.maxScore}
        label={section.title}
        icon={section.icon}
        size="md"
      />

      {/* Feedback */}
      <div className="mt-8 max-w-sm">
        <h3 className={`text-xl font-bold mb-2 ${info.color}`}>
          {feedback.title}
        </h3>
        <p className="text-sm text-[#1a1a1a]/50 leading-relaxed">
          {feedback.message}
        </p>
      </div>

      {/* Test breakdown */}
      <div className="w-full max-w-sm mt-8 space-y-1.5">
        {section.tests.map((test) => {
          const s = scores[test.id] ?? 0
          const maxTestScore = Math.max(...test.scoring.map(o => o.value))
          const testColors = scoreColors[s] || scoreColors[0]
          return (
            <div
              key={test.id}
              className="flex items-center justify-between bg-white border border-[#1a1a1a]/[0.08] rounded-lg px-3 py-2"
            >
              <span className="text-xs text-[#1a1a1a]/50 truncate mr-2">{test.name}</span>
              <span className={`text-xs font-bold tabular-nums ${testColors.text}`}>
                {s}/{maxTestScore}
              </span>
            </div>
          )
        })}
      </div>

      {/* CTA */}
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
   STANDARD 2026 CHECKER
   ═══════════════════════════════════════════════════════ */
function checkStandard2026(scores: Record<string, number>): { passed: boolean; checks: { label: string; met: boolean }[] } {
  const sectionScore = (sectionId: string) => {
    const section = allSections.find(s => s.id === sectionId)
    if (!section) return { score: 0, max: 0 }
    const score = section.tests.reduce((sum, t) => sum + (scores[t.id] ?? 0), 0)
    return { score, max: section.maxScore }
  }

  const mobPassive = sectionScore('mobilite-statique')
  const mobActive = sectionScore('mobilite-active')
  const proprio = sectionScore('proprioception')

  const checks = [
    { label: standard2026Criteria.mobilitePassive, met: mobPassive.max > 0 && (mobPassive.score / mobPassive.max) >= 0.7 },
    { label: standard2026Criteria.mobiliteActive, met: mobActive.max > 0 && (mobActive.score / mobActive.max) >= 0.7 },
    { label: standard2026Criteria.proprioception, met: proprio.max > 0 && (proprio.score / proprio.max) >= 0.7 },
    { label: standard2026Criteria.birdDog, met: (scores['gain-1'] ?? 0) >= 2 },
    { label: standard2026Criteria.planche, met: (scores['gain-3'] ?? 0) >= 2 },
    { label: standard2026Criteria.sidePlank, met: (scores['gain-4'] ?? 0) >= 2 },
    { label: standard2026Criteria.sitToStand, met: (scores['prep-1'] ?? 0) >= 2 },
    { label: standard2026Criteria.tug, met: (scores['prep-4'] ?? 0) >= 2 },
    { label: standard2026Criteria.chairStand, met: (scores['prep-2'] ?? 0) >= 2 },
    { label: standard2026Criteria.pushUps, met: (scores['prep-6'] ?? 0) >= 2 },
  ]

  return { passed: checks.every(c => c.met), checks }
}

/* ═══════════════════════════════════════════════════════
   WELCOME SCREEN
   ═══════════════════════════════════════════════════════ */
function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="animate-fade-in flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      {/* Decorative top line */}
      <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#2D6A4F] to-transparent mb-10" />

      <div className="mb-8 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2D6A4F]/10 to-[#1B4332]/10 border border-[#2D6A4F]/15 flex items-center justify-center text-[#2D6A4F]">
        <ClipboardIcon className="w-8 h-8" />
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-3 tracking-tight">
        Bilan de Mobilité
      </h1>
      <h2 className="text-sm font-medium tracking-widest uppercase text-[#2D6A4F] mb-8">
        Condition physique
      </h2>

      <p className="max-w-md text-[#1a1a1a]/50 leading-relaxed mb-10">
        Ce bilan évalue votre mobilité, votre équilibre et votre condition physique
        à travers 43 tests répartis en 5 sections. Il dure environ 30 minutes et
        constitue la base de votre programme personnalisé.
      </p>

      {/* Section preview */}
      <div className="w-full max-w-sm space-y-3 mb-10">
        {allSections.map((section, i) => (
          <div
            key={section.id}
            className="flex items-center gap-4 bg-white border border-[#1a1a1a]/[0.08] rounded-xl px-4 py-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2D6A4F]/8 to-[#1B4332]/8 border border-[#2D6A4F]/10 flex items-center justify-center text-[#2D6A4F]/70">
              {renderSectionIcon(section.icon, 'w-5 h-5')}
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-[#1a1a1a]">{section.title}</p>
              <p className="text-xs text-[#1a1a1a]/30">{section.tests.length} tests</p>
            </div>
            <span className="text-xs tabular-nums text-[#1a1a1a]/20">{section.maxScore} pts</span>
          </div>
        ))}
      </div>

      <button onClick={onStart} className="btn-secondary">
        Commencer le bilan
      </button>

      <p className="mt-6 text-xs text-[#1a1a1a]/20 max-w-xs leading-relaxed">
        Vous pourrez mettre en pause et reprendre à tout moment.
        Aucun matériel particulier n&apos;est requis.
      </p>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   RESULTS SCREEN
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
  const standard = checkStandard2026(scores)

  // ── Auto-save to Supabase ──
  useEffect(() => {
    if (hasSaved.current) return
    hasSaved.current = true
    async function saveResults() {
      try {
        const session = await supabase?.auth.getSession()
        const token = session?.data?.session?.access_token
        if (!token) { console.warn('[bilan-save] No auth session'); return }
        setSaveStatus('saving')
        const payload = {
          bilanType: 'mobilite',
          scores,
          globalScore: totalPct,
          globalPoints: totalScore,
          maxPoints: totalMaxScore,
          subScores: Object.fromEntries(sectionResults.map(r => [r.section.id, { score: r.score, max: r.section.maxScore, pct: Math.round((r.score / r.section.maxScore) * 100) }])),
          sectionResults: sectionResults.map(r => ({ sectionId: r.section.id, title: r.section.title, score: r.score, maxScore: r.section.maxScore, pct: Math.round((r.score / r.section.maxScore) * 100) })),
        }
        const res = await fetch('/api/bilan/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        })
        if (res.ok) { setSaveStatus('saved'); clearProgress('mobilite') }
        else { setSaveStatus('error') }
      } catch (e) { console.error('[bilan-save] Failed:', e); setSaveStatus('error') }
    }
    saveResults()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="animate-fade-in max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#2D6A4F] to-transparent mx-auto mb-8" />
        <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] tracking-tight mb-2">
          Vos résultats
        </h2>
        <p className="text-sm text-[#1a1a1a]/40">Bilan de mobilité et condition physique</p>
        {saveStatus === 'saving' && <p className="text-xs text-[#3ECF8E]/60 mt-2 animate-pulse">Sauvegarde en cours...</p>}
        {saveStatus === 'saved' && <p className="text-xs text-emerald-500 mt-2">Résultats sauvegardés</p>}
        {saveStatus === 'error' && <p className="text-xs text-red-400 mt-2">Sauvegarde échouée</p>}
      </div>

      {/* Global score */}
      <div className="bg-white backdrop-blur-sm border border-[#1a1a1a]/[0.08] rounded-2xl p-8 mb-8 text-center">
        <p className="text-xs font-medium tracking-widest uppercase text-[#1a1a1a]/30 mb-4">
          Score global
        </p>
        <div className="flex items-center justify-center gap-1 mb-2">
          <span className={`text-6xl font-bold ${overall.color}`}>{totalPct}</span>
          <span className="text-2xl text-[#1a1a1a]/20 font-light">%</span>
        </div>
        <p className="text-sm text-[#1a1a1a]/40 mb-3">
          {totalScore} / {totalMaxScore} points
        </p>
        <span className={`inline-block px-4 py-1 rounded-full text-xs font-semibold tracking-wide ${overall.color} bg-[#1a1a1a]/[0.05]`}>
          {overall.label}
        </span>
      </div>

      {/* Section gauges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 mb-10">
        {sectionResults.map(({ section, score }) => (
          <ScoreGauge
            key={section.id}
            score={score}
            maxScore={section.maxScore}
            label={section.title.split(' ').slice(-1)[0]}
            icon={section.icon}
            size="sm"
          />
        ))}
      </div>

      {/* Per-section detail */}
      <div className="space-y-4 mb-10">
        {sectionResults.map(({ section, score }) => {
          const pct = Math.round((score / section.maxScore) * 100)
          const info = getOverallLabel(pct)
          return (
            <div
              key={section.id}
              className="bg-white border border-[#1a1a1a]/[0.08] rounded-xl px-5 py-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#2D6A4F]/10 flex items-center justify-center text-[#2D6A4F]/70">
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
                <div
                  className={`h-full rounded-full ${info.bar} transition-all duration-700`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* STANDARD 2026 */}
      <div className="bg-white backdrop-blur-sm border border-[#1a1a1a]/[0.08] rounded-2xl p-6 mb-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2D6A4F]/20 to-[#1B4332]/10 border border-[#2D6A4F]/20 flex items-center justify-center text-[#2D6A4F]">
            <TrophyIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#1a1a1a]">STANDARD 2026</h3>
            <p className="text-xs text-[#1a1a1a]/30">Critères d&apos;éligibilité</p>
          </div>
          <span
            className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold ${
              standard.passed
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
          >
            {standard.passed ? 'Validé' : 'En cours'}
          </span>
        </div>

        <div className="space-y-2">
          {standard.checks.map((check, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs ${
                check.met ? 'bg-emerald-50/50' : 'bg-red-50/50'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                  check.met
                    ? 'bg-emerald-100 text-emerald-600'
                    : 'bg-red-100 text-red-500'
                }`}
              >
                {check.met ? (
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                )}
              </div>
              <span className={`${check.met ? 'text-[#1a1a1a]/50' : 'text-[#1a1a1a]/70 font-medium'}`}>
                {check.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
        <Link
          href="/"
          className="btn-primary text-center inline-block"
        >
          Retour à l&apos;accueil
        </Link>
      </div>

      <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#2D6A4F] to-transparent mx-auto mt-12" />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   MAIN ORCHESTRATOR
   ═══════════════════════════════════════════════════════ */
type Phase = 'welcome' | 'section-intro' | 'testing' | 'section-results' | 'results'

export default function BilanMobilitePage() {
  const [phase, setPhase] = useState<Phase>('welcome')
  const [sectionIndex, setSectionIndex] = useState(0)
  const [testIndex, setTestIndex] = useState(0)
  const [scores, setScores] = useState<Record<string, number>>({})
  const hasRestored = useRef(false)

  // ── Restore progress from localStorage ──
  useEffect(() => {
    if (hasRestored.current) return
    hasRestored.current = true
    const saved = loadProgress('mobilite')
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
    saveProgress('mobilite', scores, sectionIndex, testIndex)
  }, [scores, sectionIndex, testIndex, phase])

  const currentSection = allSections[sectionIndex]
  const currentTest: MobilityTest | undefined = currentSection?.tests[testIndex]

  // Flat index for global progress
  const flatIndex = useMemo(() => {
    let idx = 0
    for (let s = 0; s < sectionIndex; s++) idx += allSections[s].tests.length
    return idx + testIndex
  }, [sectionIndex, testIndex])

  const totalTests = useMemo(
    () => allSections.reduce((sum, s) => sum + s.tests.length, 0),
    []
  )

  const handleScore = useCallback(
    (value: number) => {
      if (!currentTest) return
      setScores((prev) => ({ ...prev, [currentTest.id]: value }))
    },
    [currentTest]
  )

  const handleNext = useCallback(() => {
    if (!currentTest) return
    if (scores[currentTest.id] === undefined) return

    if (testIndex < currentSection.tests.length - 1) {
      setTestIndex(testIndex + 1)
    } else {
      // Dernier test de la section → afficher le bilan intermédiaire
      setPhase('section-results')
    }
  }, [currentTest, scores, testIndex, currentSection, sectionIndex])

  const handlePrev = useCallback(() => {
    if (testIndex > 0) {
      setTestIndex(testIndex - 1)
    } else if (sectionIndex > 0) {
      const prevSection = allSections[sectionIndex - 1]
      setSectionIndex(sectionIndex - 1)
      setTestIndex(prevSection.tests.length - 1)
      setPhase('testing')
    } else {
      setPhase('welcome')
    }
  }, [testIndex, sectionIndex])

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Top bar */}
      {phase !== 'welcome' && phase !== 'results' && phase !== 'section-results' && (
        <div className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#1a1a1a]/[0.08]">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => {
                if (phase === 'section-intro' && sectionIndex === 0) setPhase('welcome')
                else if (phase === 'section-intro') {
                  const prev = allSections[sectionIndex - 1]
                  setSectionIndex(sectionIndex - 1)
                  setTestIndex(prev.tests.length - 1)
                  setPhase('testing')
                } else handlePrev()
              }}
              className="flex items-center gap-1 text-sm text-[#1a1a1a]/40 hover:text-[#1a1a1a] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Retour</span>
            </button>

            {/* Global progress */}
            <div className="flex items-center gap-2">
              <span className="text-xs tabular-nums text-[#1a1a1a]/30">
                {flatIndex + (phase === 'testing' ? 1 : 0)}/{totalTests}
              </span>
              <div className="w-24 h-1 bg-[#1a1a1a]/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#2D6A4F] to-[#1B4332] transition-all duration-500"
                  style={{
                    width: `${Math.round(
                      ((flatIndex + (phase === 'testing' ? 1 : 0)) / totalTests) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>

            <Link href="/" className="text-xs text-[#1a1a1a]/20 hover:text-[#1a1a1a]/40 transition-colors">
              Quitter
            </Link>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {phase === 'welcome' && <WelcomeScreen onStart={() => setPhase('section-intro')} />}

        {phase === 'section-intro' && currentSection && (
          <SectionIntro
            section={currentSection}
            sectionIndex={sectionIndex}
            onStart={() => setPhase('testing')}
          />
        )}

        {phase === 'testing' && currentTest && (
          <TestCard
            test={currentTest}
            testIndex={testIndex}
            totalTests={currentSection.tests.length}
            sectionTitle={currentSection.title}
            sectionIcon={currentSection.icon}
            selectedScore={scores[currentTest.id]}
            onScore={handleScore}
            onPrev={handlePrev}
            onNext={handleNext}
            canGoNext={scores[currentTest.id] !== undefined}
          />
        )}

        {phase === 'section-results' && currentSection && (
          <SectionResultsScreen
            section={currentSection}
            sectionIndex={sectionIndex}
            scores={scores}
            onContinue={() => {
              if (sectionIndex < allSections.length - 1) {
                setSectionIndex(sectionIndex + 1)
                setTestIndex(0)
                setPhase('section-intro')
              } else {
                setPhase('results')
              }
            }}
          />
        )}

        {phase === 'results' && <ResultsScreen scores={scores} />}
      </main>
    </div>
  )
}
