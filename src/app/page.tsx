"use client";

import { useEffect, useRef, useState } from "react";
import { Renderer } from "@/render/renderer";
import { COLS, ROWS } from "@/game/constants";
import { Board } from "@/game/board";
import { hasCollision } from "@/game/collision";
import { spawnRandomPiece } from "@/game/spawn";
import { Piece } from "@/game/piece";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const boardRef = useRef<Board | null>(null);
  const pieceRef = useRef<Piece | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cellSize = 35;

    canvas.width = COLS * cellSize;
    canvas.height = ROWS * cellSize;

    const renderer = new Renderer(ctx, cellSize);

    if (!boardRef.current) {
      boardRef.current = new Board();
    }
    if (!pieceRef.current) {
      pieceRef.current = spawnRandomPiece();
    }

    const board = boardRef.current!;
    let piece = pieceRef.current!;

    let lastTime = 0;
    let dropTimer = 0;
    const dropInterval = 800; //speed of piece dropping, 500 is good for testing, 800 is good for playing

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!pieceRef.current || !boardRef.current) return;

      const board = boardRef.current;
      // let piece = pieceRef.current;

      if (e.key === "ArrowLeft") {
        piece.x -= 1;
        if (hasCollision(board, piece)) {
          piece.x += 1;
        }
      }

      if (e.key === "ArrowRight") {
        piece.x += 1;
        if (hasCollision(board, piece)) {
          piece.x -= 1;
        }
      }

      if (e.key === "ArrowDown") {
        piece.y += 1;
        if (hasCollision(board, piece)) {
          piece.y -= 1;
        }
      }

      if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
        const rotated = piece.rotateClockwise();
        if (!hasCollision(board, rotated)) {
          pieceRef.current = rotated;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    function loop(time: number) {
      const delta = time - lastTime;
      lastTime = time;

      dropTimer += delta;
      piece = pieceRef.current!;

      if (dropTimer > dropInterval) {
        piece.y += 1;

        // if collision happens, move back and lock the piece
        if (hasCollision(board, piece)) {
          piece.y -= 1;
          board.lockPiece(piece);

          const cleared = board.clearLines();

          if (cleared > 0) {
            setScore((prev) => prev + cleared);
          }

          // spawn a new piece
          piece = spawnRandomPiece();
        }
        
        pieceRef.current = piece;
        dropTimer = 0;
      }

      renderer.clear();
      renderer.drawGrid();
      renderer.drawBoard(board);
      renderer.drawPiece(piece);

      requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
  <main className="min-h-screen flex flex-col items-center justify-center bg-black gap-4">
    <div className="text-white text-xl font-bold">Score: {score}</div>

    <canvas
      ref={canvasRef}
      className="border border-zinc-700 rounded-xl"
    />
  </main>
);

}