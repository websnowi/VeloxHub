
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ChartWidgetProps {
  title: string;
  subtitle: string;
  type?: "line" | "pie";
}

const lineData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 4500 },
  { name: 'May', value: 6000 },
  { name: 'Jun', value: 5500 },
];

const pieData = [
  { name: 'Direct', value: 400, color: '#3B82F6' },
  { name: 'Social', value: 300, color: '#8B5CF6' },
  { name: 'Email', value: 200, color: '#10B981' },
  { name: 'Referral', value: 100, color: '#F59E0B' },
];

export const ChartWidget = ({ title, subtitle, type = "line" }: ChartWidgetProps) => {
  return (
    <Card className="bg-slate-800/50 border-slate-700 h-80">
      <CardHeader>
        <CardTitle className="text-white text-lg">{title}</CardTitle>
        <p className="text-slate-400 text-sm">{subtitle}</p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            {type === "line" ? (
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            ) : (
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
