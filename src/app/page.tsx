"use client";

import { useEffect, useRef, useState } from "react";
import { Renderer } from "@/render/renderer";
import { CELL_SIZE, COLS, ROWS } from "@/game/constants";
import { Board } from "@/game/board";
import { hasCollision } from "@/game/collision";
import { spawnRandomPiece } from "@/game/spawn";
import { Piece } from "@/game/piece";
import { Pause } from "lucide-react";
import { Leaderboard } from "@/components/Leaderboard";
import { soundManager } from "@/audio/soundManager";
import { EffectManager } from "@/effects/effctManager";
import { createHeartEffect } from "@/effects/heartFly";
import { createBirdEffect } from "@/effects/bidrFly";
import { createCloudEffect } from "@/effects/cloudFly";
import { createParticleEffects } from "@/effects/particleEffect";
import { createSmokeEffects } from "@/effects/smokeEffect";
import { createBubbleEffects } from "@/effects/bubbleEffect";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const boardRef = useRef<Board | null>(null);
  const pieceRef = useRef<Piece | null>(null);
  const gameOverRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);
  const dropTimerRef = useRef(0);
  const lastTimeRef = useRef(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(paused);
  const [leaderboardVersion, setLeaderboardVersion] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const effectManagerRef = useRef<EffectManager | null>(null);

  // submit score to leaderboard
  const submitScore = async () => {
    if (!playerName.trim()) return;

    setIsSubmitting(true);

    await fetch("/api/leaderboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: playerName.trim(),
        score,
      }),
    });

    setIsSubmitting(false);
    setPlayerName("");

    // Refresh the leaderboard by remounting it.
    setLeaderboardVersion((v) => v + 1);
  };

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    soundManager.init();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (!effectManagerRef.current) {
      effectManagerRef.current = new EffectManager();
    }

    const cellSize = CELL_SIZE;

    const clearEffectTypes = ["heart", "bird", "cloud", "particle", "smoke", "bubble"] as const;
    type ClearEffectType = (typeof clearEffectTypes)[number];

    const spawnRandomClearEffects = (
      clearedCells: { x: number; y: number; color: string }[]
    ) => {
      const effectManager = effectManagerRef.current;
      if (!effectManager || clearedCells.length === 0) return;

      const chosen: ClearEffectType =
        clearEffectTypes[Math.floor(Math.random() * clearEffectTypes.length)];


      for (const cell of clearedCells) {
        const px = cell.x * cellSize + cellSize / 2;
        const py = cell.y * cellSize + cellSize / 2;

        switch (chosen) {
          case "heart": {
            effectManager.add(createHeartEffect(px, py));
            break;
          }
          case "bird": {
            effectManager.add(createBirdEffect(px, py));
            break;
          }
          case "cloud": {
            effectManager.add(createCloudEffect(px, py));
            break;
          }
          case "particle": {
            const particles = createParticleEffects(px, py, 8);
            for (const p of particles) effectManager.add(p);
            break;
          }
          case "smoke": {
            const smokes = createSmokeEffects(px, py, 2, cell.color);
            for (const s of smokes) effectManager.add(s);
            break;
          }
          case "bubble": {
            const bubbles = createBubbleEffects(px, py, cell.color, 1);
            for (const b of bubbles) effectManager.add(b);
            break;
          }
        }
      }
    };

    canvas.width = COLS * cellSize;
    canvas.height = ROWS * cellSize;

    const renderer = new Renderer(ctx, cellSize);

    if (!boardRef.current) {
      boardRef.current = new Board();
    }
    if (!pieceRef.current) {
      pieceRef.current = spawnRandomPiece();
    }
    const dropInterval = 500; //speed of piece dropping, 500 is good for testing, 800 is good for playing

    const handleKeyDown = (e: KeyboardEvent) => {
      const board = boardRef.current;
      const piece = pieceRef.current;
      if (!piece || !board) return;

      if (gameOverRef.current) return;

      if (e.key === "p" || e.key === "P") {
        setPaused((prev) => !prev);
      }

      // if game is paused, ignore other controls
      if (pausedRef.current) return;

      if (e.key === "ArrowLeft") {
        piece.x -= 1;
        if (hasCollision(board, piece)) {
          piece.x += 1;
        } else {
          soundManager.play("move");
        }
      }

      if (e.key === "ArrowRight") {
        piece.x += 1;
        if (hasCollision(board, piece)) {
          piece.x -= 1;
        } else {
          soundManager.play("move");
        }
      }

      if (e.key === "ArrowDown") {
        piece.y += 1;
        if (hasCollision(board, piece)) {
          piece.y -= 1;
        } else {
          soundManager.play("drop");
        }
      }

      if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
        const rotated = piece.rotateClockwise();
        if (!hasCollision(board, rotated)) {
          pieceRef.current = rotated;
          soundManager.play("rotate");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    function loop(time: number) {
      const board = boardRef.current;
      const piece = pieceRef.current;
      if (!board || !piece) {
        rafIdRef.current = requestAnimationFrame(loop);
        return;
      }

      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;

      const dt = delta / 1000;
      effectManagerRef.current?.update(dt);

      if (pausedRef.current) {
        renderer.clear();
        renderer.drawGrid();
        renderer.drawBoard(board);
        renderer.drawPiece(piece);

        rafIdRef.current = requestAnimationFrame(loop);
        return;
      }

      if (gameOverRef.current) {
        renderer.clear();
        renderer.drawGrid();
        renderer.drawBoard(board);
        renderer.drawPiece(piece);

        rafIdRef.current = requestAnimationFrame(loop);
        return;
      }

      if (!pausedRef.current) {
        dropTimerRef.current += delta;

        if (dropTimerRef.current > dropInterval) {
          piece.y += 1;

          // if collision happens, move back and lock the piece
          if (hasCollision(board, piece)) {
            piece.y -= 1;
            board.lockPiece(piece);

            const result = board.clearLines();

            if (result.cleared > 0) {
              setScore((prev) => prev + result.cleared);

              // randomly trigger one of six clear effects
              spawnRandomClearEffects(result.clearedCells);
              soundManager.play("clear");
            }

            // spawn a new piece
            const nextPiece = spawnRandomPiece();
            pieceRef.current = nextPiece;
            // game over check
            if (board.gameOver()) {
              gameOverRef.current = true;
              setGameOver(true);
              // keep the loop alive so restart can work
              rafIdRef.current = requestAnimationFrame(loop);
              soundManager.play("gameover");
              return;
            }
          }

          dropTimerRef.current = 0;
        }
      }

      renderer.clear();
      renderer.drawGrid();
      renderer.drawBoard(board);
      renderer.drawPiece(pieceRef.current ?? piece);
      effectManagerRef.current?.draw(ctx!);

      rafIdRef.current = requestAnimationFrame(loop);
    }

    rafIdRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);

      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  // Restart Game
  const restartGame = () => {
    boardRef.current = new Board();
    pieceRef.current = spawnRandomPiece();
    dropTimerRef.current = 0;
    lastTimeRef.current = 0;
    gameOverRef.current = false;
    setScore(0);
    setGameOver(false);
    setPaused(false);
  };

  return (
  <main className="min-h-screen w-full flex items-center justify-evenly bg-linear-to-tr from-gray-800 via-gray-700 to-gray-900 px-56 gap-18 py-16">
    {/* ----Glassmorphism---- */}
    {/* Score Card */}
    <div className="w-25 pl-6 pr-6 py-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg shadow-black/40">
      <div className="text-sm text-white tracking-widest uppercase font-bold">
        Score
      </div>
      <div className="text-2xl font-extrabold text-yellow-300 tracking-tight">
        {score}
      </div>
    </div>

    <div className="flex-3/5 flex flex-col items-center gap-6">
      {/* Game Canvas Container */}
      <div className="relative rounded-3xl p-4 border border-white/25 bg-black/50 backdrop-blur-xl shadow-2xl shadow-black/60">
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-white/10 to-transparent blur-2xl opacity-50 pointer-events-none" />
        <canvas
          ref={canvasRef}
          className="relative rounded border-white/10 shadow-lg"
        />

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm rounded-3xl">
            <div className="text-red-400 text-4xl font-extrabold tracking-tight">
              Game Over
            </div>

            <div className="text-yellow-300 mt-2 text-lg font-bold">
              Final Score: {score}
            </div>

            {score > 0 && (<>
              <p className="text-white text-md opacity-80 mb-4">
                  Enter your name to submit your score.
              </p>

              <input
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder=" Your name..."
                className="w-fit rounded-xl bg-black/40 border border-white/15 px-2 py-3 text-white outline-none"
              />

              <div className="flex gap-3 mt-4">
                <button
                  onClick={submitScore}
                  disabled={isSubmitting || !playerName.trim()}
                  className="mt-6 px-6 py-3 rounded-xl bg-white/20 border text-yellow-300 font-bold transition"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </>)}
            
              
            <button
              onClick={restartGame}
              className="mt-6 px-6 py-3 rounded-xl bg-white/20 border text-green-400 font-bold hover:bg-white/20 transition"
            >
              Restart
            </button>
          </div>
        )}                      

        {paused && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md rounded-3xl">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-2xl bg-white/20">
                <Pause className="w-8 h-8 text-white" />
              </div>

              <div className="text-white text-2xl font-extrabold tracking-wider">
                PAUSED
              </div>

              <div className="text-zinc-300 text-xl tracking-wide">
                Press <span className="text-white font-semibold">P</span> to Resume
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls hint */}
      <div className="text-white/60 text-sm tracking-wide flex items-center justify-center gap-2 flex-wrap">
        <span className="inline-flex items-center justify-center min-w-8 px-2 py-1 rounded-md border border-white/50 bg-white/5 text-white/80 text-xs font-semibold">
          ←
        </span>
        <span className="inline-flex items-center justify-center min-w-8 px-2 py-1 rounded-md border border-white/50 bg-white/5 text-white/80 text-xs font-semibold">
          →
        </span>
        <span className="text-white/60">Move</span>
        <span className="inline-flex items-center justify-center min-w-8 px-2 py-1 rounded-md border border-white/50 bg-white/5 text-white/80 text-xs font-semibold">
          ↓
        </span>
        <span className="text-white/60">Drop</span>

        <span className="inline-flex items-center justify-center min-w-12 px-2 py-1 rounded-md border border-white/50 bg-white/5 text-white/80 text-xs font-semibold">
          Shift
        </span>
        <span className="text-white/60">Rotate</span>
        <span className="inline-flex items-center justify-center min-w-8 px-2 py-1 rounded-md border border-white/50 bg-white/5 text-white/80 text-xs font-semibold">
          P
        </span>
        <span className="text-white/60">Pause</span>
      </div>

    </div>

    {/* Leaderboard */}
    <div className="flex-3/10 backdrop-blur-xl shadow-lg shadow-black/40">
      <Leaderboard key={leaderboardVersion} />
    </div>
  </main>
);


}