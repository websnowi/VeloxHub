
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Send, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Twitter,
  Facebook,
  Instagram,
  Linkedin
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface PostResult {
  platform: string;
  success: boolean;
  data?: any;
  error?: string;
}

const SUPPORTED_PLATFORMS = [
  { name: 'Twitter', icon: Twitter, color: 'bg-blue-500', supported: true },
  { name: 'Facebook', icon: Facebook, color: 'bg-blue-600', supported: false },
  { name: 'Instagram', icon: Instagram, color: 'bg-pink-500', supported: false },
  { name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700', supported: false },
];

export const OfficialSocialMediaPoster = () => {
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [results, setResults] = useState<PostResult[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  const handlePost = async () => {
    if (!content.trim()) {
      toast({
        title: "Missing Content",
        description: "Please enter content to post",
        variant: "destructive",
      });
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast({
        title: "No Platforms Selected",
        description: "Please select at least one platform",
        variant: "destructive",
      });
      return;
    }

    setIsPosting(true);
    setResults([]);

    try {
      const { data, error } = await supabase.functions.invoke('post-to-social', {
        body: {
          content,
          platforms: selectedPlatforms,
          user_id: user?.id
        }
      });

      if (error) throw error;

      setResults(data.results || []);
      
      const successCount = data.results?.filter((r: PostResult) => r.success).length || 0;
      const totalCount = selectedPlatforms.length;

      if (successCount === totalCount) {
        toast({
          title: "Posts Published Successfully",
          description: `Your content was posted to all ${totalCount} selected platforms`,
        });
      } else if (successCount > 0) {
        toast({
          title: "Partial Success",
          description: `Posted to ${successCount} out of ${totalCount} platforms`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Publishing Failed",
          description: "Failed to post to any platform. Check the results below.",
          variant: "destructive",
        });
      }

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

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Official API Social Media Posting</CardTitle>
          <p className="text-slate-400 text-sm">
            Post to social media platforms using their official APIs. 
            This requires proper API credentials and app approval.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-slate-300 text-sm font-medium">Content</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your post content..."
              className="bg-slate-700/50 border-slate-600 text-white min-h-32"
              disabled={isPosting}
            />
            <p className="text-slate-400 text-xs">
              {content.length}/280 characters (Twitter limit)
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-slate-300 text-sm font-medium">Select Platforms</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {SUPPORTED_PLATFORMS.map((platform) => (
                <label
                  key={platform.name}
                  className={`
                    flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors
                    ${platform.supported 
                      ? 'border-slate-600 hover:border-slate-500' 
                      : 'border-slate-700 opacity-50 cursor-not-allowed'
                    }
                    ${selectedPlatforms.includes(platform.name) && platform.supported
                      ? 'bg-slate-700/50 border-blue-500' 
                      : 'bg-slate-800/30'
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    checked={selectedPlatforms.includes(platform.name)}
                    onChange={() => platform.supported && togglePlatform(platform.name)}
                    disabled={!platform.supported || isPosting}
                    className="sr-only"
                  />
                  <div className={`p-1 rounded ${platform.color}`}>
                    <platform.icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-slate-300 text-sm">{platform.name}</span>
                  {!platform.supported && (
                    <Badge variant="outline" className="text-xs">
                      Soon
                    </Badge>
                  )}
                </label>
              ))}
            </div>
          </div>

          <Alert className="bg-slate-700/50 border-slate-600">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-slate-300">
              <strong>Setup Required:</strong> This feature requires Twitter API credentials to be configured in your Supabase project settings. 
              You need: API Key, API Secret, Access Token, and Access Token Secret.
            </AlertDescription>
          </Alert>

          <Button
            onClick={handlePost}
            disabled={isPosting || !content.trim() || selectedPlatforms.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Send className="h-4 w-4 mr-2" />
            {isPosting ? "Posting..." : "Post to Selected Platforms"}
          </Button>
        </CardContent>
      </Card>

      {/* Results Display */}
      {results.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Posting Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30">
                  <div className="flex items-center gap-3">
                    {result.success ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className="text-slate-300">{result.platform}</span>
                  </div>
                  <div className="text-right">
                    {result.success ? (
                      <Badge className="bg-green-600">Success</Badge>
                    ) : (
                      <div className="space-y-1">
                        <Badge variant="destructive">Failed</Badge>
                        {result.error && (
                          <p className="text-xs text-red-400">{result.error}</p>
                        )}
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
