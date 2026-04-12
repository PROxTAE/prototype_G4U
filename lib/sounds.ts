"use client";

const SOUNDS = {
  click: "https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3", // Soft blip/chime
  success: "https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3", // Ding/Achievement
  reward: "https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3", // Coin collect
  levelUp: "https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3", // Shining level up
} as const;

export type SoundType = keyof typeof SOUNDS;

class SoundManager {
  private static instance: SoundManager;
  private audioCache: Map<string, HTMLAudioElement> = new Map();

  private constructor() {}

  static getInstance() {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  play(type: SoundType) {
    if (typeof window === "undefined") return;

    try {
      let audio = this.audioCache.get(type);
      if (!audio) {
        audio = new Audio(SOUNDS[type]);
        audio.volume = 0.4; // Default volume
        this.audioCache.set(type, audio);
      }
      
      // Stop and reset to start if already playing
      audio.pause();
      audio.currentTime = 0;
      audio.play().catch(e => console.warn("Audio play blocked by browser policy"));
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  }
}

export const playSound = (type: SoundType) => {
  SoundManager.getInstance().play(type);
};
