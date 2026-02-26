export function Footer() {
  return (
    <footer className="pb-[env(safe-area-inset-bottom)] pt-16">
      <div className="flex flex-col items-center gap-3 px-4 pb-8">
        <p className="font-heading text-sm uppercase tracking-[0.3em] text-text-secondary/40">
          Glory Glory Man United
        </p>
        <p className="font-body text-xs text-text-secondary">
          Built for the faithful.
        </p>
        <p className="font-body text-xs text-text-secondary">
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
  );
}
