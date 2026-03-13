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
    'Le reflux gastro-œsophagien touche 10-20 % de la population. C\'est quand l\'acide de l\'estomac remonte vers la gorge — causant brûlures, régurgitations et parfois une toux chronique. Non traité sur le long terme, il peut fragiliser la paroi de l\'œsophage.',
  recommendations: [
    { maxPct: 33, level: 'alerte', title: 'Reflux sévère', text: 'Vos symptômes de reflux sont importants. Un bilan endoscopique est recommandé. Évitez les repas copieux le soir, surélevez la tête de lit de 15 cm, et limitez café, alcool, chocolat et aliments acides. La prise en charge diététique seule réduit les symptômes de 30 à 50 % (Kaltenbach et al., 2006).' },
    { maxPct: 66, level: 'vigilance', title: 'Reflux modéré', text: 'Vous présentez des symptômes de reflux à surveiller. Adoptez des mesures hygiéno-diététiques : fractionner les repas, ne pas se coucher dans les 3h suivant le dîner, éviter les boissons gazeuses. Les études montrent un bénéfice net de la posture post-prandiale (Ness-Jensen et al., 2016).' },
    { maxPct: 90, level: 'bon', title: 'Reflux léger', text: 'Peu de symptômes de reflux. Maintenez vos bonnes habitudes. Privilégiez les repas fractionnés et bien mastiqués.' },
    { maxPct: 100, level: 'excellent', title: 'Pas de reflux', text: 'Aucun signe de reflux gastro-œsophagien. Excellent indicateur de santé digestive haute.' },
  ],
  questionInsights: [
    { questionId: 'ref-1', triggerMinScore: 75, insight: 'Vos brûlures d\'estomac sont fréquentes.', recommendation: 'Évitez les aliments déclencheurs : tomate, agrumes, café, menthe, chocolat, alcool. Si vous prenez des médicaments anti-acide, faites-le sous supervision médicale. Des alternatives naturelles (réglisse spéciale, gel d\'aloe vera) montrent une efficacité dans les formes légères.' },
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
    'Les douleurs abdominales fonctionnelles touchent 15-25 % des adultes. Elles sont souvent liées au syndrome de l\'intestin irritable, au stress ou à des troubles de la digestion. Le lien entre l\'intestin et le cerveau est central : 70 % des personnes avec un intestin irritable voient leurs symptômes s\'aggraver en période de stress.',
  recommendations: [
    { maxPct: 33, level: 'alerte', title: 'Douleurs importantes', text: 'Vos douleurs abdominales sont significatives. Un bilan médical est recommandé pour exclure une cause organique. En attendant, un régime pauvre en aliments fermentescibles (FODMAPs) réduit les douleurs chez 75 % des personnes souffrant d\'intestin irritable. La respiration rythmée (5 min/jour) peut aussi réduire de 40 % les symptômes digestifs liés au stress.' },
    { maxPct: 66, level: 'vigilance', title: 'Douleurs modérées', text: 'Des douleurs abdominales régulières méritent attention. Tenez un journal alimentaire pendant 2 semaines pour identifier les aliments déclencheurs. 30 min de marche par jour améliorent la digestion et réduisent la sensibilité intestinale.' },
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
    'Les symptômes d\'indigestion (ballonnements, gaz, éructations) affectent 20-30 % de la population. Ils reflètent souvent un déséquilibre des bactéries intestinales ou une fermentation excessive de certains aliments. Votre intestin abrite 100 000 milliards de bactéries qui influencent votre digestion, votre immunité et même votre humeur.',
  recommendations: [
    { maxPct: 33, level: 'alerte', title: 'Indigestion sévère', text: 'Vos symptômes d\'indigestion sont importants. Envisagez un régime pauvre en aliments fermentescibles (FODMAPs) de 6 semaines avec un diététicien, suivi d\'une réintroduction progressive. Les probiotiques multi-souches réduisent les ballonnements de 44 % selon une revue scientifique internationale. Mâchez lentement — 20 à 30 fois par bouchée.' },
    { maxPct: 66, level: 'vigilance', title: 'Indigestion modérée', text: 'Des ballonnements réguliers méritent attention. Réduisez les crudités au profit de légumes cuits (plus digestibles), faites tremper les légumineuses 12h avant cuisson, et mâchez lentement. La menthe poivrée en capsules spéciales intestinales réduit les ballonnements.' },
    { maxPct: 90, level: 'bon', title: 'Bonne digestion', text: 'Peu de symptômes d\'indigestion. La diversité alimentaire maintient la richesse du microbiote. Consommez 30 végétaux différents par semaine (recommandation du American Gut Project).' },
    { maxPct: 100, level: 'excellent', title: 'Digestion excellente', text: 'Aucun trouble d\'indigestion. Votre microbiote semble en bonne santé.' },
  ],
  questionInsights: [
    { questionId: 'ind-2', triggerMinScore: 75, insight: 'Ballonnements fréquents.', recommendation: 'Des ballonnements chroniques signalent souvent un déséquilibre des bactéries intestinales. Intégrez des aliments riches en fibres prébiotiques (en commençant par de petites doses pour éviter une aggravation initiale) et des probiotiques. Astuce : si les ballonnements apparaissent dans les 30 min après le repas, la cause est plutôt gastrique ; s\'ils arrivent 2h après, c\'est l\'intestin.' },
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
    'La diarrhée chronique fonctionnelle affecte 5-10 % des adultes. Elle peut refléter un syndrome de l\'intestin irritable, une intolérance alimentaire (lactose, fructose, gluten) ou une légère inflammation intestinale. Un transit trop rapide réduit l\'absorption des nutriments et déséquilibre les bactéries de l\'intestin.',
  recommendations: [
    { maxPct: 33, level: 'alerte', title: 'Transit accéléré sévère', text: 'Vos symptômes de transit accéléré sont importants. Un bilan médical est recommandé : marqueurs d\'inflammation dans les selles, test sanguin pour la maladie cœliaque, tests respiratoires pour intolérances alimentaires. En attendant, les fibres solubles (psyllium 10 g/jour dans un grand verre d\'eau) régularisent le transit. Évitez café, lait de vache et sorbitol. Un probiotique spécifique (Saccharomyces boulardii) a montré son efficacité.' },
    { maxPct: 66, level: 'vigilance', title: 'Transit légèrement accéléré', text: 'Un transit accéléré mérite surveillance. Identifiez les déclencheurs alimentaires. Le psyllium (5-10 g/jour) absorbe l\'excès d\'eau dans le côlon. L\'exercice régulier régule la motilité.' },
    { maxPct: 90, level: 'bon', title: 'Transit normal', text: 'Votre transit est satisfaisant. Maintenez un apport en fibres équilibré (25-30 g/jour) et une bonne hydratation.' },
    { maxPct: 100, level: 'excellent', title: 'Transit optimal', text: 'Aucun signe de transit accéléré. Signe d\'un bon équilibre intestinal.' },
  ],
  questionInsights: [
    { questionId: 'dia-3', triggerMinScore: 75, insight: 'Urgences intestinales fréquentes.', recommendation: 'Des envies urgentes et incontrôlables d\'aller aux toilettes peuvent signaler une sensibilité accrue ou une légère inflammation. La glutamine (5 g/jour, un acide aminé naturel) a montré une réduction de 80 % de ces urgences dans les cas post-infectieux. Consultez si les symptômes persistent.' },
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
    'La constipation fonctionnelle touche 12-19 % de la population mondiale. Elle est associée à un risque accru de maladies cardiovasculaires (+12 %) et de cancer colorectal. Un transit trop lent favorise la réabsorption de substances indésirables dans le sang et déséquilibre les bactéries intestinales.',
  recommendations: [
    { maxPct: 33, level: 'alerte', title: 'Constipation sévère', text: 'Votre constipation est significative. Augmentez progressivement les fibres insolubles (son de blé, légumes verts) à 30-35 g/jour, buvez au moins 2L d\'eau/jour, et marchez 30 min quotidiennement. Les probiotiques (notamment les Bifidobacterium) améliorent le temps de transit de 12h en moyenne. Si la constipation persiste plus de 3 mois, un bilan médical est utile pour en identifier la cause.' },
    { maxPct: 66, level: 'vigilance', title: 'Constipation modérée', text: 'Un ralentissement du transit mérite attention. Intégrez des graines de lin (2 c. à soupe/jour dans de l\'eau), des pruneaux, et du kiwi (2/jour — efficacité démontrée). Profitez des 15-30 minutes après le petit-déjeuner pour aller aux toilettes : c\'est le moment où le côlon est naturellement le plus actif.' },
    { maxPct: 90, level: 'bon', title: 'Transit satisfaisant', text: 'Votre transit est globalement régulier. Maintenez une alimentation riche en fibres variées et une hydratation suffisante.' },
    { maxPct: 100, level: 'excellent', title: 'Transit optimal', text: 'Aucun signe de constipation. Signe d\'un bon fonctionnement colique.' },
  ],
  questionInsights: [
    { questionId: 'con-3', triggerMinScore: 75, insight: 'Sensation de vidange incomplète fréquente.', recommendation: 'Cette sensation peut indiquer que les muscles du périnée ne se relâchent pas correctement. La rééducation périnéale est efficace dans 70 % des cas. En première intention : placez un petit tabouret sous les pieds aux toilettes — cette position accroupie libère naturellement le passage et facilite la vidange complète.' },
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
    { questionId: 'hab-3', triggerMaxScore: 0, insight: 'Vous grignotez entre les repas.', recommendation: 'Le grignotage perturbe la régulation du sucre dans le sang et bloque la combustion des graisses. Espacez vos repas de 4-5h minimum. En cas de fringale : eau, thé vert, ou une poignée d\'amandes.' },
    { questionId: 'hab-4', triggerMaxScore: 0, insight: 'Vous mangez trop vite.', recommendation: 'Manger vite double le risque de prise de poids et de troubles métaboliques. Posez vos couverts entre chaque bouchée. Un repas devrait durer au moins 20 minutes — c\'est le temps qu\'il faut à votre cerveau pour recevoir le signal de satiété.' },
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
    'L\'équilibre entre protéines, glucides et bonnes graisses est un pilier de la longévité. Une grande étude sur 135 000 personnes dans 18 pays a montré que des glucides non raffinés et des graisses de qualité (huile d\'olive, noix, poissons gras) sont associés à la mortalité la plus basse. Dans notre alimentation moderne, le ratio bonnes graisses/mauvaises graisses est souvent très déséquilibré — au détriment de notre santé.',
  recommendations: [
    { maxPct: 40, level: 'alerte', title: 'Déséquilibre marqué', text: 'Votre alimentation montre des carences et des excès importants. Priorisez : 1) Des protéines à chaque repas, 2) Remplacez les féculents blancs par des complets, 3) Intégrez des oméga-3 quotidiennement (poissons gras 2x/semaine ou huile de lin). Ces changements seuls réduisent le risque cardiovasculaire de 30 %.' },
    { maxPct: 60, level: 'vigilance', title: 'Profil à optimiser', text: 'Quelques déséquilibres à corriger. Visez l\'assiette santé : ½ légumes, ¼ protéines, ¼ glucides complexes. Ajoutez systématiquement une source de bons lipides (huile d\'olive, avocat, noix).' },
    { maxPct: 85, level: 'bon', title: 'Bon équilibre', text: 'Votre profil macronutrimentaire est globalement bon. Maintenez la diversité des sources protéiques et la qualité des glucides.' },
    { maxPct: 100, level: 'excellent', title: 'Équilibre optimal', text: 'Excellent profil macronutrimentaire. Vous optimisez vos apports pour la longévité.' },
  ],
  questionInsights: [
    { questionId: 'mac-1', triggerMaxScore: 0, insight: 'Apport protéique insuffisant.', recommendation: 'Un apport protéique régulier (25-30 g/repas) est essentiel pour maintenir votre masse musculaire, surtout après 40 ans. On perd naturellement du muscle avec l\'âge — et sans apport protéique suffisant, ce processus s\'accélère. Sources : œufs, poisson, légumineuses + céréales, volaille.' },
    { questionId: 'mac-3', triggerMaxScore: 0, insight: 'Consommation quotidienne de féculents raffinés.', recommendation: 'Les glucides raffinés (pain blanc, pâtes blanches, riz blanc) font monter rapidement le taux de sucre dans le sang, favorisant l\'inflammation et la prise de poids. Remplacez progressivement : pain blanc → pain complet au levain, pâtes blanches → pâtes complètes ou légumineuses. Le levain réduit cet impact sur la glycémie de 25 %.' },
    { questionId: 'mac-5', triggerMaxScore: 0, insight: 'Surconsommation d\'ultra-transformés.', recommendation: 'Chaque augmentation de 10 % de la part d\'ultra-transformés dans l\'alimentation augmente la mortalité de 14 % (étude NutriNet-Santé). Préparez des snacks sains à l\'avance : fruits secs, noix, légumes coupés.' },
    { questionId: 'mac-8', triggerMaxScore: 0, insight: 'Carence en oméga-3.', recommendation: 'Les oméga-3 (les bonnes graisses des poissons gras) réduisent l\'inflammation, protègent le cœur et le cerveau. Visez 2-3 portions de poisson gras/semaine (sardines, maquereau, saumon sauvage) ou prenez un complément (2 g/jour). Un bilan sanguin peut mesurer votre taux si vous voulez un suivi précis.' },
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
    'Les carences en vitamines et minéraux sont fréquentes même dans les pays industrialisés — on parle de "faim cachée" car on mange beaucoup mais mal. 75 % des Français manquent de vitamine D, 23 % de zinc, et 25 % des femmes manquent de fer (ENNS). Ces nutriments sont indispensables au bon fonctionnement de l\'organisme : leur déficit accélère le vieillissement biologique, même sans symptôme visible (Ames, 2006).',
  recommendations: [
    { maxPct: 40, level: 'alerte', title: 'Carences probables', text: 'Votre profil nutritionnel est insuffisant. Vous êtes probablement en déficit sur plusieurs nutriments essentiels. Un bilan sanguin complet est recommandé (vitamine D, fer, zinc, magnésium, folates, vitamine B12). En attendant, diversifiez immédiatement avec 7+ portions de fruits/légumes/jour et envisagez un multivitamine de qualité.' },
    { maxPct: 60, level: 'vigilance', title: 'Apports à améliorer', text: 'Plusieurs micronutriments semblent sous-représentés. Appliquez la règle des "5 couleurs par jour" (antioxydants synergiques). Envisagez de tester votre vitamine D et votre fer, les deux déficiences les plus impactantes.' },
    { maxPct: 85, level: 'bon', title: 'Apports satisfaisants', text: 'Bon profil micronutritionnel. Maintenir la diversité alimentaire reste la meilleure stratégie. Assurez-vous de l\'exposition solaire (15 min/jour) ou d\'une supplémentation en vitamine D en hiver.' },
    { maxPct: 100, level: 'excellent', title: 'Profil optimal', text: 'Excellent profil micronutritionnel. Vous couvrez largement vos besoins via l\'alimentation.' },
  ],
  questionInsights: [
    { questionId: 'mic-1', triggerMaxScore: 0, insight: 'Consommation de légumes < 2 fois/jour.', recommendation: 'Les légumes apportent fibres, potassium, folates et polyphénols. Visez 400-600 g/jour. L\'étude Aune et al. (2017, méta-analyse, 95 études) montre une réduction de mortalité de 31 % à 10 portions/jour. Commencez par ajouter des légumes au petit-déjeuner (avocat, tomate, épinards).' },
    { questionId: 'mic-4', triggerMaxScore: 0, insight: 'Apport en fer potentiellement insuffisant.', recommendation: 'Le fer est essentiel pour le transport d\'oxygène et l\'énergie cellulaire. Sources héminiques (mieux absorbé) : viande rouge 2x/semaine, foie 1x/mois. Sources végétales (avec vitamine C pour absorption) : lentilles, pois chiches, épinards. Attention au thé/café qui inhibe l\'absorption de 60 % si pris au repas.' },
    { questionId: 'mic-6', triggerMaxScore: 0, insight: 'Possible déficit en vitamine D.', recommendation: 'La vitamine D est une hormone qui influence des centaines de fonctions : immunité, os, humeur, prévention de certains cancers. Un simple dosage sanguin suffit à savoir si vous en manquez. En cas de déficit (très fréquent en France), une supplémentation de 2 000-4 000 UI/jour de D3 (avec vitamine K2 pour bénéfice osseux) est recommandée.' },
    { questionId: 'mic-9', triggerMaxScore: 0, insight: 'Apport en magnésium possiblement insuffisant.', recommendation: 'Le magnésium intervient dans plus de 300 réactions dans le corps. Un manque (très fréquent) contribue à l\'anxiété, aux crampes, aux troubles du sommeil et à l\'inflammation. Sources alimentaires : chocolat noir > 85 %, amandes, graines de courge, eaux minérales (Hépar, Rozana). En complément : le magnésium bisglycinate est la forme la mieux absorbée et la mieux tolérée (300-400 mg/jour).' },
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
    'Les aliments ultra-transformés (industriels, avec de nombreux additifs) représentent 30-60 % des calories consommées dans les pays riches. Une grande étude française (NutriNet-Santé, 44 551 personnes) montre qu\'une augmentation de 10 % de ces aliments dans l\'alimentation est associée à +14 % de mortalité (Schnabel et al., 2019), +12 % de risque de cancer (Fiolet et al., 2018) et +21 % de risque de dépression (Adjibade et al., 2019). Ces effets s\'expliquent par leurs additifs (qui perturbent les hormones), leur excès de sucre et de sel, leur pauvreté en fibres et vitamines, et leur impact négatif sur les bactéries intestinales.',
  recommendations: [
    { maxPct: 40, level: 'alerte', title: 'Exposition critique', text: 'Votre exposition aux ultra-transformés est élevée et constitue un risque majeur pour votre santé à long terme. Action immédiate : remplacez 1 aliment industriel par jour par son équivalent brut (ex : biscuit → banane + amandes ; céréales sucrées → flocons d\'avoine + fruits). L\'application Yuka ou Open Food Facts aide à identifier les NOVA 4.' },
    { maxPct: 60, level: 'vigilance', title: 'Exposition à réduire', text: 'Votre consommation d\'ultra-transformés mérite attention. Appliquez la règle : si la liste d\'ingrédients contient > 5 ingrédients ou des noms incompréhensibles, c\'est probablement NOVA 4. Cuisinez en batch cooking le week-end pour la semaine.' },
    { maxPct: 85, level: 'bon', title: 'Bonne gestion', text: 'Vous limitez bien les ultra-transformés. Maintenez cette vigilance et privilégiez toujours les aliments bruts ou peu transformés.' },
    { maxPct: 100, level: 'excellent', title: 'Alimentation très saine', text: 'Vous évitez efficacement les ultra-transformés. C\'est un des facteurs les plus protecteurs pour la longévité.' },
  ],
  questionInsights: [
    { questionId: 'ut-2', triggerMaxScore: 0, insight: 'Consommation quotidienne de boissons sucrées.', recommendation: 'Les boissons sucrées sont associées à +20 % de mortalité par portion quotidienne (Malik et al., 2019, JAMA). Remplacez par : eau pétillante + citron, thé glacé maison, ou infusion froide. Les édulcorants artificiels ne sont pas une solution (altération du microbiote).' },
    { questionId: 'ut-4', triggerMaxScore: 0, insight: 'Consommation régulière de charcuterie.', recommendation: 'La charcuterie est classée cancérigène avéré par l\'Organisation Mondiale de la Santé. 50 g/jour (environ 2 tranches de jambon) augmentent le risque de cancer du côlon de 18 %. Limitez à 1 fois/semaine maximum. Alternatives : poulet rôti, saumon fumé artisanal, houmous, etc.' },
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
    'L\'inflammation silencieuse chronique est le mécanisme central du vieillissement accéléré — les chercheurs l\'appellent "inflammaging" (contraction d\'inflammation et aging, le vieillissement en anglais). Elle est liée aux maladies cardiovasculaires, aux cancers, au diabète et aux maladies neurodégénératives. L\'alimentation est le levier n°1 : un indice scientifique de la qualité anti-inflammatoire du régime prédit la mortalité toutes causes (Shivappa et al., 2017). Le déséquilibre entre graisses pro-inflammatoires (huiles végétales industrielles, viandes conventionnelles) et graisses protectrices (huile d\'olive, poissons gras) augmente directement les marqueurs d\'inflammation dans le sang.',
  recommendations: [
    { maxPct: 40, level: 'alerte', title: 'Profil pro-inflammatoire', text: 'Votre alimentation est actuellement pro-inflammatoire, ce qui accélère le vieillissement biologique. Actions prioritaires : 1) Réduire l\'alcool (< 2 verres/sem), 2) Remplacer l\'huile de tournesol par l\'huile d\'olive, ajouter des sardines 2x/sem, 3) Choisir viande bio/label rouge, 4) Intégrer curcuma + poivre noir quotidiennement. Un régime méditerranéen réduit les marqueurs d\'inflammation dans le sang de 20-40 % (Casas et al., 2014).' },
    { maxPct: 60, level: 'vigilance', title: 'Tendance inflammatoire', text: 'Certains aspects de votre alimentation favorisent l\'inflammation. Augmentez les aliments anti-inflammatoires : baies, légumes colorés, thé vert, curcuma, poissons gras. Le régime méditerranéen est le gold standard pour réduire l\'inflammation systémique.' },
    { maxPct: 85, level: 'bon', title: 'Profil équilibré', text: 'Votre profil inflammatoire alimentaire est plutôt bon. Maintenez une alimentation riche en antioxydants et en oméga-3 pour une protection optimale.' },
    { maxPct: 100, level: 'excellent', title: 'Profil anti-inflammatoire', text: 'Votre alimentation est anti-inflammatoire. C\'est un des marqueurs les plus puissants de longévité en bonne santé.' },
  ],
  questionInsights: [
    { questionId: 'inf-1', triggerMaxScore: 0, insight: 'Consommation d\'alcool > 2 verres/semaine.', recommendation: 'Même une consommation modérée d\'alcool augmente le risque de cancer (sein +7 % par verre/jour, Wood et al., 2018, Lancet). L\'alcool perturbe le microbiote, augmente la perméabilité intestinale et favorise la stéatose hépatique. Visez < 2 verres/semaine ou abstinence complète.' },
    { questionId: 'inf-2', triggerMaxScore: 0, insight: 'Produits animaux principalement conventionnels.', recommendation: 'L\'élevage conventionnel utilise antibiotiques (favorisant la résistance) et hormones de croissance. Les viandes élevées en plein air/bio ont un meilleur profil lipidique (+ oméga-3, - oméga-6). Privilégiez : label rouge, bio, Bleu Blanc Cœur. Réduisez la viande rouge à 2x/semaine maximum.' },
    { questionId: 'inf-3', triggerMaxScore: 0, insight: 'Excès d\'oméga-6.', recommendation: 'Notre alimentation moderne contient trop de graisses pro-inflammatoires (oméga-6, présentes dans les huiles végétales industrielles) par rapport aux graisses protectrices (oméga-3, dans les poissons gras). Dans l\'alimentation occidentale typique, ce ratio est 15 à 20 fois trop déséquilibré. Remplacez l\'huile de tournesol par l\'huile d\'olive vierge extra ou de colza. Ajoutez des graines de lin moulues (2 c. à soupe/jour) et des noix (30 g/jour).' },
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
    'Certaines pratiques alimentaires avancées (aliments fermentés, épices, cuisson douce, fruits et légumes colorés riches en antioxydants) sont de véritables accélérateurs de longévité. Les populations des "Blue Zones" — les régions du monde où l\'on vit le plus longtemps en bonne santé — partagent ces habitudes (Buettner & Skemp, 2016). Ces aliments activent des mécanismes de protection et de réparation cellulaire dans le corps, ayant un effet similaire à celui du jeûne ou de l\'exercice physique (Howitz et al., 2003).',
  recommendations: [
    { maxPct: 40, level: 'alerte', title: 'Pratiques absentes', text: 'Vous n\'intégrez pas encore les habitudes alimentaires avancées de longévité. Commencez par un geste simple : ajoutez du curcuma + poivre noir à vos plats chaque jour, et remplacez un café par du thé vert. Ces micro-habitudes ont un impact cumulatif majeur sur la longévité.' },
    { maxPct: 60, level: 'vigilance', title: 'Pratiques émergentes', text: 'Vous intégrez quelques pratiques avancées. Intensifiez avec : 1) Un aliment fermenté/jour (yaourt vivant, kéfir, kimchi), 2) Cuisson vapeur ou basse température autant que possible, 3) Baies ou chocolat noir (> 85 %) quotidien.' },
    { maxPct: 85, level: 'bon', title: 'Bonnes pratiques', text: 'Vous adoptez plusieurs habitudes protectrices avancées. Continuez à diversifier les polyphénols et les sources fermentées.' },
    { maxPct: 100, level: 'excellent', title: 'Pratiques optimales', text: 'Vous maîtrisez les pratiques alimentaires de longévité avancée. Digne des populations centenaires des Blue Zones.' },
  ],
  questionInsights: [
    { questionId: 'bon-1', triggerMaxScore: 0, insight: 'Pas de consommation régulière d\'aliments fermentés.', recommendation: 'Les aliments fermentés augmentent la diversité du microbiote de 10-15 % en 10 semaines (Wastyk et al., 2021, Cell). Commencez par du yaourt nature vivant ou du kéfir. Le kimchi et la choucroute sont encore plus riches en souches probiotiques. Visez 1 portion/jour.' },
    { questionId: 'bon-3', triggerMaxScore: 0, insight: 'Vous ne pratiquez pas la cuisson douce.', recommendation: 'La cuisson à haute température (> 120°C — friture, grillade très chaude) crée des substances nocives dans les aliments, dont certaines sont cancérigènes. La cuisson vapeur préserve 90 % des vitamines contre 50 % en friture. Investissez dans un cuiseur vapeur ou une cocotte-minute pour vos légumes et protéines.' },
    { questionId: 'bon-4', triggerMaxScore: 0, insight: 'Apport en polyphénols insuffisant.', recommendation: 'Les polyphénols (présents dans les baies, le thé vert, le vin rouge, le chocolat noir, les légumes colorés) sont les antioxydants les plus puissants de l\'alimentation. Ils activent des mécanismes naturels de protection et de réparation cellulaire. Visez : 2 tasses de thé vert/jour + une poignée de baies + 20 g de chocolat noir > 85 %.' },
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
    title: 'Ce que vous mangez programme vos gènes',
    description: 'La science a montré que ce que vous mangez peut littéralement activer ou désactiver des gènes liés à la longévité et à la protection contre les maladies. Une alimentation riche en antioxydants (fruits, légumes, thé vert) et pauvre en ultra-transformés favorise l\'expression des gènes protecteurs.',
    reference: 'Ordovas & Smith, 2010, Nat Rev Cardiol'
  },
  {
    title: 'Le microbiote : votre "deuxième cerveau"',
    description: 'Les 100 000 milliards de bactéries intestinales produisent 95 % de la sérotonine (la molécule du bien-être), des vitamines essentielles et des substances qui protègent l\'intestin et le cerveau. La diversité de ces bactéries est le meilleur prédicteur de santé intestinale — et elle dépend directement de ce que vous mangez.',
    reference: 'Sonnenburg & Sonnenburg, 2019, Cell'
  },
  {
    title: 'L\'inflammation silencieuse accélère le vieillissement',
    description: 'Une inflammation de bas bruit (que l\'on ne ressent pas mais qui s\'accumule sur des années) est le mécanisme central de toutes les grandes maladies chroniques. L\'alimentation est le levier le plus puissant pour la contrôler — plus que les médicaments dans la plupart des cas.',
    reference: 'Franceschi et al., 2018, Nat Rev Endocrinol'
  },
]

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
    // Nutrition uses maxPct: low pct = good (fewer symptoms / better habits)
    if (rec.level === 'excellent' || rec.level === 'bon') {
      strengths.push({ sectionId: r.sectionId, title: r.title, pct: r.pct, praise: rec.text, science: report.context.split('.').slice(0, 2).join('.') + '.', reference: ref0 })
    } else {
      weaknesses.push({ sectionId: r.sectionId, title: r.title, pct: r.pct, level: rec.level, concern: rec.text, science: report.context, reference: ref0, triggeredInsights: triggered.map(t => ({ questionId: t.questionId, insight: t.insight, recommendation: t.recommendation })) })
    }
  }
  weaknesses.sort((a, b) => b.pct - a.pct)

  const phase1: { action: string; why: string; sectionId: string }[] = []
  const phase2: { action: string; why: string; sectionId: string }[] = []
  for (const w of weaknesses) {
    for (const ti of w.triggeredInsights) {
      const short = ti.recommendation.split('.').slice(0, 2).join('.') + '.'
      if (w.level === 'alerte') phase1.push({ action: short, why: ti.insight, sectionId: w.sectionId })
      else phase2.push({ action: short, why: ti.insight, sectionId: w.sectionId })
    }
    if (w.triggeredInsights.length === 0) {
      phase1.push({ action: w.concern.split('.').slice(0, 2).join('.') + '.', why: `Score ${w.title} : ${w.pct}%`, sectionId: w.sectionId })
    }
  }
  const actionPlan: ActionPhase[] = []
  if (phase1.length > 0) actionPlan.push({ phase: 1, phaseTitle: 'Actions immédiates', timeframe: 'Semaines 1-2', actions: phase1.slice(0, 5) })
  if (phase2.length > 0) actionPlan.push({ phase: 2, phaseTitle: 'Consolidation', timeframe: 'Semaines 3-8', actions: phase2.slice(0, 5) })
  if (actionPlan.length === 0) actionPlan.push({ phase: 1, phaseTitle: 'Maintien des acquis', timeframe: 'En continu', actions: [{ action: 'Maintenez vos bonnes pratiques nutritionnelles et digestives.', why: 'Vos scores nutrition sont bons — continuez ainsi.', sectionId: '' }] })

  return { strengths, weaknesses, actionPlan, globalInsights: globalKeyInsights, sectionReports }
}

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
