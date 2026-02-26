import Image from "next/image";

export function Footer() {
  return (
    <>
      <footer className="pb-[env(safe-area-inset-bottom)] pt-16">
        <div className="flex flex-col items-center gap-3 px-4 pb-8">
          <Image
            src="/crest.svg"
            alt="Manchester United"
            width={32}
            height={32}
            className="h-8 w-8 opacity-40"
          />
          <p className="font-heading text-base uppercase tracking-[0.3em] text-text-secondary/40">
            Glory Glory Man United
          </p>
          <p className="font-body text-sm text-text-secondary">
            Built for the faithful.
          </p>
          <p className="font-body text-sm text-text-secondary">
            Data from{" "}
            <a
              href="https://www.football-data.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline transition-[color] duration-200 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              football-data.org
            </a>
          </p>
        </div>
      </footer>

      {/* Fixed broadcast-style watermark */}
      <a
        href="https://mingrath.com"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 z-40 pb-[env(safe-area-inset-bottom)] font-body text-xs uppercase tracking-wider text-text-secondary/30 transition-[color,opacity] duration-200 hover:text-text-primary/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      >
        Built by mingrath.com
      </a>
    </>
  );
}
