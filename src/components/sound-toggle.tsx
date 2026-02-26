"use client";

import { createContext, useContext, useState, useCallback, useRef } from "react";

interface SoundContextType {
  enabled: boolean;
  toggle: () => void;
  playAirHorn: () => void;
  playCrowdRoar: () => void;
}

const SoundContext = createContext<SoundContextType>({
  enabled: false,
  toggle: () => {},
  playAirHorn: () => {},
  playCrowdRoar: () => {},
});

export function useSounds() {
  return useContext(SoundContext);
}

function createOscillatorSound(
  ctx: AudioContext,
  type: OscillatorType,
  freq: number,
  duration: number,
  gain: number
) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(gain, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    return ctxRef.current;
  }, []);

  const playAirHorn = useCallback(() => {
    if (!enabled) return;
    const ctx = getCtx();
    // Layered horn blast
    createOscillatorSound(ctx, "sawtooth", 440, 0.4, 0.15);
    createOscillatorSound(ctx, "sawtooth", 554, 0.4, 0.1);
    createOscillatorSound(ctx, "square", 330, 0.3, 0.08);
  }, [enabled, getCtx]);

  const playCrowdRoar = useCallback(() => {
    if (!enabled) return;
    const ctx = getCtx();
    // White noise burst simulating crowd
    const bufferSize = ctx.sampleRate * 1.5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.08, ctx.currentTime);
    g.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.3);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
    // Bandpass for crowd-like rumble
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 800;
    filter.Q.value = 0.5;
    source.connect(filter);
    filter.connect(g);
    g.connect(ctx.destination);
    source.start();
  }, [enabled, getCtx]);

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      if (next) {
        // Initialize audio context on first enable
        getCtx();
      }
      return next;
    });
  }, [getCtx]);

  return (
    <SoundContext value={{ enabled, toggle, playAirHorn, playCrowdRoar }}>
      {children}
    </SoundContext>
  );
}

export function SoundToggle() {
  const { enabled, toggle } = useSounds();

  return (
    <button
      onClick={toggle}
      className="fixed top-4 right-4 z-40 rounded-full border border-text-secondary/20 bg-surface/80 px-3 py-1.5 font-mono text-xs text-text-secondary backdrop-blur transition-all duration-200 hover:border-red/50 hover:text-text-primary"
      aria-label={enabled ? "Mute sounds" : "Enable sounds"}
    >
      {enabled ? "🔊 LOUD" : "🔇 MUTED"}
    </button>
  );
}
