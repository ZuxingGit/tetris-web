"use client";

import { useEffect, useState } from "react";

type Player = {
  name: string;
  score: number;
  created_at: string;
};

export function Leaderboard() {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((res) => res.json())
      .then((data) => setPlayers(data));
  }, []);

  return (
    <div className="w-full min-h-10/12 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl p-6 shadow-lg flex flex-col">
      <h2 className="font-bold text-2xl mb-3 text-teal-400">Hall of Fame</h2>

      <div className="space-y-2 flex-1 overflow-y-auto pr-2">
        {players.map((p, i) => (
          <div
            key={i}
            className="flex w-full items-center gap-3 text-xl text-zinc-200"
          >
            <span className="text-white font-bold flex-1 truncate text-left">
              {i + 1}. {p.name}
            </span>
            <span className="font-semibold text-yellow-300 shrink-0 text-right tabular-nums">
              {p.score}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
