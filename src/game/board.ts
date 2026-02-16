import { COLS, ROWS } from "./constants";
import { Piece } from "./piece";

export type Cell = string | null;

export class Board {
  grid: Cell[][];

  constructor() {
    this.grid = Array.from({ length: ROWS }, () =>
      Array.from({ length: COLS }, () => null)
    );
  }

  isInside(x: number, y: number, height: number) {
    return x >= 0 && x < COLS && y >= -height && y < ROWS;
  }

  lockPiece(piece: Piece) {
    for (let row = 0; row < piece.shape.length; row++) {
      for (let col = 0; col < piece.shape[row].length; col++) {
        if (piece.shape[row][col] === 0) continue;

        const x = piece.x + col;
        const y = piece.y + row;

        if (y >= 0 && this.isInside(x, y, piece.shape.length)) {
          this.grid[y][x] = piece.color;
        }
      }
    }
  }

  clearLines(): number {
    let cleared = 0;

    for (let y = ROWS - 1; y >= 0; y--) {
      const isFull = this.grid[y].every((cell) => cell !== null);

      if (isFull) {
        this.grid.splice(y, 1);

        // add an empty line on top
        this.grid.unshift(Array.from({ length: COLS }, () => null));

        cleared++;
        y++; // recheck the current row (because rows have shifted down after splice)
      }
    }

    return cleared;
  }

  gameOver(): boolean {
    // if any cell in the top row is occupied, it's game over
    return this.grid[0].some((cell) => cell !== null);
  }

}