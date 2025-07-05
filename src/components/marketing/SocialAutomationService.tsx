
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Code, 
  Server, 
  Settings, 
  Play, 
  Pause, 
  RefreshCw,
  Terminal,
  Zap,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AutomationBot {
  id: string;
  name: string;
  type: 'selenium' | 'api' | 'webhook' | 'custom';
  status: 'active' | 'paused' | 'error';
  platforms: string[];
  lastRun?: string;
  nextRun?: string;
  runsToday: number;
}

interface MCPServer {
  id: string;
  name: string;
  endpoint: string;
  status: 'connected' | 'disconnected' | 'error';
  capabilities: string[];
}

export const SocialAutomationService = () => {
  const [automationBots, setAutomationBots] = useState<AutomationBot[]>([]);
  const [mcpServers, setMCPServers] = useState<MCPServer[]>([]);
  const [showBotForm, setShowBotForm] = useState(false);
  const [showServerForm, setShowServerForm] = useState(false);
  const [newBot, setNewBot] = useState({
    name: '',
    type: 'selenium' as const,
    platforms: [] as string[],
    script: ''
  });
  const [newServer, setNewServer] = useState({
    name: '',
    endpoint: '',
    capabilities: [] as string[]
  });
  const { toast } = useToast();

  // Load data from localStorage
  useEffect(() => {
    const savedBots = localStorage.getItem('automationBots');
    const savedServers = localStorage.getItem('mcpServers');
    
    if (savedBots) {
      try {
        setAutomationBots(JSON.parse(savedBots));
      } catch (error) {
        console.error('Error loading automation bots:', error);
      }
    }
    
    if (savedServers) {
      try {
        setMCPServers(JSON.parse(savedServers));
      } catch (error) {
        console.error('Error loading MCP servers:', error);
      }
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('automationBots', JSON.stringify(automationBots));
  }, [automationBots]);

  useEffect(() => {
    localStorage.setItem('mcpServers', JSON.stringify(mcpServers));
  }, [mcpServers]);

  const createBot = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newBot.name || newBot.platforms.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please provide bot name and select platforms.",
        variant: "destructive",
      });
      return;
    }

    const bot: AutomationBot = {
      id: Date.now().toString(),
      name: newBot.name,
      type: newBot.type,
      status: 'paused',
      platforms: newBot.platforms,
      runsToday: 0
    };

    setAutomationBots(prev => [...prev, bot]);
    setNewBot({ name: '', type: 'selenium', platforms: [], script: '' });
    setShowBotForm(false);
    
    toast({
      title: "Bot Created",
      description: "Your automation bot has been created successfully.",
    });
  };

  const createMCPServer = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newServer.name || !newServer.endpoint) {
      toast({
        title: "Missing Information",
        description: "Please provide server name and endpoint.",
        variant: "destructive",
      });
      return;
    }

    const server: MCPServer = {
      id: Date.now().toString(),
      name: newServer.name,
      endpoint: newServer.endpoint,
      status: 'disconnected',
      capabilities: newServer.capabilities
    };

    setMCPServers(prev => [...prev, server]);
    setNewServer({ name: '', endpoint: '', capabilities: [] });
    setShowServerForm(false);
    
    toast({
      title: "MCP Server Added",
      description: "Your MCP server configuration has been saved.",
    });
  };

  const toggleBot = (botId: string) => {
    setAutomationBots(prev => 
      prev.map(bot => 
        bot.id === botId 
          ? { 
              ...bot, 
              status: bot.status === 'active' ? 'paused' : 'active',
              lastRun: bot.status === 'paused' ? new Date().toISOString() : bot.lastRun
            }
          : bot
      )
    );
  };

  const deleteBot = (botId: string) => {
    setAutomationBots(prev => prev.filter(bot => bot.id !== botId));
    toast({
      title: "Bot Deleted",
      description: "Automation bot has been removed.",
    });
  };

  const connectMCPServer = async (serverId: string) => {
    setMCPServers(prev => 
      prev.map(server => 
        server.id === serverId 
          ? { ...server, status: 'connected' }
          : server
      )
    );
    
    toast({
      title: "Server Connected",
      description: "MCP server connection established.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Service Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Bot className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Active Bots</p>
                <p className="text-xl font-bold text-white">
                  {automationBots.filter(bot => bot.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Server className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">MCP Servers</p>
                <p className="text-xl font-bold text-white">{mcpServers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Zap className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Runs Today</p>
                <p className="text-xl font-bold text-white">
                  {automationBots.reduce((sum, bot) => sum + bot.runsToday, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Clock className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Uptime</p>
                <p className="text-xl font-bold text-white">99.9%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Automation Bots */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-400" />
              Automation Bots
            </CardTitle>
            <Button
              onClick={() => setShowBotForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Bot className="h-4 w-4 mr-2" />
              Create Bot
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {automationBots.length === 0 ? (
            <div className="text-center py-8">
              <Bot className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Automation Bots</h3>
              <p className="text-slate-400">Create your first automation bot to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {automationBots.map((bot) => (
                <Card key={bot.id} className="bg-slate-700/30 border-slate-600">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-white">{bot.name}</h4>
                        <p className="text-sm text-slate-400 capitalize">{bot.type} automation</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          className={
                            bot.status === 'active' ? 'bg-green-600' :
                            bot.status === 'error' ? 'bg-red-600' : 'bg-slate-600'
                          }
                        >
                          {bot.status === 'active' && <CheckCircle className="h-3 w-3 mr-1" />}
                          {bot.status === 'error' && <AlertCircle className="h-3 w-3 mr-1" />}
                          {bot.status}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleBot(bot.id)}
                          className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50"
                        >
                          {bot.status === 'active' ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteBot(bot.id)}
                          className="border-red-600 text-red-400 hover:text-red-300 hover:bg-red-600/10"
                        >
                          <Terminal className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-slate-300">
                        <span>Platforms: </span>
                        <span className="font-medium">{bot.platforms.join(', ')}</span>
                      </div>
                      <div className="text-slate-300">
                        <span>Runs Today: </span>
                        <span className="font-medium">{bot.runsToday}</span>
                      </div>
                      {bot.lastRun && (
                        <div className="text-slate-300">
                          <span>Last Run: </span>
                          <span className="font-medium">
                            {new Date(bot.lastRun).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {bot.nextRun && (
                        <div className="text-slate-300">
                          <span>Next Run: </span>
                          <span className="font-medium">
                            {new Date(bot.nextRun).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* MCP Servers */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Server className="h-5 w-5 text-green-400" />
              MCP Servers
            </CardTitle>
            <Button
              onClick={() => setShowServerForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Server className="h-4 w-4 mr-2" />
              Add Server
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {mcpServers.length === 0 ? (
            <div className="text-center py-8">
              <Server className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No MCP Servers</h3>
              <p className="text-slate-400">Connect to MCP servers for advanced automation</p>
            </div>
          ) : (
            <div className="space-y-4">
              {mcpServers.map((server) => (
                <Card key={server.id} className="bg-slate-700/30 border-slate-600">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-white">{server.name}</h4>
                        <p className="text-sm text-slate-400">{server.endpoint}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          className={
                            server.status === 'connected' ? 'bg-green-600' :
                            server.status === 'error' ? 'bg-red-600' : 'bg-slate-600'
                          }
                        >
                          {server.status}
                        </Badge>
                        {server.status === 'disconnected' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => connectMCPServer(server.id)}
                            className="border-green-600 text-green-400 hover:text-green-300 hover:bg-green-600/10"
                          >
                            Connect
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {server.capabilities.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {server.capabilities.map((capability, index) => (
                          <Badge key={index} variant="outline" className="text-slate-300 border-slate-600">
                            {capability}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bot Creation Form */}
      {showBotForm && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-400" />
              Create Automation Bot
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={createBot} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="botName" className="text-slate-300">Bot Name *</Label>
                <Input
                  id="botName"
                  value={newBot.name}
                  onChange={(e) => setNewBot(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  placeholder="e.g., Instagram Auto Poster"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-300">Bot Type</Label>
                <select
                  value={newBot.type}
                  onChange={(e) => setNewBot(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-md px-3 py-2"
                >
                  <option value="selenium">Selenium (Browser Automation)</option>
                  <option value="api">API Integration</option>
                  <option value="webhook">Webhook Trigger</option>
                  <option value="custom">Custom Script</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-300">Target Platforms *</Label>
                <div className="flex flex-wrap gap-2">
                  {['Facebook', 'Twitter', 'Instagram', 'LinkedIn', 'YouTube'].map((platform) => (
                    <Button
                      key={platform}
                      type="button"
                      variant={newBot.platforms.includes(platform) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setNewBot(prev => ({
                          ...prev,
                          platforms: prev.platforms.includes(platform)
                            ? prev.platforms.filter(p => p !== platform)
                            : [...prev.platforms, platform]
                        }));
                      }}
                      className={newBot.platforms.includes(platform) 
                        ? "bg-blue-600 hover:bg-blue-700 text-white" 
                        : "border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50"
                      }
                    >
                      {platform}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="botScript" className="text-slate-300">Automation Script (Optional)</Label>
                <Textarea
                  id="botScript"
                  value={newBot.script}
                  onChange={(e) => setNewBot(prev => ({ ...prev, script: e.target.value }))}
                  className="bg-slate-700/50 border-slate-600 text-white min-h-32 font-mono text-sm"
                  placeholder="// Python/JavaScript automation script
# Example Selenium script for Instagram
from selenium import webdriver

driver = webdriver.Chrome()
driver.get('https://instagram.com')
# Your automation logic here..."
                />
              </div>
              
              <div className="bg-slate-700/30 p-4 rounded-lg">
                <p className="text-sm text-slate-300 mb-2">
                  <strong>Bot Capabilities:</strong>
                </p>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• Automated posting and scheduling</li>
                  <li>• Cross-platform content distribution</li>
                  <li>• Error handling and retry mechanisms</li>
                  <li>• Performance monitoring and logging</li>
                  <li>• Integration with MCP servers</li>
                </ul>
              </div>
              
              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Create Bot
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowBotForm(false)}
                  className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* MCP Server Form */}
      {showServerForm && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Server className="h-5 w-5 text-green-400" />
              Add MCP Server
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={createMCPServer} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="serverName" className="text-slate-300">Server Name *</Label>
                <Input
                  id="serverName"
                  value={newServer.name}
                  onChange={(e) => setNewServer(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  placeholder="e.g., Social Media Automation Server"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="serverEndpoint" className="text-slate-300">Server Endpoint *</Label>
                <Input
                  id="serverEndpoint"
                  value={newServer.endpoint}
                  onChange={(e) => setNewServer(prev => ({ ...prev, endpoint: e.target.value }))}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  placeholder="ws://localhost:8080/mcp or https://api.example.com/mcp"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-300">Server Capabilities</Label>
                <div className="flex flex-wrap gap-2">
                  {['posting', 'scheduling', 'analytics', 'media-upload', 'user-management'].map((capability) => (
                    <Button
                      key={capability}
                      type="button"
                      variant={newServer.capabilities.includes(capability) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setNewServer(prev => ({
                          ...prev,
                          capabilities: prev.capabilities.includes(capability)
                            ? prev.capabilities.filter(c => c !== capability)
                            : [...prev.capabilities, capability]
                        }));
                      }}
                      className={newServer.capabilities.includes(capability) 
                        ? "bg-green-600 hover:bg-green-700 text-white" 
                        : "border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50"
                      }
                    >
                      {capability}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="bg-slate-700/30 p-4 rounded-lg">
                <p className="text-sm text-slate-300 mb-2">
                  <strong>MCP Server Features:</strong>
                </p>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• Model Context Protocol integration</li>
                  <li>• Real-time communication with automation bots</li>
                  <li>• Scalable processing capabilities</li>
                  <li>• Custom tool and resource management</li>
                  <li>• Advanced error handling and monitoring</li>
                </ul>
              </div>
              
              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Add Server
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowServerForm(false)}
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
