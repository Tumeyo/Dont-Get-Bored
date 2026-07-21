// ─────────────────────────────────────────────────────────────────────────────
// CUSTOMIZE HERE — names, text, options, timing, and behavior live in one place.
// ─────────────────────────────────────────────────────────────────────────────
export const CONFIG = {
  names: {
    her: 'Nomin-Erdene',
    mine: 'Tumendelger',
  },
  hero: {
    eyebrow: 'A VERY SERIOUS DIGITAL INQUIRY',
    questionLead: 'Hey',
    questionMiddle: 'would you go on a date with',
    caption: 'This website took way too long to make, so choose wisely.',
    privacy: 'Zero uploads. Just vibes.',
  },
  tickerPhrases: [
    'POV: You received a professionally engineered date request',
    'Bro made a whole website 💀',
    'Critical decision detected',
    'The lore starts here',
  ],
  reactions: {
    default: '👀',
    yesHover: '🥹',
    noHover: '😰',
    accepted: '😍',
    declined: '🫶',
  },
  yes: {
    button: 'YES, obviously 😌',
    breakingNews: 'BREAKING NEWS: A date has officially been approved.',
  },
  no: {
    button: 'No 🙄',
    dodgeLabels: [
      'Wait, think about it 😭',
      'Are you completely sure?',
      'That button seems broken…',
    ],
    dodgeReactions: [
      'Unexpected choice detected',
      'Recalculating romantic strategy…',
      'This was not in the script',
    ],
    finalButton: 'No worries — maybe another time',
    message: 'All good! Thanks for being honest — no pressure at all 😊',
  },
  loading: [
    'Checking compatibility…',
    'Consulting the group chat…',
    'Result: extremely promising',
  ],
  planner: {
    eyebrow: 'THE LOGISTICS ERA',
    heading: 'Okay, superstar. When are you free? ✨',
    intro: 'Pick what sounds good. Nothing leaves this device.',
    fields: {
      preferredDate: 'Preferred date',
      preferredTime: 'Preferred time',
      alternativeDate: 'Backup date',
      message: 'Any tiny request or suggestion?',
      contact: 'Best way to confirm (optional)',
    },
    activities: [
      { id: 'coffee', emoji: '🧋', title: 'Coffee or bubble tea', detail: 'Low stakes, elite beverages' },
      { id: 'dinner', emoji: '🍝', title: 'Dinner', detail: 'A certified classic' },
      { id: 'movie', emoji: '🍿', title: 'Movie', detail: 'Snacks are non-negotiable' },
      { id: 'walk', emoji: '🌿', title: 'Walk and snacks', detail: 'Main-character energy' },
      { id: 'arcade', emoji: '🕹️', title: 'Arcade or games', detail: 'Friendly rivalry allowed' },
      { id: 'surprise', emoji: '🎲', title: 'Surprise me', detail: 'Maximum plot development' },
    ],
    submit: 'Lock in the lore 🔒',
  },
  confirmation: {
    eyebrow: 'IT IS OFFICIAL-ISH',
    heading: 'Date request successfully upgraded to Date Plan™.',
    subheading: 'Screenshot it. Frame it. Alert the group chat.',
  },
  badge: 'Certified Good Date Idea',
  easterEgg: {
    clicks: 5,
    message: 'Achievement unlocked: Professional Website Investigator 🕵️',
  },
  footer: 'Built with courage, JavaScript, and questionable emotional decision-making.',
  storageKey: 'nomin-tumendelger-date-plan-v1',
  maxNoDodges: 3,
  loadingStepMs: 900,
} as const

