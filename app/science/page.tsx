'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'

function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (hasAnimated.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          hasAnimated.current = true
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number | null = null
    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(easeOutQuart * end))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isVisible, end, duration])

  return { count, ref }
}

function Stats() {
  const studies = useCountUp(200, 2000)
  const years = useCountUp(15, 2000)
  const percent = useCountUp(100, 2000)

  return (
    <div className="bg-white/[0.06] backdrop-blur-sm rounded-2xl p-8 border-2 border-white/[0.1]">
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center" ref={studies.ref}>
          <div className="text-4xl md:text-5xl font-bold text-white mb-1">
            {studies.count}+
          </div>
          <p className="text-sm text-white/50">Études analysées</p>
        </div>
        <div className="text-center" ref={years.ref}>
          <div className="text-4xl md:text-5xl font-bold text-[#c9a96e] mb-1">
            {years.count}+
          </div>
          <p className="text-sm text-white/50">Années de recherche</p>
        </div>
        <div className="text-center" ref={percent.ref}>
          <div className="text-4xl md:text-5xl font-bold text-[#c9a96e] mb-1">
            {percent.count}%
          </div>
          <p className="text-sm text-white/50">Evidence-based</p>
        </div>
      </div>
    </div>
  )
}

export default function Science() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-[#0a0a0a]/80 backdrop-blur-md z-50 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            <span className="text-white">E</span><span className="text-[#c9a96e]">vo</span>
          </Link>
          <div className="flex gap-8 items-center">
            <Link href="/" className="nav-link">
              Accueil
            </Link>
            <Link href="/science" className="relative text-[#c9a96e] font-semibold">
              Science
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#c9a96e] to-[#a08050]"></span>
            </Link>
            <Link href="/onboarding/login" className="text-[13px] font-medium text-white/70 hover:text-white transition-colors duration-200 border border-white/20 hover:border-white/40 rounded-full px-4 py-1.5">
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#0a0a0a]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] rounded-full" style={{
          background: 'radial-gradient(circle, rgba(201, 169, 110, 0.06) 0%, transparent 60%)'
        }}></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-light mb-6 leading-tight text-white animate-fade-in">
            La <span className="text-[#c9a96e] font-semibold">science</span> au cœur de notre méthode
          </h1>
          <p className="text-2xl md:text-3xl mb-8 max-w-4xl mx-auto leading-relaxed text-white/50 animate-slide-up">
            Une approche rigoureuse basée sur les dernières recherches en sciences du vieillissement
          </p>
        </div>
      </section>

      {/* Expert Profile & Stats Combined */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#0e0e0e]"></div>
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-[#c9a96e]/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-12 text-center">
            L&apos;expertise qui fait la <span className="text-[#c9a96e] font-semibold">différence</span>
          </h2>
          <div className="grid lg:grid-cols-5 gap-10 items-stretch">
            {/* Photo - left column */}
            <div className="lg:col-span-2">
              <div className="relative h-full min-h-[400px] rounded-3xl overflow-hidden shadow-2xl group">
                <Image
                  src="/images/Vincent.png"
                  alt="Vincent Foulonneau"
                  fill
                  quality={100}
                  priority
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-[#c9a96e] font-semibold text-sm tracking-wider uppercase mb-1">Expert scientifique</p>
                  <h3 className="text-3xl font-bold text-white">Vincent Foulonneau</h3>
                </div>
              </div>
            </div>
            
            {/* Bio + Stats - right column */}
            <div className="lg:col-span-3 flex flex-col gap-8">
              <div className="bg-white/[0.05] rounded-2xl p-8 border-2 border-white/[0.1] flex-1">
                <div className="space-y-4 text-lg text-white/60 leading-relaxed">
                  <p>
                    <span className="font-semibold text-white">Vincent Foulonneau</span> est <span className="text-[#c9a96e] font-semibold">physicien et chercheur</span> spécialisé dans les sciences du vieillissement.
                  </p>
                  <p>
                    En tant que <span className="font-semibold text-[#c9a96e]">coach expert en prophylaxie</span>, il a consacré sa carrière à comprendre les mécanismes du vieillissement et à développer des stratégies scientifiquement validées pour optimiser la longévité en bonne santé.
                  </p>
                </div>
              </div>

              <Stats />
            </div>
          </div>
        </div>
      </section>

      {/* Scientific Approach - 2x2 Grid */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#0a0a0a]"></div>
        <div className="absolute top-10 left-10 w-80 h-80 bg-[#c9a96e]/5 rounded-full blur-3xl animate-float"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl font-light text-white text-center mb-16">
            Les piliers <span className="text-[#c9a96e] font-semibold">scientifiques</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card group">
              <div className="w-16 h-16 mb-6 rounded-2xl bg-white/[0.06] flex items-center justify-center group-hover:bg-white/[0.1] transition-all duration-300">
                <svg className="w-8 h-8 text-[#c9a96e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#c9a96e] transition-colors">Biologie du vieillissement</h3>
              <p className="text-white/50 leading-relaxed text-lg">
                Nos programmes s&apos;appuient sur la compréhension des processus cellulaires et moléculaires du vieillissement pour cibler précisément les mécanismes qui préservent la jeunesse de vos tissus.
              </p>
            </div>

            <div className="card group">
              <div className="w-16 h-16 mb-6 rounded-2xl bg-white/[0.06] flex items-center justify-center group-hover:bg-white/[0.1] transition-all duration-300">
                <svg className="w-8 h-8 text-[#c9a96e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#c9a96e] transition-colors">Neuroplasticité</h3>
              <p className="text-white/50 leading-relaxed text-lg">
                L&apos;entraînement cognitif intégré à nos séances exploite la capacité du cerveau à se remodeler, maintenant ainsi vos facultés mentales à leur meilleur niveau.
              </p>
            </div>

            <div className="card group">
              <div className="w-16 h-16 mb-6 rounded-2xl bg-white/[0.06] flex items-center justify-center group-hover:bg-white/[0.1] transition-all duration-300">
                <svg className="w-8 h-8 text-[#c9a96e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#c9a96e] transition-colors">Physiologie de l&apos;exercice</h3>
              <p className="text-white/50 leading-relaxed text-lg">
                Des protocoles d&apos;entraînement basés sur les données scientifiques optimisent la force, l&apos;équilibre et la mobilité pour préserver votre autonomie.
              </p>
            </div>

            <div className="card group">
              <div className="w-16 h-16 mb-6 rounded-2xl bg-white/[0.06] flex items-center justify-center group-hover:bg-white/[0.1] transition-all duration-300">
                <svg className="w-8 h-8 text-[#c9a96e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#c9a96e] transition-colors">Prophylaxie</h3>
              <p className="text-white/50 leading-relaxed text-lg">
                Une approche préventive globale qui anticipe et contrecarre les effets du vieillissement avant qu&apos;ils ne deviennent limitants.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Principles - Horizontal */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#0e0e0e]"></div>
        <div className="absolute top-20 right-10 w-96 h-96 bg-[#c9a96e]/5 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl font-light text-white text-center mb-16">
            Notre <span className="font-semibold">approche</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card overflow-hidden p-0 group">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="https://plus.unsplash.com/premium_photo-1661758890104-b1047cca7206?w=600&q=80"
                  alt="Personnalisation scientifique"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent"></div>
              </div>
              <div className="p-6 pt-2">
                <h3 className="text-xl font-bold text-white mb-3">Personnalisation scientifique</h3>
                <p className="text-white/50 leading-relaxed">
                  Programmes adaptés à vos capacités et objectifs selon les recommandations scientifiques les plus récentes.
                </p>
              </div>
            </div>

            <div className="card overflow-hidden p-0 group">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80"
                  alt="Progression mesurable"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent"></div>
              </div>
              <div className="p-6 pt-2">
                <h3 className="text-xl font-bold text-white mb-3">Progression mesurable</h3>
                <p className="text-white/50 leading-relaxed">
                  Indicateurs précis pour suivre vos progrès en force, endurance, équilibre et cognition.
                </p>
              </div>
            </div>

            <div className="card overflow-hidden p-0 group">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80"
                  alt="Approche holistique"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent"></div>
              </div>
              <div className="p-6 pt-2">
                <h3 className="text-xl font-bold text-white mb-3">Approche holistique</h3>
                <p className="text-white/50 leading-relaxed">
                  Intégration du physique, du cognitif et du social pour maximiser les bénéfices santé.
                </p>
              </div>
            </div>

            <div className="card overflow-hidden p-0 group">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1517438984742-1262db08379e?w=600&q=80"
                  alt="Sécurité optimale"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent"></div>
              </div>
              <div className="p-6 pt-2">
                <h3 className="text-xl font-bold text-white mb-3">Sécurité optimale</h3>
                <p className="text-white/50 leading-relaxed">
                  Exercices conçus pour minimiser les risques tout en maximisant les bénéfices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#0a0a0a]"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-20 left-10 w-96 h-96 bg-[#c9a96e]/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#c9a96e]/5 rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-light mb-6 text-white">
            Prêt à bénéficier d&apos;une approche <span className="font-semibold">scientifique</span> ?
          </h2>
          <p className="text-xl mb-12 text-white/50 leading-relaxed">
            Rejoignez Evo et profitez d&apos;un programme conçu par un expert pour maximiser votre longévité en bonne santé.
          </p>
          <Link href="/onboarding/login" className="inline-block relative bg-gradient-to-br from-[#c9a96e] to-[#a08050] text-[#0a0a0a] px-12 py-5 rounded-xl font-bold text-xl hover:shadow-2xl shadow-lg transition-all duration-300 hover:scale-105 active:scale-100 overflow-hidden group">
            <span className="relative z-10">Commencer mon parcours</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-3xl font-bold mb-6">
            E<span className="text-[#c9a96e]">vo</span>
          </div>
          <p className="mb-6 text-white/40">
            Gagnez des années de vie en forme
          </p>
          <div className="flex gap-8 justify-center mb-8">
            <Link href="#" className="relative text-white/50 hover:text-[#c9a96e] transition-all duration-300 group">
              Mentions légales
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#c9a96e] group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="#" className="relative text-white/50 hover:text-[#c9a96e] transition-all duration-300 group">
              Confidentialité
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#c9a96e] group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="#" className="relative text-white/50 hover:text-[#c9a96e] transition-all duration-300 group">
              CGU
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#c9a96e] group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>
          <p className="text-sm text-white/20">
            © 2026 Evo. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  )
}
