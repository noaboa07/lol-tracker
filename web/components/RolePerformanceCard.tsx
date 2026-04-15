import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RoleInsight } from "@/lib/match-insights";
import { cn } from "@/lib/utils";

export function RolePerformanceCard({ roles }: { roles: RoleInsight[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Roles</CardTitle>
      </CardHeader>
      <CardContent>
        {roles.length === 0 ? (
          <p className="text-sm text-muted-foreground">Not enough role data yet.</p>
        ) : (
          <ul className="divide-y divide-border/40">
            {roles.map((role) => (
              <li
                key={role.role}
                className="grid grid-cols-[1fr_auto] gap-3 py-2.5 first:pt-0 last:pb-0"
              >
                <div>
                  <div className="text-sm font-medium">{role.role}</div>
                  <div className="text-xs text-muted-foreground">
                    {role.games}g{role.topChampion ? ` · ${role.topChampion}` : ""}
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={cn(
                      "font-mono text-sm font-semibold tabular-nums",
                      role.winRate >= 50 ? "text-win" : "text-loss"
                    )}
                  >
                    {role.winRate}%
                  </div>
                  <div className="text-xs text-muted-foreground tabular-nums">
                    {role.averageKda.toFixed(2)} · {role.averageCsPerMinute.toFixed(1)} cs/m
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
