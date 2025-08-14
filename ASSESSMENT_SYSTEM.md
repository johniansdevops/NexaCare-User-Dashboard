# NexaCare Health Assessment System

A comprehensive AI-powered health assessment platform that provides personalized health insights and recommendations using Claude Haiku 3.5.

## 🚀 Features

### 10 Health Assessment Categories

1. **Symptom Checker** 🩺
   - Analyzes current symptoms
   - Provides likely conditions (ranked by probability)
   - Determines urgency level (low, moderate, high)
   - Self-care tips and medical attention guidance

2. **Mental Health Check** 🧠
   - Mental health scoring (0-100)
   - Risk indicators (stress, anxiety, depression)
   - Mood trend analysis
   - Coping strategies and professional support suggestions

3. **Medication Suggestions** 💊
   - OTC medication recommendations
   - Lifestyle adjustments
   - Drug interaction warnings
   - Professional consultation guidance

4. **Diet Plan** 🥗
   - Personalized nutrition planning
   - Calorie targets and macronutrient breakdown
   - Meal suggestions and food limitations
   - Hydration advice

5. **Weight Management Plan** ⚖️
   - Target weight and timeline planning
   - Daily calorie targets
   - Exercise recommendations
   - Progress milestones and motivation

6. **Cardiovascular Health** ❤️
   - Cardiovascular risk scoring
   - Blood pressure and heart rate recommendations
   - Exercise intensity guidelines
   - Heart-healthy lifestyle tips

7. **Sleep Health Analysis** 😴
   - Sleep quality scoring
   - Sleep debt estimation
   - Pattern analysis and routine suggestions
   - Environmental improvement tips

8. **Diabetes Risk Assessment** 🩸
   - Risk percentage calculation
   - Key risk factor identification
   - Prevention strategies
   - Testing recommendations

9. **Fitness Readiness** 🏃‍♂️
   - Fitness readiness scoring
   - Current fitness level categorization
   - Training plan recommendations
   - Injury prevention advice

10. **Stress Management** 🧘‍♀️
    - Stress level assessment
    - Trigger identification
    - Short-term calming techniques
    - Long-term resilience strategies

## 🏗️ System Architecture

### Frontend Components
- **Assessment List Page** (`/patient/assessments`) - Browse and select assessments
- **Assessment Form Page** (`/patient/assessments/[id]`) - Complete assessment questions
- **Results Page** (`/patient/assessments/[id]/results`) - View AI analysis and download PDF

### Backend API
- **Analysis Endpoint** (`/api/assessments/analyze`) - Process assessment with Claude AI
- **PDF Generation** (`/api/assessments/generate-pdf`) - Generate downloadable reports

### Data Structure
```
/public/assessments/
├── assessment_list.json          # List of all 10 assessments
├── default_questions.json        # Common user information questions
└── prompts/
    ├── questions/
    │   ├── symptom_checker.json   # Assessment-specific questions
    │   ├── mental_health.json
    │   ├── cardio_health.json
    │   └── ... (all 10 assessments)
    └── generate_results_prompt.txt # AI prompt template
```

## 🔄 User Journey

### 1. Assessment Selection
- User browses available assessments
- Filters by category (diagnostic, mental health, fitness, etc.)
- Selects assessment based on health needs

### 2. Question Flow
- **Default Questions** (5 questions): Personal information
  - Full Name, Age, Gender, Phone, Email, Location
- **Assessment-Specific Questions** (25 questions): Tailored to assessment type
  - Multiple choice, checkboxes, scales, text input
- **Progress Tracking**: Real-time completion percentage
- **Auto-save**: Prevents data loss if user navigates away

### 3. AI Analysis
- Structured data sent to Claude Haiku 3.5
- Assessment-specific prompts for optimal results
- Comprehensive analysis with:
  - Health scoring (0-100)
  - Key findings and risk factors
  - Personalized recommendations (immediate, short-term, long-term)
  - Medical attention guidance

### 4. Results & Export
- Formatted results display with patient information
- Downloadable PDF report
- Shareable results link
- Medical disclaimer and privacy notices

## 🤖 AI Integration

### Claude Haiku 3.5 Features
- **Model**: `claude-3-5-haiku-20241022`
- **Max Tokens**: 2000 for comprehensive analysis
- **Temperature**: 0.3 for consistent medical accuracy
- **Specialized Prompts**: Each assessment type has specific analysis focus

### Assessment-Specific AI Behavior
```javascript
// Example: Symptom Checker Focus
- Analyze symptoms for potential conditions (ranked by probability)
- Determine urgency level (low, moderate, high)
- Identify possible causes
- Provide self-care tips
- Clear guidance on when to seek medical attention

// Example: Mental Health Focus
- Calculate mental health score (0-100 scale)
- Identify risk indicators (stress, anxiety, depression levels)
- Analyze mood patterns based on responses
- Provide coping strategies
- Include professional support suggestions
```

## 📋 Question Types Supported

1. **Text Input** - Names, descriptions
2. **Number Input** - Age, weights, measurements
3. **Email** - Contact information
4. **Multiple Choice** - Single selection from options
5. **Checkbox** - Multiple selections allowed
6. **Scale/Slider** - Rating scales (0-10, pain levels, etc.)

### Question Configuration
```json
{
  "id": 7,
  "question": "Rate your current pain level (if any)",
  "type": "scale",
  "min": 0,
  "max": 10,
  "weight": 4,
  "category": "pain",
  "required": true
}
```

## 🎨 UI/UX Features

### Assessment Form
- **Progress Indicator** - Shows completion percentage
- **Question Navigation** - Jump to specific questions
- **Input Validation** - Ensures all required fields completed
- **Responsive Design** - Works on desktop, tablet, mobile
- **Auto-save** - Prevents data loss

### Results Display
- **Patient Information Card** - Clean, organized personal data
- **AI Analysis** - Formatted with headings, lists, emphasis
- **Interactive Elements** - Download, share, retake options
- **Professional Styling** - Medical report appearance

### PDF Generation
- **Professional Layout** - Header, patient info, analysis, disclaimer
- **Styled Content** - Proper typography and spacing
- **Medical Branding** - NexaCare letterhead and footer
- **Print-Ready** - A4 format with proper margins

## 🔧 Technical Implementation

### Dependencies
```json
{
  "core": [
    "@anthropic-ai/sdk": "^0.17.2",
    "next": "^14.0.0",
    "react": "^18.2.0"
  ],
  "ui": [
    "@radix-ui/react-*": "Various versions",
    "tailwindcss": "^3.3.0",
    "lucide-react": "^0.292.0"
  ],
  "pdf": [
    "puppeteer": "^21.5.2"
  ]
}
```

### Key Files
- `app/patient/assessments/page.tsx` - Assessment list
- `app/patient/assessments/[id]/page.tsx` - Assessment form
- `app/patient/assessments/[id]/results/page.tsx` - Results display
- `app/api/assessments/analyze/route.ts` - AI analysis API
- `app/api/assessments/generate-pdf/route.ts` - PDF generation API

### Environment Variables Required
```bash
ANTHROPIC_API_KEY=your_claude_api_key_here
```

## 🚦 Getting Started

### 1. Install Dependencies
```bash
npm install
# or
yarn install
```

### 2. Set Environment Variables
```bash
# Create .env.local
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### 3. Run Development Server
```bash
npm run dev
# or
yarn dev
```

### 4. Navigate to Assessments
Open [http://localhost:3000/patient/assessments](http://localhost:3000/patient/assessments)

## 📊 Data Flow

```
User Selects Assessment
         ↓
Loads Questions (Default + Specific)
         ↓
User Completes Form
         ↓
Submits to /api/assessments/analyze
         ↓
Claude AI Processes Data
         ↓
Structured Analysis Returned
         ↓
Results Displayed
         ↓
PDF Generation Available
```

## 🔒 Privacy & Security

### Data Handling
- **Local Storage**: Temporary results storage only
- **No Persistent Storage**: Assessment data not stored in database
- **API Security**: Environment variables for sensitive keys
- **Medical Disclaimer**: Clear limitations and professional consultation guidance

### Compliance
- Medical disclaimer on all reports
- Privacy notices included
- Professional consultation emphasized
- Data handling transparency

## 🎯 Customization Guide

### Adding New Assessment Types

1. **Create Question File**
   ```json
   // public/assessments/prompts/questions/new_assessment.json
   {
     "assessment_id": "new_assessment",
     "name": "New Assessment",
     "questions": [...]
   }
   ```

2. **Update Assessment List**
   ```json
   // public/assessments/assessment_list.json
   {
     "id": "new_assessment",
     "name": "New Assessment",
     "description": "Description here",
     "icon": "🔬",
     "category": "diagnostic",
     "estimated_time": "5-7 minutes",
     "questions_file": "new_assessment.json"
   }
   ```

3. **Add AI Prompt Logic**
   ```javascript
   // app/api/assessments/analyze/route.ts
   case 'new_assessment':
     systemPrompt += `
   **SPECIFIC FOCUS FOR NEW ASSESSMENT:**
   - Custom analysis requirements
   - Specific scoring criteria
   - Targeted recommendations
   `
   ```

### Customizing Question Types
Extend the `renderQuestion` function in `app/patient/assessments/[id]/page.tsx` to support new input types.

### Styling Customizations
- Update Tailwind config for new colors/themes
- Modify component styles in `components/ui/`
- Customize PDF styling in `generatePdfHtml` function

## 🐛 Troubleshooting

### Common Issues

1. **Assessment Not Loading**
   - Check file exists in `/public/assessments/prompts/questions/`
   - Verify JSON syntax is valid
   - Ensure assessment_list.json references correct file

2. **AI Analysis Failing**
   - Verify ANTHROPIC_API_KEY is set
   - Check API quota and usage limits
   - Review request payload structure

3. **PDF Generation Issues**
   - Ensure Puppeteer is installed correctly
   - Check system permissions for browser launch
   - Verify HTML content is valid

4. **UI Components Not Displaying**
   - Check CSS variables are defined in globals.css
   - Verify component imports are correct
   - Ensure Tailwind classes are compiled

### Debug Mode
Set `NODE_ENV=development` to see detailed error messages in API responses.

## 📚 Additional Resources

- [Anthropic Claude API Documentation](https://docs.anthropic.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Components](https://www.radix-ui.com/)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Add assessment type or enhance existing functionality
4. Update documentation
5. Submit pull request

## 📄 License

This project is part of the NexaCare Health Platform. All rights reserved.
