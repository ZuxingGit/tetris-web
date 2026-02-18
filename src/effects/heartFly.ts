import { Effect } from "./types";

export function createHeartEffect(x: number, y: number): Effect {
  return {
    id: crypto.randomUUID(),
    type: "heart",
    x,
    y,
    vx: (Math.random() - 0.5) * 100, // random left/right
    vy: -200 - Math.random() * 200,   // upward
    life: 1.1,
    maxLife: 1.5,
    size: 20 + Math.random() * 10,
    rotation: 0,
    rotationSpeed: 0,
  };
}
