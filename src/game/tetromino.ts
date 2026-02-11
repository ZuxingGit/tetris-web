export type TetrominoType = "I" | "O" | "T" | "S" | "Z" | "J" | "L";

export const TETROMINO_SHAPES: Record<TetrominoType, number[][]> = {
  I: [
    [1, 1, 1, 1],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
  ],
};

export const TETROMINO_COLORS: Record<TetrominoType, string> = {
  L: "#ffa500", // Orange (0xFFFFA500)
  J: "#2271e7", // Blue (ARGB 255, 34, 113, 231)
  I: "#f200ff", // Pink (ARGB 255, 242, 0, 255)
  O: "#ffff00", // Yellow (0xFFFFFF00)
  S: "#0bed0b", // Green (ARGB 255, 11, 237, 11)
  Z: "#ff0000", // Red (0xFFFF0000)
  T: "#9313f5", // Purple (ARGB 255, 147, 19, 245)
};
