export interface DatePlan {
  preferredDate: string
  preferredTime: string
  alternativeDate: string
  activities: string[]
  message: string
  contact: string
}

export const EMPTY_PLAN: DatePlan = {
  preferredDate: '',
  preferredTime: '',
  alternativeDate: '',
  activities: ['none'],
  message: '',
  contact: '',
}
