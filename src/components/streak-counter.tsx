"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { animate, useMotionValue, useTransform, motion } from "motion/react";
import confetti from "canvas-confetti";
import { useSounds } from "./sound-toggle";

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

const HYPE_PHRASES = [
  "WE DON'T LOSE",
  "CARRICK BALL",
  "VIBES FC",
  "IT'S GIVING CHAMPIONS",
  "FEAR THE STREAK",
  "UNSTOPPABLE",
  "DIFFERENT GRAVY",
  "WE GO AGAIN",
];

const RANDOM_TAGLINES = [
  "Carrick ball.",
  "We go again.",
  "Vibes FC, innit.",
  "Amorim could never.",
  "The Theatre of Memes.",
  "Sir Alex is smiling somewhere.",
  "They doubted us. They were wrong.",
  "This is what peak performance looks like.",
  "Not even the Glazers can ruin this.",
  "Built different (unlike our ownership).",
];

export function StreakCounter({ streak, tagline, carrick }: StreakCounterProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const displayRef = useRef<HTMLSpanElement>(null);
  const [hypePhrase, setHypePhrase] = useState(HYPE_PHRASES[0]);
  const [randomTagline, setRandomTagline] = useState(RANDOM_TAGLINES[0]);
  const [confettiFired, setConfettiFired] = useState(false);
  const { playCrowdRoar } = useSounds();

  // Pick random phrases on mount (client only)
  useEffect(() => {
    setHypePhrase(HYPE_PHRASES[Math.floor(Math.random() * HYPE_PHRASES.length)]);
    setRandomTagline(RANDOM_TAGLINES[Math.floor(Math.random() * RANDOM_TAGLINES.length)]);
  }, []);

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
      onComplete: () => {
        if (!confettiFired) {
          // Red + gold confetti explosion
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.5 },
            colors: ["#E31B23", "#D4A843", "#FF2D37", "#F0EDE6"],
          });
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ["#E31B23", "#D4A843"],
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ["#E31B23", "#D4A843"],
          });
          setConfettiFired(true);
          playCrowdRoar();
        }
      },
    });

    return () => controls.stop();
  }, [count, streak, confettiFired, playCrowdRoar]);

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
      {/* Floodlight haze — Old Trafford at night */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse 60% 40% at 50% 30%, rgba(227,27,35,0.1) 0%, transparent 70%)",
            "radial-gradient(circle at 20% 20%, rgba(227,27,35,0.04) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 20%, rgba(227,27,35,0.04) 0%, transparent 50%)",
          ].join(", "),
        }}
        aria-hidden="true"
      />

      {/* Large crest watermark behind the streak number */}
      <motion.div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        aria-hidden="true"
      >
        <Image
          src="/crest.svg"
          alt=""
          width={400}
          height={400}
          className="h-[300px] w-[300px] opacity-[0.04] md:h-[500px] md:w-[500px]"
          priority
        />
      </motion.div>

      <h1 className="relative z-10 text-center">
        {/* Small crest above the title */}
        <motion.span
          className="mb-4 flex justify-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Image
            src="/crest.svg"
            alt="Manchester United"
            width={48}
            height={48}
            className="h-10 w-10 md:h-12 md:w-12"
            priority
          />
        </motion.span>

        {/* Hype phrase in Impact font instead of boring "Unbeaten Streak" */}
        <motion.span
          className="block font-impact text-lg uppercase tracking-wider text-red md:text-2xl"
          initial={{ opacity: 0, scale: 1.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3, type: "spring", stiffness: 200 }}
        >
          {hypePhrase}
        </motion.span>

        <motion.span
          ref={displayRef}
          className="mt-2 block font-display text-[120px] leading-none text-text-primary md:text-[220px]"
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

        <span className="block font-impact text-base uppercase tracking-widest text-text-secondary md:text-lg">
          GAMES WITHOUT KNOWING DEFEAT
        </span>
      </h1>

      {tagline ? (
        <p className="relative z-10 mt-6 rounded-full border border-gold/30 px-5 py-2 font-body text-sm text-text-secondary md:text-base">
          {tagline}
        </p>
      ) : null}

      {/* Random meme tagline */}
      <motion.p
        className="relative z-10 mt-3 font-body text-sm italic text-gold/70 md:text-base"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        &ldquo;{randomTagline}&rdquo;
      </motion.p>

      {/* Carrick era callout */}
      {carrick ? (
        <motion.div
          className="relative z-10 mt-8 flex flex-col items-center gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
        >
          <div className="h-px w-16 bg-gold/30" />
          <p className="max-w-sm text-center font-heading text-base uppercase tracking-wider text-text-primary md:text-lg">
            Since Michael Carrick took charge,{" "}
            <span className="animate-glitch inline-block text-gold">
              we never lost
            </span>
          </p>
          <div className="flex items-center gap-4">
            <span className="font-mono text-sm text-win">{carrick.wins}W 🔥</span>
            <span className="font-mono text-sm text-draw">{carrick.draws}D 🤷</span>
            <span className="font-mono text-sm text-loss">{carrick.losses}L 💀</span>
            <span className="font-mono text-sm text-text-secondary">
              in {carrick.matches} matches
            </span>
          </div>
          <p className="mt-1 font-impact text-sm uppercase text-text-secondary/50 md:text-base">
            This is our time. 🫡
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
