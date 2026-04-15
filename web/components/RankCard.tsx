import Image from "next/image";
import { rankEmblemUrl } from "@/lib/ddragon";
import type { RankedEntry } from "@/lib/types";
import { cn } from "@/lib/utils";

const QUEUE_LABELS: Record<string, string> = {
  RANKED_SOLO_5x5: "Solo / Duo",
  RANKED_FLEX_SR: "Flex",
};

export function RankCard({ queue, entry }: { queue: string; entry?: RankedEntry }) {
  if (!entry) {
    return (
      <div className="flex flex-1 items-center gap-4 rounded-lg border border-border/70 bg-card px-5 py-4">
        <div className="grid h-14 w-14 place-items-center rounded-md bg-secondary/50 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Unr
        </div>
        <div>
          <div className="eyebrow">{QUEUE_LABELS[queue] ?? queue}</div>
          <div className="mt-1 text-base font-semibold">Unranked</div>
        </div>
      </div>
    );
  }

  const total = entry.wins + entry.losses;
  const winRate = total > 0 ? Math.round((entry.wins / total) * 100) : 0;
  const lpPct = Math.min(100, Math.max(0, entry.leaguePoints));
  const apex = ["MASTER", "GRANDMASTER", "CHALLENGER"].includes(
    entry.tier.toUpperCase()
  );

  return (
    <div className="flex-1 rounded-lg border border-border/70 bg-card px-5 py-4">
      <div className="flex items-center gap-4">
        <Image
          src={rankEmblemUrl(entry.tier)}
          alt={entry.tier}
          width={56}
          height={56}
          unoptimized
          className="h-14 w-14 shrink-0"
        />
        <div className="min-w-0 flex-1">
          <div className="eyebrow">{QUEUE_LABELS[queue] ?? queue}</div>
          <div className="mt-0.5 text-base font-semibold capitalize">
            {entry.tier.toLowerCase()} {apex ? "" : entry.rank}
          </div>
          <div className="text-xs text-muted-foreground tabular-nums">
            {entry.leaguePoints} LP
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-sm tabular-nums">
            {entry.wins}
            <span className="text-muted-foreground">W</span> {entry.losses}
            <span className="text-muted-foreground">L</span>
          </div>
          <div
            className={cn(
              "text-sm font-semibold tabular-nums",
              winRate >= 50 ? "text-win" : "text-loss"
            )}
          >
            {winRate}%
          </div>
        </div>
      </div>

      {!apex && (
        <div className="mt-4">
          <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
            <span>Division progress</span>
            <span className="tabular-nums">{lpPct}/100 LP</span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-secondary/60">
            <div
              className="h-full bg-primary/80"
              style={{ width: `${lpPct}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
