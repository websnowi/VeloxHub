
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  AlertCircle,
  Code,
  Search,
  Filter,
  X
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
  setupFields: string[];
  apiEndpoint?: string;
  documentation?: string;
}

export const IntegrationsPanel = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [setupData, setSetupData] = useState<Record<string, string>>({});
  const [viewMode, setViewMode] = useState<'connected' | 'all'>('connected');
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [customIntegration, setCustomIntegration] = useState({
    name: '',
    description: '',
    apiEndpoint: '',
    category: 'Custom'
  });
  const { toast } = useToast();

  const availableIntegrations: Integration[] = [
    {
      id: 'salesforce',
      name: 'Salesforce',
      description: 'Connect your CRM data and lead management',
      icon: Database,
      category: 'CRM',
      connected: false,
      status: 'setup',
      setupFields: ['API Token', 'Organization ID'],
      documentation: 'https://developer.salesforce.com/'
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Team communication and notifications',
      icon: Users,
      category: 'Communication',
      connected: false,
      status: 'setup',
      setupFields: ['Bot Token', 'Webhook URL'],
      documentation: 'https://api.slack.com/'
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      description: 'Marketing automation and customer data',
      icon: Mail,
      category: 'CRM',
      connected: false,
      status: 'setup',
      setupFields: ['API Key', 'Portal ID'],
      documentation: 'https://developers.hubspot.com/'
    },
    {
      id: 'google-analytics',
      name: 'Google Analytics',
      description: 'Website traffic and user behavior insights',
      icon: BarChart3,
      category: 'Analytics',
      connected: false,
      status: 'setup',
      setupFields: ['Service Account JSON', 'View ID'],
      documentation: 'https://developers.google.com/analytics'
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Workflow automation and app connections',
      icon: Zap,
      category: 'Automation',
      connected: false,
      status: 'setup',
      setupFields: ['Webhook URL'],
      documentation: 'https://zapier.com/developer'
    }
  ];

  const handleConnect = (integration: Integration) => {
    console.log('Connecting integration:', integration.name);
    
    const requiredFields = integration.setupFields || [];
    const hasAllFields = requiredFields.every(field => setupData[field]?.trim());
    
    if (!hasAllFields) {
      toast({
        title: "Setup Required",
        description: "Please fill in all required fields to connect this integration.",
        variant: "destructive",
      });
      return;
    }

    // Update the integration status
    setIntegrations(prev => {
      const existing = prev.find(i => i.id === integration.id);
      if (existing) {
        return prev.map(i => 
          i.id === integration.id 
            ? { ...i, connected: true, status: 'active' as const }
            : i
        );
      } else {
        return [...prev, { ...integration, connected: true, status: 'active' as const }];
      }
    });

    setSelectedIntegration(null);
    setSetupData({});
    toast({
      title: "Integration Connected",
      description: `${integration.name} has been successfully connected to your dashboard.`,
    });
  };

  const handleAddCustomIntegration = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customIntegration.name || !customIntegration.apiEndpoint) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in integration name and API endpoint.",
        variant: "destructive",
      });
      return;
    }

    const newIntegration: Integration = {
      id: `custom-${Date.now()}`,
      name: customIntegration.name,
      description: customIntegration.description || 'Custom integration',
      icon: Code,
      category: 'Custom',
      connected: false,
      status: 'setup',
      setupFields: ['API Key'],
      apiEndpoint: customIntegration.apiEndpoint
    };

    setIntegrations(prev => [...prev, newIntegration]);
    setCustomIntegration({ name: '', description: '', apiEndpoint: '', category: 'Custom' });
    setShowAddCustom(false);
    toast({
      title: "Custom Integration Added",
      description: "Your custom integration has been added. Configure it to start using.",
    });
  };

  const disconnectIntegration = (integrationId: string) => {
    setIntegrations(prev => 
      prev.map(i => 
        i.id === integrationId 
          ? { ...i, connected: false, status: 'setup' as const }
          : i
      )
    );
    toast({
      title: "Integration Disconnected",
      description: "Integration has been disconnected successfully.",
    });
  };

  const connectedIntegrations = integrations.filter(i => i.connected);
  const allIntegrations = [...integrations, ...availableIntegrations.filter(ai => !integrations.find(i => i.id === ai.id))];
  
  const getIntegrationsToShow = () => {
    const baseList = viewMode === 'connected' ? connectedIntegrations : allIntegrations;
    return baseList.filter(integration =>
      integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      integration.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
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
            onClick={() => setViewMode('connected')}
            className={viewMode === 'connected' ? 
              'bg-blue-600 hover:bg-blue-700 text-white' : 
              'border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50'
            }
          >
            Connected ({connectedIntegrations.length})
          </Button>
          <Button 
            variant={viewMode === 'all' ? 'default' : 'outline'}
            onClick={() => setViewMode('all')}
            className={viewMode === 'all' ? 
              'bg-blue-600 hover:bg-blue-700 text-white' : 
              'border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50'
            }
          >
            Browse All
          </Button>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            onClick={() => setShowAddCustom(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Custom Integration
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search integrations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white"
                />
              </div>
            </div>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {viewMode === 'connected' && connectedIntegrations.length === 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-8 text-center">
            <Database className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No Connected Integrations</h3>
            <p className="text-slate-400 mb-4">Connect your first integration to start building powerful dashboards</p>
            <Button 
              onClick={() => setViewMode('all')}
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
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {integration.category}
                    </Badge>
                  </div>
                </div>
                <Badge 
                  className={`${integration.connected ? 'bg-green-600' : 'bg-slate-600'} text-white text-xs`}
                >
                  {integration.connected ? (
                    <><Check className="h-3 w-3 mr-1" />Connected</>
                  ) : (
                    <><AlertCircle className="h-3 w-3 mr-1" />Available</>
                  )}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400 text-sm mb-4">{integration.description}</p>
              <div className="flex gap-2">
                {integration.connected ? (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50"
                      onClick={() => setSelectedIntegration(integration)}
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      Configure
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => disconnectIntegration(integration.id)}
                      className="border-red-600 text-red-400 hover:text-red-300 hover:bg-red-600/10"
                    >
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => setSelectedIntegration(integration)}
                  >
                    Connect
                  </Button>
                )}
              </div>
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
                    <CardTitle className="text-white">{selectedIntegration.name}</CardTitle>
                    <p className="text-slate-400 text-sm">{selectedIntegration.description}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedIntegration(null)}
                  className="text-slate-400 hover:text-white hover:bg-slate-700/50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedIntegration.setupFields?.map((field) => (
                <div key={field} className="space-y-2">
                  <Label htmlFor={field} className="text-slate-300">{field}</Label>
                  <Input
                    id={field}
                    value={setupData[field] || ''}
                    onChange={(e) => setSetupData(prev => ({ ...prev, [field]: e.target.value }))}
                    className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
                    placeholder={`Enter your ${field}`}
                  />
                </div>
              ))}
              
              {selectedIntegration.documentation && (
                <div className="bg-slate-700/30 p-3 rounded-lg">
                  <p className="text-sm text-slate-300 mb-2">Need help setting up?</p>
                  <a 
                    href={selectedIntegration.documentation} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    View Documentation →
                  </a>
                </div>
              )}
              
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => handleConnect(selectedIntegration)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  {selectedIntegration.connected ? 'Update Integration' : 'Connect Integration'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedIntegration(null)}
                  className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Custom Integration Modal */}
      {showAddCustom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-slate-900 border-slate-700 mx-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Add Custom Integration</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAddCustom(false)}
                  className="text-slate-400 hover:text-white hover:bg-slate-700/50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddCustomIntegration} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customName" className="text-slate-300">Integration Name *</Label>
                  <Input
                    id="customName"
                    value={customIntegration.name}
                    onChange={(e) => setCustomIntegration(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-slate-800/50 border-slate-600 text-white"
                    placeholder="My Custom API"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customEndpoint" className="text-slate-300">API Endpoint *</Label>
                  <Input
                    id="customEndpoint"
                    value={customIntegration.apiEndpoint}
                    onChange={(e) => setCustomIntegration(prev => ({ ...prev, apiEndpoint: e.target.value }))}
                    className="bg-slate-800/50 border-slate-600 text-white"
                    placeholder="https://api.example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customDescription" className="text-slate-300">Description</Label>
                  <Textarea
                    id="customDescription"
                    value={customIntegration.description}
                    onChange={(e) => setCustomIntegration(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-slate-800/50 border-slate-600 text-white"
                    placeholder="Describe your custom integration..."
                    rows={2}
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    Add Integration
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddCustom(false)}
                    className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
