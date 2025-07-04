
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Grid2x2, 
  BarChart3, 
  Users, 
  Mail, 
  Calendar, 
  Database, 
  Settings, 
  Plus,
  ChevronDown,
  ChevronRight,
  Star,
  Share,
  BookOpen,
  Zap
} from "lucide-react";
import { useState } from "react";

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  activeView: 'dashboard' | 'integrations' | 'knowledge';
  onViewChange: (view: 'dashboard' | 'integrations' | 'knowledge') => void;
}

export const DashboardSidebar = ({ collapsed, activeView, onViewChange }: DashboardSidebarProps) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['dashboards']);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const dashboards = [
    { name: "Sales Overview", icon: BarChart3, starred: true },
    { name: "HR Dashboard", icon: Users, starred: false },
    { name: "Marketing Analytics", icon: Mail, starred: true },
    { name: "Operations Board", icon: Calendar, starred: false },
  ];

  const integrations = [
    { name: "Salesforce", connected: true },
    { name: "HubSpot", connected: true },
    { name: "Google Analytics", connected: false },
    { name: "Slack", connected: true },
  ];

  if (collapsed) {
    return (
      <aside className="w-16 h-[calc(100vh-4rem)] bg-slate-800/30 backdrop-blur-lg border-r border-slate-700/50 fixed left-0 top-16 z-40">
        <div className="flex flex-col items-center py-4 gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className={`text-slate-300 hover:text-white hover:bg-slate-700/50 ${activeView === 'dashboard' ? 'bg-slate-700/50 text-white' : ''}`}
            onClick={() => onViewChange('dashboard')}
          >
            <Grid2x2 className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`text-slate-300 hover:text-white hover:bg-slate-700/50 ${activeView === 'integrations' ? 'bg-slate-700/50 text-white' : ''}`}
            onClick={() => onViewChange('integrations')}
          >
            <Database className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`text-slate-300 hover:text-white hover:bg-slate-700/50 ${activeView === 'knowledge' ? 'bg-slate-700/50 text-white' : ''}`}
            onClick={() => onViewChange('knowledge')}
          >
            <BookOpen className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white hover:bg-slate-700/50">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-64 h-[calc(100vh-4rem)] bg-slate-800/30 backdrop-blur-lg border-r border-slate-700/50 fixed left-0 top-16 z-40">
      <ScrollArea className="h-full">
        <div className="p-4 space-y-6">
          {/* Dashboards Section */}
          <div>
            <Button
              variant="ghost"
              className={`w-full justify-between hover:text-white hover:bg-slate-700/50 mb-2 ${activeView === 'dashboard' ? 'bg-slate-700/50 text-white' : 'text-slate-300'}`}
              onClick={() => {
                toggleSection('dashboards');
                onViewChange('dashboard');
              }}
            >
              <div className="flex items-center gap-2">
                <Grid2x2 className="h-4 w-4" />
                <span>Dashboards</span>
              </div>
              {expandedSections.includes('dashboards') ? 
                <ChevronDown className="h-4 w-4" /> : 
                <ChevronRight className="h-4 w-4" />
              }
            </Button>
            
            {expandedSections.includes('dashboards') && (
              <div className="ml-6 space-y-1">
                {dashboards.map((dashboard) => (
                  <Button
                    key={dashboard.name}
                    variant="ghost"
                    className="w-full justify-between text-slate-400 hover:text-white hover:bg-slate-700/50 text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <dashboard.icon className="h-3 w-3" />
                      <span className="truncate">{dashboard.name}</span>
                    </div>
                    {dashboard.starred && <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />}
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  className="w-full justify-start text-slate-500 hover:text-white hover:bg-slate-700/50 text-sm"
                >
                  <Plus className="h-3 w-3 mr-2" />
                  Create Dashboard
                </Button>
              </div>
            )}
          </div>

          {/* Integrations Section */}
          <div>
            <Button
              variant="ghost"
              className={`w-full justify-between hover:text-white hover:bg-slate-700/50 mb-2 ${activeView === 'integrations' ? 'bg-slate-700/50 text-white' : 'text-slate-300'}`}
              onClick={() => {
                toggleSection('integrations');
                onViewChange('integrations');
              }}
            >
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                <span>Integrations</span>
              </div>
              {expandedSections.includes('integrations') ? 
                <ChevronDown className="h-4 w-4" /> : 
                <ChevronRight className="h-4 w-4" />
              }
            </Button>
            
            {expandedSections.includes('integrations') && (
              <div className="ml-6 space-y-1">
                {integrations.map((integration) => (
                  <div key={integration.name} className="flex items-center justify-between py-1 px-2 rounded hover:bg-slate-700/50">
                    <span className="text-slate-400 text-sm">{integration.name}</span>
                    <Badge variant={integration.connected ? "default" : "secondary"} className="text-xs">
                      {integration.connected ? "Connected" : "Setup"}
                    </Badge>
                  </div>
                ))}
                <Button
                  variant="ghost"
                  className="w-full justify-start text-slate-500 hover:text-white hover:bg-slate-700/50 text-sm"
                >
                  <Plus className="h-3 w-3 mr-2" />
                  Add Integration
                </Button>
              </div>
            )}
          </div>

          {/* Knowledge Base Section */}
          <div>
            <Button
              variant="ghost"
              className={`w-full justify-start hover:text-white hover:bg-slate-700/50 ${activeView === 'knowledge' ? 'bg-slate-700/50 text-white' : 'text-slate-300'}`}
              onClick={() => onViewChange('knowledge')}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Knowledge Base
            </Button>
          </div>

          {/* Templates Section */}
          <div>
            <Button
              variant="ghost"
              className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700/50"
            >
              <Share className="h-4 w-4 mr-2" />
              Templates
            </Button>
          </div>

          {/* Automation Section */}
          <div>
            <Button
              variant="ghost"
              className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700/50"
            >
              <Zap className="h-4 w-4 mr-2" />
              Automation
            </Button>
          </div>

          {/* Settings */}
          <div>
            <Button
              variant="ghost"
              className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700/50"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
};
