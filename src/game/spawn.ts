import { Piece } from "./piece";
import { TetrominoType, TETROMINO_SHAPES, TETROMINO_COLORS } from "./tetromino";

const types: TetrominoType[] = ["I", "O", "T", "S", "Z", "J", "L"];

export function spawnRandomPiece(): Piece {
  const type = types[Math.floor(Math.random() * types.length)];

  // x=3 is for centering the piece horizontally
  return new Piece(TETROMINO_SHAPES[type], TETROMINO_COLORS[type], 3, 0);
}
