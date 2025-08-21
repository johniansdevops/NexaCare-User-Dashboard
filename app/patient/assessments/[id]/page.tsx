'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Activity,
  User,
  Brain,
  Star,
  Zap
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Question {
  id: number
  question: string
  type: 'text' | 'number' | 'email' | 'multiple_choice' | 'checkbox' | 'scale'
  options?: string[]
  min?: number
  max?: number
  required?: boolean
  placeholder?: string
  weight?: number
  category?: string
}

interface AssessmentData {
  assessment_id: string
  name: string
  description: string
  version: string
  questions: Question[]
}

interface Answer {
  question_id: number
  question: string
  answer: any
  weight?: number
}

export default function AssessmentPage() {
  const params = useParams()
  const router = useRouter()
  const assessmentId = params?.id as string

  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null)
  const [defaultQuestions, setDefaultQuestions] = useState<Question[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<number, any>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Combine default questions + assessment-specific questions
  const allQuestions = [...defaultQuestions, ...(assessmentData?.questions || [])]
  const totalQuestions = allQuestions.length
  const progress = totalQuestions > 0 ? ((currentStep + 1) / totalQuestions) * 100 : 0

  useEffect(() => {
    loadAssessmentData()
  }, [assessmentId])

  const loadAssessmentData = async () => {
    try {
      setLoading(true)
      
      // Load default questions
      const defaultResponse = await fetch('/assessments/default_questions.json')
      const defaultData = await defaultResponse.json()
      setDefaultQuestions(defaultData)

      // Load assessment-specific questions
      const assessmentResponse = await fetch(`/assessments/prompts/questions/${assessmentId}.json`)
      if (!assessmentResponse.ok) {
        throw new Error('Assessment not found')
      }
      const assessmentData = await assessmentResponse.json()
      setAssessmentData(assessmentData)
      
    } catch (error) {
      console.error('Error loading assessment:', error)
      toast.error('Failed to load assessment. Please try again.')
      router.push('/patient/assessments')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = (questionId: number, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const isCurrentQuestionAnswered = () => {
    const currentQuestion = allQuestions[currentStep]
    if (!currentQuestion) return false
    
    const answer = answers[currentQuestion.id]
    if (currentQuestion.required && (answer === undefined || answer === '' || answer === null)) {
      return false
    }
    
    // For checkbox questions, check if at least one option is selected
    if (currentQuestion.type === 'checkbox' && Array.isArray(answer)) {
      return answer.some(Boolean)
    }
    
    return true
  }

  const goToNextStep = () => {
    if (!isCurrentQuestionAnswered()) {
      toast.error('Please answer the current question before proceeding.')
      return
    }
    
    if (currentStep < totalQuestions - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    if (!isCurrentQuestionAnswered()) {
      toast.error('Please answer all required questions.')
      return
    }

    setSubmitting(true)
    
    try {
      // Prepare submission data
      const submissionData = {
        assessment_name: assessmentData?.name,
        assessment_id: assessmentId,
        user_info: {},
        answers: [] as Answer[],
        timestamp: new Date().toISOString()
      }

      // Separate user info and assessment answers
      allQuestions.forEach(question => {
        const answer = answers[question.id]
        if (answer !== undefined && answer !== null && answer !== '') {
          if (question.id <= 6) {
            // Default questions (user info)
            const fieldMap: Record<number, string> = {
              1: 'Full Name',
              2: 'Age',
              3: 'Gender',
              4: 'Phone Number',
              5: 'Email Address',
              6: 'Place of Residence'
            }
            const fieldKey = fieldMap[question.id]
            if (fieldKey) {
              (submissionData.user_info as any)[fieldKey] = answer
            }
          } else {
            // Assessment-specific questions
            submissionData.answers.push({
              question_id: question.id,
              question: question.question,
              answer: Array.isArray(answer) ? answer.join(', ') : answer,
              weight: question.weight || 1
            })
          }
        }
      })

      // Submit to AI analysis endpoint
      const response = await fetch('/api/assessments/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      })

      if (!response.ok) {
        throw new Error('Failed to analyze assessment')
      }

      const results = await response.json()
      
      // Save results to localStorage temporarily and redirect to results page
      localStorage.setItem('assessment_results', JSON.stringify(results))
      router.push(`/patient/assessments/${assessmentId}/results`)
      
    } catch (error) {
      console.error('Error submitting assessment:', error)
      toast.error('Failed to submit assessment. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const renderQuestion = (question: Question) => {
    const answer = answers[question.id]

    switch (question.type) {
      case 'text':
      case 'email':
        return (
          <div className="space-y-4">
            <Label htmlFor={`question-${question.id}`} className="text-lg font-medium text-gray-900">
              {question.question}
            </Label>
            <Input
              id={`question-${question.id}`}
              type={question.type}
              placeholder={question.placeholder}
              value={answer || ''}
              onChange={(e) => handleAnswer(question.id, e.target.value)}
              className="w-full h-12 px-4 bg-gray-50 border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all duration-200"
            />
          </div>
        )

      case 'number':
        return (
          <div className="space-y-4">
            <Label htmlFor={`question-${question.id}`} className="text-lg font-medium text-gray-900">
              {question.question}
            </Label>
            <Input
              id={`question-${question.id}`}
              type="number"
              min={question.min}
              max={question.max}
              placeholder={question.placeholder}
              value={answer || ''}
              onChange={(e) => handleAnswer(question.id, parseInt(e.target.value) || '')}
              className="w-full h-12 px-4 bg-gray-50 border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all duration-200"
            />
          </div>
        )

      case 'multiple_choice':
        return (
          <div className="space-y-6">
            <Label className="text-lg font-medium text-gray-900 block">
              {question.question}
            </Label>
            <RadioGroup
              value={answer || ''}
              onValueChange={(value) => handleAnswer(question.id, value)}
              className="space-y-3"
            >
              {question.options?.map((option, index) => (
                <div 
                  key={index} 
                  className="flex items-center space-x-4 p-4 rounded-xl border border-gray-200 hover:border-purple-200 hover:bg-purple-50 transition-all duration-200"
                >
                  <RadioGroupItem 
                    value={option} 
                    id={`q${question.id}-option-${index}`}
                    className="border-2 border-gray-300 text-purple-600 focus:ring-purple-200"
                  />
                  <Label 
                    htmlFor={`q${question.id}-option-${index}`}
                    className="flex-1 cursor-pointer text-gray-700 leading-relaxed"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )

      case 'checkbox':
        const checkboxAnswers = Array.isArray(answer) ? answer : []
        return (
          <div className="space-y-6">
            <Label className="text-lg font-medium text-gray-900 block">
              {question.question}
            </Label>
            <div className="space-y-3">
              {question.options?.map((option, index) => (
                <div 
                  key={index} 
                  className="flex items-center space-x-4 p-4 rounded-xl border border-gray-200 hover:border-purple-200 hover:bg-purple-50 transition-all duration-200"
                >
                  <Checkbox
                    id={`q${question.id}-option-${index}`}
                    checked={checkboxAnswers.includes(option)}
                    onCheckedChange={(checked) => {
                      let newAnswers = [...checkboxAnswers]
                      if (checked) {
                        if (!newAnswers.includes(option)) {
                          newAnswers.push(option)
                        }
                      } else {
                        newAnswers = newAnswers.filter(a => a !== option)
                      }
                      handleAnswer(question.id, newAnswers)
                    }}
                    className="border-2 border-gray-300 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                  />
                  <Label 
                    htmlFor={`q${question.id}-option-${index}`}
                    className="flex-1 cursor-pointer text-gray-700 leading-relaxed"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )

      case 'scale':
        const scaleValue = answer !== undefined ? [answer] : [question.min || 0]
        return (
          <div className="space-y-6">
            <Label className="text-lg font-medium text-gray-900 block">
              {question.question}
            </Label>
            <div className="space-y-6 p-6 bg-gray-50 rounded-xl">
              <Slider
                value={scaleValue}
                onValueChange={(value) => handleAnswer(question.id, value[0])}
                max={question.max || 10}
                min={question.min || 0}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">{question.min || 0}</span>
                <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
                  <span className="text-lg font-bold text-purple-600">{scaleValue[0]}</span>
                </div>
                <span className="text-gray-500 font-medium">{question.max || 10}</span>
              </div>
            </div>
          </div>
        )

      default:
        return <div className="text-red-500">Unsupported question type</div>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-light p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="h-64 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!assessmentData || !allQuestions.length) {
    return (
      <div className="min-h-screen bg-gradient-light p-6">
        <div className="max-w-4xl mx-auto">
          <div className="card-white text-center p-12">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Assessment Not Found</h1>
            <p className="text-gray-600 mb-8 leading-relaxed">The requested assessment could not be loaded. Please try again or contact support.</p>
            <Button 
              onClick={() => router.push('/patient/assessments')}
              className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Assessments
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const currentQuestion = allQuestions[currentStep]
  const isPersonalInfo = currentStep < defaultQuestions.length
  const answeredQuestions = Object.keys(answers).length

  return (
    <div className="min-h-screen bg-gradient-light p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="animate-slide-up">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/patient/assessments')}
            className="mb-6 p-0 h-auto text-gray-600 hover:text-purple-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Assessments
          </Button>
          
          <div className="card-white p-8">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{assessmentData.name}</h1>
                <p className="text-gray-600 text-lg leading-relaxed">{assessmentData.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Progress Section */}
        <div className="card-white p-6 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isPersonalInfo 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'bg-purple-100 text-purple-600'
              }`}>
                {isPersonalInfo ? <User className="w-5 h-5" /> : <Brain className="w-5 h-5" />}
              </div>
              <div>
                <span className="text-lg font-semibold text-gray-900">
                  Question {currentStep + 1} of {totalQuestions}
                </span>
                <p className="text-sm text-gray-500">
                  {isPersonalInfo ? 'Personal Information' : 'Assessment Questions'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{Math.ceil((totalQuestions - currentStep - 1) * 0.5)} min remaining</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Progress value={progress} className="h-3 bg-gray-100" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{progress.toFixed(0)}% Complete</span>
              <span>{answeredQuestions} of {totalQuestions} answered</span>
            </div>
          </div>
        </div>

        {/* Enhanced Question Card */}
        <div className="card-white p-8 animate-slide-up">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{currentStep + 1}</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {isPersonalInfo ? 'Tell us about yourself' : 'Assessment Question'}
                </h2>
              </div>
              {currentQuestion.required && (
                <div className="flex items-center space-x-2 text-red-600">
                  <Star className="w-4 h-4" />
                  <span className="text-sm font-medium">Required</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-8">
            {renderQuestion(currentQuestion)}
          </div>
        </div>

        {/* Enhanced Navigation */}
        <div className="flex justify-between items-center animate-slide-up">
          <Button
            variant="outline"
            onClick={goToPreviousStep}
            disabled={currentStep === 0}
            className="px-6 py-3 border-gray-300 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep < totalQuestions - 1 ? (
            <Button
              onClick={goToNextStep}
              disabled={!isCurrentQuestionAnswered()}
              className="px-8 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              Next Question
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!isCurrentQuestionAnswered() || submitting}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center space-x-2"
            >
              {submitting ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Complete Assessment</span>
                </>
              )}
            </Button>
          )}
        </div>

        {/* Enhanced Quick Navigation */}
        <div className="card-white p-6 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-purple-500" />
              Quick Navigation
            </h3>
            <span className="text-sm text-gray-500">{answeredQuestions}/{totalQuestions} completed</span>
          </div>
          
          <div className="grid grid-cols-10 gap-2">
            {allQuestions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
                  index === currentStep
                    ? 'bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-md'
                    : answers[allQuestions[index].id] !== undefined
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
