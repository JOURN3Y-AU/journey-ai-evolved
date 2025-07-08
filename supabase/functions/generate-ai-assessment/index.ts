import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { responseId, prompt, type } = await req.json();
    
    console.log('Processing AI assessment for response ID:', responseId);
    console.log('Assessment type:', type);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let aiAssessment = '';
    let rawResponse = '';

    // Try to generate AI assessment with Anthropic
    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
    console.log('ANTHROPIC_API_KEY available:', !!anthropicApiKey);
    
    if (anthropicApiKey) {
      try {
        console.log('Attempting to call Anthropic API...');
        const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': anthropicApiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-3-5-haiku-20241022',
            max_tokens: type === 'dashboard' ? 2000 : 3000,
            messages: [
              {
                role: 'user',
                content: prompt
              }
            ]
          })
        });

        console.log('Anthropic API response status:', anthropicResponse.status);

        if (anthropicResponse.ok) {
          const data = await anthropicResponse.json();
          rawResponse = JSON.stringify(data);
          aiAssessment = data.content[0].text;
          console.log('AI assessment generated successfully');
        } else {
          const errorText = await anthropicResponse.text();
          console.error('Anthropic API error response:', errorText);
          throw new Error(`Anthropic API error: ${anthropicResponse.status} - ${errorText}`);
        }
      } catch (error) {
        console.error('Anthropic API error:', error);
        throw new Error(`Failed to generate AI assessment: ${error.message}`);
      }
    } else {
      console.error('No Anthropic API key available');
      throw new Error('ANTHROPIC_API_KEY not configured');
    }

    console.log('AI assessment generation completed successfully');

    return new Response(JSON.stringify({ assessment: aiAssessment }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-ai-assessment function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
