
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricsWidgetProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
}

export const MetricsWidget = ({ title, value, change, trend }: MetricsWidgetProps) => {
  return (
    <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors cursor-pointer">
      <CardHeader className="pb-3">
        <CardTitle className="text-slate-300 text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-2xl font-bold text-white mb-1">{value}</div>
            <div className={`flex items-center text-sm ${
              trend === 'up' ? 'text-green-400' : 'text-red-400'
            }`}>
              {trend === 'up' ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {change}
            </div>
          </div>
          <div className={`h-8 w-1 rounded-full ${
            trend === 'up' ? 'bg-green-400' : 'bg-red-400'
          }`} />
        </div>
      </CardContent>
    </Card>
  );
};
