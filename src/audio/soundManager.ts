export type SoundName =
  | "move"
  | "rotate"
  | "drop"
  | "clear"
  | "gameover";

class SoundManager {
  private sounds: Record<SoundName, HTMLAudioElement> = {} as Record<SoundName, HTMLAudioElement>;
  private muted = false;
  private volume = 0.6;

  init() {
    const create = (name: SoundName, path: string) => {
      const audio = new Audio(path);
      audio.volume = this.volume;
      this.sounds[name] = audio;
    };

    create("move", "/sounds/move.ogg");
    create("rotate", "/sounds/rotate.ogg");
    create("drop", "/sounds/drop.ogg");
    create("clear", "/sounds/clear.ogg");
    create("gameover", "/sounds/gameover.ogg");
  }

  play(name: SoundName) {
    if (this.muted) return;

    const sound = this.sounds[name];
    if (!sound) return;

    sound.currentTime = 0;
    sound.play().catch(() => {});
  }

  setMuted(value: boolean) {
    this.muted = value;
  }

  setVolume(value: number) {
    this.volume = value;
    Object.values(this.sounds).forEach((s) => (s.volume = value));
  }
}

export const soundManager = new SoundManager();
