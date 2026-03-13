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
    'Le reflux gastro-œsophagien touche 10-20 % de la population. C\'est quand l\'acide de l\'estomac remonte vers la gorge — causant brûlures, régurgitations et parfois une toux chronique. Non traité sur le long terme, il peut irriter et fragiliser la paroi de l\'œsophage. Un reflux non pris en charge perturbe aussi le sommeil chez 75 % des personnes concernées.',
  recommendations: [
    { maxPct: 33, level: 'alerte', title: 'Reflux sévère', text: 'Vos symptômes de reflux sont importants et nécessitent une prise en charge. Un bilan endoscopique est recommandé si les symptômes persistent > 4 semaines. Évitez les repas copieux le soir, surélevez la tête de lit de 15 cm, et limitez café, alcool, chocolat et aliments acides. La prise en charge diététique seule réduit les symptômes de 30 à 50 % (Kaltenbach et al., 2006).' },
    { maxPct: 66, level: 'vigilance', title: 'Reflux modéré', text: 'Vous présentez des symptômes de reflux à surveiller. Adoptez des mesures hygiéno-diététiques : fractionner les repas, ne pas se coucher dans les 3h suivant le dîner, éviter les boissons gazeuses. Les études montrent un bénéfice net de la posture post-prandiale et de la perte de poids même modeste (-5 kg = réduction de 40 % des symptômes, Ness-Jensen et al., 2016).' },
    { maxPct: 90, level: 'bon', title: 'Reflux léger', text: 'Peu de symptômes de reflux. Maintenez vos bonnes habitudes. Privilégiez les repas fractionnés et bien mastiqués. Évitez de vous allonger immédiatement après le repas.' },
    { maxPct: 100, level: 'excellent', title: 'Pas de reflux', text: 'Aucun signe de reflux gastro-œsophagien. Excellent indicateur de santé digestive haute. Maintenez vos habitudes protectrices.' },
  ],
  questionInsights: [
    { questionId: 'ref-1', triggerMaxScore: 1, insight: 'Vos brûlures d\'estomac sont fréquentes — l\'acide irrite régulièrement la paroi de votre œsophage.', recommendation: 'Évitez les aliments déclencheurs : tomate, agrumes, café, menthe, chocolat, alcool. Si vous prenez des médicaments anti-acide, faites-le sous supervision médicale et pour une durée limitée. Des alternatives naturelles (réglisse spéciale sans glycyrrhizine 380 mg avant repas, gel d\'aloe vera) ont montré une efficacité dans les formes légères.' },
    { questionId: 'ref-2', triggerMaxScore: 1, insight: 'Des régurgitations acides fréquentes indiquent que le muscle de fermeture entre l\'œsophage et l\'estomac ne se referme pas correctement.', recommendation: 'Surélevez la tête de votre lit de 15 cm (avec des cales sous les pieds du lit, pas juste un oreiller) — cela réduit le reflux nocturne de 67 %. Évitez de manger dans les 3 heures précédant le coucher. Dormir sur le côté gauche réduit aussi le reflux de 71 %.' },
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
    'Les douleurs abdominales fonctionnelles touchent 15-25 % des adultes. Elles sont souvent liées au syndrome de l\'intestin irritable, au stress, ou à des troubles de la motilité digestive. Le lien intestin-cerveau est central : 70 % des personnes souffrant d\'intestin irritable voient leurs symptômes s\'aggraver en période de stress — ce n\'est pas dans la tête, c\'est une réalité physiologique.',
  recommendations: [
    { maxPct: 33, level: 'alerte', title: 'Douleurs importantes', text: 'Vos douleurs abdominales sont significatives et nécessitent un bilan médical pour exclure une cause organique (maladie cœliaque, maladie inflammatoire intestinale, calculs biliaires). En attendant, un régime pauvre en aliments fermentescibles (FODMAPs) réduit les douleurs chez 75 % des personnes souffrant d\'intestin irritable. La respiration rythmée (5 min 3×/jour) réduit aussi de 40 % les symptômes digestifs liés au stress.' },
    { maxPct: 66, level: 'vigilance', title: 'Douleurs modérées', text: 'Des douleurs abdominales régulières méritent attention. Tenez un journal alimentaire pendant 2 semaines pour identifier les aliments déclencheurs. L\'activité physique modérée (30 min/jour de marche) améliore la motilité intestinale et réduit la sensibilité viscérale. L\'hypnose digestive a montré une efficacité de 70-80 % dans le SII (Whorwell, 2006).' },
    { maxPct: 90, level: 'bon', title: 'Douleurs légères', text: 'Vos douleurs abdominales sont occasionnelles et gérables. Maintenez une alimentation riche en fibres solubles (avoine, psyllium, banane) pour réguler la motilité. La menthe poivrée en capsules entériques est efficace pour les douleurs spasmodiques.' },
    { maxPct: 100, level: 'excellent', title: 'Pas de douleur', text: 'Absence de douleur abdominale. Excellent indicateur de santé digestive et d\'un bon équilibre de l\'axe intestin-cerveau.' },
  ],
  questionInsights: [
    { questionId: 'doul-1', triggerMaxScore: 1, insight: 'Des douleurs fréquentes au niveau de l\'estomac peuvent évoquer une gastrite, un ulcère ou des troubles de la digestion haute.', recommendation: 'Consultez un médecin si les symptômes persistent plus de 4 semaines. En attendant : fractionnez vos repas (5 petits repas plutôt que 3 gros), évitez l\'ibuprofène et l\'aspirine qui irritent l\'estomac, limitez le café à jeun. Il existe un test simple pour détecter une bactérie (H. pylori) qui cause 80 % des ulcères gastriques — facilement traitée si détectée.' },
    { questionId: 'doul-2', triggerMaxScore: 1, insight: 'Des douleurs de faim récurrentes peuvent signaler une glycémie instable ou une inflammation de la muqueuse de l\'estomac.', recommendation: 'Assurez-vous d\'avoir des protéines et des fibres à chaque repas pour stabiliser votre taux de sucre dans le sang. Évitez de rester plus de 5 heures sans manger. Si les symptômes persistent, votre médecin peut proposer un test simple pour vérifier l\'absence de bactérie H. pylori.' },
    { questionId: 'doul-3', triggerMaxScore: 1, insight: 'Des nausées fréquentes peuvent être liées au stress, à une vidange de l\'estomac trop lente, ou à une intolérance alimentaire.', recommendation: 'Le gingembre (1 g/jour en capsules ou frais râpé) est l\'un des remèdes naturels les mieux documentés contre les nausées. Mangez lentement, en petites quantités. Si les nausées persistent plus de 2 semaines, une consultation médicale est utile.' },
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
    'Les symptômes d\'indigestion (ballonnements, gaz, éructations, gargouillements) affectent 20-30 % de la population adulte. Ils reflètent souvent un déséquilibre des bactéries intestinales ou une fermentation excessive de certains aliments. Votre intestin abrite 100 000 milliards de bactéries — un écosystème microscopique qui influence votre immunité, votre métabolisme et même votre humeur. En prendre soin, c\'est prendre soin de votre santé globale.',
  recommendations: [
    { maxPct: 33, level: 'alerte', title: 'Indigestion sévère', text: 'Vos symptômes d\'indigestion sont importants et impactent votre qualité de vie. Envisagez un régime pauvre en aliments fermentescibles (FODMAPs — certains sucres qui fermentent dans l\'intestin) de 6 semaines, idéalement avec un diététicien. Les probiotiques multi-souches réduisent les ballonnements de 44 % selon une revue de la littérature scientifique (Ford et al., 2018). Mâchez lentement — 20 à 30 fois par bouchée.' },
    { maxPct: 66, level: 'vigilance', title: 'Indigestion modérée', text: 'Des ballonnements et gaz réguliers méritent attention. Réduisez les crudités au profit de légumes cuits (plus digestibles), faites tremper les légumineuses 12h avant cuisson, et mâchez lentement. La menthe poivrée en capsules spéciales (à libération dans l\'intestin, pas dans l\'estomac) réduit significativement les ballonnements. Évitez aussi les chewing-gums qui font avaler de l\'air.' },
    { maxPct: 90, level: 'bon', title: 'Bonne digestion', text: 'Peu de symptômes d\'indigestion. Maintenez la diversité alimentaire — visez 30 végétaux différents par semaine (légumes, fruits, légumineuses, céréales, herbes). Intégrez des aliments fermentés quotidiennement : yaourt, kéfir, choucroute, miso.' },
    { maxPct: 100, level: 'excellent', title: 'Digestion excellente', text: 'Aucun trouble d\'indigestion. Votre microbiote semble en bonne santé. C\'est le signe d\'une alimentation diversifiée et d\'une bonne motilité gastro-intestinale.' },
  ],
  questionInsights: [
    { questionId: 'ind-1', triggerMaxScore: 1, insight: 'Des gargouillements fréquents signalent une digestion agitée — souvent liée à certains aliments qui fermentent ou à un repas avalé trop vite.', recommendation: 'Mangez dans le calme, sans parler excessivement, et privilégiez les cuissons douces (les légumes crus sont plus difficiles à digérer). Le fenouil — en tisane ou frais après le repas — est un excellent allié naturel contre les gaz et les ballonnements.' },
    { questionId: 'ind-2', triggerMaxScore: 1, insight: 'Des ballonnements fréquents sont souvent le signe d\'un déséquilibre des bactéries intestinales ou d\'une intolérance alimentaire.', recommendation: 'Des tests simples peuvent identifier la cause : test respiratoire au lactose (intolérance aux laitages), test au fructose, ou prise de sang pour détecter la maladie cœliaque. En parallèle, les probiotiques et les fibres prébiotiques (en commençant par de petites doses) aident à rééquilibrer l\'intestin. Astuce : si les ballonnements apparaissent dans les 30 min après le repas, c\'est plutôt l\'estomac ; s\'ils arrivent 2h après, c\'est l\'intestin.' },
    { questionId: 'ind-3', triggerMaxScore: 1, insight: 'Des rots fréquents sont souvent liés à l\'air avalé en mangeant trop vite ou à un reflux associé.', recommendation: 'Limitez les boissons gazeuses, les chewing-gums et la consommation rapide. Mangez assis, dans le calme. 5 respirations profondes avant le repas favorisent une digestion plus sereine. Si les rots persistent malgré ces ajustements, une consultation peut identifier une cause sous-jacente.' },
    { questionId: 'ind-4', triggerMaxScore: 1, insight: 'Des flatulences fréquentes signalent une fermentation excessive dans l\'intestin — souvent due à certains aliments.', recommendation: 'Limitez les grands producteurs de gaz : oignon, ail, blé en grande quantité, produits laitiers, certains fruits. Trempez toujours les légumineuses 12h avant cuisson pour les rendre plus digestibles. Le charbon végétal activé (2 g entre les repas) peut soulager en phase aiguë. Sur le long terme, diversifiez progressivement votre alimentation pour enrichir vos bactéries intestinales.' },
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
    'La diarrhée chronique fonctionnelle affecte 5-10 % des adultes. Elle peut refléter un syndrome de l\'intestin irritable, une intolérance alimentaire (lactose, fructose, gluten) ou une inflammation intestinale légère. Un transit trop rapide réduit l\'absorption des nutriments et déséquilibre l\'écosystème de bactéries dans l\'intestin — ce qui à terme peut aggraver les symptômes.',
  recommendations: [
    { maxPct: 33, level: 'alerte', title: 'Transit accéléré sévère', text: 'Vos symptômes de transit accéléré sont importants et nécessitent un bilan médical complet : marqueurs d\'inflammation dans les selles, test sanguin pour la maladie cœliaque, tests respiratoires au lactose et fructose. En attendant, les fibres solubles (psyllium 10 g/jour dans un grand verre d\'eau) aident à réguler le transit. Évitez café, lait de vache et aliments contenant du sorbitol (édulcorant). Un probiotique spécifique (Saccharomyces boulardii) a montré son efficacité contre la diarrhée fonctionnelle.' },
    { maxPct: 66, level: 'vigilance', title: 'Transit légèrement accéléré', text: 'Un transit accéléré mérite surveillance et identification des déclencheurs alimentaires. Le psyllium (5-10 g/jour avec beaucoup d\'eau) absorbe l\'excès d\'eau dans le côlon et normalise la consistance des selles. L\'exercice physique régulier régule la motilité. Évitez les édulcorants (sorbitol, mannitol) qui ont un effet osmotique laxatif.' },
    { maxPct: 90, level: 'bon', title: 'Transit normal', text: 'Votre transit est satisfaisant. Maintenez un apport en fibres équilibré (25-30 g/jour, mix solubles et insolubles) et une bonne hydratation (1,5-2 L/jour). Variez les sources de fibres pour optimiser le microbiote.' },
    { maxPct: 100, level: 'excellent', title: 'Transit optimal', text: 'Aucun signe de transit accéléré. Signe d\'un bon équilibre intestinal et d\'une muqueuse colique saine.' },
  ],
  questionInsights: [
    { questionId: 'dia-1', triggerMaxScore: 1, insight: 'Des épisodes diarrhéiques fréquents peuvent indiquer un intestin irritable, une intolérance alimentaire ou une mauvaise absorption des nutriments.', recommendation: 'Un bilan de base chez votre médecin est recommandé : prise de sang (formule sanguine, thyroïde, inflammation), marqueurs dans les selles. En attendant, un régime pauvre en aliments fermentescibles (FODMAPs) pendant 4-6 semaines permet d\'identifier vos déclencheurs alimentaires. Le riz, la banane et la compote de pomme sont des aliments naturellement « ralentisseurs » utiles en phase aiguë.' },
    { questionId: 'dia-2', triggerMaxScore: 1, insight: 'Des selles molles récurrentes peuvent signaler une intolérance aux laitages ou une fermentation excessive dans l\'intestin.', recommendation: 'Essayez d\'éviter les produits laitiers pendant 2 semaines pour tester une éventuelle intolérance au lactose. Privilégiez le riz basmati, les carottes cuites et les pommes de terre. La glutamine (5 g/jour, un acide aminé naturel) aide à renforcer la paroi de l\'intestin. Le probiotique Lactobacillus rhamnosus GG est le mieux documenté pour la diarrhée fonctionnelle.' },
    { questionId: 'dia-3', triggerMaxScore: 1, insight: 'Des envies urgentes et incontrôlables d\'aller aux toilettes peuvent signaler une sensibilité accrue du rectum ou une légère inflammation.', recommendation: 'La glutamine (5 g/jour) a montré une réduction de 80 % de ces urgences dans les cas post-infectieux. Des exercices de renforcement du plancher pelvien (contraction-relâchement de la zone périnéale) aident aussi. Consultez si les symptômes persistent plus de 4 semaines ou s\'accompagnent de sang.' },
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
    'La constipation fonctionnelle touche 12-19 % de la population mondiale et est souvent sous-estimée. Elle est associée à un risque accru de maladies cardiovasculaires (+12 %) et de cancer colorectal. Un transit trop lent favorise la réabsorption de substances indésirables et une inflammation diffuse dans le corps. On parle de constipation fonctionnelle quand on va moins de 3 fois par semaine aux toilettes, avec des efforts.',
  recommendations: [
    { maxPct: 33, level: 'alerte', title: 'Constipation sévère', text: 'Votre constipation est significative et nécessite une prise en charge active. Augmentez progressivement les fibres insolubles (son de blé, légumes verts, fruits avec peau) à 30-35 g/jour, buvez ≥ 2L d\'eau/jour, et pratiquez 30 min d\'activité physique quotidienne. Les probiotiques Bifidobacterium lactis améliorent le temps de transit de 12h en moyenne (Dimidi et al., 2014). Si persistant > 3 mois, un bilan (TSH, calcémie, coloscopie) s\'impose pour exclure une cause organique.' },
    { maxPct: 66, level: 'vigilance', title: 'Constipation modérée', text: 'Un ralentissement du transit mérite attention et des mesures simples. Intégrez des graines de lin (2 c. à soupe/jour dans de l\'eau — les moudre pour une meilleure efficacité), des pruneaux (3-5/jour, riches en sorbitol naturel), et du kiwi (2/jour — efficacité prouvée, Attaluri et al., 2011). Respectez le réflexe gastro-colique : allez aux toilettes 15-30 min après le petit-déjeuner, sans forcer.' },
    { maxPct: 90, level: 'bon', title: 'Transit satisfaisant', text: 'Votre transit est globalement régulier. Maintenez une alimentation riche en fibres variées (solubles et insolubles) et une hydratation suffisante. Continuez l\'activité physique régulière qui stimule la motilité colique.' },
    { maxPct: 100, level: 'excellent', title: 'Transit optimal', text: 'Aucun signe de constipation. Signe d\'un bon fonctionnement colique, d\'une alimentation adaptée et d\'une bonne hydratation.' },
  ],
  questionInsights: [
    { questionId: 'con-1', triggerMaxScore: 1, insight: 'Constipation fréquente, indiquant un transit colique ralenti potentiellement lié au sédentarisme, à un déficit hydrique ou fibres, ou au stress.', recommendation: 'Commencez chaque matin par un grand verre d\'eau tiède + citron (stimule le péristaltisme). 30 min de marche quotidienne augmentent la motilité colique de 25 %. Évitez de retenir l\'envie d\'aller aux toilettes — cela désensibilise les récepteurs rectaux. Le psyllium (10 g/jour) est le laxatif de lest le mieux toléré.' },
    { questionId: 'con-2', triggerMaxScore: 1, insight: 'Des selles dures récurrentes indiquent un transit trop lent et une déshydratation des selles dans le côlon.', recommendation: 'Buvez au moins 2L d\'eau par jour — les eaux minérales riches en magnésium (Hépar, Rozana) ont un effet laxatif doux. Les fibres solubles (avoine, psyllium) retiennent l\'eau dans les selles et les ramollissent. Le magnésium citrate (400 mg au coucher) a un double avantage : il facilite le transit et améliore la qualité du sommeil.' },
    { questionId: 'con-3', triggerMaxScore: 1, insight: 'Une sensation de vidange incomplète fréquente peut indiquer que les muscles du périnée ne se relâchent pas bien lors de l\'effort.', recommendation: 'La rééducation périnéale (exercices avec un professionnel) est efficace dans 70 % des cas. En première intention : placez un petit tabouret (17-20 cm) sous les pieds aux toilettes — cette position accroupie libère le passage naturellement. Ne poussez jamais en retenant la respiration : expirez en gonflant le ventre (technique de la « bombe »).' },
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
    description: 'Votre système digestif contient 200 millions de neurones et produit 95 % de la sérotonine — l\'hormone du bien-être — de votre corps. Ce n\'est pas un hasard si le stress se ressent dans le ventre et si une mauvaise digestion affecte l\'humeur. Les deux organes se parlent en permanence.',
    reference: 'Mayer EA, 2011, Nat Rev Neurosci',
  },
  {
    title: 'Le microbiote : 2 kg de vie en vous',
    description: 'Les bactéries de votre intestin pèsent autant que votre cerveau. Leur diversité est le meilleur prédicteur de santé digestive. Chaque aliment végétal que vous mangez nourrit des bactéries différentes — viser 30 végétaux variés par semaine transforme votre microbiote en quelques mois.',
    reference: 'McDonald et al., 2018, mSystems (American Gut Project)',
  },
  {
    title: 'La paroi intestinale : votre barrière de protection',
    description: 'Quand la paroi de l\'intestin est fragilisée, elle laisse passer des substances indésirables dans le sang, contribuant à l\'inflammation chronique, aux intolérances alimentaires et à certaines maladies. Les fibres, la glutamine et les aliments fermentés aident à maintenir cette barrière en bonne santé.',
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
