"use client";

import { useEffect, useRef } from "react";
import { BOARD_WIDTH, BOARD_HEIGHT } from "@/game/constants";
import { createEmptyBoard } from "@/game/board";
import { clearScreen, drawBorder, drawGrid, drawBoard } from "@/render/renderer";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = BOARD_WIDTH;
    canvas.height = BOARD_HEIGHT;

    const board = createEmptyBoard();

    // test blocks (fake landed blocks)
    board[19][4] = "cyan";
    board[19][5] = "cyan";
    board[18][4] = "cyan";
    board[18][5] = "cyan";

    board[17][3] = "red";
    board[17][4] = "red";
    board[17][5] = "red";
    board[17][6] = "red";

    clearScreen(ctx);
    drawGrid(ctx);
    drawBoard(ctx, board);
    drawBorder(ctx);
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950">
      <canvas
        ref={canvasRef}
        className="border border-zinc-700 rounded-md"
      />
    </main>
  );
}
