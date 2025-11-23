import { GAME_COLORS, WHITE_COLOR } from '../constants/colors';

export const getGridSize = (level: number): number => {
  return Math.min(6 + level, 20);
};

export const getColorCount = (level: number): number => {
  return Math.min(2 + Math.floor(level / 2), 8);
};

export const getCurrentLevel = (stage: number): number => {
  return Math.floor((stage - 1) / 5) + 1;
};

export const getStageInLevel = (stage: number): number => {
  return ((stage - 1) % 5) + 1;
};

export const generatePattern = (
  size: number,
  stage: number,
  level: number
): number[][] => {
  const pattern: number[][] = Array(size)
    .fill(null)
    .map(() => Array(size).fill(0));

  const colorCount = getColorCount(level);
  const shapeType = stage % 10;
  const centerX = Math.floor(size / 2);
  const centerY = Math.floor(size / 2);

  switch (shapeType) {
    case 1: // Yurak shakli
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const x = (j - centerX) / (size / 6);
          const y = (i - centerY) / (size / 6);
          const heart = Math.pow(x * x + y * y - 1, 3) - x * x * y * y * y;
          if (heart < 0 && i < size - 1) {
            pattern[i][j] = (Math.abs(i - j) % colorCount) + 1;
          }
        }
      }
      break;

    case 2: // Doira shakli
      const radius = size / 3;
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const dist = Math.sqrt(
            Math.pow(i - centerY, 2) + Math.pow(j - centerX, 2)
          );
          if (dist < radius) {
            pattern[i][j] = (Math.floor(dist) % colorCount) + 1;
          }
        }
      }
      break;

    case 3: // To'rtburchak shakli
      const margin = Math.floor(size / 4);
      for (let i = margin; i < size - margin; i++) {
        for (let j = margin; j < size - margin; j++) {
          pattern[i][j] = ((i + j) % colorCount) + 1;
        }
      }
      break;

    default: // Diagonal chiziqlar
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          if ((i + j) % 3 === 0) {
            pattern[i][j] = Math.floor((i + j) / 3) % colorCount + 1;
          }
        }
      }
  }

  return pattern;
};

export const createTargetGrid = (
  size: number,
  stage: number,
  level: number
): string[][] => {
  const pattern = generatePattern(size, stage, level);
  const colorCount = getColorCount(level);
  const availableColors = GAME_COLORS.slice(0, colorCount);

  return Array(size)
    .fill(null)
    .map((_, i) =>
      Array(size)
        .fill(null)
        .map((_, j) => {
          const patternValue = pattern[i][j];
          return patternValue === 0
            ? WHITE_COLOR
            : availableColors[patternValue - 1];
        })
    );
};

export const createEmptyGrid = (size: number): string[][] => {
  return Array(size)
    .fill(null)
    .map(() => Array(size).fill(WHITE_COLOR));
};

export const checkCompletion = (
  playerGrid: string[][],
  targetGrid: string[][]
): boolean => {
  return playerGrid.every((row, i) =>
    row.every((cell, j) => cell === targetGrid[i][j])
  );
};

export const calculateScore = (
  moves: number,
  stage: number,
  targetGrid: string[][]
): number => {
  const filledCells = targetGrid.flat().filter((c) => c !== WHITE_COLOR).length;
  const perfectMoves = filledCells;
  const efficiency = Math.max(0, 100 - Math.abs(moves - perfectMoves) * 2);
  const levelScore = Math.floor(efficiency + stage * 5);
  return levelScore;
};
