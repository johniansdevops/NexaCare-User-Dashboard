import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatCompletionOptions {
  messages: ChatMessage[];
  model?: string;
  max_tokens?: number;
  temperature?: number;
  stream?: boolean;
}

/**
 * Generate AI response using Claude Haiku 3.5
 */
export async function generateChatCompletion({
  messages,
  model = 'claude-3-5-haiku-20241022',
  max_tokens = 1000,
  temperature = 0.7,
  stream = false,
}: ChatCompletionOptions) {
  try {
    // Convert messages to Anthropic format
    const systemMessage = messages.find(m => m.role === 'system');
    const userMessages = messages.filter(m => m.role !== 'system');

    const response = await anthropic.messages.create({
      model,
      max_tokens,
      temperature,
      system: systemMessage?.content || 'You are a helpful medical AI assistant. Provide accurate, helpful information while always recommending consulting healthcare professionals for medical decisions.',
      messages: userMessages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      stream,
    });

    if (stream) {
      return response;
    }

    // Extract text content from the response
    const textContent = response.content.find(block => block.type === 'text');
    return {
      choices: [{
        message: {
          role: 'assistant',
          content: textContent?.text || 'I apologize, but I cannot provide a response at this time.',
        },
      }],
      usage: response.usage,
    };
  } catch (error) {
    console.error('Anthropic API error:', error);
    throw new Error('Failed to generate AI response');
  }
}

/**
 * Generate health assessment using Claude
 */
export async function generateHealthAssessment(symptoms: string[], medicalHistory?: string) {
  const systemPrompt = `You are a medical AI assistant that helps with health assessments. 
  Analyze the provided symptoms and medical history to offer insights and recommendations.
  Always include disclaimers about consulting healthcare professionals.
  Provide structured responses with:
  1. Symptom analysis
  2. Possible conditions (with likelihood)
  3. Recommendations
  4. When to seek immediate care`;

  const userMessage = `
    Symptoms: ${symptoms.join(', ')}
    ${medicalHistory ? `Medical History: ${medicalHistory}` : ''}
    
    Please provide a health assessment based on this information.
  `;

  return generateChatCompletion({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
    max_tokens: 1500,
    temperature: 0.3, // Lower temperature for medical assessments
  });
}

/**
 * Generate medication information
 */
export async function generateMedicationInfo(medicationName: string, patientInfo?: any) {
  const systemPrompt = `You are a pharmaceutical AI assistant. Provide comprehensive information about medications including:
  1. Purpose and how it works
  2. Common dosages
  3. Side effects and warnings
  4. Drug interactions
  5. Important safety information
  Always emphasize consulting healthcare providers for personalized advice.`;

  const userMessage = `
    Medication: ${medicationName}
    ${patientInfo ? `Patient context: ${JSON.stringify(patientInfo)}` : ''}
    
    Please provide comprehensive medication information.
  `;

  return generateChatCompletion({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
    max_tokens: 1200,
    temperature: 0.2,
  });
}

/**
 * Generate personalized health recommendations
 */
export async function generateHealthRecommendations(
  healthData: {
    age?: number;
    gender?: string;
    conditions?: string[];
    medications?: string[];
    vitals?: any;
  }
) {
  const systemPrompt = `You are a preventive health AI assistant. Generate personalized health recommendations based on patient data.
  Focus on lifestyle improvements, preventive care, and wellness strategies.
  Always recommend consulting healthcare providers for medical decisions.`;

  const userMessage = `
    Patient Profile:
    ${healthData.age ? `Age: ${healthData.age}` : ''}
    ${healthData.gender ? `Gender: ${healthData.gender}` : ''}
    ${healthData.conditions?.length ? `Conditions: ${healthData.conditions.join(', ')}` : ''}
    ${healthData.medications?.length ? `Medications: ${healthData.medications.join(', ')}` : ''}
    ${healthData.vitals ? `Recent Vitals: ${JSON.stringify(healthData.vitals)}` : ''}
    
    Please provide personalized health recommendations.
  `;

  return generateChatCompletion({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
    max_tokens: 1500,
    temperature: 0.4,
  });
}

export default anthropic; 