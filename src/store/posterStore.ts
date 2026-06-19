import { create } from 'zustand';
import type { Tone, PosterSize, Seat, SeatRole, FormData } from '../types';
import { generateSeats } from '../utils/seatGenerator';

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
};

interface PosterState {
  tone: Tone;
  form: FormData;
  seats: Seat[];
  size: PosterSize;

  setTone: (tone: Tone) => void;
  updateForm: (patch: Partial<FormData>) => void;
  regenerateSeats: () => void;
  setSeatRole: (seatId: number, role: SeatRole) => void;
  setSize: (size: PosterSize) => void;
}

export const usePosterStore = create<PosterState>((set, get) => ({
  tone: '沙雕招募',
  form: { ...DEFAULT_FORM },
  seats: generateSeats(DEFAULT_FORM),
  size: '朋友圈长图',

  setTone: (tone) => set({ tone }),

  updateForm: (patch) =>
    set((state) => {
      const newForm = { ...state.form, ...patch };
      const needsSeatRegen =
        patch.totalPlayers !== undefined ||
        patch.filledPlayers !== undefined ||
        patch.memberFeatures !== undefined;
      return {
        form: newForm,
        seats: needsSeatRegen ? generateSeats(newForm) : state.seats,
      };
    }),

  regenerateSeats: () => set((state) => ({ seats: generateSeats(state.form) })),

  setSeatRole: (seatId, role) =>
    set((state) => ({
      seats: state.seats.map((s) => (s.id === seatId ? { ...s, role } : s)),
    })),

  setSize: (size) => {
    void get;
    set({ size });
  },
}));
