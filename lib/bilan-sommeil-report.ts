// ──────────────────────────────────────────────────────
// Bilan Sommeil, Compte-rendu
// Basé sur le PSQI, le SHI et la base de connaissance sommeil
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
  /** Section ID matching bilan-sommeil-data section IDs */
  sectionId: string
  /** Explication du domaine évalué */
  context: string
  /** Titre concis affiché dans la section "Ce qui va bien" */
  strengthLabel?: string
  /** Titre concis affiché dans la section "Ce qu'on peut améliorer" */
  weaknessLabel?: string
  /** Explication scientifique courte affichée sous le titre dans les forces */
  scienceNote?: string
  /** Recommandations graduées selon le score obtenu */
  recommendations: {
    /** Score pct < threshold → cette reco s'applique */
    maxPct: number
    level: 'alerte' | 'vigilance' | 'bon' | 'excellent'
    title: string
    text: string
  }[]
  /** Recommandations spécifiques par question (si score problématique) */
  questionInsights: {
    questionId: string
    /** Score ≤ seuil → insight s'active (for PSQI/SHI: low score = bad) */
    triggerMaxScore?: number
    /** Score ≥ seuil → insight s'active (for inverted questions: high score = bad) */
    triggerMinScore?: number
    insight: string
    recommendation: string
    action?: string
    actionWhy?: string
  }[]
  /** Références du domaine */
  references: ScientificReference[]
}

// ══════════════════════════════════════════════════════
// TROUBLES DU SOMMEIL, Section 1 (Q1–Q9)
// ══════════════════════════════════════════════════════

const troublesSommeilReport: SectionReport = {
  sectionId: 'troubles-sommeil',
  context:
    "Les perturbations nocturnes, difficultés d'endormissement, réveils fréquents, respiration bloquée, empêchent le cerveau d'atteindre les phases de sommeil profond (NREM N3) et de sommeil paradoxal (REM). Or, ces phases sont indispensables : c'est durant le sommeil profond que le système glymphatique (le système de nettoyage du cerveau) élimine les déchets cellulaires accumulés dans la journée, dont les protéines liées à la maladie d'Alzheimer. Un sommeil fragmenté sur la durée augmente significativement le risque cardiovasculaire et métabolique.",
  strengthLabel: 'Vos nuits sont calmes et non fragmentées',
  weaknessLabel: 'Perturbations nocturnes à corriger',
  scienceNote:
    "Un sommeil non fragmenté permet au cerveau d'activer son système de nettoyage nocturne (le système glymphatique) et de traverser les phases de réparation profonde. C'est un marqueur clé de longévité cellulaire.",
  recommendations: [
    {
      maxPct: 33,
      level: 'alerte',
      title: 'Nuits très perturbées',
      text: "Vos nuits sont fortement fragmentées, ce qui empêche votre cerveau et votre corps d'atteindre les phases réparatrices. Un sommeil très perturbé de façon chronique affecte mesurablament l'immunité, le métabolisme et la santé cardiovasculaire. Consultez votre médecin pour évaluer si un trouble du sommeil spécifique est en cause.",
    },
    {
      maxPct: 66,
      level: 'vigilance',
      title: 'Perturbations régulières',
      text: "Des perturbations nocturnes récurrentes vous empêchent d'atteindre le sommeil profond réparateur. Identifiez le ou les facteurs principaux (environnement, respiration, douleurs) et agissez dessus en priorité.",
    },
    {
      maxPct: 90,
      level: 'bon',
      title: 'Quelques inconforts ponctuels',
      text: 'Vos nuits sont globalement calmes, avec quelques perturbations isolées. Identifiez si un facteur revient régulièrement pour l\'éliminer facilement.',
    },
    {
      maxPct: 100,
      level: 'excellent',
      title: 'Nuits non perturbées',
      text: "Vos nuits ne présentent pas de perturbations notables. C'est un vrai atout : un sommeil non fragmenté permet les phases de réparation cellulaire, de consolidation de la mémoire et de nettoyage cérébral.",
    },
  ],
  questionInsights: [
    {
      questionId: 'som-1',
      triggerMaxScore: 1,
      insight:
        "Vous mettez souvent plus de 30 minutes à vous endormir. Cela indique un état d'hyperactivation (hyperarousal) du système nerveux, votre cerveau reste en mode alerte alors qu'il devrait basculer en mode veille.",
      recommendation:
        "La technique la plus efficace à long terme : ne vous couchez que quand vous avez vraiment sommeil (paupières lourdes, bâillements), et levez-vous à la même heure chaque matin. Cette approche, appelée restriction du temps au lit, recalibre votre pression de sommeil (l'accumulation d'adénosine, molécule qui provoque la sensation de fatigue) et rétablit l'association lit-sommeil en 2 à 3 semaines.",
      action: 'Ne vous couchez que lorsque vous avez vraiment sommeil et levez-vous à heure fixe chaque matin.',
      actionWhy:
        "Se lever à heure fixe renforce la pression de sommeil (accumulation d'adénosine, molécule qui déclenche l'endormissement) et resynchronise l'horloge interne. L'effet est visible en 7 à 14 jours.",
    },
    {
      questionId: 'som-2',
      triggerMaxScore: 1,
      insight:
        "Vous vous réveillez souvent au milieu de la nuit. Ces micro-éveils répétés réduisent le temps passé en sommeil profond (NREM N3), la phase où le corps se régénère et où la mémoire se consolide.",
      recommendation:
        "Vérifiez votre environnement : chambre fraîche (16-19°C), obscurité totale, y compris les petites LED des chargeurs. Si vous vous réveillez et ne vous rendormez pas en 20 minutes, levez-vous et faites une activité calme à la lumière douce jusqu'à ressentir le sommeil. Pratiquer une respiration lente (inspirez 5 secondes, expirez 5 secondes) pendant 5 minutes aide le système nerveux parasympathique (le mode calme du corps) à reprendre le contrôle.",
      action: 'Contrôlez la température (16-19°C) et l\'obscurité totale de votre chambre.',
      actionWhy:
        "La baisse de température corporelle est un signal biologique déclencheur du sommeil. Une chambre fraîche maintient cette baisse tout au long de la nuit, réduisant les micro-éveils liés à la thermorégulation.",
    },
    {
      questionId: 'som-4',
      triggerMaxScore: 1,
      insight:
        "Des difficultés respiratoires nocturnes évoquent des apnées du sommeil (des pauses involontaires dans la respiration qui activent brièvement le cerveau, souvent sans souvenir conscient). Ce trouble touche 1 adulte sur 10 et est très sous-diagnostiqué.",
      recommendation:
        "Parlez-en à votre médecin : il peut prescrire un enregistrement respiratoire à domicile pendant le sommeil (polygraphie ventilatoire) pour confirmer ou exclure le diagnostic. En attendant, dormez sur le côté plutôt que sur le dos, cela réduit mécaniquement les obstructions, et évitez l'alcool le soir.",
      action: 'Consultez votre médecin pour une polygraphie ventilatoire (enregistrement respiratoire nocturne).',
      actionWhy:
        "Les apnées du sommeil fragmentent le sommeil en générant des micro-éveils à chaque pause respiratoire, empêchant d'atteindre le sommeil profond. Traitées (avec un appareil respiratoire nocturne léger), elles transforment radicalement la qualité du sommeil.",
    },
    {
      questionId: 'som-5',
      triggerMaxScore: 1,
      insight:
        "Ronfler fréquemment signale que les voies aériennes sont partiellement obstruées pendant le sommeil, ce qui peut provoquer des apnées (pauses respiratoires). Ce n'est pas qu'un désagrément sonore, c'est un indicateur de qualité de sommeil.",
      recommendation:
        "Consultez votre médecin si le ronflement est fort ou quotidien. Des solutions d'attente peuvent aider : oreiller légèrement surélevé, bandes nasales, position sur le côté. Des exercices de renforcement des muscles de la gorge (prononcer des voyelles à voix haute 10 minutes par jour) réduisent le ronflement, leur efficacité est documentée dans la littérature scientifique.",
      action: 'Dormez sur le côté et consultez votre médecin si le ronflement est fort ou quotidien.',
      actionWhy:
        "La position latérale évite que la langue et les tissus mous tombent en arrière et obstruent partiellement les voies aériennes, ce qui est la cause mécanique principale du ronflement.",
    },
    {
      questionId: 'som-8',
      triggerMaxScore: 1,
      insight:
        "Des cauchemars fréquents perturbent le sommeil paradoxal (REM), la phase où le cerveau traite les émotions et consolide les souvenirs. Le stress, l'anxiété et certains médicaments peuvent amplifier ce phénomène.",
      recommendation:
        "Une technique scientifiquement validée : la répétition par imagerie (IRT). Prenez 10 minutes chaque soir pour réécrire le scénario de votre cauchemar récurrent en lui donnant une fin différente, plus positive. Notez-le sur papier, répétez-le mentalement 3 à 4 jours de suite. Cette technique 'reprogramme' progressivement les contenus traités par le cerveau pendant le REM. Résultats visibles en 2 à 4 semaines.",
      action: 'Pratiquez la répétition par imagerie : réécrivez le scénario de votre cauchemar avec une fin positive chaque soir.',
      actionWhy:
        "La répétition par imagerie (IRT) active les mêmes circuits neuronaux pendant l'éveil qu'en sommeil paradoxal (REM). En répétant un scénario modifié, le cerveau substitue progressivement le contenu anxiogène par un contenu neutre ou positif dans le rêve.",
    },
    {
      questionId: 'som-9',
      triggerMaxScore: 1,
      insight:
        "Les douleurs nocturnes et le mauvais sommeil forment un cercle vicieux : la douleur empêche le sommeil profond, et le manque de sommeil profond abaisse le seuil de douleur (rend le corps plus sensible), aggravant la perception douloureuse le lendemain.",
      recommendation:
        "Commencez par des étirements doux de 10 minutes avant le coucher pour relâcher les tensions musculaires. Un matelas de plus de 8 ans ou un oreiller inadapté amplifie les douleurs, c'est un investissement qui compte. La méditation de pleine conscience (10 à 20 minutes guidées) est prouvée pour réduire significativement la perception de la douleur chronique.",
      action: 'Faites 10 minutes d\'étirements doux avant le coucher et évaluez votre literie (matelas, oreiller).',
      actionWhy:
        "Les étirements doux activent le système nerveux parasympathique (mode repos) et réduisent les tensions musculaires qui compriment les articulations en position allongée. Une literie adaptée maintient la colonne en position neutre, réduisant les signaux douloureux nocturnes.",
    },
  ],
  references: [
    {
      authors: 'Cappuccio FP, D\'Elia L, Strazzullo P, Miller MA',
      title: 'Sleep duration and all-cause mortality: a systematic review and meta-analysis',
      journal: 'Sleep',
      year: 2010,
      doi: '10.1093/sleep/33.5.585',
      pmid: '20469800',
    },
    {
      authors: 'Xie L, Kang H, Xu Q et al.',
      title: 'Sleep drives metabolite clearance from the adult brain',
      journal: 'Science',
      year: 2013,
      doi: '10.1126/science.1241224',
      pmid: '24136970',
    },
  ],
}

// ══════════════════════════════════════════════════════
// QUALITÉ & IMPACT DIURNE, Section 2 (Q10–Q13)
// ══════════════════════════════════════════════════════

const qualiteImpactReport: SectionReport = {
  sectionId: 'qualite-impact',
  context:
    "La qualité perçue du sommeil et son impact sur la journée sont des indicateurs directs de la récupération nocturne. La somnolence diurne (l'envie de dormir pendant la journée) signale que la pression de sommeil (l'adénosine accumulée, molécule qui provoque la fatigue) n'a pas été suffisamment résorbée la nuit. Un manque d'enthousiasme et de motivation persistant est souvent un effet direct de la privation de sommeil sur la dopamine (l'hormone de la motivation), dont la production dépend des phases de sommeil paradoxal (REM).",
  strengthLabel: 'Votre sommeil recharge efficacement vos journées',
  weaknessLabel: 'Votre sommeil impacte votre quotidien',
  scienceNote:
    "Un sommeil réparateur stabilise les niveaux de cortisol (hormone du stress) et permet la résolution complète de l'adénosine (molécule de fatigue) accumulée dans la journée, garantissant énergie et concentration dès le réveil.",
  recommendations: [
    {
      maxPct: 33,
      level: 'alerte',
      title: 'Impact sévère sur le quotidien',
      text: "Votre vie quotidienne est fortement affectée par votre sommeil, manque d'énergie, difficultés de concentration, humeur altérée. Ce n'est pas une fatalité, mais cela mérite une vraie prise en charge. Un médecin ou un spécialiste du sommeil peut vous orienter vers des solutions adaptées.",
    },
    {
      maxPct: 66,
      level: 'vigilance',
      title: 'Fatigue qui s\'accumule',
      text: "Votre sommeil affecte vos journées de façon perceptible. Ce n'est pas qu'une question de volonté, c'est votre corps qui ne récupère pas suffisamment. Travailler sur la régularité des horaires et la qualité de l'environnement de sommeil aura un impact rapide.",
    },
    {
      maxPct: 90,
      level: 'bon',
      title: 'Quelques coups de mou',
      text: 'Il vous arrive de ressentir de la fatigue en journée, mais c\'est gérable. Consolider la régularité de vos horaires de coucher et de lever améliorera votre énergie quotidienne.',
    },
    {
      maxPct: 100,
      level: 'excellent',
      title: 'Journées bien rechargées',
      text: "Votre sommeil vous recharge efficacement. Vous vous levez avec de l'énergie et vos journées ne sont pas plombées par la fatigue. C'est le signe que vos nuits font bien leur travail de récupération.",
    },
  ],
  questionInsights: [
    {
      questionId: 'qual-1',
      triggerMaxScore: 1,
      insight:
        "Vous percevez votre sommeil comme de mauvaise qualité. Cette perception génère une anxiété liée au coucher (appréhension du moment d'aller dormir) qui alimente l'insomnie, un cercle vicieux documenté par la recherche.",
      recommendation:
        "L'approche la plus efficace et la plus durable est la thérapie comportementale et cognitive pour l'insomnie (TCC-I). Elle travaille sur les habitudes et les pensées autour du sommeil en 4 à 6 séances, avec des résultats supérieurs aux somnifères à long terme. Demandez à votre médecin de vous orienter.",
      action: 'Demandez à votre médecin une orientation vers la TCC-I (thérapie comportementale et cognitive pour l\'insomnie).',
      actionWhy:
        "La TCC-I agit directement sur l'hyperactivation cognitive (les pensées anxieuses autour du sommeil) et reconditionne l'association lit-sommeil. Son efficacité à long terme est supérieure aux somnifères, qui perdent leur effet en 2 à 4 semaines.",
    },
    {
      questionId: 'qual-2',
      triggerMaxScore: 1,
      insight:
        "Vous prenez régulièrement des médicaments pour dormir. Il est utile de savoir que certains somnifères modifient la structure du sommeil, notamment en réduisant le temps passé en sommeil profond (NREM N3). Ce n'est pas un jugement sur leur usage, mais c'est un sujet qui mérite d'être abordé avec votre médecin.",
      recommendation:
        "Parlez à votre médecin de votre consommation de somnifères : il est le mieux placé pour évaluer ce qui est adapté à votre situation et vous orienter si besoin. En parallèle, travailler sur les habitudes du sommeil reste l'approche la plus durable car elle agit sur les causes plutôt que sur les symptômes.",
      action: 'Mentionnez votre consommation de somnifères à votre médecin lors de votre prochain rendez-vous.',
      actionWhy:
        "Certains somnifères (notamment les benzodiazépines et hypnotiques) modifient la structure du sommeil en réduisant le sommeil profond (NREM N3) et paradoxal (REM). En parler avec son médecin permet d'évaluer le rapport bénéfice-risque dans sa situation personnelle et d'explorer d'éventuelles alternatives.",
    },
    {
      questionId: 'qual-3',
      triggerMaxScore: 1,
      insight:
        "Vous avez souvent envie de dormir en journée, signe que vos nuits ne résorbent pas complètement la pression de sommeil accumulée. Une somnolence marquée peut aussi signaler des apnées du sommeil (pauses respiratoires nocturnes) non détectées.",
      recommendation:
        "En journée : les siestes courtes de 10 à 20 minutes entre 13h et 15h sont une aide réelle. Pas plus longues (risque d'inertie du sommeil au réveil), pas après 15h (perturbation de la nuit). Le matin, exposez-vous à la lumière naturelle dès le réveil, 10 minutes dehors suffisent à activer l'axe cortisol-éveil et à synchroniser votre horloge biologique.",
      action: 'Exposez-vous à la lumière naturelle dès le réveil (10 min dehors) et limitez les siestes à 20 min avant 15h.',
      actionWhy:
        "La lumière du matin active les cellules mélanopiques de la rétine, qui envoient un signal à l'horloge interne (noyau suprachiasmatique) pour libérer du cortisol (hormone de l'éveil) et stopper la mélatonine. Cette synchronisation améliore l'énergie diurne et l'endormissement du soir.",
    },
    {
      questionId: 'qual-4',
      triggerMaxScore: 1,
      insight:
        "Le manque de motivation et d'enthousiasme que vous ressentez est souvent confondu avec de la paresse ou de la dépression, mais c'est fréquemment un effet direct du manque de sommeil sur la dopamine (l'hormone de la motivation), dont la synthèse dépend du sommeil paradoxal (REM).",
      recommendation:
        "Traitez le sommeil comme une priorité non négociable, pas comme un luxe. Réservez une fenêtre de 7 à 8 heures dans votre agenda et tenez-vous-y. Une activité physique modérée en fin d'après-midi (marche, vélo) améliore à la fois la qualité du sommeil et l'énergie du lendemain grâce à la libération d'endorphines (hormones du bien-être).",
      action: 'Réservez une fenêtre de 7-8 heures de sommeil dans votre agenda et pratiquez une activité physique légère en fin d\'après-midi.',
      actionWhy:
        "Le sommeil paradoxal (REM) est la phase durant laquelle le cerveau restaure la sensibilité des récepteurs à la dopamine (hormone de la motivation) et décharge les émotions négatives. Sans REM suffisant, la motivation et l'humeur s'érodent progressivement sur plusieurs jours.",
    },
  ],
  references: [
    {
      authors: 'Morin CM, Vallières A, Guay B et al.',
      title: 'Cognitive behavioral therapy, singly and combined with medication, for persistent insomnia',
      journal: 'JAMA',
      year: 2009,
      doi: '10.1001/jama.2009.682',
      pmid: '19439733',
    },
    {
      authors: 'Kripke DF, Langer RD, Kline LE',
      title: "Hypnotics' association with mortality or cancer: a matched cohort study",
      journal: 'BMJ Open',
      year: 2012,
      doi: '10.1136/bmjopen-2012-000850',
      pmid: '22371848',
    },
  ],
}

// ══════════════════════════════════════════════════════
// HYGIÈNE DU SOMMEIL, Section 3 (Q14–Q23)
// ══════════════════════════════════════════════════════

const hygieneSommeilReport: SectionReport = {
  sectionId: 'hygiene-sommeil',
  context:
    "L'hygiène du sommeil regroupe les habitudes comportementales qui préparent, ou perturbent, l'endormissement. Des horaires irréguliers désynchronisent l'horloge interne (le rythme circadien, cycle naturel de 24 heures gouverné par le noyau suprachiasmatique du cerveau), retardant la production de mélatonine (l'hormone du sommeil). La lumière bleue des écrans supprime cette mélatonine jusqu'à 3 heures. La caféine bloque les récepteurs à l'adénosine (la molécule de fatigue) pendant 5 à 7 heures. L'alcool, faux ami du sommeil, fragmente la deuxième moitié de nuit en supprimant le sommeil paradoxal (REM).",
  strengthLabel: 'Vos habitudes du soir protègent votre sommeil',
  weaknessLabel: 'Des habitudes perturbent activement votre sommeil',
  scienceNote:
    "De bonnes habitudes du soir permettent à la mélatonine (hormone du sommeil) de se libérer au bon moment et à la température corporelle de baisser naturellement, les deux déclencheurs biologiques de l'endormissement.",
  recommendations: [
    {
      maxPct: 33,
      level: 'alerte',
      title: 'Habitudes très défavorables',
      text: "Vos habitudes du soir nuisent clairement à votre sommeil, c'est probablement la cause principale de vos difficultés. La bonne nouvelle : c'est entièrement dans votre contrôle. Deux ou trois changements ciblés peuvent transformer vos nuits en quelques semaines.",
    },
    {
      maxPct: 66,
      level: 'vigilance',
      title: 'Habitudes à revoir',
      text: "Plusieurs de vos habitudes perturbent activement votre sommeil. C'est la zone la plus facile à améliorer : chaque ajustement a un effet cumulatif et visible en 2 à 3 semaines.",
    },
    {
      maxPct: 90,
      level: 'bon',
      title: 'Bonnes habitudes, quelques points à affiner',
      text: 'Vos habitudes sont globalement bonnes avec quelques ajustements possibles. Chaque amélioration a un effet cumulatif sur la qualité de vos nuits.',
    },
    {
      maxPct: 100,
      level: 'excellent',
      title: 'Très bonnes habitudes',
      text: "Vos habitudes du soir sont solides, horaires réguliers, bonne hygiène de vie. C'est l'un des meilleurs investissements pour votre santé à long terme. Continuez.",
    },
  ],
  questionInsights: [
    {
      questionId: 'hyg-1',
      triggerMaxScore: 1,
      insight:
        "Vos horaires de coucher sont irréguliers. C'est l'une des causes les plus fréquentes de mauvais sommeil, votre horloge interne (rythme circadien) a besoin de régularité pour déclencher la mélatonine (hormone du sommeil) au bon moment.",
      recommendation:
        "Fixez une heure de coucher fixe à ±30 minutes, 7 jours sur 7, week-ends inclus. C'est LA mesure numéro un. Mettez une alarme 'heure du coucher' sur votre téléphone. Votre corps s'adaptera en 1 à 2 semaines en synchronisant la production de mélatonine avec cette heure.",
      action: 'Fixez une heure de coucher fixe à ±30 min, 7j/7, week-ends inclus.',
      actionWhy:
        "La régularité du coucher synchronise l'horloge interne (rythme circadien) sur un cycle stable. Cela permet à la mélatonine d'être libérée à heure prévisible, réduisant le temps d'endormissement et améliorant la qualité des premières heures de nuit.",
    },
    {
      questionId: 'hyg-2',
      triggerMaxScore: 1,
      insight:
        "Vous sortez du lit pour des activités non liées au sommeil quand vous n'arrivez pas à dormir. Cette habitude rompt l'association mentale lit-sommeil : votre cerveau associe progressivement le lit à l'éveil et à la frustration.",
      recommendation:
        "Si vous ne dormez pas en 20 minutes, quittez la chambre et faites une activité calme à la lumière douce (lire un livre physique, écouter de la musique douce) jusqu'à ressentir le sommeil. Revenez au lit seulement à ce moment. Ce reconditionnement est un pilier de la TCC-I (thérapie comportementale et cognitive pour l'insomnie).",
      action: 'Si vous ne dormez pas en 20 min, quittez la chambre et revenez seulement quand vous ressentez le sommeil.',
      actionWhy:
        "Le contrôle du stimulus (ou reconditionnement du lit) recréé l'association automatique lit-sommeil. En quelques nuits, le simple fait de s'allonger dans le lit déclenche une réponse somnolente réflexe, réduisant le temps d'endormissement.",
    },
    {
      questionId: 'hyg-3',
      triggerMaxScore: 1,
      insight:
        "Rester allongé plus de 30 minutes sans dormir renforce l'anxiété liée au coucher et fragilise l'association lit-sommeil. Plus on essaie de 's'obliger à dormir', plus le système nerveux sympathique (mode alerte) s'active.",
      recommendation:
        "Appliquez la règle des 20 minutes : si vous n'êtes pas endormi après 20 minutes, levez-vous. Ne regardez pas l'heure au réveil la nuit, cela active immédiatement le calcul cognitif ('il me reste X heures') qui empêche le retour au sommeil.",
      action: 'Retirez ou couvrez l\'horloge de votre chambre pour ne pas regarder l\'heure la nuit.',
      actionWhy:
        "Voir l'heure la nuit déclenche un calcul cognitif automatique ('il me reste X heures') qui active le cortex préfrontal (zone de raisonnement) et inhibe les structures cérébrales de l'endormissement. Supprimer ce stimulus supprime ce cercle vicieux.",
    },
    {
      questionId: 'hyg-4',
      triggerMaxScore: 1,
      insight:
        "Vous consommez de la caféine dans les heures précédant le coucher. La caféine bloque les récepteurs à l'adénosine (la molécule de fatigue qui s'accumule pendant la journée) pendant 5 à 7 heures, un café à 16h a encore la moitié de ses effets à 22h.",
      recommendation:
        "Dernière caféine avant 13h-14h. N'oubliez pas les sources cachées : thé noir, chocolat, certains sodas. Remplacez par des tisanes en soirée, camomille et passiflore ont une efficacité documentée pour calmer le système nerveux avant le sommeil.",
      action: 'Stoppez toute caféine après 13h (café, thé noir, chocolat, sodas).',
      actionWhy:
        "La caféine se lie aux récepteurs à l'adénosine (molécule de fatigue) sans les activer, bloquant le signal naturel d'endormissement. Sa demi-vie dans le sang est de 5 à 7 heures : un café à 15h maintient la moitié de son effet à 22h, retardant l'endormissement et réduisant le sommeil profond.",
    },
    {
      questionId: 'hyg-5',
      triggerMaxScore: 1,
      insight:
        "Vous vous levez à des heures très différentes d'un jour à l'autre. L'heure de réveil est encore plus importante que l'heure de coucher pour réguler le rythme circadien (horloge interne), car elle détermine à quelle heure s'accumule la pression de sommeil.",
      recommendation:
        "Même heure de réveil tous les jours, week-end inclus. Le grasse matinée du dimanche crée un décalage horaire interne ('social jetlag') qui désynchronise toute la semaine suivante. Si vous êtes fatigué, préférez une sieste courte de 20 minutes plutôt que de vous lever en retard.",
      action: 'Levez-vous à la même heure tous les jours (±30 min), week-end inclus.',
      actionWhy:
        "L'heure de réveil fixe est le signal le plus puissant pour l'horloge interne (noyau suprachiasmatique). Elle détermine l'heure à laquelle commence l'accumulation d'adénosine (pression de sommeil), calibrant naturellement l'heure d'endormissement le soir.",
    },
    {
      questionId: 'hyg-6',
      triggerMaxScore: 1,
      insight:
        "Des siestes de plus de 30 minutes plongent dans le sommeil profond (NREM N3) et provoquent une inertie du sommeil au réveil (la sensation de 'gueule de bois' post-sieste). Elles réduisent aussi la pression de sommeil du soir, retardant l'endormissement.",
      recommendation:
        "Limitez vos siestes à 10-20 minutes maximum, entre 13h et 15h. Astuce validée par la recherche : buvez un café juste avant la sieste ('power nap au café'). La caféine met 20 minutes à agir, au réveil, elle entre en action et augmente l'énergie sans perturber la nuit.",
      action: 'Limitez vos siestes à 20 min maximum, avant 15h.',
      actionWhy:
        "Une sieste de 20 minutes reste dans le sommeil léger (NREM N1-N2), évitant l'inertie du sommeil. Elle résout une partie de la dette de sommeil sans amputer la pression de sommeil nocturne, préservant l'endormissement du soir.",
    },
    {
      questionId: 'hyg-7',
      triggerMaxScore: 1,
      insight:
        "Vous utilisez des appareils électroniques au lit. La lumière bleue des écrans supprime la mélatonine (l'hormone du sommeil) et signale au cerveau qu'il fait encore jour, retardant l'endormissement et réduisant le sommeil profond.",
      recommendation:
        "Pas d'écran dans l'heure qui précède le coucher, idéalement les 30 dernières minutes au minimum. Si c'est difficile, activez le mode nuit sur tous vos appareils. Remplacez le téléphone au lit par un livre physique ou un podcast audio. Idéalement, rangez le téléphone hors de la chambre.",
      action: 'Stoppez les écrans 30 min avant le coucher et rangez votre téléphone hors de la chambre.',
      actionWhy:
        "La lumière bleue des écrans (longueur d'onde 480 nm) inhibe directement la production de mélatonine par la glande pinéale via les cellules mélanopiques de la rétine. Même 30 minutes d'exposition retardent la sécrétion de mélatonine d'1 à 1,5 heure, repoussant l'endormissement.",
    },
    {
      questionId: 'hyg-8',
      triggerMaxScore: 1,
      insight:
        "Un repas copieux peu avant de dormir force le système digestif à travailler alors que le corps devrait se mettre en veille. Cela élève la température corporelle centrale, l'inverse du signal d'endormissement, et peut provoquer des reflux.",
      recommendation:
        "Dînez léger, au moins 2 à 3 heures avant de dormir. Si vous avez faim, privilégiez des aliments qui favorisent le sommeil : banane, noix, cerises. Ces aliments contiennent du tryptophane et de la mélatonine, des précurseurs naturels du sommeil.",
      action: 'Dînez léger au moins 2h30 avant votre coucher.',
      actionWhy:
        "La digestion génère de la chaleur métabolique qui maintient la température corporelle haute. Or, l'endormissement requiert une baisse de 0,5 à 1°C de la température centrale. Un dîner tardif retarde cette baisse et fragmente les premières heures de sommeil.",
    },
    {
      questionId: 'hyg-9',
      triggerMaxScore: 1,
      insight:
        "Un exercice intense dans les 2 heures précédant le coucher élève la température corporelle, la fréquence cardiaque et le cortisol (hormone du stress), l'opposé des conditions requises pour l'endormissement.",
      recommendation:
        "Privilégiez l'exercice intense le matin ou en fin d'après-midi. Le soir, optez pour des activités douces : yoga, étirements, marche légère. Ces activités activent le système nerveux parasympathique (mode calme) et préparent le corps à dormir.",
      action: 'Pratiquez l\'exercice intense avant 19h et optez pour des étirements ou du yoga le soir.',
      actionWhy:
        "L'exercice intense libère de l'adrénaline et élève la température corporelle centrale pendant 4 à 6 heures. Ces deux effets activent le système nerveux sympathique (mode alerte) et retardent l'abaissement thermique nécessaire à l'endormissement.",
    },
    {
      questionId: 'hyg-10',
      triggerMaxScore: 1,
      insight:
        "L'alcool est un faux ami du sommeil : il facilite l'endormissement mais perturbe profondément la deuxième moitié de nuit, supprime le sommeil paradoxal (REM, indispensable à la régulation émotionnelle) et provoque des réveils tôt le matin.",
      recommendation:
        "Évitez l'alcool dans les 4 heures précédant le coucher. Si vous buvez, alternez un verre d'alcool avec un verre d'eau. L'alcool est l'une des premières causes de sommeil non réparateur chez les adultes de 25 à 45 ans.",
      action: 'Évitez tout alcool dans les 4 heures précédant le coucher.',
      actionWhy:
        "L'alcool est métabolisé en acétaldéhyde (molécule activatrice) qui fragmente la deuxième moitié de nuit et supprime le sommeil paradoxal (REM). Même 2 verres en soirée réduisent le REM de 24 %, altérant la régulation émotionnelle et la consolidation de la mémoire.",
    },
  ],
  references: [
    {
      authors: 'Irish LA, Kline CE, Gunn HE et al.',
      title: 'The role of sleep hygiene in promoting public health: A review of empirical evidence',
      journal: 'Sleep Med Rev',
      year: 2015,
      doi: '10.1016/j.smrv.2014.10.001',
      pmid: '25454674',
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
  ],
}

// ══════════════════════════════════════════════════════
// PROFIL COMPLÉMENTAIRE, Section 4 (Q24–Q33)
// ══════════════════════════════════════════════════════

const profilReport: SectionReport = {
  sectionId: 'profil-complementaire',
  context:
    "Certains signaux spécifiques, cerveau qui ne s'éteint pas au coucher, ronflements forts, jambes agitées, fatigue persistante au réveil, correspondent à des profils de troubles du sommeil distincts. L'hyperactivation cognitive (pensées qui tournent en boucle) est le mécanisme central de l'insomnie chronique. Les apnées du sommeil (pauses respiratoires nocturnes qui génèrent des micro-éveils) touchent 1 adulte sur 10 et sont diagnostiquées dans seulement 20 % des cas. Le syndrome des jambes sans repos est souvent lié à un déficit en fer (ferritine basse).",
  strengthLabel: 'Aucun signal spécifique de trouble du sommeil identifié',
  weaknessLabel: 'Signaux spécifiques à explorer',
  scienceNote:
    "L'absence de signaux spécifiques, pensées envahissantes au coucher, ronflement fort, jambes agitées, fatigue au réveil, indique un profil de sommeil sans trouble caractérisé. C'est rassurant.",
  recommendations: [
    {
      maxPct: 33,
      level: 'alerte',
      title: 'Signaux importants',
      text: "Votre profil révèle plusieurs signaux qui indiquent probablement un ou plusieurs troubles du sommeil. Ces troubles se traitent bien quand ils sont identifiés. Une consultation avec votre médecin est fortement recommandée.",
    },
    {
      maxPct: 66,
      level: 'vigilance',
      title: 'Signaux à explorer',
      text: "Plusieurs signaux méritent attention. Un médecin pourra évaluer si un bilan spécialisé du sommeil est utile dans votre cas.",
    },
    {
      maxPct: 90,
      level: 'bon',
      title: 'Quelques signaux légers',
      text: "Quelques signaux mineurs sont présents. Surveillez leur évolution et mentionnez-les à votre médecin lors de votre prochain bilan de santé.",
    },
    {
      maxPct: 100,
      level: 'excellent',
      title: 'Aucun signal d\'alerte',
      text: "Votre profil ne révèle pas de signaux particuliers. Vos nuits ne semblent pas perturbées par des troubles spécifiques. C'est rassurant.",
    },
  ],
  questionInsights: [
    {
      questionId: 'prof-1',
      triggerMaxScore: 1,
      insight:
        "Votre cerveau reste en mode actif au coucher, pensées qui surgissent, préoccupations qui tournent. C'est le mécanisme le plus fréquent derrière l'insomnie chronique : une hyperactivation cognitive (l'esprit continue à planifier et à analyser alors qu'il devrait s'éteindre).",
      recommendation:
        "Une technique simple et prouvée : prenez 20 minutes chaque soir, avant d'être au lit, pour écrire toutes vos pensées et tâches en suspens dans un carnet. Poser sur papier les préoccupations 'libère' le cerveau de l'obligation de les retenir. Complétez avec 10 minutes de relaxation musculaire progressive (contracter puis relâcher chaque groupe musculaire des pieds jusqu'au visage).",
      action: 'Tenez un carnet "vide-cerveau" chaque soir avant de vous coucher : notez toutes vos pensées et tâches en suspens.',
      actionWhy:
        "Écrire les préoccupations avant de dormir réduit l'activité du cortex préfrontal (zone de planification), permettant aux structures cérébrales de l'endormissement de prendre le relais. Des études montrent que ce rituel réduit le temps d'endormissement de 15 minutes en moyenne.",
    },
    {
      questionId: 'prof-2',
      triggerMaxScore: 1,
      insight:
        "Les pensées qui ruminent au coucher activent des zones cérébrales incompatibles avec l'endormissement. Plus on essaie de s'obliger à dormir, plus le système d'alerte s'active, un paradoxe bien documenté en neuroscience du sommeil.",
      recommendation:
        "Prévoyez 15 minutes en début de soirée, pas au lit, pour noter vos soucis et vous poser la question : 'qu'est-ce que je peux faire concrètement là-dessus ?'. Ce rituel de 'temps des soucis structuré' empêche les ruminations de ressurgir au coucher. Au lit, pratiquez un scan corporel : balayez mentalement votre corps de la tête aux pieds, en relâchant chaque zone musculaire.",
      action: 'Faites 15 min de "temps des soucis structuré" en soirée : notez vos préoccupations et une action concrète pour chacune.',
      actionWhy:
        "Le temps des soucis structuré 'compartimente' les préoccupations dans une plage dédiée, signalant au cerveau qu'elles ont été traitées. Cela réduit l'intrusion des pensées anxieuses au moment de l'endormissement, une technique validée par la TCC-I.",
    },
    {
      questionId: 'prof-3',
      triggerMaxScore: 1,
      insight:
        "Palpitations ou chaleur interne au lit : ce sont des signes que votre corps est encore en état d'hyperactivation physiologique (le système nerveux sympathique, mode alerte, est toujours actif) alors qu'il devrait basculer en mode repos.",
      recommendation:
        "Juste avant de dormir, pratiquez une respiration cohérente : inspirez 5 secondes, expirez 5 secondes, pendant 5 minutes. C'est l'une des techniques les plus efficaces pour activer le nerf vague et calmer le système nerveux. Autre levier : un bain ou une douche chaude 1h30 avant le coucher, la baisse de température qui suit aide le corps à basculer en mode sommeil.",
      action: 'Pratiquez 5 min de respiration cohérente au coucher (inspirez 5s, expirez 5s).',
      actionWhy:
        "La respiration cohérente (5-5) active le nerf vague, qui stimule le système nerveux parasympathique (mode calme) et réduit la fréquence cardiaque. Cela fait baisser le cortisol (hormone du stress) et prépare les conditions physiologiques de l'endormissement.",
    },
    {
      questionId: 'prof-4',
      triggerMaxScore: 1,
      insight:
        "Vous dormez nettement mieux hors de chez vous, signal que votre environnement domestique ou des facteurs de stress associés à votre domicile perturbent votre sommeil.",
      recommendation:
        "Transformez votre chambre en véritable 'cave à sommeil' : obscurité totale (masque si nécessaire), fraîcheur (16-19°C), silence ou bruit blanc. Réservez la chambre exclusivement au sommeil et à l'intimité, pas d'écran, pas de travail. Ce reconditionnement environnemental est un pilier de l'hygiène du sommeil.",
      action: 'Transformez votre chambre en environnement optimal : obscurité totale, 16-19°C, silence ou bruit blanc.',
      actionWhy:
        "L'association mentale chambre-sommeil se crée par conditionnement. En réservant la chambre exclusivement au sommeil et en optimisant l'environnement (température, lumière, bruit), le simple fait d'entrer dans la pièce déclenche une réponse somnolente réflexe.",
    },
    {
      questionId: 'prof-5',
      triggerMaxScore: 1,
      insight:
        "Se réveiller plus fatigué qu'au coucher indique que votre sommeil n'est pas réparateur, probablement dû à des micro-éveils que vous ne percevez pas, ou à un temps insuffisant en sommeil profond (NREM N3).",
      recommendation:
        "Les apnées du sommeil (pauses respiratoires nocturnes) sont une cause fréquente de sommeil non réparateur. Si ce symptôme est régulier, parlez-en à votre médecin. Optimisez également votre environnement : obscurité totale, chambre fraîche (16-19°C). Ces ajustements peuvent réduire les micro-éveils nocturnes.",
      action: 'Consultez votre médecin pour évaluer la possibilité d\'apnées du sommeil si ce symptôme est régulier.',
      actionWhy:
        "Les apnées du sommeil génèrent des micro-éveils répétés (souvent imperceptibles) qui fragmentent le sommeil profond. Résultat : le cerveau n'atteint pas les phases NREM N3 nécessaires à la récupération physique et à l'élimination des déchets cérébraux, d'où la fatigue au réveil malgré une durée de sommeil suffisante.",
    },
    {
      questionId: 'prof-6',
      triggerMaxScore: 1,
      insight:
        "Ronfler fortement et régulièrement, surtout si vos proches ont remarqué des pauses dans votre respiration, est le principal signe clinique des apnées du sommeil, un trouble qui fragmente le sommeil en générant des micro-éveils à chaque pause.",
      recommendation:
        "Consultez votre médecin : une polygraphie ventilatoire (enregistrement respiratoire à domicile pendant le sommeil) confirme ou exclut le diagnostic. Si des apnées sont confirmées, un appareil de PPC (pression positive continue, un masque léger porté la nuit) règle le problème très efficacement et transforme la qualité du sommeil.",
      action: 'Consultez votre médecin pour une polygraphie ventilatoire (enregistrement de la respiration nocturne à domicile).',
      actionWhy:
        "Les apnées du sommeil non traitées génèrent des micro-éveils toutes les 1 à 2 minutes, empêchant complètement le sommeil profond et le REM. Traitées par PPC (masque ventilatoire), les patients récupèrent un sommeil profond dès la première nuit.",
    },
    {
      questionId: 'prof-7',
      triggerMaxScore: 1,
      insight:
        "La bouche sèche au réveil et les maux de tête matinaux sont deux marqueurs fréquents des apnées du sommeil, la respiration buccale nocturne (compensatoire) sèche la muqueuse, et les micro-éveils répétés créent des céphalées de tension matinales.",
      recommendation:
        "Combinez ces symptômes avec ceux des questions sur le ronflement : s'ils sont présents ensemble, consultez votre médecin pour évaluer un trouble respiratoire du sommeil. En attendant, maintenez une bonne hydratation en soirée et dormez sur le côté.",
      action: 'Notez la fréquence des maux de tête matinaux et de la bouche sèche, et signalez-les à votre médecin.',
      actionWhy:
        "Bouche sèche + maux de tête matinaux + ronflement forment une triade clinique qui oriente vers les apnées du sommeil. Un diagnostic précoce permet une prise en charge efficace qui supprime ces symptômes dès les premières nuits de traitement.",
    },
    {
      questionId: 'prof-8',
      triggerMaxScore: 1,
      insight:
        "Des envies irrépressibles de bouger les jambes au repos le soir, souvent décrites comme des fourmillements ou une tension interne, correspondent au syndrome des jambes sans repos (SJSR), un trouble qui touche 5 à 10 % de la population et est souvent lié à un déficit en fer.",
      recommendation:
        "Si vous pensez reconnaître ce syndrome, parlez-en à votre médecin : un bilan peut identifier une cause traitable, comme un déficit en fer souvent impliqué dans ce trouble. En attendant, limiter la caféine et l'alcool le soir, pratiquer une activité physique modérée en journée et faire des étirements des jambes avant le coucher peut aider.",
      action: 'Parlez de ces sensations à votre médecin pour explorer une éventuelle cause traitable.',
      actionWhy:
        "Le syndrome des jambes sans repos est souvent lié à un déficit en fer dans le cerveau, qui perturbe le système dopaminergique (régulation du mouvement). Un bilan avec votre médecin permet d'explorer cette piste et d'envisager un traitement adapté si nécessaire.",
    },
    {
      questionId: 'prof-9',
      triggerMaxScore: 1,
      insight:
        "Des réveils nocturnes fréquents sans raison apparente évoquent une fragmentation du sommeil par des micro-éveils (souvent imperceptibles mais mesurables en polysomnographie), liée à l'environnement, au stress ou à des troubles respiratoires.",
      recommendation:
        "Évaluez systématiquement votre environnement : température de chambre (doit être fraîche, 16-19°C), sources de lumière (LED des chargeurs, réverbères), bruit ambiant. Si l'environnement est optimal, discutez avec votre médecin de la possibilité d'un trouble respiratoire du sommeil sous-jacent.",
      action: 'Évaluez et optimisez votre environnement nocturne : température, obscurité totale, isolation phonique.',
      actionWhy:
        "Les micro-éveils nocturnes sont déclenchés par des stimulus environnementaux que le cerveau traite même pendant le sommeil : bruit, lumière, variation de température. Supprimer ces stimulus supprime les micro-éveils correspondants, augmentant le temps en sommeil profond.",
    },
    {
      questionId: 'prof-10',
      triggerMaxScore: 1,
      insight:
        "Les douleurs chroniques (dos, articulations, digestives) et le mauvais sommeil s'amplifient mutuellement : la douleur fragmente le sommeil profond, et le manque de sommeil profond abaisse le seuil de douleur (hyperalgésie), rendant le corps plus sensible le lendemain.",
      recommendation:
        "Agissez sur les deux fronts : pour la nuit, étirements doux 10 minutes avant le coucher, literie adaptée, chaleur locale si nécessaire (bouillotte). Pour la douleur : la méditation de pleine conscience (10 à 20 minutes guidées) réduit significativement la perception de la douleur chronique, son efficacité a été mesurée dans plusieurs études randomisées.",
      action: 'Pratiquez 10 min de méditation de pleine conscience guidée avant le coucher pour réduire la perception des douleurs.',
      actionWhy:
        "La méditation de pleine conscience réduit l'activité de l'amygdale (le centre de l'alarme émotionnelle) et module les voies descendantes de la douleur (le système opioïde endogène). Elle réduit la composante émotionnelle de la douleur chronique, rendant le sommeil plus accessible malgré les inconforts physiques.",
    },
  ],
  references: [
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

/** Lookup helper */
export function getSectionReport(sectionId: string): SectionReport | undefined {
  return allSectionReports.find((r) => r.sectionId === sectionId)
}

/**
 * Gets the relevant recommendation for a given score percentage
 */
export function getSectionRecommendation(report: SectionReport, pct: number) {
  // Recommendations are sorted by maxPct ascending, return first match
  for (const rec of report.recommendations) {
    if (pct <= rec.maxPct) return rec
  }
  return report.recommendations[report.recommendations.length - 1]
}

/**
 * Gets all triggered question-level insights for a section
 */
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
// GLOBAL REPORT & SYNTHESIS
// ══════════════════════════════════════════════════════

export interface GlobalInsight {
  title: string
  description: string
  reference: string
}

export const globalKeyInsights: GlobalInsight[] = [
  {
    title: 'Dormir, c\'est nettoyer son cerveau',
    description:
      "Pendant le sommeil profond, le système glymphatique (le système de nettoyage du cerveau, découvert en 2013) élimine les déchets métaboliques accumulés dans la journée, dont les protéines bêta-amyloïdes liées à la maladie d'Alzheimer. Ce nettoyage est 10 fois plus efficace pendant le sommeil qu'à l'éveil. Dormir moins de 7 heures par nuit de façon chronique augmente la mortalité toutes causes confondues de 12 %.",
    reference: 'Xie et al., 2013, Science, Cappuccio et al., 2010, Sleep',
  },
  {
    title: 'L\'heure compte autant que la durée',
    description:
      "Votre corps fonctionne sur une horloge biologique interne de 24 heures (le rythme circadien, gouverné par le noyau suprachiasmatique) qui régule hormones, métabolisme et immunité. Plus de 40 % de vos gènes s'activent ou se désactivent selon ce rythme. La régularité des horaires de sommeil, plus que la durée elle-même, est un des prédicteurs les plus forts de longévité.",
    reference: 'Huang et al., 2022, Sleep',
  },
  {
    title: 'Une mauvaise nuit affaiblit vos défenses en 24h',
    description:
      "Une seule nuit de sommeil perturbé suffit à déclencher une réponse inflammatoire mesurable et à réduire de 70 % l'activité des cellules NK (natural killers, les cellules immunitaires chargées de détecter les cellules anormales). Le sommeil est le mécanisme de réparation le plus puissant dont dispose l'organisme, plus efficace que n'importe quel supplément.",
    reference: 'Irwin MR, 2019, Neuropsychopharmacology',
  },
]

// Glossaire des termes scientifiques pour le rapport sommeil
export const sommeilGlossary: { term: string; definition: string }[] = [
  { term: 'Rythme circadien', definition: "Horloge biologique interne de 24 heures qui régule le cycle veille-sommeil, les hormones et le métabolisme." },
  { term: 'Mélatonine', definition: "Hormone produite par la glande pinéale au moment du coucher, signalant à l'organisme qu'il est l'heure de dormir." },
  { term: 'Adénosine', definition: "Molécule qui s'accumule dans le cerveau pendant l'éveil et provoque la sensation de fatigue. La caféine bloque ses récepteurs." },
  { term: 'NREM N3 (sommeil profond)', definition: "Phase de sommeil la plus réparatrice physiquement, durant laquelle se produit le nettoyage cérébral et la réparation tissulaire." },
  { term: 'Sommeil paradoxal (REM)', definition: "Phase de sommeil associée aux rêves, indispensable à la régulation émotionnelle et à la consolidation de la mémoire." },
  { term: 'Système glymphatique', definition: "Réseau de nettoyage du cerveau actif pendant le sommeil profond, qui élimine les déchets cellulaires dont les protéines liées à Alzheimer." },
  { term: 'Hyperactivation cognitive', definition: "État où l'esprit reste actif (pensées, planification, ruminations) au coucher, empêchant l'endormissement." },
  { term: 'TCC-I', definition: "Thérapie comportementale et cognitive pour l'insomnie, traitement de première intention prouvé plus efficace que les somnifères à long terme." },
  { term: 'Apnées du sommeil', definition: "Pauses involontaires dans la respiration nocturne qui génèrent des micro-éveils et fragmentent le sommeil profond." },
  { term: 'Syndrome des jambes sans repos (SJSR)', definition: "Trouble neurologique causant des envies irrépressibles de bouger les jambes au repos le soir, souvent lié à un déficit en fer." },
  { term: 'Cortisol', definition: "Hormone du stress libérée par les glandes surrénales. Naturellement haute le matin (éveil) et basse le soir (sommeil)." },
  { term: 'Pression de sommeil', definition: "Besoin croissant de dormir qui s'accumule avec la durée d'éveil, porté par l'adénosine. Resetée à zéro après une nuit complète." },
  { term: 'Inertie du sommeil', definition: "Sensation de groggy au réveil, plus forte après des siestes longues ou des réveils en plein sommeil profond." },
  { term: 'Nerf vague', definition: "Nerf principal du système nerveux parasympathique (mode calme), activé par la respiration lente et le froid." },
]

export interface StrengthItem { sectionId: string; title: string; pct: number; praise: string; science: string; scienceNote: string; reference: string }
export interface WeaknessItem { sectionId: string; title: string; pct: number; level: string; concern: string; science: string; reference: string; triggeredInsights: { questionId: string; insight: string; recommendation: string; action?: string }[] }
export interface ActionPhase { phase: number; phaseTitle: string; timeframe: string; actions: { action: string; why: string; sectionId: string }[] }

/**
 * Génère un rapport final enrichi pour le bilan sommeil
 */
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
        title: report.strengthLabel || r.title,
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
        triggeredInsights: triggered.map(t => ({ questionId: t.questionId, insight: t.insight, recommendation: t.recommendation, action: t.action })),
      })
    }
  }

  // Sort by urgency (alerte first), then by pct ascending at same level
  const levelOrder: Record<string, number> = { alerte: 0, vigilance: 1, bon: 2, excellent: 3 }
  weaknesses.sort((a, b) => {
    const lo = levelOrder[a.level] - levelOrder[b.level]
    if (lo !== 0) return lo
    return a.pct - b.pct
  })

  // Build action plan from triggered insights
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

  const actionPlan: ActionPhase[] = []
  if (allActions.length > 0) {
    actionPlan.push({ phase: 1, phaseTitle: 'Vos priorités', timeframe: 'Semaines 1-4', actions: allActions.slice(0, 4) })
  } else {
    // Fallback: consolidate lowest-scoring strengths
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
          { action: 'Maintenez une heure de coucher et de lever régulière à ±30 min, 7j/7.', why: 'La régularité est le premier facteur de qualité du sommeil, elle synchronise l\'horloge interne et stabilise la production de mélatonine.', sectionId: '' },
          { action: 'Continuez à limiter les écrans 30 min avant le coucher.', why: 'La lumière bleue supprime la mélatonine et retarde l\'endormissement jusqu\'à 1,5 heure.', sectionId: '' },
        ],
      })
    }
  }

  const glossarySection = sommeilGlossary.map(g => ({ term: g.term, definition: g.definition }))

  return {
    strengths,
    weaknesses,
    actionPlan,
    globalInsights: globalKeyInsights,
    sectionReports,
    glossary: glossarySection,
  }
}

/**
 * Generates a prioritized action plan (top 5 actions) based on lowest scoring sections
 */
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
