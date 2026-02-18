import { Effect } from "./types";

export function createBirdEffect(x: number, y: number): Effect {
  return {
    id: crypto.randomUUID(),
    type: "bird",
    x,
    y,
    vx: (Math.random() - 0.5) * 300, // random left/right
    vy: -200 - Math.random() * 200,   // upward
    life: 1.1,
    maxLife: 1.4,
    size: 30 + Math.random() * 10,
    rotation: 0,
    rotationSpeed: 0,
  };
}
