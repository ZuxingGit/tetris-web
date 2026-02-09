import { Board } from "@/game/board";
import { BOARD_WIDTH, BOARD_HEIGHT, CELL_SIZE, ROWS, COLS } from "@/game/constants";

export function clearScreen(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
}

export function drawGrid(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 1;

  // vertical lines
  for (let c = 0; c <= COLS; c++) {
    const x = c * CELL_SIZE;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, BOARD_HEIGHT);
    ctx.stroke();
  }

  // horizontal lines
  for (let r = 0; r <= ROWS; r++) {
    const y = r * CELL_SIZE;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(BOARD_WIDTH, y);
    ctx.stroke();
  }
}

export function drawBorder(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = "rgba(255,255,255,0.25)";
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
}

export function drawBoard(ctx: CanvasRenderingContext2D, board: Board) {
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      const cell = board[r][c];
      if (!cell) continue;

      ctx.fillStyle = cell;
      ctx.fillRect(c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE, CELL_SIZE);

      // small inner border to look like tetris blocks
      ctx.strokeStyle = "rgba(0,0,0,0.25)";
      ctx.lineWidth = 2;
      ctx.strokeRect(c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }
}