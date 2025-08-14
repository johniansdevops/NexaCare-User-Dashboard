import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, isToday, isTomorrow, isYesterday } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Date formatting utilities
export function formatDate(date: string | Date, formatStr: string = 'MMM dd, yyyy'): string {
  return format(new Date(date), formatStr);
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const minute = parseInt(minutes);
  
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  
  return `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
}

export function formatDateTime(date: string | Date): string {
  const dateObj = new Date(date);
  
  if (isToday(dateObj)) {
    return `Today at ${format(dateObj, 'h:mm a')}`;
  }
  
  if (isTomorrow(dateObj)) {
    return `Tomorrow at ${format(dateObj, 'h:mm a')}`;
  }
  
  if (isYesterday(dateObj)) {
    return `Yesterday at ${format(dateObj, 'h:mm a')}`;
  }
  
  return format(dateObj, 'MMM dd, yyyy \'at\' h:mm a');
}

export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

// Health utilities
export function calculateBMI(weight: number, height: number): number {
  // weight in kg, height in cm
  const heightInMeters = height / 100;
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
}

export function getBMICategory(bmi: number): {
  category: string;
  color: string;
  description: string;
} {
  if (bmi < 18.5) {
    return {
      category: 'Underweight',
      color: 'text-blue-600',
      description: 'Below normal weight range'
    };
  } else if (bmi < 25) {
    return {
      category: 'Normal',
      color: 'text-green-600',
      description: 'Healthy weight range'
    };
  } else if (bmi < 30) {
    return {
      category: 'Overweight',
      color: 'text-yellow-600',
      description: 'Above normal weight range'
    };
  } else {
    return {
      category: 'Obese',
      color: 'text-red-600',
      description: 'Significantly above normal weight'
    };
  }
}

export function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

export function getBloodPressureCategory(systolic: number, diastolic: number): {
  category: string;
  color: string;
  description: string;
} {
  if (systolic < 120 && diastolic < 80) {
    return {
      category: 'Normal',
      color: 'text-green-600',
      description: 'Optimal blood pressure'
    };
  } else if (systolic < 130 && diastolic < 80) {
    return {
      category: 'Elevated',
      color: 'text-yellow-600',
      description: 'Slightly elevated'
    };
  } else if (systolic < 140 || diastolic < 90) {
    return {
      category: 'High Stage 1',
      color: 'text-orange-600',
      description: 'Mild hypertension'
    };
  } else if (systolic < 180 || diastolic < 120) {
    return {
      category: 'High Stage 2',
      color: 'text-red-600',
      description: 'Moderate hypertension'
    };
  } else {
    return {
      category: 'Crisis',
      color: 'text-red-800',
      description: 'Severe hypertension - seek immediate care'
    };
  }
}

// Medication adherence utilities
export function calculateAdherence(taken: number, prescribed: number): number {
  if (prescribed === 0) return 0;
  return Math.round((taken / prescribed) * 100);
}

export function getAdherenceColor(percentage: number): string {
  if (percentage >= 90) return 'text-green-600';
  if (percentage >= 80) return 'text-yellow-600';
  if (percentage >= 70) return 'text-orange-600';
  return 'text-red-600';
}

// Health score utilities
export function getHealthScoreColor(score: number): string {
  if (score >= 90) return 'text-green-600';
  if (score >= 80) return 'text-green-500';
  if (score >= 70) return 'text-yellow-500';
  if (score >= 60) return 'text-orange-500';
  return 'text-red-500';
}

export function getHealthScoreDescription(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Very Good';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Fair';
  return 'Needs Attention';
}

// Text utilities
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function capitalizeFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  return phone;
}

// Validation utilities
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
}

export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Color utilities for health metrics
export function getMetricColor(value: number, ranges: {
  excellent: [number, number];
  good: [number, number];
  fair: [number, number];
  poor: [number, number];
}): string {
  if (value >= ranges.excellent[0] && value <= ranges.excellent[1]) {
    return 'text-green-600';
  } else if (value >= ranges.good[0] && value <= ranges.good[1]) {
    return 'text-green-500';
  } else if (value >= ranges.fair[0] && value <= ranges.fair[1]) {
    return 'text-yellow-500';
  } else {
    return 'text-red-500';
  }
}

// Generate unique IDs
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function generateHealthId(): string {
  const prefix = 'MED';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

// File upload utilities
export function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
}

export function isValidFileType(filename: string, allowedTypes: string[]): boolean {
  const extension = getFileExtension(filename).toLowerCase();
  return allowedTypes.includes(extension);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Array utilities
export function groupBy<T>(array: T[], key: keyof T): { [key: string]: T[] } {
  return array.reduce((result, item) => {
    const group = String(item[key]);
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {} as { [key: string]: T[] });
}

export function sortBy<T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];
    
    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}

// Local storage utilities
export function setLocalStorage(key: string, value: any): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

export function getLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window !== 'undefined') {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }
  return defaultValue;
}

export function removeLocalStorage(key: string): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
}

// Analytics and provider utilities
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function getConditionColor(condition: string): string {
  const colorMap: Record<string, string> = {
    'hypertension': 'text-red-400',
    'diabetes': 'text-blue-400',
    'anxiety': 'text-purple-400',
    'depression': 'text-indigo-400',
    'asthma': 'text-green-400',
    'arthritis': 'text-orange-400',
    'migraine': 'text-pink-400',
    'heart disease': 'text-red-500',
    'copd': 'text-cyan-400',
    'default': 'text-gray-400',
  };
  
  const normalizedCondition = condition.toLowerCase();
  for (const [key, color] of Object.entries(colorMap)) {
    if (normalizedCondition.includes(key)) {
      return color;
    }
  }
  return colorMap.default;
}

export function getPriorityColor(priority: 'high' | 'medium' | 'low'): string {
  switch (priority) {
    case 'high': return 'border-red-500/30 bg-red-500/10 text-red-300';
    case 'medium': return 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300';
    case 'low': return 'border-green-500/30 bg-green-500/10 text-green-300';
    default: return 'border-gray-500/30 bg-gray-500/10 text-gray-300';
  }
}

export function formatMedicalId(id: string): string {
  // Format medical ID with dashes for readability
  return id.replace(/(.{3})(.{4})(.{3})/g, '$1-$2-$3');
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Risk assessment utilities
export function calculateRiskScore(factors: Record<string, number>): number {
  const weights = {
    age: 0.2,
    bmi: 0.15,
    bloodPressure: 0.25,
    cholesterol: 0.2,
    smoking: 0.1,
    familyHistory: 0.1
  };
  
  let score = 0;
  for (const [factor, value] of Object.entries(factors)) {
    if (weights[factor as keyof typeof weights]) {
      score += value * weights[factor as keyof typeof weights];
    }
  }
  
  return Math.min(Math.max(score, 0), 100);
}

export function getRiskLevel(score: number): {
  level: 'low' | 'moderate' | 'high' | 'critical';
  color: string;
  description: string;
} {
  if (score < 25) {
    return {
      level: 'low',
      color: 'text-green-400',
      description: 'Low risk - maintain current lifestyle'
    };
  } else if (score < 50) {
    return {
      level: 'moderate',
      color: 'text-yellow-400',
      description: 'Moderate risk - consider lifestyle changes'
    };
  } else if (score < 75) {
    return {
      level: 'high',
      color: 'text-orange-400',
      description: 'High risk - medical intervention recommended'
    };
  } else {
    return {
      level: 'critical',
      color: 'text-red-400',
      description: 'Critical risk - immediate medical attention required'
    };
  }
} 