import Image from "next/image";
import { profileIconUrl } from "@/lib/ddragon";
import { PLATFORM_LABELS } from "@/lib/regions";
import type { ProfilePayload } from "@/lib/types";

export function ProfileHeader({
  profile,
  version,
}: {
  profile: ProfilePayload;
  version: string;
}) {
  const { account, summoner, platform } = profile;
  return (
    <div className="flex items-center gap-4">
      <div className="relative shrink-0">
        <Image
          src={profileIconUrl(summoner.profileIconId, version)}
          alt=""
          width={72}
          height={72}
          unoptimized
          className="rounded-lg border border-border/70"
        />
        <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 rounded-sm bg-background px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-foreground border border-border/70">
          {summoner.summonerLevel}
        </span>
      </div>
      <div className="min-w-0">
        <div className="eyebrow">
          {PLATFORM_LABELS[platform] ?? platform.toUpperCase()}
        </div>
        <div className="mt-1 flex items-baseline gap-2 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight truncate">
            {account.gameName}
          </h1>
          <span className="text-lg text-muted-foreground font-mono">
            #{account.tagLine}
          </span>
        </div>
      </div>
    </div>
  );
}
