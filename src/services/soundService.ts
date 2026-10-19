import { loadStorageData } from '../storage/storageService';

class ArcadeSoundService {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    const AudioCtx =
      window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;
    if (!this.ctx) {
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private playTone(
    freq: number,
    durationSec: number,
    type: OscillatorType = 'sine',
    delaySec = 0,
    gainScale = 0.25
  ): void {
    const data = loadStorageData();
    if (!data.settings.soundEnabled) return;

    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime + delaySec;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      const volume = Math.max(0.01, data.settings.soundVolume * gainScale);
      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + durationSec);
    } catch {
      // Ignore Web Audio errors in headless browsers
    }
  }

  public triggerHaptic(pattern: number | number[] = 15): void {
    const data = loadStorageData();
    if (!data.settings.hapticsEnabled) return;
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Ignore on unsupported devices
      }
    }
  }

  public playClick(): void {
    this.playTone(520, 0.05, 'triangle', 0, 0.15);
  }

  public playCorrectFound(comboCount = 1): void {
    const baseBoost = Math.min((comboCount - 1) * 45, 220);
    this.playTone(587.33 + baseBoost, 0.12, 'triangle', 0, 0.28);
    this.playTone(880 + baseBoost, 0.22, 'sine', 0.09, 0.3);
    this.triggerHaptic([18, 30, 25]);
  }

  public playWrongClick(): void {
    this.playTone(210, 0.14, 'sawtooth', 0, 0.16);
    this.playTone(175, 0.18, 'sawtooth', 0.08, 0.16);
    this.triggerHaptic(30);
  }

  public playHint(): void {
    this.playTone(659.25, 0.12, 'sine', 0, 0.22);
    this.playTone(987.77, 0.24, 'sine', 0.1, 0.24);
    this.triggerHaptic(15);
  }

  public playLevelComplete(): void {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, idx) => {
      this.playTone(n, 0.22, 'triangle', idx * 0.1, 0.3);
    });
    this.triggerHaptic([25, 40, 25, 40, 60]);
  }

  public playGameOver(): void {
    const notes = [392.0, 349.23, 329.63, 261.63];
    notes.forEach((n, idx) => {
      this.playTone(n, 0.22, 'sawtooth', idx * 0.12, 0.2);
    });
  }
}

export const soundService = new ArcadeSoundService();
