import { create } from 'zustand';
import type { Tone, PosterSize, Seat, SeatRole, FormData, Draft, DepartureRecord, ShareType } from '../types';
import { generateSeats, updateSeatCustomTag } from '../utils/seatGenerator';

const DRAFT_STORAGE_KEY = 'poster_drafts_v1';
const DEPARTURE_STORAGE_KEY = 'poster_departures_v1';

const DEFAULT_CONTACT = {
  enabled: false,
  wechat: '',
  password: '',
  needConfirm: false,
};

const DEFAULT_FORM: FormData = {
  scriptName: '搞钱！',
  totalPlayers: 7,
  filledPlayers: 4,
  dateTime: '本周六 14:00',
  location: 'XX桌游吧·朝阳店',
  fee: '128元/人',
  allowCross: true,
  allowNewbie: true,
  memberFeatures: ['推土机', '气氛组', '水龙头', '搞笑男'],
  contact: DEFAULT_CONTACT,
};

const loadDrafts = (): Draft[] => {
  try {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Draft[];
  } catch {
    return [];
  }
};

const saveDrafts = (drafts: Draft[]) => {
  try {
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(drafts));
  } catch {
    /* ignore */
  }
};

const loadDepartures = (): DepartureRecord[] => {
  try {
    const raw = localStorage.getItem(DEPARTURE_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as DepartureRecord[];
  } catch {
    return [];
  }
};

const saveDepartures = (recs: DepartureRecord[]) => {
  try {
    localStorage.setItem(DEPARTURE_STORAGE_KEY, JSON.stringify(recs));
  } catch {
    /* ignore */
  }
};

interface PosterState {
  tone: Tone;
  form: FormData;
  seats: Seat[];
  size: PosterSize;
  drafts: Draft[];
  departures: DepartureRecord[];

  setTone: (tone: Tone) => void;
  updateForm: (patch: Partial<FormData>) => void;
  regenerateSeats: () => void;
  setSeatRole: (seatId: number, role: SeatRole) => void;
  setSeatCustomTag: (seatId: number, tag: string) => void;
  setSize: (size: PosterSize) => void;

  saveDraft: (name?: string) => Draft;
  updateDraft: (id: string) => void;
  deleteDraft: (id: string) => void;
  loadDraft: (id: string) => void;
  duplicateDraft: (id: string) => void;

  addDeparture: (shareType: ShareType) => DepartureRecord;
  deleteDeparture: (id: string) => void;
  loadDeparture: (id: string) => void;
  departureToDraft: (id: string, name?: string) => void;
}

export const usePosterStore = create<PosterState>((set, get) => ({
  tone: '沙雕招募',
  form: { ...DEFAULT_FORM, contact: { ...DEFAULT_CONTACT } },
  seats: generateSeats(DEFAULT_FORM),
  size: '朋友圈长图',
  drafts: loadDrafts(),
  departures: loadDepartures(),

  setTone: (tone) => set({ tone }),

  updateForm: (patch) =>
    set((state) => {
      const newForm = { ...state.form, ...patch } as FormData;
      const memberOnly =
        Object.keys(patch).length === 1 && 'memberFeatures' in patch;
      const needsSeatSync =
        patch.totalPlayers !== undefined || patch.filledPlayers !== undefined;
      if (needsSeatSync) {
        return {
          form: newForm,
          seats: generateSeats(newForm, state.seats),
        };
      }
      if (memberOnly) {
        const newSeats = state.seats.map((s, i) =>
          s.status === 'filled'
            ? { ...s, memberTag: newForm.memberFeatures[i % newForm.memberFeatures.length] || s.memberTag }
            : s
        );
        return { form: newForm, seats: newSeats };
      }
      return { form: newForm };
    }),

  regenerateSeats: () => set((state) => ({ seats: generateSeats(state.form) })),

  setSeatRole: (seatId, role) =>
    set((state) => ({
      seats: state.seats.map((s) => (s.id === seatId ? { ...s, role, customTag: undefined } : s)),
    })),

  setSeatCustomTag: (seatId, tag) =>
    set((state) => ({ seats: updateSeatCustomTag(state.seats, seatId, tag) })),

  setSize: (size) => set({ size }),

  saveDraft: (name) => {
    const state = get();
    const draft: Draft = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: name || state.form.scriptName || `草稿 ${new Date().toLocaleString('zh-CN')}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      tone: state.tone,
      form: JSON.parse(JSON.stringify(state.form)),
      seats: JSON.parse(JSON.stringify(state.seats)),
      size: state.size,
    };
    const next = [draft, ...state.drafts];
    saveDrafts(next);
    set({ drafts: next });
    return draft;
  },

  updateDraft: (id) => {
    const state = get();
    const next = state.drafts.map((d) =>
      d.id === id
        ? {
            ...d,
            tone: state.tone,
            form: JSON.parse(JSON.stringify(state.form)),
            seats: JSON.parse(JSON.stringify(state.seats)),
            size: state.size,
            updatedAt: Date.now(),
          }
        : d
    );
    saveDrafts(next);
    set({ drafts: next });
  },

  deleteDraft: (id) => {
    const next = get().drafts.filter((d) => d.id !== id);
    saveDrafts(next);
    set({ drafts: next });
  },

  loadDraft: (id) => {
    const draft = get().drafts.find((d) => d.id === id);
    if (!draft) return;
    set({
      tone: draft.tone,
      form: JSON.parse(JSON.stringify(draft.form)),
      seats: JSON.parse(JSON.stringify(draft.seats)),
      size: draft.size,
    });
  },

  duplicateDraft: (id) => {
    const state = get();
    const src = state.drafts.find((d) => d.id === id);
    if (!src) return;
    const copy: Draft = {
      ...src,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: `${src.name} (副本)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      form: JSON.parse(JSON.stringify(src.form)),
      seats: JSON.parse(JSON.stringify(src.seats)),
    };
    const next = [copy, ...state.drafts];
    saveDrafts(next);
    set({ drafts: next });
  },

  addDeparture: (shareType) => {
    const state = get();
    const rec: DepartureRecord = {
      id: `dep-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      sharedAt: Date.now(),
      tone: state.tone,
      form: JSON.parse(JSON.stringify(state.form)),
      seats: JSON.parse(JSON.stringify(state.seats)),
      size: state.size,
      shareType,
      contactShown: !!state.form.contact.enabled,
    };
    const next = [rec, ...state.departures];
    saveDepartures(next);
    set({ departures: next });
    return rec;
  },

  deleteDeparture: (id) => {
    const next = get().departures.filter((d) => d.id !== id);
    saveDepartures(next);
    set({ departures: next });
  },

  loadDeparture: (id) => {
    const rec = get().departures.find((d) => d.id === id);
    if (!rec) return;
    set({
      tone: rec.tone,
      form: JSON.parse(JSON.stringify(rec.form)),
      seats: JSON.parse(JSON.stringify(rec.seats)),
      size: rec.size,
    });
  },

  departureToDraft: (id, name) => {
    const state = get();
    const rec = state.departures.find((d) => d.id === id);
    if (!rec) return;
    const draft: Draft = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: name || `${rec.form.scriptName || '发车记录'} · 再开一车`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      tone: rec.tone,
      form: JSON.parse(JSON.stringify(rec.form)),
      seats: JSON.parse(JSON.stringify(rec.seats)),
      size: rec.size,
    };
    const next = [draft, ...state.drafts];
    saveDrafts(next);
    set({ drafts: next });
  },
}));
