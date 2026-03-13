// ──────────────────────────────────────────────────────
// Bilan Troubles Digestifs — Compte-rendu
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
    action?: string
  }[]
  references: ScientificReference[]
}

// ══════════════════════════════════════════════════════
// Reflux gastro-œsophagien (GSRS)
// ══════════════════════════════════════════════════════

const refluxReport: SectionReport = {
  sectionId: 'reflux',
  context:
    'Le reflux n\'est pas qu\'un désordre mécanique : il traduit une perturbation de la motilité gastrique (les contractions qui font avancer les aliments), souvent amplifiée par le stress chronique via les catécholamines (hormones du stress comme l\'adrénaline et le cortisol), ou par des peptides opioïdes — gluteomorphines et caséimorphines — issus d\'une digestion incomplète du blé ou du lait qui interagissent avec les récepteurs gastriques.',
  recommendations: [
    { maxPct: 33, level: 'alerte', title: 'Reflux fréquent', text: 'Vos symptômes de reflux sont réguliers. Mangez lentement dans le calme et sans écran — l\'activation parasympathique est indispensable à une bonne motilité gastrique. Évitez les repas dans les 3h précédant le coucher et réduisez les glucides raffinés et laitages industriels qui génèrent des peptides irritants.' },
    { maxPct: 66, level: 'vigilance', title: 'Reflux modéré', text: 'Des symptômes de reflux ponctuels méritent votre attention. Mastiquez lentement, mangez assis dans le calme, et évitez de vous allonger juste après les repas.' },
    { maxPct: 90, level: 'bon', title: 'Reflux léger', text: 'Peu de reflux. Continuez à manger dans le calme et à bien mastiquer.' },
    { maxPct: 100, level: 'excellent', title: 'Pas de reflux', text: 'Aucun signe de reflux. Excellent indicateur de santé digestive haute.' },
  ],
  questionInsights: [
    { questionId: 'ref-1', triggerMaxScore: 1, insight: 'Vos brûlures d\'estomac sont fréquentes.', recommendation: 'Une hyperacidité récurrente peut être liée au stress (catécholamines — adrénaline et cortisol) ou à une mauvaise dégradation de certaines protéines. Évitez café à jeun, alcool et sucres raffinés. Mangez dans le calme — le système parasympathique (le "mode repos-digestion") régule la sécrétion d\'acide chlorhydrique.', action: 'Évitez le café à jeun et mangez dans le calme, sans écran.' },
    { questionId: 'ref-2', triggerMaxScore: 1, insight: 'Vous présentez des régurgitations acides fréquentes.', recommendation: 'Évitez de manger dans les 3h avant le coucher. Réduisez les aliments fermentescibles (pain blanc, laitages industriels) dont la mauvaise digestion produit des peptides qui perturbent la valve œsophagienne.', action: 'Arrêtez de manger au moins 3h avant le coucher.' },
  ],
  references: [
    { authors: 'Riché D', title: 'Trépied intestinal et pathophysiologie digestive', journal: 'Référentiel nutritionnel', year: 2024 },
    { authors: 'Druguet S', title: 'Neuro-nutrition et comportement alimentaire', journal: 'Référentiel nutritionnel', year: 2024 },
  ],
}

// ══════════════════════════════════════════════════════
// Douleurs abdominales (GSRS)
// ══════════════════════════════════════════════════════

const douleursReport: SectionReport = {
  sectionId: 'douleurs-abdominales',
  context:
    'Les douleurs abdominales signalent une inflammation de la muqueuse digestive. Une barrière intestinale fragilisée laisse passer des endotoxines bactériennes (LPS, des fragments de paroi bactérienne) dans la circulation, déclenchant une cascade de cytokines pro-inflammatoires (TNF-alpha, IL-6 — des messagers chimiques de l\'inflammation) qui sensibilisent les nocicepteurs intestinaux (les récepteurs de la douleur). Un excès d\'oméga-6 aggrave ce processus en fournissant le substrat des prostaglandines de la douleur (série 2 — les médiateurs chimiques qui amplifient la douleur et l\'œdème).',
  recommendations: [
    { maxPct: 33, level: 'alerte', title: 'Douleurs fréquentes', text: 'Vos douleurs abdominales sont régulières. Réduisez les aliments ultra-transformés et l\'excès d\'oméga-6 (huile de tournesol, fritures) qui alimentent directement l\'inflammation muqueuse via la voie COX-2. Augmentez les oméga-3 (sardines, maquereau, huile de lin) pour rééquilibrer la balance inflammatoire.' },
    { maxPct: 66, level: 'vigilance', title: 'Douleurs modérées', text: 'Des douleurs abdominales régulières méritent attention. Identifiez vos aliments déclencheurs sur 2 semaines. Intégrez des oméga-3 (sardines, noix, huile de colza) pour inhiber la production de prostaglandines inflammatoires.' },
    { maxPct: 90, level: 'bon', title: 'Douleurs légères', text: 'Des douleurs occasionnelles et gérables. Maintenez un apport régulier en oméga-3 et en légumes colorés pour protéger la muqueuse.' },
    { maxPct: 100, level: 'excellent', title: 'Pas de douleur', text: 'Aucune douleur abdominale. Excellent indicateur d\'une muqueuse intègre et d\'un équilibre inflammatoire maîtrisé.' },
  ],
  questionInsights: [
    { questionId: 'doul-1', triggerMaxScore: 1, insight: 'Des douleurs épigastriques fréquentes évoquent une inflammation de la muqueuse haute.', recommendation: 'Mangez dans le calme — le stress élève les catécholamines (adrénaline, cortisol) qui perturbent la motilité gastrique. Réduisez café à jeun, alcool et glucides raffinés qui favorisent la dysbiose (déséquilibre du microbiote) et l\'inflammation muqueuse.', action: 'Supprimez les écrans aux repas et mangez assis dans le calme.' },
    { questionId: 'doul-2', triggerMaxScore: 1, insight: 'Les douleurs de faim récurrentes signalent souvent une glycémie instable ou une hyperacidité.', recommendation: 'Intégrez des protéines et des fibres à chaque repas pour stabiliser la glycémie et éviter les pics d\'acidité. Les protéines génèrent des di-peptides qui déclenchent la néoglucogenèse intestinale (la production de glucose par l\'intestin) — un signal de satiété durable.', action: 'Ajoutez une source de protéines et des fibres à chaque repas.' },
    { questionId: 'doul-3', triggerMaxScore: 1, insight: 'Des nausées fréquentes peuvent refléter un stress gastrique ou un transit perturbé.', recommendation: 'Mangez lentement, en petites quantités, dans un environnement calme sans écran. Manger devant un écran active le système sympathique (mode stress) et bloque la sécrétion d\'enzymes digestives, aggravant les nausées.', action: 'Réduisez la taille des repas et mangez lentement, sans écran.' },
  ],
  references: [
    { authors: 'Riché D', title: 'Inflammation muqueuse et douleurs abdominales', journal: 'Référentiel nutritionnel', year: 2024 },
  ],
}

// ══════════════════════════════════════════════════════
// Indigestion (GSRS)
// ══════════════════════════════════════════════════════

const indigestionReport: SectionReport = {
  sectionId: 'indigestion',
  context:
    'Les ballonnements, gaz et éructations traduisent une fermentation bactérienne excessive dans le côlon — signe que des aliments insuffisamment digérés y arrivent. La bordure en brosse intestinale, fragilisée par le stress ou une alimentation dénaturée, perd en efficacité enzymatique — notamment les disaccharidases et peptidases (les enzymes qui découpent respectivement les sucres et les protéines). Les glucides partiellement digérés subissent alors une fermentation produisant méthane, hydrogène et CO2.',
  recommendations: [
    { maxPct: 33, level: 'alerte', title: 'Indigestion sévère', text: 'Vos symptômes d\'indigestion sont importants. Commencez par ralentir votre mastication (20 à 30 fois par bouchée) et supprimer les écrans aux repas — l\'activation parasympathique est indispensable à la sécrétion d\'amylase salivaire et d\'enzymes gastriques. Réduisez les glucides raffinés qui nourrissent les bactéries fermentatives.' },
    { maxPct: 66, level: 'vigilance', title: 'Indigestion modérée', text: 'Des troubles digestifs réguliers méritent attention. Privilégiez les légumes cuits aux crudités, faites tremper les légumineuses 12h avant cuisson, et mastiquez lentement à chaque repas.' },
    { maxPct: 90, level: 'bon', title: 'Bonne digestion', text: 'Peu de troubles digestifs. Diversifiez vos végétaux et intégrez des aliments lactofermentés pour enrichir votre microbiote.' },
    { maxPct: 100, level: 'excellent', title: 'Digestion excellente', text: 'Excellente digestion. Signe d\'un microbiote équilibré et d\'une bonne sécrétion enzymatique.' },
  ],
  questionInsights: [
    { questionId: 'ind-1', triggerMaxScore: 1, insight: 'Des gargouillements fréquents signalent une fermentation active dans l\'intestin.', recommendation: 'Mangez dans le calme, posez vos couverts entre les bouchées et évitez les boissons gazeuses. Réduisez temporairement les aliments très fermentescibles (oignon, ail, chou, blé en grande quantité).', action: 'Posez vos couverts entre chaque bouchée et évitez les boissons gazeuses.' },
    { questionId: 'ind-2', triggerMaxScore: 1, insight: 'Des ballonnements fréquents traduisent un déséquilibre des bactéries intestinales.', recommendation: 'Réduisez les glucides fermentescibles (oignon, ail, pain blanc, laitages industriels) et introduisez progressivement des fibres prébiotiques (légumineuses cuites, légumes) pour rééquilibrer les bactéries intestinales.', action: 'Réduisez oignon, ail, pain blanc et laitages industriels pendant 2 semaines.' },
    { questionId: 'ind-3', triggerMaxScore: 1, insight: 'Des éructations fréquentes signalent souvent de l\'air avalé ou un reflux associé.', recommendation: 'Mangez lentement, sans parler excessivement, et évitez les boissons gazeuses. Quelques respirations profondes avant le repas activent le mode repos et améliorent la digestion.', action: 'Mangez lentement et supprimez les boissons gazeuses.' },
    { questionId: 'ind-4', triggerMaxScore: 1, insight: 'Des flatulences excessives indiquent une fermentation bactérienne importante.', recommendation: 'Faites toujours tremper les légumineuses 12h avant cuisson. Réduisez temporairement les aliments très fermentescibles et réintroduisez-les progressivement pour habituer votre microbiote.', action: 'Faites tremper les légumineuses 12h avant cuisson.' },
  ],
  references: [
    { authors: 'Riché D', title: 'Fermentation intestinale et dysbiose', journal: 'Référentiel nutritionnel', year: 2024 },
    { authors: 'Druguet S', title: 'Mastication et sécrétion enzymatique', journal: 'Référentiel nutritionnel', year: 2024 },
  ],
}

// ══════════════════════════════════════════════════════
// Diarrhée (GSRS)
// ══════════════════════════════════════════════════════

const diarrheeReport: SectionReport = {
  sectionId: 'diarrhee',
  context:
    'La diarrhée fonctionnelle signale une réponse de clairance face à une agression de la muqueuse. Une dysbiose (déséquilibre du microbiote intestinal) — notamment un excès de Candida albicans — sécrète des enzymes protéolytiques qui dégradent le mucus protecteur et attaquent les jonctions serrées (les "fermetures éclair" entre les cellules intestinales). La réaction immunitaire locale, via les mastocytes qui libèrent de l\'histamine, provoque une exsudation liquidienne dans la lumière intestinale, accélérant le transit.',
  recommendations: [
    { maxPct: 33, level: 'alerte', title: 'Transit accéléré fréquent', text: 'Votre transit est régulièrement accéléré. Réduisez les aliments ultra-transformés dont les additifs (émulsifiants) détruisent la couche de mucus protecteur, et supprimez les édulcorants qui perturbent la composition du microbiote. Augmentez les fibres solubles (avoine, légumes cuits) pour nourrir les bactéries protectrices.' },
    { maxPct: 66, level: 'vigilance', title: 'Transit légèrement accéléré', text: 'Un transit accéléré régulier mérite attention. Identifiez vos déclencheurs (laitages, sucres raffinés, édulcorants) et intégrez des aliments lactofermentés pour restaurer l\'équilibre du microbiote.' },
    { maxPct: 90, level: 'bon', title: 'Transit normal', text: 'Transit satisfaisant. Maintenez un apport en fibres équilibré et une bonne hydratation.' },
    { maxPct: 100, level: 'excellent', title: 'Transit optimal', text: 'Aucun signe de transit accéléré. Excellent signe d\'un microbiote en bonne santé.' },
  ],
  questionInsights: [
    { questionId: 'dia-1', triggerMaxScore: 1, insight: 'Des épisodes diarrhéiques fréquents peuvent signaler un déséquilibre des bactéries intestinales.', recommendation: 'Supprimez temporairement les édulcorants et additifs (E1xx, E2xx) qui modifient radicalement la composition bactérienne intestinale. Intégrez des aliments lactofermentés (yaourt vivant, choucroute) pour restaurer les souches protectrices.', action: 'Supprimez édulcorants et additifs, et ajoutez un aliment lactofermenté par jour.' },
    { questionId: 'dia-2', triggerMaxScore: 1, insight: 'Des selles molles récurrentes peuvent indiquer une fragilisation de la paroi intestinale.', recommendation: 'Augmentez les fibres solubles (avoine, légumes cuits) et intégrez des aliments lactofermentés pour renforcer progressivement la paroi intestinale. Réduisez alcool et sucres raffinés qui la fragilisent.', action: 'Ajoutez un aliment lactofermenté par jour (yaourt vivant, choucroute, kéfir).' },
    { questionId: 'dia-3', triggerMaxScore: 1, insight: 'Des urgences fécales fréquentes signalent une sensibilité accrue ou une inflammation locale.', recommendation: 'Réduisez les facteurs irritants (alcool, café, sucres raffinés) et privilégiez des repas réguliers dans le calme. Le mode repos activé au repas régule naturellement les contractions intestinales.', action: 'Supprimez alcool, café en excès et sucres raffinés de votre alimentation.' },
  ],
  references: [
    { authors: 'Riché D', title: 'Dysbiose et perméabilité intestinale', journal: 'Référentiel nutritionnel', year: 2024 },
  ],
}

// ══════════════════════════════════════════════════════
// Constipation (GSRS)
// ══════════════════════════════════════════════════════

const constipationReport: SectionReport = {
  sectionId: 'constipation',
  context:
    'La constipation résulte souvent d\'un intestin paresseux — ses contractions naturelles (péristaltisme) sont trop faibles pour faire avancer les selles. Une alimentation trop acidifiante (protéines animales industrielles, sucres raffinés) perturbe le fonctionnement enzymatique et ralentit ces contractions. Les fibres solubles, transformées par les bactéries intestinales en butyrate (le carburant des cellules du côlon), soutiennent activement cette motilité.',
  recommendations: [
    { maxPct: 33, level: 'alerte', title: 'Constipation fréquente', text: 'Votre transit est régulièrement ralenti. Augmentez progressivement les fibres (légumes, légumineuses, graines de lin) et hydratez-vous (1,5 à 2L/jour). L\'activité physique quotidienne stimule directement la motilité colique. Favorisez les aliments alcalinisants (fruits, légumes colorés) pour réduire l\'acidose tissulaire.' },
    { maxPct: 66, level: 'vigilance', title: 'Constipation modérée', text: 'Un transit ralenti mérite votre attention. Intégrez 2 c. à soupe de graines de lin dans un verre d\'eau chaque matin. Profitez des 20-30 minutes après le petit-déjeuner pour aller aux toilettes — le côlon est alors naturellement le plus actif.' },
    { maxPct: 90, level: 'bon', title: 'Transit satisfaisant', text: 'Transit globalement régulier. Maintenez des fibres variées et une bonne hydratation.' },
    { maxPct: 100, level: 'excellent', title: 'Transit optimal', text: 'Aucun signe de constipation. Excellent équilibre entre fibres, hydratation et motilité intestinale.' },
  ],
  questionInsights: [
    { questionId: 'con-1', triggerMaxScore: 1, insight: 'Une constipation fréquente peut indiquer un manque de fibres, une hydratation insuffisante ou un intestin paresseux.', recommendation: 'Commencez chaque matin par un grand verre d\'eau. Intégrez des graines de lin moulues (2 c. à soupe/jour) et des légumineuses à chaque repas. L\'activité physique quotidienne est l\'un des meilleurs stimulants des contractions naturelles du côlon.', action: 'Commencez chaque matin par un grand verre d\'eau et 2 c. à soupe de graines de lin.' },
    { questionId: 'con-2', triggerMaxScore: 1, insight: 'Des selles dures récurrentes signalent un transit trop lent et un manque d\'hydratation.', recommendation: 'Hydratez-vous suffisamment et intégrez des graines de lin moulues dans vos repas. Les fibres solubles retiennent l\'eau dans les selles et les ramollissent. Le magnésium (légumineuses, chocolat noir, graines) soutient également les contractions intestinales.', action: 'Hydratez-vous (1,5 L/jour min.) et ajoutez des graines de lin moulues à vos repas.' },
    { questionId: 'con-3', triggerMaxScore: 1, insight: 'Une sensation de vidange incomplète fréquente peut indiquer un intestin paresseux.', recommendation: 'En première intention : placez un petit tabouret sous les pieds aux toilettes — cette position physiologique libère naturellement le passage. Évitez les aliments ultra-transformés dont les additifs perturbent les contractions du côlon.', action: 'Utilisez un petit tabouret sous les pieds aux toilettes pour faciliter le passage.' },
  ],
  references: [
    { authors: 'Riché D', title: 'Constipation, PRAL et motilité intestinale', journal: 'Référentiel nutritionnel', year: 2024 },
    { authors: 'Berthou A', title: 'Énergie cellulaire et fibres alimentaires', journal: 'Référentiel nutritionnel', year: 2024 },
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
    return { sectionId: r.sectionId, title: r.title, pct: r.pct, score: r.score, maxScore: r.maxScore, level: rec.level, recommendationTitle: rec.title, recommendationText: rec.text, context: report.context, triggeredInsights: triggered.map(t => ({ questionId: t.questionId, insight: t.insight, recommendation: t.recommendation, action: t.action })), references: report.references }
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
      weaknesses.push({ sectionId: r.sectionId, title: r.title, pct: r.pct, level: rec.level, concern: rec.text, science: report.context, reference: ref0, triggeredInsights: triggered.map(t => ({ questionId: t.questionId, insight: t.insight, recommendation: t.recommendation, action: t.action })) })
    }
  }
  // For digestif, higher pct = worse, so sort descending
  weaknesses.sort((a, b) => b.pct - a.pct)

  const phase1: { action: string; why: string; sectionId: string }[] = []
  const phase2: { action: string; why: string; sectionId: string }[] = []
  const phase3: { action: string; why: string; sectionId: string }[] = []
  for (const w of weaknesses) {
    for (const ti of w.triggeredInsights) {
      const short = ti.action || ti.recommendation.split('.')[0] + '.'
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
    title: 'Le trépied intestinal : votre bouclier de santé',
    description: 'La muqueuse, le système immunitaire digestif (GALT) et le microbiote forment un trépied dynamique. Toute dysfonction de cette interface — Inflammation, Dysbiose, Hyperperméabilité (IDH) — est le point de départ de troubles systémiques qui dépassent largement la digestion : fatigue, inflammation chronique, perturbations de l\'humeur.',
    reference: 'Riché D — Référentiel nutritionnel',
  },
  {
    title: 'L\'axe intestin-cerveau : 95 % de votre sérotonine',
    description: 'Votre intestin produit 95 % de la sérotonine de votre corps. En situation de dysbiose et d\'hyperperméabilité, l\'inflammation détourne le tryptophane vers une voie neurotoxique (kynurénine) au lieu de produire sérotonine et mélatonine — ce qui se traduit par irritabilité, anxiété, brouillard mental et troubles du sommeil.',
    reference: 'Druguet S — Référentiel nutritionnel',
  },
  {
    title: 'Les symptômes digestifs : un signal systémique',
    description: 'Un score digestif élevé n\'est pas le signe d\'une simple "digestion difficile". C\'est le biomarqueur d\'un organisme en alerte immunitaire : le foie saturé par la détoxication ne peut plus fournir l\'énergie nécessaire au maintien de l\'humeur, du muscle et de la vitalité.',
    reference: 'Berthou A — Référentiel nutritionnel',
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
