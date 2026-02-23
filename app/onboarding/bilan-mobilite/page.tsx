'use client'

import { useState, useCallback, useMemo } from 'react'
import { allSections, TestSection, MobilityTest, standard2026Criteria } from '@/lib/bilan-mobilite-data'

// ─── Types ───
type Scores = Record<string, number>
type Phase = 'welcome' | 'testing' | 'results'

// ─── Welcome Screen ───
function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-beige-50">
      <div className="max-w-2xl w-full text-center animate-fade-in">
        {/* Logo */}
        <div className="mb-8">
          <span className="text-3xl font-bold">
            <span className="text-navy-dark">En</span>
            <span className="gradient-text">Train</span>
          </span>
        </div>

        {/* Hero */}
        <div className="text-7xl mb-6">🏃‍♂️</div>
        <h1 className="text-4xl md:text-5xl font-bold text-navy-dark mb-4 leading-tight">
          Bilan de <span className="gradient-text">Mobilité</span>
        </h1>
        <p className="text-lg text-navy mb-8 max-w-lg mx-auto leading-relaxed">
          Évaluez votre condition physique en <strong>5 catégories</strong> grâce à des tests simples réalisables chez vous.
          Ce bilan prend environ <strong>30-45 minutes</strong>.
        </p>

        {/* What you'll test */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-10">
          {allSections.map((section) => (
            <div
              key={section.id}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gold/10 shadow-sm"
            >
              <div className="text-2xl mb-1">{section.icon}</div>
              <div className="text-sm font-semibold text-navy-dark">{section.title}</div>
              <div className="text-xs text-navy/60">{section.tests.length} tests</div>
            </div>
          ))}
        </div>

        {/* Tips */}
        <div className="bg-white/60 rounded-2xl p-6 mb-8 border border-gold/10 text-left">
          <h3 className="font-semibold text-navy-dark mb-3 flex items-center gap-2">
            <span>💡</span> Avant de commencer
          </h3>
          <ul className="space-y-2 text-sm text-navy">
            <li className="flex items-start gap-2">
              <span className="mt-0.5">✅</span>
              <span>Portez des vêtements confortables permettant de bouger librement</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5">✅</span>
              <span>Prévoyez un espace dégagé d&apos;environ 2 × 2 mètres</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5">✅</span>
              <span>Ayez un chronomètre (votre téléphone fera l&apos;affaire)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5">✅</span>
              <span>Un mur libre, une chaise stable, un élastique si possible</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5">⚠️</span>
              <span><strong>Arrêtez immédiatement</strong> tout exercice en cas de douleur aiguë</span>
            </li>
          </ul>
        </div>

        <button
          onClick={onStart}
          className="btn-secondary text-lg px-12 py-4 rounded-2xl"
        >
          Commencer le bilan →
        </button>
      </div>
    </div>
  )
}

// ─── Progress Bar ───
function ProgressBar({
  currentSection,
  currentTest,
  totalSections,
  totalTests,
  overallProgress,
}: {
  currentSection: number
  currentTest: number
  totalSections: number
  totalTests: number
  overallProgress: number
}) {
  return (
    <div className="w-full">
      {/* Section dots */}
      <div className="flex items-center justify-between mb-3 px-2">
        {allSections.map((section, i) => (
          <div key={section.id} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-300 ${
                i < currentSection
                  ? 'bg-emerald-500 text-white'
                  : i === currentSection
                  ? 'bg-bordeaux text-white scale-110 shadow-lg'
                  : 'bg-navy-dark/10 text-navy/40'
              }`}
            >
              {i < currentSection ? '✓' : section.icon}
            </div>
            {i < totalSections - 1 && (
              <div
                className={`h-0.5 w-full min-w-[20px] md:min-w-[40px] mx-1 transition-all duration-500 ${
                  i < currentSection ? 'bg-emerald-500' : 'bg-navy-dark/10'
                }`}
              />
            )}
          </div>
        ))}
      </div>
      {/* Overall bar */}
      <div className="w-full bg-navy-dark/5 rounded-full h-2 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-bordeaux to-gold transition-all duration-500 ease-out"
          style={{ width: `${overallProgress}%` }}
        />
      </div>
    </div>
  )
}

// ─── Score Button ───
function ScoreButton({
  option,
  selected,
  onSelect,
}: {
  option: { value: number; label: string; description: string; emoji: string }
  selected: boolean
  onSelect: () => void
}) {
  const bgColors = [
    'border-red-200 hover:border-red-400 hover:bg-red-50',
    'border-orange-200 hover:border-orange-400 hover:bg-orange-50',
    'border-amber-200 hover:border-amber-400 hover:bg-amber-50',
    'border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50',
  ]
  const selectedColors = [
    'border-red-500 bg-red-50 ring-2 ring-red-200',
    'border-orange-500 bg-orange-50 ring-2 ring-orange-200',
    'border-amber-500 bg-amber-50 ring-2 ring-amber-200',
    'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200',
  ]

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
        selected ? selectedColors[option.value] : `bg-white/80 ${bgColors[option.value]}`
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{option.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-navy-dark flex items-center gap-2">
            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white ${
              option.value === 0 ? 'bg-red-500' : option.value === 1 ? 'bg-orange-500' : option.value === 2 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}>
              {option.value}
            </span>
            {option.label}
          </div>
          <p className="text-sm text-navy/70 mt-0.5">{option.description}</p>
        </div>
        {selected && (
          <div className="text-emerald-600 text-xl animate-scale-in">✓</div>
        )}
      </div>
    </button>
  )
}

// ─── Section Intro ───
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
    <div className="max-w-xl mx-auto text-center animate-fade-in py-8">
      <div className="text-6xl mb-4">{section.icon}</div>
      <div className="text-sm font-medium text-bordeaux mb-2 uppercase tracking-wider">
        Partie {sectionIndex + 1} / {allSections.length}
      </div>
      <h2 className="text-3xl md:text-4xl font-bold text-navy-dark mb-2">
        {section.title}
      </h2>
      <p className="text-lg text-navy/70 mb-6">{section.subtitle}</p>
      <div className="bg-white/60 rounded-2xl p-6 mb-8 text-left border border-gold/10">
        <p className="text-navy leading-relaxed">{section.description}</p>
        <div className="mt-4 flex items-center gap-2 text-sm text-navy/60">
          <span>📝</span>
          <span>{section.tests.length} tests · Score max : {section.maxScore} points</span>
        </div>
      </div>
      <button onClick={onStart} className="btn-primary px-10 py-3 rounded-xl">
        Commencer cette partie →
      </button>
    </div>
  )
}

// ─── Test Card ───
function TestCard({
  test,
  testIndex,
  totalTests,
  section,
  selectedScore,
  onSelectScore,
  onNext,
  onPrevious,
  isFirst,
}: {
  test: MobilityTest
  testIndex: number
  totalTests: number
  section: TestSection
  selectedScore: number | undefined
  onSelectScore: (score: number) => void
  onNext: () => void
  onPrevious: () => void
  isFirst: boolean
}) {
  return (
    <div className="max-w-xl mx-auto animate-fade-in">
      {/* Test header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-bordeaux">
            {section.icon} {section.title}
          </span>
          <span className="text-sm text-navy/50">
            Test {testIndex + 1} / {totalTests}
          </span>
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-navy-dark mb-1">
          {test.name}
        </h3>
        <p className="text-navy/60 text-sm">{test.description}</p>
      </div>

      {/* Instructions */}
      <div className="bg-white/80 rounded-2xl p-5 mb-6 border border-gold/10 shadow-sm">
        <h4 className="font-semibold text-navy-dark mb-2 flex items-center gap-2">
          <span>📋</span> Comment faire
        </h4>
        <p className="text-navy leading-relaxed">{test.criteria}</p>
        {test.tip && (
          <div className="mt-3 bg-amber-50 rounded-lg p-3 text-sm text-amber-800 flex items-start gap-2">
            <span className="mt-0.5">💡</span>
            <span>{test.tip}</span>
          </div>
        )}
      </div>

      {/* Scoring options */}
      <div className="space-y-3 mb-8">
        <h4 className="font-semibold text-navy-dark text-sm uppercase tracking-wider">
          Votre score
        </h4>
        {test.scoring.map((option) => (
          <ScoreButton
            key={option.value}
            option={option}
            selected={selectedScore === option.value}
            onSelect={() => onSelectScore(option.value)}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onPrevious}
          disabled={isFirst}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            isFirst
              ? 'text-navy/30 cursor-not-allowed'
              : 'text-navy-dark hover:bg-navy-dark/5'
          }`}
        >
          ← Précédent
        </button>
        <button
          onClick={onNext}
          disabled={selectedScore === undefined}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
            selectedScore !== undefined
              ? 'bg-bordeaux text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5'
              : 'bg-navy-dark/10 text-navy/30 cursor-not-allowed'
          }`}
        >
          Suivant →
        </button>
      </div>
    </div>
  )
}

// ─── Score Gauge ───
function ScoreGauge({ score, maxScore, label, size = 'md' }: { score: number; maxScore: number; label: string; size?: 'sm' | 'md' | 'lg' }) {
  const pct = Math.round((score / maxScore) * 100)
  const radius = size === 'lg' ? 80 : size === 'md' ? 50 : 36
  const stroke = size === 'lg' ? 10 : size === 'md' ? 7 : 5
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (pct / 100) * circumference
  const color = pct >= 70 ? '#10B981' : pct >= 50 ? '#F59E0B' : '#EF4444'

  return (
    <div className="flex flex-col items-center">
      <svg width={(radius + stroke) * 2} height={(radius + stroke) * 2} className="transform -rotate-90">
        <circle
          cx={radius + stroke}
          cy={radius + stroke}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={radius + stroke}
          cy={radius + stroke}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{
        width: (radius + stroke) * 2,
        height: (radius + stroke) * 2,
      }}>
        <span className={`font-bold text-navy-dark ${size === 'lg' ? 'text-3xl' : size === 'md' ? 'text-xl' : 'text-base'}`}>
          {pct}%
        </span>
        {size !== 'sm' && <span className="text-xs text-navy/50">{score}/{maxScore}</span>}
      </div>
      <span className={`mt-1 text-navy-dark font-medium ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>{label}</span>
    </div>
  )
}

// ─── Results Screen ───
function ResultsScreen({ scores }: { scores: Scores }) {
  // Calculate scores per section
  const sectionScores = allSections.map((section) => {
    const sectionScore = section.tests.reduce((sum, test) => sum + (scores[test.id] ?? 0), 0)
    return { section, score: sectionScore }
  })

  const totalScore = sectionScores.reduce((sum, s) => sum + s.score, 0)
  const totalMax = allSections.reduce((sum, s) => sum + s.maxScore, 0)
  const totalPct = Math.round((totalScore / totalMax) * 100)

  // Check STANDARD 2026 eligibility
  const mobPassiveScore = sectionScores[0].score
  const mobPassiveMax = sectionScores[0].section.maxScore
  const mobActiveScore = sectionScores[1].score
  const mobActiveMax = sectionScores[1].section.maxScore
  const proprioScore = sectionScores[2].score
  const proprioMax = sectionScores[2].section.maxScore

  const eligibility = {
    mobPassive: (mobPassiveScore / mobPassiveMax) >= 0.7,
    mobActive: (mobActiveScore / mobActiveMax) >= 0.7,
    proprio: (proprioScore / proprioMax) >= 0.7,
    birdDog: (scores['gain-1'] ?? 0) >= 2,
    planche: (scores['gain-3'] ?? 0) >= 2,
    sidePlank: (scores['gain-4'] ?? 0) >= 2,
    sitToStand: (scores['prep-1'] ?? 0) >= 2,
    tug: (scores['prep-4'] ?? 0) >= 2,
    chairStand: (scores['prep-2'] ?? 0) >= 2,
    pushUps: (scores['prep-6'] ?? 0) >= 2,
  }

  const eligibleCount = Object.values(eligibility).filter(Boolean).length
  const isEligible = eligibleCount >= 8

  // Find weakest areas
  const weakTests = allSections.flatMap(s => s.tests)
    .filter(t => (scores[t.id] ?? 0) <= 1)
    .slice(0, 6)

  return (
    <div className="min-h-screen bg-beige-50 pb-20">
      <div className="max-w-3xl mx-auto px-4 pt-10 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">
            {totalPct >= 70 ? '🎉' : totalPct >= 50 ? '💪' : '🌱'}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-navy-dark mb-2">
            Vos résultats
          </h1>
          <p className="text-navy/60">
            Bilan de mobilité & condition physique
          </p>
        </div>

        {/* Global score card */}
        <div className="bg-white/80 rounded-3xl p-8 border border-gold/20 shadow-lg mb-8">
          <div className="flex flex-col items-center">
            <div className="relative">
              <ScoreGauge score={totalScore} maxScore={totalMax} label="Score global" size="lg" />
            </div>
            <div className="mt-4 text-center">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                totalPct >= 70 ? 'bg-emerald-100 text-emerald-700' :
                totalPct >= 50 ? 'bg-amber-100 text-amber-700' :
                'bg-red-100 text-red-700'
              }`}>
                {totalPct >= 70 ? '🟢 Mobilité fonctionnelle' :
                 totalPct >= 50 ? '🟡 Améliorations nécessaires' :
                 '🔴 Travail prioritaire'}
              </div>
            </div>
          </div>
        </div>

        {/* Per-section breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          {sectionScores.map(({ section, score }) => {
            const pct = Math.round((score / section.maxScore) * 100)
            return (
              <div
                key={section.id}
                className="bg-white/80 rounded-2xl p-4 border border-gold/10 text-center"
              >
                <div className="text-2xl mb-2">{section.icon}</div>
                <div className="text-2xl font-bold text-navy-dark">{pct}%</div>
                <div className="text-xs text-navy/50 mb-1">{score}/{section.maxScore}</div>
                <div className="text-xs font-medium text-navy-dark">{section.title}</div>
                <div className={`mt-2 h-1.5 rounded-full bg-gray-100 overflow-hidden`}>
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      pct >= 70 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* STANDARD 2026 Eligibility */}
        <div className="bg-white/80 rounded-3xl p-6 border border-gold/20 shadow-sm mb-8">
          <h3 className="text-lg font-bold text-navy-dark mb-4 flex items-center gap-2">
            <span>🏆</span> Éligibilité STANDARD 2026
          </h3>
          <div className={`text-center p-4 rounded-2xl mb-4 ${
            isEligible ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'
          }`}>
            <div className="text-2xl mb-1">{isEligible ? '✅' : '🔄'}</div>
            <div className={`font-semibold ${isEligible ? 'text-emerald-700' : 'text-amber-700'}`}>
              {isEligible ? 'Vous êtes éligible !' : `${eligibleCount}/10 critères validés — continuez !`}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {Object.entries({
              'Mobilité passive ≥ 70%': eligibility.mobPassive,
              'Mobilité active ≥ 70%': eligibility.mobActive,
              'Proprioception ≥ 70%': eligibility.proprio,
              'Bird-dog ≥ 2/3': eligibility.birdDog,
              'Planche ≥ 30 s': eligibility.planche,
              'Side plank ≥ 30 s/côté': eligibility.sidePlank,
              '5× Sit-to-Stand ≤ 14 s': eligibility.sitToStand,
              'TUG ≤ 10 s': eligibility.tug,
              'Chair stand ≥ 10 reps': eligibility.chairStand,
              'Push-ups ≥ 8 reps': eligibility.pushUps,
            }).map(([label, ok]) => (
              <div key={label} className={`flex items-center gap-2 p-2 rounded-lg ${ok ? 'text-emerald-700' : 'text-navy/50'}`}>
                <span>{ok ? '✅' : '⬜'}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weak areas */}
        {weakTests.length > 0 && (
          <div className="bg-white/80 rounded-3xl p-6 border border-gold/20 shadow-sm mb-8">
            <h3 className="text-lg font-bold text-navy-dark mb-4 flex items-center gap-2">
              <span>🎯</span> Axes d&apos;amélioration prioritaires
            </h3>
            <div className="space-y-2">
              {weakTests.map((test) => {
                const section = allSections.find(s => s.tests.some(t => t.id === test.id))!
                const score = scores[test.id] ?? 0
                return (
                  <div
                    key={test.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-red-50/50 border border-red-100"
                  >
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold text-white ${
                      score === 0 ? 'bg-red-500' : 'bg-orange-500'
                    }`}>
                      {score}
                    </span>
                    <div className="flex-1">
                      <div className="font-medium text-navy-dark text-sm">{test.name}</div>
                      <div className="text-xs text-navy/50">{section.icon} {section.title}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Detail per section */}
        {sectionScores.map(({ section, score }) => (
          <details key={section.id} className="bg-white/80 rounded-2xl border border-gold/10 mb-4 overflow-hidden group">
            <summary className="p-5 cursor-pointer flex items-center justify-between hover:bg-gold/5 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-xl">{section.icon}</span>
                <span className="font-semibold text-navy-dark">{section.title}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-navy/60">{score}/{section.maxScore}</span>
                <svg className="w-4 h-4 text-navy/30 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </summary>
            <div className="px-5 pb-5 space-y-2">
              {section.tests.map((test) => {
                const s = scores[test.id] ?? 0
                return (
                  <div key={test.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="text-sm text-navy-dark">{test.name}</span>
                    <div className="flex items-center gap-2">
                      {[0, 1, 2, 3].map((v) => (
                        <div
                          key={v}
                          className={`w-3 h-3 rounded-full ${
                            v <= s
                              ? v === 0 ? 'bg-red-400' : v === 1 ? 'bg-orange-400' : v === 2 ? 'bg-amber-400' : 'bg-emerald-400'
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-sm font-semibold text-navy-dark w-4 text-right">{s}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </details>
        ))}

        {/* CTA */}
        <div className="text-center mt-10">
          <p className="text-sm text-navy/50 mb-4">
            Ces résultats serviront de base pour personnaliser votre programme EnTrain.
          </p>
          <a
            href="/"
            className="btn-secondary inline-flex items-center gap-2 px-8 py-3 rounded-xl"
          >
            Retour à l&apos;accueil
          </a>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════
// MAIN — Wizard Orchestrator
// ═══════════════════════════════════════════
export default function BilanMobilitePage() {
  const [phase, setPhase] = useState<Phase>('welcome')
  const [sectionIndex, setSectionIndex] = useState(0)
  const [testIndex, setTestIndex] = useState(-1) // -1 = section intro
  const [scores, setScores] = useState<Scores>({})

  const currentSection = allSections[sectionIndex]
  const currentTest = testIndex >= 0 ? currentSection?.tests[testIndex] : null

  // Total progress
  const totalTests = allSections.reduce((s, sec) => s + sec.tests.length, 0)
  const completedTests = Object.keys(scores).length
  const overallProgress = (completedTests / totalTests) * 100

  const handleScoreSelect = useCallback((testId: string, score: number) => {
    setScores((prev) => ({ ...prev, [testId]: score }))
  }, [])

  const handleNext = useCallback(() => {
    if (!currentSection) return

    // If on section intro, go to first test
    if (testIndex === -1) {
      setTestIndex(0)
      return
    }

    // Move to next test or next section
    if (testIndex < currentSection.tests.length - 1) {
      setTestIndex(testIndex + 1)
    } else if (sectionIndex < allSections.length - 1) {
      // Next section
      setSectionIndex(sectionIndex + 1)
      setTestIndex(-1)
    } else {
      // All done!
      setPhase('results')
    }
  }, [testIndex, sectionIndex, currentSection])

  const handlePrevious = useCallback(() => {
    if (testIndex > 0) {
      setTestIndex(testIndex - 1)
    } else if (testIndex === 0) {
      setTestIndex(-1) // back to section intro
    } else if (sectionIndex > 0) {
      // Back to last test of previous section
      const prevSection = allSections[sectionIndex - 1]
      setSectionIndex(sectionIndex - 1)
      setTestIndex(prevSection.tests.length - 1)
    }
  }, [testIndex, sectionIndex])

  const isFirstEver = sectionIndex === 0 && testIndex <= -1

  // ── Render ──
  if (phase === 'welcome') {
    return <WelcomeScreen onStart={() => setPhase('testing')} />
  }

  if (phase === 'results') {
    return <ResultsScreen scores={scores} />
  }

  return (
    <div className="min-h-screen bg-beige-50 flex flex-col">
      {/* Fixed top bar */}
      <div className="sticky top-0 z-50 bg-beige-50/90 backdrop-blur-md border-b border-gold/10 px-4 py-4">
        <div className="max-w-xl mx-auto">
          <ProgressBar
            currentSection={sectionIndex}
            currentTest={testIndex}
            totalSections={allSections.length}
            totalTests={currentSection?.tests.length ?? 0}
            overallProgress={overallProgress}
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-navy/50">
              {completedTests} / {totalTests} tests complétés
            </span>
            <span className="text-xs text-navy/50">
              {Math.round(overallProgress)}%
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        {testIndex === -1 && currentSection ? (
          <SectionIntro
            section={currentSection}
            sectionIndex={sectionIndex}
            onStart={() => setTestIndex(0)}
          />
        ) : currentTest ? (
          <TestCard
            test={currentTest}
            testIndex={testIndex}
            totalTests={currentSection.tests.length}
            section={currentSection}
            selectedScore={scores[currentTest.id]}
            onSelectScore={(score) => handleScoreSelect(currentTest.id, score)}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isFirst={isFirstEver}
          />
        ) : null}
      </div>
    </div>
  )
}
