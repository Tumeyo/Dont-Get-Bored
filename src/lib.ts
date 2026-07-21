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

export function buildPlanText(plan: DatePlan): string {
  return [
    `${CONFIG.names.her} + ${CONFIG.names.mine}: our date plan`,
    `When: ${formatDate(plan.preferredDate)} at ${plan.preferredTime}`,
    `Backup: ${formatDate(plan.alternativeDate)}`,
    `Main plan: ${CONFIG.planner.mainPlan}`,
    `Extra: ${activityTitle(plan.activity)}`,
    plan.message ? `Note: ${plan.message}` : '',
    plan.contact ? `Confirm via: ${plan.contact}` : '',
    '',
    'Looking forward to it. ♡',
  ]
    .filter(Boolean)
    .join('\n')
}

export function loadSavedPlan(): DatePlan | null {
  try {
    const saved = localStorage.getItem(CONFIG.storageKey)
    if (!saved) return null
    const value: unknown = JSON.parse(saved)
    if (!value || typeof value !== 'object') return null
    const candidate = value as Partial<DatePlan>
    const keys: (keyof DatePlan)[] = [
      'preferredDate',
      'preferredTime',
      'alternativeDate',
      'activity',
      'message',
      'contact',
    ]
    if (!keys.every((key) => typeof candidate[key] === 'string')) return null
    return candidate as DatePlan
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
