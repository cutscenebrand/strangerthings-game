export type Language = 'en' | 'ar';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert' | 'Nightmare' | 'Impossible';
  rewardPercentage: number;
}

export type GameState = 'splash' | 'landing' | 'registration' | 'intro' | 'loading' | 'playing' | 'result' | 'leaderboard';

export interface UserProgress {
  currentLevel: number;
  totalDiscount: number;
  isLocked: boolean;
  history: boolean[]; // track correct/incorrect per level
}

export interface UserData {
  name: string;
  phone: string;
}

export interface QuizConfig {
  levels: {
    difficulty: Question['difficulty'];
    reward: number;
  }[];
}

export interface LeaderboardEntry {
  name: string;
  discount: number;
}