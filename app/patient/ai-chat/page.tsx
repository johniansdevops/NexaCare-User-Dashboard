'use client';

import { useState, useRef, useEffect } from 'react';
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  BoltIcon,
  HeartIcon,
  BeakerIcon,
  CubeIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  UserIcon,
  DocumentTextIcon,
  Bars3Icon,
  PlusIcon,
  XMarkIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { formatDateTime } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
  confidence?: number;
  sources?: string[];
  intent?: string;
}

const chatModes = [
  {
    id: 'general',
    name: 'General Health',
    icon: HeartIcon,
    description: 'General health questions and guidance',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    id: 'symptom',
    name: 'Symptom Checker',
    icon: ExclamationTriangleIcon,
    description: 'Analyze symptoms and get triage guidance',
    gradient: 'from-red-500 to-orange-500',
  },
  {
    id: 'medication',
    name: 'Medication Guide',
    icon: CubeIcon,
    description: 'Medication information and interactions',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'lab',
    name: 'Lab Results',
    icon: BeakerIcon,
    description: 'Help understand your lab results',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    id: 'prevention',
    name: 'Preventive Care',
    icon: ShieldCheckIcon,
    description: 'Preventive health tips and screenings',
    gradient: 'from-purple-500 to-violet-500',
  },
];

const quickPrompts = [
  "What should I do about a persistent headache?",
  "Explain my blood test results",
  "Are my medications safe together?",
  "When should I see a doctor?",
  "How can I improve my sleep?",
  "What vaccinations do I need?",
];

export default function PatientAIChat() {
  // Mock user data for demo purposes
  const user = {
    full_name: 'John Doe',
    date_of_birth: '1990-01-01',
    age: 34,
    medicalHistory: ['Hypertension', 'Type 2 Diabetes'],
    allergies: ['Penicillin', 'Shellfish'],
    currentMedications: ['Lisinopril 10mg', 'Metformin 500mg']
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hello ${user?.full_name?.split(' ')[0]}! ✨ I'm your AI health assistant. I'm here to help answer your health questions and provide guidance. How can I assist you today?

Please remember that I'm here to provide educational information and support, but I cannot replace professional medical advice. For urgent concerns, please contact your healthcare provider or call emergency services.`,
      sender: 'ai',
      timestamp: new Date().toISOString(),
      confidence: 100,
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedMode, setSelectedMode] = useState('general');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { id: '1', title: 'Blood pressure questions', date: '2 days ago', messages: 5 },
    { id: '2', title: 'Medication interactions', date: '1 week ago', messages: 8 },
    { id: '3', title: 'Lab results review', date: '2 weeks ago', messages: 12 },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(inputMessage, selectedMode),
        sender: 'ai',
        timestamp: new Date().toISOString(),
        confidence: Math.floor(Math.random() * 20) + 80, // 80-100%
        sources: ['Medical literature', 'Clinical guidelines'],
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const generateAIResponse = (message: string, mode: string): string => {
    // This is a mock response - replace with actual AI integration
    const responses = {
      general: `Based on your question about "${message}", here's what I can tell you:

This is a common health concern that many people experience. Here are some general recommendations:

**🔍 Immediate steps**: Monitor your symptoms and note any changes
**🏥 When to seek care**: Contact your healthcare provider if symptoms persist or worsen  
**💙 Self-care**: Stay hydrated, get adequate rest, and maintain good hygiene

**⚠️ Important**: This information is for educational purposes only. Please consult with your healthcare provider for personalized medical advice.`,

      symptom: `I understand you're experiencing some symptoms. Let me help analyze this:

**📋 Symptom Assessment**:
- Your described symptoms could have several potential causes
- Most common causes are typically benign, but it's important to monitor

**🚨 Red Flag Signs to Watch For**:
- Severe or worsening symptoms
- Fever above 101°F (38.3°C)
- Difficulty breathing
- Persistent pain

**📞 Recommended Action**:
Based on what you've described, I recommend contacting your healthcare provider for a proper evaluation, especially if symptoms persist.

**⏰ Urgency Level**: Low to Medium - Schedule an appointment within 1-2 days`,

      medication: `Regarding your medication question:

**💊 General Information**:
This medication is commonly prescribed for your condition and is generally well-tolerated.

**⚠️ Important Considerations**:
- Take as prescribed by your healthcare provider
- Do not stop or change dosage without consulting your doctor
- Be aware of potential side effects

**🔄 Drug Interactions**:
Always inform your healthcare providers about all medications you're taking, including over-the-counter drugs and supplements.

**📋 Next Steps**:
If you have specific concerns about your medications, please discuss them with your prescribing physician or pharmacist.`,

      lab: `I can help explain your lab results in simple terms:

**🔬 Understanding Your Results**:
Lab values can vary based on many factors including time of day, recent meals, and individual baseline levels.

**📊 Normal vs. Abnormal**:
- Values within the reference range are typically considered normal
- Slightly outside ranges may not always indicate a problem
- Trends over time are often more important than single values

**👨‍⚕️ Important**: Lab results should always be interpreted by your healthcare provider who knows your complete medical history. Please schedule a follow-up to discuss your results in detail.`,

      prevention: `Great question about preventive care! Here's what I recommend:

**🔍 Age-Appropriate Screenings**:
Based on your age and risk factors, you may be due for certain health screenings.

**🏃‍♀️ Lifestyle Factors**:
- Regular exercise (150 minutes moderate activity per week)
- Balanced nutrition with plenty of fruits and vegetables
- Adequate sleep (7-9 hours per night)
- Stress management
- Avoiding tobacco and limiting alcohol

**💉 Vaccinations**:
Stay up to date with recommended vaccines for your age group.

**🩺 Regular Check-ups**:
Schedule annual wellness visits with your healthcare provider to stay on top of your health.`,
    };

    return responses[mode as keyof typeof responses] || responses.general;
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputMessage(prompt);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startNewChat = () => {
    setMessages([{
      id: '1',
      content: `Hello ${user?.full_name?.split(' ')[0]}! ✨ I'm your AI health assistant. I'm here to help answer your health questions and provide guidance. How can I assist you today?

Please remember that I'm here to provide educational information and support, but I cannot replace professional medical advice. For urgent concerns, please contact your healthcare provider or call emergency services.`,
      sender: 'ai',
      timestamp: new Date().toISOString(),
      confidence: 100,
    }]);
  };

  return (
    <div className="h-screen flex bg-gradient-light relative">
      {/* Enhanced Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 shadow-xl transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Enhanced Sidebar header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-pink-50 to-purple-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg animate-pulse">✦</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">AI Health Assistant</h2>
                <p className="text-xs text-gray-600">Powered by advanced AI</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-xl hover:bg-white hover:shadow-sm transition-all duration-200 text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Enhanced New Chat Button */}
          <div className="p-6 border-b border-gray-100">
            <button
              onClick={startNewChat}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium"
            >
              <PlusIcon className="w-5 h-5" />
              <span>New Chat</span>
            </button>
          </div>

          {/* Enhanced AI Modes */}
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
              <SparklesIcon className="w-4 h-4 mr-2 text-purple-500" />
              AI Specialized Modes
            </h3>
            <div className="space-y-2">
              {chatModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setSelectedMode(mode.id)}
                  className={`w-full flex items-center p-3 rounded-xl text-sm transition-all duration-200 ${
                    selectedMode === mode.id
                      ? 'bg-gradient-to-r from-pink-50 to-purple-50 border border-purple-200 shadow-sm'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${mode.gradient} flex items-center justify-center mr-3 shadow-sm`}>
                    <mode.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <div className={`font-medium ${selectedMode === mode.id ? 'text-purple-700' : 'text-gray-700'}`}>
                      {mode.name}
                    </div>
                    <div className="text-xs text-gray-500 line-clamp-1">{mode.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Enhanced Chat History */}
          <div className="flex-1 overflow-y-auto p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
              <ClockIcon className="w-4 h-4 mr-2 text-gray-500" />
              Recent Conversations
            </h3>
            <div className="space-y-2">
              {chatHistory.map((chat) => (
                <button
                  key={chat.id}
                  className="w-full text-left p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 group border border-transparent hover:border-gray-200 hover:shadow-sm"
                >
                  <div className="text-sm text-gray-900 font-medium line-clamp-1 group-hover:text-purple-700 transition-colors">
                    {chat.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{chat.date} • {chat.messages} messages</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Enhanced Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Enhanced Chat header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white shadow-sm">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 text-gray-600 hover:text-purple-600"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white text-lg font-bold icon-ai-glow">✦</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">AI Health Assistant</h2>
                <p className="text-sm text-gray-600 flex items-center">
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${chatModes.find(m => m.id === selectedMode)?.gradient} mr-2`}></div>
                  {chatModes.find(m => m.id === selectedMode)?.name} Mode
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {messages.length - 1} messages
            </div>
          </div>
        </div>

        {/* Enhanced Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-subtle">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-4 max-w-[85%] ${
                message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-md ${
                  message.sender === 'user' 
                    ? 'bg-gradient-to-br from-gray-100 to-gray-200' 
                    : 'bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500'
                }`}>
                  {message.sender === 'user' ? (
                    <UserIcon className="w-5 h-5 text-gray-600" />
                  ) : (
                    <span className="text-white text-lg font-bold animate-pulse">✦</span>
                  )}
                </div>
                <div className={`flex-1 ${
                  message.sender === 'user' ? 'text-right' : 'text-left'
                }`}>
                  <div className={`inline-block p-4 rounded-2xl shadow-sm ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white'
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}>
                    <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
                  </div>
                  <div className={`mt-2 text-xs text-gray-500 ${
                    message.sender === 'user' ? 'text-right' : 'text-left'
                  }`}>
                    {formatDateTime(message.timestamp)}
                    {message.sender === 'ai' && message.confidence && (
                      <span className="ml-2 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                        {message.confidence}% confidence
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-4 max-w-[85%]">
                <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 flex items-center justify-center shadow-md">
                  <span className="text-white text-lg font-bold animate-pulse">✦</span>
                </div>
                <div className="flex-1">
                  <div className="inline-block p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-gray-600 font-medium">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Enhanced Quick Prompts */}
        {messages.length === 1 && (
          <div className="px-6 py-4 bg-white border-t border-gray-100">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <BoltIcon className="w-4 h-4 mr-2 text-purple-500" />
                Quick Prompts to Get Started
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="text-left p-3 text-sm text-gray-700 bg-gray-50 rounded-xl hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 hover:border-purple-200 border border-transparent transition-all duration-200 hover:shadow-sm"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Message input */}
        <div className="border-t border-gray-200 bg-white sticky bottom-0 shadow-lg">
          <div className="p-6">
            <div className="flex items-end space-x-4 max-w-4xl mx-auto">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Message AI Health Assistant..."
                  className="w-full p-4 pr-14 bg-white border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 resize-none shadow-sm transition-all duration-200"
                  rows={1}
                  style={{ minHeight: '56px', maxHeight: '120px' }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-3 rounded-xl transition-all duration-200 shadow-md ${
                    inputMessage.trim() && !isTyping
                      ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white hover:shadow-lg hover:scale-105'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <PaperAirplaneIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center max-w-4xl mx-auto flex items-center justify-center">
              <ExclamationTriangleIcon className="w-4 h-4 mr-1 text-amber-500" />
              AI can make mistakes. This AI provides educational information only and cannot replace professional medical advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
