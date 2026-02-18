import { Effect } from "./types";

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function parseColorToRgba(color: string): { r: number; g: number; b: number; a: number } | null {
  const c = color.trim().toLowerCase();

  // #rgb / #rrggbb
  if (c.startsWith("#")) {
    const hex = c.slice(1);
    if (hex.length === 3) {
      const r = Number.parseInt(hex[0] + hex[0], 16);
      const g = Number.parseInt(hex[1] + hex[1], 16);
      const b = Number.parseInt(hex[2] + hex[2], 16);
      if ([r, g, b].some((n) => Number.isNaN(n))) return null;
      return { r, g, b, a: 1 };
    }
    if (hex.length === 6) {
      const r = Number.parseInt(hex.slice(0, 2), 16);
      const g = Number.parseInt(hex.slice(2, 4), 16);
      const b = Number.parseInt(hex.slice(4, 6), 16);
      if ([r, g, b].some((n) => Number.isNaN(n))) return null;
      return { r, g, b, a: 1 };
    }
  }

  // rgb(...) / rgba(...)
  const rgbaMatch = c.match(
    /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(\d*\.?\d+)\s*)?\)$/
  );
  if (rgbaMatch) {
    const r = Number(rgbaMatch[1]);
    const g = Number(rgbaMatch[2]);
    const b = Number(rgbaMatch[3]);
    const a = rgbaMatch[4] === undefined ? 1 : Number(rgbaMatch[4]);
    if ([r, g, b, a].some((n) => Number.isNaN(n))) return null;
    return {
      r: Math.max(0, Math.min(255, r)),
      g: Math.max(0, Math.min(255, g)),
      b: Math.max(0, Math.min(255, b)),
      a: clamp01(a),
    };
  }

  return null;
}

function withAlpha(color: string, alpha: number) {
  const parsed = parseColorToRgba(color);
  if (!parsed) return color;
  const a = clamp01(alpha) * parsed.a;
  return `rgba(${parsed.r},${parsed.g},${parsed.b},${a})`;
}

export class EffectManager {
  effects: Effect[] = [];

  add(effect: Effect) {
    this.effects.push(effect);
  }

  update(dt: number) {
    for (const e of this.effects) {
      e.x += e.vx * dt;
      e.y += e.vy * dt;

      if (e.type === "smoke") {
        e.vx *= 0.98;
        e.vy *= 0.98;
        e.vy -= 100 * dt; // extra upward drift
      } else if (e.type === "bubble") {
        e.vx += Math.sin(performance.now() / 250 + e.x) * 0.15;
      } else {
        // gravity (pull down slightly)
        e.vy += 120 * dt;
      }

      e.rotation += e.rotationSpeed * dt;

      e.life -= dt;
    }

    this.effects = this.effects.filter((e) => e.life > 0);
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (const e of this.effects) {
      if (e.type === "heart") {
        const alpha = Math.max(e.life / e.maxLife, 0);

        ctx.save();
        ctx.globalAlpha = alpha;

        ctx.translate(e.x, e.y);
        ctx.rotate(e.rotation);

        ctx.font = `${e.size}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText("♥️", 0, 0);

        ctx.restore();
      }

      if (e.type === "bird") {
        const alpha = Math.max(e.life / e.maxLife, 0);

        ctx.save();
        ctx.globalAlpha = alpha;

        ctx.translate(e.x, e.y);
        ctx.rotate(e.rotation);

        ctx.font = `${e.size}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText("🕊️", 0, 0);

        ctx.restore();
      }

      if (e.type === "cloud") {
        const alpha = Math.max(e.life / e.maxLife, 0);

        ctx.save();
        ctx.globalAlpha = alpha * 0.9;

        ctx.translate(e.x, e.y);
        ctx.rotate(e.rotation);

        ctx.font = `${e.size}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText("☁️", 0, 0);

        ctx.restore();
      }

      if (e.type === "particle") {
        const alpha = Math.max(e.life / e.maxLife, 0);

        ctx.save();
        ctx.globalAlpha = alpha;

        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.fill();

        ctx.restore();
      }

      if (e.type === "smoke") {
        const t = clamp01(e.life / e.maxLife);
        // smoother fade: stays visible early, fades out near the end
        const fade = t * t;

        ctx.save();
        ctx.globalAlpha = fade * 0.9;

        // smoke grows as it fades
        const grow = 1 + (1 - t) * 2.3;
        const r = e.size * grow;

        // soften the edges (radial gradient). Use the same base color
        // and fade alpha outward so hex colors like "#888" also work.
        const base = e.color ?? "#c8c8c8";
        const gradient = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, r);
        gradient.addColorStop(0, withAlpha(base, 0.85));
        gradient.addColorStop(0.5, withAlpha(base, 0.25));
        gradient.addColorStop(1, "rgba(120,120,120,0)");

        ctx.fillStyle = gradient;

        ctx.beginPath();
        ctx.arc(e.x, e.y, r, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      if (e.type === "bubble") {
        const alpha = Math.max(e.life / e.maxLife, 0);

        const grow = 1 + (1 - alpha) * 0.8;
        const r = e.size * grow;

        ctx.save();
        ctx.globalAlpha = alpha * 0.9;

        // edge of bubble
        ctx.strokeStyle = e.color ?? "rgba(200,200,255,1)";
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.arc(e.x, e.y, r, 0, Math.PI * 2);
        ctx.stroke();

        // inner glow fill
        ctx.globalAlpha = alpha * 0.15;
        ctx.fillStyle = e.color ?? "rgba(200,200,255,0.4)";

        ctx.beginPath();
        ctx.arc(e.x, e.y, r, 0, Math.PI * 2);
        ctx.fill();

        // highlighted small circle
        ctx.globalAlpha = alpha * 0.5;
        ctx.fillStyle = "rgba(255,255,255,1)";

        ctx.beginPath();
        ctx.arc(e.x - r * 0.3, e.y - r * 0.3, r * 0.18, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

    }
  }
}
