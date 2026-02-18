import { Effect } from "./types";

export function createBubbleEffects(
  x: number,
  y: number,
  color: string,
  count: number = 1
): Effect[] {
  const effects: Effect[] = [];

  for (let i = 0; i < count; i++) {
    effects.push({
      id: crypto.randomUUID(),
      type: "bubble",
      x: x + (Math.random() * 8 - 4),
      y: y + (Math.random() * 8 - 4),
      vx: (Math.random() - 0.5) * 20,
      vy: -(130 + Math.random() * 50), // fly upward
      life: 1.6 + Math.random() * 0.6,
      maxLife: 2.2,
      size: 6 + Math.random() * 3,
      color,
      rotation: 0,
      rotationSpeed: 0
    });
  }

  return effects;
}
