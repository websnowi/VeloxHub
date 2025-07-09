import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useActivityLogger } from "@/hooks/useActivityLogger";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import {
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  Share2
} from "lucide-react";
import { EnhancedSocialMediaPoster } from "@/components/marketing/EnhancedSocialMediaPoster";

type SocialAccount = Database['public']['Tables']['social_accounts']['Row'];

interface SocialMediaManagerProps {
  socialAccounts: SocialAccount[];
  onUpdate: () => void;
  setSocialAccounts: (accounts: SocialAccount[]) => void;
}

export const SocialMediaManager = ({ socialAccounts, onUpdate, setSocialAccounts }: SocialMediaManagerProps) => {
  const [platform, setPlatform] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [bulkPostContent, setBulkPostContent] = useState('');
  const [postActivity, setPostActivity] = useState<any[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();
  const { logActivity } = useActivityLogger();

  const handleConnectAccount = async () => {
    if (!platform || !username || !password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    try {
      // Simulate connecting to a social media platform
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Save the social account to the database
      const { data, error } = await supabase
        .from('social_accounts')
        .insert([
          {
            user_id: user?.id,
            platform,
            username,
            password,
            display_name: displayName,
            connected: true,
            followers: Math.floor(Math.random() * 10000), // Mock followers
            avatar_url: `https://avatar.vercel.sh/${username}.png`, // Mock avatar
          }
        ]);

      if (error) {
        console.error('Error saving social account:', error);
        throw error;
      }

      // Log activity
      logActivity({
        activityType: 'social_media_management',
        activityAction: 'connect',
        resourceType: 'social_account',
        resourceName: platform,
        description: `Connected to ${platform} as ${username}`
      });

      // Refresh social accounts
      onUpdate();

      toast({
        title: "Account Connected",
        description: `Successfully connected to ${platform} as ${username}.`,
      });
      
      // Clear form
      setPlatform('');
      setUsername('');
      setPassword('');
      setDisplayName('');

    } catch (error) {
      console.error('Error connecting social account:', error);
      toast({
        title: "Error",
        description: "Failed to connect social account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleBulkPost = async () => {
    if (!bulkPostContent.trim()) {
      toast({
        title: "Missing Content",
        description: "Please enter content to post.",
        variant: "destructive",
      });
      return;
    }

    setIsPosting(true);
    setPostActivity([]);

    try {
      // Simulate posting to multiple social media accounts
      const results = socialAccounts.map(account => ({
        account: account.platform,
        success: Math.random() > 0.2, // 80% success rate
        message: `Posted to ${account.platform} as ${account.username}`,
      }));

      setPostActivity(results);

      // Log activity
      logActivity({
        activityType: 'social_media_management',
        activityAction: 'publish',
        resourceType: 'bulk_post',
        description: `Posted to ${socialAccounts.length} social accounts`
      });

      toast({
        title: "Bulk Post Successful",
        description: `Successfully posted to ${results.filter(r => r.success).length} out of ${socialAccounts.length} accounts.`,
      });

      // Clear textarea
      setBulkPostContent('');

    } catch (error) {
      console.error('Error posting to social media:', error);
      toast({
        title: "Error",
        description: "Failed to post to social media. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPosting(false);
    }
  };

  const handleDisconnect = async (accountId: string) => {
    try {
      const { error } = await supabase
        .from('social_accounts')
        .update({ connected: false })
        .eq('id', accountId);

      if (error) {
        console.error('Error disconnecting social account:', error);
        throw error;
      }

      // Log activity
      logActivity({
        activityType: 'social_media_management',
        activityAction: 'disconnect',
        resourceType: 'social_account',
        resourceId: accountId,
        description: `Disconnected social account with ID ${accountId}`
      });

      // Refresh social accounts
      onUpdate();

      toast({
        title: "Account Disconnected",
        description: "Successfully disconnected social account.",
      });
    } catch (error) {
      console.error('Error disconnecting social account:', error);
      toast({
        title: "Error",
        description: "Failed to disconnect social account. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced API-based Social Media Posting */}
      <EnhancedSocialMediaPoster />

      {/* Add Account Card */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Connect New Account (Legacy)</CardTitle>
          <p className="text-slate-400 text-sm">
            Connect social media accounts for bulk posting (username/password method).
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="platform" className="text-slate-300">Platform</Label>
              <Input
                id="platform"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white"
                placeholder="e.g., Twitter"
                disabled={isConnecting}
              />
            </div>
            <div>
              <Label htmlFor="username" className="text-slate-300">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white"
                placeholder="e.g., @example"
                disabled={isConnecting}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="password" className="text-slate-300">Password</Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white"
                disabled={isConnecting}
              />
            </div>
            <div>
              <Label htmlFor="displayName" className="text-slate-300">Display Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white"
                placeholder="e.g., Example Company"
                disabled={isConnecting}
              />
            </div>
          </div>
          <Button
            onClick={handleConnectAccount}
            disabled={isConnecting}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {isConnecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              "Connect Account"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Connected Accounts */}
      {socialAccounts.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Connected Accounts</CardTitle>
            <p className="text-slate-400 text-sm">
              Manage your connected social media accounts.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {socialAccounts.map((account) => (
                <Card key={account.id} className="bg-slate-700/30 border-slate-600">
                  <CardContent className="flex flex-col items-center justify-center p-4">
                    <Avatar className="h-16 w-16 mb-2">
                      <AvatarImage src={account.avatar_url || `https://avatar.vercel.sh/${account.username}.png`} />
                      <AvatarFallback>{account.display_name?.substring(0, 2) || account.username?.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <p className="text-white font-medium">{account.display_name || account.username}</p>
                    <p className="text-slate-400 text-sm">{account.platform}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">
                        <Share2 className="h-3 w-3 mr-1" />
                        {account.followers?.toLocaleString() || '0'} Followers
                      </Badge>
                      {account.connected ? (
                        <Badge className="bg-green-600">Connected</Badge>
                      ) : (
                        <Badge variant="destructive">Disconnected</Badge>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDisconnect(account.id)}
                      className="mt-4 w-full"
                    >
                      Disconnect
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bulk Post Card */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Bulk Post to Legacy Accounts</CardTitle>
          <p className="text-slate-400 text-sm">
            Post the same content to all connected social media accounts (legacy method).
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bulkContent" className="text-slate-300">Content</Label>
            <Textarea
              id="bulkContent"
              value={bulkPostContent}
              onChange={(e) => setBulkPostContent(e.target.value)}
              placeholder="Enter your post content..."
              className="bg-slate-700/50 border-slate-600 text-white min-h-32"
              disabled={isPosting}
            />
          </div>
          <Button
            onClick={handleBulkPost}
            disabled={isPosting || socialAccounts.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isPosting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              "Post to All Accounts"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Post Activity Card */}
      {postActivity.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Post Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {postActivity.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30">
                  <div className="flex items-center gap-3">
                    {result.success ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className="text-slate-300">{result.account}</span>
                  </div>
                  <div className="text-right">
                    {result.success ? (
                      <Badge className="bg-green-600">Success</Badge>
                    ) : (
                      <div className="space-y-1">
                        <Badge variant="destructive">Failed</Badge>
                        <p className="text-xs text-red-400">{result.message}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
