import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ScoutingReportCard({ insights }: { insights: string[] }) {
  if (insights.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scouting read</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
          {insights.map((insight) => (
            <li
              key={insight}
              className="relative pl-4 text-sm leading-snug text-muted-foreground before:absolute before:left-0 before:top-[0.55em] before:h-1 before:w-1 before:rounded-full before:bg-primary/60"
            >
              {insight}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
