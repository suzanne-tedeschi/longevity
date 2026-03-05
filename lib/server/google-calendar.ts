import { decryptToken, encryptToken } from '@/lib/server/calendar-crypto'
import { getSupabaseAdmin } from '@/lib/server/supabase-admin'

const GOOGLE_OAUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'
const GOOGLE_FREEBUSY_URL = 'https://www.googleapis.com/calendar/v3/freeBusy'
const GOOGLE_EVENTS_URL = 'https://www.googleapis.com/calendar/v3/calendars/primary/events'

type GoogleTokenResponse = {
  access_token: string
  expires_in: number
  refresh_token?: string
  scope?: string
  token_type: string
}

function getGoogleConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const appUrl = process.env.NEXT_PUBLIC_APP_URL

  if (!clientId || !clientSecret || !appUrl) {
    throw new Error('Missing Google Calendar OAuth env vars')
  }

  const redirectUri = `${appUrl}/api/calendar/google/callback`
  return { clientId, clientSecret, redirectUri, appUrl }
}

export function buildGoogleAuthUrl(state: string) {
  const { clientId, redirectUri } = getGoogleConfig()
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
    include_granted_scopes: 'true',
    scope: 'https://www.googleapis.com/auth/calendar.readonly',
    state,
  })
  return `${GOOGLE_OAUTH_URL}?${params.toString()}`
}

async function tokenRequest(params: URLSearchParams) {
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
    cache: 'no-store',
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Google token exchange failed: ${response.status} ${errorBody}`)
  }

  return (await response.json()) as GoogleTokenResponse
}

export async function exchangeCodeForTokens(code: string) {
  const { clientId, clientSecret, redirectUri } = getGoogleConfig()
  return tokenRequest(
    new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    })
  )
}

async function refreshAccessToken(refreshToken: string) {
  const { clientId, clientSecret } = getGoogleConfig()
  return tokenRequest(
    new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    })
  )
}

async function fetchGooglePrimaryEmail(accessToken: string) {
  const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  })
  if (!response.ok) return null
  const body = (await response.json()) as { email?: string }
  return body.email ?? null
}

type BusySlot = { start: string; end: string }

async function fetchFreeBusy(accessToken: string, timeMin: string, timeMax: string) {
  const response = await fetch(GOOGLE_FREEBUSY_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      timeMin,
      timeMax,
      items: [{ id: 'primary' }],
    }),
    cache: 'no-store',
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Google freebusy request failed: ${response.status} ${errorBody}`)
  }

  const body = (await response.json()) as {
    calendars?: { primary?: { busy?: BusySlot[] } }
  }
  return body.calendars?.primary?.busy ?? []
}

export async function upsertGoogleConnection(params: {
  userId: string
  tokens: GoogleTokenResponse
}) {
  const admin = getSupabaseAdmin()
  const expiresAt = new Date(Date.now() + params.tokens.expires_in * 1000).toISOString()
  const email = await fetchGooglePrimaryEmail(params.tokens.access_token)

  const { data: existing } = await admin
    .from('calendar_connections')
    .select('refresh_token_encrypted')
    .eq('user_id', params.userId)
    .eq('provider', 'google')
    .maybeSingle()

  const refreshTokenPlain =
    params.tokens.refresh_token ||
    (existing?.refresh_token_encrypted ? decryptToken(existing.refresh_token_encrypted) : null)

  if (!refreshTokenPlain) {
    throw new Error('Missing Google refresh token')
  }

  const { error } = await admin.from('calendar_connections').upsert(
    {
      user_id: params.userId,
      provider: 'google',
      provider_account_email: email,
      scope: params.tokens.scope || null,
      access_token_encrypted: encryptToken(params.tokens.access_token),
      refresh_token_encrypted: encryptToken(refreshTokenPlain),
      access_token_expires_at: expiresAt,
      status: 'active',
      last_sync_error: null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,provider' }
  )

  if (error) {
    throw new Error(`Failed to save Google connection: ${error.message}`)
  }
}

export async function syncGoogleCalendarForUser(userId: string) {
  const admin = getSupabaseAdmin()
  const { data: connection, error: connectionError } = await admin
    .from('calendar_connections')
    .select(
      'refresh_token_encrypted, access_token_encrypted, access_token_expires_at, provider_account_email'
    )
    .eq('user_id', userId)
    .eq('provider', 'google')
    .maybeSingle()

  if (connectionError || !connection) {
    throw new Error('Google calendar connection not found')
  }

  let accessToken = decryptToken(connection.access_token_encrypted)
  const refreshToken = decryptToken(connection.refresh_token_encrypted)

  const expiresAt = connection.access_token_expires_at
    ? new Date(connection.access_token_expires_at).getTime()
    : 0

  if (!expiresAt || Date.now() > expiresAt - 60_000) {
    const refreshed = await refreshAccessToken(refreshToken)
    accessToken = refreshed.access_token

    const { error: updateError } = await admin
      .from('calendar_connections')
      .update({
        access_token_encrypted: encryptToken(accessToken),
        access_token_expires_at: new Date(Date.now() + refreshed.expires_in * 1000).toISOString(),
        scope: refreshed.scope || null,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('provider', 'google')

    if (updateError) {
      throw new Error(`Failed to persist refreshed token: ${updateError.message}`)
    }
  }

  const timeMin = new Date().toISOString()
  const timeMax = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
  const busySlots = await fetchFreeBusy(accessToken, timeMin, timeMax)

  const { error: cacheError } = await admin.from('calendar_freebusy_cache').upsert(
    {
      user_id: userId,
      provider: 'google',
      busy_slots: busySlots,
      window_start: timeMin,
      window_end: timeMax,
      synced_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,provider' }
  )

  if (cacheError) {
    throw new Error(`Failed to cache freebusy data: ${cacheError.message}`)
  }

  const { error: statusError } = await admin
    .from('calendar_connections')
    .update({
      last_sync_at: new Date().toISOString(),
      last_sync_status: 'success',
      last_sync_error: null,
      status: 'active',
      provider_account_email: connection.provider_account_email,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('provider', 'google')

  if (statusError) {
    throw new Error(`Failed to update sync status: ${statusError.message}`)
  }

  return { busyCount: busySlots.length, timeMin, timeMax }
}

/** Shared helper: retrieve a valid (refreshed if needed) access token for a user */
async function getValidAccessToken(userId: string) {
  const admin = getSupabaseAdmin()
  const { data: connection, error: connectionError } = await admin
    .from('calendar_connections')
    .select(
      'refresh_token_encrypted, access_token_encrypted, access_token_expires_at, provider_account_email'
    )
    .eq('user_id', userId)
    .eq('provider', 'google')
    .maybeSingle()

  if (connectionError || !connection) {
    throw new Error('Google calendar connection not found')
  }

  let accessToken = decryptToken(connection.access_token_encrypted)
  const refreshToken = decryptToken(connection.refresh_token_encrypted)

  const expiresAt = connection.access_token_expires_at
    ? new Date(connection.access_token_expires_at).getTime()
    : 0

  if (!expiresAt || Date.now() > expiresAt - 60_000) {
    const refreshed = await refreshAccessToken(refreshToken)
    accessToken = refreshed.access_token

    await admin
      .from('calendar_connections')
      .update({
        access_token_encrypted: encryptToken(accessToken),
        access_token_expires_at: new Date(Date.now() + refreshed.expires_in * 1000).toISOString(),
        scope: refreshed.scope || null,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('provider', 'google')
  }

  return accessToken
}

export type GoogleCalendarEvent = {
  id: string
  summary: string
  start: string
  end: string
  allDay: boolean
}

/** Fetch actual Google Calendar events for a date range */
export async function fetchGoogleEventsForUser(
  userId: string,
  timeMin: string,
  timeMax: string
): Promise<GoogleCalendarEvent[]> {
  const accessToken = await getValidAccessToken(userId)

  const params = new URLSearchParams({
    timeMin,
    timeMax,
    singleEvents: 'true',
    orderBy: 'startTime',
    maxResults: '250',
  })

  const response = await fetch(`${GOOGLE_EVENTS_URL}?${params.toString()}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Google events request failed: ${response.status} ${errorBody}`)
  }

  type GEvent = {
    id?: string
    summary?: string
    start?: { dateTime?: string; date?: string }
    end?: { dateTime?: string; date?: string }
  }

  const body = (await response.json()) as { items?: GEvent[] }
  const items = body.items ?? []

  return items.map((ev) => {
    const allDay = !ev.start?.dateTime
    return {
      id: ev.id || '',
      summary: ev.summary || '(sans titre)',
      start: ev.start?.dateTime || ev.start?.date || '',
      end: ev.end?.dateTime || ev.end?.date || '',
      allDay,
    }
  })
}
