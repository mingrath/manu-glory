"use client";

import { motion } from "motion/react";

interface VoteResultBarProps {
  yes: number;
  no: number;
}

export function VoteResultBar({ yes, no }: VoteResultBarProps) {
  const total = yes + no;
  const yesPercent = total > 0 ? Math.round((yes / total) * 100) : 0;
  const noPercent = total > 0 ? 100 - yesPercent : 0;

  const formatter = new Intl.NumberFormat("en-GB");

  return (
    <div aria-live="polite" className="w-full max-w-md space-y-3">
      <div className="relative h-10 w-full overflow-hidden rounded-lg bg-surface">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-lg bg-red"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: yesPercent / 100 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ transformOrigin: "left", width: "100%" }}
        />
        <div className="relative z-10 flex h-full items-center justify-between px-3">
          <span className="font-mono text-sm font-medium text-text-primary">
            YES {yesPercent}%
          </span>
          <span className="font-mono text-sm font-medium text-text-primary">
            NO {noPercent}%
          </span>
        </div>
      </div>
      <p className="text-center font-body text-sm text-text-secondary">
        {formatter.format(total)} fans have voted
      </p>
    </div>
  );
}
