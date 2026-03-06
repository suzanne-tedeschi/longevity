// ──────────────────────────────────────────────────────
// Bilan Santé Émotionnelle — Data Model
// Basé sur le B-PANAS, l'Échelle de Satisfaction de Vie
// de Diener et le TEIQue (Trait Emotional Intelligence)
// ──────────────────────────────────────────────────────

export interface ScoreOption {
  value: number
  label: string
  description: string
}

export interface EmotionnelTest {
  id: string
  name: string
  description: string
  criteria: string
  scoring: ScoreOption[]
  tip?: string
}

export type SectionIcon = 'emotions' | 'satisfaction' | 'intelligence'

export interface TestSection {
  id: string
  title: string
  subtitle: string
  icon: SectionIcon
  description: string
  maxScore: number
  tests: EmotionnelTest[]
}

export interface ScoreInterpretation {
  range: string
  label: string
  color: string
  description: string
  recommendation: string
}

// ── Scoring grids ──

// B-PANAS: Positive affect items (higher = more positive emotions = better)
const panasPositiveScoring: ScoreOption[] = [
  { value: 0, label: 'Jamais', description: 'Pas du tout ressentie' },
  { value: 1, label: 'Rarement', description: 'Ressentie occasionnellement' },
  { value: 2, label: 'Modérément', description: 'Ressentie de temps en temps' },
  { value: 3, label: 'Souvent', description: 'Ressentie régulièrement' },
  { value: 4, label: 'Toujours', description: 'Ressentie en permanence' },
]

// B-PANAS: Negative affect items (reversed: low NA = better)
const panasNegativeScoring: ScoreOption[] = [
  { value: 4, label: 'Jamais', description: 'Pas du tout ressentie' },
  { value: 3, label: 'Rarement', description: 'Ressentie occasionnellement' },
  { value: 2, label: 'Modérément', description: 'Ressentie de temps en temps' },
  { value: 1, label: 'Souvent', description: 'Ressentie régulièrement' },
  { value: 0, label: 'Toujours', description: 'Ressentie en permanence' },
]

// Diener: 7-point Likert agreement scale
const dienerScoring: ScoreOption[] = [
  { value: 0, label: 'Fortement en désaccord', description: 'Vous êtes en total désaccord' },
  { value: 1, label: 'En désaccord', description: 'Vous n\'êtes pas d\'accord' },
  { value: 2, label: 'Légèrement en désaccord', description: 'Vous êtes plutôt en désaccord' },
  { value: 3, label: 'Neutre', description: 'Ni en accord ni en désaccord' },
  { value: 4, label: 'Légèrement en accord', description: 'Vous êtes plutôt d\'accord' },
  { value: 5, label: 'En accord', description: 'Vous êtes d\'accord' },
  { value: 6, label: 'Fortement en accord', description: 'Vous êtes en total accord' },
]

// TEIQue: Normal items (higher agreement = higher EQ = better)
const teiqNormalScoring: ScoreOption[] = [
  { value: 0, label: 'Complètement en désaccord', description: 'Pas du tout d\'accord' },
  { value: 1, label: 'En désaccord', description: 'Plutôt pas d\'accord' },
  { value: 2, label: 'Plutôt en désaccord', description: 'Légèrement en désaccord' },
  { value: 3, label: 'Neutre', description: 'Ni d\'accord ni en désaccord' },
  { value: 4, label: 'Plutôt d\'accord', description: 'Légèrement d\'accord' },
  { value: 5, label: 'D\'accord', description: 'Assez d\'accord' },
  { value: 6, label: 'Complètement d\'accord', description: 'Tout à fait d\'accord' },
]

// TEIQue: Reversed items (lower agreement = higher EQ)
const teiqReversedScoring: ScoreOption[] = [
  { value: 6, label: 'Complètement en désaccord', description: 'Pas du tout d\'accord' },
  { value: 5, label: 'En désaccord', description: 'Plutôt pas d\'accord' },
  { value: 4, label: 'Plutôt en désaccord', description: 'Légèrement en désaccord' },
  { value: 3, label: 'Neutre', description: 'Ni d\'accord ni en désaccord' },
  { value: 2, label: 'Plutôt d\'accord', description: 'Légèrement d\'accord' },
  { value: 1, label: 'D\'accord', description: 'Assez d\'accord' },
  { value: 0, label: 'Complètement d\'accord', description: 'Tout à fait d\'accord' },
]

// ══════════════════════════════════════════════════════
// SECTION 1 — B-PANAS (20 items)
// Mesure de l'état émotionnel — Affects positifs & négatifs
// PA items: 1,3,5,9,10,12,14,16,17,19
// NA items: 2,4,6,7,8,11,13,15,18,20
// ══════════════════════════════════════════════════════
const bpanasSection: TestSection = {
  id: 'b-panas',
  title: 'État émotionnel',
  subtitle: 'B-PANAS — Affects positifs & négatifs',
  icon: 'emotions',
  description:
    'Ces questions évaluent vos émotions ressenties au cours des dernières semaines. Indiquez à quel point vous avez ressenti chaque émotion.',
  maxScore: 80,
  tests: [
    {
      id: 'emo-1', name: 'Intéressé(e)', description: 'Affect positif — Curiosité & engagement',
      criteria: 'Au cours des dernières semaines, à quel point vous êtes-vous senti(e) intéressé(e) ?',
      scoring: panasPositiveScoring,
    },
    {
      id: 'emo-2', name: 'Perturbé(e)', description: 'Affect négatif — Inquiétude & confusion',
      criteria: 'Au cours des dernières semaines, à quel point vous êtes-vous senti(e) perturbé(e) ?',
      scoring: panasNegativeScoring,
    },
    {
      id: 'emo-3', name: 'Excité(e)', description: 'Affect positif — Enthousiasme & énergie',
      criteria: 'Au cours des dernières semaines, à quel point vous êtes-vous senti(e) excité(e) ?',
      scoring: panasPositiveScoring,
    },
    {
      id: 'emo-4', name: 'Bouleversé(e)', description: 'Affect négatif — Détresse émotionnelle',
      criteria: 'Au cours des dernières semaines, à quel point vous êtes-vous senti(e) bouleversé(e) ?',
      scoring: panasNegativeScoring,
    },
    {
      id: 'emo-5', name: 'Fort(e)', description: 'Affect positif — Force intérieure',
      criteria: 'Au cours des dernières semaines, à quel point vous êtes-vous senti(e) fort(e) ?',
      scoring: panasPositiveScoring,
    },
    {
      id: 'emo-6', name: 'Coupable', description: 'Affect négatif — Culpabilité',
      criteria: 'Au cours des dernières semaines, à quel point vous êtes-vous senti(e) coupable ?',
      scoring: panasNegativeScoring,
    },
    {
      id: 'emo-7', name: 'Effrayé(e)', description: 'Affect négatif — Peur & anxiété',
      criteria: 'Au cours des dernières semaines, à quel point vous êtes-vous senti(e) effrayé(e) ?',
      scoring: panasNegativeScoring,
    },
    {
      id: 'emo-8', name: 'Hostile', description: 'Affect négatif — Irritation & agressivité',
      criteria: 'Au cours des dernières semaines, à quel point vous êtes-vous senti(e) hostile ?',
      scoring: panasNegativeScoring,
    },
    {
      id: 'emo-9', name: 'Enthousiaste', description: 'Affect positif — Dynamisme & passion',
      criteria: 'Au cours des dernières semaines, à quel point vous êtes-vous senti(e) enthousiaste ?',
      scoring: panasPositiveScoring,
    },
    {
      id: 'emo-10', name: 'Fier(ière)', description: 'Affect positif — Estime & accomplissement',
      criteria: 'Au cours des dernières semaines, à quel point vous êtes-vous senti(e) fier(ière) ?',
      scoring: panasPositiveScoring,
    },
    {
      id: 'emo-11', name: 'Irritable', description: 'Affect négatif — Agacement & frustration',
      criteria: 'Au cours des dernières semaines, à quel point vous êtes-vous senti(e) irritable ?',
      scoring: panasNegativeScoring,
    },
    {
      id: 'emo-12', name: 'Vigilant(e)', description: 'Affect positif — Attention & éveil',
      criteria: 'Au cours des dernières semaines, à quel point vous êtes-vous senti(e) vigilant(e) ?',
      scoring: panasPositiveScoring,
    },
    {
      id: 'emo-13', name: 'Honteux(se)', description: 'Affect négatif — Honte & embarras',
      criteria: 'Au cours des dernières semaines, à quel point vous êtes-vous senti(e) honteux(se) ?',
      scoring: panasNegativeScoring,
    },
    {
      id: 'emo-14', name: 'Inspiré(e)', description: 'Affect positif — Inspiration & créativité',
      criteria: 'Au cours des dernières semaines, à quel point vous êtes-vous senti(e) inspiré(e) ?',
      scoring: panasPositiveScoring,
    },
    {
      id: 'emo-15', name: 'Nerveux(se)', description: 'Affect négatif — Tension & stress',
      criteria: 'Au cours des dernières semaines, à quel point vous êtes-vous senti(e) nerveux(se) ?',
      scoring: panasNegativeScoring,
    },
    {
      id: 'emo-16', name: 'Déterminé(e)', description: 'Affect positif — Volonté & persévérance',
      criteria: 'Au cours des dernières semaines, à quel point vous êtes-vous senti(e) déterminé(e) ?',
      scoring: panasPositiveScoring,
    },
    {
      id: 'emo-17', name: 'Attentif(ve)', description: 'Affect positif — Concentration & présence',
      criteria: 'Au cours des dernières semaines, à quel point vous êtes-vous senti(e) attentif(ve) ?',
      scoring: panasPositiveScoring,
    },
    {
      id: 'emo-18', name: 'Agité(e)', description: 'Affect négatif — Agitation & nervosité',
      criteria: 'Au cours des dernières semaines, à quel point vous êtes-vous senti(e) agité(e) ?',
      scoring: panasNegativeScoring,
    },
    {
      id: 'emo-19', name: 'Actif(ve)', description: 'Affect positif — Activité & dynamisme',
      criteria: 'Au cours des dernières semaines, à quel point vous êtes-vous senti(e) actif(ve) ?',
      scoring: panasPositiveScoring,
    },
    {
      id: 'emo-20', name: 'Apeuré(e)', description: 'Affect négatif — Peur profonde',
      criteria: 'Au cours des dernières semaines, à quel point vous êtes-vous senti(e) apeuré(e) ?',
      scoring: panasNegativeScoring,
    },
  ],
}

// ══════════════════════════════════════════════════════
// SECTION 2 — Satisfaction de Vie (Diener, 5 items)
// Perception subjective du bonheur et de la satisfaction
// ══════════════════════════════════════════════════════
const dienerSection: TestSection = {
  id: 'satisfaction-vie',
  title: 'Satisfaction de vie',
  subtitle: 'Échelle de Diener — Perception du bonheur',
  icon: 'satisfaction',
  description:
    'Ces questions évaluent votre satisfaction globale par rapport à votre vie. Indiquez votre degré d\'accord avec chaque affirmation.',
  maxScore: 30,
  tests: [
    {
      id: 'sat-1', name: 'Idéaux de vie', description: 'Adéquation vie réelle / vie idéale',
      criteria: 'En général, ma vie correspond de près à mes idéaux.',
      scoring: dienerScoring,
      tip: 'Pensez à ce qui serait votre vie idéale et comparez avec votre situation actuelle.',
    },
    {
      id: 'sat-2', name: 'Conditions de vie', description: 'Qualité de vos conditions actuelles',
      criteria: 'Mes conditions de vie sont excellentes.',
      scoring: dienerScoring,
    },
    {
      id: 'sat-3', name: 'Satisfaction globale', description: 'Contentement de votre vie',
      criteria: 'Je suis satisfait(e) de ma vie.',
      scoring: dienerScoring,
    },
    {
      id: 'sat-4', name: 'Accomplissements', description: 'Obtention des objectifs importants',
      criteria: 'Jusqu\'à maintenant, j\'ai obtenu les choses importantes que je voulais de la vie.',
      scoring: dienerScoring,
    },
    {
      id: 'sat-5', name: 'Choix de vie', description: 'Absence de regrets majeurs',
      criteria: 'Si je pouvais recommencer ma vie, je n\'y changerais presque rien.',
      scoring: dienerScoring,
    },
  ],
}

// ══════════════════════════════════════════════════════
// SECTION 3 — TEIQue (30 items)
// Intelligence émotionnelle — 4 dimensions :
//   Bien-être (9,20,24,27), Maîtrise de soi (4,5,8,18,19),
//   Sensibilité émotionnelle (1,10,16,17,23,25,28),
//   Sociabilité (6,11,13,21,26,30)
// Reverse items: 2,4,5,7,8,10,12,13,14,16,18,22,25,26,28
// ══════════════════════════════════════════════════════
const teiqSection: TestSection = {
  id: 'teiq',
  title: 'Intelligence émotionnelle',
  subtitle: 'TEIQue — Gestion émotionnelle & adaptation',
  icon: 'intelligence',
  description:
    'Ces affirmations évaluent votre intelligence émotionnelle : capacité à comprendre, exprimer et réguler vos émotions. Indiquez votre degré d\'accord.',
  maxScore: 180,
  tests: [
    {
      id: 'teiq-1', name: 'Expression émotionnelle', description: 'Sensibilité émotionnelle',
      criteria: 'Exprimer mes émotions avec des mots ne me pose pas de problème.',
      scoring: teiqNormalScoring,
    },
    {
      id: 'teiq-2', name: 'Empathie cognitive', description: 'Sensibilité émotionnelle',
      criteria: 'J\'ai souvent du mal à voir les choses du point de vue des autres.',
      scoring: teiqReversedScoring,
    },
    {
      id: 'teiq-3', name: 'Motivation personnelle', description: 'Bien-être & dynamisme',
      criteria: 'Dans l\'ensemble, je suis une personne très motivée.',
      scoring: teiqNormalScoring,
    },
    {
      id: 'teiq-4', name: 'Régulation émotionnelle', description: 'Maîtrise de soi',
      criteria: 'J\'ai généralement du mal à réguler mes émotions.',
      scoring: teiqReversedScoring,
    },
    {
      id: 'teiq-5', name: 'Plaisir de vivre', description: 'Bien-être',
      criteria: 'En général, je ne trouve pas la vie agréable.',
      scoring: teiqReversedScoring,
    },
    {
      id: 'teiq-6', name: 'Relations sociales', description: 'Sociabilité',
      criteria: 'Je peux faire face efficacement aux gens.',
      scoring: teiqNormalScoring,
    },
    {
      id: 'teiq-7', name: 'Constance des opinions', description: 'Maîtrise de soi',
      criteria: 'Je change souvent d\'avis.',
      scoring: teiqReversedScoring,
    },
    {
      id: 'teiq-8', name: 'Conscience émotionnelle', description: 'Maîtrise de soi',
      criteria: 'Souvent, je ne sais pas quelle émotion je ressens.',
      scoring: teiqReversedScoring,
    },
    {
      id: 'teiq-9', name: 'Estime de soi', description: 'Bien-être',
      criteria: 'Je me trouve de nombreuses qualités.',
      scoring: teiqNormalScoring,
    },
    {
      id: 'teiq-10', name: 'Affirmation de soi', description: 'Sensibilité émotionnelle',
      criteria: 'J\'ai souvent du mal à défendre mes droits.',
      scoring: teiqReversedScoring,
    },
    {
      id: 'teiq-11', name: 'Influence émotionnelle', description: 'Sociabilité',
      criteria: 'J\'influence généralement la manière dont les autres se sentent.',
      scoring: teiqNormalScoring,
    },
    {
      id: 'teiq-12', name: 'Optimisme', description: 'Bien-être',
      criteria: 'En général, j\'ai une vision pessimiste des choses.',
      scoring: teiqReversedScoring,
    },
    {
      id: 'teiq-13', name: 'Attention aux proches', description: 'Sociabilité',
      criteria: 'Mes proches se plaignent souvent de mon manque d\'attention envers eux.',
      scoring: teiqReversedScoring,
    },
    {
      id: 'teiq-14', name: 'Adaptabilité', description: 'Maîtrise de soi',
      criteria: 'J\'ai souvent du mal à adapter ma vie en fonction des circonstances.',
      scoring: teiqReversedScoring,
    },
    {
      id: 'teiq-15', name: 'Gestion du stress', description: 'Maîtrise de soi',
      criteria: 'Dans l\'ensemble, je gère bien le stress.',
      scoring: teiqNormalScoring,
    },
    {
      id: 'teiq-16', name: 'Expression affective', description: 'Sensibilité émotionnelle',
      criteria: 'J\'ai du mal à montrer mon affection aux personnes proches.',
      scoring: teiqReversedScoring,
    },
    {
      id: 'teiq-17', name: 'Empathie émotionnelle', description: 'Sensibilité émotionnelle',
      criteria: 'Je me mets facilement à la place des autres et ressens leurs émotions.',
      scoring: teiqNormalScoring,
    },
    {
      id: 'teiq-18', name: 'Persévérance', description: 'Maîtrise de soi',
      criteria: 'J\'ai souvent du mal à rester motivé.',
      scoring: teiqReversedScoring,
    },
    {
      id: 'teiq-19', name: 'Contrôle émotionnel', description: 'Maîtrise de soi',
      criteria: 'Je trouve généralement des moyens de contrôler mes émotions quand je le veux.',
      scoring: teiqNormalScoring,
    },
    {
      id: 'teiq-20', name: 'Satisfaction personnelle', description: 'Bien-être',
      criteria: 'Dans l\'ensemble, je suis satisfait de ma vie.',
      scoring: teiqNormalScoring,
    },
    {
      id: 'teiq-21', name: 'Négociation', description: 'Sociabilité',
      criteria: 'Je me décrirais comme un bon négociateur.',
      scoring: teiqNormalScoring,
    },
    {
      id: 'teiq-22', name: 'Impulsivité', description: 'Maîtrise de soi',
      criteria: 'Je m\'implique souvent dans des choses que je regrette par la suite.',
      scoring: teiqReversedScoring,
    },
    {
      id: 'teiq-23', name: 'Introspection', description: 'Sensibilité émotionnelle',
      criteria: 'Je prends souvent le temps de réfléchir à mes émotions.',
      scoring: teiqNormalScoring,
    },
    {
      id: 'teiq-24', name: 'Forces personnelles', description: 'Bien-être',
      criteria: 'Je me sens plein de forces personnelles.',
      scoring: teiqNormalScoring,
    },
    {
      id: 'teiq-25', name: 'Abandon prématuré', description: 'Sensibilité émotionnelle',
      criteria: 'J\'ai tendance à « baisser les bras » même quand j\'ai raison.',
      scoring: teiqReversedScoring,
    },
    {
      id: 'teiq-26', name: 'Influence sur les autres', description: 'Sociabilité',
      criteria: 'Je n\'ai aucun pouvoir sur les émotions des autres.',
      scoring: teiqReversedScoring,
    },
    {
      id: 'teiq-27', name: 'Confiance en l\'avenir', description: 'Bien-être',
      criteria: 'Je crois généralement que tout ira bien pour moi.',
      scoring: teiqNormalScoring,
    },
    {
      id: 'teiq-28', name: 'Connexion affective', description: 'Sensibilité émotionnelle',
      criteria: 'J\'ai du mal à nouer des liens même avec mes proches.',
      scoring: teiqReversedScoring,
    },
    {
      id: 'teiq-29', name: 'Adaptation environnementale', description: 'Sociabilité',
      criteria: 'En général, je m\'adapte facilement à de nouveaux environnements.',
      scoring: teiqNormalScoring,
    },
    {
      id: 'teiq-30', name: 'Sérénité perçue', description: 'Sociabilité',
      criteria: 'Les autres m\'admirent pour ma capacité à rester détendu.',
      scoring: teiqNormalScoring,
    },
  ],
}

// ══════════════════════════════════════════════════════
// EXPORTS
// ══════════════════════════════════════════════════════

export const allSections: TestSection[] = [
  bpanasSection,
  dienerSection,
  teiqSection,
]

export const totalMaxScore = allSections.reduce((sum, s) => sum + s.maxScore, 0)
// 80 + 30 + 180 = 290

export const emotionnelInterpretations: ScoreInterpretation[] = [
  {
    range: '≥ 80%',
    label: 'Excellent',
    color: 'text-emerald-600',
    description:
      'Votre santé émotionnelle est remarquable. Vous ressentez des émotions positives fréquentes, une grande satisfaction de vie et une intelligence émotionnelle développée.',
    recommendation:
      'Continuez à cultiver ces forces. Des pratiques comme la méditation de pleine conscience peuvent maintenir cet équilibre.',
  },
  {
    range: '60 – 79%',
    label: 'Bon',
    color: 'text-sky-600',
    description:
      'Votre bien-être émotionnel est globalement bon, avec quelques axes d\'amélioration identifiés.',
    recommendation:
      'Identifiez les domaines les plus faibles pour y consacrer un travail ciblé. La journalisation émotionnelle peut être un bon outil.',
  },
  {
    range: '40 – 59%',
    label: 'Moyen',
    color: 'text-amber-600',
    description:
      'Votre équilibre émotionnel est modéré. Certaines dimensions nécessitent une attention particulière.',
    recommendation:
      'Un accompagnement psychologique ou un programme de développement des compétences émotionnelles serait bénéfique.',
  },
  {
    range: '< 40%',
    label: 'À améliorer',
    color: 'text-red-600',
    description:
      'Votre santé émotionnelle nécessite une attention sérieuse. Les émotions négatives prédominent ou votre satisfaction de vie est faible.',
    recommendation:
      'Nous recommandons de consulter un professionnel de la santé mentale pour un accompagnement personnalisé.',
  },
]
