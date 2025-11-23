export const GAME_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
  '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
  '#F8B195', '#C06C84', '#6C5B7B', '#355C7D',
  '#E74C3C', '#3498DB', '#2ECC71', '#F39C12',
  '#9B59B6', '#1ABC9C', '#E67E22', '#95A5A6'
];

export const WHITE_COLOR = '#FFFFFF';

export interface ThemeColors {
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  primary: string;
  success: string;
  warning: string;
  danger: string;
}

export const THEME_COLORS: { light: ThemeColors; dark: ThemeColors } = {
  light: {
    background: '#f0f4f8',
    card: '#ffffff',
    text: '#1f2937',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    primary: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444'
  },
  dark: {
    background: '#1f2937',
    card: '#374151',
    text: '#f9fafb',
    textSecondary: '#d1d5db',
    border: '#4b5563',
    primary: '#60a5fa',
    success: '#34d399',
    warning: '#fbbf24',
    danger: '#f87171'
  }
};

export const COLOR_FREQUENCIES: { [key: string]: number } = {
  '#FF6B6B': 523.25, '#4ECDC4': 587.33, '#45B7D1': 659.25,
  '#FFA07A': 698.46, '#98D8C8': 783.99, '#F7DC6F': 880.00,
  '#BB8FCE': 987.77, '#85C1E2': 1046.50, '#F8B195': 554.37,
  '#C06C84': 622.25, '#6C5B7B': 739.99, '#355C7D': 830.61,
  '#E74C3C': 932.33, '#3498DB': 1108.73, '#2ECC71': 1174.66,
  '#F39C12': 1318.51, '#9B59B6': 1396.91, '#1ABC9C': 1567.98,
  '#E67E22': 1760.00, '#95A5A6': 1975.53, '#FFFFFF': 440.00
};
