"use client";

import { SoundProvider, SoundToggle } from "./sound-toggle";

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SoundProvider>
      <SoundToggle />
      {children}
    </SoundProvider>
  );
}
