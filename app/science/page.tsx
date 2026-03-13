"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import {
  Activity, Moon, Apple, Brain, Dna, Microscope, FlaskConical, Shield,
  Recycle, Leaf, Zap, Ban, Sprout, Radio, Bug, Heart, ArrowRight, ArrowLeft,
  BookOpen, Target, Sparkles, Clock, TrendingUp, ChevronDown,
} from "lucide-react"

/* ─── data ─── */
const pillars = [
  {
    icon: <Activity className="w-6 h-6" />,
    title: "Exercice physique",
    tag: "Pilier #1",
    tagColor: "#3ECF8E",
    color: "#3ECF8E",
    desc: "L'activite physique reguliere est le facteur modifiable le plus puissant pour la longevite. Les etudes montrent une reduction de mortalite toutes causes de 30 a 45% chez les individus les plus actifs.",
    details: [
      "Zone 2 (endurance faible intensite) : 150-180 min/semaine pour optimiser la fonction mitochondriale et le VO2max",
      "Entrainement en force : 2-3 seances/semaine pour maintenir la masse musculaire, densite osseuse et sensibilite a l'insuline",
      "Equilibre & stabilite : exercices fonctionnels pour prevenir les chutes, 1ere cause de mortalite accidentelle apres 65 ans",
      "Souplesse & mobilite : amplitude articulaire = autonomie. Le yoga et le stretching actif reduisent l'inflammation systemique",
    ],
    stats: [{ label: "VO2max cible", value: "+15%" }, { label: "Zone 2/sem.", value: "150 min" }, { label: "Force/sem.", value: "2-3x" }],
    ref: "Attia, Outlive (2023) · Mandsager et al., JAMA (2018)",
  },
  {
    icon: <Moon className="w-6 h-6" />,
    title: "Sommeil & recuperation",
    tag: "Critique",
    tagColor: "#a78bfa",
    color: "#a78bfa",
    desc: "7-9h par nuit. La restriction chronique de sommeil accelere le vieillissement cellulaire, augmente le risque d'Alzheimer et degrade le systeme immunitaire de maniere mesurable.",
    details: [
      "Le sommeil profond (stades 3-4) est le moment ou le cerveau elimine les dechets metaboliques via le systeme glymphatique",
      "La consistance horaire (+-30 min) est plus importante que la duree totale pour la sante metabolique",
      "L'exposition a la lumiere bleue avant le coucher supprime la melatonine et retarde l'endormissement de 90 min en moyenne",
      "Un manque chronique de sommeil (<6h) double le risque cardiovasculaire et accelere le raccourcissement des telomeres",
    ],
    stats: [{ label: "Duree cible", value: "7-9h" }, { label: "Efficacite", value: ">85%" }, { label: "Consistance", value: "±30 min" }],
    ref: "Walker, Why We Sleep (2018) · Xie et al., Science (2013)",
  },
  {
    icon: <Apple className="w-6 h-6" />,
    title: "Nutrition & metabolisme",
    tag: "Fondamental",
    tagColor: "#c9a96e",
    color: "#c9a96e",
    desc: "Alimentation riche en proteines de qualite (1.6g/kg), fibres (30g+/j) et polyphenols. Le metabolisme est la cl' de l'age biologique : ce que vous mangez determine comment vos cellules vieillissent.",
    details: [
      "Proteines de qualite (1.6-2.2g/kg/j) : essentielles pour la synthese protéique musculaire, surtout apres 40 ans (resistance anabolique)",
      "Fibres (30g+/j) : nourrissent le microbiome intestinal qui produit des acides gras a chaine courte anti-inflammatoires",
      "Polyphenols & antioxydants : presents dans les fruits colores, the vert, curcuma. Activent les voies de longevite (AMPK, sirtuines)",
      "Restriction calorique moderee ou jeune intermittent : active l'autophagie, le nettoyage cellulaire. 12-16h de jeune nocturne suffit",
    ],
    stats: [{ label: "Proteines/j", value: "1.6g/kg" }, { label: "Fibres/j", value: "30g+" }, { label: "Indice NOVA", value: "<10%" }],
    ref: "Levine et al., Cell Metabolism (2018) · Longo & Mattson, Cell Metabolism (2014)",
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: "Sante cognitive & stress",
    tag: "Protecteur",
    tagColor: "#ff6b6b",
    color: "#ff6b6b",
    desc: "Le cerveau est l'organe le plus vulnerable au vieillissement. Stimulation cognitive, gestion du stress et liens sociaux forts sont les trois piliers de la neuroprotection.",
    details: [
      "La meditation (10 min/j) reduit le cortisol de 25% et augmente l'epaisseur corticale des zones prefrontales",
      "L'apprentissage continu (langues, musique, competences nouvelles) cree des reserves cognitives protectrices contre la demence",
      "L'isolement social est un facteur de risque de mortalite equivalent a fumer 15 cigarettes par jour",
      "Le stress chronique accelere le vieillissement epigenetique de 2-3 ans et degrade la longueur des telomeres",
    ],
    stats: [{ label: "Meditation/j", value: "10 min" }, { label: "Apprentissage", value: "3x/sem." }, { label: "Social", value: "Actif" }],
    ref: "Livingston et al., Lancet (2020) · Epel et al., PNAS (2004)",
  },
]

const hallmarks = [
  { name: "Instabilite genomique", icon: <Dna className="w-5 h-5" />, action: "Sommeil reparateur, antioxydants alimentaires", desc: "Accumulation de dommages a l'ADN au fil du temps. Le sommeil profond active les mecanismes de reparation." },
  { name: "Attrition des telomeres", icon: <Microscope className="w-5 h-5" />, action: "Exercice aerobie regulier", desc: "Raccourcissement des capuchons protecteurs de l'ADN. L'exercice active la telomerase." },
  { name: "Alterations epigenetiques", icon: <FlaskConical className="w-5 h-5" />, action: "Nutrition, gestion du stress", desc: "Modifications de l'expression des genes sans changer l'ADN. Le mode de vie module directement l'epigenome." },
  { name: "Perte de proteostasie", icon: <Shield className="w-5 h-5" />, action: "Jeune intermittent, autophagie", desc: "Accumulation de proteines mal repliees. Le jeune active le nettoyage proteique cellulaire." },
  { name: "Macroautophagie defaillante", icon: <Recycle className="w-5 h-5" />, action: "Exercice, jeune, restriction calorique", desc: "Defaut du systeme de recyclage cellulaire. L'exercice et le jeune stimulent ce processus vital." },
  { name: "Deregulation des nutriments", icon: <Leaf className="w-5 h-5" />, action: "Nutrition optimisee, IGF-1", desc: "Sensibilite alteree aux signaux nutritionnels (mTOR, AMPK, sirtuines). L'alimentation les module." },
  { name: "Dysfonction mitochondriale", icon: <Zap className="w-5 h-5" />, action: "Zone 2, exposition au froid", desc: "Perte d'efficacite des centrales energetiques cellulaires. L'endurance et le froid stimulent la biogenese." },
  { name: "Senescence cellulaire", icon: <Ban className="w-5 h-5" />, action: "Exercice, senolytiques naturels", desc: "Cellules zombie qui secretent des signaux inflammatoires. L'exercice aide a les eliminer." },
  { name: "Epuisement cellules souches", icon: <Sprout className="w-5 h-5" />, action: "Sommeil, jeune periodique", desc: "Reduction du potentiel regeneratif. Le sommeil et le jeune preservent les cellules souches." },
  { name: "Communication intercellulaire", icon: <Radio className="w-5 h-5" />, action: "Social actif, microbiome", desc: "Alteration des signaux entre cellules. Les liens sociaux et un microbiome sain les restaurent." },
  { name: "Dysbiose chronique", icon: <Bug className="w-5 h-5" />, action: "Fibres, probiotiques, diversite", desc: "Desequilibre du microbiome intestinal. 30g+ de fibres/j et la diversite alimentaire le corrigent." },
  { name: "Neuroinflammation", icon: <Brain className="w-5 h-5" />, action: "Omega-3, sommeil, exercice", desc: "Inflammation chronique du cerveau. Les omega-3 (EPA/DHA) et le sommeil profond sont protecteurs." },
]

const keyInsights = [
  { icon: <Target className="w-5 h-5" />, title: "80% modifiable", desc: "La genetique ne compte que pour 20%. Le mode de vie determine l'essentiel de la longevite en bonne sante.", color: "#3ECF8E" },
  { icon: <TrendingUp className="w-5 h-5" />, title: "+7 ans d'esperance de vie", desc: "En combinant exercice, sommeil, nutrition et gestion du stress : gain moyen de 7 ans supplementaires.", color: "#c9a96e" },
  { icon: <Clock className="w-5 h-5" />, title: "Il n'est jamais trop tard", desc: "Commencer l'exercice a 50 ans reduit encore la mortalite de 35%. Chaque jour compte.", color: "#a78bfa" },
  { icon: <Sparkles className="w-5 h-5" />, title: "Synergie des piliers", desc: "Les 4 piliers se renforcent mutuellement. L'exercice ameliore le sommeil qui ameliore la cognition.", color: "#ff6b6b" },
]

const references = [
  "Lopez-Otin et al., \"Hallmarks of Aging: An Expanding Universe\", Cell (2023)",
  "Attia P., \"Outlive: The Science & Art of Longevity\" (2023)",
  "Walker M., \"Why We Sleep\" (2018)",
  "Levine et al., \"Low Protein Intake Is Associated with a Major Reduction in IGF-1\", Cell Metabolism (2014)",
  "Livingston et al., \"Dementia prevention, intervention, and care\", Lancet (2020)",
  "Mandsager et al., \"Association of Cardiorespiratory Fitness With Long-term Mortality\", JAMA (2018)",
  "Epel et al., \"Accelerated telomere shortening in response to life stress\", PNAS (2004)",
  "Xie et al., \"Sleep Drives Metabolite Clearance from the Adult Brain\", Science (2013)",
  "Longo & Mattson, \"Fasting: Molecular Mechanisms and Clinical Applications\", Cell Metabolism (2014)",
]

/* ─── components ─── */
function AnimatedCounter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    if (!ref.current) return
    started.current = false
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true
        let start = 0
        const step = () => {
          start += Math.ceil(end / 40)
          if (start >= end) { setCount(end); return }
          setCount(start)
          requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      }
    }, { threshold: 0.3 })
    obs.observe(ref.current)
    return () => { obs.disconnect(); started.current = false }
  }, [end])

  return <div ref={ref}>{count}{suffix}</div>
}

/* ─── page ─── */
export default function SciencePage() {
  const [expandedPillar, setExpandedPillar] = useState<number | null>(null)
  const [expandedHallmark, setExpandedHallmark] = useState<number | null>(null)

  return (
    <div className="min-h-screen">
      <style jsx>{`
        @keyframes float1 { 0%, 100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-40px,30px) scale(1.1); } }
        @keyframes float2 { 0%, 100% { transform: translate(0,0) scale(1); } 50% { transform: translate(30px,-40px) scale(1.08); } }
        @keyframes float3 { 0%, 100% { transform: scale(1); opacity:0.03; } 50% { transform: scale(1.3); opacity:0.06; } }
      `}</style>

      {/* ─── nav ─── */}
      <div className="bg-[#0a0a0a] text-white relative overflow-hidden">
        {/* background blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute w-[800px] h-[800px] rounded-full" style={{ top: "-20%", right: "-15%", background: "radial-gradient(circle, #3ECF8E 0%, transparent 65%)", filter: "blur(120px)", opacity: 0.06, animation: "float1 18s ease-in-out infinite" }} />
          <div className="absolute w-[600px] h-[600px] rounded-full" style={{ bottom: "-15%", left: "-10%", background: "radial-gradient(circle, #c9a96e 0%, transparent 65%)", filter: "blur(100px)", opacity: 0.04, animation: "float2 14s ease-in-out infinite" }} />
          <div className="absolute w-[400px] h-[400px] rounded-full" style={{ top: "40%", left: "50%", background: "radial-gradient(circle, #a78bfa 0%, transparent 65%)", filter: "blur(100px)", opacity: 0.03, animation: "float3 20s ease-in-out infinite" }} />
        </div>
      <nav className="sticky top-0 z-50 bg-black/60 backdrop-blur-2xl border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-light tracking-wide text-white/80">evo</Link>
            <span className="w-px h-5 bg-white/10" />
            <span className="text-[11px] font-semibold text-[#c9a96e] uppercase tracking-[0.15em]">Science</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-[12px] text-white/30 hover:text-white/60 transition-colors">Accueil</Link>
            <Link href="/onboarding/bilans" className="text-[12px] font-medium text-white/50 hover:text-white transition-colors border border-white/10 hover:border-white/25 rounded-full px-3.5 py-1.5">Mon espace</Link>
          </div>
        </div>
      </nav>

      {/* ═══════ HERO ═══════ */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24">
        <Link href="/onboarding/bilans" className="inline-flex items-center gap-1.5 text-[11px] text-white/25 hover:text-white/50 transition-colors mb-10">
          <ArrowLeft className="w-3 h-3" /> Retour au dashboard
        </Link>
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold text-[#c9a96e] uppercase tracking-[0.2em] mb-4">Science de la longevite</p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-[-0.03em] leading-[1.05] mb-6">
            Vivre plus longtemps,<br /><span className="text-[#c9a96e]">en pleine sante</span>
          </h1>
          <p className="text-lg text-white/35 leading-relaxed max-w-2xl mb-10">
            80% de la longevite en bonne sante est controlable par le comportement. Decouvre les piliers scientifiques, les mecanismes du vieillissement, et les strategies validees par la recherche.
          </p>
        </div>

        {/* stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {keyInsights.map((k, i) => (
            <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-5 hover:bg-white/[0.05] transition-all duration-300">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: `${k.color}15`, color: k.color }}>{k.icon}</div>
              <h3 className="text-[15px] font-bold text-white mb-1">{k.title}</h3>
              <p className="text-[11px] text-white/30 leading-relaxed">{k.desc}</p>
            </div>
          ))}
        </div>
      </section>
      </div>{/* end dark hero wrapper */}

      {/* ═══════ STATS BAR — LIGHT ═══════ */}
      <section className="py-16 bg-[#f5f3ef] text-[#1a1a1a]">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-3 gap-8 text-center">
          {[
            { end: 200, suffix: "+", label: "Etudes analysees", sub: "meta-analyses & essais cliniques" },
            { end: 15, suffix: "+", label: "Annees de recherche", sub: "en sciences du vieillissement" },
            { end: 80, suffix: "%", label: "Facteurs modifiables", sub: "de la longevite en bonne sante" },
          ].map((s, i) => (
            <div key={i}>
              <div className="text-4xl md:text-5xl font-bold text-[#c9a96e] mb-1"><AnimatedCounter end={s.end} suffix={s.suffix} /></div>
              <p className="text-[13px] font-medium text-[#1a1a1a]/55">{s.label}</p>
              <p className="text-[10px] text-[#1a1a1a]/30 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ 4 PILIERS — LIGHT ═══════ */}
      <section className="bg-[#f5f3ef] text-[#1a1a1a] pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="pt-8 border-t border-[#e0ddd7] mb-12">
            <p className="text-[11px] font-semibold text-[#c9a96e] uppercase tracking-[0.2em] mb-3">Evidence-based</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.02em] mb-2 text-[#1a1a1a]">Les 4 piliers de la longevite</h2>
            <p className="text-[14px] text-[#1a1a1a]/40">Chaque pilier est soutenu par des centaines d&apos;etudes. Clique pour explorer.</p>
          </div>

          <div className="space-y-4">
            {pillars.map((p, i) => {
              const open = expandedPillar === i
              return (
                <div key={i} className="rounded-2xl border overflow-hidden transition-all duration-500" style={{ borderColor: open ? `${p.color}30` : '#e0ddd7', background: open ? `linear-gradient(135deg, ${p.color}08 0%, #f5f3ef 60%)` : 'white' }}>
                  <button onClick={() => setExpandedPillar(open ? null : i)} className="w-full px-6 py-5 flex items-center gap-4 text-left group">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300" style={{ background: `${p.color}15`, color: p.color }}>{p.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-[16px] font-semibold text-[#1a1a1a]">{p.title}</h3>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-md" style={{ background: `${p.tagColor}20`, color: p.tagColor }}>{p.tag}</span>
                      </div>
                      <p className="text-[12px] text-[#1a1a1a]/40 truncate">{p.desc.slice(0, 100)}...</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="hidden md:flex items-center gap-2">
                        {p.stats.map((s, j) => (
                          <div key={j} className="text-center px-3 py-1 rounded-lg bg-[#e8e5df]">
                            <p className="text-[12px] font-bold" style={{ color: p.color }}>{s.value}</p>
                            <p className="text-[8px] text-[#1a1a1a]/30">{s.label}</p>
                          </div>
                        ))}
                      </div>
                      <ChevronDown className={`w-5 h-5 text-[#1a1a1a]/20 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
                    </div>
                  </button>
                  {open && (
                    <div className="px-6 pb-6 pt-0">
                      <div className="border-t border-[#e0ddd7] pt-5">
                        <p className="text-[13px] text-[#1a1a1a]/50 leading-relaxed mb-5">{p.desc}</p>
                        <div className="grid md:grid-cols-2 gap-3 mb-5">
                          {p.details.map((d, j) => (
                            <div key={j} className="flex gap-3 p-3 rounded-xl bg-white/60 border border-[#e0ddd7]">
                              <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: p.color }} />
                              <p className="text-[12px] text-[#1a1a1a]/55 leading-relaxed">{d}</p>
                            </div>
                          ))}
                        </div>
                        <div className="flex md:hidden items-center gap-2 mb-4">
                          {p.stats.map((s, j) => (
                            <div key={j} className="flex-1 text-center p-2 rounded-lg bg-[#e8e5df]">
                              <p className="text-[13px] font-bold" style={{ color: p.color }}>{s.value}</p>
                              <p className="text-[9px] text-[#1a1a1a]/30">{s.label}</p>
                            </div>
                          ))}
                        </div>
                        <p className="text-[10px] text-[#1a1a1a]/25 flex items-center gap-1"><BookOpen className="w-3 h-3" /> {p.ref}</p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════ 12 HALLMARKS — DARK ═══════ */}
      <section className="bg-[#0a0a0a] text-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <p className="text-[11px] font-semibold text-[#3ECF8E]/60 uppercase tracking-[0.2em] mb-3">Lopez-Otin et al., Cell (2023)</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.02em] mb-2">Les 12 hallmarks du vieillissement</h2>
            <p className="text-[14px] text-white/30">Les mecanismes biologiques fondamentaux qui causent le vieillissement — et comment les contrer.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {hallmarks.map((h, i) => {
              const open = expandedHallmark === i
              return (
                <div key={i}
                  onClick={() => setExpandedHallmark(open ? null : i)}
                  className={`rounded-xl border p-4 transition-all duration-300 cursor-pointer ${open ? "bg-[#3ECF8E]/[0.04] border-[#3ECF8E]/15" : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.10]"}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${open ? "bg-[#3ECF8E]/15 text-[#3ECF8E]" : "bg-white/[0.06] text-white/30"}`}>{h.icon}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-[13px] font-semibold transition-colors ${open ? "text-[#3ECF8E]" : "text-white/70"}`}>{h.name}</h3>
                      <p className="text-[11px] text-[#3ECF8E]/60 mt-0.5 flex items-center gap-1"><ArrowRight className="w-2.5 h-2.5" /> {h.action}</p>
                      {open && <p className="text-[11px] text-white/30 mt-2 leading-relaxed">{h.desc}</p>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════ REFERENCES — LIGHT ═══════ */}
      <section className="bg-[#f5f3ef] text-[#1a1a1a] py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-8">
            <p className="text-[11px] font-semibold text-[#1a1a1a]/25 uppercase tracking-[0.2em] mb-3">Sources</p>
            <h2 className="text-2xl font-bold tracking-[-0.02em] text-[#1a1a1a]">References scientifiques</h2>
          </div>
          <div className="space-y-2">
            {references.map((r, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3 rounded-lg bg-white/60 border border-[#e0ddd7]">
                <BookOpen className="w-4 h-4 text-[#1a1a1a]/20 mt-0.5 shrink-0" />
                <p className="text-[12px] text-[#1a1a1a]/45 leading-relaxed">{r}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CTA — LIGHT ═══════ */}
      <section className="py-20 bg-[#f5f3ef] text-[#1a1a1a] border-t border-[#e0ddd7]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.02em] mb-4 text-[#1a1a1a]">Pret a appliquer la science ?</h2>
          <p className="text-[15px] text-[#1a1a1a]/40 mb-8">Complete tes bilans pour obtenir un profil personnalise base sur ces piliers scientifiques.</p>
          <Link href="/onboarding/bilans" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#1a1a1a] text-white font-semibold text-[14px] hover:bg-[#333] transition-all duration-300 hover:shadow-lg">
            Retour au dashboard <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ─── footer — dark ─── */}
      <footer className="py-8 px-6 bg-[#0a0a0a] text-white border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-[13px] text-white/15">evo — Longevity Science</span>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[11px] text-white/20 hover:text-white/40 transition-colors">Accueil</Link>
            <Link href="/onboarding/bilans" className="text-[11px] text-white/20 hover:text-white/40 transition-colors">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
