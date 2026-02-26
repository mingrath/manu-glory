# Man Utd Voting Microsite — Design Document

## Overview

A viral single-page microsite where fans vote on whether Manchester United will win their next match, featuring a live unbeaten streak counter as the hero. Visual direction: "Theatre of Dreams — Broadcast Night" — cinematic, dark, floodlit Old Trafford atmosphere.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 (App Router, React 19) |
| Styling | Tailwind CSS v4 + CSS variables |
| Animations | Motion (Framer Motion) — dynamic import |
| Backend | Supabase (votes table only) |
| Football Data | football-data.org free API via ISR (revalidate: 3600) |
| OG Images | `@vercel/og` (Satori, edge-rendered) |
| Deployment | Vercel (free tier + custom domain) |
| Vote Dedup | localStorage (casual, no auth) |

## Architecture

### Data Flow

```
Server Component (ISR, 1hr revalidate)
  ├─ Promise.all([
  │    footballAPI.getMatches(),
  │    supabase.getVoteCounts()
  │  ])
  ├─ calculateStreak(results)
  ├─ Render static shell (Hero + Match History)
  └─ <Suspense fallback={<VoteSkeleton />}>
       <VoteSection />  ← client component, lazy-loaded
     </Suspense>
```

### Vote Flow

1. User taps YES/NO
2. Check localStorage (already voted for this match?)
3. If new: POST /api/vote { matchId, vote }
4. Edge Function → Supabase insert → return updated counts
5. Animate result bar
6. Set localStorage voted flag
7. OG share URL: /?vote=yes&match=CRY

### Supabase Schema

```sql
CREATE TABLE votes (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id   TEXT NOT NULL,
  vote       TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_votes_match ON votes(match_id);
```

### Failure Modes

- **football-data.org down**: ISR serves last cached build. Show "Updated 2h ago" badge when data is stale. Voting unaffected.
- **Supabase down**: Vote buttons render normally. On click failure: inline "Couldn't register your vote. Tap to try again." No modals, no page break.
- **Zero votes**: "Be the first to vote" empty state with gold pulse glow.

## Visual Identity

### Typography

| Role | Font | Size Desktop/Mobile |
|------|------|---------------------|
| Streak number | Anton | 180px / 96px |
| Headlines | Oswald 700, uppercase | 32px / 24px |
| Body / labels | DM Sans 400/500 | 16px / 14px |
| Vote counter | JetBrains Mono 500, tabular-nums | 20px / 16px |

All headings: `text-wrap: balance`

### Color System

```css
--bg:             #0A0A0F;   /* near-black, blue undertone */
--surface:        #141420;   /* dark navy-charcoal */
--red:            #E31B23;   /* Man Utd red — used sparingly */
--red-glow:       #FF2D37;   /* bloom effects only */
--gold:           #D4A843;   /* aged trophy gold */
--text-primary:   #F0EDE6;   /* warm off-white, floodlight color */
--text-secondary: #6B6B7B;   /* muted lavender-grey */
--win:            #22C55E;
--draw:           #F59E0B;
--loss:           #EF4444;
```

Red is an accent, not a background. It appears only on: YES vote button, streak counter glow aura, active/focus states.

### Atmosphere Layers

1. Solid `--bg` base
2. Radial gradient: `--red` at 5% opacity from center top (floodlight haze)
3. CSS noise texture: `mix-blend-mode: soft-light`, opacity 0.03 (film grain)
4. Repeating horizontal scan lines at 2% opacity (broadcast feel)
5. 12-15 floating particles via CSS `@keyframes` (translate3d + opacity only). Disabled for `prefers-reduced-motion: reduce`.

## Page Sections

### A: Hero — Streak Counter

- `<h1>` wraps "6 MATCHES UNBEATEN"
- Streak number: Anton 180px, counting-up animation (Motion useMotionValue), 0 → N over 1.5s
- Red glow: `box-shadow: 0 0 120px rgba(227,27,35,0.3)`
- Badge: "Only unbeaten side in the PL in 2026" — pill shape, gold border at 30% opacity
- Scroll indicator: subtle bounce animation
- `prefers-reduced-motion`: number instant, no glow pulse

### B: Vote Section

- `<h2>` "Will United Beat Crystal Palace?"
- Two `<button>` elements: "YES, WE WIN" (bg: --red) and "NOT TODAY" (bg: --surface)
- `aria-label` on each, `touch-action: manipulation`
- `transition: transform 200ms, box-shadow 200ms` (explicit, never "all")
- `focus-visible:ring-2 ring-offset-2 ring-[--red]`
- Mobile: buttons stack vertically, full-width
- During API call: spinner replaces text → "Voting…", both buttons disabled

**After vote**: animated result bar (transform: scaleX from 0), JetBrains Mono percentages, vote count via Intl.NumberFormat, share button. `aria-live="polite"` announces result.

**Empty state**: "BE THE FIRST TO VOTE" — Oswald, gold, subtle pulse. Motivating copy below.

**Error state**: inline message, no modal. "Couldn't register your vote. Tap to try again."

### C: Match History

- `<h3>` "THE STREAK"
- Shows 3 most recent matches by default as a vertical list
- Each row: result badge (W/D/L with color border-left), opponent + score, date (Intl.DateTimeFormat)
- "Show All 6 Matches" expand button — Motion layout animation, vertically
- Opponent names: `truncate` with `text-overflow: ellipsis`
- Stale data badge: "Updated 2h ago" via Intl.RelativeTimeFormat when ISR data > 2hrs

### D: Footer

- "GLORY GLORY MAN UNITED" — Oswald 400, text-secondary at 40% opacity, letter-spacing: 0.3em
- "Built for the faithful." — DM Sans
- "Data from football-data.org" — `<a>` link

### OG Image

- 1200x630px via `@vercel/og`
- Same dark theme with radial red glow
- Shows: streak count (Anton), vote choice, opponent, fan agreement %, site URL
- URL: `/api/og?vote=yes&streak=6&opponent=Crystal+Palace&pct=78`

## Accessibility & Performance Compliance

### Web Interface Guidelines — All Pass

- Semantic HTML (button, a, main, section, footer, h1-h3)
- aria-label, aria-live, skip link
- prefers-reduced-motion honored
- Only transform + opacity animated, explicit transitions
- tabular-nums, text-wrap: balance
- color-scheme: dark, theme-color meta
- touch-action: manipulation, focus-visible rings
- Intl.NumberFormat, Intl.DateTimeFormat, Intl.RelativeTimeFormat
- Curly quotes, ellipsis character
- overscroll-behavior: contain, safe-area-inset
- Empty state, error state, loading spinner

### Vercel React Best Practices — All Pass

- async-parallel: Promise.all for data fetching
- async-suspense-boundaries: vote section in Suspense
- bundle-dynamic-imports: Motion, VoteSection lazy-loaded
- server-serialization: minimal props to client
- rendering-hoist-jsx: static elements outside components
- rendering-conditional-render: ternary not &&
- rerender-functional-setstate: vote state updater
- client-localstorage-schema: versioned vote key
