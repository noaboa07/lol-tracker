import Link from "next/link";
import type { Metadata } from "next";
import { RecentSearches } from "@/components/RecentSearches";
import { SearchBar } from "@/components/SearchBar";

const EXAMPLE_SEARCHES = [
  { label: "Faker", value: "Faker#KR1", platform: "kr" },
  { label: "Doublelift", value: "Doublelift#NA1", platform: "na1" },
  { label: "Caps", value: "Caps#EUW", platform: "euw1" },
];

export const metadata: Metadata = {
  title: "Search",
  description:
    "Search any Riot ID to explore live games, recent match insights, ranked performance, and League of Legends scouting tools.",
};

export default function HomePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-14 pt-12 sm:pt-20">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="space-y-6">
        <div className="space-y-2">
          <div className="eyebrow">League of Legends · Stats & Scouting</div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Look up any summoner.
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            Ranked stats, live game detection, explainable match breakdowns,
            champion trends, and coaching-level analysis — all from Riot match data.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <SearchBar helperText="Enter a Riot ID as GameName#TAG and choose your region." />
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="eyebrow">Try</span>
            {EXAMPLE_SEARCHES.map((ex) => (
              <Link
                key={ex.value}
                href={`/summoner/${ex.platform}/${encodeURIComponent(
                  ex.value.split("#")[0]
                )}-${encodeURIComponent(ex.value.split("#")[1])}`}
                className="rounded-md border border-border/60 px-2.5 py-1 font-mono text-xs text-muted-foreground transition-colors hover:border-border hover:text-foreground"
              >
                {ex.value}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recent profiles ─────────────────────────────────────────────── */}
      <section className="space-y-3">
        <div className="eyebrow">Recent profiles</div>
        <RecentSearches />
        <p className="text-xs text-muted-foreground">
          Favorites and recents show up here once you search a Riot ID.
        </p>
      </section>

      {/* ── What the app surfaces ─────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="eyebrow">What you get</div>
        <div className="grid gap-3 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-lg border border-border bg-card px-4 py-3"
            >
              <div className="text-sm font-semibold">{f.title}</div>
              <div className="mt-0.5 text-xs text-muted-foreground leading-snug">
                {f.desc}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const FEATURES = [
  {
    title: "Ranked overview",
    desc: "Solo/Duo and Flex rank, LP progress, win rate, and recent form in one view.",
  },
  {
    title: "Match history",
    desc: "Expandable match cards with per-game coaching analysis — what hurt, what held up, what to fix.",
  },
  {
    title: "Champion & role analysis",
    desc: "Champion pool, role splits, matchup tendencies, and game-length performance.",
  },
  {
    title: "Live game detection",
    desc: "Polls for an active game every 30 seconds and shows mode, champion, and elapsed time.",
  },
  {
    title: "Win vs loss comparison",
    desc: "Side-by-side stats showing how KDA, CS, vision, and objective pressure shift between outcomes.",
  },
  {
    title: "Compare mode",
    desc: "Search a second summoner and compare recent form, rank, and champion pool side by side.",
  },
];
