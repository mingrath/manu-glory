export function Marquee() {
  const phrases = [
    "GLORY GLORY MAN UNITED",
    "GLAZERS COULD NEVER",
    "CARRICK'S AT THE WHEEL",
    "VIBES FC",
    "WE GO AGAIN",
    "BUILT DIFFERENT",
    "THE THEATRE OF MEMES",
    "WE DON'T LOSE",
  ];

  const separator = " ♦ ";
  const text = phrases.join(separator) + separator;

  return (
    <div className="relative z-10 overflow-hidden border-y border-red/30 bg-red/10 py-2">
      <div className="animate-marquee flex whitespace-nowrap">
        <span className="font-impact text-sm uppercase tracking-wider text-red md:text-base">
          {text}
        </span>
        <span className="font-impact text-sm uppercase tracking-wider text-red md:text-base">
          {text}
        </span>
      </div>
    </div>
  );
}
