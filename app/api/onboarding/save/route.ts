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
      first_name,
      age,
      height,
      weight,
      activity_frequency,
      weekly_activities,
      agenda_sessions,
      agenda_mode,
      google_calendar_wanted,
      google_calendar_connected,
      limitations,
      joint_pain_where,
      muscle_pain_where,
      other_limitation,
      evo_usage,
      priorities,
      diet,
      other_diet,
      coach_tone,
      expectations,
      onboarding_data,
      onboarding_completed_at,
    } = body

    console.log('[onboarding/save] Saving profile with:', {
      user_id: user.id,
      first_name,
      activity_frequency,
      diet,
      limitations_count: Array.isArray(limitations) ? limitations.length : 0,
    })

    const admin = getSupabaseAdmin()

    const { data, error } = await admin
      .from('profiles')
      .upsert(
        {
          id: user.id,
          first_name: first_name || '',
          age: age ? Number(age) : null,
          height: height ? Number(height) : null,
          weight: weight ? Number(weight) : null,
          activity_frequency: activity_frequency || '',
          weekly_activities: Array.isArray(weekly_activities) ? weekly_activities : [],
          agenda_sessions: Array.isArray(agenda_sessions) ? agenda_sessions : [],
          agenda_mode: agenda_mode || '',
          google_calendar_wanted: google_calendar_wanted !== null ? Boolean(google_calendar_wanted) : null,
          google_calendar_connected: Boolean(google_calendar_connected),
          limitations: Array.isArray(limitations) ? limitations : [],
          joint_pain_where: joint_pain_where || '',
          muscle_pain_where: muscle_pain_where || '',
          other_limitation: other_limitation || '',
          evo_usage: evo_usage || '',
          priorities: Array.isArray(priorities) ? priorities : [],
          diet: diet || '',
          other_diet: other_diet || '',
          coach_tone: coach_tone || '',
          expectations: expectations || '',
          onboarding_data: onboarding_data || {},
          onboarding_completed_at: onboarding_completed_at || new Date().toISOString(),
        },
        { onConflict: 'id' }
      )
      .select()
      .single()

    if (error) {
      console.error('[onboarding/save] Upsert failed:', error)
      throw error
    }

    console.log('[onboarding/save] Success! Saved profile:', {
      id: data?.id,
      first_name: data?.first_name,
      diet: data?.diet,
      activity_frequency: data?.activity_frequency,
    })

    return NextResponse.json({ ok: true, profile: data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Save failed'
    console.error('[onboarding/save] Error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
