import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MatchupInsight } from "@/lib/match-insights";
import { cn } from "@/lib/utils";

export function ChampionMatchupInsightsCard({
  best,
  worst,
  fallbackUsed,
}: {
  best: MatchupInsight[];
  worst: MatchupInsight[];
  fallbackUsed: boolean;
}) {
  const empty = best.length === 0 && worst.length === 0;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Matchups</CardTitle>
      </CardHeader>
      <CardContent>
        {empty ? (
          <p className="text-sm text-muted-foreground">
            Not enough repeated matchups yet.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            <MatchupColumn title="Best into" entries={best} positive />
            <MatchupColumn title="Watch outs" entries={worst} positive={false} />
          </div>
        )}
        {fallbackUsed && !empty && (
          <p className="mt-3 text-xs text-muted-foreground">
            Some matchups use a conservative fallback opponent.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function MatchupColumn({
  title,
  entries,
  positive,
}: {
  title: string;
  entries: MatchupInsight[];
  positive: boolean;
}) {
  return (
    <div>
      <div
        className={cn(
          "eyebrow mb-2",
          positive ? "text-win/70" : "text-loss/70"
        )}
      >
        {title}
      </div>
      {entries.length === 0 ? (
        <p className="text-sm text-muted-foreground">Not enough data.</p>
      ) : (
        <ul className="divide-y divide-border/40">
          {entries.map((entry) => (
            <li
              key={`${title}-${entry.championName}`}
              className="grid grid-cols-[1fr_auto] items-baseline gap-3 py-2"
            >
              <div>
                <div className="text-sm font-medium">{entry.championName}</div>
                <div className="text-xs text-muted-foreground">{entry.games} games</div>
              </div>
              <div className="text-right">
                <div
                  className={cn(
                    "font-mono text-sm font-semibold tabular-nums",
                    entry.winRate >= 50 ? "text-win" : "text-loss"
                  )}
                >
                  {entry.winRate}%
                </div>
                <div className="text-xs text-muted-foreground tabular-nums">
                  {entry.averageKda.toFixed(2)} KDA
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
