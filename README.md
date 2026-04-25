# Morello

> Premium League of Legends performance analytics.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3-38BDF8?logo=tailwindcss)
![React Query](https://img.shields.io/badge/TanStack_Query-5-FF4154)
![Riot API](https://img.shields.io/badge/Riot_API-v5-D32936)

### Landing page
![Landing page](docs/landing.png)

### Summoner overview
![Summoner overview](docs/summoner-overview.png)

---

## Overview

Morello is a full-stack League of Legends analytics platform built with Next.js 14 and the Riot Games API. It goes beyond raw stat dumps — the goal was to build something that turns messy third-party match data into clear, contextual, coaching-level insights.

Most stat sites either bury you in numbers or feel like a spreadsheet someone styled at 2am. Morello is opinionated about what matters: not just *what* happened in a game, but *why*, and *what to do about it*.

---

## Features

- **Search any Riot ID** across all supported League of Legends platforms (NA, EUW, KR, and more)
- **Ranked overview** — Solo/Duo and Flex rank, LP, win rate, and recent form in a single glance
- **Live game detection** — polls the spectator API every 30 seconds and surfaces mode, champion, and elapsed time when active
- **Filterable match history** — filter by champion and queue; expandable cards with full 10-player breakdowns
- **Explainable match performance** — deterministic, stat-based reasons for why a game was won or lost
- **Performance badges** — MVP, Carry, Vision Leader, and more, derived from match data
- **KDA trend sparkline** — rolling KDA trend across visible matches
- **Session insights** — aggregate performance summary over the currently loaded match window
- **Champion & role analysis** — champion pool breadth, role splits, matchup tendencies, and game-length performance curves
- **Win vs loss breakdown** — side-by-side stat comparison showing how KDA, CS, vision, and objective control shift between outcomes
- **Champion mastery trends** — mastery progression over time for frequently played champions
- **Compare mode** — search a second summoner and compare recent form, rank, and champion pool side by side
- **Scouting report** — high-level matchup and tendencies card designed for pre-game research
- **Paginated match loading** — load deeper match history beyond the initial batch
- **Recent searches & favorites** — locally persisted profile shortcuts for fast revisit
- **Profile snapshot** — shareable, export-style summary panel
- **Graceful degradation** — spectator data and optional API endpoints fail soft without breaking the page

---

## Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 14 App Router | SSR, API routes, file-based routing |
| Language | TypeScript (strict) | Strict mode enabled throughout |
| Styling | Tailwind CSS 3 + shadcn/ui | CSS variable–based design tokens |
| UI primitives | Radix UI | Tabs, slots — unstyled, accessible |
| Client caching | TanStack Query v5 | Query deduplication, background refresh |
| State / persistence | Zustand + persist | Recent searches and favorites in localStorage |
| Icons | lucide-react | Consistent icon set |
| Typeface | Inter (next/font/google) | Zero layout shift, variable font |
| External data | Riot Games API v5 + Data Dragon | Match, ranked, spectator, and static assets |

---

## Architecture

```
web/
  app/
    page.tsx                          # landing — search, examples, feature overview
    layout.tsx                        # app shell, metadata, Inter font, Navbar
    globals.css                       # design tokens (CSS variables), utility classes
    api/
      profile/                        # account + summoner + ranked + live game summary
      matches/                        # match IDs and match detail routes
      live/                           # spectator polling route
      ddragon/version/                # Data Dragon latest version resolution
    summoner/[platform]/[riotId]/
      page.tsx                        # summoner profile (SSR entry point)
      loading.tsx                     # streaming skeleton
      not-found.tsx                   # 404 handling
      MatchHistory.tsx                # client component — filters, analytics, pagination
  components/                         # 28 reusable product surfaces and UI primitives
  lib/
    riot.ts                           # Riot API wrapper with typed errors
    ddragon.ts                        # Data Dragon asset resolution
    match-insights.ts                 # deterministic analytics derivations
    types.ts                          # shared TypeScript types
    regions.ts / queues.ts            # platform and queue config maps
    badges.ts / utils.ts              # badge logic and general helpers
  store/
    useRecentSearches.ts              # Zustand store — recent searches and favorites
  providers/
    QueryProvider.tsx                 # TanStack Query client wrapper
```

### Data flow

1. The landing page captures a Riot ID in `GameName#TAG` format and resolves the platform.
2. The summoner route server-renders account data, ranked stats, live game summary, and initial matches in parallel.
3. `MatchHistory.tsx` handles client-side filters, visible-match analytics derivation, and incremental pagination.
4. Live game polling refreshes independently on the client without affecting the rest of the page — fails soft when spectator data is unavailable.
5. All analytics cards (session insights, champion stats, role performance, scouting report, compare summary) are derived from the same visible match set, so filters stay consistent across every surface.

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Riot Games developer API key](https://developer.riotgames.com/) (development keys reset every 24 hours)

### Installation

```bash
cd web
npm install
```

### Environment Variables

Create `web/.env.local`:

```bash
RIOT_API_KEY=your_riot_api_key_here
```

| Variable | Required | Description |
|---|---|---|
| `RIOT_API_KEY` | Yes | Riot developer API key — used for account lookup, summoner data, ranked stats, match history, and spectator requests |

### Running locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The server validates the API key on startup and logs the result to the console.

### Building for production

```bash
npm run build
npm run start
```

Deploy to any platform with Next.js 14 App Router support. [Vercel](https://vercel.com) is the simplest option — set `RIOT_API_KEY` in project environment variables and it works out of the box.

---

## Known Limitations

- Role and lane inference is approximate — the app does not use Riot's timeline data, so some assignments are heuristic
- Live game polling depends on Riot's spectator API availability and account-level access
- Recent searches and favorites are browser-local — not synced across devices or accounts
- Historical analytics are scoped to the currently loaded match window, not a player's full history
- Development API keys from Riot expire every 24 hours and have strict rate limits; production use requires a production key application

---

## Roadmap

- Timeline-aware lane phase analysis (CS differentials, early objective control)
- Image-based profile export snapshots
- Patch-aware context — flag performance changes that coincide with balance patches
- Cloud-synced favorites with optional account authentication

---

## License

MIT. League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc. Morello is not endorsed by or affiliated with Riot Games.

---

## Contact

Noah Russell  
[LinkedIn](https://www.linkedin.com/in/noah-russell-cs/)  
[Email](mailto:noahrussell2004@gmail.com)
