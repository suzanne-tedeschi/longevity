// ──────────────────────────────────────────────────────
// Bilan de Mobilité & Condition Physique — Data Model
// ──────────────────────────────────────────────────────

export interface ScoreOption {
  value: number
  label: string
  description: string
  emoji: string
}

export interface MobilityTest {
  id: string
  name: string
  description: string
  criteria: string
  scoring: ScoreOption[]
  tip?: string
}

export interface TestSection {
  id: string
  title: string
  subtitle: string
  icon: string
  color: string
  description: string
  maxScore: number
  tests: MobilityTest[]
}

export interface ScoreInterpretation {
  range: string
  label: string
  emoji: string
  color: string
  description: string
  recommendation: string
}

// ── Standard scoring grid ──
const defaultScoring: ScoreOption[] = [
  { value: 0, label: 'Impossible', description: 'Impossible / douleur / arrêt', emoji: '🔴' },
  { value: 1, label: 'Partiel', description: 'Mouvement partiel, compensation évidente', emoji: '🟠' },
  { value: 2, label: 'Correct', description: 'Mouvement complet avec légère compensation', emoji: '🟡' },
  { value: 3, label: 'Parfait', description: 'Mouvement complet, fluide, sans compensation', emoji: '🟢' },
]

// ══════════════════════════════════════════════════════
// SECTION 1 — Mobilité Statique (10 tests)
// ══════════════════════════════════════════════════════
const mobiliteStatique: TestSection = {
  id: 'mobilite-statique',
  title: 'Mobilité Statique',
  subtitle: 'Souplesse & amplitudes articulaires',
  icon: '🧘',
  color: 'from-blue-500 to-indigo-600',
  description:
    'Ces tests évaluent vos amplitudes articulaires de base. Prenez le temps de bien vous installer dans chaque position, maintenez-la le temps indiqué, et notez-vous honnêtement.',
  maxScore: 30,
  tests: [
    {
      id: 'stat-1',
      name: 'Assis sur les talons',
      description: 'Flexion genou / cheville',
      criteria: "S'asseoir sur ses talons pendant 10 secondes, buste droit, sans douleur.",
      tip: 'Vous pouvez vous aider des mains pour descendre, mais la position finale doit être tenue sans appui.',
      scoring: [
        { value: 0, label: 'Impossible', description: 'Impossible ou douleur aiguë', emoji: '🔴' },
        { value: 1, label: 'Partiel', description: 'Ne tient pas 10 sec ou douleur modérée', emoji: '🟠' },
        { value: 2, label: 'Correct', description: 'Position atteinte mais inconfort / bras nécessaires', emoji: '🟡' },
        { value: 3, label: 'Parfait', description: 'Position tenue 10 sec, fluide, aucune gêne', emoji: '🟢' },
      ],
    },
    {
      id: 'stat-2',
      name: 'Squat complet pieds à plat',
      description: 'Flexion complète – 10 sec',
      criteria: 'Pieds stables, talons au sol, bassin sous la parallèle, buste non effondré. Tenir 10 secondes.',
      tip: "Si vos talons décollent, essayez d'écarter un peu plus les pieds.",
      scoring: [
        { value: 0, label: 'Impossible', description: 'Impossible ou douleur', emoji: '🔴' },
        { value: 1, label: 'Partiel', description: 'Squat partiel ou buste effondré', emoji: '🟠' },
        { value: 2, label: 'Correct', description: 'Profondeur OK mais stabilité moyenne / talons décollent légèrement', emoji: '🟡' },
        { value: 3, label: 'Parfait', description: '10 sec stable, dos neutre, talons ancrés', emoji: '🟢' },
      ],
    },
    {
      id: 'stat-3',
      name: 'Flexion avant unilatérale',
      description: 'Ischios-jambiers',
      criteria: 'Mains au sol de chaque côté du pied avant, jambes tendues, tenue 10 sec. Tester gauche ET droite.',
      scoring: [
        { value: 0, label: 'Impossible', description: 'Aucun côté touche le sol', emoji: '🔴' },
        { value: 1, label: 'Partiel', description: "Incapacité d'un côté", emoji: '🟠' },
        { value: 2, label: 'Correct', description: 'Une main touche ou légère flexion de genou', emoji: '🟡' },
        { value: 3, label: 'Parfait', description: 'Mains au sol G + D sans compensation', emoji: '🟢' },
      ],
    },
    {
      id: 'stat-4',
      name: 'Wall Shoulder Flexion',
      description: 'Bras au mur – Épaules',
      criteria: 'Bras tendus, mains au mur jusqu\'aux oreilles, sans hyperlordose (dos cambré).',
      scoring: [
        { value: 0, label: 'Impossible', description: 'Impossible', emoji: '🔴' },
        { value: 1, label: 'Partiel', description: 'Amplitude réduite / contact main-mur perdu', emoji: '🟠' },
        { value: 2, label: 'Correct', description: 'Bras montent mais légère compensation lombaire', emoji: '🟡' },
        { value: 3, label: 'Parfait', description: 'Bras au-dessus des oreilles sans décoller le dos', emoji: '🟢' },
      ],
    },
    {
      id: 'stat-5',
      name: 'Rotation interne épaule au sol',
      description: 'Épaules – Rotation interne',
      criteria: "Allongé au sol, amener la main vers le sol sans décoller l'omoplate. Tester les deux côtés.",
      scoring: [
        { value: 0, label: 'Impossible', description: 'Bilatéral limité ou douleur', emoji: '🔴' },
        { value: 1, label: 'Partiel', description: 'Limité unilatéral', emoji: '🟠' },
        { value: 2, label: 'Correct', description: 'Main proche du sol', emoji: '🟡' },
        { value: 3, label: 'Parfait', description: 'Main au sol G + D', emoji: '🟢' },
      ],
    },
    {
      id: 'stat-6',
      name: 'Rotation thoracique',
      description: 'Main derrière la tête',
      criteria: 'Coude qui monte haut, thorax visible en rotation, pas de compensation lombaire.',
      scoring: [
        { value: 0, label: 'Impossible', description: 'Impossible', emoji: '🔴' },
        { value: 1, label: 'Partiel', description: 'Rotation faible ou compensations', emoji: '🟠' },
        { value: 2, label: 'Correct', description: "Rotation correcte mais limitée d'un côté", emoji: '🟡' },
        { value: 3, label: 'Parfait', description: 'Rotation ample G + D, ligne du coude bien ouverte', emoji: '🟢' },
      ],
    },
    {
      id: 'stat-7',
      name: 'Mobilité cheville contre mur',
      description: 'Dorsiflexion cheville',
      criteria: "Genou avance vers le mur sans décoller le talon. Mesurer la distance (objectif 8-10 cm).",
      scoring: [
        { value: 0, label: 'Impossible', description: 'Impossible ou douleur', emoji: '🔴' },
        { value: 1, label: 'Partiel', description: '< 5 cm ou asymétrie > 2 cm', emoji: '🟠' },
        { value: 2, label: 'Correct', description: '5 – 7 cm', emoji: '🟡' },
        { value: 3, label: 'Parfait', description: '8 – 10 cm G + D', emoji: '🟢' },
      ],
    },
    {
      id: 'stat-8',
      name: 'Test du psoas',
      description: 'Psoas contre le mur',
      criteria: 'Bassin neutre, jambe arrière qui descend sous la parallèle. Tester les deux côtés.',
      scoring: [
        { value: 0, label: 'Impossible', description: 'Bilatéral limité', emoji: '🔴' },
        { value: 1, label: 'Partiel', description: "Limitation d'un côté", emoji: '🟠' },
        { value: 2, label: 'Correct', description: 'Amplitude correcte mais légère bascule antérieure', emoji: '🟡' },
        { value: 3, label: 'Parfait', description: 'Jambe basse G + D, bassin stable', emoji: '🟢' },
      ],
    },
    {
      id: 'stat-9',
      name: 'Rotation interne de hanche',
      description: 'Fessier – jambes croisées au sol',
      criteria: "Décoller le pied arrière pendant 10 sec, buste tourné vers le genou en rotation interne (posture jambes croisées au sol).",
      scoring: [
        { value: 0, label: 'Impossible', description: 'La posture seule est douloureuse', emoji: '🔴' },
        { value: 1, label: 'Partiel', description: 'Le pied ne décolle pas', emoji: '🟠' },
        { value: 2, label: 'Correct', description: 'Le pied décolle mais retombe avant 10 s', emoji: '🟡' },
        { value: 3, label: 'Parfait', description: 'Le pied décolle facilement', emoji: '🟢' },
      ],
    },
    {
      id: 'stat-10',
      name: 'Bridge inversé',
      description: 'Extension épaule + chaîne antérieure',
      criteria: "Monter le bassin et aligner épaules–hanches–genoux, bras tendus, sans pincement antérieur. Tenir 10 sec.",
      scoring: [
        { value: 0, label: 'Impossible', description: 'Impossible de monter en bridge ou douleur antérieure nette', emoji: '🔴' },
        { value: 1, label: 'Partiel', description: "Incapacité à aligner le bassin ou forte raideur antérieure", emoji: '🟠' },
        { value: 2, label: 'Correct', description: 'Position correcte mais légère flexion des bras ou bassin légèrement bas', emoji: '🟡' },
        { value: 3, label: 'Parfait', description: 'Alignement complet tenu 10 sec, bras tendus, ouverture thoracique fluide', emoji: '🟢' },
      ],
    },
  ],
}

// ══════════════════════════════════════════════════════
// SECTION 2 — Mobilité Active (7 tests)
// ══════════════════════════════════════════════════════
const mobiliteActive: TestSection = {
  id: 'mobilite-active',
  title: 'Mobilité Active',
  subtitle: 'Contrôle & force dans le mouvement',
  icon: '🏃',
  color: 'from-emerald-500 to-teal-600',
  description:
    "Ces tests évaluent votre capacité à contrôler activement vos articulations. Contrairement à la mobilité statique, il s'agit ici de force dans l'amplitude.",
  maxScore: 21,
  tests: [
    {
      id: 'act-1',
      name: 'Hurdler debout',
      description: 'Rotation interne fessier – équilibre',
      criteria: "Se tenir droit, genou le plus haut possible, pied arrière au niveau du genou. Chronométrer.",
      scoring: [
        { value: 0, label: '< 15 s', description: 'Position tenue moins de 15 s ou non tenue', emoji: '🔴' },
        { value: 1, label: '15 s', description: 'Position tenue 15 s', emoji: '🟠' },
        { value: 2, label: '30 s', description: 'Position tenue 30 s', emoji: '🟡' },
        { value: 3, label: '60 s', description: 'Position tenue 60 s', emoji: '🟢' },
      ],
    },
    {
      id: 'act-2',
      name: 'Rotations int./ext. alternées',
      description: 'Assis au sol – 10 allers-retours',
      criteria: "Les genoux doivent toucher le sol de chaque côté pour valider une répétition. Faire 10 allers-retours. Idéalement sans les mains.",
      scoring: [
        { value: 0, label: 'Impossible', description: 'Posture de départ douloureuse', emoji: '🔴' },
        { value: 1, label: 'Partiel', description: "Ne pas réaliser les 10 reps sans arrêt", emoji: '🟠' },
        { value: 2, label: 'Correct', description: "10 reps réalisées avec les mains au sol", emoji: '🟡' },
        { value: 3, label: 'Parfait', description: "10 reps sans poser les mains au sol", emoji: '🟢' },
      ],
    },
    {
      id: 'act-3',
      name: 'Squat sumo',
      description: 'Rotation externe + quadriceps',
      criteria: "Écartement 2× largeur d'épaule. Mains derrière la tête. Pieds à 10h10. Demi-squat juste avant la parallèle. Genoux alignés, buste relevé.",
      scoring: [
        { value: 0, label: '< 30 s', description: 'Position tenue moins de 30 s ou non tenue', emoji: '🔴' },
        { value: 1, label: '30 s', description: 'Position tenue 30 s', emoji: '🟠' },
        { value: 2, label: '60 s', description: 'Position tenue 60 s', emoji: '🟡' },
        { value: 3, label: '90 s', description: 'Position tenue 90 s', emoji: '🟢' },
      ],
    },
    {
      id: 'act-4',
      name: "L'aviateur",
      description: 'Rotation ext. + int. + équilibre',
      criteria: "5 reps de chaque côté. Évaluer la capacité à maintenir l'équilibre.",
      scoring: [
        { value: 0, label: 'Impossible', description: "Impossible de faire une seule rep", emoji: '🔴' },
        { value: 1, label: 'Partiel', description: "Doit reposer son pied pendant l'exercice", emoji: '🟠' },
        { value: 2, label: 'Correct', description: "5 reps de chaque côté avec appui contre le mur", emoji: '🟡' },
        { value: 3, label: 'Parfait', description: "5 reps de chaque côté sans appui", emoji: '🟢' },
      ],
    },
    {
      id: 'act-5',
      name: 'Contrôle scapulo-huméral',
      description: 'Élévation bras – Wall slide actif',
      criteria: "Bras montent au-dessus des oreilles, dos et bassin plaqués au mur.",
      scoring: [
        { value: 0, label: 'Impossible', description: "Douleur ou impossibilité", emoji: '🔴' },
        { value: 1, label: 'Partiel', description: "Amplitude réduite ou perte du contact mur", emoji: '🟠' },
        { value: 2, label: 'Correct', description: "Mouvement complet avec légère hyperlordose", emoji: '🟡' },
        { value: 3, label: 'Parfait', description: "Mouvement complet sans compensation", emoji: '🟢' },
      ],
    },
    {
      id: 'act-6',
      name: 'Contrôle lombo-pelvien',
      description: 'Step-down contrôlé – 15 reps',
      criteria: "Genou aligné, bassin stable, descente lente. 15 reps gauche + droite.",
      scoring: [
        { value: 0, label: 'Impossible', description: "Douleur ou impossibilité de faire les 15 reps", emoji: '🔴' },
        { value: 1, label: 'Partiel', description: "Valgus marqué ou contrôle insuffisant", emoji: '🟠' },
        { value: 2, label: 'Correct', description: "Légère instabilité ou asymétrie", emoji: '🟡' },
        { value: 3, label: 'Parfait', description: "15 reps propres G + D", emoji: '🟢' },
      ],
    },
    {
      id: 'act-7',
      name: 'Dorsiflexion active',
      description: 'Pied / cheville en charge',
      criteria: "Genou avance sans décoller le talon. Évaluer fluidité et symétrie.",
      scoring: [
        { value: 0, label: 'Impossible', description: "Douleur ou incapacité", emoji: '🔴' },
        { value: 1, label: 'Partiel', description: "Amplitude faible ou asymétrie marquée", emoji: '🟠' },
        { value: 2, label: 'Correct', description: "Amplitude correcte mais instabilité", emoji: '🟡' },
        { value: 3, label: 'Parfait', description: "Mouvement fluide, stable, symétrique", emoji: '🟢' },
      ],
    },
  ],
}

// ══════════════════════════════════════════════════════
// SECTION 3 — Proprioception (8 tests)
// ══════════════════════════════════════════════════════
const proprioception: TestSection = {
  id: 'proprioception',
  title: 'Proprioception',
  subtitle: 'Équilibre & contrôle postural',
  icon: '⚖️',
  color: 'from-violet-500 to-purple-600',
  description:
    "La proprioception est votre capacité à savoir où se trouve votre corps dans l'espace. Elle est cruciale pour la prévention des chutes. Faites ces tests pieds nus pour plus de précision.",
  maxScore: 24,
  tests: [
    {
      id: 'prop-1',
      name: 'Unipodal yeux ouverts',
      description: 'Équilibre statique – Temps max',
      criteria: "Se tenir sur un pied, yeux ouverts. Chronométrer le temps maximum.",
      scoring: [
        { value: 0, label: '< 5 s', description: '< 5 s ou impossible', emoji: '🔴' },
        { value: 1, label: '5 – 19 s', description: '5 à 19 secondes', emoji: '🟠' },
        { value: 2, label: '20 – 44 s', description: '20 à 44 secondes', emoji: '🟡' },
        { value: 3, label: '≥ 45 s', description: '45 secondes ou plus, stable', emoji: '🟢' },
      ],
    },
    {
      id: 'prop-2',
      name: 'Unipodal yeux fermés',
      description: 'Équilibre statique avancé – Temps max',
      criteria: "Se tenir sur un pied, yeux fermés. Chronométrer. Restez près d'un mur par sécurité.",
      tip: "Ce test est beaucoup plus difficile. Un score de 2 est déjà très bien !",
      scoring: [
        { value: 0, label: '< 10 s', description: 'Moins de 10 secondes', emoji: '🔴' },
        { value: 1, label: '10 – 19 s', description: '10 à 19 secondes', emoji: '🟠' },
        { value: 2, label: '20 – 29 s', description: '20 à 29 secondes', emoji: '🟡' },
        { value: 3, label: '≥ 30 s', description: '30 secondes ou plus', emoji: '🟢' },
      ],
    },
    {
      id: 'prop-3',
      name: 'Tandem stance',
      description: "Pied devant l'autre – Yeux ouverts puis fermés",
      criteria: "Un pied devant l'autre en ligne. D'abord yeux ouverts, puis yeux fermés. 30 sec = objectif.",
      scoring: [
        { value: 0, label: 'Impossible', description: 'Impossible', emoji: '🔴' },
        { value: 1, label: '< 15 s', description: 'Moins de 15 secondes', emoji: '🟠' },
        { value: 2, label: '15 – 29 s', description: '15 à 29 secondes', emoji: '🟡' },
        { value: 3, label: '30 s', description: '30 s stable sans mouvement parasite', emoji: '🟢' },
      ],
    },
    {
      id: 'prop-4',
      name: 'Tandem walk',
      description: 'Marche sur une ligne – Nb de pas propres',
      criteria: "Marcher sur une ligne droite, pied devant pied. Compter le nombre de pas propres consécutifs.",
      scoring: [
        { value: 0, label: '< 3 pas', description: 'Moins de 3 pas', emoji: '🔴' },
        { value: 1, label: '3 – 5 pas', description: '3 à 5 pas', emoji: '🟠' },
        { value: 2, label: '6 – 9 pas', description: '6 à 9 pas', emoji: '🟡' },
        { value: 3, label: '≥ 10 pas', description: '10 pas propres consécutifs ou plus', emoji: '🟢' },
      ],
    },
    {
      id: 'prop-5',
      name: 'Y-Balance simplifié',
      description: 'Star excursion – 3 directions',
      criteria: "Debout sur un pied, tendre l'autre jambe dans 3 directions (avant, côté, arrière). Évaluer la symétrie gauche/droite.",
      scoring: [
        { value: 0, label: 'Impossible', description: 'Impossible', emoji: '🔴' },
        { value: 1, label: 'Partiel', description: 'Forte asymétrie ou instabilité majeure', emoji: '🟠' },
        { value: 2, label: 'Correct', description: 'Symétrie acceptable avec compensations', emoji: '🟡' },
        { value: 3, label: 'Parfait', description: 'Symétrie et contrôle dans les 3 directions', emoji: '🟢' },
      ],
    },
    {
      id: 'prop-6',
      name: 'Step-over contrôlé',
      description: 'Enjamber un obstacle – 10 reps',
      criteria: "Enjamber un petit obstacle (livre, coussin) 10 reps. Évaluer la stabilité.",
      scoring: [
        { value: 0, label: 'Impossible', description: 'Impossible ou peur marquée', emoji: '🔴' },
        { value: 1, label: 'Partiel', description: '< 10 reps ou déséquilibres fréquents', emoji: '🟠' },
        { value: 2, label: 'Correct', description: '10 reps avec légère instabilité', emoji: '🟡' },
        { value: 3, label: 'Parfait', description: '10 reps fluides, stables', emoji: '🟢' },
      ],
    },
    {
      id: 'prop-7',
      name: 'Demi-tour rapide 180°',
      description: 'Stabilité & prévention chute',
      criteria: "Faire un demi-tour rapide et contrôlé. Évaluer la stabilité et l'absence de vertige.",
      scoring: [
        { value: 0, label: 'Instable', description: 'Instabilité majeure ou vertige', emoji: '🔴' },
        { value: 1, label: 'Difficile', description: 'Plusieurs pas nécessaires', emoji: '🟠' },
        { value: 2, label: 'Correct', description: 'Léger déséquilibre récupéré', emoji: '🟡' },
        { value: 3, label: 'Parfait', description: 'Demi-tour fluide, stable', emoji: '🟢' },
      ],
    },
    {
      id: 'prop-8',
      name: 'Reactive step test',
      description: 'Réaction rapide – Prévention chute',
      criteria: "Simuler une perte d'équilibre et rattraper avec un pas rapide. Tester les deux côtés.",
      scoring: [
        { value: 0, label: 'Impossible', description: "Incapacité à rattraper l'équilibre", emoji: '🔴' },
        { value: 1, label: 'Partiel', description: 'Rattrapage lent ou non contrôlé', emoji: '🟠' },
        { value: 2, label: 'Correct', description: 'Rattrapage correct avec léger excès', emoji: '🟡' },
        { value: 3, label: 'Parfait', description: 'Rattrapage rapide et contrôlé', emoji: '🟢' },
      ],
    },
  ],
}

// ══════════════════════════════════════════════════════
// SECTION 4 — Gainage dynamique & statique (8 tests)
// ══════════════════════════════════════════════════════
const gainage: TestSection = {
  id: 'gainage',
  title: 'Gainage',
  subtitle: 'Stabilité du tronc & contrôle',
  icon: '💪',
  color: 'from-amber-500 to-orange-600',
  description:
    "Le gainage, c'est la capacité de votre tronc à rester stable pendant que vos bras et jambes bougent. C'est la clé de voûte de tout mouvement sain.",
  maxScore: 24,
  tests: [
    {
      id: 'gain-1',
      name: 'Bird-dog statique',
      description: 'Anti-extension – Tenue 10 s × 5 reps',
      criteria: "À quatre pattes, tendre un bras et la jambe opposée. Tenir 10 sec, 5 reps par côté. Bassin stable.",
      scoring: [
        { value: 0, label: 'Impossible', description: 'Impossible ou douleur lombaire', emoji: '🔴' },
        { value: 1, label: 'Partiel', description: 'Perte fréquente de stabilité', emoji: '🟠' },
        { value: 2, label: 'Correct', description: 'Tenue correcte avec légers tremblements', emoji: '🟡' },
        { value: 3, label: 'Parfait', description: 'Tenue 10 s × 5 reps/côté, bassin stable', emoji: '🟢' },
      ],
    },
    {
      id: 'gain-2',
      name: 'Dead bug',
      description: 'Contrôle respiratoire – Lombaires stables',
      criteria: "Allongé sur le dos, bras vers le plafond, genoux à 90°. Étendre lentement un bras et la jambe opposée sans que le bas du dos décolle.",
      scoring: [
        { value: 0, label: 'Impossible', description: 'Impossible', emoji: '🔴' },
        { value: 1, label: 'Partiel', description: 'Mouvement partiel', emoji: '🟠' },
        { value: 2, label: 'Correct', description: 'Léger décollement lombaire', emoji: '🟡' },
        { value: 3, label: 'Parfait', description: 'Lombaires stables, respiration contrôlée', emoji: '🟢' },
      ],
    },
    {
      id: 'gain-3',
      name: 'Planche',
      description: 'Gainage ventral – Temps max',
      criteria: "Position de planche sur les avant-bras. Posture parfaite (pas de dos creusé ni de fesses en l'air).",
      scoring: [
        { value: 0, label: '< 10 s', description: 'Moins de 10 secondes', emoji: '🔴' },
        { value: 1, label: '10 – 29 s', description: '10 à 29 secondes', emoji: '🟠' },
        { value: 2, label: '30 – 59 s', description: '30 à 59 secondes', emoji: '🟡' },
        { value: 3, label: '≥ 60 s', description: '60 secondes ou plus, posture parfaite', emoji: '🟢' },
      ],
    },
    {
      id: 'gain-4',
      name: 'Planche latérale',
      description: 'Anti-inclinaison – Temps par côté',
      criteria: "Sur l'avant-bras, corps droit. Chronométrer chaque côté. Genoux ou pieds au sol selon votre niveau.",
      scoring: [
        { value: 0, label: '< 10 s', description: 'Moins de 10 secondes', emoji: '🔴' },
        { value: 1, label: '10 – 19 s', description: '10 à 19 secondes', emoji: '🟠' },
        { value: 2, label: '20 – 44 s', description: '20 à 44 secondes', emoji: '🟡' },
        { value: 3, label: '≥ 45 s', description: '45 secondes ou plus par côté', emoji: '🟢' },
      ],
    },
    {
      id: 'gain-5',
      name: 'Pallof press (élastique)',
      description: 'Anti-rotation – 10 reps lentes',
      criteria: "Avec un élastique, bras tendus, extension du nombril vers la tête. 10 reps lentes sans rotation du tronc.",
      tip: "Si vous n'avez pas d'élastique, faites le mouvement en imaginant une résistance latérale.",
      scoring: [
        { value: 0, label: 'Impossible', description: 'Impossible', emoji: '🔴' },
        { value: 1, label: 'Partiel', description: 'Instabilité marquée', emoji: '🟠' },
        { value: 2, label: 'Correct', description: 'Légère rotation', emoji: '🟡' },
        { value: 3, label: 'Parfait', description: '10 reps lentes sans rotation', emoji: '🟢' },
      ],
    },
    {
      id: 'gain-6',
      name: 'Bird-dog dynamique',
      description: 'Coordination – 60 reps alternées',
      criteria: "À quatre pattes, toucher coude et genou opposés puis étendre. 60 reps en alternant.",
      scoring: [
        { value: 0, label: 'Impossible', description: 'Impossible', emoji: '🔴' },
        { value: 1, label: 'Partiel', description: "Désorganisation / perte d'alignement", emoji: '🟠' },
        { value: 2, label: 'Correct', description: 'Coordination correcte mais lente', emoji: '🟡' },
        { value: 3, label: 'Parfait', description: 'Mouvement fluide, contrôle total', emoji: '🟢' },
      ],
    },
    {
      id: 'gain-7',
      name: 'Quadrupédie + déplacement',
      description: 'Bear crawl lent – 2 mètres',
      criteria: "À quatre pattes, genoux décollés du sol, avancer par incréments de 10-15 cm. Bassin stable sur 2 mètres.",
      scoring: [
        { value: 0, label: 'Impossible', description: 'Impossible', emoji: '🔴' },
        { value: 1, label: 'Partiel', description: 'Désorganisation', emoji: '🟠' },
        { value: 2, label: 'Correct', description: 'Instabilité légère', emoji: '🟡' },
        { value: 3, label: 'Parfait', description: 'Déplacements contrôlés, bassin stable sur 2 m', emoji: '🟢' },
      ],
    },
    {
      id: 'gain-8',
      name: 'Suspension barre fixe',
      description: 'Santé épaule – Temps max (optionnel)',
      criteria: "Se suspendre à une barre fixe, bras tendus. Test optionnel si vous avez accès à une barre.",
      tip: "Ce test est optionnel. Si vous n'avez pas de barre, passez au suivant.",
      scoring: [
        { value: 0, label: 'Non testé', description: "Pas de barre ou impossible", emoji: '🔴' },
        { value: 1, label: '< 15 s', description: 'Moins de 15 secondes', emoji: '🟠' },
        { value: 2, label: '15 – 30 s', description: '15 à 30 secondes', emoji: '🟡' },
        { value: 3, label: '> 30 s', description: 'Plus de 30 secondes', emoji: '🟢' },
      ],
    },
  ],
}

// ══════════════════════════════════════════════════════
// SECTION 5 — Prépa physique simple (10 tests)
// ══════════════════════════════════════════════════════
const prepaPhysique: TestSection = {
  id: 'prepa-physique',
  title: 'Prépa Physique',
  subtitle: 'Force, endurance & capacité fonctionnelle',
  icon: '🏋️',
  color: 'from-rose-500 to-red-600',
  description:
    "Ces tests évaluent votre force, endurance et capacité locomotrice de base. Ils simulent les gestes du quotidien : se lever, marcher, porter, pousser.",
  maxScore: 30,
  tests: [
    {
      id: 'prep-1',
      name: '5× Sit-to-Stand',
      description: 'Force bas du corps – Chronométré',
      criteria: "Se lever 5 fois d'une chaise sans utiliser les mains, le plus vite possible. Chronométrer.",
      scoring: [
        { value: 0, label: '> 20 s', description: 'Plus de 20 s ou impossible', emoji: '🔴' },
        { value: 1, label: '15 – 20 s', description: '15 à 20 secondes', emoji: '🟠' },
        { value: 2, label: '10 – 14 s', description: '10 à 14 secondes', emoji: '🟡' },
        { value: 3, label: '< 10 s', description: 'Moins de 10 secondes', emoji: '🟢' },
      ],
    },
    {
      id: 'prep-2',
      name: '30 s Chair Stand',
      description: 'Endurance bas du corps – Max reps',
      criteria: "Se lever et s'asseoir le plus de fois possible en 30 secondes, sans les mains.",
      scoring: [
        { value: 0, label: '< 5 reps', description: 'Moins de 5 répétitions', emoji: '🔴' },
        { value: 1, label: '5 – 9 reps', description: '5 à 9 répétitions', emoji: '🟠' },
        { value: 2, label: '10 – 14 reps', description: '10 à 14 répétitions', emoji: '🟡' },
        { value: 3, label: '≥ 15 reps', description: '15 répétitions ou plus', emoji: '🟢' },
      ],
    },
    {
      id: 'prep-3',
      name: 'Demi-squat mural',
      description: 'Isométrie – Temps max',
      criteria: "Dos au mur, cuisses à 90°, maintenir la position le plus longtemps possible.",
      scoring: [
        { value: 0, label: '< 20 s', description: 'Moins de 20 secondes', emoji: '🔴' },
        { value: 1, label: '20 – 44 s', description: '20 à 44 secondes', emoji: '🟠' },
        { value: 2, label: '45 – 89 s', description: '45 à 89 secondes', emoji: '🟡' },
        { value: 3, label: '≥ 90 s', description: '90 secondes ou plus', emoji: '🟢' },
      ],
    },
    {
      id: 'prep-4',
      name: 'Timed Up & Go',
      description: 'Locomotion – Chaise → 3 m → retour',
      criteria: "Se lever d'une chaise, marcher 3 mètres, faire demi-tour, revenir s'asseoir. Chronométrer.",
      scoring: [
        { value: 0, label: '> 14 s', description: 'Plus de 14 secondes', emoji: '🔴' },
        { value: 1, label: '10 – 14 s', description: '10 à 14 secondes', emoji: '🟠' },
        { value: 2, label: '8 – 10 s', description: '8 à 10 secondes', emoji: '🟡' },
        { value: 3, label: '< 8 s', description: 'Moins de 8 secondes', emoji: '🟢' },
      ],
    },
    {
      id: 'prep-5',
      name: '2 min Step Test',
      description: 'Cardio – Genoux sur place',
      criteria: "Lever les genoux sur place pendant 2 minutes. Compter le nombre de montées de genou.",
      scoring: [
        { value: 0, label: '< 50', description: 'Moins de 50 montées', emoji: '🔴' },
        { value: 1, label: '50 – 74', description: '50 à 74 montées', emoji: '🟠' },
        { value: 2, label: '75 – 99', description: '75 à 99 montées', emoji: '🟡' },
        { value: 3, label: '≥ 100', description: '100 montées ou plus', emoji: '🟢' },
      ],
    },
    {
      id: 'prep-6',
      name: 'Push-ups',
      description: 'Poussée – Max reps propres',
      criteria: "Pompes au sol (genoux ou pieds au sol). Compter le nombre de répétitions propres.",
      scoring: [
        { value: 0, label: '< 3', description: 'Moins de 3 reps', emoji: '🔴' },
        { value: 1, label: '3 – 7', description: '3 à 7 reps', emoji: '🟠' },
        { value: 2, label: '8 – 14', description: '8 à 14 reps', emoji: '🟡' },
        { value: 3, label: '≥ 15', description: '15 reps propres ou plus', emoji: '🟢' },
      ],
    },
    {
      id: 'prep-7',
      name: 'Tirage élastique',
      description: 'Tirage – Max reps (debout ou assis)',
      criteria: "Avec un élastique, tirer vers soi. Comptez les reps propres.",
      tip: "Si vous n'avez pas d'élastique, vous pouvez sauter ce test.",
      scoring: [
        { value: 0, label: 'Impossible', description: 'Impossible', emoji: '🔴' },
        { value: 1, label: '< 8', description: 'Moins de 8 reps', emoji: '🟠' },
        { value: 2, label: '8 – 14', description: '8 à 14 reps', emoji: '🟡' },
        { value: 3, label: '≥ 15', description: '15 reps propres ou plus', emoji: '🟢' },
      ],
    },
    {
      id: 'prep-8',
      name: 'Développé épaules',
      description: 'Épaules – Élastique si indolore',
      criteria: "Développé épaules avec un élastique. Comptez les reps indolores.",
      scoring: [
        { value: 0, label: 'Impossible', description: 'Impossible', emoji: '🔴' },
        { value: 1, label: '< 8', description: 'Moins de 8 reps', emoji: '🟠' },
        { value: 2, label: '8 – 14', description: '8 à 14 reps', emoji: '🟡' },
        { value: 3, label: 'Parfait', description: '15 reps propres ou plus', emoji: '🟢' },
      ],
    },
    {
      id: 'prep-9',
      name: 'Farmer hold',
      description: "Préhension – Pack d'eau 6-9 kg",
      criteria: "Tenir un pack d'eau (6-9 kg) dans chaque main, bras le long du corps, posture droite. Chronométrer.",
      scoring: [
        { value: 0, label: '< 30 s', description: 'Moins de 30 secondes', emoji: '🔴' },
        { value: 1, label: '30 – 59 s', description: '30 à 59 secondes', emoji: '🟠' },
        { value: 2, label: '60 – 119 s', description: '60 à 119 secondes', emoji: '🟡' },
        { value: 3, label: '≥ 120 s', description: '120 secondes ou plus, posture parfaite', emoji: '🟢' },
      ],
    },
    {
      id: 'prep-10',
      name: 'Fente statique',
      description: 'Force unipodal – Temps max',
      criteria: "En position de fente, genou arrière proche du sol. Maintenir la position, chronométrer.",
      scoring: defaultScoring,
    },
  ],
}

// ── Export Everything ──
export const allSections: TestSection[] = [
  mobiliteStatique,
  mobiliteActive,
  proprioception,
  gainage,
  prepaPhysique,
]

export const totalMaxScore = allSections.reduce((sum, s) => sum + s.maxScore, 0)

// ── Interpretations per section ──
export const mobiliteInterpretations: ScoreInterpretation[] = [
  {
    range: '24-30',
    label: 'Optimal',
    emoji: '🟢',
    color: 'text-emerald-600',
    description: 'Amplitudes complètes et symétriques.',
    recommendation: 'Adapté au sport, au renforcement, à la prévention. Faible risque articulaire.',
  },
  {
    range: '16-23',
    label: 'Limité',
    emoji: '🟡',
    color: 'text-amber-600',
    description: 'Mobilité insuffisante dans au moins 2 zones clés.',
    recommendation: 'Risque de compensation, fatigue mécanique. Travail ciblé recommandé.',
  },
  {
    range: '0-15',
    label: 'Très limité',
    emoji: '🔴',
    color: 'text-red-600',
    description: 'Restrictions majeures – plusieurs articulations verrouillées.',
    recommendation: 'Travail de mobilité prioritaire avant toute intensification sportive.',
  },
]

// ── Eligibility criteria for STANDARD 2026 ──
export const standard2026Criteria = {
  mobilitePassive: '≥ 70 % du score max',
  mobiliteActive: '≥ 70 % du score max',
  aucunZero: 'Aucun test à 0 sur hanches, chevilles ou épaules',
  proprioception: '≥ 70 % du score global',
  unipodal: '≥ 20 s en unipodal yeux ouverts',
  demiTour: 'Demi-tour 180° sans instabilité majeure',
  birdDog: 'Bird-dog ≥ 2/3',
  planche: 'Planche ≥ 30 s',
  sidePlank: 'Side plank ≥ 30 s par côté',
  sitToStand: '5× Sit-to-Stand ≤ 14 s',
  tug: 'TUG ≤ 10 s',
  chairStand: 'Chair stand ≥ 10 reps',
  pushUps: 'Push-ups ≥ 8 reps',
}
