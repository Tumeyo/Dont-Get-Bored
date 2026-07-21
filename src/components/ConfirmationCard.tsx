import { CONFIG } from '../config'
import { activityTitle, formatDate } from '../lib'
import type { DatePlan } from '../types'

interface Props {
  plan: DatePlan
  onCopy: () => void
  onShare: () => void
  onEdit: () => void
  onReset: () => void
}

export function ConfirmationCard({ plan, onCopy, onShare, onEdit, onReset }: Props) {
  const details = [
    { icon: '📅', label: 'Main date', value: formatDate(plan.preferredDate) },
    { icon: '⏰', label: 'Time', value: plan.preferredTime },
    { icon: '↻', label: 'Backup', value: formatDate(plan.alternativeDate) },
    { icon: '♡', label: 'The plan', value: activityTitle(plan.activity) },
  ]

  return (
    <section className="confirmation-section" aria-labelledby="confirmation-heading">
      <div className="confirmation-card">
        <span className="confirmation-stamp" aria-hidden="true">IT’S A DATE</span>
        <div className="section-kicker">{CONFIG.confirmation.eyebrow}</div>
        <div className="big-check" aria-hidden="true">🐾</div>
        <h2 id="confirmation-heading">{CONFIG.confirmation.heading}</h2>
        <p className="confirmation-subheading">{CONFIG.confirmation.subheading}</p>

        <dl className="plan-details">
          {details.map((item) => (
            <div key={item.label}>
              <span className="detail-icon" aria-hidden="true">{item.icon}</span>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>

        {plan.message && (
          <blockquote className="plan-note">
            “{plan.message}”
            <span>— a small note</span>
          </blockquote>
        )}
        {plan.contact && <p className="contact-note"><strong>Confirm via:</strong> {plan.contact}</p>}

        <div className="confirmation-actions">
          <button type="button" className="action-button action-dark" onClick={onCopy}>Copy details <span aria-hidden="true">⧉</span></button>
          <button type="button" className="action-button action-pink" onClick={onShare}>Share details <span aria-hidden="true">↗</span></button>
          <button type="button" className="action-button" onClick={onEdit}>Edit answers</button>
          <button type="button" className="action-button action-quiet" onClick={onReset}>Reset page</button>
        </div>
      </div>
    </section>
  )
}
