'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ClipboardDocumentListIcon,
  HeartIcon,
  CpuChipIcon,
  EyeIcon,
  SparklesIcon,
  CheckCircleIcon,
  ClockIcon,
  PlayIcon,
  ChartBarIcon,
  ShareIcon,
  DocumentTextIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
  StarIcon,
  BeakerIcon,
  ScaleIcon,
  FaceSmileIcon,
  BoltIcon,
} from '@heroicons/react/24/outline';

interface Assessment {
  id: string;
  title: string;
  description: string;
  category: 'general' | 'mental' | 'cardiovascular' | 'respiratory' | 'metabolic' | 'specialized';
  icon: any;
  color: string;
  duration: number; // in minutes
  questions: number;
  difficulty: 'easy' | 'moderate' | 'comprehensive';
  lastCompleted?: string;
  lastScore?: number;
  aiRecommendation?: string;
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'annually';
  nextDue?: string;
  status: 'available' | 'in_progress' | 'completed' | 'overdue';
  completionCount: number;
  averageScore: number;
  trending: 'up' | 'down' | 'stable';
}

interface AssessmentResult {
  id: string;
  assessmentId: string;
  score: number;
  maxScore: number;
  percentage: number;
  completedAt: string;
  aiInterpretation: string;
  recommendations: string[];
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  followUpRequired: boolean;
  shareableReport?: string;
}

interface AssessmentProgress {
  assessmentId: string;
  currentQuestion: number;
  totalQuestions: number;
  answers: Record<string, any>;
  startedAt: string;
  estimatedTimeRemaining: number;
}

export default function PatientAssessments() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [recentResults, setRecentResults] = useState<AssessmentResult[]>([]);
  const [inProgressAssessments, setInProgressAssessments] = useState<AssessmentProgress[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', label: 'All Assessments', icon: '🔍' },
    { id: 'general', label: 'General Health', icon: '🏥' },
    { id: 'mental', label: 'Mental Health', icon: '🧠' },
    { id: 'cardiovascular', label: 'Heart Health', icon: '❤️' },
    { id: 'respiratory', label: 'Respiratory', icon: '🫁' },
    { id: 'metabolic', label: 'Metabolic', icon: '⚖️' },
    { id: 'specialized', label: 'Specialized', icon: '🔬' },
  ];

  // Mock assessments data
  const mockAssessments: Assessment[] = [
    {
      id: '1',
      title: 'General Health Check',
      description: 'Comprehensive overview of your overall health status and wellness indicators.',
      category: 'general',
      icon: ClipboardDocumentListIcon,
      color: 'bg-blue-500/20 border-blue-500/30 text-blue-300',
      duration: 15,
      questions: 25,
      difficulty: 'moderate',
      lastCompleted: '2024-01-10',
      lastScore: 82,
      aiRecommendation: 'Consider focusing on sleep quality and stress management.',
      frequency: 'monthly',
      nextDue: '2024-02-10',
      status: 'available',
      completionCount: 3,
      averageScore: 78,
      trending: 'up',
    },
    {
      id: '2',
      title: 'Mental Health Screening',
      description: 'Evaluate stress levels, mood patterns, and overall mental wellbeing.',
      category: 'mental',
      icon: CpuChipIcon,
      color: 'bg-purple-500/20 border-purple-500/30 text-purple-300',
      duration: 20,
      questions: 30,
      difficulty: 'comprehensive',
      lastCompleted: '2024-01-05',
      lastScore: 75,
      aiRecommendation: 'Your stress levels are slightly elevated. Consider meditation or counseling.',
      frequency: 'weekly',
      nextDue: '2024-01-12',
      status: 'overdue',
      completionCount: 8,
      averageScore: 72,
      trending: 'stable',
    },
    {
      id: '3',
      title: 'Cardiovascular Risk Assessment',
      description: 'Comprehensive evaluation of heart health and cardiovascular risk factors.',
      category: 'cardiovascular',
      icon: HeartIcon,
      color: 'bg-red-500/20 border-red-500/30 text-red-300',
      duration: 25,
      questions: 35,
      difficulty: 'comprehensive',
      lastCompleted: '2024-01-01',
      lastScore: 88,
      aiRecommendation: 'Excellent cardiovascular health! Maintain current lifestyle.',
      frequency: 'quarterly',
      nextDue: '2024-04-01',
      status: 'available',
      completionCount: 2,
      averageScore: 85,
      trending: 'up',
    },
    {
      id: '4',
      title: 'Sleep Quality Assessment',
      description: 'Analyze sleep patterns, quality, and factors affecting your rest.',
      category: 'general',
      icon: ClockIcon,
      color: 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300',
      duration: 10,
      questions: 15,
      difficulty: 'easy',
      frequency: 'weekly',
      nextDue: '2024-01-16',
      status: 'available',
      completionCount: 0,
      averageScore: 0,
      trending: 'stable',
    },
    {
      id: '5',
      title: 'Nutrition & Diet Evaluation',
      description: 'Review dietary habits, nutritional intake, and eating patterns.',
      category: 'metabolic',
      icon: ScaleIcon,
      color: 'bg-green-500/20 border-green-500/30 text-green-300',
      duration: 18,
      questions: 28,
      difficulty: 'moderate',
      lastCompleted: '2024-01-08',
      lastScore: 65,
      aiRecommendation: 'Increase vegetable intake and reduce processed foods.',
      frequency: 'monthly',
      nextDue: '2024-02-08',
      status: 'available',
      completionCount: 2,
      averageScore: 68,
      trending: 'down',
    },
    {
      id: '6',
      title: 'Respiratory Health Check',
      description: 'Assess breathing patterns, lung function, and respiratory symptoms.',
      category: 'respiratory',
      icon: FaceSmileIcon,
      color: 'bg-cyan-500/20 border-cyan-500/30 text-cyan-300',
      duration: 12,
      questions: 20,
      difficulty: 'moderate',
      frequency: 'quarterly',
      nextDue: '2024-03-15',
      status: 'available',
      completionCount: 0,
      averageScore: 0,
      trending: 'stable',
    },
    {
      id: '7',
      title: 'Diabetes Risk Screening',
      description: 'Evaluate risk factors and early indicators for diabetes development.',
      category: 'metabolic',
      icon: BeakerIcon,
      color: 'bg-orange-500/20 border-orange-500/30 text-orange-300',
      duration: 15,
      questions: 22,
      difficulty: 'moderate',
      frequency: 'annually',
      nextDue: '2025-01-01',
      status: 'available',
      completionCount: 1,
      averageScore: 92,
      trending: 'stable',
    },
    {
      id: '8',
      title: 'Stress & Anxiety Assessment',
      description: 'Detailed evaluation of stress levels, anxiety symptoms, and coping mechanisms.',
      category: 'mental',
      icon: ExclamationTriangleIcon,
      color: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300',
      duration: 16,
      questions: 24,
      difficulty: 'moderate',
      lastCompleted: '2024-01-12',
      lastScore: 58,
      aiRecommendation: 'High stress detected. Consider stress management techniques.',
      frequency: 'weekly',
      nextDue: '2024-01-19',
      status: 'available',
      completionCount: 4,
      averageScore: 62,
      trending: 'down',
    },
  ];

  const mockResults: AssessmentResult[] = [
    {
      id: '1',
      assessmentId: '1',
      score: 82,
      maxScore: 100,
      percentage: 82,
      completedAt: '2024-01-10T14:30:00Z',
      aiInterpretation: 'Your overall health status is good with room for improvement in stress management and sleep quality. The assessment indicates strong cardiovascular health and good nutritional habits.',
      recommendations: [
        'Increase sleep duration to 7-8 hours nightly',
        'Practice stress reduction techniques like meditation',
        'Maintain current exercise routine',
        'Consider regular health screenings'
      ],
      riskLevel: 'low',
      followUpRequired: false,
      shareableReport: 'https://reports.mediva.ai/general-health/abc123',
    },
    {
      id: '2',
      assessmentId: '2',
      score: 75,
      maxScore: 100,
      percentage: 75,
      completedAt: '2024-01-05T09:15:00Z',
      aiInterpretation: 'Mental health screening shows moderate stress levels with some anxiety indicators. Overall psychological wellbeing is within normal range but could benefit from targeted interventions.',
      recommendations: [
        'Consider professional counseling or therapy',
        'Implement daily mindfulness practices',
        'Improve work-life balance',
        'Regular exercise for mental health benefits'
      ],
      riskLevel: 'moderate',
      followUpRequired: true,
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAssessments(mockAssessments);
      setRecentResults(mockResults);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredAssessments = selectedCategory === 'all' 
    ? assessments 
    : assessments.filter(assessment => assessment.category === selectedCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'border-green-500/30 bg-green-500/10';
      case 'in_progress': return 'border-blue-500/30 bg-blue-500/10';
      case 'completed': return 'border-gray-500/30 bg-gray-500/10';
      case 'overdue': return 'border-red-500/30 bg-red-500/10';
      default: return 'border-gray-500/30 bg-gray-500/10';
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-400';
      case 'moderate': return 'text-yellow-400';
      case 'high': return 'text-orange-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      case 'stable': return '➖';
      default: return '➖';
    }
  };

  const startAssessment = (assessmentId: string) => {
    // Implementation for starting an assessment
    console.log('Starting assessment:', assessmentId);
  };

  const overallHealthScore = Math.round(
    recentResults.reduce((sum, result) => sum + result.percentage, 0) / recentResults.length
  );

  if (loading) {
    return (
      <div className="p-6 space-y-6 bg-white min-h-screen animate-fade-in">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between animate-slide-up">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Health Assessments</h1>
          <p className="text-lg text-gray-600">AI-powered health evaluations and personalized insights</p>
          <div className="mt-2 text-sm text-gray-500 font-mono">
            {assessments.length} assessments available • Overall health score: {overallHealthScore}%
          </div>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <Link href="/patient/ai-chat" className="btn-outline">
            <SparklesIcon className="w-5 h-5 mr-2" />
            Ask AI
          </Link>
          <button className="btn-primary">
            <PlayIcon className="w-5 h-5 mr-2" />
            Quick Assessment
          </button>
        </div>
      </div>

      {/* Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-slide-up">
        <div className="card-white p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-4xl text-purple-500 font-bold">✦</span>
            <span className={`text-2xl font-bold ${getRiskLevelColor('low')}`}>
              {overallHealthScore}%
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Health Score</h3>
          <p className="text-sm text-gray-600">AI-generated overall rating</p>
        </div>

        <div className="card-white p-6">
          <div className="flex items-center justify-between mb-4">
            <ClipboardDocumentListIcon className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold text-blue-500">
              {assessments.filter(a => a.status === 'completed').length}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Completed</h3>
          <p className="text-sm text-gray-600">This month</p>
        </div>

        <div className="card-white p-6">
          <div className="flex items-center justify-between mb-4">
            <ClockIcon className="w-8 h-8 text-yellow-500" />
            <span className="text-2xl font-bold text-yellow-500">
              {assessments.filter(a => a.status === 'overdue').length}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Overdue</h3>
          <p className="text-sm text-gray-600">Need attention</p>
        </div>

        <div className="card-white p-6">
          <div className="flex items-center justify-between mb-4">
            <CheckCircleIcon className="w-8 h-8 text-green-500" />
            <span className="text-2xl font-bold text-green-500">
              {assessments.filter(a => a.status === 'available').length}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Available</h3>
          <p className="text-sm text-gray-600">Ready to take</p>
        </div>
      </div>

      {/* Recent Results */}
      {recentResults.length > 0 && (
        <div className="card-white p-6 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Recent Results</h3>
            <Link href="/patient/assessments/history" className="text-pink-500 hover:text-pink-600 text-sm font-medium">
              View all results →
            </Link>
          </div>
          
          <div className="space-y-6">
            {recentResults.map(result => {
              const assessment = assessments.find(a => a.id === result.assessmentId);
              if (!assessment) return null;
              
              return (
                <div key={result.id} className="p-6 bg-gray-50 rounded-xl">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${assessment.color}`}>
                        <assessment.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{assessment.title}</h4>
                        <p className="text-sm text-gray-600">
                          Completed {new Date(result.completedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getRiskLevelColor(result.riskLevel)}`}>
                        {result.percentage}%
                      </div>
                      <div className={`text-sm px-2 py-1 rounded-full ${
                        result.riskLevel === 'low' ? 'bg-green-100 text-green-700' :
                        result.riskLevel === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                        result.riskLevel === 'high' ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {result.riskLevel.toUpperCase()} RISK
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h5 className="text-sm font-semibold text-gray-900 mb-2">AI Interpretation</h5>
                    <p className="text-sm text-gray-700 leading-relaxed">{result.aiInterpretation}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h5 className="text-sm font-semibold text-gray-900 mb-2">Key Recommendations</h5>
                    <div className="space-y-1">
                      {result.recommendations.slice(0, 3).map((rec, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm text-gray-700">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {result.followUpRequired && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                          Follow-up Required
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {result.shareableReport && (
                        <button className="btn-outline text-sm px-3 py-1">
                          <ShareIcon className="w-4 h-4 mr-1" />
                          Share
                        </button>
                      )}
                      <button className="btn-secondary text-sm px-3 py-1">
                        <DocumentTextIcon className="w-4 h-4 mr-1" />
                        Full Report
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 animate-slide-up">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              selectedCategory === category.id
                ? 'mediva-gradient text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:text-gray-900 hover:bg-gray-200'
            }`}
          >
            {category.icon} {category.label}
          </button>
        ))}
      </div>

      {/* Assessment Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up">
        {filteredAssessments.map(assessment => (
          <div
            key={assessment.id}
            className={`p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
              assessment.status === 'available' ? 'border-green-200 bg-green-50' :
              assessment.status === 'overdue' ? 'border-red-200 bg-red-50' :
              assessment.status === 'completed' ? 'border-gray-200 bg-gray-50' :
              'border-blue-200 bg-blue-50'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${assessment.color}`}>
                  <assessment.icon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{assessment.title}</h3>
                  <p className="text-sm text-gray-600">{assessment.description}</p>
                </div>
              </div>
              
              <div className="text-right">
                {assessment.lastScore !== undefined && (
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-lg font-bold text-gray-900">{assessment.lastScore}%</span>
                    <span className="text-sm">{getTrendIcon(assessment.trending)}</span>
                  </div>
                )}
                <div className={`text-xs px-2 py-1 rounded-full ${
                  assessment.status === 'available' ? 'bg-green-100 text-green-700' :
                  assessment.status === 'overdue' ? 'bg-red-100 text-red-700' :
                  assessment.status === 'completed' ? 'bg-gray-100 text-gray-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {assessment.status.replace('_', ' ').toUpperCase()}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{assessment.duration}</div>
                <div className="text-xs text-gray-500 font-mono">minutes</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{assessment.questions}</div>
                <div className="text-xs text-gray-500 font-mono">questions</div>
              </div>
              <div className="text-center">
                <div className={`text-xs px-2 py-1 rounded-full ${
                  assessment.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                  assessment.difficulty === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {assessment.difficulty.toUpperCase()}
                </div>
              </div>
            </div>
            
            {assessment.aiRecommendation && (
              <div className="mb-4 p-3 bg-blue-100 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <SparklesIcon className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-700">{assessment.aiRecommendation}</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {assessment.lastCompleted ? (
                  <>Last: {new Date(assessment.lastCompleted).toLocaleDateString()}</>
                ) : (
                  'Never completed'
                )}
                {assessment.nextDue && (
                  <> • Due: {new Date(assessment.nextDue).toLocaleDateString()}</>
                )}
              </div>
              
              <button
                onClick={() => startAssessment(assessment.id)}
                className={`btn-primary text-sm px-4 py-2 ${
                  assessment.status === 'overdue' ? 'bg-red-500 hover:bg-red-600' : ''
                }`}
              >
                <PlayIcon className="w-4 h-4 mr-1" />
                {assessment.status === 'in_progress' ? 'Continue' : 'Start'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card-white p-6 animate-slide-up">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="card-white-interactive p-4 text-center">
            <BoltIcon className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Quick Health Check</p>
          </button>
          
          <Link href="/patient/ai-chat" className="card-white-interactive p-4 text-center">
            <SparklesIcon className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Ask AI About Results</p>
          </Link>
          
          <button className="card-white-interactive p-4 text-center">
            <ShareIcon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Share with Provider</p>
          </button>
          
          <button className="card-white-interactive p-4 text-center">
            <ChartBarIcon className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">View Trends</p>
          </button>
        </div>
      </div>
    </div>
  );
} 