'use client'

import { Suspense } from 'react'
import LoginContent from './login-content'

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#25D366]/10 mb-4">
            <svg className="w-5 h-5 animate-spin text-[#25D366]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <p className="text-[#1a1a1a]/50">Chargement...</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
