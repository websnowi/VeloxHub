
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube,
  Plus,
  Settings,
  ExternalLink,
  Users,
  TrendingUp,
  Share2,
  X
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

interface SocialMediaManagerProps {
  socialAccounts: SocialAccount[];
  setSocialAccounts: (accounts: SocialAccount[]) => void;
}

export const SocialMediaManager = ({ socialAccounts, setSocialAccounts }: SocialMediaManagerProps) => {
  const [showConnectForm, setShowConnectForm] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<SocialAccount | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    accessToken: ''
  });
  const { toast } = useToast();

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

    setSocialAccounts(prev => 
      prev.map(account => 
        account.id === selectedPlatform.id
          ? { 
              ...account, 
              connected: true, 
              username: formData.username,
              followers: Math.floor(Math.random() * 10000) // Simulate followers
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
    setSocialAccounts(prev => 
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

  const connectedAccounts = socialAccounts.filter(acc => acc.connected);
  const totalFollowers = connectedAccounts.reduce((sum, acc) => sum + acc.followers, 0);

  return (
    <div className="space-y-6">
      {/* Social Media Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <TrendingUp className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Engagement Rate</p>
                <p className="text-xl font-bold text-white">0%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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

      {/* Social Media Tools */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Social Media Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-6 bg-slate-700/30 rounded-lg">
              <Share2 className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Content Scheduler</h3>
              <p className="text-slate-400 text-sm mb-4">Schedule posts across all platforms</p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Schedule Posts
              </Button>
            </div>
            <div className="text-center p-6 bg-slate-700/30 rounded-lg">
              <TrendingUp className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Analytics</h3>
              <p className="text-slate-400 text-sm mb-4">Track engagement and growth</p>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                View Analytics
              </Button>
            </div>
            <div className="text-center p-6 bg-slate-700/30 rounded-lg">
              <Users className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Audience Insights</h3>
              <p className="text-slate-400 text-sm mb-4">Understand your followers</p>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                View Insights
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
