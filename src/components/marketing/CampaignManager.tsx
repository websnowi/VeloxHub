
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Plus, 
  Calendar, 
  DollarSign,
  TrendingUp,
  Users,
  Eye,
  MousePointer,
  Mail,
  Search,
  Play,
  Pause,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Campaign {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'paused' | 'completed' | 'draft';
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  impressions: number;
  clicks: number;
  conversions: number;
}

export const CampaignManager = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    budget: '',
    startDate: '',
    endDate: '',
    description: '',
    targetAudience: ''
  });
  const { toast } = useToast();

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.type || !formData.budget) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const newCampaign: Campaign = {
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type,
      status: 'draft',
      budget: parseFloat(formData.budget),
      spent: 0,
      startDate: formData.startDate,
      endDate: formData.endDate,
      impressions: 0,
      clicks: 0,
      conversions: 0
    };

    setCampaigns([...campaigns, newCampaign]);
    setFormData({
      name: '',
      type: '',
      budget: '',
      startDate: '',
      endDate: '',
      description: '',
      targetAudience: ''
    });
    setShowCreateForm(false);
    toast({
      title: "Campaign Created",
      description: "New marketing campaign has been created successfully.",
    });
  };

  const updateCampaignStatus = (campaignId: string, newStatus: Campaign['status']) => {
    setCampaigns(prev => 
      prev.map(campaign => 
        campaign.id === campaignId 
          ? { ...campaign, status: newStatus }
          : campaign
      )
    );
    toast({
      title: "Campaign Updated",
      description: `Campaign status changed to ${newStatus}.`,
    });
  };

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-600 hover:bg-green-700';
      case 'paused': return 'bg-yellow-600 hover:bg-yellow-700';
      case 'completed': return 'bg-blue-600 hover:bg-blue-700';
      case 'draft': return 'bg-slate-600 hover:bg-slate-700';
      default: return 'bg-slate-600 hover:bg-slate-700';
    }
  };

  const campaignStats = [
    { title: "Total Campaigns", value: campaigns.length.toString(), icon: Target },
    { title: "Active Campaigns", value: campaigns.filter(c => c.status === 'active').length.toString(), icon: Play },
    { title: "Total Budget", value: `$${campaigns.reduce((sum, c) => sum + c.budget, 0).toLocaleString()}`, icon: DollarSign },
    { title: "Total Impressions", value: campaigns.reduce((sum, c) => sum + c.impressions, 0).toLocaleString(), icon: Eye }
  ];

  return (
    <div className="space-y-6">
      {/* Campaign Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {campaignStats.map((stat, index) => (
          <Card key={index} className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-700/50 rounded-lg">
                  <stat.icon className="h-5 w-5 text-blue-400" />
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

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-white">Marketing Campaigns</CardTitle>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredCampaigns.length === 0 && !showCreateForm ? (
            <div className="text-center py-12">
              <Target className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Campaigns Created</h3>
              <p className="text-slate-400 mb-4">Create your first marketing campaign to start reaching your audience</p>
              <Button 
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Campaign
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCampaigns.map((campaign) => (
                <Card key={campaign.id} className="bg-slate-700/30 border-slate-600">
                  <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-white">{campaign.name}</h4>
                          <Badge className={`${getStatusColor(campaign.status)} text-white text-xs`}>
                            {campaign.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-400 mb-2">Type: {campaign.type}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-slate-400">Budget</p>
                            <p className="text-white font-medium">${campaign.budget.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Spent</p>
                            <p className="text-white font-medium">${campaign.spent.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Impressions</p>
                            <p className="text-white font-medium">{campaign.impressions.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Clicks</p>
                            <p className="text-white font-medium">{campaign.clicks.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {campaign.status === 'active' ? (
                          <Button
                            size="sm"
                            onClick={() => updateCampaignStatus(campaign.id, 'paused')}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white"
                          >
                            <Pause className="h-3 w-3 mr-1" />
                            Pause
                          </Button>
                        ) : campaign.status === 'paused' ? (
                          <Button
                            size="sm"
                            onClick={() => updateCampaignStatus(campaign.id, 'active')}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Play className="h-3 w-3 mr-1" />
                            Resume
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => updateCampaignStatus(campaign.id, 'active')}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Play className="h-3 w-3 mr-1" />
                            Launch
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50"
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Campaign Form */}
      {showCreateForm && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Create New Campaign</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowCreateForm(false)}
                className="text-slate-400 hover:text-white hover:bg-slate-700/50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateCampaign} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="campaignName" className="text-slate-300">Campaign Name *</Label>
                  <Input
                    id="campaignName"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-slate-700/50 border-slate-600 text-white"
                    placeholder="Summer Sale Campaign"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaignType" className="text-slate-300">Campaign Type *</Label>
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue placeholder="Select campaign type" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="email">Email Marketing</SelectItem>
                      <SelectItem value="social">Social Media</SelectItem>
                      <SelectItem value="ppc">Pay-Per-Click</SelectItem>
                      <SelectItem value="content">Content Marketing</SelectItem>
                      <SelectItem value="influencer">Influencer Marketing</SelectItem>
                      <SelectItem value="affiliate">Affiliate Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget" className="text-slate-300">Budget ($) *</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                    className="bg-slate-700/50 border-slate-600 text-white"
                    placeholder="5000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-slate-300">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-slate-300">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-300">Campaign Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  placeholder="Describe your campaign objectives and strategy..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAudience" className="text-slate-300">Target Audience</Label>
                <Input
                  id="targetAudience"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  placeholder="Demographics, interests, behaviors..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  Create Campaign
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
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
