import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardCardProps {
  cardTitle: string;
  cardDescription: string;
  count: number;
  cardIcon: React.ElementType;
}

export default function DashboardCard({
  cardTitle,
  cardDescription,
  cardIcon: Icon,
  count,
}: DashboardCardProps) {
  return (
    <Card className="hover:bg-accent transition-colors">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{cardTitle}</CardTitle>
        <Icon className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{count}</div>
        <p className="text-xs text-muted-foreground">{cardDescription}</p>
      </CardContent>
    </Card>
  );
}
