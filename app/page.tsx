'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  /* Hero video crossfade */
  const [activeVideo, setActiveVideo] = useState(0)
  const video1Ref = useRef<HTMLVideoElement>(null)
  const video2Ref = useRef<HTMLVideoElement>(null)
  const video3Ref = useRef<HTMLVideoElement>(null)
  const heroVideos = ['/hero-bg.mp4', '/Vid%C3%A9o_Fitness_Non_Chinoise_G%C3%A9n%C3%A9r%C3%A9e.mp4', '/Vid%C3%A9o_optimis%C3%A9e_mouvements_et_esth%C3%A9tique.mp4']
  const videoRefs = [video1Ref, video2Ref, video3Ref]

  /* Typewriter */
  const [rotatingWordIndex, setRotatingWordIndex] = useState(0)
  const [typedText, setTypedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctaSectionRef = useRef<HTMLDivElement>(null)

  const rotatingWords = ['en forme.', 'autonome.', 'sans douleur.', 'solide.', 'actif(ve).', 'ind\u00e9pendant(e).']

  useEffect(() => {
    setMounted(true)

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('code')) {
        if (!params.get('next')) {
          params.set('next', '/onboarding/bilans')
        }
        window.location.replace(`/auth/callback?${params.toString()}`)
      }
    }
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return

    async function loadSession() {
      const {
        data: { session },
      } = await supabase!.auth.getSession()
      if (session?.user) {
        setIsLoggedIn(true)
        return
      }
      setIsLoggedIn(false)
    }

    loadSession()

    const {
      data: { subscription },
    } = supabase!.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsLoggedIn(true)
      } else {
        setIsLoggedIn(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  /* Animated fitness silhouettes on canvas */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const section = ctaSectionRef.current
      if (section) {
        canvas.width = section.offsetWidth
        canvas.height = section.offsetHeight
      } else {
        canvas.width = window.innerWidth
        canvas.height = 400
      }
    }
    resize()
    window.addEventListener('resize', resize)

    type Pose = number[]

    const lerpPose = (a: Pose, b: Pose, t: number): Pose =>
      a.map((v, i) => v + (b[i] - v) * t)

    const getPoseFromSequence = (poses: Pose[], progress: number): Pose => {
      const n = poses.length
      const scaled = progress * n
      const i = Math.floor(scaled) % n
      const j = (i + 1) % n
      const local = scaled - Math.floor(scaled)
      const t = local * local * (3 - 2 * local)
      return lerpPose(poses[i], poses[j], t)
    }

    const stand: Pose = [0,-4.2, 0,-3.7, 0,-3.3, 0,-1.6,  -0.5,-2.7, -0.3,-1.9,  0.5,-2.7, 0.3,-1.9,  -0.35,-0.6, -0.35,0.3,  0.35,-0.6, 0.35,0.3]
    const armsHalf: Pose = [0,-4.25, 0,-3.75, 0,-3.35, 0,-1.6,  -0.7,-3.5, -0.5,-4.0,  0.7,-3.5, 0.5,-4.0,  -0.35,-0.6, -0.35,0.3,  0.35,-0.6, 0.35,0.3]
    const armsUp: Pose = [0,-4.3, 0,-3.8, 0,-3.4, 0,-1.6,  -0.25,-3.9, -0.12,-4.5,  0.25,-3.9, 0.12,-4.5,  -0.35,-0.6, -0.35,0.3,  0.35,-0.6, 0.35,0.3]
    const war2: Pose = [0,-4.0, 0,-3.5, 0,-3.1, 0,-1.5,  -1.3,-3.1, -1.9,-3.1,  1.3,-3.1, 1.9,-3.1,  -0.7,-0.2, -1.1,0.3,  0.6,-0.5, 1.0,0.3]
    const tree: Pose = [0,-4.3, 0,-3.8, 0,-3.4, 0,-1.6,  -0.4,-3.7, -0.25,-4.2,  0.4,-3.7, 0.25,-4.2,  -0.35,-0.6, -0.35,0.3,  0.3,-1.0, 0.15,-0.6]
    const crescent: Pose = [0,-4.2, 0,-3.7, 0,-3.3, 0,-1.7,  -0.2,-3.8, -0.1,-4.4,  0.2,-3.8, 0.1,-4.4,  -0.5,-0.5, -0.8,0.3,  0.7,-0.9, 1.2,0.05]
    const chair: Pose = [0,-3.8, 0,-3.3, 0,-2.9, 0,-1.3,  -0.25,-3.4, -0.1,-4.0,  0.25,-3.4, 0.1,-4.0,  -0.5,-0.2, -0.45,0.3,  0.5,-0.2, 0.45,0.3]
    const fold: Pose = [0,-2.5, 0,-2.7, 0,-2.9, 0,-1.6,  -0.3,-2.0, -0.3,-1.2,  0.3,-2.0, 0.3,-1.2,  -0.35,-0.6, -0.35,0.3,  0.35,-0.6, 0.35,0.3]
    const wide: Pose = [0,-3.7, 0,-3.2, 0,-2.8, 0,-1.4,  -1.1,-2.4, -1.4,-1.8,  1.1,-2.4, 1.4,-1.8,  -0.7,-0.1, -0.7,0.3,  0.7,-0.1, 0.7,0.3]
    const reachL: Pose = [-0.15,-4.15, -0.08,-3.65, -0.04,-3.25, 0,-1.6,  -0.8,-3.0, -1.1,-2.5,  0.3,-3.7, 0.15,-4.3,  -0.35,-0.6, -0.35,0.3,  0.35,-0.6, 0.35,0.3]
    const reachR: Pose = [0.15,-4.15, 0.08,-3.65, 0.04,-3.25, 0,-1.6,  -0.3,-3.7, -0.15,-4.3,  0.8,-3.0, 1.1,-2.5,  -0.35,-0.6, -0.35,0.3,  0.35,-0.6, 0.35,0.3]
    const lungeR: Pose = [0,-4.0, 0,-3.5, 0,-3.1, 0,-1.5,  -0.6,-2.5, -0.4,-1.7,  0.6,-2.5, 0.4,-1.7,  -0.3,-0.3, -0.3,0.3,  0.8,-0.7, 1.2,0.15]
    const lungeL: Pose = [0,-4.0, 0,-3.5, 0,-3.1, 0,-1.5,  -0.6,-2.5, -0.4,-1.7,  0.6,-2.5, 0.4,-1.7,  -0.8,-0.7, -1.2,0.15,  0.3,-0.3, 0.3,0.3]

    const allPoses: Pose[] = [
      stand, armsHalf, armsUp, armsHalf, stand,
      chair, chair, armsUp, stand,
      war2, war2, war2, stand,
      crescent, crescent, armsUp, stand,
      reachL, stand, reachR, stand,
      lungeR, stand, lungeL, stand,
      fold, fold, armsHalf, armsUp, armsHalf, stand,
    ]

    let frame = 0
    let prevPose: Pose | null = null
    let prevPose2: Pose | null = null
    const trailPoses: { pose: Pose; age: number }[] = []
    const trailPoses2: { pose: Pose; age: number }[] = []
    const totalCycleDuration = allPoses.length * 110

    const herPoses: Pose[] = [
      stand, tree, tree, tree, stand,
      armsHalf, armsUp, armsUp, armsHalf, stand,
      wide, wide, wide, stand,
      reachR, stand, reachL, stand,
      crescent, crescent, armsUp, stand,
      chair, chair, armsUp, stand,
      fold, fold, armsHalf, armsUp, armsHalf, stand,
    ]
    const totalCycleDuration2 = herPoses.length * 110

    interface GoldParticle {
      x: number; y: number; vx: number; vy: number
      life: number; maxLife: number; size: number
      brightness: number
    }
    const particles: GoldParticle[] = []

    const emitParticles = (x: number, y: number, velocityX: number, velocityY: number, count: number) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = 0.5 + Math.random() * 2.5
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed + velocityX * 0.3,
          vy: Math.sin(angle) * speed + velocityY * 0.3 - Math.random() * 1.5,
          life: 0, maxLife: 30 + Math.random() * 40,
          size: 1 + Math.random() * 2.5, brightness: 0.5 + Math.random() * 0.5
        })
      }
    }

    const drawParticles = () => {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx; p.y += p.vy; p.vy += 0.03; p.vx *= 0.99; p.life++
        if (p.life >= p.maxLife) { particles.splice(i, 1); continue }
        const lifeRatio = 1 - p.life / p.maxLife
        const alpha = lifeRatio * 0.7 * p.brightness
        const r = 201 + Math.round((255 - 201) * (1 - lifeRatio))
        const g = 169 + Math.round((215 - 169) * (1 - lifeRatio))
        const b = 110 - Math.round(60 * (1 - lifeRatio))
        ctx.globalAlpha = alpha
        ctx.fillStyle = `rgb(${r},${g},${b})`
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * lifeRatio, 0, Math.PI * 2); ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    const drawFigure = (pose: Pose, cx: number, cy: number, s: number, alpha: number, hasPonytail = false) => {
      ctx.globalAlpha = alpha; ctx.strokeStyle = '#c9a96e'; ctx.fillStyle = '#c9a96e'
      ctx.lineWidth = 2.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round'
      const pt = (i: number) => ({ x: cx + pose[i] * s, y: cy + pose[i + 1] * s })
      const head = pt(0), neck = pt(2), shoulder = pt(4), hip = pt(6)
      const lElbow = pt(8), lHand = pt(10), rElbow = pt(12), rHand = pt(14)
      const lKnee = pt(16), lFoot = pt(18), rKnee = pt(20), rFoot = pt(22)
      ctx.beginPath(); ctx.arc(head.x, head.y, s * 0.25, 0, Math.PI * 2); ctx.stroke()
      if (hasPonytail) {
        const r = s * 0.25
        ctx.beginPath(); ctx.moveTo(head.x + r * 0.5, head.y - r * 0.75)
        ctx.bezierCurveTo(head.x + r * 1.6, head.y - r * 0.3, head.x + r * 1.6, head.y - r * 0.3 + r * 0.8, head.x + r * 1.2, head.y + r * 1.8); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(head.x - r * 0.5, head.y - r * 0.75)
        ctx.bezierCurveTo(head.x - r * 1.6, head.y - r * 0.3, head.x - r * 1.6, head.y - r * 0.3 + r * 0.8, head.x - r * 1.2, head.y + r * 1.8); ctx.stroke()
      }
      ctx.beginPath(); ctx.moveTo(head.x, head.y + s * 0.25); ctx.lineTo(neck.x, neck.y); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(neck.x, neck.y); ctx.quadraticCurveTo(shoulder.x, shoulder.y, hip.x, hip.y); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(shoulder.x, shoulder.y); ctx.quadraticCurveTo(lElbow.x, lElbow.y, lHand.x, lHand.y); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(shoulder.x, shoulder.y); ctx.quadraticCurveTo(rElbow.x, rElbow.y, rHand.x, rHand.y); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(hip.x, hip.y); ctx.quadraticCurveTo(lKnee.x, lKnee.y, lFoot.x, lFoot.y); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(hip.x, hip.y); ctx.quadraticCurveTo(rKnee.x, rKnee.y, rFoot.x, rFoot.y); ctx.stroke()
    }

    const draw = () => {
      const w = canvas.width, h = canvas.height
      ctx.clearRect(0, 0, w, h); frame++
      const figSize = Math.min(w, h) * 0.15
      const cx = w * 0.85, cy = h * 0.78, floatY = Math.sin(frame * 0.005) * 2
      const progress = (frame % totalCycleDuration) / totalCycleDuration
      const pose = getPoseFromSequence(allPoses, progress)
      if (frame % 8 === 0) { trailPoses.push({ pose: [...pose], age: 0 }); if (trailPoses.length > 6) trailPoses.shift() }
      for (const trail of trailPoses) { trail.age++; const a = Math.max(0, 0.06 - trail.age * 0.004); if (a > 0) drawFigure(trail.pose, cx, cy + floatY, figSize, a) }
      ctx.save(); ctx.shadowColor = 'rgba(201, 169, 110, 0.3)'; ctx.shadowBlur = 20; drawFigure(pose, cx, cy + floatY, figSize, 0.55); ctx.restore()
      const cx2 = w * 0.15, cy2 = h * 0.78, floatY2 = Math.sin(frame * 0.006 + 1.5) * 2
      const progress2 = ((frame + totalCycleDuration2 * 0.3) % totalCycleDuration2) / totalCycleDuration2
      const pose2 = getPoseFromSequence(herPoses, progress2)
      if (frame % 8 === 0) { trailPoses2.push({ pose: [...pose2], age: 0 }); if (trailPoses2.length > 6) trailPoses2.shift() }
      for (const trail of trailPoses2) { trail.age++; const a = Math.max(0, 0.06 - trail.age * 0.004); if (a > 0) drawFigure(trail.pose, cx2, cy2 + floatY2, figSize, a, true) }
      ctx.save(); ctx.shadowColor = 'rgba(201, 169, 110, 0.3)'; ctx.shadowBlur = 20; drawFigure(pose2, cx2, cy2 + floatY2, figSize, 0.55, true); ctx.restore()
      const spt = (i: number) => ({ x: cx + pose[i] * figSize, y: cy + floatY + pose[i + 1] * figSize })
      if (prevPose) { for (const idx of [10, 14, 18, 22]) { const curr = spt(idx); const dx = curr.x - (cx + prevPose[idx] * figSize); const dy = curr.y - (cy + floatY + prevPose[idx + 1] * figSize); const dist = Math.sqrt(dx * dx + dy * dy); if (dist > 0.4) emitParticles(curr.x, curr.y, dx, dy, Math.min(Math.floor(dist), 3)) } }
      const spt2 = (i: number) => ({ x: cx2 + pose2[i] * figSize, y: cy2 + floatY2 + pose2[i + 1] * figSize })
      if (prevPose2) { for (const idx of [10, 14, 18, 22]) { const curr = spt2(idx); const dx = curr.x - (cx2 + prevPose2[idx] * figSize); const dy = curr.y - (cy2 + floatY2 + prevPose2[idx + 1] * figSize); const dist = Math.sqrt(dx * dx + dy * dy); if (dist > 0.4) emitParticles(curr.x, curr.y, dx, dy, Math.min(Math.floor(dist), 3)) } }
      drawParticles()
      const allEndpoints = [...([10, 14, 18, 22] as number[]).map(i => spt(i)), ...([10, 14, 18, 22] as number[]).map(i => spt2(i))]
      for (const ep of allEndpoints) { const sa = 0.15 + Math.sin(frame * 0.05 + ep.x) * 0.1; ctx.globalAlpha = sa; ctx.fillStyle = '#c9a96e'; ctx.beginPath(); ctx.arc(ep.x, ep.y, 2, 0, Math.PI * 2); ctx.fill() }
      ctx.globalAlpha = 1; prevPose = [...pose]; prevPose2 = [...pose2]; requestAnimationFrame(draw)
    }

    const raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  useEffect(() => {
    const currentWord = rotatingWords[rotatingWordIndex]
    let charIndex = 0
    setTypedText(''); setIsTyping(true)
    const typeInterval = setInterval(() => {
      charIndex++; setTypedText(currentWord.slice(0, charIndex))
      if (charIndex >= currentWord.length) { clearInterval(typeInterval); setIsTyping(false); setTimeout(() => { setRotatingWordIndex(prev => (prev + 1) % rotatingWords.length) }, 2500) }
    }, 70)
    return () => clearInterval(typeInterval)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rotatingWordIndex])

  const features = [
    { iconType: 'calendar', title: 'Adapt\u00e9 \u00e0 ta vraie vie', desc: "Dis au coach quand tu es dispo. Il construit ta semaine autour de ton emploi du temps r\u00e9el. R\u00e9union d\u00e9cal\u00e9e\u00a0? La s\u00e9ance s\u2019adapte." },
    { iconType: 'flame', title: 'Moteur de r\u00e9gularit\u00e9', desc: "S\u00e9ries, paliers, et le bon message au bon moment. Le plus dur, ce n\u2019est pas l\u2019entra\u00eenement. C\u2019est de s\u2019y tenir. On r\u00e9sout \u00e7a." },
    { iconType: 'chat', title: "Pose n\u2019importe quelle question", desc: "Posture. Nutrition. Sommeil. Conflits d\u2019agenda. Ton coach g\u00e8re tout, ancr\u00e9 dans une m\u00e9thodologie experte." },
  ]

  const chatMessages = [
    { from: 'coach', text: "Bonjour\u00a0! Tu as une s\u00e9ance force aujourd\u2019hui \u00e0 18h30. J\u2019ai vu que ton agenda s\u2019est lib\u00e9r\u00e9 \u00e0 12h. On d\u00e9cale\u00a0?" },
    { from: 'user', text: "Oui, midi \u00e7a m\u2019arrange mieux" },
    { from: 'coach', text: "C\u2019est not\u00e9. Aujourd\u2019hui\u00a0: bas du corps, mouvements compos\u00e9s. Hinge + stabilit\u00e9 unilat\u00e9rale. 42 min. Tu es \u00e0 12\u00a0jours de r\u00e9gularit\u00e9 au passage\u00a0\ud83d\udcaa" },
    { from: 'user', text: "Je mange avant ou j\u2019y vais \u00e0 jeun\u00a0?" },
    { from: 'coach', text: "Pour une s\u00e9ance force \u00e0 midi, mange l\u00e9ger 1h30 avant. Prot\u00e9ines + glucides lents. Poign\u00e9e d\u2019ol\u00e9agineux + banane. \u00c0 jeun c\u2019est ok pour le cardio, moins id\u00e9al pour les charges lourdes." },
  ]

  const stats = [
    { value: '-23\u00a0%', label: 'de risque de mortalit\u00e9', sub: 'avec la musculation' },
    { value: '2\u00a0Md+', label: "d\u2019utilisateurs WhatsApp", sub: 'dans le monde' },
    { value: '80\u00a0%', label: 'abandonnent les apps fitness', sub: 'dans les 30 premiers jours' },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-amber-500/20">
      <style jsx>{`
        @keyframes cursorBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes modalBackdropIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalCardIn { from { opacity: 0; transform: translateY(30px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes shimmerBtn { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        .btn-cta { background: transparent; color: #c9a96e; font-weight: 700; padding: 1rem 2.5rem; border-radius: 0.75rem; font-size: 1.1rem; transition: all 0.3s; border: none; letter-spacing: 0.01em; }
        .btn-cta:hover { border-color: #5EE89C; color: #5EE89C; box-shadow: 0 6px 30px rgba(37,211,102,0.25); transform: translateY(-2px); }
        .btn-shimmer { background-image: linear-gradient(110deg, transparent 0%, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%, transparent 100%); background-size: 200% 100%; animation: shimmerBtn 3s ease-in-out infinite; }
      `}</style>

      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-16 lg:px-24 py-6">
        <span className="text-xl font-light tracking-wide text-white/90">evo</span>
        <div className="flex items-center gap-6">
          <a href="/science" className="text-[13px] font-medium text-white/50 hover:text-white transition-colors duration-200 hidden sm:block">Science</a>
          <a href={isLoggedIn ? '/onboarding/bilans' : '/onboarding/choix-bilan'} className="text-[13px] font-medium text-white/70 hover:text-white transition-colors duration-200 border border-white/20 hover:border-white/40 rounded-full px-4 py-1.5">
            {isLoggedIn ? 'Mon espace' : 'Login'}
          </a>
        </div>
      </nav>

      <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-24 overflow-hidden">
        {heroVideos.map((src, i) => (
          <video key={i} ref={videoRefs[i]} autoPlay={i === 0} muted playsInline preload="auto"
            onEnded={() => { const next = (i + 1) % heroVideos.length; setActiveVideo(next); videoRefs[next].current?.play() }}
            className="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-[2000ms] ease-in-out"
            style={{ opacity: activeVideo === i ? 1 : 0 }}>
            <source src={src} type="video/mp4" />
          </video>
        ))}
        <div className="absolute inset-0 bg-black/50 z-0" />
        <div className="relative z-10 max-w-4xl" style={{ animation: mounted ? 'fadeInUp 0.8s ease-out' : 'none', opacity: mounted ? 1 : 0 }}>
          <div className="inline-flex items-center px-5 py-2.5 rounded-full border border-white/[0.08] mb-16">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#c9a96e] font-semibold">
              Gagnez des ann&eacute;es de vie{' '}<span className="text-white/80">{typedText}</span>
              <span className="inline-block w-[1.5px] h-[0.85em] bg-[#c9a96e] align-middle ml-0.5 rounded-full" style={{ opacity: isTyping ? 1 : 0, animation: isTyping ? 'none' : 'cursorBlink 0.8s ease-in-out infinite' }} />
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold leading-[1.05] tracking-[-0.02em] mb-10">Bouge aujourd&rsquo;hui.<br /><span style={{ color: '#c9a96e' }}>Vis mieux demain.</span></h1>
          <p className="text-lg md:text-xl text-white/40 max-w-xl leading-relaxed mb-12 font-light">Programmes long&eacute;vit&eacute; con&ccedil;us par un expert, d&eacute;livr&eacute;s via <span className="text-[#25D366] font-medium">WhatsApp</span>. Ton coach s&rsquo;adapte &agrave; ta vraie vie, te garde r&eacute;gulier, et r&eacute;pond &agrave; toutes tes questions.</p>
          <div className="flex flex-wrap items-center gap-4">
            <a href={isLoggedIn ? '/onboarding/bilans' : '/onboarding/choix-bilan'} className="inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-white text-[#0a0a0a] font-semibold text-[15px] hover:bg-white/90 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.25)] hover:-translate-y-0.5">
              {isLoggedIn ? 'Voir mon dashboard' : 'Commencer mon programme'}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </a>
            <a href="https://wa.me/message/QTBSFJSLI3PKN1" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 px-5 py-4 rounded-2xl border border-white/[0.12] text-white/50 text-[13px] font-medium hover:border-[#25D366]/40 hover:text-[#25D366] transition-all duration-300">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              Parle directement &agrave; ton coach
            </a>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 px-6 bg-[#f5f3ef] text-[#1a1a1a]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-4">Un programme expert.<br />Une conversation.</h2>
          <p className="text-[#1a1a1a]/50 text-lg max-w-2xl mb-16">Pas d&rsquo;app &agrave; installer. Pas de notifications oubli&eacute;es. Juste un coach qui t&rsquo;&eacute;crit l&agrave; o&ugrave; tu passes d&eacute;j&agrave; ton temps.</p>
          <div className="grid md:grid-cols-3 gap-px bg-[#e0ddd7]">
            {features.map((f, i) => (
              <div key={i} className="bg-[#f5f3ef] p-8">
                <div className="w-11 h-11 rounded-xl bg-[#e8e5df] flex items-center justify-center mb-5">
                  {f.iconType === 'calendar' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a08050" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>}
                  {f.iconType === 'flame' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a08050" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12c2-2.96 0-7-1-8 0 3.038-1.773 4.741-3 6-1.226 1.26-2 3.24-2 5a6 6 0 1 0 12 0c0-1.532-1.056-3.94-2-5-1.786 3-2.791 3-4 2z" /></svg>}
                  {f.iconType === 'chat' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a08050" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>}
                </div>
                <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
                <p className="text-[#1a1a1a]/50 leading-relaxed text-[0.95rem]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-4 text-center">Une conversation,<br />pas une interface</h2>
          <p className="text-white/40 text-center text-lg max-w-xl mx-auto mb-16">Voil&agrave; &agrave; quoi ressemble ton coaching au quotidien.</p>
          <div className="max-w-lg mx-auto space-y-3">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`} style={{ animation: mounted ? `fadeInUp 0.5s ease-out ${0.1 * i}s both` : 'none' }}>
                <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-[0.9rem] leading-relaxed ${msg.from === 'user' ? 'bg-amber-500/20 text-amber-100 rounded-br-md' : 'bg-white/[0.06] text-white/80 rounded-bl-md'}`}>{msg.text}</div>
              </div>
            ))}
          </div>
          <p className="text-center mt-10 text-xs uppercase tracking-[0.2em] text-amber-400/50 font-medium">De vraies conversations. Du vrai coaching.</p>
        </div>
      </section>

      <section className="py-20 md:py-28 px-6 bg-[#f5f3ef] text-[#1a1a1a]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-[2.75rem] font-bold leading-tight mb-5">L&rsquo;industrie fitness optimise pour 12&nbsp;semaines.<br /><span style={{ color: '#c9a96e' }}>Nous, pour 12&nbsp;d&eacute;cennies.</span></h2>
            <p className="text-[#1a1a1a]/45 text-base max-w-2xl mx-auto leading-relaxed mb-4">L&rsquo;entra&icirc;nement long&eacute;vit&eacute;, ce n&rsquo;est pas se pr&eacute;parer pour l&rsquo;&eacute;t&eacute;. C&rsquo;est construire la force, la mobilit&eacute; et la sant&eacute; m&eacute;tabolique qui permettent de vivre pleinement &agrave; 40, 60, 80&nbsp;ans et au-del&agrave;.</p>
            <p className="text-[#1a1a1a]/45 text-base max-w-2xl mx-auto leading-relaxed">Chaque programme evo est con&ccedil;u par un expert en long&eacute;vit&eacute;. Pas g&eacute;n&eacute;r&eacute; par une IA. Pas copi&eacute;-coll&eacute; d&rsquo;internet. Construit par quelqu&rsquo;un qui comprend comment le corps vieillit &mdash; et comment l&rsquo;entra&icirc;nement peut ralentir ce processus.</p>
          </div>
          <div className="flex items-center gap-4 max-w-md mx-auto mb-16 px-6 py-5 rounded-2xl bg-white/60 border border-[#e0ddd7]">
            <div className="w-11 h-11 rounded-full bg-[#e8e5df] flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a08050" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            </div>
            <div><p className="font-semibold text-sm">Vincent, ton coach</p><p className="text-[#1a1a1a]/40 text-xs">Kin&eacute;sith&eacute;rapeute &amp; pr&eacute;parateur physique &mdash; il con&ccedil;oit ton programme et t&rsquo;accompagne personnellement.</p></div>
          </div>
          <div className="grid grid-cols-3 gap-8 text-center pt-14 border-t border-[#e0ddd7]">
            {stats.map((s, i) => (<div key={i}><p className="text-3xl md:text-4xl font-bold mb-1" style={{ color: '#c9a96e' }}>{s.value}</p><p className="text-[#1a1a1a]/55 text-[10px] font-semibold uppercase tracking-[0.15em]">{s.label}</p><p className="text-[#1a1a1a]/30 text-[10px] mt-0.5">{s.sub}</p></div>))}
          </div>
        </div>
      </section>

      <section ref={ctaSectionRef} className="relative min-h-[600px] flex flex-col items-center justify-center px-6 text-center overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />
        <h2 className="relative z-10 text-4xl md:text-5xl font-bold mb-6">Pr&ecirc;t(e) &agrave; jouer le long terme&nbsp;?</h2>
        <p className="relative z-10 text-white/40 text-lg max-w-xl mx-auto mb-10">Commence ton programme en 2 minutes.</p>
        <div className="relative z-10 flex flex-col items-center gap-4">
          <a href={isLoggedIn ? '/onboarding/bilans' : '/onboarding/choix-bilan'} className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-white text-[#0a0a0a] font-semibold text-[15px] hover:bg-white/90 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.25)] hover:-translate-y-0.5">
            Je me lance
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </a>
          <a href="https://wa.me/message/QTBSFJSLI3PKN1" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[13px] text-white/30 hover:text-[#25D366] transition-colors duration-300">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
            Des questions avant de commencer&nbsp;? Demande-nous directement&nbsp;!
          </a>
        </div>
      </section>

      <footer className="py-8 px-6 border-t border-white/5 text-center"><p className="text-sm text-white/20">evo &mdash; L&rsquo;entra&icirc;nement pour le long terme.</p></footer>

    </div>
  )
}
