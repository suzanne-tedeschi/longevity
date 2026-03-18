// ──────────────────────────────────────────────────────
// Bilan Sommeil — Data Model
// Basé sur le PSQI, le SHI et un questionnaire complémentaire
// ──────────────────────────────────────────────────────

export interface ScoreOption {
  value: number
  label: string
  description: string
}

export interface SommeilTest {
  id: string
  name: string
  description: string
  criteria: string
  scoring: ScoreOption[]
  tip?: string
}

export type SectionIcon = 'troubles' | 'quality' | 'hygiene' | 'profile'

export interface TestSection {
  id: string
  title: string
  subtitle: string
  icon: SectionIcon
  description: string
  maxScore: number
  tests: SommeilTest[]
}

export interface ScoreInterpretation {
  range: string
  label: string
  color: string
  description: string
  recommendation: string
}

// ── Scoring grids ──

const psqiFrequencyScoring: ScoreOption[] = [
  { value: 0, label: 'Trois fois ou plus / semaine', description: 'Cela arrive 3 à 7 fois par semaine' },
  { value: 1, label: 'Une à deux fois / semaine', description: 'Cela arrive 1 à 2 fois par semaine' },
  { value: 2, label: 'Moins d\'une fois / semaine', description: 'Cela arrive moins d\'une fois par semaine' },
  { value: 3, label: 'Jamais ce mois-ci', description: 'Pas du tout au cours du dernier mois' },
]

const shiFrequencyScoring: ScoreOption[] = [
  { value: 0, label: 'Toujours / Souvent', description: '3 jours sur 7 ou plus' },
  { value: 1, label: 'Parfois', description: '1 à 2 fois par semaine' },
  { value: 2, label: 'Rarement', description: '1 à 2 fois par mois' },
  { value: 3, label: 'Jamais', description: 'Cela ne m\'arrive pas' },
]

const profileScoring: ScoreOption[] = [
  { value: 0, label: 'Oui, fréquemment', description: 'C\'est un problème régulier' },
  { value: 1, label: 'Oui, parfois', description: 'Cela arrive occasionnellement' },
  { value: 2, label: 'Rarement', description: 'Très rarement ou presque jamais' },
  { value: 3, label: 'Non, jamais', description: 'Ce n\'est jamais le cas' },
]

// ══════════════════════════════════════════════════════
// SECTION 1 — Troubles du sommeil (PSQI Q5a-i — 9 tests)
// ══════════════════════════════════════════════════════
const troublesSommeil: TestSection = {
  id: 'troubles-sommeil',
  title: 'Vos nuits',
  subtitle: 'À quelle fréquence votre sommeil est-il perturbé ?',
  icon: 'troubles',
  description:
    'Ces questions évaluent la fréquence de vos difficultés de sommeil au cours du dernier mois. Répondez le plus honnêtement possible.',
  maxScore: 27,
  tests: [
    {
      id: 'som-1',
      name: 'Endormissement difficile',
      description: 'Difficulté à s\'endormir en moins de 30 minutes',
      criteria: 'Au cours du mois dernier, à quelle fréquence n\'avez-vous pas pu vous endormir en moins de 30 minutes ?',
      scoring: psqiFrequencyScoring,
      tip: 'Un temps d\'endormissement supérieur à 30 minutes peut indiquer un problème d\'insomnie d\'endormissement.',
    },
    {
      id: 'som-2',
      name: 'Réveil nocturne',
      description: 'Réveil au milieu de la nuit ou trop tôt le matin',
      criteria: 'Au cours du mois dernier, à quelle fréquence vous êtes-vous réveillé(e) au milieu de la nuit ou trop tôt le matin ?',
      scoring: psqiFrequencyScoring,
    },
    {
      id: 'som-3',
      name: 'Lever pour les toilettes',
      description: 'Besoin de se lever pendant la nuit',
      criteria: 'Au cours du mois dernier, à quelle fréquence avez-vous dû vous lever pour aller aux toilettes ?',
      scoring: psqiFrequencyScoring,
      tip: 'La nycturie (besoin d\'uriner la nuit) peut fragmenter le sommeil et réduire sa qualité réparatrice.',
    },
    {
      id: 'som-4',
      name: 'Difficultés respiratoires',
      description: 'Impossibilité de respirer correctement',
      criteria: 'Au cours du mois dernier, à quelle fréquence n\'avez-vous pas pu respirer correctement pendant la nuit ?',
      scoring: psqiFrequencyScoring,
      tip: 'Des difficultés respiratoires nocturnes peuvent être un signe d\'apnée du sommeil.',
    },
    {
      id: 'som-5',
      name: 'Toux ou ronflement',
      description: 'Toux ou ronflements bruyants',
      criteria: 'Au cours du mois dernier, à quelle fréquence avez-vous toussé ou ronflé bruyamment ?',
      scoring: psqiFrequencyScoring,
    },
    {
      id: 'som-6',
      name: 'Sensation de froid',
      description: 'Avoir trop froid pendant la nuit',
      criteria: 'Au cours du mois dernier, à quelle fréquence avez-vous eu trop froid pendant la nuit ?',
      scoring: psqiFrequencyScoring,
      tip: 'La température idéale de la chambre se situe entre 16°C et 19°C.',
    },
    {
      id: 'som-7',
      name: 'Sensation de chaleur',
      description: 'Avoir trop chaud pendant la nuit',
      criteria: 'Au cours du mois dernier, à quelle fréquence avez-vous eu trop chaud pendant la nuit ?',
      scoring: psqiFrequencyScoring,
    },
    {
      id: 'som-8',
      name: 'Mauvais rêves',
      description: 'Cauchemars ou rêves perturbants',
      criteria: 'Au cours du mois dernier, à quelle fréquence avez-vous fait des cauchemars ?',
      scoring: psqiFrequencyScoring,
    },
    {
      id: 'som-9',
      name: 'Douleurs nocturnes',
      description: 'Douleurs empêchant de dormir',
      criteria: 'Au cours du mois dernier, à quelle fréquence avez-vous eu des douleurs qui vous ont empêché(e) de dormir ?',
      scoring: psqiFrequencyScoring,
    },
  ],
}

// ══════════════════════════════════════════════════════
// SECTION 2 — Qualité & Impact diurne (PSQI Q6-Q9 — 4 tests)
// ══════════════════════════════════════════════════════
const qualiteImpact: TestSection = {
  id: 'qualite-impact',
  title: 'Comment vous dormez',
  subtitle: 'Votre ressenti au réveil et dans la journée',
  icon: 'quality',
  description:
    'Ces questions évaluent votre perception globale de la qualité de votre sommeil et son impact sur vos activités quotidiennes.',
  maxScore: 12,
  tests: [
    {
      id: 'qual-1',
      name: 'Qualité globale du sommeil',
      description: 'Évaluation subjective de la qualité de votre sommeil',
      criteria: 'Comment évalueriez-vous globalement la qualité de votre sommeil au cours du dernier mois ?',
      scoring: [
        { value: 0, label: 'Très mauvaise', description: 'Sommeil de très mauvaise qualité, non réparateur' },
        { value: 1, label: 'Assez mauvaise', description: 'Sommeil plutôt insatisfaisant' },
        { value: 2, label: 'Assez bonne', description: 'Sommeil globalement satisfaisant' },
        { value: 3, label: 'Très bonne', description: 'Sommeil de très bonne qualité, réparateur' },
      ],
    },
    {
      id: 'qual-2',
      name: 'Recours aux médicaments',
      description: 'Utilisation de médicaments pour dormir',
      criteria: 'Au cours du mois dernier, combien de fois avez-vous pris des médicaments (prescrits ou non) pour faciliter votre sommeil ?',
      scoring: psqiFrequencyScoring,
      tip: 'L\'usage régulier de somnifères peut masquer un trouble sous-jacent qu\'il est préférable de traiter.',
    },
    {
      id: 'qual-3',
      name: 'Somnolence diurne',
      description: 'Difficulté à rester éveillé(e) dans la journée',
      criteria: 'Au cours du mois dernier, combien de fois avez-vous eu des difficultés à demeurer éveillé(e) (conduite, repas, activités sociales) ?',
      scoring: psqiFrequencyScoring,
      tip: 'La somnolence diurne excessive est un signe important de dette de sommeil ou de trouble du sommeil.',
    },
    {
      id: 'qual-4',
      name: 'Enthousiasme et motivation',
      description: 'Impact sur votre énergie quotidienne',
      criteria: 'Au cours du mois dernier, à quel point votre manque d\'enthousiasme a-t-il eu une influence sur vos activités (travail, vie sociale, loisirs) ?',
      scoring: [
        { value: 0, label: 'Un très gros problème', description: 'Très affecté(e), manque total de motivation' },
        { value: 1, label: 'Un certain problème', description: 'Notablement diminué(e) dans vos activités' },
        { value: 2, label: 'Un tout petit problème', description: 'Légèrement affecté(e)' },
        { value: 3, label: 'Pas du tout un problème', description: 'Aucun impact sur votre énergie' },
      ],
    },
  ],
}

// ══════════════════════════════════════════════════════
// SECTION 3 — Hygiène du sommeil (SHI — 10 tests)
// ══════════════════════════════════════════════════════
const hygieneSommeil: TestSection = {
  id: 'hygiene-sommeil',
  title: 'Vos habitudes avant de dormir',
  subtitle: 'Écrans, caféine, routine du soir…',
  icon: 'hygiene',
  description:
    'Ces questions évaluent vos habitudes et comportements qui peuvent affecter la qualité de votre sommeil. Répondez en pensant à un mois typique.',
  maxScore: 30,
  tests: [
    {
      id: 'hyg-1',
      name: 'Horaires de coucher irréguliers',
      description: 'Se coucher à des heures différentes chaque jour',
      criteria: 'Je vais me coucher à des heures différentes chaque jour.',
      scoring: shiFrequencyScoring,
      tip: 'La régularité des horaires de coucher est l\'un des piliers d\'un sommeil de qualité.',
    },
    {
      id: 'hyg-2',
      name: 'Activités au lit hors sommeil',
      description: 'TV, repas, travail au lit quand vous ne pouvez pas dormir',
      criteria: 'Je sors du lit pour faire des activités non liées au sommeil (TV, repas, travail…) lorsque je ne peux pas dormir.',
      scoring: shiFrequencyScoring,
    },
    {
      id: 'hyg-3',
      name: 'Temps éveillé au lit',
      description: 'Rester au lit plus de 30 minutes sans dormir',
      criteria: 'Le soir, une fois couché(e), je mets plus de 30 minutes à m\'endormir.',
      scoring: shiFrequencyScoring,
      tip: 'Si vous ne dormez pas après 20-30 minutes, il est recommandé de quitter le lit et d\'y revenir quand le sommeil revient.',
    },
    {
      id: 'hyg-4',
      name: 'Caféine tardive',
      description: 'Boissons caféinées dans les 4 à 9h avant le coucher',
      criteria: 'Je bois des boissons caféinées dans les 6 heures avant de me coucher.',
      scoring: shiFrequencyScoring,
      tip: 'La caféine a une demi-vie de 5 à 7 heures. Un café à 16h peut encore affecter votre endormissement.',
    },
    {
      id: 'hyg-5',
      name: 'Horaires de lever irréguliers',
      description: 'Se lever à des heures différentes chaque jour',
      criteria: 'Je me lève à des heures différentes chaque jour.',
      scoring: shiFrequencyScoring,
    },
    {
      id: 'hyg-6',
      name: 'Siestes prolongées',
      description: 'Siestes de plus de 30 minutes',
      criteria: 'Je fais régulièrement des siestes de plus de 30 minutes.',
      scoring: shiFrequencyScoring,
      tip: 'Les siestes de 10 à 20 minutes sont bénéfiques. Au-delà de 30 minutes, elles peuvent perturber le sommeil nocturne.',
    },
    {
      id: 'hyg-7',
      name: 'Écrans au lit',
      description: 'Utilisation d\'appareils électroniques au lit',
      criteria: 'J\'utilise des appareils électroniques (téléphone, tablette, ordinateur) au lit.',
      scoring: shiFrequencyScoring,
      tip: 'La lumière bleue des écrans supprime la sécrétion de mélatonine et retarde l\'endormissement.',
    },
    {
      id: 'hyg-8',
      name: 'Repas lourds tardifs',
      description: 'Repas lourds, épicés ou sucrés dans les 2h avant le coucher',
      criteria: 'Je consomme des repas lourds, épicés ou sucrés moins de 2 heures avant de dormir.',
      scoring: shiFrequencyScoring,
    },
    {
      id: 'hyg-9',
      name: 'Exercice tardif',
      description: 'Exercice physique intense dans les 2h avant le coucher',
      criteria: 'Je fais de l\'exercice physique intense dans les 2 heures précédant le coucher.',
      scoring: shiFrequencyScoring,
      tip: 'L\'exercice régulier améliore le sommeil, mais un effort intense trop tard stimule le système nerveux.',
    },
    {
      id: 'hyg-10',
      name: 'Alcool avant le coucher',
      description: 'Consommation d\'alcool dans les 4h avant le coucher',
      criteria: 'Je consomme de l\'alcool dans les 4 heures précédant le coucher.',
      scoring: shiFrequencyScoring,
      tip: 'L\'alcool facilite l\'endormissement mais fragmente le sommeil en seconde partie de nuit.',
    },
  ],
}

// ══════════════════════════════════════════════════════
// SECTION 4 — Profil complémentaire (10 tests)
// ══════════════════════════════════════════════════════
const profilComplementaire: TestSection = {
  id: 'profil-complementaire',
  title: 'Signaux à surveiller',
  subtitle: 'Ronflements, apnées, jambes sans repos…',
  icon: 'profile',
  description:
    'Ces questions permettent de détecter des troubles spécifiques (hyperéveil, apnées, jambes sans repos) et d\'affiner votre profil sommeil.',
  maxScore: 30,
  tests: [
    {
      id: 'prof-1',
      name: 'Cerveau hyperactif au coucher',
      description: 'Impression que le cerveau ne s\'éteint pas',
      criteria: 'Avez-vous souvent l\'impression que votre cerveau ne s\'éteint pas au moment du coucher ?',
      scoring: profileScoring,
      tip: 'L\'hyperéveil cognitif est l\'une des causes principales d\'insomnie. Des techniques de relaxation peuvent aider.',
    },
    {
      id: 'prof-2',
      name: 'Ruminations au coucher',
      description: 'Pensées liées au travail, à l\'organisation ou à des conflits',
      criteria: 'Ruminez-vous des pensées liées au travail, à l\'organisation ou à des conflits au moment du coucher ?',
      scoring: profileScoring,
    },
    {
      id: 'prof-3',
      name: 'Activation physique au lit',
      description: 'Palpitations, chaleur interne ou agitation corporelle',
      criteria: 'Sentez-vous parfois le cœur qui bat fort, de la chaleur interne ou de l\'agitation corporelle au lit ?',
      scoring: profileScoring,
      tip: 'Ces symptômes peuvent indiquer une activation du système nerveux sympathique incompatible avec l\'endormissement.',
    },
    {
      id: 'prof-4',
      name: 'Meilleur sommeil en vacances',
      description: 'Sommeil de meilleure qualité hors du domicile',
      criteria: 'Votre sommeil est-il meilleur en vacances ou hors de votre domicile ?',
      scoring: [
        { value: 0, label: 'Oui, nettement', description: 'Mon sommeil est bien meilleur ailleurs' },
        { value: 1, label: 'Oui, un peu', description: 'Légère amélioration hors domicile' },
        { value: 2, label: 'Pas vraiment', description: 'Peu de différence' },
        { value: 3, label: 'Non, pareil', description: 'Mon sommeil est identique partout' },
      ],
    },
    {
      id: 'prof-5',
      name: 'Réveil non récupérateur',
      description: 'Se réveiller plus fatigué(e) qu\'au coucher',
      criteria: 'Vous réveillez-vous parfois plus fatigué(e) qu\'au moment du coucher ?',
      scoring: profileScoring,
      tip: 'Un sommeil non récupérateur peut indiquer des micro-éveils, une apnée ou un déficit de sommeil profond.',
    },
    {
      id: 'prof-6',
      name: 'Ronflement régulier',
      description: 'Ronflements signalés par l\'entourage',
      criteria: 'Ronflez-vous régulièrement ? (ou vous a-t-on déjà fait la remarque ?)',
      scoring: profileScoring,
      tip: 'Le ronflement peut être bénin mais aussi un signe de syndrome d\'apnées du sommeil.',
    },
    {
      id: 'prof-7',
      name: 'Bouche sèche ou maux de tête au réveil',
      description: 'Signes potentiels d\'apnée du sommeil',
      criteria: 'Avez-vous parfois des réveils avec la bouche sèche ou des maux de tête matinaux ?',
      scoring: profileScoring,
    },
    {
      id: 'prof-8',
      name: 'Envies de bouger les jambes',
      description: 'Envies irrépressibles de bouger les jambes le soir',
      criteria: 'Avez-vous des envies irrépressibles de bouger les jambes le soir, au repos ?',
      scoring: profileScoring,
      tip: 'Le syndrome des jambes sans repos touche 5 à 10% de la population et perturbe significativement le sommeil.',
    },
    {
      id: 'prof-9',
      name: 'Réveils sans raison',
      description: 'Réveils fréquents sans raison apparente',
      criteria: 'Vous réveillez-vous souvent la nuit sans raison apparente ?',
      scoring: profileScoring,
    },
    {
      id: 'prof-10',
      name: 'Douleurs chroniques',
      description: 'Douleurs (dos, articulations, digestives) perturbant le sommeil',
      criteria: 'Avez-vous des douleurs chroniques (dos, articulations, digestives) qui perturbent votre sommeil ?',
      scoring: profileScoring,
    },
  ],
}

// ══════════════════════════════════════════════════════
// EXPORTS
// ══════════════════════════════════════════════════════

export const allSections: TestSection[] = [
  troublesSommeil,
  qualiteImpact,
  hygieneSommeil,
  profilComplementaire,
]

export const totalMaxScore = allSections.reduce((sum, s) => sum + s.maxScore, 0)

export const sommeilInterpretations: ScoreInterpretation[] = [
  {
    range: '≥ 80%',
    label: 'Excellent',
    color: 'text-emerald-600',
    description: 'Votre sommeil est de très bonne qualité avec d\'excellentes habitudes.',
    recommendation: 'Continuez ainsi ! Quelques ajustements mineurs pourront optimiser votre récupération.',
  },
  {
    range: '60 – 79%',
    label: 'Bon',
    color: 'text-sky-600',
    description: 'Votre sommeil est correct avec quelques axes d\'amélioration.',
    recommendation: 'De petits changements dans votre hygiène de sommeil peuvent faire une vraie différence.',
  },
  {
    range: '40 – 59%',
    label: 'Moyen',
    color: 'text-amber-600',
    description: 'Votre sommeil présente des perturbations significatives.',
    recommendation: 'Un programme structuré d\'hygiène du sommeil et de gestion du stress est recommandé.',
  },
  {
    range: '< 40%',
    label: 'À améliorer',
    color: 'text-red-600',
    description: 'Votre sommeil est significativement perturbé et affecte probablement votre quotidien.',
    recommendation: 'Un bilan approfondi avec un spécialiste du sommeil serait bénéfique. Votre programme intègrera les priorités identifiées.',
  },
]
