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
  const [prankDisabled, setPrankDisabled] = useState(false)
  const [isTeleporting, setIsTeleporting] = useState(false)
  const noZoneRef = useRef<HTMLDivElement>(null)
  const noButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')

    function enableDirectAnswer() {
      setPrankDisabled(true)
      setNoPosition(null)
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') enableDirectAnswer()
    }

    if (motionPreference.matches) enableDirectAnswer()
    motionPreference.addEventListener('change', enableDirectAnswer)
    window.addEventListener('keydown', handleEscape)

    return () => {
      motionPreference.removeEventListener('change', enableDirectAnswer)
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
    if (isKeyboardClick || prankDisabled || noAttempts >= CONFIG.no.maxDodges) {
      onDecline()
      return
    }

    const nextAttempt = noAttempts + 1
    setNoAttempts(nextAttempt)
    teleportButton(nextAttempt)
    onReaction(CONFIG.reactions.noHover)
  }

  const noLabel = noAttempts === 0
    ? CONFIG.no.button
    : CONFIG.no.dodgeLabels[Math.min(noAttempts - 1, CONFIG.no.dodgeLabels.length - 1)]
  const noHelper = prankDisabled || noAttempts >= CONFIG.no.maxDodges
    ? CONFIG.no.finalHelper
    : noAttempts === 0
      ? CONFIG.no.helper
      : CONFIG.no.dodgeReactions[Math.min(noAttempts - 1, CONFIG.no.dodgeReactions.length - 1)]
  const noOpacity = prankDisabled ? 1 : Math.max(.52, 1 - noAttempts * .12)
  const noStyle: CSSProperties = noPosition
    ? { left: noPosition.left, top: noPosition.top, opacity: noOpacity }
    : { opacity: noOpacity }

  return (
    <section className="decision-card" aria-labelledby="decision-title">
      <ReactionOrb emoji={emoji} />
      <div className="card-heading">
        <span className="mini-kicker">{CONFIG.decision.label}</span>
      </div>
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
            aria-describedby="no-help"
            onPointerEnter={() => onReaction(CONFIG.reactions.noHover)}
            onPointerLeave={() => onReaction(CONFIG.reactions.default)}
            onClick={handleNoClick}
          >
            {noLabel}
          </button>
        </div>
        <p id="no-help" className="no-help" aria-live="polite">{noHelper}</p>
      </div>

    </section>
  )
}
