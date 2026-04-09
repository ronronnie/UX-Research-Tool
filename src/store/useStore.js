import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { SEED_SESSIONS } from '../data/seedData.js'
import { nanoid } from '../utils/nanoid.js'

// ─── Empty Session Template (used by wizard) ─────────────────────────────────
export function createEmptySession() {
  return {
    id: `sess_${nanoid()}`,
    created_at: new Date().toISOString(),
    participant: {
      name: '',
      skill_level: 'beginner',
      session_date: new Date().toISOString().split('T')[0],
      moderator_name: '',
    },
    phase1: [],
    phase2: [],
    phase3: [],
    phase4: {
      delight_moments: [],
      frustration_moments: [],
      general_notes: '',
    },
    sus_scores: Array(10).fill(null),
    post_session: {
      nps_score: null,
      retention_score: null,
      most_confusing: '',
      enjoyed_most: '',
      change_before_launch: '',
      built_for: '',
      built_for_presets: [],
    },
    moderator_notes: '',
  }
}

// ─── Main Store ───────────────────────────────────────────────────────────────
export const useStore = create(
  persist(
    (set, get) => ({
      // ── Completed sessions ──────────────────────────────────────────────────
      sessions: [],

      // ── Wizard draft (current in-progress session) ──────────────────────────
      draft: null,

      // ── Seed on first load ──────────────────────────────────────────────────
      seeded: false,

      initSeed: () => {
        if (!get().seeded) {
          set({ sessions: SEED_SESSIONS, seeded: true })
        }
      },

      // ── Session CRUD ────────────────────────────────────────────────────────
      addSession: (session) =>
        set(state => ({
          sessions: [session, ...state.sessions],
          draft: null,
        })),

      updateSession: (id, updates) =>
        set(state => ({
          sessions: state.sessions.map(s =>
            s.id === id ? { ...s, ...updates } : s
          ),
        })),

      deleteSession: (id) =>
        set(state => ({
          sessions: state.sessions.filter(s => s.id !== id),
        })),

      getSession: (id) => get().sessions.find(s => s.id === id) ?? null,

      // ── Wizard draft management ─────────────────────────────────────────────
      startDraft: () => set({ draft: createEmptySession() }),

      updateDraft: (updates) =>
        set(state => ({
          draft: state.draft ? { ...state.draft, ...updates } : state.draft,
        })),

      updateDraftParticipant: (updates) =>
        set(state => ({
          draft: state.draft
            ? { ...state.draft, participant: { ...state.draft.participant, ...updates } }
            : state.draft,
        })),

      updateDraftPhase1: (responses) =>
        set(state => ({ draft: state.draft ? { ...state.draft, phase1: responses } : state.draft })),

      updateDraftPhase2: (responses) =>
        set(state => ({ draft: state.draft ? { ...state.draft, phase2: responses } : state.draft })),

      updateDraftPhase3: (tasks) =>
        set(state => ({ draft: state.draft ? { ...state.draft, phase3: tasks } : state.draft })),

      updateDraftPhase4: (phase4) =>
        set(state => ({
          draft: state.draft
            ? { ...state.draft, phase4: { ...state.draft.phase4, ...phase4 } }
            : state.draft,
        })),

      updateDraftSUS: (scores) =>
        set(state => ({ draft: state.draft ? { ...state.draft, sus_scores: scores } : state.draft })),

      updateDraftPostSession: (updates) =>
        set(state => ({
          draft: state.draft
            ? { ...state.draft, post_session: { ...state.draft.post_session, ...updates } }
            : state.draft,
        })),

      saveDraft: () => {
        const { draft, addSession } = get()
        if (draft) addSession(draft)
      },

      discardDraft: () => set({ draft: null }),
    }),
    {
      name: 'ux-research-sessions',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
