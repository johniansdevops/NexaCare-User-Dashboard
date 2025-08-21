'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Clock, 
  ChevronRight, 
  Activity, 
  Brain, 
  Pill, 
  Apple, 
  Scale, 
  Heart, 
  Moon, 
  Droplets, 
  Dumbbell, 
  Zap,
  CheckCircle,
  Star,
  Users,
  TrendingUp
} from 'lucide-react'

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

const categoryStyles: Record<string, { bg: string; text: string; gradient: string }> = {
  'diagnostic': { 
    bg: 'bg-red-50', 
    text: 'text-red-700', 
    gradient: 'from-red-500 to-pink-500' 
  },
  'mental_health': { 
    bg: 'bg-purple-50', 
    text: 'text-purple-700', 
    gradient: 'from-purple-500 to-violet-500' 
  },
  'treatment': { 
    bg: 'bg-blue-50', 
    text: 'text-blue-700', 
    gradient: 'from-blue-500 to-cyan-500' 
  },
  'nutrition': { 
    bg: 'bg-green-50', 
    text: 'text-green-700', 
    gradient: 'from-green-500 to-emerald-500' 
  },
  'fitness': { 
    bg: 'bg-orange-50', 
    text: 'text-orange-700', 
    gradient: 'from-orange-500 to-red-500' 
  },
  'preventive': { 
    bg: 'bg-yellow-50', 
    text: 'text-yellow-700', 
    gradient: 'from-yellow-500 to-orange-500' 
  },
  'lifestyle': { 
    bg: 'bg-indigo-50', 
    text: 'text-indigo-700', 
    gradient: 'from-indigo-500 to-purple-500' 
  }
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
      <div className="p-6 space-y-6 bg-gradient-light min-h-screen">
        <div className="animate-pulse max-w-7xl mx-auto">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8 bg-gradient-light min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-2xl mb-6 shadow-lg">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Health <span className="gradient-text">Assessments</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Take comprehensive health assessments to get personalized insights and AI-powered recommendations from NexaCare.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-slide-up">
          <div className="card-white p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{assessments.length}</h3>
            <p className="text-gray-600">Available Assessments</p>
          </div>
          <div className="card-white p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">10,000+</h3>
            <p className="text-gray-600">Users Assessed</p>
          </div>
          <div className="card-white p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">98%</h3>
            <p className="text-gray-600">Accuracy Rate</p>
          </div>
        </div>

        {/* Enhanced Category Filter */}
        <div className="mb-8 animate-slide-up">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Star className="w-5 h-5 mr-2 text-purple-500" />
            Filter by Category
          </h3>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200 hover:border-purple-200'
                }`}
              >
                {category === 'all' ? 'All Assessments' : category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Assessments Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 animate-slide-up">
          {filteredAssessments.map((assessment) => {
            const IconComponent = iconMap[assessment.icon] || Activity
            const categoryStyle = categoryStyles[assessment.category] || categoryStyles.diagnostic

            return (
              <div key={assessment.id} className="card-white-interactive group">
                <div className="p-6">
                  {/* Icon and Category */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${categoryStyle.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200`}>
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    <Badge className={`${categoryStyle.bg} ${categoryStyle.text} border-0 text-xs font-medium`}>
                      {assessment.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  </div>

                  {/* Content */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-700 transition-colors">
                      {assessment.name}
                    </h3>
                    <p className="text-gray-600 leading-relaxed line-clamp-3">
                      {assessment.description}
                    </p>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between mb-6 text-sm">
                    <div className="flex items-center space-x-2 text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{assessment.estimated_time}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Activity className="w-4 h-4" />
                      <span>AI-Powered</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link href={`/patient/assessments/${assessment.id}`} className="block">
                    <button className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2">
                      <span>Start Assessment</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredAssessments.length === 0 && (
          <div className="text-center py-16 animate-slide-up">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No assessments found</h3>
            <p className="text-gray-600 mb-6">Try selecting a different category to explore more options</p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="btn-primary"
            >
              View All Assessments
            </button>
          </div>
        )}

        {/* Enhanced How It Works Section */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm border border-gray-200 animate-slide-up">
          <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">How NexaCare Assessments Work</h2>
            <p className="text-gray-600 text-lg">Get personalized health insights in three simple steps</p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Choose Assessment</h3>
              <p className="text-gray-600 leading-relaxed">Select the health area you want to evaluate from our comprehensive assessment library</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Answer Questions</h3>
              <p className="text-gray-600 leading-relaxed">Complete specialized questions designed by healthcare professionals (5-10 minutes)</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Get AI Analysis</h3>
              <p className="text-gray-600 leading-relaxed">Receive personalized insights, recommendations, and action plans powered by AI</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
