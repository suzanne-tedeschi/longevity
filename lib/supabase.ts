import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = isSupabaseConfigured
	? createBrowserClient(supabaseUrl!, supabaseAnonKey!)
	: null

type ProfileUpsertPayload = {
	id: string
	first_name?: string
	last_name?: string
	email?: string
	avatar_url?: string
	age?: number | null
	height?: number | null
	weight?: number | null
	activity_frequency?: string | null
	weekly_activities?: string[] | null
	agenda_activities?: string | null
	agenda_mode?: string | null
	agenda_sessions?: unknown[] | null
	google_calendar_wanted?: boolean | null
	google_calendar_connected?: boolean | null
	limitations?: string[] | null
	joint_pain_where?: string | null
	muscle_pain_where?: string | null
	other_limitation?: string | null
	evo_usage?: string | null
	priorities?: string[] | null
	diet?: string | null
	other_diet?: string | null
	coach_tone?: string | null
	expectations?: string | null
	onboarding_completed_at?: string | null
}

const ONBOARDING_COLUMNS = [
	'age', 'height', 'weight',
	'activity_frequency', 'weekly_activities', 'agenda_activities', 'agenda_mode',
	'agenda_sessions', 'google_calendar_wanted', 'google_calendar_connected',
	'limitations', 'joint_pain_where', 'muscle_pain_where', 'other_limitation',
	'evo_usage', 'priorities', 'diet', 'other_diet', 'coach_tone', 'expectations',
	'onboarding_completed_at',
]

/**
 * Upsert profile fields, while tolerating projects where onboarding columns
 * have not yet been added to `profiles`.
 */
export async function upsertProfile(payload: ProfileUpsertPayload) {
	if (!supabase) return null

	const { data, error } = await supabase
		.from('profiles')
		.upsert(payload, { onConflict: 'id' })
		.select()
		.single()

	if (!error) return data

	const missingOnboardingColumns = ONBOARDING_COLUMNS.some((field) =>
		error.message.includes(`profiles.${field}`)
	)
	if (!missingOnboardingColumns) {
		console.warn('Profile upsert failed:', error.message)
		return null
	}

	// Fallback: strip all onboarding fields and save only basic profile info
	const basicPayload = { id: payload.id, first_name: payload.first_name, last_name: payload.last_name, email: payload.email, avatar_url: payload.avatar_url }
	const fallback = await supabase
		.from('profiles')
		.upsert(basicPayload, { onConflict: 'id' })
		.select()
		.single()

	if (fallback.error) {
		console.warn('Profile fallback upsert failed:', fallback.error.message)
		return null
	}

	console.warn('profiles table is missing onboarding columns; falling back to basic profile fields')
	return fallback.data
}

/**
 * Create or update a profile row for the current user.
 * Safe to call multiple times (upsert).
 */
export async function ensureProfile() {
	if (!supabase) return null
	const { data: { user } } = await supabase.auth.getUser()
	if (!user) return null

	const profile = {
		id: user.id,
		first_name: user.user_metadata?.first_name
			|| user.user_metadata?.full_name?.split(' ')[0]
			|| '',
		last_name: user.user_metadata?.last_name
			|| user.user_metadata?.full_name?.split(' ').slice(1).join(' ')
			|| '',
		email: user.email || '',
		avatar_url: user.user_metadata?.avatar_url || '',
	}

	return upsertProfile(profile)
}
