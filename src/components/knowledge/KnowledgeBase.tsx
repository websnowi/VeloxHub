
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
  Users,
  Play,
  Download
} from "lucide-react";

interface KnowledgeItem {
  id: string;
  title: string;
  description: string;
  content: string;
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
    content: '1. Sign up and create your workspace\n2. Choose a dashboard template or start from scratch\n3. Add your first widgets\n4. Connect your data sources\n5. Customize your layout and styling',
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
    content: '1. Get your Salesforce API credentials\n2. Go to Integrations panel\n3. Click on Salesforce integration\n4. Enter your Organization ID and API Token\n5. Test the connection\n6. Map your data fields to dashboard widgets',
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
    content: 'Learn how to create charts, tables, and custom widgets using our visual editor. Customize colors, data sources, and interactive elements.',
    type: 'video',
    category: 'Dashboard Design',
    difficulty: 'intermediate',
    estimatedTime: '25 min',
    popular: false
  },
  {
    id: '4',
    title: 'Dashboard Templates Library',
    description: 'Ready-to-use templates for Sales, HR, Marketing, and Operations dashboards',
    content: 'Browse our collection of pre-built dashboard templates. Choose from Sales Analytics, HR Management, Marketing ROI, Operations Overview, and more.',
    type: 'template',
    category: 'Templates',
    difficulty: 'beginner',
    estimatedTime: '5 min',
    popular: true
  },
  {
    id: '5',
    title: 'Advanced Workflow Automation',
    description: 'Create complex business workflows with conditional logic and triggers',
    content: 'Set up automated workflows that trigger when data changes. Create if-then logic, schedule tasks, and integrate with external services.',
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
    content: '1. Access your HubSpot API settings\n2. Generate a private app token\n3. Find your Portal ID in account settings\n4. Configure the integration in VeloxHub\n5. Select which data to sync\n6. Set up real-time updates',
    type: 'guide',
    category: 'CRM Integration',
    difficulty: 'intermediate',
    estimatedTime: '20 min',
    popular: true
  },
  {
    id: '7',
    title: 'User Permissions & Access Control',
    description: 'Set up role-based access, team permissions, and section-level security',
    content: 'Learn how to create user roles, assign permissions, restrict access to sensitive data, and manage team collaboration features.',
    type: 'guide',
    category: 'Security',
    difficulty: 'intermediate',
    estimatedTime: '25 min',
    popular: false
  },
  {
    id: '8',
    title: 'API Integration Best Practices',
    description: 'Guidelines for connecting external APIs and handling authentication',
    content: 'Best practices for API security, rate limiting, error handling, and data synchronization in your custom integrations.',
    type: 'documentation',
    category: 'API Integration',
    difficulty: 'advanced',
    estimatedTime: '35 min',
    popular: false
  }
];

export const KnowledgeBase = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);

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
      case 'beginner': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'advanced': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  if (selectedItem) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setSelectedItem(null)}
            className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50"
          >
            ← Back to Knowledge Base
          </Button>
          <div className="flex items-center gap-2">
            {getTypeIcon(selectedItem.type)}
            <Badge variant="secondary" className="text-xs">
              {selectedItem.type}
            </Badge>
          </div>
        </div>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-white text-xl mb-2">{selectedItem.title}</CardTitle>
                <p className="text-slate-400">{selectedItem.description}</p>
              </div>
              {selectedItem.popular && <Star className="h-5 w-5 text-yellow-400 fill-current" />}
            </div>
            <div className="flex items-center gap-4 mt-4">
              <span className={`px-3 py-1 rounded-full border text-sm ${getDifficultyColor(selectedItem.difficulty)}`}>
                {selectedItem.difficulty}
              </span>
              <span className="text-slate-500 flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {selectedItem.estimatedTime}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
              <h3 className="text-white font-semibold mb-3">Content:</h3>
              <div className="text-slate-300 whitespace-pre-line leading-relaxed">
                {selectedItem.content}
              </div>
            </div>
            
            {selectedItem.type === 'video' && (
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                <Play className="h-4 w-4 mr-2" />
                Watch Video Tutorial
              </Button>
            )}
            
            {selectedItem.type === 'template' && (
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

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
          className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {/* Categories */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-4">
        <TabsList className="bg-slate-800/50 border-slate-700">
          <TabsTrigger value="all" className="text-slate-300 data-[state=active]:text-white data-[state=active]:bg-slate-700">All</TabsTrigger>
          {categories.map(category => (
            <TabsTrigger 
              key={category} 
              value={category} 
              className="text-slate-300 data-[state=active]:text-white data-[state=active]:bg-slate-700"
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
                    <Card 
                      key={item.id} 
                      className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors cursor-pointer"
                      onClick={() => setSelectedItem(item)}
                    >
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
                            <span className={`px-2 py-1 rounded-full border ${getDifficultyColor(item.difficulty)}`}>
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
              <Card 
                key={item.id} 
                className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
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
                      <span className={`px-2 py-1 rounded-full border ${getDifficultyColor(item.difficulty)}`}>
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
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50 justify-start">
              <ExternalLink className="h-4 w-4 mr-2" />
              Community Forum
            </Button>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50 justify-start">
              <Video className="h-4 w-4 mr-2" />
              Video Tutorials
            </Button>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50 justify-start">
              <FileText className="h-4 w-4 mr-2" />
              API Documentation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
