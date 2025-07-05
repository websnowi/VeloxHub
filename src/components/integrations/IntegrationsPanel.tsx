
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Plus, 
  Settings, 
  Trash2, 
  Link,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface Integration {
  id: string;
  name: string;
  type: string;
  status: 'connected' | 'disconnected' | 'error';
  config: any;
  api_key?: string;
  webhook_url?: string;
  created_at: string;
  updated_at: string;
}

const availableIntegrations = [
  { type: 'notion', name: 'Notion', description: 'Connect your Notion workspace', color: 'bg-black' },
  { type: 'salesforce', name: 'Salesforce', description: 'CRM integration', color: 'bg-blue-600' },
  { type: 'hubspot', name: 'HubSpot', description: 'Marketing automation', color: 'bg-orange-500' },
  { type: 'google-analytics', name: 'Google Analytics', description: 'Website analytics', color: 'bg-orange-600' },
  { type: 'slack', name: 'Slack', description: 'Team communication', color: 'bg-purple-600' },
  { type: 'zapier', name: 'Zapier', description: 'Workflow automation', color: 'bg-orange-400' },
  { type: 'mailchimp', name: 'MailChimp', description: 'Email marketing', color: 'bg-yellow-500' },
  { type: 'stripe', name: 'Stripe', description: 'Payment processing', color: 'bg-indigo-600' },
  { type: 'airtable', name: 'Airtable', description: 'Database management', color: 'bg-yellow-600' },
  { type: 'trello', name: 'Trello', description: 'Project management', color: 'bg-blue-500' }
];

export const IntegrationsPanel = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedIntegrationType, setSelectedIntegrationType] = useState('');
  const [newIntegration, setNewIntegration] = useState({
    name: '',
    api_key: '',
    webhook_url: ''
  });
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadIntegrations();
    }
  }, [user]);

  const loadIntegrations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setIntegrations(data || []);
    } catch (error) {
      console.error('Error loading integrations:', error);
    }
  };

  const addIntegration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !selectedIntegrationType || !newIntegration.name) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('integrations')
        .insert({
          user_id: user.id,
          name: newIntegration.name,
          type: selectedIntegrationType,
          status: 'disconnected',
          api_key: newIntegration.api_key || null,
          webhook_url: newIntegration.webhook_url || null,
          config: {}
        });

      if (error) throw error;

      setNewIntegration({ name: '', api_key: '', webhook_url: '' });
      setSelectedIntegrationType('');
      setShowAddForm(false);
      loadIntegrations();
      
      toast({
        title: "Integration Added",
        description: `${newIntegration.name} has been added successfully.`,
      });
    } catch (error) {
      console.error('Error adding integration:', error);
      toast({
        title: "Error",
        description: "Failed to add integration. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteIntegration = async (integrationId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('integrations')
        .delete()
        .eq('id', integrationId)
        .eq('user_id', user.id);

      if (error) throw error;

      loadIntegrations();
      toast({
        title: "Integration Removed",
        description: "Integration has been removed.",
      });
    } catch (error) {
      console.error('Error deleting integration:', error);
      toast({
        title: "Error",
        description: "Failed to remove integration.",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-600';
      case 'error':
        return 'bg-red-600';
      default:
        return 'bg-yellow-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Zap className="h-6 w-6 text-blue-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Integrations</h2>
            <p className="text-slate-400">Connect your favorite tools and services</p>
          </div>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Integration
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Connected</p>
                <p className="text-xl font-bold text-white">
                  {integrations.filter(i => i.status === 'connected').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Pending</p>
                <p className="text-xl font-bold text-white">
                  {integrations.filter(i => i.status === 'disconnected').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Zap className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Total</p>
                <p className="text-xl font-bold text-white">{integrations.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((integration) => (
          <Card key={integration.id} className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    availableIntegrations.find(i => i.type === integration.type)?.color || 'bg-slate-600'
                  }`}>
                    <Link className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{integration.name}</h4>
                    <p className="text-sm text-slate-400 capitalize">{integration.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(integration.status)}
                  <Badge className={getStatusColor(integration.status)}>
                    {integration.status}
                  </Badge>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50"
                >
                  <Settings className="h-3 w-3 mr-1" />
                  Configure
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deleteIntegration(integration.id)}
                  className="border-red-600 text-red-400 hover:text-red-300 hover:bg-red-600/10"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {integrations.length === 0 && (
          <Card className="bg-slate-800/50 border-slate-700 col-span-full">
            <CardContent className="p-8 text-center">
              <Zap className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Integrations</h3>
              <p className="text-slate-400 mb-4">Connect your favorite tools to streamline your workflow</p>
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Integration
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Integration Form */}
      {showAddForm && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Add New Integration</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={addIntegration} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Integration Type *</Label>
                <select
                  value={selectedIntegrationType}
                  onChange={(e) => setSelectedIntegrationType(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-md px-3 py-2"
                  required
                >
                  <option value="">Select Integration</option>
                  {availableIntegrations.map((integration) => (
                    <option key={integration.type} value={integration.type}>
                      {integration.name} - {integration.description}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="integrationName" className="text-slate-300">Integration Name *</Label>
                <Input
                  id="integrationName"
                  value={newIntegration.name}
                  onChange={(e) => setNewIntegration(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  placeholder="Enter a name for this integration"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="apiKey" className="text-slate-300">API Key (Optional)</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={newIntegration.api_key}
                  onChange={(e) => setNewIntegration(prev => ({ ...prev, api_key: e.target.value }))}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  placeholder="Enter API key if required"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="webhookUrl" className="text-slate-300">Webhook URL (Optional)</Label>
                <Input
                  id="webhookUrl"
                  value={newIntegration.webhook_url}
                  onChange={(e) => setNewIntegration(prev => ({ ...prev, webhook_url: e.target.value }))}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  placeholder="Enter webhook URL if needed"
                />
              </div>
              
              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Add Integration
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                  className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
