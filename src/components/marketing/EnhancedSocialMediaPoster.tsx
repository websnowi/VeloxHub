
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Linkedin,
  MapPin,
  Link,
  Hash,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { ImageSelector } from "./ImageSelector";

interface PostResult {
  platform: string;
  success: boolean;
  data?: any;
  error?: string;
}

const SUPPORTED_PLATFORMS = [
  { name: 'Twitter', icon: Twitter, color: 'bg-blue-500', supported: true, note: 'Text, images, links' },
  { name: 'Facebook', icon: Facebook, color: 'bg-blue-600', supported: true, note: 'Text, images, links' },
  { name: 'Instagram', icon: Instagram, color: 'bg-pink-500', supported: true, note: 'Images optional' },
  { name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700', supported: true, note: 'Professional content' },
  { name: 'Pinterest', icon: MapPin, color: 'bg-red-500', supported: true, note: 'Images optional' },
];

export const EnhancedSocialMediaPoster = () => {
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [results, setResults] = useState<PostResult[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [includeImage, setIncludeImage] = useState(false);
  const [link, setLink] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState('');
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
      console.log('Starting post to social media platforms:', selectedPlatforms);
      console.log('Content:', content);
      console.log('Include image:', includeImage);
      console.log('Selected image:', selectedImage);
      console.log('Link:', link);
      console.log('Hashtags:', hashtags);

      const { data, error } = await supabase.functions.invoke('post-to-social', {
        body: {
          content,
          platforms: selectedPlatforms,
          user_id: user?.id,
          mediaUrl: (includeImage && selectedImage) ? selectedImage : undefined,
          link: link.trim() || undefined,
          hashtags: hashtags.length > 0 ? hashtags : undefined
        }
      });

      console.log('Edge function response:', { data, error });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

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
        description: `Failed to post to social media: ${error.message || 'Unknown error'}`,
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

  const addHashtag = () => {
    const tag = hashtagInput.trim();
    if (tag && !hashtags.includes(tag)) {
      setHashtags([...hashtags, tag]);
      setHashtagInput('');
    }
  };

  const removeHashtag = (tag: string) => {
    setHashtags(hashtags.filter(h => h !== tag));
  };

  const handleHashtagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addHashtag();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Enhanced Social Media Posting</CardTitle>
          <p className="text-slate-400 text-sm">
            Post to multiple social media platforms with optional images, links, and hashtags using official APIs.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Content Input */}
          <div className="space-y-2">
            <Label className="text-slate-300 text-sm font-medium">Content</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your post content..."
              className="bg-slate-700/50 border-slate-600 text-white min-h-32"
              disabled={isPosting}
            />
            <p className="text-slate-400 text-xs">
              {content.length} characters
            </p>
          </div>

          {/* Optional Image Selection */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="includeImage"
                checked={includeImage}
                onChange={(e) => setIncludeImage(e.target.checked)}
                disabled={isPosting}
                className="rounded border-slate-600"
              />
              <Label htmlFor="includeImage" className="text-slate-300 text-sm font-medium">
                Include Image (Optional)
              </Label>
            </div>
            
            {includeImage && (
              <ImageSelector
                selectedImage={selectedImage}
                onImageSelect={setSelectedImage}
                disabled={isPosting}
              />
            )}
          </div>

          {/* Link Input */}
          <div className="space-y-2">
            <Label className="text-slate-300 text-sm font-medium flex items-center gap-2">
              <Link className="h-4 w-4" />
              Link URL (optional)
            </Label>
            <Input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://example.com"
              className="bg-slate-700/50 border-slate-600 text-white"
              disabled={isPosting}
            />
          </div>

          {/* Hashtags */}
          <div className="space-y-2">
            <Label className="text-slate-300 text-sm font-medium flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Hashtags
            </Label>
            <div className="flex gap-2">
              <Input
                value={hashtagInput}
                onChange={(e) => setHashtagInput(e.target.value)}
                onKeyPress={handleHashtagKeyPress}
                placeholder="Enter hashtag and press Enter"
                className="bg-slate-700/50 border-slate-600 text-white flex-1"
                disabled={isPosting}
              />
              <Button
                onClick={addHashtag}
                variant="outline"
                size="sm"
                disabled={!hashtagInput.trim() || isPosting}
              >
                Add
              </Button>
            </div>
            {hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {hashtags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    #{tag}
                    <button
                      onClick={() => removeHashtag(tag)}
                      className="ml-1 hover:text-red-400"
                      disabled={isPosting}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Platform Selection */}
          <div className="space-y-2">
            <Label className="text-slate-300 text-sm font-medium">Select Platforms</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {SUPPORTED_PLATFORMS.map((platform) => (
                <label
                  key={platform.name}
                  className={`
                    flex flex-col gap-2 p-4 rounded-lg border cursor-pointer transition-colors
                    border-slate-600 hover:border-slate-500
                    ${selectedPlatforms.includes(platform.name)
                      ? 'bg-slate-700/50 border-blue-500' 
                      : 'bg-slate-800/30'
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    checked={selectedPlatforms.includes(platform.name)}
                    onChange={() => togglePlatform(platform.name)}
                    disabled={isPosting}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-2">
                    <div className={`p-1 rounded ${platform.color}`}>
                      <platform.icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-slate-300 text-sm font-medium">{platform.name}</span>
                  </div>
                  <span className="text-xs text-slate-400">{platform.note}</span>
                </label>
              ))}
            </div>
          </div>

          <Alert className="bg-slate-700/50 border-slate-600">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-slate-300">
              <strong>API Setup Required:</strong> Make sure to configure API credentials for each platform in your Supabase Edge Function secrets. 
              If publishing fails, check the browser console and edge function logs for detailed error messages.
            </AlertDescription>
          </Alert>

          <Button
            onClick={handlePost}
            disabled={isPosting || !content.trim() || selectedPlatforms.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Send className="h-4 w-4 mr-2" />
            {isPosting ? "Posting to Platforms..." : `Post to ${selectedPlatforms.length} Selected Platform${selectedPlatforms.length !== 1 ? 's' : ''}`}
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
                    <span className="text-slate-300 font-medium">{result.platform}</span>
                  </div>
                  <div className="text-right">
                    {result.success ? (
                      <div className="space-y-1">
                        <Badge className="bg-green-600">Success</Badge>
                        <p className="text-xs text-green-400">Posted successfully</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <Badge variant="destructive">Failed</Badge>
                        {result.error && (
                          <p className="text-xs text-red-400 max-w-xs break-words">{result.error}</p>
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
