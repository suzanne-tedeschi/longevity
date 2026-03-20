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
  strengthLabel: 'Vos nuits sont calmes et non fragmentées',
  weaknessLabel: 'Perturbations nocturnes à corriger en priorité',
  scienceNote:
    "Un sommeil non fragmenté permet au cerveau de compléter ses cycles. C'est en sommeil profond (NREM N3) que l'hormone de croissance est libérée et que le nettoyage cérébral s'effectue : ce processus ne se rattrape pas le week-end.",
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
      text: "Vos nuits sont globalement calmes. Surveillez si un facteur revient régulièrement (température, bruit, lumière, stress) pour l'éliminer.",
    },
    {
      maxPct: 100,
      level: 'excellent',
      title: 'Nuits non perturbées',
      text: "Vos cycles sont complets : nettoyage cérébral nocturne (système glymphatique) actif, mémoire consolidée, émotions régulées. Le sommeil non fragmenté est l'un des premiers marqueurs de longévité cellulaire.",
    },
  ],
  questionInsights: [
    {
      questionId: 'som-1',
      triggerMaxScore: 1,
      insight:
        "Un endormissement long (plus de 30 min) signale une désynchronisation entre la pression de sommeil (adénosine accumulée) et l'horloge circadienne. Si ce symptôme survient 3 nuits ou plus par semaine depuis plus de 3 mois avec un retentissement diurne (fatigue, irritabilité, baisse des performances), il s'agit d'une insomnie chronique : la TCC-I (thérapie comportementale et cognitive pour l'insomnie) est le traitement recommandé en première intention.",
      recommendation:
        "Ne vous couchez que sur des signaux réels de sommeil (paupières lourdes, bâillements). Levez-vous à heure fixe chaque matin, week-end inclus : c'est le levier le plus puissant pour calibrer l'accumulation d'adénosine et resynchroniser l'horloge interne.",
      action: 'Ne vous couchez que sur des signaux réels de sommeil, et levez-vous à heure fixe chaque matin.',
      actionWhy:
        "L'heure de réveil fixe resynchronise l'horloge interne du cerveau (noyau suprachiasmatique) et recalibre la pression de sommeil, rendant l'endormissement naturel au bon moment le soir.",
    },
    {
      questionId: 'som-2',
      triggerMaxScore: 1,
      insight:
        "Les réveils en première moitié de nuit amputent le sommeil profond (récupération physique, nettoyage cérébral). Les réveils en fin de nuit amputent le sommeil paradoxal (régulation émotionnelle, consolidation créative). Ces deux phases ne se rattrapent pas.",
      recommendation:
        "Chambre fraîche (16-19°C), obscurité totale incluant les LED des chargeurs. Si vous ne vous rendormez pas en 20 min, levez-vous, activité calme à lumière tamisée, cohérence cardiaque (5s inspiration / 5s expiration, 5 min) pour réactiver le système parasympathique.",
      action: 'Vérifiez la température (16-19°C) et l\'obscurité totale de votre chambre.',
      actionWhy:
        "La descente thermique corporelle est le principal signal biologique déclencheur du sommeil profond : une chambre trop chaude génère des micro-éveils par défaut de thermorégulation.",
    },
    {
      questionId: 'som-4',
      triggerMaxScore: 1,
      insight:
        "Des difficultés respiratoires nocturnes évoquent des apnées du sommeil : des pauses involontaires qui génèrent des micro-éveils à chaque épisode, souvent sans souvenir conscient, fragmentant complètement le sommeil profond. Ce trouble touche 1 adulte sur 10 et est diagnostiqué dans seulement 20 % des cas.",
      recommendation:
        "Consultez votre médecin pour une polygraphie ventilatoire (enregistrement respiratoire à domicile). En attendant : position latérale stricte (réduit les obstructions mécaniques) et zéro alcool le soir (il relaxe les muscles pharyngés et aggrave les apnées).",
      action: 'Consultez votre médecin pour une polygraphie ventilatoire.',
      actionWhy:
        "Le traitement par PPC (masque à pression positive continue) supprime les micro-éveils liés aux apnées et restaure le sommeil profond dès la première nuit de traitement.",
    },
    {
      questionId: 'som-5',
      triggerMaxScore: 1,
      insight:
        "Un ronflement fréquent et bruyant indique que les voies aériennes sont partiellement obstruées pendant le sommeil. Ce n'est pas un désagrément sonore : c'est un facteur de micro-éveils répétés et un signe clinique à évaluer médicalement si quotidien.",
      recommendation:
        "Dormez sur le côté, évitez l'alcool le soir. Des exercices myofonctionnels (renforcement des muscles du palais et de la gorge, 10 min/j pendant 3 mois) réduisent le ronflement de façon documentée. Consultez si fort ou quotidien.",
      action: 'Dormez sur le côté et consultez votre médecin si le ronflement est fort ou quotidien.',
      actionWhy:
        "La position latérale empêche la langue et les tissus mous de retomber vers l'arrière et d'obstruer partiellement les voies aériennes : cause mécanique directe du ronflement.",
    },
    {
      questionId: 'som-8',
      triggerMaxScore: 1,
      insight:
        "Des cauchemars fréquents perturbent le REM, la phase pendant laquelle le cerveau rejoue les souvenirs chargés dans un environnement neurochimique calme (sans noradrénaline), émousant progressivement leur charge émotionnelle. Des cauchemars récurrents signalent une perturbation de ce mécanisme, souvent liée au stress chronique ou à la privation de REM.",
      recommendation:
        "Répétition par imagerie (IRT) : 10 min chaque soir avant le coucher, réécrivez le scénario du cauchemar avec une fin apaisante, répétez-le mentalement 3-4 jours de suite. Résultats visibles en 2 à 4 semaines.",
      action: 'Pratiquez la répétition par imagerie : réécrivez chaque soir votre cauchemar avec une fin apaisante.',
      actionWhy:
        "L'IRT active les mêmes circuits que le REM pendant l'éveil, substituant progressivement le contenu anxiogène par un contenu neutre : mécanisme validé dans le traitement des traumatismes.",
    },
    {
      questionId: 'som-9',
      triggerMaxScore: 1,
      insight:
        "Douleur nocturne et mauvais sommeil forment un cercle vicieux bidirectionnel : la douleur fragmente le sommeil profond, et le manque de sommeil profond abaisse le seuil de douleur (le corps devient plus sensible), amplifiant la perception douloureuse le lendemain.",
      recommendation:
        "Étirements doux ciblés 10 min avant le coucher. Chaleur locale en soirée (bouillotte ou bain chaud) : relâche les muscles tendus et prépare la descente thermique. Évaluez votre literie : un matelas >8 ans aggrave les douleurs articulaires et perturbe le sommeil profond.",
      action: 'Faites 10 min d\'étirements doux avant le coucher et évaluez votre literie.',
      actionWhy:
        "La chaleur locale réduit la tension musculaire et déclenche une vasodilatation périphérique qui accélère la descente thermique centrale, signal biologique clé de l'endormissement.",
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
        "Une mauvaise perception du sommeil génère une anxiété de performance (\"je dois dormir\") qui est elle-même le carburant principal de l'insomnie chronique : l'esprit surveille activement son propre sommeil, ce qui l'empêche de se produire. C'est un cercle cognitif, pas une fragilité constitutionnelle.",
      recommendation:
        "La TCC-I (thérapie comportementale et cognitive pour l'insomnie) est le traitement recommandé en première ligne : 4-6 séances, résultats supérieurs aux somnifères à long terme. Elle agit sur l'hyperactivation cognitive et reconditionne l'association lit-sommeil. Demandez une orientation à votre médecin.",
      action: 'Demandez à votre médecin une orientation vers la TCC-I.',
      actionWhy:
        "La TCC-I éteint l'hyperactivation cognitive et reconditionne l'association lit-sommeil : bénéfices durables car elle agit sur les mécanismes, pas les symptômes.",
    },
    {
      questionId: 'qual-2',
      triggerMaxScore: 1,
      insight:
        "Les somnifères (benzodiazépines, zolpidem) induisent une sédation neurologique, non un sommeil naturel : l'activité cérébrale pendant la sédation est différente, avec moins de sommeil profond et de sommeil paradoxal. Le CBD, souvent présenté comme alternatif, peut désynchroniser le sommeil paradoxal et perturber les circuits émotionnels ; son efficacité sur le sommeil n'est pas établie chez le sujet sain.",
      recommendation:
        "Évoquez votre consommation avec votre médecin et explorez la TCC-I : ses bénéfices sont durables car elle agit sur les causes de l'insomnie, pas ses symptômes.",
      action: 'Mentionnez votre consommation de somnifères à votre médecin et demandez une orientation vers la TCC-I.',
      actionWhy:
        "Contrairement aux somnifères, la TCC-I produit des améliorations stables à long terme sans modifier l'architecture du sommeil.",
    },
    {
      questionId: 'qual-3',
      triggerMaxScore: 1,
      insight:
        "La somnolence diurne indique que la pression de sommeil (adénosine, la molécule qui s'accumule pendant l'éveil) n'a pas été suffisamment résorbée la nuit, par manque de durée ou fragmentation des cycles. Des microsommeils de 3 à 10 secondes peuvent survenir sans que la personne s'en rende compte, y compris au volant.",
      recommendation:
        "Lumière naturelle dès le réveil (10-15 min dehors) pour activer l'axe cortisol-éveil et synchroniser l'horloge interne. Siestes 10-20 min entre 13h et 15h maximum, pas plus longues, pas après 15h.",
      action: 'Exposez-vous à la lumière naturelle dès le réveil (10-15 min) et limitez les siestes à 20 min avant 15h.',
      actionWhy:
        "La lumière matinale active les cellules de la rétine sensibles à la lumière bleue → libération de cortisol (hormone d'éveil) + arrêt de la mélatonine → synchronisation de l'horloge interne et amélioration de l'énergie diurne.",
    },
    {
      questionId: 'qual-4',
      triggerMaxScore: 1,
      insight:
        "Un manque de motivation persistant est fréquemment un effet du déficit de sommeil paradoxal (REM, la phase des rêves en fin de nuit) sur la dopamine : cette phase restaure la sensibilité des récepteurs à la dopamine, hormone impliquée dans la motivation et l'engagement. C'est la première phase sacrifiée par la privation partielle de sommeil. Sans assez de sommeil paradoxal, la motivation s'érode indépendamment de la volonté.",
      recommendation:
        "7-9 heures de sommeil dans l'agenda, non négociables. Une activité physique modérée en fin d'après-midi améliore simultanément la qualité du sommeil nocturne et l'énergie du lendemain.",
      action: 'Protégez une fenêtre fixe de 7-9 heures de sommeil dans votre agenda.',
      actionWhy:
        "Le sommeil paradoxal restaure la sensibilité à la dopamine et régule les émotions : ces effets ne se produisent qu'avec des cycles complets.",
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
        "Des horaires de coucher variables créent un décalage horaire interne permanent : l'horloge interne du cerveau ne sait plus quand libérer la mélatonine (l'hormone du coucher) ni programmer le réveil naturel. La régularité est le premier facteur de qualité du sommeil, avant même la durée.",
      recommendation:
        "Heure de coucher fixe à ±30 min, 7j/7, week-ends inclus. Mettez une alarme 'heure du coucher'. L'adaptation est visible en 1-2 semaines : la mélatonine commence à se libérer à heure prévisible, l'endormissement devient naturel.",
      action: 'Fixez une heure de coucher à ±30 min, 7j/7 week-ends inclus.',
      actionWhy:
        "La régularité du coucher synchronise l'horloge interne sur un cycle stable, permettant à la mélatonine d'être libérée à heure prévisible.",
    },
    {
      questionId: 'hyg-2',
      triggerMaxScore: 1,
      insight:
        "Vous restez au lit quand vous n'arrivez pas à dormir. Ce comportement renforce l'association lit-éveil : votre cerveau apprend progressivement à associer le lit à la frustration et à l'état d'éveil, plutôt qu'au sommeil.",
      recommendation:
        "Contrôle du stimulus (pilier de la TCC-I) : si pas endormi en 20 min, quittez la chambre, activité calme à lumière tamisée, revenez uniquement quand le sommeil revient. Répété sur quelques nuits, ça recrée l'association lit-sommeil.",
      action: 'Si pas endormi en 20 min, quittez la chambre et revenez uniquement quand le sommeil revient.',
      actionWhy:
        "Le contrôle du stimulus reconditionne le réflexe lit-sommeil : en quelques nuits, s'allonger déclenche une réponse somnolente automatique.",
    },
    {
      questionId: 'hyg-3',
      triggerMaxScore: 1,
      insight:
        "Surveiller son endormissement produit l'effet inverse : le cerveau entre en mode vigilance, le cortex préfrontal (zone de planification) s'active et inhibe les structures cérébrales de l'endormissement.",
      recommendation:
        "Retirez ou couvrez l'horloge de la chambre, et ne regardez pas l'heure sur le téléphone : chaque coup d'oeil déclenche un calcul automatique ('il me reste X heures') qui amplifie l'anxiété de performance et maintient le cortex préfrontal actif.",
      action: 'Retirez ou couvrez l\'horloge de la chambre et ne regardez pas l\'heure sur le téléphone la nuit.',
      actionWhy:
        "Voir l'heure active le cortex préfrontal (planification) et inhibe les structures cérébrales de l'endormissement : supprimer ce stimulus supprime ce circuit.",
    },
    {
      questionId: 'hyg-4',
      triggerMaxScore: 1,
      insight:
        "La caféine bloque les récepteurs à l'adénosine (la molécule de la pression de sommeil) sans la résoudre : la fatigue s'accumule mais ne peut pas agir. Sa demi-vie est de 5 à 10h selon le profil individuel. Un café à 16h maintient encore 50 % de son effet à 22h, réduisant le sommeil profond même si l'endormissement semble normal.",
      recommendation:
        "Dernière caféine avant 13-14h. Sources cachées : thé noir (50-80 mg), chocolat noir, certains sodas. En soirée : tisanes (camomille, passiflore).",
      action: 'Stoppez toute caféine après 13-14h (café, thé noir, chocolat noir, sodas).',
      actionWhy:
        "Bloquer l'adénosine retarde l'endormissement et réduit le sommeil profond : même quand on s'endort à l'heure habituelle, la structure du sommeil est altérée.",
    },
    {
      questionId: 'hyg-5',
      triggerMaxScore: 1,
      insight:
        "L'heure de réveil est plus déterminante que l'heure de coucher : c'est elle qui fixe le point de départ de la pression de sommeil et cadre tout le rythme circadien. La grasse matinée du week-end crée un décalage de l'horloge interne qui désynchronise toute la semaine suivante.",
      recommendation:
        "Même heure de réveil tous les jours, ±30 min, week-end inclus. Fatigue le week-end : préférez une sieste de 20 min à une grasse matinée.",
      action: 'Levez-vous à la même heure chaque matin (±30 min), week-end inclus.',
      actionWhy:
        "Le lever fixe calibre l'horloge interne et détermine naturellement l'heure d'endormissement du soir.",
    },
    {
      questionId: 'hyg-6',
      triggerMaxScore: 1,
      insight:
        "Des siestes de plus de 30 min entrent en sommeil profond et provoquent une inertie du sommeil (la sensation de lourdeur au réveil). Elles réduisent aussi la pression de sommeil du soir, retardant l'endormissement nocturne.",
      recommendation:
        "Siestes 10-20 min maximum, entre 13h et 15h. Astuce du café-sieste : buvez un café juste avant de vous allonger ; la caféine met 20 min à agir, elle entre en action au réveil et augmente l'énergie sans perturber la nuit.",
      action: 'Limitez vos siestes à 20 min maximum, avant 15h.',
      actionWhy:
        "20 min de sieste reste en sommeil léger : récupération sans inertie, et pression de sommeil nocturne préservée.",
    },
    {
      questionId: 'hyg-7',
      triggerMaxScore: 1,
      insight:
        "La lumière bleue des écrans inhibe la mélatonine (l'hormone du coucher) via des cellules spécialisées de la rétine. 2h d'écran avant le coucher retardent l'endormissement de 90 min et réduisent le sommeil paradoxal de 20 % la nuit suivante.",
      recommendation:
        "Couvre-feu digital à 21h : lumières tamisées, pas d'écran, téléphone hors de la chambre. Minimum 60 min d'écran-free avant le coucher.",
      action: 'Instaurez un couvre-feu digital à 21h : lumières tamisées, pas d\'écran, téléphone hors de la chambre.',
      actionWhy:
        "30 min d'exposition à la lumière bleue retardent la sécrétion de mélatonine de 1 à 1,5 heure : l'endormissement et le sommeil paradoxal de fin de nuit en sont directement affectés.",
    },
    {
      questionId: 'hyg-8',
      triggerMaxScore: 1,
      insight:
        "La digestion génère une chaleur métabolique qui maintient la température corporelle haute, à l'inverse du signal biologique d'endormissement (baisse de 0,5-1°C requise). Un repas riche en glucides raffinés en soirée génère aussi une hyperglycémie et hyperinsulinisme qui fragmentent les premières heures de sommeil.",
      recommendation:
        "Dîner léger 2-4h avant le coucher, riche en tryptophane (œufs, légumineuses, noix). Jeûne nocturne ≥12h (Time Restricted Feeding). Petite faim tardive : une poignée de noix.",
      action: 'Dînez léger 2-4h avant le coucher et visez un jeûne nocturne de 12h minimum.',
      actionWhy:
        "Un jeûne nocturne de 12h réduit l'inflammation nocturne et les pics de cortisol, améliorant la qualité du sommeil profond.",
    },
    {
      questionId: 'hyg-9',
      triggerMaxScore: 1,
      insight:
        "Zone rouge 19h-21h : un exercice intense dans cette fenêtre empêche la descente thermique corporelle nécessaire à l'endormissement. Zone idéale : 15h-17h, où l'effort accompagne la baisse thermique naturelle du soir. Zone 17h-19h : neutre à légèrement défavorable selon les individus.",
      recommendation:
        "Effort intense avant 19h, idéalement 15h-17h. Le soir : étirements doux, yoga, marche légère, des activités qui activent le système parasympathique et préparent la descente thermique.",
      action: 'Pratiquez l\'effort intense avant 19h (idéalement 15h-17h) et optez pour des étirements doux le soir.',
      actionWhy:
        "L'exercice intense libère de l'adrénaline et élève la température corporelle pendant 4-6h : entre 19h et 21h, cet effet bloque la thermorégulation nécessaire à l'endormissement.",
    },
    {
      questionId: 'hyg-10',
      triggerMaxScore: 1,
      insight:
        "L'alcool facilite l'endormissement par effet sédatif, puis déclenche un rebond d'activation cérébrale en 2e moitié de nuit : micro-éveils, suppression du sommeil paradoxal. Deux verres de vin en soirée réduisent le sommeil paradoxal de 24 %, altérant la régulation émotionnelle et la consolidation mémorielle.",
      recommendation:
        "Zéro alcool dans les 4h avant le coucher. Si vous buvez en soirée : finissez tôt, alternez avec de l'eau.",
      action: 'Évitez tout alcool dans les 4 heures avant le coucher.',
      actionWhy:
        "L'alcool est métabolisé en acétaldéhyde (un activateur neuronal) qui fragmente la 2e moitié de nuit et supprime le sommeil paradoxal : régulation émotionnelle et mémoire en sont les premières victimes.",
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
        "Le cerveau reste en mode planification au coucher : le cortex préfrontal inhibe activement les structures d'endormissement. C'est l'hyperactivation cognitive, mécanisme central de l'insomnie chronique, à la fois cause et conséquence.",
      recommendation:
        "Carnet vide-cerveau avant le lit (20 min) : notez toutes les pensées, tâches et préoccupations en suspens, avec une action concrète pour chacune. Complétez avec 10 min de relaxation musculaire progressive (contracter-relâcher chaque groupe musculaire, des pieds jusqu'au visage).",
      action: 'Tenez un carnet "vide-cerveau" chaque soir : pensées, tâches, une action concrète pour chacune.',
      actionWhy:
        "L'écriture des préoccupations réduit l'activité du cortex préfrontal et libère les structures d'endormissement : réduction de la latence de 9 min documentée en moyenne.",
    },
    {
      questionId: 'prof-2',
      triggerMaxScore: 1,
      insight:
        "Les ruminations au coucher activent le réseau neuronal par défaut du cerveau (actif quand on ne se concentre sur rien de précis), incompatible avec l'endormissement. Essayer de les stopper les amplifie : c'est le paradoxe de la suppression mentale.",
      recommendation:
        "15 min de 'temps des soucis structuré' en début de soirée (pas au lit) : notez chaque préoccupation et quand vous l'adresserez concrètement. Au lit : scan corporel de la tête aux pieds, en relâchant consciemment chaque zone musculaire.",
      action: 'Faites 15 min de "temps des soucis structuré" en début de soirée, pas au lit.',
      actionWhy:
        "Compartimenter les soucis dans une plage dédiée signale au cerveau qu'ils ont été traités : réduit leur intrusion au coucher, technique centrale de la TCC-I.",
    },
    {
      questionId: 'prof-3',
      triggerMaxScore: 1,
      insight:
        "Palpitations ou chaleur interne au lit : le système nerveux sympathique est encore actif. Stress accumulé, exercice tardif ou anxiété chronique maintiennent le cortisol élevé au moment de l'endormissement.",
      recommendation:
        "Cohérence cardiaque : 5s inspiration / 5s expiration (6 cycles/min), 5 min. Active le nerf vague et bascule le système nerveux en mode parasympathique en quelques minutes. Alternative : bain ou douche chaude 1h30 avant le coucher ; la descente thermique post-bain facilite l'endormissement.",
      action: 'Pratiquez 5 min de cohérence cardiaque au coucher (5s inspiration / 5s expiration).',
      actionWhy:
        "La cohérence cardiaque active le nerf vague → parasympathique → baisse du cortisol et de la fréquence cardiaque, créant les conditions physiologiques de l'endormissement.",
    },
    {
      questionId: 'prof-4',
      triggerMaxScore: 1,
      insight:
        "Mieux dormir hors de chez soi signale un conditionnement négatif de la chambre : lit associé à l'éveil, à l'écran, au travail, à la frustration de ne pas dormir, à l'opposé du signal recherché.",
      recommendation:
        "Chambre = cave à sommeil uniquement : obscurité totale (masque si nécessaire), 16-19°C, silence ou bruit blanc. Plus d'écran, plus de travail, pas de repas dans la chambre. Ce reconditionnement produit des effets en 2-3 semaines.",
      action: 'Transformez votre chambre : obscurité totale, 16-19°C, silence ou bruit blanc. Pas d\'écran, pas de travail.',
      actionWhy:
        "Le conditionnement environnemental crée une réponse somnolente réflexe à l'entrée dans la chambre : mécanisme d'apprentissage associatif de base.",
    },
    {
      questionId: 'prof-5',
      triggerMaxScore: 1,
      insight:
        "Se réveiller plus fatigué qu'au coucher indique que les cycles de réparation ne sont pas complétés, soit par micro-éveils imperceptibles (apnées), soit par un manque de sommeil profond. Le nettoyage cérébral nocturne et la récupération physique n'ont pas eu lieu.",
      recommendation:
        "Symptôme régulier → consultez votre médecin pour évaluer une polygraphie ventilatoire. En parallèle : chambre fraîche (16-19°C), obscurité totale.",
      action: 'Consultez votre médecin si vous vous réveillez régulièrement plus fatigué qu\'au coucher.',
      actionWhy:
        "Les apnées génèrent des micro-éveils répétés qui fragmentent le sommeil profond et empêchent le nettoyage cérébral nocturne, d'où la fatigue malgré une durée de sommeil apparemment suffisante.",
    },
    {
      questionId: 'prof-6',
      triggerMaxScore: 1,
      insight:
        "Ronflement fort + pauses respiratoires remarquées par l'entourage = triade clinique principale des apnées obstructives du sommeil. Chaque pause génère un micro-éveil, souvent imperceptible mais fragmentant le sommeil profond.",
      recommendation:
        "Polygraphie ventilatoire (prescription médicale, réalisée à domicile) pour confirmer ou exclure le diagnostic. Si apnées confirmées : le traitement par PPC transforme la qualité du sommeil dès la première nuit.",
      action: 'Consultez votre médecin pour une polygraphie ventilatoire.',
      actionWhy:
        "Le PPC (masque à pression positive continue) supprime les micro-éveils liés aux apnées et restaure immédiatement le sommeil profond et le sommeil paradoxal.",
    },
    {
      questionId: 'prof-7',
      triggerMaxScore: 1,
      insight:
        "Bouche sèche au réveil + maux de tête matinaux + ronflement = triade clinique orientant vers les apnées du sommeil. La respiration buccale compensatoire assèche la muqueuse ; les variations d'O₂ nocturnes créent les céphalées.",
      recommendation:
        "Si ces 3 signes coexistent, consultez votre médecin. En attendant : position latérale stricte, hydratation suffisante en soirée.",
      action: 'Notez la fréquence de ces symptômes et signalez-les à votre médecin.',
      actionWhy:
        "Un diagnostic et un traitement précoces (PPC) suppriment ces 3 symptômes dès les premières nuits de traitement.",
    },
    {
      questionId: 'prof-8',
      triggerMaxScore: 1,
      insight:
        "Envies irrépressibles de bouger les jambes au repos le soir = syndrome des jambes sans repos. Touche 5-10 % de la population. Lié dans la majorité des cas à un déficit en fer qui perturbe la production de dopamine dans le cerveau.",
      recommendation:
        "Première étape : bilan sanguin avec ferritine (prescrit par votre médecin). En attendant : réduire caféine et alcool le soir, étirements des membres inférieurs, marcher sur du carrelage froid pour soulager les symptômes aigus.",
      action: 'Demandez un bilan ferritine à votre médecin.',
      actionWhy:
        "Un déficit en ferritine altère la disponibilité du fer dans les neurones qui produisent la dopamine : la supplémentation améliore significativement les symptômes dans la majorité des cas.",
    },
    {
      questionId: 'prof-9',
      triggerMaxScore: 1,
      insight:
        "Des réveils nocturnes sans cause apparente signalent des micro-éveils déclenchés par des stimuli environnementaux (bruit, lumière, variation de température) que le cerveau traite même pendant le sommeil.",
      recommendation:
        "Auditez la chambre en priorité : 16-19°C, obscurité totale (LED des chargeurs incluses), isolation phonique. Si tout est optimal et les réveils persistent, évoquez un trouble respiratoire avec votre médecin.",
      action: 'Optimisez votre environnement nocturne : température, obscurité totale, isolation phonique.',
      actionWhy:
        "Supprimer les stimuli environnementaux supprime les micro-éveils correspondants : augmentation directe du temps en sommeil profond.",
    },
    {
      questionId: 'prof-10',
      triggerMaxScore: 1,
      insight:
        "Douleur et mauvais sommeil forment un cercle vicieux bidirectionnel : la douleur fragmente le sommeil profond, et le manque de sommeil profond abaisse le seuil de douleur (le corps devient plus sensible), amplifiant la perception douloureuse le lendemain. Les deux problèmes doivent être traités simultanément.",
      recommendation:
        "Méditation pleine conscience guidée 10-20 min avant le coucher : réduit la composante émotionnelle de la douleur chronique, avec des effets mesurables sur le sommeil en 4-6 semaines. Si la douleur est chronique ou s'aggrave, consultez votre médecin : traiter la cause améliore durablement le sommeil.",
      action: 'Pratiquez 10 min de méditation de pleine conscience guidée avant le coucher.',
      actionWhy:
        "La méditation réduit l'activité de l'amygdale (centre des émotions) et module les voies de la douleur : la composante émotionnelle s'atténue, rendant le sommeil accessible malgré les inconforts physiques.",
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
