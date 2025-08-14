'use client';

import { useState } from 'react';
import { useAuth } from '@/app/providers';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  HeartIcon, 
  UserIcon, 
  UserGroupIcon 
} from '@heroicons/react/24/outline';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'patient' as 'patient' | 'provider',
    phone: '',
    dateOfBirth: '',
    specialty: '', // For providers
    licenseNumber: '', // For providers
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Set role from URL parameter
  useState(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'provider' || roleParam === 'patient') {
      setFormData(prev => ({ ...prev, role: roleParam }));
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const metadata = {
        full_name: formData.fullName,
        role: formData.role,
        phone: formData.phone,
        date_of_birth: formData.dateOfBirth,
        ...(formData.role === 'provider' && {
          specialty: formData.specialty,
          license_number: formData.licenseNumber,
        }),
      };

      const { error } = await signUp(formData.email, formData.password, metadata);
      
      if (error) {
        toast.error(error);
      } else {
        toast.success('Account created successfully! Please check your email to verify your account.');
        router.push('/auth/login');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-mediva-gradient rounded-2xl flex items-center justify-center">
              <HeartIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Join Mediva AI
          </h2>
          <p className="text-gray-400">
            Create your account to get started
          </p>
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, role: 'patient' }))}
            className={`p-4 rounded-lg border-2 transition-all ${
              formData.role === 'patient'
                ? 'border-primary-500 bg-primary-500/10'
                : 'border-dark-600 bg-dark-800 hover:border-dark-500'
            }`}
          >
            <UserIcon className="w-8 h-8 mx-auto mb-2 text-primary-500" />
            <div className="text-sm font-medium text-white">Patient</div>
            <div className="text-xs text-gray-400">Health management</div>
          </button>
          
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, role: 'provider' }))}
            className={`p-4 rounded-lg border-2 transition-all ${
              formData.role === 'provider'
                ? 'border-primary-500 bg-primary-500/10'
                : 'border-dark-600 bg-dark-800 hover:border-dark-500'
            }`}
          >
            <UserGroupIcon className="w-8 h-8 mx-auto mb-2 text-primary-500" />
            <div className="text-sm font-medium text-white">Provider</div>
            <div className="text-xs text-gray-400">Healthcare professional</div>
          </button>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div>
            <input
              name="fullName"
              type="text"
              required
              className="input"
              placeholder="Full name"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          <div>
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              className="input"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <input
              name="phone"
              type="tel"
              className="input"
              placeholder="Phone number (optional)"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          {formData.role === 'patient' && (
            <div>
              <input
                name="dateOfBirth"
                type="date"
                className="input"
                placeholder="Date of birth"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>
          )}

          {/* Provider-specific fields */}
          {formData.role === 'provider' && (
            <>
              <div>
                <input
                  name="specialty"
                  type="text"
                  required
                  className="input"
                  placeholder="Medical specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <input
                  name="licenseNumber"
                  type="text"
                  required
                  className="input"
                  placeholder="Medical license number"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          {/* Password fields */}
          <div className="relative">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              className="input pr-10"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-400" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>

          <div className="relative">
            <input
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              className="input pr-10"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-400" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>

          {/* Terms and Privacy */}
          <div className="flex items-start">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-400">
              I agree to the{' '}
              <Link href="/terms" className="text-primary-400 hover:text-primary-300">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-primary-400 hover:text-primary-300">
                Privacy Policy
              </Link>
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex justify-center py-3"
            >
              {loading ? (
                <>
                  <div className="spinner mr-2"></div>
                  Creating account...
                </>
              ) : (
                `Create ${formData.role} account`
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link
                href="/auth/login"
                className="font-medium text-primary-400 hover:text-primary-300"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
} 