import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WinLossComparison } from "@/lib/match-insights";

export function WinLossAnalysisCard({ comparison }: { comparison: WinLossComparison }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Win vs loss</CardTitle>
      </CardHeader>
      <CardContent>
        {comparison.metrics.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Need both wins and losses in the current view to compare.
          </p>
        ) : (
          <>
            <div className="mb-1 grid grid-cols-[1fr_auto_auto] gap-4 pb-1 border-b border-border/50">
              <span className="eyebrow">Metric</span>
              <span className="eyebrow w-12 text-right text-win/70">W</span>
              <span className="eyebrow w-12 text-right text-loss/70">L</span>
            </div>
            <ul className="divide-y divide-border/40">
              {comparison.metrics.map((metric) => (
                <li
                  key={metric.label}
                  className="grid grid-cols-[1fr_auto_auto] items-baseline gap-4 py-2"
                >
                  <div>
                    <div className="text-sm">{metric.label}</div>
                    {metric.emphasis && (
                      <div className="text-xs text-muted-foreground">{metric.emphasis}</div>
                    )}
                  </div>
                  <div className="w-12 text-right font-mono text-sm font-semibold tabular-nums text-win">
                    {metric.winValue}
                  </div>
                  <div className="w-12 text-right font-mono text-sm font-semibold tabular-nums text-loss">
                    {metric.lossValue}
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  );
}
