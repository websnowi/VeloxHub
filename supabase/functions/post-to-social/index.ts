
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// API credentials from environment variables
const TWITTER_API_KEY = Deno.env.get('TWITTER_API_KEY')
const TWITTER_API_SECRET = Deno.env.get('TWITTER_API_SECRET')
const TWITTER_ACCESS_TOKEN = Deno.env.get('TWITTER_ACCESS_TOKEN')
const TWITTER_ACCESS_TOKEN_SECRET = Deno.env.get('TWITTER_ACCESS_TOKEN_SECRET')

const FACEBOOK_ACCESS_TOKEN = Deno.env.get('FACEBOOK_ACCESS_TOKEN')
const INSTAGRAM_ACCESS_TOKEN = Deno.env.get('INSTAGRAM_ACCESS_TOKEN')
const LINKEDIN_ACCESS_TOKEN = Deno.env.get('LINKEDIN_ACCESS_TOKEN')
const PINTEREST_ACCESS_TOKEN = Deno.env.get('PINTEREST_ACCESS_TOKEN')
const PINTEREST_BOARD_ID = Deno.env.get('PINTEREST_BOARD_ID')

// Mock posting functions for demonstration
async function postToTwitter(content: string, mediaUrl?: string, link?: string): Promise<any> {
  console.log('Posting to Twitter:', { content, mediaUrl, link });
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demo purposes, return success
  return {
    id: 'twitter_' + Date.now(),
    text: content,
    created_at: new Date().toISOString()
  };
}

async function postToFacebook(content: string, mediaUrl?: string, link?: string): Promise<any> {
  console.log('Posting to Facebook:', { content, mediaUrl, link });
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    id: 'facebook_' + Date.now(),
    message: content,
    created_time: new Date().toISOString()
  };
}

async function postToInstagram(content: string, mediaUrl?: string): Promise<any> {
  console.log('Posting to Instagram:', { content, mediaUrl });
  
  if (!mediaUrl) {
    throw new Error('Instagram requires an image or video');
  }
  
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    id: 'instagram_' + Date.now(),
    caption: content,
    media_type: 'IMAGE',
    timestamp: new Date().toISOString()
  };
}

async function postToLinkedIn(content: string, mediaUrl?: string, link?: string): Promise<any> {
  console.log('Posting to LinkedIn:', { content, mediaUrl, link });
  
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  return {
    id: 'linkedin_' + Date.now(),
    text: content,
    created_at: new Date().toISOString()
  };
}

async function postToPinterest(content: string, mediaUrl?: string, link?: string): Promise<any> {
  console.log('Posting to Pinterest:', { content, mediaUrl, link });
  
  if (!mediaUrl) {
    throw new Error('Pinterest requires an image');
  }
  
  await new Promise(resolve => setTimeout(resolve, 1300));
  
  return {
    id: 'pinterest_' + Date.now(),
    description: content,
    created_at: new Date().toISOString()
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Processing social media post request...');
    
    const { content, platforms, user_id, mediaUrl, link, hashtags } = await req.json()
    
    console.log('Request data:', { 
      content: content?.substring(0, 50) + '...', 
      platforms, 
      user_id, 
      hasMedia: !!mediaUrl,
      hasLink: !!link,
      hashtagCount: hashtags?.length || 0
    });
    
    if (!content || !platforms || !user_id) {
      console.error('Missing required fields');
      return new Response(
        JSON.stringify({ error: 'Missing required fields: content, platforms, user_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Add hashtags to content if provided
    let finalContent = content
    if (hashtags && hashtags.length > 0) {
      const formattedHashtags = hashtags.map((tag: string) => 
        tag.startsWith('#') ? tag : `#${tag}`
      ).join(' ');
      finalContent += ' ' + formattedHashtags;
    }

    console.log('Final content length:', finalContent.length);

    const results = []
    
    for (const platform of platforms) {
      console.log(`Processing platform: ${platform}`);
      
      try {
        let result
        
        switch (platform.toLowerCase()) {
          case 'twitter':
          case 'x':
            result = await postToTwitter(finalContent, mediaUrl, link)
            results.push({ platform: 'Twitter', success: true, data: result })
            console.log('Twitter post successful');
            break
            
          case 'facebook':
            result = await postToFacebook(finalContent, mediaUrl, link)
            results.push({ platform: 'Facebook', success: true, data: result })
            console.log('Facebook post successful');
            break
            
          case 'instagram':
            result = await postToInstagram(finalContent, mediaUrl)
            results.push({ platform: 'Instagram', success: true, data: result })
            console.log('Instagram post successful');
            break
            
          case 'linkedin':
            result = await postToLinkedIn(finalContent, mediaUrl, link)
            results.push({ platform: 'LinkedIn', success: true, data: result })
            console.log('LinkedIn post successful');
            break
            
          case 'pinterest':
            result = await postToPinterest(finalContent, mediaUrl, link)
            results.push({ platform: 'Pinterest', success: true, data: result })
            console.log('Pinterest post successful');
            break
            
          default:
            console.log(`Unsupported platform: ${platform}`);
            results.push({ 
              platform, 
              success: false, 
              error: `Platform ${platform} not supported or not configured` 
            })
        }
      } catch (error) {
        console.error(`Error posting to ${platform}:`, error);
        results.push({ 
          platform, 
          success: false, 
          error: error.message 
        })
      }
    }

    const successCount = results.filter(r => r.success).length;
    console.log(`Posting complete. Success: ${successCount}/${platforms.length}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        results,
        message: `Posted to ${successCount} out of ${platforms.length} platforms`
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in post-to-social function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Check the edge function logs for more information'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
