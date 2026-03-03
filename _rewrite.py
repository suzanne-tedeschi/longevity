#!/usr/bin/env python3
"""Rewrite waitlist page with Everfit-inspired content."""

CONTENT = '''\
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

  const rotatingWords = ['en forme.', 'autonome.', 'sans douleur.', 'solide.', 'actif(ve).', 'ind\\u00e9pendant(e).']

  useEffect(() => {
    setMounted(true)
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
          setErrorMessage('Cette adresse email est d\\u00e9j\\u00e0 inscrite.')
        } else {
          setErrorMessage('Une erreur est survenue. Veuillez r\\u00e9essayer.')
        }
        setFormState('error')
        return
      }

      setFormState('success')
    } catch {
      setErrorMessage('Une erreur est survenue. Veuillez r\\u00e9essayer.')
      setFormState('error')
    }
  }
'''

with open('app/waitlist/page.tsx', 'w', encoding='utf-8') as f:
    f.write(CONTENT)

print(f"Done: wrote {len(CONTENT.splitlines())} lines")
