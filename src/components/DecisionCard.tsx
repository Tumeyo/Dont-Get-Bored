import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react'
import { CONFIG } from '../config'
import { ConfidenceMeter, ReactionOrb } from './Atmosphere'

interface Props {
  accepted: boolean
  emoji: string
  onAccept: () => void
  onDecline: () => void
  onReaction: (emoji: string) => void
  onAnnouncement: (message: string) => void
}

interface Point {
  x: number
  y: number
}

export function DecisionCard({
  accepted,
  emoji,
  onAccept,
  onDecline,
  onReaction,
  onAnnouncement,
}: Props) {
  const [attempts, setAttempts] = useState(0)
  const [position, setPosition] = useState<Point | null>(null)
  const [prankOver, setPrankOver] = useState(false)
  const [hasFocus, setHasFocus] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [shaking, setShaking] = useState(false)
  const zoneRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const endTimer = useRef<number | undefined>(undefined)
  const pointerInProgress = useRef(false)

  const prankActive = !prankOver && !reducedMotion && attempts < CONFIG.maxNoDodges

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const stopPrank = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      window.clearTimeout(endTimer.current)
      setPrankOver(true)
      setPosition(null)
      onAnnouncement('The joke is over. The No button is now normally clickable.')
    }
    window.addEventListener('keydown', stopPrank)
    return () => {
      window.removeEventListener('keydown', stopPrank)
      window.clearTimeout(endTimer.current)
    }
  }, [onAnnouncement])

  function dodge() {
    if (!prankActive || hasFocus || !zoneRef.current || !buttonRef.current) return

    const zone = zoneRef.current.getBoundingClientRect()
    const button = buttonRef.current.getBoundingClientRect()
    const nextAttempt = attempts + 1
    const maxX = Math.max(0, zone.width - button.width)
    const maxY = Math.max(0, zone.height - button.height)
    const nextPosition = {
      x: Math.round(Math.random() * maxX),
      y: Math.round(Math.random() * maxY),
    }

    setAttempts(nextAttempt)
    setPosition(nextPosition)
    setShaking(true)
    window.setTimeout(() => setShaking(false), 320)
    const reaction = CONFIG.no.dodgeReactions[nextAttempt - 1]
    onReaction(CONFIG.reactions.noHover)
    onAnnouncement(reaction)

    if (nextAttempt >= CONFIG.maxNoDodges) {
      window.clearTimeout(endTimer.current)
      endTimer.current = window.setTimeout(() => {
        setPrankOver(true)
        setPosition(null)
        onAnnouncement('Okay, okay. The No button is now normally clickable.')
      }, 720)
    }
  }

  function handleTouchStart(event: ReactPointerEvent<HTMLButtonElement>) {
    if (event.pointerType !== 'mouse' && prankActive && !hasFocus) {
      event.preventDefault()
      dodge()
      return
    }
    pointerInProgress.current = true
    setHasFocus(false)
  }

  function handleNoClick() {
    if (hasFocus || !prankActive) {
      onDecline()
      return
    }
    dodge()
  }

  const noLabel = prankOver || reducedMotion
    ? CONFIG.no.finalButton
    : attempts === 0
      ? CONFIG.no.button
      : CONFIG.no.dodgeLabels[attempts - 1]

  const noStyle: CSSProperties | undefined = position
    ? { left: `${position.x}px`, top: `${position.y}px` }
    : undefined

  return (
    <section className={`decision-card ${shaking ? 'is-shaking' : ''}`} aria-labelledby="decision-title">
      <span className="tape tape-one" aria-hidden="true">TOP SECRET</span>
      <ReactionOrb emoji={emoji} />
      <div className="card-heading">
        <span className="mini-kicker">ONE QUESTION</span>
        <span className="hand-arrow" aria-hidden="true">↘</span>
      </div>
      <h2 id="decision-title">Choose your fighter</h2>
      <p className="card-subtitle">There is one suspiciously excellent option.</p>

      <div className="action-stack">
        <button
          className="yes-button"
          type="button"
          onClick={onAccept}
          onPointerEnter={() => onReaction(CONFIG.reactions.yesHover)}
          onPointerLeave={() => onReaction(CONFIG.reactions.default)}
        >
          <span>{CONFIG.yes.button}</span>
          <span aria-hidden="true">→</span>
        </button>

        <div className="no-zone" ref={zoneRef}>
          <button
            ref={buttonRef}
            className={`no-button ${position ? 'is-moved' : ''}`}
            style={noStyle}
            type="button"
            onPointerEnter={(event) => {
              onReaction(CONFIG.reactions.noHover)
              if (event.pointerType === 'mouse') dodge()
            }}
            onPointerDown={handleTouchStart}
            onPointerUp={() => { pointerInProgress.current = false }}
            onPointerLeave={() => onReaction(CONFIG.reactions.default)}
            onFocus={() => {
              if (!pointerInProgress.current) setHasFocus(true)
            }}
            onBlur={() => {
              pointerInProgress.current = false
              setHasFocus(false)
            }}
            onClick={handleNoClick}
            aria-describedby="no-help"
          >
            {noLabel}
          </button>
        </div>
        <p id="no-help" className="no-help">
          {prankActive ? 'Esc ends the joke instantly.' : 'This button is normally clickable.'}
        </p>
      </div>

      <ConfidenceMeter accepted={accepted} />
      <div className="certified-badge" aria-label={CONFIG.badge}>
        <span aria-hidden="true">★</span>
        <span>{CONFIG.badge}</span>
      </div>
    </section>
  )
}
