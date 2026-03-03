'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

export default function WaitlistPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  /* Typewriter */
  const [rotatingWordIndex, setRotatingWordIndex] = useState(0)
  const [typedText, setTypedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const formRef = useRef<HTMLFormElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const rotatingWords = ['en forme.', 'autonome.', 'sans douleur.', 'solide.', 'actif(ve).', 'ind\u00e9pendant(e).']

  useEffect(() => {
    setMounted(true)
  }, [])

  /* Animated fitness silhouettes on canvas */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Pose = [headX, headY, neckX, neckY, shoulderX, shoulderY, hipX, hipY,
    //   lElbowX, lElbowY, lHandX, lHandY, rElbowX, rElbowY, rHandX, rHandY,
    //   lKneeX, lKneeY, lFootX, lFootY, rKneeX, rKneeY, rFootX, rFootY]
    // Y: negative=up. Proportions based on ~8-head figure

    type Pose = number[]

    const lerpPose = (a: Pose, b: Pose, t: number): Pose =>
      a.map((v, i) => v + (b[i] - v) * t)

    // Interpolate through a sequence of poses with smooth easing
    const getPoseFromSequence = (poses: Pose[], progress: number): Pose => {
      const n = poses.length
      const scaled = progress * n
      const i = Math.floor(scaled) % n
      const j = (i + 1) % n
      const local = scaled - Math.floor(scaled)
      // Smoothstep easing for each segment
      const t = local * local * (3 - 2 * local)
      return lerpPose(poses[i], poses[j], t)
    }

    // --- EXERCISE KEYFRAMES (more poses = smoother motion) ---
    // head, neck, shoulder, hip, lElbow, lHand, rElbow, rHand, lKnee, lFoot, rKnee, rFoot

    // RUNNING — 4 keyframes for a natural gait cycle
    const run1: Pose = [0,-4.2, 0,-3.7, 0,-3.3, 0,-1.6,  -0.7,-2.8, -0.3,-2.0,  0.8,-2.6, 0.5,-1.9,   0.7,-0.6, 0.5,0.3,  -0.3,-0.9, -0.8,-0.2]
    const run2: Pose = [0,-4.2, 0,-3.7, 0,-3.3, 0,-1.6,  -0.4,-2.5, -0.1,-1.7,  0.5,-2.8, 0.8,-2.2,   0.3,-0.5, 0.3,0.3,  -0.5,-0.5, -0.3,0.3]
    const run3: Pose = [0,-4.2, 0,-3.7, 0,-3.3, 0,-1.6,   0.8,-2.6, 0.5,-1.9,  -0.7,-2.8, -0.3,-2.0,  -0.3,-0.9, -0.8,-0.2,  0.7,-0.6, 0.5,0.3]
    const run4: Pose = [0,-4.2, 0,-3.7, 0,-3.3, 0,-1.6,   0.5,-2.8, 0.8,-2.2,  -0.4,-2.5, -0.1,-1.7,  -0.5,-0.5, -0.3,0.3,  0.3,-0.5, 0.3,0.3]

    // SQUAT — 4 keyframes: standing → half → deep → half
    const sq1: Pose = [0,-4.2, 0,-3.7, 0,-3.3, 0,-1.6,  -0.8,-2.6, -0.6,-1.8,  0.8,-2.6, 0.6,-1.8,  -0.5,-0.6, -0.5,0.3,  0.5,-0.6, 0.5,0.3]
    const sq2: Pose = [0,-3.6, 0,-3.1, 0,-2.7, 0,-1.2,  -0.9,-2.1, -0.7,-1.3,  0.9,-2.1, 0.7,-1.3,  -0.7,-0.2, -0.5,0.3,  0.7,-0.2, 0.5,0.3]
    const sq3: Pose = [0,-2.9, 0,-2.5, 0,-2.1, 0,-0.7,  -1.0,-1.5, -0.8,-0.8,  1.0,-1.5, 0.8,-0.8,  -0.9,0.1, -0.5,0.3,  0.9,0.1, 0.5,0.3]
    const sq4: Pose = [0,-3.6, 0,-3.1, 0,-2.7, 0,-1.2,  -0.9,-2.1, -0.7,-1.3,  0.9,-2.1, 0.7,-1.3,  -0.7,-0.2, -0.5,0.3,  0.7,-0.2, 0.5,0.3]

    // YOGA TREE — gentle sway between two balance poses
    const tree1: Pose = [0,-4.3, 0,-3.8, 0,-3.4, 0,-1.6,  -0.4,-3.8, -0.2,-4.3,  0.4,-3.8, 0.2,-4.3,  -0.4,-0.6, -0.4,0.3,  0.3,-1.0, 0.4,-0.6]
    const tree2: Pose = [0.05,-4.35, 0.03,-3.82, 0.02,-3.42, 0,-1.6,  -0.5,-3.9, -0.3,-4.4,  0.5,-3.9, 0.3,-4.4,  -0.4,-0.6, -0.4,0.3,  0.35,-0.95, 0.42,-0.55]
    const tree3: Pose = [0,-4.3, 0,-3.8, 0,-3.4, 0,-1.6,  -0.4,-3.8, -0.2,-4.3,  0.4,-3.8, 0.2,-4.3,  -0.4,-0.6, -0.4,0.3,  0.3,-1.0, 0.4,-0.6]
    const tree4: Pose = [-0.05,-4.25, -0.03,-3.78, -0.02,-3.38, 0,-1.6,  -0.35,-3.7, -0.15,-4.2,  0.35,-3.7, 0.15,-4.2,  -0.4,-0.6, -0.4,0.3,  0.25,-1.05, 0.38,-0.65]

    // WARRIOR — flowing between warrior I and warrior II
    const war1: Pose = [0,-4.1, 0,-3.6, 0,-3.2, 0,-1.5,  -1.1,-3.4, -1.6,-3.9,  1.1,-3.4, 1.6,-3.9,  -0.8,-0.4, -1.2,0.3,  0.6,-0.6, 1.0,0.3]
    const war2: Pose = [0,-3.8, 0,-3.3, 0,-2.9, 0,-1.3,  -1.3,-2.9, -2.0,-2.9,  1.3,-2.9, 2.0,-2.9,  -0.9,-0.2, -1.3,0.3,  0.7,-0.5, 1.1,0.3]
    const war3: Pose = [0,-4.0, 0,-3.5, 0,-3.1, 0,-1.4,  -1.2,-3.6, -1.0,-4.1,  1.2,-3.0, 1.8,-3.0,  -0.85,-0.3, -1.25,0.3,  0.65,-0.55, 1.05,0.3]
    const war4: Pose = [0,-3.8, 0,-3.3, 0,-2.9, 0,-1.3,  -1.3,-2.9, -2.0,-2.9,  1.3,-2.9, 2.0,-2.9,  -0.9,-0.2, -1.3,0.3,  0.7,-0.5, 1.1,0.3]

    // STRETCH — lateral side bend flow
    const str1: Pose = [0,-4.2, 0,-3.7, 0,-3.3, 0,-1.6,  -0.5,-3.7, -0.3,-4.2,  0.5,-3.7, 0.3,-4.2,  -0.5,-0.6, -0.5,0.3,  0.5,-0.6, 0.5,0.3]
    const str2: Pose = [0.4,-4.1, 0.2,-3.6, 0.1,-3.2, 0,-1.6,  -0.2,-3.8, 0.3,-4.3,  1.0,-3.0, 1.4,-2.5,  -0.5,-0.6, -0.5,0.3,  0.5,-0.6, 0.5,0.3]
    const str3: Pose = [0,-4.2, 0,-3.7, 0,-3.3, 0,-1.6,  -0.5,-3.7, -0.3,-4.2,  0.5,-3.7, 0.3,-4.2,  -0.5,-0.6, -0.5,0.3,  0.5,-0.6, 0.5,0.3]
    const str4: Pose = [-0.4,-4.1, -0.2,-3.6, -0.1,-3.2, 0,-1.6,  -1.0,-3.0, -1.4,-2.5,  0.2,-3.8, -0.3,-4.3,  -0.5,-0.6, -0.5,0.3,  0.5,-0.6, 0.5,0.3]

    type Figure = {
      x: number; y: number; size: number; opacity: number
      poses: Pose[]; cycleDuration: number; frame: number
      fadeIn: number; fadeTarget: number
      // Wandering motion
      vx: number; vy: number
      wanderAngle: number
    }

    const figures: Figure[] = [
      { x: 0.12, y: 0.45, size: 24, opacity: 0, poses: [run1, run2, run3, run4], cycleDuration: 180, frame: 0, fadeIn: 0, fadeTarget: 0.28, vx: 0.2, vy: 0.1, wanderAngle: 0 },
      { x: 0.88, y: 0.35, size: 22, opacity: 0, poses: [sq1, sq2, sq3, sq4], cycleDuration: 210, frame: 0, fadeIn: 0, fadeTarget: 0.24, vx: -0.18, vy: 0.12, wanderAngle: 1.5 },
      { x: 0.32, y: 0.65, size: 20, opacity: 0, poses: [tree1, tree2, tree3, tree4], cycleDuration: 240, frame: 0, fadeIn: 0, fadeTarget: 0.20, vx: 0.15, vy: -0.12, wanderAngle: 3.0 },
      { x: 0.68, y: 0.25, size: 23, opacity: 0, poses: [war1, war2, war3, war4], cycleDuration: 195, frame: 0, fadeIn: 0, fadeTarget: 0.25, vx: -0.2, vy: 0.09, wanderAngle: 4.5 },
      { x: 0.50, y: 0.75, size: 19, opacity: 0, poses: [str1, str2, str3, str4], cycleDuration: 185, frame: 0, fadeIn: 0, fadeTarget: 0.20, vx: 0.16, vy: -0.18, wanderAngle: 2.2 },
      // Extra bonhommes
      { x: 0.05, y: 0.20, size: 18, opacity: 0, poses: [run1, run2, run3, run4], cycleDuration: 170, frame: 0, fadeIn: 0, fadeTarget: 0.18, vx: 0.22, vy: 0.08, wanderAngle: 0.8 },
      { x: 0.95, y: 0.70, size: 21, opacity: 0, poses: [sq1, sq2, sq3, sq4], cycleDuration: 220, frame: 0, fadeIn: 0, fadeTarget: 0.22, vx: -0.15, vy: -0.15, wanderAngle: 5.2 },
      { x: 0.45, y: 0.15, size: 17, opacity: 0, poses: [war1, war2, war3, war4], cycleDuration: 200, frame: 0, fadeIn: 0, fadeTarget: 0.17, vx: -0.12, vy: 0.2, wanderAngle: 2.8 },
      { x: 0.78, y: 0.80, size: 20, opacity: 0, poses: [str1, str2, str3, str4], cycleDuration: 180, frame: 0, fadeIn: 0, fadeTarget: 0.19, vx: 0.1, vy: -0.22, wanderAngle: 4.0 },
      { x: 0.20, y: 0.85, size: 16, opacity: 0, poses: [tree1, tree2, tree3, tree4], cycleDuration: 230, frame: 0, fadeIn: 0, fadeTarget: 0.16, vx: 0.18, vy: 0.15, wanderAngle: 1.0 },
      { x: 0.55, y: 0.10, size: 19, opacity: 0, poses: [run1, run2, run3, run4], cycleDuration: 182, frame: 0, fadeIn: 0, fadeTarget: 0.19, vx: -0.19, vy: 0.14, wanderAngle: 3.5 },
      { x: 0.10, y: 0.78, size: 17, opacity: 0, poses: [war1, war2, war3, war4], cycleDuration: 205, frame: 0, fadeIn: 0, fadeTarget: 0.17, vx: 0.21, vy: -0.1, wanderAngle: 5.8 },
      { x: 0.92, y: 0.15, size: 21, opacity: 0, poses: [sq1, sq2, sq3, sq4], cycleDuration: 215, frame: 0, fadeIn: 0, fadeTarget: 0.21, vx: -0.14, vy: 0.19, wanderAngle: 0.4 },
    ]

    const drawFigure = (pose: Pose, cx: number, cy: number, s: number, alpha: number) => {
      ctx.globalAlpha = alpha
      ctx.strokeStyle = '#ffffff'
      ctx.fillStyle = '#ffffff'
      ctx.lineWidth = 1.8
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      const pt = (i: number) => ({ x: cx + pose[i] * s, y: cy + pose[i + 1] * s })

      const head = pt(0)
      const neck = pt(2)
      const shoulder = pt(4)
      const hip = pt(6)
      const lElbow = pt(8)
      const lHand = pt(10)
      const rElbow = pt(12)
      const rHand = pt(14)
      const lKnee = pt(16)
      const lFoot = pt(18)
      const rKnee = pt(20)
      const rFoot = pt(22)

      // Head circle
      ctx.beginPath()
      ctx.arc(head.x, head.y, s * 0.3, 0, Math.PI * 2)
      ctx.stroke()

      // Neck
      ctx.beginPath()
      ctx.moveTo(head.x, head.y + s * 0.3)
      ctx.lineTo(neck.x, neck.y)
      ctx.stroke()

      // Torso (curved spine: neck → shoulder → hip)
      ctx.beginPath()
      ctx.moveTo(neck.x, neck.y)
      ctx.quadraticCurveTo(shoulder.x, shoulder.y, hip.x, hip.y)
      ctx.stroke()

      // Left arm (smooth curve through elbow)
      ctx.beginPath()
      ctx.moveTo(shoulder.x, shoulder.y)
      ctx.quadraticCurveTo(lElbow.x, lElbow.y, lHand.x, lHand.y)
      ctx.stroke()

      // Right arm
      ctx.beginPath()
      ctx.moveTo(shoulder.x, shoulder.y)
      ctx.quadraticCurveTo(rElbow.x, rElbow.y, rHand.x, rHand.y)
      ctx.stroke()

      // Left leg (smooth curve through knee)
      ctx.beginPath()
      ctx.moveTo(hip.x, hip.y)
      ctx.quadraticCurveTo(lKnee.x, lKnee.y, lFoot.x, lFoot.y)
      ctx.stroke()

      // Right leg
      ctx.beginPath()
      ctx.moveTo(hip.x, hip.y)
      ctx.quadraticCurveTo(rKnee.x, rKnee.y, rFoot.x, rFoot.y)
      ctx.stroke()
    }

    const draw = () => {
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      for (const fig of figures) {
        fig.fadeIn = Math.min(fig.fadeIn + 0.004, 1)
        fig.opacity = fig.fadeTarget * fig.fadeIn

        fig.frame++

        // Wander: slowly rotate direction for organic paths
        fig.wanderAngle += (Math.random() - 0.5) * 0.06
        fig.vx += Math.cos(fig.wanderAngle) * 0.008
        fig.vy += Math.sin(fig.wanderAngle) * 0.008
        // Dampen velocity for smooth motion
        fig.vx *= 0.997
        fig.vy *= 0.997
        // Clamp speed
        const speed = Math.sqrt(fig.vx * fig.vx + fig.vy * fig.vy)
        const maxSpeed = 0.35
        if (speed > maxSpeed) { fig.vx *= maxSpeed / speed; fig.vy *= maxSpeed / speed }

        fig.x += fig.vx / w
        fig.y += fig.vy / h

        // Wrap around edges with margin
        const m = 0.1
        if (fig.x < -m) fig.x = 1 + m
        if (fig.x > 1 + m) fig.x = -m
        if (fig.y < -m) fig.y = 1 + m
        if (fig.y > 1 + m) fig.y = -m

        // Animate between poses
        const progress = (fig.frame % fig.cycleDuration) / fig.cycleDuration
        const pose = getPoseFromSequence(fig.poses, progress)

        drawFigure(pose, fig.x * w, fig.y * h, fig.size, fig.opacity)
      }

      requestAnimationFrame(draw)
    }

    const raf = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  useEffect(() => {
    const currentWord = rotatingWords[rotatingWordIndex]
    let charIndex = 0
    setTypedText('')
    setIsTyping(true)

    const typeInterval = setInterval(() => {
      charIndex++
      setTypedText(currentWord.slice(0, charIndex))
      if (charIndex >= currentWord.length) {
        clearInterval(typeInterval)
        setIsTyping(false)
        setTimeout(() => {
          setRotatingWordIndex(prev => (prev + 1) % rotatingWords.length)
        }, 2500)
      }
    }, 70)

    return () => clearInterval(typeInterval)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rotatingWordIndex])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormState('submitting')
    setErrorMessage('')

    if (!isSupabaseConfigured || !supabase) {
      setErrorMessage('Les inscriptions sont temporairement indisponibles.')
      setFormState('error')
      return
    }

    try {
      const { error } = await supabase
        .from('waitlist')
        .insert({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim() || null,
        })

      if (error) {
        if (error.code === '23505') {
          setErrorMessage('Cette adresse email est d\u00e9j\u00e0 inscrite.')
        } else {
          setErrorMessage('Une erreur est survenue. Veuillez r\u00e9essayer.')
        }
        setFormState('error')
        return
      }

      setFormState('success')
    } catch {
      setErrorMessage('Une erreur est survenue. Veuillez r\u00e9essayer.')
      setFormState('error')
    }
  }

  const features = [
    {
      iconType: 'calendar',
      title: 'Adapt\u00e9 \u00e0 ta vraie vie',
      desc: "Dis au coach quand tu es dispo. Il construit ta semaine autour de ton emploi du temps r\u00e9el. R\u00e9union d\u00e9cal\u00e9e\u00a0? La s\u00e9ance s\u2019adapte.",
    },
    {
      iconType: 'flame',
      title: 'Moteur de r\u00e9gularit\u00e9',
      desc: "S\u00e9ries, paliers, et le bon message au bon moment. Le plus dur, ce n\u2019est pas l\u2019entra\u00eenement. C\u2019est de s\u2019y tenir. On r\u00e9sout \u00e7a.",
    },
    {
      iconType: 'chat',
      title: "Pose n\u2019importe quelle question",
      desc: "Posture. Nutrition. Sommeil. Conflits d\u2019agenda. Ton coach g\u00e8re tout, ancr\u00e9 dans une m\u00e9thodologie experte.",
    },
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
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes modalBackdropIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalCardIn {
          from { opacity: 0; transform: translateY(30px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shimmerBtn {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .btn-cta {
          background: transparent;
          color: #c9a96e;
          font-weight: 700;
          padding: 1rem 2.5rem;
          border-radius: 0.75rem;
          font-size: 1.1rem;
          transition: all 0.3s;
          border: none;
          letter-spacing: 0.01em;
        }
        .btn-cta:hover {
          border-color: #5EE89C;
          color: #5EE89C;
          box-shadow: 0 6px 30px rgba(37,211,102,0.25);
          transform: translateY(-2px);
        }
        .btn-shimmer {
          background-image: linear-gradient(110deg, transparent 0%, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%, transparent 100%);
          background-size: 200% 100%;
          animation: shimmerBtn 3s ease-in-out infinite;
        }
      `}</style>

      {/* ─── NAV ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-16 lg:px-24 py-6">
        <span className="text-xl font-light tracking-wide text-white/90">evo</span>
        <div className="flex items-center gap-6">
          <span className="text-[11px] uppercase tracking-[0.25em] text-white/40 font-medium hidden sm:block">Entra&icirc;nement long&eacute;vit&eacute;</span>
          <a href="/onboarding/login" className="text-[13px] font-medium text-white/70 hover:text-white transition-colors duration-200 border border-white/20 hover:border-white/40 rounded-full px-4 py-1.5">
            Login
          </a>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-24 overflow-hidden">
        {/* Subtle warm glow top-right */}
        <div className="absolute inset-0 -z-10">
          <div
            className="absolute top-0 right-0 w-[50vw] h-[60vh] opacity-[0.07]"
            style={{ background: 'radial-gradient(ellipse at top right, rgba(139,158,126,0.8) 0%, transparent 70%)' }}
          />
        </div>

        {/* Canvas trace line */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-0 pointer-events-none"
        />

        <div
          className="max-w-4xl"
          style={{
            animation: mounted ? 'fadeInUp 0.8s ease-out' : 'none',
            opacity: mounted ? 1 : 0,
          }}
        >
          {/* Typewriter pill */}
          <div className="inline-flex items-center px-5 py-2.5 rounded-full border border-white/[0.08] mb-16">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#c9a96e] font-semibold">
              Gagnez des ann&eacute;es de vie{' '}
              <span className="text-white/80">
                {typedText}
              </span>
              <span
                className="inline-block w-[1.5px] h-[0.85em] bg-[#c9a96e] align-middle ml-0.5 rounded-full"
                style={{
                  opacity: isTyping ? 1 : 0,
                  animation: isTyping ? 'none' : 'cursorBlink 0.8s ease-in-out infinite',
                }}
              />
            </span>
          </div>

          {/* Main headline */}
          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold leading-[1.05] tracking-[-0.02em] mb-10">
            Bouge aujourd&rsquo;hui.<br />
            <span style={{ color: '#c9a96e' }}>Vis mieux demain.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/40 max-w-xl leading-relaxed mb-12 font-light">
            Programmes long&eacute;vit&eacute; con&ccedil;us par un expert, d&eacute;livr&eacute;s via WhatsApp.
            Ton coach s&rsquo;adapte &agrave; ta vraie vie, te garde r&eacute;gulier, et r&eacute;pond &agrave; toutes tes questions.
          </p>

          {/* Pills row */}
          <div className="flex flex-wrap items-center gap-3">
            {/* WhatsApp pill */}
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/[0.05] border border-white/[0.06]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span className="text-sm text-white/60 font-medium">Ton coach vit sur WhatsApp</span>
            </div>

            {/* CTA pill */}
            <button
              type="button"
              onClick={() => setFormOpen(true)}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/[0.05] border border-white/[0.06] text-sm text-white/60 font-medium hover:bg-white/[0.08] hover:text-white/80 transition-all duration-300 cursor-pointer"
            >
              Rejoindre la liste d&rsquo;attente
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ─── SECTION: Un programme expert. Une conversation. ─── */}
      <section className="py-24 md:py-32 px-6 bg-[#f5f3ef] text-[#1a1a1a]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Un programme expert.<br />
            Une conversation.
          </h2>
          <p className="text-[#1a1a1a]/50 text-lg max-w-2xl mb-16">
            Pas d&rsquo;app &agrave; installer. Pas de notifications oubli&eacute;es. Juste un coach qui t&rsquo;&eacute;crit l&agrave; o&ugrave; tu passes d&eacute;j&agrave; ton temps.
          </p>

          <div className="grid md:grid-cols-3 gap-px bg-[#e0ddd7]">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-[#f5f3ef] p-8"
              >
                <div className="w-11 h-11 rounded-xl bg-[#e8e5df] flex items-center justify-center mb-5">
                  {f.iconType === 'calendar' && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a08050" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  )}
                  {f.iconType === 'flame' && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a08050" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 12c2-2.96 0-7-1-8 0 3.038-1.773 4.741-3 6-1.226 1.26-2 3.24-2 5a6 6 0 1 0 12 0c0-1.532-1.056-3.94-2-5-1.786 3-2.791 3-4 2z" />
                    </svg>
                  )}
                  {f.iconType === 'chat' && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a08050" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
                <p className="text-[#1a1a1a]/50 leading-relaxed text-[0.95rem]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION: Conversation WhatsApp mockup ─── */}
      <section className="py-24 md:py-32 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-4 text-center">
            Une conversation,<br />pas une interface
          </h2>
          <p className="text-white/40 text-center text-lg max-w-xl mx-auto mb-16">
            Voil&agrave; &agrave; quoi ressemble ton coaching au quotidien.
          </p>

          <div className="max-w-lg mx-auto space-y-3">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                style={{
                  animation: mounted ? `fadeInUp 0.5s ease-out ${0.1 * i}s both` : 'none',
                }}
              >
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl text-[0.9rem] leading-relaxed ${
                    msg.from === 'user'
                      ? 'bg-amber-500/20 text-amber-100 rounded-br-md'
                      : 'bg-white/[0.06] text-white/80 rounded-bl-md'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <p className="text-center mt-10 text-xs uppercase tracking-[0.2em] text-amber-400/50 font-medium">
            De vraies conversations. Du vrai coaching.
          </p>
        </div>
      </section>

      {/* ─── SECTION: Long&eacute;vit&eacute; + Stats ─── */}
      <section className="py-20 md:py-28 px-6 bg-[#f5f3ef] text-[#1a1a1a]">
        <div className="max-w-4xl mx-auto">
          {/* Title + text */}
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-[2.75rem] font-bold leading-tight mb-5">
              L&rsquo;industrie fitness optimise pour 12&nbsp;semaines.<br />
              <span style={{ color: '#c9a96e' }}>Nous, pour 12&nbsp;d&eacute;cennies.</span>
            </h2>
            <p className="text-[#1a1a1a]/45 text-base max-w-2xl mx-auto leading-relaxed mb-4">
              L&rsquo;entra&icirc;nement long&eacute;vit&eacute;, ce n&rsquo;est pas se pr&eacute;parer pour l&rsquo;&eacute;t&eacute;. C&rsquo;est construire la force, la mobilit&eacute; et la sant&eacute; m&eacute;tabolique qui permettent de vivre pleinement &agrave; 40, 60, 80&nbsp;ans et au-del&agrave;.
            </p>
            <p className="text-[#1a1a1a]/45 text-base max-w-2xl mx-auto leading-relaxed">
              Chaque programme Evo est con&ccedil;u par un expert en long&eacute;vit&eacute;. Pas g&eacute;n&eacute;r&eacute; par une IA. Pas copi&eacute;-coll&eacute; d&rsquo;internet. Construit par quelqu&rsquo;un qui comprend comment le corps vieillit &mdash; et comment l&rsquo;entra&icirc;nement peut ralentir ce processus.
            </p>
          </div>

          {/* Vincent card */}
          <div className="flex items-center gap-4 max-w-md mx-auto mb-16 px-6 py-5 rounded-2xl bg-white/60 border border-[#e0ddd7]">
            <div className="w-11 h-11 rounded-full bg-[#e8e5df] flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a08050" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-sm">Vincent, ton coach</p>
              <p className="text-[#1a1a1a]/40 text-xs">Kin&eacute;sith&eacute;rapeute &amp; pr&eacute;parateur physique &mdash; il con&ccedil;oit ton programme et t&rsquo;accompagne personnellement.</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 text-center pt-14 border-t border-[#e0ddd7]">
            {stats.map((s, i) => (
              <div key={i}>
                <p className="text-3xl md:text-4xl font-bold mb-1" style={{ color: '#c9a96e' }}>
                  {s.value}
                </p>
                <p className="text-[#1a1a1a]/55 text-[10px] font-semibold uppercase tracking-[0.15em]">
                  {s.label}
                </p>
                <p className="text-[#1a1a1a]/30 text-[10px] mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BOTTOM CTA ─── */}
      <section className="py-24 md:py-32 px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Pr&ecirc;t(e) &agrave; jouer le long terme&nbsp;?
        </h2>
        <p className="text-white/40 text-lg max-w-xl mx-auto mb-10">
          Rejoins la liste d&rsquo;attente. Places limit&eacute;es.
        </p>
        <button
          type="button"
          onClick={() => setFormOpen(true)}
          className="btn-cta btn-shimmer"
        >
          Rejoindre la liste d&rsquo;attente
        </button>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-8 px-6 border-t border-white/5 text-center">
        <p className="text-sm text-white/20">
          Evo &mdash; L&rsquo;entra&icirc;nement pour le long terme.
        </p>
      </footer>

      {/* ─── MODAL ─── */}
      {formOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ animation: 'modalBackdropIn 0.3s ease-out forwards' }}
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setFormOpen(false)}
          />

          <div
            className="relative w-full max-w-lg"
            style={{ animation: 'modalCardIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards' }}
          >
            {/* Close */}
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/20 transition-all duration-300 z-10"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {formState === 'success' ? (
              <div className="bg-[#141414] rounded-2xl p-10 border border-white/[0.08] text-center shadow-[0_25px_60px_rgba(0,0,0,0.5)]">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">Bienvenue dans l&rsquo;aventure</h2>
                <p className="text-white/50 mb-6">Ta place est r&eacute;serv&eacute;e. On te contacte tr&egrave;s vite.</p>
                <div className="bg-white/[0.04] rounded-xl p-4">
                  <p className="text-white/40 text-xs mb-1">Inscrit(e) sous</p>
                  <p className="font-semibold">{firstName} {lastName}</p>
                  <p className="text-white/50 text-sm">{email}</p>
                </div>
              </div>
            ) : (
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="bg-[#141414] rounded-2xl p-8 md:p-10 border border-white/[0.08] relative overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.5)]"
              >
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />

                <h2 className="text-2xl font-bold mb-1 text-center">
                  Rejoins la liste d&rsquo;attente
                </h2>
                <p className="text-white/40 mb-8 text-sm text-center">
                  Places limit&eacute;es &mdash; inscription gratuite et sans engagement.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-white/70 mb-1.5">
                      Pr&eacute;nom
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Ton pr\u00e9nom"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/40 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-white/70 mb-1.5">
                      Nom
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Ton nom"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/40 transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-1.5">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ton@email.com"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/40 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-white/70 mb-1.5">
                      T&eacute;l&eacute;phone
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="06 12 34 56 78"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/40 transition-all duration-300"
                    />
                  </div>
                </div>

                {formState === 'error' && errorMessage && (
                  <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={formState === 'submitting'}
                  className="btn-cta btn-shimmer w-full mt-8 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {formState === 'submitting' ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Inscription en cours...
                    </span>
                  ) : (
                    "M'inscrire"
                  )}
                </button>

                <p className="text-xs text-white/20 mt-4 text-center">
                  Tes donn&eacute;es restent confidentielles et ne seront jamais partag&eacute;es.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
