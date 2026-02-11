import { Board } from "./board";
import { Piece } from "./piece";

export function hasCollision(board: Board, piece: Piece): boolean {
  for (let row = 0; row < piece.shape.length; row++) {
    for (let col = 0; col < piece.shape[row].length; col++) {
      if (piece.shape[row][col] === 0) continue;

      const x = piece.x + col;
      const y = piece.y + row;

      // cross bottom/left/right border = collision
      if (!board.isInside(x, y)) return true;

      // collide with existing blocks = collision
      if (board.grid[y][x] !== null) return true;
    }
  }

  return false;
}
