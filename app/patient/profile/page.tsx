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
  emergencyContacts: EmergencyContact[];
  insuranceInfo: InsuranceInfo[];
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  security: SecuritySettings;
  healthGoals: string[];
  preferredLanguage: string;
  timezone: string;
}

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  isPrimary: boolean;
}

interface InsuranceInfo {
  id: string;
  provider: string;
  planName: string;
  memberId: string;
  groupNumber?: string;
  policyNumber?: string;
  isPrimary: boolean;
  effectiveDate: string;
  expirationDate?: string;
}

interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  appointmentReminders: boolean;
  medicationReminders: boolean;
  labResults: boolean;
  healthInsights: boolean;
  marketingEmails: boolean;
}

interface PrivacySettings {
  shareWithProviders: boolean;
  shareForResearch: boolean;
  dataRetention: '1year' | '5years' | '10years' | 'indefinite';
  aiAnalysis: boolean;
  thirdPartyIntegrations: boolean;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  biometricEnabled: boolean;
  sessionTimeout: number;
  loginAlerts: boolean;
  trustedDevices: TrustedDevice[];
}

interface TrustedDevice {
  id: string;
  name: string;
  type: 'mobile' | 'desktop' | 'tablet';
  lastUsed: string;
  location: string;
  isCurrentDevice: boolean;
}

export default function PatientProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: UserIcon },
    { id: 'emergency', label: 'Emergency Contacts', icon: PhoneIcon },
    { id: 'insurance', label: 'Insurance', icon: IdentificationIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
    { id: 'privacy', label: 'Privacy', icon: ShieldCheckIcon },
    { id: 'security', label: 'Security', icon: KeyIcon },
  ];

  // Mock profile data
  const mockProfile: UserProfile = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1990-01-15',
    gender: 'male',
    address: {
      street: '123 Health Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'United States',
    },
    medicalId: 'MED-2024-001234',
    bloodType: 'O+',
    allergies: ['Penicillin', 'Shellfish', 'Pollen'],
    emergencyContacts: [
      {
        id: '1',
        name: 'Jane Doe',
        relationship: 'Spouse',
        phone: '+1 (555) 987-6543',
        email: 'jane.doe@email.com',
        isPrimary: true,
      },
      {
        id: '2',
        name: 'Robert Doe',
        relationship: 'Father',
        phone: '+1 (555) 555-0123',
        isPrimary: false,
      },
    ],
    insuranceInfo: [
      {
        id: '1',
        provider: 'Blue Cross Blue Shield',
        planName: 'Premium Health Plan',
        memberId: 'BCBS123456789',
        groupNumber: 'GRP001234',
        policyNumber: 'POL987654321',
        isPrimary: true,
        effectiveDate: '2024-01-01',
        expirationDate: '2024-12-31',
      },
    ],
    notifications: {
      email: true,
      sms: true,
      push: true,
      appointmentReminders: true,
      medicationReminders: true,
      labResults: true,
      healthInsights: true,
      marketingEmails: false,
    },
    privacy: {
      shareWithProviders: true,
      shareForResearch: false,
      dataRetention: '5years',
      aiAnalysis: true,
      thirdPartyIntegrations: true,
    },
    security: {
      twoFactorEnabled: true,
      biometricEnabled: false,
      sessionTimeout: 30,
      loginAlerts: true,
      trustedDevices: [
        {
          id: '1',
          name: 'iPhone 15 Pro',
          type: 'mobile',
          lastUsed: '2024-01-15T14:30:00Z',
          location: 'San Francisco, CA',
          isCurrentDevice: true,
        },
        {
          id: '2',
          name: 'MacBook Pro',
          type: 'desktop',
          lastUsed: '2024-01-14T09:15:00Z',
          location: 'San Francisco, CA',
          isCurrentDevice: false,
        },
      ],
    },
    healthGoals: ['Maintain healthy weight', 'Improve cardiovascular health', 'Better sleep quality'],
    preferredLanguage: 'English',
    timezone: 'America/Los_Angeles',
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProfile(mockProfile);
      setLoading(false);
    }, 1000);
  }, []);

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (profile) {
      setProfile({ ...profile, ...updates });
    }
  };

  const updateNotificationSettings = (key: keyof NotificationSettings, value: boolean) => {
    if (profile) {
      setProfile({
        ...profile,
        notifications: { ...profile.notifications, [key]: value },
      });
    }
  };

  const updatePrivacySettings = (key: keyof PrivacySettings, value: any) => {
    if (profile) {
      setProfile({
        ...profile,
        privacy: { ...profile.privacy, [key]: value },
      });
    }
  };

  const updateSecuritySettings = (key: keyof SecuritySettings, value: any) => {
    if (profile) {
      setProfile({
        ...profile,
        security: { ...profile.security, [key]: value },
      });
    }
  };

  const addEmergencyContact = () => {
    const newContact: EmergencyContact = {
      id: Date.now().toString(),
      name: '',
      relationship: '',
      phone: '',
      isPrimary: false,
    };
    if (profile) {
      setProfile({
        ...profile,
        emergencyContacts: [...profile.emergencyContacts, newContact],
      });
    }
  };

  const removeEmergencyContact = (id: string) => {
    if (profile) {
      setProfile({
        ...profile,
        emergencyContacts: profile.emergencyContacts.filter(contact => contact.id !== id),
      });
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile': return DevicePhoneMobileIcon;
      case 'desktop': return ComputerDesktopIcon;
      default: return ComputerDesktopIcon;
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

  if (loading) {
    return (
      <div className="p-6 space-y-6 bg-mesh min-h-screen animate-fade-in">
        <div className="animate-pulse">
          <div className="h-8 dark-elevated rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="h-64 dark-elevated rounded-xl"></div>
            <div className="lg:col-span-3 h-64 dark-elevated rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="card p-6">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              {profile.avatar ? (
                <img src={profile.avatar} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
              ) : (
                <span className="text-white text-2xl font-bold">
                  {profile.firstName[0]}{profile.lastName[0]}
                </span>
              )}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors">
              <PhotoIcon className="w-4 h-4 text-white" />
            </button>
          </div>
          
          <div className="flex-1">
            <h2 className="heading-medium text-white">{profile.firstName} {profile.lastName}</h2>
            <p className="text-gray-400 mb-2">{calculateAge(profile.dateOfBirth)} years old • {profile.gender}</p>
            <p className="text-sm text-gray-500 mono-text">Medical ID: {profile.medicalId}</p>
            {profile.bloodType && (
              <p className="text-sm text-red-400 font-medium mt-1">Blood Type: {profile.bloodType}</p>
            )}
          </div>
          
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn-outline"
          >
            <PencilIcon className="w-4 h-4 mr-2" />
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>
      </div>

      {/* Contact Information */}
      <div className="card p-6">
        <h3 className="heading-small text-white mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label-text">Email Address</label>
            <div className="flex items-center space-x-3 mt-2">
              <EnvelopeIcon className="w-5 h-5 text-gray-400" />
              {isEditing ? (
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => updateProfile({ email: e.target.value })}
                  className="input flex-1"
                />
              ) : (
                <span className="text-white">{profile.email}</span>
              )}
            </div>
          </div>
          
          <div>
            <label className="label-text">Phone Number</label>
            <div className="flex items-center space-x-3 mt-2">
              <PhoneIcon className="w-5 h-5 text-gray-400" />
              {isEditing ? (
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => updateProfile({ phone: e.target.value })}
                  className="input flex-1"
                />
              ) : (
                <span className="text-white">{profile.phone}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="card p-6">
        <h3 className="heading-small text-white mb-4">Address</h3>
        <div className="flex items-start space-x-3">
          <MapPinIcon className="w-5 h-5 text-gray-400 mt-1" />
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Street Address"
                  value={profile.address.street}
                  onChange={(e) => updateProfile({
                    address: { ...profile.address, street: e.target.value }
                  })}
                  className="input w-full"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="City"
                    value={profile.address.city}
                    onChange={(e) => updateProfile({
                      address: { ...profile.address, city: e.target.value }
                    })}
                    className="input"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={profile.address.state}
                    onChange={(e) => updateProfile({
                      address: { ...profile.address, state: e.target.value }
                    })}
                    className="input"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="ZIP Code"
                    value={profile.address.zipCode}
                    onChange={(e) => updateProfile({
                      address: { ...profile.address, zipCode: e.target.value }
                    })}
                    className="input"
                  />
                  <input
                    type="text"
                    placeholder="Country"
                    value={profile.address.country}
                    onChange={(e) => updateProfile({
                      address: { ...profile.address, country: e.target.value }
                    })}
                    className="input"
                  />
                </div>
              </div>
            ) : (
              <div className="text-white">
                <p>{profile.address.street}</p>
                <p>{profile.address.city}, {profile.address.state} {profile.address.zipCode}</p>
                <p>{profile.address.country}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Health Information */}
      <div className="card p-6">
        <h3 className="heading-small text-white mb-4">Health Information</h3>
        <div className="space-y-4">
          <div>
            <label className="label-text">Allergies</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {profile.allergies.map((allergy, index) => (
                <span key={index} className="badge-error">
                  {allergy}
                  {isEditing && (
                    <button
                      onClick={() => {
                        const newAllergies = profile.allergies.filter((_, i) => i !== index);
                        updateProfile({ allergies: newAllergies });
                      }}
                      className="ml-2"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
              {isEditing && (
                <button className="text-sm text-pink-400 hover:text-pink-300">
                  + Add Allergy
                </button>
              )}
            </div>
          </div>
          
          <div>
            <label className="label-text">Health Goals</label>
            <div className="space-y-2 mt-2">
              {profile.healthGoals.map((goal, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-400" />
                  <span className="text-white">{goal}</span>
                  {isEditing && (
                    <button
                      onClick={() => {
                        const newGoals = profile.healthGoals.filter((_, i) => i !== index);
                        updateProfile({ healthGoals: newGoals });
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              {isEditing && (
                <button className="text-sm text-pink-400 hover:text-pink-300">
                  + Add Health Goal
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setIsEditing(false)}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="btn-primary"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );

  const renderEmergencyContacts = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="heading-small text-white">Emergency Contacts</h3>
        <button onClick={addEmergencyContact} className="btn-primary">
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Contact
        </button>
      </div>

      {profile.emergencyContacts.map((contact) => (
        <div key={contact.id} className="card p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-text">Name</label>
                  <input
                    type="text"
                    value={contact.name}
                    className="input mt-2"
                    placeholder="Contact name"
                  />
                </div>
                <div>
                  <label className="label-text">Relationship</label>
                  <select className="input mt-2">
                    <option value="spouse">Spouse</option>
                    <option value="parent">Parent</option>
                    <option value="sibling">Sibling</option>
                    <option value="child">Child</option>
                    <option value="friend">Friend</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-text">Phone Number</label>
                  <input
                    type="tel"
                    value={contact.phone}
                    className="input mt-2"
                    placeholder="Phone number"
                  />
                </div>
                <div>
                  <label className="label-text">Email (Optional)</label>
                  <input
                    type="email"
                    value={contact.email || ''}
                    className="input mt-2"
                    placeholder="Email address"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={contact.isPrimary}
                  className="rounded border-gray-600"
                />
                <label className="text-sm text-gray-300">Primary emergency contact</label>
              </div>
            </div>
            
            <button
              onClick={() => removeEmergencyContact(contact.id)}
              className="text-red-400 hover:text-red-300 ml-4"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderInsurance = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="heading-small text-white">Insurance Information</h3>
        <button className="btn-primary">
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Insurance
        </button>
      </div>

      {profile.insuranceInfo.map((insurance) => (
        <div key={insurance.id} className="card p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="font-semibold text-white">{insurance.provider}</h4>
              <p className="text-sm text-gray-400">{insurance.planName}</p>
              {insurance.isPrimary && (
                <span className="badge-success text-xs mt-1">Primary Insurance</span>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-text">Member ID</label>
              <p className="text-white mt-1 mono-text">{insurance.memberId}</p>
            </div>
            <div>
              <label className="label-text">Group Number</label>
              <p className="text-white mt-1 mono-text">{insurance.groupNumber}</p>
            </div>
            <div>
              <label className="label-text">Effective Date</label>
              <p className="text-white mt-1">{new Date(insurance.effectiveDate).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="label-text">Expiration Date</label>
              <p className="text-white mt-1">
                {insurance.expirationDate ? new Date(insurance.expirationDate).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <h3 className="heading-small text-white">Notification Preferences</h3>
      
      <div className="card p-6">
        <h4 className="font-semibold text-white mb-4">Delivery Methods</h4>
        <div className="space-y-4">
          {Object.entries(profile.notifications).slice(0, 3).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <label className="text-gray-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
              <button
                onClick={() => updateNotificationSettings(key as keyof NotificationSettings, !value)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  value ? 'bg-green-500' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <h4 className="font-semibold text-white mb-4">Notification Types</h4>
        <div className="space-y-4">
          {Object.entries(profile.notifications).slice(3).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <label className="text-gray-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
              <button
                onClick={() => updateNotificationSettings(key as keyof NotificationSettings, !value)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  value ? 'bg-green-500' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPrivacy = () => (
    <div className="space-y-6">
      <h3 className="heading-small text-white">Privacy & Data Settings</h3>
      
      <div className="card p-6">
        <h4 className="font-semibold text-white mb-4">Data Sharing</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-gray-300">Share with Healthcare Providers</label>
              <p className="text-sm text-gray-500">Allow providers to access your health data</p>
            </div>
            <button
              onClick={() => updatePrivacySettings('shareWithProviders', !profile.privacy.shareWithProviders)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                profile.privacy.shareWithProviders ? 'bg-green-500' : 'bg-gray-600'
              }`}
            >
              <div
                className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                  profile.privacy.shareWithProviders ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-gray-300">Participate in Research</label>
              <p className="text-sm text-gray-500">Anonymized data for medical research</p>
            </div>
            <button
              onClick={() => updatePrivacySettings('shareForResearch', !profile.privacy.shareForResearch)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                profile.privacy.shareForResearch ? 'bg-green-500' : 'bg-gray-600'
              }`}
            >
              <div
                className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                  profile.privacy.shareForResearch ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-gray-300">AI Analysis</label>
              <p className="text-sm text-gray-500">Use AI for health insights and recommendations</p>
            </div>
            <button
              onClick={() => updatePrivacySettings('aiAnalysis', !profile.privacy.aiAnalysis)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                profile.privacy.aiAnalysis ? 'bg-green-500' : 'bg-gray-600'
              }`}
            >
              <div
                className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                  profile.privacy.aiAnalysis ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h4 className="font-semibold text-white mb-4">Data Retention</h4>
        <div className="space-y-3">
          {['1year', '5years', '10years', 'indefinite'].map((option) => (
            <label key={option} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="dataRetention"
                value={option}
                checked={profile.privacy.dataRetention === option}
                onChange={(e) => updatePrivacySettings('dataRetention', e.target.value)}
                className="text-pink-500"
              />
              <span className="text-gray-300 capitalize">
                {option === 'indefinite' ? 'Keep data indefinitely' : `Delete after ${option.replace('year', ' year').replace('years', ' years')}`}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <h3 className="heading-small text-white">Security Settings</h3>
      
      <div className="card p-6">
        <h4 className="font-semibold text-white mb-4">Authentication</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-gray-300">Two-Factor Authentication</label>
              <p className="text-sm text-gray-500">Additional security with SMS or authenticator app</p>
            </div>
            <div className="flex items-center space-x-2">
              {profile.security.twoFactorEnabled && (
                <CheckCircleIcon className="w-5 h-5 text-green-400" />
              )}
              <button
                onClick={() => updateSecuritySettings('twoFactorEnabled', !profile.security.twoFactorEnabled)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  profile.security.twoFactorEnabled ? 'bg-green-500' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                    profile.security.twoFactorEnabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-gray-300">Biometric Authentication</label>
              <p className="text-sm text-gray-500">Use fingerprint or face recognition</p>
            </div>
            <button
              onClick={() => updateSecuritySettings('biometricEnabled', !profile.security.biometricEnabled)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                profile.security.biometricEnabled ? 'bg-green-500' : 'bg-gray-600'
              }`}
            >
              <div
                className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                  profile.security.biometricEnabled ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-gray-300">Login Alerts</label>
              <p className="text-sm text-gray-500">Get notified of new login attempts</p>
            </div>
            <button
              onClick={() => updateSecuritySettings('loginAlerts', !profile.security.loginAlerts)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                profile.security.loginAlerts ? 'bg-green-500' : 'bg-gray-600'
              }`}
            >
              <div
                className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                  profile.security.loginAlerts ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h4 className="font-semibold text-white mb-4">Trusted Devices</h4>
        <div className="space-y-4">
          {profile.security.trustedDevices.map((device) => {
            const DeviceIcon = getDeviceIcon(device.type);
            return (
              <div key={device.id} className="flex items-center justify-between p-3 glass rounded-xl">
                <div className="flex items-center space-x-3">
                  <DeviceIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-white font-medium">{device.name}</p>
                    <p className="text-sm text-gray-400">
                      {device.location} • Last used {new Date(device.lastUsed).toLocaleDateString()}
                    </p>
                  </div>
                  {device.isCurrentDevice && (
                    <span className="badge-success text-xs">Current Device</span>
                  )}
                </div>
                {!device.isCurrentDevice && (
                  <button className="text-red-400 hover:text-red-300 text-sm">
                    Remove
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="card p-6">
        <h4 className="font-semibold text-white mb-4">Password & Security</h4>
        <div className="space-y-4">
          <button className="btn-secondary w-full">
            Change Password
          </button>
          <button className="btn-outline w-full">
            Download Account Data
          </button>
          <button className="btn-outline w-full text-red-400 border-red-400/30 hover:bg-red-400/10">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal': return renderPersonalInfo();
      case 'emergency': return renderEmergencyContacts();
      case 'insurance': return renderInsurance();
      case 'notifications': return renderNotifications();
      case 'privacy': return renderPrivacy();
      case 'security': return renderSecurity();
      default: return renderPersonalInfo();
    }
  };

  return (
    <div className="p-6 space-y-8 bg-mesh min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between animate-slide-up">
        <div>
          <h1 className="heading-large text-white mb-2">Profile Settings</h1>
          <p className="body-large">Manage your personal information, security, and preferences</p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <Link href="/patient/ai-chat" className="btn-outline">
            <SparklesIcon className="w-5 h-5 mr-2" />
            Ask AI
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Tab Navigation */}
        <div className="card p-6 h-fit animate-slide-up">
          <h3 className="heading-small text-white mb-4">Settings</h3>
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-left transition-colors ${
                    activeTab === tab.id
                      ? 'mediva-gradient text-white'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
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