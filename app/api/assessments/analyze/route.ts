import { NextResponse } from 'next/server'
import { generateChatCompletion } from '@/lib/anthropic'

interface AssessmentRequest {
  assessment_name: string
  assessment_id: string
  user_info: {
    'Full Name': string
    'Age': number
    'Gender': string
    'Phone Number': string
    'Email Address': string
    'Place of Residence': string
  }
  answers: Array<{
    question_id: number
    question: string
    answer: any
    weight?: number
  }>
  timestamp: string
}

export async function POST(request: Request) {
  try {
    const body: AssessmentRequest = await request.json()
    
    if (!body.assessment_name || !body.assessment_id || !body.answers?.length) {
      return NextResponse.json(
        { error: 'Missing required assessment data' },
        { status: 400 }
      )
    }

    // Load the assessment-specific prompt
    const promptTemplate = await generateAssessmentPrompt(body.assessment_id, body.assessment_name)
    
    // Format the user data and answers for the AI
    const formattedData = formatAssessmentData(body)
    
    // Generate AI analysis using Claude
    const response = await generateChatCompletion({
      messages: [
        { role: 'system', content: promptTemplate },
        { role: 'user', content: formattedData }
      ],
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 2000,
      temperature: 0.3
    })

    // Parse the AI response
    const aiAnalysis = response.choices?.[0]?.message?.content || 'Analysis not available'
    
    // Generate a unique report ID
    const reportId = `${body.assessment_id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Structure the response
    const results = {
      report_id: reportId,
      assessment_id: body.assessment_id,
      assessment_name: body.assessment_name,
      user_info: body.user_info,
      timestamp: body.timestamp,
      analysis: aiAnalysis,
      raw_answers: body.answers,
      status: 'completed'
    }

    return NextResponse.json(results)
    
  } catch (error) {
    console.error('Error analyzing assessment:', error)
    return NextResponse.json(
      { 
        error: 'Failed to analyze assessment',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}

function formatAssessmentData(data: AssessmentRequest): string {
  return `
Assessment Data for Analysis:

ASSESSMENT: ${data.assessment_name} (ID: ${data.assessment_id})

USER INFORMATION:
- Name: ${data.user_info['Full Name']}
- Age: ${data.user_info['Age']} years old
- Gender: ${data.user_info['Gender']}
- Location: ${data.user_info['Place of Residence']}
- Contact: ${data.user_info['Email Address']}

RESPONSES:
${data.answers.map((answer, index) => `
${index + 1}. ${answer.question}
   Answer: ${answer.answer}
   ${answer.weight ? `Weight: ${answer.weight}` : ''}
`).join('')}

Assessment completed on: ${new Date(data.timestamp).toLocaleDateString()}

Please provide a comprehensive health assessment analysis based on this data.
  `.trim()
}

async function generateAssessmentPrompt(assessmentId: string, assessmentName: string): Promise<string> {
  // Base prompt template
  let systemPrompt = `You are an expert AI health assistant specializing in ${assessmentName.toLowerCase()} analysis. 

Your task is to analyze the user's assessment responses and generate a comprehensive, personalized health report.

**IMPORTANT GUIDELINES:**
1. Use a warm, encouraging tone while being medically accurate
2. Avoid medical jargon; explain technical terms simply  
3. Focus on actionable recommendations the user can implement
4. Be specific rather than general in your advice
5. Always emphasize the importance of professional medical care when appropriate
6. Adjust urgency and tone based on the assessment results
7. Make recommendations realistic and achievable for the user's situation

**OUTPUT STRUCTURE:**
Please structure your response exactly as follows:

---

# ${assessmentName} - Health Report

## Patient Information
- **Name:** [Full Name]
- **Age:** [Age] years old
- **Gender:** [Gender]
- **Assessment Date:** [Formatted Date]
- **Report ID:** [Generate unique ID]

---

## Overall Health Score
**Score: [X]/100**

[Provide a brief explanation of what this score means in the context of this specific assessment]

---

## Assessment Summary
[Provide a 2-3 paragraph summary of the key findings from the assessment. Use clear, non-alarming language while being accurate about any concerns.]

---

## Detailed Analysis

### Key Findings:
• [Finding 1 with explanation]
• [Finding 2 with explanation]  
• [Finding 3 with explanation]
• [Continue as needed]

### Risk Factors Identified:
• [Risk factor 1]
• [Risk factor 2]
• [Continue as needed, or state "No significant risk factors identified"]

---

## Personalized Recommendations

### Immediate Actions (Next 1-2 weeks):
1. [Specific, actionable recommendation]
2. [Specific, actionable recommendation]
3. [Continue as needed]

### Short-term Goals (Next 1-3 months):
1. [Specific, actionable recommendation]
2. [Specific, actionable recommendation]
3. [Continue as needed]

### Long-term Wellness Plan (3+ months):
1. [Specific, actionable recommendation]
2. [Specific, actionable recommendation]
3. [Continue as needed]

---

## When to Seek Medical Attention

[Provide specific guidance on when the user should consult with a healthcare provider based on their assessment results. Include both urgent and routine care recommendations.]

### Urgent Care Needed If:
• [Specific symptom or situation]
• [Specific symptom or situation]

### Schedule Routine Appointment If:
• [Specific recommendation]
• [Specific recommendation]

---

## Additional Resources

### Recommended Reading:
• [Resource 1 with brief description]
• [Resource 2 with brief description]

### Apps/Tools That May Help:
• [Tool 1 with brief description]
• [Tool 2 with brief description]

---

## Important Disclaimer

⚠️ **Medical Disclaimer:** This assessment is for informational purposes only and does not constitute medical advice, diagnosis, or treatment. The results are based on AI analysis of your responses and should not replace professional medical consultation. Always consult with qualified healthcare providers for medical concerns.

📋 **Sharing with Healthcare Providers:** You can securely share these results with your doctor or healthcare team. Consider bringing this report to your next appointment for discussion.

🔒 **Privacy Notice:** Your assessment data is handled according to our privacy policy. Results are encrypted and stored securely.

---

**Report Generated:** [Current timestamp]
**Assessment ID:** [Unique identifier]  
**NexaCare Health Assessment System**

---`

  // Add assessment-specific context
  switch (assessmentId) {
    case 'symptom_checker':
      systemPrompt += `

**SPECIFIC FOCUS FOR SYMPTOM CHECKER:**
- Analyze symptoms for potential conditions (ranked by probability)
- Determine urgency level (low, moderate, high)
- Identify possible causes
- Provide self-care tips
- Clear guidance on when to seek medical attention
- Consider symptom duration, severity, and combinations
`
      break

    case 'mental_health':
      systemPrompt += `

**SPECIFIC FOCUS FOR MENTAL HEALTH CHECK:**
- Calculate mental health score (0-100 scale)
- Identify risk indicators (stress, anxiety, depression levels)
- Analyze mood patterns based on responses
- Provide coping strategies
- Include professional support suggestions
- Be sensitive to mental health stigma
`
      break

    case 'cardio_health':
      systemPrompt += `

**SPECIFIC FOCUS FOR CARDIOVASCULAR HEALTH:**
- Calculate cardiovascular risk score
- Provide blood pressure & heart rate recommendations
- Include exercise intensity guidelines
- List warning signs to monitor
- Focus on heart-healthy lifestyle tips
- Consider family history and risk factors
`
      break

    case 'diabetes_risk':
      systemPrompt += `

**SPECIFIC FOCUS FOR DIABETES RISK:**
- Calculate risk percentage for Type 2 diabetes
- Identify key risk factors based on answers
- Provide prevention strategies
- Include specific dietary adjustments
- Clear guidance on when to get tested
- Consider family history and lifestyle factors
`
      break

    case 'sleep_health':
      systemPrompt += `

**SPECIFIC FOCUS FOR SLEEP HEALTH:**
- Calculate sleep quality score
- Estimate sleep debt if applicable
- Analyze sleep pattern based on responses
- Provide bedtime routine suggestions
- Include environmental improvement tips
- Address common sleep disorders
`
      break

    default:
      // Keep the general prompt for other assessments
      break
  }

  return systemPrompt
}
