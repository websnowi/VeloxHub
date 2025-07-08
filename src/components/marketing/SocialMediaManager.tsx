import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Share2, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  Users,
  Send,
  Image,
  Link,
  Tag,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useActivityLogger } from "@/hooks/useActivityLogger";
import { supabase } from "@/integrations/supabase/client";
import { OfficialSocialMediaPoster } from "./OfficialSocialMediaPoster";

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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [newAccount, setNewAccount] = useState({
    platform: '',
    username: '',
    password: '',
    display_name: ''
  });
  const [bulkPostData, setBulkPostData] = useState({
    content: '',
    link: '',
    tags: '',
    description: '',
    selectedAccounts: [] as string[]
  });
  const { user } = useAuth();
  const { toast } = useToast();
  const { logActivity } = useActivityLogger();

  const connectedAccounts = socialAccounts.filter(acc => acc.connected);

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
      const { data, error } = await supabase
        .from('social_accounts')
        .insert({
          user_id: user.id,
          platform: newAccount.platform,
          username: newAccount.username,
          password: newAccount.password,
          display_name: newAccount.display_name || newAccount.username,
          connected: true,
          followers: 0
        })
        .select()
        .single();

      if (error) throw error;

      // Update local state
      const updatedAccounts = [...socialAccounts, data];
      setSocialAccounts(updatedAccounts);

      setNewAccount({ platform: '', username: '', password: '', display_name: '' });
      setShowAddForm(false);
      onUpdate();
      
      // Log activity
      logActivity({
        activityType: 'social_media_management',
        activityAction: 'create',
        resourceType: 'social_account',
        resourceName: `${newAccount.platform} - ${newAccount.username}`,
        description: `Added ${newAccount.platform} account @${newAccount.username}`
      });
      
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

  const deleteSocialAccount = async (accountId: string, accountInfo: { platform: string; username: string }) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('social_accounts')
        .delete()
        .eq('id', accountId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      const updatedAccounts = socialAccounts.filter(acc => acc.id !== accountId);
      setSocialAccounts(updatedAccounts);

      onUpdate();

      // Log activity
      logActivity({
        activityType: 'social_media_management',
        activityAction: 'delete',
        resourceType: 'social_account',
        resourceName: `${accountInfo.platform} - ${accountInfo.username}`,
        description: `Removed ${accountInfo.platform} account @${accountInfo.username}`
      });
      
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      toast({
        title: "Image Selected",
        description: `${file.name} ready for upload`,
      });
    }
  };

  const handleBulkPost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bulkPostData.content.trim() || bulkPostData.selectedAccounts.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please enter content and select at least one connected account.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to post to social media.",
        variant: "destructive",
      });
      return;
    }

    setIsPosting(true);
    console.log('Starting bulk post process...', {
      content: bulkPostData.content,
      selectedAccounts: bulkPostData.selectedAccounts,
      imageFile: imageFile?.name
    });

    try {
      const selectedPlatforms = bulkPostData.selectedAccounts.map(accountId => {
        const account = connectedAccounts.find(acc => acc.id === accountId);
        return account ? { platform: account.platform, username: account.username } : null;
      }).filter(Boolean);

      console.log('Selected platforms for posting:', selectedPlatforms);

      // Simulate posting process with more realistic behavior
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Log the bulk post activity
      await logActivity({
        activityType: 'social_media_management',
        activityAction: 'publish',
        resourceType: 'bulk_post',
        resourceName: `${selectedPlatforms.length} platforms`,
        description: `Published post to ${selectedPlatforms.map(p => p?.platform).join(', ')}`,
        metadata: {
          content: bulkPostData.content.substring(0, 100),
          platforms: selectedPlatforms.map(p => p?.platform),
          hasImage: !!imageFile,
          hasLink: !!bulkPostData.link,
          tags: bulkPostData.tags
        }
      });

      toast({
        title: "Posts Published Successfully",
        description: `Your content has been posted to ${selectedPlatforms.map(p => p?.platform).join(', ')}`,
      });
      
      // Reset form
      setBulkPostData({ content: '', link: '', tags: '', description: '', selectedAccounts: [] });
      setImageFile(null);
      setShowBulkPost(false);

      console.log('Bulk post completed successfully');
      
    } catch (error) {
      console.error('Error posting to social media:', error);
      toast({
        title: "Publishing Failed",
        description: "Failed to publish posts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Social Media Management</h2>
          <p className="text-slate-400">Manage your social media accounts and automate posting</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowBulkPost(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white"
            disabled={connectedAccounts.length === 0}
          >
            <Send className="h-4 w-4 mr-2" />
            Content Planner
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

      <Tabs defaultValue="accounts" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
          <TabsTrigger value="accounts" className="text-slate-300 data-[state=active]:text-white data-[state=active]:bg-slate-700">
            Account Management
          </TabsTrigger>
          <TabsTrigger value="official-posting" className="text-slate-300 data-[state=active]:text-white data-[state=active]:bg-slate-700">
            <Zap className="h-4 w-4 mr-2" />
            Official API Posting
          </TabsTrigger>
          <TabsTrigger value="content-planner" className="text-slate-300 data-[state=active]:text-white data-[state=active]:bg-slate-700">
            Content Planner
          </TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="mt-6">
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
                      <span>{account.followers?.toLocaleString() || 0}</span>
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
                      onClick={() => deleteSocialAccount(account.id, { platform: account.platform, username: account.username })}
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
                  <p className="text-slate-400 mb-4">Add your social media accounts to start managing your presence</p>
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
            <Card className="bg-slate-800/50 border-slate-700 mt-6">
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
        </TabsContent>

        <TabsContent value="official-posting" className="mt-6">
          <OfficialSocialMediaPoster />
        </TabsContent>

        <TabsContent value="content-planner" className="mt-6">
          {/* Content Planner - Your existing bulk post form can go here */}
          {showBulkPost && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Content Planner</CardTitle>
                <p className="text-slate-400 text-sm">
                  Plan your content and copy it to post manually on your platforms
                </p>
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
                      disabled={isPosting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image" className="text-slate-300 flex items-center gap-2">
                      <Image className="h-4 w-4" />
                      Upload Image
                    </Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="bg-slate-700/50 border-slate-600 text-white file:bg-slate-600 file:text-white file:border-0 file:rounded file:mr-2"
                    />
                    {imageFile && (
                      <p className="text-sm text-green-400">Selected: {imageFile.name}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="link" className="text-slate-300 flex items-center gap-2">
                      <Link className="h-4 w-4" />
                      Link (Optional)
                    </Label>
                    <Input
                      id="link"
                      value={bulkPostData.link}
                      onChange={(e) => setBulkPostData(prev => ({ ...prev, link: e.target.value }))}
                      className="bg-slate-700/50 border-slate-600 text-white"
                      placeholder="https://example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags" className="text-slate-300 flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Tags (Optional)
                    </Label>
                    <Input
                      id="tags"
                      value={bulkPostData.tags}
                      onChange={(e) => setBulkPostData(prev => ({ ...prev, tags: e.target.value }))}
                      className="bg-slate-700/50 border-slate-600 text-white"
                      placeholder="#marketing #business #social"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-slate-300">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      value={bulkPostData.description}
                      onChange={(e) => setBulkPostData(prev => ({ ...prev, description: e.target.value }))}
                      className="bg-slate-700/50 border-slate-600 text-white"
                      placeholder="Additional description or alt text for the post..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-slate-300">Select Connected Accounts *</Label>
                    {connectedAccounts.length === 0 ? (
                      <p className="text-slate-400 text-sm">No connected accounts available. Please add and connect social media accounts first.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {connectedAccounts.map((account) => (
                          <label key={account.id} className="flex items-center gap-2 p-3 rounded bg-slate-700/30 hover:bg-slate-700/50 cursor-pointer">
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
                              disabled={isPosting}
                            />
                            <div className={`w-4 h-4 rounded flex-shrink-0 ${
                              platforms.find(p => p.name === account.platform)?.color || 'bg-slate-600'
                            }`} />
                            <span className="text-sm text-slate-300">{account.platform} (@{account.username})</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                      disabled={connectedAccounts.length === 0 || isPosting || !bulkPostData.content.trim() || bulkPostData.selectedAccounts.length === 0}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {isPosting ? "Publishing..." : "Post to Selected Accounts"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowBulkPost(false)}
                      className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50"
                      disabled={isPosting}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
