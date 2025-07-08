
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createHmac } from "node:crypto"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Twitter API credentials from environment variables
const TWITTER_API_KEY = Deno.env.get('TWITTER_API_KEY')
const TWITTER_API_SECRET = Deno.env.get('TWITTER_API_SECRET')
const TWITTER_ACCESS_TOKEN = Deno.env.get('TWITTER_ACCESS_TOKEN')
const TWITTER_ACCESS_TOKEN_SECRET = Deno.env.get('TWITTER_ACCESS_TOKEN_SECRET')

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
            
          case 'facebook':
            // For Facebook, we'd need the user's page access token
            // This is a placeholder - in production, you'd store user tokens
            throw new Error('Facebook posting requires user-specific page access tokens')
            
          default:
            results.push({ 
              platform, 
              success: false, 
              error: `Platform ${platform} not supported yet` 
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
