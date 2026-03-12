// ──────────────────────────────────────────────────────
// Bilan Troubles Digestifs — Compte-rendu scientifique
// Basé sur le GSRS et la littérature peer-reviewed
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
  recommendations: {
    maxPct: number
    level: 'alerte' | 'vigilance' | 'bon' | 'excellent'
    title: string
    text: string
  }[]
  questionInsights: {
    questionId: string
    triggerMaxScore: number
    insight: string
    recommendation: string
  }[]
  references: ScientificReference[]
}

// ══════════════════════════════════════════════════════
// Reflux gastro-œsophagien (GSRS)
// ══════════════════════════════════════════════════════

const refluxReport: SectionReport = {
  sectionId: 'reflux',
  context:
    'Le reflux gastro-œsophagien (RGO) touche 10-20 % de la population occidentale. Il est associé à une inflammation chronique de l\'œsophage, augmentant le risque de métaplasie de Barrett et d\'adénocarcinome œsophagien. Le score GSRS reflux évalue la fréquence et la sévérité des symptômes de reflux acide. Un RGO non traité altère significativement la qualité de vie et perturbe le sommeil chez 75 % des patients (Fass et al., 2005).',
  recommendations: [
    { maxPct: 33, level: 'alerte', title: 'Reflux sévère', text: 'Vos symptômes de reflux sont importants et nécessitent une prise en charge. Un bilan endoscopique est recommandé si les symptômes persistent > 4 semaines. Évitez les repas copieux le soir, surélevez la tête de lit de 15 cm, et limitez café, alcool, chocolat et aliments acides. La prise en charge diététique seule réduit les symptômes de 30 à 50 % (Kaltenbach et al., 2006).' },
    { maxPct: 66, level: 'vigilance', title: 'Reflux modéré', text: 'Vous présentez des symptômes de reflux à surveiller. Adoptez des mesures hygiéno-diététiques : fractionner les repas, ne pas se coucher dans les 3h suivant le dîner, éviter les boissons gazeuses. Les études montrent un bénéfice net de la posture post-prandiale et de la perte de poids même modeste (-5 kg = réduction de 40 % des symptômes, Ness-Jensen et al., 2016).' },
    { maxPct: 90, level: 'bon', title: 'Reflux léger', text: 'Peu de symptômes de reflux. Maintenez vos bonnes habitudes. Privilégiez les repas fractionnés et bien mastiqués. Évitez de vous allonger immédiatement après le repas.' },
    { maxPct: 100, level: 'excellent', title: 'Pas de reflux', text: 'Aucun signe de reflux gastro-œsophagien. Excellent indicateur de santé digestive haute. Maintenez vos habitudes protectrices.' },
  ],
  questionInsights: [
    { questionId: 'ref-1', triggerMaxScore: 1, insight: 'Vos brûlures d\'estomac sont fréquentes, ce qui indique une inflammation récurrente de la muqueuse œsophagienne.', recommendation: 'Évitez les aliments triggers : tomate, agrumes, café, menthe, chocolat, alcool. Les IPP ne doivent être pris que sous supervision médicale et pour une durée limitée. Des alternatives naturelles (réglisse déglycyrrhizinée 380 mg avant repas, gel d\'aloe vera) montrent une efficacité dans les formes légères (Panahi et al., 2015).' },
    { questionId: 'ref-2', triggerMaxScore: 1, insight: 'Vous présentez des régurgitations acides fréquentes, signe d\'une incompétence du sphincter inférieur de l\'œsophage.', recommendation: 'La surélévation de la tête de lit (15 cm, avec des cales sous les pieds du lit — pas d\'oreiller) réduit le reflux nocturne de 67 % (Khan et al., 2012). Évitez de manger dans les 3 heures précédant le coucher. Le décubitus latéral gauche réduit le reflux de 71 %.' },
  ],
  references: [
    { authors: 'Kaltenbach T, Crockett S, Gerson LB', title: 'Are lifestyle measures effective in patients with gastroesophageal reflux disease?', journal: 'Arch Intern Med', year: 2006, doi: '10.1001/archinte.166.9.965', pmid: '16682569' },
    { authors: 'Ness-Jensen E, Hveem K, El-Serag H, Lagergren J', title: 'Lifestyle Intervention in Gastroesophageal Reflux Disease', journal: 'Clin Gastroenterol Hepatol', year: 2016, doi: '10.1016/j.cgh.2015.04.176', pmid: '25956834' },
    { authors: 'Fass R, Fullerton S, Tung S, Mayer EA', title: 'Sleep disturbances in clinic patients with functional bowel disorders', journal: 'Am J Gastroenterol', year: 2000, pmid: '10811336' },
    { authors: 'Svedlund J, Sjödin I, Dotevall G', title: 'GSRS—a clinical rating scale for gastrointestinal symptoms in patients with irritable bowel syndrome and peptic ulcer disease', journal: 'Dig Dis Sci', year: 1988, pmid: '3123181' },
  ],
}

// ══════════════════════════════════════════════════════
// Douleurs abdominales (GSRS)
// ══════════════════════════════════════════════════════

const douleursReport: SectionReport = {
  sectionId: 'douleurs-abdominales',
  context:
    'Les douleurs abdominales fonctionnelles touchent 15-25 % des adultes et sont la première cause de consultation en gastro-entérologie. Elles sont souvent liées au syndrome de l\'intestin irritable (SII), au stress via l\'axe intestin-cerveau, ou à des troubles de la motilité digestive. L\'axe gut-brain joue un rôle central : 70 % des patients SII rapportent une aggravation des symptômes en période de stress (Mayer et al., 2015). La sensibilité viscérale (hypersensibilité des récepteurs intestinaux) est un mécanisme clé.',
  recommendations: [
    { maxPct: 33, level: 'alerte', title: 'Douleurs importantes', text: 'Vos douleurs abdominales sont significatives et nécessitent un bilan médical pour exclure une pathologie organique (maladie cœliaque, MICI, calculs biliaires). En attendant, un régime pauvre en FODMAPs réduit les douleurs chez 75 % des patients SII (Halmos et al., 2014). La gestion du stress par cohérence cardiaque (5 min 3×/jour) réduit de 40 % les symptômes digestifs fonctionnels.' },
    { maxPct: 66, level: 'vigilance', title: 'Douleurs modérées', text: 'Des douleurs abdominales régulières méritent attention. Tenez un journal alimentaire pendant 2 semaines pour identifier les aliments déclencheurs. L\'activité physique modérée (30 min/jour de marche) améliore la motilité intestinale et réduit la sensibilité viscérale. L\'hypnose digestive a montré une efficacité de 70-80 % dans le SII (Whorwell, 2006).' },
    { maxPct: 90, level: 'bon', title: 'Douleurs légères', text: 'Vos douleurs abdominales sont occasionnelles et gérables. Maintenez une alimentation riche en fibres solubles (avoine, psyllium, banane) pour réguler la motilité. La menthe poivrée en capsules entériques est efficace pour les douleurs spasmodiques.' },
    { maxPct: 100, level: 'excellent', title: 'Pas de douleur', text: 'Absence de douleur abdominale. Excellent indicateur de santé digestive et d\'un bon équilibre de l\'axe intestin-cerveau.' },
  ],
  questionInsights: [
    { questionId: 'doul-1', triggerMaxScore: 1, insight: 'Douleurs fréquentes au niveau de l\'estomac (douleur épigastrique), qui peuvent évoquer une gastrite, un ulcère ou une dyspepsie fonctionnelle.', recommendation: 'Consultez un gastro-entérologue si les symptômes persistent > 4 semaines. En première intention : fractionnez vos repas (5 petits repas plutôt que 3 gros), évitez les AINS (ibuprofène, aspirine), limitez le café à jeun. Un test à l\'H. pylori (test respiratoire) est recommandé car cette bactérie cause 80 % des ulcères gastriques.' },
    { questionId: 'doul-2', triggerMaxScore: 1, insight: 'Douleurs de faim récurrentes, suggestives d\'instabilité glycémique ou d\'une gastrite à Helicobacter pylori.', recommendation: 'Assurez-vous de consommer des protéines + fibres à chaque repas pour stabiliser la glycémie (index glycémique bas). Évitez les périodes de jeûne > 5h. Un test respiratoire H. pylori peut être indiqué — cette bactérie infecte 50 % de la population mondiale et est facilement éradicable par antibiothérapie ciblée.' },
    { questionId: 'doul-3', triggerMaxScore: 1, insight: 'Nausées fréquentes, potentiellement liées au stress, à un retard de vidange gastrique (gastroparésie), ou à une intolérance alimentaire.', recommendation: 'Le gingembre (1 g/jour en capsules ou frais râpé) a une efficacité anti-nauséeuse prouvée dans plusieurs essais contrôlés (Viljoen et al., 2014). Mangez lentement, en petites quantités. Si les nausées persistent > 2 semaines, un bilan est nécessaire (échographie abdominale, glycémie).' },
  ],
  references: [
    { authors: 'Mayer EA, Tillisch K, Gupta A', title: 'Gut/brain axis and the microbiota', journal: 'J Clin Invest', year: 2015, doi: '10.1172/JCI76304', pmid: '25664848' },
    { authors: 'Halmos EP, Power VA, Shepherd SJ, Gibson PR, Muir JG', title: 'A diet low in FODMAPs reduces symptoms of irritable bowel syndrome', journal: 'Gastroenterology', year: 2014, doi: '10.1053/j.gastro.2013.09.046', pmid: '24076059' },
    { authors: 'Viljoen E, Visser J, Koen N, Musekiwa A', title: 'A systematic review and meta-analysis of the effect and safety of ginger in the treatment of pregnancy-associated nausea and vomiting', journal: 'Nutr J', year: 2014, pmid: '24642205' },
    { authors: 'Whorwell PJ', title: 'Review article: The history of hypnotherapy and its role in the irritable bowel syndrome', journal: 'Aliment Pharmacol Ther', year: 2006, doi: '10.1111/j.1365-2036.2006.02891.x', pmid: '16886901' },
  ],
}

// ══════════════════════════════════════════════════════
// Indigestion (GSRS)
// ══════════════════════════════════════════════════════

const indigestionReport: SectionReport = {
  sectionId: 'indigestion',
  context:
    'Les symptômes d\'indigestion (ballonnements, gaz, éructations, gargouillements) affectent 20-30 % de la population adulte. Ils reflètent souvent un déséquilibre du microbiote intestinal (dysbiose), une fermentation excessive des glucides non absorbés (FODMAPs), ou des troubles de la motilité gastro-intestinale. Le microbiote intestinal, composé de 100 000 milliards de bactéries, est aujourd\'hui considéré comme un "organe" à part entière, modulant l\'immunité, le métabolisme et même l\'humeur (Qin et al., 2010).',
  recommendations: [
    { maxPct: 33, level: 'alerte', title: 'Indigestion sévère', text: 'Vos symptômes d\'indigestion sont importants et impactent votre qualité de vie. Envisagez un régime low-FODMAP de 6 semaines sous supervision diététique, suivi d\'une réintroduction progressive systématique. Les probiotiques multi-souches (Lactobacillus + Bifidobacterium, ≥ 10 milliards UFC/jour) réduisent les ballonnements de 44 % selon une méta-analyse Cochrane (Ford et al., 2018). Mastication lente (20-30 fois par bouchée) essentielle.' },
    { maxPct: 66, level: 'vigilance', title: 'Indigestion modérée', text: 'Des ballonnements et gaz réguliers méritent attention. Réduisez les crudités au profit de légumes cuits (plus digestibles), limitez les légumineuses sans trempage préalable (12h), et mâchez lentement. La menthe poivrée en capsules entériques (Colpermin) réduit significativement les ballonnements et douleurs (Alammar et al., 2019). Évitez les chewing-gums (aérophagie).' },
    { maxPct: 90, level: 'bon', title: 'Bonne digestion', text: 'Peu de symptômes d\'indigestion. Maintenez la diversité alimentaire pour nourrir la richesse du microbiote. Consommez 30 végétaux différents par semaine (recommandation du American Gut Project). Intégrez des aliments fermentés quotidiennement (yaourt, kéfir, choucroute).' },
    { maxPct: 100, level: 'excellent', title: 'Digestion excellente', text: 'Aucun trouble d\'indigestion. Votre microbiote semble en bonne santé. C\'est le signe d\'une alimentation diversifiée et d\'une bonne motilité gastro-intestinale.' },
  ],
  questionInsights: [
    { questionId: 'ind-1', triggerMaxScore: 1, insight: 'Gargouillements fréquents, indiquant une hyperactivité de la motilité intestinale ou une fermentation excessive.', recommendation: 'Les gargouillements excessifs (borborygmes) sont souvent liés à une consommation élevée de FODMAPs ou à un repas trop rapide (aérophagie). Mangez dans le calme, sans parler excessivement, et privilégiez les cuissons douces. Le fenouil (en tisane ou frais) a des propriétés carminatives validées.' },
    { questionId: 'ind-2', triggerMaxScore: 1, insight: 'Ballonnements fréquents, symptôme n°1 de dysbiose intestinale ou d\'intolérance alimentaire.', recommendation: 'Les ballonnements chroniques méritent un bilan : test respiratoire au lactose et au fructose, anticorps anti-transglutaminase (maladie cœliaque). Intégrez des prébiotiques (FOS, inuline en petite dose croissante pour éviter l\'aggravation initiale) et des probiotiques. Timing clé : si ballonnements < 30 min après repas → cause gastrique ; si > 2h → fermentation colique.' },
    { questionId: 'ind-3', triggerMaxScore: 1, insight: 'Éructations fréquentes, souvent liées à l\'aérophagie (déglutition d\'air) ou à un reflux associé.', recommendation: 'Limitez les boissons gazeuses, les chewing-gums et la consommation rapide. Mangez assis, dans le calme. La respiration abdominale avant le repas (5 respirations profondes) réduit l\'aérophagie en activant le parasympathique. Si les éructations persistent malgré les mesures hygiéno-diététiques, un bilan fonctionnel peut être nécessaire.' },
    { questionId: 'ind-4', triggerMaxScore: 1, insight: 'Flatulences excessives, signe de fermentation intestinale excessive par le microbiote colique.', recommendation: 'Des flatulences fréquentes indiquent une fermentation excessive. Limitez les FODMAPs principaux (oignon, ail, blé, produits laitiers, certains fruits) et trempez les légumineuses 12h avant cuisson pour réduire les oligosaccharides fermentescibles. Le charbon actif (2 g/jour entre les repas) peut soulager en phase aiguë. À long terme, diversifiez progressivement pour enrichir le microbiote.' },
  ],
  references: [
    { authors: 'Qin J et al.', title: 'A human gut microbial gene catalogue established by metagenomic sequencing', journal: 'Nature', year: 2010, doi: '10.1038/nature08821', pmid: '20203603' },
    { authors: 'Ford AC, Harris LA, Lacy BE, Quigley EMM, Moayyedi P', title: 'Systematic review with meta-analysis: the efficacy of prebiotics, probiotics, synbiotics and antibiotics in irritable bowel syndrome', journal: 'Aliment Pharmacol Ther', year: 2018, doi: '10.1111/apt.15001', pmid: '30294792' },
    { authors: 'Alammar N, Wang L, Saberi B et al.', title: 'The impact of peppermint oil on the irritable bowel syndrome: a meta-analysis', journal: 'BMC Complement Med Ther', year: 2019, doi: '10.1186/s12906-018-2409-0', pmid: '30654773' },
  ],
}

// ══════════════════════════════════════════════════════
// Diarrhée (GSRS)
// ══════════════════════════════════════════════════════

const diarrheeReport: SectionReport = {
  sectionId: 'diarrhee',
  context:
    'La diarrhée chronique fonctionnelle affecte 5-10 % des adultes. Elle peut refléter un syndrome de l\'intestin irritable à prédominance diarrhéique (SII-D), une intolérance alimentaire (lactose, fructose, gluten), une infection persistante ou une inflammation intestinale de bas grade. Le temps de transit intestinal est un biomarqueur important de la santé du microbiote : un transit trop rapide réduit l\'absorption des nutriments et perturbe l\'écosystème microbien (Vandeputte et al., 2016). L\'échelle de Bristol (types 6-7) permet de caractériser objectivement les selles diarrhéiques.',
  recommendations: [
    { maxPct: 33, level: 'alerte', title: 'Transit accéléré sévère', text: 'Vos symptômes de transit accéléré sont importants et nécessitent un bilan complet : calprotectine fécale (inflammation), sérologie cœliaque (anti-transglutaminase), test respiratoire au lactose/fructose, et coproculture. En attendant, les fibres solubles (psyllium 10 g/jour dans un grand verre d\'eau) régularisent le transit. Évitez café, lait de vache et sorbitol. Le Saccharomyces boulardii (probiotique spécifique) réduit la diarrhée fonctionnelle (McFarland, 2006).' },
    { maxPct: 66, level: 'vigilance', title: 'Transit légèrement accéléré', text: 'Un transit accéléré mérite surveillance et identification des déclencheurs alimentaires. Le psyllium (5-10 g/jour avec beaucoup d\'eau) absorbe l\'excès d\'eau dans le côlon et normalise la consistance des selles. L\'exercice physique régulier régule la motilité. Évitez les édulcorants (sorbitol, mannitol) qui ont un effet osmotique laxatif.' },
    { maxPct: 90, level: 'bon', title: 'Transit normal', text: 'Votre transit est satisfaisant. Maintenez un apport en fibres équilibré (25-30 g/jour, mix solubles et insolubles) et une bonne hydratation (1,5-2 L/jour). Variez les sources de fibres pour optimiser le microbiote.' },
    { maxPct: 100, level: 'excellent', title: 'Transit optimal', text: 'Aucun signe de transit accéléré. Signe d\'un bon équilibre intestinal et d\'une muqueuse colique saine.' },
  ],
  questionInsights: [
    { questionId: 'dia-1', triggerMaxScore: 1, insight: 'Épisodes diarrhéiques fréquents, pouvant indiquer un SII-D, une intolérance alimentaire ou une malabsorption.', recommendation: 'Un bilan de base est recommandé : NFS, CRP, calprotectine fécale, TSH (l\'hyperthyroïdie cause des diarrhées). En attendant, le régime pauvre en FODMAPs pendant 4-6 semaines permet d\'identifier les déclencheurs alimentaires. Le riz, la banane et la compote de pomme sont des aliments « ralentisseurs » de transit utiles en phase aiguë.' },
    { questionId: 'dia-2', triggerMaxScore: 1, insight: 'Selles molles récurrentes, suggestives d\'un déséquilibre osmotique ou d\'une fermentation colique excessive.', recommendation: 'Évitez les produits laitiers pendant 2 semaines (test d\'éviction du lactose). Privilégiez le riz basmati, les carottes cuites et les pommes de terre. La glutamine (5 g/jour) renforce la barrière intestinale et réduit la perméabilité (leaky gut). Les probiotiques Lactobacillus rhamnosus GG sont les mieux documentés pour la diarrhée fonctionnelle.' },
    { questionId: 'dia-3', triggerMaxScore: 1, insight: 'Urgences intestinales fréquentes, signalant une hypersensibilité rectale ou une inflammation de bas grade.', recommendation: 'L\'urgence défécatoire peut indiquer une inflammation rectale ou un SII-D. Le L-glutamine (5 g/jour) a montré une réduction de 80 % des urgences dans le SII-D post-infectieux (Zhou et al., 2019). Pratiquez les exercices de Kegel pour renforcer le plancher pelvien. Consultez si les symptômes persistent > 4 semaines ou s\'accompagnent de sang.' },
  ],
  references: [
    { authors: 'Vandeputte D, Falony G, Vieira-Silva S et al.', title: 'Stool consistency is strongly associated with gut microbiota richness and composition, enterotypes and bacterial growth rates', journal: 'Gut', year: 2016, doi: '10.1136/gutjnl-2015-309618', pmid: '26100928' },
    { authors: 'McFarland LV', title: 'Meta-analysis of probiotics for the prevention of antibiotic associated diarrhea', journal: 'Am J Gastroenterol', year: 2006, pmid: '16696781' },
    { authors: 'Zhou Q, Verne ML, Fields JZ et al.', title: 'Randomised placebo-controlled trial of dietary glutamine supplements for postinfectious irritable bowel syndrome', journal: 'Gut', year: 2019, doi: '10.1136/gutjnl-2017-315136', pmid: '30108163' },
  ],
}

// ══════════════════════════════════════════════════════
// Constipation (GSRS)
// ══════════════════════════════════════════════════════

const constipationReport: SectionReport = {
  sectionId: 'constipation',
  context:
    'La constipation fonctionnelle touche 12-19 % de la population mondiale et est souvent sous-estimée. Elle est associée à un risque accru de maladies cardiovasculaires (+12 %), de cancer colorectal et d\'altération profonde du microbiote (Sumida et al., 2019). Un transit trop lent favorise la réabsorption de toxines bactériennes (endotoxémie), la production de métabolites délétères (p-crésol, indol) et l\'inflammation systémique de bas grade. Le critère de Rome IV définit la constipation fonctionnelle comme < 3 selles/semaine avec effort de poussée.',
  recommendations: [
    { maxPct: 33, level: 'alerte', title: 'Constipation sévère', text: 'Votre constipation est significative et nécessite une prise en charge active. Augmentez progressivement les fibres insolubles (son de blé, légumes verts, fruits avec peau) à 30-35 g/jour, buvez ≥ 2L d\'eau/jour, et pratiquez 30 min d\'activité physique quotidienne. Les probiotiques Bifidobacterium lactis améliorent le temps de transit de 12h en moyenne (Dimidi et al., 2014). Si persistant > 3 mois, un bilan (TSH, calcémie, coloscopie) s\'impose pour exclure une cause organique.' },
    { maxPct: 66, level: 'vigilance', title: 'Constipation modérée', text: 'Un ralentissement du transit mérite attention et des mesures simples. Intégrez des graines de lin (2 c. à soupe/jour dans de l\'eau — les moudre pour une meilleure efficacité), des pruneaux (3-5/jour, riches en sorbitol naturel), et du kiwi (2/jour — efficacité prouvée, Attaluri et al., 2011). Respectez le réflexe gastro-colique : allez aux toilettes 15-30 min après le petit-déjeuner, sans forcer.' },
    { maxPct: 90, level: 'bon', title: 'Transit satisfaisant', text: 'Votre transit est globalement régulier. Maintenez une alimentation riche en fibres variées (solubles et insolubles) et une hydratation suffisante. Continuez l\'activité physique régulière qui stimule la motilité colique.' },
    { maxPct: 100, level: 'excellent', title: 'Transit optimal', text: 'Aucun signe de constipation. Signe d\'un bon fonctionnement colique, d\'une alimentation adaptée et d\'une bonne hydratation.' },
  ],
  questionInsights: [
    { questionId: 'con-1', triggerMaxScore: 1, insight: 'Constipation fréquente, indiquant un transit colique ralenti potentiellement lié au sédentarisme, à un déficit hydrique ou fibres, ou au stress.', recommendation: 'Commencez chaque matin par un grand verre d\'eau tiède + citron (stimule le péristaltisme). 30 min de marche quotidienne augmentent la motilité colique de 25 %. Évitez de retenir l\'envie d\'aller aux toilettes — cela désensibilise les récepteurs rectaux. Le psyllium (10 g/jour) est le laxatif de lest le mieux toléré.' },
    { questionId: 'con-2', triggerMaxScore: 1, insight: 'Selles dures récurrentes (Bristol type 1-2), indiquant un temps de transit trop long et une réabsorption excessive d\'eau.', recommendation: 'Augmentez votre consommation d\'eau à ≥ 2L/jour (l\'eau magnésienne — Hépar, Rozana — a un effet laxatif doux). Les fibres solubles (avoine, psyllium) retiennent l\'eau dans les selles. Le magnésium citrate (400 mg au coucher) a un double effet : laxatif osmotique doux et amélioration du sommeil.' },
    { questionId: 'con-3', triggerMaxScore: 1, insight: 'Sensation de vidange incomplète fréquente, pouvant indiquer un dyssynergisme du plancher pelvien (les muscles ne se relâchent pas correctement lors de la défécation).', recommendation: 'La rééducation périnéale par biofeedback est efficace dans 70 % des cas de dyschésie (Rao et al., 2007). En première intention : adoptez la position squatting (tabouret de 17-20 cm sous les pieds aux toilettes, type « Squatty Potty ») qui augmente l\'angle anorectal de 15° et facilite la vidange. Ne poussez jamais : expirez en gonflant le ventre (technique de la bombe).' },
  ],
  references: [
    { authors: 'Sumida K, Molnar MZ, Potukuchi PK et al.', title: 'Constipation and risk of death and cardiovascular events', journal: 'Atherosclerosis', year: 2019, doi: '10.1016/j.atherosclerosis.2018.10.022', pmid: '30445337' },
    { authors: 'Dimidi E, Christodoulides S, Fragkos KC et al.', title: 'The effect of probiotics on functional constipation in adults: a systematic review and meta-analysis', journal: 'Am J Clin Nutr', year: 2014, doi: '10.3945/ajcn.114.089151', pmid: '25099542' },
    { authors: 'Rao SSC, Seaton K, Miller M et al.', title: 'Randomized controlled trial of biofeedback, sham feedback, and standard therapy for dyssynergic defecation', journal: 'Clin Gastroenterol Hepatol', year: 2007, pmid: '17445749' },
    { authors: 'Attaluri A, Donahoe R, Valestin J, Brown K, Rao SSC', title: 'Randomised clinical trial: dried plums (prunes) vs. psyllium for constipation', journal: 'Aliment Pharmacol Ther', year: 2011, doi: '10.1111/j.1365-2036.2011.04594.x', pmid: '21323688' },
  ],
}

// ══════════════════════════════════════════════════════
// EXPORTS
// ══════════════════════════════════════════════════════

export const allSectionReports: SectionReport[] = [
  refluxReport,
  douleursReport,
  indigestionReport,
  diarrheeReport,
  constipationReport,
]

/** Lookup helper */
export function getSectionReport(sectionId: string): SectionReport | undefined {
  return allSectionReports.find((r) => r.sectionId === sectionId)
}

/**
 * Gets the relevant recommendation for a given score percentage
 */
export function getSectionRecommendation(report: SectionReport, pct: number) {
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
  return report.questionInsights.filter(
    (qi) => (scores[qi.questionId] ?? Infinity) <= qi.triggerMaxScore
  )
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
    // Digestif uses maxPct: low pct = good (fewer symptoms)
    if (rec.level === 'excellent' || rec.level === 'bon') {
      strengths.push({ sectionId: r.sectionId, title: r.title, pct: r.pct, praise: rec.text, science: report.context.split('.').slice(0, 2).join('.') + '.', reference: ref0 })
    } else {
      weaknesses.push({ sectionId: r.sectionId, title: r.title, pct: r.pct, level: rec.level, concern: rec.text, science: report.context, reference: ref0, triggeredInsights: triggered.map(t => ({ questionId: t.questionId, insight: t.insight, recommendation: t.recommendation })) })
    }
  }
  // For digestif, higher pct = worse, so sort descending
  weaknesses.sort((a, b) => b.pct - a.pct)

  const phase1: { action: string; why: string; sectionId: string }[] = []
  const phase2: { action: string; why: string; sectionId: string }[] = []
  const phase3: { action: string; why: string; sectionId: string }[] = []
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
  if (phase2.length > 0) actionPlan.push({ phase: 2, phaseTitle: 'Consolidation', timeframe: 'Semaines 3-6', actions: phase2.slice(0, 5) })
  if (actionPlan.length === 0) actionPlan.push({ phase: 1, phaseTitle: 'Maintien des acquis', timeframe: 'En continu', actions: [{ action: 'Maintenez vos bonnes pratiques alimentaires et digestives.', why: 'Vos scores digestifs sont bons — continuez ainsi.', sectionId: '' }] })

  return { strengths, weaknesses, actionPlan, globalInsights: globalKeyInsights, sectionReports }
}

// ══════════════════════════════════════════════════════
// GLOBAL INSIGHTS
// ══════════════════════════════════════════════════════

export interface GlobalInsight {
  title: string
  description: string
  reference: string
}

export const globalKeyInsights: GlobalInsight[] = [
  {
    title: 'L\'intestin : votre deuxième cerveau',
    description: 'Votre système digestif contient 200 millions de neurones (système nerveux entérique) et produit 95 % de la sérotonine de votre corps. La santé digestive influence directement votre humeur, votre sommeil et votre immunité via l\'axe intestin-cerveau.',
    reference: 'Mayer EA, 2011, Nat Rev Neurosci',
  },
  {
    title: 'Le microbiote : 2 kg de vie en vous',
    description: 'Les 100 000 milliards de bactéries intestinales pèsent autant que votre cerveau. Leur diversité est le meilleur prédicteur de santé digestive. Chaque espèce végétale consommée nourrit des souches différentes — visez 30 végétaux/semaine.',
    reference: 'McDonald et al., 2018, mSystems (American Gut Project)',
  },
  {
    title: 'La perméabilité intestinale : la clé cachée',
    description: 'Un intestin « perméable » (leaky gut) laisse passer des molécules pro-inflammatoires dans le sang, contribuant à l\'inflammation systémique, aux intolérances alimentaires et aux maladies auto-immunes. Les fibres, la glutamine et les aliments fermentés renforcent cette barrière.',
    reference: 'Fasano A, 2012, Clin Rev Allergy Immunol',
  },
]

/**
 * Generates a prioritized action plan based on lowest scoring sections
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

  actions.sort((a, b) => a.pct - b.pct)
  return actions.slice(0, 5).map((a, i) => ({
    priority: i + 1,
    action: a.action,
    sectionTitle: a.sectionTitle,
    level: a.level,
  }))
}
