import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { supabase } from '../lib/supabase.js'
import { SEED_SESSIONS } from '../data/seedData.js'
import { nanoid } from '../utils/nanoid.js'

// ─── Empty Session Template ───────────────────────────────────────────────────
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

// ─── Store ────────────────────────────────────────────────────────────────────
export const useStore = create(
  persist(
    (set, get) => ({
      // ── Sessions (loaded from Supabase) ─────────────────────────────────────
      sessions: [],
      loading: false,

      // ── Load all sessions from Supabase ─────────────────────────────────────
      loadSessions: async () => {
        set({ loading: true })
        const { data, error } = await supabase
          .from('sessions')
          .select('data')
          .order('created_at', { ascending: false })
        if (!error && data) {
          set({ sessions: data.map(r => r.data), loading: false })
        } else {
          console.error('loadSessions error:', error)
          set({ loading: false })
        }
      },

      // ── Seed DB on first load (only if empty) ────────────────────────────────
      initSeed: async () => {
        const { count } = await supabase
          .from('sessions')
          .select('id', { count: 'exact', head: true })
        if (count === 0) {
          const rows = SEED_SESSIONS.map(s => ({
            id: s.id,
            created_at: s.created_at,
            data: s,
          }))
          await supabase.from('sessions').insert(rows)
          set({ sessions: SEED_SESSIONS })
        }
      },

      // ── CRUD ─────────────────────────────────────────────────────────────────
      addSession: async (session) => {
        const { error } = await supabase
          .from('sessions')
          .insert({ id: session.id, created_at: session.created_at, data: session })
        if (!error) {
          set(state => ({ sessions: [session, ...state.sessions], draft: null }))
        } else {
          console.error('addSession error:', error)
        }
      },

      updateSession: async (id, updates) => {
        const existing = get().sessions.find(s => s.id === id)
        if (!existing) return
        const updated = { ...existing, ...updates }
        const { error } = await supabase
          .from('sessions')
          .update({ data: updated })
          .eq('id', id)
        if (!error) {
          set(state => ({
            sessions: state.sessions.map(s => s.id === id ? updated : s),
          }))
        }
      },

      deleteSession: async (id) => {
        const { error } = await supabase.from('sessions').delete().eq('id', id)
        if (!error) {
          set(state => ({ sessions: state.sessions.filter(s => s.id !== id) }))
        }
      },

      getSession: (id) => get().sessions.find(s => s.id === id) ?? null,

      // ── Wizard draft (localStorage only — per device) ────────────────────────
      draft: null,

      startDraft: () => set({ draft: createEmptySession() }),

      updateDraft: (updates) =>
        set(state => ({ draft: state.draft ? { ...state.draft, ...updates } : state.draft })),

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
      name: 'ux-research-draft',
      storage: createJSONStorage(() => localStorage),
      // Only persist the wizard draft — sessions come from Supabase
      partialize: (state) => ({ draft: state.draft }),
    }
  )
)
