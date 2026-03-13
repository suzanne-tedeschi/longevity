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
	activity_frequency?: string
	weekly_activities?: string[]
	agenda_sessions?: Record<string, unknown>[]
	agenda_mode?: string
	google_calendar_wanted?: boolean | null
	google_calendar_connected?: boolean
	limitations?: string[]
	joint_pain_where?: string
	muscle_pain_where?: string
	other_limitation?: string
	evo_usage?: string
	priorities?: string[]
	diet?: string
	other_diet?: string
	coach_tone?: string
	expectations?: string
	onboarding_data?: Record<string, unknown>
	onboarding_completed_at?: string | null
}

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

	const onboardingFields = [
		'age', 'height', 'weight', 'activity_frequency', 'weekly_activities', 'agenda_sessions', 'agenda_mode',
		'google_calendar_wanted', 'google_calendar_connected', 'limitations', 'joint_pain_where', 'muscle_pain_where',
		'other_limitation', 'evo_usage', 'priorities', 'diet', 'other_diet', 'coach_tone', 'expectations',
		'onboarding_data', 'onboarding_completed_at'
	]
	const missingOnboardingColumns = onboardingFields.some((field) =>
		error.message.includes(`profiles.${field}`)
	)
	if (!missingOnboardingColumns) {
		console.warn('Profile upsert failed:', error.message)
		return null
	}

	const {
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
		...basicPayload
	} = payload
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
