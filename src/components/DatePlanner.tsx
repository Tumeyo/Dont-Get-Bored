import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { CONFIG } from '../config'
import { getTodayInput } from '../lib'
import type { DatePlan } from '../types'

interface Props {
  initialPlan: DatePlan
  onSubmit: (plan: DatePlan) => void
}

type Errors = Partial<Record<keyof DatePlan, string>>

export function DatePlanner({ initialPlan, onSubmit }: Props) {
  const [plan, setPlan] = useState<DatePlan>(initialPlan)
  const [errors, setErrors] = useState<Errors>({})
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

  function validate(): Errors {
    const next: Errors = {}
    if (!plan.preferredDate) next.preferredDate = 'Choose the main date.'
    else if (plan.preferredDate < today) next.preferredDate = 'That date is in the past—time travel is not included.'
    if (!plan.preferredTime) next.preferredTime = 'Choose a time.'
    if (!plan.alternativeDate) next.alternativeDate = 'Add a backup date, just in case.'
    else if (plan.alternativeDate < today) next.alternativeDate = 'The backup date cannot be in the past.'
    if (!plan.activity) next.activity = 'Pick one date idea.'
    return next
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate()
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      document.getElementById('planner-errors')?.focus()
      return
    }
    onSubmit(plan)
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
            Tiny plot hole detected. Check the highlighted fields.
          </div>
        )}

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

        <fieldset className="activity-fieldset" aria-describedby={errors.activity ? 'activity-error' : undefined}>
          <legend>What is the vibe?</legend>
          <p className="legend-help">Choose exactly one wildly solid option.</p>
          <div className="activity-grid">
            {CONFIG.planner.activities.map((activity) => (
              <label className={`activity-option ${plan.activity === activity.id ? 'is-selected' : ''}`} key={activity.id}>
                <input
                  type="radio"
                  name="activity"
                  value={activity.id}
                  checked={plan.activity === activity.id}
                  onChange={update}
                />
                <span className="activity-emoji" aria-hidden="true">{activity.emoji}</span>
                <span className="activity-copy">
                  <strong>{activity.title}</strong>
                  <small>{activity.detail}</small>
                </span>
                <span className="radio-mark" aria-hidden="true" />
              </label>
            ))}
          </div>
          {errors.activity && <span className="field-error" id="activity-error">{errors.activity}</span>}
        </fieldset>

        <div className="text-grid">
          <Field label={CONFIG.planner.fields.message} htmlFor="message">
            <textarea
              id="message"
              name="message"
              rows={4}
              maxLength={240}
              placeholder="Playlist requests, snack opinions, plot twists…"
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
              placeholder="Text, call, carrier pigeon…"
              value={plan.contact}
              onChange={update}
            />
          </Field>
        </div>

        <div className="form-footer">
          <p><span aria-hidden="true">🔒</span> Saved only in this browser.</p>
          <button className="primary-submit" type="submit">{CONFIG.planner.submit}<span aria-hidden="true">→</span></button>
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
