"use client"

import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { isSupabaseConfigured, supabase } from "@/lib/supabase"
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
} from "lucide-react"

/* ─── types ─── */
interface Session {
  id: string
  date: Date
  type: "evo" | "sport" | "google"
  label: string
  duration: number
  notes?: string
}
type CalView = "week" | "month" | "day"

/* ─── data ─── */
const progressData = [
  { mois: "Oct", mobilite: 62, sommeil: 55, digestion: 70, global: 62 },
  { mois: "Nov", mobilite: 68, sommeil: 61, digestion: 73, global: 67 },
  { mois: "Dec", mobilite: 71, sommeil: 68, digestion: 75, global: 71 },
  { mois: "Jan", mobilite: 75, sommeil: 72, digestion: 78, global: 75 },
  { mois: "Fev", mobilite: 80, sommeil: 76, digestion: 80, global: 79 },
  { mois: "Mar", mobilite: 84, sommeil: 80, digestion: 83, global: 82 },
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

const sciencePillars: { icon: React.ReactNode; title: string; score: number; tag: string; tagColor: string; desc: string; stats: { label: string; value: string }[]; ref: string }[] = [
  { icon: <Activity className="w-5 h-5" />, title: "Exercice physique", score: 84, tag: "Priorite #1", tagColor: "#3ECF8E", desc: "L'activite physique reguliere est le facteur modifiable le plus puissant pour la longevite.", stats: [{ label: "VO2max cible", value: "+15%" }, { label: "Zone 2/sem.", value: "150 min" }, { label: "Force/sem.", value: "2x" }], ref: "Attia, Outlive (2023)" },
  { icon: <Moon className="w-5 h-5" />, title: "Sommeil et recuperation", score: 80, tag: "En progres", tagColor: "#c9a96e", desc: "7-9h par nuit. La restriction chronique accelere le vieillissement cellulaire.", stats: [{ label: "Duree cible", value: "8h" }, { label: "Efficacite", value: ">85%" }, { label: "Consistance", value: "+-30 min" }], ref: "Walker, Why We Sleep (2018)" },
  { icon: <Apple className="w-5 h-5" />, title: "Nutrition & metabolisme", score: 83, tag: "Stable", tagColor: "#3ECF8E", desc: "Alimentation riche en proteines (1.6g/kg), fibres et polyphenols.", stats: [{ label: "Proteines/j", value: "1.6g/kg" }, { label: "Fibres/j", value: "30g+" }, { label: "Indice NOVA", value: "<10%" }], ref: "Levine et al., Cell Metabolism (2018)" },
  { icon: <Brain className="w-5 h-5" />, title: "Sante cognitive", score: 72, tag: "A travailler", tagColor: "#ff6b6b", desc: "Stimulation cognitive, gestion du stress et liens sociaux forts.", stats: [{ label: "Meditation/j", value: "10 min" }, { label: "Apprentissage", value: "3x/sem." }, { label: "Social", value: "Actif" }], ref: "Livingston et al., Lancet (2020)" },
]

const hallmarks: { name: string; icon: React.ReactNode; action: string }[] = [
  { name: "Instabilite genomique", icon: <Dna className="w-4 h-4" />, action: "Sommeil, antioxydants" },
  { name: "Attrition des telomeres", icon: <Microscope className="w-4 h-4" />, action: "Exercice aerobie" },
  { name: "Alterations epigenetiques", icon: <FlaskConical className="w-4 h-4" />, action: "Nutrition, stress" },
  { name: "Perte de proteostasie", icon: <Shield className="w-4 h-4" />, action: "Jeune intermittent" },
  { name: "Macroautophagie defaillante", icon: <Recycle className="w-4 h-4" />, action: "Exercice, jeune" },
  { name: "Deregulation nutriments", icon: <Leaf className="w-4 h-4" />, action: "Nutrition, IGF-1" },
  { name: "Dysfonction mitochondriale", icon: <Zap className="w-4 h-4" />, action: "Zone 2, froid" },
  { name: "Senescence cellulaire", icon: <Ban className="w-4 h-4" />, action: "Exercice, senolytiques" },
  { name: "Epuisement cellules souches", icon: <Sprout className="w-4 h-4" />, action: "Sommeil, jeune" },
  { name: "Communication intercellulaire", icon: <Radio className="w-4 h-4" />, action: "Social, microbiome" },
  { name: "Dysbiose chronique", icon: <Bug className="w-4 h-4" />, action: "Fibres, probiotiques" },
  { name: "Neuroinflammation", icon: <Brain className="w-4 h-4" />, action: "Omega-3, sommeil" },
]

const bilanOptions: { id: string; title: string; score: number | null; description: string; duration: string; available: boolean; href: string; icon: React.ReactNode }[] = [
  { id: "condition-physique", title: "Condition physique", score: 84, description: "43 tests — mobilite, force, equilibre, souplesse.", duration: "15 min", available: true, href: "/onboarding/bilan-mobilite", icon: <Dumbbell className="w-5 h-5" /> },
  { id: "nutrition", title: "Nutrition", score: 83, description: "Symptomes digestifs & confort intestinal (GSRS).", duration: "5 min", available: true, href: "/onboarding/bilan-digestif", icon: <Apple className="w-5 h-5" /> },
  { id: "sommeil", title: "Sommeil", score: 80, description: "Qualite & recuperation nocturne.", duration: "10 min", available: true, href: "/onboarding/bilan-sommeil", icon: <Moon className="w-5 h-5" /> },
  { id: "emotionnel", title: "Sante emotionnelle", score: null, description: "Bien-etre emotionnel & desequilibres.", duration: "10 min", available: false, href: "#", icon: <Heart className="w-5 h-5" /> },
  { id: "stress", title: "Gestion du stress", score: null, description: "Niveau de stress & techniques adaptees.", duration: "8 min", available: false, href: "#", icon: <Wind className="w-5 h-5" /> },
]

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
  const [sessions, setSessions] = useState<Session[]>([
    { id: "1", date: (() => { const d = new Date(); d.setHours(9, 0, 0, 0); return d })(), type: "evo", label: "Seance EVO Mobilite", duration: 45 },
    { id: "2", date: (() => { const d = new Date(); d.setHours(14, 0, 0, 0); return d })(), type: "sport", label: "Run 5km", duration: 30 },
  ])
  const [modal, setModal] = useState<{ open: boolean; date: Date | null }>({ open: false, date: null })
  const [newSession, setNewSession] = useState({ type: "evo" as "evo" | "sport", label: "", duration: 45, notes: "" })
  const [calendarConnected, setCalendarConnected] = useState(false)
  const [calendarEmail, setCalendarEmail] = useState<string | null>(null)
  const [calendarLoading, setCalendarLoading] = useState(true)
  const [calendarWorking, setCalendarWorking] = useState(false)
  const [calendarError, setCalendarError] = useState<string | null>(null)
  const [googleEvents, setGoogleEvents] = useState<Session[]>([])
  const [syncingEvents, setSyncingEvents] = useState(false)

  /* ── drag & drop ── */
  const dragId = useRef<string | null>(null)
  const [dragOverDay, setDragOverDay] = useState<string | null>(null)

  const onDragStart = useCallback((e: React.DragEvent, sessionId: string) => {
    dragId.current = sessionId
    e.dataTransfer.effectAllowed = "move"
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
    const sid = dragId.current || e.dataTransfer.getData("text/plain")
    if (!sid) return
    setSessions(prev => prev.map(s => {
      if (s.id !== sid) return s
      const nd = new Date(targetDate)
      nd.setHours(getHours(s.date), getMinutes(s.date), 0, 0)
      return { ...s, date: nd }
    }))
    dragId.current = null
  }, [])

  /* ── google calendar ── */
  const fetchGoogleEvents = async (d: Date, forceSync = false) => {
    try {
      if (!isSupabaseConfigured || !supabase) return
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) return
      if (forceSync) { setSyncingEvents(true); await fetch("/api/calendar/google/sync", { method: "POST", headers: { Authorization: `Bearer ${session.access_token}` } }) }
      const timeMin = startOfMonth(d).toISOString(), timeMax = endOfMonth(d).toISOString()
      const res = await fetch(`/api/calendar/google/events?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}`, { headers: { Authorization: `Bearer ${session.access_token}` } })
      if (!res.ok) return
      const body = await res.json() as { events?: { id: string; summary: string; start: string; end: string; allDay: boolean }[] }
      setGoogleEvents((body.events ?? []).map(ev => ({ id: `g-${ev.id}`, date: parseISO(ev.start), type: "google" as const, label: ev.summary, duration: ev.allDay ? 0 : Math.round((new Date(ev.end).getTime() - new Date(ev.start).getTime()) / 60000) })))
    } catch { /* ignore */ } finally { setSyncingEvents(false) }
  }

  useEffect(() => {
    (async () => {
      try {
        if (!isSupabaseConfigured || !supabase) { setCalendarLoading(false); return }
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.access_token) { setCalendarLoading(false); return }
        const r = await fetch("/api/calendar/google/status", { headers: { Authorization: `Bearer ${session.access_token}` } })
        const body = await r.json() as { connected?: boolean; email?: string | null }
        const c = Boolean(body.connected); setCalendarConnected(c); setCalendarEmail(body.email ?? null)
        if (c) fetchGoogleEvents(currentDate)
      } catch {} finally { setCalendarLoading(false) }
    })()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
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
  const sessionsOnDay = (d: Date) => allSessions.filter(s => isSameDay(s.date, d))
  const monthDays = eachDayOfInterval({ start: startOfMonth(currentDate), end: endOfMonth(currentDate) })
  const firstDow = (startOfMonth(currentDate).getDay() + 6) % 7
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const addSessionHandler = () => {
    if (!modal.date || !newSession.label) return
    const d = new Date(modal.date); d.setHours(9, 0, 0, 0)
    setSessions(prev => [...prev, { id: Date.now().toString(), date: d, type: newSession.type, label: newSession.label, duration: newSession.duration, notes: newSession.notes }])
    setModal({ open: false, date: null }); setNewSession({ type: "evo", label: "", duration: 45, notes: "" })
  }

  const navigate = (dir: -1 | 1) => {
    if (calView === "month") setCurrentDate(dir === 1 ? addMonths(currentDate, 1) : subMonths(currentDate, 1))
    else if (calView === "week") setCurrentDate(dir === 1 ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1))
    else setCurrentDate(dir === 1 ? addDays(currentDate, 1) : subDays(currentDate, 1))
  }

  const calTitle = calView === "month" ? format(currentDate, "MMMM yyyy", { locale: fr }) : calView === "week" ? `${format(weekStart, "d MMM", { locale: fr })} — ${format(addDays(weekStart, 6), "d MMM yyyy", { locale: fr })}` : format(currentDate, "EEEE d MMMM yyyy", { locale: fr })

  const globalScore = Math.round(progressData[progressData.length - 1].global)
  const sessionTop = (s: Session) => Math.max(0, (getHours(s.date) - 8 + getMinutes(s.date) / 60) * H_PX)
  const sessionHeight = (s: Session) => Math.max(18, (s.duration / 60) * H_PX)
  const isDraggable = (s: Session) => s.type !== "google" // only local sessions

  const sections = [
    { id: "dashboard", label: "Dashboard", icon: <TrendingUp className="w-4 h-4" /> },
    { id: "planning", label: "Planning", icon: <Calendar className="w-4 h-4" /> },
    { id: "science", label: "Science", icon: <FlaskConical className="w-4 h-4" /> },
    { id: "bilans", label: "Bilans", icon: <ClipboardList className="w-4 h-4" /> },
  ]

  const viewOptions: { id: CalView; icon: React.ReactNode; label: string }[] = [
    { id: "week", icon: <Columns3 className="w-3.5 h-3.5" />, label: "Semaine" },
    { id: "month", icon: <LayoutGrid className="w-3.5 h-3.5" />, label: "Mois" },
    { id: "day", icon: <CalendarDays className="w-3.5 h-3.5" />, label: "Jour" },
  ]

  /* ── KPI data ── */
  const kpis = [
    { label: "Score Global", value: globalScore, unit: "/100", icon: <TrendingUp className="w-5 h-5" />, delta: "+20%", color: "#3ECF8E" },
    { label: "Age Biologique", value: "-4.2", unit: "ans", icon: <Dna className="w-5 h-5" />, delta: "vs age reel", color: "#3ECF8E" },
    { label: "Mobilite", value: 84, unit: "/100", icon: <Activity className="w-5 h-5" />, delta: "+22%", color: "#3ECF8E" },
    { label: "Sommeil", value: 80, unit: "/100", icon: <Moon className="w-5 h-5" />, delta: "+25%", color: "#c9a96e" },
  ]

  return (
    <div className="min-h-screen bg-[#fafbfa]">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 right-0 w-[700px] h-[700px] rounded-full opacity-[0.06]" style={{ background: "radial-gradient(circle, #3ECF8E 0%, transparent 60%)" }} />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, #c9a96e 0%, transparent 60%)" }} />
      </div>

      {/* ════════ HERO KPIs ════════ */}
      <style jsx>{`
        @keyframes blob1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-40px,30px) scale(1.15)} 66%{transform:translate(30px,-20px) scale(0.9)} }
        @keyframes blob2 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(50px,-40px) scale(1.1)} 66%{transform:translate(-30px,25px) scale(0.95)} }
        @keyframes blob3 { 0%,100%{transform:scale(1);opacity:0.08} 50%{transform:scale(1.3);opacity:0.15} }
      `}</style>
      <section id="dashboard">
        <div className="relative overflow-hidden bg-[#0a0a0a]">
          {/* animated gradient blobs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute w-[600px] h-[600px] rounded-full" style={{ top: "-10%", right: "-10%", background: "radial-gradient(circle, #c9a96e 0%, transparent 70%)", filter: "blur(80px)", opacity: 0.18, animation: "blob1 12s ease-in-out infinite" }} />
            <div className="absolute w-[500px] h-[500px] rounded-full" style={{ bottom: "-10%", left: "-10%", background: "radial-gradient(circle, #3ECF8E 0%, transparent 70%)", filter: "blur(60px)", opacity: 0.15, animation: "blob2 10s ease-in-out infinite" }} />
            <div className="absolute w-[400px] h-[400px] rounded-full" style={{ top: "40%", left: "50%", background: "radial-gradient(circle, #6366f1 0%, transparent 70%)", filter: "blur(80px)", opacity: 0.08, animation: "blob3 14s ease-in-out infinite" }} />
          </div>
          {/* mesh overlay for texture */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
          {/* ─── nav inside hero ─── */}
          <nav className="sticky top-0 z-30 bg-black/40 backdrop-blur-2xl border-b border-white/[0.06]">
            <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
              <Link href="/" className="text-xl font-light tracking-wide text-white/80">evo</Link>
              <div className="flex items-center gap-0.5 bg-white/[0.06] rounded-lg p-0.5">
                {sections.map(s => (
                  <a key={s.id} href={`#${s.id}`} onClick={e => { e.preventDefault(); document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" }) }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-[13px] font-medium transition-all text-white/35 hover:text-white hover:bg-white/[0.08]">
                    {s.icon}<span className="hidden sm:inline">{s.label}</span>
                  </a>
                ))}
              </div>
              <ScoreRing value={globalScore} size={40} />
            </div>
          </nav>
          <div className="max-w-5xl mx-auto px-6 py-10">
            <div className="flex items-center gap-2 mb-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#c9a96e]">Etat de sante</p>
              <span className="flex-1 h-px bg-white/[0.06]" />
              <span className="text-[11px] text-white/20 font-medium">{format(new Date(), "d MMMM yyyy", { locale: fr })}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {kpis.map((kpi, i) => (
                <div key={i} className={`relative rounded-xl p-5 overflow-hidden ${i === 0 ? "bg-white/[0.06] border border-white/[0.08]" : "bg-white/[0.03] border border-white/[0.05]"}`}>
                  {i === 0 && <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a96e]/40 to-transparent" />}
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center" style={{ color: kpi.color }}>{kpi.icon}</div>
                    {typeof kpi.value === "number" && <ScoreRing value={kpi.value} size={40} />}
                  </div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-white/30 mb-1">{kpi.label}</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-bold text-white/90 tracking-tight">{kpi.value}</span>
                    <span className="text-[11px] text-white/20 font-medium">{kpi.unit}</span>
                  </div>
                  <p className="text-[11px] mt-1 font-medium" style={{ color: kpi.color }}>{kpi.delta}</p>
                </div>
              ))}
            </div>
            {/* mini chart inline */}
            <div className="mt-6 bg-white/[0.03] border border-white/[0.05] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-medium text-white/30 uppercase tracking-wider">Progression 6 mois</p>
                <p className="text-[11px] text-[#3ECF8E] font-medium">+20 pts</p>
              </div>
              <ResponsiveContainer width="100%" height={80}>
                <AreaChart data={progressData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gHero" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3ECF8E" stopOpacity={0.25} /><stop offset="95%" stopColor="#3ECF8E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="global" stroke="#3ECF8E" strokeWidth={2} fill="url(#gHero)" />
                  <XAxis dataKey="mois" hide />
                  <YAxis domain={[50, 100]} hide />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-20">

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
                </>
              ) : (
                <button onClick={handleConnectCalendar} disabled={calendarWorking || calendarLoading} className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#1a1a1a]/40 border border-black/[0.06] px-3 py-1.5 rounded-md hover:border-[#3ECF8E]/40 hover:text-[#3ECF8E] transition-all disabled:opacity-30"><Plus className="w-3 h-3" /> Google Agenda</button>
              )}
            </div>
          </div>
          {calendarError && <p className="text-xs text-red-500 bg-red-50/80 px-3 py-2 rounded-lg mb-4">{calendarError}</p>}

          {/* calendar */}
          <div className="bg-white rounded-xl border border-black/[0.04] overflow-hidden">
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
                        <button onClick={() => setModal({ open: true, date: day })} className="w-full text-left">
                          <span className={`text-[10px] font-medium ${isToday(day) ? "w-4.5 h-4.5 rounded-full bg-[#3ECF8E] text-white flex items-center justify-center text-[9px]" : "text-[#1a1a1a]/40"}`}>{format(day, "d")}</span>
                        </button>
                        <div className="mt-px space-y-px">
                          {ds.slice(0, 2).map(s => (
                            <div key={s.id} draggable={isDraggable(s)} onDragStart={e => isDraggable(s) && onDragStart(e, s.id)}
                              className={`text-[8px] font-medium px-1 py-px rounded truncate ${isDraggable(s) ? "cursor-grab active:cursor-grabbing" : ""} ${s.type === "evo" ? "bg-[#3ECF8E]/10 text-[#1B9C6E]" : s.type === "google" ? "bg-[#4285f4]/10 text-[#1a73e8]" : "bg-[#c9a96e]/10 text-[#a08050]"}`}>{s.label}</div>
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
                        onDragOver={e => onDragOver(e, dayKey)} onDragLeave={onDragLeave} onDrop={e => onDrop(e, day)}
                        className={`border-r border-black/[0.03] ${isToday(day) ? "bg-[#3ECF8E]/[0.02]" : ""} ${dragOverDay === dayKey ? "bg-[#3ECF8E]/[0.06]" : ""}`}>
                        <div className="h-8 flex flex-col items-center justify-center border-b border-black/[0.04]">
                          <span className="text-[9px] font-medium text-[#1a1a1a]/25 uppercase leading-none">{format(day, "EEE", { locale: fr })}</span>
                          <span className={`text-[11px] font-semibold leading-none ${isToday(day) ? "w-4.5 h-4.5 rounded-full bg-[#3ECF8E] text-white flex items-center justify-center text-[9px] mt-0.5" : "text-[#1a1a1a]/60"}`}>{format(day, "d")}</span>
                        </div>
                        <div className="relative" style={{ height: HOURS.length * H_PX }}>
                          {HOURS.map(h => <div key={h} className="absolute w-full border-b border-black/[0.03]" style={{ top: (h - 8) * H_PX, height: H_PX }} />)}
                          {ds.map(s => {
                            const top = sessionTop(s), height = sessionHeight(s)
                            const cls = s.type === "evo" ? "bg-[#3ECF8E]/15 border-l-2 border-l-[#3ECF8E] text-[#1B9C6E]" : s.type === "google" ? "bg-[#4285f4]/10 border-l-2 border-l-[#4285f4] text-[#1a73e8]" : "bg-[#c9a96e]/12 border-l-2 border-l-[#c9a96e] text-[#a08050]"
                            return (
                              <div key={s.id} draggable={isDraggable(s)} onDragStart={e => isDraggable(s) && onDragStart(e, s.id)}
                                className={`absolute left-0.5 right-0.5 rounded px-1 py-px overflow-hidden transition-opacity group/sess ${isDraggable(s) ? "cursor-grab active:cursor-grabbing" : "cursor-default"} ${cls}`}
                                style={{ top, height: Math.max(height, 18) }}>
                                {isDraggable(s) && <GripVertical className="w-2.5 h-2.5 absolute top-0.5 right-0 opacity-0 group-hover/sess:opacity-40 text-current" />}
                                <p className="text-[8px] font-semibold truncate leading-tight">{s.label}</p>
                                {height >= 28 && <p className="text-[7px] opacity-50">{format(s.date, "HH:mm")} · {s.duration}m</p>}
                              </div>
                            )
                          })}
                          <button className="absolute inset-0 w-full opacity-0" onClick={() => setModal({ open: true, date: day })} />
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
                onDragOver={e => onDragOver(e, currentDate.toISOString())} onDragLeave={onDragLeave} onDrop={e => onDrop(e, currentDate)}>
                <div className="w-12 shrink-0 border-r border-black/[0.04]">
                  {HOURS.map(h => <div key={h} style={{ height: H_PX }} className="flex items-start justify-end pr-2 pt-0.5"><span className="text-[10px] text-[#1a1a1a]/25 font-medium">{String(h).padStart(2, "0")}:00</span></div>)}
                </div>
                <div className={`flex-1 relative ${isToday(currentDate) ? "bg-[#3ECF8E]/[0.02]" : ""} ${dragOverDay === currentDate.toISOString() ? "bg-[#3ECF8E]/[0.06]" : ""}`} style={{ height: HOURS.length * H_PX }}>
                  {HOURS.map(h => <div key={h} className="absolute w-full border-b border-black/[0.03]" style={{ top: (h - 8) * H_PX, height: H_PX }} />)}
                  {isToday(currentDate) && (() => {
                    const now = new Date(), top = (getHours(now) - 8 + getMinutes(now) / 60) * H_PX
                    if (top < 0 || top > HOURS.length * H_PX) return null
                    return <div className="absolute left-0 right-0 z-10 flex items-center" style={{ top }}><div className="w-2 h-2 rounded-full bg-[#ff4444]" /><div className="flex-1 h-px bg-[#ff4444]/50" /></div>
                  })()}
                  {sessionsOnDay(currentDate).map(s => {
                    const top = sessionTop(s), height = sessionHeight(s)
                    const cls = s.type === "evo" ? "bg-[#3ECF8E]/15 border-l-[3px] border-l-[#3ECF8E] text-[#1B9C6E]" : s.type === "google" ? "bg-[#4285f4]/10 border-l-[3px] border-l-[#4285f4] text-[#1a73e8]" : "bg-[#c9a96e]/12 border-l-[3px] border-l-[#c9a96e] text-[#a08050]"
                    return (
                      <div key={s.id} draggable={isDraggable(s)} onDragStart={e => isDraggable(s) && onDragStart(e, s.id)}
                        className={`absolute left-1 right-4 rounded-lg px-3 py-1 overflow-hidden group/sess ${isDraggable(s) ? "cursor-grab active:cursor-grabbing" : ""} ${cls}`}
                        style={{ top, height: Math.max(height, 24) }}>
                        {isDraggable(s) && <GripVertical className="w-3 h-3 absolute top-1 right-1 opacity-0 group-hover/sess:opacity-40 text-current" />}
                        <p className="text-[11px] font-semibold truncate">{s.label}</p>
                        <p className="text-[10px] opacity-60">{format(s.date, "HH:mm")} — {s.duration} min</p>
                      </div>
                    )
                  })}
                  <button className="absolute inset-0 w-full opacity-0" onClick={() => setModal({ open: true, date: currentDate })} />
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-5 mt-2.5 text-[10px] text-[#1a1a1a]/25">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-[#3ECF8E]/20" /> EVO</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-[#c9a96e]/20" /> Sport</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-[#4285f4]/20" /> Google</span>
          </div>
        </section>

        {/* ════════ PROGRESSION ════════ */}
        <section id="progression" className="scroll-mt-20">
          <SectionHeader title="Progression" subtitle="Evolution de tes scores sur 6 mois" />
          <div className="bg-white rounded-xl border border-black/[0.04] p-5 mb-4">
            <h3 className="text-[13px] font-medium text-[#1a1a1a]/70 mb-4">Scores globaux — 6 mois</h3>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={progressData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs><linearGradient id="gGlobal" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3ECF8E" stopOpacity={0.15} /><stop offset="95%" stopColor="#3ECF8E" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" />
                <XAxis dataKey="mois" tick={{ fontSize: 11, fill: "#aaa" }} axisLine={false} tickLine={false} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: "#aaa" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #f0f0f0", fontSize: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }} />
                <Area type="monotone" dataKey="global" stroke="#3ECF8E" strokeWidth={2} fill="url(#gGlobal)" name="Global" />
                <Area type="monotone" dataKey="mobilite" stroke="#c9a96e" strokeWidth={1.5} fill="none" strokeDasharray="4 2" name="Mobilite" />
                <Area type="monotone" dataKey="sommeil" stroke="#a78bfa" strokeWidth={1.5} fill="none" strokeDasharray="4 2" name="Sommeil" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-black/[0.04] p-5">
              <h3 className="text-[13px] font-medium text-[#1a1a1a]/70 mb-3">Profil de sante</h3>
              <ResponsiveContainer width="100%" height={180}>
                <RadarChart data={radarData}><PolarGrid stroke="#ececec" /><PolarAngleAxis dataKey="label" tick={{ fontSize: 11, fill: "#999" }} /><Radar name="Score" dataKey="value" stroke="#3ECF8E" fill="#3ECF8E" fillOpacity={0.12} strokeWidth={2} /></RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-xl border border-black/[0.04] p-5">
              <h3 className="text-[13px] font-medium text-[#1a1a1a]/70 mb-3">Activite cette semaine</h3>
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
          <SectionHeader title="Science de la longevite" subtitle="Piliers basees sur la recherche" />
          <div className="rounded-xl overflow-hidden mb-6" style={{ background: "linear-gradient(135deg, #0b1a12 0%, #0d2b1a 50%, #0b1a12 100%)" }}>
            <div className="px-7 py-7 relative">
              <div className="absolute top-0 right-0 w-48 h-48 opacity-[0.08] pointer-events-none" style={{ background: "radial-gradient(circle, #3ECF8E 0%, transparent 70%)" }} />
              <p className="text-[11px] font-semibold text-[#3ECF8E]/80 uppercase tracking-[0.15em] mb-2">Longevity Science</p>
              <h3 className="text-xl font-semibold text-white/90 leading-tight mb-2">La longevite est une <span className="text-[#3ECF8E]">competence</span></h3>
              <p className="text-[12px] text-white/30 max-w-md leading-relaxed">80% de la longevite en bonne sante est controlable par le comportement.</p>
              <div className="flex items-center gap-8 mt-4">
                {[{ label: "Ans gagnes", value: "+7" }, { label: "Mortalite", value: "-35%" }, { label: "Modifiable", value: "80%" }].map((s, i) => (
                  <div key={i}><p className="text-base font-semibold text-[#3ECF8E]">{s.value}</p><p className="text-[9px] text-white/20 mt-0.5">{s.label}</p></div>
                ))}
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {sciencePillars.map((pillar, i) => (
              <div key={i} className="bg-white rounded-xl border border-black/[0.04] p-5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all duration-300">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5"><div className="w-8 h-8 rounded-lg bg-[#f3f4f3] flex items-center justify-center text-[#1a1a1a]/50">{pillar.icon}</div><h3 className="text-[14px] font-medium text-[#1a1a1a]">{pillar.title}</h3></div>
                  <div className="flex items-center gap-2"><span className="text-[10px] font-semibold px-2 py-0.5 rounded-md" style={{ background: `${pillar.tagColor}10`, color: pillar.tagColor }}>{pillar.tag}</span><ScoreRing value={pillar.score} size={36} /></div>
                </div>
                <p className="text-[12px] text-[#1a1a1a]/40 leading-relaxed mb-3">{pillar.desc}</p>
                <div className="grid grid-cols-3 gap-2">
                  {pillar.stats.map((s, j) => (<div key={j} className="bg-[#f8f9f8] rounded-lg p-2 text-center"><p className="text-[12px] font-semibold text-[#3ECF8E]">{s.value}</p><p className="text-[8px] text-[#1a1a1a]/30 mt-0.5">{s.label}</p></div>))}
                </div>
                <p className="text-[9px] text-[#1a1a1a]/20 mt-2.5">Ref. {pillar.ref}</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl border border-black/[0.04] p-5">
            <h3 className="text-[14px] font-medium text-[#1a1a1a] mb-0.5">Les 12 hallmarks du vieillissement</h3>
            <p className="text-[11px] text-[#1a1a1a]/30 mb-3">Lopez-Otin et al., Cell (2023)</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {hallmarks.map((h, i) => (
                <div key={i} className="bg-[#f8f9f8] rounded-lg p-2.5 group hover:bg-[#3ECF8E]/[0.04] transition-colors">
                  <div className="text-[#1a1a1a]/30 mb-1 group-hover:text-[#3ECF8E] transition-colors">{h.icon}</div>
                  <p className="text-[10px] font-medium text-[#1a1a1a]/70 leading-tight">{h.name}</p>
                  <p className="text-[9px] text-[#3ECF8E]/70 mt-0.5 flex items-center gap-0.5"><ArrowRight className="w-2 h-2" /> {h.action}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════ BILANS ════════ */}
        <section id="bilans" className="scroll-mt-20">
          <SectionHeader title="Bilans de sante" subtitle="Evaluations scientifiques personnalisees" gold />
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            {bilanOptions.map(bilan => (
              <div key={bilan.id} className={`relative rounded-xl border p-5 transition-all duration-300 overflow-hidden ${bilan.available ? "bg-gradient-to-br from-white via-white to-[#c9a96e]/[0.03] border-[#c9a96e]/10 hover:border-[#c9a96e]/25 hover:shadow-[0_4px_24px_rgba(201,169,110,0.08)] cursor-pointer" : "bg-white border-black/[0.03] opacity-50"}`}
                onClick={() => bilan.available && router.push(bilan.href)}>
                {bilan.available && <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a96e]/30 to-transparent" />}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${bilan.available ? "bg-[#c9a96e]/10 text-[#c9a96e]" : "bg-[#f3f4f3] text-[#1a1a1a]/25"}`}>{bilan.icon}</div>
                    <div><h3 className="text-[14px] font-medium text-[#1a1a1a]">{bilan.title}</h3><p className="text-[11px] text-[#1a1a1a]/30 mt-0.5">{bilan.duration}</p></div>
                  </div>
                  {bilan.score !== null ? <ScoreRing value={bilan.score} size={44} /> : <span className="text-[10px] font-medium bg-[#f3f4f3] text-[#1a1a1a]/30 px-2 py-0.5 rounded-md">Bientot</span>}
                </div>
                <p className="text-[13px] text-[#1a1a1a]/40 mt-3 leading-relaxed">{bilan.description}</p>
                {bilan.available && (
                  <div className="mt-3 flex items-center gap-3">
                    <span className="text-[11px] text-[#c9a96e] font-medium shrink-0 flex items-center gap-1">{bilan.score !== null ? "Voir le detail" : "Commencer"} <ArrowRight className="w-3 h-3" /></span>
                    {bilan.score !== null && <div className="flex-1 bg-[#c9a96e]/10 rounded-full h-1"><div className="h-1 rounded-full transition-all" style={{ width: `${bilan.score}%`, background: "linear-gradient(90deg, #c9a96e, #d4af37)" }} /></div>}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-[#c9a96e]/15 p-4 flex items-center gap-3 bg-gradient-to-r from-[#c9a96e]/[0.04] via-white to-white">
            <div className="w-8 h-8 rounded-lg bg-[#c9a96e]/10 flex items-center justify-center text-[#c9a96e]"><Lightbulb className="w-4 h-4" /></div>
            <div><p className="text-[13px] font-medium text-[#1a1a1a]">Prochaine recommandation</p><p className="text-[11px] text-[#1a1a1a]/40 mt-0.5">Completer le bilan Gestion du stress pour affiner ton score cognitif.</p></div>
          </div>
        </section>
      </div>

      {/* ─── MODAL ─── */}
      {modal.open && modal.date && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setModal({ open: false, date: null })} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[14px] font-medium text-[#1a1a1a]">Ajouter — {format(modal.date, "EEEE d MMMM", { locale: fr })}</h3>
              <button onClick={() => setModal({ open: false, date: null })} className="w-6 h-6 rounded-md flex items-center justify-center text-[#1a1a1a]/25 hover:text-[#1a1a1a] hover:bg-[#f3f4f3] transition-colors"><X className="w-3.5 h-3.5" /></button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(["evo", "sport"] as const).map(type => (
                <button key={type} onClick={() => setNewSession(s => ({ ...s, type }))} className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[13px] font-medium border transition-all ${newSession.type === type ? type === "evo" ? "bg-[#3ECF8E]/8 border-[#3ECF8E]/30 text-[#1B9C6E]" : "bg-[#c9a96e]/8 border-[#c9a96e]/30 text-[#a08050]" : "border-black/[0.06] text-[#1a1a1a]/35"}`}>
                  {type === "evo" ? <><Dumbbell className="w-3.5 h-3.5" /> EVO</> : <><Activity className="w-3.5 h-3.5" /> Sport</>}
                </button>
              ))}
            </div>
            <input type="text" placeholder={newSession.type === "evo" ? "ex. Mobilite EVO" : "ex. Run 5km"} value={newSession.label} onChange={e => setNewSession(s => ({ ...s, label: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border border-black/[0.06] text-[13px] focus:outline-none focus:border-[#3ECF8E]/40 transition-colors placeholder:text-[#1a1a1a]/20" />
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-[11px] text-[#1a1a1a]/30 shrink-0"><Timer className="w-3 h-3" /> min</div>
              <input type="number" min={5} max={180} step={5} value={newSession.duration} onChange={e => setNewSession(s => ({ ...s, duration: Number(e.target.value) }))} className="flex-1 px-3 py-2 rounded-lg border border-black/[0.06] text-[13px] focus:outline-none focus:border-[#3ECF8E]/40" />
            </div>
            <textarea placeholder="Notes (optionnel)" value={newSession.notes} onChange={e => setNewSession(s => ({ ...s, notes: e.target.value }))} rows={2} className="w-full px-3 py-2.5 rounded-lg border border-black/[0.06] text-[13px] focus:outline-none focus:border-[#3ECF8E]/40 resize-none placeholder:text-[#1a1a1a]/20" />
            <div className="flex gap-2 pt-1">
              <button onClick={() => setModal({ open: false, date: null })} className="flex-1 py-2.5 rounded-lg border border-black/[0.06] text-[13px] text-[#1a1a1a]/40 hover:text-[#1a1a1a] transition-colors">Annuler</button>
              <button onClick={addSessionHandler} disabled={!newSession.label} className="flex-1 py-2.5 rounded-lg bg-[#1a1a1a] text-white text-[13px] font-medium hover:bg-[#333] transition-colors disabled:opacity-30 disabled:cursor-not-allowed">Ajouter</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
