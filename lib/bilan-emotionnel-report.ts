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
    'Le PANAS (Positive and Negative Affect Schedule) est l\'un des outils les plus utilisés en psychologie pour mesurer les affects. Un déséquilibre entre affects positifs (PA) et négatifs (NA) est associé à un risque accru de troubles anxio-dépressifs, tandis qu\'un ratio PA/NA élevé prédit le bien-être subjectif et la longévité.',
  recommendations: [
    { minPct: 80, level: 'excellent', title: 'Équilibre émotionnel remarquable', text: 'Votre profil émotionnel est très favorable avec un bon ratio affects positifs / négatifs. Continuez à cultiver les activités qui vous procurent de la joie et de l\'engagement.' },
    { minPct: 60, level: 'bon', title: 'Bon équilibre émotionnel', text: 'Votre balance émotionnelle est globalement positive. Identifiez les situations qui génèrent des affects négatifs récurrents pour mieux les anticiper.' },
    { minPct: 40, level: 'moyen', title: 'Équilibre émotionnel modéré', text: 'Vos affects négatifs sont significatifs. Des techniques de régulation émotionnelle (réévaluation cognitive, pleine conscience) peuvent améliorer votre bien-être.' },
    { minPct: 0, level: 'faible', title: 'Déséquilibre émotionnel important', text: 'Les affects négatifs prédominent. Un accompagnement psychothérapeutique, notamment les approches cognitivo-comportementales (TCC), est recommandé.' },
  ],
  insights: [
    { questionId: 'emo-2', threshold: 1, insight: 'Un niveau élevé de perturbation émotionnelle peut indiquer un stress chronique ou une anxiété sous-jacente.', recommendation: 'Pratiquez la cohérence cardiaque (5 min, 3×/jour) pour réguler votre système nerveux autonome.' },
    { questionId: 'emo-7', threshold: 1, insight: 'La peur fréquente est associée à l\'anxiété généralisée et peut limiter votre capacité d\'action.', recommendation: 'L\'exposition progressive et la relaxation musculaire progressive sont des techniques validées pour réduire les peurs.' },
    { questionId: 'emo-11', threshold: 1, insight: 'L\'irritabilité chronique peut être un signe de surcharge cognitive ou de manque de sommeil.', recommendation: 'Assurez-vous d\'un sommeil suffisant (7-9h) et pratiquez des activités de décompression régulières.' },
    { questionId: 'emo-15', threshold: 1, insight: 'La nervosité persistante active l\'axe HPA (hypothalamo-hypophyso-surrénalien) et augmente le cortisol.', recommendation: 'La méditation de pleine conscience (MBSR) a montré une réduction significative du cortisol en 8 semaines.' },
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
    'L\'Échelle de Satisfaction de Vie de Diener (SWLS) mesure le jugement cognitif global que la personne porte sur sa propre vie. Contrairement aux affects, la satisfaction de vie reflète une évaluation stable et réfléchie. Elle est un prédicteur robuste de la santé physique, de la longévité et de la qualité des relations sociales.',
  recommendations: [
    { minPct: 80, level: 'excellent', title: 'Satisfaction de vie élevée', text: 'Vous êtes très satisfait(e) de votre vie. Ce niveau de satisfaction est associé à une meilleure santé cardiovasculaire et une plus grande longévité.' },
    { minPct: 60, level: 'bon', title: 'Bonne satisfaction de vie', text: 'Vous êtes globalement satisfait(e) avec quelques domaines d\'amélioration. Identifiez vos valeurs fondamentales et alignez vos actions quotidiennes sur celles-ci.' },
    { minPct: 40, level: 'moyen', title: 'Satisfaction de vie modérée', text: 'Des insatisfactions notables existent dans certains domaines de votre vie. Un travail sur la clarification de vos objectifs et la gratitude peut aider.' },
    { minPct: 0, level: 'faible', title: 'Insatisfaction importante', text: 'Votre satisfaction de vie est faible. Cela peut refléter un décalage entre vos aspirations et votre réalité. Un accompagnement en psychologie positive est recommandé.' },
  ],
  insights: [
    { questionId: 'sat-1', threshold: 2, insight: 'Un écart important entre vos idéaux et votre réalité peut générer de la frustration chronique.', recommendation: 'Travaillez à distinguer les idéaux réalistes des attentes perfectionnistes. La thérapie ACT (Acceptance & Commitment) est efficace pour cela.' },
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
    'Le TEIQue (Trait Emotional Intelligence Questionnaire) évalue l\'intelligence émotionnelle trait, c\'est-à-dire la capacité stable à percevoir, comprendre, utiliser et réguler ses émotions. L\'IE est associée à une meilleure santé mentale, des relations interpersonnelles plus satisfaisantes, un leadership plus efficace et une plus grande résilience face au stress.',
  recommendations: [
    { minPct: 80, level: 'excellent', title: 'Intelligence émotionnelle très développée', text: 'Vous avez une excellente capacité à comprendre et gérer vos émotions ainsi que celles des autres. C\'est un atout majeur pour votre bien-être et vos relations.' },
    { minPct: 60, level: 'bon', title: 'Bonne intelligence émotionnelle', text: 'Votre IE est globalement bonne. Certaines dimensions (maitrise de soi, sociabilité) peuvent encore être renforcées par des exercices ciblés.' },
    { minPct: 40, level: 'moyen', title: 'Intelligence émotionnelle modérée', text: 'Des lacunes dans certaines dimensions de l\'IE peuvent générer des difficultés relationnelles ou une gestion émotionnelle insuffisante.' },
    { minPct: 0, level: 'faible', title: 'Intelligence émotionnelle à développer', text: 'Des compétences émotionnelles clés nécessitent un développement. Un coaching en intelligence émotionnelle ou un programme de développement personnel est recommandé.' },
  ],
  insights: [
    { questionId: 'teiq-4', threshold: 2, insight: 'Des difficultés de régulation émotionnelle sont associées à l\'anxiété, la dépression et les conflits interpersonnels.', recommendation: 'Pratiquez la technique STOP (Stop, Take a breath, Observe, Proceed) lors des moments de tension émotionnelle.' },
    { questionId: 'teiq-8', threshold: 2, insight: 'L\'alexithymie (difficulté à identifier ses émotions) est un facteur de risque pour les troubles psychosomatiques.', recommendation: 'Utilisez un « roue des émotions » quotidiennement pour améliorer votre vocabulaire émotionnel.' },
    { questionId: 'teiq-10', threshold: 2, insight: 'La difficulté à s\'affirmer peut mener à l\'accumulation de frustrations et au burn-out.', recommendation: 'Entraînez-vous à la communication assertive : exprimez vos besoins avec la formule « Quand... je ressens... j\'ai besoin... ».' },
    { questionId: 'teiq-18', threshold: 2, insight: 'Un manque de motivation persistant peut signaler un épuisement émotionnel ou un début de burn-out.', recommendation: 'Identifiez vos valeurs profondes et reconnectez vos actions quotidiennes à ce qui fait sens pour vous.' },
    { questionId: 'teiq-25', threshold: 2, insight: 'La tendance à abandonner peut être liée à un faible sentiment d\'auto-efficacité.', recommendation: 'Fixez-vous des micro-objectifs atteignables pour reconstruire progressivement votre confiance.' },
    { questionId: 'teiq-28', threshold: 2, insight: 'Des difficultés relationnelles avec les proches sont un facteur de risque majeur pour la dépression.', recommendation: 'Explorez les thérapies interpersonnelles (TIP) qui ciblent spécifiquement la qualité des relations proches.' },
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
export const globalKeyInsights = [
  'L\'équilibre émotionnel est un pilier fondamental de la longévité. Les études montrent qu\'un ratio PA/NA positif est associé à une réduction de 20% du risque cardiovasculaire.',
  'La satisfaction de vie et l\'intelligence émotionnelle sont des facteurs protecteurs indépendants contre la dépression, l\'anxiété et le burn-out.',
  'Les compétences émotionnelles se développent tout au long de la vie. Des interventions ciblées (pleine conscience, TCC, coaching) ont montré des améliorations significatives en 8 à 12 semaines.',
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
