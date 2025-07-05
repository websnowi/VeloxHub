
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
  Zap,
  Bot
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface Dashboard {
  id: string;
  name: string;
  type: string;
  starred: boolean;
}

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  activeView: 'dashboard' | 'integrations' | 'knowledge' | 'settings' | 'hr' | 'marketing';
  onViewChange: (view: 'dashboard' | 'integrations' | 'knowledge' | 'settings' | 'hr' | 'marketing') => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const DashboardSidebar = ({ 
  collapsed, 
  activeView, 
  onViewChange, 
  activeTab, 
  onTabChange 
}: DashboardSidebarProps) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['dashboards']);
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadDashboards();
    }
  }, [user]);

  const loadDashboards = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('dashboards')
        .select('id, name, type, starred')
        .eq('user_id', user.id)
        .order('starred', { ascending: false })
        .order('name');

      if (data) {
        setDashboards(data);
      }
    } catch (error) {
      console.error('Error loading dashboards:', error);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleViewChange = (view: 'dashboard' | 'integrations' | 'knowledge' | 'settings' | 'hr' | 'marketing') => {
    onViewChange(view);
  };

  const handleTabChange = (tab: string) => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

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
            onClick={() => handleViewChange('dashboard')}
          >
            <Grid2x2 className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`text-slate-300 hover:text-white hover:bg-slate-700/50 ${activeView === 'hr' ? 'bg-slate-700/50 text-white' : ''}`}
            onClick={() => handleViewChange('hr')}
          >
            <Users className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`text-slate-300 hover:text-white hover:bg-slate-700/50 ${activeView === 'marketing' ? 'bg-slate-700/50 text-white' : ''}`}
            onClick={() => handleViewChange('marketing')}
          >
            <Mail className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`text-slate-300 hover:text-white hover:bg-slate-700/50 ${activeView === 'integrations' ? 'bg-slate-700/50 text-white' : ''}`}
            onClick={() => handleViewChange('integrations')}
          >
            <Database className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`text-slate-300 hover:text-white hover:bg-slate-700/50 ${activeView === 'knowledge' ? 'bg-slate-700/50 text-white' : ''}`}
            onClick={() => handleViewChange('knowledge')}
          >
            <BookOpen className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`text-slate-300 hover:text-white hover:bg-slate-700/50 ${activeView === 'settings' ? 'bg-slate-700/50 text-white' : ''}`}
            onClick={() => handleViewChange('settings')}
          >
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
                handleViewChange('dashboard');
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
                    key={dashboard.id}
                    variant="ghost"
                    className="w-full justify-between text-slate-400 hover:text-white hover:bg-slate-700/50 text-sm"
                    onClick={() => handleTabChange(`dashboard-${dashboard.id}`)}
                  >
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-3 w-3" />
                      <span className="truncate">{dashboard.name}</span>
                    </div>
                    {dashboard.starred && <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />}
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  className="w-full justify-start text-slate-500 hover:text-white hover:bg-slate-700/50 text-sm"
                  onClick={() => handleTabChange('create-dashboard')}
                >
                  <Plus className="h-3 w-3 mr-2" />
                  Create Dashboard
                </Button>
              </div>
            )}
          </div>

          {/* HR Section */}
          <div>
            <Button
              variant="ghost"
              className={`w-full justify-start hover:text-white hover:bg-slate-700/50 ${activeView === 'hr' ? 'bg-slate-700/50 text-white' : 'text-slate-300'}`}
              onClick={() => handleViewChange('hr')}
            >
              <Users className="h-4 w-4 mr-2" />
              HR Management
            </Button>
          </div>

          {/* Marketing Section */}
          <div>
            <Button
              variant="ghost"
              className={`w-full justify-between hover:text-white hover:bg-slate-700/50 mb-2 ${activeView === 'marketing' ? 'bg-slate-700/50 text-white' : 'text-slate-300'}`}
              onClick={() => {
                toggleSection('marketing');
                handleViewChange('marketing');
              }}
            >
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>Marketing</span>
              </div>
              {expandedSections.includes('marketing') ? 
                <ChevronDown className="h-4 w-4" /> : 
                <ChevronRight className="h-4 w-4" />
              }
            </Button>
            
            {expandedSections.includes('marketing') && (
              <div className="ml-6 space-y-1">
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-slate-400 hover:text-white hover:bg-slate-700/50 text-sm ${activeTab === 'websites' ? 'bg-slate-600/50 text-white' : ''}`}
                  onClick={() => {
                    handleViewChange('marketing');
                    handleTabChange('websites');
                  }}
                >
                  <Share className="h-3 w-3 mr-2" />
                  Websites
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-slate-400 hover:text-white hover:bg-slate-700/50 text-sm ${activeTab === 'social' ? 'bg-slate-600/50 text-white' : ''}`}
                  onClick={() => {
                    handleViewChange('marketing');
                    handleTabChange('social');
                  }}
                >
                  <Share className="h-3 w-3 mr-2" />
                  Social Media
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-slate-400 hover:text-white hover:bg-slate-700/50 text-sm ${activeTab === 'automation' ? 'bg-slate-600/50 text-white' : ''}`}
                  onClick={() => {
                    handleViewChange('marketing');
                    handleTabChange('automation');
                  }}
                >
                  <Bot className="h-3 w-3 mr-2" />
                  Social Bots
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-slate-400 hover:text-white hover:bg-slate-700/50 text-sm ${activeTab === 'campaigns' ? 'bg-slate-600/50 text-white' : ''}`}
                  onClick={() => {
                    handleViewChange('marketing');
                    handleTabChange('campaigns');
                  }}
                >
                  <Calendar className="h-3 w-3 mr-2" />
                  Campaigns
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
                handleViewChange('integrations');
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
                  onClick={() => handleTabChange('add-integration')}
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
              onClick={() => handleViewChange('knowledge')}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Knowledge Base
            </Button>
          </div>

          {/* Settings */}
          <div>
            <Button
              variant="ghost"
              className={`w-full justify-start hover:text-white hover:bg-slate-700/50 ${activeView === 'settings' ? 'bg-slate-700/50 text-white' : 'text-slate-300'}`}
              onClick={() => handleViewChange('settings')}
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
