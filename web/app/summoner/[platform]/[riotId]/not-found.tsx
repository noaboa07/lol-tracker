import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl py-16 sm:py-24">
      <div className="rounded-lg border border-border/70 bg-card p-8 text-center sm:p-10">
        <div className="eyebrow">Error 404</div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Summoner not found</h1>
        <p className="mt-3 text-base text-muted-foreground">
          Double-check the Riot ID and region, or try one of your saved profiles from the home page.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/">
              <Search className="h-4 w-4" />
              Back to search
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <a
              href="https://developer.riotgames.com/apis#account-v1/GET_getByRiotId"
              target="_blank"
              rel="noreferrer"
            >
              Riot ID help
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
