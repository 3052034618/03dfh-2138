import type { Seat, SeatRole, FormData } from '../types';

export const generateSeats = (form: FormData): Seat[] => {
  const { totalPlayers, filledPlayers, memberFeatures } = form;
  const seats: Seat[] = [];
  for (let i = 0; i < totalPlayers; i++) {
    if (i < filledPlayers) {
      seats.push({
        id: i,
        status: 'filled',
        memberTag: memberFeatures[i % memberFeatures.length] || '靠谱玩家',
      });
    } else {
      seats.push({
        id: i,
        status: 'empty',
        role: '随缘位',
      });
    }
  }
  return seats;
};

export const updateSeatRole = (seats: Seat[], seatId: number, role: SeatRole): Seat[] =>
  seats.map((s) => (s.id === seatId ? { ...s, role } : s));

export const pickRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const getMissingCount = (total: number, filled: number): number => Math.max(0, total - filled);

export const SEAT_TYPE_OPTIONS: SeatRole[] = ['控场位', '搞笑位', '脑洞位', '随缘位'];
