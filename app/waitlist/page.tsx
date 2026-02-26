'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

/* ── Floating particle component ── */
function GoldParticle({ delay, duration, x, y, size }: { delay: number; duration: number; x: number; y: number; size: number }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        top: `${y}%`,
        background: `radial-gradient(circle, rgba(212,175,55,0.4) 0%, rgba(212,175,55,0) 70%)`,
        animation: `particleFloat ${duration}s ease-in-out ${delay}s infinite, particlePulse ${duration * 0.7}s ease-in-out ${delay}s infinite`,
      }}
    />
  )
}

/* ── Checkmark draw animation ── */
function AnimatedCheckmark() {
  return (
    <div className="w-24 h-24 mx-auto mb-8 relative">
      {/* Glow ring */}
      <div className="absolute inset-0 rounded-full animate-[checkRingPulse_2s_ease-in-out_infinite]" style={{
        background: 'radial-gradient(circle, rgba(212,175,55,0.2) 0%, transparent 70%)',
      }} />
      {/* Circle */}
      <svg className="w-24 h-24 absolute inset-0" viewBox="0 0 100 100">
        <circle
          cx="50" cy="50" r="42"
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth="2"
          strokeDasharray="264"
          strokeDashoffset="264"
          strokeLinecap="round"
          style={{ animation: 'drawCircle 0.8s ease-out 0.2s forwards' }}
        />
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#B8941F" />
          </linearGradient>
        </defs>
      </svg>
      {/* Checkmark */}
      <svg className="w-24 h-24 absolute inset-0" viewBox="0 0 100 100">
        <polyline
          points="32,52 45,65 68,38"
          fill="none"
          stroke="#B8941F"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="60"
          strokeDashoffset="60"
          style={{ animation: 'drawCheck 0.5s ease-out 0.9s forwards' }}
        />
      </svg>
    </div>
  )
}

export default function WaitlistPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  /* Staggered reveal state */
  const [mounted, setMounted] = useState(false)
  const [headerVisible, setHeaderVisible] = useState(false)
  const [titleVisible, setTitleVisible] = useState(false)
  const [subtitleVisible, setSubtitleVisible] = useState(false)
  const [itemsVisible, setItemsVisible] = useState<boolean[]>([false, false, false, false])
  const [formVisible, setFormVisible] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    setMounted(true)
    const timers = [
      setTimeout(() => setHeaderVisible(true), 100),
      setTimeout(() => setTitleVisible(true), 300),
      setTimeout(() => setSubtitleVisible(true), 600),
      setTimeout(() => setItemsVisible(prev => { const n = [...prev]; n[0] = true; return n }), 850),
      setTimeout(() => setItemsVisible(prev => { const n = [...prev]; n[1] = true; return n }), 1050),
      setTimeout(() => setItemsVisible(prev => { const n = [...prev]; n[2] = true; return n }), 1250),
      setTimeout(() => setItemsVisible(prev => { const n = [...prev]; n[3] = true; return n }), 1450),
      setTimeout(() => setFormVisible(true), 700),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormState('submitting')
    setErrorMessage('')

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
          setErrorMessage('Cette adresse email est déjà inscrite.')
        } else {
          setErrorMessage('Une erreur est survenue. Veuillez réessayer.')
        }
        setFormState('error')
        return
      }

      setFormState('success')
    } catch {
      setErrorMessage('Une erreur est survenue. Veuillez réessayer.')
      setFormState('error')
    }
  }

  const particles = [
    { delay: 0, duration: 8, x: 10, y: 20, size: 6 },
    { delay: 2, duration: 10, x: 85, y: 15, size: 4 },
    { delay: 1, duration: 9, x: 70, y: 70, size: 5 },
    { delay: 3, duration: 7, x: 25, y: 80, size: 3 },
    { delay: 1.5, duration: 11, x: 50, y: 10, size: 5 },
    { delay: 4, duration: 8, x: 90, y: 50, size: 4 },
    { delay: 0.5, duration: 9, x: 5, y: 55, size: 3 },
    { delay: 2.5, duration: 10, x: 40, y: 90, size: 4 },
  ]

  const valueProps = [
    {
      title: 'Bilan de mobilité complet',
      desc: '43 tests issus de la recherche scientifique',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
          <path d="M9 14l2 2 4-4" />
        </svg>
      ),
    },
    {
      title: 'Programme sur-mesure',
      desc: 'Adapté à vos capacités et vos objectifs',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
    },
    {
      title: 'Coach pro-actif',
      desc: 'Il crée votre engagement et vous garde régulier, semaine après semaine',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
          <path d="M16 3l2 2-2 2" />
        </svg>
      ),
    },
    {
      title: 'Suivi continu',
      desc: 'Mesurez vos progrès et atteignez vos objectifs',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
    },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Inline keyframes for premium animations */}
      <style jsx>{`
        @keyframes particleFloat {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.4; }
          25% { transform: translateY(-30px) translateX(10px); opacity: 0.8; }
          50% { transform: translateY(-15px) translateX(-8px); opacity: 0.5; }
          75% { transform: translateY(-40px) translateX(5px); opacity: 0.7; }
        }
        @keyframes particlePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.8); }
        }
        @keyframes drawCircle {
          to { stroke-dashoffset: 0; }
        }
        @keyframes drawCheck {
          to { stroke-dashoffset: 0; }
        }
        @keyframes checkRingPulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.15); opacity: 0.2; }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(212,175,55,0.05), 0 8px 30px rgba(0,0,0,0.06); }
          50% { box-shadow: 0 0 40px rgba(212,175,55,0.12), 0 12px 40px rgba(0,0,0,0.08); }
        }
        @keyframes revealUp {
          from { opacity: 0; transform: translateY(30px); filter: blur(4px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes revealLeft {
          from { opacity: 0; transform: translateX(-24px); filter: blur(2px); }
          to { opacity: 1; transform: translateX(0); filter: blur(0); }
        }
        @keyframes formReveal {
          from { opacity: 0; transform: translateY(40px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shimmerBtn {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes successCardReveal {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes goldSparkle {
          0% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
          100% { opacity: 0; transform: scale(0) rotate(360deg); }
        }
        .input-premium:focus {
          box-shadow: 0 0 0 3px rgba(212,175,55,0.15), 0 0 20px rgba(212,175,55,0.08);
        }
        .form-card-glow {
          animation: glowPulse 4s ease-in-out infinite;
        }
        .btn-shimmer {
          background-image: linear-gradient(
            110deg,
            transparent 0%,
            transparent 40%,
            rgba(255,255,255,0.15) 50%,
            transparent 60%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: shimmerBtn 3s ease-in-out infinite;
        }
      `}</style>

      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-beige-50">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160vw] h-[160vw] animate-rotate-gradient" style={{
          background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(212, 175, 55, 0.15) 40deg, rgba(212, 175, 55, 0.25) 90deg, rgba(184, 148, 31, 0.18) 140deg, transparent 200deg, rgba(212, 175, 55, 0.1) 260deg, rgba(184, 148, 31, 0.2) 310deg, transparent 360deg)'
        }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw]" style={{
          background: 'conic-gradient(from 180deg at 50% 50%, transparent 0deg, rgba(107, 39, 55, 0.06) 60deg, rgba(212, 175, 55, 0.12) 120deg, transparent 180deg, rgba(107, 39, 55, 0.04) 240deg, rgba(212, 175, 55, 0.08) 300deg, transparent 360deg)',
          animation: 'rotateGradient 15s linear infinite reverse'
        }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] rounded-full" style={{
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, rgba(212, 175, 55, 0.03) 40%, transparent 70%)'
        }} />

        {/* Floating gold particles */}
        {mounted && particles.map((p, i) => (
          <GoldParticle key={i} {...p} />
        ))}
      </div>

      {/* Header */}
      <header className="w-full pt-8 pb-4 px-6">
        <div className="max-w-4xl mx-auto flex justify-center">
          <div
            className="text-3xl font-bold transition-all duration-700 ease-out"
            style={{
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? 'translateY(0) scale(1)' : 'translateY(-12px) scale(0.95)',
              filter: headerVisible ? 'blur(0)' : 'blur(3px)',
            }}
          >
            <span className="text-navy-dark">En</span><span className="gradient-text">Train</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex items-center justify-center px-6 py-12 md:py-20">
        <div className="max-w-4xl mx-auto w-full">

          {formState === 'success' ? (
            /* ── Success state with premium animations ── */
            <div className="text-center">
              {/* Sparkle particles around checkmark */}
              <div className="relative inline-block">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      background: 'linear-gradient(135deg, #D4AF37, #E8D7A0)',
                      top: '50%',
                      left: '50%',
                      animation: `goldSparkle 1.5s ease-out ${0.3 + i * 0.15}s forwards`,
                      opacity: 0,
                      marginLeft: `${Math.cos(i * 60 * Math.PI / 180) * 60}px`,
                      marginTop: `${Math.sin(i * 60 * Math.PI / 180) * 60}px`,
                    }}
                  />
                ))}
                <AnimatedCheckmark />
              </div>

              <div style={{ animation: 'revealUp 0.7s ease-out 1.2s both' }}>
                <h1 className="text-4xl md:text-5xl font-light text-navy-dark mb-4 leading-tight">
                  Bienvenue dans l&apos;aventure
                </h1>
                <p className="text-xl text-navy/70 max-w-lg mx-auto leading-relaxed mb-8">
                  Votre place est réservée. Nous vous contacterons très prochainement pour les prochaines étapes.
                </p>
              </div>

              <div
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gold/15 max-w-md mx-auto"
                style={{ animation: 'successCardReveal 0.6s ease-out 1.6s both' }}
              >
                <p className="text-navy/60 text-sm mb-2">Inscrit(e) sous</p>
                <p className="text-navy-dark font-semibold text-lg">{firstName} {lastName}</p>
                <p className="text-navy/70">{email}</p>
              </div>
            </div>
          ) : (
            /* ── Form state with staggered reveals ── */
            <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">

              {/* Left — Value prop */}
              <div>
                {/* Title */}
                <h1
                  className="text-4xl md:text-5xl lg:text-6xl font-light text-navy-dark mb-6 leading-tight tracking-tight transition-all duration-700 ease-out"
                  style={{
                    opacity: titleVisible ? 1 : 0,
                    transform: titleVisible ? 'translateY(0)' : 'translateY(30px)',
                    filter: titleVisible ? 'blur(0)' : 'blur(4px)',
                  }}
                >
                  Rejoignez la{' '}
                  <span className="font-semibold gradient-text">liste d&apos;attente</span>
                </h1>

                {/* Subtitle */}
                <p
                  className="text-lg md:text-xl text-navy/70 mb-10 leading-relaxed transition-all duration-700 ease-out"
                  style={{
                    opacity: subtitleVisible ? 1 : 0,
                    transform: subtitleVisible ? 'translateY(0)' : 'translateY(20px)',
                    filter: subtitleVisible ? 'blur(0)' : 'blur(3px)',
                  }}
                >
                  Le programme d&apos;entraînement personnalisé qui vous aide à gagner des années de vie en forme. Fini le manque de régularité : votre coach pro-actif s&apos;en charge.
                </p>

                {/* Value prop items — staggered reveal */}
                <div className="space-y-5">
                  {valueProps.map((item, i) => (
                    <div
                      key={i}
                      className="group flex items-start gap-4 cursor-pointer rounded-xl px-3 py-3 -mx-3 transition-all duration-500 ease-out hover:bg-white/50 hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
                      style={{
                        opacity: itemsVisible[i] ? 1 : 0,
                        transform: itemsVisible[i] ? 'translateX(0)' : 'translateX(-24px)',
                        filter: itemsVisible[i] ? 'blur(0)' : 'blur(2px)',
                        transitionDuration: '600ms',
                      }}
                    >
                      <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-gold/15 to-gold/5 flex items-center justify-center text-gold-dark transition-all duration-500 group-hover:from-gold/25 group-hover:to-gold/10 group-hover:scale-110">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-navy-dark group-hover:text-bordeaux transition-colors duration-300">{item.title}</p>
                        <p className="text-sm text-navy/60">{item.desc}</p>
                        <div className="mt-2 h-0.5 w-0 group-hover:w-20 bg-gold transition-all duration-500 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — Form */}
              <div
                className="transition-all duration-800 ease-out"
                style={{
                  opacity: formVisible ? 1 : 0,
                  transform: formVisible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.97)',
                  transitionDuration: '800ms',
                }}
              >
                <form
                  ref={formRef}
                  onSubmit={handleSubmit}
                  className="form-card-glow bg-white/80 backdrop-blur-sm rounded-2xl p-8 md:p-10 border border-gold/10 relative overflow-hidden"
                >
                  {/* Subtle top gold line */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

                  <h2 className="text-2xl font-semibold text-navy-dark mb-2">
                    Réservez votre place
                  </h2>
                  <p className="text-navy/60 mb-8 text-sm">
                    Places limitées — inscription gratuite et sans engagement.
                  </p>

                  <div className="space-y-5">
                    {/* Prénom */}
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-navy-dark mb-1.5">
                        Prénom
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Votre prénom"
                        className="input-premium w-full px-4 py-3 rounded-xl bg-beige-50 border border-beige-300 text-navy-dark placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/40 transition-all duration-300"
                      />
                    </div>

                    {/* Nom */}
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-navy-dark mb-1.5">
                        Nom
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Votre nom"
                        className="input-premium w-full px-4 py-3 rounded-xl bg-beige-50 border border-beige-300 text-navy-dark placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/40 transition-all duration-300"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-navy-dark mb-1.5">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="votre@email.com"
                        className="input-premium w-full px-4 py-3 rounded-xl bg-beige-50 border border-beige-300 text-navy-dark placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/40 transition-all duration-300"
                      />
                    </div>

                    {/* Téléphone */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-navy-dark mb-1.5">
                        Téléphone
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="06 12 34 56 78"
                        className="input-premium w-full px-4 py-3 rounded-xl bg-beige-50 border border-beige-300 text-navy-dark placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/40 transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Error message */}
                  {formState === 'error' && errorMessage && (
                    <div className="mt-4 p-3 rounded-xl bg-bordeaux-50 border border-bordeaux/20 text-bordeaux text-sm" style={{ animation: 'revealUp 0.3s ease-out' }}>
                      {errorMessage}
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={formState === 'submitting'}
                    className="btn-primary btn-shimmer w-full mt-8 disabled:opacity-60 disabled:cursor-not-allowed"
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
                      "M'inscrire sur la liste d'attente"
                    )}
                  </button>

                  <p className="text-xs text-navy/40 mt-4 text-center leading-relaxed">
                    Vos données restent confidentielles et ne seront jamais partagées.
                  </p>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 text-center">
        <p className="text-sm text-navy/40" style={{
          opacity: mounted ? 1 : 0,
          transition: 'opacity 1s ease-out 2s',
        }}>
          EnTrain — Gagnez des années de vie en forme
        </p>
      </footer>
    </div>
  )
}
