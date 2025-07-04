
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  BookOpen, 
  Video, 
  FileText, 
  ExternalLink,
  Star,
  Clock,
  Users
} from "lucide-react";

interface KnowledgeItem {
  id: string;
  title: string;
  description: string;
  type: 'guide' | 'video' | 'documentation' | 'template';
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  popular: boolean;
  url?: string;
}

const knowledgeItems: KnowledgeItem[] = [
  {
    id: '1',
    title: 'Getting Started with VeloxHub',
    description: 'Complete guide to setting up your first dashboard and connecting data sources',
    type: 'guide',
    category: 'Setup',
    difficulty: 'beginner',
    estimatedTime: '15 min',
    popular: true
  },
  {
    id: '2',
    title: 'Connecting Salesforce CRM',
    description: 'Step-by-step integration guide for Salesforce with API setup and data mapping',
    type: 'guide',
    category: 'CRM Integration',
    difficulty: 'intermediate',
    estimatedTime: '30 min',
    popular: true
  },
  {
    id: '3',
    title: 'Creating Custom Widgets',
    description: 'Build custom dashboard widgets with drag-and-drop functionality',
    type: 'video',
    category: 'Dashboard Design',
    difficulty: 'intermediate',
    estimatedTime: '25 min',
    popular: false
  },
  {
    id: '4',
    title: 'API Integration Templates',
    description: 'Ready-to-use templates for popular business platforms and services',
    type: 'template',
    category: 'Templates',
    difficulty: 'beginner',
    estimatedTime: '10 min',
    popular: true
  },
  {
    id: '5',
    title: 'Advanced Workflow Automation',
    description: 'Create complex business workflows with conditional logic and triggers',
    type: 'documentation',
    category: 'Automation',
    difficulty: 'advanced',
    estimatedTime: '45 min',
    popular: false
  },
  {
    id: '6',
    title: 'HubSpot Marketing Integration',
    description: 'Connect HubSpot for marketing analytics and lead tracking dashboards',
    type: 'guide',
    category: 'CRM Integration',
    difficulty: 'intermediate',
    estimatedTime: '20 min',
    popular: true
  }
];

export const KnowledgeBase = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredItems = knowledgeItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(knowledgeItems.map(item => item.category))];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'guide': return <BookOpen className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'documentation': return <FileText className="h-4 w-4" />;
      case 'template': return <Star className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-400';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400';
      case 'advanced': return 'bg-red-500/20 text-red-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Knowledge Base</h2>
          <p className="text-slate-400">Learn how to connect platforms and build powerful dashboards</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search guides, tutorials, and documentation..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
        />
      </div>

      {/* Categories */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-4">
        <TabsList className="bg-slate-800/50 border-slate-700">
          <TabsTrigger value="all" className="text-slate-300 data-[state=active]:text-white">All</TabsTrigger>
          {categories.map(category => (
            <TabsTrigger 
              key={category} 
              value={category} 
              className="text-slate-300 data-[state=active]:text-white"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-4">
          {/* Popular Items */}
          {selectedCategory === "all" && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400" />
                Popular Guides
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {knowledgeItems
                  .filter(item => item.popular)
                  .slice(0, 3)
                  .map((item) => (
                    <Card key={item.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors cursor-pointer">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(item.type)}
                            <Badge variant="secondary" className="text-xs">
                              {item.type}
                            </Badge>
                          </div>
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        </div>
                        <CardTitle className="text-white text-sm">{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-400 text-sm mb-3">{item.description}</p>
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-1 rounded-full ${getDifficultyColor(item.difficulty)}`}>
                              {item.difficulty}
                            </span>
                            <span className="text-slate-500 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {item.estimatedTime}
                            </span>
                          </div>
                          <ExternalLink className="h-3 w-3 text-slate-500" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          )}

          {/* All Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(item.type)}
                      <Badge variant="secondary" className="text-xs">
                        {item.type}
                      </Badge>
                    </div>
                    {item.popular && <Star className="h-4 w-4 text-yellow-400 fill-current" />}
                  </div>
                  <CardTitle className="text-white text-sm">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 text-sm mb-3">{item.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded-full ${getDifficultyColor(item.difficulty)}`}>
                        {item.difficulty}
                      </span>
                      <span className="text-slate-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {item.estimatedTime}
                      </span>
                    </div>
                    <ExternalLink className="h-3 w-3 text-slate-500" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Links */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="h-5 w-5" />
            Community & Support
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:text-white justify-start">
              <ExternalLink className="h-4 w-4 mr-2" />
              Community Forum
            </Button>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:text-white justify-start">
              <Video className="h-4 w-4 mr-2" />
              Video Tutorials
            </Button>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:text-white justify-start">
              <FileText className="h-4 w-4 mr-2" />
              API Documentation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
