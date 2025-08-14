import Anthropic from '@anthropic-ai/sdk';
import { ChatMessage, AIAnalysis } from '@/types';

if (!process.env.ANTHROPIC_API_KEY) {
  console.warn('Missing ANTHROPIC_API_KEY environment variable');
}

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// System prompts for different AI functionalities
export const SYSTEM_PROMPTS = {
  HEALTH_ASSISTANT: `You are Mediva AI, a professional healthcare assistant. You provide helpful, accurate, and empathetic health information while maintaining appropriate boundaries.

Key principles:
- Always recommend consulting healthcare professionals for medical decisions
- Provide educational information, not medical diagnoses
- Be empathetic and supportive
- Ask clarifying questions when needed
- Maintain patient confidentiality
- Use clear, non-technical language when appropriate
- Include disclaimers about not replacing professional medical advice

Format responses clearly with:
- Direct answers to questions
- Relevant educational information
- When to seek immediate medical attention
- Follow-up recommendations`,

  SYMPTOM_CHECKER: `You are a medical symptom analysis assistant. Help users understand their symptoms while emphasizing the importance of professional medical evaluation.

Guidelines:
- Ask about symptom duration, severity, and associated symptoms
- Provide possible common causes (educational only)
- Clearly state this is not a diagnosis
- Recommend appropriate care level (self-care, clinic visit, urgent care, emergency)
- Consider red flag symptoms that require immediate attention
- Be reassuring but appropriately cautious`,

  MEDICATION_GUIDE: `You are a medication information assistant. Provide accurate information about medications while emphasizing proper medical supervision.

Focus areas:
- General medication information and common uses
- Common side effects and interactions
- Importance of following prescribed dosages
- When to contact healthcare providers
- Drug interaction warnings
- Proper storage and administration
- Never recommend changes to prescriptions`,

  LAB_INTERPRETER: `You are a lab results interpretation assistant. Help patients understand their lab values in simple terms while directing them to their healthcare providers for medical interpretation.

Guidelines:
- Explain what tests measure in simple terms
- Indicate if values are within normal ranges
- Explain potential significance of abnormal values
- Emphasize that results must be interpreted by healthcare providers
- Consider individual patient factors
- Recommend follow-up with healthcare team`,

  PREVENTIVE_CARE: `You are a preventive healthcare assistant. Provide guidance on health maintenance, screening recommendations, and lifestyle factors.

Areas of focus:
- Age-appropriate screening recommendations
- Lifestyle modifications for health
- Vaccination schedules
- Risk factor assessment
- Health maintenance strategies
- Exercise and nutrition guidance
- Stress management techniques`,
};

export interface ChatCompletionOptions {
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
  includeContext?: boolean;
}

export async function generateChatResponse(
  messages: ChatMessage[],
  options: ChatCompletionOptions = {}
): Promise<{
  content: string;
  metadata: {
    confidence_score: number;
    tokens_used: number;
    model: string;
  };
}> {
  const {
    maxTokens = 1000,
    temperature = 0.7,
    systemPrompt = SYSTEM_PROMPTS.HEALTH_ASSISTANT,
    includeContext = true,
  } = options;

  try {
    // Convert messages to Anthropic format
    const anthropicMessages: Anthropic.Messages.MessageParam[] = [];

    // Add conversation history
    messages.forEach((msg) => {
      anthropicMessages.push({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content,
      });
    });

    const completion = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      system: systemPrompt,
      messages: anthropicMessages,
      max_tokens: maxTokens,
      temperature,
    });

    // Extract text content from the response
    const textContent = completion.content.find(block => block.type === 'text');
    const response = (textContent as any)?.text || '';
    const tokensUsed = completion.usage.input_tokens + completion.usage.output_tokens;

    // Calculate confidence score based on response characteristics
    const confidenceScore = calculateConfidenceScore(response, tokensUsed);

    return {
      content: response,
      metadata: {
        confidence_score: confidenceScore,
        tokens_used: tokensUsed,
        model: 'claude-3-5-haiku-20241022',
      },
    };
  } catch (error) {
    console.error('Anthropic API error:', error);
    throw new Error('Failed to generate AI response');
  }
}

export async function analyzeSymptoms(
  symptoms: string,
  patientContext?: {
    age?: number;
    gender?: string;
    medications?: string[];
    conditions?: string[];
  }
): Promise<AIAnalysis> {
  const contextInfo = patientContext
    ? `Patient context: Age ${patientContext.age}, Gender ${patientContext.gender}, 
       Current medications: ${patientContext.medications?.join(', ') || 'None'}, 
       Known conditions: ${patientContext.conditions?.join(', ') || 'None'}`
    : '';

  const prompt = `Please analyze these symptoms: ${symptoms}

${contextInfo}

Provide a structured analysis including:
1. Possible common causes (educational only)
2. Recommended care level
3. Red flag symptoms to watch for
4. General advice
5. When to seek immediate care

Remember: This is educational information only, not a medical diagnosis.`;

  try {
    const completion = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      system: SYSTEM_PROMPTS.SYMPTOM_CHECKER,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 800,
      temperature: 0.3,
    });

    const textContent = completion.content.find(block => block.type === 'text');
    const response = (textContent as any)?.text || '';
    
    return {
      type: 'symptom_analysis',
      confidence: calculateConfidenceScore(response, completion.usage.input_tokens + completion.usage.output_tokens),
      insights: extractInsights(response),
      recommendations: extractRecommendations(response),
      risk_factors: extractRiskFactors(response),
      follow_up_needed: checkFollowUpNeeded(response),
      urgency_level: determineUrgencyLevel(response),
      generated_at: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Symptom analysis error:', error);
    throw new Error('Failed to analyze symptoms');
  }
}

export async function interpretLabResults(
  labData: string,
  patientAge?: number
): Promise<AIAnalysis> {
  const prompt = `Please interpret these lab results: ${labData}
${patientAge ? `Patient age: ${patientAge}` : ''}

Provide:
1. Simple explanation of what each test measures
2. Normal vs abnormal values
3. Potential significance
4. Recommendations for follow-up
5. Important disclaimers`;

  try {
    const completion = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      system: SYSTEM_PROMPTS.LAB_INTERPRETER,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 600,
      temperature: 0.2,
    });

    const textContent = completion.content.find(block => block.type === 'text');
    const response = (textContent as any)?.text || '';
    
    return {
      type: 'risk_assessment',
      confidence: calculateConfidenceScore(response, completion.usage.input_tokens + completion.usage.output_tokens),
      insights: extractInsights(response),
      recommendations: extractRecommendations(response),
      follow_up_needed: true,
      urgency_level: 'medium',
      generated_at: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Lab interpretation error:', error);
    throw new Error('Failed to interpret lab results');
  }
}

// Helper functions
function calculateConfidenceScore(response: string, tokensUsed: number): number {
  // Simple confidence calculation based on response quality indicators
  let score = 0.5; // Base score

  // Increase confidence for comprehensive responses
  if (response.length > 200) score += 0.2;
  if (response.includes('recommend') || response.includes('suggest')) score += 0.1;
  if (response.includes('consult') || response.includes('healthcare provider')) score += 0.1;
  
  // Decrease confidence for very short or uncertain responses
  if (response.length < 100) score -= 0.2;
  if (response.includes('I don\'t know') || response.includes('uncertain')) score -= 0.1;

  return Math.min(Math.max(score, 0), 1);
}

function extractInsights(response: string): string[] {
  // Extract key insights from the response
  const insights: string[] = [];
  const lines = response.split('\n').filter(line => line.trim());
  
  lines.forEach(line => {
    if (line.includes('possible') || line.includes('may') || line.includes('could')) {
      insights.push(line.trim());
    }
  });

  return insights.length > 0 ? insights : ['General health information provided'];
}

function extractRecommendations(response: string): string[] {
  const recommendations: string[] = [];
  const lines = response.split('\n').filter(line => line.trim());
  
  lines.forEach(line => {
    if (line.includes('recommend') || line.includes('suggest') || line.includes('should')) {
      recommendations.push(line.trim());
    }
  });

  return recommendations.length > 0 ? recommendations : ['Consult with healthcare provider'];
}

function extractRiskFactors(response: string): string[] {
  const riskFactors: string[] = [];
  const lines = response.split('\n').filter(line => line.trim());
  
  lines.forEach(line => {
    if (line.includes('risk') || line.includes('warning') || line.includes('concern')) {
      riskFactors.push(line.trim());
    }
  });

  return riskFactors;
}

function checkFollowUpNeeded(response: string): boolean {
  return response.toLowerCase().includes('follow') || 
         response.toLowerCase().includes('consult') ||
         response.toLowerCase().includes('see') ||
         response.toLowerCase().includes('contact');
}

function determineUrgencyLevel(response: string): 'low' | 'medium' | 'high' | 'urgent' {
  const text = response.toLowerCase();
  
  if (text.includes('emergency') || text.includes('urgent') || text.includes('immediately')) {
    return 'urgent';
  }
  if (text.includes('soon') || text.includes('promptly') || text.includes('important')) {
    return 'high';
  }
  if (text.includes('recommend') || text.includes('should')) {
    return 'medium';
  }
  
  return 'low';
} 