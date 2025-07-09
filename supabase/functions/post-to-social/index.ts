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

const FACEBOOK_ACCESS_TOKEN = Deno.env.get('FACEBOOK_ACCESS_TOKEN')
const INSTAGRAM_ACCESS_TOKEN = Deno.env.get('INSTAGRAM_ACCESS_TOKEN')
const LINKEDIN_ACCESS_TOKEN = Deno.env.get('LINKEDIN_ACCESS_TOKEN')
const PINTEREST_ACCESS_TOKEN = Deno.env.get('PINTEREST_ACCESS_TOKEN')
const PINTEREST_BOARD_ID = Deno.env.get('PINTEREST_BOARD_ID')

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

async function postToTwitter(content: string, mediaUrl?: string, link?: string): Promise<any> {
  const url = "https://api.twitter.com/2/tweets"
  const method = "POST"
  
  let tweetText = content
  if (link) {
    tweetText += ` ${link}`
  }
  
  const oauthHeader = generateOAuthHeader(method, url)
  
  const tweetData: any = { text: tweetText }
  
  // If media is provided, we'd need to upload it first (simplified for now)
  if (mediaUrl) {
    console.log(`Media URL provided: ${mediaUrl}`)
    // Twitter requires media to be uploaded separately via media/upload endpoint
    // This is a simplified version - in production you'd upload the media first
  }
  
  const response = await fetch(url, {
    method: method,
    headers: {
      Authorization: oauthHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tweetData),
  })

  const responseText = await response.text()
  
  if (!response.ok) {
    throw new Error(`Twitter API error: ${response.status} - ${responseText}`)
  }

  return JSON.parse(responseText)
}

async function postToFacebook(content: string, mediaUrl?: string, link?: string): Promise<any> {
  if (!FACEBOOK_ACCESS_TOKEN) {
    throw new Error('Facebook access token not configured')
  }

  const postData: any = {
    message: content,
    access_token: FACEBOOK_ACCESS_TOKEN
  }

  if (link) {
    postData.link = link
  }

  if (mediaUrl) {
    postData.picture = mediaUrl
  }

  const response = await fetch(`https://graph.facebook.com/me/feed`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData)
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Facebook API error: ${response.status} - ${error}`)
  }

  return await response.json()
}

async function postToInstagram(content: string, mediaUrl?: string): Promise<any> {
  if (!INSTAGRAM_ACCESS_TOKEN) {
    throw new Error('Instagram access token not configured')
  }

  if (!mediaUrl) {
    throw new Error('Instagram requires an image or video')
  }

  // Instagram posting is a two-step process: create media object, then publish
  const createMediaResponse = await fetch(`https://graph.facebook.com/me/media`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image_url: mediaUrl,
      caption: content,
      access_token: INSTAGRAM_ACCESS_TOKEN
    })
  })

  if (!createMediaResponse.ok) {
    const error = await createMediaResponse.text()
    throw new Error(`Instagram create media error: ${createMediaResponse.status} - ${error}`)
  }

  const mediaData = await createMediaResponse.json()

  // Publish the media
  const publishResponse = await fetch(`https://graph.facebook.com/me/media_publish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      creation_id: mediaData.id,
      access_token: INSTAGRAM_ACCESS_TOKEN
    })
  })

  if (!publishResponse.ok) {
    const error = await publishResponse.text()
    throw new Error(`Instagram publish error: ${publishResponse.status} - ${error}`)
  }

  return await publishResponse.json()
}

async function postToLinkedIn(content: string, mediaUrl?: string, link?: string): Promise<any> {
  if (!LINKEDIN_ACCESS_TOKEN) {
    throw new Error('LinkedIn access token not configured')
  }

  // Get user profile to get the person URN
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

  const postData: any = {
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
  }

  // Add media or link if provided
  if (mediaUrl || link) {
    postData.specificContent['com.linkedin.ugc.ShareContent'].shareMediaCategory = 'ARTICLE'
    postData.specificContent['com.linkedin.ugc.ShareContent'].media = [{
      status: 'READY',
      description: {
        text: content
      },
      originalUrl: link || mediaUrl,
      title: {
        text: 'Shared Content'
      }
    }]
  }

  const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LINKEDIN_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData)
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`LinkedIn API error: ${response.status} - ${error}`)
  }

  return await response.json()
}

async function postToPinterest(content: string, mediaUrl?: string, link?: string): Promise<any> {
  if (!PINTEREST_ACCESS_TOKEN || !PINTEREST_BOARD_ID) {
    throw new Error('Pinterest access token or board ID not configured')
  }

  if (!mediaUrl) {
    throw new Error('Pinterest requires an image')
  }

  const response = await fetch('https://api.pinterest.com/v5/pins', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PINTEREST_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      board_id: PINTEREST_BOARD_ID,
      media_source: {
        source_type: 'image_url',
        url: mediaUrl
      },
      description: content,
      link: link || undefined
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Pinterest API error: ${response.status} - ${error}`)
  }

  return await response.json()
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { content, platforms, user_id, mediaUrl, link, hashtags } = await req.json()
    
    if (!content || !platforms || !user_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: content, platforms, user_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Add hashtags to content if provided
    let finalContent = content
    if (hashtags && hashtags.length > 0) {
      finalContent += ' ' + hashtags.map((tag: string) => tag.startsWith('#') ? tag : `#${tag}`).join(' ')
    }

    const results = []
    
    for (const platform of platforms) {
      try {
        let result
        
        switch (platform.toLowerCase()) {
          case 'twitter':
          case 'x':
            result = await postToTwitter(finalContent, mediaUrl, link)
            results.push({ platform: 'Twitter', success: true, data: result })
            break
            
          case 'facebook':
            result = await postToFacebook(finalContent, mediaUrl, link)
            results.push({ platform: 'Facebook', success: true, data: result })
            break
            
          case 'instagram':
            result = await postToInstagram(finalContent, mediaUrl)
            results.push({ platform: 'Instagram', success: true, data: result })
            break
            
          case 'linkedin':
            result = await postToLinkedIn(finalContent, mediaUrl, link)
            results.push({ platform: 'LinkedIn', success: true, data: result })
            break
            
          case 'pinterest':
            result = await postToPinterest(finalContent, mediaUrl, link)
            results.push({ platform: 'Pinterest', success: true, data: result })
            break
            
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
