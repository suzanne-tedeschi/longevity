"use client"

import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { isSupabaseConfigured, supabase, upsertProfile } from "@/lib/supabase"
import { getProgressPercent, BILAN_TOTAL_QUESTIONS, clearProgress } from "@/lib/bilan-progress"
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, RadarChart, PolarGrid,
  PolarAngleAxis, Radar,
} from "recharts"
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay,
  isToday, addMonths, subMonths, parseISO, startOfWeek,
  addWeeks, subWeeks, addDays, subDays, getHours, getMinutes, isSameMonth,
} from "date-fns"
import { fr } from "date-fns/locale"
import {
  Calendar, TrendingUp, FlaskConical, ClipboardList, ChevronLeft, ChevronRight,
  Activity, Moon, Apple, Brain, Dumbbell, Heart, RefreshCw, Plus, X,
  Timer, Zap, Shield, Leaf, Microscope, Lightbulb, ArrowRight, GripVertical,
  Dna, Clock, Wind, Recycle, Bug, Radio, Sprout, Ban, LayoutGrid, Columns3, CalendarDays,
  MessageCircle, CheckCircle, AlertTriangle, LogOut, Sparkles,
} from "lucide-react"
import css from "./bilans.module.css"
import { adaptActionForDiet } from "@/lib/bilan-nutrition-report"
import { digestifSections } from "@/lib/bilan-nutrition-data"

/* ─── types ─── */
interface Session {
  id: string
  date: Date
  type: "evo" | "sport" | "google"
  label: string
  duration: number
  notes?: string
}

interface StoredSession {
  id: string
  date: string
  type: "evo" | "sport"
  label: string
  duration: number
  notes?: string
}
type CalView = "week" | "month" | "day"

/* ─── data ─── */
const progressData = [
  { mois: "Oct", renforcement: 58, cardio: 52, sommeil: 55, nutrition: 60, mental: 48 },
  { mois: "Nov", renforcement: 63, cardio: 57, sommeil: 61, nutrition: 64, mental: 53 },
  { mois: "Dec", renforcement: 68, cardio: 62, sommeil: 68, nutrition: 69, mental: 58 },
  { mois: "Jan", renforcement: 72, cardio: 66, sommeil: 72, nutrition: 73, mental: 63 },
  { mois: "Fev", renforcement: 77, cardio: 71, sommeil: 76, nutrition: 77, mental: 68 },
  { mois: "Mar", renforcement: 82, cardio: 75, sommeil: 80, nutrition: 80, mental: 72 },
]
const radarData = [
  { label: "Mobilite", value: 84 }, { label: "Sommeil", value: 80 },
  { label: "Digestion", value: 83 }, { label: "Stress", value: 65 },
  { label: "Mental", value: 72 }, { label: "Cardio", value: 77 },
]
const weeklyActivity = [
  { jour: "L", seances: 1 }, { jour: "M", seances: 0 }, { jour: "M", seances: 2 },
  { jour: "J", seances: 1 }, { jour: "V", seances: 0 }, { jour: "S", seances: 1 }, { jour: "D", seances: 0 },
]

const bilanOptionsDefs: { id: string; bilanType: string; title: string; description: string; duration: string; available: boolean; href: string; icon: React.ReactNode; color: string }[] = [
  { id: "condition-physique", bilanType: "mobilite", title: "Condition physique", description: "43 tests — mobilite, force, equilibre, souplesse.", duration: "15 min", available: false, href: "/onboarding/bilan-mobilite", icon: <Dumbbell className="w-5 h-5" />, color: "#3ECF8E" },
  { id: "nutrition", bilanType: "nutrition", title: "Nutrition", description: "Troubles digestifs & habitudes alimentaires.", duration: "12 min", available: true, href: "/onboarding/bilan-nutrition", icon: <Apple className="w-5 h-5" />, color: "#c9a96e" },
  { id: "sommeil", bilanType: "sommeil", title: "Sommeil", description: "Qualite & recuperation nocturne.", duration: "10 min", available: false, href: "/onboarding/bilan-sommeil", icon: <Moon className="w-5 h-5" />, color: "#a78bfa" },
  { id: "mental", bilanType: "mental", title: "Santé mentale", description: "Émotions, stress, résilience — 2 questionnaires.", duration: "25 min", available: false, href: "/onboarding/bilan-mental", icon: <Brain className="w-5 h-5" />, color: "#ef4444" },
]

/* Hidden defs for report lookup (emotionnel + stress saved separately in DB) */
const subBilanDefs = [
  { id: "emotionnel", bilanType: "emotionnel", title: "Santé émotionnelle", color: "#ff6b6b", icon: <Heart className="w-5 h-5" /> },
  { id: "stress", bilanType: "stress", title: "Gestion du stress", color: "#60a5fa", icon: <Wind className="w-5 h-5" /> },
]

interface BilanResult {
  id: string
  bilan_type: string
  global_score: number
  global_points: number
  max_points: number
  sub_scores: Record<string, { score: number; max: number; pct: number }>
  section_results: { sectionId: string; title: string; pct: number; score: number; maxScore: number; isDigestif?: boolean }[]
  report: {
    topActions?: { priority: number; action: string; sectionTitle: string; level: string }[]
    sectionReports?: {
      sectionId: string; title: string; pct: number; score: number; maxScore: number
      level: string; recommendationTitle: string; recommendationText: string; context: string
      triggeredInsights: { questionId: string; insight: string; recommendation: string }[]
      references: { authors: string; title: string; journal: string; year: number; doi?: string; pmid?: string }[]
    }[]
    globalInsights?: { title: string; description: string; reference: string }[]
    // New structured format
    strengths?: { sectionId: string; title: string; pct: number; praise: string; science: string; scienceNote?: string; reference: string }[]
    weaknesses?: { sectionId: string; title: string; pct: number; level: string; concern: string; science: string; reference: string; triggeredInsights: { questionId: string; insight: string; recommendation: string }[] }[]
    actionPlan?: { phase: number; phaseTitle: string; timeframe: string; actions: { action: string; why: string; sectionId: string }[] }[]
  }
  completed_at: string
  /* progression tracking */
  previous_score: number | null
  delta: number | null
  attempt: number
}

/* ─── section title overrides (so old saved data shows current labels) ─── */
const SECTION_TITLE_MAP: Record<string, string> = {
  // Sommeil
  'troubles-sommeil': 'Vos nuits',
  'qualite-impact': 'Comment vous dormez',
  'hygiene-sommeil': 'Vos habitudes avant de dormir',
  'profil-complementaire': 'Signaux à surveiller',
  // Stress
  'ghq-12': 'Bien-être mental',
  'cd-risc': 'Résilience mentale',
  'pss': 'Stress perçu',
  'fatigue': 'Niveau de fatigue',
  // Émotionnel
  'b-panas': 'État émotionnel',
  'satisfaction-vie': 'Satisfaction de vie',
  // Mobilité
  'mobilite-statique': 'Mobilité statique',
  'mobilite-active': 'Mobilité active',
  'proprioception': 'Proprioception',
  'gainage': 'Gainage',
  'prepa-physique': 'Prépa physique',
  // Digestif
  'reflux': 'Reflux',
  'douleurs-abdominales': 'Douleurs abdominales',
  'indigestion': 'Indigestion',
  'diarrhee': 'Diarrhée',
  'constipation': 'Constipation',
  // Nutrition (alimentaire)
  'habitudes-generales': 'Habitudes générales',
  'macronutriments': 'Macronutriments',
  'micronutriments': 'Micronutriments',
  'ultra-transformes': 'Ultra-transformés',
  'inflammatoire': 'Inflammatoire',
  'bonus-sante': 'Bonus santé',
}
function sectionTitle(id: string, fallback: string) {
  return SECTION_TITLE_MAP[id] ?? fallback
}

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8) // 8h-20h compact
const H_PX = 44 // px per hour — compact

/* ─── small components ─── */
function ScoreRing({ value, size = 56 }: { value: number; size?: number }) {
  const r = (size - 8) / 2, circ = 2 * Math.PI * r, fill = (value / 100) * circ
  const color = value >= 75 ? "#3ECF8E" : value >= 50 ? "#c9a96e" : "#ff6b6b"
  return (
    <svg width={size} height={size} className="shrink-0" style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e8ebe9" strokeWidth={3} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={3} strokeDasharray={`${fill} ${circ}`} strokeLinecap="round" />
      <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="middle" fill={color} fontSize={size > 44 ? 13 : 11} fontWeight={700} style={{ transform: "rotate(90deg)", transformOrigin: `${size / 2}px ${size / 2}px` }}>{value}</text>
    </svg>
  )
}

function SectionHeader({ title, subtitle, gold }: { title: string; subtitle: string; gold?: boolean }) {
  return (
    <div className="mb-6">
      <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-[#1a1a1a]">{title}{gold && <span className="inline-block w-8 h-[2px] bg-gradient-to-r from-[#c9a96e] to-[#c9a96e]/0 ml-3 align-middle rounded-full" />}</h2>
      <p className="text-[13px] text-[#1a1a1a]/40 mt-1">{subtitle}</p>
    </div>
  )
}

/* ─── page ─── */
export default function BilansPage() {
  const router = useRouter()
  const [calView, setCalView] = useState<CalView>("week")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [bilanResults, setBilanResults] = useState<BilanResult[]>([])
  const [expandedReport, setExpandedReport] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [sessions, setSessions] = useState<Session[]>([])
  const [modal, setModal] = useState<{ open: boolean; date: Date | null }>({ open: false, date: null })
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null)
  const [newSession, setNewSession] = useState({ type: "sport" as "evo" | "sport", label: "", duration: 45, notes: "", time: "09:00", isWeekly: false })
  const [calendarConnected, setCalendarConnected] = useState(false)
  const [calendarEmail, setCalendarEmail] = useState<string | null>(null)
  const [calendarLoading, setCalendarLoading] = useState(true)
  const [calendarWorking, setCalendarWorking] = useState(false)
  const [calendarError, setCalendarError] = useState<string | null>(null)
  const [googleEvents, setGoogleEvents] = useState<Session[]>([])
  const [syncingEvents, setSyncingEvents] = useState(false)
  const [calFilters, setCalFilters] = useState({ evo: true, sport: true, google: true })
  const [userName, setUserName] = useState<string | null>(null)
  const [userAge, setUserAge] = useState<number | null>(null)
  const [userActivityFreq, setUserActivityFreq] = useState<string | null>(null)
  const [userDiet, setUserDiet] = useState<string | null>(null)
  const [userEvoUsage, setUserEvoUsage] = useState<string | null>(null)
  const [userWeeklyActivities, setUserWeeklyActivities] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  /* ── drag & drop ── */
  const sessionsHydratedRef = useRef(false)
  const persistSessionsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dragId = useRef<string | null>(null)
  const dragPayload = useRef<{ kind: "chip" | "session"; value: string } | null>(null)
  const [dragOverDay, setDragOverDay] = useState<string | null>(null)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)


  const getDraggedChipLabel = useCallback((e: React.DragEvent) => {
    if (dragPayload.current?.kind === "chip") return dragPayload.current.value.trim()
    if (e.dataTransfer.getData("application/evo-drag-kind") !== "chip") return ""
    return e.dataTransfer.getData("application/evo-chip").trim()
  }, [])

  const getDraggedSessionId = useCallback((e: React.DragEvent) => {
    if (dragPayload.current?.kind === "session") return dragPayload.current.value.trim()
    const customId = e.dataTransfer.getData("application/evo-session-id").trim()
    if (customId) return customId
    if (e.dataTransfer.getData("application/evo-drag-kind") === "session") {
      return (dragId.current || e.dataTransfer.getData("text/plain")).trim()
    }
    return ""
  }, [])

  const clearDragState = useCallback(() => {
    dragId.current = null
    dragPayload.current = null
  }, [])

  const resetModalState = useCallback(() => {
    setModal({ open: false, date: null })
    setEditingSessionId(null)
    setNewSession({ type: "sport", label: "", duration: 45, notes: "", time: "09:00", isWeekly: false })
  }, [])

  const openCreateModal = useCallback((date: Date, label = "") => {
    const nextDate = new Date(date)
    const hasExplicitTime = getHours(nextDate) !== 0 || getMinutes(nextDate) !== 0
    setEditingSessionId(null)
    setNewSession({
      type: "sport",
      label,
      duration: 45,
      notes: "",
      time: hasExplicitTime ? format(nextDate, "HH:mm") : "09:00",
      isWeekly: false,
    })
    setModal({ open: true, date: nextDate })
  }, [])

  const openEditModal = useCallback((session: Session) => {
    if (session.type === "google") return
    setEditingSessionId(session.id)
    setNewSession({
      type: session.type,
      label: session.label,
      duration: session.duration,
      notes: session.notes || "",
      time: format(session.date, "HH:mm"),
      isWeekly: false,
    })
    setModal({ open: true, date: new Date(session.date) })
  }, [])

  const updateModalDate = useCallback((value: string) => {
    if (!value) return
    setModal(prev => {
      if (!prev.date) return prev
      const [year, month, day] = value.split("-").map(Number)
      const nextDate = new Date(prev.date)
      nextDate.setFullYear(year, (month || 1) - 1, day || 1)
      return { ...prev, date: nextDate }
    })
  }, [])

  const getDateFromGridPointer = useCallback((clientY: number, element: HTMLElement, targetDate: Date) => {
    const rect = element.getBoundingClientRect()
    const y = clientY - rect.top
    const rawHours = 8 + y / H_PX
    const h = Math.max(8, Math.min(20, Math.floor(rawHours)))
    const rawMin = (rawHours - Math.floor(rawHours)) * 60
    const m = Math.min(45, Math.round(rawMin / 15) * 15)
    const nextDate = new Date(targetDate)
    nextDate.setHours(h, m, 0, 0)
    return nextDate
  }, [])

  const onTimeGridClick = useCallback((e: React.MouseEvent<HTMLElement>, targetDate: Date) => {
    const nextDate = getDateFromGridPointer(e.clientY, e.currentTarget, targetDate)
    openCreateModal(nextDate)
  }, [getDateFromGridPointer, openCreateModal])

  const onDragStart = useCallback((e: React.DragEvent, sessionId: string) => {
    dragId.current = sessionId
    dragPayload.current = { kind: "session", value: sessionId }
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("application/evo-drag-kind", "session")
    e.dataTransfer.setData("application/evo-session-id", sessionId)
    e.dataTransfer.setData("text/plain", sessionId)
    // ghost
    const el = e.currentTarget as HTMLElement
    if (el) { e.dataTransfer.setDragImage(el, el.offsetWidth / 2, 12) }
  }, [])

  const onDragOver = useCallback((e: React.DragEvent, dayKey: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverDay(dayKey)
  }, [])

  const onDragLeave = useCallback(() => { setDragOverDay(null) }, [])

  const onDrop = useCallback((e: React.DragEvent, targetDate: Date) => {
    e.preventDefault()
    setDragOverDay(null)
    const chipLabel = getDraggedChipLabel(e)
    if (chipLabel) {
      const nd = new Date(targetDate); nd.setHours(9, 0, 0, 0)
      setEditingSessionId(null)
      setNewSession({ type: "sport", label: chipLabel, duration: 45, notes: "", time: "09:00", isWeekly: false })
      setModal({ open: true, date: nd })
      clearDragState()
      return
    }
    const sid = getDraggedSessionId(e)
    if (!sid) return
    setSessions(prev => prev.map(s => {
      if (s.id !== sid) return s
      const nd = new Date(targetDate)
      nd.setHours(getHours(s.date), getMinutes(s.date), 0, 0)
      return { ...s, date: nd }
    }))
    clearDragState()
  }, [clearDragState, getDraggedChipLabel, getDraggedSessionId])

  /* drop with hour calculation from Y position */
  const onDropTime = useCallback((e: React.DragEvent, targetDate: Date) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOverDay(null)
    const rect = e.currentTarget.getBoundingClientRect()
    const y = e.clientY - rect.top
    const rawHours = 8 + y / H_PX
    const h = Math.max(8, Math.min(20, Math.floor(rawHours)))
    const rawMin = (rawHours - Math.floor(rawHours)) * 60
    const m = Math.min(45, Math.round(rawMin / 15) * 15)
    const chipLabel = getDraggedChipLabel(e)
    if (chipLabel) {
      const nd = new Date(targetDate); nd.setHours(h, m, 0, 0)
      const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
      setEditingSessionId(null)
      setNewSession({ type: "sport", label: chipLabel, duration: 45, notes: "", time: timeStr, isWeekly: false })
      setModal({ open: true, date: nd })
      clearDragState()
      return
    }
    const sid = getDraggedSessionId(e)
    if (!sid) return
    setSessions(prev => prev.map(s => {
      if (s.id !== sid) return s
      const nd = new Date(targetDate)
      nd.setHours(h, m, 0, 0)
      return { ...s, date: nd }
    }))
    clearDragState()
  }, [clearDragState, getDraggedChipLabel, getDraggedSessionId])

  /* ── google calendar ── */
  const fetchGoogleEvents = async (d: Date, forceSync = false) => {
    try {
      if (!isSupabaseConfigured || !supabase) return
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) return
      if (forceSync) { setSyncingEvents(true); await fetch("/api/calendar/google/sync", { method: "POST", headers: { Authorization: `Bearer ${session.access_token}` } }) }
      const timeMin = startOfMonth(d).toISOString(), timeMax = endOfMonth(d).toISOString()
      const res = await fetch(`/api/calendar/google/events?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}`, { headers: { Authorization: `Bearer ${session.access_token}` } })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` })) as { error?: string }
        setCalendarError(`Erreur Google Agenda : ${err.error ?? res.status}`)
        return
      }
      setCalendarError(null)
      const body = await res.json() as { events?: { id: string; summary: string; start: string; end: string; allDay: boolean }[] }
      setGoogleEvents((body.events ?? []).map(ev => ({ id: `g-${ev.id}`, date: parseISO(ev.start), type: "google" as const, label: ev.summary, duration: ev.allDay ? 0 : Math.round((new Date(ev.end).getTime() - new Date(ev.start).getTime()) / 60000) })))
    } catch (e) { setCalendarError(`Erreur : ${e instanceof Error ? e.message : 'inconnue'}`) } finally { setSyncingEvents(false) }
  }

  useEffect(() => {
    (async () => {
      try {
        if (!isSupabaseConfigured || !supabase) { setCalendarLoading(false); return }
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.access_token) { setCalendarLoading(false); return }
        const u = session.user
        const name = u?.user_metadata?.first_name || u?.user_metadata?.full_name?.split(' ')[0] || u?.user_metadata?.name?.split(' ')[0] || u?.email?.split('@')[0] || null
        if (name) setUserName(name.charAt(0).toUpperCase() + name.slice(1))
        const onb = u?.user_metadata?.evo_onboarding as Record<string, unknown> | undefined
        if (onb) {
          if (onb.age) setUserAge(Number(onb.age))
          if (onb.activityFrequency) setUserActivityFreq(onb.activityFrequency as string)
          if (onb.diet) setUserDiet(onb.diet as string)
          if (onb.evoUsage) setUserEvoUsage(onb.evoUsage as string)
          if (Array.isArray(onb.weeklyActivities)) setUserWeeklyActivities(onb.weeklyActivities as string[])
        } else {
          // Fallback to localStorage
          try {
            const cached = localStorage.getItem('evo_onboarding_data')
            if (cached) {
              const d = JSON.parse(cached) as Record<string, unknown>
              if (d.age) setUserAge(Number(d.age))
              if (d.activityFrequency) setUserActivityFreq(d.activityFrequency as string)
              if (d.diet) setUserDiet(d.diet as string)
              if (d.evoUsage) setUserEvoUsage(d.evoUsage as string)
              if (Array.isArray(d.weeklyActivities)) setUserWeeklyActivities(d.weeklyActivities as string[])
            }
          } catch { /* ignore */ }
        }

        const metadataSessions = (u?.user_metadata?.evo_onboarding as { agendaSessions?: StoredSession[] } | undefined)?.agendaSessions
        const localSessionsRaw = typeof window !== "undefined" ? localStorage.getItem("evo_planning_sessions") : null
        const localSessions = localSessionsRaw ? (JSON.parse(localSessionsRaw) as StoredSession[]) : null
        const baseSessions = Array.isArray(metadataSessions) && metadataSessions.length > 0 ? metadataSessions : Array.isArray(localSessions) ? localSessions : []
        if (baseSessions.length > 0) {
          const parsed = baseSessions
            .map((s) => ({ ...s, date: parseISO(s.date), type: s.type as "evo" | "sport" }))
            .filter((s) => !Number.isNaN(s.date.getTime()))
          if (parsed.length > 0) {
            setSessions(parsed)
          }
        }
        sessionsHydratedRef.current = true

        // Fetch calendar status
        const r = await fetch("/api/calendar/google/status", { headers: { Authorization: `Bearer ${session.access_token}` } })
        const body = await r.json() as { connected?: boolean; email?: string | null }
        const c = Boolean(body.connected); setCalendarConnected(c); setCalendarEmail(body.email ?? null)
        if (c) fetchGoogleEvents(currentDate)
        // Fetch bilan results
        try {
          const br = await fetch("/api/bilan/results", { headers: { Authorization: `Bearer ${session.access_token}` } })
          if (br.ok) {
            const brBody = await br.json() as { results?: BilanResult[] }
            if (brBody.results) setBilanResults(brBody.results)
          }
        } catch { /* bilan results fetch failed — not critical */ }
      } catch {} finally { setCalendarLoading(false) }
    })()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    localStorage.setItem(
      "evo_planning_sessions",
      JSON.stringify(
        sessions.map((session) => ({
          ...session,
          date: session.date.toISOString(),
        }))
      )
    )
  }, [sessions])

  useEffect(() => {
    if (!sessionsHydratedRef.current || !isSupabaseConfigured || !supabase) return
    const sb = supabase

    if (persistSessionsTimeoutRef.current) {
      clearTimeout(persistSessionsTimeoutRef.current)
    }

    persistSessionsTimeoutRef.current = setTimeout(async () => {
      try {
        const { data: { session } } = await sb.auth.getSession()
        if (!session?.user) return

        const existingOnboarding =
          (session.user.user_metadata?.evo_onboarding as Record<string, unknown> | undefined) ?? {}

        const nextOnboarding = {
          ...existingOnboarding,
          agendaSessions: sessions.map((storedSession) => ({
            ...storedSession,
            date: storedSession.date.toISOString(),
          })),
        }

        await sb.auth.updateUser({
          data: {
            ...session.user.user_metadata,
            evo_onboarding: nextOnboarding,
          },
        })

        await upsertProfile({
          id: session.user.id,
          first_name: (session.user.user_metadata?.first_name as string | undefined) || '',
          onboarding_data: nextOnboarding,
          onboarding_completed_at:
            (existingOnboarding.completedAt as string | undefined) ?? null,
        })
      } catch (error) {
        console.warn("Failed to persist planning sessions to Supabase:", error)
      }
    }, 500)

    return () => {
      if (persistSessionsTimeoutRef.current) {
        clearTimeout(persistSessionsTimeoutRef.current)
      }
    }
  }, [sessions])

  useEffect(() => { if (calendarConnected) fetchGoogleEvents(currentDate) }, [currentDate, calendarConnected]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleConnectCalendar = async () => {
    try {
      setCalendarError(null); setCalendarWorking(true)
      if (!isSupabaseConfigured || !supabase) return
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) { router.push("/onboarding/login"); return }
      const r = await fetch("/api/calendar/google/connect", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` }, body: JSON.stringify({ next: "/onboarding/bilans" }) })
      const body = await r.json() as { url?: string; error?: string }
      if (body.url) window.location.href = body.url; else setCalendarError(body.error || "Connexion impossible.")
    } catch { setCalendarError("Connexion impossible.") } finally { setCalendarWorking(false) }
  }

  /* ── derived ── */
  const allSessions = useMemo(() => [...sessions, ...googleEvents], [sessions, googleEvents])
  const sessionsOnDay = (d: Date) => allSessions.filter(s => isSameDay(s.date, d) && calFilters[s.type])
  const monthDays = eachDayOfInterval({ start: startOfMonth(currentDate), end: endOfMonth(currentDate) })
  const firstDow = (startOfMonth(currentDate).getDay() + 6) % 7
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const addSessionHandler = () => {
    if (!modal.date || !newSession.label) return
    const d = new Date(modal.date)
    const [hours, minutes] = newSession.time.split(":").map(Number)
    d.setHours(Number.isFinite(hours) ? hours : 9, Number.isFinite(minutes) ? minutes : 0, 0, 0)
    if (editingSessionId) {
      setSessions(prev => prev.map(session =>
        session.id === editingSessionId
          ? { ...session, date: d, type: newSession.type, label: newSession.label, duration: newSession.duration, notes: newSession.notes }
          : session
      ))
    } else if (newSession.isWeekly) {
      const newSessions = Array.from({ length: 12 }, (_, i) => ({
        id: `${Date.now()}-${i}`,
        date: addWeeks(d, i),
        type: newSession.type,
        label: newSession.label,
        duration: newSession.duration,
        notes: newSession.notes,
      }))
      setSessions(prev => [...prev, ...newSessions])
    } else {
      setSessions(prev => [...prev, { id: Date.now().toString(), date: d, type: newSession.type, label: newSession.label, duration: newSession.duration, notes: newSession.notes }])
    }
    resetModalState()
  }

  const navigate = (dir: -1 | 1) => {
    if (calView === "month") setCurrentDate(dir === 1 ? addMonths(currentDate, 1) : subMonths(currentDate, 1))
    else if (calView === "week") setCurrentDate(dir === 1 ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1))
    else setCurrentDate(dir === 1 ? addDays(currentDate, 1) : subDays(currentDate, 1))
  }

  const calTitle = calView === "month" ? format(currentDate, "MMMM yyyy", { locale: fr }) : calView === "week" ? `${format(weekStart, "d MMM", { locale: fr })} — ${format(addDays(weekStart, 6), "d MMM yyyy", { locale: fr })}` : format(currentDate, "EEEE d MMMM yyyy", { locale: fr })

  const last = progressData[progressData.length - 1]
  const sessionTop = (s: Session) => Math.max(0, (getHours(s.date) - 8 + getMinutes(s.date) / 60) * H_PX)
  const sessionHeight = (s: Session) => Math.max(18, (s.duration / 60) * H_PX)
  const isDraggable = (s: Session) => s.type !== "google" // only local sessions

  const sections = [
    { id: "dashboard", label: "Dashboard", icon: <TrendingUp className="w-4 h-4" /> },
    { id: "bilans", label: "Bilans", icon: <ClipboardList className="w-4 h-4" /> },
    ...(bilanResults.length > 0 ? [{ id: "compte-rendu", label: "Rapport", icon: <Microscope className="w-4 h-4" /> }] : []),
    { id: "planning", label: "Planning", icon: <Calendar className="w-4 h-4" /> },
    { id: "science", label: "Science", icon: <FlaskConical className="w-4 h-4" /> },
  ]

  const viewOptions: { id: CalView; icon: React.ReactNode; label: string }[] = [
    { id: "week", icon: <Columns3 className="w-3.5 h-3.5" />, label: "Semaine" },
    { id: "month", icon: <LayoutGrid className="w-3.5 h-3.5" />, label: "Mois" },
    { id: "day", icon: <CalendarDays className="w-3.5 h-3.5" />, label: "Jour" },
  ]

  /* ── Bilan options with real scores from DB ── */
  const bilanOptions = useMemo(() => {
    return bilanOptionsDefs.map(def => {
      if (def.bilanType === 'mental') {
        const emo = bilanResults.find(r => r.bilan_type === 'emotionnel')
        const str = bilanResults.find(r => r.bilan_type === 'stress')
        const scores = [emo?.global_score, str?.global_score].filter((s): s is number => s != null)
        const score = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null
        const deltas = [emo?.delta, str?.delta].filter((d): d is number => d != null)
        const delta = deltas.length > 0 ? Math.round(deltas.reduce((a, b) => a + b, 0) / deltas.length) : null
        const attempt = Math.max(emo?.attempt ?? 1, str?.attempt ?? 1)
        return { ...def, score, delta, attempt }
      }
      const result = bilanResults.find(r => r.bilan_type === def.bilanType)
      return {
        ...def,
        score: result ? result.global_score : null,
        delta: result?.delta ?? null,
        attempt: result?.attempt ?? 1,
      }
    })
  }, [bilanResults])

  /* ── Calculate completion percentage instead of score average ── */
  const completedBilans = bilanOptions.filter(b => b.score !== null).length
  const totalBilans = bilanOptions.length
  const globalScore = totalBilans > 0 ? Math.round((completedBilans / totalBilans) * 100) : 0

  /* ── Score cards (fed by bilans) ── */
  const mobiliteScore = bilanResults.find(r => r.bilan_type === "mobilite")?.global_score ?? null
  const nutritionScore = bilanResults.find(r => r.bilan_type === "nutrition")?.global_score ?? null
  const sommeilScore = bilanResults.find(r => r.bilan_type === "sommeil")?.global_score ?? null
  const mentalScores = [bilanResults.find(r => r.bilan_type === "emotionnel")?.global_score, bilanResults.find(r => r.bilan_type === "stress")?.global_score].filter((s): s is number => s != null)
  const mentalScore = mentalScores.length > 0 ? Math.round(mentalScores.reduce((a, b) => a + b, 0) / mentalScores.length) : null
  const scoreCards = [
    { label: "Mobilite", score: mobiliteScore, icon: <Activity className="w-5 h-5" />, color: "#3ECF8E" },
    { label: "Nutrition", score: nutritionScore, icon: <Apple className="w-5 h-5" />, color: "#c9a96e" },
    { label: "Sommeil", score: sommeilScore, icon: <Moon className="w-5 h-5" />, color: "#a78bfa" },
    { label: "Mental", score: mentalScore, icon: <Brain className="w-5 h-5" />, color: "#ef4444" },
  ]

  /* ── Profile label helpers ── */
  const shortActivityFreq = (v: string) => {
    if (v.includes('Jamais')) return 'Jamais'
    if (v.includes('régulièrement')) return 'Irrégulier'
    if (v.includes('1 fois')) return '1×/semaine'
    if (v.includes('2 fois')) return '2×/semaine'
    if (v.includes('3 fois')) return '3×/semaine ou +'
    return v
  }
  const shortDiet = (v: string) => {
    if (v.startsWith('Omnivore')) return 'Omnivore'
    if (v.includes('Intolérance')) return 'Intolérances'
    if (v.includes('Autre')) return 'Régime spécifique'
    return v
  }
  const shortEvoUsage = (v: string) => {
    if (v.includes('programme principal')) return 'Programme principal'
    if (v.includes('compléter')) return 'En complément'
    if (v.includes('questions')) return 'Questions longévité'
    return v
  }

  /* ── Active report for display ── */
  const activeReport = useMemo(() => {
    if (!expandedReport) return null
    return bilanResults.find(r => r.bilan_type === expandedReport) ?? null
  }, [expandedReport, bilanResults])

  return (
    <div className="min-h-screen bg-[#fafbfa]">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 right-0 w-[700px] h-[700px] rounded-full opacity-[0.06]" style={{ background: "radial-gradient(circle, #3ECF8E 0%, transparent 60%)" }} />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, #c9a96e 0%, transparent 60%)" }} />
      </div>

      {/* ════════ HERO KPIs ════════ */}
      <section id="dashboard">
        <div className="relative overflow-hidden bg-[#0a0a0a]">
          {/* animated gradient blobs — dynamic */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className={`absolute w-[700px] h-[700px] rounded-full ${css.heroBlob1}`} style={{ top: "-20%", right: "-15%", background: "radial-gradient(circle, #c9a96e 0%, transparent 65%)", filter: "blur(100px)", opacity: 0.12 }} />
            <div className={`absolute w-[600px] h-[600px] rounded-full ${css.heroBlob2}`} style={{ bottom: "-20%", left: "-15%", background: "radial-gradient(circle, #3ECF8E 0%, transparent 65%)", filter: "blur(90px)", opacity: 0.10 }} />
            <div className={`absolute w-[400px] h-[400px] rounded-full ${css.heroBlob3}`} style={{ top: "30%", left: "50%", background: "radial-gradient(circle, #6366f1 0%, transparent 65%)", filter: "blur(100px)", opacity: 0.06 }} />
            {/* mesh gradient overlay */}
            <div className={`absolute w-[900px] h-[900px] ${css.heroMesh}`} style={{ top: "-30%", right: "-20%", background: "conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(201,169,110,0.04) 60deg, transparent 120deg, rgba(62,207,142,0.03) 200deg, transparent 280deg, rgba(99,102,241,0.02) 340deg, transparent 360deg)" }} />
          </div>
          {/* subtle noise texture */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.015]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
          {/* ─── nav inside hero ─── */}
          <nav className="sticky top-0 z-30 border-b border-white/[0.06] bg-black/40 backdrop-blur-2xl">
            <div className="max-w-5xl mx-auto px-4 py-3 sm:px-6 sm:h-14 sm:py-0 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center justify-between gap-3">
                <Link href="/" className="text-xl font-light tracking-wide text-white/80">evo</Link>
                <div className="flex items-center gap-2 sm:hidden">
                  <ScoreRing value={globalScore} size={38} />
                  <button
                    onClick={async () => { await supabase?.auth.signOut(); router.replace('/') }}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/[0.08] transition-all"
                    title="Se déconnecter"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar bg-white/[0.06] rounded-lg p-0.5">
                {sections.map(s => (
                  <a key={s.id} href={`#${s.id}`} onClick={e => { e.preventDefault(); document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" }) }}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] sm:text-[13px] font-medium transition-all text-white/45 hover:text-white hover:bg-white/[0.08]">
                    {s.icon}<span>{s.label}</span>
                  </a>
                ))}
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <ScoreRing value={globalScore} size={40} />
                <button
                  onClick={async () => { await supabase?.auth.signOut(); router.replace('/') }}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/[0.08] transition-all"
                  title="Se déconnecter"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </nav>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10 pb-14">
            {/* greeting */}
            <div className="flex flex-col gap-1 mb-6 sm:mb-8 sm:flex-row sm:items-center text-center sm:text-left items-center sm:items-stretch">
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#c9a96e]/90">{userName ? `Bonjour ${userName}` : "Ton espace santé"}</p>
              <span className="hidden sm:block flex-1 h-px bg-white/[0.08]" />
              <span className="text-[12px] text-white/40 font-medium">{format(new Date(), "d MMMM yyyy", { locale: fr })}</span>
            </div>

            <div className="flex flex-col gap-5 lg:flex-row lg:gap-10 lg:items-start">
              {/* ── Left: profile block ── */}
              <div className="shrink-0 w-full lg:w-[240px] rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 sm:p-5 lg:border-0 lg:bg-transparent lg:p-0 flex flex-col items-center lg:items-start">
                {/* Ages side by side — big & centered on mobile */}
                <div className="flex items-start gap-6 sm:gap-5 mb-6 justify-center lg:justify-start">
                  <div className="text-center lg:text-left">
                    <p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.18em] text-white/30 mb-2">Âge réel</p>
                    <div className="flex items-baseline gap-1 justify-center lg:justify-start">
                      <span className="text-[64px] sm:text-[56px] lg:text-[42px] leading-none font-extrabold text-white tracking-tight">{userAge ?? '—'}</span>
                      {userAge && <span className="text-[18px] sm:text-[16px] lg:text-base text-white/40 font-medium">ans</span>}
                    </div>
                  </div>
                  <div className="w-px self-stretch bg-white/[0.08] mx-1" />
                  <div className="text-center lg:text-left">
                    <p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.18em] text-white/30 mb-2">Âge bio</p>
                    <div className="flex items-baseline gap-1 justify-center lg:justify-start">
                      <span className="text-[64px] sm:text-[56px] lg:text-[42px] leading-none font-extrabold text-white/10 blur-[5px] select-none tracking-tight">00</span>
                      <span className="text-[18px] sm:text-[16px] lg:text-base text-white/10 blur-[4px]">ans</span>
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-white/20 mt-1 text-center lg:text-left">Bientôt</p>
                  </div>
                </div>

                {/* Profile chips */}
                <div className="space-y-2 w-full">
                  {userActivityFreq && (
                    <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.07]">
                      <Activity className="w-4 h-4 shrink-0" style={{ color: '#3ECF8E' }} />
                      <span className="text-[12px] text-white/80 font-medium truncate">{shortActivityFreq(userActivityFreq)}</span>
                    </div>
                  )}
                  {userDiet && (
                    <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.07]">
                      <Apple className="w-4 h-4 shrink-0" style={{ color: '#c9a96e' }} />
                      <span className="text-[12px] text-white/80 font-medium truncate">{shortDiet(userDiet)}</span>
                    </div>
                  )}
                  {userEvoUsage && (
                    <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.07]">
                      <Zap className="w-4 h-4 shrink-0" style={{ color: '#a78bfa' }} />
                      <span className="text-[12px] text-white/80 font-medium truncate">{shortEvoUsage(userEvoUsage)}</span>
                    </div>
                  )}
                </div>

                {/* WhatsApp CTA — gros bouton sur mobile */}
                <div className="mt-5 w-full">
                  <a href="https://wa.me/message/QTBSFJSLI3PKN1" target="_blank" rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-3 px-4 py-4 lg:py-2.5 lg:px-3 rounded-2xl lg:rounded-full bg-[#25D366]/15 border border-[#25D366]/30 hover:bg-[#25D366]/25 active:scale-[0.98] transition-all group/wa">
                    <div className="w-9 h-9 lg:w-5 lg:h-5 rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
                      <svg width="16" height="16" className="lg:w-[10px] lg:h-[10px]" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    </div>
                    <div className="text-left">
                      <p className="text-[15px] lg:text-[12px] font-bold text-white/90 group-hover/wa:text-white transition-colors leading-tight">Une question ?</p>
                      <p className="text-[12px] lg:hidden text-[#25D366]/80 font-medium">Contacte-nous sur WhatsApp</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* ── Right: score cards ── */}
              <div className="flex-1 min-w-0 flex flex-col gap-2 lg:gap-3">
                {/* Nutrition — carte principale */}
                <div
                  className={`${css.kpiCard} relative rounded-2xl p-4 sm:p-5 overflow-hidden border cursor-pointer`}
                  style={{ background: nutritionScore !== null ? 'rgba(201,169,110,0.07)' : 'rgba(255,255,255,0.04)', borderColor: nutritionScore !== null ? 'rgba(201,169,110,0.22)' : 'rgba(255,255,255,0.08)' }}
                  onClick={() => router.push('/onboarding/bilan-nutrition')}
                >
                  <div className={css.kpiShimmer}><div /></div>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4">
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <div className={`${css.kpiIcon} w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0`} style={{ background: 'rgba(201,169,110,0.12)', color: '#c9a96e' }}>
                        <Apple className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/35 mb-1">Nutrition</p>
                        {nutritionScore !== null ? (
                          <div className="flex items-baseline gap-1">
                            <span className={`${css.kpiValue} text-4xl sm:text-3xl font-bold text-white`}>{nutritionScore}</span>
                            <span className="text-sm text-white/30">/100</span>
                          </div>
                        ) : (
                          <p className="text-[15px] sm:text-[14px] text-white/70 font-medium leading-tight">Questionnaire disponible</p>
                        )}
                      </div>
                    </div>
                    <div className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold transition-all" style={{ color: '#c9a96e', background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.2)' }}>
                      {nutritionScore !== null ? 'Rapport' : 'Commencer'}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                {/* 3 autres cartes — toujours visibles, compactes sur mobile */}
                <div className="grid grid-cols-3 gap-2 lg:gap-3 lg:grid-cols-3">
                  {scoreCards.filter(c => c.label !== "Nutrition").map((card, i) => (
                    <div key={i} className={`${css.kpiCard} relative rounded-2xl p-3 lg:p-3.5 text-center overflow-hidden border`} style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}>
                      <div className={`${css.kpiIcon} w-8 h-8 lg:w-8 lg:h-8 rounded-xl lg:rounded-lg flex items-center justify-center mb-2 mx-auto`} style={{ background: 'rgba(255,255,255,0.05)', color: card.color }}>
                        <span className="scale-90 lg:scale-100">{card.icon}</span>
                      </div>
                      <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-white/35 leading-tight">{card.label}</p>
                      <p className="mt-1.5 text-[13px] lg:text-[14px] font-semibold text-white/80">
                        {card.score !== null ? `${card.score}/100` : 'Bientôt'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* clean edge + glow */}
          <div className="relative">
            <div className="h-px bg-gradient-to-r from-transparent via-[#c9a96e]/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-24 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(10,10,10,0.6) 0%, transparent 100%)", transform: "translateY(100%)" }} />
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 pt-14 pb-10 space-y-20">

        {/* ════════ BILANS ════════ */}
        <section id="bilans" className="scroll-mt-20">
          <SectionHeader title="Tes bilans" subtitle="1 bilan disponible aujourd'hui — les autres arrivent bientôt" gold />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {bilanOptions.map(bilan => {
              const completed = bilan.score !== null
              const isPriorityNutrition = bilan.bilanType === 'nutrition' && !completed && bilan.available
              // Compute progress % from localStorage for in-progress bilans
              // Only read localStorage after mount to avoid hydration mismatch
              let pct = completed ? 100 : 0
              if (mounted && !completed && bilan.available) {
                if (bilan.bilanType === 'mental') {
                  const emoQ = BILAN_TOTAL_QUESTIONS['emotionnel'] ?? 55
                  const strQ = BILAN_TOTAL_QUESTIONS['stress'] ?? 40
                  const emoPct = getProgressPercent('emotionnel', emoQ)
                  const strPct = getProgressPercent('stress', strQ)
                  if (emoPct > 0 || strPct > 0) {
                    pct = Math.round((emoPct + strPct) / 2)
                  }
                } else {
                  const totalQ = BILAN_TOTAL_QUESTIONS[bilan.bilanType] ?? 0
                  if (totalQ > 0) {
                    pct = getProgressPercent(bilan.bilanType, totalQ)
                  }
                }
              }
              const inProgress = !completed && pct > 0
              const c = bilan.color
              return (
                <div key={bilan.id} onClick={() => {
                  if (!bilan.available) return
                  if (completed && bilan.bilanType !== 'mental') {
                    setExpandedReport(bilan.bilanType)
                    setTimeout(() => document.getElementById('compte-rendu')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
                  } else if (bilan.available) {
                    router.push(bilan.href)
                  }
                }}
                  className={`relative rounded-xl border p-4 transition-all duration-300 flex flex-col items-center text-center group/bilan ${
                    bilan.available
                      ? "bg-white hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                      : "bg-[#f9f9f9] opacity-50 cursor-default"
                  }`}
                  style={{ borderColor: bilan.available ? `${c}45` : '#e5e5e5' }}>
                  <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl" style={{ background: `linear-gradient(to right, transparent, ${c}${bilan.available ? '66' : '33'}, transparent)` }} />
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-all duration-300 group-hover/bilan:scale-110"
                    style={{ background: `${c}15`, color: c }}>
                    {bilan.icon}
                  </div>
                  <h3 className={`text-[13px] font-medium mb-1 leading-tight ${!bilan.available ? "text-[#1a1a1a]/60" : "text-[#1a1a1a]"}`}>{bilan.title}</h3>
                  {isPriorityNutrition && (
                    <span className="inline-flex items-center gap-1 mb-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]" />
                      <span className="text-[10px] text-[#1a1a1a]/40">Disponible</span>
                    </span>
                  )}
                  {completed && bilan.score !== null && bilan.available ? (
                    <div className="flex flex-col items-center gap-1 mt-1">
                      <ScoreRing value={bilan.score} size={44} />
                      {bilan.delta !== null && bilan.delta !== 0 && (
                        <span className={`text-[10px] font-bold ${bilan.delta > 0 ? 'text-emerald-500' : 'text-red-400'}`}>
                          {bilan.delta > 0 ? '+' : ''}{bilan.delta} pts vs v{(bilan.attempt ?? 2) - 1}
                        </span>
                      )}
                      <span className="text-[10px] font-medium flex items-center gap-1 mt-0.5 transition-colors" style={{ color: c }}>{bilan.bilanType === 'mental' ? 'Voir les tests' : 'Voir le rapport'} <ArrowRight className="w-3 h-3" /></span>
                      <button
                        onClick={(e) => { e.stopPropagation(); clearProgress(bilan.bilanType === 'mental' ? 'emotionnel' : bilan.bilanType); if (bilan.bilanType === 'mental') clearProgress('stress'); router.push(bilan.href) }}
                        className="text-[9px] font-medium px-2 py-0.5 rounded-md mt-0.5 transition-all hover:scale-105"
                        style={{ color: `${c}aa`, background: `${c}10`, border: `1px solid ${c}20` }}>
                        <RefreshCw className="w-2.5 h-2.5 inline mr-0.5 -mt-px" />Refaire (v{(bilan.attempt ?? 1) + 1})
                      </button>
                    </div>
                  ) : bilan.available ? (
                    <div className="flex flex-col items-center gap-1.5 mt-1">
                      <span
                        className="text-[10px] font-semibold px-2.5 py-1 rounded-md"
                        style={{ color: c, background: `${c}15` }}
                      >
                        {inProgress ? `${pct}% complété` : bilan.duration}
                      </span>
                      <span className="text-[11px] font-medium flex items-center gap-1 transition-colors" style={{ color: c }}>
                        {inProgress ? 'Reprendre' : 'Decouvre ton score'}
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 mt-2">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg animate-pulse" style={{ background: `${c}12`, border: `1px dashed ${c}25` }}>
                        <Zap className="w-3.5 h-3.5" style={{ color: c }} />
                        <span className="text-[11px] font-bold" style={{ color: c }}>Arrive bientot !</span>
                      </div>
                      <p className="text-[10px] text-[#1a1a1a]/35 mt-1 leading-relaxed px-1">{bilan.description.split('.')[0]}</p>
                    </div>
                  )}
                  {bilan.available && (completed || inProgress) && (
                    <div className="w-full mt-3">
                      <div className="rounded-full h-1" style={{ background: `${c}0a` }}>
                        <div className="h-1 rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: (completed || inProgress) ? c : "transparent" }} />
                      </div>
                      <p className="text-[10px] text-[#1a1a1a]/25 font-medium mt-1">{pct}%</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* ════════ COMPTE-RENDU / REPORT ════════ */}
        {bilanResults.some(r => bilanOptionsDefs.find(d => d.bilanType === r.bilan_type && d.available)) && (
          <section id="compte-rendu" className="scroll-mt-20">
            <SectionHeader title="Compte-rendu" subtitle="Bilan global, connaissances scientifiques & prochaines etapes" gold />

            {/* ── Report cards per bilan ── */}
            <div className="space-y-4">
              {[...bilanResults]
                .filter(r => bilanOptionsDefs.find(d => d.bilanType === r.bilan_type && d.available))
                .sort((a, b) => {
                  const order = bilanOptionsDefs.map(d => d.bilanType)
                  return (order.indexOf(a.bilan_type) ?? 99) - (order.indexOf(b.bilan_type) ?? 99)
                })
                .map(result => {
                const def = bilanOptionsDefs.find(d => d.bilanType === result.bilan_type) || subBilanDefs.find(d => d.bilanType === result.bilan_type)
                if (!def) return null
                const isOpen = expandedReport === result.bilan_type
                const report = result.report
                const subScores = result.sub_scores
                const levelColor = (level: string) => {
                  if (level === 'alerte') return { bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-100 text-red-700', dot: 'bg-red-400' }
                  if (level === 'vigilance') return { bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-400' }
                  if (level === 'bon') return { bg: 'bg-emerald-50', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-400' }
                  return { bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700', dot: 'bg-blue-400' }
                }
                return (
                  <div key={result.bilan_type} className="bg-white rounded-2xl border border-[#1a1a1a]/[0.08] overflow-hidden">
                    {/* ── Report header with score ── */}
                    <button
                      onClick={() => setExpandedReport(isOpen ? null : result.bilan_type)}
                      className="w-full text-left px-6 py-5 flex items-center gap-4 hover:bg-[#1a1a1a]/[0.02] transition-colors"
                    >
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${def.color}15`, color: def.color }}>
                        {def.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="text-base font-semibold text-[#1a1a1a]">{def.title}</h3>
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full" style={{ color: def.color, background: `${def.color}15` }}>
                            {result.global_score}%
                          </span>
                        </div>
                        <p className="text-xs text-[#1a1a1a]/40">
                          {result.global_points}/{result.max_points} pts
                          {subScores?.digestif && subScores?.alimentaire && (
                            <> · Digestif {subScores.digestif.pct}% · Alimentaire {subScores.alimentaire.pct}%</>
                          )}
                        </p>
                      </div>
                      <ScoreRing value={result.global_score} size={48} />
                      <div className={`w-6 h-6 flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}>
                        <ChevronRight className="w-4 h-4 text-[#1a1a1a]/30" />
                      </div>
                    </button>

                    {/* ── Expanded report ── */}
                    {isOpen && report && (
                      <div className="px-6 pb-6 space-y-6 animate-fade-in border-t border-[#1a1a1a]/[0.06]">

                        {/* ═══ NEW FORMAT: exact mirror of ResultsScreen ═══ */}
                        {report.strengths && report.weaknesses && report.actionPlan ? (
                          <>
                            {/* Sub-score cards — same style as ResultsScreen */}
                            {subScores?.digestif && subScores?.alimentaire && (
                              <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white border border-[#1a1a1a]/[0.07] rounded-xl px-4 py-3">
                                  <div className="flex items-center gap-2 mb-1">
                                    <div className="w-6 h-6 rounded-lg bg-[#2D6A4F]/10 flex items-center justify-center text-[#2D6A4F]/70 flex-shrink-0">
                                      <Activity className="w-3.5 h-3.5" />
                                    </div>
                                    <p className="text-xs font-semibold text-[#1a1a1a]">Digestif</p>
                                  </div>
                                  <p className="text-2xl font-bold text-blue-500">{subScores.digestif.pct}%</p>
                                  <div className="h-1 bg-[#1a1a1a]/[0.05] rounded-full mt-1.5 overflow-hidden">
                                    <div className="h-full rounded-full bg-blue-400 transition-all duration-700" style={{ width: `${subScores.digestif.pct}%` }} />
                                  </div>
                                </div>
                                <div className="bg-white border border-[#1a1a1a]/[0.07] rounded-xl px-4 py-3">
                                  <div className="flex items-center gap-2 mb-1">
                                    <div className="w-6 h-6 rounded-lg bg-[#c9a96e]/10 flex items-center justify-center text-[#c9a96e]/70 flex-shrink-0">
                                      <Apple className="w-3.5 h-3.5" />
                                    </div>
                                    <p className="text-xs font-semibold text-[#1a1a1a]">Alimentaire</p>
                                  </div>
                                  <p className="text-2xl font-bold text-blue-500">{subScores.alimentaire.pct}%</p>
                                  <div className="h-1 bg-[#1a1a1a]/[0.05] rounded-full mt-1.5 overflow-hidden">
                                    <div className="h-full rounded-full bg-blue-400 transition-all duration-700" style={{ width: `${subScores.alimentaire.pct}%` }} />
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Strengths — alimentaire only, max 3 */}
                            {(() => {
                              const digestifIds = new Set(digestifSections.map(s => s.id))
                              const alimentaireStrengths = report.strengths!.filter(s => !digestifIds.has(s.sectionId)).slice(0, 3)
                              return alimentaireStrengths.length > 0 ? (
                                <div>
                                  <div className="flex items-center gap-2 mb-4">
                                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                                    </div>
                                    <h4 className="text-sm font-bold text-[#1a1a1a]">Ce qui va bien</h4>
                                  </div>
                                  <div className="space-y-3">
                                    {alimentaireStrengths.map(s => (
                                      <div key={s.sectionId} className="relative pl-4 border-l-2 border-emerald-300">
                                        <p className="text-sm font-semibold text-[#1a1a1a] mb-0.5">{sectionTitle(s.sectionId, s.title)}</p>
                                        <p className="text-xs text-[#1a1a1a]/55 leading-relaxed">{s.scienceNote ?? s.science}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ) : null
                            })()}

                            {/* Weaknesses — split alimentaire / digestif */}
                            {report.weaknesses.length > 0 && (() => {
                              const digestifIds = new Set(digestifSections.map(s => s.id))
                              const alimentaireW = report.weaknesses!.filter(w => !digestifIds.has(w.sectionId))
                              const digestifW = report.weaknesses!.filter(w => digestifIds.has(w.sectionId) && w.pct < 50)
                              return (
                                <div>
                                  <div className="flex items-center gap-2 mb-4">
                                    <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                                    </div>
                                    <h4 className="text-sm font-bold text-[#1a1a1a]">Ce qu&apos;on peut améliorer</h4>
                                  </div>
                                  <div className="space-y-4">
                                    {alimentaireW.map(w => {
                                      const isExpW = expandedSections.has(`w-${w.sectionId}`)
                                      return (
                                        <div key={w.sectionId} className="bg-white border border-[#1a1a1a]/[0.08] rounded-2xl overflow-hidden">
                                          <div className="px-5 py-4 flex items-start gap-3">
                                            <div className={`mt-0.5 flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${w.pct < 40 ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'}`}>
                                              <Apple className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <p className="text-sm font-bold text-[#1a1a1a] mb-1">{sectionTitle(w.sectionId, w.title)}</p>
                                              <p className="text-xs text-[#1a1a1a]/50 leading-relaxed mb-2">{w.concern}</p>
                                              {w.triggeredInsights && w.triggeredInsights.length > 0 && (
                                                <button
                                                  onClick={() => setExpandedSections(prev => { const next = new Set(prev); const key = `w-${w.sectionId}`; if (next.has(key)) next.delete(key); else next.add(key); return next })}
                                                  className="flex items-center gap-1 text-[10px] text-[#2D6A4F] font-semibold"
                                                >
                                                  {isExpW ? 'Masquer' : `Voir ${w.triggeredInsights.length} recommandation${w.triggeredInsights.length > 1 ? 's' : ''}`}
                                                  <ChevronRight className={`w-3 h-3 transition-transform duration-200 ${isExpW ? 'rotate-90' : ''}`} />
                                                </button>
                                              )}
                                            </div>
                                          </div>
                                          {isExpW && w.triggeredInsights && w.triggeredInsights.length > 0 && (
                                            <div className="divide-y divide-[#1a1a1a]/[0.05] border-t border-[#1a1a1a]/[0.06]">
                                              {w.triggeredInsights.map((ti, i) => (
                                                <div key={ti.questionId} className="px-5 py-4">
                                                  <div className="flex items-start gap-2.5 mb-3">
                                                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-[10px] font-bold text-amber-600 mt-0.5">{i + 1}</span>
                                                    <p className="text-xs text-[#1a1a1a]/60 leading-relaxed italic">{ti.insight}</p>
                                                  </div>
                                                  <div className="ml-7 bg-[#2D6A4F]/[0.05] border border-[#2D6A4F]/[0.15] rounded-xl px-4 py-3">
                                                    <p className="text-[10px] font-semibold text-[#2D6A4F] uppercase tracking-wider mb-1">Recommandation</p>
                                                    <p className="text-xs text-[#1a1a1a]/70 leading-relaxed">{ti.recommendation}</p>
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      )
                                    })}
                                  </div>
                                  {digestifW.length > 0 && (
                                    <div className="mt-4">
                                      {alimentaireW.length > 0 && (
                                        <p className="text-[10px] text-[#1a1a1a]/35 italic mb-3 px-1">Ces inconforts digestifs sont souvent liés à votre alimentation :</p>
                                      )}
                                      <div className="space-y-3">
                                        {digestifW.map(w => {
                                          const isExpW = expandedSections.has(`w-${w.sectionId}`)
                                          return (
                                            <div key={w.sectionId} className="bg-[#1a1a1a]/[0.02] border border-[#1a1a1a]/[0.06] rounded-2xl overflow-hidden">
                                              <div className="px-4 py-3 flex items-start gap-3">
                                                <div className={`mt-0.5 flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${w.pct < 40 ? 'bg-red-50 text-red-400' : 'bg-amber-50 text-amber-400'}`}>
                                                  <AlertTriangle className="w-3.5 h-3.5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                  <p className="text-xs font-semibold text-[#1a1a1a]/70 mb-0.5">{sectionTitle(w.sectionId, w.title)}</p>
                                                  <p className="text-[10px] text-[#1a1a1a]/40 leading-relaxed mb-1.5">{w.concern}</p>
                                                  {w.triggeredInsights && w.triggeredInsights.length > 0 && (
                                                    <button
                                                      onClick={() => setExpandedSections(prev => { const next = new Set(prev); const key = `w-${w.sectionId}`; if (next.has(key)) next.delete(key); else next.add(key); return next })}
                                                      className="flex items-center gap-1 text-[10px] text-[#2D6A4F]/70 font-semibold"
                                                    >
                                                      {isExpW ? 'Masquer' : `Voir ${w.triggeredInsights.length} recommandation${w.triggeredInsights.length > 1 ? 's' : ''}`}
                                                      <ChevronRight className={`w-3 h-3 transition-transform duration-200 ${isExpW ? 'rotate-90' : ''}`} />
                                                    </button>
                                                  )}
                                                </div>
                                              </div>
                                              {isExpW && w.triggeredInsights && w.triggeredInsights.length > 0 && (
                                                <div className="divide-y divide-[#1a1a1a]/[0.05] border-t border-[#1a1a1a]/[0.05]">
                                                  {w.triggeredInsights.map((ti, i) => (
                                                    <div key={ti.questionId} className="px-4 py-3">
                                                      <div className="flex items-start gap-2 mb-2">
                                                        <span className="flex-shrink-0 w-4 h-4 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-[9px] font-bold text-amber-600 mt-0.5">{i + 1}</span>
                                                        <p className="text-[10px] text-[#1a1a1a]/55 leading-relaxed italic">{ti.insight}</p>
                                                      </div>
                                                      <div className="ml-6 bg-[#2D6A4F]/[0.04] border border-[#2D6A4F]/[0.12] rounded-xl px-3 py-2.5">
                                                        <p className="text-[10px] font-semibold text-[#2D6A4F] uppercase tracking-wider mb-1">Recommandation</p>
                                                        <p className="text-[10px] text-[#1a1a1a]/65 leading-relaxed">{ti.recommendation}</p>
                                                      </div>
                                                    </div>
                                                  ))}
                                                </div>
                                              )}
                                            </div>
                                          )
                                        })}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )
                            })()}

                            {/* Action plan */}
                            {report.actionPlan.length > 0 && (
                              <div>
                                <div className="flex items-center gap-2 mb-4">
                                  <div className="w-5 h-5 rounded-full bg-[#2D6A4F]/15 flex items-center justify-center flex-shrink-0">
                                    <ChevronRight className="w-3 h-3 text-[#2D6A4F]" />
                                  </div>
                                  <h4 className="text-sm font-bold text-[#1a1a1a]">Votre plan d&apos;action</h4>
                                </div>
                                <div className="space-y-3">
                                  {report.actionPlan.flatMap((phase) => phase.actions).map((action, i) => (
                                    <div key={i} className="bg-white border border-[#1a1a1a]/[0.08] rounded-2xl overflow-hidden">
                                      <div className="flex gap-4 px-5 py-5">
                                        <div className="flex-shrink-0 pt-0.5">
                                          <div className="w-8 h-8 rounded-full bg-[#2D6A4F] flex items-center justify-center text-white text-sm font-bold leading-none">{i + 1}</div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-bold text-[#1a1a1a] leading-snug mb-3">{adaptActionForDiet(action.action, userDiet ?? '')}</p>
                                          <div className="bg-[#1a1a1a]/[0.03] border border-[#1a1a1a]/[0.06] rounded-xl px-3 py-2.5">
                                            <p className="text-[10px] font-semibold text-[#1a1a1a]/35 uppercase tracking-wider mb-1">Pourquoi</p>
                                            <p className="text-xs text-[#1a1a1a]/55 leading-relaxed">{adaptActionForDiet(action.why, userDiet ?? '')}</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Science cards — same dark style as ResultsScreen */}
                            {report.globalInsights && report.globalInsights.length > 0 && (
                              <div>
                                <div className="flex items-center gap-2 mb-4">
                                  <div className="w-5 h-5 rounded-full bg-[#1a1a1a]/[0.06] flex items-center justify-center flex-shrink-0">
                                    <Sparkles className="w-2.5 h-2.5 text-[#1a1a1a]/40" />
                                  </div>
                                  <h4 className="text-sm font-bold text-[#1a1a1a]">Ce que dit la science</h4>
                                </div>
                                <div className="grid gap-3">
                                  {report.globalInsights.map((insight, i) => (
                                    <div key={i} className="relative bg-[#1a1a1a]/[0.02] border border-[#1a1a1a]/[0.06] rounded-2xl px-5 py-4 overflow-hidden">
                                      <div className="absolute top-3 right-4 text-5xl font-serif text-[#1a1a1a]/[0.04] leading-none select-none">&ldquo;</div>
                                      <p className="text-xs font-bold text-[#1a1a1a] mb-1.5">{insight.title}</p>
                                      <p className="text-xs text-[#1a1a1a]/55 leading-relaxed mb-3">{insight.description}</p>
                                      <p className="text-[10px] text-[#1a1a1a]/25 font-medium">{insight.reference}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            {/* ═══ LEGACY FORMAT — fallback for bilans not yet migrated ═══ */}

                            {/* Section breakdown mini-bars */}
                            {result.section_results && result.section_results.length > 0 && (
                              <div className="pt-2 space-y-2">
                                {result.section_results.map(sr => (
                                  <div key={sr.sectionId} className="flex items-center gap-3">
                                    <span className="text-[11px] text-[#1a1a1a]/50 w-28 truncate">{sectionTitle(sr.sectionId, sr.title)}</span>
                                    <div className="flex-1 h-2 bg-[#1a1a1a]/[0.04] rounded-full overflow-hidden">
                                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${sr.pct}%`, background: sr.pct >= 75 ? '#3ECF8E' : sr.pct >= 50 ? '#c9a96e' : '#ff6b6b' }} />
                                    </div>
                                    <span className="text-[11px] font-semibold text-[#1a1a1a]/50 w-10 text-right tabular-nums">{sr.pct}%</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* 2. Knowledge scientifique */}
                            <div>
                              <div className="flex items-center gap-2 mb-4">
                                <div className="w-7 h-7 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center">
                                  <Microscope className="w-3.5 h-3.5 text-purple-600" />
                                </div>
                                <h4 className="text-sm font-bold text-[#1a1a1a]">2. Connaissances scientifiques</h4>
                              </div>

                              {/* Global insights */}
                              {report.globalInsights && report.globalInsights.length > 0 && (
                                <div className="space-y-2 mb-4">
                                  {report.globalInsights.map((insight, i) => (
                                    <div key={i} className="bg-gradient-to-br from-[#FAF8F5] to-white border border-[#1a1a1a]/[0.06] rounded-xl p-4">
                                      <h5 className="text-xs font-bold text-[#1a1a1a] mb-1">{insight.title}</h5>
                                      <p className="text-[11px] text-[#1a1a1a]/50 leading-relaxed mb-1.5">{insight.description}</p>
                                      <p className="text-[10px] text-[#2D6A4F]/50 italic">{insight.reference}</p>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Per-section detailed reports */}
                              {report.sectionReports && report.sectionReports.length > 0 && (
                                <div className="space-y-2">
                                  {report.sectionReports.map(sr => {
                                    const lc = levelColor(sr.level)
                                    const isExpSec = expandedSections.has(sr.sectionId)
                                    return (
                                      <div key={sr.sectionId} className={`rounded-xl border overflow-hidden ${lc.border} ${lc.bg}`}>
                                        <button
                                          onClick={() => setExpandedSections(prev => {
                                            const next = new Set(prev)
                                            if (next.has(sr.sectionId)) next.delete(sr.sectionId); else next.add(sr.sectionId)
                                            return next
                                          })}
                                          className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-white/30 transition-colors"
                                        >
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                              <h5 className="text-xs font-semibold text-[#1a1a1a]">{sectionTitle(sr.sectionId, sr.title)}</h5>
                                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${lc.badge}`}>
                                                {sr.recommendationTitle}
                                              </span>
                                              <span className="text-[10px] text-[#1a1a1a]/30 ml-auto tabular-nums">{sr.pct}%</span>
                                            </div>
                                          </div>
                                          <div className={`w-4 h-4 flex items-center justify-center transition-transform duration-200 ${isExpSec ? 'rotate-90' : ''}`}>
                                            <ChevronRight className="w-3 h-3 text-[#1a1a1a]/25" />
                                          </div>
                                        </button>

                                        {isExpSec && (
                                          <div className="px-4 pb-4 space-y-3 animate-fade-in">
                                            {/* Context */}
                                            <div className="bg-white/60 rounded-lg p-3">
                                              <p className="text-[10px] font-semibold tracking-widest uppercase text-[#1a1a1a]/25 mb-1">Contexte scientifique</p>
                                              <p className="text-[11px] text-[#1a1a1a]/50 leading-relaxed">{sr.context}</p>
                                            </div>

                                            {/* Recommendation */}
                                            <div className="bg-white/80 rounded-lg p-3 border border-[#1a1a1a]/[0.05]">
                                              <div className="flex items-center gap-1.5 mb-1.5">
                                                <div className={`w-1.5 h-1.5 rounded-full ${lc.dot}`} />
                                                <p className="text-[11px] font-bold text-[#1a1a1a]">{sr.recommendationTitle}</p>
                                              </div>
                                              <p className="text-[11px] text-[#1a1a1a]/60 leading-relaxed">{sr.recommendationText}</p>
                                            </div>

                                            {/* Triggered insights */}
                                            {sr.triggeredInsights && sr.triggeredInsights.length > 0 && (
                                              <div className="space-y-1.5">
                                                <p className="text-[9px] font-semibold tracking-widest uppercase text-[#1a1a1a]/25">Points d&apos;attention</p>
                                                {sr.triggeredInsights.map(ti => (
                                                  <div key={ti.questionId} className="bg-white rounded-lg p-3 border border-[#1a1a1a]/[0.06]">
                                                    <p className="text-[11px] font-semibold text-[#1a1a1a] mb-1 flex items-center gap-1.5">
                                                      <span className="w-1 h-1 rounded-full bg-amber-400 flex-shrink-0" /> {ti.insight}
                                                    </p>
                                                    <p className="text-[10px] text-[#1a1a1a]/50 leading-relaxed pl-2.5">{ti.recommendation}</p>
                                                  </div>
                                                ))}
                                              </div>
                                            )}

                                            {/* References */}
                                            {sr.references && sr.references.length > 0 && (
                                              <div>
                                                <p className="text-[9px] font-semibold tracking-widest uppercase text-[#1a1a1a]/25 mb-1.5">Références</p>
                                                <div className="space-y-1">
                                                  {sr.references.map((ref: { authors: string; title: string; journal: string; year: number; pmid?: string }, i: number) => (
                                                    <p key={i} className="text-[9px] text-[#1a1a1a]/30 leading-relaxed">
                                                      <span className="text-[#2D6A4F]/40 font-mono">[{i + 1}]</span> {ref.authors}. &ldquo;{ref.title}&rdquo; <em>{ref.journal}</em> ({ref.year}).
                                                      {ref.pmid && <span className="text-[#2D6A4F]/40"> PMID: {ref.pmid}</span>}
                                                    </p>
                                                  ))}
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    )
                                  })}
                                </div>
                              )}
                            </div>

                            {/* 3. Next steps (legacy) */}
                            <div>
                              <div className="flex items-center gap-2 mb-4">
                                <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center">
                                  <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                                </div>
                                <h4 className="text-sm font-bold text-[#1a1a1a]">3. Prochaines étapes</h4>
                              </div>

                              {report.topActions && report.topActions.length > 0 ? (
                                <div className="space-y-2">
                                  {report.topActions.map(action => (
                                    <div key={action.priority} className={`flex items-start gap-3 p-3.5 rounded-xl border ${
                                      action.level === 'alerte'
                                        ? 'bg-red-50/50 border-red-200'
                                        : 'bg-amber-50/50 border-amber-200'
                                    }`}>
                                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold ${
                                        action.level === 'alerte'
                                          ? 'bg-red-100 text-red-600'
                                          : 'bg-amber-100 text-amber-700'
                                      }`}>
                                        {action.priority}
                                      </div>
                                      <p className="text-[11px] text-[#1a1a1a]/70 leading-relaxed flex-1">{action.action}</p>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-xs text-emerald-600 font-medium">Excellent ! Pas d&apos;action prioritaire — maintenez vos bonnes habitudes.</p>
                              )}
                            </div>
                          </>
                        )}

                        {/* Disclaimer */}
                        <div className="bg-[#1a1a1a]/[0.02] border border-[#1a1a1a]/[0.06] rounded-lg p-3 mt-2">
                          <p className="text-[9px] text-[#1a1a1a]/30 leading-relaxed">
                            Ce compte-rendu est base sur vos reponses et la litterature scientifique peer-reviewed. Il ne constitue pas un avis medical. Consultez un professionnel de sante pour un avis personnalise.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* ════════ PLANNING ════════ */}
        <section id="planning" className="scroll-mt-20">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
            <div>
              <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-[#1a1a1a]">Planning</h2>
              <p className="text-[13px] text-[#1a1a1a]/40 mt-1">Glisse tes seances pour les deplacer</p>
            </div>
            <div className="flex items-center gap-2">
              {calendarConnected ? (
                <>
                  <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#3ECF8E] bg-[#3ECF8E]/8 px-2.5 py-1 rounded-md"><span className="w-1.5 h-1.5 rounded-full bg-[#3ECF8E]" />Google{calendarEmail ? ` · ${calendarEmail}` : ""}</span>
                  <button onClick={() => fetchGoogleEvents(currentDate, true)} disabled={syncingEvents} className="inline-flex items-center gap-1 text-[11px] font-medium text-[#1a1a1a]/35 border border-black/[0.06] px-2 py-1 rounded-md hover:border-[#3ECF8E]/40 hover:text-[#3ECF8E] transition-all disabled:opacity-30"><RefreshCw className={`w-3 h-3 ${syncingEvents ? "animate-spin" : ""}`} /> Sync</button>
                  <button onClick={async () => {
                    if (!supabase) return
                    const { data: { session } } = await supabase.auth.getSession()
                    if (!session?.access_token) return
                    await fetch('/api/calendar/google/disconnect', { method: 'POST', headers: { Authorization: `Bearer ${session.access_token}` } })
                    setCalendarConnected(false); setCalendarEmail(null); setGoogleEvents([])
                  }} className="inline-flex items-center gap-1 text-[11px] font-medium text-[#1a1a1a]/25 border border-black/[0.04] px-2 py-1 rounded-md hover:border-red-300 hover:text-red-400 transition-all">Déconnecter</button>
                </>
              ) : (
                <button onClick={handleConnectCalendar} disabled={calendarWorking || calendarLoading} className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#1a1a1a]/40 border border-black/[0.06] px-3 py-1.5 rounded-md hover:border-[#3ECF8E]/40 hover:text-[#3ECF8E] transition-all disabled:opacity-30"><Plus className="w-3 h-3" /> Google Agenda</button>
              )}
            </div>
          </div>
          {calendarError && <p className="text-xs text-red-500 bg-red-50/80 px-3 py-2 rounded-lg mb-4">{calendarError}</p>}

          {/* ── Activity suggestion chips ── */}
          {userWeeklyActivities.length > 0 && (
            <div className="mb-5">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#1a1a1a]/30 font-semibold mb-2.5">
                Tes activités &mdash; <span className="normal-case tracking-normal font-normal">glisse sur le planning ou tape pour ajouter</span>
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                {userWeeklyActivities.map((activity, i) => (
                  <div
                    key={i}
                    draggable
                    onDragStart={e => {
                      dragPayload.current = { kind: "chip", value: activity }
                      e.dataTransfer.effectAllowed = "copy"
                      e.dataTransfer.setData("application/evo-drag-kind", "chip")
                      e.dataTransfer.setData("application/evo-chip", activity)
                      e.dataTransfer.setData("text/plain", activity)
                      dragId.current = null
                    }}
                    onDragEnd={clearDragState}
                    onClick={() => {
                      openCreateModal(new Date(currentDate), activity)
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-black/[0.06] text-[12px] font-medium text-[#1a1a1a]/60 cursor-grab active:cursor-grabbing whitespace-nowrap hover:border-[#c9a96e]/50 hover:text-[#1a1a1a] hover:shadow-sm transition-all shrink-0 select-none"
                  >
                    {activity.includes('Muscul') || activity.includes('Fitness') ? <Dumbbell className="w-3.5 h-3.5 shrink-0" /> :
                     activity.includes('Running') || activity.includes('Trail') ? <Activity className="w-3.5 h-3.5 shrink-0" /> :
                     activity.includes('Vélo') || activity.includes('Cycl') ? <Zap className="w-3.5 h-3.5 shrink-0" /> :
                     activity.includes('Yoga') || activity.includes('Pilates') ? <Leaf className="w-3.5 h-3.5 shrink-0" /> :
                     activity.includes('CrossFit') || activity.includes('HIIT') ? <Zap className="w-3.5 h-3.5 shrink-0" /> :
                     activity.includes('Boxe') || activity.includes('Art') ? <Shield className="w-3.5 h-3.5 shrink-0" /> :
                     activity.includes('Danse') ? <Sparkles className="w-3.5 h-3.5 shrink-0" /> :
                     activity.includes('Randon') ? <Leaf className="w-3.5 h-3.5 shrink-0" /> :
                     <Activity className="w-3.5 h-3.5 shrink-0" />}
                    {activity}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* filter toggles */}
          <div className="flex items-center gap-3 mb-3">
            {([{ key: "evo" as const, label: "evo", color: "#3ECF8E" }, { key: "sport" as const, label: "Sport", color: "#c9a96e" }, { key: "google" as const, label: "Agenda", color: "#4285f4" }]).map(f => (
              <label key={f.key} className="flex items-center gap-1.5 cursor-pointer select-none">
                <input type="checkbox" checked={calFilters[f.key]} onChange={() => setCalFilters(prev => ({ ...prev, [f.key]: !prev[f.key] }))} className="sr-only peer" />
                <div className="w-3.5 h-3.5 rounded border-2 flex items-center justify-center transition-all" style={{ borderColor: calFilters[f.key] ? f.color : "#d1d5db", background: calFilters[f.key] ? `${f.color}15` : "transparent", color: f.color }}>
                  {calFilters[f.key] && <svg width="8" height="8" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <span className="text-[11px] font-medium" style={{ color: calFilters[f.key] ? "#1a1a1a" : "#1a1a1a80" }}>{f.label}</span>
              </label>
            ))}
          </div>

          <div className="flex gap-5 items-start">
          {/* left: calendar */}
          <div className="flex-1 min-w-0">

          {/* calendar */}
          <div className="bg-white rounded-xl border border-black/[0.04] overflow-hidden"
            onTouchStart={e => { touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY } }}
            onTouchEnd={e => { if (!touchStartRef.current) return; const dx = touchStartRef.current.x - e.changedTouches[0].clientX; const dy = touchStartRef.current.y - e.changedTouches[0].clientY; touchStartRef.current = null; if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) navigate(dx > 0 ? 1 : -1) }}>
            {/* toolbar */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-black/[0.04]">
              <div className="flex items-center gap-1">
                <button onClick={() => navigate(-1)} className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-[#f3f4f3] transition-colors text-[#1a1a1a]/30 hover:text-[#1a1a1a]"><ChevronLeft className="w-4 h-4" /></button>
                <button onClick={() => navigate(1)} className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-[#f3f4f3] transition-colors text-[#1a1a1a]/30 hover:text-[#1a1a1a]"><ChevronRight className="w-4 h-4" /></button>
                <h3 className="text-[13px] font-medium text-[#1a1a1a] capitalize ml-1.5">{calTitle}</h3>
              </div>
              <div className="flex items-center gap-0.5 bg-[#f3f4f3] rounded-md p-0.5">
                {viewOptions.map(v => (
                  <button key={v.id} onClick={() => setCalView(v.id)} className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-all ${calView === v.id ? "bg-white text-[#1a1a1a] shadow-sm" : "text-[#1a1a1a]/35 hover:text-[#1a1a1a]/60"}`}>{v.icon}<span className="hidden sm:inline">{v.label}</span></button>
                ))}
              </div>
            </div>

            {/* ── MONTH ── */}
            {calView === "month" && (
              <>
                <div className="grid grid-cols-7 border-b border-black/[0.04]">
                  {["L","M","M","J","V","S","D"].map((d, i) => <div key={i} className="text-center text-[10px] font-medium text-[#1a1a1a]/25 py-2">{d}</div>)}
                </div>
                <div className="grid grid-cols-7">
                  {Array.from({ length: firstDow }).map((_, i) => <div key={`e-${i}`} className="border-r border-b border-black/[0.03] min-h-[56px]" />)}
                  {monthDays.map((day, i) => {
                    const ds = sessionsOnDay(day)
                    const dayKey = day.toISOString()
                    return (
                      <div key={i}
                        onDragOver={e => onDragOver(e, dayKey)} onDragLeave={onDragLeave} onDrop={e => onDrop(e, day)}
                        className={`relative border-r border-b border-black/[0.03] min-h-[56px] p-1 text-left group transition-all ${isToday(day) ? "bg-[#3ECF8E]/[0.05]" : ""} ${dragOverDay === dayKey ? "bg-[#3ECF8E]/[0.08]" : "hover:bg-[#3ECF8E]/[0.02]"}`}>
                        <button onClick={() => openCreateModal(day)} className="w-full text-left">
                          <span className={`text-[10px] font-medium ${isToday(day) ? "w-4.5 h-4.5 rounded-full bg-[#3ECF8E] text-white flex items-center justify-center text-[9px]" : "text-[#1a1a1a]/40"}`}>{format(day, "d")}</span>
                        </button>
                        <div className="mt-px space-y-px">
                          {ds.slice(0, 2).map(s => (
                            <div key={s.id} draggable={isDraggable(s)} onDragStart={e => isDraggable(s) && onDragStart(e, s.id)}
                              onDragEnd={clearDragState}
                              onClick={e => { e.stopPropagation(); if (isDraggable(s)) openEditModal(s) }}
                              className={`text-[8px] font-medium px-1 py-px rounded truncate ${isDraggable(s) ? "cursor-grab active:cursor-grabbing" : ""} ${s.type === "evo" ? "bg-[#3ECF8E]/10 text-[#1B9C6E]" : s.type === "google" ? "bg-[#4285f4]/10 text-[#1a73e8]" : "bg-[#c9a96e]/10 text-[#a08050]"}`}>{s.type === "google" ? "Occupé" : s.label}</div>
                          ))}
                          {ds.length > 2 && <div className="text-[8px] text-[#1a1a1a]/20">+{ds.length - 2}</div>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}

            {/* ── WEEK ── */}
            {calView === "week" && (
              <div className="flex">
                <div className="w-10 shrink-0 border-r border-black/[0.04]">
                  <div className="h-8 border-b border-black/[0.04]" />
                  {HOURS.map(h => <div key={h} style={{ height: H_PX }} className="flex items-start justify-end pr-1.5 pt-0.5"><span className="text-[9px] text-[#1a1a1a]/20 font-medium">{h}h</span></div>)}
                </div>
                <div className="flex-1 grid grid-cols-7">
                  {weekDays.map((day, col) => {
                    const ds = sessionsOnDay(day)
                    const dayKey = day.toISOString()
                    return (
                      <div key={col}
                        onDragOver={e => onDragOver(e, dayKey)} onDragLeave={onDragLeave}
                        className={`border-r border-black/[0.03] ${isToday(day) ? "bg-[#3ECF8E]/[0.02]" : ""} ${dragOverDay === dayKey ? "bg-[#3ECF8E]/[0.06]" : ""}`}>
                        <div className="h-8 flex flex-col items-center justify-center border-b border-black/[0.04]">
                          <span className="text-[9px] font-medium text-[#1a1a1a]/25 uppercase leading-none">{format(day, "EEE", { locale: fr })}</span>
                          <span className={`text-[11px] font-semibold leading-none ${isToday(day) ? "w-4.5 h-4.5 rounded-full bg-[#3ECF8E] text-white flex items-center justify-center text-[9px] mt-0.5" : "text-[#1a1a1a]/60"}`}>{format(day, "d")}</span>
                        </div>
                        <div className="relative" style={{ height: HOURS.length * H_PX }}
                          onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = "move" }}
                          onDrop={e => onDropTime(e, day)}>
                          {HOURS.map(h => <div key={h} className="absolute w-full border-b border-black/[0.03]" style={{ top: (h - 8) * H_PX, height: H_PX }} />)}
                          <button className="absolute inset-0 w-full z-0 opacity-0" onClick={e => onTimeGridClick(e, day)} />
                          {ds.map(s => {
                            const top = sessionTop(s), height = sessionHeight(s)
                            const cls = s.type === "evo" ? "bg-[#3ECF8E]/15 border-l-2 border-l-[#3ECF8E] text-[#1B9C6E]" : s.type === "google" ? "bg-[#4285f4]/10 border-l-2 border-l-[#4285f4] text-[#1a73e8]" : "bg-[#c9a96e]/12 border-l-2 border-l-[#c9a96e] text-[#a08050]"
                            return (
                              <div key={s.id} draggable={isDraggable(s)} onDragStart={e => isDraggable(s) && onDragStart(e, s.id)}
                                onDragEnd={clearDragState}
                                onClick={e => { e.stopPropagation(); if (isDraggable(s)) openEditModal(s) }}
                                className={`absolute left-0.5 right-0.5 z-10 rounded px-1 py-px overflow-hidden transition-opacity group/sess ${isDraggable(s) ? "cursor-grab active:cursor-grabbing" : "cursor-default"} ${cls}`}
                                style={{ top, height: Math.max(height, 18) }}>
                                {isDraggable(s) && <GripVertical className="w-2.5 h-2.5 absolute top-0.5 right-0 opacity-0 group-hover/sess:opacity-40 text-current" />}
                                <p className="text-[8px] font-semibold truncate leading-tight">{s.type === "google" ? "Occupé" : s.label}</p>
                                {height >= 28 && <p className="text-[7px] opacity-50">{format(s.date, "HH:mm")} · {s.duration}m</p>}
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

            {/* ── DAY ── */}
            {calView === "day" && (
              <div className="flex"
                onDragOver={e => onDragOver(e, currentDate.toISOString())} onDragLeave={onDragLeave}>
                <div className="w-12 shrink-0 border-r border-black/[0.04]">
                  {HOURS.map(h => <div key={h} style={{ height: H_PX }} className="flex items-start justify-end pr-2 pt-0.5"><span className="text-[10px] text-[#1a1a1a]/25 font-medium">{String(h).padStart(2, "0")}:00</span></div>)}
                </div>
                <div className={`flex-1 relative ${isToday(currentDate) ? "bg-[#3ECF8E]/[0.02]" : ""} ${dragOverDay === currentDate.toISOString() ? "bg-[#3ECF8E]/[0.06]" : ""}`} style={{ height: HOURS.length * H_PX }}
                  onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = "move" }}
                  onDrop={e => onDropTime(e, currentDate)}>
                  {HOURS.map(h => <div key={h} className="absolute w-full border-b border-black/[0.03]" style={{ top: (h - 8) * H_PX, height: H_PX }} />)}
                  {isToday(currentDate) && (() => {
                    const now = new Date(), top = (getHours(now) - 8 + getMinutes(now) / 60) * H_PX
                    if (top < 0 || top > HOURS.length * H_PX) return null
                    return <div className="absolute left-0 right-0 z-10 flex items-center" style={{ top }}><div className="w-2 h-2 rounded-full bg-[#ff4444]" /><div className="flex-1 h-px bg-[#ff4444]/50" /></div>
                  })()}
                  <button className="absolute inset-0 w-full z-0 opacity-0" onClick={e => onTimeGridClick(e, currentDate)} />
                  {sessionsOnDay(currentDate).map(s => {
                    const top = sessionTop(s), height = sessionHeight(s)
                    const cls = s.type === "evo" ? "bg-[#3ECF8E]/15 border-l-[3px] border-l-[#3ECF8E] text-[#1B9C6E]" : s.type === "google" ? "bg-[#4285f4]/10 border-l-[3px] border-l-[#4285f4] text-[#1a73e8]" : "bg-[#c9a96e]/12 border-l-[3px] border-l-[#c9a96e] text-[#a08050]"
                    return (
                      <div key={s.id} draggable={isDraggable(s)} onDragStart={e => isDraggable(s) && onDragStart(e, s.id)}
                        onDragEnd={clearDragState}
                        onClick={e => { e.stopPropagation(); if (isDraggable(s)) openEditModal(s) }}
                        className={`absolute left-1 right-4 z-10 rounded-lg px-3 py-1 overflow-hidden group/sess ${isDraggable(s) ? "cursor-grab active:cursor-grabbing" : ""} ${cls}`}
                        style={{ top, height: Math.max(height, 24) }}>
                        {isDraggable(s) && <GripVertical className="w-3 h-3 absolute top-1 right-1 opacity-0 group-hover/sess:opacity-40 text-current" />}
                        <p className="text-[11px] font-semibold truncate">{s.type === "google" ? "Occupé" : s.label}</p>
                        <p className="text-[10px] opacity-60">{format(s.date, "HH:mm")} — {s.duration} min</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 mt-2.5 text-[10px] text-[#1a1a1a]/25">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-[#3ECF8E]/20" /> evo</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-[#c9a96e]/20" /> Sport</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-[#4285f4]/20" /> Indisponible</span>
          </div>
          </div>{/* end left column */}

          {/* ── right: golden planning block ── */}
          <div className="w-[280px] shrink-0 hidden lg:block rounded-2xl overflow-hidden self-stretch" style={{ background: "#b8976a" }}>
            <div className="px-5 py-6 h-full flex flex-col relative">
              <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.08] pointer-events-none" style={{ background: "radial-gradient(circle, white 0%, transparent 70%)" }} />
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center mb-4">
                <Dumbbell className="w-4 h-4 text-white/80" />
              </div>
              <p className="text-[15px] font-bold text-white leading-snug mb-2">La cle, c&apos;est de s&apos;y tenir.</p>
              <p className="text-[12px] text-white/50 leading-relaxed mb-5">Ton programme ne vaut que si tu le suis. Ajoute tes seances, on s&apos;occupe du reste.</p>
              <div className="flex flex-col gap-2 mb-5">
                <button onClick={() => openCreateModal(new Date())} className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-xl bg-white text-[#1a1a1a] text-[12px] font-semibold hover:shadow-lg transition-all">
                  <Plus className="w-3.5 h-3.5" /> Ajouter mes seances sport
                </button>
                <button disabled className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-xl bg-white/10 text-white/40 text-[12px] font-medium cursor-not-allowed border border-white/10">
                  <Dumbbell className="w-3.5 h-3.5" /> Seances evo — a venir
                </button>
              </div>
              <div className="mt-auto pt-4 border-t border-white/10 space-y-2.5">
                <div className="flex items-start gap-2">
                  <MessageCircle className="w-3.5 h-3.5 text-white/40 mt-0.5 shrink-0" />
                  <p className="text-[11px] text-white/50 leading-relaxed">Modifie ton planning par <span className="text-white/70 font-medium">WhatsApp</span></p>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="w-3.5 h-3.5 text-white/40 mt-0.5 shrink-0" />
                  <p className="text-[11px] text-white/50 leading-relaxed">Google Agenda = creneaux <span className="text-white/70 font-medium">occupes</span> uniquement</p>
                </div>
              </div>
            </div>
          </div>
          </div>{/* end flex wrapper */}
        </section>

        {/* ════════ PROGRESSION ════════ */}
        <section id="progression" className="scroll-mt-20">
          <SectionHeader title="Progression" subtitle="Evolution de tes scores sur 6 mois" />
          <div className="bg-white rounded-xl border border-black/[0.04] p-5 mb-4 relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[13px] font-medium text-[#1a1a1a]/70">Scores par pilier — 6 mois</h3>
              <span className="text-[9px] font-bold text-[#c9a96e] bg-[#c9a96e]/10 px-2 py-0.5 rounded-md uppercase tracking-wider">Bientôt</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={progressData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gRenf" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3ECF8E" stopOpacity={0.12} /><stop offset="95%" stopColor="#3ECF8E" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" />
                <XAxis dataKey="mois" tick={{ fontSize: 11, fill: "#aaa" }} axisLine={false} tickLine={false} />
                <YAxis domain={[40, 100]} tick={{ fontSize: 11, fill: "#aaa" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #f0f0f0", fontSize: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }} />
                <Area type="monotone" dataKey="renforcement" stroke="#3ECF8E" strokeWidth={2} fill="url(#gRenf)" name="Renforcement" />
                <Area type="monotone" dataKey="cardio" stroke="#ff6b6b" strokeWidth={1.5} fill="none" strokeDasharray="4 2" name="Cardio" />
                <Area type="monotone" dataKey="sommeil" stroke="#a78bfa" strokeWidth={1.5} fill="none" strokeDasharray="4 2" name="Sommeil" />
                <Area type="monotone" dataKey="nutrition" stroke="#c9a96e" strokeWidth={1.5} fill="none" strokeDasharray="4 2" name="Nutrition" />
                <Area type="monotone" dataKey="mental" stroke="#60a5fa" strokeWidth={1.5} fill="none" strokeDasharray="4 2" name="Mental" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-[10px]">
              <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 rounded-full bg-[#3ECF8E]" /> Renforcement</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 rounded-full bg-[#ff6b6b]" /> Cardio</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 rounded-full bg-[#a78bfa]" /> Sommeil</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 rounded-full bg-[#c9a96e]" /> Nutrition</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 rounded-full bg-[#60a5fa]" /> Mental</span>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-black/[0.04] p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-medium text-[#1a1a1a]/70">Profil de sante</h3>
                <span className="text-[9px] font-bold text-[#c9a96e] bg-[#c9a96e]/10 px-2 py-0.5 rounded-md uppercase tracking-wider">Bientot</span>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <RadarChart data={radarData}><PolarGrid stroke="#ececec" /><PolarAngleAxis dataKey="label" tick={{ fontSize: 11, fill: "#999" }} /><Radar name="Score" dataKey="value" stroke="#3ECF8E" fill="#3ECF8E" fillOpacity={0.12} strokeWidth={2} /></RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-xl border border-black/[0.04] p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-medium text-[#1a1a1a]/70">Activite cette semaine</h3>
                <span className="text-[9px] font-bold text-[#c9a96e] bg-[#c9a96e]/10 px-2 py-0.5 rounded-md uppercase tracking-wider">Bientot</span>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={weeklyActivity} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="jour" tick={{ fontSize: 11, fill: "#aaa" }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#aaa" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #f0f0f0", fontSize: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }} />
                  <Bar dataKey="seances" fill="#3ECF8E" radius={[5, 5, 0, 0]} name="Seances" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* ════════ SCIENCE ════════ */}
        <section id="science" className="scroll-mt-20">
          <Link href="/science" className="block group">
            <div className="rounded-2xl overflow-hidden transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-1" style={{ background: "linear-gradient(135deg, #0b1a12 0%, #0d2b1a 40%, #0b1a12 100%)" }}>
              <div className="px-8 py-10 relative">
                <div className="absolute top-0 right-0 w-60 h-60 opacity-[0.1] pointer-events-none" style={{ background: "radial-gradient(circle, #3ECF8E 0%, transparent 70%)" }} />
                <div className="absolute bottom-0 left-0 w-40 h-40 opacity-[0.06] pointer-events-none" style={{ background: "radial-gradient(circle, #c9a96e 0%, transparent 70%)" }} />
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div>
                    <p className="text-[11px] font-semibold text-[#3ECF8E]/80 uppercase tracking-[0.15em] mb-3">Science de la longévité</p>
                    <h3 className="text-2xl font-bold text-white/90 leading-tight mb-2">La longévité est une <span className="text-[#3ECF8E]">compétence</span></h3>
                    <p className="text-[13px] text-white/30 max-w-md leading-relaxed">Découvre les piliers scientifiques de la longévité, les 12 hallmarks du vieillissement, et les stratégies validées par la recherche pour vivre plus longtemps en bonne santé.</p>
                    <div className="flex items-center gap-8 mt-5">
                      {[{ label: "Ans gagnes", value: "+7" }, { label: "Mortalite", value: "-35%" }, { label: "Modifiable", value: "80%" }].map((s, i) => (
                        <div key={i}><p className="text-lg font-bold text-[#3ECF8E]">{s.value}</p><p className="text-[9px] text-white/25 mt-0.5">{s.label}</p></div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[#3ECF8E] group-hover:gap-3 transition-all duration-300">
                    <span className="text-[13px] font-semibold">Explorer la science</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </section>
      </div>

      {/* ─── MODAL ─── */}
      {modal.open && modal.date && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={resetModalState} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[14px] font-medium text-[#1a1a1a]">{editingSessionId ? "Modifier" : "Ajouter"} — {format(modal.date, "EEEE d MMMM", { locale: fr })}</h3>
              <button onClick={resetModalState} className="w-6 h-6 rounded-md flex items-center justify-center text-[#1a1a1a]/25 hover:text-[#1a1a1a] hover:bg-[#f3f4f3] transition-colors"><X className="w-3.5 h-3.5" /></button>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#c9a96e]/06 border border-[#c9a96e]/20">
              <Activity className="w-3.5 h-3.5 text-[#a08050]" />
              <span className="text-[12px] font-medium text-[#a08050]">Séance sport</span>
              <span className="ml-auto text-[10px] text-[#1a1a1a]/25">Séances evo — bientôt</span>
            </div>
            <input type="text" placeholder="ex. Run 5km, Vélo, Muscu…" value={newSession.label} onChange={e => setNewSession(s => ({ ...s, label: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border border-black/[0.06] text-[13px] focus:outline-none focus:border-[#c9a96e]/40 transition-colors placeholder:text-[#1a1a1a]/20" />
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-[11px] text-[#1a1a1a]/30 shrink-0"><Calendar className="w-3 h-3" /> jour</div>
              <input
                type="date"
                value={format(modal.date, "yyyy-MM-dd")}
                onChange={e => updateModalDate(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-black/[0.06] text-[13px] focus:outline-none focus:border-[#c9a96e]/40"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-[11px] text-[#1a1a1a]/30 shrink-0"><Clock className="w-3 h-3" /> début</div>
              <input type="time" value={newSession.time} onChange={e => setNewSession(s => ({ ...s, time: e.target.value }))} className="flex-1 px-3 py-2 rounded-lg border border-black/[0.06] text-[13px] focus:outline-none focus:border-[#c9a96e]/40" />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-[11px] text-[#1a1a1a]/30 shrink-0"><Timer className="w-3 h-3" /> min</div>
              <input type="number" min={5} max={180} step={5} value={newSession.duration} onChange={e => setNewSession(s => ({ ...s, duration: Number(e.target.value) }))} className="flex-1 px-3 py-2 rounded-lg border border-black/[0.06] text-[13px] focus:outline-none focus:border-[#3ECF8E]/40" />
            </div>
            <textarea placeholder="Notes (optionnel)" value={newSession.notes} onChange={e => setNewSession(s => ({ ...s, notes: e.target.value }))} rows={2} className="w-full px-3 py-2.5 rounded-lg border border-black/[0.06] text-[13px] focus:outline-none focus:border-[#3ECF8E]/40 resize-none placeholder:text-[#1a1a1a]/20" />
            {!editingSessionId && (
              <label className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-black/[0.06] cursor-pointer hover:bg-[#f9f9f9] transition-colors">
                <input type="checkbox" checked={newSession.isWeekly} onChange={e => setNewSession(s => ({ ...s, isWeekly: e.target.checked }))} className="w-4 h-4 accent-[#3ECF8E]" />
                <span className="text-[13px] text-[#1a1a1a]/70">Répéter chaque semaine (12 semaines)</span>
              </label>
            )}
            <div className="flex gap-2 pt-1">
              {editingSessionId && (
                <button
                  onClick={() => {
                    setSessions(prev => prev.filter(session => session.id !== editingSessionId))
                    resetModalState()
                  }}
                  className="py-2.5 px-3 rounded-lg border border-red-200 text-[13px] text-red-500 hover:bg-red-50 transition-colors"
                >
                  Supprimer
                </button>
              )}
              <button onClick={resetModalState} className="flex-1 py-2.5 rounded-lg border border-black/[0.06] text-[13px] text-[#1a1a1a]/40 hover:text-[#1a1a1a] transition-colors">Annuler</button>
              <button onClick={addSessionHandler} disabled={!newSession.label} className="flex-1 py-2.5 rounded-lg bg-[#1a1a1a] text-white text-[13px] font-medium hover:bg-[#333] transition-colors disabled:opacity-30 disabled:cursor-not-allowed">{editingSessionId ? "Enregistrer" : "Ajouter"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
