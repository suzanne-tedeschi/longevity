// ──────────────────────────────────────────────────────
// Bilan Nutrition — Compte-rendu
// Basé sur les approches de Denis Riché, Sylvain Druguet et Anthony Berthou
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
  /** Section ID matching bilan-nutrition-data section IDs */
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
    /** Score ≤ seuil → insight s'active (for positive-scored questions: lower = worse) */
    triggerMaxScore?: number
    /** Score ≥ seuil → insight s'active (for inverted-scored questions: higher = worse, e.g. digestif 0=best) */
    triggerMinScore?: number
    insight: string
    recommendation: string
    action?: string
    /** Action alternative pour régime végétarien/pescétarien */
    actionVegetarian?: string
    /** Action alternative pour régime vegan */
    actionVegan?: string
    /** Explication scientifique du bénéfice de l'action (pour le plan d'action "Pourquoi") */
    actionWhy?: string
    /** Explication "Pourquoi" alternative pour régime végétarien/pescétarien */
    actionWhyVegetarian?: string
    /** Explication "Pourquoi" alternative pour régime vegan */
    actionWhyVegan?: string
  }[]
  /** Références du domaine */
  references: ScientificReference[]
}

// ══════════════════════════════════════════════════════
// DIGESTIF — GSRS
// ══════════════════════════════════════════════════════

const refluxReport: SectionReport = {
  sectionId: 'reflux',
  context:
    'Le reflux n\'est pas qu\'un désordre mécanique : il traduit une perturbation des contractions naturelles de l\'estomac, souvent amplifiée par le stress chronique (via les hormones de stress comme l\'adrénaline), ou par des fragments de protéines mal digérées du blé ou du lait qui irritent les récepteurs gastriques.',
  strengthLabel: 'Votre estomac est serein, sans reflux',
  weaknessLabel: 'Reflux à apaiser',
  scienceNote: 'L\'absence de reflux indique que votre estomac se contracte normalement et sécrète la bonne quantité d\'acide, deux marqueurs clés d\'une digestion haute en bonne santé.',
  recommendations: [
    { maxPct: 33, level: 'alerte', title: 'Reflux fréquent', text: 'Vos symptômes de reflux sont réguliers. Mangez lentement dans le calme et sans écran : activer l\'état de repos (système nerveux parasympathique) est indispensable aux mouvements naturels de l\'estomac. Évitez les repas dans les 3h précédant le coucher et réduisez les glucides raffinés et les produits laitiers industriels qui irritent les récepteurs gastriques.' },
    { maxPct: 66, level: 'vigilance', title: 'Reflux modéré', text: 'Des symptômes ponctuels de reflux méritent votre attention. Mastiquez lentement, mangez assis dans le calme, et évitez de vous allonger juste après les repas.' },
    { maxPct: 90, level: 'bon', title: 'Reflux léger', text: 'Peu de reflux. Continuez à manger dans le calme et à bien mastiquer.' },
    { maxPct: 100, level: 'excellent', title: 'Pas de reflux', text: 'Aucun signe de reflux. Excellent indicateur de santé digestive haute.' },
  ],
  questionInsights: [
    { questionId: 'ref-1', triggerMinScore: 66, insight: 'Vos brûlures d\'estomac sont fréquentes.', recommendation: 'Une acidité excessive récurrente peut être liée au stress (adrénaline et cortisol) ou à une mauvaise dégradation de certaines protéines. Évitez café à jeun, alcool et sucres raffinés. Mangez dans le calme, car l\'état de repos régule la sécrétion d\'acide par l\'estomac.', action: 'Évitez le café à jeun et mangez dans le calme, sans écran.', actionWhy: 'Manger dans le calme active le système nerveux "repos et digestion" (parasympathique), qui régule les contractions de l\'estomac et la sécrétion d\'acide. Résultat : moins d\'irritation et moins de brûlures.' },
    { questionId: 'ref-2', triggerMinScore: 66, insight: 'Vous présentez des régurgitations acides fréquentes.', recommendation: 'Évitez de manger dans les 3h avant le coucher. Réduisez les aliments fermentescibles (pain blanc, laitages industriels) dont la mauvaise digestion produit des peptides qui perturbent la valve œsophagienne.', action: 'Arrêtez de manger au moins 3h avant le coucher.', actionWhy: 'L\'estomac met 2 à 4 heures à se vider. Manger trop tard maintient de la nourriture dans l\'estomac au moment du coucher, ce qui crée une pression qui remonte dans l\'œsophage et perturbe la réparation de la muqueuse pendant le sommeil.' },
  ],
  references: [
    { authors: 'Riché D', title: 'Trépied intestinal et pathophysiologie digestive', journal: 'Référentiel nutritionnel', year: 2024 },
    { authors: 'Druguet S', title: 'Neuro-nutrition et comportement alimentaire', journal: 'Référentiel nutritionnel', year: 2024 },
  ],
}

const douleursReport: SectionReport = {
  sectionId: 'douleurs-abdominales',
  strengthLabel: 'Muqueuse digestive sans inflammation notable',
  weaknessLabel: 'Douleurs abdominales liées à l\'inflammation',
  scienceNote: 'Une paroi intestinale intègre forme un bouclier étanche : les toxines bactériennes restent dans l\'intestin et ne déclenchent pas les cascades chimiques qui causent douleur et inflammation dans tout le corps.',
  context:
    "Les douleurs abdominales signalent une inflammation de la muqueuse digestive. Une barrière intestinale fragilisée laisse passer des toxines issues de bactéries intestinales (LPS) dans la circulation, déclenchant une cascade de messagers chimiques qui amplifient l'inflammation (TNF-alpha, IL-6) et qui sensibilisent les récepteurs de la douleur. Un excès d'oméga-6 (acides gras pro-inflammatoires) aggrave ce processus en fournissant le substrat des prostaglandines de la douleur (série 2, molécules qui provoquent la douleur).",
  recommendations: [
    { maxPct: 33, level: 'alerte', title: 'Douleurs fréquentes', text: 'Vos douleurs abdominales sont régulières. Réduisez les aliments ultra-transformés et l\'excès d\'oméga-6 (huile de tournesol, fritures) qui alimentent l\'inflammation muqueuse via la voie COX-2. Augmentez les oméga-3 (sardines, maquereau, huile de lin) pour rééquilibrer la balance inflammatoire.' },
    { maxPct: 66, level: 'vigilance', title: 'Douleurs modérées', text: 'Des douleurs abdominales régulières méritent attention. Identifiez vos aliments déclencheurs sur 2 semaines. Intégrez des oméga-3 (sardines, noix, huile de colza) pour inhiber la production de prostaglandines inflammatoires.' },
    { maxPct: 90, level: 'bon', title: 'Douleurs légères', text: 'Des douleurs occasionnelles et gérables. Maintenez un apport régulier en oméga-3 et en légumes colorés pour protéger la muqueuse.' },
    { maxPct: 100, level: 'excellent', title: 'Pas de douleur', text: 'Aucune douleur abdominale. Excellent indicateur d\'une muqueuse intègre et d\'un équilibre inflammatoire maîtrisé.' },
  ],
  questionInsights: [
    { questionId: 'doul-1', triggerMinScore: 66, insight: 'Des douleurs à l\'estomac fréquentes évoquent une inflammation de la muqueuse haute.', recommendation: 'Mangez dans le calme, car le stress (adrénaline et cortisol) perturbe les contractions naturelles de l\'estomac. Réduisez café à jeun, alcool et glucides raffinés qui favorisent le déséquilibre des bactéries intestinales.', action: 'Supprimez les écrans aux repas et mangez assis dans le calme.', actionWhy: 'Manger dans le calme active le système nerveux "repos et digestion", qui réduit le cortisol et l\'adrénaline (les hormones de stress). Ces hormones perturbent les contractions de l\'estomac et amplifient la sensibilité à la douleur abdominale.' },
    { questionId: 'doul-2', triggerMinScore: 66, insight: 'Les douleurs de faim récurrentes signalent souvent une glycémie instable ou une acidité excessive.', recommendation: 'Intégrez des protéines et des fibres à chaque repas pour stabiliser la glycémie. Les protéines déclenchent la production de glucose par l\'intestin, un signal de satiété durable qui régule aussi l\'acidité.', action: 'Ajoutez une source de protéines et des fibres à chaque repas.', actionWhy: 'Les protéines déclenchent un mécanisme où l\'intestin produit lui-même du glucose, ce qui envoie au cerveau un signal de satiété profond et durable. Les fibres nourrissent les bonnes bactéries qui produisent du butyrate, un composé qui renforce l\'étanchéité de la paroi intestinale et réduit l\'inflammation.' },
    { questionId: 'doul-3', triggerMinScore: 66, insight: 'Des nausées fréquentes peuvent refléter un stress gastrique ou un transit perturbé.', recommendation: 'Mangez lentement, en petites quantités, dans un environnement calme sans écran. Manger devant un écran active le mode stress et bloque la sécrétion d\'enzymes digestives, aggravant les nausées.', action: 'Réduisez la taille des repas et mangez lentement, sans écran.', actionWhy: 'Manger lentement et en petites quantités permet à l\'amylase salivaire de prédigérer les glucides, réduisant la charge sur l\'estomac. Moins de fermentation résiduelle = moins de perturbations de motilité qui déclenchent les nausées.' },
  ],
  references: [
    { authors: 'Riché D', title: 'Inflammation muqueuse et douleurs abdominales', journal: 'Référentiel nutritionnel', year: 2024 },
  ],
}

const indigestionReport: SectionReport = {
  sectionId: 'indigestion',
  strengthLabel: 'Digestion fluide, microbiote équilibré',
  weaknessLabel: 'Fermentation excessive dans l\'intestin',
  scienceNote: 'Une bonne digestion reflète un microbiote (les milliards de bactéries dans votre intestin) équilibré et des enzymes digestives efficaces, deux conditions essentielles à l\'absorption des nutriments et à la production de butyrate, le composé qui nourrit vos cellules intestinales.',
  context:
    "Les ballonnements, gaz et éructations traduisent une fermentation bactérienne excessive dans le côlon, signe que des aliments insuffisamment digérés y arrivent. La bordure en brosse intestinale (surface de l'intestin chargée d'absorber les nutriments), fragilisée par le stress ou une alimentation dénaturée, perd en efficacité enzymatique (disaccharidases et peptidases, enzymes qui digèrent les sucres et protéines). Les glucides partiellement digérés subissent alors une fermentation produisant méthane, hydrogène et CO2 (gaz intestinaux).",
  recommendations: [
    { maxPct: 33, level: 'alerte', title: 'Indigestion sévère', text: 'Vos symptômes d\'indigestion sont importants. Ralentissez votre mastication (20 à 30 fois par bouchée) et supprimez les écrans aux repas : l\'état de calme est indispensable à la production d\'amylase salivaire (enzyme digestive de la bouche) et d\'enzymes gastriques. Réduisez les glucides raffinés qui nourrissent les bactéries fermentatives.' },
    { maxPct: 66, level: 'vigilance', title: 'Indigestion modérée', text: 'Des troubles digestifs réguliers méritent attention. Privilégiez les légumes cuits aux crudités, faites tremper les légumineuses 12h avant cuisson, et mastiquez lentement à chaque repas.' },
    { maxPct: 90, level: 'bon', title: 'Bonne digestion', text: 'Peu de troubles digestifs. Diversifiez vos végétaux et intégrez des aliments lactofermentés pour enrichir votre microbiote.' },
    { maxPct: 100, level: 'excellent', title: 'Digestion excellente', text: 'Excellente digestion. Signe d\'un microbiote équilibré et d\'une bonne sécrétion enzymatique.' },
  ],
  questionInsights: [
    { questionId: 'ind-2', triggerMinScore: 66, insight: 'Des ballonnements fréquents traduisent un déséquilibre des bactéries intestinales.', recommendation: 'Réduisez les glucides fermentescibles (oignon, ail, pain blanc, laitages industriels) et introduisez progressivement des fibres prébiotiques (légumineuses cuites, légumes) pour rééquilibrer les bactéries intestinales.', action: 'Réduisez oignon, ail, pain blanc et laitages industriels pendant 2 semaines. Tenez un journal alimentaire-symptômes : notez ce que vous mangez et vos inconforts 1 à 2h après chaque repas pour identifier vos déclencheurs personnels.', actionWhy: 'Réduire les substrats fermentescibles prive les bactéries productrices de gaz de leur carburant, permettant au microbiote de se rééquilibrer et à la muqueuse intestinale de récupérer.' },
    { questionId: 'ind-4', triggerMinScore: 66, insight: 'Des flatulences excessives indiquent une fermentation bactérienne importante.', recommendation: 'Faites toujours tremper les légumineuses 12h avant cuisson. Réduisez temporairement les aliments très fermentescibles et réintroduisez-les progressivement pour habituer votre microbiote.', action: 'Faites tremper les légumineuses 12h avant cuisson, jetez l\'eau de trempage, et rincez avant de cuire.', actionWhy: 'Le trempage dégrade les phytates et les oligosaccharides fermentescibles (GOS, fructanes) qui nourrissent les bactéries productrices de méthane et d\'hydrogène responsables des flatulences et distensions.' },
  ],
  references: [
    { authors: 'Riché D', title: 'Fermentation intestinale et dysbiose', journal: 'Référentiel nutritionnel', year: 2024 },
    { authors: 'Druguet S', title: 'Mastication et sécrétion enzymatique', journal: 'Référentiel nutritionnel', year: 2024 },
  ],
}

const diarrheeReport: SectionReport = {
  sectionId: 'diarrhee',
  strengthLabel: 'Transit sain, microbiote protégé',
  weaknessLabel: 'Transit trop accéléré à stabiliser',
  scienceNote: 'Un transit normal témoigne d\'un microbiote (les bactéries intestinales) résilient et d\'une paroi intestinale protégée par sa couche de mucus. Fait peu connu : l\'intestin produit 95 % de la sérotonine du corps, l\'hormone du bien-être.',
  context:
    "La diarrhée fonctionnelle signale une réponse de clairance face à une agression de la muqueuse. Une dysbiose (déséquilibre du microbiote), notamment un excès de Candida albicans (champignon intestinal), secrète des enzymes protéolytiques qui dégradent le mucus protecteur et attaquent les jonctions serrées (structures qui maintiennent l'étanchéité de l'intestin). La réaction immunitaire locale (mastocytes libérant de l'histamine, cellules qui déclenchent l'inflammation) provoque une exsudation liquidienne dans la lumière intestinale (perte d'eau dans l'intestin).",
  recommendations: [
    { maxPct: 33, level: 'alerte', title: 'Transit accéléré fréquent', text: 'Votre transit est régulièrement accéléré. Réduisez les aliments ultra-transformés dont les additifs (émulsifiants) détruisent la couche de mucus protecteur, et supprimez les édulcorants qui modifient la composition du microbiote. Augmentez les fibres solubles (avoine, légumes cuits) pour nourrir les bactéries protectrices.' },
    { maxPct: 66, level: 'vigilance', title: 'Transit légèrement accéléré', text: 'Un transit accéléré régulier mérite attention. Identifiez vos déclencheurs (laitages, sucres raffinés, édulcorants) et intégrez des aliments lactofermentés pour restaurer l\'équilibre du microbiote.' },
    { maxPct: 90, level: 'bon', title: 'Transit normal', text: 'Transit satisfaisant. Maintenez un apport en fibres équilibré et une bonne hydratation.' },
    { maxPct: 100, level: 'excellent', title: 'Transit optimal', text: 'Aucun signe de transit accéléré. Excellent signe d\'un microbiote en bonne santé.' },
  ],
  questionInsights: [
    { questionId: 'dia-3', triggerMinScore: 66, insight: 'Des urgences fécales fréquentes signalent une sensibilité accrue ou une inflammation locale.', recommendation: 'Réduisez les facteurs irritants (alcool, café, sucres raffinés, édulcorants) et privilégiez des repas réguliers dans le calme. Le mode repos activé au repas régule naturellement les contractions intestinales.', action: 'Supprimez alcool, café en excès, sucres raffinés et édulcorants.', actionWhy: 'L\'alcool fragilise directement les cellules intestinales. Les édulcorants (aspartame, sucralose) favorisent les mauvaises bactéries dans l\'intestin. Supprimer ces irritants permet à la couche de mucus protecteur de se reconstituer en 2 à 4 semaines.' },
  ],
  references: [
    { authors: 'Riché D', title: 'Dysbiose et perméabilité intestinale', journal: 'Référentiel nutritionnel', year: 2024 },
  ],
}

const constipationReport: SectionReport = {
  sectionId: 'constipation',
  strengthLabel: 'Transit régulier, côlon actif',
  weaknessLabel: 'Transit ralenti à stimuler',
  scienceNote: 'Un transit régulier assure l\'évacuation des déchets métaboliques et des endotoxines, réduisant leur temps de contact avec la muqueuse et la production de composés pro-inflammatoires dans le côlon.',
  context:
    "La constipation résulte souvent d'une faiblesse des muscles de l'intestin, aggravée par un manque de relaxation. L'acidose tissulaire liée à une alimentation trop acidifiante (protéines animales industrielles, sucres raffinés) altère le fonctionnement enzymatique et ralentit les mouvements de l'intestin. Les fibres solubles, en produisant des acides gras à chaîne courte (butyrate, propionate, molécules qui nourrissent les cellules de l'intestin) via la fermentation, soutiennent les mouvements du côlon.",
  recommendations: [
    { maxPct: 33, level: 'alerte', title: 'Constipation fréquente', text: 'Votre transit est régulièrement ralenti. Augmentez progressivement les fibres (légumes, légumineuses, graines de lin) et hydratez-vous (1,5 à 2L/jour). L\'activité physique quotidienne stimule directement la motilité colique. Favorisez les aliments alcalinisants (fruits, légumes colorés) pour réduire l\'acidose tissulaire.' },
    { maxPct: 66, level: 'vigilance', title: 'Constipation modérée', text: 'Un transit ralenti mérite votre attention. Intégrez 2 c. à soupe de graines de lin dans un verre d\'eau chaque matin. Profitez des 20-30 minutes après le petit-déjeuner pour aller aux toilettes, car le côlon est alors naturellement le plus actif.' },
    { maxPct: 90, level: 'bon', title: 'Transit satisfaisant', text: 'Transit globalement régulier. Maintenez des fibres variées et une bonne hydratation.' },
    { maxPct: 100, level: 'excellent', title: 'Transit optimal', text: 'Aucun signe de constipation. Excellent équilibre entre fibres, hydratation et motilité intestinale.' },
  ],
  questionInsights: [
    { questionId: 'con-3', triggerMinScore: 66, insight: 'Une sensation de vidange incomplète fréquente peut indiquer un intestin paresseux.', recommendation: 'En première intention : placez un petit tabouret sous les pieds aux toilettes, car cette position facilite naturellement le passage. Hydratez-vous suffisamment et réduisez les aliments ultra-transformés dont les additifs perturbent les contractions du côlon.', action: 'Placez un petit tabouret (20-25 cm) sous les pieds aux toilettes pour mettre les genoux au-dessus des hanches.', actionWhy: 'La position accroupie redresse l\'angle anorectal et relâche le muscle puborectal, réduisant l\'effort d\'évacuation de 30 à 40 %. C\'est la position anatomiquement optimale pour la défécation, retrouvée dans toutes les cultures sans sièges surélevés.' },
  ],
  references: [
    { authors: 'Riché D', title: 'Constipation, PRAL et motilité intestinale', journal: 'Référentiel nutritionnel', year: 2024 },
    { authors: 'Berthou A', title: 'Énergie cellulaire et fibres alimentaires', journal: 'Référentiel nutritionnel', year: 2024 },
  ],
}

// ══════════════════════════════════════════════════════
// ALIMENTAIRE
// ══════════════════════════════════════════════════════

const habitudesReport: SectionReport = {
  sectionId: 'habitudes-generales',
  strengthLabel: 'Vos rituels alimentaires soutiennent votre digestion',
  weaknessLabel: 'Habitudes alimentaires à restructurer',
  scienceNote: 'Des horaires de repas réguliers synchronisent le Complexe Migratoire Moteur (le mécanisme naturel de nettoyage intestinal entre les repas) et stabilisent les bactéries intestinales en leur offrant des phases d\'activité et de repos prévisibles.',
  context:
    'Les comportements alimentaires modulent profondément la digestion et le métabolisme. Des horaires irréguliers perturbent le Complexe Migratoire Moteur, responsable du nettoyage intestinal entre les repas. Manger devant un écran active le système sympathique, bloquant la sécrétion d\'acide chlorhydrique et d\'enzymes, et empêchant le cerveau d\'enregistrer la valeur hédonique du repas, ce qui pousse à manger bien au-delà de la satiété.',
  recommendations: [
    { maxPct: 40, level: 'alerte', title: 'Habitudes à revoir', text: 'Plusieurs de vos habitudes alimentaires perturbent votre digestion et votre métabolisme. Priorisez trois ajustements : un petit-déjeuner incluant des protéines (pour relancer la production de dopamine le matin), des repas à heures régulières (pour respecter le cycle de nettoyage naturel de l\'intestin), et la suppression des écrans à table.' },
    { maxPct: 60, level: 'vigilance', title: 'Habitudes à optimiser', text: 'Quelques ajustements peuvent avoir un impact significatif. Concentrez-vous sur la mastication lente (20 à 30 fois par bouchée) : elle stimule la production d\'amylase salivaire (enzyme digestive de la bouche) et envoie le signal de satiété au cerveau après 20 minutes.' },
    { maxPct: 85, level: 'bon', title: 'Bonnes habitudes', text: 'Vos habitudes alimentaires de base sont solides. Peaufinez les derniers points pour maximiser l\'assimilation des nutriments.' },
    { maxPct: 100, level: 'excellent', title: 'Habitudes exemplaires', text: 'Vos habitudes alimentaires sont excellentes. Vous optimisez la digestion et la régulation métabolique.' },
  ],
  questionInsights: [
    { questionId: 'hab-1', triggerMaxScore: 0, insight: 'Vous ne prenez pas de petit-déjeuner quotidien.', recommendation: 'Un petit-déjeuner protéiné relance la production de dopamine (l\'hormone de la motivation) et synchronise vos horloges biologiques internes. Même léger (œuf, noix, fruit), il stabilise la glycémie pour toute la matinée.', action: 'Prenez un petit-déjeuner protéiné chaque matin (œuf, noix ou fromage).', actionWhy: 'Les protéines du matin fournissent les acides aminés nécessaires pour fabriquer la sérotonine (hormone du bien-être) et la dopamine (hormone de la motivation), stabilisant l\'humeur et l\'énergie. Elles synchronisent aussi l\'horloge interne du foie et du pancréas avec le rythme naturel de la journée.' },
    { questionId: 'hab-3', triggerMaxScore: 0, insight: 'Vous grignotez entre les repas.', recommendation: 'Le grignotage maintient une sécrétion d\'insuline permanente, empêchant la combustion des graisses (lipolyse) et surchargeant le foie. Le système digestif a besoin de pauses complètes pour activer son cycle de nettoyage naturel entre les repas. Espacez vos repas d\'au moins 4h.', action: 'Espacez vos repas d\'au moins 4h, sans aucun grignotage entre les deux.', actionWhy: 'Les pauses entre les repas permettent au Complexe Migratoire Moteur de s\'activer, un mécanisme naturel qui balaie les résidus alimentaires dans l\'intestin et maintient les bonnes bactéries en équilibre. Le grignotage bloque ce nettoyage et force le pancréas à sécréter de l\'insuline en continu, ce qui empêche votre corps de brûler ses graisses.' },
    { questionId: 'hab-4', triggerMaxScore: 0, insight: 'Vous mangez trop vite, sans bien mastiquer.', recommendation: 'La mastication est le premier acte digestif : elle produit l\'amylase salivaire (enzyme digestive de la bouche) et déclenche le signal de satiété. Le cerveau met 20 minutes pour intégrer ce signal ; manger vite court-circuite ce mécanisme et pousse à manger bien plus que nécessaire.', action: 'Mastiquez chaque bouchée au moins 20 fois avant d\'avaler. Posez vos couverts entre chaque bouchée pour ralentir.', actionWhy: 'Bien mâcher produit de la salive riche en amylase, une enzyme qui commence à digérer les glucides (sucres, pain, riz) dès la bouche. Les morceaux plus petits arrivent à l\'estomac déjà en partie digérés, ce qui réduit la fermentation bactérienne responsable des ballonnements.' },
    { questionId: 'hab-7', triggerMaxScore: 0, insight: 'Vous sautez souvent des repas.', recommendation: 'Sauter des repas perturbe la régulation de l\'insuline et favorise la compensation excessive au repas suivant. Des horaires réguliers (± 30 min) préservent le cycle naturel de nettoyage intestinal et maintiennent un microbiote équilibré.', action: 'Maintenez des horaires de repas réguliers (±30 min), même les week-ends.', actionWhy: 'Des horaires prévisibles (±30 min) maintiennent le foie et le pancréas synchronisés avec le rythme naturel de la journée, ce qui optimise la production d\'enzymes digestives et la gestion du taux de sucre dans le sang à chaque repas.' },
    { questionId: 'hab-8', triggerMaxScore: 0, insight: 'Vous mangez devant un écran.', recommendation: 'L\'écran active le mode stress, bloquant la digestion et la sécrétion d\'enzymes. Le cerveau distrait n\'enregistre pas le repas et ne déclenche pas les signaux de satiété, et on mange alors mécaniquement, sans s\'en apercevoir.', action: 'Supprimez systématiquement les écrans pendant les repas.', actionWhy: 'Sans écran, le cerveau "enregistre" pleinement le repas et déclenche les signaux de satiété. Il active aussi le système nerveux "repos et digestion", indispensable à la production d\'acide gastrique et d\'enzymes. Résultat : une meilleure digestion et une satiété qui arrive vraiment.' },
  ],
  references: [
    { authors: 'Druguet S', title: 'Neuro-nutrition et comportement alimentaire', journal: 'Référentiel nutritionnel', year: 2024 },
    { authors: 'Riché D', title: 'Complexe Migratoire Moteur et chrono-nutrition', journal: 'Référentiel nutritionnel', year: 2024 },
  ],
}

const macroReport: SectionReport = {
  sectionId: 'macronutriments',
  strengthLabel: 'Bon équilibre protéines · glucides · graisses',
  weaknessLabel: 'Déséquilibre en protéines, glucides ou graisses',
  scienceNote: 'Un bon équilibre entre protéines, glucides et graisses stabilise le taux de sucre dans le sang (glycémie), prévient l\'insulinorésistance (quand les cellules ne répondent plus bien à l\'insuline) et maintient un niveau d\'inflammation bas, marqueur clé du vieillissement cellulaire ralenti.',
  context:
    "L'équilibre entre macronutriments (protéines, glucides, lipides) conditionne la réponse insulinique (gestion du sucre par l'insuline) et le niveau inflammatoire. Un excès de glucides raffinés provoque des pics hyperglycémiques (montées rapides de sucre dans le sang) qui saturent les mitochondries (centrales énergétiques des cellules) et instaurent progressivement une insulinorésistance (diminution de la sensibilité à l'insuline). L'excès d'oméga-6 (huiles industrielles, fritures, acides gras pro-inflammatoires) par rapport aux oméga-3 alimente l'inflammation muqueuse. Le ratio optimal est inférieur à 4/1, alors qu'il avoisine 15/1 dans l'alimentation occidentale.",
  recommendations: [
    { maxPct: 40, level: 'alerte', title: 'Déséquilibre marqué', text: 'Votre alimentation présente des déséquilibres importants. Priorisez : des protéines à chaque repas (elles déclenchent la production de glucose par l\'intestin, le signal de satiété le plus durable), le remplacement des féculents blancs par des versions complètes, et l\'intégration d\'oméga-3 chaque semaine (sardines, maquereau, huile de lin).' },
    { maxPct: 60, level: 'vigilance', title: 'Profil à optimiser', text: 'Quelques déséquilibres à corriger. Visez l\'assiette équilibrée : légumes colorés + protéines + glucides complexes. Remplacez l\'huile de tournesol par de l\'huile d\'olive ou de colza pour rééquilibrer le ratio oméga-6/oméga-3.' },
    { maxPct: 85, level: 'bon', title: 'Bon équilibre', text: 'Votre profil macronutrimentaire est globalement bon. Maintenez la diversité des sources protéiques et la qualité des glucides.' },
    { maxPct: 100, level: 'excellent', title: 'Équilibre optimal', text: 'Excellent profil macronutrimentaire. Vous optimisez la satiété, l\'énergie cellulaire et la protection inflammatoire.' },
  ],
  questionInsights: [
    { questionId: 'mac-1', triggerMaxScore: 0, insight: 'Apport protéique insuffisant à certains repas.', recommendation: 'Les protéines génèrent des petits fragments (di- et tri-peptides) qui déclenchent la production de glucose par l\'intestin, le signal de satiété le plus puissant et le plus durable. Elles fournissent aussi le tryptophane (précurseur de la sérotonine) et la tyrosine (précurseur de la dopamine).', action: 'Ajoutez une source de protéines à chaque repas (viande, poisson, œuf, légumineuses).', actionVegetarian: 'Ajoutez une source de protéines à chaque repas (œufs, légumineuses, produits laitiers, tofu ou tempeh).', actionVegan: 'Ajoutez une source de protéines à chaque repas (légumineuses, tofu, tempeh, seitan ou graines de courge).', actionWhy: 'Les protéines déclenchent un mécanisme où l\'intestin produit du glucose, envoyant au cerveau le signal de satiété le plus profond et le plus durable. Elles fournissent aussi les précurseurs de la sérotonine (bien-être) et de la dopamine (motivation), essentiels pour l\'équilibre émotionnel de la journée.' },
    { questionId: 'mac-3', triggerMaxScore: 0, insight: 'Consommation quotidienne de féculents raffinés.', recommendation: 'Les glucides raffinés (pain blanc, pâtes blanches) provoquent des pics de glycémie importants. Avec le temps, les cellules ne répondent plus aussi bien à l\'insuline, l\'hormone qui régule le sucre dans le sang. Remplacez progressivement par des versions complètes ou au levain.', action: 'Remplacez pain blanc et pâtes blanches par leurs versions complètes ou au levain.', actionWhy: 'Les glucides complets contiennent des fibres qui ralentissent l\'absorption du sucre dans le sang. Éviter les pics de glycémie (taux de sucre sanguin) répétés protège les cellules contre la surcharge énergétique qui installe progressivement l\'insulinorésistance, un marqueur central du vieillissement métabolique.' },
    { questionId: 'mac-5', triggerMaxScore: 0, insight: 'Consommation excessive d\'aliments ultra-transformés.', recommendation: 'Les aliments ultra-transformés ont été tellement modifiés industriellement que leur digestion est immédiate et explosive, générant un stress oxydatif important. Notre corps ne les reconnaît pas comme de vrais aliments.', action: 'Remplacez un aliment industriel par jour par son équivalent brut ou fait maison.', actionWhy: 'Les aliments bruts préservent leur structure naturelle, qui régule la vitesse d\'absorption des nutriments. Quand cette structure est détruite industriellement, le sucre et les graisses passent trop vite dans le sang, créant un stress pour les cellules que notre corps n\'est pas équipé pour gérer de façon répétée.' },
    { questionId: 'mac-8', triggerMaxScore: 0, insight: 'Apport insuffisant en oméga-3.', recommendation: 'Les oméga-3 (EPA/DHA) s\'intègrent dans les membranes de nos cellules, les rendant plus fluides et moins inflammatoires. Ils produisent des molécules qui éteignent activement les foyers d\'inflammation. Visez 2 portions de petits poissons gras par semaine (sardines, maquereau).', action: 'Consommez des petits poissons gras 2x par semaine (sardines, maquereau, hareng).', actionVegetarian: 'Consommez 2 c. à soupe de graines de lin moulues et une poignée de noix par jour (meilleures sources végétales d\'oméga-3).', actionVegan: 'Consommez 2 c. à soupe de graines de lin moulues et une poignée de noix par jour (meilleures sources végétales d\'oméga-3).', actionWhy: 'Les oméga-3 s\'intègrent dans les membranes de vos cellules, les rendant plus souples et moins inflammatoires. Ils bloquent une enzyme clé de l\'inflammation (COX-2) et produisent des molécules qui éteignent activement les foyers inflammatoires, contrairement aux anti-douleurs classiques qui les masquent seulement.', actionWhyVegetarian: 'Les graines de lin et les noix apportent de l\'ALA (oméga-3 végétal). Le corps le convertit partiellement en EPA/DHA. Pour compléter, une algue DHA en complément alimentaire est l\'alternative la plus directe aux poissons gras.', actionWhyVegan: 'Les graines de lin et les noix apportent de l\'ALA (oméga-3 végétal). Le corps le convertit partiellement en EPA/DHA. Pour compléter, une algue DHA en complément alimentaire est l\'alternative la plus directe aux poissons gras.' },
  ],
  references: [
    { authors: 'Berthou A', title: 'Régulation insulinique et métabolisme mitochondrial', journal: 'Référentiel nutritionnel', year: 2024 },
    { authors: 'Druguet S', title: 'Néoglucogenèse intestinale et satiété', journal: 'Référentiel nutritionnel', year: 2024 },
    { authors: 'Riché D', title: 'Ratio oméga-6/oméga-3 et inflammation', journal: 'Référentiel nutritionnel', year: 2024 },
  ],
}

const microReport: SectionReport = {
  sectionId: 'micronutriments',
  strengthLabel: 'Vitamines et minéraux bien couverts',
  weaknessLabel: 'Déficits en vitamines ou minéraux essentiels',
  scienceNote: 'Le zinc aide à sceller la paroi intestinale, le magnésium participe à plus de 300 réactions chimiques dans le corps (dont la production d\'énergie), et la vitamine D agit comme une hormone qui active plus de 200 gènes immunitaires. Sans ces micronutriments, aucune réparation cellulaire durable n\'est possible.',
  context:
    "Les micronutriments sont les 'bougies d'allumage' de la biochimie humaine : sans eux, aucune cicatrisation muqueuse ni production d'énergie n'est possible. Le Zinc catalyse la fermeture des jonctions serrées intestinales (structures qui maintiennent l'étanchéité de l'intestin), le Magnésium stabilise l'ATP (molécule d'énergie) et intervient dans 300 réactions enzymatiques, la Vitamine D régule l'expression de plus de 200 gènes, et les Folates contrôlent la méthylation (mécanisme épigénétique central de l'inflammation, qui modifie l'expression des gènes sans toucher à l'ADN).",
  recommendations: [
    { maxPct: 40, level: 'alerte', title: 'Carences probables', text: 'Votre profil micronutritionnel est insuffisant sur plusieurs points. Diversifiez immédiatement avec des légumes à chaque repas, des légumineuses 3 fois par semaine et des oléagineux quotidiennement. Sans ce pool micronutritionnel, aucune réparation cellulaire ni énergie durable n\'est possible.' },
    { maxPct: 60, level: 'vigilance', title: 'Apports à améliorer', text: 'Plusieurs micronutriments semblent sous-représentés. Appliquez la règle des couleurs à l\'assiette (légumes variés), assurez-vous d\'une source de zinc (œufs, fruits de mer) et de magnésium (légumineuses, chocolat noir, graines) chaque jour.' },
    { maxPct: 85, level: 'bon', title: 'Apports satisfaisants', text: 'Bon profil micronutritionnel. La diversité alimentaire reste la meilleure stratégie. Veillez à l\'exposition solaire régulière pour couvrir vos besoins en vitamine D.' },
    { maxPct: 100, level: 'excellent', title: 'Profil optimal', text: 'Excellent profil micronutritionnel. Vous couvrez vos besoins en cofacteurs essentiels à la vitalité cellulaire.' },
  ],
  questionInsights: [
    { questionId: 'mic-1', triggerMaxScore: 0, insight: 'Consommation de légumes insuffisante.', recommendation: 'Les légumes apportent des fibres transformées par les bactéries intestinales en butyrate (le carburant principal des cellules du côlon, qui assurent l\'étanchéité de la paroi intestinale). Sans fibres, les bactéries dégradent leur propre couche de protection muqueuse. Visez 2 portions par jour minimum.', action: 'Visez au moins 2 portions de légumes par repas, cuits ou crus.', actionWhy: 'Les fibres végétales sont fermentées par les bactéries intestinales en butyrate, un composé qui nourrit les cellules du côlon et renforce l\'étanchéité de la paroi intestinale. Sans fibres, les bactéries dégradent leur propre couche de mucus protecteur pour survivre, exposant la paroi aux toxines.' },
    { questionId: 'mic-4', triggerMaxScore: 0, insight: 'Apport en fer potentiellement insuffisant.', recommendation: 'Le fer est essentiel au transport d\'oxygène dans le sang et à la production d\'énergie dans les cellules. Une carence se traduit souvent par de la fatigue et une baisse de concentration. Sources : viande rouge 2x/semaine, lentilles et pois chiches avec de la vitamine C pour optimiser l\'absorption.', action: 'Intégrez des lentilles ou de la viande rouge 2x/semaine avec une source de vitamine C (tomate, poivron, citron).', actionVegetarian: 'Intégrez des lentilles, pois chiches ou haricots 3x/semaine avec une source de vitamine C (tomate, poivron, jus de citron) pour maximiser l\'absorption du fer végétal.', actionVegan: 'Intégrez des lentilles, pois chiches ou haricots 3x/semaine avec une source de vitamine C (tomate, poivron, jus de citron) pour maximiser l\'absorption du fer végétal.', actionWhy: 'Le fer est indispensable à l\'hémoglobine (qui transporte l\'oxygène dans le sang) et à la production d\'énergie dans chaque cellule. La vitamine C améliore l\'absorption du fer par l\'intestin : associer les deux multiplie l\'absorption par 3 à 4 fois.' },
    { questionId: 'mic-6', triggerMaxScore: 0, insight: 'Possible déficit en vitamine D.', recommendation: 'La vitamine D fonctionne comme une hormone : elle régule l\'expression de plus de 200 gènes, dont ceux qui contrôlent l\'immunité et la résistance à l\'inflammation. Une exposition solaire quotidienne (15 min) ou un apport alimentaire régulier (poissons gras, jaune d\'œuf) est essentiel.', action: 'Exposez-vous au soleil 15 min/jour (avant-bras et visage découverts) ou consommez des poissons gras et des œufs.', actionVegetarian: 'Exposez-vous au soleil 15 min/jour (avant-bras et visage découverts) ou consommez des œufs et des champignons exposés au soleil. En hiver, envisagez un complément en vitamine D3.', actionVegan: 'Exposez-vous au soleil 15 min/jour (avant-bras et visage découverts). En cas d\'exposition insuffisante, prenez un complément en vitamine D3 d\'origine végétale (extrait de lichen).', actionWhy: 'La vitamine D fonctionne comme une hormone qui régule l\'immunité intestinale et renforce la paroi digestive. Un déficit est associé à une paroi intestinale trop perméable, une résistance affaiblie aux infections et une inflammation chronique discrète mais persistante.' },
    { questionId: 'mic-9', triggerMaxScore: 0, insight: 'Apport en magnésium possiblement insuffisant.', recommendation: 'Le magnésium intervient dans plus de 300 réactions enzymatiques, dont la production d\'énergie cellulaire. Un manque se manifeste souvent par des crampes, des spasmes intestinaux et de la fatigue. Sources : chocolat noir > 85 %, amandes, graines de courge, légumineuses.', action: 'Consommez amandes, graines de courge ou chocolat noir >85% chaque jour.', actionWhy: 'Le magnésium participe à la production d\'énergie dans chaque cellule et stabilise plus de 300 réactions chimiques dans le corps. Un manque provoque crampes, spasmes intestinaux et fatigue, et bloque en plus les effets de la vitamine D, amplifiant ses conséquences négatives.' },
  ],
  references: [
    { authors: 'Riché D', title: 'Micronutrition et homéostasie', journal: 'Référentiel nutritionnel', year: 2024 },
    { authors: 'Berthou A', title: 'Cofacteurs mitochondriaux et énergie cellulaire', journal: 'Référentiel nutritionnel', year: 2024 },
  ],
}

const ultraTransReport: SectionReport = {
  sectionId: 'ultra-transformes',
  strengthLabel: 'Vous évitez bien les aliments ultra-industriels',
  weaknessLabel: 'Trop d\'aliments ultra-transformés dans l\'alimentation',
  scienceNote: 'Limiter les ultra-transformés protège la couche de mucus qui tapisse l\'intestin contre les émulsifiants (agents présents dans les produits industriels qui agissent comme des détergents). Notre organisme, inchangé depuis des millénaires, ne sait pas traiter ces additifs sans dommage.',
  context:
    "Les aliments ultra-transformés (NOVA 4, classification des aliments très modifiés industriellement) ont subi un 'cracking' industriel qui détruit la matrice alimentaire naturelle. Leurs additifs (émulsifiants comme les polysorbates, colorants E1xx, conservateurs E2xx) agissent comme des détergents sur le mucus intestinal (couche protectrice de l'intestin). Les édulcorants modifient radicalement la composition du microbiote (ensemble des bactéries intestinales) en favorisant les souches pro-inflammatoires. Notre génome, inchangé depuis des millénaires, ne sait pas métaboliser ces xénobiotiques (substances étrangères à l'organisme).",
  recommendations: [
    { maxPct: 40, level: 'alerte', title: 'Exposition élevée', text: 'Votre exposition aux aliments ultra-transformés est élevée. Action immédiate : remplacez un aliment industriel par jour par son équivalent brut. Ces aliments détruisent la couche de mucus protecteur et provoquent un déséquilibre du microbiote intestinal que notre organisme ne sait pas corriger.' },
    { maxPct: 60, level: 'vigilance', title: 'Exposition à réduire', text: 'Votre consommation d\'ultra-transformés mérite attention. Règle simple : si la liste d\'ingrédients contient plus de 5 items ou des noms incompréhensibles (E250, sirop de glucose-fructose, arômes artificiels), c\'est probablement NOVA 4. Cuisinez par avance pour la semaine.' },
    { maxPct: 85, level: 'bon', title: 'Bonne gestion', text: 'Vous limitez bien les ultra-transformés. Maintenez cette vigilance en privilégiant les aliments bruts ou peu transformés.' },
    { maxPct: 100, level: 'excellent', title: 'Alimentation très saine', text: 'Vous évitez efficacement les ultra-transformés. C\'est l\'un des leviers les plus puissants pour protéger votre microbiote et votre muqueuse intestinale.' },
  ],
  questionInsights: [
    { questionId: 'ut-2', triggerMaxScore: 0, insight: 'Consommation régulière de boissons sucrées.', recommendation: 'Les boissons sucrées provoquent des pics de glycémie répétés qui fatiguent le pancréas et conduisent progressivement à une résistance à l\'insuline, quand les cellules ne répondent plus bien au signal qui régule le sucre dans le sang. Les édulcorants ne sont pas une alternative : ils modifient la composition des bactéries intestinales. Remplacez par de l\'eau, du thé vert ou des infusions.', action: 'Remplacez les boissons sucrées et sodas par de l\'eau ou du thé vert.', actionWhy: 'Chaque boisson sucrée force le pancréas à sécréter une vague d\'insuline pour gérer le sucre. Ces vagues répétées épuisent progressivement les cellules et conduisent à l\'insulinorésistance (les cellules ne répondent plus bien à l\'insuline), terreau de l\'inflammation et du vieillissement accéléré. Le thé vert apporte en plus des antioxydants végétaux anti-inflammatoires.' },
    { questionId: 'ut-4', triggerMaxScore: 0, insight: 'Consommation régulière d\'additifs alimentaires.', recommendation: 'Les sels nitrités (E250) dans les charcuteries forment des composés potentiellement dangereux lors de la digestion. Les émulsifiants agissent comme des détergents sur la couche de mucus qui protège la paroi intestinale. Réduisez fortement charcuteries et plats préparés industriels, et lisez les étiquettes.', action: 'Supprimez charcuteries et plats préparés industriels de votre alimentation.', actionWhy: 'Les sels nitrités (E250, présents dans le jambon et les charcuteries) se transforment dans l\'estomac acide en nitrosamines, des composés classés cancérigènes de catégorie 1 par l\'OMS pour le cancer colorectal. Les émulsifiants des plats préparés détruisent la couche de mucus qui protège la paroi intestinale.' },
    { questionId: 'ut-6', triggerMaxScore: 0, insight: 'Vous ne filtrez pas suffisamment les aliments ultra-transformés.', recommendation: 'Apprenez à repérer les aliments ultra-transformés sur les étiquettes : sirop de glucose-fructose, huile de palme, protéines hydrolysées, amidons modifiés, colorants et émulsifiants (E471, E472). La règle simple : si la liste contient plus de 5 ingrédients ou des noms incompréhensibles, évitez.', action: 'Lisez les étiquettes : fuyez tout produit avec plus de 5 ingrédients ou des noms incompréhensibles (codes E, sirops, arômes artificiels).', actionWhy: 'Les émulsifiants (comme les carraghénanes ou le polysorbate 80) détruisent progressivement la couche de mucus qui protège votre paroi intestinale. Sans ce bouclier, les toxines bactériennes passent dans la circulation sanguine et entretiennent une inflammation chronique dans tout le corps.' },
  ],
  references: [
    { authors: 'Berthou A', title: 'Matrice alimentaire et aliments ultra-transformés', journal: 'Référentiel nutritionnel', year: 2024 },
    { authors: 'Riché D', title: 'Additifs et dysbiose intestinale', journal: 'Référentiel nutritionnel', year: 2024 },
  ],
}

const inflammatoireReport: SectionReport = {
  sectionId: 'inflammatoire',
  strengthLabel: 'Alimentation peu pro-inflammatoire',
  weaknessLabel: 'Alimentation trop pro-inflammatoire',
  scienceNote: 'Une alimentation riche en oméga-3 et pauvre en oméga-6 incite le corps à produire des molécules anti-inflammatoires (résolvines, protectines) qui éteignent activement les foyers inflammatoires et protègent les centrales énergétiques des cellules contre l\'inflammation silencieuse.',
  context:
    "L'alimentation inflammatoire perturbe directement le trépied intestinal (muqueuse, microbiote, système immunitaire digestif). L'alcool agit comme un solvant direct sur les membranes entérocytaires (cellules de l'intestin). Les viandes d'élevage conventionnel (nourries maïs/soja) sont saturées en oméga-6 pro-inflammatoires (acides gras qui favorisent l'inflammation). L'excès d'oméga-6 (le ratio oméga-6/oméga-3 atteint 15/1 dans l'alimentation occidentale contre un optimal de 4/1) fournit le substrat des prostaglandines E2 et thromboxanes A2 (messagers chimiques qui amplifient la douleur et l'oedème).",
  recommendations: [
    { maxPct: 40, level: 'alerte', title: 'Profil pro-inflammatoire', text: 'Votre alimentation est actuellement pro-inflammatoire. Priorités : réduire l\'alcool, remplacer l\'huile de tournesol par de l\'huile d\'olive ou de colza, intégrer des sardines ou du maquereau 2x/semaine, et ajouter du curcuma + poivre noir quotidiennement. Ces changements réduisent les molécules de l\'inflammation et rééquilibrent la balance entre graisses pro- et anti-inflammatoires.' },
    { maxPct: 60, level: 'vigilance', title: 'Tendance inflammatoire', text: 'Certains aspects de votre alimentation favorisent l\'inflammation. Augmentez les aliments anti-inflammatoires : baies, légumes colorés, thé vert, curcuma, petits poissons gras. Remplacez l\'huile de tournesol par l\'huile d\'olive.' },
    { maxPct: 85, level: 'bon', title: 'Profil équilibré', text: 'Votre profil inflammatoire est plutôt bon. Maintenez un apport régulier en oméga-3 et en polyphénols pour une protection optimale.' },
    { maxPct: 100, level: 'excellent', title: 'Profil anti-inflammatoire', text: 'Votre alimentation est anti-inflammatoire. Les oméga-3 produisent résolvines et protectines qui éteignent activement les foyers inflammatoires.' },
  ],
  questionInsights: [
    { questionId: 'inf-1', triggerMaxScore: 0, insight: 'Consommation d\'alcool supérieure à 2 verres par semaine.', recommendation: 'L\'alcool fragilise directement la paroi intestinale et surcharge le foie dans sa mission de filtration. Quand le foie est saturé, il ne peut plus éliminer les toxines efficacement, ce qui entretient une inflammation chronique dans tout le corps.', action: 'Limitez l\'alcool à 2 verres maximum par semaine, et espacez les consommations.', actionWhy: 'Réduire l\'alcool diminue la charge de toxines que le foie doit filtrer chaque jour. Cela permet aussi à la paroi intestinale de maintenir son étanchéité : moins de toxines bactériennes passent dans la circulation sanguine, ce qui réduit directement l\'inflammation chronique dans tout le corps.' },
    { questionId: 'inf-2', triggerMaxScore: 0, insight: 'Consommation majoritaire de produits animaux issus de l\'élevage conventionnel.', recommendation: 'Les animaux nourris au maïs et au soja en élevage intensif ont un profil en graisses riche en oméga-6, des graisses pro-inflammatoires. Ce déséquilibre est transmis dans votre assiette. Privilégiez les élevages en herbe, label rouge ou bio, qui offrent un meilleur équilibre nutritionnel.', action: 'Choisissez viande et œufs issus d\'élevages en herbe, label rouge ou bio.', actionVegetarian: 'Choisissez œufs et produits laitiers issus d\'élevages en plein air ou certifiés bio pour un meilleur profil oméga-3.', actionVegan: 'Variez vos sources de protéines végétales (légumineuses, tofu bio, tempeh fermenté) pour couvrir tous les acides aminés essentiels.', actionWhy: 'Les animaux nourris à l\'herbe ont un profil en graisses beaucoup plus équilibré (ratio oméga-6/oméga-3 proche de 2/1) que ceux de l\'élevage intensif (15/1 à 20/1). Or, ce ratio détermine directement la quantité de molécules pro-inflammatoires que votre corps va produire.' },
    { questionId: 'inf-3', triggerMaxScore: 0, insight: 'Consommation élevée d\'oméga-6.', recommendation: 'L\'huile de tournesol, les margarines et les plats industriels sont très riches en oméga-6, des graisses que le corps transforme en messagers chimiques de l\'inflammation. Remplacez l\'huile de tournesol par l\'huile d\'olive ou de colza. Ajoutez des graines de lin moulues (2 c. à soupe/jour) et des noix (30 g/jour).', action: 'Remplacez l\'huile de tournesol par de l\'huile d\'olive ou de colza. Ajoutez 2 c. à soupe de graines de lin moulues par jour.', actionWhy: 'L\'huile d\'olive contient des polyphénols qui bloquent le principal régulateur génétique de l\'inflammation dans le corps. L\'huile de colza apporte des oméga-3. Ce simple changement réduit l\'afflux d\'acide arachidonique, la matière première des molécules qui amplifient la douleur et l\'œdème dans les tissus.' },
  ],
  references: [
    { authors: 'Riché D', title: 'Ratio oméga-6/oméga-3 et inflammation tissulaire', journal: 'Référentiel nutritionnel', year: 2024 },
    { authors: 'Berthou A', title: 'Alimentation inflammatoire et détoxication hépatique', journal: 'Référentiel nutritionnel', year: 2024 },
  ],
}

const bonusReport: SectionReport = {
  sectionId: 'bonus-sante',
  strengthLabel: 'Habitudes protectrices avancées en place',
  weaknessLabel: 'Habitudes protectrices avancées à construire',
  scienceNote: 'Les polyphénols (présents dans le thé vert, les baies, le chocolat noir) et les aliments fermentés sont transformés par les bactéries intestinales en composés actifs qui stimulent le renouvellement des mitochondries (centrales énergétiques des cellules) et éteignent le gène de l\'inflammation.',
  context:
    "Certaines pratiques alimentaires agissent directement sur l'épigénétique (modification de l'expression des gènes sans changer l'ADN). Les polyphénols des baies et du thé vert sont métabolisés par le microbiote en urolithines (molécules qui stimulent la biogenèse mitochondriale, c'est-à-dire la création de nouvelles centrales énergétiques dans les cellules, phénomène appelé hormèse). Le curcuma et le romarin bloquent l'oxydation lipidique et éteignent la voie NF-kB (protéine qui régule l'inflammation). La cuisson douce (<100°C) évite la formation d'amines hétérocycliques et d'AGEs (produits de glycation avancée, molécules pro-inflammatoires générées par la cuisson à haute température).",
  recommendations: [
    { maxPct: 40, level: 'alerte', title: 'Pratiques absentes', text: 'Vous n\'intégrez pas encore les habitudes alimentaires protectrices avancées. Commencez par deux gestes simples : ajoutez du curcuma + poivre noir à un plat par jour (ils bloquent un régulateur clé de l\'inflammation), et remplacez un café par du thé vert (polyphénols et renouvellement de vos cellules énergétiques).' },
    { maxPct: 60, level: 'vigilance', title: 'Pratiques émergentes', text: 'Vous intégrez quelques pratiques protectrices. Intensifiez avec : un aliment lactofermenté par jour (yaourt vivant, kéfir, kimchi), la cuisson vapeur en priorité, et des baies ou chocolat noir > 85 % quotidiennement.' },
    { maxPct: 85, level: 'bon', title: 'Bonnes pratiques', text: 'Vous adoptez plusieurs habitudes protectrices. Continuez à diversifier les sources de polyphénols et d\'aliments lactofermentés.' },
    { maxPct: 100, level: 'excellent', title: 'Pratiques optimales', text: 'Vous maîtrisez les pratiques alimentaires de protection cellulaire avancée. Vos épinutriments activent les gènes de résilience et éteignent les gènes de l\'inflammation.' },
  ],
  questionInsights: [
    { questionId: 'bon-1', triggerMaxScore: 0, insight: 'Pas de consommation régulière d\'aliments lactofermentés.', recommendation: 'Les aliments lactofermentés (choucroute, kimchi, yaourts vivants) enrichissent directement le microbiote en souches protectrices. Un microbiote diversifié est essentiel pour transformer les polyphénols en composés actifs (urolithines) qui stimulent le renouvellement de nos centrales énergétiques cellulaires et produire du butyrate, le carburant des cellules du côlon.', action: 'Ajoutez un aliment lactofermenté chaque jour : yaourt vivant au petit-déjeuner, choucroute ou kimchi en accompagnement, ou kéfir en collation.', actionVegetarian: 'Ajoutez un aliment lactofermenté chaque jour : yaourt vivant au petit-déjeuner, choucroute ou kimchi en accompagnement, ou kéfir en collation.', actionVegan: 'Ajoutez un aliment lactofermenté chaque jour : kéfir de coco, kombucha, choucroute crue ou kimchi (sans anchois) en accompagnement.', actionWhy: 'Les aliments lactofermentés introduisent des bactéries vivantes qui enrichissent et diversifient le microbiote, un marqueur clé de longévité. Un microbiote diversifié transforme davantage d\'antioxydants végétaux (polyphénols) en composés actifs qui stimulent le renouvellement des mitochondries et produisent du butyrate pour protéger la paroi intestinale.' },
    { questionId: 'bon-3', triggerMaxScore: 0, insight: 'Vous ne pratiquez pas la cuisson douce.', recommendation: 'La cuisson à haute température (friture, grillade > 180°C) crée des composés néoformés (amines hétérocycliques, produits de glycation) qui génèrent du stress oxydatif et de l\'inflammation. La cuisson vapeur ou basse température préserve les nutriments et évite la formation de ces composés indésirables.', action: 'Privilégiez la cuisson vapeur, à l\'étouffée ou mijotée (<100°C). Réservez les grillades et fritures à une fois par semaine maximum.', actionWhy: 'La cuisson à haute température (friture, grillade > 180°C) génère des composés toxiques (AGEs, amines hétérocycliques) qui créent du stress oxydatif et activent les gènes de l\'inflammation. La cuisson douce préserve les vitamines sensibles à la chaleur (B9, vitamine C) et les composés protecteurs des aliments.' },
    { questionId: 'bon-4', triggerMaxScore: 0, insight: 'Apport en polyphénols insuffisant.', recommendation: 'Les polyphénols (thé vert, baies, chocolat noir > 85 %) sont de puissants composés végétaux qui éteignent les gènes de l\'inflammation et stimulent le renouvellement des mitochondries (nos générateurs d\'énergie cellulaire). Visez une source de polyphénols à chaque repas.', action: 'Ajoutez une source de polyphénols à chaque repas : thé vert au petit-déjeuner, baies à la collation, chocolat noir >85% en fin de repas.', actionWhy: 'Les polyphénols éteignent le principal gène de l\'inflammation et activent des voies biologiques associées à la longévité cellulaire. Les bactéries intestinales les transforment en composés actifs qui stimulent le renouvellement des mitochondries (vos centrales énergétiques), ralentissant le vieillissement cellulaire.' },
  ],
  references: [
    { authors: 'Berthou A', title: 'Polyphénols, épigénétique et mitochondries', journal: 'Référentiel nutritionnel', year: 2024 },
    { authors: 'Riché D', title: 'Lactofermentation et microbiote', journal: 'Référentiel nutritionnel', year: 2024 },
  ],
}

// ══════════════════════════════════════════════════════
// EXPORTS
// ══════════════════════════════════════════════════════

export const allSectionReports: SectionReport[] = [
  // Digestif
    refluxReport,
    douleursReport,
    indigestionReport,
    diarrheeReport,
    constipationReport,
    habitudesReport,
    macroReport,
    microReport,
    ultraTransReport,
    inflammatoireReport,
    bonusReport,
]

/** Lookup helper */
export function getSectionReport(sectionId: string): SectionReport | undefined {
  return allSectionReports.find((r) => r.sectionId === sectionId)
}

/**
 * Gets the relevant recommendation for a given score percentage
 */
export function getSectionRecommendation(report: SectionReport, pct: number) {
  // Recommendations are sorted by maxPct ascending — return first match
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
    // Amélioration 2 : insight sans seuil configuré → ne se déclenche jamais
    if (qi.triggerMinScore === undefined && qi.triggerMaxScore === undefined) return false
    if (qi.triggerMinScore !== undefined) return s >= qi.triggerMinScore
    return s <= (qi.triggerMaxScore as number)
  })
}

// Amélioration 3 : source de vérité unique pour les IDs de sections digestives
export const DIGESTIF_IDS = new Set([
  'reflux',
  'douleurs-abdominales',
  'indigestion',
  'diarrhee',
  'constipation',
])

// ══════════════════════════════════════════════════════
// GLOBAL REPORT & SYNTHESIS
// ══════════════════════════════════════════════════════

export interface GlobalInsight {
  title: string
  description: string
  reference: string
}

// Glossaire des termes scientifiques pour le rapport nutrition
export const nutritionGlossary: { term: string; definition: string }[] = [
  { term: 'Épigénétique', definition: 'Modification de l\'expression des gènes sans changer l\'ADN, influencée par l\'environnement et l\'alimentation.' },
  { term: 'Polyphénols', definition: 'Molécules végétales antioxydantes qui protègent les cellules et régulent l\'inflammation.' },
  { term: 'Oméga-3 / Oméga-6', definition: 'Acides gras essentiels. Oméga-3 anti-inflammatoires, oméga-6 pro-inflammatoires (en excès).' },
  { term: 'NF-kB', definition: 'Protéine régulatrice de l\'inflammation, activée par le stress ou une mauvaise alimentation.' },
  { term: 'Microbiote', definition: 'Ensemble des bactéries intestinales, essentiel à la digestion, l\'immunité et l\'humeur.' },
  { term: 'Dysbiose', definition: 'Déséquilibre du microbiote, favorisant l\'inflammation et les troubles digestifs.' },
  { term: 'Hyperperméabilité intestinale (IDH)', definition: 'Fragilisation de la paroi intestinale, laissant passer des toxines dans le sang.' },
  { term: 'GALT', definition: 'Tissu lymphoïde associé à l\'intestin, première barrière immunitaire.' },
  { term: 'Insulinorésistance', definition: 'Diminution de la sensibilité des cellules à l\'insuline, favorisant le diabète.' },
  { term: 'Mitochondrie', definition: 'Centrale énergétique de la cellule, affectée par l\'inflammation chronique.' },
  { term: 'Prostaglandines', definition: 'Messagers chimiques de la douleur et de l\'inflammation.' },
  { term: 'Cytokines', definition: 'Protéines qui régulent l\'inflammation et la réponse immunitaire.' },
  { term: 'LPS', definition: 'Endotoxines bactériennes qui déclenchent l\'inflammation.' },
  { term: 'Acides gras à chaîne courte', definition: 'Molécules produites par la fermentation des fibres, essentielles à la santé intestinale.' },
  { term: 'PRAL', definition: 'Potentiel acidifiant des aliments, influençant l\'équilibre acido-basique.' },
  { term: 'Hormèse', definition: 'Stimulation de la biogenèse mitochondriale par des stress modérés (ex : polyphénols).' },
  { term: 'AGEs', definition: 'Produits de glycation avancée, générés par la cuisson à haute température, pro-inflammatoires.' },
]

export const globalKeyInsights: GlobalInsight[] = [
  {
    title: 'Ce que vous mangez programme vos gènes',
    description: 'L\'alimentation agit comme un signal épigénétique (elle modifie l\'expression des gènes sans toucher à l\'ADN) : les polyphénols (antioxydants des plantes), les fibres et les oméga-3 éteignent les gènes de l\'inflammation et activent ceux de la réparation cellulaire. À l\'inverse, les aliments ultra-transformés et l\'excès d\'oméga-6 activent des voies pro-inflammatoires que notre génome, inchangé depuis des millénaires, n\'est pas équipé pour gérer.',
    reference: 'Berthou A, Référentiel nutritionnel',
  },
  {
    title: 'L\'intestin : votre premier système immunitaire',
    description: 'La muqueuse intestinale, les défenses immunitaires locales et le microbiote (ensemble des bactéries intestinales) forment un écosystème intégré. Tout déséquilibre de cet écosystème génère un stress oxydatif systémique qui impacte l\'énergie, l\'humeur et l\'immunité. L\'intestin produit 95 % de la sérotonine corporelle : sa santé conditionne directement votre bien-être mental.',
    reference: 'Riché D / Druguet S, Référentiel nutritionnel',
  },
  {
    title: 'L\'inflammation silencieuse : moteur du vieillissement',
    description: 'Le déséquilibre du ratio oméga-6/oméga-3 (15/1 dans l\'alimentation occidentale contre un optimal de 4/1) entretient une inflammation de bas grade permanente. Cette inflammation chronique invisible perturbe les mitochondries (centrales énergétiques des cellules), diminue la sensibilité à l\'insuline et accélère le vieillissement cellulaire. L\'alimentation est le levier le plus direct pour la contrôler.',
    reference: 'Riché D / Berthou A, Référentiel nutritionnel',
  },
]

// ══════════════════════════════════════════════════════
// Full Report Generator
// ══════════════════════════════════════════════════════

export interface StrengthItem { sectionId: string; title: string; pct: number; praise: string; science: string; scienceNote: string; reference: string }
export interface WeaknessItem { sectionId: string; title: string; pct: number; level: string; concern: string; science: string; reference: string; triggeredInsights: { questionId: string; insight: string; recommendation: string; action?: string }[] }
export interface ActionPhase { phase: number; phaseTitle: string; timeframe: string; actions: { action: string; why: string; sectionId: string }[] }

/**
 * Génère un rapport final enrichi et visuel pour le bilan nutrition
 * - Ajoute un glossaire des termes scientifiques
 * - Structure le rapport en sections visuelles (cartes, badges, listes)
 */
export function generateFullReport(
  sectionResults: { sectionId: string; pct: number; score: number; maxScore: number; title: string }[],
  scores: Record<string, number>,
  diet?: string,
) {
  const isVegan = diet ? /vegan|vegane|végane|végétalien/i.test(diet) : false
  const isVegetarian = !isVegan && (diet ? /végétarien|vegetarien|vegetarian|végétarienne|végétarism/i.test(diet) : false)
  const isPescetarian = !isVegan && !isVegetarian && (diet ? /pescet|poisson/i.test(diet) : false)

  function pickAction(ti: { action?: string; actionVegetarian?: string; actionVegan?: string }) {
    if (isVegan && ti.actionVegan) return ti.actionVegan
    if ((isVegetarian || isPescetarian) && ti.actionVegetarian) return ti.actionVegetarian
    return ti.action
  }
  function pickActionWhy(ti: { actionWhy?: string; actionWhyVegetarian?: string; actionWhyVegan?: string }) {
    if (isVegan && ti.actionWhyVegan) return ti.actionWhyVegan
    if ((isVegetarian || isPescetarian) && ti.actionWhyVegetarian) return ti.actionWhyVegetarian
    return ti.actionWhy
  }

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
      triggeredInsights: triggered.map(t => ({ questionId: t.questionId, insight: t.insight, recommendation: t.recommendation, action: t.action })),
      references: report.references,
      // Ajout d'un badge visuel pour le niveau
      badge: rec.level === 'excellent' ? '🟢' : rec.level === 'bon' ? '🟡' : rec.level === 'vigilance' ? '🟠' : '🔴',
      // Ajout d'une couleur pour la carte
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
      strengths.push({ sectionId: r.sectionId, title: report.strengthLabel || r.title, pct: r.pct, praise: rec.text, science: report.context.split('.').slice(0, 2).join('.') + '.', scienceNote: report.scienceNote || report.context.split('.')[0] + '.', reference: ref0 })
    } else {
      weaknesses.push({ sectionId: r.sectionId, title: report.weaknessLabel || r.title, pct: r.pct, level: rec.level, concern: rec.text, science: report.context, reference: ref0, triggeredInsights: triggered.map(t => ({ questionId: t.questionId, insight: t.insight, recommendation: t.recommendation, action: t.action })) })
    }
  }
  // Amélioration 1 : tri par urgence (alerte d'abord), puis par pct croissant à même niveau
  const levelOrder: Record<string, number> = { alerte: 0, vigilance: 1, bon: 2, excellent: 3 }
  weaknesses.sort((a, b) => {
    const lo = levelOrder[a.level] - levelOrder[b.level]
    if (lo !== 0) return lo
    return a.pct - b.pct
  })

  const alimentaireAlerte: { action: string; why: string; sectionId: string }[] = []
  const alimentaireVigilance: { action: string; why: string; sectionId: string }[] = []
  const digestifActions: { action: string; why: string; sectionId: string }[] = []
  for (const w of weaknesses) {
    const fullReport = getSectionReport(w.sectionId)
    const fullTriggered = fullReport ? getTriggeredInsights(fullReport, scores) : []
    const isDigestif = DIGESTIF_IDS.has(w.sectionId)
    const bucket = isDigestif ? digestifActions : w.level === 'alerte' ? alimentaireAlerte : alimentaireVigilance
    for (const ti of fullTriggered) {
      const short = pickAction(ti) || ti.recommendation.split('.')[0] + '.'
      const why = pickActionWhy(ti) || ti.actionWhy || ti.recommendation
      bucket.push({ action: short, why, sectionId: w.sectionId })
    }
    if (fullTriggered.length === 0) {
      const fallbackAction = w.concern.split('.').slice(0, 2).join('.') + '.'
      const fallbackWhy = fullReport?.context.split('.')[0] + '.' || w.concern.split('.')[0] + '.'
      bucket.push({ action: fallbackAction, why: fallbackWhy, sectionId: w.sectionId })
    }
  }
  const allActions = [...alimentaireAlerte, ...alimentaireVigilance, ...digestifActions].slice(0, 4)
  const actionPlan: ActionPhase[] = []
  if (allActions.length > 0) {
    actionPlan.push({ phase: 1, phaseTitle: 'Vos priorités', timeframe: 'Semaines 1-4', actions: allActions })
  } else {
    // Amélioration 4 : fallback personnalisé — sections "bon" les plus fragiles (pct le plus bas)
    const bonToConsolidate = strengths
      .filter(s => !DIGESTIF_IDS.has(s.sectionId))
      .sort((a, b) => a.pct - b.pct)
      .slice(0, 3)
    if (bonToConsolidate.length > 0) {
      const consolidationActions = bonToConsolidate.map(s => ({
        action: `Consolidez : ${s.title}`,
        why: s.scienceNote || s.science,
        sectionId: s.sectionId,
      }))
      actionPlan.push({ phase: 1, phaseTitle: 'Points à consolider', timeframe: 'En continu', actions: consolidationActions })
    } else {
      actionPlan.push({ phase: 1, phaseTitle: 'Maintien des acquis', timeframe: 'En continu', actions: [{ action: 'Maintenez vos bonnes pratiques nutritionnelles et digestives.', why: 'Vos scores nutrition sont excellents sur tous les axes. Continuez ainsi.', sectionId: '' }] })
    }
  }

  // Ajout d'une section visuelle pour le glossaire
  const glossarySection = nutritionGlossary.map(g => ({ term: g.term, definition: g.definition }))

  // Structure finale enrichie
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
      // Pick the single most impactful triggered insight or use the section rec
      const insights = getTriggeredInsights(report, scores)
      const action = insights.length > 0
        ? insights[0].recommendation.split('.')[0] + '.'
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

  // Sort by severity (lowest pct = highest priority)
  actions.sort((a, b) => a.pct - b.pct)
  return actions.slice(0, 5).map((a, i) => ({
    priority: i + 1,
    action: a.action,
    sectionTitle: a.sectionTitle,
    level: a.level,
  }))
}

/**
 * Adapts an action text for a specific diet at display time.
 * Used when the report was stored without diet context.
 */
export function adaptActionForDiet(action: string, diet: string): string {
  if (!diet) return action
  const isVegan = /vegan|vegane|végane|végétalien/i.test(diet)
  const isVegetarian = !isVegan && /végétarien|vegetarien|vegetarian|végétarienne/i.test(diet)
  if (!isVegan && !isVegetarian) return action

  let result = action
  if (isVegan) {
    result = result
      .replace(/viande(?:s)?,?\s*poisson(?:s)?,?\s*(?:ou\s+)?œuf(?:s)?,?\s*(?:ou\s+)?légumineuses/gi, 'légumineuses, tofu, tempeh, seitan ou graines de courge')
      .replace(/viande rouge/gi, 'lentilles, tofu ferme ou haricots')
      .replace(/petits? poissons? gras \d+x? par semaine \([^)]+\)/gi, '2 c. à soupe de graines de lin moulues et une poignée de noix par jour')
      .replace(/sardines?, maquereau(?:, hareng)?/gi, 'noix, graines de lin et huile de colza')
      .replace(/poissons? gras et (?:des )?œufs/gi, 'un complément en vitamine D3 d\'origine végétale (lichen)')
      .replace(/yaourt vivant au petit-déjeuner/gi, 'kéfir de coco ou kombucha au petit-déjeuner')
      .replace(/yaourt vivant/gi, 'kéfir de coco ou kombucha')
      .replace(/viande et œufs issus d'élevages en herbe, label rouge ou bio/gi, 'légumineuses, tofu bio et tempeh comme sources protéiques')
  } else if (isVegetarian) {
    result = result
      .replace(/viande(?:s)?,?\s*poisson(?:s)?,?\s*(?:ou\s+)?œuf(?:s)?,?\s*(?:ou\s+)?légumineuses/gi, 'œufs, légumineuses, produits laitiers, tofu ou tempeh')
      .replace(/viande rouge/gi, 'lentilles ou haricots')
      .replace(/petits? poissons? gras \d+x? par semaine \([^)]+\)/gi, '2 c. à soupe de graines de lin moulues et une poignée de noix par jour')
      .replace(/sardines?, maquereau(?:, hareng)?/gi, 'noix, graines de lin et huile de colza')
      .replace(/poissons? gras et (?:des )?œufs/gi, 'un complément en vitamine D3 ou des œufs enrichis')
      .replace(/viande et œufs issus d'élevages en herbe, label rouge ou bio/gi, 'œufs et produits laitiers issus d\'élevages en plein air ou bio')
  }
  return result
}
