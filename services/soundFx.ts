/**
 * ALPHAXEN CYBER-HAPTIC AUDIO ENGINE (Web Audio API)
 * Zero-Latency Futuristic Cyber Haptic Sound FX for Buttons, Toggles, Tabs & Typography Studio
 */

export type SoundType = 
  | 'click' 
  | 'pop' 
  | 'switch' 
  | 'tab' 
  | 'success' 
  | 'error' 
  | 'watermark' 
  | 'key' 
  | 'purchase';

class CyberHapticAudioEngine {
  private ctx: AudioContext | null = null;
  private isInitialized: boolean = false;
  private volume: number = 0.45;
  private muted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const savedMute = localStorage.getItem('alphaxen_sound_muted');
      if (savedMute === 'true') {
        this.muted = true;
      }
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('alphaxen_sound_muted', String(this.muted));
    }
    if (!this.muted) {
      this.play('pop');
    }
    return this.muted;
  }

  /**
   * Initializes or resumes the AudioContext on user interaction
   */
  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  /**
   * Dedicated Cyber Haptic Synthesizer
   */
  public play(type: SoundType = 'click'): void {
    // Physical micro-haptic impulse on touch devices (Android & Touch Web standard)
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        if (type === 'pop' || type === 'watermark') {
          navigator.vibrate(12);
        } else if (type === 'key') {
          navigator.vibrate(5);
        } else {
          navigator.vibrate(8);
        }
      } catch (_) {}
    }

    if (this.muted) return;

    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(this.volume, now);
      masterGain.connect(ctx.destination);

      switch (type) {
        case 'click': {
          // Sharp cyber haptic impulse with resonant micro-filter
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(1400, now);
          osc.frequency.exponentialRampToValueAtTime(320, now + 0.028);

          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(1200, now);
          filter.Q.setValueAtTime(3, now);

          gain.gain.setValueAtTime(0.7, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.028);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(masterGain);

          osc.start(now);
          osc.stop(now + 0.028);
          break;
        }

        case 'pop': {
          // Futuristic obsidian convex pop
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(520, now);
          osc.frequency.exponentialRampToValueAtTime(1850, now + 0.035);

          gain.gain.setValueAtTime(0.65, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start(now);
          osc.stop(now + 0.035);
          break;
        }

        case 'switch': {
          // High-frequency magnetic toggle snap
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, now);
          osc.frequency.exponentialRampToValueAtTime(1760, now + 0.022);

          gain.gain.setValueAtTime(0.6, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.022);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start(now);
          osc.stop(now + 0.022);
          break;
        }

        case 'tab': {
          // Cyber frequency glide
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(660, now);
          osc.frequency.exponentialRampToValueAtTime(990, now + 0.025);

          gain.gain.setValueAtTime(0.55, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start(now);
          osc.stop(now + 0.025);
          break;
        }

        case 'key': {
          // Cyber typewriter micro-tick for font tester
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'triangle';
          const freq = 1200 + Math.random() * 200;
          osc.frequency.setValueAtTime(freq, now);
          osc.frequency.exponentialRampToValueAtTime(280, now + 0.018);

          gain.gain.setValueAtTime(0.35, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.018);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start(now);
          osc.stop(now + 0.018);
          break;
        }

        case 'success':
        case 'purchase': {
          // Luminous cyber chord (3-stage ascending resonance)
          const freqs = [880, 1174.66, 1760]; // A5, D6, A6
          freqs.forEach((f, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, now + idx * 0.045);

            gain.gain.setValueAtTime(0, now);
            gain.gain.setValueAtTime(0.4 / (idx + 1), now + idx * 0.045);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.045 + 0.22);

            osc.connect(gain);
            gain.connect(masterGain);

            osc.start(now + idx * 0.045);
            osc.stop(now + idx * 0.045 + 0.22);
          });
          break;
        }

        case 'watermark': {
          // Holographic DRM security sweep
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.exponentialRampToValueAtTime(1760, now + 0.12);
          osc.frequency.exponentialRampToValueAtTime(880, now + 0.2);

          gain.gain.setValueAtTime(0.4, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start(now);
          osc.stop(now + 0.2);
          break;
        }

        case 'error': {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(220, now);
          osc.frequency.setValueAtTime(140, now + 0.06);

          gain.gain.setValueAtTime(0.35, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start(now);
          osc.stop(now + 0.15);
          break;
        }
      }
    } catch {
      // Safe fallback
    }
  }

  /**
   * Initializes global delegated listeners for ALL buttons and interactive controls across Alphaxen
   */
  public initGlobalListeners(): void {
    if (typeof window === 'undefined' || this.isInitialized) return;
    this.isInitialized = true;

    // Wake audio context on any early touch or pointer down
    const wakeAudio = () => {
      this.getAudioContext();
      window.removeEventListener('pointerdown', wakeAudio);
      window.removeEventListener('touchstart', wakeAudio);
    };
    window.addEventListener('pointerdown', wakeAudio, { passive: true });
    window.addEventListener('touchstart', wakeAudio, { passive: true });

    // Global Delegated Click Listener
    window.addEventListener(
      'click',
      (e: MouseEvent) => {
        const target = e.target as HTMLElement | null;
        if (!target) return;

        // Check for any interactive element or container
        const interactive = target.closest<HTMLElement>(
          'button, a, [role="button"], input[type="button"], input[type="submit"], input[type="radio"], input[type="checkbox"], select, .neu-convex-btn, .neu-btn, [data-sound], .cursor-pointer'
        );

        if (!interactive) return;

        // Explicit override
        const explicitSound = interactive.getAttribute('data-sound') as SoundType | 'none' | null;
        if (explicitSound === 'none') return;

        if (explicitSound && ['click', 'pop', 'switch', 'tab', 'success', 'error', 'watermark', 'key', 'purchase'].includes(explicitSound)) {
          this.play(explicitSound as SoundType);
          return;
        }

        // Automatic category detection for cyber haptic feel
        const isTab = interactive.getAttribute('role') === 'tab' || interactive.classList.contains('tab-btn');
        const isToggle = interactive.getAttribute('type') === 'checkbox' || interactive.getAttribute('role') === 'switch';
        const isPrimary = interactive.classList.contains('bg-purple-600') || interactive.classList.contains('neu-btn-primary');
        const isSpecialAction = interactive.innerText && (
          interactive.innerText.toLowerCase().includes('license') || 
          interactive.innerText.toLowerCase().includes('open') ||
          interactive.innerText.toLowerCase().includes('inspect') ||
          interactive.innerText.toLowerCase().includes('send')
        );

        if (isSpecialAction || isPrimary) {
          this.play('pop');
        } else if (isTab) {
          this.play('tab');
        } else if (isToggle) {
          this.play('switch');
        } else {
          this.play('click');
        }
      },
      { capture: true, passive: true }
    );

    // Typing sound for font waterfall tester & inputs
    window.addEventListener(
      'keydown',
      (e: KeyboardEvent) => {
        const target = e.target as HTMLElement | null;
        if (!target) return;

        if (
          target.tagName === 'INPUT' || 
          target.tagName === 'TEXTAREA' || 
          target.isContentEditable
        ) {
          if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key)) return;
          this.play('key');
        }
      },
      { passive: true }
    );
  }
}

export const soundFx = new CyberHapticAudioEngine();
