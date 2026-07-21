export interface DatePlan {
  preferredDate: string
  preferredTime: string
  alternativeDate: string
  activity: string
  message: string
  contact: string
}

export const EMPTY_PLAN: DatePlan = {
  preferredDate: '',
  preferredTime: '',
  alternativeDate: '',
  activity: '',
  message: '',
  contact: '',
}

