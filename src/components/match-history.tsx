"use client";

import { motion, AnimatePresence } from "motion/react";
import type { MatchDisplay } from "@/lib/types";

interface MatchHistoryProps {
  matches: MatchDisplay[];
  lastUpdated: string;
}

const resultColors: Record<string, string> = {
  W: "border-l-win",
  D: "border-l-draw",
  L: "border-l-loss",
};

const WIN_EMOJIS = ["🔥", "💀", "😤", "🫡", "👑", "⚽", "🎯", "💪", "🏆", "✨"];
const DRAW_EMOJIS = ["🤷", "😐", "🤝", "💤"];

function getMatchEmoji(result: string, index: number): string {
  if (result === "W") return WIN_EMOJIS[index % WIN_EMOJIS.length];
  if (result === "D") return DRAW_EMOJIS[index % DRAW_EMOJIS.length];
  return "💀";
}

export function MatchHistory({ matches, lastUpdated }: MatchHistoryProps) {
  const visible = matches;

  const wins = matches.filter((m) => m.result === "W").length;
  const draws = matches.filter((m) => m.result === "D").length;

  const dateFormatter = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
  });

  const updatedDate = new Date(lastUpdated);
  const hoursAgo = Math.floor(
    (Date.now() - updatedDate.getTime()) / (1000 * 60 * 60)
  );
  const isStale = hoursAgo >= 2;

  const relativeFormatter = new Intl.RelativeTimeFormat("en", {
    style: "long",
  });

  return (
    <section className="mx-auto w-full max-w-lg px-4 py-16">
      <h3 className="mb-2 text-center font-impact text-lg uppercase tracking-[0.3em] text-text-secondary md:text-xl">
        The Streak 🏆
      </h3>

      {/* Stats summary bar */}
      <div className="mb-6 flex items-center justify-center gap-6">
        <div className="text-center">
          <span className="block font-display text-4xl text-text-primary">
            {matches.length}
          </span>
          <span className="font-body text-xs uppercase tracking-wider text-text-secondary">
            Unbeaten
          </span>
        </div>
        <div className="h-8 w-px bg-text-secondary/20" />
        <div className="text-center">
          <span className="block font-display text-4xl text-win">
            {wins}
          </span>
          <span className="font-body text-xs uppercase tracking-wider text-text-secondary">
            Wins 🔥
          </span>
        </div>
        <div className="h-8 w-px bg-text-secondary/20" />
        <div className="text-center">
          <span className="block font-display text-4xl text-draw">
            {draws}
          </span>
          <span className="font-body text-xs uppercase tracking-wider text-text-secondary">
            Draws 🤝
          </span>
        </div>
        <div className="h-8 w-px bg-text-secondary/20" />
        <div className="text-center">
          <span className="block font-display text-4xl text-text-primary">
            0
          </span>
          <span className="font-body text-xs uppercase tracking-wider text-text-secondary">
            Losses
          </span>
          {/* Meme treatment for zero losses */}
          <span className="mt-1 block font-mono text-[10px] text-gold/60">
            ZERO. ZILCH. NADA. なし.
          </span>
        </div>
      </div>

      {/* Win rate visual bar */}
      <div className="mb-8">
        <div className="flex h-3 w-full overflow-hidden rounded-full">
          <motion.div
            className="bg-win"
            initial={{ width: 0 }}
            animate={{ width: `${(wins / matches.length) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          />
          <motion.div
            className="bg-draw"
            initial={{ width: 0 }}
            animate={{ width: `${(draws / matches.length) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          />
        </div>
        <div className="mt-2 flex justify-between">
          <span className="font-mono text-xs text-win">
            {Math.round((wins / matches.length) * 100)}% WIN RATE (100% VIBES)
          </span>
          <span className="font-mono text-xs text-text-secondary">
            0% lost 💅
          </span>
        </div>
      </div>

      {isStale ? (
        <p className="mb-4 text-center font-body text-xs text-text-secondary">
          ⏱ Updated {relativeFormatter.format(-hoursAgo, "hour")}
        </p>
      ) : null}

      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {visible.map((match, i) => (
            <motion.div
              key={match.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: i * 0.05 }}
              className={`group flex items-center gap-3 rounded-lg border-l-4 px-4 py-3 ${resultColors[match.result]} ${
                match.result === "W"
                  ? "bg-win/[0.06] hover:bg-win/[0.1]"
                  : "bg-surface hover:bg-surface/80"
              } transition-[background-color] duration-200`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md font-mono text-xs font-bold ${
                  match.result === "W"
                    ? "bg-win/20 text-win"
                    : match.result === "D"
                      ? "bg-draw/20 text-draw"
                      : "bg-loss/20 text-loss"
                }`}
              >
                {match.result}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-body text-base font-medium text-text-primary">
                  {match.homeOrAway === "A" ? `${match.opponent} ` : ""}
                  <span className="font-mono">
                    {match.scoreHome}-{match.scoreAway}
                  </span>
                  {match.homeOrAway === "H" ? ` ${match.opponent}` : ""}
                </p>
              </div>
              <span className="shrink-0 text-base">
                {getMatchEmoji(match.result, i)}
              </span>
              <span className="shrink-0 font-body text-sm text-text-secondary">
                {dateFormatter.format(new Date(match.date))}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Glazers shade */}
      <motion.p
        className="mt-8 text-center font-body text-xs italic text-text-secondary/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        No losses, no Glazers, no problem 🤡
      </motion.p>
    </section>
  );
}
