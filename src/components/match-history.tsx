"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { MatchDisplay } from "@/lib/types";

interface MatchHistoryProps {
  matches: MatchDisplay[];
  lastUpdated: string;
}

const INITIAL_SHOW = 3;

const resultColors: Record<string, string> = {
  W: "border-l-win",
  D: "border-l-draw",
  L: "border-l-loss",
};

export function MatchHistory({ matches, lastUpdated }: MatchHistoryProps) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? matches : matches.slice(0, INITIAL_SHOW);

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
    <section className="mx-auto w-full max-w-md px-4 py-16">
      <h3 className="mb-6 text-center font-heading text-sm uppercase tracking-[0.3em] text-text-secondary">
        The Streak
      </h3>

      {isStale ? (
        <p className="mb-4 text-center font-body text-xs text-text-secondary">
          ⏱ Updated {relativeFormatter.format(-hoursAgo, "hour")}
        </p>
      ) : null}

      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {visible.map((match) => (
            <motion.div
              key={match.id}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`flex items-center gap-3 rounded-lg border-l-4 bg-surface px-4 py-3 ${resultColors[match.result]}`}
            >
              <span
                className={`font-mono text-xs font-bold ${
                  match.result === "W"
                    ? "text-win"
                    : match.result === "D"
                      ? "text-draw"
                      : "text-loss"
                }`}
              >
                {match.result}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-body text-sm text-text-primary">
                  {match.homeOrAway === "A" ? `${match.opponent} ` : ""}
                  {match.scoreHome}-{match.scoreAway}
                  {match.homeOrAway === "H" ? ` ${match.opponent}` : ""}
                </p>
              </div>
              <span className="shrink-0 font-body text-xs text-text-secondary">
                {dateFormatter.format(new Date(match.date))}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {matches.length > INITIAL_SHOW ? (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="mx-auto mt-4 block font-body text-sm text-text-secondary transition-[color] duration-200 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          style={{ touchAction: "manipulation" }}
        >
          {expanded
            ? "Show Less ▴"
            : `Show All ${matches.length} Matches ▾`}
        </button>
      ) : null}
    </section>
  );
}
