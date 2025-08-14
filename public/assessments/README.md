# NexaCare Health Assessment System

## Overview
A comprehensive health assessment system with 10 different health evaluations, each containing 25 specialized questions plus 6 standard demographic questions (31 total per assessment).

## 📁 File Structure
```
/assessments
│
├── README.md                      # This documentation file
├── default_questions.json         # Standard questions for all assessments
├── assessment_list.json           # Master list of all 10 assessments
├── prompts/
│   ├── generate_results_prompt.txt    # Claude Haiku 3.5 prompt template
│   └── questions/
│       ├── symptom_checker.json       # Diagnostic symptom analysis
│       ├── mental_health.json         # Mental health screening
│       ├── medication_suggestions.json # AI medication guidance
│       ├── diet_plan.json             # Personalized nutrition planning
│       ├── weight_plan.json           # Weight management strategies
│       ├── cardio_health.json         # Cardiovascular assessment
│       ├── sleep_health.json          # Sleep quality analysis
│       ├── diabetes_risk.json         # Type 2 diabetes risk prediction
│       ├── fitness_readiness.json     # Exercise program readiness
│       └── stress_management.json     # Stress identification and coping
└── results/                       # Generated PDF reports stored here
    ├── user123_symptom_checker.pdf
    ├── user123_mental_health.pdf
    └── ...
```

## 🏥 Assessment Categories

### 1. **Symptom Checker** 🩺
- **Purpose**: Diagnostic symptom analysis to identify possible conditions
- **Time**: 5-7 minutes
- **Key Areas**: Constitutional symptoms, pain assessment, system reviews
- **Output**: Symptom severity scoring, possible conditions, urgency recommendations

### 2. **Mental Health Check** 🧠
- **Purpose**: Screening for anxiety, depression, and mood disorders
- **Time**: 8-10 minutes  
- **Key Areas**: PHQ-9/GAD-7 style questions, coping mechanisms, support systems
- **Output**: Mental health risk assessment, therapy recommendations, crisis resources

### 3. **Medication Suggestions** 💊
- **Purpose**: AI-guided OTC recommendations and prescription consultation guidance
- **Time**: 6-8 minutes
- **Key Areas**: Drug interactions, allergies, effectiveness, safety considerations
- **Output**: Safe medication options, dosage guidance, doctor consultation triggers

### 4. **Personalized Diet Plan** 🥗
- **Purpose**: Custom nutrition planning based on goals and restrictions
- **Time**: 10-12 minutes
- **Key Areas**: Dietary preferences, restrictions, cooking skills, lifestyle
- **Output**: Meal plans, recipes, shopping lists, nutritional education

### 5. **Weight Management Plan** ⚖️
- **Purpose**: Personalized weight loss, gain, or maintenance strategies
- **Time**: 8-10 minutes
- **Key Areas**: Goals, barriers, exercise preferences, psychological factors
- **Output**: Caloric targets, exercise plans, behavioral strategies, tracking tools

### 6. **Cardiovascular Health** ❤️
- **Purpose**: Heart health evaluation and risk factor assessment
- **Time**: 7-9 minutes
- **Key Areas**: Risk factors, symptoms, family history, lifestyle factors
- **Output**: CV risk score, prevention strategies, screening recommendations

### 7. **Sleep Health Analysis** 😴
- **Purpose**: Sleep quality evaluation and disorder screening
- **Time**: 6-8 minutes
- **Key Areas**: Sleep patterns, quality, disorders, environment, hygiene
- **Output**: Sleep quality score, improvement strategies, medical referrals

### 8. **Diabetes Risk Assessment** 🩸
- **Purpose**: Type 2 diabetes risk prediction and prevention
- **Time**: 5-7 minutes
- **Key Areas**: Risk factors, symptoms, lifestyle, family history
- **Output**: Risk score, prevention strategies, screening timeline

### 9. **Fitness Readiness Evaluation** 🏃‍♂️
- **Purpose**: Baseline fitness assessment for exercise program design
- **Time**: 8-10 minutes
- **Key Areas**: Current fitness, goals, limitations, preferences
- **Output**: Fitness level, personalized workout plans, progression schedules

### 10. **Stress Management Assessment** 🧘‍♀️
- **Purpose**: Stress level identification and coping strategy development
- **Time**: 7-9 minutes
- **Key Areas**: Stress sources, symptoms, coping mechanisms, support systems
- **Output**: Stress profile, coping strategies, relaxation techniques, resources

## 📊 Question Structure

### Default Questions (All Assessments)
1. **Full Name** - Text input
2. **Age** - Numeric input (0-120)
3. **Gender** - Multiple choice (Male/Female/Other/Prefer not to say)
4. **Phone Number** - Text input with validation
5. **Email Address** - Email input with validation
6. **Place of Residence** - Text input (City, State/Province, Country)

### Assessment-Specific Questions
- **25 questions per assessment** (IDs 7-31)
- **Question Types**: Multiple choice, checkboxes, scales (1-10), text input
- **Weighted Scoring**: Each question has importance weight (1-5)
- **Categorized**: Questions grouped by health domains

## 🤖 AI Integration

### Claude Haiku 3.5 Prompt Template
The system uses a comprehensive prompt template that:

#### Input Processing:
- Takes user demographic info + assessment responses
- Processes weighted scoring system
- Analyzes response patterns and health indicators

#### Output Generation:
- **Health Score** (0-100 scale) with interpretation
- **Risk Assessment** with severity levels
- **Personalized Recommendations** (immediate, short-term, long-term)
- **Medical Guidance** (when to see doctors, urgency levels)
- **Resource Suggestions** (apps, tools, reading materials)
- **Professional Disclaimers** and privacy notices

#### PDF Report Structure:
```
1. Patient Information & Assessment Details
2. Overall Health Score & Interpretation
3. Assessment Summary (2-3 paragraphs)
4. Detailed Analysis (Key Findings & Risk Factors)
5. Personalized Recommendations (Tiered by timeline)
6. When to Seek Medical Attention (Urgent vs. Routine)
7. Additional Resources & Tools
8. Medical Disclaimers & Privacy Notices
```

## 🔧 Implementation Guide

### Frontend Integration
```typescript
// Load assessment list
const assessments = await fetch('/assessments/assessment_list.json').then(r => r.json());

// Load specific assessment questions
const questions = await fetch(`/assessments/prompts/questions/${assessmentId}.json`).then(r => r.json());

// Combine with default questions
const defaultQuestions = await fetch('/assessments/default_questions.json').then(r => r.json());
const allQuestions = [...defaultQuestions, ...questions.questions];
```

### Backend Processing
```python
# Process assessment results
def process_assessment(assessment_id, user_answers):
    # Load prompt template
    with open('assessments/prompts/generate_results_prompt.txt') as f:
        prompt_template = f.read()
    
    # Prepare data for Claude
    assessment_data = {
        "assessment_name": assessment_name,
        "assessment_id": assessment_id,
        "user_info": user_demographic_data,
        "answers": formatted_answers,
        "timestamp": datetime.now().isoformat()
    }
    
    # Send to Claude Haiku 3.5
    response = claude_client.messages.create(
        model="claude-3-haiku-20240307",
        messages=[{"role": "user", "content": prompt_template + json.dumps(assessment_data)}]
    )
    
    # Generate PDF
    pdf_content = generate_pdf_from_markdown(response.content)
    
    return pdf_content
```

## 📈 Scoring System

### Weighted Question Approach
- **Weight 5**: Critical health indicators, red flags, primary symptoms
- **Weight 4**: Important risk factors, significant symptoms  
- **Weight 3**: Moderate importance, contributing factors
- **Weight 2**: Supporting information, preferences
- **Weight 1**: Demographic/background info

### Health Score Calculation
- **80-100**: Excellent health in assessed domain
- **60-79**: Good health with minor concerns
- **40-59**: Moderate concerns, recommendations needed
- **20-39**: Significant concerns, medical consultation suggested
- **0-19**: High concern, urgent medical attention may be needed

## 🔒 Privacy & Security

### Data Protection
- All assessment data encrypted in transit and at rest
- No personal health information stored permanently
- PDF reports generated locally, stored securely
- User consent required for data processing

### Medical Disclaimers
- All assessments include prominent medical disclaimers
- AI recommendations supplement, not replace, medical advice
- Emergency situations clearly flagged for immediate care
- Users encouraged to share results with healthcare providers

## 🚀 Deployment Considerations

### Performance
- Question JSON files are lightweight (~10-50KB each)
- Prompt template optimized for Claude Haiku efficiency
- PDF generation handled asynchronously
- Results cached appropriately

### Scalability
- Stateless assessment processing
- Horizontal scaling friendly
- CDN-deliverable static assets
- Database-optional design (JSON-based)

### Maintenance
- Version-controlled question sets
- A/B testing capability for question refinements
- Analytics integration for improvement insights
- Regular medical review and updates

---

**Built for NexaCare User Dashboard** | **AI-Powered Health Assessments** | **Version 1.0**
