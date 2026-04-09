// ─── Question & Preset Definitions ───────────────────────────────────────────
// Single source of truth for all wizard phases.
// Each question has: id, text, type, presets (optional), hasTags (optional)

export const SKILL_LEVELS = ['beginner', 'intermediate', 'pro']

export const OBSERVATION_TAGS = ['confusion', 'delight', 'error', 'question']

// ── Phase 1: Pre-session Interview ───────────────────────────────────────────
export const PHASE1_QUESTIONS = [
  {
    id: 'p1q1',
    text: 'How often do you play poker, and where — home games, apps, casinos?',
    type: 'text_with_presets',
    hasTags: true,
    presets: ['Home games only', 'Mobile apps', 'Online platforms', 'Casinos', 'Rarely plays'],
  },
  {
    id: 'p1q2',
    text: 'What tools or apps have you used to learn or play poker before today?',
    type: 'text_with_presets',
    hasTags: true,
    presets: ['PokerStars', 'GGPoker', 'Zynga Poker', '888poker', 'No apps used', 'YouTube tutorials', 'GTO Wizard'],
  },
  {
    id: 'p1q3',
    text: 'What frustrates you most about existing poker apps?',
    type: 'text_with_presets',
    hasTags: true,
    presets: ['Too complex UI', 'No learning path', 'Too casual / not serious enough', 'No GTO training', 'Boring bots', 'Expensive', 'Lacks social features'],
  },
  {
    id: 'p1q4',
    text: 'What would make you actually keep coming back to a new poker app?',
    type: 'text_with_presets',
    hasTags: true,
    presets: ['Real improvement tracking', 'Play with friends easily', 'Good GTO trainer', 'Fun tournaments', 'Clear progress metrics', 'Community features'],
  },
  {
    id: 'p1q5',
    text: 'On a scale of 1–5, how would you rate your own poker skill level?',
    type: 'scale',
    hasTags: false,
    min: 1,
    max: 5,
  },
]

// ── Phase 2: First Impressions ────────────────────────────────────────────────
export const PHASE2_QUESTIONS = [
  {
    id: 'p2q1',
    text: 'What do you think this product does, just from the first screen?',
    type: 'text_with_presets',
    hasTags: true,
    presets: ['Poker learning app', 'Poker game', 'Training platform', 'Social poker', 'Confused / unclear'],
  },
  {
    id: 'p2q2',
    text: 'Where would you go first? Walk me through your thinking.',
    type: 'text',
    hasTags: true,
    presets: [],
  },
  {
    id: 'p2q3',
    text: 'Did anything feel unclear or unexpected as you got started?',
    type: 'text_with_presets',
    hasTags: true,
    presets: ['Navigation unclear', 'Too much on screen', 'Onboarding confusing', 'Looked great / clear', 'Terminology unfamiliar'],
  },
  {
    id: 'p2q4',
    text: "What did you expect to see that you didn't?",
    type: 'text',
    hasTags: true,
    presets: [],
  },
]

// ── Phase 3: Task Definitions ─────────────────────────────────────────────────
export const TASKS = [
  {
    id: 'A',
    label: 'Task A',
    title: 'Quick Play with Friends',
    description: 'Ask the participant to set up a quick game and invite a friend.',
    skillLevels: ['beginner', 'intermediate', 'pro'],
    postTaskQuestions: [
      {
        id: 'tAq1',
        text: 'How would you invite someone not nearby?',
        presets: ['Shared a link', 'Used invite code', "Couldn't find invite", 'Found it easily'],
      },
      {
        id: 'tAq2',
        text: 'Did you find game settings?',
        presets: ['Yes, easily', 'Found it eventually', "Couldn't find it", 'Didn\'t look'],
      },
      {
        id: 'tAq3',
        text: 'What slowed you down?',
        presets: ['Nothing', 'Finding the invite option', 'Too many steps', 'Confusing layout'],
      },
    ],
  },
  {
    id: 'B',
    label: 'Task B',
    title: 'Challenge Tournament',
    description: 'Ask the participant to find and join a challenge tournament.',
    skillLevels: ['intermediate', 'pro'],
    postTaskQuestions: [
      {
        id: 'tBq1',
        text: 'Did you understand what you were playing against?',
        presets: ['Yes, clear', 'Somewhat', 'No idea', 'Assumed AI opponents'],
      },
      {
        id: 'tBq2',
        text: 'Was the difficulty level right?',
        presets: ['Too easy', 'About right', 'Too hard', 'No difficulty options shown'],
      },
      {
        id: 'tBq3',
        text: 'What made you continue or stop?',
        presets: ['Fun and engaging', 'Got confused', 'Stakes felt unclear', 'Wanted to keep going'],
      },
    ],
  },
  {
    id: 'C',
    label: 'Task C',
    title: 'GTO Trainer',
    description: 'Ask the participant to find and start a GTO training session.',
    skillLevels: ['beginner', 'intermediate', 'pro'],
    postTaskQuestions: [
      {
        id: 'tCq1',
        text: 'Did you know what GTO meant?',
        presets: ['Yes, familiar with GTO', 'Heard of it but unsure', 'No idea what GTO means'],
      },
      {
        id: 'tCq2',
        text: 'What did you expect vs what happened?',
        presets: ['Met expectations', 'More complex than expected', 'Simpler than expected', 'Totally different from expected'],
      },
      {
        id: 'tCq3',
        text: 'Did you feel you learned something?',
        presets: ['Yes, definitely', 'A little', 'Not really', "Couldn't get far enough"],
      },
    ],
  },
]

// ── Phase 5: SUS Questions ────────────────────────────────────────────────────
export const SUS_QUESTIONS = [
  { id: 'sus1', text: 'I think I would like to use this system frequently.', polarity: 'positive' },
  { id: 'sus2', text: 'I found the system unnecessarily complex.', polarity: 'negative' },
  { id: 'sus3', text: 'I thought the system was easy to use.', polarity: 'positive' },
  { id: 'sus4', text: 'I think I would need support from a technical person.', polarity: 'negative' },
  { id: 'sus5', text: 'I found the functions well integrated.', polarity: 'positive' },
  { id: 'sus6', text: 'I thought there was too much inconsistency.', polarity: 'negative' },
  { id: 'sus7', text: 'Most people would learn this quickly.', polarity: 'positive' },
  { id: 'sus8', text: 'I found the system very cumbersome.', polarity: 'negative' },
  { id: 'sus9', text: 'I felt very confident using the system.', polarity: 'positive' },
  { id: 'sus10', text: 'I needed to learn a lot before I could get going.', polarity: 'negative' },
]

// ── Phase 6 (Step 7): Post-session Debrief ────────────────────────────────────
export const DEBRIEF_QUESTIONS = [
  {
    id: 'dbq1',
    text: 'What was the most confusing moment?',
    presets: [],
  },
  {
    id: 'dbq2',
    text: 'What did you enjoy most?',
    presets: [],
  },
  {
    id: 'dbq3',
    text: 'If you could change one thing before launch?',
    presets: [],
  },
  {
    id: 'dbq4',
    text: 'Who do you think this product is built for?',
    presets: ['Beginners learning poker', 'Casual players', 'Serious / competitive players', 'Everyone'],
  },
]
