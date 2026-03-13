// ──────────────────────────────────────────────────────
// Bilan Gestion du Stress — Scientific Report Engine
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
// GHQ-12 — Bien-être mental
// ══════════════════════════════════════════════════════
const ghq12Report: SectionReport = {
  sectionId: 'ghq-12',
  context:
    'Ce questionnaire évalue votre bien-être mental général : comment vous vous sentez au quotidien, votre humeur, votre capacité à faire face aux difficultés et à profiter de la vie. C\'est l\'un des outils les plus utilisés dans le monde pour mesurer la santé mentale de façon simple et fiable.',
  recommendations: [
    { minPct: 80, level: 'excellent', title: 'Bien-être psychologique stable', text: 'Votre santé mentale est excellente. Vous faites preuve d\'une bonne capacité à maintenir votre équilibre psychique au quotidien.' },
    { minPct: 60, level: 'bon', title: 'Bon bien-être mental', text: 'Votre état psychique est globalement bon. Quelques signaux de stress ou de baisse de moral existent mais restent gérables.' },
    { minPct: 40, level: 'moyen', title: 'Détresse psychologique modérée', text: 'Des signes de détresse psychologique sont présents. Un accompagnement préventif (thérapie brève, activité physique, soutien social) est recommandé.' },
    { minPct: 0, level: 'faible', title: 'Détresse psychologique significative', text: 'Votre bien-être mental est sérieusement affecté. Nous recommandons fortement de consulter un professionnel de santé mentale.' },
  ],
  insights: [
    { questionId: 'ghq-2', threshold: 1, insight: 'Les troubles du sommeil liés aux soucis sont un marqueur précoce d\'anxiété généralisée.', recommendation: 'Pratiquez l\'écriture de « worry time » : notez vos préoccupations 20 min avant le coucher pour libérer l\'esprit.' },
    { questionId: 'ghq-5', threshold: 1, insight: 'Le sentiment de pression constante active l\'axe du stress (HPA) et peut mener à l\'épuisement.', recommendation: 'Identifiez vos 3 principales sources de pression et appliquez la matrice d\'Eisenhower (urgent/important) pour prioriser.' },
    { questionId: 'ghq-9', threshold: 1, insight: 'Un sentiment dépressif persistant nécessite une attention particulière car il peut s\'aggraver avec le temps.', recommendation: 'Une technique simple mais efficace : planifiez chaque jour une activité qui vous plaisait autrefois, même si vous n\'en avez pas envie. Agir d\'abord aide à retrouver progressivement l\'envie — c\'est souvent le contraire de ce qu\'on imagine.' },
    { questionId: 'ghq-10', threshold: 1, insight: 'La perte de confiance en soi est souvent liée à des distorsions cognitives qui peuvent être corrigées.', recommendation: 'Tenez un journal de vos réussites quotidiennes, même petites. La thérapie cognitive peut aider à restructurer les pensées négatives.' },
    { questionId: 'ghq-11', threshold: 1, insight: 'Le sentiment de ne rien valoir est un signal d\'alerte important pour la santé mentale.', recommendation: 'Parlez-en à un proche de confiance ou à un professionnel. Ces pensées ne reflètent pas la réalité mais un état émotionnel temporaire.' },
  ],
  references: [
    { authors: 'Goldberg DP, Gater R, Sartorius N et al.', title: 'The validity of two versions of the GHQ in the WHO study of mental illness in general health care', journal: 'Psychol Med', year: 1997, doi: '10.1017/S0033291796004242', pmid: '9089829' },
    { authors: 'Goldberg DP, Williams P', title: 'A user\'s guide to the General Health Questionnaire', journal: 'NFER-Nelson', year: 1988 },
    { authors: 'Banks MH, Clegg CW, Jackson PR et al.', title: 'The use of the General Health Questionnaire as an indicator of mental health in occupational studies', journal: 'J Occup Psychol', year: 1980, doi: '10.1111/j.2044-8325.1980.tb00024.x' },
  ],
}

// ══════════════════════════════════════════════════════
// CD-RISC — Résilience mentale
// ══════════════════════════════════════════════════════
const cdRiscReport: SectionReport = {
  sectionId: 'cd-risc',
  context:
    'La résilience, c\'est votre capacité à tenir bon face aux coups durs et à rebondir après des périodes difficiles. C\'est un facteur protecteur majeur contre la dépression, l\'épuisement et les états de stress prolongés — et la bonne nouvelle : elle se développe tout au long de la vie grâce à des pratiques concrètes.',
  recommendations: [
    { minPct: 80, level: 'excellent', title: 'Résilience élevée', text: 'Vous avez une capacité remarquable à rebondir face aux difficultés. Cette résilience est un atout majeur pour votre santé mentale et physique à long terme.' },
    { minPct: 60, level: 'bon', title: 'Bonne résilience', text: 'Votre résilience est bonne dans l\'ensemble. Renforcez votre capacité à gérer les émotions intenses et à maintenir votre concentration sous pression.' },
    { minPct: 40, level: 'moyen', title: 'Résilience modérée', text: 'Votre résilience est à renforcer. Des programmes de développement de la résilience (MBSR, thérapie cognitivo-comportementale) sont efficaces.' },
    { minPct: 0, level: 'faible', title: 'Résilience faible', text: 'Votre capacité de rebond est limitée. Un accompagnement professionnel peut vous aider à développer des stratégies de coping plus efficaces.' },
  ],
  insights: [
    { questionId: 'cdr-1', threshold: 1, insight: 'Une faible adaptabilité au changement augmente la vulnérabilité au stress lors des transitions de vie.', recommendation: 'Commencez par de petits changements volontaires dans votre routine pour développer votre flexibilité.' },
    { questionId: 'cdr-5', threshold: 1, insight: 'Mal gérer le stress au quotidien augmente le risque de maladies cardiaques et fragilise le système immunitaire.', recommendation: 'Essayez la respiration rythmée : inspirez 5 secondes, expirez 5 secondes, pendant 5 minutes. En faisant ça 3 fois par jour, vous aidez votre corps à retrouver son calme naturel — c\'est scientifiquement validé pour réduire l\'hormone du stress (le cortisol).' },
    { questionId: 'cdr-8', threshold: 1, insight: 'Se laisser submerger par les émotions est souvent un signe que notre cerveau est en mode survie — et qu\'il a besoin d\'un peu d\'entraînement.', recommendation: 'La méditation de pleine conscience (rester attentif à ce qui se passe maintenant, sans jugement) renforce progressivement votre capacité à réguler vos émotions. 10 min/jour pendant 8 semaines suffisent pour des effets mesurables.' },
    { questionId: 'cdr-10', threshold: 1, insight: 'Le sentiment de perte de contrôle est associé à un stress plus intense et une récupération plus lente.', recommendation: 'Identifiez ce qui est dans votre cercle de contrôle vs. d\'influence vs. de préoccupation, et concentrez votre énergie sur le premier.' },
  ],
  references: [
    { authors: 'Connor KM, Davidson JRT', title: 'Development of a new resilience scale: The Connor-Davidson Resilience Scale (CD-RISC)', journal: 'Depress Anxiety', year: 2003, doi: '10.1002/da.10113', pmid: '12964174' },
    { authors: 'Campbell-Sills L, Stein MB', title: 'Psychometric analysis and refinement of the Connor-Davidson Resilience Scale (CD-RISC): Validation of a 10-item measure of resilience', journal: 'J Trauma Stress', year: 2007, doi: '10.1002/jts.20271', pmid: '18157881' },
    { authors: 'Southwick SM, Charney DS', title: 'The science of resilience: implications for the prevention and treatment of depression', journal: 'Science', year: 2012, doi: '10.1126/science.1222942', pmid: '23066073' },
  ],
}

// ══════════════════════════════════════════════════════
// PSS — Stress perçu
// ══════════════════════════════════════════════════════
const pssReport: SectionReport = {
  sectionId: 'pss',
  context:
    'Ce n\'est pas tant ce qui vous arrive qui compte, mais comment vous le vivez. Ce score évalue votre ressenti face au stress : est-ce que vous vous sentez dépassé, sans contrôle sur votre vie ? Un niveau de stress perçu élevé est associé à une inflammation chronique, des troubles cardiovasculaires et un vieillissement accéléré — même en l\'absence de problèmes objectifs.',
  recommendations: [
    { minPct: 80, level: 'excellent', title: 'Stress perçu faible', text: 'Votre niveau de stress est faible. Vous avez un bon sentiment de contrôle sur votre vie et gérez efficacement les imprévus.' },
    { minPct: 60, level: 'bon', title: 'Stress modéré', text: 'Votre stress est modéré et gérable. Maintenez vos stratégies actuelles et renforcez votre sentiment de contrôle par des routines structurantes.' },
    { minPct: 40, level: 'moyen', title: 'Stress élevé', text: 'Votre niveau de stress est préoccupant. Des techniques de gestion du stress (exercice, méditation, soutien social) doivent être intégrées à votre quotidien.' },
    { minPct: 0, level: 'faible', title: 'Stress très élevé', text: 'Votre stress perçu est très élevé et représente un risque significatif pour votre santé. Un accompagnement professionnel et des modifications de style de vie sont urgents.' },
  ],
  insights: [
    { questionId: 'pss-1', threshold: 1, insight: 'Se sentir fréquemment dépassé active la réponse de stress chronique (cortisol, inflammation).', recommendation: 'Pratiquez le « brain dump » quotidien : listez toutes vos tâches/préoccupations pour décharger votre mémoire de travail.' },
    { questionId: 'pss-2', threshold: 1, insight: 'Le sentiment de perte de contrôle est l\'un des plus puissants activateurs du stress psychologique.', recommendation: 'Adoptez la planification hebdomadaire : 30 min le dimanche pour organiser votre semaine redonne un sentiment de maîtrise.' },
    { questionId: 'pss-3', threshold: 1, insight: 'La nervosité chronique met votre corps en état d\'alerte permanent — ce qui perturbe la digestion, le sommeil et les défenses immunitaires.', recommendation: 'La technique de respiration 4-7-8 est une vraie ancre rapide : inspirez 4 secondes, retenez 7 secondes, expirez lentement 8 secondes. Elle déclenche la réponse de détente de votre corps en moins d\'une minute.' },
    { questionId: 'pss-7', threshold: 1, insight: 'L\'accumulation perçue des difficultés est un facteur de risque pour le burn-out et la dépression.', recommendation: 'Décomposez chaque problème en sous-étapes concrètes. La résolution séquentielle réduit le sentiment d\'accumulation.' },
    { questionId: 'pss-10', threshold: 1, insight: 'Le sentiment chronique de surcharge est un précurseur fréquent du burn-out.', recommendation: 'Apprenez à dire non et à déléguer. Priorisez avec la règle des 20% : identifiez les 20% d\'actions qui produisent 80% des résultats.' },
  ],
  references: [
    { authors: 'Cohen S, Kamarck T, Mermelstein R', title: 'A global measure of perceived stress', journal: 'J Health Soc Behav', year: 1983, doi: '10.2307/2136404', pmid: '6668417' },
    { authors: 'Cohen S, Janicki-Deverts D', title: 'Who\'s stressed? Distributions of psychological stress in the United States in probability samples from 1983, 2006, and 2009', journal: 'J Appl Soc Psychol', year: 2012, doi: '10.1111/j.1559-1816.2011.00884.x' },
    { authors: 'Epel ES, Blackburn EH, Lin J et al.', title: 'Accelerated telomere shortening in response to life stress', journal: 'Proc Natl Acad Sci USA', year: 2004, doi: '10.1073/pnas.0407162101', pmid: '15574496' },
  ],
}

// ══════════════════════════════════════════════════════
// Fatigue complémentaire
// ══════════════════════════════════════════════════════
const fatigueReport: SectionReport = {
  sectionId: 'fatigue',
  context:
    'La fatigue chronique est un symptôme transversal qui touche les dimensions mentale, physique et motivationnelle. Elle est souvent le signe d\'un déséquilibre entre les sollicitations et les ressources de récupération. La fatigue persistante est associée à des déficits cognitifs, une baisse de performance et un risque accru de dépression.',
  recommendations: [
    { minPct: 80, level: 'excellent', title: 'Faible fatigue', text: 'Votre niveau de fatigue est faible. Vos capacités de récupération sont bonnes et votre énergie est bien maintenue.' },
    { minPct: 60, level: 'bon', title: 'Fatigue modérée', text: 'Votre fatigue est modérée. Veillez à maintenir un bon équilibre effort/récupération et un sommeil de qualité.' },
    { minPct: 40, level: 'moyen', title: 'Fatigue significative', text: 'Votre fatigue est significative et affecte probablement votre quotidien. Un bilan médical (fer, vitamine D, thyroïde) et une révision de votre hygiène de vie sont recommandés.' },
    { minPct: 0, level: 'faible', title: 'Fatigue sévère', text: 'Votre niveau de fatigue est alarmant. Un bilan médical complet est nécessaire pour écarter des causes organiques (anémie, dysthyroïdie, pathologie chronique).' },
  ],
  insights: [
    { questionId: 'fat-1', threshold: 1, insight: 'Des difficultés de concentration persistantes peuvent indiquer une fatigue cognitive ou un trouble attentionnel.', recommendation: 'Utilisez la technique Pomodoro (25 min de focus + 5 min de pause) et limitez le multitâche.' },
    { questionId: 'fat-2', threshold: 1, insight: 'La saturation cognitive rapide est un signe de surcharge mentale ou de manque de sommeil profond.', recommendation: 'Réduisez la stimulation digitale (emails, notifications) et pratiquez des pauses de déconnexion de 10 min toutes les 2h.' },
    { questionId: 'fat-4', threshold: 1, insight: 'Une fatigue corporelle persistante malgré un sommeil correct peut signaler une carence ou un trouble sous-jacent.', recommendation: 'Demandez à votre médecin un bilan sanguin complet : taux de fer, vitamine D, fonction thyroïdienne et marqueurs d\'inflammation. Ces 4 éléments expliquent la grande majorité des fatigues chroniques inexpliquées.' },
    { questionId: 'fat-6', threshold: 1, insight: 'La sensation de lourdeur corporelle sans cause évidente peut être liée à l\'inflammation systémique ou au sédentarisme.', recommendation: 'L\'exercice physique modéré (marche rapide 30 min/jour) réduit paradoxalement la fatigue et améliore l\'énergie perçue.' },
    { questionId: 'fat-7', threshold: 1, insight: 'La perte d\'élan pour les activités autrefois motivantes est un signal d\'alerte pour le burn-out ou la dépression.', recommendation: 'Reconnectez-vous à vos valeurs profondes. Planifiez au moins une activité « plaisir » par jour, même brève.' },
  ],
  references: [
    { authors: 'Boksem MAS, Tops M', title: 'Mental fatigue: Costs and benefits', journal: 'Brain Res Rev', year: 2008, doi: '10.1016/j.brainresrev.2008.07.001', pmid: '18657578' },
    { authors: 'Puetz TW, Flowers SS, O\'Connor PJ', title: 'A randomized controlled trial of the effect of aerobic exercise training on feelings of energy and fatigue in sedentary young adults with persistent fatigue', journal: 'Psychother Psychosom', year: 2008, doi: '10.1159/000116610', pmid: '18277063' },
    { authors: 'Maslach C, Schaufeli WB, Leiter MP', title: 'Job Burnout', journal: 'Annu Rev Psychol', year: 2001, doi: '10.1146/annurev.psych.52.1.397', pmid: '11148311' },
  ],
}

// ══════════════════════════════════════════════════════
// Global key insights
// ══════════════════════════════════════════════════════
export const globalKeyInsights: { title: string; description: string; reference: string }[] = [
  {
    title: 'Le stress chronique vieillit littéralement vos cellules',
    description: 'Le stress prolongé raccourcit les télomères — les « capuchons » protecteurs au bout de vos chromosomes. C\'est un mécanisme direct de vieillissement cellulaire accéléré. Il augmente aussi l\'inflammation dans le corps et fragilise le système immunitaire.',
    reference: 'Epel et al., 2004, PNAS',
  },
  {
    title: 'Votre cerveau peut changer en 8 semaines',
    description: 'Les programmes de méditation et de pleine conscience ont montré des effets mesurables sur le cortisol (l\'hormone du stress), la pression artérielle — et même sur la structure du cerveau — en seulement 8 semaines de pratique régulière.',
    reference: 'Hölzel et al., 2011, Psychiatry Research',
  },
  {
    title: 'Le meilleur anti-stress : bouger',
    description: 'L\'activité physique régulière est l\'intervention la plus efficace pour améliorer simultanément le stress ressenti, la fatigue mentale et la capacité à rebondir face aux difficultés.',
    reference: 'Schuch et al., 2018, Neuroscience & Biobehavioral Reviews',
  },
]

// ══════════════════════════════════════════════════════
// API
// ══════════════════════════════════════════════════════

const allReports: SectionReport[] = [ghq12Report, cdRiscReport, pssReport, fatigueReport]

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
  if (phase2.length > 0) actionPlan.push({ phase: 2, phaseTitle: 'Consolidation', timeframe: 'Semaines 3-6', actions: phase2.slice(0, 5) })
  if (phase3.length > 0) actionPlan.push({ phase: 3, phaseTitle: 'Suivi médical', timeframe: 'À planifier', actions: phase3.slice(0, 3) })
  if (actionPlan.length === 0) actionPlan.push({ phase: 1, phaseTitle: 'Maintien des acquis', timeframe: 'En continu', actions: [{ action: 'Maintenez vos bonnes pratiques de gestion du stress.', why: 'Vos scores sont bons — continuez sur cette lancée.', sectionId: '' }] })

  return { strengths, weaknesses, actionPlan, globalInsights: globalKeyInsights, sectionReports }
}
