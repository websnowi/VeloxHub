
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Settings, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Zap,
  Database,
  Mail,
  Calendar,
  MessageSquare,
  BarChart3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface Integration {
  id: string;
  name: string;
  type: string;
  status: "connected" | "error" | "disconnected";
  api_key?: string;
  webhook_url?: string;
  config?: any;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const IntegrationsPanel = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newIntegration, setNewIntegration] = useState({
    name: "",
    type: "",
    api_key: "",
    webhook_url: ""
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
      
      // Map the data to ensure proper typing
      const typedData: Integration[] = (data || []).map(item => ({
        ...item,
        status: (item.status as "connected" | "error" | "disconnected") || "disconnected"
      }));
      
      setIntegrations(typedData);
    } catch (error) {
      console.error('Error loading integrations:', error);
      toast({
        title: "Error",
        description: "Failed to load integrations",
        variant: "destructive"
      });
    }
  };

  const addIntegration = async () => {
    if (!user || !newIntegration.name || !newIntegration.type) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('integrations')
        .insert([
          {
            name: newIntegration.name,
            type: newIntegration.type,
            api_key: newIntegration.api_key,
            webhook_url: newIntegration.webhook_url,
            status: 'connected',
            user_id: user.id
          }
        ])
        .select()
        .single();

      if (error) throw error;

      const typedData: Integration = {
        ...data,
        status: (data.status as "connected" | "error" | "disconnected") || "connected"
      };

      setIntegrations(prev => [typedData, ...prev]);
      setNewIntegration({ name: "", type: "", api_key: "", webhook_url: "" });
      setIsAddDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Integration added successfully"
      });
    } catch (error) {
      console.error('Error adding integration:', error);
      toast({
        title: "Error",
        description: "Failed to add integration",
        variant: "destructive"
      });
    }
  };

  const getIntegrationIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'salesforce': return <Database className="h-5 w-5" />;
      case 'mailchimp': return <Mail className="h-5 w-5" />;
      case 'google analytics': return <BarChart3 className="h-5 w-5" />;
      case 'slack': return <MessageSquare className="h-5 w-5" />;
      case 'notion': return <Database className="h-5 w-5" />;
      case 'calendar': return <Calendar className="h-5 w-5" />;
      default: return <Zap className="h-5 w-5" />;
    }
  };

  const getStatusIcon = (status: Integration['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-400" />;
      case 'disconnected':
        return <AlertCircle className="h-4 w-4 text-yellow-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: Integration['status']) => {
    const variants = {
      connected: "bg-green-900/20 text-green-400 border-green-400/20",
      error: "bg-red-900/20 text-red-400 border-red-400/20",
      disconnected: "bg-yellow-900/20 text-yellow-400 border-yellow-400/20"
    };
    
    return (
      <Badge className={variants[status] || variants.disconnected}>
        {getStatusIcon(status)}
        <span className="ml-1">{status}</span>
      </Badge>
    );
  };

  const integrationTypes = [
    "Salesforce",
    "Mailchimp", 
    "Google Analytics",
    "Slack",
    "Notion",
    "Zapier",
    "HubSpot",
    "Stripe",
    "PayPal",
    "Shopify"
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Integrations</h2>
          <p className="text-slate-400">Connect your favorite tools and services</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Integration
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle>Add New Integration</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Integration Name</Label>
                <Input
                  id="name"
                  value={newIntegration.name}
                  onChange={(e) => setNewIntegration(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., My Salesforce"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="type">Integration Type</Label>
                <Select value={newIntegration.type} onValueChange={(value) => setNewIntegration(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select integration type" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {integrationTypes.map((type) => (
                      <SelectItem key={type} value={type} className="text-white hover:bg-slate-700">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="api_key">API Key (Optional)</Label>
                <Input
                  id="api_key"
                  type="password"
                  value={newIntegration.api_key}
                  onChange={(e) => setNewIntegration(prev => ({ ...prev, api_key: e.target.value }))}
                  placeholder="Enter API key"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="webhook_url">Webhook URL (Optional)</Label>
                <Input
                  id="webhook_url"
                  value={newIntegration.webhook_url}
                  onChange={(e) => setNewIntegration(prev => ({ ...prev, webhook_url: e.target.value }))}
                  placeholder="https://your-webhook-url.com"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              
              <Button onClick={addIntegration} className="w-full bg-blue-600 hover:bg-blue-700">
                Add Integration
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.length === 0 ? (
          <Card className="col-span-full bg-slate-800/50 border-slate-700">
            <CardContent className="p-8 text-center">
              <Zap className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Integrations Yet</h3>
              <p className="text-slate-400 mb-4">Connect your first integration to get started</p>
              <Button 
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Integration
              </Button>
            </CardContent>
          </Card>
        ) : (
          integrations.map((integration) => (
            <Card key={integration.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-700/50 rounded-lg">
                      {getIntegrationIcon(integration.type)}
                    </div>
                    <div>
                      <CardTitle className="text-white text-sm">{integration.name}</CardTitle>
                      <p className="text-xs text-slate-400">{integration.type}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-400 hover:text-white hover:bg-slate-700/50"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  {getStatusBadge(integration.status)}
                  <div className="text-xs text-slate-500">
                    {new Date(integration.created_at).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
