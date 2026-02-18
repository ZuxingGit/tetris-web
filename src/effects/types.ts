export type EffectType = "heart" | "bird" | "cloud" | "particle" | "smoke" | "bubble";

export type Effect = {
  id: string;
  type: EffectType;
  x: number; // pixel position
  y: number;
  vx: number; // velocity
  vy: number;
  life: number; // remaining time
  maxLife: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  color?: string;
};
