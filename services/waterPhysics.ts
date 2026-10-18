/**
 * ALPHAXEN ADVANCED WATER PHYSICS & LIQUID INTERACTION ENGINE
 * 
 * Implements 7 Creative Liquid Features:
 * 1. Interactive Cursor Liquid Displacement (Elastic Surface Tension & 3D Highlight Parallax)
 * 2. Prismatic Optical Refraction & Chromatic Fringe Dispersion
 * 3. Internal Floating Glass Micro-Bubbles (Brownian Hydrodynamic Motion)
 * 4. Sunlight Underwater Caustic Mesh
 * 5. Keyboard Typing Resonance (Real-time Fluid Ripple on Keystroke)
 * 6. Mobile Gyroscope Gravity Tilt (Orientation Responsive Liquid Level)
 * 7. Click Splash Wave & Damped Elastic Springback
 */

import { soundFx } from './soundFx';

class WaterPhysicsEngine {
  private isInitialized = false;
  private rafId: number | null = null;
  private activeElement: HTMLElement | null = null;
  private targetPullX = 0;
  private targetPullY = 0;
  private currentPullX = 0;
  private currentPullY = 0;
  private gyroX = 0;
  private gyroY = 0;
  private observer: MutationObserver | null = null;
  private keyPulseTimeout: ReturnType<typeof setTimeout> | null = null;
  private isScrolling = false;
  private scrollResetTimer: ReturnType<typeof setTimeout> | null = null;

  public init(): void {
    if (this.isInitialized || typeof window === 'undefined') return;
    this.isInitialized = true;

    // 1. Initial Injection of Micro-Bubbles & Caustics
    this.injectAllBubbles();

    // 2. MutationObserver to automatically equip newly rendered catalog font cards
    this.setupMutationObserver();

    // 3. Pointer Move & Surface Tension Pull (Desktop Mouse Only)
    window.addEventListener('pointermove', this.handlePointerMove, { passive: true });
    window.addEventListener('click', this.handleClick, { passive: true });

    // 4. Keyboard Typing Resonance on Inputs/Textareas
    window.addEventListener('keydown', this.handleKeyDown, { passive: true });

    // 5. Mobile Gyroscope Gravity Tilt
    this.setupGyroscope();

    // 6. Active Scroll Detection - Yields 100% frame rate to scroll compositor
    window.addEventListener('scroll', this.handleScroll, { passive: true });

    // 7. Start Physics Animation Loop
    this.startLoop();
  }

  /**
   * Automatically equips any waterball container with internal floating bubbles and caustics
   */
  public injectAllBubbles(root: ParentNode = document): void {
    const waterboxSelector = `
      .waterbox,
      .waterbox-stage,
      .waterbox-waterfall,
      .waterbox-lava,
      .waterbox-oceanic,
      .waterbox-violet,
      .waterbox-honey,
      .molten-master-box,
      .molten-lava-box,
      .molten-oceanic-box,
      .molten-violet-box,
      .molten-honey-box
    `;

    const elements = root.querySelectorAll<HTMLElement>(waterboxSelector);
    elements.forEach((el) => {
      if (!el.querySelector('.water-bubble-host')) {
        const host = document.createElement('div');
        host.className = 'water-bubble-host';
        host.setAttribute('aria-hidden', 'true');
        host.innerHTML = `
          <span class="water-bubble wb-1"></span>
          <span class="water-bubble wb-2"></span>
          <span class="water-bubble wb-3"></span>
          <span class="water-bubble wb-4"></span>
          <span class="water-caustic-layer"></span>
        `;
        el.insertBefore(host, el.firstChild);
      }
    });
  }

  private setupMutationObserver(): void {
    if (typeof MutationObserver === 'undefined') return;

    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    this.observer = new MutationObserver(() => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        this.injectAllBubbles();
      }, 150);
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  private handleScroll = (): void => {
    this.isScrolling = true;
    if (this.scrollResetTimer) clearTimeout(this.scrollResetTimer);
    this.scrollResetTimer = setTimeout(() => {
      this.isScrolling = false;
    }, 120);
  };

  /**
   * Feature 1: Cursor Surface Tension Pull & 3D Highlight Parallax
   */
  private handlePointerMove = (e: PointerEvent): void => {
    // On touch devices or active scrolling, skip hover calculations so touch scrolling is 100% free and native
    if (e.pointerType === 'touch' || this.isScrolling) return;

    const target = (e.target as HTMLElement)?.closest<HTMLElement>(`
      .waterbox,
      .waterbox-stage,
      .waterbox-waterfall,
      .waterbox-lava,
      .waterbox-oceanic,
      .waterbox-violet,
      .waterbox-honey,
      .molten-master-box,
      .molten-lava-box,
      .molten-oceanic-box,
      .molten-violet-box,
      .molten-honey-box
    `);

    if (target) {
      if (this.activeElement && this.activeElement !== target) {
        this.resetElement(this.activeElement);
      }
      this.activeElement = target;

      const rect = target.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) - 0.5; // -0.5 to +0.5
      const normY = ((e.clientY - rect.top) / rect.height) - 0.5;

      this.targetPullX = Math.max(-0.5, Math.min(0.5, normX));
      this.targetPullY = Math.max(-0.5, Math.min(0.5, normY));
    } else if (this.activeElement) {
      this.resetElement(this.activeElement);
      this.activeElement = null;
      this.targetPullX = 0;
      this.targetPullY = 0;
    }
  };

  /**
   * Feature 7: Click/Tap Splash Wave & Damped Elastic Springback
   * Uses standard 'click' event so it ONLY triggers on intentional taps, NEVER during mobile scroll swipes!
   */
  private handleClick = (e: MouseEvent): void => {
    if (this.isScrolling) return;

    // Do not trigger splash if clicking an interactive control
    if ((e.target as HTMLElement)?.closest('button, a, input, select, textarea, label')) return;

    const target = (e.target as HTMLElement)?.closest<HTMLElement>(`
      .waterbox,
      .waterbox-stage,
      .waterbox-waterfall,
      .waterbox-lava,
      .waterbox-oceanic,
      .waterbox-violet,
      .waterbox-honey,
      .molten-master-box,
      .molten-lava-box,
      .molten-oceanic-box,
      .molten-violet-box,
      .molten-honey-box
    `);

    if (!target) return;

    // 1. Trigger concentric liquid splash wave ring
    const rect = target.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const ring = document.createElement('span');
    ring.className = 'water-splash-ring';
    ring.style.left = `${clickX}px`;
    ring.style.top = `${clickY}px`;
    target.appendChild(ring);

    // 2. Trigger elastic liquid springback via animation frame (no synchronous layout thrashing)
    target.classList.remove('water-spring-bounce');
    requestAnimationFrame(() => {
      target.classList.add('water-spring-bounce');
    });

    // 3. Subtle organic water drop haptic audio
    soundFx.play('watermark');

    // Clean up splash ring after animation finishes
    setTimeout(() => {
      ring.remove();
    }, 800);

    setTimeout(() => {
      target.classList.remove('water-spring-bounce');
    }, 700);
  };

  /**
   * Feature 5: Keyboard Typing Resonance (Real-time Fluid Ripple on Keystroke)
   */
  private handleKeyDown = (e: KeyboardEvent): void => {
    // Only react to active typing in inputs or textareas
    const activeEl = document.activeElement;
    const isTyping = activeEl && (
      activeEl.tagName === 'INPUT' || 
      activeEl.tagName === 'TEXTAREA' || 
      activeEl.getAttribute('contenteditable') === 'true'
    );

    if (!isTyping) return;
    if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt') return;

    // Trigger resonance pulse on visible waterboxes
    const visibleWaterboxes = document.querySelectorAll<HTMLElement>(`
      .waterbox,
      .waterbox-stage,
      .waterbox-waterfall,
      .molten-master-box
    `);

    visibleWaterboxes.forEach((wb) => {
      wb.classList.add('water-typing-resonance');
    });

    if (this.keyPulseTimeout) clearTimeout(this.keyPulseTimeout);
    this.keyPulseTimeout = setTimeout(() => {
      visibleWaterboxes.forEach((wb) => {
        wb.classList.remove('water-typing-resonance');
      });
    }, 450);
  };

  /**
   * Feature 6: Mobile Gyroscope Gravity Tilt
   */
  private setupGyroscope(): void {
    if (typeof window === 'undefined') return;

    try {
      if (!('DeviceOrientationEvent' in window)) return;

      const onDeviceOrientation = (e: DeviceOrientationEvent) => {
        try {
          if (e.gamma !== null && e.beta !== null) {
            // gamma: left-to-right (-90 to 90) -> clamp to -15..15
            // beta: front-to-back (-180 to 180) -> clamp to -15..15
            const clampedGamma = Math.max(-15, Math.min(15, e.gamma));
            const clampedBeta = Math.max(-15, Math.min(15, e.beta - 45)); // assume ~45deg phone holding angle

            this.gyroX = clampedGamma * 0.4;
            this.gyroY = clampedBeta * 0.4;

            document.documentElement.style.setProperty('--gyro-x', `${this.gyroX.toFixed(2)}px`);
            document.documentElement.style.setProperty('--gyro-y', `${this.gyroY.toFixed(2)}px`);
          }
        } catch (_) {}
      };

      window.addEventListener('deviceorientation', onDeviceOrientation, { passive: true });
    } catch (_) {}
  }

  private resetElement(el: HTMLElement): void {
    el.style.setProperty('--pull-x', '0');
    el.style.setProperty('--pull-y', '0');
  }

  /**
   * Smooth physics damping loop for elastic cursor pull
   */
  private startLoop = (): void => {
    const updatePhysics = () => {
      if (this.activeElement) {
        this.currentPullX += (this.targetPullX - this.currentPullX) * 0.14;
        this.currentPullY += (this.targetPullY - this.currentPullY) * 0.14;

        this.activeElement.style.setProperty('--pull-x', this.currentPullX.toFixed(4));
        this.activeElement.style.setProperty('--pull-y', this.currentPullY.toFixed(4));
      }

      this.rafId = requestAnimationFrame(updatePhysics);
    };

    this.rafId = requestAnimationFrame(updatePhysics);
  };

  public destroy(): void {
    if (!this.isInitialized) return;
    this.isInitialized = false;

    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (this.observer) this.observer.disconnect();

    window.removeEventListener('pointermove', this.handlePointerMove);
    window.removeEventListener('click', this.handleClick);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('scroll', this.handleScroll);
  }
}

export const waterPhysics = new WaterPhysicsEngine();
