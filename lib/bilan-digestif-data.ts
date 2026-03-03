// ──────────────────────────────────────────────────────
// Bilan Troubles Digestifs — Data Model
// Basé sur le GSRS et le GIQLI
// ──────────────────────────────────────────────────────

export interface ScoreOption {
  value: number
  label: string
  description: string
}

export interface DigestifTest {
  id: string
  name: string
  description: string
  criteria: string
  scoring: ScoreOption[]
  tip?: string
}

export type SectionIcon = 'reflux' | 'pain' | 'indigestion' | 'transit' | 'constipation'

export interface TestSection {
  id: string
  title: string
  subtitle: string
  icon: SectionIcon
  description: string
  maxScore: number
  tests: DigestifTest[]
}

export interface ScoreInterpretation {
  range: string
  label: string
  color: string
  description: string
  recommendation: string
}

// ── Standard scoring grid (GSRS adapted) ──
// Original: 0=aucun inconfort ... 100=très sévère
// Reversed to: 3=aucun inconfort (best) ... 0=sévère (worst)
const gsrsScoring: ScoreOption[] = [
  { value: 0, label: 'Inconfort sévère', description: 'Gêne importante, fréquente, limitant vos activités' },
  { value: 1, label: 'Inconfort modéré', description: 'Gêne régulière, commence à perturber le quotidien' },
  { value: 2, label: 'Gêne légère', description: 'Gêne occasionnelle, sans impact majeur' },
  { value: 3, label: 'Aucun inconfort', description: 'Pas de gêne du tout au cours de la semaine' },
]

// ══════════════════════════════════════════════════════
// SECTION 1 — Reflux gastro-œsophagien (2 tests)
// ══════════════════════════════════════════════════════
const reflux: TestSection = {
  id: 'reflux',
  title: 'Reflux',
  subtitle: 'Reflux gastro-œsophagien',
  icon: 'reflux',
  description:
    'Ces questions évaluent la présence et la sévérité de symptômes de reflux acide au cours de la dernière semaine.',
  maxScore: 6,
  tests: [
    {
      id: 'ref-1',
      name: 'Brûlures d\'estomac',
      description: 'Sensation de brûlure dans la poitrine',
      criteria: 'Avez-vous été gêné(e) par des brûlures d\'estomac au cours de la semaine écoulée ? (Sensation désagréable de picotement ou de brûlure dans la poitrine)',
      scoring: gsrsScoring,
      tip: 'Les brûlures d\'estomac fréquentes peuvent indiquer un reflux gastro-œsophagien (RGO) qui mérite attention.',
    },
    {
      id: 'ref-2',
      name: 'Reflux acides',
      description: 'Régurgitations acides ou liquide amer',
      criteria: 'Avez-vous été gêné(e) par des reflux acides au cours de la semaine écoulée ? (Sensation de régurgiter de petites quantités d\'acide ou écoulement de liquide amer de l\'estomac vers la gorge)',
      scoring: gsrsScoring,
    },
  ],
}

// ══════════════════════════════════════════════════════
// SECTION 2 — Douleurs abdominales (3 tests)
// ══════════════════════════════════════════════════════
const douleursAbdominales: TestSection = {
  id: 'douleurs-abdominales',
  title: 'Douleurs abdominales',
  subtitle: 'Douleurs et gênes abdominales',
  icon: 'pain',
  description:
    'Ces questions portent sur les douleurs ou gênes ressenties au niveau de l\'abdomen au cours de la dernière semaine.',
  maxScore: 9,
  tests: [
    {
      id: 'doul-1',
      name: 'Douleur abdominale haute',
      description: 'Douleur au niveau de l\'estomac ou du creux épigastrique',
      criteria: 'Au cours de la semaine écoulée, avez-vous ressenti des douleurs ou une gêne au niveau de la partie supérieure de l\'abdomen ou du creux de l\'estomac ?',
      scoring: gsrsScoring,
    },
    {
      id: 'doul-2',
      name: 'Douleurs de faim',
      description: 'Sensation de creux et besoin de manger entre les repas',
      criteria: 'Au cours de la semaine écoulée, avez-vous été gêné(e) par des douleurs de faim dans l\'estomac ? (Sensation de creux associée au besoin de manger entre les repas)',
      scoring: gsrsScoring,
      tip: 'Des douleurs de faim récurrentes peuvent être liées à une gastrite ou un déséquilibre glycémique.',
    },
    {
      id: 'doul-3',
      name: 'Nausées',
      description: 'Envie de vomir',
      criteria: 'Avez-vous été gêné(e) par des nausées au cours de la semaine écoulée ?',
      scoring: gsrsScoring,
    },
  ],
}

// ══════════════════════════════════════════════════════
// SECTION 3 — Indigestion (4 tests)
// ══════════════════════════════════════════════════════
const indigestion: TestSection = {
  id: 'indigestion',
  title: 'Indigestion',
  subtitle: 'Ballonnements et gaz',
  icon: 'indigestion',
  description:
    'Ces questions évaluent les symptômes liés à la digestion : ballonnements, gargouillements et flatulences au cours de la dernière semaine.',
  maxScore: 12,
  tests: [
    {
      id: 'ind-1',
      name: 'Gargouillements',
      description: 'Vibrations ou bruits dans l\'estomac',
      criteria: 'Au cours de la semaine écoulée, avez-vous été gêné(e) par des gargouillements dans votre estomac ? (Vibrations ou bruits dans l\'estomac)',
      scoring: gsrsScoring,
    },
    {
      id: 'ind-2',
      name: 'Ballonnements',
      description: 'Sensation de gonflement abdominal',
      criteria: 'Votre estomac a-t-il été gonflé au cours de la semaine écoulée ? (Sensation de gaz ou d\'air dans l\'estomac)',
      scoring: gsrsScoring,
      tip: 'Les ballonnements chroniques peuvent être liés à une intolérance alimentaire, un déséquilibre du microbiote ou des habitudes alimentaires.',
    },
    {
      id: 'ind-3',
      name: 'Éructations',
      description: 'Rots ou renvois d\'air',
      criteria: 'Avez-vous été gêné(e) par des éructations au cours de la semaine écoulée ? (Les rots consistent à faire sortir de l\'air de l\'estomac par la bouche)',
      scoring: gsrsScoring,
    },
    {
      id: 'ind-4',
      name: 'Gaz et flatulences',
      description: 'Besoin d\'évacuer de l\'air de l\'intestin',
      criteria: 'Avez-vous été gêné(e) par des gaz ou des flatulences au cours de la semaine écoulée ?',
      scoring: gsrsScoring,
    },
  ],
}

// ══════════════════════════════════════════════════════
// SECTION 4 — Diarrhée (3 tests)
// ══════════════════════════════════════════════════════
const diarrhee: TestSection = {
  id: 'diarrhee',
  title: 'Diarrhée',
  subtitle: 'Transit accéléré',
  icon: 'transit',
  description:
    'Ces questions évaluent les symptômes liés à un transit accéléré au cours de la dernière semaine.',
  maxScore: 9,
  tests: [
    {
      id: 'dia-1',
      name: 'Diarrhée',
      description: 'Vidange trop fréquente des intestins',
      criteria: 'Avez-vous été gêné(e) par une diarrhée au cours de la semaine écoulée ? (Vidange trop fréquente des intestins)',
      scoring: gsrsScoring,
    },
    {
      id: 'dia-2',
      name: 'Selles molles',
      description: 'Selles de consistance molle',
      criteria: 'Avez-vous été gêné(e) par des selles molles au cours de la semaine écoulée ?',
      scoring: gsrsScoring,
    },
    {
      id: 'dia-3',
      name: 'Urgences intestinales',
      description: 'Besoin urgent d\'aller aux toilettes',
      criteria: 'Au cours de la semaine écoulée, avez-vous été gêné(e) par un besoin urgent d\'aller aux toilettes ?',
      scoring: gsrsScoring,
      tip: 'Un besoin impérieux fréquent peut être lié au syndrome de l\'intestin irritable ou à une inflammation.',
    },
  ],
}

// ══════════════════════════════════════════════════════
// SECTION 5 — Constipation (3 tests)
// ══════════════════════════════════════════════════════
const constipation: TestSection = {
  id: 'constipation',
  title: 'Constipation',
  subtitle: 'Transit ralenti',
  icon: 'constipation',
  description:
    'Ces questions évaluent les symptômes liés à un transit ralenti au cours de la dernière semaine.',
  maxScore: 9,
  tests: [
    {
      id: 'con-1',
      name: 'Constipation',
      description: 'Diminution de la capacité à vider les intestins',
      criteria: 'Avez-vous été gêné(e) par la constipation au cours de la semaine écoulée ?',
      scoring: gsrsScoring,
    },
    {
      id: 'con-2',
      name: 'Selles dures',
      description: 'Selles de consistance dure',
      criteria: 'Avez-vous été gêné(e) par des selles dures au cours de la semaine écoulée ?',
      scoring: gsrsScoring,
    },
    {
      id: 'con-3',
      name: 'Vidange incomplète',
      description: 'Sensation de ne pas avoir complètement évacué',
      criteria: 'En allant aux toilettes au cours de la semaine écoulée, avez-vous eu la sensation de ne pas vider complètement les selles ?',
      scoring: gsrsScoring,
      tip: 'Cette sensation de vidange incomplète peut être liée à un dysfonctionnement du plancher pelvien.',
    },
  ],
}

// ══════════════════════════════════════════════════════
// EXPORTS
// ══════════════════════════════════════════════════════

export const allSections: TestSection[] = [
  reflux,
  douleursAbdominales,
  indigestion,
  diarrhee,
  constipation,
]

export const totalMaxScore = allSections.reduce((sum, s) => sum + s.maxScore, 0)

export const digestifInterpretations: ScoreInterpretation[] = [
  {
    range: '90 – 100%',
    label: 'Excellent',
    color: 'text-emerald-600',
    description: 'Santé digestive excellente, pas de symptômes significatifs.',
    recommendation: 'Continuez à maintenir vos bonnes habitudes alimentaires et votre hygiène de vie.',
  },
  {
    range: '75 – 89%',
    label: 'Bon',
    color: 'text-sky-600',
    description: 'Bonne santé digestive, quelques symptômes légers.',
    recommendation: 'Quelques ajustements alimentaires ciblés peuvent optimiser votre confort digestif.',
  },
  {
    range: '50 – 74%',
    label: 'Moyen',
    color: 'text-amber-600',
    description: 'Santé digestive modérée, impact notable sur le quotidien.',
    recommendation: 'Un programme nutritionnel adapté et un travail sur le microbiote sont recommandés.',
  },
  {
    range: '30 – 49%',
    label: 'Significatif',
    color: 'text-orange-600',
    description: 'Troubles digestifs significatifs avec impact important.',
    recommendation: 'Un bilan digestif approfondi et un accompagnement nutritionnel personnalisé sont conseillés.',
  },
  {
    range: '< 30%',
    label: 'Sévère',
    color: 'text-red-600',
    description: 'Santé digestive sévèrement altérée, symptômes graves.',
    recommendation: 'Nous vous recommandons de consulter un gastro-entérologue en complément de votre programme Evo.',
  },
]
