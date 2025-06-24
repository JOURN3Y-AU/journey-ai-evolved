
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AssessmentRequest {
  responseId: string;
  answers: {
    q1_business_challenge: string;
    q2_time_waste: string;
    q3_revenue: string;
    q4_timeline: string;
    q5_investment_priority: string;
    q6_leadership_readiness: string;
  };
  contactInfo: {
    first_name: string;
    last_name: string;
    email: string;
    company_name: string;
    phone_number?: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { responseId, answers, contactInfo }: AssessmentRequest = await req.json();

    console.log('Processing AI assessment for:', contactInfo.email);

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Initialize Resend
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

    // Load prompt template
    let promptTemplate: string;
    try {
      const response = await fetch('https://ghtqdgkfbfdlnowrowpw.supabase.co/storage/v1/object/public/assets/prompt-template.txt');
      if (response.ok) {
        promptTemplate = await response.text();
      } else {
        throw new Error('Failed to load template from storage');
      }
    } catch (error) {
      console.log('Using fallback prompt template');
      promptTemplate = `You are an AI business consultant analyzing a company's readiness for AI transformation. Based on the assessment responses below, provide a personalized, professional analysis that positions the business for AI success.

Assessment Responses:
- Biggest business challenge: [Q1_ANSWER]
- Biggest time waste: [Q2_ANSWER]
- Annual revenue: [Q3_ANSWER]
- Implementation timeline: [Q4_ANSWER]
- Investment priority: [Q5_ANSWER]
- Leadership readiness: [Q6_ANSWER]

Provide a response that:
1. Acknowledges their specific situation and challenges
2. Identifies 2-3 key AI opportunities based on their responses
3. Gives them a sense of where they stand compared to industry peers
4. Creates urgency around AI adoption timing
5. Positions JOURN3Y as the right partner to help

Keep the tone professional, insightful, and consultative. Limit response to 250 words maximum.`;
    }

    // Replace placeholders in prompt
    const prompt = promptTemplate
      .replace('[Q1_ANSWER]', answers.q1_business_challenge)
      .replace('[Q2_ANSWER]', answers.q2_time_waste)
      .replace('[Q3_ANSWER]', answers.q3_revenue)
      .replace('[Q4_ANSWER]', answers.q4_timeline)
      .replace('[Q5_ANSWER]', answers.q5_investment_priority)
      .replace('[Q6_ANSWER]', answers.q6_leadership_readiness);

    let assessment: string;

    try {
      // Call Anthropic API
      const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': Deno.env.get('ANTHROPIC_API_KEY') ?? '',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-haiku-20241022',
          max_tokens: 300,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        })
      });

      if (!anthropicResponse.ok) {
        throw new Error(`Anthropic API error: ${anthropicResponse.status}`);
      }

      const anthropicData = await anthropicResponse.json();
      assessment = anthropicData.content[0].text;

      console.log('AI assessment generated successfully');

    } catch (error) {
      console.error('Anthropic API failed, using fallback:', error);
      
      // Fallback assessment
      assessment = `Thank you ${contactInfo.first_name}, for completing our AI readiness assessment.

Based on your responses, your company shows strong potential for AI transformation, particularly in addressing ${answers.q1_business_challenge.toLowerCase()} and optimizing ${answers.q2_time_waste.toLowerCase()}.

Companies with similar profiles typically see 20-40% efficiency gains when implementing AI solutions strategically. Your timeline of ${answers.q4_timeline.toLowerCase()} positions you well to capitalize on current AI advancement trends.

Key opportunities for ${contactInfo.company_name}:
• Automated workflows to reduce time waste
• AI-powered insights for better decision making
• Competitive advantage through early adoption

Your focus on ${answers.q5_investment_priority.toLowerCase()} aligns perfectly with proven AI implementation strategies. We recommend starting with a targeted pilot program to demonstrate ROI before broader rollout.

At JOURN3Y, we've helped businesses similar to yours achieve measurable AI transformation results. Let's discuss how we can accelerate your AI journey with a customized strategy.`;
    }

    // Update assessment response in database
    const { error: updateError } = await supabase
      .from('assessment_responses')
      .update({
        ai_assessment_result: assessment,
        ai_generation_status: 'completed'
      })
      .eq('id', responseId);

    if (updateError) {
      console.error('Error updating assessment response:', updateError);
    }

    // Create campaign lead
    try {
      const { data: leadData, error: leadError } = await supabase
        .rpc('create_campaign_lead_from_assessment', {
          assessment_response_id: responseId
        });

      if (leadError) {
        console.error('Error creating campaign lead:', leadError);
      } else {
        console.log('Campaign lead created:', leadData);
      }
    } catch (error) {
      console.error('Error in campaign lead creation:', error);
    }

    // Send email to user
    try {
      const userEmailResponse = await resend.emails.send({
        from: 'JOURN3Y AI Assessment <assessments@journ3y.com.au>',
        to: [contactInfo.email],
        subject: `${contactInfo.first_name}, Your AI Readiness Assessment Results`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #2563eb, #4f46e5); padding: 40px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Your AI Readiness Assessment</h1>
              <p style="color: #e0e7ff; margin: 10px 0 0 0;">Personalized insights for ${contactInfo.company_name}</p>
            </div>
            
            <div style="padding: 30px 20px; background: #f8fafc;">
              <h2 style="color: #1e293b; margin-bottom: 20px;">Hi ${contactInfo.first_name},</h2>
              
              <p style="color: #475569; line-height: 1.6; margin-bottom: 20px;">
                Thank you for completing our AI readiness assessment. Based on your responses, we've generated a personalized analysis of your business's AI opportunities.
              </p>
              
              <div style="background: white; padding: 25px; border-radius: 8px; border-left: 4px solid #2563eb; margin: 25px 0;">
                <h3 style="color: #1e293b; margin-top: 0;">Your Assessment Results:</h3>
                <div style="color: #475569; line-height: 1.7; white-space: pre-wrap;">${assessment}</div>
              </div>
              
              <div style="background: #2563eb; padding: 25px; border-radius: 8px; text-align: center; margin: 25px 0;">
                <h3 style="color: white; margin-top: 0;">Ready to Take the Next Step?</h3>
                <p style="color: #e0e7ff; margin-bottom: 20px;">Book a complimentary strategy call to discuss your AI transformation opportunities.</p>
                <a href="https://calendly.com/journ3y" style="background: white; color: #2563eb; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Book Strategy Call</a>
              </div>
              
              <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px;">
                <p style="color: #64748b; font-size: 14px; margin: 0;">
                  Best regards,<br>
                  The JOURN3Y Team<br>
                  <a href="https://journ3y.com.au" style="color: #2563eb;">journ3y.com.au</a>
                </p>
              </div>
            </div>
          </div>
        `,
      });

      console.log('User email sent:', userEmailResponse);

      // Update email sent status
      await supabase
        .from('assessment_responses')
        .update({ email_sent: true })
        .eq('id', responseId);

    } catch (error) {
      console.error('Error sending user email:', error);
    }

    // Send notification to admin
    try {
      const adminEmailResponse = await resend.emails.send({
        from: 'JOURN3Y AI Assessment <assessments@journ3y.com.au>',
        to: ['kevin.morrell@journ3y.com.au'],
        subject: `New AI Assessment Completed - ${contactInfo.company_name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb; margin-bottom: 20px;">New AI Assessment Completion</h2>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="margin-top: 0; color: #1e293b;">Contact Information</h3>
              <p><strong>Name:</strong> ${contactInfo.first_name} ${contactInfo.last_name}</p>
              <p><strong>Email:</strong> ${contactInfo.email}</p>
              <p><strong>Company:</strong> ${contactInfo.company_name}</p>
              ${contactInfo.phone_number ? `<p><strong>Phone:</strong> ${contactInfo.phone_number}</p>` : ''}
            </div>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="margin-top: 0; color: #1e293b;">Assessment Responses</h3>
              <p><strong>Business Challenge:</strong> ${answers.q1_business_challenge}</p>
              <p><strong>Time Waste:</strong> ${answers.q2_time_waste}</p>
              <p><strong>Revenue:</strong> ${answers.q3_revenue}</p>
              <p><strong>Timeline:</strong> ${answers.q4_timeline}</p>
              <p><strong>Investment Priority:</strong> ${answers.q5_investment_priority}</p>
              <p><strong>Leadership Readiness:</strong> ${answers.q6_leadership_readiness}</p>
            </div>
            
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb;">
              <h3 style="margin-top: 0; color: #1e293b;">Generated Assessment</h3>
              <div style="white-space: pre-wrap; line-height: 1.6;">${assessment}</div>
            </div>
          </div>
        `,
      });

      console.log('Admin notification sent:', adminEmailResponse);

      // Update notification sent status
      await supabase
        .from('assessment_responses')
        .update({ notification_sent: true })
        .eq('id', responseId);

    } catch (error) {
      console.error('Error sending admin notification:', error);
    }

    return new Response(
      JSON.stringify({ assessment }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );

  } catch (error) {
    console.error('Error in generate-ai-assessment function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
};

serve(handler);
