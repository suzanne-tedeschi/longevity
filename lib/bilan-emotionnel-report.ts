// ──────────────────────────────────────────────────────
// Bilan Santé Émotionnelle — Scientific Report Engine
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
  threshold: number        // score ≤ this triggers insight
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
// B-PANAS — État émotionnel
// ══════════════════════════════════════════════════════
const bpanasReport: SectionReport = {
  sectionId: 'b-panas',
  context:
    'Ce score mesure votre état émotionnel récent : à quelle fréquence vous ressentez des émotions agréables (joie, enthousiasme, énergie) versus des émotions difficiles (tristesse, peur, irritabilité). Plus les émotions positives dominent votre quotidien, plus cela protège votre santé mentale et physique sur le long terme.',
  recommendations: [
    { minPct: 80, level: 'excellent', title: 'Équilibre émotionnel remarquable', text: 'Votre profil émotionnel est très favorable avec un bon ratio affects positifs / négatifs. Continuez à cultiver les activités qui vous procurent de la joie et de l\'engagement.' },
    { minPct: 60, level: 'bon', title: 'Bon équilibre émotionnel', text: 'Votre balance émotionnelle est globalement positive. Identifiez les situations qui génèrent des affects négatifs récurrents pour mieux les anticiper.' },
    { minPct: 40, level: 'moyen', title: 'Équilibre émotionnel modéré', text: 'Vos affects négatifs sont significatifs. Des techniques de régulation émotionnelle (réévaluation cognitive, pleine conscience) peuvent améliorer votre bien-être.' },
    { minPct: 0, level: 'faible', title: 'Déséquilibre émotionnel important', text: 'Les émotions difficiles prédominent en ce moment. Un accompagnement thérapeutique est recommandé — il existe aujourd\'hui des approches très efficaces pour reprendre le contrôle de son état émotionnel, souvent en quelques semaines.' },
  ],
  insights: [
    { questionId: 'emo-2', threshold: 1, insight: 'Un niveau élevé de perturbation émotionnelle peut indiquer un stress chronique ou une anxiété sous-jacente.', recommendation: 'Essayez la respiration rythmée 3 fois par jour pendant 5 minutes : inspirez 5 secondes, expirez 5 secondes. Ce rythme régulier envoie un signal de calme à votre cerveau et stabilise progressivement votre humeur.' },
    { questionId: 'emo-7', threshold: 1, insight: 'La peur fréquente est associée à l\'anxiété généralisée et peut limiter votre capacité d\'action.', recommendation: 'L\'exposition progressive et la relaxation musculaire progressive sont des techniques validées pour réduire les peurs.' },
    { questionId: 'emo-11', threshold: 1, insight: 'L\'irritabilité chronique peut être un signe de surcharge cognitive ou de manque de sommeil.', recommendation: 'Assurez-vous d\'un sommeil suffisant (7-9h) et pratiquez des activités de décompression régulières.' },
    { questionId: 'emo-15', threshold: 1, insight: 'La nervosité persistante active le système de stress du corps — ce qui augmente le cortisol (l\'hormone du stress) et use progressivement l\'organisme.', recommendation: 'La méditation de pleine conscience — rester attentif à l\'instant présent sans se laisser emporter par les pensées — a montré une réduction significative du cortisol en 8 semaines de pratique quotidienne de 10 minutes.' },
    { questionId: 'emo-1', threshold: 1, insight: 'Un manque d\'intérêt peut signaler un début de désengagement ou d\'anhédonie.', recommendation: 'Planifiez des activités qui ont historiquement suscité votre curiosité, même si l\'envie semble absente.' },
    { questionId: 'emo-9', threshold: 1, insight: 'Un faible enthousiasme est corrélé à une baisse de la dopamine et de la motivation intrinsèque.', recommendation: 'L\'exercice physique régulier (30 min, 5×/semaine) augmente naturellement la dopamine et la sérotonine.' },
  ],
  references: [
    { authors: 'Watson D, Clark LA, Tellegen A', title: 'Development and validation of brief measures of positive and negative affect: the PANAS scales', journal: 'J Pers Soc Psychol', year: 1988, doi: '10.1037/0022-3514.54.6.1063', pmid: '3397865' },
    { authors: 'Fredrickson BL, Losada MF', title: 'Positive affect and the complex dynamics of human flourishing', journal: 'Am Psychol', year: 2005, doi: '10.1037/0003-066X.60.7.678', pmid: '16221001' },
    { authors: 'Diener E, Larsen RJ, Levine S, Emmons RA', title: 'Intensity and frequency: dimensions underlying positive and negative affect', journal: 'J Pers Soc Psychol', year: 1985, doi: '10.1037/0022-3514.48.5.1253' },
  ],
}

// ══════════════════════════════════════════════════════
// Satisfaction de vie (Diener)
// ══════════════════════════════════════════════════════
const dienerReport: SectionReport = {
  sectionId: 'satisfaction-vie',
  context:
    'La satisfaction de vie, c\'est votre regard global sur votre existence : êtes-vous content(e) de la façon dont votre vie se déroule ? Ce n\'est pas une émotion du moment, mais un jugement posé, réfléchi. Les études montrent que les personnes satisfaites de leur vie ont une meilleure santé physique et vivent plus longtemps.',
  recommendations: [
    { minPct: 80, level: 'excellent', title: 'Satisfaction de vie élevée', text: 'Vous êtes très satisfait(e) de votre vie. Ce niveau de satisfaction est associé à une meilleure santé cardiovasculaire et une plus grande longévité.' },
    { minPct: 60, level: 'bon', title: 'Bonne satisfaction de vie', text: 'Vous êtes globalement satisfait(e) avec quelques domaines d\'amélioration. Identifiez vos valeurs fondamentales et alignez vos actions quotidiennes sur celles-ci.' },
    { minPct: 40, level: 'moyen', title: 'Satisfaction de vie modérée', text: 'Des insatisfactions notables existent dans certains domaines de votre vie. Un travail sur la clarification de vos objectifs et la gratitude peut aider.' },
    { minPct: 0, level: 'faible', title: 'Insatisfaction importante', text: 'Votre satisfaction de vie est faible. Cela peut refléter un décalage entre vos aspirations et votre réalité. Un accompagnement en psychologie positive est recommandé.' },
  ],
  insights: [
    { questionId: 'sat-1', threshold: 2, insight: 'Un écart important entre vos idéaux et votre réalité peut générer une frustration chronique qui pèse sur le moral.', recommendation: 'Distinguez ce qui est dans votre cercle d\'action de ce qui ne l\'est pas. Accepter ce qu\'on ne peut pas changer — et agir là où on le peut — est une des compétences les plus libératrices qui soit.' },
    { questionId: 'sat-3', threshold: 2, insight: 'Une faible satisfaction globale est un facteur de risque pour la dépression et les maladies chroniques.', recommendation: 'Tenez un journal de gratitude quotidien (3 choses positives/jour). Cette pratique a montré des effets durables sur le bien-être.' },
    { questionId: 'sat-5', threshold: 2, insight: 'Des regrets importants peuvent peser sur votre bien-être émotionnel et votre estime de soi.', recommendation: 'La technique du « self-compassion » de Kristin Neff aide à accepter les choix passés avec bienveillance.' },
  ],
  references: [
    { authors: 'Diener E, Emmons RA, Larsen RJ, Griffin S', title: 'The Satisfaction with Life Scale', journal: 'J Pers Assess', year: 1985, doi: '10.1207/s15327752jpa4901_13', pmid: '16367493' },
    { authors: 'Pavot W, Diener E', title: 'Review of the Satisfaction With Life Scale', journal: 'Psychol Assess', year: 1993, doi: '10.1037/1040-3590.5.2.164' },
    { authors: 'Steptoe A, Deaton A, Stone AA', title: 'Subjective wellbeing, health, and ageing', journal: 'Lancet', year: 2015, doi: '10.1016/S0140-6736(13)61489-0', pmid: '25468160' },
  ],
}

// ══════════════════════════════════════════════════════
// TEIQue — Intelligence émotionnelle
// ══════════════════════════════════════════════════════
const teiqReport: SectionReport = {
  sectionId: 'teiq',
  context:
    'L\'intelligence émotionnelle, c\'est votre capacité à reconnaître vos émotions, à les comprendre et à les gérer — ainsi que celles des autres. Elle est associée à une meilleure santé mentale, des relations plus satisfaisantes et une plus grande résistance au stress. Et contrairement au QI, elle se développe tout au long de la vie.',
  recommendations: [
    { minPct: 80, level: 'excellent', title: 'Intelligence émotionnelle très développée', text: 'Vous avez une excellente capacité à comprendre et gérer vos émotions ainsi que celles des autres. C\'est un atout majeur pour votre bien-être et vos relations.' },
    { minPct: 60, level: 'bon', title: 'Bonne intelligence émotionnelle', text: 'Votre IE est globalement bonne. Certaines dimensions (maitrise de soi, sociabilité) peuvent encore être renforcées par des exercices ciblés.' },
    { minPct: 40, level: 'moyen', title: 'Intelligence émotionnelle modérée', text: 'Des lacunes dans certaines dimensions de l\'IE peuvent générer des difficultés relationnelles ou une gestion émotionnelle insuffisante.' },
    { minPct: 0, level: 'faible', title: 'Intelligence émotionnelle à développer', text: 'Des compétences émotionnelles clés nécessitent un développement. Un coaching en intelligence émotionnelle ou un programme de développement personnel est recommandé.' },
  ],
  insights: [
    { questionId: 'teiq-4', threshold: 2, insight: 'Des difficultés de régulation émotionnelle sont associées à l\'anxiété, la dépression et les conflits interpersonnels.', recommendation: 'Pratiquez la technique STOP (Stop, Take a breath, Observe, Proceed) lors des moments de tension émotionnelle.' },
    { questionId: 'teiq-8', threshold: 2, insight: 'Avoir du mal à nommer ce qu\'on ressent (« je me sens mal » sans savoir pourquoi) est plus fréquent qu\'on ne le croit — et peut contribuer à des tensions physiques inexpliquées.', recommendation: 'Cherchez une « roue des émotions » en ligne et utilisez-la chaque soir pour nommer précisément ce que vous avez ressenti dans la journée. Plus vous enrichissez votre vocabulaire émotionnel, mieux vous pouvez agir sur vos états.' },
    { questionId: 'teiq-10', threshold: 2, insight: 'La difficulté à s\'affirmer peut mener à l\'accumulation de frustrations et au burn-out.', recommendation: 'Entraînez-vous à la communication assertive : exprimez vos besoins avec la formule « Quand... je ressens... j\'ai besoin... ».' },
    { questionId: 'teiq-18', threshold: 2, insight: 'Un manque de motivation persistant peut signaler un épuisement émotionnel ou un début de burn-out.', recommendation: 'Identifiez vos valeurs profondes et reconnectez vos actions quotidiennes à ce qui fait sens pour vous.' },
    { questionId: 'teiq-25', threshold: 2, insight: 'La tendance à abandonner peut être liée à un faible sentiment d\'auto-efficacité.', recommendation: 'Fixez-vous des micro-objectifs atteignables pour reconstruire progressivement votre confiance.' },
    { questionId: 'teiq-28', threshold: 2, insight: 'Des difficultés relationnelles avec les proches sont un facteur de risque majeur pour la dépression.', recommendation: 'Il existe des accompagnements thérapeutiques qui travaillent spécifiquement sur la qualité des relations proches — comment mieux communiquer, régler les conflits, retrouver la connexion. Quelques séances peuvent changer profondément la dynamique.' },
  ],
  references: [
    { authors: 'Petrides KV, Furnham A', title: 'Trait emotional intelligence: psychometric investigation with reference to established trait taxonomies', journal: 'Eur J Pers', year: 2001, doi: '10.1002/per.416' },
    { authors: 'Petrides KV, Pita R, Kokkinaki F', title: 'The location of trait emotional intelligence in personality factor space', journal: 'Br J Psychol', year: 2007, doi: '10.1348/000712606X120618', pmid: '17535458' },
    { authors: 'Martins A, Ramalho N, Morin E', title: 'A comprehensive meta-analysis of the relationship between Emotional Intelligence and health', journal: 'Pers Individ Dif', year: 2010, doi: '10.1016/j.paid.2010.05.029' },
    { authors: 'Schutte NS, Malouff JM, Thorsteinsson EB et al.', title: 'A meta-analytic investigation of the relationship between emotional intelligence and health', journal: 'Pers Individ Dif', year: 2007, doi: '10.1016/j.paid.2006.09.003' },
  ],
}

// ══════════════════════════════════════════════════════
// Global insights — Key cross-section findings
// ══════════════════════════════════════════════════════
export const globalKeyInsights: { title: string; description: string; reference: string }[] = [
  {
    title: 'Vos émotions protègent votre cœur',
    description: 'Les personnes qui vivent plus d\'émotions positives que négatives ont un risque cardiovasculaire réduit de 20 %. L\'équilibre émotionnel n\'est pas un luxe — c\'est un pilier de la santé physique.',
    reference: 'Fredrickson & Losada, 2005, American Psychologist',
  },
  {
    title: 'Le bouclier contre l\'épuisement',
    description: 'Se sentir satisfait de sa vie et savoir gérer ses émotions sont deux des meilleurs protecteurs contre la dépression, l\'anxiété et l\'épuisement professionnel — de façon indépendante l\'un de l\'autre.',
    reference: 'Diener & Chan, 2011, Applied Psychology: Health and Well-Being',
  },
  {
    title: 'On peut vraiment changer',
    description: 'Les compétences émotionnelles se développent à tout âge. Des pratiques ciblées — méditation, travail sur soi, accompagnement — ont montré des améliorations significatives et durables en 8 à 12 semaines.',
    reference: 'Hodzic et al., 2018, Emotion Review',
  },
]

// ══════════════════════════════════════════════════════
// API
// ══════════════════════════════════════════════════════

const allReports: SectionReport[] = [bpanasReport, dienerReport, teiqReport]

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
  if (actionPlan.length === 0) actionPlan.push({ phase: 1, phaseTitle: 'Maintien des acquis', timeframe: 'En continu', actions: [{ action: 'Continuez à cultiver votre équilibre émotionnel.', why: 'Vos scores sont bons — maintenez vos pratiques actuelles.', sectionId: '' }] })

  return { strengths, weaknesses, actionPlan, globalInsights: globalKeyInsights, sectionReports }
}
