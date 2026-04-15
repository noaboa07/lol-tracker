import Image from "next/image";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { championSquareUrl } from "@/lib/ddragon";
import type { ChampionTrend } from "@/lib/match-insights";
import { cn } from "@/lib/utils";

export function ChampionMasteryTrendCard({
  champions,
  version,
}: {
  champions: ChampionTrend[];
  version: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mastery trend</CardTitle>
      </CardHeader>
      <CardContent>
        {champions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Not enough repeated champions yet.
          </p>
        ) : (
          <ul className="divide-y divide-border/40">
            {champions.map((champion) => (
              <li
                key={champion.championName}
                className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0"
              >
                <Image
                  src={championSquareUrl(champion.championName, version)}
                  alt=""
                  width={32}
                  height={32}
                  unoptimized
                  className="rounded-sm shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{champion.championName}</div>
                  <div className="text-xs text-muted-foreground tabular-nums">
                    {champion.games}g · {champion.winRate}% · {champion.averageKda.toFixed(2)} KDA
                  </div>
                </div>
                <div
                  className={cn(
                    "flex items-center gap-1 font-mono text-xs font-semibold tabular-nums shrink-0",
                    champion.direction === "up"
                      ? "text-win"
                      : champion.direction === "down"
                        ? "text-loss"
                        : "text-muted-foreground"
                  )}
                >
                  {champion.direction === "up" ? (
                    <TrendingUp className="h-3.5 w-3.5" />
                  ) : champion.direction === "down" ? (
                    <TrendingDown className="h-3.5 w-3.5" />
                  ) : null}
                  {champion.label}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
