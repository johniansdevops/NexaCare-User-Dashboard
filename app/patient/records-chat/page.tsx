'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  DocumentTextIcon,
  CloudArrowUpIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
  PaperClipIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  TrashIcon,
  PhotoIcon,
  BeakerIcon,
  HeartIcon,
  FilmIcon,
  DocumentIcon,
  FolderIcon,
  ChatBubbleLeftRightIcon,
  InformationCircleIcon,
  BoltIcon,
} from '@heroicons/react/24/outline';

interface HealthDocument {
  id: string;
  name: string;
  type: 'lab_result' | 'imaging' | 'prescription' | 'visit_note' | 'insurance' | 'other';
  uploadedAt: string;
  size: number;
  format: string;
  status: 'processing' | 'ready' | 'error';
  aiSummary?: string;
  keyFindings?: string[];
  provider?: string;
  date?: string;
  category: string;
  confidenceScore?: number;
  isShared: boolean;
  tags: string[];
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  relatedDocuments?: string[];
  sourceReferences?: Array<{
    documentId: string;
    page?: number;
    excerpt: string;
    confidence: number;
  }>;
  followUpQuestions?: string[];
}

interface DocumentInsight {
  id: string;
  documentId: string;
  type: 'abnormal_value' | 'trend' | 'recommendation' | 'risk_factor';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  actionRequired: boolean;
}

export default function PatientRecordsChat() {
  const [documents, setDocuments] = useState<HealthDocument[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [insights, setInsights] = useState<DocumentInsight[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock data
  const mockDocuments: HealthDocument[] = [
    {
      id: '1',
      name: 'Complete Blood Count - January 2024',
      type: 'lab_result',
      uploadedAt: '2024-01-15T10:30:00Z',
      size: 245760,
      format: 'PDF',
      status: 'ready',
      aiSummary: 'Complete Blood Count results showing all values within normal range. Hemoglobin: 14.2 g/dL (normal), White blood cell count: 6,800/μL (normal), Platelet count: 285,000/μL (normal).',
      keyFindings: ['All values within normal range', 'No signs of anemia', 'Immune system appears healthy'],
      provider: 'Dr. Sarah Chen',
      date: '2024-01-15',
      category: 'Laboratory',
      confidenceScore: 95,
      isShared: false,
      tags: ['blood work', 'routine', 'normal'],
    },
    {
      id: '2',
      name: 'Chest X-Ray Report - December 2023',
      type: 'imaging',
      uploadedAt: '2024-01-10T14:20:00Z',
      size: 1048576,
      format: 'PDF',
      status: 'ready',
      aiSummary: 'Chest X-ray shows clear lung fields with no acute abnormalities. Heart size is normal. No evidence of pneumonia, pneumothorax, or other pulmonary pathology.',
      keyFindings: ['Clear lung fields', 'Normal heart size', 'No acute abnormalities'],
      provider: 'Dr. Michael Rodriguez',
      date: '2023-12-28',
      category: 'Radiology',
      confidenceScore: 98,
      isShared: true,
      tags: ['imaging', 'chest', 'normal'],
    },
    {
      id: '3',
      name: 'Lipid Panel - December 2023',
      type: 'lab_result',
      uploadedAt: '2024-01-08T09:15:00Z',
      size: 198432,
      format: 'PDF',
      status: 'ready',
      aiSummary: 'Lipid panel showing elevated LDL cholesterol at 145 mg/dL (borderline high). HDL cholesterol: 52 mg/dL (normal), Triglycerides: 158 mg/dL (normal), Total cholesterol: 215 mg/dL (borderline high).',
      keyFindings: ['Elevated LDL cholesterol', 'Normal HDL and triglycerides', 'Cardiovascular risk assessment recommended'],
      provider: 'Dr. Emily Park',
      date: '2023-12-20',
      category: 'Laboratory',
      confidenceScore: 93,
      isShared: false,
      tags: ['cholesterol', 'cardiovascular', 'elevated'],
    },
    {
      id: '4',
      name: 'Annual Physical Exam Notes',
      type: 'visit_note',
      uploadedAt: '2024-01-05T16:45:00Z',
      size: 327680,
      format: 'PDF',
      status: 'ready',
      aiSummary: 'Annual physical examination documenting overall good health. Blood pressure: 128/82 mmHg (stage 1 hypertension), BMI: 24.1 (normal weight), No acute concerns noted.',
      keyFindings: ['Stage 1 hypertension noted', 'Normal BMI', 'Routine health maintenance discussed'],
      provider: 'Dr. Sarah Chen',
      date: '2024-01-05',
      category: 'Clinical Notes',
      confidenceScore: 91,
      isShared: false,
      tags: ['physical exam', 'annual', 'hypertension'],
    },
  ];

  const mockMessages: ChatMessage[] = [
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI health records assistant. I\'ve analyzed your uploaded documents and I\'m ready to help you understand your health information. You can ask me questions about your lab results, imaging reports, or any other medical documents.',
      timestamp: '2024-01-15T09:00:00Z',
      followUpQuestions: [
        'What do my latest blood test results mean?',
        'Are there any concerning trends in my health data?',
        'What should I discuss with my doctor at my next appointment?',
      ],
    },
    {
      id: '2',
      type: 'user',
      content: 'What do my cholesterol numbers mean? Should I be concerned?',
      timestamp: '2024-01-15T09:05:00Z',
    },
    {
      id: '3',
      type: 'ai',
      content: 'Based on your December 2023 lipid panel, your LDL cholesterol is 145 mg/dL, which is in the "borderline high" range (130-159 mg/dL). While this isn\'t immediately dangerous, it does indicate an increased risk for cardiovascular disease over time.\n\nThe good news is that your HDL (52 mg/dL) and triglycerides (158 mg/dL) are both in healthy ranges. Your total cholesterol at 215 mg/dL is also borderline high.\n\nI recommend discussing lifestyle modifications like diet and exercise with your doctor, and they may consider cholesterol-lowering medication if lifestyle changes aren\'t sufficient.',
      timestamp: '2024-01-15T09:05:30Z',
      relatedDocuments: ['3'],
      sourceReferences: [
        {
          documentId: '3',
          excerpt: 'LDL cholesterol: 145 mg/dL (borderline high)',
          confidence: 98,
        },
      ],
      followUpQuestions: [
        'What lifestyle changes can help lower my cholesterol?',
        'How often should I monitor my cholesterol levels?',
        'What are the risks if I don\'t address this?',
      ],
    },
  ];

  const mockInsights: DocumentInsight[] = [
    {
      id: '1',
      documentId: '3',
      type: 'abnormal_value',
      title: 'Elevated LDL Cholesterol',
      description: 'Your LDL cholesterol level of 145 mg/dL is above the optimal range and may increase cardiovascular risk.',
      severity: 'medium',
      actionRequired: true,
    },
    {
      id: '2',
      documentId: '4',
      type: 'risk_factor',
      title: 'Stage 1 Hypertension Detected',
      description: 'Blood pressure reading of 128/82 mmHg indicates stage 1 hypertension requiring monitoring.',
      severity: 'medium',
      actionRequired: true,
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDocuments(mockDocuments);
      setMessages(mockMessages);
      setInsights(mockInsights);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'I understand your question about your health records. Let me analyze the relevant documents and provide you with a comprehensive answer based on your medical history.',
        timestamp: new Date().toISOString(),
        followUpQuestions: [
          'Would you like more details about this?',
          'Should we discuss this with your doctor?',
          'Are there any other concerns?',
        ],
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsUploading(true);
    
    // Simulate file upload process
    setTimeout(() => {
      const newDocument: HealthDocument = {
        id: Date.now().toString(),
        name: files[0].name,
        type: 'other',
        uploadedAt: new Date().toISOString(),
        size: files[0].size,
        format: files[0].name.split('.').pop()?.toUpperCase() || 'UNKNOWN',
        status: 'processing',
        category: 'Uploaded',
        confidenceScore: 0,
        isShared: false,
        tags: ['new', 'uploaded'],
      };
      
      setDocuments(prev => [...prev, newDocument]);
      setIsUploading(false);
      
      // Simulate processing completion
      setTimeout(() => {
        setDocuments(prev => 
          prev.map(doc => 
            doc.id === newDocument.id 
              ? { ...doc, status: 'ready', aiSummary: 'Document processed successfully. AI analysis complete.' }
              : doc
          )
        );
      }, 3000);
    }, 1000);
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'lab_result': return BeakerIcon;
      case 'imaging': return FilmIcon;
      case 'prescription': return DocumentIcon;
      case 'visit_note': return DocumentTextIcon;
      case 'insurance': return FolderIcon;
      default: return DocumentIcon;
    }
  };

  const getDocumentColor = (type: string) => {
    switch (type) {
      case 'lab_result': return 'text-green-400';
      case 'imaging': return 'text-blue-400';
      case 'prescription': return 'text-purple-400';
      case 'visit_note': return 'text-orange-400';
      case 'insurance': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'border-green-500/30 bg-green-500/10 text-green-300';
      case 'medium': return 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300';
      case 'high': return 'border-orange-500/30 bg-orange-500/10 text-orange-300';
      case 'critical': return 'border-red-500/30 bg-red-500/10 text-red-300';
      default: return 'border-gray-500/30 bg-gray-500/10 text-gray-300';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 bg-mesh min-h-screen animate-fade-in">
        <div className="animate-pulse">
          <div className="h-8 dark-elevated rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96 dark-elevated rounded-xl"></div>
            <div className="h-96 dark-elevated rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-mesh min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between animate-slide-up">
        <div>
          <h1 className="heading-large text-white mb-2">AI Health Records Chat</h1>
          <p className="body-large">Ask questions about your medical documents and get AI-powered insights</p>
          <div className="mt-2 mono-text text-gray-500 text-sm">
            {documents.length} documents uploaded • AI confidence: 95%
          </div>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-outline"
            disabled={isUploading}
          >
            <CloudArrowUpIcon className="w-5 h-5 mr-2" />
            {isUploading ? 'Uploading...' : 'Upload Document'}
          </button>
          <Link href="/patient/ai-chat" className="btn-primary">
            <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
            General AI Chat
          </Link>
        </div>
      </div>

      {/* Key Insights */}
      {insights.length > 0 && (
        <div className="card p-6 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 mediva-gradient rounded-2xl flex items-center justify-center ai-glow">
                <span className="text-white font-bold">✦</span>
              </div>
              <h3 className="heading-small text-white">Key Health Insights</h3>
            </div>
            <span className="text-sm text-gray-400 mono-text">AI-generated from your records</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map(insight => (
              <div
                key={insight.id}
                className={`p-4 rounded-xl border-2 ${getSeverityColor(insight.severity)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold">{insight.title}</h4>
                  {insight.actionRequired && (
                    <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded-full">
                      Action Required
                    </span>
                  )}
                </div>
                <p className="text-sm opacity-90 mb-3">{insight.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs opacity-60">
                    From: {documents.find(d => d.id === insight.documentId)?.name}
                  </span>
                  <button className="text-xs btn-primary px-3 py-1">
                    Discuss with AI
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chat Interface */}
        <div className="lg:col-span-2 card p-6 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <h3 className="heading-small text-white">Chat with AI Assistant</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm text-green-400 mono-text">AI Online</span>
            </div>
          </div>
          
          {/* Messages */}
          <div className="h-96 overflow-y-auto space-y-4 mb-6 pr-2">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    message.type === 'user'
                      ? 'mediva-gradient text-white'
                      : 'glass border border-gray-600/30 text-gray-100'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {message.type === 'ai' && (
                      <div className="w-6 h-6 mediva-gradient rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-xs font-bold">✦</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="leading-relaxed">{message.content}</p>
                      
                      {message.sourceReferences && message.sourceReferences.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-600/30">
                          <p className="text-xs text-gray-400 mb-2">Sources:</p>
                          {message.sourceReferences.map((ref, index) => (
                            <div key={index} className="text-xs p-2 bg-black/20 rounded-lg mb-1">
                              <div className="flex items-center justify-between">
                                <span className="text-blue-300">
                                  {documents.find(d => d.id === ref.documentId)?.name}
                                </span>
                                <span className="text-green-400">{ref.confidence}% confidence</span>
                              </div>
                              <p className="text-gray-300 mt-1">"{ref.excerpt}"</p>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {message.followUpQuestions && message.followUpQuestions.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-600/30">
                          <p className="text-xs text-gray-400 mb-2">Suggested questions:</p>
                          <div className="space-y-1">
                            {message.followUpQuestions.map((question, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentMessage(question)}
                                className="block w-full text-left text-xs p-2 hover:bg-white/5 rounded transition-colors text-blue-300 hover:text-blue-200"
                              >
                                {question}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="text-xs text-gray-500 mt-2 mono-text">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="glass border border-gray-600/30 p-4 rounded-2xl">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 mediva-gradient rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✦</span>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Message Input */}
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about your health records..."
              className="flex-1 input"
              disabled={isTyping}
            />
            <button
              onClick={handleSendMessage}
              disabled={!currentMessage.trim() || isTyping}
              className="btn-primary px-4 py-3"
            >
              <SparklesIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Documents Sidebar */}
        <div className="space-y-6 animate-slide-up">
          {/* Document Upload */}
          <div className="card p-6">
            <h3 className="heading-small text-white mb-4">Upload Documents</h3>
            
            <div
              className="border-2 border-dashed border-gray-600/50 rounded-xl p-6 text-center cursor-pointer hover:border-gray-500/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-300 mb-2">
                {isUploading ? 'Uploading...' : 'Click to upload or drag files here'}
              </p>
              <p className="text-xs text-gray-500 mono-text">
                PDF, JPG, PNG up to 10MB
              </p>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Document List */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="heading-small text-white">Your Documents</h3>
              <span className="text-sm text-gray-400 mono-text">{documents.length} files</span>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {documents.map(doc => {
                const DocIcon = getDocumentIcon(doc.type);
                return (
                  <div
                    key={doc.id}
                    className={`p-3 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      selectedDocument === doc.id
                        ? 'border-blue-500/50 bg-blue-500/10'
                        : 'border-gray-600/30 hover:border-gray-500/50'
                    }`}
                    onClick={() => setSelectedDocument(selectedDocument === doc.id ? null : doc.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <DocIcon className={`w-5 h-5 mt-0.5 ${getDocumentColor(doc.type)}`} />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white text-sm truncate">{doc.name}</h4>
                        <div className="flex items-center space-x-2 text-xs text-gray-400 mt-1">
                          <span>{doc.format}</span>
                          <span>•</span>
                          <span>{formatFileSize(doc.size)}</span>
                          {doc.confidenceScore && (
                            <>
                              <span>•</span>
                              <span className="text-green-400">{doc.confidenceScore}% AI</span>
                            </>
                          )}
                        </div>
                        {doc.status === 'processing' && (
                          <div className="flex items-center space-x-1 mt-1">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                            <span className="text-xs text-blue-400">Processing...</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {selectedDocument === doc.id && doc.status === 'ready' && (
                      <div className="mt-3 pt-3 border-t border-gray-600/30 animate-fade-in">
                        {doc.aiSummary && (
                          <div className="mb-3">
                            <p className="text-xs font-semibold text-white mb-1">AI Summary</p>
                            <p className="text-xs text-gray-300 leading-relaxed">{doc.aiSummary}</p>
                          </div>
                        )}
                        
                        {doc.keyFindings && doc.keyFindings.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs font-semibold text-white mb-1">Key Findings</p>
                            <div className="space-y-1">
                              {doc.keyFindings.map((finding, index) => (
                                <div key={index} className="flex items-start space-x-1">
                                  <div className="w-1 h-1 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></div>
                                  <span className="text-xs text-gray-300">{finding}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-2">
                          <button className="text-xs btn-outline px-2 py-1">
                            <EyeIcon className="w-3 h-3 mr-1" />
                            View
                          </button>
                          <button className="text-xs btn-outline px-2 py-1">
                            <ChatBubbleLeftRightIcon className="w-3 h-3 mr-1" />
                            Ask AI
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card p-6">
            <h3 className="heading-small text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full btn-secondary text-sm p-3">
                <BoltIcon className="w-4 h-4 mr-2" />
                Generate Health Summary
              </button>
              <button className="w-full btn-outline text-sm p-3">
                <ShareIcon className="w-4 h-4 mr-2" />
                Share with Provider
              </button>
              <button className="w-full btn-outline text-sm p-3">
                <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                Export All Documents
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 