// ──────────────────────────────────────────────────────
// Bilan Sommeil — Scientific Report Engine
// Basé sur le PSQI, le SHI et la littérature scientifique
// ──────────────────────────────────────────────────────

export interface Reference {
  authors: string
  title: string
  journal: string
  year: number
  doi?: string
  pmid?: string
}

export interface QuestionInsight {
  questionId: string
  threshold: number
  insight: string
  recommendation: string
}

export interface SectionRecommendation {
  minPct: number
  level: string
  title: string
  text: string
}

export interface SectionReport {
  sectionId: string
  context: string
  recommendations: SectionRecommendation[]
  insights: QuestionInsight[]
  references: Reference[]
}

// ══════════════════════════════════════════════════════
// Troubles du sommeil
// ══════════════════════════════════════════════════════
const troublesSommeilReport: SectionReport = {
  sectionId: 'troubles-sommeil',
  context:
    'Les difficultés à dormir — mal à s\'endormir, réveils nocturnes, respiration perturbée — touchent 1 adulte sur 3. Ce n\'est pas anodin : des nuits régulièrement perturbées augmentent significativement le risque de maladies cardiaques, de diabète et de baisse des défenses immunitaires. La bonne nouvelle, c\'est que la plupart de ces troubles répondent très bien à des changements concrets du quotidien.',
  recommendations: [
    { minPct: 80, level: 'excellent', title: 'Nuits tranquilles', text: 'Vos nuits sont peu perturbées — c\'est un vrai atout pour votre santé. Un sommeil non fragmenté permet à votre corps de traverser les différentes phases de récupération : mémoire, réparation musculaire, défenses immunitaires. Continuez ainsi.' },
    { minPct: 60, level: 'bon', title: 'Quelques perturbations', text: 'Quelques éveils ou inconforts nocturnes existent, mais ils restent limités. Essayez d\'identifier si un facteur revient régulièrement (heure de réveil, température, bruit) pour l\'éliminer facilement.' },
    { minPct: 40, level: 'moyen', title: 'Nuits souvent perturbées', text: 'Vos nuits sont régulièrement interrompues, ce qui empêche votre corps d\'atteindre les phases de récupération profondes. Sur le long terme, cela se ressent : fatigue, humeur, immunité, métabolisme. Plusieurs pistes concrètes existent pour améliorer ça.' },
    { minPct: 0, level: 'faible', title: 'Troubles importants', text: 'Vos nuits sont très perturbées et cela mérite une attention sérieuse. Un sommeil très fragmenté sur la durée affecte la santé globale de façon mesurable. Un rendez-vous avec votre médecin ou un spécialiste du sommeil est conseillé.' },
  ],
  insights: [
    { questionId: 'som-1', threshold: 1, insight: 'Vous mettez souvent plus de 30 minutes à vous endormir. Cela peut indiquer que votre cerveau reste en mode «&nbsp;actif&nbsp;» alors qu\'il devrait se mettre en veille.', recommendation: 'Une technique simple et très efficace : ne vous couchez que quand vous avez vraiment sommeil (paupières lourdes, bâillements), et levez-vous à la même heure chaque matin. Sans exception, même le week-end. En 2 à 3 semaines, votre corps retrouve son rythme naturel. Cette approche, appelée restriction du sommeil, est prouvée plus efficace que les somnifères sur le long terme.' },
    { questionId: 'som-2', threshold: 1, insight: 'Vous vous réveillez souvent la nuit. Ces éveils répétés empêchent votre corps d\'atteindre les phases les plus réparatrices du sommeil — celles où la mémoire se consolide et les tissus se régénèrent.', recommendation: 'Vérifiez d\'abord votre environnement : votre chambre doit être fraîche (entre 16 et 19°C) et dans l\'obscurité totale — y compris les petites LED de chargeurs ou box. Si vous vous réveillez et n\'arrivez pas à vous rendormir, essayez une respiration lente et rythmée : inspirez 5 secondes, expirez 5 secondes pendant 5 minutes. Cela calme le système nerveux et facilite le retour au sommeil.' },
    { questionId: 'som-4', threshold: 1, insight: 'Des difficultés à respirer la nuit peuvent signaler des apnées du sommeil — c\'est-à-dire des petites pauses involontaires dans la respiration qui réveillent brièvement le cerveau, souvent sans que vous vous en souveniez.', recommendation: 'Ce trouble est très courant (1 adulte sur 10) et très sous-diagnostiqué. Parlez-en à votre médecin qui pourra prescrire un enregistrement de votre respiration durant le sommeil. En attendant, dormez sur le côté plutôt que sur le dos, et évitez l\'alcool le soir — deux mesures simples qui réduisent les apnées.' },
    { questionId: 'som-5', threshold: 1, insight: 'Ronfler fréquemment est souvent le signe que la respiration est partiellement bloquée pendant la nuit. Ce n\'est pas qu\'un désagrément sonore — cela peut indiquer des apnées du sommeil.', recommendation: 'Des solutions immédiates peuvent aider : bandes nasales, oreiller légèrement surélevé, ou des exercices pour renforcer les muscles de la gorge (comme chanter ou articuler des voyelles à voix haute 10 min par jour — l\'efficacité de ces exercices est prouvée par des études). Et parlez-en à votre médecin si le ronflement est fort ou quotidien.' },
    { questionId: 'som-8', threshold: 1, insight: 'Des cauchemars fréquents perturbent la phase de sommeil où on rêve (le sommeil paradoxal), qui est essentielle pour la régulation émotionnelle. Stress, anxiété ou certains médicaments peuvent en être la cause.', recommendation: 'Une technique validée par la recherche : prenez 10 minutes avant de dormir pour réécrire le scénario du cauchemar en lui donnant une fin différente, plus positive. Faites-le sur papier. Répétez 3 à 4 jours de suite. Cela «&nbsp;reprogramme&nbsp;» progressivement ce que le cerveau rejoue la nuit. Résultats visibles en 2 à 4 semaines.' },
    { questionId: 'som-9', threshold: 1, insight: 'Les douleurs la nuit et le mauvais sommeil se nourrissent mutuellement : la douleur empêche le sommeil profond, et le manque de sommeil profond rend le corps encore plus sensible à la douleur le lendemain.', recommendation: 'Commencez par des étirements doux de 10 minutes avant le coucher pour relâcher les tensions musculaires. Un matelas trop vieux (plus de 8 ans) ou un oreiller inadapté peut aussi amplifier les douleurs — c\'est un investissement qui compte. Si les douleurs persistent, consultez un kinésithérapeute.' },
  ],
  references: [
    { authors: 'Buysse DJ, Reynolds CF, Monk TH et al.', title: 'The Pittsburgh Sleep Quality Index: a new instrument for psychiatric practice and research', journal: 'Psychiatry Res', year: 1989, doi: '10.1016/0165-1781(89)90047-4', pmid: '2748771' },
    { authors: 'Cappuccio FP, D\'Elia L, Strazzullo P, Miller MA', title: 'Sleep duration and all-cause mortality: a systematic review and meta-analysis of prospective studies', journal: 'Sleep', year: 2010, doi: '10.1093/sleep/33.5.585', pmid: '20469800' },
    { authors: 'Walker M', title: 'Why We Sleep: Unlocking the Power of Sleep and Dreams', journal: 'Scribner', year: 2017 },
  ],
}

// ══════════════════════════════════════════════════════
// Qualité & Impact diurne
// ══════════════════════════════════════════════════════
const qualiteImpactReport: SectionReport = {
  sectionId: 'qualite-impact',
  context:
    'La façon dont vous vous sentez pendant la journée est un reflet direct de la qualité de vos nuits. Avoir envie de dormir en journée, se sentir peu motivé ou avoir du mal à se concentrer sont des signaux que le sommeil ne remplit pas complètement son rôle réparateur. Ces symptômes ont un impact réel sur la sécurité (conduire fatigué multiplie le risque d\'accident), sur les performances et sur la santé à long terme.',
  recommendations: [
    { minPct: 80, level: 'excellent', title: 'Journées bien rechargées', text: 'Votre sommeil vous recharge efficacement. Vous vous levez avec de l\'énergie et vos journées ne sont pas plombées par la fatigue. C\'est un signe que vos nuits font bien leur travail de récupération.' },
    { minPct: 60, level: 'bon', title: 'Quelques coups de mou', text: 'Il vous arrive de ressentir de la fatigue en journée, mais c\'est gérable. Travailler sur la régularité de vos horaires de coucher et de lever aura un impact rapide sur votre énergie quotidienne.' },
    { minPct: 40, level: 'moyen', title: 'Fatigue qui s\'accumule', text: 'Votre sommeil affecte clairement vos journées — manque d\'énergie, difficultés à vous concentrer, motivation en berne. Ce n\'est pas une question de volonté : c\'est votre corps qui ne récupère pas suffisamment la nuit. Des ajustements ciblés peuvent changer ça.' },
    { minPct: 0, level: 'faible', title: 'Impact sévère sur le quotidien', text: 'Votre vie quotidienne est fortement affectée par votre manque de sommeil. Cela touche l\'humeur, la concentration, les défenses immunitaires et le poids. Ce n\'est pas une fatalité — mais cela mérite une vraie prise en charge.' },
  ],
  insights: [
    { questionId: 'qual-1', threshold: 1, insight: 'Vous percevez votre sommeil comme de mauvaise qualité. Ce sentiment crée lui-même une forme d\'anxiété face au coucher, qui rend le sommeil encore plus difficile — un vrai cercle vicieux.', recommendation: 'Une approche sans médicament appelée thérapie comportementale pour l\'insomnie (TCI) s\'attaque directement à ce cercle vicieux. Elle travaille sur les habitudes et les pensées autour du sommeil, et donne des résultats durables en 4 à 6 séances. Les médecins la recommandent en premier recours avant les somnifères. Renseignez-vous auprès de votre médecin.' },
    { questionId: 'qual-2', threshold: 1, insight: 'Vous prenez régulièrement des somnifères. Si cela aide à court terme, beaucoup de somnifères sur ordonnance perturbent en réalité l\'architecture du sommeil : ils réduisent les phases de sommeil profond et créent une dépendance progressive.', recommendation: 'Parlez à votre médecin de la possibilité d\'arrêter progressivement. Des alternatives naturelles ont montré leur efficacité : mélatonine à libération prolongée (1 à 2 mg, 30 min avant le coucher), magnésium (300 mg le soir), valériane. Mais la meilleure solution reste les changements comportementaux décrits dans ce bilan.' },
    { questionId: 'qual-3', threshold: 1, insight: 'Vous avez envie de dormir en journée — c\'est le signe que vos nuits ne sont pas suffisamment réparatrices. Une somnolence marquée en journée peut aussi être liée à des apnées du sommeil non détectées.', recommendation: 'Si la somnolence est forte (vous vous endormiriez n\'importe où), parlez-en à votre médecin. En attendant : les siestes courtes de 10 à 20 minutes entre 13h et 15h sont une aide réelle. Pas plus longues, et pas après 15h — sinon elles perturbent la nuit suivante. Le matin, exposez-vous à la lumière naturelle dès le réveil : 10 minutes dehors suffisent à réveiller le corps.' },
    { questionId: 'qual-4', threshold: 1, insight: 'Le manque de motivation et d\'enthousiasme que vous ressentez est souvent confondu avec de la paresse ou de la dépression — mais c\'est fréquemment un effet direct du manque de sommeil accumulé.', recommendation: 'Traitez le sommeil comme une priorité, pas comme un luxe. Réservez une fenêtre de 8 heures dans votre agenda, et tenez-vous-y. Une activité physique modérée en fin d\'après-midi (marche, vélo, natation) améliore à la fois la qualité du sommeil et l\'énergie du lendemain.' },
  ],
  references: [
    { authors: 'Kripke DF, Langer RD, Kline LE', title: 'Hypnotics\' association with mortality or cancer: a matched cohort study', journal: 'BMJ Open', year: 2012, doi: '10.1136/bmjopen-2012-000850', pmid: '22371848' },
    { authors: 'Morin CM, Vallières A, Guay B et al.', title: 'Cognitive behavioral therapy, singly and combined with medication, for persistent insomnia', journal: 'JAMA', year: 2009, doi: '10.1001/jama.2009.682', pmid: '19439733' },
  ],
}

// ══════════════════════════════════════════════════════
// Hygiène du sommeil
// ══════════════════════════════════════════════════════
const hygieneSommeilReport: SectionReport = {
  sectionId: 'hygiene-sommeil',
  context:
    'L\'hygiène du sommeil, c\'est l\'ensemble des habitudes du soir et de la nuit qui préparent — ou sabotent — votre sommeil. C\'est la bonne nouvelle de ce bilan : c\'est la partie la plus facile à changer. Améliorer ses habitudes de sommeil peut réduire le temps d\'endormissement de moitié et augmenter la qualité des nuits de façon mesurable en seulement 2 à 3 semaines.',
  recommendations: [
    { minPct: 80, level: 'excellent', title: 'Très bonnes habitudes', text: 'Vos habitudes de sommeil sont solides — horaires réguliers, bonne hygiène de vie le soir. C\'est l\'un des meilleurs investissements pour votre santé à long terme. Continuez.' },
    { minPct: 60, level: 'bon', title: 'Bonnes habitudes, quelques points à affiner', text: 'Vos habitudes sont globalement bonnes avec quelques ajustements possibles. Chaque petite amélioration a un effet cumulatif sur la qualité de vos nuits.' },
    { minPct: 40, level: 'moyen', title: 'Habitudes à revoir', text: 'Plusieurs de vos habitudes perturbent activement votre sommeil. La bonne nouvelle : c\'est la zone la plus facile à améliorer. 2 ou 3 changements ciblés peuvent transformer vos nuits en quelques semaines.' },
    { minPct: 0, level: 'faible', title: 'Habitudes très défavorables', text: 'Vos habitudes du soir nuisent clairement à votre sommeil. C\'est probablement la cause principale de vos difficultés. Mais c\'est aussi entièrement dans votre contrôle — c\'est la meilleure nouvelle possible.' },
  ],
  insights: [
    { questionId: 'hyg-1', threshold: 1, insight: 'Vos horaires de coucher sont irréguliers. C\'est l\'une des causes les plus fréquentes de mauvais sommeil. Votre horloge interne (votre rythme naturel de 24h) a besoin de régularité pour déclencher le sommeil au bon moment.', recommendation: 'Fixez une heure de coucher fixe à ±30 minutes, 7 jours sur 7 — week-ends inclus. C\'est LA mesure numéro 1. Mettez une alarme «&nbsp;heure du coucher&nbsp;» sur votre téléphone si besoin. Votre corps s\'adaptera en 1 à 2 semaines.' },
    { questionId: 'hyg-4', threshold: 1, insight: 'La caféine reste active dans le corps bien plus longtemps qu\'on ne le croit : un café bu à 16h a encore la moitié de ses effets à 22h. Elle bloque le signal naturel d\'endormissement dans le cerveau.', recommendation: 'Dernière caféine avant 14h. N\'oubliez pas les sources cachées : thé noir, chocolat, certains sodas. Remplacez par des tisanes en soirée — camomille et passiflore ont une efficacité prouvée pour calmer le système nerveux avant le sommeil.' },
    { questionId: 'hyg-5', threshold: 1, insight: 'Se lever à des heures très différentes d\'un jour à l\'autre perturbe profondément votre horloge interne. En fait, l\'heure de réveil est encore plus importante que l\'heure de coucher pour réguler votre rythme naturel.', recommendation: 'Même heure de réveil tous les jours — week-end inclus. Le dimanche matin sous la couette crée un décalage horaire interne qui perturbe toute la semaine suivante. Si vous êtes fatigué, préférez une sieste courte de 20 minutes plutôt que de vous lever en retard.' },
    { questionId: 'hyg-6', threshold: 1, insight: 'Une sieste de plus de 30 minutes plonge dans le sommeil profond et provoque une forte inertie au réveil (cette sensation de «&nbsp;gueule de bois&nbsp;» post-sieste). Elle réduit aussi l\'envie de dormir le soir.', recommendation: 'Limitez vos siestes à 10-20 minutes maximum, entre 13h et 15h. Astuce prouvée par la recherche : buvez un café juste avant la sieste. La caféine met 20 minutes à agir — au moment où vous vous réveillez, elle entre en action et vous redonne de l\'énergie.' },
    { questionId: 'hyg-7', threshold: 1, insight: 'Les écrans émettent une lumière bleue qui signale à votre cerveau qu\'il fait encore jour. Résultat : votre corps retarde la production de mélatonine (l\'hormone du sommeil) et vous mettez plus de temps à vous endormir.', recommendation: 'Pas d\'écran dans l\'heure qui précède le coucher — idéalement 30 minutes minimum. Si c\'est difficile, activez le mode nuit sur vos appareils. Remplacez par un livre physique, de la musique ou un podcast. Et rangez votre téléphone hors de la chambre — un réveil classique coûte 10 euros.' },
    { questionId: 'hyg-8', threshold: 1, insight: 'Un repas copieux peu avant de dormir force votre corps à travailler pour digérer alors qu\'il devrait se mettre en veille. Cela élève la température corporelle et peut provoquer des reflux — deux ennemis du sommeil.', recommendation: 'Dînez léger, au moins 2 à 3 heures avant de dormir. Si vous avez faim le soir, privilégiez des aliments qui favorisent le sommeil : banane, noix, dinde, lait chaud, cerises. Ces aliments contiennent des précurseurs naturels de l\'hormone du sommeil.' },
    { questionId: 'hyg-10', threshold: 1, insight: 'L\'alcool est un faux ami du sommeil. Il aide à s\'endormir plus vite, mais il perturbe profondément la deuxième moitié de la nuit, supprime les phases de rêve réparatrices et provoque des réveils tôt le matin.', recommendation: 'Évitez l\'alcool dans les 4 heures qui précèdent le coucher. Si vous buvez, alternez un verre d\'alcool avec un verre d\'eau. L\'alcool est l\'une des premières causes de sommeil non réparateur chez les adultes de 25 à 45 ans.' },
  ],
  references: [
    { authors: 'Irish LA, Kline CE, Gunn HE et al.', title: 'The role of sleep hygiene in promoting public health: A review of empirical evidence', journal: 'Sleep Med Rev', year: 2015, doi: '10.1016/j.smrv.2014.10.001', pmid: '25454674' },
    { authors: 'Chang AM, Aeschbach D, Duffy JF, Czeisler CA', title: 'Evening use of light-emitting eReaders negatively affects sleep, circadian timing, and next-morning alertness', journal: 'Proc Natl Acad Sci USA', year: 2015, doi: '10.1073/pnas.1418490112', pmid: '25535358' },
    { authors: 'Ebrahim IO, Shapiro CM, Williams AJ, Fenwick PB', title: 'Alcohol and sleep I: effects on normal sleep', journal: 'Alcohol Clin Exp Res', year: 2013, doi: '10.1111/acer.12006', pmid: '23347102' },
  ],
}

// ══════════════════════════════════════════════════════
// Profil complémentaire
// ══════════════════════════════════════════════════════
const profilReport: SectionReport = {
  sectionId: 'profil-complementaire',
  context:
    'Cette section s\'intéresse à des signaux plus spécifiques : le cerveau qui ne s\'éteint pas au moment de dormir, les ronflements forts, les jambes agitées, la fatigue persistante au réveil. Ces troubles touchent entre 15 et 30 % des adultes et sont souvent ignorés ou mal expliqués. Les identifier est la première étape pour agir efficacement.',
  recommendations: [
    { minPct: 80, level: 'excellent', title: 'Aucun signal d\'alerte', text: 'Votre profil ne révèle pas de signaux particuliers. Vos nuits ne semblent pas perturbées par des troubles spécifiques. C\'est rassurant.' },
    { minPct: 60, level: 'bon', title: 'Quelques signaux légers', text: 'Quelques signaux mineurs sont présents. Surveillez leur évolution et n\'hésitez pas à en parler à votre médecin lors de votre prochain bilan de santé.' },
    { minPct: 40, level: 'moyen', title: 'Signaux à explorer', text: 'Plusieurs signaux méritent attention. Un médecin pourra évaluer s\'un bilan spécialisé du sommeil est utile dans votre cas.' },
    { minPct: 0, level: 'faible', title: 'Signaux importants', text: 'Votre profil révèle des signaux qui indiquent probablement un trouble du sommeil spécifique. Une consultation avec votre médecin est fortement conseillée — ces troubles se traitent bien quand ils sont identifiés.' },
  ],
  insights: [
    { questionId: 'prof-1', threshold: 1, insight: 'Votre cerveau reste en mode «&nbsp;actif&nbsp;» au coucher — pensées qui tournent, préoccupations qui surgissent. C\'est le mécanisme le plus fréquent derrière l\'insomnie chronique.', recommendation: 'Une technique simple et prouvée : prenez 20 minutes chaque soir, avant d\'être au lit, pour écrire toutes vos pensées et tâches en suspens dans un carnet. Le simple fait de les poser sur papier «&nbsp;libère&nbsp;» le cerveau de l\'obligation de s\'en souvenir. Complétez avec une relaxation musculaire : contractez puis relâchez chaque groupe musculaire du corps, des pieds jusqu\'au visage, pendant 10 minutes. Cela s\'appelle la relaxation progressive, et son efficacité est largement documentée.' },
    { questionId: 'prof-2', threshold: 1, insight: 'Les pensées qui tournent en boucle au coucher activent des zones du cerveau qui sont incompatibles avec l\'endormissement. Plus on essaie de «&nbsp;s\'obliger à dormir&nbsp;», plus c\'est difficile.', recommendation: 'Prévoyez 15 minutes en début de soirée — pas au lit — pour noter vos soucis et vous poser des questions : «&nbsp;qu\'est-ce que je peux faire concrètement sur ce sujet ?&nbsp;». Ce rituel de «&nbsp;temps de soucis structuré&nbsp;» empêche les ruminations de ressurgir la nuit. Au moment de vous coucher, pratiquez une méditation de détente corporelle (scanner mentalement votre corps de la tête aux pieds pour le relâcher) — 10 minutes suffisent.' },
    { questionId: 'prof-3', threshold: 1, insight: 'Palpitations ou sensation de chaleur au lit : ce sont des signes que votre corps est encore en état d\'alerte alors qu\'il devrait se détendre. Le sommeil ne peut pas s\'installer dans un corps «&nbsp;sur les nerfs&nbsp;».', recommendation: 'Juste avant de dormir, pratiquez une respiration lente et rythmée : inspirez pendant 5 secondes, expirez pendant 5 secondes, pendant 5 minutes. C\'est une des techniques les plus efficaces pour calmer le système nerveux rapidement. Autre astuce : un bain ou une douche chaude 1h30 avant le coucher. La baisse de température qui suit aide le corps à basculer en mode sommeil.' },
    { questionId: 'prof-5', threshold: 1, insight: 'Se réveiller plus fatigué qu\'au coucher indique que votre sommeil n\'est pas réparateur — probablement à cause de micro-éveils que vous ne percevez pas, ou de nuits où votre corps ne passe pas assez de temps en sommeil profond.', recommendation: 'Les apnées du sommeil (des pauses respiratoires nocturnes) sont une cause fréquente de ce symptôme. Parlez-en à votre médecin. Optimisez aussi votre environnement : obscurité totale, température fraîche (17-18°C), matelas de moins de 8 ans. Le magnésium (300 mg le soir sous forme de bisglycinate, la forme la mieux assimilée) est un complément prouvé pour favoriser un sommeil plus profond.' },
    { questionId: 'prof-6', threshold: 1, insight: 'Ronfler fortement toutes les nuits — surtout si vos proches ont remarqué des pauses dans votre respiration — est le principal signe des apnées du sommeil. Ce trouble touche 1 adulte sur 10 et est diagnostiqué dans seulement 20 % des cas.', recommendation: 'Consultez votre médecin : il pourra vous prescrire un enregistrement de votre respiration à domicile pendant le sommeil pour confirmer ou exclure ce diagnostic. Si des apnées sont confirmées, un appareil respiratoire porté la nuit (un masque léger) règle le problème très efficacement et transforme la qualité du sommeil.' },
    { questionId: 'prof-8', threshold: 1, insight: 'Des envies irrépressibles de bouger les jambes au repos, surtout le soir, peuvent être le signe d\'un syndrome des jambes sans repos — un trouble qui touche 5 à 10 % de la population et est souvent lié à un manque de fer dans le sang.', recommendation: 'Faites doser votre taux de fer (ferritine) par votre médecin — le seuil optimal pour ce trouble est plus élevé que les normes habituelles. Une supplémentation en fer peut résoudre les symptômes. En attendant, évitez la caféine et l\'alcool le soir, et pratiquez une activité physique modérée dans la journée.' },
    { questionId: 'prof-10', threshold: 1, insight: 'Douleurs chroniques et mauvais sommeil forment un cercle vicieux : la douleur perturbe le sommeil profond, et le manque de sommeil profond rend le corps plus sensible à la douleur le lendemain.', recommendation: 'Agissez sur les deux fronts en même temps. Pour la nuit : étirements doux de 10 minutes avant le coucher, matelas adapté, oreiller ergonomique. Pour la douleur : la méditation de pleine conscience (des exercices guidés de 10 à 20 minutes) réduit significativement la perception de la douleur chronique — son efficacité a été mesurée et confirmée dans plusieurs études.' },
  ],
  references: [
    { authors: 'Haghayegh S, Khoshnevis S, Smolensky MH et al.', title: 'Before-bedtime passive body heating by warm shower or bath to improve sleep: A systematic review and meta-analysis', journal: 'Sleep Med Rev', year: 2019, doi: '10.1016/j.smrv.2019.04.008', pmid: '31102877' },
    { authors: 'Allen RP, Picchietti DL, Garcia-Borreguero D et al.', title: 'Restless legs syndrome/Willis-Ekbom disease diagnostic criteria: updated International Restless Legs Syndrome Study Group (IRLSSG) consensus criteria', journal: 'Sleep Med', year: 2014, doi: '10.1016/j.sleep.2014.03.025', pmid: '25023924' },
    { authors: 'Zeidan F, Martucci KT, Kraft RA et al.', title: 'Brain mechanisms supporting the modulation of pain by mindfulness meditation', journal: 'J Neurosci', year: 2011, doi: '10.1523/JNEUROSCI.5791-10.2011', pmid: '21471375' },
  ],
}

// ══════════════════════════════════════════════════════
// Global key insights
// ══════════════════════════════════════════════════════
export const globalKeyInsights: { title: string; description: string; reference: string }[] = [
  {
    title: 'Dormir, c\'est réparer son cerveau',
    description: 'Pendant le sommeil profond, le cerveau active un système de nettoyage qui élimine les déchets accumulés dans la journée — dont des protéines liées à la maladie d\'Alzheimer. Dormir moins de 7 heures par nuit régulièrement augmente la mortalité de 12 %.',
    reference: 'Cappuccio et al., 2010, Sleep',
  },
  {
    title: 'L\'heure du coucher compte plus que vous ne croyez',
    description: 'Votre corps fonctionne sur une horloge interne de 24 heures qui régule vos hormones, votre métabolisme et même votre humeur. Plus de 40 % de vos gènes s\'activent ou se désactivent selon cette horloge. La régularité des horaires de sommeil est plus prédictive de longévité que la durée de sommeil elle-même.',
    reference: 'Huang et al., 2022, Sleep',
  },
  {
    title: 'Une mauvaise nuit affaiblit vos défenses en 24h',
    description: 'Une seule nuit de mauvais sommeil suffit à déclencher une réponse inflammatoire dans le corps — comme si vous étiez légèrement malade. Elle réduit aussi de 70 % l\'activité de vos cellules immunitaires chargées de détecter et d\'éliminer les cellules anormales.',
    reference: 'Irwin MR, 2019, Neuropsychopharmacology',
  },
]

// ══════════════════════════════════════════════════════
// API
// ══════════════════════════════════════════════════════

const allReports: SectionReport[] = [troublesSommeilReport, qualiteImpactReport, hygieneSommeilReport, profilReport]

export function getSectionReport(sectionId: string): SectionReport | undefined {
  return allReports.find((r) => r.sectionId === sectionId)
}

export function getSectionRecommendation(report: SectionReport, pct: number): SectionRecommendation {
  for (const rec of report.recommendations) {
    if (pct >= rec.minPct) return rec
  }
  return report.recommendations[report.recommendations.length - 1]
}

export function getTriggeredInsights(report: SectionReport, scores: Record<string, number>): QuestionInsight[] {
  return report.insights.filter((ins) => {
    const score = scores[ins.questionId]
    return score !== undefined && score <= ins.threshold
  })
}

// ══════════════════════════════════════════════════════
// Full Report Generator — new structured format
// ══════════════════════════════════════════════════════

export interface StrengthItem {
  sectionId: string
  title: string
  pct: number
  praise: string
  science: string
  reference: string
}

export interface WeaknessItem {
  sectionId: string
  title: string
  pct: number
  level: string
  concern: string
  science: string
  reference: string
  triggeredInsights: { questionId: string; insight: string; recommendation: string }[]
}

export interface ActionPhase {
  phase: number
  phaseTitle: string
  timeframe: string
  actions: { action: string; why: string; sectionId: string }[]
}

export interface FullReport {
  strengths: StrengthItem[]
  weaknesses: WeaknessItem[]
  actionPlan: ActionPhase[]
  globalInsights: { title: string; description: string; reference: string }[]
  // backward compat
  sectionReports: Record<string, unknown>[]
}

/**
 * Generate the structured narrative report the user sees.
 * Separates strengths (≥ 60 %) from weaknesses (< 60 %),
 * then builds a phased action plan sorted by urgency.
 */
export function generateFullReport(
  sectionResults: { sectionId: string; pct: number; score: number; maxScore: number; title: string }[],
  scores: Record<string, number>,
): FullReport {
  const strengths: StrengthItem[] = []
  const weaknesses: WeaknessItem[] = []

  // Also build backward-compat sectionReports
  const sectionReports = sectionResults.map(r => {
    const report = getSectionReport(r.sectionId)
    if (!report) return null
    const rec = getSectionRecommendation(report, r.pct)
    const triggered = getTriggeredInsights(report, scores)
    return {
      sectionId: r.sectionId, title: r.title, pct: r.pct, score: r.score, maxScore: r.maxScore,
      level: rec.level, recommendationTitle: rec.title, recommendationText: rec.text, context: report.context,
      triggeredInsights: triggered.map(t => ({ questionId: t.questionId, insight: t.insight, recommendation: t.recommendation })),
      references: report.references,
    }
  }).filter(Boolean) as Record<string, unknown>[]

  for (const r of sectionResults) {
    const report = getSectionReport(r.sectionId)
    if (!report) continue
    const rec = getSectionRecommendation(report, r.pct)
    const triggered = getTriggeredInsights(report, scores)

    if (r.pct >= 60) {
      strengths.push({
        sectionId: r.sectionId,
        title: r.title,
        pct: r.pct,
        praise: rec.text,
        science: report.context.split('.').slice(0, 2).join('.') + '.',
        reference: report.references[0]
          ? `${report.references[0].authors.split(',')[0]} et al., ${report.references[0].year}`
          : '',
      })
    } else {
      weaknesses.push({
        sectionId: r.sectionId,
        title: r.title,
        pct: r.pct,
        level: rec.level,
        concern: rec.text,
        science: report.context,
        reference: report.references[0]
          ? `${report.references[0].authors.split(',')[0]} et al., ${report.references[0].year}`
          : '',
        triggeredInsights: triggered.map(t => ({
          questionId: t.questionId,
          insight: t.insight,
          recommendation: t.recommendation,
        })),
      })
    }
  }

  // Sort weaknesses by severity (lowest pct first)
  weaknesses.sort((a, b) => a.pct - b.pct)

  // Build phased action plan from weaknesses
  const actionPlan: ActionPhase[] = []

  // Phase 1: Immediate — hygiene fixes (most impactful, easiest)
  const phase1Actions: { action: string; why: string; sectionId: string }[] = []
  // Phase 2: Short-term — deeper behavioral changes
  const phase2Actions: { action: string; why: string; sectionId: string }[] = []
  // Phase 3: Medical / specialist follow-up
  const phase3Actions: { action: string; why: string; sectionId: string }[] = []

  for (const w of weaknesses) {
    for (const ti of w.triggeredInsights) {
      const recText = ti.recommendation
      // Route to correct phase
      if (w.sectionId === 'hygiene-sommeil') {
        phase1Actions.push({ action: recText.split('.').slice(0, 2).join('.') + '.', why: ti.insight, sectionId: w.sectionId })
      } else if (w.sectionId === 'profil-complementaire' && (w.pct < 40 || recText.toLowerCase().includes('consult'))) {
        phase3Actions.push({ action: recText.split('.').slice(0, 2).join('.') + '.', why: ti.insight, sectionId: w.sectionId })
      } else {
        phase2Actions.push({ action: recText.split('.').slice(0, 2).join('.') + '.', why: ti.insight, sectionId: w.sectionId })
      }
    }
    // If no triggered insights, use section recommendation
    if (w.triggeredInsights.length === 0) {
      const target = w.pct < 40 ? phase2Actions : phase1Actions
      target.push({ action: w.concern.split('.').slice(0, 2).join('.') + '.', why: `Score ${w.title} : ${w.pct}%`, sectionId: w.sectionId })
    }
  }

  if (phase1Actions.length > 0) {
    actionPlan.push({
      phase: 1,
      phaseTitle: 'Actions immédiates',
      timeframe: 'Semaines 1-2',
      actions: phase1Actions.slice(0, 5), // cap at 5
    })
  }
  if (phase2Actions.length > 0) {
    actionPlan.push({
      phase: 2,
      phaseTitle: 'Consolidation',
      timeframe: 'Semaines 3-6',
      actions: phase2Actions.slice(0, 5),
    })
  }
  if (phase3Actions.length > 0) {
    actionPlan.push({
      phase: 3,
      phaseTitle: 'Suivi médical',
      timeframe: 'À planifier',
      actions: phase3Actions.slice(0, 3),
    })
  }

  // If nothing is a weakness, give a maintenance plan
  if (actionPlan.length === 0) {
    actionPlan.push({
      phase: 1,
      phaseTitle: 'Maintien des acquis',
      timeframe: 'En continu',
      actions: [
        { action: 'Maintenez une heure de coucher régulière à ±30 min, 7j/7.', why: 'La régularité est le premier facteur de qualité du sommeil.', sectionId: 'hygiene-sommeil' },
        { action: 'Continuez à limiter les écrans 30 min avant le coucher.', why: 'La lumière bleue supprime la mélatonine.', sectionId: 'hygiene-sommeil' },
      ],
    })
  }

  return {
    strengths,
    weaknesses,
    actionPlan,
    globalInsights: globalKeyInsights,
    sectionReports,
  }
}
