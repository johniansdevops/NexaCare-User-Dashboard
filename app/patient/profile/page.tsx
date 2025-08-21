'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CalendarIcon,
  IdentificationIcon,
  HeartIcon,
  ShieldCheckIcon,
  BellIcon,
  CogIcon,
  KeyIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PencilIcon,
  PhotoIcon,
  PlusIcon,
  TrashIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  SparklesIcon,
  DocumentTextIcon,
  InformationCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  avatar?: string;
  medicalId: string;
  bloodType?: string;
  allergies: string[];
  medications: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  insuranceInfo: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
  };
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  loginAlerts: boolean;
  dataSharing: boolean;
}

interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  appointments: boolean;
  medications: boolean;
  healthInsights: boolean;
}

export default function PatientProfile() {
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    loginAlerts: true,
    dataSharing: false,
  });
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email: true,
    sms: true,
    push: true,
    appointments: true,
    medications: true,
    healthInsights: false,
  });

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: UserIcon },
    { id: 'emergency', label: 'Emergency Contact', icon: PhoneIcon },
    { id: 'insurance', label: 'Insurance', icon: ShieldCheckIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
    { id: 'security', label: 'Security', icon: KeyIcon },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProfile({
        id: 'patient-001',
        firstName: 'Benaiah',
        lastName: 'Doe',
        email: 'benaiah.doe@email.com',
        phone: '+1 (555) 123-4567',
        dateOfBirth: '1990-01-01',
        gender: 'male',
        address: {
          street: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'United States',
        },
        medicalId: 'MED-2024-001234',
        bloodType: 'O+',
        allergies: ['Penicillin', 'Shellfish'],
        medications: ['Lisinopril 10mg', 'Vitamin D3'],
        emergencyContact: {
          name: 'Jane Doe',
          relationship: 'Spouse',
          phone: '+1 (555) 987-6543',
        },
        insuranceInfo: {
          provider: 'Blue Cross Blue Shield',
          policyNumber: 'ABC123456789',
          groupNumber: 'GRP001',
        },
      });
      setLoading(false);
    }, 1000);
  }, []);

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (profile) {
      setProfile({ ...profile, ...updates });
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              {profile?.avatar ? (
                <img src={profile.avatar} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
              ) : (
                <span className="text-white text-2xl font-bold">
                  {profile?.firstName[0]}{profile?.lastName[0]}
                </span>
              )}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
              <PhotoIcon className="w-4 h-4 text-white" />
            </button>
          </div>
          
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{profile?.firstName} {profile?.lastName}</h2>
            <p className="text-gray-600 mb-2">{profile && calculateAge(profile.dateOfBirth)} years old • {profile?.gender}</p>
            <p className="text-sm text-gray-500 font-mono">Medical ID: {profile?.medicalId}</p>
            {profile?.bloodType && (
              <p className="text-sm text-red-600 font-medium mt-1">Blood Type: {profile.bloodType}</p>
            )}
          </div>
          
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <PencilIcon className="w-4 h-4" />
            <span>{isEditing ? 'Save' : 'Edit'}</span>
          </button>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="flex items-center space-x-3">
              <EnvelopeIcon className="w-5 h-5 text-gray-400" />
              {isEditing ? (
                <input
                  type="email"
                  value={profile?.email || ''}
                  onChange={(e) => updateProfile({ email: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              ) : (
                <span className="text-gray-900">{profile?.email}</span>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <div className="flex items-center space-x-3">
              <PhoneIcon className="w-5 h-5 text-gray-400" />
              {isEditing ? (
                <input
                  type="tel"
                  value={profile?.phone || ''}
                  onChange={(e) => updateProfile({ phone: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              ) : (
                <span className="text-gray-900">{profile?.phone}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Address</h3>
        <div className="flex items-start space-x-3">
          <MapPinIcon className="w-5 h-5 text-gray-400 mt-1" />
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Street Address"
                  value={profile?.address.street || ''}
                  onChange={(e) => updateProfile({
                    address: { ...profile!.address, street: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="City"
                    value={profile?.address.city || ''}
                    onChange={(e) => updateProfile({
                      address: { ...profile!.address, city: e.target.value }
                    })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={profile?.address.state || ''}
                    onChange={(e) => updateProfile({
                      address: { ...profile!.address, state: e.target.value }
                    })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="ZIP Code"
                    value={profile?.address.zipCode || ''}
                    onChange={(e) => updateProfile({
                      address: { ...profile!.address, zipCode: e.target.value }
                    })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Country"
                    value={profile?.address.country || ''}
                    onChange={(e) => updateProfile({
                      address: { ...profile!.address, country: e.target.value }
                    })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            ) : (
              <div className="text-gray-900">
                <p>{profile?.address.street}</p>
                <p>{profile?.address.city}, {profile?.address.state} {profile?.address.zipCode}</p>
                <p>{profile?.address.country}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Health Information */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Health Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
            <div className="flex flex-wrap gap-2">
              {profile?.allergies.map((allergy, index) => (
                <span key={index} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm flex items-center">
                  {allergy}
                  {isEditing && (
                    <button
                      onClick={() => {
                        const newAllergies = profile.allergies.filter((_, i) => i !== index);
                        updateProfile({ allergies: newAllergies });
                      }}
                      className="ml-2 text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
              {isEditing && (
                <button className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors">
                  + Add Allergy
                </button>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Medications</label>
            <div className="flex flex-wrap gap-2">
              {profile?.medications.map((medication, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                  {medication}
                  {isEditing && (
                    <button
                      onClick={() => {
                        const newMedications = profile.medications.filter((_, i) => i !== index);
                        updateProfile({ medications: newMedications });
                      }}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
              {isEditing && (
                <button className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors">
                  + Add Medication
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmergencyContact = () => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Emergency Contact</h3>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
          <input
            type="text"
            value={profile?.emergencyContact.name || ''}
            onChange={(e) => updateProfile({
              emergencyContact: { ...profile!.emergencyContact, name: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
          <input
            type="text"
            value={profile?.emergencyContact.relationship || ''}
            onChange={(e) => updateProfile({
              emergencyContact: { ...profile!.emergencyContact, relationship: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <input
            type="tel"
            value={profile?.emergencyContact.phone || ''}
            onChange={(e) => updateProfile({
              emergencyContact: { ...profile!.emergencyContact, phone: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderInsurance = () => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Insurance Information</h3>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Provider</label>
          <input
            type="text"
            value={profile?.insuranceInfo.provider || ''}
            onChange={(e) => updateProfile({
              insuranceInfo: { ...profile!.insuranceInfo, provider: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Policy Number</label>
          <input
            type="text"
            value={profile?.insuranceInfo.policyNumber || ''}
            onChange={(e) => updateProfile({
              insuranceInfo: { ...profile!.insuranceInfo, policyNumber: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Group Number</label>
          <input
            type="text"
            value={profile?.insuranceInfo.groupNumber || ''}
            onChange={(e) => updateProfile({
              insuranceInfo: { ...profile!.insuranceInfo, groupNumber: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Notification Preferences</h3>
      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-3">Delivery Methods</h4>
          <div className="space-y-3">
            {Object.entries(notificationSettings).slice(0, 3).map(([key, value]) => (
              <label key={key} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, [key]: e.target.checked }))}
                  className="w-4 h-4 text-purple-500 rounded focus:ring-purple-500"
                />
                <span className="text-gray-700 capitalize">{key}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-3">Notification Types</h4>
          <div className="space-y-3">
            {Object.entries(notificationSettings).slice(3).map(([key, value]) => (
              <label key={key} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, [key]: e.target.checked }))}
                  className="w-4 h-4 text-purple-500 rounded focus:ring-purple-500"
                />
                <span className="text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Security Settings</h3>
        <div className="space-y-4">
          {Object.entries(securitySettings).map(([key, value]) => (
            <label key={key} className="flex items-center justify-between">
              <span className="text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => setSecuritySettings(prev => ({ ...prev, [key]: e.target.checked }))}
                className="w-4 h-4 text-purple-500 rounded focus:ring-purple-500"
              />
            </label>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Password</h3>
        <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors">
          Change Password
        </button>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'emergency': return renderEmergencyContact();
      case 'insurance': return renderInsurance();
      case 'notifications': return renderNotifications();
      case 'security': return renderSecurity();
      default: return renderPersonalInfo();
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 bg-white min-h-screen animate-fade-in">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="h-64 bg-gray-200 rounded-xl"></div>
            <div className="lg:col-span-3 h-64 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="p-6 space-y-8 bg-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between animate-slide-up">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-lg text-gray-600">Manage your personal information, security, and preferences</p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <Link href="/patient/ai-chat" className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
            <SparklesIcon className="w-5 h-5" />
            <span>Ask AI</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-fit animate-slide-up">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Settings</h3>
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-purple-500 text-white'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="lg:col-span-3 animate-slide-up">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
} 