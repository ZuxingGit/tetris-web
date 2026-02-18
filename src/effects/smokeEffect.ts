import { Effect } from "./types";

export function createSmokeEffects(
  x: number,
  y: number,
  count: number = 6,
  color: string = "#888"
): Effect[] {
  const effects: Effect[] = [];

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 250 + Math.random() * 30;

    effects.push({
      id: crypto.randomUUID(),
      type: "smoke",
      x: x + (Math.random() * 10 - 5),
      y: y + (Math.random() * 10 - 5),
      vx: Math.cos(angle) * speed,
      vy: -speed - Math.random() * 40, // bias upward
      life: 1.2 + Math.random() * 0.4,
      maxLife: 1.6,
      size: 10 + Math.random() * 20,
      rotation: 0,
      rotationSpeed: (Math.random() - 0.5) * 2,
      color,
    });
  }

  return effects;
}
