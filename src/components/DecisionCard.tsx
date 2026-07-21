import { CONFIG } from '../config'
import { ReactionOrb } from './Atmosphere'

interface Props {
  emoji: string
  onAccept: () => void
  onDecline: () => void
  onReaction: (emoji: string) => void
}

export function DecisionCard({ emoji, onAccept, onDecline, onReaction }: Props) {
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

        <button
          className="no-button"
          type="button"
          onPointerEnter={() => onReaction(CONFIG.reactions.noHover)}
          onPointerLeave={() => onReaction(CONFIG.reactions.default)}
          onClick={onDecline}
        >
          {CONFIG.no.button}
        </button>
      </div>
      <p className="decision-note">{CONFIG.decision.note}</p>
    </section>
  )
}
