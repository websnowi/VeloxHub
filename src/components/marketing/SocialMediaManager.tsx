
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Share2, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  Users,
  Bot,
  Send
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface SocialAccount {
  id: string;
  platform: string;
  username: string;
  followers: number;
  connected: boolean;
  display_name?: string;
  avatar_url?: string;
  password: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface SocialMediaManagerProps {
  socialAccounts: SocialAccount[];
  setSocialAccounts: (accounts: SocialAccount[]) => void;
  onUpdate: () => void;
}

const platforms = [
  { name: 'Facebook', color: 'bg-blue-600' },
  { name: 'Instagram', color: 'bg-pink-600' },
  { name: 'Twitter', color: 'bg-sky-500' },
  { name: 'LinkedIn', color: 'bg-blue-700' },
  { name: 'YouTube', color: 'bg-red-600' },
  { name: 'TikTok', color: 'bg-black' },
  { name: 'Pinterest', color: 'bg-red-500' },
  { name: 'Snapchat', color: 'bg-yellow-400' },
  { name: 'Discord', color: 'bg-indigo-600' },
  { name: 'Reddit', color: 'bg-orange-600' },
  { name: 'Telegram', color: 'bg-blue-500' },
  { name: 'WhatsApp', color: 'bg-green-600' }
];

export const SocialMediaManager = ({ socialAccounts, setSocialAccounts, onUpdate }: SocialMediaManagerProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBulkPost, setShowBulkPost] = useState(false);
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});
  const [newAccount, setNewAccount] = useState({
    platform: '',
    username: '',
    password: '',
    display_name: ''
  });
  const [bulkPostData, setBulkPostData] = useState({
    content: '',
    selectedAccounts: [] as string[]
  });
  const { user } = useAuth();
  const { toast } = useToast();

  const addSocialAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !newAccount.platform || !newAccount.username || !newAccount.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('social_accounts')
        .insert({
          user_id: user.id,
          platform: newAccount.platform,
          username: newAccount.username,
          password: newAccount.password,
          display_name: newAccount.display_name || newAccount.username,
          connected: true,
          followers: 0
        });

      if (error) throw error;

      setNewAccount({ platform: '', username: '', password: '', display_name: '' });
      setShowAddForm(false);
      onUpdate();
      
      toast({
        title: "Account Added",
        description: `${newAccount.platform} account has been added successfully.`,
      });
    } catch (error) {
      console.error('Error adding social account:', error);
      toast({
        title: "Error",
        description: "Failed to add social media account. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteSocialAccount = async (accountId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('social_accounts')
        .delete()
        .eq('id', accountId)
        .eq('user_id', user.id);

      if (error) throw error;

      onUpdate();
      toast({
        title: "Account Removed",
        description: "Social media account has been removed.",
      });
    } catch (error) {
      console.error('Error deleting social account:', error);
      toast({
        title: "Error",
        description: "Failed to remove social media account.",
        variant: "destructive",
      });
    }
  };

  const togglePasswordVisibility = (accountId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [accountId]: !prev[accountId]
    }));
  };

  const handleBulkPost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bulkPostData.content || bulkPostData.selectedAccounts.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please enter content and select at least one account.",
        variant: "destructive",
      });
      return;
    }

    // This is where the actual posting logic would go
    // For now, we'll just show a success message
    toast({
      title: "Posts Scheduled",
      description: `Your content will be posted to ${bulkPostData.selectedAccounts.length} platforms.`,
    });
    
    setBulkPostData({ content: '', selectedAccounts: [] });
    setShowBulkPost(false);
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Social Media Accounts</h2>
          <p className="text-slate-400">Manage your social media accounts and automate posting</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowBulkPost(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white"
            disabled={socialAccounts.length === 0}
          >
            <Send className="h-4 w-4 mr-2" />
            Bulk Post
          </Button>
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Account
          </Button>
        </div>
      </div>

      {/* Social Media Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {socialAccounts.map((account) => (
          <Card key={account.id} className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    platforms.find(p => p.name === account.platform)?.color || 'bg-slate-600'
                  }`}>
                    <Share2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{account.platform}</h4>
                    <p className="text-sm text-slate-400">@{account.username}</p>
                  </div>
                </div>
                <Badge className={account.connected ? 'bg-green-600' : 'bg-red-600'}>
                  {account.connected ? 'Connected' : 'Disconnected'}
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Display Name:</span>
                  <span>{account.display_name || account.username}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Followers:</span>
                  <span>{account.followers.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Password:</span>
                  <div className="flex items-center gap-2">
                    <span>{showPasswords[account.id] ? account.password : '••••••••'}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => togglePasswordVisibility(account.id)}
                      className="p-1 h-6 w-6"
                    >
                      {showPasswords[account.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deleteSocialAccount(account.id)}
                  className="border-red-600 text-red-400 hover:text-red-300 hover:bg-red-600/10"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {socialAccounts.length === 0 && (
          <Card className="bg-slate-800/50 border-slate-700 col-span-full">
            <CardContent className="p-8 text-center">
              <Share2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Social Media Accounts</h3>
              <p className="text-slate-400 mb-4">Add your social media accounts to start automating your posts</p>
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Account
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Account Form */}
      {showAddForm && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Add Social Media Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={addSocialAccount} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="platform" className="text-slate-300">Platform *</Label>
                <select
                  value={newAccount.platform}
                  onChange={(e) => setNewAccount(prev => ({ ...prev, platform: e.target.value }))}
                  className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-md px-3 py-2"
                  required
                >
                  <option value="">Select Platform</option>
                  {platforms.map((platform) => (
                    <option key={platform.name} value={platform.name}>{platform.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-300">Username *</Label>
                <Input
                  id="username"
                  value={newAccount.username}
                  onChange={(e) => setNewAccount(prev => ({ ...prev, username: e.target.value }))}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  placeholder="Enter username (without @)"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={newAccount.password}
                  onChange={(e) => setNewAccount(prev => ({ ...prev, password: e.target.value }))}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  placeholder="Enter account password"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-slate-300">Display Name</Label>
                <Input
                  id="displayName"
                  value={newAccount.display_name}
                  onChange={(e) => setNewAccount(prev => ({ ...prev, display_name: e.target.value }))}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  placeholder="Display name (optional)"
                />
              </div>
              
              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Add Account
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

      {/* Bulk Post Form */}
      {showBulkPost && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Bulk Post to Social Media</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleBulkPost} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="content" className="text-slate-300">Post Content *</Label>
                <Textarea
                  id="content"
                  value={bulkPostData.content}
                  onChange={(e) => setBulkPostData(prev => ({ ...prev, content: e.target.value }))}
                  className="bg-slate-700/50 border-slate-600 text-white min-h-32"
                  placeholder="Write your post content here..."
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-300">Select Accounts *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {socialAccounts.filter(acc => acc.connected).map((account) => (
                    <label key={account.id} className="flex items-center gap-2 p-2 rounded bg-slate-700/30">
                      <input
                        type="checkbox"
                        checked={bulkPostData.selectedAccounts.includes(account.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setBulkPostData(prev => ({
                              ...prev,
                              selectedAccounts: [...prev.selectedAccounts, account.id]
                            }));
                          } else {
                            setBulkPostData(prev => ({
                              ...prev,
                              selectedAccounts: prev.selectedAccounts.filter(id => id !== account.id)
                            }));
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm text-slate-300">{account.platform} (@{account.username})</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Post to Selected Accounts
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowBulkPost(false)}
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
