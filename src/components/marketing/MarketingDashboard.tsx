
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Globe, 
  Share2, 
  TrendingUp, 
  Users,
  Target,
  Eye,
  MousePointer,
  Star,
  BarChart3,
  Bot
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { WebsiteManager } from "@/components/marketing/WebsiteManager";
import { SocialMediaManager } from "@/components/marketing/SocialMediaManager";
import { CampaignManager } from "@/components/marketing/CampaignManager";
import { SocialAutomationService } from "@/components/marketing/SocialAutomationService";

interface Website {
  id: string;
  name: string;
  url: string;
  status: 'active' | 'inactive';
  pages: number;
  lastUpdated: string;
}

interface SocialAccount {
  id: string;
  platform: string;
  username: string;
  followers: number;
  connected: boolean;
  icon: React.ComponentType<any>;
  color: string;
}

export const MarketingDashboard = () => {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([
    { id: '1', platform: 'Facebook', username: '', followers: 0, connected: false, icon: () => <Share2 className="h-4 w-4" />, color: 'text-blue-600' },
    { id: '2', platform: 'Twitter', username: '', followers: 0, connected: false, icon: () => <Share2 className="h-4 w-4" />, color: 'text-sky-500' },
    { id: '3', platform: 'Instagram', username: '', followers: 0, connected: false, icon: () => <Share2 className="h-4 w-4" />, color: 'text-pink-500' },
    { id: '4', platform: 'LinkedIn', username: '', followers: 0, connected: false, icon: () => <Share2 className="h-4 w-4" />, color: 'text-blue-700' },
    { id: '5', platform: 'YouTube', username: '', followers: 0, connected: false, icon: () => <Share2 className="h-4 w-4" />, color: 'text-red-500' }
  ]);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  const marketingStats = [
    { title: "Websites", value: websites.length.toString(), icon: Globe, color: "text-blue-400" },
    { title: "Social Accounts", value: socialAccounts.filter(acc => acc.connected).length.toString(), icon: Share2, color: "text-green-400" },
    { title: "Total Followers", value: socialAccounts.reduce((sum, acc) => sum + acc.followers, 0).toLocaleString(), icon: Users, color: "text-purple-400" },
    { title: "Active Campaigns", value: "0", icon: Target, color: "text-yellow-400" }
  ];

  return (
    <div className="space-y-6">
      {/* Marketing Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {marketingStats.map((stat, index) => (
          <Card key={index} className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-700/50 rounded-lg">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-slate-400">{stat.title}</p>
                  <p className="text-xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-slate-800/50">
          <TabsTrigger value="overview" className="text-slate-300 data-[state=active]:text-white data-[state=active]:bg-slate-700">
            Overview
          </TabsTrigger>
          <TabsTrigger value="websites" className="text-slate-300 data-[state=active]:text-white data-[state=active]:bg-slate-700">
            Websites
          </TabsTrigger>
          <TabsTrigger value="social" className="text-slate-300 data-[state=active]:text-white data-[state=active]:bg-slate-700">
            Social Media
          </TabsTrigger>
          <TabsTrigger value="automation" className="text-slate-300 data-[state=active]:text-white data-[state=active]:bg-slate-700">
            Automation
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="text-slate-300 data-[state=active]:text-white data-[state=active]:bg-slate-700">
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-slate-300 data-[state=active]:text-white data-[state=active]:bg-slate-700">
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Marketing Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Button 
                    onClick={() => setActiveTab('websites')}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-6 h-auto flex flex-col gap-2"
                  >
                    <Globe className="h-8 w-8" />
                    <span className="font-medium">Manage Websites</span>
                    <span className="text-sm opacity-80">Add and manage your web properties</span>
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('social')}
                    className="bg-green-600 hover:bg-green-700 text-white p-6 h-auto flex flex-col gap-2"
                  >
                    <Share2 className="h-8 w-8" />
                    <span className="font-medium">Social Media</span>
                    <span className="text-sm opacity-80">Connect and manage social accounts</span>
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('automation')}
                    className="bg-purple-600 hover:bg-purple-700 text-white p-6 h-auto flex flex-col gap-2"
                  >
                    <Bot className="h-8 w-8" />
                    <span className="font-medium">Automation</span>
                    <span className="text-sm opacity-80">Bot rules and MCP servers</span>
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('campaigns')}
                    className="bg-orange-600 hover:bg-orange-700 text-white p-6 h-auto flex flex-col gap-2"
                  >
                    <Target className="h-8 w-8" />
                    <span className="font-medium">Campaigns</span>
                    <span className="text-sm opacity-80">Create and track marketing campaigns</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Marketing Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No Activity Yet</h3>
                  <p className="text-slate-400">Start by connecting your websites and social media accounts</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="websites" className="mt-6">
          <WebsiteManager websites={websites} setWebsites={setWebsites} />
        </TabsContent>

        <TabsContent value="social" className="mt-6">
          <SocialMediaManager socialAccounts={socialAccounts} setSocialAccounts={setSocialAccounts} />
        </TabsContent>

        <TabsContent value="automation" className="mt-6">
          <SocialAutomationService />
        </TabsContent>

        <TabsContent value="campaigns" className="mt-6">
          <CampaignManager />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Marketing Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="bg-slate-700/30 border-slate-600">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Eye className="h-5 w-5 text-blue-400" />
                      <div>
                        <p className="text-sm text-slate-400">Page Views</p>
                        <p className="text-xl font-bold text-white">0</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-700/30 border-slate-600">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <MousePointer className="h-5 w-5 text-green-400" />
                      <div>
                        <p className="text-sm text-slate-400">Click Rate</p>
                        <p className="text-xl font-bold text-white">0%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-700/30 border-slate-600">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-5 w-5 text-purple-400" />
                      <div>
                        <p className="text-sm text-slate-400">Conversion</p>
                        <p className="text-xl font-bold text-white">0%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-700/30 border-slate-600">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Star className="h-5 w-5 text-yellow-400" />
                      <div>
                        <p className="text-sm text-slate-400">Engagement</p>
                        <p className="text-xl font-bold text-white">0%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Analytics Coming Soon</h3>
                <p className="text-slate-400">Connect your platforms to start tracking marketing performance</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
