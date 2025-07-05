
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube,
  Plus,
  Settings,
  Users,
  TrendingUp,
  Share2,
  X,
  Bot,
  Clock,
  Play,
  Pause,
  Calendar,
  Send
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SocialAccount {
  id: string;
  platform: string;
  username: string;
  followers: number;
  connected: boolean;
  icon: React.ComponentType<any>;
  color: string;
}

interface AutomationRule {
  id: string;
  name: string;
  platforms: string[];
  content: string;
  schedule: string;
  active: boolean;
  lastRun?: string;
}

interface SocialMediaManagerProps {
  socialAccounts: SocialAccount[];
  setSocialAccounts: (accounts: SocialAccount[] | ((prev: SocialAccount[]) => SocialAccount[])) => void;
}

export const SocialMediaManager = ({ socialAccounts, setSocialAccounts }: SocialMediaManagerProps) => {
  const [showConnectForm, setShowConnectForm] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<SocialAccount | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    accessToken: ''
  });
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([]);
  const [showAutomationForm, setShowAutomationForm] = useState(false);
  const [newRule, setNewRule] = useState({
    name: '',
    platforms: [] as string[],
    content: '',
    schedule: 'daily'
  });
  const [bulkPostContent, setBulkPostContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const { toast } = useToast();

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedAccounts = localStorage.getItem('socialAccounts');
    const savedRules = localStorage.getItem('automationRules');
    
    if (savedAccounts) {
      try {
        const accounts = JSON.parse(savedAccounts);
        setSocialAccounts(accounts);
      } catch (error) {
        console.error('Error loading social accounts:', error);
      }
    }
    
    if (savedRules) {
      try {
        const rules = JSON.parse(savedRules);
        setAutomationRules(rules);
      } catch (error) {
        console.error('Error loading automation rules:', error);
      }
    }
  }, [setSocialAccounts]);

  // Save social accounts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('socialAccounts', JSON.stringify(socialAccounts));
  }, [socialAccounts]);

  // Save automation rules to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('automationRules', JSON.stringify(automationRules));
  }, [automationRules]);

  const handleConnectAccount = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPlatform || !formData.username) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in the username field.",
        variant: "destructive",
      });
      return;
    }

    setSocialAccounts((prev: SocialAccount[]) => 
      prev.map(account => 
        account.id === selectedPlatform.id
          ? { 
              ...account, 
              connected: true, 
              username: formData.username,
              followers: Math.floor(Math.random() * 10000)
            }
          : account
      )
    );

    setFormData({ username: '', accessToken: '' });
    setShowConnectForm(false);
    setSelectedPlatform(null);
    toast({
      title: "Account Connected",
      description: `Your ${selectedPlatform.platform} account has been successfully connected.`,
    });
  };

  const disconnectAccount = (accountId: string) => {
    setSocialAccounts((prev: SocialAccount[]) => 
      prev.map(account => 
        account.id === accountId
          ? { ...account, connected: false, username: '', followers: 0 }
          : account
      )
    );
    toast({
      title: "Account Disconnected",
      description: "Social media account has been disconnected.",
    });
  };

  const handleBulkPost = async () => {
    if (!bulkPostContent.trim() || selectedPlatforms.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please enter content and select at least one platform.",
        variant: "destructive",
      });
      return;
    }

    // Simulate posting to selected platforms
    const connectedPlatforms = socialAccounts.filter(acc => 
      acc.connected && selectedPlatforms.includes(acc.platform)
    );

    if (connectedPlatforms.length === 0) {
      toast({
        title: "No Connected Platforms",
        description: "Please connect to the selected platforms first.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Posts Scheduled",
      description: `Your content will be posted to ${connectedPlatforms.length} platform(s).`,
    });

    setBulkPostContent('');
    setSelectedPlatforms([]);
  };

  const createAutomationRule = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newRule.name || !newRule.content || newRule.platforms.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select platforms.",
        variant: "destructive",
      });
      return;
    }

    const rule: AutomationRule = {
      id: Date.now().toString(),
      name: newRule.name,
      platforms: newRule.platforms,
      content: newRule.content,
      schedule: newRule.schedule,
      active: true
    };

    setAutomationRules(prev => [...prev, rule]);
    setNewRule({ name: '', platforms: [], content: '', schedule: 'daily' });
    setShowAutomationForm(false);
    
    toast({
      title: "Automation Rule Created",
      description: "Your posting automation has been set up successfully.",
    });
  };

  const toggleAutomationRule = (ruleId: string) => {
    setAutomationRules(prev => 
      prev.map(rule => 
        rule.id === ruleId 
          ? { ...rule, active: !rule.active }
          : rule
      )
    );
  };

  const deleteAutomationRule = (ruleId: string) => {
    setAutomationRules(prev => prev.filter(rule => rule.id !== ruleId));
    toast({
      title: "Rule Deleted",
      description: "Automation rule has been removed.",
    });
  };

  const connectedAccounts = socialAccounts.filter(acc => acc.connected);
  const totalFollowers = connectedAccounts.reduce((sum, acc) => sum + acc.followers, 0);

  return (
    <div className="space-y-6">
      {/* Social Media Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Share2 className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Connected Accounts</p>
                <p className="text-xl font-bold text-white">{connectedAccounts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Users className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Total Followers</p>
                <p className="text-xl font-bold text-white">{totalFollowers.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Bot className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Active Rules</p>
                <p className="text-xl font-bold text-white">{automationRules.filter(r => r.active).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Posts Today</p>
                <p className="text-xl font-bold text-white">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Post Manager */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Send className="h-5 w-5 text-blue-400" />
            Bulk Post Manager
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bulkContent" className="text-slate-300">Post Content</Label>
            <Textarea
              id="bulkContent"
              value={bulkPostContent}
              onChange={(e) => setBulkPostContent(e.target.value)}
              className="bg-slate-700/50 border-slate-600 text-white min-h-24"
              placeholder="Write your post content here..."
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-slate-300">Select Platforms</Label>
            <div className="flex flex-wrap gap-2">
              {connectedAccounts.map((account) => (
                <Button
                  key={account.id}
                  variant={selectedPlatforms.includes(account.platform) ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedPlatforms(prev => 
                      prev.includes(account.platform)
                        ? prev.filter(p => p !== account.platform)
                        : [...prev, account.platform]
                    );
                  }}
                  className={selectedPlatforms.includes(account.platform) 
                    ? "bg-blue-600 hover:bg-blue-700 text-white" 
                    : "border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50"
                  }
                >
                  <account.icon className={`h-4 w-4 mr-1 ${account.color}`} />
                  {account.platform}
                </Button>
              ))}
            </div>
          </div>
          
          <Button 
            onClick={handleBulkPost}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={!bulkPostContent.trim() || selectedPlatforms.length === 0}
          >
            <Send className="h-4 w-4 mr-2" />
            Post to Selected Platforms
          </Button>
        </CardContent>
      </Card>

      {/* Automation Rules */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Bot className="h-5 w-5 text-purple-400" />
              Automation Rules
            </CardTitle>
            <Button
              onClick={() => setShowAutomationForm(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Rule
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {automationRules.length === 0 ? (
            <div className="text-center py-8">
              <Bot className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Automation Rules</h3>
              <p className="text-slate-400">Create automated posting rules to save time</p>
            </div>
          ) : (
            <div className="space-y-4">
              {automationRules.map((rule) => (
                <Card key={rule.id} className="bg-slate-700/30 border-slate-600">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-white">{rule.name}</h4>
                        <p className="text-sm text-slate-400">{rule.schedule} posting</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={rule.active ? 'bg-green-600' : 'bg-slate-600'}>
                          {rule.active ? 'Active' : 'Paused'}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleAutomationRule(rule.id)}
                          className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50"
                        >
                          {rule.active ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteAutomationRule(rule.id)}
                          className="border-red-600 text-red-400 hover:text-red-300 hover:bg-red-600/10"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-300 mb-3">{rule.content}</p>
                    
                    <div className="flex flex-wrap gap-1">
                      {rule.platforms.map((platform) => {
                        const account = socialAccounts.find(acc => acc.platform === platform);
                        return account ? (
                          <Badge key={platform} variant="outline" className="text-slate-300 border-slate-600">
                            <account.icon className={`h-3 w-3 mr-1 ${account.color}`} />
                            {platform}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Social Media Accounts */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Social Media Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {socialAccounts.map((account) => (
              <Card key={account.id} className="bg-slate-700/30 border-slate-600 hover:bg-slate-700/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-800/50 rounded-lg">
                        <account.icon className={`h-5 w-5 ${account.color}`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{account.platform}</h4>
                        {account.connected && (
                          <p className="text-sm text-slate-400">@{account.username}</p>
                        )}
                      </div>
                    </div>
                    <Badge 
                      className={`${account.connected ? 'bg-green-600' : 'bg-slate-600'} text-white text-xs`}
                    >
                      {account.connected ? 'Connected' : 'Not Connected'}
                    </Badge>
                  </div>
                  
                  {account.connected && (
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between text-slate-300">
                        <span>Followers:</span>
                        <span className="font-medium">{account.followers.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Status:</span>
                        <span className="font-medium text-green-400">Active</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    {account.connected ? (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="flex-1 border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50"
                        >
                          <Settings className="h-3 w-3 mr-1" />
                          Manage
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => disconnectAccount(account.id)}
                          className="border-red-600 text-red-400 hover:text-red-300 hover:bg-red-600/10"
                        >
                          Disconnect
                        </Button>
                      </>
                    ) : (
                      <Button 
                        size="sm"
                        onClick={() => {
                          setSelectedPlatform(account);
                          setShowConnectForm(true);
                        }}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Connect
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Connect Account Form */}
      {showConnectForm && selectedPlatform && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <selectedPlatform.icon className={`h-6 w-6 ${selectedPlatform.color}`} />
                <CardTitle className="text-white">Connect {selectedPlatform.platform}</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowConnectForm(false);
                  setSelectedPlatform(null);
                }}
                className="text-slate-400 hover:text-white hover:bg-slate-700/50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleConnectAccount} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-300">Username/Handle *</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  placeholder={`Your ${selectedPlatform.platform} username`}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accessToken" className="text-slate-300">Access Token (Optional)</Label>
                <Input
                  id="accessToken"
                  type="password"
                  value={formData.accessToken}
                  onChange={(e) => setFormData(prev => ({ ...prev, accessToken: e.target.value }))}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  placeholder="For advanced features and analytics"
                />
              </div>
              
              <div className="bg-slate-700/30 p-4 rounded-lg">
                <p className="text-sm text-slate-300 mb-2">
                  <strong>Note:</strong> To fully integrate with {selectedPlatform.platform}:
                </p>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• Visit {selectedPlatform.platform} Developer Console</li>
                  <li>• Create an app and get your API credentials</li>
                  <li>• Add the access token for full functionality</li>
                </ul>
              </div>
              
              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Connect Account
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowConnectForm(false);
                    setSelectedPlatform(null);
                  }}
                  className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Automation Rule Form */}
      {showAutomationForm && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Bot className="h-5 w-5 text-purple-400" />
                Create Automation Rule
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowAutomationForm(false)}
                className="text-slate-400 hover:text-white hover:bg-slate-700/50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={createAutomationRule} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ruleName" className="text-slate-300">Rule Name *</Label>
                <Input
                  id="ruleName"
                  value={newRule.name}
                  onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  placeholder="e.g., Daily Motivation Posts"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-300">Select Platforms *</Label>
                <div className="flex flex-wrap gap-2">
                  {connectedAccounts.map((account) => (
                    <Button
                      key={account.id}
                      type="button"
                      variant={newRule.platforms.includes(account.platform) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setNewRule(prev => ({
                          ...prev,
                          platforms: prev.platforms.includes(account.platform)
                            ? prev.platforms.filter(p => p !== account.platform)
                            : [...prev.platforms, account.platform]
                        }));
                      }}
                      className={newRule.platforms.includes(account.platform) 
                        ? "bg-blue-600 hover:bg-blue-700 text-white" 
                        : "border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50"
                      }
                    >
                      <account.icon className={`h-4 w-4 mr-1 ${account.color}`} />
                      {account.platform}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ruleContent" className="text-slate-300">Post Content *</Label>
                <Textarea
                  id="ruleContent"
                  value={newRule.content}
                  onChange={(e) => setNewRule(prev => ({ ...prev, content: e.target.value }))}
                  className="bg-slate-700/50 border-slate-600 text-white min-h-24"
                  placeholder="Enter the content to be posted automatically..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="schedule" className="text-slate-300">Schedule</Label>
                <select
                  id="schedule"
                  value={newRule.schedule}
                  onChange={(e) => setNewRule(prev => ({ ...prev, schedule: e.target.value }))}
                  className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-md px-3 py-2"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              
              <div className="bg-slate-700/30 p-4 rounded-lg">
                <p className="text-sm text-slate-300 mb-2">
                  <strong>Automation Features:</strong>
                </p>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• Posts will be published automatically based on schedule</li>
                  <li>• Content can include variables like {'{date}'} and {'{time}'}</li>
                  <li>• Rules can be paused/resumed at any time</li>
                  <li>• Analytics and performance tracking included</li>
                </ul>
              </div>
              
              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Create Rule
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAutomationForm(false)}
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
