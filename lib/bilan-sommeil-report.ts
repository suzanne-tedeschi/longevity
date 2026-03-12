// ──────────────────────────────────────────────────────
// Bilan Sommeil — Scientific Report Engine
// Basé sur le PSQI, le SHI et la littérature scientifique
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
// Troubles du sommeil (PSQI)
// ══════════════════════════════════════════════════════
const troublesSommeilReport: SectionReport = {
  sectionId: 'troubles-sommeil',
  context:
    'Le Pittsburgh Sleep Quality Index (PSQI) est l\'outil de référence mondiale pour évaluer la qualité du sommeil. Les troubles du sommeil (difficulté d\'endormissement, réveils nocturnes, apnées) touchent 30-40 % des adultes et sont associés à un risque accru de maladies cardiovasculaires (+45 %), de diabète de type 2 (+28 %), de dépression et de déclin cognitif accéléré (Cappuccio et al., 2010).',
  recommendations: [
    { minPct: 80, level: 'excellent', title: 'Sommeil peu perturbé', text: 'Vos nuits sont très peu perturbées. C\'est un excellent indicateur de santé — un sommeil continu permet de compléter les cycles de sommeil profond et REM, essentiels à la consolidation de la mémoire et à la réparation cellulaire.' },
    { minPct: 60, level: 'bon', title: 'Perturbations modérées', text: 'Quelques perturbations nocturnes existent mais restent gérables. Surveillez les patterns récurrents (même heure de réveil, même trigger) pour intervenir de manière ciblée.' },
    { minPct: 40, level: 'moyen', title: 'Perturbations significatives', text: 'Vos nuits sont régulièrement perturbées, ce qui compromet la qualité de votre sommeil profond. Cela impacte directement votre système immunitaire, votre métabolisme et vos capacités cognitives le lendemain.' },
    { minPct: 0, level: 'faible', title: 'Troubles importants', text: 'Vos troubles du sommeil sont sévères et nécessitent une prise en charge. Un sommeil fragmenté chronique augmente le cortisol, l\'inflammation systémique et le risque de maladies chroniques. Consultez un spécialiste du sommeil.' },
  ],
  insights: [
    { questionId: 'som-1', threshold: 1, insight: 'Vous mettez régulièrement plus de 30 minutes à vous endormir — c\'est un signe d\'insomnie d\'endormissement.', recommendation: 'La technique de restriction du sommeil (TCC-I) est plus efficace que les somnifères à long terme. Concrètement : ne vous couchez que quand vous avez sommeil, et levez-vous à la même heure chaque matin. En 2-3 semaines, votre horloge biologique se recalera.' },
    { questionId: 'som-2', threshold: 1, insight: 'Vos réveils nocturnes fragmentent vos cycles de sommeil, réduisant le temps passé en sommeil profond (stade N3) essentiel à la réparation tissulaire.', recommendation: 'Maintenez votre chambre entre 16-19°C, bloquez toute source de lumière (même la LED de votre chargeur), et pratiquez la cohérence cardiaque (5 min) si vous vous réveillez : cela réactive le parasympathique.' },
    { questionId: 'som-4', threshold: 1, insight: 'Des difficultés respiratoires nocturnes peuvent indiquer un syndrome d\'apnées obstructives du sommeil (SAOS), qui touche 5-10 % de la population et est très sous-diagnostiqué.', recommendation: 'Le SAOS non traité multiplie par 3 le risque cardiovasculaire. Parlez-en à votre médecin pour un dépistage (polygraphie ventilatoire). En attendant : dormez sur le côté, évitez l\'alcool le soir, et maintenez un poids santé.' },
    { questionId: 'som-5', threshold: 1, insight: 'Le ronflement fréquent est le principal symptôme du SAOS. Il indique une vibration des tissus pharyngés par obstruction partielle des voies aériennes.', recommendation: 'Outre le dépistage médical, certaines mesures immédiates aident : bandes nasales, oreiller anti-ronflement (surélévation 15°), exercices oropharyngés (renforcement des muscles de la gorge — efficacité prouvée, Ieto et al., 2015).' },
    { questionId: 'som-8', threshold: 1, insight: 'Les cauchemars fréquents sont souvent liés au stress, à l\'anxiété ou à un sommeil paradoxal (REM) perturbé. Ils peuvent aussi être un effet secondaire de certains médicaments (bêtabloquants, antidépresseurs).', recommendation: 'La technique de réécriture des rêves (Imagery Rehearsal Therapy) est validée scientifiquement : réécrivez le scénario du cauchemar en version positive pendant 10 min avant le coucher. Efficace en 2-4 semaines (Krakow et al., 2001).' },
    { questionId: 'som-9', threshold: 1, insight: 'Les douleurs nocturnes fragmentent profondément le sommeil en empêchant l\'accès aux stades profonds. C\'est un cercle vicieux : le manque de sommeil augmente la sensibilité à la douleur (hyperalgésie).', recommendation: 'Étirements doux de 10 min avant le coucher (yoga nidra). Un matelas adapté (fermeté moyenne, < 8 ans) et un oreiller ergonomique font une vraie différence. Si les douleurs persistent, consultez un kinésithérapeute ou rhumatologue.' },
  ],
  references: [
    { authors: 'Buysse DJ, Reynolds CF, Monk TH et al.', title: 'The Pittsburgh Sleep Quality Index: a new instrument for psychiatric practice and research', journal: 'Psychiatry Res', year: 1989, doi: '10.1016/0165-1781(89)90047-4', pmid: '2748771' },
    { authors: 'Cappuccio FP, D\'Elia L, Strazzullo P, Miller MA', title: 'Sleep duration and all-cause mortality: a systematic review and meta-analysis of prospective studies', journal: 'Sleep', year: 2010, doi: '10.1093/sleep/33.5.585', pmid: '20469800' },
    { authors: 'Walker M', title: 'Why We Sleep: Unlocking the Power of Sleep and Dreams', journal: 'Scribner', year: 2017 },
  ],
}

// ══════════════════════════════════════════════════════
// Qualité & Impact diurne
// ══════════════════════════════════════════════════════
const qualiteImpactReport: SectionReport = {
  sectionId: 'qualite-impact',
  context:
    'La qualité subjective du sommeil et son impact diurne sont des prédicteurs puissants de la santé globale. La somnolence diurne excessive (EDS) augmente le risque d\'accidents de la route de 2 à 7 fois et réduit la productivité de 30 %. Le recours aux somnifères, bien que tentant, est associé à un risque de mortalité augmenté de 4,6 fois (Kripke et al., 2012) et n\'améliore le temps de sommeil que de 11 minutes en moyenne.',
  recommendations: [
    { minPct: 80, level: 'excellent', title: 'Impact minimal', text: 'Votre sommeil est réparateur et n\'affecte pas vos journées. C\'est un marqueur de longévité — les personnes qui dorment bien vivent en moyenne 5 ans de plus.' },
    { minPct: 60, level: 'bon', title: 'Impact modéré', text: 'Quelques conséquences diurnes mais globalement gérables. Travaillez sur la régularité de vos horaires pour optimiser votre horloge circadienne.' },
    { minPct: 40, level: 'moyen', title: 'Impact notable', text: 'Votre sommeil impacte significativement votre quotidien — énergie, concentration, motivation. C\'est le signe que votre sommeil n\'est pas suffisamment réparateur (déficit de sommeil profond ou de REM).' },
    { minPct: 0, level: 'faible', title: 'Impact sévère', text: 'Votre vie quotidienne est fortement affectée par votre mauvais sommeil. La dette de sommeil cumulée peut avoir des conséquences graves : troubles de l\'attention, irritabilité, baisse immunitaire, prise de poids.' },
  ],
  insights: [
    { questionId: 'qual-1', threshold: 1, insight: 'Vous percevez votre sommeil comme étant de mauvaise qualité, ce qui est en soi un facteur de stress supplémentaire créant un cercle vicieux.', recommendation: 'La TCC de l\'insomnie (TCC-I) est recommandée en première intention par la HAS (plus efficace que les somnifères à long terme). Elle restructure les croyances dysfonctionnelles sur le sommeil et améliore la qualité perçue en 4-6 séances.' },
    { questionId: 'qual-2', threshold: 1, insight: 'Le recours régulier aux somnifères est un signal d\'alerte. Les benzodiazépines et Z-drugs altèrent l\'architecture du sommeil (réduction du sommeil profond et REM) et créent une dépendance.', recommendation: 'Discutez avec votre médecin d\'un sevrage progressif. Les alternatives validées : mélatonine LP (1-2 mg, 30 min avant coucher), magnésium bisglycinate (300 mg), L-théanine (200 mg), valériane (600 mg). La TCC-I reste la meilleure alternative.' },
    { questionId: 'qual-3', threshold: 1, insight: 'La somnolence diurne est dangereuse (risque d\'accident) et indique que votre sommeil ne remplit pas sa fonction récupératrice. Elle peut masquer une apnée du sommeil.', recommendation: 'Faites le test d\'Epworth (questionnaire rapide) pour quantifier votre somnolence. Score > 10 = consultation recommandée. En attendant : micro-siestes de 10-20 min max entre 13h et 15h (pas plus tard), et exposition à la lumière vive le matin.' },
    { questionId: 'qual-4', threshold: 1, insight: 'Le manque de motivation et d\'enthousiasme lié au sommeil est souvent confondu avec de la paresse ou de la dépression — mais c\'est un symptôme direct de la dette de sommeil.', recommendation: 'Priorisez le sommeil comme un « médicament ». Bloquez 8h de fenêtre de sommeil minimum. L\'exercice physique modéré (pas intense) en fin de journée augmente l\'adénosine et améliore à la fois le sommeil et l\'énergie du lendemain.' },
  ],
  references: [
    { authors: 'Kripke DF, Langer RD, Kline LE', title: 'Hypnotics\' association with mortality or cancer: a matched cohort study', journal: 'BMJ Open', year: 2012, doi: '10.1136/bmjopen-2012-000850', pmid: '22371848' },
    { authors: 'Morin CM, Vallières A, Guay B et al.', title: 'Cognitive behavioral therapy, singly and combined with medication, for persistent insomnia', journal: 'JAMA', year: 2009, doi: '10.1001/jama.2009.682', pmid: '19439733' },
  ],
}

// ══════════════════════════════════════════════════════
// Hygiène du sommeil (SHI)
// ══════════════════════════════════════════════════════
const hygieneSommeilReport: SectionReport = {
  sectionId: 'hygiene-sommeil',
  context:
    'L\'hygiène du sommeil regroupe les comportements et habitudes qui favorisent ou perturbent le sommeil. Le Sleep Hygiene Index (SHI) évalue ces pratiques. La bonne nouvelle : ce sont les facteurs les plus modifiables. Une amélioration de l\'hygiène du sommeil seule peut augmenter le temps de sommeil profond de 20-30 % et réduire le temps d\'endormissement de 50 % (Irish et al., 2015).',
  recommendations: [
    { minPct: 80, level: 'excellent', title: 'Hygiène exemplaire', text: 'Vos habitudes de sommeil sont excellentes. Vous avez intégré les piliers essentiels : régularité, environnement optimal, et chronobiologie cohérente. C\'est un facteur protecteur majeur pour votre longévité.' },
    { minPct: 60, level: 'bon', title: 'Bonne hygiène', text: 'Vos habitudes sont globalement bonnes avec quelques points à perfectionner. Chaque amélioration aura un impact cumulatif sur la qualité de votre sommeil.' },
    { minPct: 40, level: 'moyen', title: 'Hygiène à améliorer', text: 'Plusieurs de vos habitudes perturbent activement votre sommeil. La bonne nouvelle : ce sont les facteurs les plus faciles à corriger. En 2-3 semaines de changements ciblés, vous pouvez transformer la qualité de vos nuits.' },
    { minPct: 0, level: 'faible', title: 'Hygiène critique', text: 'Vos habitudes de sommeil sabotent activement votre repos. C\'est probablement la cause principale de vos troubles. Un recadrage complet de votre routine du soir est nécessaire — et c\'est la meilleure nouvelle, car c\'est 100% dans votre contrôle.' },
  ],
  insights: [
    { questionId: 'hyg-1', threshold: 1, insight: 'Vos horaires de coucher sont irréguliers — c\'est l\'ennemi n°1 du sommeil. Votre horloge circadienne (noyau suprachiasmatique) a besoin de régularité pour sécréter la mélatonine au bon moment.', recommendation: 'Fixez une heure de coucher à ±30 min, 7j/7 (y compris le week-end). C\'est LA mesure la plus impactante. Mettez une alarme « heure du coucher » sur votre téléphone.' },
    { questionId: 'hyg-4', threshold: 1, insight: 'La caféine a une demi-vie de 5 à 7 heures. Un café à 16h signifie qu\'à 22h, 50 % de la caféine est encore active dans votre cerveau, bloquant les récepteurs d\'adénosine (le signal de sommeil).', recommendation: 'Dernière caféine avant 14h. Attention aux sources cachées : thé noir, chocolat noir, certains sodas, médicaments (Efferalgan codéiné). Remplacez par des tisanes (camomille, passiflore — efficacité prouvée par Ngan & Conduit, 2011).' },
    { questionId: 'hyg-5', threshold: 1, insight: 'Se lever à des heures différentes empêche votre horloge biologique de se synchroniser. L\'heure de réveil est même plus importante que l\'heure de coucher pour votre rythme circadien.', recommendation: 'Réglez votre alarme à la même heure 7j/7 (oui, même le week-end). Le « grasse matinée » du dimanche crée un mini jet-lag. Si vous êtes fatigué, faites une sieste courte (20 min max) plutôt que de dormir tard le matin.' },
    { questionId: 'hyg-6', threshold: 1, insight: 'Les siestes de plus de 30 minutes activent le sommeil profond et créent de l\'inertie au réveil. Elles réduisent aussi la pression de sommeil (adénosine) nécessaire pour bien dormir le soir.', recommendation: 'Limitez vos siestes à 10-20 minutes, idéalement entre 13h et 15h. Un « coffee nap » (café + sieste de 20 min immédiatement) est la combinaison la plus efficace pour l\'énergie (Hayashi et al., 2003).' },
    { questionId: 'hyg-7', threshold: 1, insight: 'Les écrans au lit émettent de la lumière bleue (450-490 nm) qui supprime la sécrétion de mélatonine de 50 % et retarde l\'endormissement de 30 minutes en moyenne (Chang et al., 2015).', recommendation: 'Pas d\'écran 1h avant le coucher (minimum 30 min). Si impossible : mode nuit + lunettes anti-lumière bleue. Remplacez par un livre physique, de la musique, ou un podcast en mode sombre. Investissez dans un réveil classique pour ne pas avoir besoin du téléphone au lit.' },
    { questionId: 'hyg-8', threshold: 1, insight: 'Un repas lourd avant le coucher mobilise le système digestif, augmente la température corporelle et peut provoquer du reflux — trois ennemis du sommeil.', recommendation: 'Dîner léger ≥ 3h avant le coucher. Privilégiez les aliments riches en tryptophane (précurseur de sérotonine puis mélatonine) : banane, noix, dinde, lait tiède, cerises (source naturelle de mélatonine, Howatson et al., 2012).' },
    { questionId: 'hyg-10', threshold: 1, insight: 'L\'alcool est un faux ami du sommeil. Il accélère l\'endormissement mais fragmente profondément la seconde moitié de la nuit, réduit le sommeil REM de 20-30 % et provoque des réveils précoces.', recommendation: 'Zéro alcool dans les 4h précédant le coucher. Si vous consommez de l\'alcool, alternez avec de l\'eau (1 verre pour 1). L\'alcool est la première cause de sommeil non réparateur chez les 25-45 ans.' },
  ],
  references: [
    { authors: 'Irish LA, Kline CE, Gunn HE et al.', title: 'The role of sleep hygiene in promoting public health: A review of empirical evidence', journal: 'Sleep Med Rev', year: 2015, doi: '10.1016/j.smrv.2014.10.001', pmid: '25454674' },
    { authors: 'Chang AM, Aeschbach D, Duffy JF, Czeisler CA', title: 'Evening use of light-emitting eReaders negatively affects sleep, circadian timing, and next-morning alertness', journal: 'Proc Natl Acad Sci USA', year: 2015, doi: '10.1073/pnas.1418490112', pmid: '25535358' },
    { authors: 'Ebrahim IO, Shapiro CM, Williams AJ, Fenwick PB', title: 'Alcohol and sleep I: effects on normal sleep', journal: 'Alcohol Clin Exp Res', year: 2013, doi: '10.1111/acer.12006', pmid: '23347102' },
  ],
}

// ══════════════════════════════════════════════════════
// Profil complémentaire
// ══════════════════════════════════════════════════════
const profilReport: SectionReport = {
  sectionId: 'profil-complementaire',
  context:
    'Ce profil détecte des signaux d\'alerte spécifiques : hyperéveil cognitif (insomnie psychophysiologique), apnées du sommeil, syndrome des jambes sans repos et douleurs chroniques. Ces troubles spécifiques touchent 15-30 % de la population adulte et nécessitent souvent une prise en charge ciblée au-delà de l\'hygiène du sommeil standard.',
  recommendations: [
    { minPct: 80, level: 'excellent', title: 'Profil rassurant', text: 'Votre profil ne révèle pas de signaux d\'alerte particuliers. Vos nuits ne sont pas perturbées par des troubles spécifiques comme l\'apnée, le SJSR ou l\'hyperéveil chronique.' },
    { minPct: 60, level: 'bon', title: 'Quelques signaux', text: 'Quelques signaux mineurs sont présents. Surveillez leur évolution et n\'hésitez pas à en parler à votre médecin lors de votre prochain bilan.' },
    { minPct: 40, level: 'moyen', title: 'Signaux à explorer', text: 'Plusieurs signaux d\'alerte méritent une investigation. Un bilan du sommeil (polysomnographie ou polygraphie) pourrait identifier des troubles spécifiques traitables.' },
    { minPct: 0, level: 'faible', title: 'Signaux d\'alerte multiples', text: 'Votre profil révèle des signaux d\'alerte importants qui indiquent probablement un trouble du sommeil spécifique. Une consultation spécialisée est fortement recommandée.' },
  ],
  insights: [
    { questionId: 'prof-1', threshold: 1, insight: 'L\'hyperéveil cognitif au coucher est le mécanisme central de l\'insomnie chronique. Votre cortex préfrontal reste en mode « résolution de problèmes » au lieu de se désactiver.', recommendation: 'La technique du « worry journal » est validée : 20 min avant le coucher, écrivez TOUTES vos pensées/tâches sur un carnet. Cela décharge votre mémoire de travail. Puis technique de relaxation progressive de Jacobson (10 min — tension/relâchement des muscles de la tête aux pieds).' },
    { questionId: 'prof-2', threshold: 1, insight: 'Les ruminations activent le cortex cingulaire antérieur et l\'amygdale, deux régions incompatibles avec l\'endormissement. Ce cercle vicieux auto-entretient l\'insomnie.', recommendation: 'Bloquez 15 min en début de soirée pour un « worry time » structuré (pas au lit). Pratiquez la méditation body scan (10 min) au coucher pour rediriger l\'attention vers les sensations corporelles plutôt que les pensées.' },
    { questionId: 'prof-3', threshold: 1, insight: 'Les palpitations et la chaleur au lit sont des signes d\'activation du système nerveux sympathique (fight-or-flight). C\'est le contraire de l\'état parasympathique nécessaire à l\'endormissement.', recommendation: 'Cohérence cardiaque (respiration 5-5 pendant 5 min) juste avant de vous coucher. Bain chaud 90 min avant le coucher (la baisse de température corporelle qui suit favorise l\'endormissement — Haghayegh et al., 2019).' },
    { questionId: 'prof-5', threshold: 1, insight: 'Se réveiller plus fatigué qu\'au coucher est un signe classique de sommeil non réparateur — souvent lié à des micro-éveils non perçus, une apnée du sommeil ou un déficit de sommeil profond (stade N3).', recommendation: 'Surveillez vos ronflements (appli SnoreLab) et parlez à votre médecin d\'un dépistage d\'apnées. Optimisez votre environnement : obscurité totale, 17-18°C, matelas adapté (< 8 ans). Le magnésium bisglycinate (300 mg au coucher) favorise le sommeil profond.' },
    { questionId: 'prof-6', threshold: 1, insight: 'Le ronflement régulier signalé par l\'entourage est le symptôme n°1 du syndrome d\'apnées du sommeil (SAOS), qui touche 5-10 % des adultes et est diagnostiqué dans seulement 20 % des cas.', recommendation: 'Consultez votre médecin pour un dépistage (questionnaire STOP-BANG, puis polygraphie si positif). Le SAOS non traité augmente de 3× le risque cardiovasculaire. L\'appareillage PPC (pression positive continue) est très efficace et bien toléré.' },
    { questionId: 'prof-8', threshold: 1, insight: 'Les envies irrépressibles de bouger les jambes au repos sont caractéristiques du Syndrome des Jambes Sans Repos (SJSR), qui touche 5-10 % de la population et est souvent lié à un déficit en fer (ferritine < 75 µg/L).', recommendation: 'Dosez votre ferritine (seuil optimal : > 75 µg/L, et non > 15 comme souvent indiqué). Une supplémentation en fer peut résoudre le SJSR. Évitez caféine et alcool qui aggravent les symptômes. L\'exercice modéré en journée réduit la sévérité du SJSR.' },
    { questionId: 'prof-10', threshold: 1, insight: 'Les douleurs chroniques et le mauvais sommeil forment un cercle vicieux bien documenté : la douleur empêche le sommeil profond, et le manque de sommeil profond abaisse le seuil de douleur (hyperalgésie induite par la privation de sommeil).', recommendation: 'Priorisez le traitement de la douleur ET du sommeil simultanément. Étirements doux avant le coucher (10 min), matelas à fermeté adaptée, oreiller ergonomique. La méditation de pleine conscience réduit la perception de la douleur de 40 % (Zeidan et al., 2011).' },
  ],
  references: [
    { authors: 'Haghayegh S, Khoshnevis S, Smolensky MH et al.', title: 'Before-bedtime passive body heating by warm shower or bath to improve sleep: A systematic review and meta-analysis', journal: 'Sleep Med Rev', year: 2019, doi: '10.1016/j.smrv.2019.04.008', pmid: '31102877' },
    { authors: 'Allen RP, Picchietti DL, Garcia-Borreguero D et al.', title: 'Restless legs syndrome/Willis-Ekbom disease diagnostic criteria: updated International Restless Legs Syndrome Study Group (IRLSSG) consensus criteria', journal: 'Sleep Med', year: 2014, doi: '10.1016/j.sleep.2014.03.025', pmid: '25023924' },
    { authors: 'Zeidan F, Martucci KT, Kraft RA et al.', title: 'Brain mechanisms supporting the modulation of pain by mindfulness meditation', journal: 'J Neurosci', year: 2011, doi: '10.1523/JNEUROSCI.5791-10.2011', pmid: '21471375' },
  ],
}

// ══════════════════════════════════════════════════════
// Global key insights
// ══════════════════════════════════════════════════════
export const globalKeyInsights: { title: string; description: string; reference: string }[] = [
  {
    title: 'Le sommeil : pilier n°1 de la longévité',
    description: 'Dormir moins de 7 h par nuit augmente la mortalité de 12 %. Pendant le sommeil profond le système glymphatique nettoie les protéines toxiques du cerveau (bêta-amyloïde), protégeant contre Alzheimer.',
    reference: 'Cappuccio et al., 2010, Sleep',
  },
  {
    title: 'L\'horloge circadienne contrôle vos gènes',
    description: 'Plus de 40 % de vos gènes sont régulés par votre rythme circadien. La régularité des horaires de sommeil est plus prédictive de longévité que la durée elle-même (étude de 60 000 personnes).',
    reference: 'Huang et al., 2022, Sleep',
  },
  {
    title: 'Le sommeil : anti-inflammatoire naturel',
    description: 'Une seule nuit de mauvais sommeil augmente les marqueurs inflammatoires (IL-6, CRP) de 30 à 40 % et réduit l\'activité des cellules Natural Killer (immuno-surveillance anti-cancer) de 70 %.',
    reference: 'Irwin MR, 2019, Neuropsychopharmacology',
  },
]

// ══════════════════════════════════════════════════════
// API
// ══════════════════════════════════════════════════════

const allReports: SectionReport[] = [troublesSommeilReport, qualiteImpactReport, hygieneSommeilReport, profilReport]

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
// Full Report Generator — new structured format
// ══════════════════════════════════════════════════════

export interface StrengthItem {
  sectionId: string
  title: string
  pct: number
  praise: string
  science: string
  reference: string
}

export interface WeaknessItem {
  sectionId: string
  title: string
  pct: number
  level: string
  concern: string
  science: string
  reference: string
  triggeredInsights: { questionId: string; insight: string; recommendation: string }[]
}

export interface ActionPhase {
  phase: number
  phaseTitle: string
  timeframe: string
  actions: { action: string; why: string; sectionId: string }[]
}

export interface FullReport {
  strengths: StrengthItem[]
  weaknesses: WeaknessItem[]
  actionPlan: ActionPhase[]
  globalInsights: { title: string; description: string; reference: string }[]
  // backward compat
  sectionReports: Record<string, unknown>[]
}

/**
 * Generate the structured narrative report the user sees.
 * Separates strengths (≥ 60 %) from weaknesses (< 60 %),
 * then builds a phased action plan sorted by urgency.
 */
export function generateFullReport(
  sectionResults: { sectionId: string; pct: number; score: number; maxScore: number; title: string }[],
  scores: Record<string, number>,
): FullReport {
  const strengths: StrengthItem[] = []
  const weaknesses: WeaknessItem[] = []

  // Also build backward-compat sectionReports
  const sectionReports = sectionResults.map(r => {
    const report = getSectionReport(r.sectionId)
    if (!report) return null
    const rec = getSectionRecommendation(report, r.pct)
    const triggered = getTriggeredInsights(report, scores)
    return {
      sectionId: r.sectionId, title: r.title, pct: r.pct, score: r.score, maxScore: r.maxScore,
      level: rec.level, recommendationTitle: rec.title, recommendationText: rec.text, context: report.context,
      triggeredInsights: triggered.map(t => ({ questionId: t.questionId, insight: t.insight, recommendation: t.recommendation })),
      references: report.references,
    }
  }).filter(Boolean) as Record<string, unknown>[]

  for (const r of sectionResults) {
    const report = getSectionReport(r.sectionId)
    if (!report) continue
    const rec = getSectionRecommendation(report, r.pct)
    const triggered = getTriggeredInsights(report, scores)

    if (r.pct >= 60) {
      strengths.push({
        sectionId: r.sectionId,
        title: r.title,
        pct: r.pct,
        praise: rec.text,
        science: report.context.split('.').slice(0, 2).join('.') + '.',
        reference: report.references[0]
          ? `${report.references[0].authors.split(',')[0]} et al., ${report.references[0].year}`
          : '',
      })
    } else {
      weaknesses.push({
        sectionId: r.sectionId,
        title: r.title,
        pct: r.pct,
        level: rec.level,
        concern: rec.text,
        science: report.context,
        reference: report.references[0]
          ? `${report.references[0].authors.split(',')[0]} et al., ${report.references[0].year}`
          : '',
        triggeredInsights: triggered.map(t => ({
          questionId: t.questionId,
          insight: t.insight,
          recommendation: t.recommendation,
        })),
      })
    }
  }

  // Sort weaknesses by severity (lowest pct first)
  weaknesses.sort((a, b) => a.pct - b.pct)

  // Build phased action plan from weaknesses
  const actionPlan: ActionPhase[] = []

  // Phase 1: Immediate — hygiene fixes (most impactful, easiest)
  const phase1Actions: { action: string; why: string; sectionId: string }[] = []
  // Phase 2: Short-term — deeper behavioral changes
  const phase2Actions: { action: string; why: string; sectionId: string }[] = []
  // Phase 3: Medical / specialist follow-up
  const phase3Actions: { action: string; why: string; sectionId: string }[] = []

  for (const w of weaknesses) {
    for (const ti of w.triggeredInsights) {
      const recText = ti.recommendation
      // Route to correct phase
      if (w.sectionId === 'hygiene-sommeil') {
        phase1Actions.push({ action: recText.split('.').slice(0, 2).join('.') + '.', why: ti.insight, sectionId: w.sectionId })
      } else if (w.sectionId === 'profil-complementaire' && (w.pct < 40 || recText.toLowerCase().includes('consult'))) {
        phase3Actions.push({ action: recText.split('.').slice(0, 2).join('.') + '.', why: ti.insight, sectionId: w.sectionId })
      } else {
        phase2Actions.push({ action: recText.split('.').slice(0, 2).join('.') + '.', why: ti.insight, sectionId: w.sectionId })
      }
    }
    // If no triggered insights, use section recommendation
    if (w.triggeredInsights.length === 0) {
      const target = w.pct < 40 ? phase2Actions : phase1Actions
      target.push({ action: w.concern.split('.').slice(0, 2).join('.') + '.', why: `Score ${w.title} : ${w.pct}%`, sectionId: w.sectionId })
    }
  }

  if (phase1Actions.length > 0) {
    actionPlan.push({
      phase: 1,
      phaseTitle: 'Actions immédiates',
      timeframe: 'Semaines 1-2',
      actions: phase1Actions.slice(0, 5), // cap at 5
    })
  }
  if (phase2Actions.length > 0) {
    actionPlan.push({
      phase: 2,
      phaseTitle: 'Consolidation',
      timeframe: 'Semaines 3-6',
      actions: phase2Actions.slice(0, 5),
    })
  }
  if (phase3Actions.length > 0) {
    actionPlan.push({
      phase: 3,
      phaseTitle: 'Suivi médical',
      timeframe: 'À planifier',
      actions: phase3Actions.slice(0, 3),
    })
  }

  // If nothing is a weakness, give a maintenance plan
  if (actionPlan.length === 0) {
    actionPlan.push({
      phase: 1,
      phaseTitle: 'Maintien des acquis',
      timeframe: 'En continu',
      actions: [
        { action: 'Maintenez une heure de coucher régulière à ±30 min, 7j/7.', why: 'La régularité est le premier facteur de qualité du sommeil.', sectionId: 'hygiene-sommeil' },
        { action: 'Continuez à limiter les écrans 30 min avant le coucher.', why: 'La lumière bleue supprime la mélatonine.', sectionId: 'hygiene-sommeil' },
      ],
    })
  }

  return {
    strengths,
    weaknesses,
    actionPlan,
    globalInsights: globalKeyInsights,
    sectionReports,
  }
}
