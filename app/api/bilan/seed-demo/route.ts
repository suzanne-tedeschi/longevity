import { NextResponse } from 'next/server'
import { getUserFromBearerToken, getSupabaseAdmin } from '@/lib/server/supabase-admin'

/**
 * POST /api/bilan/seed-demo
 * Seeds fake bilan results for the logged-in user (nutrition, sommeil, emotionnel, stress)
 * so the dashboard looks populated for demo purposes.
 * Safe to call multiple times — uses upsert logic.
 */
export async function POST(request: Request) {
  try {
    // Support admin bypass: accept userId in body for server-side seeding
    let userId: string
    const body = await request.json().catch(() => ({}))
    
    if (body.userId) {
      // Direct admin seeding with known user ID
      userId = body.userId
    } else {
      const user = await getUserFromBearerToken(request.headers.get('authorization'))
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      userId = user.id
    }

    const admin = getSupabaseAdmin()
    const now = new Date().toISOString()

    // ── Nutrition: 72% ──
    const nutritionResult = {
      user_id: userId,
      bilan_type: 'nutrition',
      scores: {
        'ref-1': 2, 'ref-2': 1, 'ref-3': 2, 'ref-4': 3, 'ref-5': 2,
        'hab-1': 2, 'hab-2': 3, 'hab-3': 2, 'hab-4': 2, 'hab-5': 1,
        'hab-6': 3, 'hab-7': 2, 'hab-8': 2, 'hab-9': 3, 'hab-10': 2,
        'prot-1': 2, 'prot-2': 3, 'prot-3': 2, 'prot-4': 2,
        'dig-1': 2, 'dig-2': 1, 'dig-3': 2, 'dig-4': 3, 'dig-5': 2,
      },
      global_score: 72,
      global_points: 51,
      max_points: 71,
      sub_scores: {
        alimentaire: { score: 34, max: 45, pct: 76 },
        digestif: { score: 17, max: 26, pct: 65 },
      },
      section_results: [
        { sectionId: 'reflexes', title: 'Réflexes alimentaires', score: 10, maxScore: 15, pct: 67 },
        { sectionId: 'habitudes', title: 'Habitudes quotidiennes', score: 22, maxScore: 30, pct: 73 },
        { sectionId: 'proteines', title: 'Apport protéique', score: 9, maxScore: 12, pct: 75 },
        { sectionId: 'digestif', title: 'Confort digestif', score: 10, maxScore: 14, pct: 71, isDigestif: true },
      ],
      report: {
        topActions: [
          { priority: 1, action: 'Augmenter les protéines au petit-déjeuner', sectionTitle: 'Apport protéique', level: 'mid' },
          { priority: 2, action: 'Réduire les sucres rapides après 16h', sectionTitle: 'Habitudes quotidiennes', level: 'mid' },
          { priority: 3, action: 'Ajouter des fibres à chaque repas', sectionTitle: 'Réflexes alimentaires', level: 'mid' },
        ],
        sectionReports: [
          {
            sectionId: 'reflexes', title: 'Réflexes alimentaires', pct: 67, score: 10, maxScore: 15,
            level: 'mid', recommendationTitle: 'Consolider vos bases', context: 'Vos réflexes alimentaires sont corrects mais perfectibles.',
            recommendationText: 'Intégrez davantage de légumes crus et de fibres. Visez 5 portions de fruits/légumes par jour.',
            triggeredInsights: [], references: [],
          },
          {
            sectionId: 'habitudes', title: 'Habitudes quotidiennes', pct: 73, score: 22, maxScore: 30,
            level: 'mid', recommendationTitle: 'Bonne régularité', context: 'Votre rythme alimentaire est globalement sain.',
            recommendationText: 'Maintenez vos 3 repas structurés. Limitez les grignotages après 16h.',
            triggeredInsights: [], references: [],
          },
        ],
        globalInsights: [
          { title: 'Protéines & longévité', description: 'Un apport protéique suffisant (1.2-1.6g/kg/j) est essentiel pour prévenir la sarcopénie.', reference: 'Deutz et al., Clinical Nutrition, 2014' },
        ],
      },
      completed_at: now,
    }

    // ── Sommeil: 68% ──
    const sommeilResult = {
      user_id: userId,
      bilan_type: 'sommeil',
      scores: {
        'psqi-1': 1, 'psqi-2': 2, 'psqi-3': 1, 'psqi-4': 2, 'psqi-5': 1, 'psqi-6': 2, 'psqi-7': 1,
        'shi-1': 2, 'shi-2': 1, 'shi-3': 2, 'shi-4': 1, 'shi-5': 2, 'shi-6': 1,
        'chron-1': 1, 'chron-2': 2, 'chron-3': 1,
      },
      global_score: 68,
      global_points: 22,
      max_points: 33,
      sub_scores: {
        qualite: { score: 10, max: 14, pct: 71 },
        hygiene: { score: 8, max: 12, pct: 67 },
        chronotype: { score: 4, max: 7, pct: 57 },
      },
      section_results: [
        { sectionId: 'qualite-sommeil', title: 'Qualité du sommeil (PSQI)', score: 10, maxScore: 14, pct: 71 },
        { sectionId: 'hygiene-sommeil', title: 'Hygiène du sommeil (SHI)', score: 8, maxScore: 12, pct: 67 },
        { sectionId: 'chronotype', title: 'Chronotype & rythme', score: 4, maxScore: 7, pct: 57 },
      ],
      report: {
        topActions: [
          { priority: 1, action: 'Couper les écrans 1h avant le coucher', sectionTitle: 'Hygiène du sommeil', level: 'low' },
          { priority: 2, action: 'Fixer une heure de coucher régulière (±30 min)', sectionTitle: 'Qualité du sommeil', level: 'mid' },
          { priority: 3, action: 'Baisser la température de la chambre à 18-19°C', sectionTitle: 'Hygiène du sommeil', level: 'mid' },
        ],
        sectionReports: [
          {
            sectionId: 'qualite-sommeil', title: 'Qualité du sommeil', pct: 71, score: 10, maxScore: 14,
            level: 'mid', recommendationTitle: 'Sommeil correct mais améliorable',
            context: 'Votre score PSQI indique une qualité de sommeil acceptable mais avec des marges de progression.',
            recommendationText: 'Focalisez-vous sur la régularité des horaires et la réduction des réveils nocturnes.',
            triggeredInsights: [], references: [{ authors: 'Buysse DJ et al.', title: 'The Pittsburgh Sleep Quality Index', journal: 'Psychiatry Research', year: 1989 }],
          },
        ],
        globalInsights: [
          { title: 'Sommeil & récupération musculaire', description: 'Une qualité de sommeil insuffisante réduit de 30% la synthèse protéique musculaire.', reference: 'Dattilo et al., Medical Hypotheses, 2011' },
        ],
      },
      completed_at: now,
    }

    // ── Émotionnel: 74% ──
    const emotionnelResult = {
      user_id: userId,
      bilan_type: 'emotionnel',
      scores: {
        'panas-1': 3, 'panas-2': 2, 'panas-3': 4, 'panas-4': 1, 'panas-5': 3,
        'panas-6': 2, 'panas-7': 4, 'panas-8': 1, 'panas-9': 3, 'panas-10': 2,
        'diener-1': 5, 'diener-2': 4, 'diener-3': 5, 'diener-4': 4, 'diener-5': 5,
        'teiq-1': 3, 'teiq-2': 4, 'teiq-3': 3, 'teiq-4': 4, 'teiq-5': 3,
        'ghq-1': 1, 'ghq-2': 0, 'ghq-3': 1, 'ghq-4': 0,
      },
      global_score: 74,
      global_points: 72,
      max_points: 97,
      sub_scores: {
        'affects-positifs': { score: 16, max: 20, pct: 80 },
        'affects-negatifs': { score: 6, max: 20, pct: 70 },
        'satisfaction-vie': { score: 23, max: 30, pct: 77 },
        'intelligence-emotionnelle': { score: 17, max: 20, pct: 85 },
        'sante-psychologique': { score: 2, max: 12, pct: 83 },
      },
      section_results: [
        { sectionId: 'affects-positifs', title: 'Affects positifs (B-PANAS)', score: 16, maxScore: 20, pct: 80 },
        { sectionId: 'affects-negatifs', title: 'Affects négatifs (B-PANAS)', score: 6, maxScore: 20, pct: 70 },
        { sectionId: 'satisfaction-vie', title: 'Satisfaction de vie (Diener)', score: 23, maxScore: 30, pct: 77 },
        { sectionId: 'intelligence-emotionnelle', title: 'Intelligence émotionnelle (TEIQue)', score: 17, maxScore: 20, pct: 85 },
        { sectionId: 'sante-psychologique', title: 'Santé psychologique (GHQ-12)', score: 2, maxScore: 12, pct: 83 },
      ],
      report: {
        topActions: [
          { priority: 1, action: 'Pratiquer 5 min de gratitude quotidienne', sectionTitle: 'Affects positifs', level: 'high' },
          { priority: 2, action: 'Identifier vos déclencheurs émotionnels négatifs', sectionTitle: 'Affects négatifs', level: 'mid' },
        ],
        sectionReports: [],
        globalInsights: [
          { title: 'Émotions positives & longévité', description: 'Les émotions positives régulières sont associées à une espérance de vie allongée de 7-10 ans.', reference: 'Diener & Chan, Applied Psychology, 2011' },
        ],
      },
      completed_at: now,
    }

    // ── Stress: 65% ──
    const stressResult = {
      user_id: userId,
      bilan_type: 'stress',
      scores: {
        'pss-1': 2, 'pss-2': 1, 'pss-3': 2, 'pss-4': 3, 'pss-5': 2,
        'pss-6': 1, 'pss-7': 2, 'pss-8': 3, 'pss-9': 2, 'pss-10': 1,
        'cdrisc-1': 3, 'cdrisc-2': 4, 'cdrisc-3': 3, 'cdrisc-4': 3, 'cdrisc-5': 4,
      },
      global_score: 65,
      global_points: 36,
      max_points: 55,
      sub_scores: {
        'stress-percu': { score: 19, max: 30, pct: 63 },
        'resilience': { score: 17, max: 25, pct: 68 },
      },
      section_results: [
        { sectionId: 'stress-percu', title: 'Stress perçu (PSS)', score: 19, maxScore: 30, pct: 63 },
        { sectionId: 'resilience', title: 'Résilience (CD-RISC)', score: 17, maxScore: 25, pct: 68 },
      ],
      report: {
        topActions: [
          { priority: 1, action: 'Intégrer 10 min de respiration/méditation par jour', sectionTitle: 'Stress perçu', level: 'mid' },
          { priority: 2, action: 'Pratiquer une activité physique régulière (effet anxiolytique)', sectionTitle: 'Résilience', level: 'mid' },
        ],
        sectionReports: [],
        globalInsights: [
          { title: 'Stress chronique & vieillissement', description: 'Le stress chronique accélère le raccourcissement des télomères, marqueur du vieillissement cellulaire.', reference: 'Epel et al., PNAS, 2004' },
        ],
      },
      completed_at: now,
    }

    const allResults = [nutritionResult, sommeilResult, emotionnelResult, stressResult]
    const inserted = []

    for (const result of allResults) {
      // Check if already exists
      const { data: existing } = await admin
        .from('bilan_results')
        .select('id')
        .eq('user_id', userId)
        .eq('bilan_type', result.bilan_type)
        .order('completed_at', { ascending: false })
        .limit(1)
        .single()

      if (existing?.id) {
        const { data, error } = await admin
          .from('bilan_results')
          .update(result)
          .eq('id', existing.id)
          .select()
          .single()
        if (error) throw error
        inserted.push(data)
      } else {
        const { data, error } = await admin
          .from('bilan_results')
          .insert(result)
          .select()
          .single()
        if (error) throw error
        inserted.push(data)
      }
    }

    return NextResponse.json({
      ok: true,
      message: `Seeded ${inserted.length} bilan results for demo`,
      bilanTypes: inserted.map((r: { bilan_type: string }) => r.bilan_type),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Seed failed'
    console.error('[bilan/seed-demo]', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
