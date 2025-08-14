'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, ChevronRight, Activity, Brain, Pill, Apple, Scale, Heart, Moon, Droplets, Dumbbell, Zap } from 'lucide-react'

interface Assessment {
  id: string
  name: string
  description: string
  icon: string
  category: string
  estimated_time: string
  questions_file: string
}

const iconMap: Record<string, any> = {
  '🩺': Activity,
  '🧠': Brain,
  '💊': Pill,
  '🥗': Apple,
  '⚖️': Scale,
  '❤️': Heart,
  '😴': Moon,
  '🩸': Droplets,
  '🏃‍♂️': Dumbbell,
  '🧘‍♀️': Zap
}

const categoryColors: Record<string, string> = {
  'diagnostic': 'bg-red-100 text-red-800',
  'mental_health': 'bg-purple-100 text-purple-800',
  'treatment': 'bg-blue-100 text-blue-800',
  'nutrition': 'bg-green-100 text-green-800',
  'fitness': 'bg-orange-100 text-orange-800',
  'preventive': 'bg-yellow-100 text-yellow-800',
  'lifestyle': 'bg-indigo-100 text-indigo-800'
}

export default function AssessmentsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    loadAssessments()
  }, [])

  const loadAssessments = async () => {
    try {
      const response = await fetch('/assessments/assessment_list.json')
      const data = await response.json()
      setAssessments(data)
    } catch (error) {
      console.error('Error loading assessments:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['all', ...Array.from(new Set(assessments.map(a => a.category)))]
  
  const filteredAssessments = selectedCategory === 'all' 
    ? assessments 
    : assessments.filter(a => a.category === selectedCategory)

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Health Assessments</h1>
        <p className="text-gray-600 text-lg">
          Take comprehensive health assessments to get personalized insights and recommendations powered by AI.
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {category === 'all' ? 'All Assessments' : category.replace('_', ' ')}
            </Button>
          ))}
        </div>
      </div>

      {/* Assessments Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredAssessments.map((assessment) => {
          const IconComponent = iconMap[assessment.icon] || Activity

          return (
            <Card key={assessment.id} className="hover:shadow-lg transition-shadow duration-200 group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                      <IconComponent className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {assessment.name}
                      </CardTitle>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs mt-1 ${categoryColors[assessment.category] || 'bg-gray-100 text-gray-800'}`}
                      >
                        {assessment.category.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <CardDescription className="text-gray-600 mb-4 line-clamp-2">
                  {assessment.description}
                </CardDescription>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{assessment.estimated_time}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    31 questions
                  </div>
                </div>

                <Link href={`/patient/assessments/${assessment.id}`}>
                  <Button className="w-full group-hover:bg-blue-600 transition-colors">
                    Start Assessment
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredAssessments.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-2">No assessments found</div>
          <p className="text-sm text-gray-400">Try selecting a different category</p>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-12 bg-blue-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-900 mb-2">How It Works</h2>
        <div className="grid gap-4 md:grid-cols-3 text-sm">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-xs mt-0.5">
              1
            </div>
            <div>
              <h3 className="font-medium text-blue-900">Choose Assessment</h3>
              <p className="text-blue-700">Select the health area you want to evaluate</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-xs mt-0.5">
              2
            </div>
            <div>
              <h3 className="font-medium text-blue-900">Answer Questions</h3>
              <p className="text-blue-700">Complete 25 specialized questions (5-10 minutes)</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-xs mt-0.5">
              3
            </div>
            <div>
              <h3 className="font-medium text-blue-900">Get AI Report</h3>
              <p className="text-blue-700">Receive personalized insights and recommendations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
