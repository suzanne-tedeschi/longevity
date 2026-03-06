// ──────────────────────────────────────────────────────
// Bilan Gestion du Stress — Data Model
// Basé sur le GHQ-12, CD-RISC, PSS et un questionnaire
// complémentaire Fatigue
// ──────────────────────────────────────────────────────

export interface ScoreOption {
  value: number
  label: string
  description: string
}

export interface StressTest {
  id: string
  name: string
  description: string
  criteria: string
  scoring: ScoreOption[]
  tip?: string
}

export type SectionIcon = 'wellbeing' | 'resilience' | 'stress' | 'fatigue'

export interface TestSection {
  id: string
  title: string
  subtitle: string
  icon: SectionIcon
  description: string
  maxScore: number
  tests: StressTest[]
}

export interface ScoreInterpretation {
  range: string
  label: string
  color: string
  description: string
  recommendation: string
}

// ── Scoring grids ──

// GHQ-12: Positive items (direct: higher = better mental health)
const ghqPositiveScoring: ScoreOption[] = [
  { value: 0, label: 'Pas du tout', description: 'Pas du tout au cours des dernières semaines' },
  { value: 1, label: 'Pas plus que d\'habitude', description: 'Comme d\'habitude' },
  { value: 2, label: 'Plus que d\'habitude', description: 'Un peu plus que d\'habitude' },
  { value: 3, label: 'Bien plus que d\'habitude', description: 'Beaucoup plus que d\'habitude' },
]

// GHQ-12: Negative items (reversed: "Pas du tout" = good)
const ghqNegativeScoring: ScoreOption[] = [
  { value: 3, label: 'Pas du tout', description: 'Pas du tout au cours des dernières semaines' },
  { value: 2, label: 'Pas plus que d\'habitude', description: 'Comme d\'habitude' },
  { value: 1, label: 'Plus que d\'habitude', description: 'Un peu plus que d\'habitude' },
  { value: 0, label: 'Bien plus que d\'habitude', description: 'Beaucoup plus que d\'habitude' },
]

// CD-RISC: Direct (higher = more resilient = better)
const cdRiscScoring: ScoreOption[] = [
  { value: 0, label: 'Pas vrai du tout', description: 'Cela ne me correspond pas du tout' },
  { value: 1, label: 'Rarement vrai', description: 'C\'est rarement le cas pour moi' },
  { value: 2, label: 'Parfois vrai', description: 'C\'est parfois le cas' },
  { value: 3, label: 'Souvent vrai', description: 'C\'est souvent vrai pour moi' },
  { value: 4, label: 'Toujours vrai', description: 'C\'est presque toujours vrai' },
]

// PSS: Negative items (reversed: "Jamais" = low stress = good)
const pssNegativeScoring: ScoreOption[] = [
  { value: 4, label: 'Jamais', description: 'Jamais au cours du dernier mois' },
  { value: 3, label: 'Presque jamais', description: 'Très rarement' },
  { value: 2, label: 'Parfois', description: 'De temps en temps' },
  { value: 1, label: 'Assez souvent', description: 'Régulièrement' },
  { value: 0, label: 'Très souvent', description: 'Très fréquemment' },
]

// PSS: Positive items (direct: "Très souvent" = feeling in control = good)
const pssPositiveScoring: ScoreOption[] = [
  { value: 0, label: 'Jamais', description: 'Jamais au cours du dernier mois' },
  { value: 1, label: 'Presque jamais', description: 'Très rarement' },
  { value: 2, label: 'Parfois', description: 'De temps en temps' },
  { value: 3, label: 'Assez souvent', description: 'Régulièrement' },
  { value: 4, label: 'Très souvent', description: 'Très fréquemment' },
]

// Fatigue: Reversed (low fatigue = good)
const fatigueScoring: ScoreOption[] = [
  { value: 4, label: 'Pas du tout', description: 'Aucune fatigue ressentie' },
  { value: 3, label: 'Légèrement', description: 'Fatigue légère, peu gênante' },
  { value: 2, label: 'Modérément', description: 'Fatigue modérée, perceptible' },
  { value: 1, label: 'Fortement', description: 'Fatigue importante, gênante' },
  { value: 0, label: 'Extrêmement', description: 'Fatigue extrême, invalidante' },
]

// ══════════════════════════════════════════════════════
// SECTION 1 — GHQ-12 (12 items)
// Bien-être mental — Positive items: 1,3,4,7,8,12
// ══════════════════════════════════════════════════════
const ghq12Section: TestSection = {
  id: 'ghq-12',
  title: 'Bien-être mental',
  subtitle: 'GHQ-12 — État psychique général',
  icon: 'wellbeing',
  description:
    'Ce questionnaire évalue votre bien-être mental au cours des dernières semaines. Répondez en pensant à votre ressenti général.',
  maxScore: 36,
  tests: [
    {
      id: 'ghq-1', name: 'Concentration', description: 'Capacité d\'attention',
      criteria: 'Avez-vous pu vous concentrer sur ce que vous faisiez ?',
      scoring: ghqPositiveScoring,
      tip: 'Pensez à vos activités quotidiennes des dernières semaines.',
    },
    {
      id: 'ghq-2', name: 'Sommeil & soucis', description: 'Impact du stress sur le sommeil',
      criteria: 'Vos soucis vous ont-ils empêché de dormir ?',
      scoring: ghqNegativeScoring,
    },
    {
      id: 'ghq-3', name: 'Sentiment d\'utilité', description: 'Rôle perçu dans la vie',
      criteria: 'Avez-vous eu le sentiment de jouer un rôle utile dans votre vie ?',
      scoring: ghqPositiveScoring,
    },
    {
      id: 'ghq-4', name: 'Prise de décision', description: 'Capacité décisionnelle',
      criteria: 'Vous êtes-vous senti capable de prendre des décisions ?',
      scoring: ghqPositiveScoring,
    },
    {
      id: 'ghq-5', name: 'Pression ressentie', description: 'Sentiment de surcharge',
      criteria: 'Vous êtes-vous senti constamment sous pression ?',
      scoring: ghqNegativeScoring,
    },
    {
      id: 'ghq-6', name: 'Surmonter les difficultés', description: 'Capacité de coping',
      criteria: 'Avez-vous eu l\'impression de ne pas pouvoir surmonter vos difficultés ?',
      scoring: ghqNegativeScoring,
    },
    {
      id: 'ghq-7', name: 'Plaisir quotidien', description: 'Joie dans les activités',
      criteria: 'Avez-vous pris plaisir à vos activités quotidiennes ?',
      scoring: ghqPositiveScoring,
    },
    {
      id: 'ghq-8', name: 'Faire face', description: 'Capacité à gérer les problèmes',
      criteria: 'Avez-vous réussi à faire face à vos problèmes ?',
      scoring: ghqPositiveScoring,
    },
    {
      id: 'ghq-9', name: 'Humeur dépressive', description: 'Tristesse & mal-être',
      criteria: 'Vous êtes-vous senti malheureux ou déprimé ?',
      scoring: ghqNegativeScoring,
      tip: 'Si cette question vous concerne au quotidien, n\'hésitez pas à consulter un professionnel.',
    },
    {
      id: 'ghq-10', name: 'Confiance en soi', description: 'Estime personnelle',
      criteria: 'Avez-vous perdu confiance en vous ?',
      scoring: ghqNegativeScoring,
    },
    {
      id: 'ghq-11', name: 'Valeur personnelle', description: 'Sentiment de valeur',
      criteria: 'Avez-vous eu le sentiment de ne rien valoir ?',
      scoring: ghqNegativeScoring,
    },
    {
      id: 'ghq-12', name: 'Bonheur général', description: 'Sentiment global de bonheur',
      criteria: 'Vous êtes-vous senti globalement heureux ?',
      scoring: ghqPositiveScoring,
    },
  ],
}

// ══════════════════════════════════════════════════════
// SECTION 2 — CD-RISC (10 items)
// Résilience mentale — tous les items sont directs
// ══════════════════════════════════════════════════════
const cdRiscSection: TestSection = {
  id: 'cd-risc',
  title: 'Résilience mentale',
  subtitle: 'CD-RISC — Capacité à rebondir',
  icon: 'resilience',
  description:
    'Ce questionnaire mesure votre capacité à surmonter les difficultés et à rebondir face aux défis de la vie.',
  maxScore: 40,
  tests: [
    {
      id: 'cdr-1', name: 'Adaptation au changement', description: 'Flexibilité face aux transitions',
      criteria: 'Je peux m\'adapter au changement.',
      scoring: cdRiscScoring,
    },
    {
      id: 'cdr-2', name: 'Gestion des difficultés', description: 'Capacité de coping',
      criteria: 'J\'arrive à gérer les situations difficiles.',
      scoring: cdRiscScoring,
    },
    {
      id: 'cdr-3', name: 'Optimisme résilient', description: 'Voir le positif dans l\'adversité',
      criteria: 'Je suis capable de voir le bon côté des choses même quand ça va mal.',
      scoring: cdRiscScoring,
      tip: 'L\'optimisme réaliste est un facteur protecteur reconnu face au stress.',
    },
    {
      id: 'cdr-4', name: 'Confiance en ses capacités', description: 'Auto-efficacité perçue',
      criteria: 'J\'ai confiance en ma capacité à surmonter les défis.',
      scoring: cdRiscScoring,
    },
    {
      id: 'cdr-5', name: 'Gestion du stress', description: 'Tolérance au stress',
      criteria: 'Je gère bien le stress.',
      scoring: cdRiscScoring,
    },
    {
      id: 'cdr-6', name: 'Lucidité sous pression', description: 'Fonctionnement sous stress',
      criteria: 'Je reste concentré et je prends des décisions sous pression.',
      scoring: cdRiscScoring,
    },
    {
      id: 'cdr-7', name: 'Rebond face aux épreuves', description: 'Capacité de rebond',
      criteria: 'Je trouve des moyens de rebondir face aux épreuves.',
      scoring: cdRiscScoring,
    },
    {
      id: 'cdr-8', name: 'Régulation émotionnelle', description: 'Contrôle des émotions',
      criteria: 'Je ne me laisse pas facilement submerger par les émotions.',
      scoring: cdRiscScoring,
    },
    {
      id: 'cdr-9', name: 'Détermination', description: 'Ténacité face aux obstacles',
      criteria: 'J\'affronte les défis avec détermination.',
      scoring: cdRiscScoring,
    },
    {
      id: 'cdr-10', name: 'Maîtrise situationnelle', description: 'Sentiment de contrôle',
      criteria: 'Je garde le contrôle même dans les situations difficiles.',
      scoring: cdRiscScoring,
    },
  ],
}

// ══════════════════════════════════════════════════════
// SECTION 3 — PSS (10 items)
// Stress perçu — Reversed items: 5, 6, 8 (positive)
// ══════════════════════════════════════════════════════
const pssSection: TestSection = {
  id: 'pss',
  title: 'Stress perçu',
  subtitle: 'PSS — Niveau de stress ressenti',
  icon: 'stress',
  description:
    'Ce questionnaire évalue le niveau de stress que vous avez ressenti au cours du dernier mois. Répondez selon la fréquence de chaque situation.',
  maxScore: 40,
  tests: [
    {
      id: 'pss-1', name: 'Dépassement', description: 'Sentiment d\'être submergé',
      criteria: 'Au cours du dernier mois, à quelle fréquence vous êtes-vous senti dépassé par les événements ?',
      scoring: pssNegativeScoring,
    },
    {
      id: 'pss-2', name: 'Perte de contrôle', description: 'Sentiment d\'impuissance',
      criteria: 'Au cours du dernier mois, à quelle fréquence avez-vous eu le sentiment de ne pas pouvoir contrôler les choses importantes dans votre vie ?',
      scoring: pssNegativeScoring,
    },
    {
      id: 'pss-3', name: 'Nervosité', description: 'Tension nerveuse',
      criteria: 'Au cours du dernier mois, à quelle fréquence vous êtes-vous senti nerveux ou stressé ?',
      scoring: pssNegativeScoring,
    },
    {
      id: 'pss-4', name: 'Non-maîtrise', description: 'Manque de contrôle sur sa vie',
      criteria: 'Au cours du dernier mois, à quelle fréquence avez-vous eu l\'impression de ne pas maîtriser votre vie ?',
      scoring: pssNegativeScoring,
    },
    {
      id: 'pss-5', name: 'Confiance en soi', description: 'Capacité à gérer ses problèmes',
      criteria: 'Au cours du dernier mois, à quelle fréquence avez-vous eu confiance en votre capacité à gérer vos problèmes personnels ?',
      scoring: pssPositiveScoring,
    },
    {
      id: 'pss-6', name: 'Gestion des imprévus', description: 'Capacité d\'adaptation',
      criteria: 'Au cours du dernier mois, à quelle fréquence avez-vous eu le sentiment de pouvoir gérer les imprévus ?',
      scoring: pssPositiveScoring,
    },
    {
      id: 'pss-7', name: 'Accumulation', description: 'Surcharge de difficultés',
      criteria: 'Au cours du dernier mois, à quelle fréquence avez-vous ressenti que les difficultés s\'accumulaient au point de ne plus pouvoir les surmonter ?',
      scoring: pssNegativeScoring,
    },
    {
      id: 'pss-8', name: 'Choses positives', description: 'Sentiment de progrès',
      criteria: 'Au cours du dernier mois, à quelle fréquence avez-vous ressenti que les choses allaient dans votre sens ?',
      scoring: pssPositiveScoring,
    },
    {
      id: 'pss-9', name: 'Irritation', description: 'Réactivité aux imprévus',
      criteria: 'Au cours du dernier mois, à quelle fréquence avez-vous été irrité par des choses imprévues ?',
      scoring: pssNegativeScoring,
    },
    {
      id: 'pss-10', name: 'Surcharge', description: 'Sentiment de trop en faire',
      criteria: 'Au cours du dernier mois, à quelle fréquence avez-vous eu l\'impression de devoir trop en faire ?',
      scoring: pssNegativeScoring,
    },
  ],
}

// ══════════════════════════════════════════════════════
// SECTION 4 — Fatigue complémentaire (8 items)
// Sous-scores : Mental /12, Physique /12, Motivationnel /8
// ══════════════════════════════════════════════════════
const fatigueSection: TestSection = {
  id: 'fatigue',
  title: 'Niveau de fatigue',
  subtitle: 'Fatigue mentale, physique & motivationnelle',
  icon: 'fatigue',
  description:
    'Ces questions portent sur votre niveau de fatigue ressenti au cours des 2 dernières semaines. Répondez spontanément.',
  maxScore: 32,
  tests: [
    // Fatigue mentale (items 1-3, max 12)
    {
      id: 'fat-1', name: 'Attention & concentration', description: 'Fatigue mentale',
      criteria: 'Avez-vous des difficultés à maintenir votre attention ou votre concentration, même sur des tâches simples ?',
      scoring: fatigueScoring,
    },
    {
      id: 'fat-2', name: 'Saturation cognitive', description: 'Fatigue mentale',
      criteria: 'Avez-vous l\'impression que votre cerveau « sature » plus vite qu\'avant (besoin de pauses mentales fréquentes) ?',
      scoring: fatigueScoring,
    },
    {
      id: 'fat-3', name: 'Coût intellectuel', description: 'Fatigue mentale',
      criteria: 'Les efforts intellectuels vous semblent-ils disproportionnellement coûteux par rapport à auparavant ?',
      scoring: fatigueScoring,
    },
    // Fatigue physique (items 4-6, max 12)
    {
      id: 'fat-4', name: 'Fatigue corporelle', description: 'Fatigue physique',
      criteria: 'Ressentez-vous une fatigue corporelle persistante, même après une nuit de sommeil correcte ?',
      scoring: fatigueScoring,
      tip: 'Une fatigue persistante malgré un sommeil suffisant peut indiquer une carence en fer, vitamine D ou un trouble sous-jacent.',
    },
    {
      id: 'fat-5', name: 'Récupération physique', description: 'Fatigue physique',
      criteria: 'Avez-vous la sensation que votre corps récupère moins bien qu\'avant après l\'effort ou une journée active ?',
      scoring: fatigueScoring,
    },
    {
      id: 'fat-6', name: 'Lourdeur corporelle', description: 'Fatigue physique',
      criteria: 'Vous sentez-vous « lourd », ralenti ou physiquement diminué sans cause évidente ?',
      scoring: fatigueScoring,
    },
    // Fatigue motivationnelle (items 7-8, max 8)
    {
      id: 'fat-7', name: 'Perte d\'élan', description: 'Fatigue motivationnelle',
      criteria: 'Avez-vous perdu l\'élan ou l\'enthousiasme pour des activités qui vous motivaient auparavant ?',
      scoring: fatigueScoring,
    },
    {
      id: 'fat-8', name: 'Actions par obligation', description: 'Fatigue motivationnelle',
      criteria: 'Faites-vous les choses « par obligation » plutôt que par envie, même lorsqu\'elles sont importantes pour vous ?',
      scoring: fatigueScoring,
    },
  ],
}

// ══════════════════════════════════════════════════════
// EXPORTS
// ══════════════════════════════════════════════════════

export const allSections: TestSection[] = [
  ghq12Section,
  cdRiscSection,
  pssSection,
  fatigueSection,
]

export const totalMaxScore = allSections.reduce((sum, s) => sum + s.maxScore, 0)
// 36 + 40 + 40 + 32 = 148

export const stressInterpretations: ScoreInterpretation[] = [
  {
    range: '≥ 80%',
    label: 'Excellent',
    color: 'text-emerald-600',
    description:
      'Votre gestion du stress est remarquable. Vous montrez une grande résilience, un faible niveau de stress perçu et peu de fatigue.',
    recommendation:
      'Continuez à entretenir vos ressources. La pratique régulière d\'activités physiques et de relaxation maintient ces acquis.',
  },
  {
    range: '60 – 79%',
    label: 'Bon',
    color: 'text-sky-600',
    description:
      'Votre gestion du stress est globalement bonne, avec quelques points d\'attention identifiés.',
    recommendation:
      'Renforcez vos stratégies de coping et identifiez vos sources de stress principales pour mieux les gérer.',
  },
  {
    range: '40 – 59%',
    label: 'Moyen',
    color: 'text-amber-600',
    description:
      'Votre niveau de stress est modéré à élevé. Certaines dimensions nécessitent un travail ciblé.',
    recommendation:
      'Un programme de gestion du stress structuré (cohérence cardiaque, méditation, activité physique) est recommandé.',
  },
  {
    range: '< 40%',
    label: 'À améliorer',
    color: 'text-red-600',
    description:
      'Votre niveau de stress est élevé et affecte probablement votre quotidien. La fatigue et le manque de résilience sont des signaux d\'alerte.',
    recommendation:
      'Nous recommandons un accompagnement professionnel (psychologue, médecin) et des mesures immédiates de réduction du stress.',
  },
]
