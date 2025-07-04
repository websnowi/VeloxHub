
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricsWidget } from "@/components/widgets/MetricsWidget";
import { ChartWidget } from "@/components/widgets/ChartWidget";
import { TableWidget } from "@/components/widgets/TableWidget";
import { Plus, LayoutGrid, Filter, Download, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const DashboardCanvas = () => {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDragStart = (e: React.DragEvent, widgetType: string) => {
    setDraggedItem(widgetType);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    console.log('Dropped widget:', draggedItem);
    toast({
      title: "Widget Added",
      description: `${draggedItem} widget has been added to your dashboard`,
    });
    setDraggedItem(null);
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your dashboard data is being exported...",
    });
  };

  const handleFilter = () => {
    toast({
      title: "Filters",
      description: "Filter panel opened",
    });
  };

  return (
    <div className="p-6 min-h-screen">
      {/* Dashboard Controls */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Sales Overview Dashboard</h2>
          <p className="text-slate-400">Real-time business insights and analytics</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50"
            onClick={handleFilter}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50"
            onClick={handleExport}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            Edit Layout
          </Button>
        </div>
      </div>

      {/* Widget Palette */}
      <Card className="bg-slate-800/50 border-slate-700 mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-sm font-medium flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Add Widgets & Integrations
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { type: 'metrics', label: 'Metrics Card', icon: '📊' },
              { type: 'chart', label: 'Chart', icon: '📈' },
              { type: 'table', label: 'Data Table', icon: '📋' },
              { type: 'kpi', label: 'KPI', icon: '🎯' },
              { type: 'timeline', label: 'Timeline', icon: '⏱️' },
              { type: 'calendar', label: 'Calendar', icon: '📅' },
            ].map((widget) => (
              <Button
                key={widget.type}
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50 flex flex-col h-16 p-2"
                draggable
                onDragStart={(e) => handleDragStart(e, widget.type)}
              >
                <span className="text-lg mb-1">{widget.icon}</span>
                <span className="text-xs">{widget.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Grid */}
      <div 
        className="grid grid-cols-12 gap-6 min-h-96"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Metrics Row */}
        <div className="col-span-12 md:col-span-3">
          <MetricsWidget 
            title="Total Revenue"
            value="$124,592"
            change="+12.5%"
            trend="up"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <MetricsWidget 
            title="Active Users"
            value="2,847"
            change="+8.2%"
            trend="up"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <MetricsWidget 
            title="Conversion Rate"
            value="3.24%"
            change="-2.1%"
            trend="down"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <MetricsWidget 
            title="Customer Satisfaction"
            value="4.8/5"
            change="+0.3"
            trend="up"
          />
        </div>

        {/* Charts Row */}
        <div className="col-span-12 lg:col-span-8">
          <ChartWidget 
            title="Revenue Trends"
            subtitle="Monthly performance overview"
          />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <ChartWidget 
            title="Traffic Sources"
            subtitle="Acquisition channels"
            type="pie"
          />
        </div>

        {/* Table Row */}
        <div className="col-span-12">
          <TableWidget 
            title="Recent Orders"
            subtitle="Latest customer transactions"
          />
        </div>
      </div>

      {/* Drop Zone Indicator */}
      {draggedItem && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-6 border-2 border-dashed border-blue-500 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <div className="text-blue-400 text-lg font-medium">
              Drop widget here to add to dashboard
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
