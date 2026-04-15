"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  championSquareUrl,
  itemIconUrl,
  summonerSpellIconUrl,
} from "@/lib/ddragon";
import { queueName } from "@/lib/queues";
import { formatDuration, kdaRatio, timeAgo, cn } from "@/lib/utils";
import {
  getMatchBadges,
  getMatchAnalysis,
  damageShareForTeam,
} from "@/lib/badges";
import type { MatchDTO, MatchParticipant } from "@/lib/types";

export interface MatchCardProps {
  match: MatchDTO;
  puuid: string;
  version: string;
  spellMap: Record<number, { name: string; key: string }>;
  itemMap: Record<number, string>;
}

export function MatchCard({
  match,
  puuid,
  version,
  spellMap,
  itemMap,
}: MatchCardProps) {
  const [open, setOpen] = useState(false);
  const me = match.info.participants.find((p) => p.puuid === puuid);
  if (!me) return null;

  const win = me.win;
  const totalCs = me.totalMinionsKilled + (me.neutralMinionsKilled ?? 0);
  const gameMins = match.info.gameDuration / 60;
  const cspm = gameMins > 0 ? (totalCs / gameMins).toFixed(1) : "0";
  const items = [me.item0, me.item1, me.item2, me.item3, me.item4, me.item5];
  const trinket = me.item6;
  const teams: [MatchParticipant[], MatchParticipant[]] = [
    match.info.participants.filter((p) => p.teamId === 100),
    match.info.participants.filter((p) => p.teamId === 200),
  ];
  const badges = getMatchBadges(match, me);
  const analysis = getMatchAnalysis(match, me);
  const date = new Date(match.info.gameCreation);
  const dateAbs = date.toLocaleString();
  const teamDamageScale = damageShareForTeam(match.info.participants);

  return (
    <div
      className={cn(
        // Left accent border signals win/loss at a glance
        "rounded-lg border border-border border-l-2 bg-card overflow-hidden transition-colors focus-within:ring-1 focus-within:ring-ring/50",
        win
          ? "border-l-win hover:bg-win/[0.03]"
          : "border-l-loss hover:bg-loss/[0.03]"
      )}
    >
      {/* ── Summary row ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-[auto_1fr_auto] sm:grid-cols-[160px_auto_1fr_auto] gap-3 px-4 py-3 items-center">

        {/* Game metadata */}
        <div className="flex flex-col gap-0.5 min-w-0">
          <div className={cn("text-xs font-bold uppercase tracking-wide", win ? "text-win" : "text-loss")}>
            {win ? "Victory" : "Defeat"}
          </div>
          <div className="text-xs font-medium text-foreground">
            {queueName(match.info.queueId)}
          </div>
          <div className="text-xs text-muted-foreground cursor-help" title={dateAbs}>
            {timeAgo(match.info.gameCreation)}
          </div>
          <div className="text-xs text-muted-foreground tabular-nums">
            {formatDuration(match.info.gameDuration)}
          </div>
          {badges.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {badges.map((b) => (
                <span
                  key={b.label}
                  className={cn(
                    "text-[9px] font-bold px-1.5 py-0.5 rounded border tracking-wider",
                    b.className
                  )}
                >
                  {b.label}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Champion portrait + spells */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Image
              src={championSquareUrl(me.championName, version)}
              alt={me.championName}
              width={64}
              height={64}
              unoptimized
              className={cn(
                "rounded-lg ring-1",
                win ? "ring-win/50" : "ring-loss/40"
              )}
              title={me.championName}
            />
            <span className="absolute -bottom-1 -right-1 bg-background border border-border text-[9px] px-1 rounded-sm font-bold tabular-nums">
              {me.champLevel}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            {[me.summoner1Id, me.summoner2Id].map((sid, i) => (
              <Image
                key={i}
                src={summonerSpellIconUrl(sid, version)}
                alt={spellMap[sid]?.name ?? `spell-${sid}`}
                title={spellMap[sid]?.name ?? `Spell ${sid}`}
                width={24}
                height={24}
                unoptimized
                className="rounded-sm"
              />
            ))}
          </div>
        </div>

        {/* KDA + stats */}
        <div className="hidden sm:flex flex-col gap-0.5">
          <div className="text-base font-bold tabular-nums font-mono">
            {me.kills}{" "}
            <span className="text-muted-foreground font-normal">/</span>{" "}
            <span className="text-loss">{me.deaths}</span>{" "}
            <span className="text-muted-foreground font-normal">/</span>{" "}
            {me.assists}
          </div>
          <div className="text-xs text-muted-foreground tabular-nums">
            {kdaRatio(me.kills, me.deaths, me.assists)} KDA
          </div>
          <div className="text-xs text-muted-foreground tabular-nums">
            {totalCs} CS ({cspm}/m)
          </div>
          <div className="text-xs text-muted-foreground tabular-nums">
            {me.totalDamageDealtToChampions.toLocaleString()} dmg
          </div>
        </div>

        {/* Items + expand toggle */}
        <div className="flex items-center gap-2">
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-1">
            {items.map((id, i) => {
              const url = itemIconUrl(id, version);
              const name = id ? itemMap[id] : null;
              return (
                <div
                  key={i}
                  title={name ?? "Empty"}
                  className="h-7 w-7 rounded-sm bg-secondary/60 overflow-hidden border border-border/40"
                >
                  {url && (
                    <Image
                      src={url}
                      alt={name ?? ""}
                      width={28}
                      height={28}
                      unoptimized
                    />
                  )}
                </div>
              );
            })}
            {trinket ? (
              <div
                title={itemMap[trinket] ?? "Trinket"}
                className="h-7 w-7 rounded-full bg-secondary/60 overflow-hidden border border-border/40"
              >
                <Image
                  src={itemIconUrl(trinket, version) ?? ""}
                  alt={itemMap[trinket] ?? "trinket"}
                  width={28}
                  height={28}
                  unoptimized
                />
              </div>
            ) : (
              <div className="h-7 w-7" />
            )}
          </div>
          <button
            onClick={() => setOpen((o) => !o)}
            className="p-1.5 rounded-md hover:bg-secondary/60 transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Toggle match details"
          >
            <ChevronDown
              className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
            />
          </button>
        </div>
      </div>

      {/* ── Expanded detail panel ───────────────────────────────────────────── */}
      <div
        className={cn(
          "grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="min-h-0">
          <div className="border-t border-border/60 bg-[hsl(var(--surface))] p-4 space-y-5">

            {/* ── Coaching analysis ────────────────────────────────────── */}
            <CoachingPanel analysis={analysis} win={win} />

            {/* ── Team breakdown ───────────────────────────────────────── */}
            <div className="grid gap-5 lg:grid-cols-2">
              {teams.map((team, ti) => (
                <TeamPanel
                  key={ti}
                  team={team}
                  side={ti === 0 ? "blue" : "red"}
                  version={version}
                  puuid={puuid}
                  spellMap={spellMap}
                  itemMap={itemMap}
                  dmgScale={teamDamageScale}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Coaching panel ────────────────────────────────────────────────────────────

function CoachingPanel({
  analysis,
  win,
}: {
  analysis: ReturnType<typeof getMatchAnalysis>;
  win: boolean;
}) {
  if (analysis.hurt.length === 0 && analysis.solid.length === 0) return null;

  return (
    <div className="rounded-lg border border-border/70 bg-card p-4 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {/* What hurt / What could be better */}
        {analysis.hurt.length > 0 && (
          <div>
            <div className="eyebrow text-loss/70 mb-2">
              {win ? "Watch out" : "What hurt"}
            </div>
            <ul className="space-y-1.5">
              {analysis.hurt.map((text, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-loss mt-0.5 text-xs font-bold leading-none shrink-0">
                    −
                  </span>
                  <span className="leading-snug">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* What held up */}
        {analysis.solid.length > 0 && (
          <div>
            <div className="eyebrow text-win/70 mb-2">What held up</div>
            <ul className="space-y-1.5">
              {analysis.solid.map((text, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-win mt-0.5 text-xs font-bold leading-none shrink-0">
                    +
                  </span>
                  <span className="leading-snug">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Single coaching note */}
      <div className="border-t border-border/50 pt-3 text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">Focus: </span>
        {analysis.coaching}
      </div>
    </div>
  );
}

// ── Team panel ────────────────────────────────────────────────────────────────

function TeamPanel({
  team,
  side,
  version,
  puuid,
  spellMap,
  itemMap,
  dmgScale,
}: {
  team: MatchParticipant[];
  side: "blue" | "red";
  version: string;
  puuid: string;
  spellMap: Record<number, { name: string; key: string }>;
  itemMap: Record<number, string>;
  dmgScale: (p: MatchParticipant) => number;
}) {
  const win = team[0]?.win ?? false;
  return (
    <div>
      <div
        className={cn(
          "flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider mb-2",
          side === "blue" ? "text-win" : "text-loss"
        )}
      >
        <span>{side === "blue" ? "Blue" : "Red"} Team</span>
        <span className="text-muted-foreground font-medium normal-case tracking-normal">
          {win ? "Victory" : "Defeat"}
        </span>
      </div>
      <div className="space-y-1">
        {team.map((p) => {
          const cs = p.totalMinionsKilled + (p.neutralMinionsKilled ?? 0);
          const isMe = p.puuid === puuid;
          const dmgPct = dmgScale(p);
          return (
            <div
              key={p.puuid}
              className={cn(
                "grid grid-cols-[auto_1fr_auto] gap-2 items-center rounded-md px-2 py-1.5 text-xs",
                isMe ? "bg-primary/10 ring-1 ring-primary/30" : "hover:bg-secondary/30"
              )}
            >
              {/* Champion + spells */}
              <div className="flex items-center gap-1.5">
                <Image
                  src={championSquareUrl(p.championName, version)}
                  alt={p.championName}
                  title={p.championName}
                  width={26}
                  height={26}
                  unoptimized
                  className="rounded-sm"
                />
                <div className="flex flex-col gap-0.5">
                  <Image
                    src={summonerSpellIconUrl(p.summoner1Id, version)}
                    alt=""
                    width={11}
                    height={11}
                    unoptimized
                    title={spellMap[p.summoner1Id]?.name}
                    className="rounded-sm"
                  />
                  <Image
                    src={summonerSpellIconUrl(p.summoner2Id, version)}
                    alt=""
                    width={11}
                    height={11}
                    unoptimized
                    title={spellMap[p.summoner2Id]?.name}
                    className="rounded-sm"
                  />
                </div>
              </div>

              {/* Name + damage bar */}
              <div className="min-w-0">
                <div
                  className={cn(
                    "truncate font-medium",
                    isMe ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {p.riotIdGameName ?? p.summonerName}
                </div>
                <div className="mt-1 h-1 rounded-full bg-secondary/50 overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      side === "blue" ? "bg-win/60" : "bg-loss/60"
                    )}
                    style={{ width: `${dmgPct}%` }}
                    title={`${p.totalDamageDealtToChampions.toLocaleString()} dmg`}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="text-right tabular-nums">
                <div className="font-mono font-semibold">
                  {p.kills}/{p.deaths}/{p.assists}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {cs} cs · {(p.totalDamageDealtToChampions / 1000).toFixed(1)}k
                </div>
              </div>

              {/* Items row */}
              <div className="col-span-3 flex gap-0.5 mt-0.5">
                {[p.item0, p.item1, p.item2, p.item3, p.item4, p.item5, p.item6].map(
                  (id, i) => {
                    const url = id ? itemIconUrl(id, version) : null;
                    const name = id ? itemMap[id] : null;
                    return (
                      <div
                        key={i}
                        title={name ?? "Empty"}
                        className="h-5 w-5 rounded-sm bg-secondary/50 overflow-hidden border border-border/30"
                      >
                        {url && (
                          <Image src={url} alt="" width={20} height={20} unoptimized />
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
