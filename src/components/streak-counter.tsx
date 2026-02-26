"use client";

import { useEffect, useRef } from "react";
import { animate, useMotionValue, useTransform, motion } from "motion/react";

interface CarrickStats {
  wins: number;
  draws: number;
  losses: number;
  matches: number;
}

interface StreakCounterProps {
  streak: number;
  tagline?: string;
  carrick?: CarrickStats;
}

export function StreakCounter({ streak, tagline, carrick }: StreakCounterProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const displayRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      count.set(streak);
      return;
    }

    const controls = animate(count, streak, {
      duration: 1.5,
      ease: "easeOut",
    });

    return () => controls.stop();
  }, [count, streak]);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (v) => {
      if (displayRef.current) {
        displayRef.current.textContent = String(v);
      }
    });
    return () => unsubscribe();
  }, [rounded]);

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-4">
      {/* Floodlight haze */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(227,27,35,0.05) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <h1 className="relative z-10 text-center">
        <span className="block font-heading text-sm uppercase tracking-[0.3em] text-text-secondary md:text-base">
          Unbeaten Streak
        </span>
        <motion.span
          ref={displayRef}
          className="mt-2 block font-display text-[96px] leading-none text-text-primary md:text-[180px]"
          style={{
            textShadow: "0 0 120px rgba(227,27,35,0.3)",
            fontVariantNumeric: "tabular-nums",
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {streak}
        </motion.span>
        <span className="block font-heading text-sm uppercase tracking-[0.3em] text-text-secondary md:text-base">
          Matches
        </span>
      </h1>

      {tagline ? (
        <p className="relative z-10 mt-6 rounded-full border border-gold/30 px-4 py-1.5 font-body text-xs text-text-secondary md:text-sm">
          {tagline}
        </p>
      ) : null}

      {/* Carrick era callout */}
      {carrick ? (
        <motion.div
          className="relative z-10 mt-8 flex flex-col items-center gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
        >
          <div className="h-px w-16 bg-gold/30" />
          <p className="max-w-xs text-center font-heading text-sm uppercase tracking-wider text-text-primary md:text-base">
            Since Michael Carrick took charge,{" "}
            <span className="text-gold">we never lost</span>
          </p>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-win">{carrick.wins}W</span>
            <span className="font-mono text-xs text-draw">{carrick.draws}D</span>
            <span className="font-mono text-xs text-loss">{carrick.losses}L</span>
            <span className="font-mono text-xs text-text-secondary">
              in {carrick.matches} matches
            </span>
          </div>
          <p className="mt-1 font-body text-xs italic text-text-secondary/50 md:text-sm">
            This is our time.
          </p>
        </motion.div>
      ) : null}

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-text-secondary/50"
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </motion.div>
    </section>
  );
}
