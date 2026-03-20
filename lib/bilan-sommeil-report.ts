// ──────────────────────────────────────────────────────
// Bilan Sommeil, Compte-rendu
// Basé sur : PSQI, SHI, TCC-I, recherche circadienne et neurosciences du sommeil
// ──────────────────────────────────────────────────────

export interface ScientificReference {
  authors: string
  title: string
  journal: string
  year: number
  doi?: string
  pmid?: string
}

export interface SectionReport {
  sectionId: string
  context: string
  strengthLabel?: string
  weaknessLabel?: string
  scienceNote?: string
  recommendations: {
    maxPct: number
    level: 'alerte' | 'vigilance' | 'bon' | 'excellent'
    title: string
    text: string
  }[]
  questionInsights: {
    questionId: string
    triggerMaxScore?: number
    triggerMinScore?: number
    insight: string
    recommendation: string
    action?: string
    actionWhy?: string
  }[]
  references: ScientificReference[]
}

// ══════════════════════════════════════════════════════
// SECTION 1 — Troubles du sommeil
// ══════════════════════════════════════════════════════

const troublesSommeilReport: SectionReport = {
  sectionId: 'troubles-sommeil',
  context:
    "Chaque interruption nocturne brise des cycles de 90 minutes alternant NREM N3 (sommeil profond) et REM (sommeil paradoxal), deux phases non interchangeables. Le NREM N3, dominant en première moitié de nuit, libère l'hormone de croissance et active le système glymphatique (réseau de nettoyage cérébral éliminant les déchets métaboliques). Le REM, dominant en fin de nuit, régule les émotions et consolide la mémoire. Une fragmentation chronique génère des risques cardiovasculaires, métaboliques et immunitaires comparables à la privation totale.",
  strengthLabel: 'Peu de perturbations nocturnes identifiées',
  weaknessLabel: 'Perturbations nocturnes à corriger en priorité',
  scienceNote:
    "C'est en sommeil profond que l'hormone de croissance est libérée et que le nettoyage cérébral s'effectue. Chaque réveil nocturne, même court, peut interrompre ces processus — surtout s'il est répété plusieurs nuits par semaine.",
  recommendations: [
    {
      maxPct: 33,
      level: 'alerte',
      title: 'Nuits très fragmentées',
      text: "Vos nuits sont chroniquement perturbées : le cerveau n'atteint plus les phases réparatrices, et la dette s'accumule sans que vous en ayez conscience. Consultez votre médecin pour identifier la cause (apnées du sommeil, hyperactivation du système nerveux, douleurs chroniques) : les solutions existent et sont efficaces.",
    },
    {
      maxPct: 66,
      level: 'vigilance',
      title: 'Perturbations régulières',
      text: "Des perturbations récurrentes réduisent votre temps en sommeil profond (NREM N3) et en sommeil paradoxal (REM). Identifiez le facteur principal dans vos réponses et agissez dessus : deux ou trois changements ciblés transforment les nuits en quelques semaines.",
    },
    {
      maxPct: 90,
      level: 'bon',
      title: 'Quelques inconforts ponctuels',
      text: "Des réveils ou inconforts occasionnels présents. Identifiez le facteur récurrent (température, bruit, lumière, stress) et corrigez-le.",
    },
    {
      maxPct: 95,
      level: 'bon',
      title: 'Perturbations très rares',
      text: "Peu de troubles nocturnes identifiés. Certaines perturbations ponctuelles restent possibles — surveillez si elles deviennent régulières.",
    },
    {
      maxPct: 100,
      level: 'excellent',
      title: 'Pas de perturbation nocturne significative',
      text: "Pas de trouble récurrent identifié : pas d'apnées, pas de ronflement, pas de douleurs, pas de cauchemars fréquents. Le sommeil profond et le sommeil paradoxal peuvent s'effectuer sans interruption.",
    },
  ],
  questionInsights: [
    {
      questionId: 'som-1',
      triggerMaxScore: 1,
      insight:
        "Un endormissement long (>30 min) résulte d'un déséquilibre entre deux signaux biologiques. Premier signal : la pression de sommeil — l'adénosine, un sous-produit du métabolisme neuronal, s'accumule dans le cerveau tout au long de l'éveil et se lie progressivement aux récepteurs A1 et A2A pour inhiber les circuits d'éveil. Second signal : l'horloge circadienne — le noyau suprachiasmatique (NSC) de l'hypothalamus programme la libération de mélatonine par la glande pinéale à heure fixe, signalant que la nuit biologique a commencé. Si ces deux signaux ne coïncident pas — parce que vous vous couchez trop tôt, trop tard, ou à des horaires variables — l'un des deux est absent et l'endormissement ne peut pas démarrer. Si ce symptôme survient 3 nuits ou plus par semaine depuis plus de 3 mois avec une fatigue ou irritabilité diurne, c'est une insomnie chronique : la TCC-I est le traitement de première ligne.",
      recommendation:
        "Ne vous couchez que sur des signaux réels de sommeil (paupières lourdes, bâillements). Levez-vous à heure fixe chaque matin, week-end inclus : c'est le levier le plus puissant pour calibrer l'accumulation d'adénosine et resynchroniser l'horloge interne.",
      action: 'Ne vous couchez que sur des signaux réels de sommeil, et levez-vous à heure fixe chaque matin.',
      actionWhy:
        "En vous levant chaque jour à la même heure, vous imposez au NSC un signal lumineux fixe qui resynchronise la sécrétion de mélatonine à heure prévisible. Simultanément, un lever fixe signifie que la pression d'adénosine repart de zéro à la même heure chaque matin et s'accumule sur la même durée chaque jour — les deux courbes finissent par se croiser au bon moment le soir, rendant l'endormissement naturel et rapide.",
    },
    {
      questionId: 'som-2',
      triggerMaxScore: 1,
      insight:
        "Le maintien du sommeil dépend d'un équilibre thermique précis : le corps doit abaisser sa température centrale de 0,5 à 1°C pour rester en sommeil profond, ce qu'il fait via une vasodilatation des extrémités (les mains et les pieds se réchauffent pour libérer de la chaleur vers l'extérieur). Une chambre trop chaude empêche ce gradient thermique et génère des micro-éveils par activation réflexe des centres thermorégulateurs de l'hypothalamus. D'autres causes : un pic de cortisol nocturne (lié au stress chronique), des stimuli auditifs ou lumineux traités par le cerveau même pendant le sommeil, ou des micro-obstructions respiratoires. Les réveils en première moitié de nuit amputent le sommeil profond (récupération physique, nettoyage cérébral) ; les réveils en fin de nuit amputent le sommeil paradoxal (régulation émotionnelle, consolidation créative) — les deux phases ne se rattrapent pas.",
      recommendation:
        "Chambre fraîche (16-19°C), obscurité totale incluant les LED des chargeurs. Si vous ne vous rendormez pas en 20 min, levez-vous, activité calme à lumière tamisée, cohérence cardiaque (5s inspiration / 5s expiration, 5 min) pour réactiver le système parasympathique.",
      action: 'Vérifiez la température (16-19°C) et l\'obscurité totale de votre chambre.',
      actionWhy:
        "Une chambre à 16-19°C facilite la vasodilatation périphérique nécessaire à la descente thermique centrale : le gradient air-peau permet l'évacuation de chaleur sans activer les centres thermorégulateurs. La cohérence cardiaque (5s inspiration / 5s expiration) active les afférences vagales qui réduisent la réponse au stress et baissent le cortisol, supprimant l'un des facteurs d'éveil nocturne. L'obscurité totale supprime tout signal lumineux capté par les ipRGCs même à travers les paupières, évitant la suppression partielle de mélatonine qui fragmenterait le sommeil paradoxal de fin de nuit.",
    },
    {
      questionId: 'som-4',
      triggerMaxScore: 1,
      insight:
        "Pendant le sommeil, les muscles pharyngés se relâchent naturellement. Dans les apnées obstructives du sommeil, ce relâchement provoque une obstruction partielle ou totale des voies aériennes supérieures. L'obstruction entraîne une désaturation en O₂ qui active les chémorécepteurs carotidiens, lesquels déclenchent une réponse d'éveil via le système nerveux sympathique et une libération de noradrénaline — un micro-éveil souvent imperceptible mais suffisant pour fragmenter le sommeil profond. Cette séquence peut se reproduire 5 à 100 fois par heure. Chaque micro-éveil réinitialise le cycle : le sommeil profond ne peut jamais se consolider. Résultat : une fatigue chronique malgré une durée de sommeil apparemment normale. Ce trouble touche 1 adulte sur 10 et est diagnostiqué dans seulement 20 % des cas.",
      recommendation:
        "Consultez votre médecin pour une polygraphie ventilatoire (enregistrement respiratoire à domicile). En attendant : position latérale stricte (réduit les obstructions mécaniques) et zéro alcool le soir (il relaxe les muscles pharyngés et aggrave les apnées).",
      action: 'Consultez votre médecin pour une polygraphie ventilatoire.',
      actionWhy:
        "La PPC (pression positive continue) maintient une pression d'air constante dans les voies aériennes supérieures, les maintenant mécaniquement ouvertes et supprimant les obstructions. Résultat : zéro désaturation, zéro chémorécepteur activé, zéro micro-éveil lié aux apnées. L'architecture du sommeil se normalise dès la première nuit de traitement — la proportion de sommeil profond et de sommeil paradoxal peut doubler en quelques semaines.",
    },
    {
      questionId: 'som-5',
      triggerMaxScore: 1,
      insight:
        "Le ronflement est produit par la vibration des tissus mous du pharynx (voile du palais, luette, base de langue) sous l'effet du flux d'air turbulent passant à travers un espace partiellement obstrué. Cette obstruction partielle provoque des micro-éveils par deux mécanismes : l'effort respiratoire accru (qui active les muscles intercostaux et accessoires) et les micro-variations d'O₂ (qui activent les chémorécepteurs). L'alcool aggrave le ronflement en inhibant les motoneurones des muscles dilatateurs du pharynx via les récepteurs GABA-A, accroissant le relâchement musculaire. Un ronflement fort et quotidien est un signe clinique à évaluer — il peut signaler des apnées sous-jacentes.",
      recommendation:
        "Dormez sur le côté, évitez l'alcool le soir. Des exercices myofonctionnels (renforcement des muscles du palais et de la gorge, 10 min/j pendant 3 mois) réduisent le ronflement de façon documentée. Consultez si fort ou quotidien.",
      action: 'Dormez sur le côté et consultez votre médecin si le ronflement est fort ou quotidien.',
      actionWhy:
        "La position latérale utilise la gravité pour empêcher la langue et les tissus mous de tomber en arrière et d'obstruer le pharynx : cause mécanique directe du ronflement en position dorsale. Les exercices myofonctionnels (renforcement des muscles dilatateurs du pharynx — génioglosse, tenseur du voile du palais) augmentent leur tonus de base, réduisant le collapsus nocturne même en relâchement musculaire physiologique du sommeil.",
    },
    {
      questionId: 'som-8',
      triggerMaxScore: 1,
      insight:
        "Le sommeil paradoxal est caractérisé par une suppression quasi-totale de la noradrénaline (le neurotransmetteur de l'éveil et de la réponse au stress), par arrêt des neurones du locus coeruleus. Cet environnement neurochimique permet au cerveau de réactiver des souvenirs émotionnellement chargés (via l'hippocampe et l'amygdale) sans la composante anxiogène — c'est la \"thérapie émotionnelle\" nocturne. Les cauchemars récurrents signalent que ce mécanisme est perturbé : soit le locus coeruleus reste actif (stress chronique, PTSD), soit la privation de sommeil paradoxal a accumulé une \"pression REM\" qui provoque des rêves intenses lors des rebonds. Dans les deux cas, la réactivation émotionnelle n'est plus modulée.",
      recommendation:
        "Répétition par imagerie (IRT) : 10 min chaque soir avant le coucher, réécrivez le scénario du cauchemar avec une fin apaisante, répétez-le mentalement 3-4 jours de suite. Résultats visibles en 2 à 4 semaines.",
      action: 'Pratiquez la répétition par imagerie : réécrivez chaque soir votre cauchemar avec une fin apaisante.',
      actionWhy:
        "La répétition par imagerie (IRT) exploite la neuroplasticité du sommeil paradoxal en état d'éveil : en réécrivant consciemment le scénario du cauchemar avec une fin différente, vous activez les mêmes circuits hippocampiques et amygdaliens que le REM, mais en état d'éveil calme (sans arousal sympathique). Après 3-4 répétitions, la trace mnésique modifiée concurrence l'originale. Lors des prochains épisodes de sommeil paradoxal, c'est le scénario réécrit — émotionnellement neutre — qui est réactivé.",
    },
    {
      questionId: 'som-9',
      triggerMaxScore: 1,
      insight:
        "Le sommeil profond est la phase principale de libération de l'hormone de croissance (GH), qui orchestre la régénération tissulaire, la réparation musculaire et la réduction de l'inflammation systémique. Quand la douleur fragmente le sommeil profond, la GH est sous-produite, ralentissant la récupération des tissus douloureux. Simultanément, le manque de sommeil profond réduit la production d'endorphines et augmente la sensibilité des récepteurs à la douleur (hyperalgésie centrale) : le même stimulus douloureux est perçu plus intensément le lendemain. La douleur fragmente le sommeil → moins de GH et plus de sensibilité → plus de douleur → nouveau fragment → cercle vicieux.",
      recommendation:
        "Étirements doux ciblés 10 min avant le coucher. Chaleur locale en soirée (bouillotte ou bain chaud) : relâche les muscles tendus et prépare la descente thermique. Évaluez votre literie : un matelas >8 ans aggrave les douleurs articulaires et perturbe le sommeil profond.",
      action: 'Faites 10 min d\'étirements doux avant le coucher et évaluez votre literie.',
      actionWhy:
        "La chaleur locale (bouillotte, bain chaud) augmente la circulation sanguine dans les tissus concernés, facilitant l'élimination des médiateurs pro-inflammatoires (prostaglandines, bradykinines) qui sensibilisent les nocicepteurs. Le bain chaud 1h30 avant le coucher induit une vasodilatation périphérique qui accélère la descente de température centrale, signalant l'endormissement à l'hypothalamus. Les étirements doux réduisent la tension musculaire en stimulant les organes tendineux de Golgi (réflexe inhibiteur de Sherrington), baissant l'activité des fibres fusales — moins de signal nociceptif au niveau spinal.",
    },
  ],
  references: [
    {
      authors: 'Walker MP',
      title: 'Why We Sleep: Unlocking the Power of Sleep and Dreams',
      journal: 'Scribner',
      year: 2017,
    },
    {
      authors: 'Xie L, Kang H, Xu Q et al.',
      title: 'Sleep drives metabolite clearance from the adult brain',
      journal: 'Science',
      year: 2013,
      doi: '10.1126/science.1241224',
      pmid: '24136970',
    },
    {
      authors: 'Cappuccio FP, D\'Elia L, Strazzullo P, Miller MA',
      title: 'Sleep duration and all-cause mortality: a systematic review and meta-analysis',
      journal: 'Sleep',
      year: 2010,
      doi: '10.1093/sleep/33.5.585',
      pmid: '20469800',
    },
  ],
}

// ══════════════════════════════════════════════════════
// SECTION 2 — Qualité & Impact diurne
// ══════════════════════════════════════════════════════

const qualiteImpactReport: SectionReport = {
  sectionId: 'qualite-impact',
  context:
    "La qualité perçue du sommeil reflète directement l'efficacité de la récupération nocturne. Une privation partielle (6h/nuit) rend l'amygdale (centre des émotions) 60 % plus réactive aux stimuli négatifs et fragilise sa connexion avec le cortex préfrontal, le frein rationnel. Après 10 nuits à 6h, les performances cognitives atteignent le niveau d'une privation totale de 24h, mais le déficit est systématiquement sous-estimé. La somnolence diurne indique que l'adénosine (molécule de la pression de sommeil) n'a pas été suffisamment résorbée.",
  strengthLabel: 'Votre sommeil recharge efficacement vos journées',
  weaknessLabel: 'Votre sommeil impacte votre quotidien',
  scienceNote:
    "Un sommeil complet remet le cortex préfrontal aux commandes de l'amygdale. C'est pour cela que les mêmes problèmes paraissent toujours moins lourds au matin qu'au soir.",
  recommendations: [
    {
      maxPct: 33,
      level: 'alerte',
      title: 'Impact sévère sur le quotidien',
      text: "L'amygdale hyperactivée par le manque de sommeil amplifie les émotions négatives, réduit la concentration et favorise les décisions impulsives : c'est une réponse neurologique, pas un manque de résistance. Consultez votre médecin pour une orientation vers les bons outils.",
    },
    {
      maxPct: 66,
      level: 'vigilance',
      title: 'Fatigue qui s\'accumule',
      text: "La privation partielle chronique altère les performances tout en masquant la perception de ce déficit. Régularité des horaires et hygiène de sommeil : impact visible dès la première semaine.",
    },
    {
      maxPct: 90,
      level: 'bon',
      title: 'Quelques coups de mou',
      text: "Des baisses d'énergie ponctuelles en journée. Protégez les 7-9 heures recommandées et stabilisez les horaires de lever : l'énergie et la régulation émotionnelle suivront.",
    },
    {
      maxPct: 100,
      level: 'excellent',
      title: 'Journées bien rechargées',
      text: "Vos cycles sont complets, le sommeil paradoxal (REM) restaure la sensibilité à la dopamine et régule les émotions, l'amygdale (centre des émotions) est stable. Votre sommeil fait son travail.",
    },
  ],
  questionInsights: [
    {
      questionId: 'qual-1',
      triggerMaxScore: 1,
      insight:
        "Quand le sommeil est perçu comme mauvais, le cerveau entre en mode d'hypervigilance au coucher : le cortex préfrontal et l'amygdale s'activent conjointement, libérant de la noradrénaline qui inhibe les neurones du VLPO (ventrolateral preoptic area) — la zone hypothalamique qui déclenche et maintient le sommeil via des projections GABAergiques sur tous les systèmes d'éveil. C'est un flip-flop switch : soit le VLPO domine (sommeil), soit les systèmes d'éveil dominent (éveil) — il n'y a pas d'état intermédiaire stable. L'anxiété de performance bascule la balance vers l'éveil précisément au moment où vous essayez de dormir.",
      recommendation:
        "La TCC-I (thérapie comportementale et cognitive pour l'insomnie) est le traitement recommandé en première ligne : 4-6 séances, résultats supérieurs aux somnifères à long terme. Elle agit sur l'hyperactivation cognitive et reconditionne l'association lit-sommeil. Demandez une orientation à votre médecin.",
      action: 'Demandez à votre médecin une orientation vers la TCC-I.',
      actionWhy:
        "La TCC-I agit directement sur trois mécanismes : 1) la restriction de sommeil concentre la pression d'adénosine pour renforcer le VLPO, 2) le contrôle du stimulus désactive le conditionnement lit-éveil en supprimant l'activation amygdalienne associée au lit, 3) la restructuration cognitive réduit l'hyperactivation du cortex préfrontal en modifiant les croyances dysfonctionnelles sur le sommeil. L'effet net : le VLPO peut de nouveau dominer sans être inhibé par l'anxiété.",
    },
    {
      questionId: 'qual-2',
      triggerMaxScore: 1,
      insight:
        "Les benzodiazépines et le zolpidem induisent le sommeil en potentialisant les récepteurs GABA-A de manière non sélective — ce n'est pas du sommeil, c'est une sédation : l'EEG cérébral est différent, avec moins d'ondes lentes caractéristiques du sommeil profond et moins d'activité REM. La mémoire ne se consolide pas de la même façon. Le zolpidem produit de surcroît des comportements automatiques nocturnes (somnambulisme, alimentation, conduite) et une amnésie antérograde dans ~3 % des cas. Le CBD agit sur les récepteurs CB1 du système endocannabinoïde qui modulant le système orexine/hypocrétine (éveil) — cet effet peut désynchroniser le rythme REM et perturber la régulation émotionnelle nocturne ; l'évidence clinique sur le sommeil reste insuffisante.",
      recommendation:
        "Évoquez votre consommation avec votre médecin et explorez la TCC-I : ses bénéfices sont durables car elle agit sur les causes de l'insomnie, pas ses symptômes.",
      action: 'Mentionnez votre consommation de somnifères à votre médecin et demandez une orientation vers la TCC-I.',
      actionWhy:
        "La TCC-I restaure la capacité naturelle du VLPO à inhiber les systèmes d'éveil, sans modifier les récepteurs ni créer de tolérance. Ses bénéfices augmentent avec le temps (à l'inverse des somnifères qui créent une tolérance) et persistent à l'arrêt. L'ACP (2016) et l'AASM (2021) la recommandent en première ligne précisément parce qu'elle agit sur les mécanismes, pas sur les symptômes.",
    },
    {
      questionId: 'qual-3',
      triggerMaxScore: 1,
      insight:
        "L'adénosine est un sous-produit du métabolisme énergétique neuronal (dégradation de l'ATP). Elle s'accumule dans le cerveau tout au long de l'éveil et se lie aux récepteurs A1 (inhibent les neurones d'éveil) et A2A (activent les neurones du VLPO pro-sommeil) du prosencéphale basal. Normalement, une nuit complète élimine toute l'adénosine accumulée. Si la durée de sommeil est insuffisante ou si les cycles sont fragmentés, une quantité résiduelle d'adénosine reste le matin — c'est la somnolence. Des microsommeils (3-10 secondes) peuvent survenir involontairement car le VLPO \"gagne\" brièvement le flip-flop switch, même à l'état d'éveil.",
      recommendation:
        "Lumière naturelle dès le réveil (10-15 min dehors) pour activer l'axe cortisol-éveil et synchroniser l'horloge interne. Siestes 10-20 min entre 13h et 15h maximum, pas plus longues, pas après 15h.",
      action: 'Exposez-vous à la lumière naturelle dès le réveil (10-15 min) et limitez les siestes à 20 min avant 15h.',
      actionWhy:
        "La lumière naturelle matinale (longueur d'onde 480nm) active les cellules mélanopsines de la rétine qui projettent directement sur le NSC. Le NSC envoie un signal à la glande pinéale pour bloquer la mélatonine, et active l'axe HPA (hypothalamo-hypophyso-surrénalien) pour libérer le cortisol matinal — pic naturel à 8-9h qui contre-balance l'adénosine résiduelle. Une sieste de 10-20 min en début d'après-midi permet de consolider brièvement les souvenirs de la matinée (réactivation hippocampique) et de résoudre une partie de l'adénosine sans entrer en sommeil profond — ce qui évite de réduire la pression de sommeil nocturne.",
    },
    {
      questionId: 'qual-4',
      triggerMaxScore: 1,
      insight:
        "Le sommeil paradoxal est la phase où le cerveau restaure la sensibilité des récepteurs dopaminergiques du système mésolimbique (voie de la récompense et de la motivation). Pendant le REM, la dopamine est libérée en bouffées dans le noyau accumbens et le striatum ventral, réinitialisant leur sensibilité. La privation de sommeil paradoxal — qui est la première phase sacrifiée parce qu'elle est dominante en fin de nuit (si vous dormez 6h au lieu de 8h, vous perdez 60-90 min de REM) — réduit progressivement cette réinitialisation. Sans REM suffisant, les récepteurs dopaminergiques deviennent hyposensibles : la même quantité de dopamine produit moins d'effet de récompense et de motivation. C'est neurologique, pas psychologique.",
      recommendation:
        "7-9 heures de sommeil dans l'agenda, non négociables. Une activité physique modérée en fin d'après-midi améliore simultanément la qualité du sommeil nocturne et l'énergie du lendemain.",
      action: 'Protégez une fenêtre fixe de 7-9 heures de sommeil dans votre agenda.',
      actionWhy:
        "Protéger 7-9h de sommeil garantit les 2 dernières heures riches en sommeil paradoxal. L'activité physique modérée en fin d'après-midi augmente la libération de BDNF (brain-derived neurotrophic factor) qui améliore la plasticité des circuits dopaminergiques et facilite la consolidation mémorielle nocturne — double bénéfice sur la motivation diurne.",
    },
  ],
  references: [
    {
      authors: 'Yoo SS, Gujar N, Hu P, Jolesz FA, Walker MP',
      title: 'The human emotional brain without sleep — a prefrontal amygdala disconnect',
      journal: 'Current Biology',
      year: 2007,
      doi: '10.1016/j.cub.2007.08.007',
      pmid: '17956744',
    },
    {
      authors: 'Edinger JD, Arnedt JT, Bertisch SM et al.',
      title: 'Behavioral and psychological treatments for chronic insomnia disorder in adults: an American Academy of Sleep Medicine clinical practice guideline',
      journal: 'Journal of Clinical Sleep Medicine',
      year: 2021,
      doi: '10.5664/jcsm.8986',
      pmid: '33164741',
    },
    {
      authors: 'Qaseem A, Kansagara D, Forciea MA et al.',
      title: 'Management of chronic insomnia disorder in adults: a clinical practice guideline from the American College of Physicians',
      journal: 'Annals of Internal Medicine',
      year: 2016,
      doi: '10.7326/M15-2175',
      pmid: '27136449',
    },
    {
      authors: 'Van Dongen HP, Maislin G, Mullington JM, Dinges DF',
      title: 'The cumulative cost of additional wakefulness: dose-response effects on neurobehavioral functions',
      journal: 'Sleep',
      year: 2003,
      doi: '10.1093/sleep/26.2.117',
      pmid: '12683469',
    },
  ],
}

// ══════════════════════════════════════════════════════
// SECTION 3 — Hygiène du sommeil
// ══════════════════════════════════════════════════════

const hygieneSommeilReport: SectionReport = {
  sectionId: 'hygiene-sommeil',
  context:
    "Le sommeil est gouverné par deux processus : la pression de sommeil (l'adénosine, une molécule qui s'accumule pendant l'éveil et crée l'envie de dormir) et le rythme circadien (l'horloge interne de 24h). Des horaires irréguliers créent un décalage horaire interne permanent. La lumière bleue des écrans retarde la mélatonine (l'hormone du coucher) de 90 min. La caféine bloque la pression de sommeil pendant 5 à 10 heures selon le profil individuel. L'alcool supprime le sommeil paradoxal de 24 % même à dose modérée.",
  strengthLabel: 'Vos habitudes du soir protègent votre sommeil',
  weaknessLabel: 'Des habitudes perturbent activement votre sommeil',
  scienceNote:
    "De bonnes habitudes du soir permettent à la mélatonine de se libérer au bon moment et à la température corporelle de baisser naturellement : les deux déclencheurs biologiques de l'endormissement.",
  recommendations: [
    {
      maxPct: 33,
      level: 'alerte',
      title: 'Habitudes très défavorables',
      text: "Vos habitudes du soir sont probablement la cause principale de vos difficultés de sommeil. C'est aussi ce qui est le plus accessible à corriger : deux ou trois changements ciblés produisent des résultats en 2-3 semaines.",
    },
    {
      maxPct: 66,
      level: 'vigilance',
      title: 'Habitudes à revoir',
      text: "Plusieurs habitudes perturbent activement votre sommeil. Priorité 1 : régularité des horaires. Priorité 2 : stopper la caféine avant 13-14h. Chaque ajustement a un effet cumulatif visible rapidement.",
    },
    {
      maxPct: 90,
      level: 'bon',
      title: 'Bonnes habitudes, quelques points à affiner',
      text: "Vos habitudes sont globalement solides. Identifiez les 1-2 points restants dans vos réponses et corrigez-les.",
    },
    {
      maxPct: 100,
      level: 'excellent',
      title: 'Très bonnes habitudes',
      text: "Horaires réguliers, caféine coupée tôt, pas d'écrans au lit : vous avez les fondations d'un sommeil de qualité.",
    },
  ],
  questionInsights: [
    {
      questionId: 'hyg-1',
      triggerMaxScore: 1,
      insight:
        "L'horloge circadienne est localisée dans le noyau suprachiasmatique (NSC) de l'hypothalamus — un ensemble de ~20 000 neurones qui oscillent sur un cycle d'environ 24h grâce à une boucle de rétrocontrôle de gènes horloges (CLOCK, BMAL1, PER, CRY). Le signal lumineux (Zeitgeber principal) atteint le NSC via les ipRGCs rétiniennes et remet l'horloge à l'heure chaque matin. Quand l'heure de lever varie, le NSC reçoit le signal lumineux à des heures différentes — il ne peut pas calibrer précisément le moment de libération de la mélatonine le soir ni programmer le pic de cortisol matinal. Résultat : décalage horaire interne, similaire à un jet lag de 1-3 heures répété chaque semaine.",
      recommendation:
        "Heure de coucher fixe à ±30 min, 7j/7, week-ends inclus. Mettez une alarme 'heure du coucher'. L'adaptation est visible en 1-2 semaines : la mélatonine commence à se libérer à heure prévisible, l'endormissement devient naturel.",
      action: 'Fixez une heure de coucher à ±30 min, 7j/7 week-ends inclus.',
      actionWhy:
        "Un lever fixe fournit au NSC un Zeitgeber lumineux cohérent chaque matin, lui permettant de calculer précisément 16h à l'avance l'heure de libération de la mélatonine et de programmer le pic de cortisol au bon moment. Après 1-2 semaines de régularité, la mélatonine commence à se libérer spontanément 30-45 min avant l'heure de coucher choisie, rendant l'endormissement naturel.",
    },
    {
      questionId: 'hyg-2',
      triggerMaxScore: 1,
      insight:
        "Le conditionnement opérant (apprentissage associatif) crée des associations contextuelles stockées dans l'hippocampe. Chaque heure passée au lit éveillé — à s'inquiéter, regarder les écrans, ruminer — renforce la synapse hippocampique associant \"chambre + lit\" à l'état d'éveil et à l'activation sympathique (cortisol, noradrénaline). La glande surrénale finit par libérer du cortisol de façon réflexe dès que vous entrez dans la chambre. C'est un conditionnement pavlovien : le lit est devenu un stimulus conditionné qui déclenche l'éveil.",
      recommendation:
        "Contrôle du stimulus (pilier de la TCC-I) : si pas endormi en 20 min, quittez la chambre, activité calme à lumière tamisée, revenez uniquement quand le sommeil revient. Répété sur quelques nuits, ça recrée l'association lit-sommeil.",
      action: 'Si pas endormi en 20 min, quittez la chambre et revenez uniquement quand le sommeil revient.',
      actionWhy:
        "Le contrôle du stimulus (pilier de la TCC-I) extingue cette association par non-renforcement : en quittant le lit dès que le sommeil n'arrive pas, vous supprimez le renforcement négatif (frustration au lit). Après 5-10 nuits, l'hippocampe forme une nouvelle association : lit = somnolence et détente (parce que les seules fois où vous êtes au lit, vous dormez). La réponse parasympathique remplace la réponse sympathique.",
    },
    {
      questionId: 'hyg-3',
      triggerMaxScore: 1,
      insight:
        "L'endormissement requiert une bascule du flip-flop switch hypothalamique vers le VLPO (sommeil). Cette bascule est inhibée par toute activation du cortex préfrontal, qui projette sur l'amygdale et les systèmes d'éveil noradrénergiques. Regarder l'heure déclenche immédiatement un calcul automatique (\"il me reste X heures\") qui active le cortex préfrontal, libère de la noradrénaline via le locus coeruleus, et inhibe le VLPO. De surcroît, la lumière de l'écran du téléphone (même brève) supprime partiellement la mélatonine via les ipRGCs. Double inhibition : cognitive et photique.",
      recommendation:
        "Retirez ou couvrez l'horloge de la chambre, et ne regardez pas l'heure sur le téléphone : chaque coup d'oeil déclenche un calcul automatique ('il me reste X heures') qui amplifie l'anxiété de performance et maintient le cortex préfrontal actif.",
      action: 'Retirez ou couvrez l\'horloge de la chambre et ne regardez pas l\'heure sur le téléphone la nuit.',
      actionWhy:
        "Retirer ou couvrir l'horloge supprime le stimulus conditionné qui déclenche l'activation préfrontale. Sans ce stimulus, le cortex préfrontal ne reçoit pas l'invitation à \"calculer\" — la noradrénaline reste basse, le VLPO peut prendre le dessus. C'est l'application directe de la thérapie par extinction du conditionnement cognitif.",
    },
    {
      questionId: 'hyg-4',
      triggerMaxScore: 1,
      insight:
        "La caféine est un antagoniste compétitif des récepteurs à l'adénosine A1 et A2A : elle se lie à ces récepteurs sans les activer, bloquant l'accès à l'adénosine endogène. Mais l'adénosine continue de s'accumuler derrière ce blocage — elle se lie aux récepteurs dès que la caféine est métabolisée par le foie (enzyme CYP1A2), provoquant un crash soudain (la \"vague de fatigue\" post-caféine). Sa demi-vie est de 5-7h en moyenne, jusqu'à 10h selon le génotype CYP1A2 : un café à 16h maintient ~50% de son effet à 22h, réduisant le NREM N3 (sommeil profond) même si l'endormissement semble normal — le sommeil profond est moins profond, les ondes delta moins amples.",
      recommendation:
        "Dernière caféine avant 13-14h. Sources cachées : thé noir (50-80 mg), chocolat noir, certains sodas. En soirée : tisanes (camomille, passiflore).",
      action: 'Stoppez toute caféine après 13-14h (café, thé noir, chocolat noir, sodas).',
      actionWhy:
        "Couper la caféine à 13-14h laisse 8-10h de métabolisation avant le coucher (selon le profil génétique), permettant à l'adénosine accumulée d'agir normalement sur ses récepteurs le soir. La pression de sommeil est intacte, les ondes delta du sommeil profond de pleine amplitude, et la récupération physique complète.",
    },
    {
      questionId: 'hyg-5',
      triggerMaxScore: 1,
      insight:
        "L'heure de lever est le Zeitgeber le plus puissant pour l'horloge circadienne — plus fort que l'heure de coucher. C'est le signal lumineux du matin qui remet à zéro le NSC et déclenche la cascade : arrêt de mélatonine → pic de cortisol → début du comptage de 16h jusqu'à la prochaine nuit biologique. La grasse matinée du week-end retarde ce signal de 1-3h : le NSC reprogramme la libération de mélatonine 1-3h plus tard — le \"jet lag social\" qui désynchronise toute la semaine suivante, similaire à un vol Paris-Moscou et retour chaque week-end.",
      recommendation:
        "Même heure de réveil tous les jours, ±30 min, week-end inclus. Fatigue le week-end : préférez une sieste de 20 min à une grasse matinée.",
      action: 'Levez-vous à la même heure chaque matin (±30 min), week-end inclus.',
      actionWhy:
        "Un lever fixe 7j/7 maintient le NSC synchronisé sur un cycle précis. L'heure d'endormissement s'ajuste naturellement, car la mélatonine commence à monter à la même heure chaque soir et l'adénosine atteint son seuil d'endormissement à heure prévisible. Si vous êtes fatigué le week-end, une sieste de 20 min élimine l'adénosine résiduelle sans retarder le signal lumineux du matin.",
    },
    {
      questionId: 'hyg-6',
      triggerMaxScore: 1,
      insight:
        "Les siestes de moins de 20 min restent en sommeil léger (N1-N2). Au-delà de 20-30 min, le cerveau entre en sommeil profond (N3) : l'inertie du sommeil au réveil est due au fait que le VLPO est fortement activé et que la bascule vers l'éveil est lente (10-30 min pour retrouver des performances normales). Plus problématique : chaque minute de sieste élimine de l'adénosine accumulée depuis le matin — une sieste d'1h peut réduire suffisamment la pression de sommeil pour retarder l'endormissement de 1-2h le soir et fragmenter le sommeil profond nocturne.",
      recommendation:
        "Siestes 10-20 min maximum, entre 13h et 15h. Astuce du café-sieste : buvez un café juste avant de vous allonger ; la caféine met 20 min à agir, elle entre en action au réveil et augmente l'énergie sans perturber la nuit.",
      action: 'Limitez vos siestes à 20 min maximum, avant 15h.',
      actionWhy:
        "Une sieste de 10-20 min élimine une fraction d'adénosine (soulagement de la somnolence) sans entrer en N3, donc sans inertie au réveil. L'astuce du café-sieste fonctionne parce que la caféine met 20-30 min à traverser la barrière hémato-encéphalique et à atteindre ses récepteurs — elle entre en action précisément au moment du réveil, amplifiant l'effet de récupération sans créer de somnolence post-sieste.",
    },
    {
      questionId: 'hyg-7',
      triggerMaxScore: 1,
      insight:
        "Les cellules ganglionnaires mélanopsines de la rétine (ipRGCs) sont maximalements sensibles à la lumière bleue (~480 nm). Elles projettent directement sur le NSC via le tractus rétino-hypothalamique. Le NSC envoie un signal inhibiteur à la glande pinéale via le système nerveux sympathique, bloquant la conversion de sérotonine en N-acétylsérotonine puis en mélatonine (enzyme arylalkyamine N-acétyltransférase). 2h d'exposition à un écran lumineux (≥150 lux à 480nm) retardent ce processus de 90 min et réduisent le pic nocturne de mélatonine de 50%, raccourcissant le sommeil paradoxal de fin de nuit de 20%.",
      recommendation:
        "Couvre-feu digital à 21h : lumières tamisées, pas d'écran, téléphone hors de la chambre. Minimum 60 min d'écran-free avant le coucher.",
      action: 'Instaurez un couvre-feu digital à 21h : lumières tamisées, pas d\'écran, téléphone hors de la chambre.',
      actionWhy:
        "Éteindre les écrans 60-90 min avant le coucher lève l'inhibition du NSC sur la glande pinéale. La mélatonine commence à être synthétisée et libérée dans le sang, atteignant son pic (50-250 pg/mL) entre 2h et 4h du matin. Des lunettes filtrant le bleu (amber, >98% de filtration à 480nm) permettent une réduction de ~60% de la suppression de mélatonine si les écrans sont indispensables.",
    },
    {
      questionId: 'hyg-8',
      triggerMaxScore: 1,
      insight:
        "Deux mécanismes distincts perturbent le sommeil après un repas tardif. 1) Thermique : la digestion augmente le métabolisme de base de 10-15% (effet thermique des aliments), maintenant la température corporelle centrale élevée et retardant la descente thermique nécessaire à l'endormissement (le corps doit perdre 0,5-1°C). 2) Glycémique : un repas riche en glucides raffinés provoque une hyperglycémie, suivie d'un pic insulinique, suivi d'une hypoglycémie réactionnelle 2-3h plus tard — cette hypoglycémie déclenche une réponse adrénergique (cortisol + adrénaline pour remonter le glucose) qui fragmente le sommeil profond de la deuxième partie de nuit. Le tryptophane (précurseur de la sérotonine puis de la mélatonine) est absorbé plus facilement le soir quand les compétiteurs neutres sont éliminés.",
      recommendation:
        "Dîner léger 2-4h avant le coucher, riche en tryptophane (œufs, légumineuses, noix). Jeûne nocturne ≥12h (Time Restricted Feeding). Petite faim tardive : une poignée de noix.",
      action: 'Dînez léger 2-4h avant le coucher et visez un jeûne nocturne de 12h minimum.',
      actionWhy:
        "Dîner léger 2-4h avant le coucher laisse le temps à la thermogénèse digestive de s'éteindre et à la glycémie de se stabiliser, supprimant les deux perturbateurs. Les aliments riches en tryptophane (œufs, légumineuses, noix, graines de courge) fournissent le substrat pour la synthèse de sérotonine et de mélatonine dans la glande pinéale. Le jeûne nocturne de 12h réduit l'insulinémie nocturne, favorisant la lipolyse et réduisant l'inflammation de bas grade qui perturbe les phases profondes du sommeil.",
    },
    {
      questionId: 'hyg-9',
      triggerMaxScore: 1,
      insight:
        "L'exercice intense active simultanément trois systèmes antagonistes au sommeil. 1) Thermique : la thermogénèse musculaire élève la température corporelle centrale de 1-2°C ; il faut 4-6h pour revenir à la température basale. 2) Hormonal : l'axe HPA libère du cortisol, dont la demi-vie est de 1h30 mais les effets durent 4-6h ; l'axe sympatho-surrénalien libère de l'adrénaline qui augmente la fréquence cardiaque et inhibe le VLPO. 3) Neurochimique : l'exercice augmente la noradrénaline cérébrale, qui inhibe directement les neurones du VLPO. Un exercice intense à 20h signifie que ces trois effets sont encore actifs à 23h-minuit.",
      recommendation:
        "Effort intense avant 19h, idéalement 15h-17h. Le soir : étirements doux, yoga, marche légère, des activités qui activent le système parasympathique et préparent la descente thermique.",
      action: 'Pratiquez l\'effort intense avant 19h (idéalement 15h-17h) et optez pour des étirements doux le soir.',
      actionWhy:
        "Exercer entre 15h et 17h exploite la thermogénèse comme outil pro-sommeil : la température corporelle s'élève jusqu'à 17-18h, puis amorce une descente naturelle qui coïncide avec le signal biologique d'endormissement (les deux courbes thermiques — post-exercice et circadienne — s'additionnent pour une descente plus ample le soir). Le cortisol et l'adrénaline ont le temps de se métaboliser avant 23h. L'exercice à cette fenêtre augmente aussi la proportion de sommeil profond d'environ 15% (via la GH).",
    },
    {
      questionId: 'hyg-10',
      triggerMaxScore: 1,
      insight:
        "L'alcool agit sur les récepteurs GABA-A (inhibiteurs) et NMDA (excitateurs) : il potentialise GABA et inhibe NMDA, produisant une sédation qui ressemble au sommeil mais n'en a pas l'architecture. Dans la deuxième partie de nuit, l'alcool est métabolisé en acétaldéhyde par l'alcool déshydrogénase hépatique — l'acétaldéhyde est un excitateur neuronal qui stimule le locus coeruleus (libération de noradrénaline) et l'amygdale, fragmentant le sommeil. Simultanément, la tolérance aux récepteurs GABA-A du soir provoque un rebond d'excitabilité. Et les circuits du tronc cérébral qui génèrent le sommeil paradoxal (tegmentum pontique latérodorsal) sont directement supprimés par l'alcool — deux verres de vin suffisent à réduire le REM de 24%.",
      recommendation:
        "Zéro alcool dans les 4h avant le coucher. Si vous buvez en soirée : finissez tôt, alternez avec de l'eau.",
      action: 'Évitez tout alcool dans les 4 heures avant le coucher.',
      actionWhy:
        "Arrêter l'alcool 4h avant le coucher laisse le temps à l'alcool (et à l'acétaldéhyde) d'être métabolisés avant le début du sommeil paradoxal de la deuxième moitié de nuit. La fenêtre critique : si vous dormez à 23h, finir de boire à 19h garantit que les circuits du tegmentum pontique ne sont plus inhibés lors du premier cycle REM (~1h30 du matin).",
    },
  ],
  references: [
    {
      authors: 'Walker MP',
      title: 'Why We Sleep: Unlocking the Power of Sleep and Dreams',
      journal: 'Scribner',
      year: 2017,
    },
    {
      authors: 'Chang AM, Aeschbach D, Duffy JF, Czeisler CA',
      title: 'Evening use of light-emitting eReaders negatively affects sleep, circadian timing, and next-morning alertness',
      journal: 'Proc Natl Acad Sci USA',
      year: 2015,
      doi: '10.1073/pnas.1418490112',
      pmid: '25535358',
    },
    {
      authors: 'Ebrahim IO, Shapiro CM, Williams AJ, Fenwick PB',
      title: 'Alcohol and sleep I: effects on normal sleep',
      journal: 'Alcohol Clin Exp Res',
      year: 2013,
      doi: '10.1111/acer.12006',
      pmid: '23347102',
    },
    {
      authors: 'Irish LA, Kline CE, Gunn HE et al.',
      title: 'The role of sleep hygiene in promoting public health: A review of empirical evidence',
      journal: 'Sleep Med Rev',
      year: 2015,
      doi: '10.1016/j.smrv.2014.10.001',
      pmid: '25454674',
    },
  ],
}

// ══════════════════════════════════════════════════════
// SECTION 4 — Profil complémentaire
// ══════════════════════════════════════════════════════

const profilReport: SectionReport = {
  sectionId: 'profil-complementaire',
  context:
    "Certains signaux nocturnes correspondent à des troubles spécifiques et distincts. L'hyperactivation cognitive au coucher (l'esprit qui continue à planifier, anticiper, ruminer) est le mécanisme central de l'insomnie chronique : la zone du cerveau dédiée au raisonnement reste active et inhibe les structures d'endormissement. Les apnées obstructives du sommeil touchent 1 adulte sur 10, sont diagnostiquées dans seulement 20 % des cas, et fragmentent le sommeil via des micro-éveils répétés imperceptibles. Le syndrome des jambes sans repos (envies irrépressibles de bouger les membres au repos) est souvent traitable dès que sa cause est identifiée : un déficit en fer perturbant la production de dopamine dans la majorité des cas.",
  strengthLabel: 'Pas de signe clinique de trouble du sommeil spécifique (apnées, jambes sans repos...)',
  weaknessLabel: 'Signaux spécifiques à explorer avec un médecin',
  scienceNote:
    "L'absence de signaux spécifiques (hyperactivation cognitive, ronflement fort, jambes agitées, fatigue persistante au réveil) est rassurante : votre profil ne suggère pas de trouble caractérisé du sommeil.",
  recommendations: [
    {
      maxPct: 33,
      level: 'alerte',
      title: 'Signaux importants à explorer',
      text: "Votre profil révèle plusieurs signaux évoquant un ou plusieurs troubles du sommeil traitables. Une consultation médicale est recommandée : une polygraphie ventilatoire (pour les apnées) ou un bilan simple peuvent débloquer une situation installée depuis parfois des années.",
    },
    {
      maxPct: 66,
      level: 'vigilance',
      title: 'Signaux à évaluer',
      text: "Plusieurs signaux méritent d'être mentionnés à votre médecin. Certains troubles du sommeil passent inaperçus pendant des années car leurs symptômes (fatigue, maux de tête matinaux, motivation basse) semblent banaux.",
    },
    {
      maxPct: 90,
      level: 'bon',
      title: 'Quelques signaux légers',
      text: "Quelques signaux mineurs présents. Mentionnez-les à votre médecin lors de votre prochain bilan de santé.",
    },
    {
      maxPct: 100,
      level: 'excellent',
      title: 'Aucun signal d\'alerte',
      text: "Pas d'hyperactivation cognitive, pas de signe d'apnée, pas de jambes sans repos, pas de fatigue persistante au réveil. Profil rassurant.",
    },
  ],
  questionInsights: [
    {
      questionId: 'prof-1',
      triggerMaxScore: 1,
      insight:
        "L'endormissement requiert l'activation du VLPO (ventrolateral preoptic area) de l'hypothalamus, qui libère du GABA et de la galanine pour inhiber tous les systèmes d'éveil (noradrénergique, histaminergique, sérotoninergique, orexinergique). Cette activation ne peut pas se produire si le cortex préfrontal est actif : ses projections glutamatergiques sur l'amygdale et les noyaux d'éveil maintiennent la balance du flip-flop switch côté éveil. La planification mentale au coucher (\"qu'est-ce que je dois faire demain, ai-je pensé à X ?\") maintient le cortex préfrontal en mode actif, supprimant l'activation du VLPO. C'est biochimiquement impossible de vouloir s'endormir en pensant intensément.",
      recommendation:
        "Carnet vide-cerveau avant le lit (20 min) : notez toutes les pensées, tâches et préoccupations en suspens, avec une action concrète pour chacune. Complétez avec 10 min de relaxation musculaire progressive (contracter-relâcher chaque groupe musculaire, des pieds jusqu'au visage).",
      action: 'Tenez un carnet "vide-cerveau" chaque soir : pensées, tâches, une action concrète pour chacune.',
      actionWhy:
        "Le carnet vide-cerveau fonctionne par déchargement cognitif : en externalisant les préoccupations sur papier avec une action concrète pour chacune, vous réduisez la charge en mémoire de travail du cortex préfrontal. Des études EEG montrent une réduction de l'activité des ondes bêta frontales (associées à la pensée active) après 20 min d'écriture structurée, facilitant la transition vers les ondes alpha puis thêta de l'endormissement.",
    },
    {
      questionId: 'prof-2',
      triggerMaxScore: 1,
      insight:
        "Les ruminations activent le réseau par défaut (Default Mode Network — DMN) : un réseau de régions cérébrales actif quand on ne se concentre sur rien d'external mais sur soi-même (cortex cingulaire postérieur, cortex préfrontal médial, hippocampe). Ce réseau est incompatible avec l'endormissement car il maintient une activité cérébrale de haut niveau. Paradoxe : tenter de supprimer une pensée (\"ne pense pas à ça\") active le cortex préfrontal pour surveiller si la pensée est présente — ce qui l'active davantage (Wegner, 1994). L'effort de suppression renforce la rumination.",
      recommendation:
        "15 min de 'temps des soucis structuré' en début de soirée (pas au lit) : notez chaque préoccupation et quand vous l'adresserez concrètement. Au lit : scan corporel de la tête aux pieds, en relâchant consciemment chaque zone musculaire.",
      action: 'Faites 15 min de "temps des soucis structuré" en début de soirée, pas au lit.',
      actionWhy:
        "Le \"temps des soucis structuré\" (15-20 min en début de soirée) compartimente les ruminations dans un espace-temps dédié hors du lit. Le cerveau interprète cela comme \"ce problème a été traité\" et réduit son activation du DMN au coucher. Au lit, le scan corporel (attention focalisée sur des sensations physiques) active le réseau attentionnel (qui inhibe le DMN), remplaçant le mode rumination par le mode sensoriel — compatible avec l'endormissement.",
    },
    {
      questionId: 'prof-3',
      triggerMaxScore: 1,
      insight:
        "Les palpitations et la sensation de chaleur interne au coucher signalent une activation du système nerveux sympathique : le cortisol (produit par les glandes surrénales via l'axe HPA) et l'adrénaline sont encore élevés. Le cortisol suit normalement une courbe circadienne avec un pic à 8-9h et un nadir à minuit ; le stress chronique ou un exercice tardif perturbent cette courbe en maintenant le cortisol élevé le soir. Résultat direct : fréquence cardiaque élevée (antagonisme du parasympathique par la noradrénaline), vasoconstriction périphérique (qui empêche la descente thermique), et inhibition du VLPO (qui empêche l'endormissement).",
      recommendation:
        "Cohérence cardiaque : 5s inspiration / 5s expiration (6 cycles/min), 5 min. Active le nerf vague et bascule le système nerveux en mode parasympathique en quelques minutes. Alternative : bain ou douche chaude 1h30 avant le coucher ; la descente thermique post-bain facilite l'endormissement.",
      action: 'Pratiquez 5 min de cohérence cardiaque au coucher (5s inspiration / 5s expiration).',
      actionWhy:
        "La respiration à 6 cycles/min (cohérence cardiaque) stimule les afférences vagales (nerf vague X) via l'arythmie sinusale respiratoire. Le nerf vague projette sur le noyau du tractus solitaire qui inhibe l'amygdale et réduit l'activation de l'axe HPA — le cortisol commence à baisser dans les 5-10 minutes. Simultanément, la stimulation vagale augmente l'activité parasympathique cardiaque (réduction du rythme) et induit une légère vasodilatation périphérique, permettant à la descente thermique de s'initier.",
    },
    {
      questionId: 'prof-4',
      triggerMaxScore: 1,
      insight:
        "Le cerveau forme des associations contextuelles via le conditionnement classique pavlovien, stockées dans l'hippocampe et le cortex entorhinal. Chaque fois que vous restez éveillé dans votre chambre (travail, écran, inquiétude de ne pas dormir), l'hippocampe renforce la synapse : chambre + lit = éveil + frustration + cortisol. Cette association est suffisamment robuste pour déclencher une réponse sympathique (libération de cortisol, augmentation du rythme cardiaque) réflexe dès l'entrée dans la chambre — indépendamment de votre état de fatigue. Hors de chez vous, en l'absence de ces stimuli conditionnés, le conditionnement ne s'active pas.",
      recommendation:
        "Chambre = cave à sommeil uniquement : obscurité totale (masque si nécessaire), 16-19°C, silence ou bruit blanc. Plus d'écran, plus de travail, pas de repas dans la chambre. Ce reconditionnement produit des effets en 2-3 semaines.",
      action: 'Transformez votre chambre : obscurité totale, 16-19°C, silence ou bruit blanc. Pas d\'écran, pas de travail.',
      actionWhy:
        "Transformer la chambre en \"cave à sommeil\" (obscurité totale, fraîcheur, silence, aucune activité d'éveil) extingue progressivement le conditionnement négatif par non-renforcement : chaque nuit sans frustration dans la chambre affaiblit la synapse hippocampique lit-éveil. Après 2-3 semaines de discipline stricte, une nouvelle association se forme : chambre = détente et somnolence.",
    },
    {
      questionId: 'prof-5',
      triggerMaxScore: 1,
      insight:
        "La fatigue au réveil malgré une durée de sommeil apparemment suffisante est le signe classique d'un sommeil non réparateur. Deux causes principales : 1) Les apnées génèrent des micro-éveils répétés (5 à 100 par heure) via l'activation des chémorécepteurs carotidiens, fragmentant le sommeil profond sans souvenir conscient. Chaque micro-éveil réinitialise le cycle — le N3 ne se consolide jamais suffisamment pour permettre la libération normale d'hormone de croissance et le nettoyage glymphatique. 2) Un environnement trop chaud empêche la descente thermique et maintient le sommeil en N1-N2 superficiel toute la nuit. Dans les deux cas, le matin ressemble à une nuit blanche partielle.",
      recommendation:
        "Symptôme régulier → consultez votre médecin pour évaluer une polygraphie ventilatoire. En parallèle : chambre fraîche (16-19°C), obscurité totale.",
      action: 'Consultez votre médecin si vous vous réveillez régulièrement plus fatigué qu\'au coucher.',
      actionWhy:
        "Une polygraphie ventilatoire à domicile enregistre la saturation en O₂, le flux nasal et thoracique toute la nuit — elle quantifie précisément l'index d'apnées-hypopnées (IAH) et identifie si c'est la cause. Un traitement par PPC supprimant les obstructions restaure le N3 dès la première nuit : les patients rapportent une amélioration majeure de la fatigue matinale en 1-2 semaines de traitement.",
    },
    {
      questionId: 'prof-6',
      triggerMaxScore: 1,
      insight:
        "Le ronflement fort associé à des pauses respiratoires remarquées par l'entourage est la présentation classique des apnées obstructives sévères. Pendant chaque pause : 1) la saturation en O₂ chute (désaturation ≥3-4%), 2) le CO₂ s'accumule, 3) les chémorécepteurs centraux et périphériques activent le tronc cérébral qui déclenche un micro-éveil d'urgence avec activation sympathique massive (pic de noradrénaline, cortisol, tachycardie). Ces micro-éveils répétés fragmentent le sommeil profond et le REM, créant une dette de récupération nocturne. À long terme : hypertension artérielle (activation sympathique chronique nocturne), risque cardiovasculaire augmenté, et atteintes cognitives.",
      recommendation:
        "Polygraphie ventilatoire (prescription médicale, réalisée à domicile) pour confirmer ou exclure le diagnostic. Si apnées confirmées : le traitement par PPC transforme la qualité du sommeil dès la première nuit.",
      action: 'Consultez votre médecin pour une polygraphie ventilatoire.',
      actionWhy:
        "La PPC maintient une pression positive continue dans les voies aériennes supérieures (généralement 6-14 cmH₂O), équivalente à une attelle pneumatique qui maintient les voies ouvertes. Résultat : zéro obstruction, zéro désaturation, zéro activation des chémorécepteurs, zéro micro-éveil lié aux apnées. Le N3 et le REM se normalisent dès la première nuit — les bénéfices cognitifs et cardiaques suivent dans les semaines.",
    },
    {
      questionId: 'prof-7',
      triggerMaxScore: 1,
      insight:
        "La triade bouche sèche + maux de tête matinaux + ronflement fort est un tableau clinique qui oriente vers les apnées du sommeil. La bouche sèche résulte de la respiration buccale forcée (mécanisme compensatoire quand les voies nasales sont partiellement obstruées) qui assèche la muqueuse buccale. Les maux de tête matinaux sont causés par les désaturations nocturnes en O₂ : le CO₂ s'accumule, provoquant une vasodilatation cérébrale (les vaisseaux cérébraux sont sensibles au CO₂) qui génère les céphalées. Ces deux symptômes s'ajoutent au ronflement pour composer la triade diagnostique.",
      recommendation:
        "Si ces 3 signes coexistent, consultez votre médecin. En attendant : position latérale stricte, hydratation suffisante en soirée.",
      action: 'Notez la fréquence de ces symptômes et signalez-les à votre médecin.',
      actionWhy:
        "Le diagnostic de polygraphie ventilatoire enregistre la saturation en O₂, le flux nasal/buccal et le débit respiratoire thoracique toute la nuit. Il quantifie l'IAH et confirme ou exclut les apnées. Un traitement précoce par PPC supprime les désaturations, normalise le CO₂ et élimine la vasodilatation cérébrale nocturne — les 3 symptômes disparaissent en quelques nuits.",
    },
    {
      questionId: 'prof-8',
      triggerMaxScore: 1,
      insight:
        "Le syndrome des jambes sans repos (SJSR) résulte d'une dysfonction dopaminergique dans les circuits spinaux de contrôle moteur. La dopamine inhibe normalement les neurones spinaux qui contrôlent le mouvement des membres ; quand la dopamine est insuffisante, ces neurones deviennent hyperactifs au repos, générant des sensations d'inconfort irrépressible et le besoin de bouger. Le fer est un cofacteur indispensable de la tyrosine hydroxylase, l'enzyme limitante de la synthèse de dopamine (tyrosine → L-DOPA → dopamine) dans la substantia nigra et le striatum. Un déficit en ferritine (<50-75 μg/L selon les études) réduit la disponibilité du fer dans les neurones dopaminergiques, limitant la synthèse de dopamine et levant l'inhibition sur les circuits spinaux moteurs.",
      recommendation:
        "Première étape : bilan sanguin avec ferritine (prescrit par votre médecin). En attendant : réduire caféine et alcool le soir, étirements des membres inférieurs, marcher sur du carrelage froid pour soulager les symptômes aigus.",
      action: 'Demandez un bilan ferritine à votre médecin.',
      actionWhy:
        "La mesure de la ferritine sérique identifie un déficit en fer stocké (différent de l'anémie). Une supplémentation orale en fer (sulfate ferreux ou bisglycinate de fer, mieux toléré) augmente les réserves de ferritine sur 3-6 mois, restaurant la disponibilité du fer pour la synthèse de dopamine. Réduire la caféine et l'alcool le soir aident à court terme : la caféine bloque les récepteurs à l'adénosine qui ont un effet modulateur sur les circuits dopaminergiques du SJSR ; l'alcool perturbe le métabolisme dopaminergique nocturne.",
    },
    {
      questionId: 'prof-9',
      triggerMaxScore: 1,
      insight:
        "Le cerveau traite activement les stimuli environnementaux pendant le sommeil, même sans les intégrer à la conscience. Les neurones du tronc cérébral (formation réticulée) continuent à évaluer l'environnement sonore et lumineux pour détecter des menaces potentielles — mécanisme évolutif de survie. Un bruit à 45 dB, une lumière de 5 lux (LED de chargeur), ou une variation de température de 2°C suffisent à déclencher une activation du système d'éveil (libération de noradrénaline) et un micro-éveil. Si ces micro-éveils sont répétés, le sommeil profond est fragmenté et la récupération incomplète — sans que la personne se souvienne de s'être réveillée.",
      recommendation:
        "Auditez la chambre en priorité : 16-19°C, obscurité totale (LED des chargeurs incluses), isolation phonique. Si tout est optimal et les réveils persistent, évoquez un trouble respiratoire avec votre médecin.",
      action: 'Optimisez votre environnement nocturne : température, obscurité totale, isolation phonique.',
      actionWhy:
        "Chaque ajustement environnemental supprime une source de stimulus qui activait les circuits d'éveil. La température à 16-19°C stabilise le signal thermique. L'obscurité totale supprime les activations réflexes des ipRGCs. L'isolation phonique réduit les variations sonores que la formation réticulée traite comme signaux d'alerte. L'effet est cumulatif et direct : moins de stimuli = moins d'activations noradrénergiques = plus de temps en N3.",
    },
    {
      questionId: 'prof-10',
      triggerMaxScore: 1,
      insight:
        "La douleur chronique et le mauvais sommeil s'auto-entretiennent via deux mécanismes réciproques. 1) La douleur active les nocicepteurs et les voies spinothalamiques, réveillant les centres d'éveil du tronc cérébral via la substance grise périaqueducale. 2) Le manque de sommeil profond réduit la production de GH (libérée principalement en N3) et augmente l'IL-6, la CRP et le TNF-α (cytokines pro-inflammatoires) — ces molécules sensibilisent les nocicepteurs périphériques et centraux (hyperalgésie centrale), amplifiant la perception de toute douleur. En parallèle, le manque de REM réduit les endorphines et réduit l'activité des voies descendantes inhibitrices de la douleur (sérotoninergiques et noradrénergiques).",
      recommendation:
        "Méditation pleine conscience guidée 10-20 min avant le coucher : réduit la composante émotionnelle de la douleur chronique, avec des effets mesurables sur le sommeil en 4-6 semaines. Si la douleur est chronique ou s'aggrave, consultez votre médecin : traiter la cause améliore durablement le sommeil.",
      action: 'Pratiquez 10 min de méditation de pleine conscience guidée avant le coucher.',
      actionWhy:
        "La méditation pleine conscience réduit la composante émotionnelle de la douleur en modulant l'activité du cortex cingulaire antérieur (évaluation affective de la douleur) et de l'amygdale — ce n'est pas que la douleur disparaît, c'est que la détresse associée diminue, réduisant l'activation des circuits d'éveil. Elle augmente aussi l'activité des voies descendantes inhibitrices via l'augmentation de sérotonine et de bêta-endorphines. Les étirements et la chaleur locale réduisent les nocicepteurs musculaires et périphériques, coupant le signal à la source.",
    },
  ],
  references: [
    {
      authors: 'Walker MP',
      title: 'Why We Sleep: Unlocking the Power of Sleep and Dreams',
      journal: 'Scribner',
      year: 2017,
    },
    {
      authors: 'Haghayegh S, Khoshnevis S, Smolensky MH et al.',
      title: 'Before-bedtime passive body heating by warm shower or bath to improve sleep',
      journal: 'Sleep Med Rev',
      year: 2019,
      doi: '10.1016/j.smrv.2019.04.008',
      pmid: '31102877',
    },
    {
      authors: 'Allen RP, Picchietti DL, Garcia-Borreguero D et al.',
      title: 'Restless legs syndrome/Willis-Ekbom disease diagnostic criteria',
      journal: 'Sleep Med',
      year: 2014,
      doi: '10.1016/j.sleep.2014.03.025',
      pmid: '25023924',
    },
    {
      authors: 'Zeidan F, Martucci KT, Kraft RA et al.',
      title: 'Brain mechanisms supporting the modulation of pain by mindfulness meditation',
      journal: 'J Neurosci',
      year: 2011,
      doi: '10.1523/JNEUROSCI.5791-10.2011',
      pmid: '21471375',
    },
  ],
}

// ══════════════════════════════════════════════════════
// EXPORTS
// ══════════════════════════════════════════════════════

export const allSectionReports: SectionReport[] = [
  troublesSommeilReport,
  qualiteImpactReport,
  hygieneSommeilReport,
  profilReport,
]

export function getSectionReport(sectionId: string): SectionReport | undefined {
  return allSectionReports.find((r) => r.sectionId === sectionId)
}

export function getSectionRecommendation(report: SectionReport, pct: number) {
  for (const rec of report.recommendations) {
    if (pct <= rec.maxPct) return rec
  }
  return report.recommendations[report.recommendations.length - 1]
}

export function getTriggeredInsights(
  report: SectionReport,
  scores: Record<string, number>
) {
  return report.questionInsights.filter((qi) => {
    const s = scores[qi.questionId]
    if (s === undefined) return false
    if (qi.triggerMinScore === undefined && qi.triggerMaxScore === undefined) return false
    if (qi.triggerMinScore !== undefined) return s >= qi.triggerMinScore
    return s <= (qi.triggerMaxScore as number)
  })
}

// ══════════════════════════════════════════════════════
// GLOBAL INSIGHTS & GLOSSAIRE
// ══════════════════════════════════════════════════════

export interface GlobalInsight {
  title: string
  description: string
  reference: string
}

export const globalKeyInsights: GlobalInsight[] = [
  {
    title: 'Le sommeil est le socle de toute autre habitude de santé',
    description:
      "Dormir moins de 7h/nuit de façon chronique augmente la mortalité toutes causes de 12 %, ainsi que le risque de diabète, de maladies cardiovasculaires et de certains cancers. Une seule nuit courte suffit à activer des centaines de gènes pro-inflammatoires et à réduire de 70 % l'activité des cellules immunitaires (natural killers). Le système de nettoyage cérébral (système glymphatique), actif principalement en sommeil profond, élimine les protéines liées à Alzheimer 10 fois plus efficacement pendant le sommeil qu'à l'éveil.",
    reference: 'Médecine du sommeil et chronobiologie',
  },
  {
    title: 'L\'amygdale sans sommeil : 60 % plus réactive',
    description:
      "Une nuit de sommeil insuffisant rend l'amygdale 60 % plus réactive aux stimuli négatifs et fragilise sa connexion avec le cortex préfrontal. Le résultat : irritabilité accrue, anxiété amplifiée, décisions plus impulsives. Après 10 nuits à 6h, les performances cognitives atteignent le niveau d'une privation totale de 24h, mais le déficit est systématiquement sous-estimé.",
    reference: 'Neurosciences cognitives et médecine du sommeil',
  },
  {
    title: 'Le REM : une thérapie émotionnelle gratuite chaque nuit',
    description:
      "Le sommeil paradoxal (REM) rejoue les souvenirs émotionnellement chargés dans un environnement neurochimique calme (sans noradrénaline), émousant progressivement leur charge émotionnelle. C'est pour cela que les problèmes paraissent toujours moins lourds au matin qu'au soir. Ce travail s'effectue en fin de nuit : c'est la portion de REM que l'alcool, certains somnifères et les réveils précoces suppriment en premier.",
    reference: 'Neurosciences affectives et sommeil',
  },
]

export const sommeilGlossary: { term: string; definition: string }[] = [
  { term: 'Rythme circadien', definition: "Horloge biologique interne de 24h qui régule le cycle veille-sommeil, les hormones et le métabolisme. Gouvernée par le noyau suprachiasmatique (NSC) de l'hypothalamus." },
  { term: 'Mélatonine', definition: "Hormone produite par la glande pinéale au moment du coucher, signalant à l'organisme qu'il est l'heure de dormir. C'est un signal de timing, pas un somnifère : elle prépare le sommeil sans l'induire directement." },
  { term: 'Adénosine', definition: "Molécule qui s'accumule dans le cerveau pendant l'éveil et génère la pression de sommeil. La caféine bloque ses récepteurs sans la résoudre : la dette d'adénosine ressurgit au sevrage (\"crash caféine\")." },
  { term: 'NREM N3 (sommeil profond)', definition: "Phase la plus réparatrice physiquement, dominante en première moitié de nuit. Libération d'hormone de croissance, consolidation de la mémoire déclarative, activation du système glymphatique." },
  { term: 'Sommeil paradoxal (REM)', definition: "Phase associée aux rêves, dominante en fin de nuit. Régulation émotionnelle, consolidation de la mémoire procédurale et créative. Première phase supprimée par l'alcool et certains somnifères." },
  { term: 'Système glymphatique', definition: "Réseau de nettoyage cérébral actif pendant le NREM N3, qui élimine les déchets métaboliques dont les protéines bêta-amyloïdes liées à Alzheimer. 10x plus efficace pendant le sommeil qu'à l'éveil." },
  { term: 'Hyperactivation cognitive', definition: "État où le cortex préfrontal reste en mode planification/anticipation au coucher, inhibant les structures d'endormissement. Mécanisme central de l'insomnie chronique." },
  { term: 'TCC-I', definition: "Thérapie comportementale et cognitive pour l'insomnie. Traitement recommandé en première ligne, supérieur aux somnifères à long terme. Agit sur les habitudes et la cognition autour du sommeil en 4-6 séances." },
  { term: 'Cohérence cardiaque', definition: "Respiration à 6 cycles/min (5s inspiration / 5s expiration) qui active le nerf vague et le système parasympathique : baisse du cortisol et de la fréquence cardiaque en quelques minutes." },
  { term: 'Apnées du sommeil', definition: "Pauses involontaires dans la respiration nocturne générant des micro-éveils répétés et fragmentant le NREM N3. Touchent 1 adulte sur 10, diagnostiquées dans 20 % des cas. Traitables efficacement par PPC." },
  { term: 'SJSR (jambes sans repos)', definition: "Syndrome des jambes sans repos : envies irrépressibles de bouger les jambes au repos le soir. Souvent lié à un déficit en fer cérébral perturbant le système dopaminergique. Traitable." },
  { term: 'Cortisol', definition: "Hormone du stress. Naturellement haute le matin (signal d'éveil, déclenchée par la lumière) et basse le soir. Un manque de sommeil maintient le cortisol élevé en permanence, générant une inflammation chronique de bas grade." },
  { term: 'Pression de sommeil', definition: "Besoin croissant de dormir porté par l'adénosine accumulée pendant l'éveil. Réinitialisée après une nuit complète. La caféine la masque temporairement sans la résoudre." },
  { term: 'Jet lag social', definition: "Décalage de l'horloge interne causé par des horaires de lever différents entre semaine et week-end : désynchronisation circadienne chronique aux effets similaires au voyage en décalage horaire." },
  { term: 'Mélatonine (complément)', definition: "Bonne évidence pour les troubles circadiens (jet-lag, chronotypes extrêmes, travail posté). Efficacité limitée pour l'insomnie primaire. À utiliser avec un timing précis selon le décalage, pas comme somnifère généraliste." },
  { term: 'L-théanine', definition: "Acide aminé du thé vert avec effets anxiolytiques modestes documentés. Peut améliorer la qualité du sommeil en contexte de stress ou d'hyperéveil. Profil de sécurité favorable." },
  { term: 'Magnésium', definition: "Associations observationnelles entre déficit en magnésium et mauvaise qualité du sommeil. Résultats cliniques modestes, surtout chez les sujets carencés ou âgés." },
  { term: 'Glycine', definition: "Acide aminé aux effets hypothermisants via vasodilatation périphérique et action sur le NSC (NMDA). Peut réduire la latence d'endormissement chez certains profils." },
  { term: 'Chrononutrition', definition: "Adaptation des apports alimentaires aux rythmes biologiques. Pour le sommeil : dîner léger 2-4h avant le coucher, jeûne nocturne ≥12h, aliments riches en tryptophane le soir (œufs, légumineuses, noix)." },
]

export interface StrengthItem { sectionId: string; title: string; pct: number; praise: string; science: string; scienceNote: string; reference: string }
export interface WeaknessItem { sectionId: string; title: string; pct: number; level: string; concern: string; science: string; reference: string; triggeredInsights: { questionId: string; insight: string; recommendation: string; action?: string }[] }
export interface ActionPhase { phase: number; phaseTitle: string; timeframe: string; actions: { action: string; why: string; sectionId: string }[] }

export function generateFullReport(
  sectionResults: { sectionId: string; pct: number; score: number; maxScore: number; title: string }[],
  scores: Record<string, number>,
) {
  const strengths: StrengthItem[] = []
  const weaknesses: WeaknessItem[] = []

  const sectionReports = sectionResults.map(r => {
    const report = getSectionReport(r.sectionId)
    if (!report) return null
    const rec = getSectionRecommendation(report, r.pct)
    const triggered = getTriggeredInsights(report, scores)
    return {
      sectionId: r.sectionId,
      title: r.title,
      pct: r.pct,
      score: r.score,
      maxScore: r.maxScore,
      level: rec.level,
      recommendationTitle: rec.title,
      recommendationText: rec.text,
      context: report.context,
      triggeredInsights: triggered.map(t => ({ questionId: t.questionId, insight: t.insight, recommendation: t.recommendation })),
      references: report.references,
      badge: rec.level === 'excellent' ? '🟢' : rec.level === 'bon' ? '🟡' : rec.level === 'vigilance' ? '🟠' : '🔴',
      cardColor: rec.level === 'excellent' ? '#D1FAD7' : rec.level === 'bon' ? '#FFF9C4' : rec.level === 'vigilance' ? '#FFE0B2' : '#FFCDD2',
    }
  }).filter(Boolean)

  for (const r of sectionResults) {
    const report = getSectionReport(r.sectionId)
    if (!report) continue
    const rec = getSectionRecommendation(report, r.pct)
    const triggered = getTriggeredInsights(report, scores)
    const ref0 = report.references[0] ? `${report.references[0].authors.split(',')[0]} et al., ${report.references[0].year}` : ''
    if (rec.level === 'excellent' || rec.level === 'bon') {
      strengths.push({
        sectionId: r.sectionId,
        title: report.strengthLabel || rec.title,
        pct: r.pct,
        praise: rec.text,
        science: report.context.split('.').slice(0, 2).join('.') + '.',
        scienceNote: report.scienceNote || report.context.split('.')[0] + '.',
        reference: ref0,
      })
    } else {
      weaknesses.push({
        sectionId: r.sectionId,
        title: report.weaknessLabel || r.title,
        pct: r.pct,
        level: rec.level,
        concern: rec.text,
        science: report.context,
        reference: ref0,
        triggeredInsights: triggered
          .filter((t, i, arr) => arr.findIndex(x => x.recommendation.slice(0, 60) === t.recommendation.slice(0, 60)) === i)
          .map(t => ({ questionId: t.questionId, insight: t.insight, recommendation: t.recommendation, action: t.action })),
      })
    }
  }

  if (strengths.length === 0 && sectionResults.length > 0) {
    const best = [...sectionResults].sort((a, b) => b.pct - a.pct)[0]
    const report = getSectionReport(best.sectionId)
    if (report) {
      const ref0 = report.references[0] ? `${report.references[0].authors.split(',')[0]} et al., ${report.references[0].year}` : ''
      strengths.push({
        sectionId: best.sectionId,
        title: report.strengthLabel || best.title,
        pct: best.pct,
        praise: `C'est votre point le plus solide. Même si des améliorations sont possibles, c'est ici que vous avez le plus d'acquis.`,
        science: report.context.split('.').slice(0, 2).join('.') + '.',
        scienceNote: report.scienceNote || report.context.split('.')[0] + '.',
        reference: ref0,
      })
    }
  }

  const levelOrder: Record<string, number> = { alerte: 0, vigilance: 1, bon: 2, excellent: 3 }
  weaknesses.sort((a, b) => {
    const lo = levelOrder[a.level] - levelOrder[b.level]
    if (lo !== 0) return lo
    return a.pct - b.pct
  })

  const allActions: { action: string; why: string; sectionId: string }[] = []
  for (const w of weaknesses) {
    const fullReport = getSectionReport(w.sectionId)
    const fullTriggered = fullReport ? getTriggeredInsights(fullReport, scores) : []
    for (const ti of fullTriggered) {
      const action = ti.action || ti.recommendation.split('.')[0] + '.'
      const why = ti.actionWhy || ti.recommendation
      allActions.push({ action, why, sectionId: w.sectionId })
    }
    if (fullTriggered.length === 0) {
      const fallbackAction = w.concern.split('.').slice(0, 2).join('.') + '.'
      const fallbackWhy = fullReport?.context.split('.')[0] + '.' || w.concern.split('.')[0] + '.'
      allActions.push({ action: fallbackAction, why: fallbackWhy, sectionId: w.sectionId })
    }
  }

  const seenActions = new Set<string>()
  const uniqueActions = allActions.filter(a => {
    const key = a.action.toLowerCase().slice(0, 60)
    if (seenActions.has(key)) return false
    seenActions.add(key)
    return true
  })

  const actionPlan: ActionPhase[] = []
  if (uniqueActions.length > 0) {
    actionPlan.push({ phase: 1, phaseTitle: 'Vos priorités', timeframe: 'Semaines 1-4', actions: uniqueActions.slice(0, 4) })
  } else {
    const toConsolidate = strengths.sort((a, b) => a.pct - b.pct).slice(0, 3)
    if (toConsolidate.length > 0) {
      actionPlan.push({
        phase: 1,
        phaseTitle: 'Points à consolider',
        timeframe: 'En continu',
        actions: toConsolidate.map(s => ({
          action: `Consolidez : ${s.title}`,
          why: s.scienceNote || s.science,
          sectionId: s.sectionId,
        })),
      })
    } else {
      actionPlan.push({
        phase: 1,
        phaseTitle: 'Maintien des acquis',
        timeframe: 'En continu',
        actions: [
          { action: 'Maintenez une heure de coucher et de lever à ±30 min, 7j/7.', why: 'La régularité synchronise le rythme circadien et stabilise la production de mélatonine : premier facteur de qualité du sommeil.', sectionId: '' },
          { action: 'Caféine coupée avant 13-14h, pas d\'écran dans l\'heure avant le coucher.', why: 'Caféine : bloque l\'adénosine jusqu\'à 10h selon le profil génétique. Lumière bleue : retarde la mélatonine de 1 à 1,5h.', sectionId: '' },
        ],
      })
    }
  }

  return {
    strengths,
    weaknesses,
    actionPlan,
    globalInsights: globalKeyInsights,
    sectionReports,
    glossary: sommeilGlossary.map(g => ({ term: g.term, definition: g.definition })),
  }
}

export function generateTopActions(
  sectionResults: { sectionId: string; pct: number; score: number; maxScore: number }[],
  scores: Record<string, number>
): { priority: number; action: string; sectionTitle: string; level: string }[] {
  const actions: { priority: number; action: string; sectionTitle: string; level: string; pct: number }[] = []

  for (const result of sectionResults) {
    const report = getSectionReport(result.sectionId)
    if (!report) continue
    const rec = getSectionRecommendation(report, result.pct)
    if (rec.level === 'alerte' || rec.level === 'vigilance') {
      const insights = getTriggeredInsights(report, scores)
      const action = insights.length > 0
        ? (insights[0].action || insights[0].recommendation.split('.')[0] + '.')
        : rec.text.split('.')[0] + '.'
      actions.push({
        priority: result.pct,
        action,
        sectionTitle: result.sectionId,
        level: rec.level,
        pct: result.pct,
      })
    }
  }

  actions.sort((a, b) => a.pct - b.pct)
  return actions.slice(0, 5).map((a, i) => ({
    priority: i + 1,
    action: a.action,
    sectionTitle: a.sectionTitle,
    level: a.level,
  }))
}
