import { Effect } from "./types";

export function createParticleEffects(
  x: number,
  y: number,
  count: number = 20
): Effect[] {
  const effects: Effect[] = [];

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 80 + Math.random() * 180;

    effects.push({
      id: crypto.randomUUID(),
      type: "particle",
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 80, // bias upward
      life: 0.7 + Math.random() * 0.3,
      maxLife: 1,
      size: 3 + Math.random() * 3,
      rotation: 0,
      rotationSpeed: 0,
    });
  }

  return effects;
}
