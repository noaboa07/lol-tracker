import Image from "next/image";
import { profileIconUrl, rankEmblemUrl } from "@/lib/ddragon";
import { PLATFORM_LABELS } from "@/lib/regions";
import type { ProfileOverviewSummary } from "@/lib/match-insights";
import type { ProfilePayload, RankedEntry } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProfileModuleProps {
  profile: ProfilePayload;
  solo: RankedEntry | undefined;
  flex: RankedEntry | undefined;
  overview: ProfileOverviewSummary;
  version: string;
}

const RANK_TIER_ORDER = [
  "IRON", "BRONZE", "SILVER", "GOLD", "PLATINUM",
  "EMERALD", "DIAMOND", "MASTER", "GRANDMASTER", "CHALLENGER",
];

function rankTierOrder(tier: string) {
  return RANK_TIER_ORDER.indexOf(tier.toUpperCase());
}

export function ProfileModule({
  profile,
  solo,
  flex,
  overview,
  version,
}: ProfileModuleProps) {
  const { account, summoner, platform } = profile;
  const ranked = [solo, flex].filter(Boolean) as RankedEntry[];

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      {/* ── Identity row ─────────────────────────────────────────────── */}
      <div className="flex items-start gap-4 px-5 pt-5 pb-4">
        <div className="relative shrink-0">
          <Image
            src={profileIconUrl(summoner.profileIconId, version)}
            alt=""
            width={80}
            height={80}
            unoptimized
            className="rounded-lg border border-border"
          />
          <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-sm bg-background border border-border px-2 py-0.5 text-[10px] font-semibold tabular-nums text-foreground">
            {summoner.summonerLevel}
          </span>
        </div>

        <div className="min-w-0 flex-1 pt-1">
          <div className="eyebrow">{PLATFORM_LABELS[platform] ?? platform.toUpperCase()}</div>
          <div className="mt-1.5 flex items-baseline gap-2 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight truncate sm:text-3xl">
              {account.gameName}
            </h1>
            <span className="text-base text-muted-foreground font-mono shrink-0">
              #{account.tagLine}
            </span>
          </div>
          {overview.summaryLine && (
            <p className="mt-1.5 text-sm text-muted-foreground leading-snug max-w-lg">
              {overview.summaryLine}
            </p>
          )}
        </div>
      </div>

      {/* ── Stats strip ──────────────────────────────────────────────── */}
      <div className="border-t border-border grid grid-cols-2 sm:grid-cols-4 divide-x divide-border/60">
        {/* Solo rank */}
        <RankCell
          label="Solo / Duo"
          entry={solo}
          version={version}
        />

        {/* Flex rank */}
        <RankCell
          label="Flex"
          entry={flex}
          version={version}
        />

        {/* Recent WR + KDA */}
        <StatCell label="Recent form">
          <div className="flex items-baseline gap-2">
            <span
              className={cn(
                "text-xl font-bold tabular-nums font-mono",
                overview.recentWinRate >= 55
                  ? "text-win"
                  : overview.recentWinRate >= 50
                    ? "text-foreground"
                    : "text-loss"
              )}
            >
              {overview.recentWinRate}%
            </span>
            <span className="text-xs text-muted-foreground">WR</span>
          </div>
          <div className="mt-0.5 text-sm text-muted-foreground tabular-nums font-mono">
            {overview.averageKda.toFixed(2)}{" "}
            <span className="text-muted-foreground/60">KDA avg</span>
          </div>
        </StatCell>

        {/* Best champion */}
        <StatCell label="Best champ">
          {overview.bestChampion ? (
            <>
              <div className="text-sm font-semibold truncate">
                {overview.bestChampion.championName}
              </div>
              <div className="mt-0.5 text-xs text-muted-foreground tabular-nums">
                {overview.bestChampion.games} games ·{" "}
                {overview.bestChampion.averageKda.toFixed(2)} KDA
              </div>
            </>
          ) : (
            <div className="text-sm text-muted-foreground">Building pool</div>
          )}
        </StatCell>
      </div>
    </div>
  );
}

function RankCell({
  label,
  entry,
  version,
}: {
  label: string;
  entry: RankedEntry | undefined;
  version: string;
}) {
  if (!entry) {
    return (
      <StatCell label={label}>
        <div className="text-sm font-semibold text-muted-foreground">Unranked</div>
      </StatCell>
    );
  }

  const total = entry.wins + entry.losses;
  const winRate = total > 0 ? Math.round((entry.wins / total) * 100) : 0;
  const apex = ["MASTER", "GRANDMASTER", "CHALLENGER"].includes(entry.tier.toUpperCase());
  const tierLabel =
    entry.tier.charAt(0).toUpperCase() + entry.tier.slice(1).toLowerCase();
  const rankLabel = apex ? tierLabel : `${tierLabel} ${entry.rank}`;

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Image
        src={rankEmblemUrl(entry.tier)}
        alt={entry.tier}
        width={40}
        height={40}
        unoptimized
        className="h-10 w-10 shrink-0"
      />
      <div className="min-w-0">
        <div className="eyebrow">{label}</div>
        <div className="mt-0.5 text-sm font-bold truncate">{rankLabel}</div>
        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground tabular-nums">
          <span>{entry.leaguePoints} LP</span>
          <span className="text-border">·</span>
          <span
            className={cn(
              "font-semibold",
              winRate >= 55 ? "text-win" : winRate < 45 ? "text-loss" : "text-foreground"
            )}
          >
            {winRate}%
          </span>
          <span className="text-border">·</span>
          <span>
            {entry.wins}W {entry.losses}L
          </span>
        </div>
      </div>
    </div>
  );
}

function StatCell({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="px-4 py-3">
      <div className="eyebrow">{label}</div>
      <div className="mt-1">{children}</div>
    </div>
  );
}
