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

    const cellSize = 30;

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
    const dropInterval = 500; //speed of piece dropping, 500 is good for testing, 800 is good for playing

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
  <main className="min-h-screen flex items-center justify-evenly bg-linear-to-tr from-gray-800 via-gray-700 to-gray-900 px-85">
    {/* HUD */}

    {/* Score Card */}
    <div className="px-6 py-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg shadow-black/40">
      <div className="text-sm text-white/60 tracking-widest uppercase font-bold">
        Score
      </div>
      <div className="text-2xl font-extrabold text-white tracking-tight">
        {score}
      </div>
    </div>

    <div className="flex flex-col items-center gap-6">
      {/* Game Canvas Container */}
      <div className="relative rounded-3xl p-4 border border-white/10 bg-white/4 backdrop-blur-xl shadow-2xl shadow-black/60">
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-white/10 to-transparent blur-2xl opacity-50 pointer-events-none" />

        <canvas
          ref={canvasRef}
          className="relative rounded border-white/10 shadow-lg"
        />
      </div>

      {/* Controls hint */}
      <div className="text-white/60 text-sm tracking-wide flex items-center justify-center gap-2 flex-wrap">
        <span className="inline-flex items-center justify-center min-w-8 px-2 py-1 rounded-md border border-white/10 bg-white/5 text-white/80 text-xs font-semibold">
          ←
        </span>
        <span className="inline-flex items-center justify-center min-w-8 px-2 py-1 rounded-md border border-white/10 bg-white/5 text-white/80 text-xs font-semibold">
          →
        </span>
        <span className="text-white/60">move</span>
        <span className="text-white/30">·</span>
        <span className="inline-flex items-center justify-center min-w-8 px-2 py-1 rounded-md border border-white/10 bg-white/5 text-white/80 text-xs font-semibold">
          ↓
        </span>
        <span className="text-white/60">drop</span>
        <span className="text-white/30">·</span>
        <span className="inline-flex items-center justify-center min-w-12 px-2 py-1 rounded-md border border-white/10 bg-white/5 text-white/80 text-xs font-semibold">
          Shift
        </span>
        <span className="text-white/60">rotate</span>
      </div>
    </div>
  </main>
);


}