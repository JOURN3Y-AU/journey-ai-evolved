import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Fetch all published pages from database
    const { data: pages, error: pagesError } = await supabase
      .from('pages')
      .select('path, priority, change_frequency, updated_at')
      .eq('is_published', true)
      .order('priority', { ascending: false })

    if (pagesError) {
      console.error('Error fetching pages:', pagesError)
      throw pagesError
    }

    // Fetch all published blog posts
    const { data: blogPosts, error: blogError } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .order('updated_at', { ascending: false })

    if (blogError) {
      console.error('Error fetching blog posts:', blogError)
      throw blogError
    }

    // Base domain
    const domain = 'https://www.journ3y.com.au'
    
    // Generate XML sitemap
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`

    // Add pages from database
    if (pages && pages.length > 0) {
      for (const page of pages) {
        const lastmod = new Date(page.updated_at).toISOString().split('T')[0]
        sitemap += `  <url>
    <loc>${domain}${page.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.change_frequency}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`
      }
    }

    // Add blog posts
    if (blogPosts && blogPosts.length > 0) {
      for (const post of blogPosts) {
        const lastmod = new Date(post.updated_at).toISOString().split('T')[0]
        sitemap += `  <url>
    <loc>${domain}/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`
      }
    }

    sitemap += `</urlset>`

    // Return XML response
    return new Response(sitemap, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    })

  } catch (error) {
    console.error('Error generating sitemap:', error)
    return new Response('Error generating sitemap', { 
      status: 500,
      headers: corsHeaders
    })
  }
})