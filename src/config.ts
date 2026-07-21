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
    heading: 'Here’s the plan. When are you free?',
    intro: 'Dinner at Terrazza, then a walk. Pick a date and add an extra if you want.',
    mainPlan: 'Dinner at Terrazza Restaurant, then a walk',
    recommendation: {
      label: 'TUMENDELGER’S RECOMMENDATION',
      dinnerTitle: 'Dinner at Terrazza Restaurant',
      dinnerDetail: 'Mediterranean food and a rooftop view',
      walkTitle: 'A walk after dinner',
      walkDetail: 'Fresh air, no rush, and more time to talk',
      venue: {
        name: 'Terrazza Restaurant',
        address: 'Zaisan Square Center, 8th floor, Ulaanbaatar',
        phone: '+976 7710 2992',
        image: '/terrazza-preview.jpg',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Terrazza+Restaurant%2C+%D0%97%D0%B0%D0%B9%D1%81%D0%B0%D0%BD%D0%B3%D0%B8%D0%B9%D0%BD+%D0%B3%D1%83%D0%B4%D0%B0%D0%BC%D0%B6%2C+Zaisan+Square+Center%2C+8th+floor%2C+Ulaanbaatar%2C+Mongolia&query_place_id=ChIJBTvqpm6Tll0RxgRKdfGaY74',
      },
    },
    fields: {
      preferredDate: 'Preferred date',
      preferredTime: 'Preferred time',
      alternativeDate: 'Backup date',
      message: 'Anything you’d like to add?',
      contact: 'Best way to confirm (optional)',
    },
    activities: [
      { id: 'none', emoji: '♡', title: 'Dinner + walk is perfect', detail: 'No extra needed' },
      { id: 'dessert', emoji: '🍰', title: 'Dessert stop', detail: 'Something sweet after the walk' },
      { id: 'coffee', emoji: '☕', title: 'Coffee or bubble tea', detail: 'A relaxed second stop' },
      { id: 'movie', emoji: '🍿', title: 'Movie', detail: 'With good snacks, naturally' },
      { id: 'arcade', emoji: '🕹️', title: 'Arcade or games', detail: 'A little friendly competition' },
      { id: 'surprise', emoji: '✨', title: 'Surprise me', detail: 'Choose one small extra' },
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
  storageKey: 'nomin-tumendelger-date-plan-v2',
  loadingStepMs: 900,
} as const
