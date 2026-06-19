import type { Seat, SeatRole, FormData } from '../types';

export const generateSeats = (form: FormData, previousSeats?: Seat[]): Seat[] => {
  const { totalPlayers, filledPlayers, memberFeatures } = form;
  const seats: Seat[] = [];
  for (let i = 0; i < totalPlayers; i++) {
    if (i < filledPlayers) {
      const prev = previousSeats?.[i];
      seats.push({
        id: i,
        status: 'filled',
        memberTag:
          prev?.status === 'filled'
            ? prev.memberTag
            : memberFeatures[i % memberFeatures.length] || '靠谱玩家',
      });
    } else {
      const prev = previousSeats?.[i];
      seats.push({
        id: i,
        status: 'empty',
        role: prev?.status === 'empty' ? prev.role : '随缘位',
        customTag: prev?.status === 'empty' ? prev.customTag : undefined,
      });
    }
  }
  return seats;
};

export const updateSeatRole = (seats: Seat[], seatId: number, role: SeatRole): Seat[] =>
  seats.map((s) => (s.id === seatId ? { ...s, role, customTag: undefined } : s));

export const updateSeatCustomTag = (seats: Seat[], seatId: number, tag: string): Seat[] =>
  seats.map((s) => (s.id === seatId ? { ...s, customTag: tag } : s));

export const pickRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const getMissingCount = (total: number, filled: number): number => Math.max(0, total - filled);

export const SEAT_TYPE_OPTIONS: SeatRole[] = ['控场位', '搞笑位', '脑洞位', '随缘位'];
