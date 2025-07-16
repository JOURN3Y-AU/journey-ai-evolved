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

    // Fetch all published blog posts
    const { data: blogPosts, error } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error fetching blog posts:', error)
      throw error
    }

    // Base domain
    const domain = 'https://www.journ3y.com.au'
    
    // Static pages with their priorities and change frequencies
    const staticPages = [
      { url: '', priority: '1.0', changefreq: 'weekly' },
      { url: '/contact', priority: '0.8', changefreq: 'monthly' },
      { url: '/team', priority: '0.7', changefreq: 'monthly' },
      { url: '/resources', priority: '0.8', changefreq: 'weekly' },
      { url: '/blog', priority: '0.9', changefreq: 'weekly' },
      { url: '/privacy', priority: '0.3', changefreq: 'yearly' },
      { url: '/products/ai-assessment', priority: '0.9', changefreq: 'monthly' },
      { url: '/products/ai-assessment-long', priority: '0.8', changefreq: 'monthly' },
      { url: '/products/ai-assessment-v2', priority: '0.9', changefreq: 'monthly' },
      { url: '/products/brand3y', priority: '0.8', changefreq: 'monthly' },
      { url: '/products/glean', priority: '0.8', changefreq: 'monthly' },
      { url: '/products/accelerators', priority: '0.7', changefreq: 'monthly' },
      { url: '/products/blueprint', priority: '0.7', changefreq: 'monthly' },
      { url: '/products/services', priority: '0.8', changefreq: 'monthly' },
    ]

    // Generate XML sitemap
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`

    // Add static pages
    for (const page of staticPages) {
      sitemap += `  <url>
    <loc>${domain}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`
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