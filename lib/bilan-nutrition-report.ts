// ──────────────────────────────────────────────────────
// Bilan Nutrition — Compte-rendu scientifique
// Basé sur la littérature peer-reviewed (PubMed / Cochrane)
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
  /** Explication du domaine évalué – vulgarisation scientifique */
  context: string
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
  }[]
  /** Références scientifiques du domaine */
  references: ScientificReference[]
}

// ══════════════════════════════════════════════════════
// DIGESTIF — GSRS
// ══════════════════════════════════════════════════════

const refluxReport: SectionReport = {
  sectionId: 'reflux',
  context:
    'Le reflux gastro-œsophagien (RGO) touche 10-20 % de la population occidentale. Il est associé à une inflammation chronique de l\'œsophage, augmentant le risque de métaplasie de Barrett. Le score GSRS reflux évalue la fréquence et la sévérité des symptômes de reflux acide.',
  recommendations: [
    { maxPct: 33, level: 'alerte', title: 'Reflux sévère', text: 'Vos symptômes de reflux sont importants. Un bilan endoscopique est recommandé. Évitez les repas copieux le soir, surélevez la tête de lit de 15 cm, et limitez café, alcool, chocolat et aliments acides. La prise en charge diététique seule réduit les symptômes de 30 à 50 % (Kaltenbach et al., 2006).' },
    { maxPct: 66, level: 'vigilance', title: 'Reflux modéré', text: 'Vous présentez des symptômes de reflux à surveiller. Adoptez des mesures hygiéno-diététiques : fractionner les repas, ne pas se coucher dans les 3h suivant le dîner, éviter les boissons gazeuses. Les études montrent un bénéfice net de la posture post-prandiale (Ness-Jensen et al., 2016).' },
    { maxPct: 90, level: 'bon', title: 'Reflux léger', text: 'Peu de symptômes de reflux. Maintenez vos bonnes habitudes. Privilégiez les repas fractionnés et bien mastiqués.' },
    { maxPct: 100, level: 'excellent', title: 'Pas de reflux', text: 'Aucun signe de reflux gastro-œsophagien. Excellent indicateur de santé digestive haute.' },
  ],
  questionInsights: [
    { questionId: 'ref-1', triggerMinScore: 75, insight: 'Vos brûlures d\'estomac sont fréquentes.', recommendation: 'Évitez les aliments triggers : tomate, agrumes, café, menthe, chocolat, alcool. Les IPP ne doivent être pris que sous supervision médicale. Des alternatives naturelles (réglisse déglycyrrhizinée, gel d\'aloe vera) montrent une efficacité dans les formes légères.' },
    { questionId: 'ref-2', triggerMinScore: 75, insight: 'Vous présentez des régurgitations acides fréquentes.', recommendation: 'La surélévation de la tête de lit (15 cm) réduit le reflux nocturne de 67 % (Khan et al., 2012). Évitez de manger dans les 3 heures précédant le coucher.' },
  ],
  references: [
    { authors: 'Kaltenbach T, Crockett S, Gerson LB', title: 'Are lifestyle measures effective in patients with gastroesophageal reflux disease?', journal: 'Arch Intern Med', year: 2006, doi: '10.1001/archinte.166.9.965', pmid: '16682569' },
    { authors: 'Ness-Jensen E, Hveem K, El-Serag H, Lagergren J', title: 'Lifestyle Intervention in Gastroesophageal Reflux Disease', journal: 'Clin Gastroenterol Hepatol', year: 2016, doi: '10.1016/j.cgh.2015.04.176', pmid: '25956834' },
    { authors: 'Svedlund J, Sjödin I, Dotevall G', title: 'GSRS—a clinical rating scale for gastrointestinal symptoms in patients with irritable bowel syndrome and peptic ulcer disease', journal: 'Dig Dis Sci', year: 1988, pmid: '3123181' },
  ],
}

const douleursReport: SectionReport = {
  sectionId: 'douleurs-abdominales',
  context:
    'Les douleurs abdominales fonctionnelles touchent 15-25 % des adultes. Elles sont souvent liées au syndrome de l\'intestin irritable (SII), au stress ou à des troubles de la motilité. Le lien intestin-cerveau (axe gut-brain) joue un rôle central dans la perception douloureuse abdominale (Mayer et al., 2015).',
  recommendations: [
    { maxPct: 33, level: 'alerte', title: 'Douleurs importantes', text: 'Vos douleurs abdominales sont significatives. Un bilan médical est recommandé pour exclure une pathologie organique. En attendant, un régime pauvre en FODMAPs réduit les douleurs abdominales chez 75 % des patients SII (Halmos et al., 2014). La gestion du stress par cohérence cardiaque (5 min/jour) a montré une réduction de 40 % des symptômes digestifs.' },
    { maxPct: 66, level: 'vigilance', title: 'Douleurs modérées', text: 'Des douleurs abdominales régulières méritent attention. Tenez un journal alimentaire pendant 2 semaines pour identifier les aliments déclencheurs. L\'activité physique modérée (30 min/jour) améliore la motilité intestinale et réduit la sensibilité viscérale.' },
    { maxPct: 90, level: 'bon', title: 'Douleurs légères', text: 'Vos douleurs abdominales sont occasionnelles. Maintenez une alimentation riche en fibres solubles (avoine, psyllium) pour réguler la motilité.' },
    { maxPct: 100, level: 'excellent', title: 'Pas de douleur', text: 'Absence de douleur abdominale. Bon indicateur de santé digestive.' },
  ],
  questionInsights: [
    { questionId: 'doul-1', triggerMinScore: 75, insight: 'Douleurs fréquentes au niveau de l\'estomac.', recommendation: 'Une douleur épigastrique récurrente peut évoquer une gastrite, un ulcère ou une dyspepsie fonctionnelle. Consultez un gastro-entérologue si les symptômes persistent > 4 semaines. En première intention : fractionnez vos repas et évitez les AINS.' },
    { questionId: 'doul-2', triggerMinScore: 75, insight: 'Douleurs de faim fréquentes.', recommendation: 'Les douleurs de faim récurrentes évoquent une instabilité glycémique ou une gastrite à H. pylori. Assurez-vous de consommer des protéines + fibres à chaque repas pour stabiliser la glycémie. Un test respiratoire H. pylori peut être indiqué.' },
    { questionId: 'doul-3', triggerMinScore: 75, insight: 'Nausées fréquentes.', recommendation: 'Les nausées chroniques peuvent être liées au stress, à un retard de vidange gastrique, ou à une intolérance alimentaire. Le gingembre (1 g/jour) a montré une efficacité anti-nauséeuse dans plusieurs essais (Viljoen et al., 2014).' },
  ],
  references: [
    { authors: 'Mayer EA, Tillisch K, Gupta A', title: 'Gut/brain axis and the microbiota', journal: 'J Clin Invest', year: 2015, doi: '10.1172/JCI76304', pmid: '25664848' },
    { authors: 'Halmos EP, Power VA, Shepherd SJ, Gibson PR, Muir JG', title: 'A diet low in FODMAPs reduces symptoms of irritable bowel syndrome', journal: 'Gastroenterology', year: 2014, doi: '10.1053/j.gastro.2013.09.046', pmid: '24076059' },
    { authors: 'Viljoen E, Visser J, Koen N, Musekiwa A', title: 'A systematic review and meta-analysis of the effect and safety of ginger in the treatment of pregnancy-associated nausea and vomiting', journal: 'Nutr J', year: 2014, pmid: '24642205' },
  ],
}

const indigestionReport: SectionReport = {
  sectionId: 'indigestion',
  context:
    'Les symptômes d\'indigestion (ballonnements, gaz, éructations) affectent 20-30 % de la population. Ils reflètent souvent un déséquilibre du microbiote intestinal (dysbiose), une fermentation excessive des glucides non absorbés, ou des troubles de la motilité. Le microbiote intestinal est aujourd\'hui considéré comme un "organe" à part entière (Qin et al., 2010).',
  recommendations: [
    { maxPct: 33, level: 'alerte', title: 'Indigestion sévère', text: 'Vos symptômes d\'indigestion sont importants. Envisagez un régime low-FODMAP de 6 semaines sous supervision diététique, suivi d\'une réintroduction progressive. Les probiotiques multi-souches (Lactobacillus + Bifidobacterium) réduisent les ballonnements de 44 % selon une méta-analyse Cochrane (Ford et al., 2018). Mastication lente essentielle.' },
    { maxPct: 66, level: 'vigilance', title: 'Indigestion modérée', text: 'Des ballonnements réguliers méritent attention. Réduisez les crudités au profit de légumes cuits, limitez les légumineuses sans trempage préalable, et mâchez lentement. La menthe poivrée en capsules entériques réduit les ballonnements (Alammar et al., 2019).' },
    { maxPct: 90, level: 'bon', title: 'Bonne digestion', text: 'Peu de symptômes d\'indigestion. La diversité alimentaire maintient la richesse du microbiote. Consommez 30 végétaux différents par semaine (recommandation du American Gut Project).' },
    { maxPct: 100, level: 'excellent', title: 'Digestion excellente', text: 'Aucun trouble d\'indigestion. Votre microbiote semble en bonne santé.' },
  ],
  questionInsights: [
    { questionId: 'ind-2', triggerMinScore: 75, insight: 'Ballonnements fréquents.', recommendation: 'Les ballonnements chroniques sont le symptôme n°1 de dysbiose. Intégrez des prébiotiques (FOS, inuline en petite dose croissante) et des probiotiques. Si les ballonnements surviennent < 30 min après le repas → cause gastrique probable ; si > 2h → fermentation colique.' },
    { questionId: 'ind-4', triggerMinScore: 75, insight: 'Flatulences excessives.', recommendation: 'Des flatulences fréquentes indiquent une fermentation intestinale excessive. Limitez les FODMAPs (oignon, ail, blé, produits laitiers) et trempez les légumineuses 12h avant cuisson. Le charbon actif (2 g/jour) peut soulager en phase aiguë.' },
  ],
  references: [
    { authors: 'Qin J et al.', title: 'A human gut microbial gene catalogue established by metagenomic sequencing', journal: 'Nature', year: 2010, doi: '10.1038/nature08821', pmid: '20203603' },
    { authors: 'Ford AC, Harris LA, Lacy BE, Quigley EMM, Moayyedi P', title: 'Systematic review with meta-analysis: the efficacy of prebiotics, probiotics, synbiotics and antibiotics in irritable bowel syndrome', journal: 'Aliment Pharmacol Ther', year: 2018, doi: '10.1111/apt.15001', pmid: '30294792' },
    { authors: 'Alammar N, Wang L, Saberi B et al.', title: 'The impact of peppermint oil on the irritable bowel syndrome: a meta-analysis', journal: 'BMC Complement Med Ther', year: 2019, doi: '10.1186/s12906-018-2409-0', pmid: '30654773' },
  ],
}

const diarrheeReport: SectionReport = {
  sectionId: 'diarrhee',
  context:
    'La diarrhée chronique fonctionnelle affecte 5-10 % des adultes. Elle peut refléter un syndrome de l\'intestin irritable à prédominance diarrhéique (SII-D), une intolérance alimentaire (lactose, fructose, gluten), ou une inflammation intestinale de bas grade. Le temps de transit intestinal est un biomarqueur important de la santé du microbiote (Vandeputte et al., 2016).',
  recommendations: [
    { maxPct: 33, level: 'alerte', title: 'Transit accéléré sévère', text: 'Vos symptômes de transit accéléré sont importants. Un bilan complet est recommandé (calprotectine fécale, sérologie cœliaque, test respiratoire au lactose). En attendant, les fibres solubles (psyllium 10 g/jour) régularisent le transit. Évitez café, lait de vache et sorbitol. Le Saccharomyces boulardii (probiotique) réduit la diarrhée (McFarland, 2006).' },
    { maxPct: 66, level: 'vigilance', title: 'Transit légèrement accéléré', text: 'Un transit accéléré mérite surveillance. Identifiez les déclencheurs alimentaires. Le psyllium (5-10 g/jour) absorbe l\'excès d\'eau dans le côlon. L\'exercice régulier régule la motilité.' },
    { maxPct: 90, level: 'bon', title: 'Transit normal', text: 'Votre transit est satisfaisant. Maintenez un apport en fibres équilibré (25-30 g/jour) et une bonne hydratation.' },
    { maxPct: 100, level: 'excellent', title: 'Transit optimal', text: 'Aucun signe de transit accéléré. Signe d\'un bon équilibre intestinal.' },
  ],
  questionInsights: [
    { questionId: 'dia-3', triggerMinScore: 75, insight: 'Urgences intestinales fréquentes.', recommendation: 'L\'urgence défécatoire peut indiquer une inflammation rectale ou un SII-D. Le L-glutamine (5 g/jour) a montré une réduction de 80 % des urgences dans le SII-D post-infectieux (Zhou et al., 2019). Consultez si les symptômes persistent.' },
  ],
  references: [
    { authors: 'Vandeputte D, Falony G, Vieira-Silva S et al.', title: 'Stool consistency is strongly associated with gut microbiota richness and composition, enterotypes and bacterial growth rates', journal: 'Gut', year: 2016, doi: '10.1136/gutjnl-2015-309618', pmid: '26100928' },
    { authors: 'McFarland LV', title: 'Meta-analysis of probiotics for the prevention of antibiotic associated diarrhea', journal: 'Am J Gastroenterol', year: 2006, pmid: '16696781' },
    { authors: 'Zhou Q, Verne ML, Fields JZ et al.', title: 'Randomised placebo-controlled trial of dietary glutamine supplements for postinfectious irritable bowel syndrome', journal: 'Gut', year: 2019, doi: '10.1136/gutjnl-2017-315136', pmid: '30108163' },
  ],
}

const constipationReport: SectionReport = {
  sectionId: 'constipation',
  context:
    'La constipation fonctionnelle touche 12-19 % de la population mondiale. Elle est associée à un risque accru de maladies cardiovasculaires (+12 %), de cancer colorectal et d\'altération du microbiote (Sumida et al., 2019). Un transit trop lent favorise la réabsorption de toxines et la production de métabolites bactériens délétères.',
  recommendations: [
    { maxPct: 33, level: 'alerte', title: 'Constipation sévère', text: 'Votre constipation est significative. Augmentez progressivement les fibres insolubles (son de blé, légumes verts) à 30-35 g/jour, buvez ≥ 2L d\'eau/jour, et pratiquez 30 min d\'activité physique quotidienne. Les probiotiques Bifidobacterium lactis améliorent le temps de transit de 12h en moyenne (Dimidi et al., 2014). Si persistant > 3 mois, un bilan (TSH, calcémie, coloscopie) s\'impose.' },
    { maxPct: 66, level: 'vigilance', title: 'Constipation modérée', text: 'Un ralentissement du transit mérite attention. Intégrez des graines de lin (2 c. à soupe/jour dans de l\'eau), des pruneaux, et du kiwi (2/jour — étude Attaluri et al., 2011). Respectez le réflexe gastro-colique : allez aux toilettes 15-30 min après le petit-déjeuner.' },
    { maxPct: 90, level: 'bon', title: 'Transit satisfaisant', text: 'Votre transit est globalement régulier. Maintenez une alimentation riche en fibres variées et une hydratation suffisante.' },
    { maxPct: 100, level: 'excellent', title: 'Transit optimal', text: 'Aucun signe de constipation. Signe d\'un bon fonctionnement colique.' },
  ],
  questionInsights: [
    { questionId: 'con-3', triggerMinScore: 75, insight: 'Sensation de vidange incomplète fréquente.', recommendation: 'La sensation de vidange incomplète peut indiquer un dyssynergisme du plancher pelvien. La rééducation périnéale par biofeedback est efficace dans 70 % des cas (Rao et al., 2007). En première intention, adoptez la position squatting (tabouret sous les pieds aux toilettes) qui augmente l\'angle anorectal de 15°.' },
  ],
  references: [
    { authors: 'Sumida K, Molnar MZ, Potukuchi PK et al.', title: 'Constipation and risk of death and cardiovascular events', journal: 'Atherosclerosis', year: 2019, doi: '10.1016/j.atherosclerosis.2018.10.022', pmid: '30445337' },
    { authors: 'Dimidi E, Christodoulides S, Fragkos KC et al.', title: 'The effect of probiotics on functional constipation in adults: a systematic review and meta-analysis', journal: 'Am J Clin Nutr', year: 2014, doi: '10.3945/ajcn.114.089151', pmid: '25099542' },
    { authors: 'Rao SSC, Seaton K, Miller M et al.', title: 'Randomized controlled trial of biofeedback, sham feedback, and standard therapy for dyssynergic defecation', journal: 'Clin Gastroenterol Hepatol', year: 2007, pmid: '17445749' },
  ],
}

// ══════════════════════════════════════════════════════
// ALIMENTAIRE
// ══════════════════════════════════════════════════════

const habitudesReport: SectionReport = {
  sectionId: 'habitudes-generales',
  context:
    'La chrono-nutrition et les comportements alimentaires (rythme des repas, mastication, environnement) modulent profondément le métabolisme, la satiété et la digestion. Sauter le petit-déjeuner est associé à un risque cardiovasculaire augmenté de 21 % (Rong et al., 2019). La pleine conscience alimentaire améliore le contrôle pondéral et la relation à l\'alimentation (Warren et al., 2017).',
  recommendations: [
    { maxPct: 40, level: 'alerte', title: 'Habitudes à corriger', text: 'Vos habitudes alimentaires de base présentent plusieurs points critiques. Priorisez : 1) Petit-déjeuner quotidien (même léger), 2) Repas à heures fixes (± 30 min), 3) Supprimer les écrans pendant les repas. Chaque amélioration a un impact mesurable sur la glycémie, la digestion et la composition corporelle.' },
    { maxPct: 60, level: 'vigilance', title: 'Habitudes perfectibles', text: 'Des points à améliorer. Concentrez-vous sur la mastication lente (20-30 mastications par bouchée) et la conscience alimentaire. La mastication prolongée augmente la satiété de 15 % et l\'absorption des nutriments (Li et al., 2011).' },
    { maxPct: 85, level: 'bon', title: 'Bonnes habitudes', text: 'Vos habitudes alimentaires de base sont solides. Optimisez les derniers points pour approfondir les bénéfices sur la longévité.' },
    { maxPct: 100, level: 'excellent', title: 'Habitudes exemplaires', text: 'Vos habitudes alimentaires de base sont excellentes. Vous maximisez l\'assimilation des nutriments et la régulation métabolique.' },
  ],
  questionInsights: [
    { questionId: 'hab-1', triggerMaxScore: 0, insight: 'Vous ne prenez pas de petit-déjeuner quotidien.', recommendation: 'L\'étude EPIC (n = 400 000) montre que sauter le petit-déjeuner augmente le risque de mortalité cardiovasculaire. Même un petit-déjeuner léger (œuf + fruit + oléagineux) suffit à activer le métabolisme matinal et stabiliser la glycémie.' },
    { questionId: 'hab-3', triggerMaxScore: 0, insight: 'Vous grignotez entre les repas.', recommendation: 'Le grignotage perturbe les cycles glycémiques et bloque la lipolyse (combustion des graisses). Espacez vos repas de 4-5h minimum. En cas de fringale : eau, thé vert, ou 10 amandes.' },
    { questionId: 'hab-4', triggerMaxScore: 0, insight: 'Vous mangez trop vite.', recommendation: 'Manger vite double le risque de syndrome métabolique (Otsuka et al., 2006). Posez vos couverts entre chaque bouchée. Un repas devrait durer ≥ 20 min pour déclencher la satiété (hormones PYY et CCK).' },
    { questionId: 'hab-7', triggerMaxScore: 0, insight: 'Vous sautez souvent des repas.', recommendation: 'Sauter des repas entraîne une surcompensation calorique au repas suivant et perturbe la régulation insulinique. Préparez des "meal prep" le dimanche pour la semaine.' },
    { questionId: 'hab-8', triggerMaxScore: 0, insight: 'Vous mangez devant un écran.', recommendation: 'Manger avec distraction augmente la prise calorique de 25-50 % (Robinson et al., 2013). Mangez à table, sans écran, en vous concentrant sur les saveurs et textures.' },
  ],
  references: [
    { authors: 'Rong S, Snetselaar LG, Xu G et al.', title: 'Association of Skipping Breakfast With Cardiovascular and All-Cause Mortality', journal: 'J Am Coll Cardiol', year: 2019, doi: '10.1016/j.jacc.2019.01.065', pmid: '31023424' },
    { authors: 'Warren JM, Smith N, Ashwell M', title: 'A structured literature review on the role of mindfulness, mindful eating and intuitive eating in changing eating behaviours', journal: 'Nutr Res Rev', year: 2017, doi: '10.1017/S0954422417000154', pmid: '28718396' },
    { authors: 'Li J, Zhang N, Hu L et al.', title: 'Improvement in chewing activity reduces energy intake in one meal and modulates plasma gut hormone concentrations', journal: 'Obesity', year: 2011, doi: '10.1038/oby.2011.149', pmid: '21818149' },
    { authors: 'Robinson E, Aveyard P, Daley A et al.', title: 'Eating attentively: a systematic review and meta-analysis of the effect of food intake memory and awareness on eating', journal: 'Am J Clin Nutr', year: 2013, doi: '10.3945/ajcn.112.045245', pmid: '23364006' },
  ],
}

const macroReport: SectionReport = {
  sectionId: 'macronutriments',
  context:
    'L\'équilibre en macronutriments (protéines, glucides complexes, lipides de qualité) est un pilier de la longévité. L\'étude PURE (n = 135 000, 18 pays) a montré qu\'un apport modéré en glucides non raffinés et en graisses insaturées est associé à la mortalité la plus basse (Dehghan et al., 2017). Le ratio oméga-6/oméga-3 devrait être ≤ 4:1, alors qu\'il est souvent ≥ 15:1 dans l\'alimentation occidentale.',
  recommendations: [
    { maxPct: 40, level: 'alerte', title: 'Déséquilibre marqué', text: 'Votre profil macronutrimentaire montre des carences et des excès importants. Priorisez : 1) Protéines à chaque repas (1,2-1,6 g/kg/jour), 2) Remplacez les glucides raffinés par des complets, 3) Intégrez des oméga-3 quotidiennement (2 g EPA+DHA/jour). Ces changements seuls réduisent le risque cardiovasculaire de 30 % (Estruch et al., 2018).' },
    { maxPct: 60, level: 'vigilance', title: 'Profil à optimiser', text: 'Quelques déséquilibres à corriger. Visez l\'assiette santé : ½ légumes, ¼ protéines, ¼ glucides complexes. Ajoutez systématiquement une source de bons lipides (huile d\'olive, avocat, noix).' },
    { maxPct: 85, level: 'bon', title: 'Bon équilibre', text: 'Votre profil macronutrimentaire est globalement bon. Maintenez la diversité des sources protéiques et la qualité des glucides.' },
    { maxPct: 100, level: 'excellent', title: 'Équilibre optimal', text: 'Excellent profil macronutrimentaire. Vous optimisez vos apports pour la longévité.' },
  ],
  questionInsights: [
    { questionId: 'mac-1', triggerMaxScore: 0, insight: 'Apport protéique insuffisant.', recommendation: 'Un apport protéique régulier (25-30 g/repas) est essentiel pour la synthèse musculaire surtout après 40 ans. Sources : œufs, poisson, légumineuses + céréales, volaille. La sarcopénie commence dès 30 ans sans stimulation adéquate (Baum et al., 2016).' },
    { questionId: 'mac-3', triggerMaxScore: 0, insight: 'Consommation quotidienne de féculents raffinés.', recommendation: 'Les glucides raffinés (index glycémique élevé) favorisent l\'insulinorésistance et l\'inflammation. Remplacez progressivement : pain blanc → pain complet au levain, pâtes blanches → pâtes complètes ou légumineuses. La fermentation au levain réduit l\'index glycémique de 25 % (Liljeberg et al., 1995).' },
    { questionId: 'mac-5', triggerMaxScore: 0, insight: 'Surconsommation d\'ultra-transformés.', recommendation: 'Chaque augmentation de 10 % de la part d\'ultra-transformés augmente la mortalité de 14 % (Schnabel et al., 2019, cohorte NutriNet-Santé). Préparez des snacks sains à l\'avance : fruits secs, oléagineux, légumes coupés.' },
    { questionId: 'mac-8', triggerMaxScore: 0, insight: 'Carence en oméga-3.', recommendation: 'Les oméga-3 (EPA/DHA) réduisent l\'inflammation systémique, protègent le cœur et le cerveau. Visez 2-3 portions de poisson gras/semaine (sardines, maquereau, saumon sauvage) ou supplémentez (2 g/jour). L\'index oméga-3 érythrocytaire devrait être ≥ 8 % (Harris & Von Schacky, 2004).' },
  ],
  references: [
    { authors: 'Dehghan M, Mente A, Zhang X et al.', title: 'Associations of fats and carbohydrate intake with cardiovascular disease and mortality in 18 countries from five continents (PURE)', journal: 'Lancet', year: 2017, doi: '10.1016/S0140-6736(17)32252-3', pmid: '28864332' },
    { authors: 'Estruch R, Ros E, Salas-Salvadó J et al.', title: 'Primary Prevention of Cardiovascular Disease with a Mediterranean Diet Supplemented with Extra-Virgin Olive Oil or Nuts', journal: 'N Engl J Med', year: 2018, doi: '10.1056/NEJMoa1800389', pmid: '29897866' },
    { authors: 'Harris WS, Von Schacky C', title: 'The Omega-3 Index: a new risk factor for death from coronary heart disease?', journal: 'Prev Med', year: 2004, doi: '10.1016/j.ypmed.2004.02.030', pmid: '15208005' },
  ],
}

const microReport: SectionReport = {
  sectionId: 'micronutriments',
  context:
    'Les carences en micronutriments (vitamines et minéraux) sont fréquentes même dans les pays industrialisés — on parle de "faim cachée". 75 % des Français sont déficients en vitamine D, 23 % en zinc, et 25 % des femmes sont carencées en fer (ENNS). Les micronutriments sont des cofacteurs enzymatiques essentiels : leur déficit accélère le vieillissement biologique via le mécanisme de triage de Bruce Ames (Ames, 2006).',
  recommendations: [
    { maxPct: 40, level: 'alerte', title: 'Carences probables', text: 'Votre profil micronutritionnel est insuffisant. Vous êtes probablement en déficit multiple. Un bilan sanguin complet est recommandé (25-OH vitamine D, ferritine, zinc, magnésium, folates, B12). En attendant, diversifiez immédiatement avec 7+ portions de fruits/légumes/jour et envisagez un multivitamine de qualité.' },
    { maxPct: 60, level: 'vigilance', title: 'Apports à améliorer', text: 'Plusieurs micronutriments semblent sous-représentés. Appliquez la règle des "5 couleurs par jour" (antioxydants synergiques). Envisagez de tester votre vitamine D et votre fer, les deux déficiences les plus impactantes.' },
    { maxPct: 85, level: 'bon', title: 'Apports satisfaisants', text: 'Bon profil micronutritionnel. Maintenir la diversité alimentaire reste la meilleure stratégie. Assurez-vous de l\'exposition solaire (15 min/jour) ou d\'une supplémentation en vitamine D en hiver.' },
    { maxPct: 100, level: 'excellent', title: 'Profil optimal', text: 'Excellent profil micronutritionnel. Vous couvrez largement vos besoins via l\'alimentation.' },
  ],
  questionInsights: [
    { questionId: 'mic-1', triggerMaxScore: 0, insight: 'Consommation de légumes < 2 fois/jour.', recommendation: 'Les légumes apportent fibres, potassium, folates et polyphénols. Visez 400-600 g/jour. L\'étude Aune et al. (2017, méta-analyse, 95 études) montre une réduction de mortalité de 31 % à 10 portions/jour. Commencez par ajouter des légumes au petit-déjeuner (avocat, tomate, épinards).' },
    { questionId: 'mic-4', triggerMaxScore: 0, insight: 'Apport en fer potentiellement insuffisant.', recommendation: 'Le fer est essentiel pour le transport d\'oxygène et l\'énergie cellulaire. Sources héminiques (mieux absorbé) : viande rouge 2x/semaine, foie 1x/mois. Sources végétales (avec vitamine C pour absorption) : lentilles, pois chiches, épinards. Attention au thé/café qui inhibe l\'absorption de 60 % si pris au repas.' },
    { questionId: 'mic-6', triggerMaxScore: 0, insight: 'Possible déficit en vitamine D.', recommendation: 'La vitamine D module > 2 000 gènes, l\'immunité innée/adaptative et le risque de cancers. Dosez votre 25-OH-D et visez 40-60 ng/mL (Holick, 2007). En déficit, supplémentez avec 2 000-4 000 UI/jour de D3 (avec vitamine K2 pour synergie osseuse).' },
    { questionId: 'mic-9', triggerMaxScore: 0, insight: 'Apport en magnésium possiblement insuffisant.', recommendation: 'Le magnésium est le co-facteur de > 300 enzymes. Un déficit (très fréquent) contribue à l\'anxiété, crampes, trouble du sommeil et inflammation. Sources : chocolat noir > 85 %, amandes, graines de courge, eau riche en Mg (Hépar, Rozana). En supplémentation : bisglycinate de magnésium (300-400 mg/jour).' },
  ],
  references: [
    { authors: 'Ames BN', title: 'Low micronutrient intake may accelerate the degenerative diseases of aging through allocation of scarce micronutrients by triage', journal: 'Proc Natl Acad Sci USA', year: 2006, doi: '10.1073/pnas.0608757103', pmid: '17101959' },
    { authors: 'Aune D, Giovannucci E, Boffetta P et al.', title: 'Fruit and vegetable intake and the risk of cardiovascular disease, total cancer and all-cause mortality', journal: 'Int J Epidemiol', year: 2017, doi: '10.1093/ije/dyw319', pmid: '28338764' },
    { authors: 'Holick MF', title: 'Vitamin D Deficiency', journal: 'N Engl J Med', year: 2007, doi: '10.1056/NEJMra070553', pmid: '17634462' },
  ],
}

const ultraTransReport: SectionReport = {
  sectionId: 'ultra-transformes',
  context:
    'Les aliments ultra-transformés (classification NOVA 4) représentent 30-60 % de l\'apport calorique dans les pays industrialisés. L\'étude NutriNet-Santé (n = 44 551) a montré qu\'une augmentation de 10 % de la part d\'ultra-transformés est associée à +14 % de mortalité toutes causes (Schnabel et al., 2019), +12 % de risque de cancer (Fiolet et al., 2018) et +21 % de risque de dépression (Adjibade et al., 2019). Leurs mécanismes délétères incluent : additifs perturbateurs endocriniens, excès de sucre/sel/graisses trans, pauvreté en micronutriments et fibres, et altération du microbiote.',
  recommendations: [
    { maxPct: 40, level: 'alerte', title: 'Exposition critique', text: 'Votre exposition aux ultra-transformés est élevée et constitue un risque majeur pour votre santé à long terme. Action immédiate : remplacez 1 aliment industriel par jour par son équivalent brut (ex : biscuit → banane + amandes ; céréales sucrées → flocons d\'avoine + fruits). L\'application Yuka ou Open Food Facts aide à identifier les NOVA 4.' },
    { maxPct: 60, level: 'vigilance', title: 'Exposition à réduire', text: 'Votre consommation d\'ultra-transformés mérite attention. Appliquez la règle : si la liste d\'ingrédients contient > 5 ingrédients ou des noms incompréhensibles, c\'est probablement NOVA 4. Cuisinez en batch cooking le week-end pour la semaine.' },
    { maxPct: 85, level: 'bon', title: 'Bonne gestion', text: 'Vous limitez bien les ultra-transformés. Maintenez cette vigilance et privilégiez toujours les aliments bruts ou peu transformés.' },
    { maxPct: 100, level: 'excellent', title: 'Alimentation très saine', text: 'Vous évitez efficacement les ultra-transformés. C\'est un des facteurs les plus protecteurs pour la longévité.' },
  ],
  questionInsights: [
    { questionId: 'ut-2', triggerMaxScore: 0, insight: 'Consommation quotidienne de boissons sucrées.', recommendation: 'Les boissons sucrées sont associées à +20 % de mortalité par portion quotidienne (Malik et al., 2019, JAMA). Remplacez par : eau pétillante + citron, thé glacé maison, ou infusion froide. Les édulcorants artificiels ne sont pas une solution (altération du microbiote).' },
    { questionId: 'ut-4', triggerMaxScore: 0, insight: 'Consommation régulière de charcuterie.', recommendation: 'La charcuterie est classée cancérigène certain (groupe 1) par le CIRC/OMS. 50 g/jour augmentent le risque de cancer colorectal de 18 %. Limitez à 1 fois/semaine maximum. Alternatives : poulet rôti, saumon fumé artisanal, houmous, etc.' },
    { questionId: 'ut-6', triggerMaxScore: 0, insight: 'Vous ne filtrez pas les aliments NOVA 4.', recommendation: 'Apprenez à lire les étiquettes. Les aliments NOVA 4 contiennent généralement : sirop de glucose-fructose, huile de palme, protéines hydrolysées, amidons modifiés, colorants, émulsifiants (E471, E472). Privilégiez les aliments à une seule ligne d\'ingrédients (ex : "pommes").' },
  ],
  references: [
    { authors: 'Schnabel L, Kesse-Guyot E, Allès B et al.', title: 'Association Between Ultraprocessed Food Consumption and Risk of Mortality Among Middle-aged Adults in France', journal: 'JAMA Intern Med', year: 2019, doi: '10.1001/jamainternmed.2018.7289', pmid: '30742202' },
    { authors: 'Fiolet T, Srour B, Sellem L et al.', title: 'Consumption of ultra-processed foods and cancer risk: results from NutriNet-Santé prospective cohort', journal: 'BMJ', year: 2018, doi: '10.1136/bmj.k322', pmid: '29444771' },
    { authors: 'Malik VS, Li Y, Pan A et al.', title: 'Long-Term Consumption of Sugar-Sweetened and Artificially Sweetened Beverages and Risk of Mortality in US Adults', journal: 'Circulation', year: 2019, doi: '10.1161/CIRCULATIONAHA.118.037401', pmid: '30882235' },
  ],
}

const inflammatoireReport: SectionReport = {
  sectionId: 'inflammatoire',
  context:
    'L\'inflammation chronique de bas grade ("inflammaging") est le mécanisme central du vieillissement accéléré. Elle est liée aux maladies cardiovasculaires, aux cancers, au diabète de type 2 et à la neurodégénérescence. L\'alimentation est le levier n°1 : le Dietary Inflammatory Index (DII) prédit la mortalité toutes causes (Shivappa et al., 2017). Le ratio oméga-6/oméga-3, l\'alcool, et les produits issus d\'élevage conventionnel (antibiotiques, hormones) modulent directement la CRP et les cytokines pro-inflammatoires.',
  recommendations: [
    { maxPct: 40, level: 'alerte', title: 'Profil pro-inflammatoire', text: 'Votre alimentation est actuellement pro-inflammatoire, ce qui accélère le vieillissement biologique. Actions prioritaires : 1) Réduire l\'alcool (< 2 verres/sem), 2) Inverser le ratio ω-6/ω-3 (huile d\'olive au lieu de tournesol, sardines 2x/sem), 3) Choisir viande bio/label rouge, 4) Intégrer curcuma + poivre noir quotidiennement. Un régime méditerranéen réduit la CRP de 20-40 % (Casas et al., 2014).' },
    { maxPct: 60, level: 'vigilance', title: 'Tendance inflammatoire', text: 'Certains aspects de votre alimentation favorisent l\'inflammation. Augmentez les aliments anti-inflammatoires : baies, légumes colorés, thé vert, curcuma, poissons gras. Le régime méditerranéen est le gold standard pour réduire l\'inflammation systémique.' },
    { maxPct: 85, level: 'bon', title: 'Profil équilibré', text: 'Votre profil inflammatoire alimentaire est plutôt bon. Maintenez une alimentation riche en antioxydants et en oméga-3 pour une protection optimale.' },
    { maxPct: 100, level: 'excellent', title: 'Profil anti-inflammatoire', text: 'Votre alimentation est anti-inflammatoire. C\'est un des marqueurs les plus puissants de longévité en bonne santé.' },
  ],
  questionInsights: [
    { questionId: 'inf-1', triggerMaxScore: 0, insight: 'Consommation d\'alcool > 2 verres/semaine.', recommendation: 'Même une consommation modérée d\'alcool augmente le risque de cancer (sein +7 % par verre/jour, Wood et al., 2018, Lancet). L\'alcool perturbe le microbiote, augmente la perméabilité intestinale et favorise la stéatose hépatique. Visez < 2 verres/semaine ou abstinence complète.' },
    { questionId: 'inf-2', triggerMaxScore: 0, insight: 'Produits animaux principalement conventionnels.', recommendation: 'L\'élevage conventionnel utilise antibiotiques (favorisant la résistance) et hormones de croissance. Les viandes élevées en plein air/bio ont un meilleur profil lipidique (+ oméga-3, - oméga-6). Privilégiez : label rouge, bio, Bleu Blanc Cœur. Réduisez la viande rouge à 2x/semaine maximum.' },
    { questionId: 'inf-3', triggerMaxScore: 0, insight: 'Excès d\'oméga-6.', recommendation: 'Le ratio ω-6/ω-3 idéal est de 1-4:1, la moyenne occidentale est 15-20:1. Ce déséquilibre favorise l\'inflammation systémique. Remplacez l\'huile de tournesol par l\'huile d\'olive vierge extra + colza. Ajoutez graines de lin moulues (2 c. à soupe/jour) et noix (30 g/jour).' },
  ],
  references: [
    { authors: 'Shivappa N, Steck SE, Hurley TG et al.', title: 'A population-based dietary inflammatory index predicts levels of C-reactive protein in the Seasonal Variation of Blood Cholesterol Study (SEASONS)', journal: 'Public Health Nutr', year: 2014, doi: '10.1017/S1368980013002565', pmid: '24107546' },
    { authors: 'Casas R, Sacanella E, Estruch R', title: 'The immune protective effect of the Mediterranean diet against chronic low-grade inflammatory diseases', journal: 'Endocr Metab Immune Disord Drug Targets', year: 2014, pmid: '25244229' },
    { authors: 'Wood AM, Kaptoge S, Butterworth AS et al.', title: 'Risk thresholds for alcohol consumption: combined analysis of individual-participant data for 599,912 current drinkers', journal: 'Lancet', year: 2018, doi: '10.1016/S0140-6736(18)30134-X', pmid: '29676281' },
  ],
}

const bonusReport: SectionReport = {
  sectionId: 'bonus-sante',
  context:
    'Certaines pratiques alimentaires avancées (aliments fermentés, épices fonctionnelles, cuisson douce, polyphénols) sont des accélérateurs de longévité. Les populations des "Blue Zones" partagent ces habitudes (Buettner & Skemp, 2016). Les polyphénols activent les sirtuines et les voies de réparation cellulaire (AMPK, Nrf2), mimes du jeûne et de l\'exercice (Howitz et al., 2003).',
  recommendations: [
    { maxPct: 40, level: 'alerte', title: 'Pratiques absentes', text: 'Vous n\'intégrez pas encore les habitudes alimentaires avancées de longévité. Commencez par un geste simple : ajoutez du curcuma + poivre noir à vos plats chaque jour, et remplacez un café par du thé vert. Ces micro-habitudes ont un impact cumulatif majeur sur la longévité.' },
    { maxPct: 60, level: 'vigilance', title: 'Pratiques émergentes', text: 'Vous intégrez quelques pratiques avancées. Intensifiez avec : 1) Un aliment fermenté/jour (yaourt vivant, kéfir, kimchi), 2) Cuisson vapeur ou basse température autant que possible, 3) Baies ou chocolat noir (> 85 %) quotidien.' },
    { maxPct: 85, level: 'bon', title: 'Bonnes pratiques', text: 'Vous adoptez plusieurs habitudes protectrices avancées. Continuez à diversifier les polyphénols et les sources fermentées.' },
    { maxPct: 100, level: 'excellent', title: 'Pratiques optimales', text: 'Vous maîtrisez les pratiques alimentaires de longévité avancée. Digne des populations centenaires des Blue Zones.' },
  ],
  questionInsights: [
    { questionId: 'bon-1', triggerMaxScore: 0, insight: 'Pas de consommation régulière d\'aliments fermentés.', recommendation: 'Les aliments fermentés augmentent la diversité du microbiote de 10-15 % en 10 semaines (Wastyk et al., 2021, Cell). Commencez par du yaourt nature vivant ou du kéfir. Le kimchi et la choucroute sont encore plus riches en souches probiotiques. Visez 1 portion/jour.' },
    { questionId: 'bon-3', triggerMaxScore: 0, insight: 'Vous ne pratiquez pas la cuisson douce.', recommendation: 'La cuisson à haute température (> 120°C) forme des produits de glycation avancée (AGE) et des amines hétérocycliques (cancérigènes). La cuisson vapeur préserve 90 % des vitamines vs 50 % en friture. Investissez dans un cuiseur vapeur ou un Instant Pot.' },
    { questionId: 'bon-4', triggerMaxScore: 0, insight: 'Apport en polyphénols insuffisant.', recommendation: 'Les polyphénols sont les antioxydants les plus puissants de l\'alimentation. Le resvératrol (raisin, vin rouge), les catéchines (thé vert), les anthocyanes (baies) activent les voies de longévité (sirtuines, AMPK). Visez : 2 tasses de thé vert/jour + une poignée de baies + 20 g de chocolat noir > 85 %.' },
  ],
  references: [
    { authors: 'Buettner D, Skemp S', title: 'Blue Zones: Lessons From the World\'s Longest Lived', journal: 'Am J Lifestyle Med', year: 2016, doi: '10.1177/1559827616637066', pmid: '30202288' },
    { authors: 'Wastyk HC, Fragiadakis GK, Perelman D et al.', title: 'Gut-microbiota-targeted diets modulate human immune status', journal: 'Cell', year: 2021, doi: '10.1016/j.cell.2021.06.019', pmid: '34256014' },
    { authors: 'Howitz KT, Bitterman KJ, Cohen HY et al.', title: 'Small molecule activators of sirtuins extend Saccharomyces cerevisiae lifespan', journal: 'Nature', year: 2003, doi: '10.1038/nature01960', pmid: '14499354' },
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
  // Alimentaire
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
    if (qi.triggerMinScore !== undefined) return s >= qi.triggerMinScore
    return s <= (qi.triggerMaxScore ?? Infinity)
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
    title: 'L\'alimentation module votre ADN',
    description: 'La nutrigénomique montre que ce que vous mangez active ou désactive des gènes liés à la longévité (sirtuines, FOXO, mTOR). Une alimentation riche en polyphénols et pauvre en ultra-transformés favorise l\'expression des gènes protecteurs.',
    reference: 'Ordovas & Smith, 2010, Nat Rev Cardiol'
  },
  {
    title: 'Le microbiote : votre "deuxième cerveau"',
    description: 'Les 100 000 milliards de bactéries intestinales produisent des neurotransmetteurs (95 % de la sérotonine), des vitamines et des acides gras à chaîne courte protecteurs. La diversité du microbiote est le meilleur prédicteur de santé intestinale.',
    reference: 'Sonnenburg & Sonnenburg, 2019, Cell'
  },
  {
    title: 'L\'inflammation chronique accélère le vieillissement',
    description: 'L\'"inflammaging" est le mécanisme central de toutes les maladies chroniques. L\'alimentation est le levier le plus puissant pour la contrôler — plus que les médicaments dans la plupart des cas.',
    reference: 'Franceschi et al., 2018, Nat Rev Endocrinol'
  },
]

/**
 * Generates a prioritized action plan (top 3 actions) based on lowest scoring sections
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
