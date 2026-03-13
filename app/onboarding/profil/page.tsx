'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  addDays,
  addMonths,
  addWeeks,
  eachDayOfInterval,
  endOfMonth,
  format,
  getHours,
  getMinutes,
  isToday,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
} from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Columns3,
  GripVertical,
  LayoutGrid,
  Plus,
  X,
} from 'lucide-react'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'

type StepId =
  | 'firstName'
  | 'age'
  | 'height'
  | 'weight'
  | 'activityFrequency'
  | 'weeklyActivities'
  | 'agendaActivities'
  | 'calendar'
  | 'limitations'
  | 'usage'
  | 'priorities'
  | 'diet'
  | 'coachTone'
  | 'expectations'

const steps: { id: StepId; label: string }[] = [
  { id: 'firstName', label: 'Prénom' },
  { id: 'age', label: 'Âge' },
  { id: 'height', label: 'Taille' },
  { id: 'weight', label: 'Poids' },
  { id: 'activityFrequency', label: 'Fréquence sport' },
  { id: 'weeklyActivities', label: 'Activités' },
  { id: 'agendaActivities', label: 'Agenda' },
  { id: 'calendar', label: 'Google Agenda' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'usage', label: 'Usage evo' },
  { id: 'priorities', label: 'Priorités' },
  { id: 'diet', label: 'Régime' },
  { id: 'coachTone', label: 'Ton du coach' },
  { id: 'expectations', label: 'Attentes' },
]

const activityFrequencies = [
  'Jamais',
  'Pas régulièrement',
  '1 fois / semaine',
  '2 fois / semaine',
  '3 fois / semaine ou +',
]

const weeklyActivityCategories = [
  'Musculation / Fitness',
  'Running / Trail',
  'Vélo / Cyclisme',
  'Natation',
  'Yoga / Pilates',
  'CrossFit / HIIT',
  'Sports collectifs',
  'Arts martiaux',
  'Escalade',
  'Sports de raquette',
  'Danse',
  'Randonnée',
  'Boxe',
  'Autre',
]

const usageOptions = [
  'Comme mon programme principal d’entraînement',
  'Pour compléter mes activités actuelles',
  'Uniquement pour répondre à mes questions sur la longévité',
]

const dietOptions = [
  'Omnivore: aucune restriction particulière',
  'Végétarien',
  'Vegan',
  'Intolérance / allergies alimentaires',
  'Autre régime spécifique',
]

const coachToneCards = [
  {
    title: 'Posé & rassurant',
    emoji: '🧘',
    text: 'Ne t\'en fais pas pour aujourd\'hui. L\'essentiel, c\'est ta régularité sur le long terme. Repose-toi bien, on reprendra ensemble, à ton rythme, dès demain.',
  },
  {
    title: 'Structuré & cadré',
    emoji: '📋',
    text: 'Je vois que tu n’as pas réalisé ta séance aujourd’hui. Pour maintenir l\'équilibre de ton programme, deux options s\'offrent à toi : Option A reporter cette session à demain, ou Option B passer directement à la suivante pour respecter le calendrier initial.',
  },
  {
    title: 'Motivant & énergique',
    emoji: '⚡',
    text: 'On a raté le coche aujourd\'hui ? Aucun problème, ça arrive ! On transforme cette petite pause en énergie pour demain. Prêt à tout donner à la prochaine session ?',
  },
  {
    title: 'Direct & factuel',
    emoji: '🎯',
    text: 'Tu n’as pas validé ta séance aujourd’hui. Le contenu reste accessible en bibliothèque si tu décides de le rattraper plus tard.',
  },
]

const longevityLevers = ['Nutrition', 'Santé mentale', 'Sport', 'Sommeil']

function reorder(list: string[], from: number, to: number) {
  const next = [...list]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

interface PlanningSession {
  id: string
  date: Date
  type: 'sport'
  label: string
  duration: number
  isWeekly?: boolean
  notes?: string
}

interface StoredPlanningSession {
  id: string
  date: string
  type?: 'evo' | 'sport'
  label: string
  duration: number
  isWeekly?: boolean
  notes?: string
}

interface CalendarSession extends PlanningSession {
  sourceId: string
}

type CalView = 'week' | 'month' | 'day'

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8)
const H_PX = 44
const DAY_OPTIONS = [
  { value: 1, label: 'Lundi' },
  { value: 2, label: 'Mardi' },
  { value: 3, label: 'Mercredi' },
  { value: 4, label: 'Jeudi' },
  { value: 5, label: 'Vendredi' },
  { value: 6, label: 'Samedi' },
  { value: 0, label: 'Dimanche' },
]

export default function ProfilPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const current = steps[step]

  const [firstName, setFirstName] = useState('')
  const [age, setAge] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [activityFrequency, setActivityFrequency] = useState('')
  const [weeklyActivities, setWeeklyActivities] = useState<string[]>([])
  const [agendaSessions, setAgendaSessions] = useState<PlanningSession[]>([])
  const [googleCalendarWanted, setGoogleCalendarWanted] = useState<boolean | null>(null)
  const [limitations, setLimitations] = useState<string[]>([])
  const [jointPainWhere, setJointPainWhere] = useState('')
  const [musclePainWhere, setMusclePainWhere] = useState('')
  const [otherLimitation, setOtherLimitation] = useState('')
  const [evoUsage, setEvoUsage] = useState('')
  const [priorities, setPriorities] = useState<string[]>(longevityLevers)
  const [diet, setDiet] = useState('')
  const [coachTone, setCoachTone] = useState('')
  const [expectations, setExpectations] = useState('')
  const [saving, setSaving] = useState(false)

  const [calendarConnected, setCalendarConnected] = useState(false)
  const [calendarEmail, setCalendarEmail] = useState<string | null>(null)
  const [calendarLastSyncAt, setCalendarLastSyncAt] = useState<string | null>(null)
  const [calendarLoading, setCalendarLoading] = useState(true)
  const [calendarWorking, setCalendarWorking] = useState(false)
  const [calendarError, setCalendarError] = useState<string | null>(null)

  const [calView, setCalView] = useState<CalView>('week')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [modal, setModal] = useState<{ open: boolean; date: Date | null }>({ open: false, date: null })
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null)
  const [newSession, setNewSession] = useState({ label: '', duration: 45, notes: '', time: '09:00', dayOfWeek: 1, isWeekly: false })
  const [dragOverDay, setDragOverDay] = useState<string | null>(null)
  const dragId = useRef<string | null>(null)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)

  const agendaActivities = useMemo(() => {
    if (agendaSessions.length === 0) return ''
    return agendaSessions
      .slice()
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map((session) => `${format(session.date, 'EEEE HH:mm', { locale: fr })} ${session.label}${session.isWeekly ? ' (hebdo)' : ''}`)
      .join(', ')
  }, [agendaSessions])

  const progressPct = useMemo(() => ((step + 1) / steps.length) * 100, [step])

  useEffect(() => {
    async function init() {
      if (!isSupabaseConfigured || !supabase) {
        setCalendarLoading(false)
        return
      }

      const { data: auth } = await supabase.auth.getSession()
      const session = auth.session
      if (!session) {
        router.replace('/onboarding/login')
        return
      }

      const existingName =
        session.user.user_metadata?.first_name ||
        session.user.user_metadata?.full_name?.split(' ')[0] ||
        localStorage.getItem('evo_user_name') ||
        ''
      if (existingName) setFirstName(existingName)

      const cached = localStorage.getItem('evo_onboarding_data')
      const planningCache = localStorage.getItem('evo_planning_sessions')
      if (cached) {
        try {
          const data = JSON.parse(cached)
          setFirstName(data.firstName ?? existingName)
          setAge(data.age ?? '')
          setHeight(data.height ?? '')
          setWeight(data.weight ?? '')
          setActivityFrequency(data.activityFrequency ?? '')
          setWeeklyActivities(
            Array.isArray(data.weeklyActivities)
              ? data.weeklyActivities
              : typeof data.weeklyActivities === 'string' && data.weeklyActivities.trim().length > 0
                ? data.weeklyActivities.split(',').map((s: string) => s.trim()).filter(Boolean)
                : []
          )
          setAgendaSessions(
            Array.isArray(data.agendaSessions)
              ? data.agendaSessions
                  .map((session: StoredPlanningSession) => ({
                    ...session,
                    type: 'sport' as const,
                    isWeekly: Boolean(session.isWeekly),
                    date: new Date(session.date),
                  }))
                  .filter((session: PlanningSession) => !Number.isNaN(session.date.getTime()))
              : planningCache
                ? (JSON.parse(planningCache) as StoredPlanningSession[])
                    .map((session) => ({ ...session, type: 'sport' as const, isWeekly: Boolean(session.isWeekly), date: new Date(session.date) }))
                    .filter((session) => !Number.isNaN(session.date.getTime()))
              : []
          )
          setGoogleCalendarWanted(data.googleCalendarWanted ?? null)
          setLimitations(Array.isArray(data.limitations) ? data.limitations : [])
          setJointPainWhere(data.jointPainWhere ?? '')
          setMusclePainWhere(data.musclePainWhere ?? '')
          setOtherLimitation(data.otherLimitation ?? '')
          setEvoUsage(data.evoUsage ?? '')
          setPriorities(Array.isArray(data.priorities) && data.priorities.length === 4 ? data.priorities : longevityLevers)
          setDiet(data.diet ?? '')
          setCoachTone(data.coachTone ?? '')
          setExpectations(data.expectations ?? '')
        } catch {
          // ignore corrupted local cache
        }
      }

      if (!cached && planningCache) {
        try {
          setAgendaSessions(
            (JSON.parse(planningCache) as StoredPlanningSession[])
              .map((session) => ({ ...session, type: 'sport' as const, isWeekly: Boolean(session.isWeekly), date: new Date(session.date) }))
              .filter((session) => !Number.isNaN(session.date.getTime()))
          )
        } catch {
          // ignore corrupted planning cache
        }
      }

      try {
        const response = await fetch('/api/calendar/google/status', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        })
        const body = (await response.json()) as {
          connected?: boolean
          email?: string | null
          lastSyncAt?: string | null
        }
        if (response.ok) {
          setCalendarConnected(Boolean(body.connected))
          setCalendarEmail(body.email ?? null)
          setCalendarLastSyncAt(body.lastSyncAt ?? null)
        }
      } finally {
        setCalendarLoading(false)
      }
    }

    init()
  }, [router])

  useEffect(() => {
    localStorage.setItem(
      'evo_onboarding_data',
      JSON.stringify({
        firstName,
        age,
        height,
        weight,
        activityFrequency,
        weeklyActivities,
        agendaActivities,
        agendaSessions: agendaSessions.map((session) => ({
          ...session,
          date: session.date.toISOString(),
        })),
        googleCalendarWanted,
        limitations,
        jointPainWhere,
        musclePainWhere,
        otherLimitation,
        evoUsage,
        priorities,
        diet,
        coachTone,
        expectations,
      })
    )
  }, [
    firstName,
    age,
    height,
    weight,
    activityFrequency,
    weeklyActivities,
    agendaActivities,
    agendaSessions,
    googleCalendarWanted,
    limitations,
    jointPainWhere,
    musclePainWhere,
    otherLimitation,
    evoUsage,
    priorities,
    diet,
    coachTone,
    expectations,
  ])

  useEffect(() => {
    localStorage.setItem(
      'evo_planning_sessions',
      JSON.stringify(
        agendaSessions.map((session) => ({
          ...session,
          date: session.date.toISOString(),
        }))
      )
    )
  }, [agendaSessions])

  const toggleLimitation = (value: string) => {
    setLimitations(prev => {
      if (value === 'Aucune') return ['Aucune']
      const withoutNone = prev.filter(p => p !== 'Aucune')
      if (withoutNone.includes(value)) return withoutNone.filter(p => p !== value)
      return [...withoutNone, value]
    })
  }

  const toggleWeeklyActivity = (activity: string) => {
    setWeeklyActivities(prev =>
      prev.includes(activity)
        ? prev.filter(item => item !== activity)
        : [...prev, activity]
    )
  }

  const onDragStart = useCallback((e: React.DragEvent, sessionId: string) => {
    dragId.current = sessionId
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', sessionId)
    const element = e.currentTarget as HTMLElement
    if (element) {
      e.dataTransfer.setDragImage(element, element.offsetWidth / 2, 12)
    }
  }, [])

  const onDragOver = useCallback((e: React.DragEvent, dayKey: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverDay(dayKey)
  }, [])

  const onDragLeave = useCallback(() => {
    setDragOverDay(null)
  }, [])

  const onDrop = useCallback((e: React.DragEvent, targetDate: Date) => {
    e.preventDefault()
    setDragOverDay(null)
    const sessionId = dragId.current || e.dataTransfer.getData('text/plain')
    if (!sessionId) return

    setAgendaSessions((prev) =>
      prev.map((session) => {
        if (session.id !== sessionId) return session
        const nextDate = new Date(targetDate)
        nextDate.setHours(getHours(session.date), getMinutes(session.date), 0, 0)
        return { ...session, date: nextDate }
      })
    )
    dragId.current = null
  }, [])

  const onDropTime = useCallback((e: React.DragEvent, targetDate: Date) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOverDay(null)
    const sessionId = dragId.current || e.dataTransfer.getData('text/plain')
    if (!sessionId) return

    const rect = e.currentTarget.getBoundingClientRect()
    const y = e.clientY - rect.top
    const rawHours = 8 + y / H_PX
    const hour = Math.max(8, Math.min(20, Math.floor(rawHours)))
    const rawMinutes = (rawHours - Math.floor(rawHours)) * 60
    const minutes = Math.min(45, Math.round(rawMinutes / 15) * 15)

    setAgendaSessions((prev) =>
      prev.map((session) => {
        if (session.id !== sessionId) return session
        const nextDate = new Date(targetDate)
        nextDate.setHours(hour, minutes, 0, 0)
        return { ...session, date: nextDate }
      })
    )
    dragId.current = null
  }, [])

  const openCreateSessionModal = (baseDate?: Date) => {
    const date = baseDate ? new Date(baseDate) : new Date(currentDate)
    setEditingSessionId(null)
    setNewSession({
      label: '',
      duration: 45,
      notes: '',
      time: '09:00',
      dayOfWeek: date.getDay(),
      isWeekly: false,
    })
    setModal({ open: true, date })
  }

  const openEditSessionModal = (session: CalendarSession) => {
    setEditingSessionId(session.sourceId)
    setNewSession({
      label: session.label,
      duration: session.duration,
      notes: session.notes ?? '',
      time: format(session.date, 'HH:mm'),
      dayOfWeek: session.date.getDay(),
      isWeekly: Boolean(session.isWeekly),
    })
    setModal({ open: true, date: new Date(session.date) })
  }

  const buildSessionDate = (baseDate: Date, dayOfWeek: number, time: string) => {
    const [hourRaw, minuteRaw] = time.split(':')
    const hour = Number(hourRaw)
    const minute = Number(minuteRaw)
    const weekStartDate = startOfWeek(baseDate, { weekStartsOn: 1 })
    const dayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    const nextDate = addDays(weekStartDate, dayOffset)
    nextDate.setHours(Number.isFinite(hour) ? hour : 9, Number.isFinite(minute) ? minute : 0, 0, 0)
    return nextDate
  }

  const addOrUpdateSessionHandler = () => {
    if (!modal.date || !newSession.label.trim()) return
    const date = buildSessionDate(modal.date, newSession.dayOfWeek, newSession.time)

    if (editingSessionId) {
      setAgendaSessions((prev) =>
        prev.map((session) =>
          session.id === editingSessionId
            ? {
                ...session,
                date,
                label: newSession.label.trim(),
                duration: newSession.duration,
                notes: newSession.notes.trim(),
                isWeekly: newSession.isWeekly,
              }
            : session
        )
      )
    } else {
      setAgendaSessions((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          date,
          type: 'sport',
          label: newSession.label.trim(),
          duration: newSession.duration,
          notes: newSession.notes.trim(),
          isWeekly: newSession.isWeekly,
        },
      ])
    }

    setModal({ open: false, date: null })
    setEditingSessionId(null)
    setNewSession({ label: '', duration: 45, notes: '', time: '09:00', dayOfWeek: 1, isWeekly: false })
  }

  const deleteSessionHandler = () => {
    if (!editingSessionId) return
    setAgendaSessions((prev) => prev.filter((session) => session.id !== editingSessionId))
    setModal({ open: false, date: null })
    setEditingSessionId(null)
    setNewSession({ label: '', duration: 45, notes: '', time: '09:00', dayOfWeek: 1, isWeekly: false })
  }

  const navigate = (direction: -1 | 1) => {
    if (calView === 'month') {
      setCurrentDate(direction === 1 ? addMonths(currentDate, 1) : subMonths(currentDate, 1))
      return
    }
    if (calView === 'week') {
      setCurrentDate(direction === 1 ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1))
      return
    }
    setCurrentDate(direction === 1 ? addDays(currentDate, 1) : subDays(currentDate, 1))
  }

  const sessionsOnDay = (day: Date): CalendarSession[] =>
    agendaSessions
      .filter((session) =>
        session.isWeekly
          ? session.date.getDay() === day.getDay()
          : format(session.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
      )
      .map((session) => {
        const occurrenceDate = new Date(day)
        occurrenceDate.setHours(getHours(session.date), getMinutes(session.date), 0, 0)
        return {
          ...session,
          sourceId: session.id,
          date: occurrenceDate,
        }
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime())

  const monthDays = eachDayOfInterval({ start: startOfMonth(currentDate), end: endOfMonth(currentDate) })
  const firstDow = (startOfMonth(currentDate).getDay() + 6) % 7
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const sessionTop = (session: PlanningSession) =>
    Math.max(0, (getHours(session.date) - 8 + getMinutes(session.date) / 60) * H_PX)

  const sessionHeight = (session: PlanningSession) =>
    Math.max(18, (session.duration / 60) * H_PX)

  const calTitle =
    calView === 'month'
      ? format(currentDate, 'MMMM yyyy', { locale: fr })
      : calView === 'week'
        ? `${format(weekStart, 'd MMM', { locale: fr })} — ${format(addDays(weekStart, 6), 'd MMM yyyy', { locale: fr })}`
        : format(currentDate, 'EEEE d MMMM yyyy', { locale: fr })

  const viewOptions: { id: CalView; icon: React.ReactNode; label: string }[] = [
    { id: 'week', icon: <Columns3 className="w-3.5 h-3.5" />, label: 'Semaine' },
    { id: 'month', icon: <LayoutGrid className="w-3.5 h-3.5" />, label: 'Mois' },
    { id: 'day', icon: <CalendarDays className="w-3.5 h-3.5" />, label: 'Jour' },
  ]

  const canContinue = () => {
    switch (current.id) {
      case 'firstName':
        return firstName.trim().length >= 2
      case 'age':
        return Number(age) > 0 && Number(age) < 120
      case 'height':
        return Number(height) > 80 && Number(height) < 250
      case 'weight':
        return Number(weight) > 20 && Number(weight) < 300
      case 'activityFrequency':
        return Boolean(activityFrequency)
      case 'weeklyActivities':
        return weeklyActivities.length > 0
      case 'agendaActivities':
        return agendaSessions.length > 0
      case 'calendar':
        return googleCalendarWanted !== null
      case 'limitations':
        if (limitations.length === 0) return false
        if (limitations.includes('Douleurs articulaires') && !jointPainWhere.trim()) return false
        if (limitations.includes('Douleurs musculaires') && !musclePainWhere.trim()) return false
        if (limitations.includes('Autre') && !otherLimitation.trim()) return false
        return true
      case 'usage':
        return Boolean(evoUsage)
      case 'priorities':
        return priorities.length === 4
      case 'diet':
        return Boolean(diet)
      case 'coachTone':
        return Boolean(coachTone)
      case 'expectations':
        return true
      default:
        return false
    }
  }

  const chooseSingleAndNext = <T,>(setter: (value: T) => void, value: T) => {
    setter(value)
    if (step < steps.length - 1) {
      setStep((prev) => prev + 1)
    }
  }

  const handleConnectCalendar = async () => {
    try {
      setCalendarError(null)
      setCalendarWorking(true)
      if (!isSupabaseConfigured || !supabase) {
        setCalendarError('Service indisponible pour connecter Google Agenda.')
        return
      }
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session?.access_token) {
        router.push('/onboarding/login')
        return
      }

      const response = await fetch('/api/calendar/google/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ next: '/onboarding/profil' }),
      })

      const body = (await response.json()) as { url?: string; error?: string }
      if (!response.ok || !body.url) {
        setCalendarError(body.error || 'Connexion Google impossible.')
        return
      }
      window.location.href = body.url
    } catch {
      setCalendarError('Connexion Google impossible.')
    } finally {
      setCalendarWorking(false)
    }
  }

  const handleSyncCalendar = async () => {
    try {
      setCalendarError(null)
      setCalendarWorking(true)
      if (!isSupabaseConfigured || !supabase) {
        setCalendarError('Service indisponible pour synchroniser Google Agenda.')
        return
      }
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session?.access_token) {
        router.push('/onboarding/login')
        return
      }

      const response = await fetch('/api/calendar/google/sync', {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      const body = (await response.json()) as { error?: string }
      if (!response.ok) {
        setCalendarError(body.error || 'Synchronisation impossible.')
        return
      }
      setCalendarLastSyncAt(new Date().toISOString())
      setCalendarConnected(true)
    } catch {
      setCalendarError('Synchronisation impossible.')
    } finally {
      setCalendarWorking(false)
    }
  }

  const finishOnboarding = async () => {
    if (!isSupabaseConfigured || !supabase) {
      router.push('/onboarding/bilans')
      return
    }

    setSaving(true)
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session?.user) {
        router.push('/onboarding/login')
        return
      }

      const payload = {
        firstName: firstName.trim(),
        age: Number(age),
        height: Number(height),
        weight: Number(weight),
        activityFrequency,
        weeklyActivities,
        agendaActivities,
        agendaSessions: agendaSessions.map((session) => ({
          ...session,
          date: session.date.toISOString(),
        })),
        googleCalendarWanted,
        googleCalendarConnected: calendarConnected,
        limitations,
        jointPainWhere: jointPainWhere.trim(),
        musclePainWhere: musclePainWhere.trim(),
        otherLimitation: otherLimitation.trim(),
        evoUsage,
        priorities,
        diet,
        coachTone,
        expectations: expectations.trim(),
        completedAt: new Date().toISOString(),
      }

      await supabase.auth.updateUser({
        data: {
          ...session.user.user_metadata,
          first_name: firstName.trim() || session.user.user_metadata?.first_name || '',
          evo_onboarding_completed: true,
          evo_onboarding: payload,
        },
      })

      await supabase.from('profiles').upsert(
        {
          id: session.user.id,
          first_name: firstName.trim() || session.user.user_metadata?.first_name || '',
          age: Number(age),
          height: Number(height),
          weight: Number(weight),
        },
        { onConflict: 'id' }
      )

      localStorage.setItem('evo_user_name', firstName.trim())
      localStorage.setItem('evo_onboarding_completed', 'true')
      localStorage.removeItem('evo_onboarding_data')

      router.push('/onboarding/bilans')
    } finally {
      setSaving(false)
    }
  }

  const handleNext = async () => {
    if (!canContinue()) return
    if (step < steps.length - 1) {
      setStep(prev => prev + 1)
      return
    }
    await finishOnboarding()
  }

  const handleBack = () => {
    if (step > 0) setStep(prev => prev - 1)
    else router.push('/onboarding/login')
  }

  const cardClass =
    'w-full rounded-xl border-2 p-3.5 text-left transition-all duration-200 ' +
    'border-[#1a1a1a]/[0.1] bg-white hover:border-[#2D6A4F]/30 hover:-translate-y-[1px] hover:shadow-[0_8px_24px_-14px_rgba(27,67,50,0.5)]'

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <div className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#1a1a1a]/[0.08]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <button
            onClick={handleBack}
            className="text-sm text-[#1a1a1a]/40 hover:text-[#1a1a1a] transition-colors"
          >
            Retour
          </button>
          <div className="flex-1 max-w-sm">
            <div className="w-full h-1 bg-[#1a1a1a]/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#2D6A4F] to-[#1B4332] transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="text-[11px] text-center text-[#1a1a1a]/35 mt-1">
              {step + 1}/{steps.length} · {current.label}
            </p>
          </div>
          <Link href="/onboarding/login" className="text-xs text-[#1a1a1a]/25 hover:text-[#1a1a1a]/45 transition-colors">Quitter</Link>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white border border-[#1a1a1a]/[0.08] rounded-2xl p-5 sm:p-7 shadow-[0_30px_80px_-45px_rgba(26,26,26,0.5)]">
          <div className="mb-4 inline-flex items-center rounded-full border border-[#2D6A4F]/20 bg-[#2D6A4F]/5 px-3 py-1">
            <span className="text-[11px] font-medium text-[#2D6A4F]">Questionnaire onboarding evo</span>
          </div>
          {current.id === 'firstName' && (
            <div>
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">Quel est votre prénom ?</h2>
              <p className="text-sm text-[#1a1a1a]/45 mb-5">Pour personnaliser votre expérience evo.</p>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Ex: Suzanne"
                className="w-full rounded-xl border border-[#1a1a1a]/[0.12] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F]"
              />
            </div>
          )}

          {current.id === 'age' && (
            <div>
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">Quel âge avez-vous ?</h2>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Ex: 35"
                className="w-full rounded-xl border border-[#1a1a1a]/[0.12] px-4 py-3 text-sm"
              />
            </div>
          )}

          {current.id === 'height' && (
            <div>
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">Quelle est votre taille ?</h2>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="Ex: 170 (cm)"
                className="w-full rounded-xl border border-[#1a1a1a]/[0.12] px-4 py-3 text-sm"
              />
            </div>
          )}

          {current.id === 'weight' && (
            <div>
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">Quel est votre poids ?</h2>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Ex: 68 (kg)"
                className="w-full rounded-xl border border-[#1a1a1a]/[0.12] px-4 py-3 text-sm"
              />
            </div>
          )}

          {current.id === 'activityFrequency' && (
            <div>
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-3">À quelle fréquence pratiquez-vous une activité physique ?</h2>
              <div className="space-y-2">
                {activityFrequencies.map(option => (
                  <button
                    key={option}
                    onClick={() => chooseSingleAndNext(setActivityFrequency, option)}
                    className={`${cardClass} ${activityFrequency === option ? 'border-[#2D6A4F] bg-[#2D6A4F]/10' : ''}`}
                  >
                    <span className="text-sm font-medium text-[#1a1a1a]">{option}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {current.id === 'weeklyActivities' && (
            <div>
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">Quelles activités pratiquez-vous chaque semaine ?</h2>
              <p className="text-sm text-[#1a1a1a]/45 mb-3">Sélectionnez une ou plusieurs catégories.</p>
              <div className="flex flex-wrap gap-2.5">
                {weeklyActivityCategories.map(category => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => toggleWeeklyActivity(category)}
                    className={`px-4 py-2 rounded-full border text-sm transition-colors ${
                      weeklyActivities.includes(category)
                        ? 'bg-[#2D6A4F]/10 border-[#2D6A4F]/40 text-[#2D6A4F]'
                        : 'bg-white border-[#1a1a1a]/[0.12] text-[#1a1a1a]/80 hover:border-[#1a1a1a]/25'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}

          {current.id === 'agendaActivities' && (
            <div>
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">Placez dans votre agenda les activités régulières</h2>
              <p className="text-sm text-[#1a1a1a]/45 mb-3">Glissez vos séances pour les déplacer, puis ajoutez vos créneaux récurrents.</p>

              <div
                className="bg-white rounded-xl border border-black/[0.06] overflow-hidden"
                onTouchStart={(e) => {
                  touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
                }}
                onTouchEnd={(e) => {
                  if (!touchStartRef.current) return
                  const dx = touchStartRef.current.x - e.changedTouches[0].clientX
                  const dy = touchStartRef.current.y - e.changedTouches[0].clientY
                  touchStartRef.current = null
                  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) navigate(dx > 0 ? 1 : -1)
                }}
              >
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-black/[0.04]">
                  <div className="flex items-center gap-1">
                    <button onClick={() => navigate(-1)} className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-[#f3f4f3] transition-colors text-[#1a1a1a]/30 hover:text-[#1a1a1a]"><ChevronLeft className="w-4 h-4" /></button>
                    <button onClick={() => navigate(1)} className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-[#f3f4f3] transition-colors text-[#1a1a1a]/30 hover:text-[#1a1a1a]"><ChevronRight className="w-4 h-4" /></button>
                    <h3 className="text-[13px] font-medium text-[#1a1a1a] capitalize ml-1.5">{calTitle}</h3>
                  </div>
                  <div className="flex items-center gap-0.5 bg-[#f3f4f3] rounded-md p-0.5">
                    {viewOptions.map((view) => (
                      <button
                        key={view.id}
                        onClick={() => setCalView(view.id)}
                        className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-all ${
                          calView === view.id
                            ? 'bg-white text-[#1a1a1a] shadow-sm'
                            : 'text-[#1a1a1a]/35 hover:text-[#1a1a1a]/60'
                        }`}
                      >
                        {view.icon}
                        <span className="hidden sm:inline">{view.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {calView === 'month' && (
                  <>
                    <div className="grid grid-cols-7 border-b border-black/[0.04]">
                      {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => (
                        <div key={index} className="text-center text-[10px] font-medium text-[#1a1a1a]/25 py-2">{day}</div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7">
                      {Array.from({ length: firstDow }).map((_, i) => (
                        <div key={`empty-${i}`} className="border-r border-b border-black/[0.03] min-h-[56px]" />
                      ))}
                      {monthDays.map((day, i) => {
                        const daySessions = sessionsOnDay(day)
                        const dayKey = day.toISOString()
                        return (
                          <div
                            key={i}
                            onDragOver={(e) => onDragOver(e, dayKey)}
                            onDragLeave={onDragLeave}
                            onDrop={(e) => onDrop(e, day)}
                            className={`relative border-r border-b border-black/[0.03] min-h-[56px] p-1 text-left group transition-all ${
                              isToday(day) ? 'bg-[#3ECF8E]/[0.05]' : ''
                            } ${dragOverDay === dayKey ? 'bg-[#3ECF8E]/[0.08]' : 'hover:bg-[#3ECF8E]/[0.02]'}`}
                          >
                            <button onClick={() => openCreateSessionModal(day)} className="w-full text-left">
                              <span className={`text-[10px] font-medium ${isToday(day) ? 'w-4.5 h-4.5 rounded-full bg-[#3ECF8E] text-white flex items-center justify-center text-[9px]' : 'text-[#1a1a1a]/40'}`}>
                                {format(day, 'd')}
                              </span>
                            </button>
                            <div className="mt-px space-y-px">
                              {daySessions.slice(0, 2).map((session) => (
                                <div
                                  key={session.id}
                                  draggable
                                  onDragStart={(e) => onDragStart(e, session.id)}
                                  onClick={() => openEditSessionModal(session)}
                                  className="text-[8px] font-medium px-1 py-px rounded truncate cursor-grab active:cursor-grabbing bg-[#c9a96e]/10 text-[#a08050]"
                                >
                                  {session.label}{session.isWeekly ? ' · hebdo' : ''}
                                </div>
                              ))}
                              {daySessions.length > 2 && <div className="text-[8px] text-[#1a1a1a]/20">+{daySessions.length - 2}</div>}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </>
                )}

                {calView === 'week' && (
                  <div className="flex">
                    <div className="w-10 shrink-0 border-r border-black/[0.04]">
                      <div className="h-8 border-b border-black/[0.04]" />
                      {HOURS.map((hour) => (
                        <div key={hour} style={{ height: H_PX }} className="flex items-start justify-end pr-1.5 pt-0.5">
                          <span className="text-[9px] text-[#1a1a1a]/20 font-medium">{hour}h</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex-1 grid grid-cols-7">
                      {weekDays.map((day, col) => {
                        const daySessions = sessionsOnDay(day)
                        const dayKey = day.toISOString()
                        return (
                          <div
                            key={col}
                            onDragOver={(e) => onDragOver(e, dayKey)}
                            onDragLeave={onDragLeave}
                            className={`border-r border-black/[0.03] ${isToday(day) ? 'bg-[#3ECF8E]/[0.02]' : ''} ${dragOverDay === dayKey ? 'bg-[#3ECF8E]/[0.06]' : ''}`}
                          >
                            <div className="h-8 flex flex-col items-center justify-center border-b border-black/[0.04]">
                              <span className="text-[9px] font-medium text-[#1a1a1a]/25 uppercase leading-none">{format(day, 'EEE', { locale: fr })}</span>
                              <span className={`text-[11px] font-semibold leading-none ${isToday(day) ? 'w-4.5 h-4.5 rounded-full bg-[#3ECF8E] text-white flex items-center justify-center text-[9px] mt-0.5' : 'text-[#1a1a1a]/60'}`}>{format(day, 'd')}</span>
                            </div>
                            <div
                              className="relative"
                              style={{ height: HOURS.length * H_PX }}
                              onDragOver={(e) => {
                                e.preventDefault()
                                e.dataTransfer.dropEffect = 'move'
                              }}
                              onDrop={(e) => onDropTime(e, day)}
                            >
                              {HOURS.map((hour) => (
                                <div key={hour} className="absolute w-full border-b border-black/[0.03]" style={{ top: (hour - 8) * H_PX, height: H_PX }} />
                              ))}
                              <button className="absolute inset-0 w-full z-0 opacity-0" onClick={() => openCreateSessionModal(day)} />
                              {daySessions.map((session) => {
                                const top = sessionTop(session)
                                const height = sessionHeight(session)
                                return (
                                  <div
                                    key={session.id}
                                    draggable
                                    onDragStart={(e) => onDragStart(e, session.id)}
                                    onClick={() => openEditSessionModal(session)}
                                    className="absolute left-0.5 right-0.5 z-10 rounded px-1 py-px overflow-hidden transition-opacity group/sess cursor-grab active:cursor-grabbing bg-[#c9a96e]/12 border-l-2 border-l-[#c9a96e] text-[#a08050]"
                                    style={{ top, height: Math.max(height, 18) }}
                                  >
                                    <GripVertical className="w-2.5 h-2.5 absolute top-0.5 right-0 opacity-0 group-hover/sess:opacity-40 text-current" />
                                    <p className="text-[8px] font-semibold truncate leading-tight">{session.label}{session.isWeekly ? ' · hebdo' : ''}</p>
                                    {height >= 28 && <p className="text-[7px] opacity-50">{format(session.date, 'HH:mm')} · {session.duration}m</p>}
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {calView === 'day' && (
                  <div className="flex" onDragOver={(e) => onDragOver(e, currentDate.toISOString())} onDragLeave={onDragLeave}>
                    <div className="w-12 shrink-0 border-r border-black/[0.04]">
                      {HOURS.map((hour) => (
                        <div key={hour} style={{ height: H_PX }} className="flex items-start justify-end pr-2 pt-0.5">
                          <span className="text-[10px] text-[#1a1a1a]/25 font-medium">{String(hour).padStart(2, '0')}:00</span>
                        </div>
                      ))}
                    </div>
                    <div
                      className={`flex-1 relative ${isToday(currentDate) ? 'bg-[#3ECF8E]/[0.02]' : ''} ${dragOverDay === currentDate.toISOString() ? 'bg-[#3ECF8E]/[0.06]' : ''}`}
                      style={{ height: HOURS.length * H_PX }}
                      onDragOver={(e) => {
                        e.preventDefault()
                        e.dataTransfer.dropEffect = 'move'
                      }}
                      onDrop={(e) => onDropTime(e, currentDate)}
                    >
                      {HOURS.map((hour) => (
                        <div key={hour} className="absolute w-full border-b border-black/[0.03]" style={{ top: (hour - 8) * H_PX, height: H_PX }} />
                      ))}
                      <button className="absolute inset-0 w-full z-0 opacity-0" onClick={() => openCreateSessionModal(currentDate)} />
                      {sessionsOnDay(currentDate).map((session) => {
                        const top = sessionTop(session)
                        const height = sessionHeight(session)
                        return (
                          <div
                            key={session.id}
                            draggable
                            onDragStart={(e) => onDragStart(e, session.id)}
                            onClick={() => openEditSessionModal(session)}
                            className="absolute left-1 right-4 z-10 rounded-lg px-3 py-1 overflow-hidden group/sess cursor-grab active:cursor-grabbing bg-[#c9a96e]/12 border-l-[3px] border-l-[#c9a96e] text-[#a08050]"
                            style={{ top, height: Math.max(height, 24) }}
                          >
                            <GripVertical className="w-3 h-3 absolute top-1 right-1 opacity-0 group-hover/sess:opacity-40 text-current" />
                            <p className="text-[11px] font-semibold truncate">{session.label}{session.isWeekly ? ' · hebdo' : ''}</p>
                            <p className="text-[10px] opacity-60">{format(session.date, 'HH:mm')} — {session.duration} min</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 mt-2.5 text-[10px] text-[#1a1a1a]/25">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-[#c9a96e]/20" /> Sport</span>
              </div>

              <button
                type="button"
                onClick={() => openCreateSessionModal(new Date())}
                className="mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border border-[#1a1a1a]/[0.12] hover:border-[#2D6A4F]/40"
              >
                <Plus className="w-3.5 h-3.5" /> Ajouter une séance
              </button>

              {modal.open && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4">
                  <div className="w-full max-w-md bg-white rounded-2xl p-5 border border-black/[0.08]">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-semibold text-[#1a1a1a]">{editingSessionId ? 'Modifier la séance' : 'Ajouter une séance'}</h3>
                      <button onClick={() => setModal({ open: false, date: null })} className="w-7 h-7 rounded-md hover:bg-[#f3f4f3] flex items-center justify-center">
                        <X className="w-4 h-4 text-[#1a1a1a]/50" />
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="ex. Run 5km"
                      value={newSession.label}
                      onChange={(e) => setNewSession((prev) => ({ ...prev, label: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-lg border border-black/[0.06] text-[13px] focus:outline-none focus:border-[#3ECF8E]/40 transition-colors placeholder:text-[#1a1a1a]/20 mb-3"
                    />

                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div>
                        <label className="text-[12px] text-[#1a1a1a]/45">Jour</label>
                        <select
                          value={newSession.dayOfWeek}
                          onChange={(e) => setNewSession((prev) => ({ ...prev, dayOfWeek: Number(e.target.value) }))}
                          className="mt-1 w-full px-3 py-2 rounded-lg border border-black/[0.06] text-[13px] focus:outline-none focus:border-[#3ECF8E]/40"
                        >
                          {DAY_OPTIONS.map((day) => (
                            <option key={day.value} value={day.value}>{day.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[12px] text-[#1a1a1a]/45">Heure</label>
                        <input
                          type="time"
                          value={newSession.time}
                          onChange={(e) => setNewSession((prev) => ({ ...prev, time: e.target.value }))}
                          className="mt-1 w-full px-3 py-2 rounded-lg border border-black/[0.06] text-[13px] focus:outline-none focus:border-[#3ECF8E]/40"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[12px] text-[#1a1a1a]/45">Durée</span>
                      <input
                        type="number"
                        min={5}
                        max={180}
                        step={5}
                        value={newSession.duration}
                        onChange={(e) => setNewSession((prev) => ({ ...prev, duration: Number(e.target.value) }))}
                        className="flex-1 px-3 py-2 rounded-lg border border-black/[0.06] text-[13px] focus:outline-none focus:border-[#3ECF8E]/40"
                      />
                      <span className="text-[12px] text-[#1a1a1a]/35">min</span>
                    </div>

                    <label className="flex items-center gap-2 mb-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newSession.isWeekly}
                        onChange={(e) => setNewSession((prev) => ({ ...prev, isWeekly: e.target.checked }))}
                        className="w-4 h-4 rounded border border-black/[0.12]"
                      />
                      <span className="text-[12px] text-[#1a1a1a]/70">Répéter chaque semaine</span>
                    </label>

                    <textarea
                      placeholder="Notes (optionnel)"
                      value={newSession.notes}
                      onChange={(e) => setNewSession((prev) => ({ ...prev, notes: e.target.value }))}
                      rows={2}
                      className="w-full px-3 py-2.5 rounded-lg border border-black/[0.06] text-[13px] focus:outline-none focus:border-[#3ECF8E]/40 resize-none placeholder:text-[#1a1a1a]/20 mb-4"
                    />

                    <div className="flex gap-2">
                      {editingSessionId && (
                        <button
                          onClick={deleteSessionHandler}
                          className="py-2.5 px-3 rounded-lg border border-red-200 text-[13px] font-medium text-red-500 hover:bg-red-50 transition-colors"
                        >
                          Supprimer
                        </button>
                      )}
                      <button
                        onClick={() => setModal({ open: false, date: null })}
                        className="flex-1 py-2.5 rounded-lg border border-black/[0.06] text-[13px] font-medium text-[#1a1a1a]/50 hover:border-black/[0.12] transition-colors"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={addOrUpdateSessionHandler}
                        disabled={!newSession.label.trim()}
                        className="flex-1 py-2.5 rounded-lg bg-[#1a1a1a] text-white text-[13px] font-medium hover:bg-[#333] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        {editingSessionId ? 'Enregistrer' : 'Ajouter'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {current.id === 'calendar' && (
            <div>
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">Voulez-vous connecter votre Google Agenda ? (optionnel)</h2>
              <div className="grid sm:grid-cols-2 gap-2 mb-4">
                <button onClick={() => chooseSingleAndNext(setGoogleCalendarWanted, true)} className={`${cardClass} ${googleCalendarWanted === true ? 'border-[#2D6A4F] bg-[#2D6A4F]/10' : ''}`}>Oui, je veux connecter</button>
                <button onClick={() => chooseSingleAndNext(setGoogleCalendarWanted, false)} className={`${cardClass} ${googleCalendarWanted === false ? 'border-[#2D6A4F] bg-[#2D6A4F]/10' : ''}`}>Non, plus tard</button>
              </div>

              <div className="rounded-xl border border-[#1a1a1a]/[0.08] bg-[#FAF8F5] p-4">
                <p className="text-sm font-semibold text-[#1a1a1a] mb-1">Statut actuel</p>
                <p className="text-xs text-[#1a1a1a]/45">
                  {calendarLoading ? 'Chargement...' : calendarConnected ? 'Google Agenda connecté' : 'Non connecté'}
                  {calendarEmail ? ` · ${calendarEmail}` : ''}
                </p>
                {calendarLastSyncAt && (
                  <p className="text-xs text-[#1a1a1a]/35 mt-1">Dernière sync : {new Date(calendarLastSyncAt).toLocaleString('fr-FR')}</p>
                )}
                {calendarError && <p className="text-xs text-red-500 mt-2">{calendarError}</p>}

                <div className="flex flex-wrap gap-2 mt-3">
                  <button
                    type="button"
                    onClick={handleConnectCalendar}
                    disabled={calendarWorking || calendarLoading}
                    className="px-3 py-2 rounded-lg text-xs font-semibold border border-[#1a1a1a]/[0.12] hover:border-[#2D6A4F]/40"
                  >
                    {calendarConnected ? 'Reconnecter Google' : 'Connecter Google'}
                  </button>
                  {calendarConnected && (
                    <button
                      type="button"
                      onClick={handleSyncCalendar}
                      disabled={calendarWorking}
                      className="px-3 py-2 rounded-lg text-xs font-semibold bg-[#2D6A4F] text-white"
                    >
                      Actualiser
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {current.id === 'limitations' && (
            <div>
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">Avez-vous actuellement des limitations physiques ?</h2>
              <div className="space-y-2">
                {['Douleurs articulaires', 'Douleurs musculaires', 'Autre', 'Aucune'].map(option => (
                  <button
                    key={option}
                    onClick={() => toggleLimitation(option)}
                    className={`${cardClass} ${limitations.includes(option) ? 'border-[#2D6A4F] bg-[#2D6A4F]/10' : ''}`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {limitations.includes('Douleurs articulaires') && (
                <input
                  value={jointPainWhere}
                  onChange={(e) => setJointPainWhere(e.target.value)}
                  placeholder="Où ? (genoux, hanches, épaules...)"
                  className="mt-3 w-full rounded-xl border border-[#1a1a1a]/[0.12] px-4 py-3 text-sm"
                />
              )}
              {limitations.includes('Douleurs musculaires') && (
                <input
                  value={musclePainWhere}
                  onChange={(e) => setMusclePainWhere(e.target.value)}
                  placeholder="Où ?"
                  className="mt-3 w-full rounded-xl border border-[#1a1a1a]/[0.12] px-4 py-3 text-sm"
                />
              )}
              {limitations.includes('Autre') && (
                <input
                  value={otherLimitation}
                  onChange={(e) => setOtherLimitation(e.target.value)}
                  placeholder="Précisez"
                  className="mt-3 w-full rounded-xl border border-[#1a1a1a]/[0.12] px-4 py-3 text-sm"
                />
              )}
            </div>
          )}

          {current.id === 'usage' && (
            <div>
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-3">Comment souhaitez-vous utiliser evo pour le sport ?</h2>
              <div className="space-y-2">
                {usageOptions.map(option => (
                  <button
                    key={option}
                    onClick={() => chooseSingleAndNext(setEvoUsage, option)}
                    className={`${cardClass} ${evoUsage === option ? 'border-[#2D6A4F] bg-[#2D6A4F]/10' : ''}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {current.id === 'priorities' && (
            <div>
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">Classez ces 4 leviers de longévité par priorité</h2>
              <p className="text-sm text-[#1a1a1a]/45 mb-3">Du plus important au moins important pour vous.</p>
              <div className="space-y-2">
                {priorities.map((item, idx) => (
                  <div key={item} className="rounded-xl border border-[#1a1a1a]/[0.1] bg-white px-3 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#2D6A4F]">#{idx + 1}</span>
                      <span className="text-sm text-[#1a1a1a]">{item}</span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        disabled={idx === 0}
                        onClick={() => setPriorities(prev => reorder(prev, idx, idx - 1))}
                        className="px-2 py-1 text-xs rounded border border-[#1a1a1a]/[0.12] disabled:opacity-30"
                      >
                        ↑
                      </button>
                      <button
                        disabled={idx === priorities.length - 1}
                        onClick={() => setPriorities(prev => reorder(prev, idx, idx + 1))}
                        className="px-2 py-1 text-xs rounded border border-[#1a1a1a]/[0.12] disabled:opacity-30"
                      >
                        ↓
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {current.id === 'diet' && (
            <div>
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-3">Quel est votre régime alimentaire ?</h2>
              <div className="space-y-2">
                {dietOptions.map(option => (
                  <button
                    key={option}
                    onClick={() => chooseSingleAndNext(setDiet, option)}
                    className={`${cardClass} ${diet === option ? 'border-[#2D6A4F] bg-[#2D6A4F]/10' : ''}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {current.id === 'coachTone' && (
            <div>
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-3">Quel ton préférez-vous pour votre coach evo ?</h2>
              <div className="space-y-2">
                {coachToneCards.map((tone) => (
                  <button
                    key={tone.title}
                    onClick={() => chooseSingleAndNext(setCoachTone, tone.text)}
                    className={`${cardClass} ${coachTone === tone.text ? 'border-[#2D6A4F] bg-[#2D6A4F]/10' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xl leading-none">{tone.emoji}</span>
                      <div>
                        <p className="text-sm font-semibold text-[#1a1a1a] mb-1">{tone.title}</p>
                        <p className="text-xs text-[#1a1a1a]/75 leading-relaxed">{tone.text}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {current.id === 'expectations' && (
            <div>
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">Avez-vous des attentes particulières ?</h2>
              <p className="text-sm text-[#1a1a1a]/45 mb-3">Optionnel. Ex: mariage, performance, reprise, doutes...</p>
              <textarea
                value={expectations}
                onChange={(e) => setExpectations(e.target.value)}
                rows={5}
                placeholder="Dites-nous ce qui est important pour vous"
                className="w-full rounded-xl border border-[#1a1a1a]/[0.12] px-4 py-3 text-sm"
              />
            </div>
          )}

          <div className="mt-7 flex justify-end">
            <button
              onClick={handleNext}
              disabled={!canContinue() || saving}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                canContinue() && !saving
                  ? 'bg-[#2D6A4F] text-white hover:bg-[#24563f]'
                  : 'bg-[#1a1a1a]/[0.07] text-[#1a1a1a]/25 cursor-not-allowed'
              }`}
            >
              {step < steps.length - 1 ? 'Continuer' : saving ? 'Enregistrement...' : 'Terminer'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
