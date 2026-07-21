'use client'

import { useCallback, useEffect, useState } from 'react'
import { BackgroundDecor, Confetti } from './components/Atmosphere'
import { ConfirmationCard } from './components/ConfirmationCard'
import { DatePlanner } from './components/DatePlanner'
import { DecisionCard } from './components/DecisionCard'
import { CONFIG } from './config'
import { buildPlanText, copyWithFallback, loadSavedPlan, sendPlan } from './lib'
import { EMPTY_PLAN } from './types'
import type { DatePlan } from './types'

type Phase = 'decision' | 'loading' | 'planner' | 'confirmed'

export default function App() {
  const [phase, setPhase] = useState<Phase>('decision')
  const [plan, setPlan] = useState<DatePlan>(EMPTY_PLAN)
  const [emoji, setEmoji] = useState<string>(CONFIG.reactions.default)
  const [announcement, setAnnouncement] = useState('')
  const [celebrating, setCelebrating] = useState(false)
  const [loadingIndex, setLoadingIndex] = useState(0)
  const [toast, setToast] = useState('')

  const accepted = phase !== 'decision'

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const savedPlan = loadSavedPlan()
      if (savedPlan) {
        setPlan(savedPlan)
        setPhase('confirmed')
      }
    }, 0)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (phase !== 'loading') return
    const timers = CONFIG.loading.map((_, index) => window.setTimeout(
      () => setLoadingIndex(index),
      index * CONFIG.loadingStepMs,
    ))
    timers.push(window.setTimeout(
      () => {
        setPhase('planner')
        setAnnouncement('Date approved. The date planning form is ready.')
        window.setTimeout(() => document.getElementById('planner-heading')?.focus(), 0)
      },
      CONFIG.loading.length * CONFIG.loadingStepMs,
    ))
    return () => timers.forEach(window.clearTimeout)
  }, [phase])

  useEffect(() => {
    if (!celebrating) return
    const timer = window.setTimeout(() => setCelebrating(false), 4_500)
    return () => window.clearTimeout(timer)
  }, [celebrating])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 4_000)
    return () => window.clearTimeout(timer)
  }, [toast])

  const announce = useCallback((message: string) => {
    setAnnouncement('')
    window.setTimeout(() => setAnnouncement(message), 20)
  }, [])

  function acceptDate() {
    setEmoji(CONFIG.reactions.accepted)
    setCelebrating(true)
    setLoadingIndex(0)
    setPhase('loading')
    announce(CONFIG.yes.breakingNews)
  }

  async function savePlan(nextPlan: DatePlan) {
    await sendPlan(nextPlan)
    setPlan(nextPlan)
    try {
      localStorage.setItem(CONFIG.storageKey, JSON.stringify(nextPlan))
      announce(CONFIG.planner.submissionSuccess)
    } catch {
      announce(`${CONFIG.planner.submissionSuccess} Your browser did not save a local copy.`)
    }
    setCelebrating(true)
    setPhase('confirmed')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function copyDetails() {
    const result = await copyWithFallback(buildPlanText(plan))
    const message = result === 'copied' ? 'Date details copied!' : 'Copy window opened.'
    setToast(message)
    announce(message)
  }

  async function shareDetails() {
    const text = buildPlanText(plan)
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Our Date Plan™', text })
        announce('Share sheet opened.')
        return
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return
      }
    }
    const result = await copyWithFallback(text)
    const message = result === 'copied'
      ? 'Sharing is not available here, so the details were copied instead.'
      : 'Sharing is not available here. A copy window was opened instead.'
    setToast(message)
    announce(message)
  }

  function resetPage() {
    try {
      localStorage.removeItem(CONFIG.storageKey)
    } catch {
      // Reset the visible experience even if storage access is unavailable.
    }
    setPlan(EMPTY_PLAN)
    setPhase('decision')
    setEmoji(CONFIG.reactions.default)
    setToast('Fresh start unlocked.')
    announce('The page has been reset.')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app-shell">
      <BackgroundDecor />
      <Confetti active={celebrating} />
      <a className="skip-link" href="#main-content">Skip to the date request</a>

      {accepted && <div className="breaking-news" role="status"><strong>{CONFIG.yes.bannerLabel}</strong><span>{CONFIG.yes.breakingNews}</span></div>}

      <main id="main-content">
        {(phase === 'decision' || phase === 'loading') && (
          <section className="hero" id="top">
            <div className="hero-copy">
              <div className="eyebrow">{CONFIG.hero.smallHeading}</div>
              <h1>
                <span className="hero-headline-line">{CONFIG.hero.headlineFirst}</span>
                <em className="hero-headline-emphasis">{CONFIG.hero.headlineSecond}</em>
              </h1>
              <p className="hero-description">
                <span>{CONFIG.hero.descriptionFirst}</span>
                <strong>{CONFIG.hero.descriptionEmphasis}</strong>
                <span>{CONFIG.hero.descriptionLast}</span>
              </p>
              <blockquote className="hero-quote">
                <span>{CONFIG.hero.quoteFirst}</span>
                <span>{CONFIG.hero.quoteSecond}</span>
              </blockquote>
            </div>

            <div className="decision-column">
              <DecisionCard
                emoji={emoji}
                onAccept={acceptDate}
                onReaction={setEmoji}
              />
            </div>
          </section>
        )}

        {phase === 'loading' && (
          <section className="loading-section" aria-live="polite" aria-label="Preparing the date planner">
            <div className="loading-card">
              <div className="loader-heart" aria-hidden="true">♡</div>
              <span className="section-kicker">JUST A SECOND</span>
              <h2>{CONFIG.loading[loadingIndex]}</h2>
              <div className="loading-track" aria-hidden="true"><span style={{ width: `${((loadingIndex + 1) / CONFIG.loading.length) * 100}%` }} /></div>
              <p>A brief and completely unofficial review.</p>
            </div>
          </section>
        )}

        {phase === 'planner' && <DatePlanner initialPlan={plan} onSubmit={savePlan} />}

        {phase === 'confirmed' && (
          <ConfirmationCard
            plan={plan}
            onCopy={copyDetails}
            onShare={shareDetails}
            onEdit={() => setPhase('planner')}
            onReset={resetPage}
          />
        )}
      </main>

      <footer>
        <span aria-hidden="true">♥</span>
        <p>{CONFIG.footer}</p>
        <span aria-hidden="true">✦</span>
      </footer>

      <div className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</div>
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  )
}
