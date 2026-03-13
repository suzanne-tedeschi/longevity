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

	const missingOnboardingColumns = ['age', 'height', 'weight', 'onboarding_data', 'onboarding_completed_at'].some((field) =>
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

	console.warn('profiles table is missing onboarding columns age/height/weight; falling back to basic profile fields')
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
