// ──────────────────────────────────────────────────────
// Bilan de Mobilité & Condition Physique — Data Model
// ──────────────────────────────────────────────────────

export interface ScoreOption {
  value: number
  label: string
  description: string
}

export interface MobilityTest {
  id: string
  name: string
  description: string
  criteria: string
  scoring: ScoreOption[]
  tip?: string
  videoUrl?: string
  timerDuration?: number   // seconds — countdown timer
  timerStartAt?: number    // seconds into video where timer starts
}

export type SectionIcon = 'flexibility' | 'movement' | 'balance' | 'core' | 'strength'

export interface TestSection {
  id: string
  title: string
  subtitle: string
  icon: SectionIcon
  description: string
  maxScore: number
  tests: MobilityTest[]
}

export interface ScoreInterpretation {
  range: string
  label: string
  color: string
  description: string
  recommendation: string
}

// ── Standard scoring grid ──
const defaultScoring: ScoreOption[] = [
  { value: 0, label: 'Impossible', description: 'Impossible / douleur / arrêt' },
  { value: 1, label: 'Partiel', description: 'Mouvement partiel, compensation évidente' },
  { value: 2, label: 'Correct', description: 'Mouvement complet avec légère compensation' },
  { value: 3, label: 'Parfait', description: 'Mouvement complet, fluide, sans compensation' },
]

// ══════════════════════════════════════════════════════
// SECTION 1 — Mobilité Statique (10 tests)
// ══════════════════════════════════════════════════════
const mobiliteStatique: TestSection = {
  id: 'mobilite-statique',
  title: 'Mobilité Statique',
  subtitle: 'Souplesse & amplitudes articulaires',
  icon: 'flexibility',
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
      videoUrl: '/mobilite-test-1.mov',
      timerDuration: 10,
      timerStartAt: 3.25,
      scoring: [
        { value: 0, label: 'Impossible', description: 'Impossible ou douleur aiguë' },
        { value: 1, label: 'Partiel', description: 'Ne tient pas 10 sec ou douleur modérée' },
        { value: 2, label: 'Correct', description: 'Position atteinte mais inconfort / bras nécessaires' },
        { value: 3, label: 'Parfait', description: 'Position tenue 10 sec, fluide, aucune gêne' },
      ],
    },
    {
      id: 'stat-2',
      name: 'Squat complet pieds à plat',
      description: 'Squat complet – 10 sec',
      criteria: 'Pieds stables, talons au sol, bassin sous la parallèle, buste non effondré. Tenir 10 secondes.',
      tip: "Si vos talons décollent, essayez d'écarter un peu plus les pieds.",
      videoUrl: '/mobilite-test-2.mov',
      timerDuration: 10,
      timerStartAt: 3.25,
      scoring: [
        { value: 0, label: 'Impossible', description: 'Impossible ou douleur' },
        { value: 1, label: 'Partiel', description: 'Flexion partielle ou buste effondré' },
        { value: 2, label: 'Correct', description: 'Profondeur OK mais stabilité moyenne / talons décollent légèrement' },
        { value: 3, label: 'Parfait', description: '10 sec stable, dos neutre, talons ancrés' },
      ],
    },
    {
      id: 'stat-3',
      name: 'Flexion avant unilatérale',
      description: 'Ischios-jambiers',
      criteria: 'Mains au sol de chaque côté du pied avant, jambes tendues, tenue 10 sec. Tester gauche ET droite.',
      scoring: [
        { value: 0, label: 'Impossible', description: 'Aucun côté touche le sol' },
        { value: 1, label: 'Partiel', description: "Incapacité d'un côté" },
        { value: 2, label: 'Correct', description: 'Une main touche ou légère flexion de genou' },
        { value: 3, label: 'Parfait', description: 'Mains au sol G + D sans compensation' },
      ],
    },
    {
      id: 'stat-4',
      name: 'Flexion épaule au mur',
      description: 'Bras au mur – Épaules',
      criteria: 'Bras tendus, mains au mur jusqu\'aux oreilles, sans hyperlordose (dos cambré).',
      scoring: [
        { value: 0, label: 'Impossible', description: 'Impossible' },
        { value: 1, label: 'Partiel', description: 'Amplitude réduite / contact main-mur perdu' },
        { value: 2, label: 'Correct', description: 'Bras montent mais légère compensation lombaire' },
        { value: 3, label: 'Parfait', description: 'Bras au-dessus des oreilles sans décoller le dos' },
      ],
    },
    {
      id: 'stat-5',
      name: 'Rotation interne épaule au sol',
      description: 'Épaules – Rotation interne',
      criteria: "Allongé au sol, amener la main vers le sol sans décoller l'omoplate. Tester les deux côtés.",
      scoring: [
        { value: 0, label: 'Impossible', description: 'Bilatéral limité ou douleur' },
        { value: 1, label: 'Partiel', description: 'Limité unilatéral' },
        { value: 2, label: 'Correct', description: 'Main proche du sol' },
        { value: 3, label: 'Parfait', description: 'Main au sol G + D' },
      ],
    },
    {
      id: 'stat-6',
      name: 'Rotation thoracique',
      description: 'Main derrière la tête',
      criteria: 'Coude qui monte haut, thorax visible en rotation, pas de compensation lombaire.',
      scoring: [
        { value: 0, label: 'Impossible', description: 'Impossible' },
        { value: 1, label: 'Partiel', description: 'Rotation faible ou compensations' },
        { value: 2, label: 'Correct', description: "Rotation correcte mais limitée d'un côté" },
        { value: 3, label: 'Parfait', description: 'Rotation ample G + D, ligne du coude bien ouverte' },
      ],
    },
    {
      id: 'stat-7',
      name: 'Mobilité cheville contre mur',
      description: 'Dorsiflexion cheville',
      criteria: "Genou avance vers le mur sans décoller le talon. Mesurer la distance (objectif 8-10 cm).",
      scoring: [
        { value: 0, label: 'Impossible', description: 'Impossible ou douleur' },
        { value: 1, label: 'Partiel', description: '< 5 cm ou asymétrie > 2 cm' },
        { value: 2, label: 'Correct', description: '5 – 7 cm' },
        { value: 3, label: 'Parfait', description: '8 – 10 cm G + D' },
      ],
    },
    {
      id: 'stat-8',
      name: 'Test du psoas',
      description: 'Psoas contre le mur',
      criteria: 'Bassin neutre, jambe arrière qui descend sous la parallèle. Tester les deux côtés.',
      scoring: [
        { value: 0, label: 'Impossible', description: 'Bilatéral limité' },
        { value: 1, label: 'Partiel', description: "Limitation d'un côté" },
        { value: 2, label: 'Correct', description: 'Amplitude correcte mais légère bascule antérieure' },
        { value: 3, label: 'Parfait', description: 'Jambe basse G + D, bassin stable' },
      ],
    },
    {
      id: 'stat-9',
      name: 'Rotation interne de hanche',
      description: 'Fessier – jambes croisées au sol',
      criteria: "Décoller le pied arrière pendant 10 sec, buste tourné vers le genou en rotation interne (posture jambes croisées au sol).",
      scoring: [
        { value: 0, label: 'Impossible', description: 'La posture seule est douloureuse' },
        { value: 1, label: 'Partiel', description: 'Le pied ne décolle pas' },
        { value: 2, label: 'Correct', description: 'Le pied décolle mais retombe avant 10 s' },
        { value: 3, label: 'Parfait', description: 'Le pied décolle facilement' },
      ],
    },
    {
      id: 'stat-10',
      name: 'Pont inversé',
      description: 'Extension épaule + chaîne antérieure',
      criteria: "Monter le bassin et aligner épaules–hanches–genoux, bras tendus, sans pincement antérieur. Tenir 10 sec.",
      scoring: [
        { value: 0, label: 'Impossible', description: 'Impossible de monter en pont ou douleur antérieure nette' },
        { value: 1, label: 'Partiel', description: "Incapacité à aligner le bassin ou forte raideur antérieure" },
        { value: 2, label: 'Correct', description: 'Position correcte mais légère flexion des bras ou bassin légèrement bas' },
        { value: 3, label: 'Parfait', description: 'Alignement complet tenu 10 sec, bras tendus, ouverture thoracique fluide' },
      ],
    },
  ],
}

const mobiliteActive: TestSection = {
  id: 'mobilite-active',
  title: 'Mobilité Active',
  subtitle: 'Contrôle & force dans le mouvement',
  icon: 'movement',
  description: "Ces tests évaluent votre capacité à contrôler activement vos articulations. Contrairement à la mobilité statique, il s'agit ici de force dans l'amplitude.",
  maxScore: 21,
  tests: [
    { id: 'act-1', name: 'Enjambeur debout', description: 'Rotation interne fessier – équilibre', criteria: "Se tenir droit, genou le plus haut possible, pied arrière au niveau du genou. Chronométrer.", scoring: [{ value: 0, label: '< 15 s', description: 'Position tenue moins de 15 s ou non tenue' }, { value: 1, label: '15 s', description: 'Position tenue 15 s' }, { value: 2, label: '30 s', description: 'Position tenue 30 s' }, { value: 3, label: '60 s', description: 'Position tenue 60 s' }] },
    { id: 'act-2', name: 'Rotations int./ext. alternées', description: 'Assis au sol – 10 allers-retours', criteria: "Les genoux doivent toucher le sol de chaque côté pour valider une répétition. Faire 10 allers-retours. Idéalement sans les mains.", scoring: [{ value: 0, label: 'Impossible', description: 'Posture de départ douloureuse' }, { value: 1, label: 'Partiel', description: "Ne pas réaliser les 10 fois sans arrêt" }, { value: 2, label: 'Correct', description: "10 fois réalisées avec les mains au sol" }, { value: 3, label: 'Parfait', description: "10 fois sans poser les mains au sol" }] },
    { id: 'act-3', name: 'Squat sumo', description: 'Rotation externe + quadriceps', criteria: "Écartement 2× largeur d'épaule. Mains derrière la tête. Pieds à 10h10. Demi-squat juste avant la parallèle. Genoux alignés, buste relevé.", scoring: [{ value: 0, label: '< 30 s', description: 'Position tenue moins de 30 s ou non tenue' }, { value: 1, label: '30 s', description: 'Position tenue 30 s' }, { value: 2, label: '60 s', description: 'Position tenue 60 s' }, { value: 3, label: '90 s', description: 'Position tenue 90 s' }] },
    { id: 'act-4', name: "L'aviateur", description: 'Rotation ext. + int. + équilibre', criteria: "5 fois de chaque côté. Évaluer la capacité à maintenir l'équilibre.", scoring: [{ value: 0, label: 'Impossible', description: "Impossible de faire une seule fois" }, { value: 1, label: 'Partiel', description: "Doit reposer son pied pendant l'exercice" }, { value: 2, label: 'Correct', description: "5 fois de chaque côté avec appui contre le mur" }, { value: 3, label: 'Parfait', description: "5 fois de chaque côté sans appui" }] },
    { id: 'act-5', name: 'Contrôle scapulo-huméral', description: 'Élévation bras – Glissement mural actif', criteria: "Bras montent au-dessus des oreilles, dos et bassin plaqués au mur.", scoring: [{ value: 0, label: 'Impossible', description: "Douleur ou impossibilité" }, { value: 1, label: 'Partiel', description: "Amplitude réduite ou perte du contact mur" }, { value: 2, label: 'Correct', description: "Mouvement complet avec légère hyperlordose" }, { value: 3, label: 'Parfait', description: "Mouvement complet sans compensation" }] },
    { id: 'act-6', name: 'Contrôle lombo-pelvien', description: 'Descente contrôlée – 15 répétitions', criteria: "Genou aligné, bassin stable, descente lente. 15 fois gauche + droite.", scoring: [{ value: 0, label: 'Impossible', description: "Douleur ou impossibilité de faire les 15 fois" }, { value: 1, label: 'Partiel', description: "Valgus marqué ou contrôle insuffisant" }, { value: 2, label: 'Correct', description: "Légère instabilité ou asymétrie" }, { value: 3, label: 'Parfait', description: "15 fois propres G + D" }] },
    { id: 'act-7', name: 'Dorsiflexion active', description: 'Pied / cheville en charge', criteria: "Genou avance sans décoller le talon. Évaluer fluidité et symétrie.", scoring: [{ value: 0, label: 'Impossible', description: "Douleur ou incapacité" }, { value: 1, label: 'Partiel', description: "Amplitude faible ou asymétrie marquée" }, { value: 2, label: 'Correct', description: "Amplitude correcte mais instabilité" }, { value: 3, label: 'Parfait', description: "Mouvement fluide, stable, symétrique" }] },
  ],
}

const proprioception: TestSection = {
  id: 'proprioception',
  title: 'Proprioception',
  subtitle: 'Équilibre & contrôle postural',
  icon: 'balance',
  description: "La proprioception est votre capacité à savoir où se trouve votre corps dans l'espace. Elle est cruciale pour la prévention des chutes. Faites ces tests pieds nus pour plus de précision.",
  maxScore: 24,
  tests: [
    { id: 'prop-1', name: 'Unipodal yeux ouverts', description: 'Équilibre statique – Temps max', criteria: "Se tenir sur un pied, yeux ouverts. Chronométrer le temps maximum.", scoring: [{ value: 0, label: '< 5 s', description: '< 5 s ou impossible' }, { value: 1, label: '5 – 19 s', description: '5 à 19 secondes' }, { value: 2, label: '20 – 44 s', description: '20 à 44 secondes' }, { value: 3, label: '≥ 45 s', description: '45 secondes ou plus, stable' }] },
    { id: 'prop-2', name: 'Unipodal yeux fermés', description: 'Équilibre statique avancé – Temps max', criteria: "Se tenir sur un pied, yeux fermés. Chronométrer. Restez près d'un mur par sécurité.", tip: "Ce test est beaucoup plus difficile. Un score de 2 est déjà très bien.", scoring: [{ value: 0, label: '< 10 s', description: 'Moins de 10 secondes' }, { value: 1, label: '10 – 19 s', description: '10 à 19 secondes' }, { value: 2, label: '20 – 29 s', description: '20 à 29 secondes' }, { value: 3, label: '≥ 30 s', description: '30 secondes ou plus' }] },
    { id: 'prop-3', name: 'Appui pied devant pied', description: "Pied devant l'autre – Yeux ouverts puis fermés", criteria: "Un pied devant l'autre en ligne. D'abord yeux ouverts, puis yeux fermés. 30 sec = objectif.", scoring: [{ value: 0, label: 'Impossible', description: 'Impossible' }, { value: 1, label: '< 15 s', description: 'Moins de 15 secondes' }, { value: 2, label: '15 – 29 s', description: '15 à 29 secondes' }, { value: 3, label: '30 s', description: '30 s stable sans mouvement parasite' }] },
    { id: 'prop-4', name: 'Marche pied devant pied', description: 'Marche sur une ligne – Nb de pas propres', criteria: "Marcher sur une ligne droite, pied devant pied. Compter le nombre de pas propres consécutifs.", scoring: [{ value: 0, label: '< 3 pas', description: 'Moins de 3 pas' }, { value: 1, label: '3 – 5 pas', description: '3 à 5 pas' }, { value: 2, label: '6 – 9 pas', description: '6 à 9 pas' }, { value: 3, label: '≥ 10 pas', description: '10 pas propres consécutifs ou plus' }] },
    { id: 'prop-5', name: 'Équilibre en étoile simplifié', description: 'Excursion en étoile – 3 directions', criteria: "Debout sur un pied, tendre l'autre jambe dans 3 directions (avant, côté, arrière). Évaluer la symétrie gauche/droite.", scoring: [{ value: 0, label: 'Impossible', description: 'Impossible' }, { value: 1, label: 'Partiel', description: 'Forte asymétrie ou instabilité majeure' }, { value: 2, label: 'Correct', description: 'Symétrie acceptable avec compensations' }, { value: 3, label: 'Parfait', description: 'Symétrie et contrôle dans les 3 directions' }] },
    { id: 'prop-6', name: 'Enjambement contrôlé', description: 'Enjamber un obstacle – 10 répétitions', criteria: "Enjamber un petit obstacle (livre, coussin) 10 fois. Évaluer la stabilité.", scoring: [{ value: 0, label: 'Impossible', description: 'Impossible ou peur marquée' }, { value: 1, label: 'Partiel', description: '< 10 fois ou déséquilibres fréquents' }, { value: 2, label: 'Correct', description: '10 fois avec légère instabilité' }, { value: 3, label: 'Parfait', description: '10 fois fluides, stables' }] },
    { id: 'prop-7', name: 'Demi-tour rapide 180°', description: 'Stabilité & prévention chute', criteria: "Faire un demi-tour rapide et contrôlé. Évaluer la stabilité et l'absence de vertige.", scoring: [{ value: 0, label: 'Instable', description: 'Instabilité majeure ou vertige' }, { value: 1, label: 'Difficile', description: 'Plusieurs pas nécessaires' }, { value: 2, label: 'Correct', description: 'Léger déséquilibre récupéré' }, { value: 3, label: 'Parfait', description: 'Demi-tour fluide, stable' }] },
    { id: 'prop-8', name: 'Test de pas réactif', description: 'Réaction rapide – Prévention chute', criteria: "Simuler une perte d'équilibre et rattraper avec un pas rapide. Tester les deux côtés.", scoring: [{ value: 0, label: 'Impossible', description: "Incapacité à rattraper l'équilibre" }, { value: 1, label: 'Partiel', description: 'Rattrapage lent ou non contrôlé' }, { value: 2, label: 'Correct', description: 'Rattrapage correct avec léger excès' }, { value: 3, label: 'Parfait', description: 'Rattrapage rapide et contrôlé' }] },
  ],
}

const gainage: TestSection = {
  id: 'gainage',
  title: 'Gainage',
  subtitle: 'Stabilité du tronc & contrôle',
  icon: 'core',
  description: "Le gainage, c'est la capacité de votre tronc à rester stable pendant que vos bras et jambes bougent. C'est la clé de voûte de tout mouvement sain.",
  maxScore: 24,
  tests: [
    { id: 'gain-1', name: 'Chien de chasse statique', description: 'Anti-extension – Tenue 10 s × 5 répétitions', criteria: "À quatre pattes, tendre un bras et la jambe opposée. Tenir 10 sec, 5 fois par côté. Bassin stable.", scoring: [{ value: 0, label: 'Impossible', description: 'Impossible ou douleur lombaire' }, { value: 1, label: 'Partiel', description: 'Perte fréquente de stabilité' }, { value: 2, label: 'Correct', description: 'Tenue correcte avec légers tremblements' }, { value: 3, label: 'Parfait', description: 'Tenue 10 s × 5 fois/côté, bassin stable' }] },
    { id: 'gain-2', name: 'Insecte renversé', description: 'Contrôle respiratoire – Lombaires stables', criteria: "Allongé sur le dos, bras vers le plafond, genoux à 90°. Étendre lentement un bras et la jambe opposée sans que le bas du dos décolle.", scoring: [{ value: 0, label: 'Impossible', description: 'Impossible' }, { value: 1, label: 'Partiel', description: 'Mouvement partiel' }, { value: 2, label: 'Correct', description: 'Léger décollement lombaire' }, { value: 3, label: 'Parfait', description: 'Lombaires stables, respiration contrôlée' }] },
    { id: 'gain-3', name: 'Planche', description: 'Gainage ventral – Temps max', criteria: "Position de planche sur les avant-bras. Posture parfaite (pas de dos creusé ni de fesses en l'air).", scoring: [{ value: 0, label: '< 10 s', description: 'Moins de 10 secondes' }, { value: 1, label: '10 – 29 s', description: '10 à 29 secondes' }, { value: 2, label: '30 – 59 s', description: '30 à 59 secondes' }, { value: 3, label: '≥ 60 s', description: '60 secondes ou plus, posture parfaite' }] },
    { id: 'gain-4', name: 'Planche latérale', description: 'Anti-inclinaison – Temps par côté', criteria: "Sur l'avant-bras, corps droit. Chronométrer chaque côté. Genoux ou pieds au sol selon votre niveau.", scoring: [{ value: 0, label: '< 10 s', description: 'Moins de 10 secondes' }, { value: 1, label: '10 – 19 s', description: '10 à 19 secondes' }, { value: 2, label: '20 – 44 s', description: '20 à 44 secondes' }, { value: 3, label: '≥ 45 s', description: '45 secondes ou plus par côté' }] },
    { id: 'gain-5', name: 'Pression anti-rotation (élastique)', description: 'Anti-rotation – 10 répétitions lentes', criteria: "Avec un élastique, bras tendus, extension du nombril vers la tête. 10 fois lentes sans rotation du tronc.", tip: "Si vous n'avez pas d'élastique, faites le mouvement en imaginant une résistance latérale.", scoring: [{ value: 0, label: 'Impossible', description: 'Impossible' }, { value: 1, label: 'Partiel', description: 'Instabilité marquée' }, { value: 2, label: 'Correct', description: 'Légère rotation' }, { value: 3, label: 'Parfait', description: '10 fois lentes sans rotation' }] },
    { id: 'gain-6', name: 'Chien de chasse dynamique', description: 'Coordination – 60 répétitions alternées', criteria: "À quatre pattes, toucher coude et genou opposés puis étendre. 60 fois en alternant.", scoring: [{ value: 0, label: 'Impossible', description: 'Impossible' }, { value: 1, label: 'Partiel', description: "Désorganisation / perte d'alignement" }, { value: 2, label: 'Correct', description: 'Coordination correcte mais lente' }, { value: 3, label: 'Parfait', description: 'Mouvement fluide, contrôle total' }] },
    { id: 'gain-7', name: 'Quadrupédie + déplacement', description: 'Marche à quatre pattes – 2 mètres', criteria: "À quatre pattes, genoux décollés du sol, avancer par incréments de 10-15 cm. Bassin stable sur 2 mètres.", scoring: [{ value: 0, label: 'Impossible', description: 'Impossible' }, { value: 1, label: 'Partiel', description: 'Désorganisation' }, { value: 2, label: 'Correct', description: 'Instabilité légère' }, { value: 3, label: 'Parfait', description: 'Déplacements contrôlés, bassin stable sur 2 m' }] },
    { id: 'gain-8', name: 'Suspension barre fixe', description: 'Santé épaule – Temps max (optionnel)', criteria: "Se suspendre à une barre fixe, bras tendus. Test optionnel si vous avez accès à une barre.", tip: "Ce test est optionnel. Si vous n'avez pas de barre, passez au suivant.", scoring: [{ value: 0, label: 'Non testé', description: "Pas de barre ou impossible" }, { value: 1, label: '< 15 s', description: 'Moins de 15 secondes' }, { value: 2, label: '15 – 30 s', description: '15 à 30 secondes' }, { value: 3, label: '> 30 s', description: 'Plus de 30 secondes' }] },
  ],
}

const prepaPhysique: TestSection = {
  id: 'prepa-physique',
  title: 'Prépa Physique',
  subtitle: 'Force, endurance & capacité fonctionnelle',
  icon: 'strength',
  description: "Ces tests évaluent votre force, endurance et capacité locomotrice de base. Ils simulent les gestes du quotidien : se lever, marcher, porter, pousser.",
  maxScore: 30,
  tests: [
    { id: 'prep-1', name: '5× Assis-debout', description: 'Force bas du corps – Chronométré', criteria: "Se lever 5 fois d'une chaise sans utiliser les mains, le plus vite possible. Chronométrer.", scoring: [{ value: 0, label: '> 20 s', description: 'Plus de 20 s ou impossible' }, { value: 1, label: '15 – 20 s', description: '15 à 20 secondes' }, { value: 2, label: '10 – 14 s', description: '10 à 14 secondes' }, { value: 3, label: '< 10 s', description: 'Moins de 10 secondes' }] },
    { id: 'prep-2', name: 'Chaise 30 s', description: 'Endurance bas du corps – Max répétitions', criteria: "Se lever et s'asseoir le plus de fois possible en 30 secondes, sans les mains.", scoring: [{ value: 0, label: '< 5 fois', description: 'Moins de 5 répétitions' }, { value: 1, label: '5 – 9 fois', description: '5 à 9 répétitions' }, { value: 2, label: '10 – 14 fois', description: '10 à 14 répétitions' }, { value: 3, label: '≥ 15 fois', description: '15 répétitions ou plus' }] },
    { id: 'prep-3', name: 'Chaise murale', description: 'Isométrie – Temps max', criteria: "Dos au mur, cuisses à 90°, maintenir la position le plus longtemps possible.", scoring: [{ value: 0, label: '< 20 s', description: 'Moins de 20 secondes' }, { value: 1, label: '20 – 44 s', description: '20 à 44 secondes' }, { value: 2, label: '45 – 89 s', description: '45 à 89 secondes' }, { value: 3, label: '≥ 90 s', description: '90 secondes ou plus' }] },
    { id: 'prep-4', name: 'Lever-marcher chronométré', description: 'Locomotion – Chaise → 3 m → retour', criteria: "Se lever d'une chaise, marcher 3 mètres, faire demi-tour, revenir s'asseoir. Chronométrer.", scoring: [{ value: 0, label: '> 14 s', description: 'Plus de 14 secondes' }, { value: 1, label: '10 – 14 s', description: '10 à 14 secondes' }, { value: 2, label: '8 – 10 s', description: '8 à 10 secondes' }, { value: 3, label: '< 8 s', description: 'Moins de 8 secondes' }] },
    { id: 'prep-5', name: 'Montée de genoux 2 min', description: 'Cardio – Genoux sur place', criteria: "Lever les genoux sur place pendant 2 minutes. Compter le nombre de montées de genou.", scoring: [{ value: 0, label: '< 50', description: 'Moins de 50 montées' }, { value: 1, label: '50 – 74', description: '50 à 74 montées' }, { value: 2, label: '75 – 99', description: '75 à 99 montées' }, { value: 3, label: '≥ 100', description: '100 montées ou plus' }] },
    { id: 'prep-6', name: 'Pompes', description: 'Poussée – Max répétitions propres', criteria: "Pompes au sol (genoux ou pieds au sol). Compter le nombre de répétitions propres.", scoring: [{ value: 0, label: '< 3', description: 'Moins de 3' }, { value: 1, label: '3 – 7', description: '3 à 7' }, { value: 2, label: '8 – 14', description: '8 à 14' }, { value: 3, label: '≥ 15', description: '15 fois propres ou plus' }] },
    { id: 'prep-7', name: 'Tirage élastique', description: 'Tirage – Max répétitions (debout ou assis)', criteria: "Avec un élastique, tirer vers soi. Comptez les répétitions propres.", tip: "Si vous n'avez pas d'élastique, vous pouvez sauter ce test.", scoring: [{ value: 0, label: 'Impossible', description: 'Impossible' }, { value: 1, label: '< 8', description: 'Moins de 8' }, { value: 2, label: '8 – 14', description: '8 à 14' }, { value: 3, label: '≥ 15', description: '15 fois propres ou plus' }] },
    { id: 'prep-8', name: 'Développé épaules', description: 'Épaules – Élastique si indolore', criteria: "Développé épaules avec un élastique. Comptez les répétitions indolores.", scoring: [{ value: 0, label: 'Impossible', description: 'Impossible' }, { value: 1, label: '< 8', description: 'Moins de 8' }, { value: 2, label: '8 – 14', description: '8 à 14' }, { value: 3, label: 'Parfait', description: '15 fois propres ou plus' }] },
    { id: 'prep-9', name: 'Portage statique', description: "Préhension – Pack d'eau 6-9 kg", criteria: "Tenir un pack d'eau (6-9 kg) dans chaque main, bras le long du corps, posture droite. Chronométrer.", scoring: [{ value: 0, label: '< 30 s', description: 'Moins de 30 secondes' }, { value: 1, label: '30 – 59 s', description: '30 à 59 secondes' }, { value: 2, label: '60 – 119 s', description: '60 à 119 secondes' }, { value: 3, label: '≥ 120 s', description: '120 secondes ou plus, posture parfaite' }] },
    { id: 'prep-10', name: 'Fente statique', description: 'Force unipodal – Temps max', criteria: "En position de fente, genou arrière proche du sol. Maintenir la position, chronométrer.", scoring: defaultScoring },
  ],
}

export const allSections: TestSection[] = [mobiliteStatique, mobiliteActive, proprioception, gainage, prepaPhysique]
export const totalMaxScore = allSections.reduce((sum, s) => sum + s.maxScore, 0)

export const mobiliteInterpretations: ScoreInterpretation[] = [
  { range: '24-30', label: 'Optimal', color: 'text-emerald-600', description: 'Amplitudes complètes et symétriques.', recommendation: 'Adapté au sport, au renforcement, à la prévention. Faible risque articulaire.' },
  { range: '16-23', label: 'Limité', color: 'text-amber-600', description: 'Mobilité insuffisante dans au moins 2 zones clés.', recommendation: 'Risque de compensation, fatigue mécanique. Travail ciblé recommandé.' },
  { range: '0-15', label: 'Très limité', color: 'text-red-600', description: 'Restrictions majeures – plusieurs articulations verrouillées.', recommendation: 'Travail de mobilité prioritaire avant toute intensification sportive.' },
]

export const standard2026Criteria = {
  mobilitePassive: '≥ 70 % du score max',
  mobiliteActive: '≥ 70 % du score max',
  aucunZero: 'Aucun test à 0 sur hanches, chevilles ou épaules',
  proprioception: '≥ 70 % du score global',
  unipodal: '≥ 20 s en unipodal yeux ouverts',
  demiTour: 'Demi-tour 180° sans instabilité majeure',
  birdDog: 'Chien de chasse ≥ 2/3',
  planche: 'Planche ≥ 30 s',
  sidePlank: 'Planche latérale ≥ 30 s par côté',
  sitToStand: '5× Assis-debout ≤ 14 s',
  tug: 'Lever-marcher ≤ 10 s',
  chairStand: 'Chaise 30 s ≥ 10 répétitions',
  pushUps: 'Pompes ≥ 8 répétitions',
}
