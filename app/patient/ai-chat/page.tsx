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
    gradient: 'from-pink-500 to-purple-500',
    iconColor: 'text-pink-500',
  },
  {
    id: 'symptom',
    name: 'Symptom Checker',
    icon: ExclamationTriangleIcon,
    description: 'Analyze symptoms and get triage guidance',
    gradient: 'from-red-500 to-pink-500',
    iconColor: 'text-red-500',
  },
  {
    id: 'medication',
    name: 'Medication Guide',
    icon: CubeIcon,
    description: 'Medication information and interactions',
    gradient: 'from-blue-500 to-purple-500',
    iconColor: 'text-blue-500',
  },
  {
    id: 'lab',
    name: 'Lab Results',
    icon: BeakerIcon,
    description: 'Help understand your lab results',
    gradient: 'from-green-500 to-blue-500',
    iconColor: 'text-green-500',
  },
  {
    id: 'prevention',
    name: 'Preventive Care',
    icon: ShieldCheckIcon,
    description: 'Preventive health tips and screenings',
    gradient: 'from-purple-500 to-pink-500',
    iconColor: 'text-purple-500',
  },
];

const quickPrompts = [
  "What should I do about a persistent headache?",
  "Explain my blood test results",
  "Are my medications safe together?",
  "How to strengthen my immune system?",
];

export default function PatientAIChat() {
  // Mock user data for demo purposes
  const user = {
    full_name: 'Benaiah',
    date_of_birth: '1990-01-01',
    age: 34,
    medicalHistory: ['Hypertension', 'Type 2 Diabetes'],
    allergies: ['Penicillin', 'Shellfish'],
    currentMedications: ['Lisinopril 10mg', 'Metformin 500mg']
  };

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedMode, setSelectedMode] = useState('general');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showModeSelection, setShowModeSelection] = useState(true);
  const [chatHistory, setChatHistory] = useState([
    { id: '1', title: 'Blood pressure management...', date: '10/08/2025', type: 'General Health' },
    { id: '2', title: 'Medication interactions...', date: '10/08/2025', type: 'Medication Guide' },
    { id: '3', title: 'Understanding lab results...', date: '10/08/2025', type: 'Lab Results' },
    { id: '4', title: 'Symptom assessment help...', date: '08/08/2025', type: 'Symptom Checker' },
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
    setShowModeSelection(false);

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
    setMessages([]);
    setShowModeSelection(true);
    setSelectedMode('general');
  };

  const handleModeSelect = (modeId: string) => {
    setSelectedMode(modeId);
    setShowModeSelection(false);
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      content: `Hello ${user?.full_name}! ✨ I'm NexaCare AI, your health assistant. I'm now in ${chatModes.find(m => m.id === modeId)?.name} mode. How can I assist you today?

Please remember that I'm here to provide educational information and support, but I cannot replace professional medical advice. For urgent concerns, please contact your healthcare provider or call emergency services.`,
      sender: 'ai',
      timestamp: new Date().toISOString(),
      confidence: 100,
    };
    setMessages([welcomeMessage]);
  };

  return (
    <div className="h-screen flex bg-white relative">
      {/* Chat History Sidebar */}
      <div className={`fixed inset-y-0 left-20 z-40 w-80 bg-white border-r border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">✦</span>
              </div>
              <span className="text-sm font-medium text-gray-600">Chat History</span>
            </div>
            <button
              onClick={startNewChat}
              className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg"
            >
              <PlusIcon className="w-4 h-4" />
              <span>New Chat</span>
            </button>
          </div>

          {/* Chat History List */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {chatHistory.map((chat) => (
                <button
                  key={chat.id}
                  className="w-full text-left p-3 rounded-lg hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-200 group border border-transparent hover:border-pink-200"
                >
                  <div className="text-sm text-gray-900 font-medium line-clamp-1 mb-1">
                    {chat.title}
                  </div>
                  <div className="text-xs text-gray-500">{chat.date}</div>
                  <div className="text-xs text-purple-500 mt-1 font-medium">{chat.type}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col lg:ml-80 xl:ml-80">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
            >
              <Bars3Icon className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold">✦</span>
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">NexaCare AI</h2>
                <p className="text-sm text-gray-500">Your Healthcare Assistant</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={startNewChat}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
            >
              <PlusIcon className="w-4 h-4" />
              <span>New Chat</span>
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-pink-50/30 via-purple-50/30 to-blue-50/30">
          {showModeSelection ? (
            // AI Mode Selection
            <div className="flex flex-col items-center justify-center h-full p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <span className="text-white font-bold text-2xl">✦</span>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-2">Hello {user.full_name}!</h1>
              <p className="text-gray-600 mb-8 text-center max-w-md">
                How can I assist you with your healthcare today?
              </p>

              {/* AI Mode Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl w-full mb-8">
                {chatModes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => handleModeSelect(mode.id)}
                    className="p-4 bg-white rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-200 text-left group transform hover:scale-105"
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${mode.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200 shadow-md`}>
                      <mode.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="font-semibold text-gray-800 mb-1">{mode.name}</div>
                    <div className="text-sm text-gray-600">{mode.description}</div>
                  </button>
                ))}
              </div>

              {/* Quick Prompts */}
              <div className="w-full max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {quickPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickPrompt(prompt)}
                      className="p-3 text-left bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-200 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Chat Messages
            <div className="p-6 space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-3 max-w-[85%] ${
                    message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-md ${
                      message.sender === 'user' 
                        ? 'bg-gradient-to-br from-gray-400 to-gray-500' 
                        : 'bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500'
                    }`}>
                      {message.sender === 'user' ? (
                        <span className="text-white text-sm font-bold">B</span>
                      ) : (
                        <span className="text-white text-sm font-bold">✦</span>
                      )}
                    </div>
                    <div className={`flex-1 ${
                      message.sender === 'user' ? 'text-right' : 'text-left'
                    }`}>
                      <div className={`inline-block p-4 rounded-2xl shadow-md ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                          : 'bg-white text-gray-900 border border-gray-200'
                      }`}>
                        <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
                      </div>
                      <div className={`mt-1 text-xs text-gray-500 ${
                        message.sender === 'user' ? 'text-right' : 'text-left'
                      }`}>
                        {formatDateTime(message.timestamp)}
                        {message.sender === 'ai' && message.confidence && (
                          <span className="ml-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium border border-green-200">
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
                  <div className="flex items-start space-x-3 max-w-[85%]">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 flex items-center justify-center shadow-md">
                      <span className="text-white text-sm font-bold">✦</span>
                    </div>
                    <div className="flex-1">
                      <div className="inline-block p-4 rounded-2xl bg-white border border-gray-200 shadow-md">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-sm text-gray-600">NexaCare is thinking...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 bg-white p-4">
          <div className="flex items-end space-x-3 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Ask me anything about your health... (${chatModes.find(m => m.id === selectedMode)?.name})`}
                className="w-full p-4 pr-12 bg-gray-50 border border-gray-300 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 resize-none transition-all duration-200"
                rows={1}
                style={{ minHeight: '52px', maxHeight: '120px' }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-all duration-200 shadow-md ${
                  inputMessage.trim() && !isTyping
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 hover:shadow-lg transform hover:scale-105'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <PaperAirplaneIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
