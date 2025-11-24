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

// Har bir stage uchun unique seed yaratish
const getStagesSeed = (stage: number): number => {
  return stage * 12345 + stage * stage * 67890;
};

// Pseudorandom number generator (har stage uchun unique)
const seededRandom = (seed: number, min: number = 0, max: number = 1): number => {
  const x = Math.sin(seed) * 10000;
  const random = x - Math.floor(x);
  return min + random * (max - min);
};

// 30+ turli xil pattern generatori
export const generatePattern = (
  size: number,
  stage: number,
  level: number
): number[][] => {
  const pattern: number[][] = Array(size)
    .fill(null)
    .map(() => Array(size).fill(0));

  const colorCount = getColorCount(level);
  const seed = getStagesSeed(stage);
  const centerX = Math.floor(size / 2);
  const centerY = Math.floor(size / 2);

  // 30 xil pattern turi
  const patternType = stage % 30;

  switch (patternType) {
    case 0: // Spiral pattern
      let x = centerX, y = centerY;
      let dx = 0, dy = -1;
      let steps = 1;
      let stepCount = 0;
      let colorIndex = 1;

      for (let i = 0; i < size * size; i++) {
        if (x >= 0 && x < size && y >= 0 && y < size) {
          pattern[y][x] = colorIndex;
          colorIndex = (colorIndex % colorCount) + 1;
        }

        if (stepCount === steps) {
          stepCount = 0;
          const temp = dx;
          dx = -dy;
          dy = temp;
          if (dy === 0) steps++;
        }

        x += dx;
        y += dy;
        stepCount++;
      }
      break;

    case 1: // Yurak shakli (yaxshilangan)
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const x = (j - centerX) / (size / 6);
          const y = (i - centerY) / (size / 6);
          const heart = Math.pow(x * x + y * y - 1, 3) - x * x * y * y * y;
          if (heart < 0) {
            const dist = Math.sqrt(Math.pow(i - centerY, 2) + Math.pow(j - centerX, 2));
            pattern[i][j] = (Math.floor(dist * 3) % colorCount) + 1;
          }
        }
      }
      break;

    case 2: // Konsentrik doiralar
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const dist = Math.sqrt(
            Math.pow(i - centerY, 2) + Math.pow(j - centerX, 2)
          );
          const ring = Math.floor(dist / (size / (colorCount * 2)));
          if (ring < colorCount) {
            pattern[i][j] = ring + 1;
          }
        }
      }
      break;

    case 3: // Shaxmat taxtasi
      const blockSize = Math.max(1, Math.floor(size / 6));
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const blockI = Math.floor(i / blockSize);
          const blockJ = Math.floor(j / blockSize);
          if ((blockI + blockJ) % 2 === 0) {
            pattern[i][j] = ((blockI + blockJ) % colorCount) + 1;
          }
        }
      }
      break;

    case 4: // Yulduz shakli
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const dx = j - centerX;
          const dy = i - centerY;
          const angle = Math.atan2(dy, dx);
          const radius = Math.sqrt(dx * dx + dy * dy);
          const starRadius = (size / 3) * (1 + 0.5 * Math.sin(5 * angle));
          if (radius < starRadius) {
            pattern[i][j] = (Math.floor(angle * 10) % colorCount) + 1;
          }
        }
      }
      break;

    case 5: // Radial gradient
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const dist = Math.sqrt(
            Math.pow(i - centerY, 2) + Math.pow(j - centerX, 2)
          );
          const normalized = dist / (size / 2);
          pattern[i][j] = Math.min(Math.floor(normalized * colorCount) + 1, colorCount);
        }
      }
      break;

    case 6: // Zigzag pattern
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const wave = Math.floor(Math.abs(Math.sin(j / 3) * 5));
          if (i % 4 === wave % 4) {
            pattern[i][j] = (j % colorCount) + 1;
          }
        }
      }
      break;

    case 7: // Mandala pattern
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const dx = j - centerX;
          const dy = i - centerY;
          const angle = Math.atan2(dy, dx);
          const dist = Math.sqrt(dx * dx + dy * dy);
          const mandala = Math.floor(Math.abs(Math.sin(angle * 8) * dist));
          if (mandala % 3 === 0 && dist < size / 2) {
            pattern[i][j] = (mandala % colorCount) + 1;
          }
        }
      }
      break;

    case 8: // Diamond pattern
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const diamondDist = Math.abs(i - centerY) + Math.abs(j - centerX);
          if (diamondDist < size / 2) {
            pattern[i][j] = (diamondDist % colorCount) + 1;
          }
        }
      }
      break;

    case 9: // Crosshatch pattern
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          if ((i + j) % 4 === 0 || (i - j) % 4 === 0) {
            pattern[i][j] = ((i * j) % colorCount) + 1;
          }
        }
      }
      break;

    case 10: // Flower pattern
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const dx = j - centerX;
          const dy = i - centerY;
          const angle = Math.atan2(dy, dx);
          const radius = Math.sqrt(dx * dx + dy * dy);
          const petalRadius = (size / 4) * (1 + Math.sin(6 * angle) * 0.5);
          if (radius < petalRadius) {
            pattern[i][j] = (Math.floor(radius * 2) % colorCount) + 1;
          }
        }
      }
      break;

    case 11: // Hexagonal pattern
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const hexSize = Math.max(2, Math.floor(size / 8));
          const hexI = Math.floor(i / hexSize);
          const hexJ = Math.floor(j / hexSize);
          const offset = hexI % 2 === 0 ? 0 : hexSize / 2;
          if ((j - offset) % hexSize < hexSize - 1) {
            pattern[i][j] = ((hexI + hexJ) % colorCount) + 1;
          }
        }
      }
      break;

    case 12: // Wave interference pattern
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const wave1 = Math.sin(i / 2) * 3;
          const wave2 = Math.sin(j / 2) * 3;
          const interference = Math.floor(Math.abs(wave1 + wave2));
          if (interference % 2 === 0) {
            pattern[i][j] = (interference % colorCount) + 1;
          }
        }
      }
      break;

    case 13: // Pyramid pattern
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const level = Math.min(i, j, size - 1 - i, size - 1 - j);
          pattern[i][j] = (level % colorCount) + 1;
        }
      }
      break;

    case 14: // Sunburst pattern
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const dx = j - centerX;
          const dy = i - centerY;
          const angle = Math.atan2(dy, dx) + Math.PI;
          const rayCount = 12;
          const ray = Math.floor((angle / (2 * Math.PI)) * rayCount);
          if (ray % 2 === 0) {
            const dist = Math.sqrt(dx * dx + dy * dy);
            pattern[i][j] = (Math.floor(dist) % colorCount) + 1;
          }
        }
      }
      break;

    case 15: // Celtic knot inspired
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const knotPattern = (Math.sin(i / 2) + Math.cos(j / 2)) * 3;
          if (Math.floor(Math.abs(knotPattern)) % 2 === 0) {
            pattern[i][j] = (Math.floor(Math.abs(knotPattern)) % colorCount) + 1;
          }
        }
      }
      break;

    case 16: // Butterfly wings
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const dx = j - centerX;
          const dy = i - centerY;
          const angle = Math.atan2(dy, dx);
          const radius = Math.sqrt(dx * dx + dy * dy);
          const wingShape = Math.abs(Math.cos(angle * 2)) * (size / 3);
          if (radius < wingShape) {
            pattern[i][j] = (Math.floor(angle * 5) % colorCount) + 1;
          }
        }
      }
      break;

    case 17: // Maze-like pattern
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const maze = (i * 7 + j * 11) % 13;
          if (maze > 5) {
            pattern[i][j] = (maze % colorCount) + 1;
          }
        }
      }
      break;

    case 18: // Target circles
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const dist = Math.sqrt(
            Math.pow(i - centerY, 2) + Math.pow(j - centerX, 2)
          );
          const ring = Math.floor(dist / 2);
          if (ring % 2 === 0 && dist < size / 2) {
            pattern[i][j] = (ring % colorCount) + 1;
          }
        }
      }
      break;

    case 19: // Lightning bolt
      for (let i = 0; i < size; i++) {
        const zigzag = centerX + Math.floor(Math.sin(i / 2) * (size / 4));
        for (let j = Math.max(0, zigzag - 1); j <= Math.min(size - 1, zigzag + 1); j++) {
          pattern[i][j] = ((i + j) % colorCount) + 1;
        }
      }
      break;

    case 20: // Peacock feather
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const dx = j - centerX;
          const dy = i - centerY;
          const angle = Math.atan2(dy, dx);
          const dist = Math.sqrt(dx * dx + dy * dy);
          const feather = Math.sin(angle * 4) * (size / 4);
          if (dist < Math.abs(feather) + size / 6) {
            pattern[i][j] = (Math.floor(dist + Math.abs(feather)) % colorCount) + 1;
          }
        }
      }
      break;

    case 21: // Tribal pattern
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const tribal = Math.floor((Math.sin(i / 3) + Math.cos(j / 3)) * 5);
          if (Math.abs(tribal) > 3) {
            pattern[i][j] = (Math.abs(tribal) % colorCount) + 1;
          }
        }
      }
      break;

    case 22: // Snowflake pattern
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const dx = j - centerX;
          const dy = i - centerY;
          const angle = Math.atan2(dy, dx);
          const dist = Math.sqrt(dx * dx + dy * dy);
          const branch = Math.floor((angle + Math.PI) / (Math.PI / 3));
          if (Math.abs(Math.sin(branch * Math.PI / 3) * dist) < 1) {
            pattern[i][j] = ((branch + Math.floor(dist)) % colorCount) + 1;
          }
        }
      }
      break;

    case 23: // Labyrinth pattern
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const path = (i + j) % 5;
          if (path === 0 || path === 2) {
            pattern[i][j] = ((i * j) % colorCount) + 1;
          }
        }
      }
      break;

    case 24: // Atom structure
      const electronRings = [size / 6, size / 4, size / 3];
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const dist = Math.sqrt(
            Math.pow(i - centerY, 2) + Math.pow(j - centerX, 2)
          );
          for (let r = 0; r < electronRings.length; r++) {
            if (Math.abs(dist - electronRings[r]) < 1.5) {
              pattern[i][j] = (r % colorCount) + 1;
            }
          }
        }
      }
      break;

    case 25: // Origami fold pattern
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const fold1 = Math.abs(i - j);
          const fold2 = Math.abs(i + j - size);
          if (fold1 < 2 || fold2 < 2) {
            pattern[i][j] = ((i + j) % colorCount) + 1;
          }
        }
      }
      break;

    case 26: // DNA helix
      for (let i = 0; i < size; i++) {
        const helix1 = centerX + Math.floor(Math.sin(i / 2) * (size / 6));
        const helix2 = centerX + Math.floor(Math.cos(i / 2) * (size / 6));

        if (helix1 >= 0 && helix1 < size) {
          pattern[i][helix1] = ((i % colorCount) + 1);
        }
        if (helix2 >= 0 && helix2 < size) {
          pattern[i][helix2] = ((i % colorCount) + 1);
        }
      }
      break;

    case 27: // Kaleidoscope
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const dx = Math.abs(j - centerX);
          const dy = Math.abs(i - centerY);
          const angle = Math.atan2(dy, dx);
          const sector = Math.floor((angle / (Math.PI / 4)));
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (sector % 2 === 0 && dist < size / 2) {
            pattern[i][j] = (Math.floor(dist) % colorCount) + 1;
          }
        }
      }
      break;

    case 28: // Mosaic tiles
      const tileSize = Math.max(2, Math.floor(size / 6));
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const tileI = Math.floor(i / tileSize);
          const tileJ = Math.floor(j / tileSize);
          const tilePattern = (tileI * 7 + tileJ * 13) % 3;
          if (tilePattern > 0) {
            pattern[i][j] = ((tileI + tileJ) % colorCount) + 1;
          }
        }
      }
      break;

    case 29: // Circuit board pattern
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const isHorizontalLine = i % 4 === 0;
          const isVerticalLine = j % 4 === 0;
          const isJunction = isHorizontalLine && isVerticalLine;

          if (isJunction) {
            pattern[i][j] = ((i + j) / 4 % colorCount) + 1;
          } else if (isHorizontalLine || isVerticalLine) {
            pattern[i][j] = ((i + j) % colorCount) + 1;
          }
        }
      }
      break;

    default:
      // Random creative pattern
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const randomValue = seededRandom(seed + i * size + j, 0, 1);
          if (randomValue > 0.3) {
            pattern[i][j] = Math.floor(randomValue * colorCount) + 1;
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
