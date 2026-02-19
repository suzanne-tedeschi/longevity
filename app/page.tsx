'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/70 backdrop-blur-md z-50 border-b border-gold/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold">
            <span className="text-navy-dark">En</span><span className="gradient-text">Train</span>
          </div>
          <div className="flex gap-8 items-center">
            <Link href="#apropos" className="nav-link">
              À propos
            </Link>
            <Link href="#tarifs" className="nav-link">
              Tarifs
            </Link>
            <Link href="/science" className="nav-link">
              Science
            </Link>
            <Link href="#contact" className="nav-link">
              Contact
            </Link>
            <button className="relative bg-gradient-to-br from-bordeaux to-bordeaux-dark text-white px-6 py-2.5 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 active:scale-95">
              Commencer
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Rotating golden gradient background */}
        <div className="absolute inset-0 -z-10 overflow-hidden bg-beige-50">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] animate-rotate-gradient" style={{
            background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(212, 175, 55, 0.15) 60deg, rgba(212, 175, 55, 0.25) 120deg, rgba(184, 148, 31, 0.2) 180deg, rgba(212, 175, 55, 0.15) 240deg, transparent 300deg, transparent 360deg)'
          }}></div>
        </div>
        
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-light text-navy-dark leading-tight tracking-tight">
            Gagnez des années
            <br />
            de vie{' '}
            <span className="font-semibold gradient-text">en forme</span>
          </h1>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 px-6 relative">
        <div className="max-w-6xl mx-auto relative">
          <h2 className="section-title text-center mb-16">
            Maximisez votre forme pour continuer vos{' '}
            <span className="gradient-text">passions</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card group">
              <div className="w-16 h-16 mb-6 rounded-2xl bg-navy-dark/5 flex items-center justify-center group-hover:bg-navy-dark/10 transition-all duration-500">
                <svg className="w-8 h-8 text-navy-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-navy-dark mb-4 transition-colors">Stimulation cérébrale</h3>
              <p className="text-navy leading-relaxed">
                Des exercices conçus scientifiquement pour maintenir votre vivacité d'esprit et vos capacités cognitives au plus haut niveau.
              </p>
              <div className="mt-6 h-0.5 w-0 group-hover:w-full bg-gold transition-all duration-500 rounded-full"></div>
            </div>
            <div className="card group">
              <div className="w-16 h-16 mb-6 rounded-2xl bg-bordeaux/5 flex items-center justify-center group-hover:bg-bordeaux/10 transition-all duration-500">
                <svg className="w-8 h-8 text-bordeaux" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-navy-dark mb-4 transition-colors">Renforcement corporel</h3>
              <p className="text-navy leading-relaxed">
                Un programme adapté qui préserve et développe votre force, votre équilibre et votre mobilité pour rester autonome.
              </p>
              <div className="mt-6 h-0.5 w-0 group-hover:w-full bg-gold transition-all duration-500 rounded-full"></div>
            </div>
            <div className="card group">
              <div className="w-16 h-16 mb-6 rounded-2xl bg-gold/5 flex items-center justify-center group-hover:bg-gold/10 transition-all duration-500">
                <svg className="w-8 h-8 text-gold-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-navy-dark mb-4 transition-colors">Lien social</h3>
              <p className="text-navy leading-relaxed">
                Rejoignez une communauté engagée et bénéficiez d'un accompagnement personnalisé qui vous motive au quotidien.
              </p>
              <div className="mt-6 h-0.5 w-0 group-hover:w-full bg-gold transition-all duration-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6" id="apropos">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="section-title mb-8">
                Un suivi <span className="gold-accent">personnalisé</span> à chaque étape
              </h2>
              <div className="space-y-8">
                <div className="flex gap-6 group cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-navy-dark/5 flex items-center justify-center flex-shrink-0 group-hover:bg-navy-dark/10 transition-all duration-300">
                    <svg className="w-6 h-6 text-navy-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-navy-dark mb-2 group-hover:text-bordeaux transition-colors">Progression trackée</h3>
                    <p className="text-navy leading-relaxed">
                      Visualisez vos progrès en temps réel et célébrez chaque victoire, petite ou grande.
                    </p>
                    <div className="mt-3 h-0.5 w-0 group-hover:w-24 bg-gold transition-all duration-500 rounded-full"></div>
                  </div>
                </div>
                <div className="flex gap-6 group cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-bordeaux/5 flex items-center justify-center flex-shrink-0 group-hover:bg-bordeaux/10 transition-all duration-300">
                    <svg className="w-6 h-6 text-bordeaux" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-navy-dark mb-2 group-hover:text-bordeaux transition-colors">Objectifs personnalisés</h3>
                    <p className="text-navy leading-relaxed">
                      Des objectifs adaptés à votre niveau et à vos aspirations personnelles.
                    </p>
                    <div className="mt-3 h-0.5 w-0 group-hover:w-24 bg-gold transition-all duration-500 rounded-full"></div>
                  </div>
                </div>
                <div className="flex gap-6 group cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-gold/5 flex items-center justify-center flex-shrink-0 group-hover:bg-gold/10 transition-all duration-300">
                    <svg className="w-6 h-6 text-gold-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-navy-dark mb-2 group-hover:text-bordeaux transition-colors">Motivation constante</h3>
                    <p className="text-navy leading-relaxed">
                      Un accompagnement qui vous garde engagé et enthousiaste jour après jour.
                    </p>
                    <div className="mt-3 h-0.5 w-0 group-hover:w-24 bg-gold transition-all duration-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative card bg-navy-dark text-white border-none">
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold mb-4">Une expérience premium</h3>
                  <p className="text-lg leading-relaxed mb-6 text-white/90">
                    Interface élégante et intuitive, conçue pour vous offrir une expérience simple et agréable, sans compromis sur la qualité.
                  </p>
                  <div className="border-t border-white/10 pt-6 mt-6">
                    <p className="text-gold-light font-medium flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
                      Simplicité et excellence au service de votre bien-être
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6 relative" id="tarifs">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title text-center mb-6">
            Choisissez votre <span className="gradient-text">formule</span>
          </h2>
          <p className="text-xl text-navy text-center mb-16 max-w-3xl mx-auto">
            Un investissement dans votre santé et votre longévité
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Essentiel */}
            <div className="card">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-navy-dark mb-2">Essentiel</h3>
                <p className="text-navy/70">Pour démarrer votre parcours</p>
              </div>
              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-navy-dark">29€</span>
                  <span className="text-navy/70">/mois</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-navy">3 séances par semaine</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-navy">Suivi de progression</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-navy">Accès à la communauté</span>
                </li>
              </ul>
              <button className="w-full btn-secondary">Commencer</button>
            </div>

            {/* Premium */}
            <div className="relative z-10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold text-navy-dark px-4 py-1 rounded-full text-sm font-semibold z-20">
                Le plus populaire
              </div>
              <div className="card border-2 border-gold">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-navy-dark mb-2">Premium</h3>
                  <p className="text-navy/70">L'accompagnement complet</p>
                </div>
                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold gradient-text">49€</span>
                    <span className="text-navy/70">/mois</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-navy">Séances illimitées</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-navy">Programme personnalisé</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-navy">Suivi analytique avancé</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-navy">Support prioritaire</span>
                  </li>
                </ul>
                <button className="w-full btn-primary">Commencer</button>
              </div>
            </div>

            {/* Excellence */}
            <div className="card">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-navy-dark mb-2">Excellence</h3>
                <p className="text-navy/70">L'expérience sur mesure</p>
              </div>
              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-navy-dark">99€</span>
                  <span className="text-navy/70">/mois</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-navy">Tout Premium inclus</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  <span className="text-navy">Coaching 1-1 mensuel</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-navy">Bilan scientifique trimestriel</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-navy">Accès anticipé nouveautés</span>
                </li>
              </ul>
              <button className="w-full btn-secondary">Commencer</button>
            </div>
          </div>
          
          <p className="text-center text-navy/60 mt-12">
            Tous les abonnements incluent 14 jours d'essai gratuit • Sans engagement
          </p>
        </div>
      </section>

      {/* Science Teaser */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto text-center relative">
          <h2 className="section-title mb-6">
            Une approche <span className="gradient-text">scientifique</span> rigoureuse
          </h2>
          <p className="text-xl text-navy mb-12 max-w-3xl mx-auto leading-relaxed">
            Chaque séance est conçue à partir des dernières découvertes en sciences du vieillissement pour vous garantir des résultats optimaux et durables.
          </p>
          <Link href="/science" className="inline-block btn-primary group">
            Découvrir la science derrière EnTrain
            <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">→</span>
          </Link>
          
          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="card">
              <div className="text-4xl font-bold gradient-text mb-2">200+</div>
              <p className="text-navy">Études analysées</p>
            </div>
            <div className="card">
              <div className="text-4xl font-bold gradient-text mb-2">15+</div>
              <p className="text-navy">Années de recherche</p>
            </div>
            <div className="card">
              <div className="text-4xl font-bold gradient-text mb-2">100%</div>
              <p className="text-navy">Evidence-based</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 relative overflow-hidden" id="contact">
        <div className="absolute inset-0 bg-navy-dark"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Prêt à transformer votre quotidien ?
          </h2>
          <p className="text-xl mb-12 text-white/90 leading-relaxed">
            Rejoignez EnTrain aujourd'hui et commencez votre parcours vers une vie plus longue et plus épanouie.
          </p>
          <button className="relative bg-gold text-navy-dark px-12 py-5 rounded-xl font-bold text-xl hover:bg-gold-light shadow-2xl hover:shadow-gold/50 transition-all duration-300 hover:scale-105 active:scale-100 overflow-hidden group">
            <span className="relative z-10">Commencer gratuitement</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          </button>
          <p className="mt-6 text-sm text-white/70 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
            Sans engagement • Essai gratuit de 14 jours
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-navy-900 text-white/80 border-t border-white/5">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-3xl font-bold mb-6">
            En<span className="text-gold">Train</span>
          </div>
          <p className="mb-6 text-white/70">
            Gagnez des années de vie en forme
          </p>
          <div className="flex gap-8 justify-center mb-8">
            <Link href="#" className="relative hover:text-gold transition-all duration-300 group">
              Mentions légales
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="#" className="relative hover:text-gold transition-all duration-300 group">
              Confidentialité
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="#" className="relative hover:text-gold transition-all duration-300 group">
              CGU
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>
          <p className="text-sm text-white/50">
            © 2026 EnTrain. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  )
}
