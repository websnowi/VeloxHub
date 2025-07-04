
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Database, 
  Mail, 
  Users, 
  BarChart3, 
  Globe, 
  Zap,
  Plus,
  Settings,
  Check,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  category: string;
  connected: boolean;
  status: 'active' | 'error' | 'setup';
  setupRequired: string[];
}

const integrations: Integration[] = [
  {
    id: 'salesforce',
    name: 'Salesforce',
    description: 'Connect your CRM data and lead management',
    icon: Database,
    category: 'CRM',
    connected: true,
    status: 'active',
    setupRequired: ['API Token', 'Organization ID']
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Team communication and notifications',
    icon: Users,
    category: 'Communication',
    connected: true,
    status: 'active',
    setupRequired: ['Bot Token', 'Webhook URL']
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'Marketing automation and customer data',
    icon: Mail,
    category: 'CRM',
    connected: false,
    status: 'setup',
    setupRequired: ['API Key', 'Portal ID']
  },
  {
    id: 'google-analytics',
    name: 'Google Analytics',
    description: 'Website traffic and user behavior insights',
    icon: BarChart3,
    category: 'Analytics',
    connected: false,
    status: 'setup',
    setupRequired: ['Service Account JSON', 'View ID']
  },
  {
    id: 'wordpress',
    name: 'WordPress',
    description: 'Website content and user management',
    icon: Globe,
    category: 'Website',
    connected: false,
    status: 'setup',
    setupRequired: ['Site URL', 'Application Password']
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Workflow automation and app connections',
    icon: Zap,
    category: 'Automation',
    connected: false,
    status: 'setup',
    setupRequired: ['Webhook URL']
  }
];

export const IntegrationsPanel = () => {
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [setupData, setSetupData] = useState<Record<string, string>>({});
  const [viewMode, setViewMode] = useState<'connected' | 'all'>('connected');
  const { toast } = useToast();

  const handleConnect = (integration: Integration) => {
    console.log('Connecting integration:', integration.name);
    if (integration.setupRequired.every(field => setupData[field])) {
      toast({
        title: "Integration Connected",
        description: `${integration.name} has been successfully connected to your dashboard.`,
      });
      setSelectedIntegration(null);
      setSetupData({});
    } else {
      toast({
        title: "Setup Required",
        description: "Please fill in all required fields to connect this integration.",
        variant: "destructive",
      });
    }
  };

  const connectedIntegrations = integrations.filter(i => i.connected);
  const availableIntegrations = integrations.filter(i => !i.connected);

  const getIntegrationsToShow = () => {
    if (viewMode === 'connected') {
      return connectedIntegrations;
    }
    return integrations;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Platform Integrations</h2>
          <p className="text-slate-400">Connect your business tools and data sources</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant={viewMode === 'connected' ? 'default' : 'outline'}
            onClick={() => {
              console.log('Switching to connected view');
              setViewMode('connected');
            }}
            className={viewMode === 'connected' ? 
              'bg-blue-600 hover:bg-blue-700 text-white' : 
              'border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50'
            }
          >
            Connected ({connectedIntegrations.length})
          </Button>
          <Button 
            variant={viewMode === 'all' ? 'default' : 'outline'}
            onClick={() => {
              console.log('Switching to all view');
              setViewMode('all');
            }}
            className={viewMode === 'all' ? 
              'bg-blue-600 hover:bg-blue-700 text-white' : 
              'border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50'
            }
          >
            Browse All
          </Button>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            onClick={() => console.log('Custom Integration clicked')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Custom Integration
          </Button>
        </div>
      </div>

      {viewMode === 'connected' && connectedIntegrations.length === 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-8 text-center">
            <Database className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No Connected Integrations</h3>
            <p className="text-slate-400 mb-4">Connect your first integration to start building powerful dashboards</p>
            <Button 
              onClick={() => {
                console.log('Browse Available Integrations clicked');
                setViewMode('all');
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Browse Available Integrations
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {getIntegrationsToShow().map((integration) => (
          <Card key={integration.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <integration.icon className="h-8 w-8 text-blue-400" />
                  <div>
                    <CardTitle className="text-white text-sm">{integration.name}</CardTitle>
                    <Badge 
                      variant={integration.connected ? "default" : "secondary"} 
                      className="mt-1 text-xs"
                    >
                      {integration.connected ? (
                        <><Check className="h-3 w-3 mr-1" />Connected</>
                      ) : (
                        <><AlertCircle className="h-3 w-3 mr-1" />Setup Required</>
                      )}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    console.log('Settings clicked for:', integration.name);
                    setSelectedIntegration(integration);
                  }}
                  className="text-slate-400 hover:text-white hover:bg-slate-700/50"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400 text-sm mb-3">{integration.description}</p>
              <Button
                size="sm"
                variant={integration.connected ? "outline" : "default"}
                className={integration.connected ? 
                  "border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50" :
                  "bg-blue-600 hover:bg-blue-700 text-white"
                }
                onClick={() => {
                  console.log(integration.connected ? 'Configure' : 'Connect', 'clicked for:', integration.name);
                  setSelectedIntegration(integration);
                }}
              >
                {integration.connected ? "Configure" : "Connect"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Setup Modal */}
      {selectedIntegration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-slate-900 border-slate-700 mx-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <selectedIntegration.icon className="h-8 w-8 text-blue-400" />
                  <div>
                    <CardTitle className="text-white">Setup {selectedIntegration.name}</CardTitle>
                    <p className="text-slate-400 text-sm">{selectedIntegration.description}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    console.log('Close modal clicked');
                    setSelectedIntegration(null);
                  }}
                  className="text-slate-400 hover:text-white hover:bg-slate-700/50"
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedIntegration.setupRequired.map((field) => (
                <div key={field} className="space-y-2">
                  <Label htmlFor={field} className="text-slate-300">{field}</Label>
                  <Input
                    id={field}
                    value={setupData[field] || ''}
                    onChange={(e) => {
                      console.log('Input changed:', field, e.target.value);
                      setSetupData(prev => ({ ...prev, [field]: e.target.value }));
                    }}
                    className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
                    placeholder={`Enter your ${field}`}
                  />
                </div>
              ))}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => handleConnect(selectedIntegration)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  Connect Integration
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    console.log('Cancel clicked');
                    setSelectedIntegration(null);
                  }}
                  className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
