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

	console.log('[upsertProfile] Payload received:', {
		activity_frequency: payload.activity_frequency,
		weekly_activities: payload.weekly_activities,
		diet: payload.diet,
		priorities: payload.priorities,
		coach_tone: payload.coach_tone,
		expectations: payload.expectations,
	})

	// Clean up undefined values - convert to null or empty strings
	const cleanedPayload = Object.fromEntries(
		Object.entries(payload).map(([key, value]) => [
			key,
			value === undefined ? null : value,
		])
	) as ProfileUpsertPayload

	const { data, error } = await supabase
		.from('profiles')
		.upsert(cleanedPayload, { onConflict: 'id' })
		.select()
		.single()

	if (!error) {
		console.log('[upsertProfile] Success! Data saved:', {
			activity_frequency: data?.activity_frequency,
			diet: data?.diet,
		})
		return data
	}

	// Full error log for debugging - log full details to help diagnose the issue
	console.error('[upsertProfile failed]', {
		message: error.message,
		code: error.code,
		details: error.details,
		hint: error.hint,
		fullError: error,
	})

	// Only use fallback if it's specifically a "column does not exist" error
	// Check for PostgreSQL error code 42703 (column does not exist) 
	// or the error message explicitly mentions undefined column
	const isColumnMissingError =
		error.code === '42703' ||
		error.message?.includes('column') && error.message?.includes('does not exist')

	if (!isColumnMissingError) {
		// This is some other error (RLS, validation, network, etc.) - don't fallback
		console.error('[upsertProfile prevented fallback] Not a missing column error, aborting.')
		return null
	}

	console.warn('[upsertProfile fallback] Detected missing onboarding columns, trying basic fields only')

	// Fallback: try to save ALL fields (in case it's just a transient error)
	// The cleaned payload already has all the fields we want to save
	const fallback = await supabase
		.from('profiles')
		.upsert(cleanedPayload, { onConflict: 'id' })
		.select()
		.single()

	if (fallback.error) {
		console.error('[upsertProfile fallback failed]', fallback.error)
		return null
	}

	console.warn('[upsertProfile] Successfully saved all fields via fallback')
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
