// utils/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  GAME_STATE: '@pixel_master_game_state',
  HIGH_SCORE: '@pixel_master_high_score',
  SETTINGS: '@pixel_master_settings',
};

export interface GameState {
  currentStage: number;
  totalStages: number;
  score: number;
  moves: number;
  grid: string[][];
  targetGrid: string[][];
}

export interface Settings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  darkMode: boolean;
  soundVolume: number;
  musicVolume: number;
}

export const saveGameState = async (gameState: GameState): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.GAME_STATE,
      JSON.stringify(gameState)
    );
  } catch (error) {
    console.error('Saqlashda xato:', error);
  }
};

export const loadGameState = async (): Promise<GameState | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.GAME_STATE);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Yuklashda xato:', error);
    return null;
  }
};

export const saveSettings = async (settings: Settings): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.SETTINGS,
      JSON.stringify(settings)
    );
  } catch (error) {
    console.error('Sozlamalarni saqlashda xato:', error);
  }
};

export const loadSettings = async (): Promise<Settings> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data
      ? JSON.parse(data)
      : {
          soundEnabled: true,
          musicEnabled: true,
          darkMode: false,
          soundVolume: 50,
          musicVolume: 20,
        };
  } catch (error) {
    console.error('Sozlamalarni yuklashda xato:', error);
    return {
      soundEnabled: true,
      musicEnabled: true,
      darkMode: false,
      soundVolume: 50,
      musicVolume: 20,
    };
  }
};

export const saveHighScore = async (score: number): Promise<void> => {
  try {
    const currentHighScore = await loadHighScore();
    if (score > currentHighScore) {
      await AsyncStorage.setItem(STORAGE_KEYS.HIGH_SCORE, score.toString());
    }
  } catch (error) {
    console.error('Rekordni saqlashda xato:', error);
  }
};

export const loadHighScore = async (): Promise<number> => {
  try {
    const score = await AsyncStorage.getItem(STORAGE_KEYS.HIGH_SCORE);
    return score ? parseInt(score, 10) : 0;
  } catch (error) {
    console.error('Rekordni yuklashda xato:', error);
    return 0;
  }
};

export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.GAME_STATE,
      STORAGE_KEYS.HIGH_SCORE,
      STORAGE_KEYS.SETTINGS,
    ]);
  } catch (error) {
    console.error('Ma\'lumotlarni o\'chirishda xato:', error);
  }
};
