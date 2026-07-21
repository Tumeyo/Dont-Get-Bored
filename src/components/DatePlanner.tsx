import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { CONFIG } from '../config'
import { getTodayInput } from '../lib'
import type { DatePlan } from '../types'

interface Props {
  initialPlan: DatePlan
  onSubmit: (plan: DatePlan) => Promise<void>
}

type Errors = Partial<Record<keyof DatePlan, string>>

export function DatePlanner({ initialPlan, onSubmit }: Props) {
  const [plan, setPlan] = useState<DatePlan>(initialPlan)
  const [errors, setErrors] = useState<Errors>({})
  const [showVenue, setShowVenue] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionError, setSubmissionError] = useState('')
  const today = getTodayInput()

  function updateValue(name: keyof DatePlan, value: string) {
    setPlan((current) => ({ ...current, [name]: value }))
    setErrors((current) => {
      const next = { ...current }
      delete next[name]
      return next
    })
  }

  function update(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    updateValue(event.target.name as keyof DatePlan, event.target.value)
  }

  function toggleActivity(activityId: string) {
    setPlan((current) => {
      if (activityId === 'none') return { ...current, activities: ['none'] }

      const selected = current.activities.filter((id) => id !== 'none')
      const activities = selected.includes(activityId)
        ? selected.filter((id) => id !== activityId)
        : [...selected, activityId]
      return { ...current, activities }
    })
    setErrors((current) => {
      const next = { ...current }
      delete next.activities
      return next
    })
  }

  function validate(): Errors {
    const next: Errors = {}
    if (!plan.preferredDate) next.preferredDate = 'Choose the main date.'
    else if (plan.preferredDate < today) next.preferredDate = 'Please choose today or a later date.'
    if (!plan.preferredTime) next.preferredTime = 'Choose a time.'
    if (!plan.alternativeDate) next.alternativeDate = 'Add a backup date, just in case.'
    else if (plan.alternativeDate < today) next.alternativeDate = 'The backup date cannot be in the past.'
    if (plan.activities.length === 0) next.activities = 'Choose at least one option, or select “Dinner + walk is perfect.”'
    return next
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitting) return
    const nextErrors = validate()
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      document.getElementById('planner-errors')?.focus()
      return
    }

    setSubmissionError('')
    setIsSubmitting(true)
    try {
      await onSubmit(plan)
    } catch {
      setSubmissionError(CONFIG.planner.submissionError)
      window.setTimeout(() => document.getElementById('submission-error')?.focus(), 0)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="planner-section" aria-labelledby="planner-heading">
      <div className="section-intro">
        <span className="section-kicker">{CONFIG.planner.eyebrow}</span>
        <h2 id="planner-heading">{CONFIG.planner.heading}</h2>
        <p>{CONFIG.planner.intro}</p>
      </div>

      <form className="planner-card" onSubmit={handleSubmit} noValidate>
        {Object.values(errors).some(Boolean) && (
          <div className="error-summary" id="planner-errors" role="alert" tabIndex={-1}>
            Please check the highlighted fields.
          </div>
        )}

        <section className="recommended-plan" aria-labelledby="recommended-plan-heading">
          <div className="recommendation-heading">
            <span className="section-kicker">{CONFIG.planner.recommendation.label}</span>
            <h3 id="recommended-plan-heading">Dinner, then a walk.</h3>
          </div>
          <p className="recommendation-hint"><span aria-hidden="true">↳</span> {CONFIG.planner.recommendation.detailsHint}</p>

          <div className="itinerary-stops">
            <button
              className="itinerary-stop itinerary-stop-button"
              type="button"
              aria-expanded={showVenue}
              aria-controls="terrazza-details"
              onClick={() => setShowVenue((current) => !current)}
            >
              <span className="stop-number" aria-hidden="true">01</span>
              <span className="stop-icon" aria-hidden="true">🍽️</span>
              <span className="stop-copy">
                <strong>{CONFIG.planner.recommendation.dinnerTitle}</strong>
                <small>{CONFIG.planner.recommendation.dinnerDetail}</small>
              </span>
              <span className="stop-action" aria-hidden="true">{showVenue ? '−' : '+'}</span>
            </button>

            <span className="itinerary-line" aria-hidden="true" />

            <div className="itinerary-stop">
              <span className="stop-number" aria-hidden="true">02</span>
              <span className="stop-icon" aria-hidden="true">🌙</span>
              <span className="stop-copy">
                <strong>{CONFIG.planner.recommendation.walkTitle}</strong>
                <small>{CONFIG.planner.recommendation.walkDetail}</small>
              </span>
            </div>
          </div>

          {showVenue && (
            <div className="venue-preview" id="terrazza-details">
              <a
                className="venue-photo-link"
                href={CONFIG.planner.recommendation.venue.mapUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${CONFIG.planner.recommendation.venue.name} in Google Maps`}
              >
                <img
                  src={CONFIG.planner.recommendation.venue.image}
                  alt="A dinner served at Terrazza Restaurant"
                  loading="lazy"
                />
                <span>Open location ↗</span>
              </a>
              <div className="venue-copy">
                <span className="mini-kicker">THE LOCATION</span>
                <h4>{CONFIG.planner.recommendation.venue.name}</h4>
                <p>{CONFIG.planner.recommendation.venue.address}</p>
                <p>{CONFIG.planner.recommendation.venue.phone}</p>
                <a href={CONFIG.planner.recommendation.venue.mapUrl} target="_blank" rel="noreferrer">
                  View on Google Maps <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          )}
        </section>

        <div className="date-grid">
          <Field label={CONFIG.planner.fields.preferredDate} error={errors.preferredDate} htmlFor="preferredDate">
            <input
              id="preferredDate"
              name="preferredDate"
              type="date"
              min={today}
              value={plan.preferredDate}
              onChange={update}
              onInput={(event) => updateValue('preferredDate', event.currentTarget.value)}
              aria-invalid={Boolean(errors.preferredDate)}
              aria-describedby={errors.preferredDate ? 'preferredDate-error' : undefined}
              required
            />
          </Field>
          <Field label={CONFIG.planner.fields.preferredTime} error={errors.preferredTime} htmlFor="preferredTime">
            <input
              id="preferredTime"
              name="preferredTime"
              type="time"
              value={plan.preferredTime}
              onChange={update}
              onInput={(event) => updateValue('preferredTime', event.currentTarget.value)}
              aria-invalid={Boolean(errors.preferredTime)}
              aria-describedby={errors.preferredTime ? 'preferredTime-error' : undefined}
              required
            />
          </Field>
          <Field label={CONFIG.planner.fields.alternativeDate} error={errors.alternativeDate} htmlFor="alternativeDate">
            <input
              id="alternativeDate"
              name="alternativeDate"
              type="date"
              min={today}
              value={plan.alternativeDate}
              onChange={update}
              onInput={(event) => updateValue('alternativeDate', event.currentTarget.value)}
              aria-invalid={Boolean(errors.alternativeDate)}
              aria-describedby={errors.alternativeDate ? 'alternativeDate-error' : undefined}
              required
            />
          </Field>
        </div>

        <fieldset className="activity-fieldset" aria-describedby={errors.activities ? 'activities-error' : undefined}>
          <legend>Want to add something?</legend>
          <p className="legend-help">Dinner and the walk are already in. Pick as many extras as you like, or keep it simple.</p>
          <div className="activity-grid">
            {CONFIG.planner.activities.map((activity) => (
              <label className={`activity-option ${plan.activities.includes(activity.id) ? 'is-selected' : ''}`} key={activity.id}>
                <input
                  type="checkbox"
                  name="activities"
                  value={activity.id}
                  checked={plan.activities.includes(activity.id)}
                  onChange={() => toggleActivity(activity.id)}
                />
                <span className="activity-emoji" aria-hidden="true">{activity.emoji}</span>
                <span className="activity-copy">
                  <strong>{activity.title}</strong>
                  <small>{activity.detail}</small>
                </span>
                <span className="selection-mark" aria-hidden="true" />
              </label>
            ))}
          </div>
          {errors.activities && <span className="field-error" id="activities-error">{errors.activities}</span>}
        </fieldset>

        <div className="text-grid">
          <Field label={CONFIG.planner.fields.message} htmlFor="message">
            <textarea
              id="message"
              name="message"
              rows={4}
              maxLength={240}
              placeholder={CONFIG.planner.fields.messagePlaceholder}
              value={plan.message}
              onChange={update}
            />
          </Field>
          <Field label={CONFIG.planner.fields.contact} htmlFor="contact">
            <input
              id="contact"
              name="contact"
              type="text"
              maxLength={100}
              placeholder={CONFIG.planner.fields.contactPlaceholder}
              value={plan.contact}
              onChange={update}
            />
          </Field>
        </div>

        {submissionError && (
          <p className="submission-error" id="submission-error" role="alert" tabIndex={-1}>{submissionError}</p>
        )}

        <div className="form-footer">
          <p><span aria-hidden="true">🔒</span> {CONFIG.planner.submissionNote}</p>
          <button className="primary-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? CONFIG.planner.submitting : CONFIG.planner.submit}
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </form>
    </section>
  )
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="field">
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {error && <span className="field-error" id={`${htmlFor}-error`}>{error}</span>}
    </div>
  )
}
