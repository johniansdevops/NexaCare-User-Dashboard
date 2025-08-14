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

  return (
    <div className="h-[calc(100vh-4rem)] flex bg-white">
      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BoltIcon className="w-8 h-8 text-purple-500" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">AI Health Assistant</h2>
                <p className="text-sm text-gray-600">
                  Mode: {chatModes.find(m => m.id === selectedMode)?.name}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden btn-outline px-3 py-2"
            >
              Settings
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] ${
                  message.sender === 'user'
                    ? 'mediva-gradient text-white rounded-2xl rounded-br-md shadow-md'
                    : 'bg-white text-gray-900 rounded-2xl rounded-bl-md shadow-md border border-gray-200'
                } p-4`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                
                {message.sender === 'ai' && message.confidence && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Confidence: {message.confidence}%</span>
                      <span>{formatDateTime(message.timestamp)}</span>
                    </div>
                    {message.sources && (
                      <div className="mt-1 text-xs text-gray-400">
                        Sources: {message.sources.join(', ')}
                      </div>
                    )}
                  </div>
                )}
                
                {message.sender === 'user' && (
                  <div className="mt-2 text-xs text-white/80 text-right">
                    {formatDateTime(message.timestamp)}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-900 rounded-2xl rounded-bl-md p-4 shadow-md border border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-600">AI is typing...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompts */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex flex-wrap gap-2 mb-4">
            {quickPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handleQuickPrompt(prompt)}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors border border-gray-200"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Message input */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about your health, symptoms, medications..."
                className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 resize-none"
                rows={2}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="btn-primary p-3"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Press Enter to send, Shift+Enter for new line. This AI provides educational information only.
          </p>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`w-80 bg-white border-l border-gray-200 transition-transform lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Chat Modes</h3>
          <div className="space-y-2">
            {chatModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  selectedMode === mode.id
                    ? 'bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200'
                    : 'hover:bg-gray-50 border border-gray-100'
                }`}
              >
                <mode.icon className={`w-6 h-6 ${
                  selectedMode === mode.id 
                    ? 'text-purple-600' 
                    : mode.color
                }`} />
                <div className="text-left">
                  <div className={`font-medium ${
                    selectedMode === mode.id ? 'text-gray-900' : 'text-gray-700'
                  }`}>{mode.name}</div>
                  <div className="text-xs text-gray-500">{mode.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Patient context */}
        <div className="p-4 border-b border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Your Health Context</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Age:</span>
              <span className="text-gray-900 font-medium">
                {user?.date_of_birth ? 
                  new Date().getFullYear() - new Date(user.date_of_birth).getFullYear() : 
                  'Not provided'
                }
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Last Check-up:</span>
              <span className="text-gray-900 font-medium">2 months ago</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Health Score:</span>
              <span className="text-green-600 font-medium">85/100</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Active Medications:</span>
              <span className="text-gray-900 font-medium">3</span>
            </div>
          </div>
        </div>

        {/* Conversation history */}
        <div className="p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Conversations</h4>
          <div className="space-y-2">
            {[
              { title: 'Blood pressure questions', date: '2 days ago', type: 'general' },
              { title: 'Medication interactions', date: '1 week ago', type: 'medication' },
              { title: 'Lab results review', date: '2 weeks ago', type: 'lab' },
            ].map((conversation, index) => (
              <button
                key={index}
                className="w-full text-left p-2 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
              >
                <div className="text-sm text-gray-900 font-medium">{conversation.title}</div>
                <div className="text-xs text-gray-500">{conversation.date}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="text-sm font-medium text-yellow-800 mb-1">Important Notice</h5>
                <p className="text-xs text-yellow-700">
                  This AI provides educational information only and cannot replace professional medical advice. 
                  For emergencies, call 911 immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 