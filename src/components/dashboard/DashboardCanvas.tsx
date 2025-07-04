
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Target,
  Plus,
  BarChart3,
  Clock,
  UserCheck,
  Globe,
  Share2,
  Star,
  Building
} from "lucide-react";
import { HRDashboard } from "@/components/hr/HRDashboard";
import { MarketingDashboard } from "@/components/marketing/MarketingDashboard";

export const DashboardCanvas = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'hr' | 'marketing'>('overview');

  const quickStats = [
    {
      title: "Total Employees",
      value: "0",
      icon: Users,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "Active Campaigns",
      value: "0",
      icon: TrendingUp,
      color: "text-green-400",
      bgColor: "bg-green-500/10"
    },
    {
      title: "Monthly Revenue",
      value: "$0",
      icon: DollarSign,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10"
    },
    {
      title: "Active Integrations",
      value: "0",
      icon: Target,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10"
    }
  ];

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'hr':
        return <HRDashboard />;
      case 'marketing':
        return <MarketingDashboard />;
      default:
        return (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickStats.map((stat, index) => (
                <Card key={index} className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-400">{stat.title}</p>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => setActiveSection('hr')}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-6 h-auto flex flex-col gap-2"
                  >
                    <Users className="h-8 w-8" />
                    <span className="font-medium">Manage HR</span>
                    <span className="text-sm opacity-80">Employee management, payroll & more</span>
                  </Button>
                  <Button 
                    onClick={() => setActiveSection('marketing')}
                    className="bg-green-600 hover:bg-green-700 text-white p-6 h-auto flex flex-col gap-2"
                  >
                    <TrendingUp className="h-8 w-8" />
                    <span className="font-medium">Marketing Tools</span>
                    <span className="text-sm opacity-80">Campaigns, analytics & social media</span>
                  </Button>
                  <Button 
                    className="bg-purple-600 hover:bg-purple-700 text-white p-6 h-auto flex flex-col gap-2"
                  >
                    <Plus className="h-8 w-8" />
                    <span className="font-medium">Add Integration</span>
                    <span className="text-sm opacity-80">Connect new tools & platforms</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Getting Started */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Getting Started</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">1</div>
                    <div>
                      <p className="text-white font-medium">Connect Your First Integration</p>
                      <p className="text-slate-400 text-sm">Start by connecting your existing tools and platforms</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-medium">2</div>
                    <div>
                      <p className="text-white font-medium">Set Up Your Team</p>
                      <p className="text-slate-400 text-sm">Add employees and configure HR management</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">3</div>
                    <div>
                      <p className="text-white font-medium">Launch Marketing Campaigns</p>
                      <p className="text-slate-400 text-sm">Create and manage your marketing initiatives</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Navigation */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeSection === 'overview' ? 'default' : 'outline'}
          onClick={() => setActiveSection('overview')}
          className={activeSection === 'overview' ? 
            'bg-blue-600 hover:bg-blue-700 text-white' : 
            'border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50'
          }
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          Overview
        </Button>
        <Button
          variant={activeSection === 'hr' ? 'default' : 'outline'}
          onClick={() => setActiveSection('hr')}
          className={activeSection === 'hr' ? 
            'bg-blue-600 hover:bg-blue-700 text-white' : 
            'border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50'
          }
        >
          <Users className="h-4 w-4 mr-2" />
          HR Management
        </Button>
        <Button
          variant={activeSection === 'marketing' ? 'default' : 'outline'}
          onClick={() => setActiveSection('marketing')}
          className={activeSection === 'marketing' ? 
            'bg-blue-600 hover:bg-blue-700 text-white' : 
            'border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50'
          }
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          Marketing
        </Button>
      </div>

      {renderActiveSection()}
    </div>
  );
};
