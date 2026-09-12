export type TabType = 'manual' | 'auto';
export type BetDirection = 'low' | 'high';
export type ThemeMode = 'classic' | 'meme';

export interface RollHistoryItem {
  id: string;
  rollNumber: number; // e.g. 4215 -> 42.15
  rollDigits: [number, number, number, number];
  won: boolean;
  amount: number;
  payout: number;
  profit: number;
  direction: BetDirection;
  target: number;
  timestamp: number;
}

export interface GameState {
  balance: number;
  currency: string;
  amount: number;
  betDirection: BetDirection;
  payout: number;
  rollTarget: number; // roll under target (e.g. 50.00) or roll over target (e.g. 49.99)
  winChance: number;
  winAmount: number;
  reels: [number, number, number, number];
  isRolling: boolean;
  lastRollResult: RollHistoryItem | null;
  history: RollHistoryItem[];
  soundEnabled: boolean;
  fastMode: boolean;
  themeMode: ThemeMode;
  activeTab: TabType;
  // Auto bet settings matching screenshot
  autoBetting: boolean;
  autoNumberOfBets: string;
  autoOnWinPercent: string;
  autoOnLossPercent: string;
  autoStopOnProfit: string;
  autoStopOnLoss: string;
  autoBaseAmount: number;
  autoBetsCompleted: number;
  autoSessionProfit: number;
  autoStopReason: string | null;
}
