
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { 
  Bot, 
  Play, 
  Pause, 
  Settings, 
  Share, 
  Upload,
  Code,
  Zap,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";

interface SocialBot {
  id: string;
  name: string;
  type: string;
  platforms: string[];
  status: 'active' | 'paused' | 'error';
  runs_today: number;
  last_run?: string;
  script?: string;
}

interface PostContent {
  text: string;
  image?: File;
  platforms: string[];
}

const SUPPORTED_PLATFORMS = [
  'Facebook', 'Twitter', 'Instagram', 'LinkedIn', 'YouTube', 'TikTok', 
  'Pinterest', 'Reddit', 'Snapchat', 'WhatsApp Business', 'Telegram'
];

export const SocialMediaBotManager = () => {
  const [bots, setBots] = useState<SocialBot[]>([]);
  const [showBotForm, setShowBotForm] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [newBot, setNewBot] = useState({
    name: '',
    type: 'selenium',
    platforms: [] as string[],
    script: ''
  });
  const [postContent, setPostContent] = useState<PostContent>({
    text: '',
    platforms: []
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadBots();
    }
  }, [user]);

  const loadBots = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('automation_bots')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Map the data to ensure proper typing
      const typedData: SocialBot[] = (data || []).map(item => ({
        ...item,
        status: (item.status as 'active' | 'paused' | 'error') || 'paused',
        runs_today: item.runs_today || 0,
        platforms: item.platforms || []
      }));
      
      setBots(typedData);
    } catch (error) {
      console.error('Error loading bots:', error);
    }
  };

  const createBot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newBot.name || newBot.platforms.length === 0) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('automation_bots')
        .insert({
          user_id: user.id,
          name: newBot.name,
          type: newBot.type,
          platforms: newBot.platforms,
          script: newBot.script,
          status: 'paused',
          runs_today: 0
        });

      if (error) throw error;

      setNewBot({ name: '', type: 'selenium', platforms: [], script: '' });
      setShowBotForm(false);
      loadBots();
      
      toast({
        title: "Bot Created",
        description: "Your automation bot has been created successfully.",
      });
    } catch (error) {
      console.error('Error creating bot:', error);
      toast({
        title: "Creation Failed",
        description: "Failed to create bot. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleBot = async (botId: string, currentStatus: string) => {
    if (!user) return;

    try {
      const newStatus = currentStatus === 'active' ? 'paused' : 'active';
      const updateData: any = { 
        status: newStatus,
        updated_at: new Date().toISOString()
      };
      
      if (newStatus === 'active') {
        updateData.last_run = new Date().toISOString();
      }

      const { error } = await supabase
        .from('automation_bots')
        .update(updateData)
        .eq('id', botId)
        .eq('user_id', user.id);

      if (error) throw error;

      loadBots();
      toast({
        title: newStatus === 'active' ? "Bot Activated" : "Bot Paused",
        description: `Bot has been ${newStatus === 'active' ? 'activated' : 'paused'}.`,
      });
    } catch (error) {
      console.error('Error toggling bot:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update bot status.",
        variant: "destructive",
      });
    }
  };

  const publishPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.text || postContent.platforms.length === 0) return;

    setLoading(true);
    try {
      // Simulate posting to platforms
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update bot runs for selected platforms
      const platformBots = bots.filter(bot => 
        bot.status === 'active' && 
        bot.platforms.some(platform => postContent.platforms.includes(platform))
      );

      for (const bot of platformBots) {
        await supabase
          .from('automation_bots')
          .update({ 
            runs_today: bot.runs_today + 1,
            last_run: new Date().toISOString()
          })
          .eq('id', bot.id)
          .eq('user_id', user.id);
      }

      setPostContent({ text: '', platforms: [] });
      setShowPostForm(false);
      loadBots();

      toast({
        title: "Post Published",
        description: `Your post has been published to ${postContent.platforms.join(', ')}.`,
      });
    } catch (error) {
      console.error('Error publishing post:', error);
      toast({
        title: "Publishing Failed",
        description: "Failed to publish post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bot className="h-6 w-6 text-blue-400" />
          <h2 className="text-2xl font-bold text-white">Social Media Bots</h2>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowPostForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Share className="h-4 w-4 mr-2" />
            Publish Post
          </Button>
          <Button
            onClick={() => setShowBotForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Bot className="h-4 w-4 mr-2" />
            Create Bot
          </Button>
        </div>
      </div>

      {/* Bot Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Bot className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Total Bots</p>
                <p className="text-xl font-bold text-white">{bots.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Active Bots</p>
                <p className="text-xl font-bold text-white">
                  {bots.filter(bot => bot.status === 'active').length}
                </p>
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
                <p className="text-sm text-slate-400">Posts Today</p>
                <p className="text-xl font-bold text-white">
                  {bots.reduce((sum, bot) => sum + bot.runs_today, 0)}
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
                <p className="text-sm text-slate-400">Platforms</p>
                <p className="text-xl font-bold text-white">
                  {new Set(bots.flatMap(bot => bot.platforms)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bots List */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Your Bots</CardTitle>
        </CardHeader>
        <CardContent>
          {bots.length === 0 ? (
            <div className="text-center py-8">
              <Bot className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Bots Created</h3>
              <p className="text-slate-400">Create your first social media automation bot</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bots.map((bot) => (
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
                          onClick={() => toggleBot(bot.id, bot.status)}
                          className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50"
                        >
                          {bot.status === 'active' ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-slate-300">
                        <span>Platforms: </span>
                        <span className="font-medium">{bot.platforms.join(', ')}</span>
                      </div>
                      <div className="text-slate-300">
                        <span>Posts Today: </span>
                        <span className="font-medium">{bot.runs_today}</span>
                      </div>
                      {bot.last_run && (
                        <div className="text-slate-300 col-span-2">
                          <span>Last Run: </span>
                          <span className="font-medium">
                            {new Date(bot.last_run).toLocaleString()}
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

      {/* Create Bot Form */}
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
                  onChange={(e) => setNewBot(prev => ({ ...prev, type: e.target.value }))}
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
                <div className="grid grid-cols-3 gap-2">
                  {SUPPORTED_PLATFORMS.map((platform) => (
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
from selenium import webdriver

# Your automation logic here..."
                />
              </div>
              
              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {loading ? "Creating..." : "Create Bot"}
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

      {/* Publish Post Form */}
      {showPostForm && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Share className="h-5 w-5 text-green-400" />
              Publish to Social Media
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={publishPost} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="postText" className="text-slate-300">Post Content *</Label>
                <Textarea
                  id="postText"
                  value={postContent.text}
                  onChange={(e) => setPostContent(prev => ({ ...prev, text: e.target.value }))}
                  className="bg-slate-700/50 border-slate-600 text-white min-h-32"
                  placeholder="What would you like to share with your audience?"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-300">Select Platforms *</Label>
                <div className="grid grid-cols-3 gap-2">
                  {SUPPORTED_PLATFORMS.map((platform) => (
                    <Button
                      key={platform}
                      type="button"
                      variant={postContent.platforms.includes(platform) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setPostContent(prev => ({
                          ...prev,
                          platforms: prev.platforms.includes(platform)
                            ? prev.platforms.filter(p => p !== platform)
                            : [...prev.platforms, platform]
                        }));
                      }}
                      className={postContent.platforms.includes(platform) 
                        ? "bg-green-600 hover:bg-green-700 text-white" 
                        : "border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50"
                      }
                    >
                      {platform}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="postImage" className="text-slate-300">Attach Image (Optional)</Label>
                <Input
                  id="postImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPostContent(prev => ({ 
                    ...prev, 
                    image: e.target.files?.[0] 
                  }))}
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
              </div>
              
              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={loading || !postContent.text || postContent.platforms.length === 0}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {loading ? "Publishing..." : "Publish Post"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPostForm(false)}
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
