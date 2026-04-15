import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GameLengthBucket } from "@/lib/match-insights";
import { cn } from "@/lib/utils";

export function GameLengthPerformanceCard({ buckets }: { buckets: GameLengthBucket[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Game length</CardTitle>
      </CardHeader>
      <CardContent>
        {buckets.length === 0 ? (
          <p className="text-sm text-muted-foreground">Not enough games yet.</p>
        ) : (
          <ul className="divide-y divide-border/40">
            {buckets.map((bucket) => (
              <li
                key={bucket.key}
                className="grid grid-cols-[1fr_auto] gap-3 py-2.5 first:pt-0 last:pb-0"
              >
                <div>
                  <div className="text-sm font-medium">{bucket.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {bucket.games}g{bucket.topChampion ? ` · ${bucket.topChampion}` : ""}
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={cn(
                      "font-mono text-sm font-semibold tabular-nums",
                      bucket.winRate >= 50 ? "text-win" : "text-loss"
                    )}
                  >
                    {bucket.winRate}%
                  </div>
                  <div className="text-xs text-muted-foreground tabular-nums">
                    {bucket.averageKda.toFixed(2)} KDA
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
