// ─────────────────────────────────────────────────────────────────────────────
// CUSTOMIZE HERE — names, text, options, timing, and behavior live in one place.
// ─────────────────────────────────────────────────────────────────────────────
export const CONFIG = {
  names: {
    her: 'Nomin-Erdene',
    mine: 'Tumendelger',
  },
  hero: {
    eyebrow: 'A SMALL, HONEST QUESTION',
    questionLead: 'Hey',
    questionMiddle: 'would you like to go on a date with me',
    caption: 'Let’s go out and not get bored.',
    privacy: 'Private by design',
  },
  tickerPhrases: [
    'one honest question',
    'good coffee is a valid plan',
    'a little courage goes a long way',
    'quietly optimistic',
  ],
  reactions: {
    default: '♡',
    yesHover: '♥',
    noHover: '…',
    accepted: '♥',
    declined: '♡',
  },
  decision: {
    label: 'YOUR ANSWER',
    title: 'What do you think?',
    subtitle: 'A simple yes would make my week.',
  },
  yes: {
    button: 'Yes, I’d like that',
    bannerLabel: 'A NICE UPDATE',
    breakingNews: 'Looks like we have a date.',
  },
  no: {
    button: 'Not this time',
    helper: 'The “no” button is feeling a little shy.',
    finalHelper: 'Okay — the next click is a real no. Promise.',
    dodgeLabels: [
      'Wait, that moved',
      'Still no?',
      'It is fading now',
      'Okay — a real no',
    ],
    dodgeReactions: [
      'A tiny escape attempt.',
      'Still considering its options…',
      'Losing confidence gracefully.',
      'Prank over. Your choice is yours.',
    ],
    maxDodges: 4,
    message: 'Totally understood. Thanks for being honest — no awkwardness, promise.',
  },
  loading: [
    'Checking calendars…',
    'Gathering a little courage…',
    'Looks good from here.',
  ],
  planner: {
    eyebrow: 'LET’S MAKE A PLAN',
    heading: 'Lovely. When would work for you?',
    intro: 'Choose whatever feels easy. Your answers stay on this device.',
    fields: {
      preferredDate: 'Preferred date',
      preferredTime: 'Preferred time',
      alternativeDate: 'Backup date',
      message: 'Anything you’d like to add?',
      contact: 'Best way to confirm (optional)',
    },
    activities: [
      { id: 'coffee', emoji: '☕', title: 'Coffee or bubble tea', detail: 'Simple, relaxed, easy to talk' },
      { id: 'dinner', emoji: '🍝', title: 'Dinner', detail: 'A proper evening out' },
      { id: 'movie', emoji: '🍿', title: 'Movie', detail: 'With good snacks, naturally' },
      { id: 'walk', emoji: '🌿', title: 'Walk and snacks', detail: 'Fresh air and no rush' },
      { id: 'arcade', emoji: '🕹️', title: 'Arcade or games', detail: 'A little friendly competition' },
      { id: 'surprise', emoji: '✨', title: 'Surprise me', detail: 'Choose something fun' },
    ],
    submit: 'Save the plan',
  },
  confirmation: {
    eyebrow: 'IT’S A DATE',
    heading: 'We have a plan.',
    subheading: 'I’m looking forward to it.',
  },
  badge: 'Made with a little courage',
  easterEgg: {
    clicks: 5,
    message: 'You found the tiny secret. ✦',
  },
  footer: 'Made by Tumendelger, with a little courage.',
  storageKey: 'nomin-tumendelger-date-plan-v1',
  loadingStepMs: 900,
} as const
