"use client";

import { Copy, Printer } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProfileOverviewSummary } from "@/lib/match-insights";
import type { ProfilePayload } from "@/lib/types";

export function ShareProfileSnapshotCard({
  profile,
  summary,
}: {
  profile: ProfilePayload;
  summary: ProfileOverviewSummary;
}) {
  const [copied, setCopied] = useState(false);

  const snapshotText = [
    `${profile.account.gameName}#${profile.account.tagLine}`,
    `Recent WR: ${summary.recentWinRate}%`,
    `Average KDA: ${summary.averageKda.toFixed(2)}`,
    summary.bestChampion
      ? `Best recent champion: ${summary.bestChampion.championName} (${summary.bestChampion.games} games)`
      : null,
    summary.strongestQueue ? `Best queue: ${summary.strongestQueue}` : null,
    summary.strongestRole ? `Strong role: ${summary.strongestRole}` : null,
    summary.summaryLine,
  ]
    .filter(Boolean)
    .join("\n");

  const copySnapshot = async () => {
    await navigator.clipboard.writeText(snapshotText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Card id="snapshot">
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
        <CardTitle>Snapshot</CardTitle>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={copySnapshot}>
            <Copy className="h-3.5 w-3.5" />
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button variant="secondary" size="sm" onClick={() => window.print()}>
            <Printer className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-border/60 bg-[hsl(var(--surface))] p-4">
          <div className="text-lg font-bold">
            {profile.account.gameName}
            <span className="text-muted-foreground font-normal text-base">
              #{profile.account.tagLine}
            </span>
          </div>
          <div className="mt-1 text-sm text-muted-foreground">{summary.summaryLine}</div>
          <dl className="mt-4 grid grid-cols-2 gap-y-2 gap-x-4">
            <SnapshotStat label="Win rate" value={`${summary.recentWinRate}%`} />
            <SnapshotStat label="KDA" value={summary.averageKda.toFixed(2)} />
            <SnapshotStat
              label="Best champ"
              value={summary.bestChampion?.championName ?? "—"}
            />
            <SnapshotStat
              label="Queue / Role"
              value={summary.strongestQueue ?? summary.strongestRole ?? "—"}
            />
          </dl>
        </div>
      </CardContent>
    </Card>
  );
}

function SnapshotStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="eyebrow">{label}</dt>
      <dd className="mt-0.5 text-sm font-semibold tabular-nums">{value}</dd>
    </div>
  );
}
