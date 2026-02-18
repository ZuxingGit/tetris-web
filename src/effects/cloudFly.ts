import { Effect } from "./types";

export function createCloudEffect(x: number, y: number): Effect {
  return {
    id: crypto.randomUUID(),
    type: "cloud",
    x,
    y,
    vx: (Math.random() - 0.5) * 50,   // slow drift
    vy: -200 - Math.random() * 150,     // slow upward
    life: 1.6,
    maxLife: 1.6,
    size: 22 + Math.random() * 18,
    rotation: 0,
    rotationSpeed: 0,
  };
}
