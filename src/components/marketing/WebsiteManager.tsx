
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Globe, Plus, Search, Settings, ExternalLink, FileText, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Website {
  id: string;
  name: string;
  url: string;
  status: 'active' | 'inactive';
  pages: number;
  lastUpdated: string;
}

interface WebsiteManagerProps {
  websites: Website[];
  setWebsites: (websites: Website[]) => void;
}

export const WebsiteManager = ({ websites, setWebsites }: WebsiteManagerProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    description: ''
  });
  const { toast } = useToast();

  const handleAddWebsite = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.url) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in both website name and URL.",
        variant: "destructive",
      });
      return;
    }

    const newWebsite: Website = {
      id: Date.now().toString(),
      name: formData.name,
      url: formData.url,
      status: 'active',
      pages: 1,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    setWebsites([...websites, newWebsite]);
    setFormData({ name: '', url: '', description: '' });
    setShowAddForm(false);
    toast({
      title: "Website Added",
      description: "Website has been successfully added to your marketing dashboard.",
    });
  };

  const filteredWebsites = websites.filter(site =>
    site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-white">Website Management</CardTitle>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Website
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search websites..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredWebsites.length === 0 && !showAddForm ? (
            <div className="text-center py-12">
              <Globe className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Websites Added</h3>
              <p className="text-slate-400 mb-4">Add your first website to start tracking its performance</p>
              <Button 
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Website
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredWebsites.map((website) => (
                <Card key={website.id} className="bg-slate-700/30 border-slate-600 hover:bg-slate-700/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                          <Globe className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{website.name}</h4>
                          <p className="text-sm text-slate-400 truncate max-w-[150px]">{website.url}</p>
                        </div>
                      </div>
                      <Badge 
                        className={`${website.status === 'active' ? 'bg-green-600' : 'bg-red-600'} text-white text-xs`}
                      >
                        {website.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between text-slate-300">
                        <span>Pages:</span>
                        <span className="font-medium">{website.pages}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Last Updated:</span>
                        <span className="font-medium">{website.lastUpdated}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.open(website.url, '_blank')}
                        className="flex-1 border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Visit
                      </Button>
                      <Button 
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Settings className="h-3 w-3 mr-1" />
                        Manage
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Website Form */}
      {showAddForm && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Add New Website</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowAddForm(false)}
                className="text-slate-400 hover:text-white hover:bg-slate-700/50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddWebsite} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="websiteName" className="text-slate-300">Website Name *</Label>
                  <Input
                    id="websiteName"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-slate-700/50 border-slate-600 text-white"
                    placeholder="My Awesome Website"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="websiteUrl" className="text-slate-300">Website URL *</Label>
                  <Input
                    id="websiteUrl"
                    value={formData.url}
                    onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                    className="bg-slate-700/50 border-slate-600 text-white"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Add Website
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

      {/* Website Content Management */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Content Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Content Management System</h3>
            <p className="text-slate-400 mb-4">Manage pages, content, and SEO for your websites</p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <FileText className="h-4 w-4 mr-2" />
              Manage Content
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
