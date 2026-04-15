import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { championSquareUrl } from "@/lib/ddragon";
import type { ChampionPoolEntry } from "@/lib/match-insights";
import { cn } from "@/lib/utils";

export function RecentChampionPoolCard({
  champions,
  version,
}: {
  champions: ChampionPoolEntry[];
  version: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Champion pool</CardTitle>
      </CardHeader>
      <CardContent>
        {champions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No champions in the current view yet.</p>
        ) : (
          <ul className="divide-y divide-border/40">
            {champions.slice(0, 5).map((champion) => {
              const winRate = Math.round((champion.wins / champion.games) * 100);
              return (
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
                      {champion.games}g · {champion.averageKda.toFixed(2)} KDA
                    </div>
                  </div>
                  <div
                    className={cn(
                      "font-mono text-sm font-semibold tabular-nums shrink-0",
                      winRate >= 50 ? "text-win" : "text-loss"
                    )}
                  >
                    {winRate}%
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
