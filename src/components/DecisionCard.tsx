import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, MouseEvent } from 'react'
import { CONFIG } from '../config'
import { ReactionOrb } from './Atmosphere'

interface Props {
  emoji: string
  onAccept: () => void
  onDecline: () => void
  onReaction: (emoji: string) => void
}

interface NoPosition {
  left: number
  top: number
}

export function DecisionCard({ emoji, onAccept, onDecline, onReaction }: Props) {
  const [noAttempts, setNoAttempts] = useState(0)
  const [noPosition, setNoPosition] = useState<NoPosition | null>(null)
  const [directAnswer, setDirectAnswer] = useState(false)
  const [isTeleporting, setIsTeleporting] = useState(false)
  const noZoneRef = useRef<HTMLDivElement>(null)
  const noButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')

    function updateMotionPreference() {
      setDirectAnswer(motionPreference.matches)
      if (motionPreference.matches) setNoPosition(null)
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setDirectAnswer(true)
        setNoPosition(null)
      }
    }

    updateMotionPreference()
    motionPreference.addEventListener('change', updateMotionPreference)
    window.addEventListener('keydown', handleEscape)

    return () => {
      motionPreference.removeEventListener('change', updateMotionPreference)
      window.removeEventListener('keydown', handleEscape)
    }
  }, [])

  function teleportButton(nextAttempt: number) {
    const zone = noZoneRef.current
    const button = noButtonRef.current
    if (!zone || !button) return

    const padding = 8
    const availableX = Math.max(0, zone.clientWidth - button.offsetWidth - padding * 2)
    const availableY = Math.max(0, zone.clientHeight - button.offsetHeight - padding * 2)
    const slots = [
      { left: padding + availableX, top: padding },
      { left: padding, top: padding + availableY },
      { left: padding + availableX, top: padding + availableY },
      { left: padding + availableX * 0.16, top: padding + availableY * 0.12 },
    ]

    setNoPosition(slots[(nextAttempt - 1) % slots.length])
    setIsTeleporting(false)
    window.requestAnimationFrame(() => {
      setIsTeleporting(true)
      window.setTimeout(() => setIsTeleporting(false), 240)
    })
  }

  function handleNoClick(event: MouseEvent<HTMLButtonElement>) {
    const isKeyboardClick = event.detail === 0
    if (isKeyboardClick || directAnswer || noAttempts >= CONFIG.no.maxDodges) {
      onDecline()
      return
    }

    const nextAttempt = noAttempts + 1
    setNoAttempts(nextAttempt)
    onReaction(CONFIG.reactions.noHover)
    window.requestAnimationFrame(() => teleportButton(nextAttempt))
  }

  const noLabel = noAttempts === 0
    ? CONFIG.no.button
    : CONFIG.no.dodgeLabels[Math.min(noAttempts - 1, CONFIG.no.dodgeLabels.length - 1)]
  const decisionNote = noAttempts === 0
    ? CONFIG.decision.note
    : CONFIG.no.dodgeDescriptions[Math.min(noAttempts - 1, CONFIG.no.dodgeDescriptions.length - 1)]
  const noOpacity = directAnswer ? 1 : Math.max(.36, 1 - noAttempts * .16)
  const noStyle: CSSProperties = noPosition
    ? { left: noPosition.left, top: noPosition.top, opacity: noOpacity }
    : { opacity: noOpacity }

  return (
    <section className="decision-card" aria-labelledby="decision-title">
      <ReactionOrb emoji={emoji} />
      <h2 id="decision-title">{CONFIG.decision.title}</h2>
      <p className="card-subtitle">{CONFIG.decision.subtitle}</p>

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

        <div className="no-zone" ref={noZoneRef}>
          <button
            ref={noButtonRef}
            className={`no-button${noPosition ? ' is-moved' : ''}${isTeleporting ? ' is-teleporting' : ''}`}
            style={noStyle}
            type="button"
            aria-describedby="decision-note"
            onPointerEnter={() => onReaction(CONFIG.reactions.noHover)}
            onPointerLeave={() => onReaction(CONFIG.reactions.default)}
            onClick={handleNoClick}
          >
            {noLabel}
          </button>
        </div>
      </div>
      <p id="decision-note" className="decision-note" aria-live="polite">{decisionNote}</p>
    </section>
  )
}
