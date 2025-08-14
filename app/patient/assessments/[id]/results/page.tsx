'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Download, Share, FileText, Clock, User, Mail, Phone, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'

interface AssessmentResults {
  report_id: string
  assessment_id: string
  assessment_name: string
  user_info: {
    'Full Name': string
    'Age': number
    'Gender': string
    'Phone Number': string
    'Email Address': string
    'Place of Residence': string
  }
  timestamp: string
  analysis: string
  raw_answers: Array<{
    question_id: number
    question: string
    answer: any
    weight?: number
  }>
  status: string
}

export default function ResultsPage() {
  const params = useParams()
  const router = useRouter()
  const assessmentId = params?.id as string
  
  const [results, setResults] = useState<AssessmentResults | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloadingPdf, setDownloadingPdf] = useState(false)

  useEffect(() => {
    loadResults()
  }, [])

  const loadResults = () => {
    try {
      // Try to get results from localStorage first
      const storedResults = localStorage.getItem('assessment_results')
      if (storedResults) {
        const parsedResults = JSON.parse(storedResults)
        setResults(parsedResults)
        setLoading(false)
      } else {
        // If not in localStorage, redirect back to assessments
        toast.error('No assessment results found. Please retake the assessment.')
        router.push('/patient/assessments')
      }
    } catch (error) {
      console.error('Error loading results:', error)
      toast.error('Failed to load assessment results.')
      router.push('/patient/assessments')
    }
  }

  const handleDownloadPdf = async () => {
    if (!results) return
    
    setDownloadingPdf(true)
    
    try {
      const response = await fetch('/api/assessments/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(results)
      })

      if (!response.ok) {
        throw new Error('Failed to generate PDF')
      }

      // Get the PDF blob
      const blob = await response.blob()
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${results.assessment_name.replace(/\s+/g, '_')}_Report_${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast.success('PDF downloaded successfully!')
      
    } catch (error) {
      console.error('Error downloading PDF:', error)
      toast.error('Failed to download PDF. Please try again.')
    } finally {
      setDownloadingPdf(false)
    }
  }

  const handleShare = async () => {
    if (!results) return

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${results.assessment_name} Results`,
          text: `My ${results.assessment_name} assessment results from NexaCare`,
          url: window.location.href
        })
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href)
        toast.success('Results link copied to clipboard!')
      }
    } catch (error) {
      console.error('Error sharing:', error)
      toast.error('Failed to share results.')
    }
  }

  const formatAnalysis = (analysis: string) => {
    // Convert markdown-like formatting to HTML
    return analysis
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-gray-900 mb-4">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold text-gray-800 mb-3 mt-6">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-medium text-gray-700 mb-2 mt-4">$1</h3>')
      .replace(/^\* (.*$)/gim, '<li class="mb-1">$1</li>')
      .replace(/^• (.*$)/gim, '<li class="mb-1">$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="mb-1">$1</li>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/^(?!<[h|l])/gm, '<p class="mb-4">')
      .replace(/(?<!\>)$/gm, '</p>')
      .replace(/<p class="mb-4"><\/p>/g, '')
      .replace(/---/g, '<hr class="my-6 border-gray-200">')
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="container mx-auto p-6">
        <div className="max-w-4xl mx-auto text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">No Results Found</h1>
          <p className="text-gray-600 mb-6">Assessment results could not be loaded.</p>
          <Button onClick={() => router.push('/patient/assessments')}>
            Back to Assessments
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
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
          
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Assessment Results</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  <span>{results.assessment_name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(results.timestamp).toLocaleDateString()}</span>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {results.status === 'completed' ? 'Completed' : results.status}
                </Badge>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleShare}>
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button onClick={handleDownloadPdf} disabled={downloadingPdf}>
                <Download className="w-4 h-4 mr-2" />
                {downloadingPdf ? 'Generating PDF...' : 'Download PDF'}
              </Button>
            </div>
          </div>
        </div>

        {/* Patient Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Patient Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{results.user_info['Full Name']}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">
                    {results.user_info['Age'].toString().slice(-1)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Age</p>
                  <p className="font-medium">{results.user_info['Age']} years</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-500 rounded flex items-center justify-center">
                  <span className="text-xs text-white font-bold">
                    {results.user_info['Gender'][0]}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-medium">{results.user_info['Gender']}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{results.user_info['Phone Number']}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-sm">{results.user_info['Email Address']}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{results.user_info['Place of Residence']}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Analysis Results */}
        <Card>
          <CardHeader>
            <CardTitle>AI Health Assessment Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="prose prose-gray max-w-none"
              dangerouslySetInnerHTML={{ __html: formatAnalysis(results.analysis) }}
            />
          </CardContent>
        </Card>

        {/* Report Actions */}
        <div className="mt-8 flex justify-center gap-4">
          <Button variant="outline" onClick={() => router.push('/patient/assessments')}>
            Take Another Assessment
          </Button>
          <Button onClick={handleDownloadPdf} disabled={downloadingPdf}>
            <Download className="w-4 h-4 mr-2" />
            {downloadingPdf ? 'Generating PDF...' : 'Download Full Report'}
          </Button>
        </div>

        {/* Report ID Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>Report ID: {results.report_id}</p>
          <p>Generated on {new Date(results.timestamp).toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}
