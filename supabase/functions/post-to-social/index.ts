
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createHmac } from "node:crypto"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// API credentials from environment variables
const TWITTER_API_KEY = Deno.env.get('TWITTER_API_KEY')
const TWITTER_API_SECRET = Deno.env.get('TWITTER_API_SECRET')
const TWITTER_ACCESS_TOKEN = Deno.env.get('TWITTER_ACCESS_TOKEN')
const TWITTER_ACCESS_TOKEN_SECRET = Deno.env.get('TWITTER_ACCESS_TOKEN_SECRET')

const PINTEREST_ACCESS_TOKEN = Deno.env.get('PINTEREST_ACCESS_TOKEN')
const LINKEDIN_ACCESS_TOKEN = Deno.env.get('LINKEDIN_ACCESS_TOKEN')
const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY')
const YOUTUBE_ACCESS_TOKEN = Deno.env.get('YOUTUBE_ACCESS_TOKEN')

function generateOAuthSignature(
  method: string,
  url: string,
  params: Record<string, string>,
  consumerSecret: string,
  tokenSecret: string
): string {
  const signatureBaseString = `${method}&${encodeURIComponent(url)}&${encodeURIComponent(
    Object.entries(params)
      .sort()
      .map(([k, v]) => `${k}=${v}`)
      .join("&")
  )}`
  
  const signingKey = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(tokenSecret)}`
  const hmacSha1 = createHmac("sha1", signingKey)
  const signature = hmacSha1.update(signatureBaseString).digest("base64")
  
  return signature
}

function generateOAuthHeader(method: string, url: string): string {
  if (!TWITTER_API_KEY || !TWITTER_ACCESS_TOKEN || !TWITTER_API_SECRET || !TWITTER_ACCESS_TOKEN_SECRET) {
    throw new Error('Missing Twitter API credentials')
  }

  const oauthParams = {
    oauth_consumer_key: TWITTER_API_KEY,
    oauth_nonce: Math.random().toString(36).substring(2),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: TWITTER_ACCESS_TOKEN,
    oauth_version: "1.0",
  }

  const signature = generateOAuthSignature(
    method,
    url,
    oauthParams,
    TWITTER_API_SECRET,
    TWITTER_ACCESS_TOKEN_SECRET
  )

  const signedOAuthParams = {
    ...oauthParams,
    oauth_signature: signature,
  }

  const entries = Object.entries(signedOAuthParams).sort((a, b) => a[0].localeCompare(b[0]))
  
  return "OAuth " + entries
    .map(([k, v]) => `${encodeURIComponent(k)}="${encodeURIComponent(v)}"`)
    .join(", ")
}

async function postToTwitter(content: string): Promise<any> {
  const url = "https://api.twitter.com/2/tweets"
  const method = "POST"
  
  const oauthHeader = generateOAuthHeader(method, url)
  
  const response = await fetch(url, {
    method: method,
    headers: {
      Authorization: oauthHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: content }),
  })

  const responseText = await response.text()
  
  if (!response.ok) {
    throw new Error(`Twitter API error: ${response.status} - ${responseText}`)
  }

  return JSON.parse(responseText)
}

async function postToPinterest(content: string): Promise<any> {
  if (!PINTEREST_ACCESS_TOKEN) {
    throw new Error('Pinterest access token not configured')
  }

  const response = await fetch('https://api.pinterest.com/v5/pins', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PINTEREST_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      board_id: 'your-board-id', // This would need to be configured
      media_source: {
        source_type: 'image_url',
        url: 'https://via.placeholder.com/400x600' // Default image, would need to be configurable
      },
      description: content
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Pinterest API error: ${response.status} - ${error}`)
  }

  return await response.json()
}

async function postToLinkedIn(content: string): Promise<any> {
  if (!LINKEDIN_ACCESS_TOKEN) {
    throw new Error('LinkedIn access token not configured')
  }

  // First get user profile to get the person URN
  const profileResponse = await fetch('https://api.linkedin.com/v2/people/(id~)', {
    headers: {
      'Authorization': `Bearer ${LINKEDIN_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    }
  })

  if (!profileResponse.ok) {
    throw new Error('Failed to get LinkedIn profile')
  }

  const profile = await profileResponse.json()
  const personUrn = profile.id

  const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LINKEDIN_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      author: `urn:li:person:${personUrn}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: content
          },
          shareMediaCategory: 'NONE'
        }
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
      }
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`LinkedIn API error: ${response.status} - ${error}`)
  }

  return await response.json()
}

async function postToYouTube(content: string): Promise<any> {
  if (!YOUTUBE_ACCESS_TOKEN) {
    throw new Error('YouTube access token not configured')
  }

  // YouTube requires video upload, so we'll create a community post instead
  const response = await fetch('https://www.googleapis.com/youtube/v3/activities', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${YOUTUBE_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      snippet: {
        description: content
      }
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`YouTube API error: ${response.status} - ${error}`)
  }

  return await response.json()
}

async function postToFacebook(content: string, accessToken: string): Promise<any> {
  // Facebook requires a Page Access Token for posting
  const response = await fetch(`https://graph.facebook.com/me/feed`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: content,
      access_token: accessToken
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Facebook API error: ${response.status} - ${error}`)
  }

  return await response.json()
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { content, platforms, user_id } = await req.json()
    
    if (!content || !platforms || !user_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: content, platforms, user_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const results = []
    
    for (const platform of platforms) {
      try {
        let result
        
        switch (platform.toLowerCase()) {
          case 'twitter':
          case 'x':
            result = await postToTwitter(content)
            results.push({ platform: 'Twitter', success: true, data: result })
            break
            
          case 'pinterest':
            result = await postToPinterest(content)
            results.push({ platform: 'Pinterest', success: true, data: result })
            break
            
          case 'linkedin':
            result = await postToLinkedIn(content)
            results.push({ platform: 'LinkedIn', success: true, data: result })
            break
            
          case 'youtube':
            result = await postToYouTube(content)
            results.push({ platform: 'YouTube', success: true, data: result })
            break
            
          case 'facebook':
            // For Facebook, we'd need the user's page access token
            throw new Error('Facebook posting requires user-specific page access tokens')
            
          case 'instagram':
            throw new Error('Instagram Business API requires Facebook approval and is very restrictive')
            
          case 'tiktok':
            throw new Error('TikTok does not provide a public posting API')
            
          case 'snapchat':
            throw new Error('Snapchat does not provide a public posting API')
            
          default:
            results.push({ 
              platform, 
              success: false, 
              error: `Platform ${platform} not supported or not configured` 
            })
        }
      } catch (error) {
        console.error(`Error posting to ${platform}:`, error)
        results.push({ 
          platform, 
          success: false, 
          error: error.message 
        })
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        results,
        message: `Posted to ${results.filter(r => r.success).length} out of ${platforms.length} platforms`
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in post-to-social function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
