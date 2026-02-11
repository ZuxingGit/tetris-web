import { TetrominoType, TETROMINO_COLORS, TETROMINO_SHAPES } from "./tetromino";

export class Piece {
  shape: number[][];
  color: string;

  x: number;
  y: number;

  constructor(shape: number[][], color: string, x: number, y: number = 0) {
    this.shape = shape;
    this.color = color;
    this.x = x;
    this.y = y;
  }

  moveDown() {
    this.y += 1;
  }

  rotateClockwise(): Piece {
    const rotated = this.shape[0].map((_, x) =>
      this.shape.map((row) => row[x]).reverse()
    );

    const newPiece = new Piece(rotated, this.color, this.x, this.y);
    return newPiece;
  }

}
