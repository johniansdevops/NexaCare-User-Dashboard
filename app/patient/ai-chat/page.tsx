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
    color: 'text-pink-500',
  },
  {
    id: 'symptom',
    name: 'Symptom Checker',
    icon: ExclamationTriangleIcon,
    description: 'Analyze symptoms and get triage guidance',
    color: 'text-red-500',
  },
  {
    id: 'medication',
    name: 'Medication Guide',
    icon: CubeIcon,
    description: 'Medication information and interactions',
    color: 'text-blue-500',
  },
  {
    id: 'lab',
    name: 'Lab Results',
    icon: BeakerIcon,
    description: 'Help understand your lab results',
    color: 'text-green-500',
  },
  {
    id: 'prevention',
    name: 'Preventive Care',
    icon: ShieldCheckIcon,
    description: 'Preventive health tips and screenings',
    color: 'text-purple-500',
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
      content: `Hello ${user?.full_name?.split(' ')[0]}! I'm your AI health assistant. I'm here to help answer your health questions and provide guidance. How can I assist you today?

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

1. **Immediate steps**: Monitor your symptoms and note any changes
2. **When to seek care**: Contact your healthcare provider if symptoms persist or worsen
3. **Self-care**: Stay hydrated, get adequate rest, and maintain good hygiene

**Important**: This information is for educational purposes only. Please consult with your healthcare provider for personalized medical advice.`,

      symptom: `I understand you're experiencing some symptoms. Let me help analyze this:

**Symptom Assessment**:
- Your described symptoms could have several potential causes
- Most common causes are typically benign, but it's important to monitor

**Red Flag Signs to Watch For**:
- Severe or worsening symptoms
- Fever above 101°F (38.3°C)
- Difficulty breathing
- Persistent pain

**Recommended Action**:
Based on what you've described, I recommend contacting your healthcare provider for a proper evaluation, especially if symptoms persist.

**Urgency Level**: Low to Medium - Schedule an appointment within 1-2 days`,

      medication: `Regarding your medication question:

**General Information**:
This medication is commonly prescribed for your condition and is generally well-tolerated.

**Important Considerations**:
- Take as prescribed by your healthcare provider
- Do not stop or change dosage without consulting your doctor
- Be aware of potential side effects

**Drug Interactions**:
Always inform your healthcare providers about all medications you're taking, including over-the-counter drugs and supplements.

**Next Steps**:
If you have specific concerns about your medications, please discuss them with your prescribing physician or pharmacist.`,

      lab: `I can help explain your lab results in simple terms:

**Understanding Your Results**:
Lab values can vary based on many factors including time of day, recent meals, and individual baseline levels.

**Normal vs. Abnormal**:
- Values within the reference range are typically considered normal
- Slightly outside ranges may not always indicate a problem
- Trends over time are often more important than single values

**Important**: Lab results should always be interpreted by your healthcare provider who knows your complete medical history. Please schedule a follow-up to discuss your results in detail.`,

      prevention: `Great question about preventive care! Here's what I recommend:

**Age-Appropriate Screenings**:
Based on your age and risk factors, you may be due for certain health screenings.

**Lifestyle Factors**:
- Regular exercise (150 minutes moderate activity per week)
- Balanced nutrition with plenty of fruits and vegetables
- Adequate sleep (7-9 hours per night)
- Stress management
- Avoiding tobacco and limiting alcohol

**Vaccinations**:
Stay up to date with recommended vaccines for your age group.

**Regular Check-ups**:
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
      content: `Hello ${user?.full_name?.split(' ')[0]}! I'm your AI health assistant. I'm here to help answer your health questions and provide guidance. How can I assist you today?

Please remember that I'm here to provide educational information and support, but I cannot replace professional medical advice. For urgent concerns, please contact your healthcare provider or call emergency services.`,
      sender: 'ai',
      timestamp: new Date().toISOString(),
      confidence: 100,
    }]);
  };

  return (
    <div className="h-screen flex bg-white relative">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <BoltIcon className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">AI Health Assistant</h2>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-md hover:bg-gray-100 transition-colors"
            >
              <XMarkIcon className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* New Chat Button */}
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={startNewChat}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              <span>New Chat</span>
            </button>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Recent Conversations</h3>
            <div className="space-y-2">
              {chatHistory.map((chat) => (
                <button
                  key={chat.id}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="text-sm text-gray-900 font-medium line-clamp-1">{chat.title}</div>
                  <div className="text-xs text-gray-500 mt-1">{chat.date} • {chat.messages} messages</div>
                </button>
              ))}
            </div>
          </div>

          {/* AI Modes */}
          <div className="p-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">AI Modes</h3>
            <div className="grid grid-cols-2 gap-2">
              {chatModes.slice(0, 4).map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setSelectedMode(mode.id)}
                  className={`flex flex-col items-center p-2 rounded-lg text-xs transition-colors ${
                    selectedMode === mode.id
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  <mode.icon className="w-4 h-4 mb-1" />
                  <span>{mode.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <Bars3Icon className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">✦</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">AI Health Assistant</h2>
                <p className="text-xs text-gray-500">
                  {chatModes.find(m => m.id === selectedMode)?.name} Mode
                </p>
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {messages.length - 1} messages
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-[85%] ${
                message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.sender === 'user' 
                    ? 'bg-gray-200' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-600'
                }`}>
                  {message.sender === 'user' ? (
                    <UserIcon className="w-4 h-4 text-gray-600" />
                  ) : (
                    <span className="text-white text-sm font-medium">✦</span>
                  )}
                </div>
                <div className={`flex-1 ${
                  message.sender === 'user' ? 'text-right' : 'text-left'
                }`}>
                  <div className={`inline-block p-4 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-50 text-gray-900 border border-gray-200'
                  }`}>
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>
                  <div className={`mt-1 text-xs text-gray-500 ${
                    message.sender === 'user' ? 'text-right' : 'text-left'
                  }`}>
                    {formatDateTime(message.timestamp)}
                    {message.sender === 'ai' && message.confidence && (
                      <span className="ml-2">• {message.confidence}% confidence</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3 max-w-[85%]">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">✦</span>
                </div>
                <div className="flex-1">
                  <div className="inline-block p-4 rounded-2xl bg-gray-50 border border-gray-200">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-gray-600">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>


        {/* Message input */}
        <div className="border-t border-gray-200 bg-white sticky bottom-0">
          <div className="p-4">
            <div className="flex items-end space-x-3 max-w-4xl mx-auto">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Message AI Health Assistant..."
                  className="w-full p-4 pr-12 bg-white border border-gray-300 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none shadow-sm"
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
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-all duration-200 ${
                    inputMessage.trim() && !isTyping
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <PaperAirplaneIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center max-w-4xl mx-auto">
              AI can make mistakes. This AI provides educational information only and cannot replace professional medical advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
