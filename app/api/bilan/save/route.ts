import { NextResponse } from 'next/server'
import { getUserFromBearerToken, getSupabaseAdmin } from '@/lib/server/supabase-admin'

export async function POST(request: Request) {
  try {
    const user = await getUserFromBearerToken(request.headers.get('authorization'))
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      bilanType,
      scores,
      globalScore,
      globalPoints,
      maxPoints,
      subScores,
      sectionResults,
      report,
    } = body

    if (!bilanType || !scores || globalScore === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const admin = getSupabaseAdmin()

    // Upsert: keep the latest result per user+bilan_type
    // First check if user already has a result for this bilan
    const { data: existing } = await admin
      .from('bilan_results')
      .select('id')
      .eq('user_id', user.id)
      .eq('bilan_type', bilanType)
      .order('completed_at', { ascending: false })
      .limit(1)
      .single()

    const resultData = {
      user_id: user.id,
      bilan_type: bilanType,
      scores,
      global_score: globalScore,
      global_points: globalPoints ?? 0,
      max_points: maxPoints ?? 0,
      sub_scores: subScores ?? {},
      section_results: sectionResults ?? [],
      report: report ?? {},
      completed_at: new Date().toISOString(),
    }

    let savedResult
    if (existing?.id) {
      // Update the existing record
      const { data, error } = await admin
        .from('bilan_results')
        .update(resultData)
        .eq('id', existing.id)
        .select()
        .single()
      if (error) throw error
      savedResult = data
    } else {
      // Insert new
      const { data, error } = await admin
        .from('bilan_results')
        .insert(resultData)
        .select()
        .single()
      if (error) throw error
      savedResult = data
    }

    return NextResponse.json({ ok: true, result: savedResult })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Save failed'
    console.error('[bilan/save]', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
