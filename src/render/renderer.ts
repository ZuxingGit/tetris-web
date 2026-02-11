import { Board } from "@/game/board";
import { COLS, ROWS } from "@/game/constants";
import { Piece } from "@/game/piece";

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private cellSize: number;

  constructor(ctx: CanvasRenderingContext2D, cellSize: number) {
    this.ctx = ctx;
    this.cellSize = cellSize;
  }

  clear() {
    this.ctx.clearRect(0, 0, COLS * this.cellSize, ROWS * this.cellSize);
  }

  drawRoundedRect(x: number, y: number, w: number, h: number, r: number) {
    const ctx = this.ctx;

    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  drawGrid() {
    const ctx = this.ctx;

    ctx.fillStyle = "#1f1f1f";
    ctx.fillRect(0, 0, COLS * this.cellSize, ROWS * this.cellSize);

    ctx.strokeStyle = "rgba(0, 0, 0, 1)";
    ctx.lineWidth = 1;

    for (let x = 0; x <= COLS; x++) {
      ctx.beginPath();
      ctx.moveTo(x * this.cellSize, 0);
      ctx.lineTo(x * this.cellSize, ROWS * this.cellSize);
      ctx.stroke();
    }

    for (let y = 0; y <= ROWS; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * this.cellSize);
      ctx.lineTo(COLS * this.cellSize, y * this.cellSize);
      ctx.stroke();
    }
  }

  drawCell(x: number, y: number, color: string) {
    const ctx = this.ctx;
    const padding = 1;
    const radius = 4;

    const px = x * this.cellSize;
    const py = y * this.cellSize;

    const innerX = px + padding;
    const innerY = py + padding;
    const innerSize = this.cellSize - padding * 0;

    // main fill
    ctx.fillStyle = color;
    this.drawRoundedRect(innerX, innerY, innerSize, innerSize, radius);
    ctx.fill();

    // subtle highlight
    ctx.strokeStyle = "rgba(0, 0, 0)";
    // ctx.lineWidth = 1;
    this.drawRoundedRect(innerX, innerY, innerSize, innerSize, radius);
    ctx.stroke();
  }

  drawBoard(board: Board) {
    for (let y = 0; y < board.grid.length; y++) {
      for (let x = 0; x < board.grid[y].length; x++) {
        const cell = board.grid[y][x];
        if (!cell) continue;

        this.drawCell(x, y, cell);
      }
    }
  }

  drawPiece(piece: Piece) {
    for (let row = 0; row < piece.shape.length; row++) {
      for (let col = 0; col < piece.shape[row].length; col++) {
        if (piece.shape[row][col] === 0) continue;

        this.drawCell(piece.x + col, piece.y + row, piece.color);
      }
    }
  }
}
