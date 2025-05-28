'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from "next/link"
import CompanyDropdown from "../../../components/CompanyDropdown"
import { signUp } from "../../../lib/auth"
import { validateEmail, validatePassword, validateName, sanitizeString, RateLimiter } from "../../../lib/validation"

// Create rate limiter instance
const rateLimiter = new RateLimiter(3, 300000) // 3 attempts per 5 minutes

export default function SignUpPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyId: '',
    companyName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    // Sanitize input
    const sanitizedValue = sanitizeString(value)
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }))
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleCompanyChange = (companyId: string, companyName: string) => {
    setFormData(prev => ({
      ...prev,
      companyId,
      companyName
    }))
    
    // Clear company error
    if (fieldErrors.company) {
      setFieldErrors(prev => ({
        ...prev,
        company: ''
      }))
    }
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    // Validate first name
    const firstNameValidation = validateName(formData.firstName, 'First name')
    if (!firstNameValidation.isValid) {
      errors.firstName = firstNameValidation.error!
    }

    // Validate last name
    const lastNameValidation = validateName(formData.lastName, 'Last name')
    if (!lastNameValidation.isValid) {
      errors.lastName = lastNameValidation.error!
    }

    // Validate email
    const emailValidation = validateEmail(formData.email)
    if (!emailValidation.isValid) {
      errors.email = emailValidation.error!
    }

    // Validate password
    const passwordValidation = validatePassword(formData.password)
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.error!
    }

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    // Validate company selection
    if (!formData.companyId) {
      errors.company = 'Please select a company'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    // Check rate limiting
    const clientIdentifier = formData.email || 'unknown'
    if (!rateLimiter.canAttempt(clientIdentifier)) {
      const remainingTime = Math.ceil(rateLimiter.getRemainingTime(clientIdentifier) / 1000 / 60)
      setError(`Too many signup attempts. Please try again in ${remainingTime} minutes.`)
      return
    }

    // Validate form
    if (!validateForm()) {
      return
    }

    setLoading(true)
    
    try {
      // Record attempt for rate limiting
      rateLimiter.recordAttempt(clientIdentifier)

      // Create account with Supabase
      const { data, error } = await signUp({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        companyId: formData.companyId,
      })

      if (error) {
        throw new Error(error.message)
      }

      if (data.user) {
        // Account created successfully, redirect to pending approval
        router.push('/pending-approval')
      }
    } catch (err) {
      console.error('Signup error:', err)
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-4">
        {/* Logo */}
        <div className="flex justify-center pt-4">
          <div className="bg-slate-800 rounded-lg p-4 w-20 h-20 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">FIQ</span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-4xl font-bold text-gray-900">
            Join FormIQ
          </h1>
          <p className="text-gray-900 text-lg">
            Start automating your electrical switchboard quoting today
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="firstName" className="block text-base font-medium text-gray-700 mb-1">
                First name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                required
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={loading}
                className={`w-full px-4 py-3 border ${fieldErrors.firstName ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-colors placeholder:text-gray-500 placeholder:text-sm text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed`}
                placeholder="First name"
              />
              {fieldErrors.firstName && (
                <p className="text-red-600 text-xs mt-1">{fieldErrors.firstName}</p>
              )}
            </div>
            <div>
              <label htmlFor="lastName" className="block text-base font-medium text-gray-700 mb-1">
                Last name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                required
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={loading}
                className={`w-full px-4 py-3 border ${fieldErrors.lastName ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-colors placeholder:text-gray-500 placeholder:text-sm text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed`}
                placeholder="Last name"
              />
              {fieldErrors.lastName && (
                <p className="text-red-600 text-xs mt-1">{fieldErrors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="company" className="block text-base font-medium text-gray-700 mb-1">
              Company
            </label>
            <CompanyDropdown
              value={formData.companyId}
              onChange={handleCompanyChange}
              required
              className={`w-full px-4 py-3 border ${fieldErrors.company ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-colors placeholder:text-gray-500 placeholder:text-sm text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed`}
            />
            {fieldErrors.company && (
              <p className="text-red-600 text-xs mt-1">{fieldErrors.company}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-base font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              disabled={loading}
              className={`w-full px-4 py-3 border ${fieldErrors.email ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-colors placeholder:text-gray-500 placeholder:text-sm text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed`}
              placeholder="Enter your email"
            />
            {fieldErrors.email && (
              <p className="text-red-600 text-xs mt-1">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-base font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleInputChange}
              disabled={loading}
              className={`w-full px-4 py-3 border ${fieldErrors.password ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-colors placeholder:text-gray-500 placeholder:text-sm text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed`}
              placeholder="Create a password"
            />
            {fieldErrors.password ? (
              <p className="text-red-600 text-xs mt-1">{fieldErrors.password}</p>
            ) : (
              <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters with letters and numbers</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-base font-medium text-gray-700 mb-1">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={formData.confirmPassword}
              onChange={handleInputChange}
              disabled={loading}
              className={`w-full px-4 py-3 border ${fieldErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-colors placeholder:text-gray-500 placeholder:text-sm text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed`}
              placeholder="Confirm your password"
            />
            {fieldErrors.confirmPassword && (
              <p className="text-red-600 text-xs mt-1">{fieldErrors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-800 text-white py-3 px-4 rounded-lg font-medium hover:bg-slate-700 transition-colors focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 mt-4 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </>
            ) : (
              'Create account'
            )}
          </button>
        </form>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-gray-900">
            Already have an account?{" "}
            <Link href="/" className="text-slate-800 font-medium hover:text-slate-600 transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-800">
            Powered by <span className="font-medium">Atlas Switch</span>
          </p>
        </div>
      </div>
    </div>
  );
} 