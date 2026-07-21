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
      <span className="tape tape-one" aria-hidden="true">CAT-REVIEWED</span>
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

        <div className="no-zone">
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
        <p id="no-help" className="no-help">{CONFIG.no.helper}</p>
      </div>

      <div className="certified-badge" aria-label={CONFIG.badge}>
        <span aria-hidden="true">🐾</span>
        <span>{CONFIG.badge}</span>
      </div>
    </section>
  )
}
