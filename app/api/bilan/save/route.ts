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
      answers,
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

    // Always INSERT a new row — keeps full history for progression tracking.
    // The results endpoint returns the latest per bilan_type + delta vs previous.
    const resultData = {
      user_id: user.id,
      bilan_type: bilanType,
      scores,
      answers: answers ?? {},
      global_score: globalScore,
      global_points: globalPoints ?? 0,
      max_points: maxPoints ?? 0,
      sub_scores: subScores ?? {},
      section_results: sectionResults ?? [],
      report: report ?? {},
      completed_at: new Date().toISOString(),
    }

    const { data: savedResult, error } = await admin
      .from('bilan_results')
      .insert(resultData)
      .select()
      .single()
    if (error) throw error

    return NextResponse.json({ ok: true, result: savedResult })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Save failed'
    console.error('[bilan/save]', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
