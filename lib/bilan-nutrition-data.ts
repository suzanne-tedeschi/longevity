// ──────────────────────────────────────────────────────
// Bilan Nutrition — Data Model
// Partie 1 : Troubles digestifs (GSRS)
// Partie 2 : Questionnaire Alimentaire Structuré
// ──────────────────────────────────────────────────────

export interface ScoreOption {
  value: number
  label: string
  description: string
}

export interface NutritionTest {
  id: string
  name: string
  description: string
  criteria: string
  scoring: ScoreOption[]
  tip?: string
}

export type SectionIcon =
  | 'reflux' | 'pain' | 'indigestion' | 'transit' | 'constipation'
  | 'habitudes' | 'macronutriments' | 'micronutriments' | 'ultra-transformes' | 'inflammatoire' | 'bonus'

export interface TestSection {
  id: string
  title: string
  subtitle: string
  icon: SectionIcon
  description: string
  maxScore: number
  tests: NutritionTest[]
}

export interface ScoreInterpretation {
  range: string
  label: string
  color: string
  description: string
  recommendation: string
}

// ══════════════════════════════════════════════════════
// PARTIE 1 — TROUBLES DIGESTIFS (GSRS adapté)
// ══════════════════════════════════════════════════════

const gsrsScoring: ScoreOption[] = [
  { value: 0, label: 'Inconfort sévère', description: 'Gêne importante, fréquente, limitant vos activités' },
  { value: 1, label: 'Inconfort modéré', description: 'Gêne régulière, commence à perturber le quotidien' },
  { value: 2, label: 'Gêne légère', description: 'Gêne occasionnelle, sans impact majeur' },
  { value: 3, label: 'Aucun inconfort', description: 'Pas de gêne du tout au cours de la semaine' },
]

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
// PARTIE 2 — QUESTIONNAIRE ALIMENTAIRE
// ══════════════════════════════════════════════════════

// Questions positives : Oui = score indiqué, Non = 0
// Questions négatives (score < 0) : Oui = score indiqué (pénalité), Non = 0
// On décale tout pour rester positif dans l'UI (0 = mauvais, 1 = bon)
// Le scoring binaire : Oui/Non
const ouiPositifScoring = (pts: number): ScoreOption[] => [
  { value: pts, label: 'Oui', description: 'Vous avez cette habitude' },
  { value: 0, label: 'Non', description: 'Vous n\'avez pas cette habitude' },
]

const ouiNegatifScoring = (pts: number): ScoreOption[] => [
  { value: 0, label: 'Oui', description: 'Vous avez cette habitude (défavorable)' },
  { value: Math.abs(pts), label: 'Non', description: 'Vous n\'avez pas cette habitude (favorable)' },
]

const habitudesGenerales: TestSection = {
  id: 'habitudes-generales',
  title: 'Habitudes générales',
  subtitle: 'Vos habitudes alimentaires de base',
  icon: 'habitudes',
  description:
    'Ces questions évaluent vos habitudes alimentaires quotidiennes : rythme des repas, qualité de l\'alimentation et comportement à table.',
  maxScore: 7,
  tests: [
    {
      id: 'hab-1',
      name: 'Petit-déjeuner quotidien',
      description: 'Régularité du premier repas',
      criteria: 'Prenez-vous un petit-déjeuner tous les jours ?',
      scoring: ouiPositifScoring(1),
    },
    {
      id: 'hab-2',
      name: 'Repas à heures régulières',
      description: 'Régularité horaire',
      criteria: 'Mangez-vous à heure régulière ?',
      scoring: ouiPositifScoring(1),
    },
    {
      id: 'hab-3',
      name: 'Grignotage',
      description: 'Grignotage entre les repas',
      criteria: 'Grignotez-vous entre les repas ?',
      scoring: ouiNegatifScoring(1),
      tip: 'Le grignotage perturbe la glycémie et impacte la digestion.',
    },
    {
      id: 'hab-4',
      name: 'Mastication lente',
      description: 'Temps de mastication',
      criteria: 'Mangez-vous lentement, en prenant le temps de mastiquer ?',
      scoring: ouiPositifScoring(1),
      tip: 'Bien mastiquer améliore la digestion et la satiété.',
    },
    {
      id: 'hab-5',
      name: 'Repas fait maison',
      description: 'Au moins un repas cuisiné maison par jour',
      criteria: 'Prenez-vous au moins un repas cuisiné maison par jour ?',
      scoring: ouiPositifScoring(1),
    },
    {
      id: 'hab-6',
      name: 'Hydratation',
      description: 'Boire au moins 1L d\'eau par jour',
      criteria: 'Buvez-vous au moins 1L d\'eau plate par jour ?',
      scoring: ouiPositifScoring(1),
    },
    {
      id: 'hab-7',
      name: 'Sauter des repas',
      description: 'Repas sautés par manque de temps',
      criteria: 'Sautez-vous souvent un repas par manque de temps ?',
      scoring: ouiNegatifScoring(1),
    },
    {
      id: 'hab-8',
      name: 'Manger devant un écran',
      description: 'Repas devant télé, téléphone…',
      criteria: 'Mangez-vous devant un écran (télé, téléphone…) ?',
      scoring: ouiNegatifScoring(1),
      tip: 'Manger en pleine conscience améliore la satiété et la digestion.',
    },
    {
      id: 'hab-9',
      name: 'Environnement calme',
      description: 'Repas dans un cadre serein',
      criteria: 'Prenez-vous vos repas dans un environnement calme ?',
      scoring: ouiPositifScoring(1),
    },
    {
      id: 'hab-10',
      name: 'Conscience faim/satiété',
      description: 'Écoute des signaux corporels',
      criteria: 'Avez-vous conscience de vos sensations de faim et de satiété ?',
      scoring: ouiPositifScoring(1),
    },
  ],
}

const macronutriments: TestSection = {
  id: 'macronutriments',
  title: 'Macronutriments',
  subtitle: 'Apports en protéines, glucides et lipides',
  icon: 'macronutriments',
  description:
    'Ces questions évaluent la qualité et l\'équilibre de vos apports en macronutriments : protéines, glucides et graisses.',
  maxScore: 11,
  tests: [
    {
      id: 'mac-1',
      name: 'Protéines à chaque repas',
      description: 'Sources animales ou végétales',
      criteria: 'Consommez-vous des protéines animales ou végétales à chaque repas principal ?',
      scoring: ouiPositifScoring(2),
      tip: 'Un apport protéique régulier est essentiel pour la masse musculaire et la récupération.',
    },
    {
      id: 'mac-2',
      name: 'Glucides complexes',
      description: 'Pain complet, légumineuses…',
      criteria: 'Mangez-vous des glucides complexes (pain complet, légumineuses) chaque jour ?',
      scoring: ouiPositifScoring(2),
    },
    {
      id: 'mac-3',
      name: 'Féculents raffinés',
      description: 'Pain blanc, pâtes blanches…',
      criteria: 'Consommez-vous des féculents raffinés (pain blanc, pâtes blanches) tous les jours ?',
      scoring: ouiNegatifScoring(1),
    },
    {
      id: 'mac-4',
      name: 'Bonnes graisses',
      description: 'Huile olive, colza, noix…',
      criteria: 'Ajoutez-vous des bonnes graisses (huile olive, colza, noix…) à vos repas ?',
      scoring: ouiPositifScoring(2),
    },
    {
      id: 'mac-5',
      name: 'Ultra-transformés quotidiens',
      description: 'Plats industriels, snacks…',
      criteria: 'Mangez-vous des aliments ultra-transformés (plats industriels, snacks) tous les jours ?',
      scoring: ouiNegatifScoring(2),
      tip: 'Les aliments ultra-transformés sont associés à l\'inflammation chronique et aux maladies métaboliques.',
    },
    {
      id: 'mac-6',
      name: 'Assiette colorée',
      description: 'Au moins 3 couleurs par repas',
      criteria: 'Votre assiette contient-elle au moins 3 couleurs différentes par repas ?',
      scoring: ouiPositifScoring(1),
    },
    {
      id: 'mac-7',
      name: 'Éviter les fritures',
      description: 'Limitation des graisses saturées',
      criteria: 'Évitez-vous les fritures et excès de graisses saturées ?',
      scoring: ouiPositifScoring(1),
    },
    {
      id: 'mac-8',
      name: 'Oméga-3 hebdomadaires',
      description: 'Poisson gras, lin, noix…',
      criteria: 'Consommez-vous une source d\'oméga-3 chaque semaine (poisson gras, lin, noix) ?',
      scoring: ouiPositifScoring(2),
      tip: 'Les oméga-3 sont essentiels pour la santé cardiovasculaire et cognitive.',
    },
  ],
}

const micronutriments: TestSection = {
  id: 'micronutriments',
  title: 'Micronutriments',
  subtitle: 'Vitamines et minéraux essentiels',
  icon: 'micronutriments',
  description:
    'Ces questions évaluent la diversité et la richesse de vos apports en vitamines et minéraux.',
  maxScore: 14,
  tests: [
    {
      id: 'mic-1',
      name: 'Légumes 2x/jour',
      description: 'Consommation bi-quotidienne de légumes',
      criteria: 'Consommez-vous des légumes au moins deux fois par jour ?',
      scoring: ouiPositifScoring(2),
    },
    {
      id: 'mic-2',
      name: 'Fruits frais quotidiens',
      description: 'Au moins un fruit frais par jour',
      criteria: 'Consommez-vous des fruits frais chaque jour ?',
      scoring: ouiPositifScoring(2),
    },
    {
      id: 'mic-3',
      name: 'Calcium',
      description: 'Produits laitiers ou équivalents',
      criteria: 'Consommez-vous des produits laitiers ou équivalents riches en calcium ?',
      scoring: ouiPositifScoring(1),
    },
    {
      id: 'mic-4',
      name: 'Fer',
      description: 'Viande rouge, légumineuses…',
      criteria: 'Votre alimentation contient-elle du fer (viande rouge, légumineuses) ?',
      scoring: ouiPositifScoring(2),
    },
    {
      id: 'mic-5',
      name: 'Iode',
      description: 'Sel iodé ou produits marins',
      criteria: 'Prenez-vous du sel iodé ou consommez-vous des produits marins ?',
      scoring: ouiPositifScoring(1),
    },
    {
      id: 'mic-6',
      name: 'Vitamine D',
      description: 'Exposition soleil ou supplémentation',
      criteria: 'Exposez-vous votre peau au soleil régulièrement ou consommez-vous de la vitamine D ?',
      scoring: ouiPositifScoring(2),
      tip: 'La vitamine D est cruciale pour l\'immunité, les os et la longévité.',
    },
    {
      id: 'mic-7',
      name: 'Zinc',
      description: 'Œufs, huîtres, céréales complètes…',
      criteria: 'Consommez-vous des aliments riches en zinc (œufs, huîtres, fruits de mer, céréales complètes) ?',
      scoring: ouiPositifScoring(1),
    },
    {
      id: 'mic-8',
      name: 'Vitamine C',
      description: 'Fruits et légumes riches en vit. C',
      criteria: 'Consommez-vous des fruits et légumes riches en vitamine C chaque jour ?',
      scoring: ouiPositifScoring(1),
    },
    {
      id: 'mic-9',
      name: 'Magnésium',
      description: 'Légumineuses, chocolat noir, graines…',
      criteria: 'Votre alimentation contient-elle des apports en magnésium réguliers (légumineuses, chocolat noir, graines) ?',
      scoring: ouiPositifScoring(1),
    },
    {
      id: 'mic-10',
      name: 'Folates',
      description: 'Salades vertes, légumineuses…',
      criteria: 'Avez-vous une consommation régulière de folates (salades vertes, légumineuses, légumes verts) ?',
      scoring: ouiPositifScoring(1),
    },
  ],
}

const ultraTransformes: TestSection = {
  id: 'ultra-transformes',
  title: 'Ultra-transformés',
  subtitle: 'Produits industriels et additifs',
  icon: 'ultra-transformes',
  description:
    'Ces questions évaluent votre exposition aux aliments ultra-transformés, nocifs pour la santé métabolique et inflammatoire.',
  maxScore: 11,
  tests: [
    {
      id: 'ut-1',
      name: 'Plats préparés industriels',
      description: 'Plus de 2 fois par semaine',
      criteria: 'Consommez-vous des plats préparés industriels plus de 2 fois par semaine ?',
      scoring: ouiNegatifScoring(2),
    },
    {
      id: 'ut-2',
      name: 'Boissons sucrées',
      description: 'Sodas plus d\'une fois par jour',
      criteria: 'Consommez-vous des boissons sucrées ou sodas plus d\'une fois par jour ?',
      scoring: ouiNegatifScoring(2),
    },
    {
      id: 'ut-3',
      name: 'Céréales sucrées',
      description: 'Céréales petit-déj sucrées, barres chocolatées…',
      criteria: 'Consommez-vous régulièrement des céréales petit-déjeuner sucrées ou barres chocolatées ?',
      scoring: ouiNegatifScoring(1),
    },
    {
      id: 'ut-4',
      name: 'Charcuterie et snacks frits',
      description: 'Nuggets, charcuterie, snacks…',
      criteria: 'Mangez-vous régulièrement de la charcuterie, des nuggets ou des snacks frits ?',
      scoring: ouiNegatifScoring(2),
    },
    {
      id: 'ut-5',
      name: 'Additifs alimentaires',
      description: 'Aliments avec E-numéros, glutamate…',
      criteria: 'Consommez-vous des aliments avec additifs (E…) ou exhausteurs de goût (glutamate, etc.) ?',
      scoring: ouiNegatifScoring(1),
    },
    {
      id: 'ut-6',
      name: 'Éviter les NOVA 4',
      description: 'Exclusion des ultra-transformés de catégorie NOVA 4',
      criteria: 'Évitez-vous les aliments de catégorie NOVA 4 (barres chocolatées, snacking, chips, sodas, plats préparés, charcuterie transformée, crèmes dessert, pain industriel, substituts de repas…) ?',
      scoring: ouiPositifScoring(3),
      tip: 'Les aliments NOVA 4 sont les plus nocifs : associés au cancer, à l\'obésité et aux maladies cardiovasculaires.',
    },
  ],
}

const inflammatoire: TestSection = {
  id: 'inflammatoire',
  title: 'Inflammatoire',
  subtitle: 'Alimentation pro/anti-inflammatoire',
  icon: 'inflammatoire',
  description:
    'Ces questions évaluent l\'impact inflammatoire de votre alimentation, un facteur clé du vieillissement accéléré.',
  maxScore: 10,
  tests: [
    {
      id: 'inf-1',
      name: 'Alcool',
      description: 'Plus de 2 verres par semaine',
      criteria: 'Consommez-vous plus de 2 verres d\'alcool par semaine ?',
      scoring: ouiNegatifScoring(2),
    },
    {
      id: 'inf-2',
      name: 'Élevage conventionnel',
      description: 'Produits animaux industriels',
      criteria: 'Mangez-vous majoritairement des produits animaux issus de l\'élevage conventionnel ?',
      scoring: ouiNegatifScoring(2),
    },
    {
      id: 'inf-3',
      name: 'Excès d\'oméga-6',
      description: 'Huile de tournesol, plats industriels…',
      criteria: 'Votre consommation d\'oméga-6 (huile de tournesol, plats industriels) est-elle élevée ?',
      scoring: ouiNegatifScoring(2),
      tip: 'Un excès d\'oméga-6 par rapport aux oméga-3 favorise l\'inflammation chronique.',
    },
    {
      id: 'inf-4',
      name: 'Anti-inflammatoires naturels',
      description: 'Curcuma, oméga-3, légumes…',
      criteria: 'Consommez-vous des aliments anti-inflammatoires (curcuma, oméga-3, légumes) quotidiennement ?',
      scoring: ouiPositifScoring(4),
      tip: 'L\'alimentation anti-inflammatoire est un pilier de la longévité.',
    },
  ],
}

const bonusSante: TestSection = {
  id: 'bonus-sante',
  title: 'Bonus santé',
  subtitle: 'Habitudes protectrices avancées',
  icon: 'bonus',
  description:
    'Ces questions évaluent des habitudes alimentaires particulièrement protectrices pour la longévité.',
  maxScore: 10,
  tests: [
    {
      id: 'bon-1',
      name: 'Aliments lactofermentés',
      description: 'Choucroute, kimchi, yaourts vivants…',
      criteria: 'Consommez-vous régulièrement des aliments lactofermentés (choucroute, kimchi, yaourts vivants) ?',
      scoring: ouiPositifScoring(2),
      tip: 'Les aliments fermentés nourrissent le microbiote et renforcent l\'immunité.',
    },
    {
      id: 'bon-2',
      name: 'Épices santé',
      description: 'Curcuma, gingembre, ail…',
      criteria: 'Ajoutez-vous des épices (curcuma, gingembre, ail, etc.) dans vos plats ?',
      scoring: ouiPositifScoring(2),
    },
    {
      id: 'bon-3',
      name: 'Cuisson douce',
      description: 'Vapeur, basse température…',
      criteria: 'Pratiquez-vous la cuisson douce (vapeur, basse température) ?',
      scoring: ouiPositifScoring(3),
      tip: 'La cuisson douce préserve les nutriments et limite la formation de composés nocifs.',
    },
    {
      id: 'bon-4',
      name: 'Polyphénols',
      description: 'Baies, chocolat noir, thé vert…',
      criteria: 'Consommez-vous des aliments riches en polyphénols (baies, chocolat noir, thé vert, etc.) ?',
      scoring: ouiPositifScoring(3),
      tip: 'Les polyphénols sont de puissants antioxydants protégeant contre le vieillissement cellulaire.',
    },
  ],
}

// ══════════════════════════════════════════════════════
// EXPORTS
// ══════════════════════════════════════════════════════

/** Sections Partie 1 — Troubles digestifs (GSRS) */
export const digestifSections: TestSection[] = [
  reflux,
  douleursAbdominales,
  indigestion,
  diarrhee,
  constipation,
]

/** Sections Partie 2 — Questionnaire alimentaire */
export const alimentaireSections: TestSection[] = [
  habitudesGenerales,
  macronutriments,
  micronutriments,
  ultraTransformes,
  inflammatoire,
  bonusSante,
]

/** Toutes les sections combinées (alimentaire d'abord, digestif ensuite) */
export const allSections: TestSection[] = [
  ...alimentaireSections,
  ...digestifSections,
]

export const digestifMaxScore = digestifSections.reduce((sum, s) => sum + s.maxScore, 0)
export const alimentaireMaxScore = alimentaireSections.reduce((sum, s) => sum + s.maxScore, 0)
export const totalMaxScore = allSections.reduce((sum, s) => sum + s.maxScore, 0)

// Index de la première section digestif dans allSections
export const digestifStartIndex = alimentaireSections.length

export const nutritionInterpretations: ScoreInterpretation[] = [
  {
    range: '85 – 100%',
    label: 'Optimal',
    color: 'text-emerald-600',
    description: 'Votre profil nutritionnel est excellent. Alimentation bien structurée et santé digestive au top.',
    recommendation: 'Continuez à maintenir ces excellentes habitudes. Votre alimentation est un atout majeur pour votre longévité.',
  },
  {
    range: '70 – 84%',
    label: 'Satisfaisant',
    color: 'text-sky-600',
    description: 'Bonne base nutritionnelle avec quelques ajustements possibles.',
    recommendation: 'Quelques optimisations ciblées peuvent encore améliorer votre profil. Consultez nos recommandations personnalisées.',
  },
  {
    range: '55 – 69%',
    label: 'Moyen',
    color: 'text-amber-600',
    description: 'Des déséquilibres fréquents sont présents. Impact notable sur votre santé à long terme.',
    recommendation: 'Un rééquilibrage alimentaire est recommandé. Le programme Evo inclura un plan nutritionnel adapté.',
  },
  {
    range: '40 – 54%',
    label: 'À risque',
    color: 'text-orange-600',
    description: 'Nombreux déséquilibres nutritionnels et/ou troubles digestifs significatifs.',
    recommendation: 'Un accompagnement nutritionnel personnalisé est vivement conseillé pour corriger les déséquilibres identifiés.',
  },
  {
    range: '< 40%',
    label: 'Déstructuré',
    color: 'text-red-600',
    description: 'Profil nutritionnel carencé ou désorganisé, avec des troubles digestifs potentiellement sévères.',
    recommendation: 'Une consultation nutritionnelle approfondie est fortement recommandée en complément du programme Evo.',
  },
]

export const digestifInterpretations: ScoreInterpretation[] = [
  {
    range: '90 – 100%',
    label: 'Excellent',
    color: 'text-emerald-600',
    description: 'Santé digestive excellente, pas de symptômes significatifs.',
    recommendation: 'Continuez à maintenir vos bonnes habitudes.',
  },
  {
    range: '75 – 89%',
    label: 'Bon',
    color: 'text-sky-600',
    description: 'Bonne santé digestive, quelques symptômes légers.',
    recommendation: 'Quelques ajustements alimentaires ciblés peuvent optimiser votre confort.',
  },
  {
    range: '50 – 74%',
    label: 'Moyen',
    color: 'text-amber-600',
    description: 'Santé digestive modérée, impact notable.',
    recommendation: 'Un programme nutritionnel adapté et un travail sur le microbiote sont recommandés.',
  },
  {
    range: '30 – 49%',
    label: 'Significatif',
    color: 'text-orange-600',
    description: 'Troubles digestifs significatifs avec impact important.',
    recommendation: 'Un bilan digestif approfondi est conseillé.',
  },
  {
    range: '< 30%',
    label: 'Sévère',
    color: 'text-red-600',
    description: 'Santé digestive sévèrement altérée.',
    recommendation: 'Consultez un gastro-entérologue en complément du programme Evo.',
  },
]

export const alimentaireInterpretations: ScoreInterpretation[] = [
  {
    range: '85 – 100%',
    label: 'Optimal',
    color: 'text-emerald-600',
    description: 'Alimentation très bien structurée.',
    recommendation: 'Excellentes habitudes alimentaires, continuez ainsi.',
  },
  {
    range: '70 – 84%',
    label: 'Satisfaisant',
    color: 'text-sky-600',
    description: 'Bonne base, quelques ajustements.',
    recommendation: 'Quelques corrections mineures pour optimiser votre alimentation.',
  },
  {
    range: '55 – 69%',
    label: 'Moyen',
    color: 'text-amber-600',
    description: 'Déséquilibres fréquents.',
    recommendation: 'Un rééquilibrage alimentaire est recommandé.',
  },
  {
    range: '40 – 54%',
    label: 'À risque',
    color: 'text-orange-600',
    description: 'Nombreux déséquilibres.',
    recommendation: 'Un accompagnement nutritionnel personnalisé est conseillé.',
  },
  {
    range: '< 40%',
    label: 'Déstructuré',
    color: 'text-red-600',
    description: 'Profil carencé ou désorganisé.',
    recommendation: 'Consultation nutritionnelle fortement recommandée.',
  },
]
