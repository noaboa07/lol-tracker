import type { ProfileOverviewSummary } from "@/lib/match-insights";
import type { RankedEntry } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProfileOverviewHeroCard({
  summary,
  solo,
}: {
  summary: ProfileOverviewSummary;
  solo?: RankedEntry;
}) {
  const rankLabel = solo
    ? `${solo.tier[0] + solo.tier.slice(1).toLowerCase()} ${solo.rank} · ${solo.leaguePoints} LP`
    : "Unranked";

  return (
    <section className="rounded-lg border border-border/70 bg-card">
      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="max-w-2xl">
          <div className="eyebrow">Overview</div>
          <p className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
            {summary.summaryLine}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span>{rankLabel}</span>
            {summary.strongestQueue && (
              <>
                <span className="text-border">·</span>
                <span>Best in {summary.strongestQueue}</span>
              </>
            )}
            {summary.strongestRole && (
              <>
                <span className="text-border">·</span>
                <span>Leans {summary.strongestRole}</span>
              </>
            )}
          </div>
        </div>

        <dl className="flex items-center divide-x divide-border/60 rounded-md border border-border/60 bg-background/40">
          <HeroMetric
            label="Recent WR"
            value={`${summary.recentWinRate}%`}
            tone={summary.recentWinRate >= 50 ? "win" : "loss"}
          />
          <HeroMetric
            label="Avg KDA"
            value={summary.averageKda.toFixed(2)}
            tone={summary.averageKda >= 3 ? "win" : undefined}
          />
          <HeroMetric
            label="Best champ"
            value={summary.bestChampion?.championName ?? "—"}
            sub={
              summary.bestChampion
                ? `${summary.bestChampion.games}g`
                : undefined
            }
          />
        </dl>
      </div>
    </section>
  );
}

function HeroMetric({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "win" | "loss";
}) {
  return (
    <div className="min-w-[96px] px-4 py-3 text-left">
      <dt className="eyebrow">{label}</dt>
      <dd
        className={cn(
          "mt-1 font-mono tabular-nums text-lg font-semibold",
          tone === "win" && "text-win",
          tone === "loss" && "text-loss"
        )}
      >
        {value}
        {sub && (
          <span className="ml-1 text-xs font-normal text-muted-foreground">
            {sub}
          </span>
        )}
      </dd>
    </div>
  );
}
