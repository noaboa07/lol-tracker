/**
 * SessionInsightsCard is kept for backward compatibility but the main summoner
 * page now uses the inline FormStrip in MatchHistory.tsx instead.
 * This component is no longer rendered in the primary profile flow.
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SessionInsights } from "@/lib/match-insights";
import { cn } from "@/lib/utils";

export function SessionInsightsCard({
  insights,
  queueLabel,
  championFilter,
}: {
  insights: SessionInsights;
  queueLabel: string;
  championFilter: string | null;
}) {
  const streakLabel =
    insights.streakType && insights.streakCount > 0
      ? `${insights.streakCount}${insights.streakType === "win" ? "W" : "L"}`
      : "—";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
        <div>
          <CardTitle>Recent form</CardTitle>
          <div className="text-sm text-muted-foreground">
            {insights.games} games · {queueLabel}
            {championFilter ? ` · ${championFilter}` : ""}
          </div>
        </div>
        <StatusPill label={insights.statusLabel} />
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 sm:grid-cols-5 divide-x divide-border/50">
          <Metric
            label="Win rate"
            value={`${insights.winRate}%`}
            tone={insights.winRate >= 50 ? "win" : "loss"}
          />
          <Metric
            label="KDA"
            value={insights.averageKda.toFixed(2)}
            tone={insights.averageKda >= 3 ? "win" : undefined}
          />
          <Metric label="Streak" value={streakLabel} />
          <Metric
            label="Best champ"
            value={insights.bestChampion?.championName ?? "—"}
            sub={insights.bestChampion ? `${insights.bestChampion.games}g` : undefined}
          />
          <Metric
            label="CS/min"
            value={
              insights.averageCsPerMinute > 0
                ? insights.averageCsPerMinute.toFixed(1)
                : `${Math.round(insights.averageCs)}`
            }
          />
        </dl>
      </CardContent>
    </Card>
  );
}

function StatusPill({ label }: { label: string }) {
  const tone =
    label === "Hot streak"
      ? "text-win border-win/40 bg-win/10"
      : label === "Rough patch"
        ? "text-loss border-loss/40 bg-loss/10"
        : "text-muted-foreground border-border/60 bg-secondary/30";
  return (
    <span
      className={cn(
        "shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em]",
        tone
      )}
    >
      {label}
    </span>
  );
}

function Metric({
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
    <div className="px-4 py-2 first:pl-0">
      <dt className="eyebrow">{label}</dt>
      <dd
        className={cn(
          "mt-1 font-mono text-lg font-semibold tabular-nums",
          tone === "win" && "text-win",
          tone === "loss" && "text-loss"
        )}
      >
        {value}
        {sub && (
          <span className="ml-1 text-xs font-normal text-muted-foreground">{sub}</span>
        )}
      </dd>
    </div>
  );
}
