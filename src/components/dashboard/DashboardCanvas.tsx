
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  DollarSign,
  Plus,
  Star,
  Target,
  Share2
} from "lucide-react";
import { MarketingDashboard } from "@/components/marketing/MarketingDashboard";

interface DashboardCanvasProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const DashboardCanvas = ({ activeTab, onTabChange }: DashboardCanvasProps) => {
  const dashboardStats = [
    { title: "Total Users", value: "2,543", icon: Users, change: "+12%", color: "text-blue-400" },
    { title: "Revenue", value: "$45,231", icon: DollarSign, change: "+8%", color: "text-green-400" },
    { title: "Conversion", value: "3.24%", icon: TrendingUp, change: "+2.1%", color: "text-purple-400" },
    { title: "Active Sessions", value: "1,234", icon: Target, change: "+5%", color: "text-yellow-400" }
  ];

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
          <TabsTrigger value="overview" className="text-slate-300 data-[state=active]:text-white data-[state=active]:bg-slate-700">
            Overview
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-slate-300 data-[state=active]:text-white data-[state=active]:bg-slate-700">
            Analytics
          </TabsTrigger>
          <TabsTrigger value="reports" className="text-slate-300 data-[state=active]:text-white data-[state=active]:bg-slate-700">
            Reports
          </TabsTrigger>
          <TabsTrigger value="marketing" className="text-slate-300 data-[state=active]:text-white data-[state=active]:bg-slate-700">
            Marketing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {dashboardStats.map((stat, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">{stat.title}</p>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className={`text-sm ${stat.color}`}>{stat.change}</p>
                    </div>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Dashboard
                </Button>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white justify-start">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Dashboard
                </Button>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white justify-start">
                  <Star className="h-4 w-4 mr-2" />
                  Add to Favorites
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                    <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                    <div>
                      <p className="text-white text-sm">New user registered</p>
                      <p className="text-slate-400 text-xs">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                    <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                    <div>
                      <p className="text-white text-sm">Dashboard updated</p>
                      <p className="text-slate-400 text-xs">5 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                    <div className="h-2 w-2 bg-yellow-400 rounded-full"></div>
                    <div>
                      <p className="text-white text-sm">Integration connected</p>
                      <p className="text-slate-400 text-xs">10 minutes ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="marketing" className="mt-6">
          <MarketingDashboard activeTab={activeTab} onTabChange={onTabChange} />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Analytics Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Analytics Coming Soon</h3>
                <p className="text-slate-400">Advanced analytics and reporting features will be available here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Reports Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Reports Coming Soon</h3>
                <p className="text-slate-400">Comprehensive reporting features will be available here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
