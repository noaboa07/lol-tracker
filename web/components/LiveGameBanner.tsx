"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { championSquareUrl } from "@/lib/ddragon";
import { formatDuration, cn } from "@/lib/utils";
import type { LiveGameSummary } from "@/lib/types";

export function LiveGameBanner({
  initialGame,
  platform,
  puuid,
  version,
}: {
  initialGame: LiveGameSummary | null;
  platform: string;
  puuid: string;
  version: string;
}) {
  const [game, setGame] = useState<LiveGameSummary | null>(initialGame);
  const [visible, setVisible] = useState(Boolean(initialGame));
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    setGame(initialGame);
    setVisible(Boolean(initialGame));
  }, [initialGame]);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const poll = async () => {
      try {
        const res = await fetch(`/api/live/${platform}/${puuid}`, {
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = (await res.json()) as { game: LiveGameSummary | null };
        if (cancelled) return;
        if (data.game) {
          setGame(data.game);
          setVisible(true);
        } else {
          setVisible(false);
          window.setTimeout(() => {
            if (!cancelled) setGame(null);
          }, 250);
        }
      } catch {
        // ignore transient failures
      }
    };
    const interval = window.setInterval(poll, 30_000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [platform, puuid]);

  const displayDuration = useMemo(() => {
    if (!game) return 0;
    if (!game.gameStartTime) return game.gameLength;
    return Math.max(game.gameLength, Math.floor((now - game.gameStartTime) / 1000));
  }, [game, now]);

  if (!game) return null;

  return (
    <div
      className={cn(
        "rounded-lg border border-loss/40 bg-loss/10 px-4 py-3 transition-all duration-300",
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      <div className="flex items-center gap-3">
        {/* Live indicator */}
        <div className="relative shrink-0">
          <span className="absolute inset-0 rounded-full bg-loss/40 animate-ping" />
          <span className="relative flex h-2.5 w-2.5 rounded-full bg-loss" />
        </div>

        <span className="text-xs font-semibold uppercase tracking-wider text-loss">
          In Game
        </span>

        {game.championName && (
          <div className="flex items-center gap-1.5 ml-1">
            <Image
              src={championSquareUrl(game.championName, version)}
              alt={game.championName}
              width={28}
              height={28}
              unoptimized
              className="rounded-sm"
            />
            <span className="text-sm font-medium">{game.championName}</span>
          </div>
        )}

        <div className="ml-auto flex items-center gap-3 text-right">
          <span className="text-xs text-muted-foreground">{game.gameMode}</span>
          <span className="font-mono text-sm font-semibold tabular-nums">
            {formatDuration(displayDuration)}
          </span>
        </div>
      </div>
    </div>
  );
}
