# WE DON'T LOSE 🔥

Manchester United unbeaten streak tracker. Vote on the next match. Confetti. Air horns. Glazers shade. The full experience.

**[manu-glory.ohmmingrath.com](https://manu-glory.ohmmingrath.com)**

---

## The Origin Story

Man Utd were extending their unbeaten streak under Michael Carrick. I was watching the games, getting hyped, and then I opened [Claude Code](https://claude.ai/claude-code) and typed:

> "i just got a stupid idea, i want to create web app that people can vote manu will win this match or not, and show the stat that manu not loss for how many match. just to show the glory of manchester united."

One session later, this exists.

The idea was simple — a giant number showing how many games we haven't lost, and a vote on whether we'd win the next one. Then it evolved. Stadium atmosphere. Meme copy. Confetti explosions. A scrolling marquee that says "GLAZERS COULD NEVER." Air horns. Emojis on every win. Shade on the ownership. The vibes took over and I let them.

From "stupid idea" to deployed on Cloudflare — all in one sitting. Carrick ball.

## What It Does

- 🔢 **Giant streak counter** that counts up dramatically (because we're dramatic)
- 🗳️ **Vote on whether United will win** the next match (spoiler: obviously yes)
- 📊 **Match history** with emoji reactions per game — 🔥💀😤🫡👑
- 🎊 **Confetti explosion** on page load (we celebrate everything)
- 📢 **Scrolling marquee** — "GLORY GLORY MAN UNITED ♦ GLAZERS COULD NEVER ♦ CARRICK'S AT THE WHEEL ♦ VIBES FC"
- 🔊 **Air horn + crowd roar** sound effects (muted by default, we're not animals)
- 🤡 **Glazers shade** throughout — "No losses, no Glazers, no problem"
- 🏆 **"ZERO. ZILCH. NADA. なし."** losses treatment
- 💬 **Rotating hype phrases** — "WE DON'T LOSE", "CARRICK BALL", "IT'S GIVING CHAMPIONS"
- 🎯 **Dynamic OG images** for social sharing — vote and share your prediction
- 📱 **Fully responsive** — looks great from mobile to desktop
- ♿ **Accessible** — respects `prefers-reduced-motion`, keyboard navigable, screen reader friendly

## The Vibes

**"Theatre of Dreams meets shitpost energy."**

The design direction is cinematic dark mode — Old Trafford at night, floodlight haze, floating particles, noise texture, scan lines. The kind of atmosphere that makes you feel like you're walking through the tunnel.

Then we layered meme energy on top. Impact font for hype moments. Glitch animation on "we never lost." Cheeky subtitles under the vote question ("obviously yes but we ask anyway"). Random taglines that rotate every page load ("Not even the Glazers can ruin this."). The site looks genuinely good but absolutely does not take itself seriously.

It's the web equivalent of celebrating a 1-0 win over Southampton like you just won the Champions League. And we wouldn't have it any other way.

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | [Next.js 16](https://nextjs.org) + React 19 |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Animations | [Motion](https://motion.dev) (Framer Motion) |
| Confetti | [canvas-confetti](https://www.npmjs.com/package/canvas-confetti) |
| Sound FX | Web Audio API (synthesized, no external files) |
| Database | [Supabase](https://supabase.com) (anonymous votes) |
| Football Data | [football-data.org](https://www.football-data.org/) API v4 |
| Hosting | [Cloudflare Workers](https://workers.cloudflare.com) via [@opennextjs/cloudflare](https://opennext.js.org/cloudflare) |
| Fonts | Anton, Oswald, DM Sans, JetBrains Mono, Black Ops One |

## Built With

Built in one session by [@mingrath](https://mingrath.com) + [Claude Code](https://claude.ai/claude-code).

From stupid idea to deployed in hours. Carrick ball. 🫡

## Getting Started

```bash
# Clone it
git clone https://github.com/mingrath/manu-glory.git
cd manu-glory

# Install deps
npm install

# Set up environment
cp .env.example .env.local
# Then fill in:
#   FOOTBALL_DATA_API_KEY=your_key_from_football-data.org
#   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
#   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
#   NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Run it
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and witness the glory.

### Deploy to Cloudflare

```bash
npx opennextjs-cloudflare build
npm run deploy
```

## Disclaimer

Not affiliated with Manchester United Football Club, the Premier League, or anyone with actual authority. Just a fan who refuses to acknowledge the concept of losing.

The data comes from [football-data.org](https://www.football-data.org/). The opinions come from pure delusion. The vibes are immaculate.

GGMU. 🔴
