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
import { ArrowLeft, ArrowRight, Clock, AlertCircle } from 'lucide-react'
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
          <div className="space-y-2">
            <Label htmlFor={`question-${question.id}`}>{question.question}</Label>
            <Input
              id={`question-${question.id}`}
              type={question.type}
              placeholder={question.placeholder}
              value={answer || ''}
              onChange={(e) => handleAnswer(question.id, e.target.value)}
              className="w-full"
            />
          </div>
        )

      case 'number':
        return (
          <div className="space-y-2">
            <Label htmlFor={`question-${question.id}`}>{question.question}</Label>
            <Input
              id={`question-${question.id}`}
              type="number"
              min={question.min}
              max={question.max}
              placeholder={question.placeholder}
              value={answer || ''}
              onChange={(e) => handleAnswer(question.id, parseInt(e.target.value) || '')}
              className="w-full"
            />
          </div>
        )

      case 'multiple_choice':
        return (
          <div className="space-y-4">
            <Label className="text-lg font-medium">{question.question}</Label>
            <RadioGroup
              value={answer || ''}
              onValueChange={(value) => handleAnswer(question.id, value)}
            >
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`q${question.id}-option-${index}`} />
                  <Label 
                    htmlFor={`q${question.id}-option-${index}`}
                    className="cursor-pointer"
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
          <div className="space-y-4">
            <Label className="text-lg font-medium">{question.question}</Label>
            <div className="space-y-3">
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
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
                  />
                  <Label 
                    htmlFor={`q${question.id}-option-${index}`}
                    className="cursor-pointer"
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
          <div className="space-y-4">
            <Label className="text-lg font-medium">{question.question}</Label>
            <div className="space-y-4">
              <Slider
                value={scaleValue}
                onValueChange={(value) => handleAnswer(question.id, value[0])}
                max={question.max || 10}
                min={question.min || 0}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>{question.min || 0}</span>
                <span className="font-semibold">{scaleValue[0]}</span>
                <span>{question.max || 10}</span>
              </div>
            </div>
          </div>
        )

      default:
        return <div>Unsupported question type</div>
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!assessmentData || !allQuestions.length) {
    return (
      <div className="container mx-auto p-6">
        <div className="max-w-2xl mx-auto text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Assessment Not Found</h1>
          <p className="text-gray-600 mb-6">The requested assessment could not be loaded.</p>
          <Button onClick={() => router.push('/patient/assessments')}>
            Back to Assessments
          </Button>
        </div>
      </div>
    )
  }

  const currentQuestion = allQuestions[currentStep]

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/patient/assessments')}
            className="mb-4 p-0 h-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Assessments
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{assessmentData.name}</h1>
          <p className="text-gray-600">{assessmentData.description}</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question {currentStep + 1} of {totalQuestions}
            </span>
            <span className="text-sm text-gray-500 flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {Math.ceil((totalQuestions - currentStep - 1) * 0.3)} min remaining
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">
              {currentStep < defaultQuestions.length ? 'Personal Information' : 'Assessment Question'}
            </CardTitle>
            {currentQuestion.required && (
              <CardDescription className="text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                This question is required
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {renderQuestion(currentQuestion)}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={goToPreviousStep}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep < totalQuestions - 1 ? (
            <Button
              onClick={goToNextStep}
              disabled={!isCurrentQuestionAnswered()}
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!isCurrentQuestionAnswered() || submitting}
            >
              {submitting ? 'Analyzing...' : 'Complete Assessment'}
            </Button>
          )}
        </div>

        {/* Question Jump Navigation (Optional) */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Quick Navigation</h3>
          <div className="grid grid-cols-10 gap-2">
            {allQuestions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
                  index === currentStep
                    ? 'bg-blue-600 text-white'
                    : answers[allQuestions[index].id] !== undefined
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
