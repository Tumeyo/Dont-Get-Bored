import { CONFIG } from './config'
import type { DatePlan } from './types'

export function getTodayInput(): string {
  const today = new Date()
  const offset = today.getTimezoneOffset()
  return new Date(today.getTime() - offset * 60_000).toISOString().slice(0, 10)
}

export function formatDate(value: string): string {
  if (!value) return 'Not selected'
  const [year, month, day] = value.split('-').map(Number)
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(year, month - 1, day))
}

export function activityTitle(activityId: string): string {
  return CONFIG.planner.activities.find((activity) => activity.id === activityId)?.title ?? activityId
}

export function activityTitles(activityIds: string[]): string {
  return activityIds.map(activityTitle).join(', ')
}

export function buildPlanText(plan: DatePlan): string {
  return [
    `${CONFIG.names.her} + ${CONFIG.names.mine}: our date plan`,
    `When: ${formatDate(plan.preferredDate)} at ${plan.preferredTime}`,
    `Backup: ${formatDate(plan.alternativeDate)}`,
    `Main plan: ${CONFIG.planner.mainPlan}`,
    `Extras: ${activityTitles(plan.activities)}`,
    plan.message ? `Note: ${plan.message}` : '',
    plan.contact ? `Confirm via: ${plan.contact}` : '',
    '',
    'Looking forward to it. ♡',
  ]
    .filter(Boolean)
    .join('\n')
}

export async function sendPlan(plan: DatePlan): Promise<void> {
  const response = await fetch(CONFIG.formspree.endpoint, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      _subject: CONFIG.formspree.subject,
      answer: 'Yes, take me out',
      preferred_date: formatDate(plan.preferredDate),
      preferred_time: plan.preferredTime,
      backup_date: formatDate(plan.alternativeDate),
      main_plan: CONFIG.planner.mainPlan,
      extras: activityTitles(plan.activities),
      note: plan.message || 'None',
      contact: plan.contact || 'Not provided',
      full_response: buildPlanText(plan),
      page: window.location.href,
    }),
  })

  if (!response.ok) throw new Error(`Formspree submission failed with status ${response.status}`)
}

export function loadSavedPlan(): DatePlan | null {
  try {
    const saved = localStorage.getItem(CONFIG.storageKey)
    if (!saved) return null
    const value: unknown = JSON.parse(saved)
    if (!value || typeof value !== 'object') return null
    const candidate = value as Partial<DatePlan> & { activity?: unknown }
    const textKeys = [
      'preferredDate',
      'preferredTime',
      'alternativeDate',
      'message',
      'contact',
    ] as const
    if (!textKeys.every((key) => typeof candidate[key] === 'string')) return null

    const activities = Array.isArray(candidate.activities)
      && candidate.activities.every((activity) => typeof activity === 'string')
      ? candidate.activities
      : typeof candidate.activity === 'string'
        ? [candidate.activity]
        : null
    if (!activities) return null

    return {
      preferredDate: candidate.preferredDate as string,
      preferredTime: candidate.preferredTime as string,
      alternativeDate: candidate.alternativeDate as string,
      activities,
      message: candidate.message as string,
      contact: candidate.contact as string,
    }
  } catch {
    return null
  }
}

export async function copyWithFallback(text: string): Promise<'copied' | 'prompted'> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return 'copied'
    }
  } catch {
    // Continue to the compatibility fallback below.
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  let copied: boolean
  try {
    copied = document.execCommand('copy')
  } catch {
    copied = false
  } finally {
    textarea.remove()
  }
  if (copied) return 'copied'

  window.prompt('Copy your date details:', text)
  return 'prompted'
}
