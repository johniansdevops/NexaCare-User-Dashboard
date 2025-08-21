'use client';

import { useState } from 'react';
import {
  UserIcon,
  CogIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  PencilIcon,
  BellIcon,
  ShieldCheckIcon,
  EyeIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CalendarIcon,
  IdentificationIcon,
  HeartIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

type TabType = 'profile' | 'settings' | 'help' | 'signout';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  // Mock user data - in real app this would come from auth context
  const user = {
    full_name: 'Benaiah Johnson',
    email: 'benaiah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    date_of_birth: '1990-01-15',
    address: '123 Health Street, Medical City, MC 12345',
    insurance: 'BlueCross BlueShield - Premium Plan',
    emergency_contact: 'Sarah Johnson (Sister) - +1 (555) 987-6543',
    health_score: 85,
    last_checkup: '2025-01-05',
    profile_picture: null,
    member_since: '2023-06-15',
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'settings', label: 'Settings', icon: CogIcon },
    { id: 'help', label: 'Help & Support', icon: QuestionMarkCircleIcon },
    { id: 'signout', label: 'Sign Out', icon: ArrowRightOnRectangleIcon },
  ];

  const handleSignOut = () => {
    console.log('Sign out clicked');
    // Add actual sign out logic here
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-3xl font-bold text-white">
                      {user.full_name.charAt(0)}
                    </span>
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center shadow-md hover:shadow-lg transition-shadow">
                    <PencilIcon className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{user.full_name}</h2>
                  <p className="text-purple-600 font-medium">Premium Member</p>
                  <div className="flex items-center mt-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Active since {new Date(user.member_since).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600">{user.health_score}</div>
                  <p className="text-sm text-gray-600">Health Score</p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                <button className="flex items-center text-purple-600 hover:text-purple-700 text-sm font-medium">
                  <PencilIcon className="w-4 h-4 mr-1" />
                  Edit
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <EnvelopeIcon className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <PhoneIcon className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{user.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Date of Birth</p>
                      <p className="font-medium">{new Date(user.date_of_birth).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPinIcon className="w-5 h-5 text-gray-400 mr-3 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-medium">{user.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <IdentificationIcon className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Insurance</p>
                      <p className="font-medium">{user.insurance}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <HeartIcon className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Emergency Contact</p>
                      <p className="font-medium">{user.emergency_contact}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Health Summary */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center">
                    <CheckCircleIcon className="w-6 h-6 text-green-500 mr-3" />
                    <div>
                      <p className="text-sm text-green-600">Health Score</p>
                      <p className="text-2xl font-bold text-green-700">{user.health_score}/100</p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center">
                    <CalendarIcon className="w-6 h-6 text-blue-500 mr-3" />
                    <div>
                      <p className="text-sm text-blue-600">Last Checkup</p>
                      <p className="text-lg font-semibold text-blue-700">
                        {new Date(user.last_checkup).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center">
                    <HeartIcon className="w-6 h-6 text-purple-500 mr-3" />
                    <div>
                      <p className="text-sm text-purple-600">Next Appointment</p>
                      <p className="text-lg font-semibold text-purple-700">Jan 15, 2025</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            {/* Notification Settings */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <BellIcon className="w-6 h-6 text-purple-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Appointment Reminders</p>
                    <p className="text-sm text-gray-600">Get notified about upcoming appointments</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-purple-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6"></span>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Health Insights</p>
                    <p className="text-sm text-gray-600">Receive AI-powered health recommendations</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-purple-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6"></span>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Marketing Communications</p>
                    <p className="text-sm text-gray-600">Updates about new features and health tips</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1"></span>
                  </button>
                </div>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <ShieldCheckIcon className="w-6 h-6 text-purple-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Privacy & Security</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Profile Visibility</p>
                    <p className="text-sm text-gray-600">Who can see your profile information</p>
                  </div>
                  <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                    <option>Healthcare Providers Only</option>
                    <option>Private</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Data Sharing</p>
                    <p className="text-sm text-gray-600">Share anonymized data for research</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-purple-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6"></span>
                  </button>
                </div>
              </div>
            </div>

            {/* App Preferences */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <ComputerDesktopIcon className="w-6 h-6 text-purple-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">App Preferences</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Theme</p>
                    <p className="text-sm text-gray-600">Choose your preferred theme</p>
                  </div>
                  <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                    <option>Light</option>
                    <option>Dark</option>
                    <option>System</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Language</p>
                    <p className="text-sm text-gray-600">Select your preferred language</p>
                  </div>
                  <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                    <option>English (US)</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 'help':
        return (
          <div className="space-y-6">
            {/* Quick Help */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Help</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="text-left p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all duration-200">
                  <ChatBubbleLeftRightIcon className="w-6 h-6 text-purple-600 mb-2" />
                  <h4 className="font-medium mb-1">How to book an appointment</h4>
                  <p className="text-sm text-gray-600">Learn how to schedule video consultations</p>
                </button>
                <button className="text-left p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all duration-200">
                  <HeartIcon className="w-6 h-6 text-purple-600 mb-2" />
                  <h4 className="font-medium mb-1">Understanding your health score</h4>
                  <p className="text-sm text-gray-600">What your health score means</p>
                </button>
                <button className="text-left p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all duration-200">
                  <DocumentTextIcon className="w-6 h-6 text-purple-600 mb-2" />
                  <h4 className="font-medium mb-1">Accessing medical records</h4>
                  <p className="text-sm text-gray-600">View and download your health records</p>
                </button>
                <button className="text-left p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all duration-200">
                  <DevicePhoneMobileIcon className="w-6 h-6 text-purple-600 mb-2" />
                  <h4 className="font-medium mb-1">Video call setup</h4>
                  <p className="text-sm text-gray-600">Prepare for your video consultation</p>
                </button>
              </div>
            </div>

            {/* Contact Support */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Support</h3>
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <ChatBubbleLeftRightIcon className="w-6 h-6 text-blue-600 mr-3" />
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-900">Live Chat</h4>
                    <p className="text-sm text-blue-700">Chat with our support team</p>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    Start Chat
                  </button>
                </div>
                <div className="flex items-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <PhoneIcon className="w-6 h-6 text-green-600 mr-3" />
                  <div className="flex-1">
                    <h4 className="font-medium text-green-900">Phone Support</h4>
                    <p className="text-sm text-green-700">Call us at +1 (888) NEXACARE</p>
                  </div>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                    Call Now
                  </button>
                </div>
                <div className="flex items-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <EnvelopeIcon className="w-6 h-6 text-purple-600 mr-3" />
                  <div className="flex-1">
                    <h4 className="font-medium text-purple-900">Email Support</h4>
                    <p className="text-sm text-purple-700">Send us an email for detailed help</p>
                  </div>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                    Send Email
                  </button>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>
              <div className="space-y-3">
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-gray-50">
                    <span className="font-medium">How do I prepare for a video consultation?</span>
                    <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="p-3 text-sm text-gray-600">
                    Ensure you have a stable internet connection, test your camera and microphone, and have your medical information ready.
                  </div>
                </details>
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-gray-50">
                    <span className="font-medium">Can I reschedule my appointment?</span>
                    <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="p-3 text-sm text-gray-600">
                    Yes, you can reschedule up to 24 hours before your appointment through the appointments page.
                  </div>
                </details>
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-gray-50">
                    <span className="font-medium">How is my health score calculated?</span>
                    <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="p-3 text-sm text-gray-600">
                    Your health score is calculated based on various factors including vital signs, lifestyle habits, and medical history.
                  </div>
                </details>
              </div>
            </div>
          </div>
        );

      case 'signout':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRightOnRectangleIcon className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sign Out</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to sign out of your NexaCare account?</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setActiveTab('profile')}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSignOut}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/30 via-purple-50/30 to-blue-50/30">
      <div className="max-w-6xl mx-auto p-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-2">
            Profile & Settings
          </h1>
          <p className="text-gray-600">Manage your account, preferences, and get help</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:w-64">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-pink-50 to-purple-50 text-purple-700 border border-purple-200'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className={`w-5 h-5 mr-3 ${
                      activeTab === tab.id ? 'text-purple-600' : 'text-gray-400'
                    }`} />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
} 