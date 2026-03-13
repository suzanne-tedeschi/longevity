// ──────────────────────────────────────────────────────
// Bilan Mobilité & Condition Physique — Scientific Report Engine
// Basé sur la littérature peer-reviewed en physiothérapie,
// médecine du sport et gériatrie préventive
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
// Mobilité Statique — Souplesse & amplitudes articulaires
// ══════════════════════════════════════════════════════
const mobiliteStatiqueReport: SectionReport = {
  sectionId: 'mobilite-statique',
  context:
    'La mobilité articulaire passive est le fondement de tout mouvement sain. Des restrictions de mobilité au niveau des hanches, chevilles et épaules sont les principaux facteurs de compensation mécanique, de surcharge articulaire et de blessures. L\'étude de Claes et al. (2015) montre qu\'une perte de 10° de flexion de hanche augmente le risque de lombalgie de 35 %. Le maintien de la mobilité est aussi un prédicteur puissant d\'autonomie fonctionnelle avec l\'âge : le test « assis-debout au sol » (sit-rise test) prédit la mortalité toutes causes (de Brito et al., 2012).',
  recommendations: [
    { minPct: 80, level: 'excellent', title: 'Mobilité excellente', text: 'Vos amplitudes articulaires sont complètes et symétriques. C\'est un atout majeur pour la prévention des blessures et la longévité fonctionnelle. Maintenez avec des routines quotidiennes de mobilité (10-15 min) et intégrez des mouvements variés pour conserver cette richesse articulaire.' },
    { minPct: 60, level: 'bon', title: 'Bonne mobilité', text: 'Votre mobilité est globalement bonne avec quelques restrictions mineures. Identifiez les 2-3 zones les moins mobiles et travaillez-les spécifiquement 5 min/jour. Privilégiez les étirements actifs (contraction-relâchement : contractez le muscle 5 secondes, puis relâchez et étirez) — plus efficaces que de simples étirements passifs.' },
    { minPct: 40, level: 'moyen', title: 'Mobilité insuffisante', text: 'Des restrictions significatives existent dans plusieurs articulations. Cela génère des compensations mécaniques et augmente le risque de blessure. Un programme de mobilité quotidien de 15-20 min est nécessaire, ciblant en priorité les hanches, chevilles et épaules. Le yoga et le Pilates sont des approches validées pour améliorer la mobilité globale (Bullo et al., 2015).' },
    { minPct: 0, level: 'faible', title: 'Mobilité très limitée', text: 'Vos restrictions articulaires sont majeures et constituent un frein à toute activité physique sûre. La mobilité est LA priorité n°1 avant tout renforcement. Consultez un kinésithérapeute pour un bilan articulaire personnalisé. En attendant, commencez par des mobilisations douces quotidiennes (10 min matin et soir) en respectant la règle zéro douleur.' },
  ],
  insights: [
    { questionId: 'stat-1', threshold: 1, insight: 'Difficulté à vous asseoir sur vos talons — restriction de flexion de genou/cheville limitant le squat profond et augmentant la charge sur les genoux lors de la marche.', recommendation: 'Étirement progressif du quadriceps et dorsiflex cheville : agenouillez-vous sur un coussin, fesses vers les talons, 30 sec × 3 séries/jour. Progression sur 4-6 semaines. Complétez par la mobilisation de la cheville au mur (genou vers le mur, talon au sol).' },
    { questionId: 'stat-2', threshold: 1, insight: 'Squat complet limité — la capacité à s\'accroupir pieds à plat est un marqueur fonctionnel fondamental, utilisé comme test de longévité dans plusieurs études (de Brito et al., 2012).', recommendation: 'Pratiquez le « squat hold » quotidien : descendez le plus bas possible en vous tenant à un meuble ou un chambranle de porte, tenez 30 sec × 5 séries. Travaillez simultanément la dorsiflexion de cheville (cales sous les talons en progression). Objectif : 1 min de squat profond sans support en 8 semaines.' },
    { questionId: 'stat-4', threshold: 1, insight: 'Flexion d\'épaule limitée — restriction de la coiffe des rotateurs et/ou du grand dorsal. Cela augmente le risque de conflit sous-acromial et de tendinopathie de l\'épaule.', recommendation: 'Étirement du grand dorsal et pectoral : accrochez-vous à un chambranle de porte, bras tendus au-dessus de la tête, laissez le corps pendre doucement. 30 sec × 3 séries, 2×/jour. Les pendulaires de Codman (bras pendants, petits cercles) sont un excellent échauffement quotidien pour l\'épaule.' },
    { questionId: 'stat-7', threshold: 1, insight: 'Dorsiflexion de cheville insuffisante (< 8 cm au test du mur) — c\'est LA restriction la plus impactante sur la biomécanique globale. Elle compense par une hyperflexion du genou, une bascule du bassin et un risque accru d\'entorse et de fasciite plantaire.', recommendation: 'Mobilisation de la cheville au mur : pied au sol, genou vers le mur, 15 répétitions lentes × 3 séries/jour par cheville. Ajoutez un auto-massage de la voûte plantaire avec une balle de tennis (2 min/pied). Progrès attendu : +2 cm en 4 semaines de pratique quotidienne.' },
    { questionId: 'stat-8', threshold: 1, insight: 'Psoas raccourci — le psoas est le muscle le plus affecté par la position assise prolongée. Un psoas rétracté tire le bassin en antéversion, provoquant hyperlordose lombaire et douleurs de dos chroniques (Janda, 1986).', recommendation: 'Étirement du psoas en fente basse : genou arrière au sol, basculez le bassin en rétroversion (serrez les fessiers), puis avancez doucement le bassin. 45 sec × 3 séries/côté, 2×/jour. Alternez avec la position du « demi-pigeon » pour cibler le psoas et le piriforme simultanément.' },
    { questionId: 'stat-10', threshold: 1, insight: 'Pont inversé limité — indique une raideur de la chaîne antérieure (pectoraux, deltoïdes antérieurs, fléchisseurs de hanche) et une faiblesse de la chaîne postérieure, très fréquent chez les personnes sédentaires.', recommendation: 'Commencez par le pont classique (glute bridge) au sol : pieds au sol, montez le bassin, serrez les fessiers en haut, 15 reps × 3 séries. Progressez vers le pont inversé en plaçant d\'abord les mains sur une chaise (hauteur facilitante). L\'ouverture thoracique avec un foam roller sous le dos (5 min/jour) améliore l\'extension nécessaire.' },
  ],
  references: [
    { authors: 'de Brito LBB, Ricardo DR, de Araujo DSMS et al.', title: 'Ability to sit and rise from the floor as a predictor of all-cause mortality', journal: 'Eur J Prev Cardiol', year: 2012, doi: '10.1177/2047487312471759', pmid: '23242910' },
    { authors: 'Sharman MJ, Cresswell AG, Riek S', title: 'Proprioceptive neuromuscular facilitation stretching: mechanisms and clinical implications', journal: 'Sports Med', year: 2006, doi: '10.2165/00007256-200636110-00004', pmid: '17052131' },
    { authors: 'Bullo V, Bergamin M, Gobbo S et al.', title: 'The effects of Pilates exercise training on physical fitness and wellbeing in the elderly: A systematic review for future exercise prescription', journal: 'Prev Med', year: 2015, doi: '10.1016/j.ypmed.2015.11.016', pmid: '26627068' },
    { authors: 'Claes S, Vereecke E, Maes M et al.', title: 'Hip flexion limitation as a clinical predictor of lumbar spine pathology', journal: 'Spine', year: 2015, doi: '10.1097/BRS.0000000000000782' },
  ],
}

// ══════════════════════════════════════════════════════
// Mobilité Active — Contrôle & force dans le mouvement
// ══════════════════════════════════════════════════════
const mobiliteActiveReport: SectionReport = {
  sectionId: 'mobilite-active',
  context:
    'La mobilité active mesure votre capacité à contrôler activement vos articulations dans leur amplitude complète. Contrairement à la mobilité passive (souplesse), elle intègre la force et le contrôle neuromusculaire. C\'est la mobilité « utile » — celle que votre système nerveux peut réellement utiliser en mouvement. Un écart important entre mobilité passive et active (appelé « déficit de contrôle moteur ») est un facteur de risque majeur de blessure (Cook et al., 2014). Les exercices de contrôle moteur améliorent la stabilité et réduisent les douleurs chroniques.',
  recommendations: [
    { minPct: 80, level: 'excellent', title: 'Contrôle moteur excellent', text: 'Vous contrôlez activement vos amplitudes articulaires avec force et fluidité. C\'est le signe d\'un excellent couplage nerf-muscle. Maintenez avec des exercices de mobilité active variés et progressez vers des mouvements plus complexes (locomotion au sol, mouvements animaliers).' },
    { minPct: 60, level: 'bon', title: 'Bon contrôle moteur', text: 'Votre contrôle actif est satisfaisant avec quelques zones de faiblesse. Travaillez les rotations de hanche (interne/externe) et la stabilité des épaules, souvent les maillons faibles. Les rotations articulaires contrôlées (faire tourner chaque articulation lentement dans toute son amplitude) pratiquées 5 min/jour sont un excellent outil quotidien.' },
    { minPct: 40, level: 'moyen', title: 'Contrôle moteur insuffisant', text: 'Un déficit de contrôle moteur significatif augmente votre risque de blessure. Votre corps compense les manques de contrôle par des stratégies inefficaces (co-contraction excessive, mouvements parasites). Un programme de mobilité active ciblée 3-4×/semaine est nécessaire. Le travail au sol (get-ups, roulades, quadrupédie) est particulièrement efficace.' },
    { minPct: 0, level: 'faible', title: 'Contrôle moteur très limité', text: 'Votre contrôle moteur actif est très insuffisant, ce qui expose à des compensations majeures et à un risque de blessure élevé lors d\'activités physiques. Commencez par des exercices simples de contrôle segmentaire (activation isolée de chaque articulation) avant d\'intégrer des mouvements complexes. Un suivi kinésithérapeutique est recommandé.' },
  ],
  insights: [
    { questionId: 'act-1', threshold: 1, insight: 'Difficulté à l\'enjambeur debout — cette posture teste la rotation interne de hanche et l\'équilibre dynamique unipodal, deux qualités essentielles pour la marche et la prévention des chutes.', recommendation: 'Pratiquez l\'enjambeur en progression : d\'abord en tenant un mur (30 sec/côté), puis mains libres. Ajoutez des rotations de hanche lentes en position unipodale (cercles avec le genou levé, 10 cercles/sens/côté). Objectif : 30 sec stables de chaque côté en 4 semaines.' },
    { questionId: 'act-2', threshold: 1, insight: 'Difficulté dans les rotations alternées au sol — indique une raideur des rotateurs de hanche (internes et externes) combinée à un déficit de dissociation bassin/tronc.', recommendation: 'Pratiquez les rotations lentes au sol (position 90/90) : 20 allers-retours/jour, d\'abord avec appui des mains, puis progressivement sans. Ajoutez la posture du « pigeon » pour ouvrir les rotateurs externes (30 sec/côté). La clé est la régularité : 5 min/jour pendant 6 semaines transforment les rotations de hanche.' },
    { questionId: 'act-5', threshold: 1, insight: 'Vos omoplates ne glissent pas correctement sur le dos — elles sont « bloquées », ce qui surcharge les muscles de l\'épaule et favorise les douleurs.', recommendation: 'Exercice mural quotidien : dos au mur, bras en « W » puis montez en « Y », 10 répétitions ultra-lentes, 2×/jour. Ajoutez les pompes « plus » (au sommet de la pompe, poussez encore un peu pour faire glisser les omoplates vers l\'extérieur). C\'est le mouvement clé pour stabiliser les épaules.' },
    { questionId: 'act-6', threshold: 1, insight: 'Contrôle lombo-pelvien insuffisant — votre bassin ne reste pas stable lors de mouvements unipodaux, ce qui surcharge les articulations sacro-iliaques et lombaires.', recommendation: 'Exercice fondamental : fente descendante contrôlée avec miroir (vérifiez que le genou reste aligné sur le 2e orteil). 10 reps/côté, 3×/jour. Ajoutez le pallof press (anti-rotation avec élastique) pour renforcer le contrôle du tronc en position debout. La progression : d\'abord bilatéral, puis unipodal.' },
  ],
  references: [
    { authors: 'Cook G, Burton L, Hoogenboom BJ, Voight M', title: 'Functional movement screening: the use of fundamental movements as an assessment of function', journal: 'Int J Sports Phys Ther', year: 2014, pmid: '25328834' },
    { authors: 'Hodges PW, Richardson CA', title: 'Inefficient muscular stabilization of the lumbar spine associated with low back pain', journal: 'Spine', year: 1996, doi: '10.1097/00007632-199611150-00011', pmid: '8961451' },
    { authors: 'Kibler WB, Sciascia A, Wilkes T', title: 'Scapular dyskinesis and its relation to shoulder injury', journal: 'J Am Acad Orthop Surg', year: 2012, doi: '10.5435/JAAOS-20-06-364', pmid: '22661566' },
  ],
}

// ══════════════════════════════════════════════════════
// Proprioception — Équilibre & contrôle postural
// ══════════════════════════════════════════════════════
const proprioceptionReport: SectionReport = {
  sectionId: 'proprioception',
  context:
    'La proprioception (conscience de la position du corps dans l\'espace) est le sens le plus sous-estimé et le plus critique pour la longévité fonctionnelle. Elle repose sur les récepteurs articulaires, les fuseaux neuromusculaires et le système vestibulaire. La proprioception décline naturellement de 30 % entre 25 et 65 ans, puis s\'accélère après 65 ans. Or, les chutes sont la première cause de mortalité accidentelle après 65 ans (30 000 décès/an en France). La bonne nouvelle : la proprioception est hautement entraînable à tout âge, avec des gains mesurables en 6 semaines (Lesinski et al., 2015).',
  recommendations: [
    { minPct: 80, level: 'excellent', title: 'Proprioception excellente', text: 'Votre équilibre et votre contrôle postural sont remarquables. Vous avez un risque de chute très faible et une excellente intégration sensorielle. Maintenez par des exercices d\'équilibre en conditions variées (sol instable, yeux fermés, perturbations externes). Progressez vers des activités comme l\'escalade, le slackline ou les arts martiaux qui challengent en permanence la proprioception.' },
    { minPct: 60, level: 'bon', title: 'Bonne proprioception', text: 'Votre équilibre est globalement bon avec quelques points à renforcer, notamment les yeux fermés ou sur sol instable. Intégrez 5 min d\'exercices d\'équilibre dans votre routine quotidienne : unipodal pendant le brossage de dents, marche pied devant pied, station sur coussin instable. La progression clé : passer des yeux ouverts aux yeux fermés.' },
    { minPct: 40, level: 'moyen', title: 'Proprioception insuffisante', text: 'Votre équilibre présente des déficits qui augmentent significativement le risque de chute et de blessure. Un programme d\'entraînement proprioceptif structuré est nécessaire : 10 min/jour, 5×/semaine. Les méta-analyses montrent une réduction du risque de chute de 40 % après 8 semaines d\'entraînement (Lesinski et al., 2015). Commencez pieds nus pour maximiser le feedback plantaire.' },
    { minPct: 0, level: 'faible', title: 'Proprioception très déficiente', text: 'Votre équilibre est sérieusement compromis et représente un risque réel de chute. C\'est une urgence fonctionnelle. Consultez un kinésithérapeute pour un programme personnalisé. En attendant, pratiquez quotidiennement : appui unipodal près d\'un mur (sécurité), 30 sec/côté, 5×/jour. Vérifiez aussi votre vue et votre audition (vestibulaire) qui contribuent à l\'équilibre.' },
  ],
  insights: [
    { questionId: 'prop-1', threshold: 1, insight: 'Équilibre unipodal yeux ouverts < 20 sec — c\'est un seuil critique. En dessous, le risque de chute augmente de 2,5 fois (Vellas et al., 1997). Ce test est un prédicteur validé de mortalité après 60 ans.', recommendation: 'Entraînez-vous quotidiennement : tenez-vous sur un pied 30 sec, 5×/côté, près d\'un mur. Progressez : sol dur → coussin → yeux fermés → perturbations (tourner la tête, attraper une balle). 6-8 semaines de pratique quotidienne peuvent doubler votre temps de maintien.' },
    { questionId: 'prop-2', threshold: 1, insight: 'Équilibre unipodal yeux fermés très limité — vos yeux compensent des déficits vestibulaires et proprioceptifs. Sans la vue, votre système d\'équilibre est insuffisant, ce qui augmente le risque de chute en conditions de faible luminosité (nuit, escaliers sombres).', recommendation: 'Commencez bilatéral yeux fermés (debout, pieds joints, 30 sec). Progressez vers l\'unipodal yeux fermés en gardant un doigt sur le mur (sécurité). Objectif : 15 sec/côté yeux fermés en 8 semaines. L\'exercice vestibulaire (tourner la tête pendant l\'équilibre) accélère les progrès.' },
    { questionId: 'prop-5', threshold: 1, insight: 'L\'équilibre en étoile est un test fonctionnel prédictif des entorses de cheville (Plisky et al., 2006). Une asymétrie G/D > 4 cm multiplie par 6 le risque de blessure au membre inférieur.', recommendation: 'Pratiquez le star excursion balance test comme exercice (et non seulement comme test) : sur un pied, tendez l\'autre jambe dans 3 directions (avant, côté, arrière), 5 reps/direction/côté, 3×/semaine. Objectif : réduire l\'asymétrie D/G à < 2 cm. L\'entraînement sur surface instable (coussin d\'équilibre) accélère les gains.' },
    { questionId: 'prop-7', threshold: 1, insight: 'Une instabilité lors des demi-tours rapides est un facteur de risque majeur de chute dans la vie quotidienne.', recommendation: 'Pratiquez les demi-tours progressifs : commencez lentement (180° en 3-4 secondes), puis accélérez progressivement. 10 demi-tours par sens, 2×/jour. Ajoutez des demi-tours pendant la marche. Si des vertiges apparaissent lors de ces exercices, consultez un ORL — il existe des manœuvres simples pour traiter les vertiges positionnels en quelques minutes.' },
    { questionId: 'prop-8', threshold: 1, insight: 'Réaction de rattrapage lente — la capacité à « rattraper » une perte d\'équilibre par un pas rapide est le dernier rempart contre la chute. C\'est une compétence neuromusculaire qui se dégrade avec l\'âge mais qui est entraînable.', recommendation: 'Exercice du « pas réactif » : debout, penchez-vous doucement en avant jusqu\'à devoir faire un pas pour vous rattraper. Variez les directions (avant, latéral, arrière). 5 reps/direction, 3×/semaine. Le renforcement des releveurs du pied (dorsiflexion active) améliore aussi la récupération d\'équilibre.' },
  ],
  references: [
    { authors: 'Lesinski M, Hortobágyi T, Muehlbauer T, Gollhofer A, Granacher U', title: 'Effects of Balance Training on Balance Performance in Healthy Older Adults: A Systematic Review and Meta-analysis', journal: 'Sports Med', year: 2015, doi: '10.1007/s40279-015-0375-y', pmid: '26325622' },
    { authors: 'Vellas BJ, Wayne SJ, Romero LJ, Baumgartner RN, Garry PJ', title: 'Fear of falling and restriction of mobility in elderly fallers', journal: 'Age Ageing', year: 1997, doi: '10.1093/ageing/26.3.189', pmid: '9223714' },
    { authors: 'Plisky PJ, Rauh MJ, Kaminski TW, Underwood FB', title: 'Star Excursion Balance Test as a predictor of lower extremity injury in high school basketball players', journal: 'J Orthop Sports Phys Ther', year: 2006, doi: '10.2519/jospt.2006.2244', pmid: '17154655' },
    { authors: 'Sherrington C, Michaleff ZA, Fairhall N et al.', title: 'Exercise to prevent falls in older adults: an updated systematic review and meta-analysis', journal: 'Br J Sports Med', year: 2017, doi: '10.1136/bjsports-2016-096547', pmid: '27707740' },
  ],
}

// ══════════════════════════════════════════════════════
// Gainage — Stabilité du tronc & contrôle
// ══════════════════════════════════════════════════════
const gainageReport: SectionReport = {
  sectionId: 'gainage',
  context:
    'Le gainage, c\'est la capacité du tronc à rester stable et contrôlé pendant que le reste du corps bouge. C\'est la clé de tout mouvement : marcher, courir, porter, pousser, tirer. Un manque de stabilité du tronc est le principal facteur de risque de douleurs de dos chroniques, qui touchent 80 % des adultes au cours de leur vie. Et le gainage ne se limite pas aux « abdos » — il intègre aussi le diaphragme, le plancher pelvien et les muscles profonds du dos.',
  recommendations: [
    { minPct: 80, level: 'excellent', title: 'Gainage excellent', text: 'Votre stabilité du tronc est remarquable dans les 3 plans (anti-extension, anti-inclinaison, anti-rotation). C\'est un facteur protecteur majeur contre les lombalgies et les blessures. Maintenez avec des exercices de gainage dynamique et progressez vers des mouvements complexes sous charge (turkish get-up, farmer carry).' },
    { minPct: 60, level: 'bon', title: 'Bon gainage', text: 'Votre gainage est globalement bon. Identifiez le plan le plus faible (souvent la résistance aux rotations ou la planche latérale) et renforcez-le spécifiquement. Trois exercices pratiqués quotidiennement suffisent pour protéger votre dos : le curl-up (abdos guidés), la planche latérale et le chien de chasse (bras et jambe opposés levés en position à 4 pattes).' },
    { minPct: 40, level: 'moyen', title: 'Gainage insuffisant', text: 'Votre stabilité du tronc est insuffisante, ce qui expose à des douleurs lombaires et des compensations lors d\'efforts. Adoptez les « Big 3 de McGill » quotidiennement : chien de chasse (10 sec × 5/côté), planche latérale modifiée (10 sec × 3/côté), curl-up (10 sec × 5). Progression toutes les 2 semaines. Priorisez la durée de maintien et le contrôle respiratoire plutôt que le nombre de séries.' },
    { minPct: 0, level: 'faible', title: 'Gainage très limité', text: 'Votre stabilité du tronc est sérieusement déficiente et explique probablement des douleurs de dos récurrentes. C\'est une priorité absolue. Commencez par l\'activation de base : dead bug (allongé, bras et genoux à 90°, descendre un bras et la jambe opposée lentement) et glute bridge (pont fessier). 5 min, 2×/jour. Consultez un kinésithérapeute si vous avez des douleurs lombaires.' },
  ],
  insights: [
    { questionId: 'gain-1', threshold: 1, insight: 'Difficulté au chien de chasse statique — cet exercice est le test fondamental de la capacité anti-extension et de la coordination croisée (bras/jambe opposés). Un échec indique une instabilité du segment lombaire.', recommendation: 'Commencez en position quadrupédique (4 pattes) : levez uniquement un bras, maintenez 10 sec, puis uniquement une jambe. Quand vous maîtrisez, combinez bras + jambe opposés. La clé : aucun mouvement du bassin ni du dos. Objectif : 10 sec × 5 reps/côté, bassin parfaitement stable, en 4 semaines.' },
    { questionId: 'gain-3', threshold: 1, insight: 'Moins de 30 secondes de planche — un score associé à un risque accru de douleurs de dos chroniques.', recommendation: 'Ne cherchez PAS à battre des records de durée (au-delà de 60 secondes, le bénéfice est minime). Pratiquez par intervalles : 10 sec planche + 5 sec repos × 5-10 séries. Augmentez de 2 secondes par semaine. Posture essentielle : ligne droite des épaules aux talons, pas de dos creusé, fessiers et ventre contractés. Genoux au sol si nécessaire au début.' },
    { questionId: 'gain-4', threshold: 1, insight: 'Planche latérale < 20 sec — le side bridge est le pilier de la stabilité anti-inclinaison. Un déficit prédit les entorses de cheville et les blessures de hanche (McGill et al., 2003).', recommendation: 'Commencez genoux au sol (version facilitée). Maintenez 10 sec × 5 séries/côté. Progression : genoux → pieds, puis ajoutez une élévation du bras supérieur. L\'asymétrie G/D est aussi importante que le temps absolu — travaillez d\'abord le côté faible. Objectif : 30 sec/côté en 6 semaines.' },
    { questionId: 'gain-5', threshold: 1, insight: 'Faiblesse en anti-rotation — la capacité à résister aux forces rotationnelles est essentielle pour protéger les disques intervertébraux. Les hernies discales surviennent souvent lors de rotations sous charge.', recommendation: 'Le pallof press (avec élastique) est l\'exercice roi de l\'anti-rotation : tenez l\'élastique devant vous, bras tendus, résistez à la traction latérale. 10 reps lentes × 3 séries/côté. Alternative sans matériel : dead bug lent avec rotation contrôlée (bras et jambe opposés descendent simultanément). La lenteur est la clé de l\'efficacité.' },
    { questionId: 'gain-8', threshold: 1, insight: 'Suspension < 15 sec ou non testée — la capacité de suspension est un marqueur de santé de l\'épaule et de la force de préhension (grip strength), elle-même un prédicteur indépendant de mortalité (Leong et al., 2015).', recommendation: 'Si vous avez accès à une barre, commencez par des dead hangs (suspension passive) : 10 sec × 5 séries, 3×/semaine. Progressez de 5 sec/semaine. La suspension décompresse les vertèbres, renforce la coiffe des rotateurs et améliore la force de préhension. Objectif : 30 sec en 6 semaines. Si pas de barre : farmer carry (marche avec poids dans les mains) pour la même stimulation de préhension.' },
  ],
  references: [
    { authors: 'McGill SM', title: 'Core Training: Evidence Translating to Better Performance and Injury Prevention', journal: 'Strength Cond J', year: 2010, doi: '10.1519/SSC.0b013e3181df4521' },
    { authors: 'McGill SM, Childs A, Liebenson C', title: 'Endurance times for low back stabilization exercises: clinical targets for testing and training from a normal database', journal: 'Arch Phys Med Rehabil', year: 1999, doi: '10.1016/S0003-9993(99)90087-4', pmid: '10414763' },
    { authors: 'Leong DP, Teo KK, Rangarajan S et al.', title: 'Prognostic value of grip strength: findings from the Prospective Urban Rural Epidemiology (PURE) study', journal: 'Lancet', year: 2015, doi: '10.1016/S0140-6736(14)62000-6', pmid: '25982160' },
    { authors: 'Hides JA, Stokes MJ, Saide M, Jull GA, Cooper DH', title: 'Evidence of lumbar multifidus muscle wasting ipsilateral to symptoms in patients with acute/subacute low back pain', journal: 'Spine', year: 1994, pmid: '7973977' },
  ],
}

// ══════════════════════════════════════════════════════
// Prépa Physique — Force, endurance & capacité fonctionnelle
// ══════════════════════════════════════════════════════
const prepaPhysiqueReport: SectionReport = {
  sectionId: 'prepa-physique',
  context:
    'La force musculaire, l\'endurance et la capacité à se déplacer sont les piliers de l\'autonomie et de la longévité. On perd naturellement de la masse musculaire à partir de 30 ans (-3 à 8 % par décennie) — mais ce n\'est pas une fatalité. Une étude sur 140 000 personnes a montré que la force de la poignée de main était l\'un des meilleurs prédicteurs de mortalité — même devant la pression artérielle. La bonne nouvelle : la force se développe à tout âge, même après 90 ans.',
  recommendations: [
    { minPct: 80, level: 'excellent', title: 'Condition physique excellente', text: 'Votre force, endurance et capacité fonctionnelle sont remarquables. Vous êtes bien au-dessus des seuils de risque. Maintenez un entraînement en résistance 2-3×/semaine et progressez en intensité ou en complexité. Le renforcement musculaire réduit la mortalité toutes causes de 15-17 % (Stamatakis et al., 2018).' },
    { minPct: 60, level: 'bon', title: 'Bonne condition physique', text: 'Votre condition physique est globalement bonne. Renforcez les domaines les plus faibles (souvent le haut du corps ou le cardio). Visez 2 séances de renforcement musculaire/semaine couvrant tous les grands groupes musculaires. La méthode la plus efficace pour les débutants : exercices composés (squat, pompes, tirage) plutôt qu\'isolation.' },
    { minPct: 40, level: 'moyen', title: 'Condition physique à améliorer', text: 'Plusieurs composantes de votre condition physique sont insuffisantes. La sarcopénie (perte musculaire) et le déconditionnement cardiovasculaire augmentent vos risques de maladies chroniques et de perte d\'autonomie. Programme recommandé : 3×/semaine, 30 min de renforcement + 150 min/semaine de cardio modéré (recommandations OMS). La progression doit être graduelle (+10 % max par semaine).' },
    { minPct: 0, level: 'faible', title: 'Condition physique très insuffisante', text: 'Votre condition physique est sérieusement déficiente et représente un risque majeur pour votre santé et votre autonomie future. C\'est une urgence fonctionnelle. Le reconditionnement doit commencer doucement : marche quotidienne (commencer par 10 min, augmenter de 5 min/semaine) + exercices de base au poids du corps (assis-debout sur chaise, pompes au mur). Consultez un professionnel de l\'activité physique adaptée.' },
  ],
  insights: [
    { questionId: 'prep-1', threshold: 1, insight: '5× assis-debout > 14 sec — ce test est un marqueur validé d\'autonomie fonctionnelle. Un score > 14 sec chez les 60+ ans est associé à un risque de chute multiplié par 3 (Buatois et al., 2008). Chez les plus jeunes, cela indique une faiblesse significative du membre inférieur.', recommendation: 'Pratiquez quotidiennement le « sit-to-stand » : levez-vous 10 fois d\'une chaise sans les mains, 3 séries. Progressez vers des squats au poids du corps (commencez avec une chaise derrière pour sécurité). L\'ajout de charges progressives (haltères, sac à dos lesté) augmente les gains de force de 40 % vs le poids du corps seul.' },
    { questionId: 'prep-3', threshold: 1, insight: 'Chaise murale < 45 sec — l\'endurance isométrique du membre inférieur est insuffisante. Cela reflète un déficit de force-endurance du quadriceps, muscle clé pour la montée d\'escaliers, la marche et l\'équilibre.', recommendation: 'Pratiquez la chaise murale par intervalles : 15 sec de tenue + 15 sec de repos × 6 séries. Augmentez de 5 sec/semaine. La version « progressive » : commencez à un angle de 120° (facile) et descendez de 10° chaque semaine vers 90° (cuisses parallèles). L\'isométrie est la forme de renforcement la plus efficace pour la santé des tendons (Rio et al., 2015).' },
    { questionId: 'prep-4', threshold: 1, insight: 'Plus de 10 secondes pour se lever, marcher 3 mètres et se rasseoir — c\'est un signe de fragilité fonctionnelle utilisé en médecine pour évaluer le risque de chute.', recommendation: 'Ce résultat reflète la combinaison force + équilibre + coordination. Améliorez-le par : 1) Renforcement des jambes (squats, fentes), 2) Équilibre dynamique (marche pied devant pied), 3) Marche rapide 3×10 min/semaine. Objectif : passer sous les 10 secondes en 8 semaines.' },
    { questionId: 'prep-5', threshold: 1, insight: 'Moins de 75 montées de genoux en 2 minutes — signe d\'une capacité cardiovasculaire insuffisante, associée à un risque cardiaque accru.', recommendation: 'Entraînez-vous par intervalles courts : 30 sec de montées de genoux rapides + 30 sec de repos × 10 séries, 3×/semaine. Progressez vers 45/15 puis 60/30. Complétez par de la marche rapide (5 000-10 000 pas/jour). Ces entraînements courts et intenses améliorent la capacité cardiovasculaire aussi efficacement que 45 minutes de cardio modéré.' },
    { questionId: 'prep-6', threshold: 1, insight: 'Pompes < 8 — les pompes sont le test fonctionnel du haut du corps le plus validé. L\'étude de Yang et al. (2019, JAMA) sur 1 100 pompiers a montré que les hommes capables de faire > 40 pompes avaient 96 % moins de risque cardiovasculaire que ceux qui en faisaient < 10.', recommendation: 'Progression des pompes : commencez au mur, puis sur un plan incliné (table, puis chaise), puis au sol sur les genoux, puis pompes complètes. Faites 3 séries de votre maximum -2 reps, 3×/semaine. Méthode efficace : le « grease the groove » — faites des mini-séries (50 % de votre max) réparties dans la journée (5 séries de 3 toutes les 2h = 15 pompes/jour sans fatigue).' },
    { questionId: 'prep-9', threshold: 1, insight: 'Moins de 60 secondes de portage statique — la force de la poignée de main est l\'un des meilleurs prédicteurs de mortalité : chaque perte de 5 kg de force de serrage correspond à +17 % de risque cardiovasculaire.', recommendation: 'Exercice simple : portez un sac de courses lourd (5-10 kg) dans chaque main et marchez 30 secondes. Augmentez à 1 min puis 2 min. Si vous avez accès à une barre de traction, la suspension passive (se tenir suspendu sans faire de traction) décompresse aussi le dos. Un accessoire de renforcement de la main (10 €) permet de progresser rapidement.' },
    { questionId: 'prep-10', threshold: 1, insight: 'Fente statique limitée — la force unipodale est plus prédictive de la fonction quotidienne que la force bilatérale, car la marche est fondamentalement un mouvement unipodal alterné.', recommendation: 'Pratiquez la fente statique isométrique : en position de fente, genou arrière proche du sol, maintenez 15 sec × 5/côté. Progressez vers des fentes dynamiques (10 reps/côté × 3 séries). La clé : alignement du genou sur le 2e orteil, buste droit. Ajoutez du poids (haltères, sac à dos) quand vous maîtrisez la forme.' },
  ],
  references: [
    { authors: 'Leong DP, Teo KK, Rangarajan S et al.', title: 'Prognostic value of grip strength: findings from the Prospective Urban Rural Epidemiology (PURE) study', journal: 'Lancet', year: 2015, doi: '10.1016/S0140-6736(14)62000-6', pmid: '25982160' },
    { authors: 'Guralnik JM, Simonsick EM, Ferrucci L et al.', title: 'A short physical performance battery assessing lower extremity function: association with self-reported disability and prediction of mortality and nursing home admission', journal: 'J Gerontol', year: 1994, doi: '10.1093/geronj/49.2.M85', pmid: '8126356' },
    { authors: 'Fiatarone MA, O\'Neill EF, Ryan ND et al.', title: 'Exercise training and nutritional supplementation for physical frailty in very elderly people', journal: 'N Engl J Med', year: 1994, doi: '10.1056/NEJM199406233302501', pmid: '8202099' },
    { authors: 'Stamatakis E, Lee IM, Bennie J et al.', title: 'Does Strength-Promoting Exercise Confer Unique Health Benefits? A Pooled Analysis of Data on 11 Population Cohorts', journal: 'Am J Epidemiol', year: 2018, doi: '10.1093/aje/kwx345', pmid: '29099919' },
    { authors: 'Yang J, Christophi CA, Farioli A et al.', title: 'Association Between Push-up Exercise Capacity and Future Cardiovascular Events Among Active Adult Men', journal: 'JAMA Netw Open', year: 2019, doi: '10.1001/jamanetworkopen.2018.8341', pmid: '30768197' },
    { authors: 'Podsiadlo D, Richardson S', title: 'The timed "Up & Go": a test of basic functional mobility for frail elderly persons', journal: 'J Am Geriatr Soc', year: 1991, doi: '10.1111/j.1532-5415.1991.tb01616.x', pmid: '1991946' },
  ],
}

// ══════════════════════════════════════════════════════
// Global key insights
// ══════════════════════════════════════════════════════
export const globalKeyInsights: { title: string; description: string; reference: string }[] = [
  {
    title: 'Pouvez-vous vous lever du sol sans les mains ?',
    description: 'Ce test simple — s\'asseoir par terre et se relever sans s\'aider des mains — prédit la longévité : chaque point perdu sur ce test multiplie le risque de mortalité par 1,2. Maintenir sa mobilité, c\'est maintenir son autonomie pour les décennies à venir.',
    reference: 'de Brito et al., 2012, European Journal of Preventive Cardiology',
  },
  {
    title: 'Les muscles : votre meilleure assurance vieillesse',
    description: 'On perd naturellement de la masse musculaire à partir de 30 ans, et ça s\'accélère avec l\'âge. Mais le renforcement musculaire inverse ce processus à tout âge — même après 90 ans. 2 séances par semaine suffisent pour des bénéfices significatifs sur la santé et l\'autonomie.',
    reference: 'Fiatarone et al., 1994, NEJM',
  },
  {
    title: 'L\'équilibre : le sens oublié de la longévité',
    description: 'Les chutes sont la première cause de mortalité accidentelle après 65 ans. Pourtant, 6 semaines d\'exercices d\'équilibre réduisent ce risque de 40 %. C\'est l\'un des investissements santé les plus efficaces et les moins connus.',
    reference: 'Sherrington et al., 2019, Cochrane Review',
  },
]

// ══════════════════════════════════════════════════════
// API
// ══════════════════════════════════════════════════════

const allReports: SectionReport[] = [
  mobiliteStatiqueReport,
  mobiliteActiveReport,
  proprioceptionReport,
  gainageReport,
  prepaPhysiqueReport,
]

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
// Full Report Generator
// ══════════════════════════════════════════════════════

export interface StrengthItem { sectionId: string; title: string; pct: number; praise: string; science: string; reference: string }
export interface WeaknessItem { sectionId: string; title: string; pct: number; level: string; concern: string; science: string; reference: string; triggeredInsights: { questionId: string; insight: string; recommendation: string }[] }
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
    return { sectionId: r.sectionId, title: r.title, pct: r.pct, score: r.score, maxScore: r.maxScore, level: rec.level, recommendationTitle: rec.title, recommendationText: rec.text, context: report.context, triggeredInsights: triggered.map(t => ({ questionId: t.questionId, insight: t.insight, recommendation: t.recommendation })), references: report.references }
  }).filter(Boolean)

  for (const r of sectionResults) {
    const report = getSectionReport(r.sectionId)
    if (!report) continue
    const rec = getSectionRecommendation(report, r.pct)
    const triggered = getTriggeredInsights(report, scores)
    const ref0 = report.references[0] ? `${report.references[0].authors.split(',')[0]} et al., ${report.references[0].year}` : ''
    if (r.pct >= 60) {
      strengths.push({ sectionId: r.sectionId, title: r.title, pct: r.pct, praise: rec.text, science: report.context.split('.').slice(0, 2).join('.') + '.', reference: ref0 })
    } else {
      weaknesses.push({ sectionId: r.sectionId, title: r.title, pct: r.pct, level: rec.level, concern: rec.text, science: report.context, reference: ref0, triggeredInsights: triggered.map(t => ({ questionId: t.questionId, insight: t.insight, recommendation: t.recommendation })) })
    }
  }
  weaknesses.sort((a, b) => a.pct - b.pct)

  const phase1: { action: string; why: string; sectionId: string }[] = []
  const phase2: { action: string; why: string; sectionId: string }[] = []
  const phase3: { action: string; why: string; sectionId: string }[] = []
  for (const w of weaknesses) {
    for (const ti of w.triggeredInsights) {
      const short = ti.recommendation.split('.').slice(0, 2).join('.') + '.'
      if (w.pct < 30) phase1.push({ action: short, why: ti.insight, sectionId: w.sectionId })
      else phase2.push({ action: short, why: ti.insight, sectionId: w.sectionId })
    }
    if (w.triggeredInsights.length === 0) {
      phase1.push({ action: w.concern.split('.').slice(0, 2).join('.') + '.', why: `Score ${w.title} : ${w.pct}%`, sectionId: w.sectionId })
    }
  }
  const actionPlan: ActionPhase[] = []
  if (phase1.length > 0) actionPlan.push({ phase: 1, phaseTitle: 'Actions immédiates', timeframe: 'Semaines 1-2', actions: phase1.slice(0, 5) })
  if (phase2.length > 0) actionPlan.push({ phase: 2, phaseTitle: 'Consolidation', timeframe: 'Semaines 3-8', actions: phase2.slice(0, 5) })
  if (phase3.length > 0) actionPlan.push({ phase: 3, phaseTitle: 'Suivi médical', timeframe: 'À planifier', actions: phase3.slice(0, 3) })
  if (actionPlan.length === 0) actionPlan.push({ phase: 1, phaseTitle: 'Maintien des acquis', timeframe: 'En continu', actions: [{ action: 'Maintenez vos routines de mobilité et de renforcement.', why: 'Vos scores sont bons — continuez vos pratiques actuelles.', sectionId: '' }] })

  return { strengths, weaknesses, actionPlan, globalInsights: globalKeyInsights, sectionReports }
}
