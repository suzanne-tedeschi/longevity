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

export interface QuestionInsight {
  questionId: string
  triggerMaxScore?: number
  triggerMinScore?: number
  title: string
  insight: string
  recommendation: string
  action?: string
  actionWhy?: string
}

export interface GroupedInsight {
  questionIds: string[]   // toutes ces questions doivent être déclenchées
  title: string
  insight: string
  recommendation: string
  action?: string
  actionWhy?: string
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
  groupedInsights?: GroupedInsight[]
  questionInsights: QuestionInsight[]
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
      title: "Réduire le temps d'endormissement",
      insight:
        "S'endormir en plus de 30 minutes, c'est le signe que deux signaux biologiques ne coïncident pas. Le premier : l'adénosine, la molécule qui s'accumule dans le cerveau pendant l'éveil et crée la pression de sommeil. Le second : la mélatonine, libérée par la glande pinéale selon l'heure programmée par l'horloge interne du cerveau (le noyau suprachiasmatique, ou NSC). Si vous vous couchez trop tôt, trop tard, ou à des horaires variables, l'un des deux signaux n'est pas au rendez-vous — et le sommeil ne peut pas démarrer. Si cela arrive 3 nuits par semaine depuis plus de 3 mois avec une fatigue en journée, c'est une insomnie chronique : la TCC-I (thérapie comportementale) est le traitement le plus efficace.",
      recommendation:
        "Ne vous couchez que sur des signaux réels de sommeil (paupières lourdes, bâillements). Levez-vous à heure fixe chaque matin, week-end inclus : c'est le levier le plus puissant pour calibrer l'accumulation d'adénosine et resynchroniser l'horloge interne.",
      action: 'Ne vous couchez que sur des signaux réels de sommeil, et levez-vous à heure fixe chaque matin.',
      actionWhy:
        "Un lever fixe chaque matin donne à l'horloge interne un repère lumineux stable. Elle peut alors programmer la montée de mélatonine à la même heure chaque soir. Et comme l'adénosine repart de zéro à la même heure, les deux signaux finissent par se rejoindre naturellement au moment du coucher — l'endormissement devient rapide et prévisible.",
    },
    {
      questionId: 'som-2',
      triggerMaxScore: 1,
      title: "Réduire les réveils nocturnes",
      insight:
        "Pour rester en sommeil profond, le corps doit baisser sa température interne de 0,5 à 1°C — il y parvient en envoyant la chaleur vers les mains et les pieds. Une chambre trop chaude bloque ce mécanisme et génère des micro-éveils. Mais d'autres causes existent : un cortisol (l'hormone du stress) encore élevé la nuit, des bruits ou lumières traités par le cerveau même pendant le sommeil, ou des micro-obstructions respiratoires. Ce qui compte : les réveils en première moitié de nuit amputent le sommeil profond (récupération physique, nettoyage cérébral) ; ceux en fin de nuit amputent le sommeil paradoxal (régulation émotionnelle) — les deux phases ne se rattrapent pas.",
      recommendation:
        "Chambre fraîche (16-19°C), obscurité totale incluant les LED des chargeurs. Si vous ne vous rendormez pas en 20 min, levez-vous, activité calme à lumière tamisée, cohérence cardiaque (5s inspiration / 5s expiration, 5 min) pour réactiver le système parasympathique.",
      action: 'Vérifiez la température (16-19°C) et l\'obscurité totale de votre chambre.',
      actionWhy:
        "Une chambre à 16-19°C permet au corps d'évacuer la chaleur par les mains et les pieds, sans activer les alarmes thermiques du cerveau. La cohérence cardiaque (5s inspiration / 5s expiration) active le nerf vague et fait baisser le cortisol en quelques minutes. L'obscurité totale — LED de chargeurs incluses — empêche toute stimulation des cellules de la rétine sensibles à la lumière, protégeant la montée de mélatonine et le sommeil paradoxal de fin de nuit.",
    },
    {
      questionId: 'som-4',
      triggerMaxScore: 1,
      title: "Faire évaluer vos difficultés respiratoires nocturnes",
      insight:
        "Pendant le sommeil, les muscles de la gorge se relâchent naturellement. Dans les apnées obstructives, ce relâchement provoque une obstruction partielle ou totale des voies respiratoires. Le cerveau détecte la baisse d'oxygène et déclenche un micro-éveil d'urgence — souvent imperceptible, mais suffisant pour fragmenter le sommeil profond. Cette séquence peut se répéter 5 à 100 fois par heure. Résultat : une fatigue chronique malgré une durée de sommeil apparemment normale. Ce trouble touche 1 adulte sur 10, et est diagnostiqué dans seulement 20 % des cas.",
      recommendation:
        "Consultez votre médecin pour une polygraphie ventilatoire (enregistrement respiratoire à domicile). En attendant : position latérale stricte (réduit les obstructions mécaniques) et zéro alcool le soir (il relaxe les muscles pharyngés et aggrave les apnées).",
      action: 'Consultez votre médecin pour une polygraphie ventilatoire.',
      actionWhy:
        "La PPC (appareil à pression positive continue) maintient les voies respiratoires mécaniquement ouvertes toute la nuit. Résultat : plus de désaturation, plus de micro-éveils d'urgence, plus d'interruption des cycles. Le sommeil profond et le sommeil paradoxal peuvent se reconstituer dès la première nuit — certains patients rapportent doubler leur énergie en quelques semaines.",
    },
    {
      questionId: 'som-5',
      triggerMaxScore: 1,
      title: "Réduire le ronflement",
      insight:
        "Le ronflement, c'est l'air qui fait vibrer les tissus mous de la gorge (voile du palais, luette, base de la langue) en passant à travers un espace trop étroit. Ces vibrations provoquent des micro-éveils discrets, et l'effort respiratoire accru fragmente le sommeil profond. L'alcool aggrave les choses en relâchant encore davantage les muscles de la gorge. Un ronflement fort et quotidien est un signe à évaluer : il peut cacher des apnées sous-jacentes.",
      recommendation:
        "Dormez sur le côté, évitez l'alcool le soir. Des exercices myofonctionnels (renforcement des muscles du palais et de la gorge, 10 min/j pendant 3 mois) réduisent le ronflement de façon documentée. Consultez si fort ou quotidien.",
      action: 'Dormez sur le côté et consultez votre médecin si le ronflement est fort ou quotidien.',
      actionWhy:
        "Sur le côté, la gravité empêche la langue et les tissus mous de basculer vers l'arrière — c'est la cause mécanique principale du ronflement en position dorsale. Des exercices réguliers de renforcement des muscles de la gorge (10 min/j pendant 3 mois) augmentent leur tonus, ce qui réduit l'affaissement nocturne même quand les muscles sont relâchés pendant le sommeil.",
    },
    {
      questionId: 'som-8',
      triggerMaxScore: 1,
      title: "Traiter les cauchemars récurrents",
      insight:
        "Pendant le sommeil paradoxal (REM), la noradrénaline — le neurotransmetteur du stress et de l'éveil — est quasiment absente. C'est dans cet environnement calme que le cerveau rejoue les souvenirs émotionnellement chargés pour en émousser la charge : une sorte de thérapie nocturne gratuite. Les cauchemars récurrents signalent que ce mécanisme est perturbé — soit parce que le stress maintient la noradrénaline active, soit parce qu'une privation de sommeil paradoxal crée un \"rebond REM\" avec des rêves intenses. Dans les deux cas, le traitement émotionnel nocturne ne se fait plus correctement.",
      recommendation:
        "Répétition par imagerie (IRT) : 10 min chaque soir avant le coucher, réécrivez le scénario du cauchemar avec une fin apaisante, répétez-le mentalement 3-4 jours de suite. Résultats visibles en 2 à 4 semaines.",
      action: 'Pratiquez la répétition par imagerie : réécrivez chaque soir votre cauchemar avec une fin apaisante.',
      actionWhy:
        "En réécrivant consciemment le scénario du cauchemar avec une fin différente, vous activez les mêmes circuits cérébraux que le sommeil paradoxal — mais dans un état calme, sans stress. Après 3 à 4 répétitions, la nouvelle version du souvenir concurrence l'ancienne. Quand le sommeil paradoxal rejoue la scène, c'est le scénario réécrit — émotionnellement neutre — qui remonte en surface.",
    },
    {
      questionId: 'som-9',
      triggerMaxScore: 1,
      title: "Soulager les douleurs nocturnes",
      insight:
        "Le sommeil profond (N3) est la principale fenêtre de libération d'hormone de croissance, qui répare les tissus et réduit l'inflammation. Quand la douleur fragmente cette phase, moins d'hormone est produite — ce qui ralentit la récupération des zones douloureuses. En parallèle, le manque de sommeil profond amplifie la sensibilité à la douleur : le même signal est perçu plus intensément le lendemain. Un cercle vicieux s'installe : la douleur fragmente le sommeil, le sommeil fragmenté amplifie la douleur.",
      recommendation:
        "Étirements doux ciblés 10 min avant le coucher. Chaleur locale en soirée (bouillotte ou bain chaud) : relâche les muscles tendus et prépare la descente thermique. Évaluez votre literie : un matelas >8 ans aggrave les douleurs articulaires et perturbe le sommeil profond.",
      action: 'Faites 10 min d\'étirements doux avant le coucher et évaluez votre literie.',
      actionWhy:
        "La chaleur locale (bouillotte, bain chaud) améliore la circulation dans les tissus concernés et aide à éliminer les molécules inflammatoires qui entretiennent la douleur. Un bain chaud 1h30 avant le coucher provoque aussi une vasodilatation qui accélère la descente de température corporelle — le signal biologique du coucher. Les étirements doux relâchent la tension musculaire en activant des réflexes inhibiteurs naturels de la moelle épinière, réduisant les signaux douloureux avant l'endormissement.",
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
      title: "Réduire l'anxiété de performance au coucher",
      insight:
        "Quand le sommeil est perçu comme mauvais, le cerveau entre en mode hypervigilance au coucher. La zone qui déclenche le sommeil — le VLPO, un petit noyau hypothalamique — fonctionne comme un interrupteur : soit il prend le dessus (sommeil), soit les systèmes d'éveil le dominent (éveil). Il n'y a pas d'état intermédiaire. L'anxiété de performance — la peur de mal dormir — active la noradrénaline et maintient les systèmes d'éveil allumés, bloquant le VLPO précisément au moment où vous essayez de dormir.",
      recommendation:
        "La TCC-I (thérapie comportementale et cognitive pour l'insomnie) est le traitement recommandé en première ligne : 4-6 séances, résultats supérieurs aux somnifères à long terme. Elle agit sur l'hyperactivation cognitive et reconditionne l'association lit-sommeil. Demandez une orientation à votre médecin.",
      action: 'Demandez à votre médecin une orientation vers la TCC-I.',
      actionWhy:
        "La TCC-I agit sur trois fronts : elle concentre la pression de sommeil (via la restriction de sommeil) pour que le VLPO prenne naturellement le dessus ; elle déconditionne l'association lit-éveil ; et elle modifie les croyances anxiogènes sur le sommeil qui maintiennent le cerveau en alerte. Résultat : l'interrupteur bascule à nouveau vers le sommeil sans effort.",
    },
    {
      questionId: 'qual-2',
      triggerMaxScore: 1,
      title: "Réévaluer l'usage des somnifères",
      insight:
        "Les benzodiazépines et le zolpidem (Stilnox) induisent la sédation en activant des récepteurs inhibiteurs du cerveau (GABA-A) — mais ce n'est pas du vrai sommeil. L'activité cérébrale mesurée à l'EEG est différente : moins d'ondes lentes profondes, moins de sommeil paradoxal. La mémoire ne se consolide pas de la même façon. Le zolpidem peut aussi provoquer des comportements automatiques nocturnes (somnambulisme, alimentation, conduite) dans environ 3 % des cas. Quant au CBD, il agit sur les systèmes d'éveil du cerveau d'une façon qui peut désynchroniser le sommeil paradoxal — les preuves cliniques sur le sommeil restent insuffisantes.",
      recommendation:
        "Évoquez votre consommation avec votre médecin et explorez la TCC-I : ses bénéfices sont durables car elle agit sur les causes de l'insomnie, pas ses symptômes.",
      action: 'Mentionnez votre consommation de somnifères à votre médecin et demandez une orientation vers la TCC-I.',
      actionWhy:
        "La TCC-I restaure la capacité naturelle du cerveau à déclencher le sommeil, sans modifier les récepteurs ni créer de dépendance. Ses bénéfices augmentent avec le temps — à l'inverse des somnifères qui perdent de leur efficacité. Les sociétés savantes de médecine du sommeil la recommandent en première ligne précisément parce qu'elle s'attaque aux causes, pas aux symptômes.",
    },
    {
      questionId: 'qual-3',
      triggerMaxScore: 1,
      title: "Réduire la somnolence en journée",
      insight:
        "La somnolence diurne est la signature d'une adénosine résiduelle. L'adénosine, c'est la molécule qui crée la pression de sommeil : elle s'accumule dans le cerveau tout au long de l'éveil et une nuit complète l'élimine entièrement. Si le sommeil est trop court ou trop fragmenté, il en reste le matin — et c'est ce qui vous donne envie de dormir dans la journée. Des microsommeils involontaires (3 à 10 secondes) peuvent même survenir : le cerveau bascule brièvement vers le sommeil sans que vous le décidiez.",
      recommendation:
        "Lumière naturelle dès le réveil (10-15 min dehors) pour activer l'axe cortisol-éveil et synchroniser l'horloge interne. Siestes 10-20 min entre 13h et 15h maximum, pas plus longues, pas après 15h.",
      action: 'Exposez-vous à la lumière naturelle dès le réveil (10-15 min) et limitez les siestes à 20 min avant 15h.',
      actionWhy:
        "La lumière naturelle matinale active des cellules spécialisées de la rétine qui envoient un signal direct à l'horloge interne du cerveau (le NSC). Celle-ci déclenche alors le pic de cortisol matinal — le signal d'éveil naturel qui contre-balance l'adénosine résiduelle. Une sieste de 10 à 20 min en début d'après-midi élimine une partie de l'adénosine accumulée, sans entrer en sommeil profond — ce qui évite de rogner sur la pression de sommeil du soir.",
    },
    {
      questionId: 'qual-4',
      triggerMaxScore: 1,
      title: "Retrouver motivation et énergie",
      insight:
        "Le sommeil paradoxal (REM) réinitialise les circuits de la motivation et de la récompense dans le cerveau via la dopamine. Sans assez de REM, ces circuits deviennent progressivement moins sensibles : la même quantité de dopamine produit moins d'effet. Le manque d'envie, le manque d'élan, la difficulté à se lever le matin — c'est souvent neurologique, pas psychologique. Et le REM est la première phase sacrifiée quand on dort peu : passer de 8h à 6h de sommeil fait perdre 60 à 90 minutes de sommeil paradoxal.",
      recommendation:
        "7-9 heures de sommeil dans l'agenda, non négociables. Une activité physique modérée en fin d'après-midi améliore simultanément la qualité du sommeil nocturne et l'énergie du lendemain.",
      action: 'Protégez une fenêtre fixe de 7-9 heures de sommeil dans votre agenda.',
      actionWhy:
        "Protéger 7 à 9h de sommeil garantit les 2 dernières heures riches en sommeil paradoxal — celles que vous perdez en premier quand vous raccourcissez vos nuits. L'activité physique modérée en fin d'après-midi améliore la qualité du sommeil nocturne et stimule les circuits dopaminergiques : double bénéfice sur la motivation du lendemain.",
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
  groupedInsights: [
    {
      questionIds: ['hyg-1', 'hyg-5'],
      title: "Régulariser vos horaires de lever et de coucher",
      insight: "Votre horloge interne (le noyau suprachiasmatique, NSC) tourne sur un cycle de 24h et se remet à l'heure grâce à la lumière matinale. Pour fonctionner correctement, elle a besoin de deux repères stables : l'heure du lever — le signal lumineux qui repart le compteur de la journée — et l'heure du coucher, qui lui permet de programmer la montée de mélatonine au bon moment. Quand ces deux repères varient, l'horloge est perpétuellement décalée : c'est un jet lag interne de 1 à 3h, répété chaque semaine. Et l'heure de lever est le levier le plus puissant — une grasse matinée du week-end suffit à désynchroniser toute la semaine suivante.",
      recommendation: "Lever ET coucher fixes à ±30 min, 7j/7, week-end inclus. Commencez par ancrer l'heure de lever — c'est le signal le plus fort sur l'horloge interne. Si vous êtes fatigué le week-end, préférez une sieste de 20 min à une grasse matinée.",
      action: "Fixez une heure de lever ET de coucher à ±30 min, 7j/7, week-end inclus. Commencez par l'heure de lever.",
      actionWhy: "Un lever fixe 7j/7 donne à l'horloge interne un repère lumineux stable chaque matin. Elle peut alors programmer la mélatonine à la même heure chaque soir — l'endormissement devient naturel en 1 à 2 semaines. En fixant aussi l'heure du coucher, vous renforcez les deux signaux : la pression de sommeil (adénosine) et la mélatonine convergent au bon moment.",
    },
  ],
  questionInsights: [
    {
      questionId: 'hyg-1',
      triggerMaxScore: 1,
      title: "Stabiliser l'heure de coucher",
      insight:
        "L'horloge interne du cerveau — le noyau suprachiasmatique (NSC), environ 20 000 neurones dans l'hypothalamus — tourne sur un cycle d'environ 24h. La lumière matinale la remet à l'heure chaque jour. Quand l'heure du coucher varie, l'horloge reçoit ses repères lumineux à des heures différentes : elle ne peut plus programmer précisément la montée de mélatonine le soir ni le pic de cortisol au matin. C'est un vrai jet lag interne — 1 à 3 heures de décalage, répété chaque semaine.",
      recommendation:
        "Heure de coucher fixe à ±30 min, 7j/7, week-ends inclus. Mettez une alarme 'heure du coucher'. L'adaptation est visible en 1-2 semaines : la mélatonine commence à se libérer à heure prévisible, l'endormissement devient naturel.",
      action: 'Fixez une heure de coucher à ±30 min, 7j/7 week-ends inclus.',
      actionWhy:
        "Un coucher fixe donne à l'horloge interne un repère stable. Après 1 à 2 semaines de régularité, la mélatonine commence à monter spontanément 30 à 45 minutes avant votre heure de coucher habituelle — et l'endormissement devient naturel, sans effort.",
    },
    {
      questionId: 'hyg-5',
      triggerMaxScore: 1,
      title: "Stabiliser l'heure de lever",
      insight:
        "L'heure de lever est le levier le plus puissant sur l'horloge interne — plus fort que l'heure de coucher. C'est la lumière matinale qui remet le NSC à l'heure, stoppe la mélatonine et déclenche le pic de cortisol : le départ du compteur de 16h jusqu'à la prochaine nuit biologique. La grasse matinée du week-end retarde ce signal de 1 à 3 heures — l'horloge reprogramme tout en décalé. C'est le \"jet lag social\" : comme faire un Paris-Moscou aller-retour chaque week-end.",
      recommendation:
        "Même heure de réveil tous les jours, ±30 min, week-end inclus. Fatigue le week-end : préférez une sieste de 20 min à une grasse matinée.",
      action: 'Levez-vous à la même heure chaque matin (±30 min), week-end inclus.',
      actionWhy:
        "Un lever fixe 7j/7 maintient l'horloge interne synchronisée. L'heure d'endormissement s'ajuste naturellement car la mélatonine monte à la même heure chaque soir et la pression de sommeil (adénosine) atteint son seuil à heure prévisible. Si vous êtes fatigué le week-end, une sieste de 20 min élimine l'adénosine sans décaler le signal lumineux du matin.",
    },
    {
      questionId: 'hyg-2',
      triggerMaxScore: 1,
      title: "Ne plus associer le lit à l'éveil",
      insight:
        "Chaque heure passée au lit éveillé — à ruminer, regarder les écrans, s'inquiéter — entraîne le cerveau à associer le lit à l'éveil et au stress. C'est un conditionnement classique : comme le chien de Pavlov qui salive à la cloche, votre corps finit par libérer du cortisol (hormone du stress) de façon réflexe dès que vous entrez dans la chambre. Le lit est devenu un déclencheur d'éveil.",
      recommendation:
        "Contrôle du stimulus (pilier de la TCC-I) : si pas endormi en 20 min, quittez la chambre, activité calme à lumière tamisée, revenez uniquement quand le sommeil revient. Répété sur quelques nuits, ça recrée l'association lit-sommeil.",
      action: 'Si pas endormi en 20 min, quittez la chambre et revenez uniquement quand le sommeil revient.',
      actionWhy:
        "En quittant le lit dès que le sommeil n'arrive pas, vous brisez le cycle de renforcement : le cerveau cesse d'associer le lit à la frustration. Après 5 à 10 nuits, une nouvelle association se forme — lit = somnolence et détente — parce que les seuls moments où vous êtes au lit, vous dormez. Le réflexe de stress disparaît progressivement.",
    },
    {
      questionId: 'hyg-3',
      triggerMaxScore: 1,
      title: "Ne plus regarder l'heure la nuit",
      insight:
        "Regarder l'heure la nuit déclenche un calcul automatique : \"il me reste X heures\". Ce calcul active la zone de planification du cerveau (le cortex préfrontal), qui libère de la noradrénaline — le neurotransmetteur de l'éveil et du stress. Cela bloque la zone du cerveau qui déclenche le sommeil (le VLPO). En plus, la lumière de l'écran du téléphone, même fugace, inhibe partiellement la mélatonine. Double blocage : cognitif et lumineux.",
      recommendation:
        "Retirez ou couvrez l'horloge de la chambre, et ne regardez pas l'heure sur le téléphone : chaque coup d'oeil déclenche un calcul automatique ('il me reste X heures') qui amplifie l'anxiété de performance et maintient le cortex préfrontal actif.",
      action: 'Retirez ou couvrez l\'horloge de la chambre et ne regardez pas l\'heure sur le téléphone la nuit.',
      actionWhy:
        "Supprimer l'horloge de la chambre, c'est supprimer le déclencheur du calcul anxieux. Sans ce stimulus, le cerveau n'a pas d'invitation à \"planifier\" — la noradrénaline reste basse, la zone d'endormissement peut prendre le dessus naturellement. Un geste simple, un effet direct.",
    },
    {
      questionId: 'hyg-4',
      triggerMaxScore: 1,
      title: "Stopper la caféine après 13h-14h",
      insight:
        "La caféine ne détruit pas l'adénosine — elle bloque ses récepteurs. Pendant ce temps, l'adénosine continue de s'accumuler en coulisse. Dès que la caféine est éliminée par le foie, elle déferle d'un coup : c'est le \"crash caféine\". Sa demi-vie est de 5 à 7h en moyenne, jusqu'à 10h selon votre génétique (enzyme CYP1A2) : un café à 16h maintient encore 50 % de son effet à 22h. Il bloque la pression de sommeil et réduit le sommeil profond — même si vous vous endormez sans difficulté, le sommeil profond est moins profond.",
      recommendation:
        "Dernière caféine avant 13-14h. Sources cachées : thé noir (50-80 mg), chocolat noir, certains sodas. En soirée : tisanes (camomille, passiflore).",
      action: 'Stoppez toute caféine après 13-14h (café, thé noir, chocolat noir, sodas).',
      actionWhy:
        "Couper la caféine à 13h-14h laisse 8 à 10h de métabolisation avant le coucher. L'adénosine accumulée peut enfin agir librement sur ses récepteurs en soirée : la pression de sommeil est intacte, le sommeil profond de pleine profondeur, et la récupération physique complète.",
    },
    {
      questionId: 'hyg-6',
      triggerMaxScore: 1,
      title: "Limiter les siestes à 20 min avant 15h",
      insight:
        "Une sieste de moins de 20 minutes reste en sommeil léger — et c'est parfait. Au-delà, le cerveau entre en sommeil profond (N3) : au réveil, il faut 10 à 30 minutes pour retrouver des performances normales. Encore plus problématique : chaque minute de sieste élimine de l'adénosine — la molécule de pression de sommeil. Une sieste d'1h peut réduire suffisamment cette pression pour retarder l'endormissement de 1 à 2h le soir et fragmenter le sommeil profond nocturne.",
      recommendation:
        "Siestes 10-20 min maximum, entre 13h et 15h. Astuce du café-sieste : buvez un café juste avant de vous allonger ; la caféine met 20 min à agir, elle entre en action au réveil et augmente l'énergie sans perturber la nuit.",
      action: 'Limitez vos siestes à 20 min maximum, avant 15h.',
      actionWhy:
        "Une sieste de 10 à 20 min élimine une partie de l'adénosine (soulagement de la somnolence) sans entrer en sommeil profond — donc pas d'inertie au réveil. L'astuce du café-sieste fonctionne parce que la caféine met 20 à 30 min à atteindre le cerveau : elle entre en action précisément au moment du réveil, amplifiant la récupération sans créer de somnolence post-sieste.",
    },
    {
      questionId: 'hyg-7',
      triggerMaxScore: 1,
      title: "Éliminer les écrans avant le coucher",
      insight:
        "Des cellules spécialisées de votre rétine détectent la lumière bleue des écrans et envoient un signal direct à l'horloge interne du cerveau (le noyau suprachiasmatique, NSC). Cette horloge bloque alors la glande pinéale — la fabrique de mélatonine. Résultat : votre cerveau pense qu'il fait encore jour. 2h d'écran le soir retardent la montée de mélatonine de 90 minutes et réduisent le sommeil paradoxal de fin de nuit de 20 % — la phase clé pour la régulation émotionnelle.",
      recommendation:
        "Couvre-feu digital à 21h : lumières tamisées, pas d'écran, téléphone hors de la chambre. Minimum 60 min d'écran-free avant le coucher.",
      action: 'Instaurez un couvre-feu digital à 21h : lumières tamisées, pas d\'écran, téléphone hors de la chambre.',
      actionWhy:
        "Sans écran, l'horloge interne lève le blocage sur la glande pinéale et la mélatonine monte naturellement. Si vous ne pouvez pas éviter les écrans, des lunettes filtrant la lumière bleue réduisent l'effet de 60 %.",
    },
    {
      questionId: 'hyg-8',
      triggerMaxScore: 1,
      title: "Dîner plus tôt et plus léger",
      insight:
        "Manger tard perturbe le sommeil de deux façons. D'abord, la digestion génère de la chaleur : le corps doit baisser sa température interne pour s'endormir, mais la thermogénèse digestive (qui augmente le métabolisme de 10-15 %) retarde cette descente. Ensuite, un repas riche en glucides rapides provoque un pic de glycémie, puis une chute du sucre 2 à 3h plus tard — cette hypoglycémie réactionnelle déclenche une réponse d'alerte (cortisol, adrénaline) qui fragmente le sommeil en deuxième partie de nuit.",
      recommendation:
        "Dîner léger 2-4h avant le coucher, riche en tryptophane (œufs, légumineuses, noix). Jeûne nocturne ≥12h (Time Restricted Feeding). Petite faim tardive : une poignée de noix.",
      action: 'Dînez léger 2-4h avant le coucher et visez un jeûne nocturne de 12h minimum.',
      actionWhy:
        "Dîner 2 à 4h avant le coucher laisse la digestion se terminer et la glycémie se stabiliser avant le sommeil — les deux perturbateurs disparaissent. Les aliments riches en tryptophane (œufs, légumineuses, noix) fournissent le matériau de base pour fabriquer la sérotonine et la mélatonine. Le jeûne nocturne de 12h réduit l'inflammation de bas grade qui perturbe les phases profondes.",
    },
    {
      questionId: 'hyg-9',
      triggerMaxScore: 1,
      title: "Éviter le sport intensif après 19h",
      insight:
        "Un effort intense le soir active trois systèmes qui s'opposent au sommeil. D'abord, la chaleur musculaire élève la température centrale de 1 à 2°C — il faut 4 à 6h pour revenir à la normale. Ensuite, l'axe du stress libère du cortisol et de l'adrénaline, dont les effets durent 4 à 6h. Enfin, la noradrénaline cérébrale augmente et inhibe directement la zone d'endormissement (le VLPO). Un sport intense à 20h, c'est trois alarmes encore actives à 23h.",
      recommendation:
        "Effort intense avant 19h, idéalement 15h-17h. Le soir : étirements doux, yoga, marche légère, des activités qui activent le système parasympathique et préparent la descente thermique.",
      action: 'Pratiquez l\'effort intense avant 19h (idéalement 15h-17h) et optez pour des étirements doux le soir.',
      actionWhy:
        "S'entraîner entre 15h et 17h transforme la chaleur produite en levier pro-sommeil : la température monte jusqu'à 17-18h, puis amorce une descente naturelle qui coïncide avec le signal biologique d'endormissement. Le cortisol et l'adrénaline ont le temps de se métaboliser avant 23h. En prime, l'exercice à cette fenêtre augmente le sommeil profond d'environ 15 % via la libération d'hormone de croissance.",
    },
    {
      questionId: 'hyg-10',
      triggerMaxScore: 1,
      title: "Éviter l'alcool dans les 4h avant le coucher",
      insight:
        "L'alcool endort — mais ce n'est pas du vrai sommeil. Il sédation le cerveau en activant des récepteurs inhibiteurs (GABA), ce qui donne l'impression de s'endormir vite. Mais en deuxième partie de nuit, le foie transforme l'alcool en acétaldéhyde — un stimulant neuronal qui active les systèmes d'éveil et fragmente le sommeil. En parallèle, les circuits qui génèrent le sommeil paradoxal (REM) sont directement supprimés : deux verres de vin suffisent à réduire le REM de 24 %.",
      recommendation:
        "Zéro alcool dans les 4h avant le coucher. Si vous buvez en soirée : finissez tôt, alternez avec de l'eau.",
      action: 'Évitez tout alcool dans les 4 heures avant le coucher.',
      actionWhy:
        "Arrêter l'alcool 4h avant le coucher laisse le temps de métaboliser l'alcool et l'acétaldéhyde avant le début du sommeil paradoxal de la deuxième moitié de nuit. Si vous dormez à 23h, finir de boire à 19h garantit que les circuits du REM ne sont plus inhibés lors du premier cycle (~1h30 du matin).",
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
      title: "Calmer l'activité mentale au coucher",
      insight:
        "S'endormir nécessite que la zone d'endormissement du cerveau (le VLPO, dans l'hypothalamus) prenne le dessus sur les systèmes d'éveil. Mais cela ne peut pas se produire si la zone de planification (le cortex préfrontal) est active. Penser à ce qu'on doit faire demain, anticiper, organiser — tout ça maintient le cerveau en mode travail et bloque l'endormissement. Ce n'est pas de la mauvaise volonté : c'est biochimiquement incompatible.",
      recommendation:
        "Carnet vide-cerveau avant le lit (20 min) : notez toutes les pensées, tâches et préoccupations en suspens, avec une action concrète pour chacune. Complétez avec 10 min de relaxation musculaire progressive (contracter-relâcher chaque groupe musculaire, des pieds jusqu'au visage).",
      action: 'Tenez un carnet "vide-cerveau" chaque soir : pensées, tâches, une action concrète pour chacune.',
      actionWhy:
        "En mettant les préoccupations sur papier avec une action concrète pour chacune, vous déchargez la mémoire de travail du cortex préfrontal. Des études EEG montrent une réduction de l'activité cérébrale associée à la pensée active après 20 min d'écriture structurée — le cerveau peut alors glisser naturellement vers les états plus lents de l'endormissement.",
    },
    {
      questionId: 'prof-2',
      triggerMaxScore: 1,
      title: "Structurer les ruminations hors du lit",
      insight:
        "Les ruminations activent ce qu'on appelle le réseau par défaut du cerveau — le mode mental qu'il utilise quand il tourne sur lui-même, ressasse, anticipe. Ce réseau maintient une activité cérébrale de haut niveau, incompatible avec l'endormissement. Et plus vous essayez de chasser une pensée, plus elle revient : tenter de ne pas penser à quelque chose oblige le cerveau à surveiller si cette pensée est présente — ce qui l'active davantage. L'effort de suppression renforce la rumination.",
      recommendation:
        "15 min de 'temps des soucis structuré' en début de soirée (pas au lit) : notez chaque préoccupation et quand vous l'adresserez concrètement. Au lit : scan corporel de la tête aux pieds, en relâchant consciemment chaque zone musculaire.",
      action: 'Faites 15 min de "temps des soucis structuré" en début de soirée, pas au lit.',
      actionWhy:
        "Le \"temps des soucis structuré\" (15 à 20 min en début de soirée) donne au cerveau un moment dédié pour traiter les préoccupations. Au coucher, il n'a plus de raison de les ressasser — \"c'est déjà traité\". Au lit, le scan corporel remplace le mode rumination par un mode sensoriel : l'attention se porte sur des sensations physiques, ce qui calme naturellement l'activité cérébrale et prépare l'endormissement.",
    },
    {
      questionId: 'prof-3',
      triggerMaxScore: 1,
      title: "Désamorcer l'activation physique au lit",
      insight:
        "Les palpitations et la chaleur interne au coucher signalent que l'axe du stress est encore actif : le cortisol et l'adrénaline sont encore élevés. Normalement, le cortisol culmine le matin (signal d'éveil) et touche son minimum à minuit. Le stress chronique ou un exercice tardif perturbent cette courbe : fréquence cardiaque élevée, vaisseaux périphériques contractés (ce qui empêche la descente thermique), et zone d'endormissement bloquée.",
      recommendation:
        "Cohérence cardiaque : 5s inspiration / 5s expiration (6 cycles/min), 5 min. Active le nerf vague et bascule le système nerveux en mode parasympathique en quelques minutes. Alternative : bain ou douche chaude 1h30 avant le coucher ; la descente thermique post-bain facilite l'endormissement.",
      action: 'Pratiquez 5 min de cohérence cardiaque au coucher (5s inspiration / 5s expiration).',
      actionWhy:
        "La respiration à 6 cycles/min (cohérence cardiaque) stimule le nerf vague, le grand câble du système nerveux parasympathique. En quelques minutes, le cortisol commence à baisser, le rythme cardiaque ralentit, et les vaisseaux périphériques se dilatent — permettant à la descente thermique de s'initier et à la zone d'endormissement du cerveau de prendre le dessus.",
    },
    {
      questionId: 'prof-4',
      triggerMaxScore: 1,
      title: "Reconditionner la chambre au sommeil",
      insight:
        "Si vous dormez mieux hors de chez vous, c'est le signe d'un conditionnement : votre chambre est devenue un déclencheur de stress. Chaque fois que vous restez éveillé dans votre lit — à travailler, regarder un écran, vous inquiéter — le cerveau renforce l'association : lit = éveil + frustration + cortisol. Cette association peut devenir assez robuste pour déclencher une montée de cortisol réflexe dès l'entrée dans la chambre, indépendamment de votre niveau de fatigue. Hors de chez vous, le conditionnement ne s'active pas.",
      recommendation:
        "Chambre = cave à sommeil uniquement : obscurité totale (masque si nécessaire), 16-19°C, silence ou bruit blanc. Plus d'écran, plus de travail, pas de repas dans la chambre. Ce reconditionnement produit des effets en 2-3 semaines.",
      action: 'Transformez votre chambre : obscurité totale, 16-19°C, silence ou bruit blanc. Pas d\'écran, pas de travail.',
      actionWhy:
        "Faire de la chambre un espace exclusivement dédié au sommeil rompt le cycle de renforcement. Chaque nuit sans frustration dans la chambre affaiblit l'association lit-éveil. Après 2 à 3 semaines de discipline stricte, une nouvelle association se forme naturellement : chambre = détente et somnolence.",
    },
    {
      questionId: 'prof-5',
      triggerMaxScore: 1,
      title: "Explorer la cause d'un sommeil non réparateur",
      insight:
        "Se réveiller épuisé malgré 7 ou 8 heures de sommeil, c'est la signature d'un sommeil non réparateur. Deux causes principales : les apnées, qui génèrent des micro-éveils répétés (5 à 100 par heure) sans souvenir conscient — le sommeil profond (N3) ne se consolide jamais suffisamment pour libérer l'hormone de croissance et activer le nettoyage cérébral. Ou une chambre trop chaude, qui empêche la descente thermique et maintient le sommeil en stade superficiel toute la nuit. Dans les deux cas, le matin ressemble à une nuit blanche partielle.",
      recommendation:
        "Symptôme régulier → consultez votre médecin pour évaluer une polygraphie ventilatoire. En parallèle : chambre fraîche (16-19°C), obscurité totale.",
      action: 'Consultez votre médecin si vous vous réveillez régulièrement plus fatigué qu\'au coucher.',
      actionWhy:
        "Une polygraphie ventilatoire à domicile enregistre la saturation en oxygène et le flux respiratoire toute la nuit — elle quantifie précisément le nombre d'apnées par heure et identifie si c'est la cause. Si les apnées sont confirmées, un traitement par PPC (pression positive continue) restaure le sommeil profond dès la première nuit : la plupart des patients rapportent une amélioration majeure de la fatigue matinale en 1 à 2 semaines.",
    },
    {
      questionId: 'prof-6',
      triggerMaxScore: 1,
      title: "Faire évaluer les pauses respiratoires nocturnes",
      insight:
        "Des pauses respiratoires remarquées par l'entourage, associées à un ronflement fort, c'est la présentation classique des apnées obstructives sévères. Pendant chaque pause : le taux d'oxygène chute, le CO₂ s'accumule, et le cerveau déclenche un micro-éveil d'urgence avec une montée de noradrénaline et de cortisol. Ces micro-éveils répétés fragmentent le sommeil profond et le REM, créant une dette de récupération nocturne. À long terme : hypertension artérielle, risque cardiovasculaire augmenté, et atteintes cognitives.",
      recommendation:
        "Polygraphie ventilatoire (prescription médicale, réalisée à domicile) pour confirmer ou exclure le diagnostic. Si apnées confirmées : le traitement par PPC transforme la qualité du sommeil dès la première nuit.",
      action: 'Consultez votre médecin pour une polygraphie ventilatoire.',
      actionWhy:
        "La PPC maintient une pression d'air positive dans les voies respiratoires — comme une attelle invisible qui les garde ouvertes toute la nuit. Résultat : plus d'obstruction, plus de désaturation, plus de micro-éveils d'urgence. Le sommeil profond et le REM se normalisent dès la première nuit — les bénéfices cognitifs et cardiovasculaires suivent dans les semaines.",
    },
    {
      questionId: 'prof-7',
      triggerMaxScore: 1,
      title: "Signaler la bouche sèche et maux de tête à votre médecin",
      insight:
        "Bouche sèche au réveil, maux de tête matinaux, ronflement fort : cette triade oriente vers les apnées du sommeil. La bouche sèche vient de la respiration buccale forcée quand les voies nasales sont obstruées. Les maux de tête, eux, sont causés par l'accumulation de CO₂ pendant les pauses respiratoires : les vaisseaux cérébraux se dilatent en réponse au CO₂, provoquant des céphalées au réveil.",
      recommendation:
        "Si ces 3 signes coexistent, consultez votre médecin. En attendant : position latérale stricte, hydratation suffisante en soirée.",
      action: 'Notez la fréquence de ces symptômes et signalez-les à votre médecin.',
      actionWhy:
        "La polygraphie ventilatoire enregistre l'oxygène, le flux respiratoire et les efforts thoraciques toute la nuit. Elle identifie précisément le nombre d'apnées par heure. Un traitement précoce par PPC supprime les désaturations et normalise le CO₂ — les trois symptômes (bouche sèche, céphalées, ronflement) disparaissent en quelques nuits.",
    },
    {
      questionId: 'prof-8',
      triggerMaxScore: 1,
      title: "Évaluer et traiter le syndrome des jambes sans repos",
      insight:
        "Le syndrome des jambes sans repos (SJSR) vient d'un manque de dopamine dans les circuits moteurs de la moelle épinière. La dopamine inhibe normalement les neurones qui contrôlent les mouvements des membres au repos. Quand elle est insuffisante, ces neurones s'emballent et génèrent des envies irrépressibles de bouger. La cause la plus fréquente : un déficit en fer. Le fer est indispensable pour fabriquer la dopamine — et un manque de ferritine (le fer stocké dans l'organisme) peut suffire à déclencher le syndrome, même sans anémie.",
      recommendation:
        "Première étape : bilan sanguin avec ferritine (prescrit par votre médecin). En attendant : réduire caféine et alcool le soir, étirements des membres inférieurs, marcher sur du carrelage froid pour soulager les symptômes aigus.",
      action: 'Demandez un bilan ferritine à votre médecin.',
      actionWhy:
        "La ferritine mesure le fer stocké — différent d'une anémie classique. Une supplémentation orale en fer (bisglycinate de fer, bien toléré) reconstitue les réserves en 3 à 6 mois, restaurant la production de dopamine dans les circuits moteurs. À court terme : réduire la caféine et l'alcool le soir peut atténuer les symptômes en modulant les circuits dopaminergiques nocturnes.",
    },
    {
      questionId: 'prof-9',
      triggerMaxScore: 1,
      title: "Optimiser l'environnement nocturne",
      insight:
        "Le cerveau continue de surveiller l'environnement pendant le sommeil, même sans en avoir conscience. Des neurones du tronc cérébral (la formation réticulée) évaluent en permanence les sons, la lumière et la température pour détecter des menaces — un héritage évolutif. Un bruit à 45 dB, une LED de chargeur (5 lux), ou une variation de température de 2°C suffisent à déclencher une micro-alerte et un micro-éveil. Répétés toute la nuit, ces micro-éveils fragmentent le sommeil profond sans que vous vous en souveniez au matin.",
      recommendation:
        "Auditez la chambre en priorité : 16-19°C, obscurité totale (LED des chargeurs incluses), isolation phonique. Si tout est optimal et les réveils persistent, évoquez un trouble respiratoire avec votre médecin.",
      action: 'Optimisez votre environnement nocturne : température, obscurité totale, isolation phonique.',
      actionWhy:
        "Chaque ajustement environnemental supprime une source de stimulation qui activait les circuits d'éveil. La température à 16-19°C stabilise le signal thermique. L'obscurité totale élimine les activations des cellules spécialisées de la rétine. L'isolation phonique réduit les sons que le tronc cérébral interprète comme signaux d'alerte. L'effet est cumulatif : moins de stimuli, moins de micro-éveils, plus de temps en sommeil profond.",
    },
    {
      questionId: 'prof-10',
      triggerMaxScore: 1,
      title: "Briser le cercle douleur-sommeil",
      insight:
        "La douleur chronique et le mauvais sommeil s'entretiennent mutuellement. La douleur active les circuits d'éveil du cerveau et fragmente le sommeil. Et le manque de sommeil profond, à son tour, amplifie la sensibilité à la douleur via l'inflammation — le manque de REM réduit aussi les endorphines et les voies naturelles de modulation de la douleur. Résultat : plus on a mal, moins on dort ; moins on dort, plus on a mal.",
      recommendation:
        "Méditation pleine conscience guidée 10-20 min avant le coucher : réduit la composante émotionnelle de la douleur chronique, avec des effets mesurables sur le sommeil en 4-6 semaines. Si la douleur est chronique ou s'aggrave, consultez votre médecin : traiter la cause améliore durablement le sommeil.",
      action: 'Pratiquez 10 min de méditation de pleine conscience guidée avant le coucher.',
      actionWhy:
        "La méditation pleine conscience réduit la composante émotionnelle de la douleur — pas en la faisant disparaître, mais en réduisant la détresse associée, ce qui calme les circuits d'éveil. Elle augmente aussi la sérotonine et les endorphines, renforçant les mécanismes naturels d'amortissement de la douleur. Les effets sur le sommeil sont mesurables en 4 à 6 semaines de pratique régulière.",
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

function isTriggered(qi: QuestionInsight, scores: Record<string, number>): boolean {
  const s = scores[qi.questionId]
  if (s === undefined) return false
  if (qi.triggerMinScore === undefined && qi.triggerMaxScore === undefined) return false
  if (qi.triggerMinScore !== undefined) return s >= qi.triggerMinScore
  return s <= (qi.triggerMaxScore as number)
}

export function getTriggeredInsights(
  report: SectionReport,
  scores: Record<string, number>
): (QuestionInsight | (GroupedInsight & { questionId: '_grouped' }))[] {
  // Collect triggered individual question IDs
  const triggeredIds = new Set(
    report.questionInsights.filter((qi) => isTriggered(qi, scores)).map((qi) => qi.questionId)
  )

  // Check grouped insights — if all questionIds in a group are triggered, use the group
  const groupedUsed = new Set<string>()
  const result: (QuestionInsight | (GroupedInsight & { questionId: '_grouped' }))[] = []

  if (report.groupedInsights) {
    for (const group of report.groupedInsights) {
      if (group.questionIds.every((id) => triggeredIds.has(id))) {
        result.push({ ...group, questionId: '_grouped' })
        group.questionIds.forEach((id) => groupedUsed.add(id))
      }
    }
  }

  // Add individual insights that weren't absorbed into a group
  for (const qi of report.questionInsights) {
    if (isTriggered(qi, scores) && !groupedUsed.has(qi.questionId)) {
      result.push(qi)
    }
  }

  return result
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
      "Dormir moins de 7h/nuit de façon chronique augmente la mortalité toutes causes de 12 % et multiplie les risques de diabète de type 2, de maladies cardiovasculaires et de certains cancers. Concrètement sur le corps : une seule nuit courte réduit de 70 % l'activité des cellules immunitaires chargées d'éliminer les cellules infectées ou cancéreuses, et active des centaines de gènes pro-inflammatoires. La sensibilité à l'insuline chute — le corps gère moins bien le sucre, comme dans un état pré-diabétique. La testostérone (chez l'homme) et les hormones de récupération musculaire baissent significativement. L'hormone de croissance, libérée presque exclusivement en sommeil profond, orchestre la réparation des tissus : muscles, peau, os. Et pendant ce temps, le système de nettoyage cérébral (le système glymphatique) élimine les protéines toxiques liées à Alzheimer — 10 fois plus efficacement que pendant l'éveil. Le sommeil n'est pas un luxe récupérable le week-end : c'est la maintenance quotidienne obligatoire de l'ensemble du corps.",
    reference: 'Médecine du sommeil et chronobiologie',
  },
  {
    title: 'L\'amygdale sans sommeil : 60 % plus réactive',
    description:
      "Une nuit de sommeil insuffisant rend l'amygdale — le centre des émotions du cerveau — 60 % plus réactive aux stimuli négatifs. En parallèle, sa connexion avec le cortex préfrontal (le frein rationnel) s'affaiblit. Résultat concret : les mêmes situations déclenchent plus d'irritabilité, d'anxiété et de réactions impulsives qu'en temps normal — ce n'est pas un manque de caractère, c'est neurologique. La mémoire est aussi touchée : le sommeil profond consolide ce qu'on a appris dans la journée en le transférant dans la mémoire à long terme. Mal dormir, c'est effacer une partie de ce qu'on a retenu. La créativité et la résolution de problèmes chutent : le cerveau fait moins de connexions inattendues entre les idées. Et les hormones de l'appétit se dérèglent : la ghréline (faim) augmente, la leptine (satiété) baisse — d'où les fringales et les envies de sucre après une mauvaise nuit. Après 10 nuits à 6h, les performances cognitives atteignent le niveau d'une privation totale de 24h — mais le déficit est systématiquement sous-estimé, car on s'habitue à fonctionner en mode dégradé.",
    reference: 'Neurosciences cognitives et médecine du sommeil',
  },
  {
    title: 'Le REM : une thérapie émotionnelle gratuite chaque nuit',
    description:
      "Pendant le sommeil paradoxal (REM), le cerveau fait quelque chose de remarquable : il rejoue les souvenirs émotionnellement chargés de la journée, mais dans un bain neurochimique sans noradrénaline — le neurotransmetteur du stress. C'est la seule période de la journée où le cerveau traite des émotions intenses sans en ressentir la charge. À chaque cycle REM, la composante émotionnelle du souvenir s'émousse un peu plus, jusqu'à ce que le fait reste dans la mémoire mais sans le poids émotionnel initial. C'est pour cela que les problèmes paraissent toujours moins lourds au matin qu'au soir. Ce mécanisme est aussi au cœur du traitement des traumatismes : son dysfonctionnement est l'une des causes du stress post-traumatique. Le REM réinitialise aussi les circuits de la dopamine (motivation, plaisir) et booste la pensée créative en créant des connexions inattendues entre des souvenirs éloignés — beaucoup de grandes idées émergent au réveil ou juste après une nuit. Cette phase se concentre en fin de nuit : c'est exactement celle que l'alcool, certains somnifères et les réveils précoces coupent en premier.",
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
export interface WeaknessItem { sectionId: string; title: string; pct: number; level: string; concern: string; science: string; reference: string; triggeredInsights: { questionId: string; title: string; insight: string; recommendation: string; action?: string }[] }
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
        concern: triggered.length > 0
          ? `${triggered.length} point${triggered.length > 1 ? 's' : ''} à travailler : ${triggered.map(t => t.title).join(', ')}.`
          : rec.text,
        science: report.context,
        reference: ref0,
        triggeredInsights: triggered
          .filter((t, i, arr) => arr.findIndex(x => x.recommendation.slice(0, 60) === t.recommendation.slice(0, 60)) === i)
          .map(t => ({ questionId: t.questionId, title: t.title, insight: t.insight, recommendation: t.recommendation, action: t.action })),
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
