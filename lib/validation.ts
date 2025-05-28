// Input validation and sanitization utilities

export interface ValidationResult {
  isValid: boolean
  error?: string
}

// Email validation with stricter rules
export function validateEmail(email: string): ValidationResult {
  if (!email || email.trim().length === 0) {
    return { isValid: false, error: 'Email is required' }
  }

  // Trim and normalize
  const normalizedEmail = email.trim().toLowerCase()

  // Stricter email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

  if (!emailRegex.test(normalizedEmail)) {
    return { isValid: false, error: 'Please enter a valid email address' }
  }

  if (normalizedEmail.length > 254) {
    return { isValid: false, error: 'Email address is too long' }
  }

  return { isValid: true }
}

// Password validation
export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { isValid: false, error: 'Password is required' }
  }

  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' }
  }

  if (password.length > 128) {
    return { isValid: false, error: 'Password is too long' }
  }

  // Check for at least one letter and one number
  if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one letter and one number' }
  }

  return { isValid: true }
}

// Name validation
export function validateName(name: string, fieldName: string): ValidationResult {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: `${fieldName} is required` }
  }

  const trimmedName = name.trim()

  if (trimmedName.length < 1) {
    return { isValid: false, error: `${fieldName} is required` }
  }

  if (trimmedName.length > 50) {
    return { isValid: false, error: `${fieldName} is too long` }
  }

  // Only allow letters, spaces, hyphens, and apostrophes
  if (!/^[a-zA-Z\s\-']+$/.test(trimmedName)) {
    return { isValid: false, error: `${fieldName} contains invalid characters` }
  }

  return { isValid: true }
}

// Sanitize string input
export function sanitizeString(input: string): string {
  if (!input) return ''
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 255) // Limit length
}

// Rate limiting helper (simple client-side)
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map()
  private readonly maxAttempts: number
  private readonly windowMs: number

  constructor(maxAttempts: number = 5, windowMs: number = 300000) { // 5 attempts per 5 minutes
    this.maxAttempts = maxAttempts
    this.windowMs = windowMs
  }

  canAttempt(identifier: string): boolean {
    const now = Date.now()
    const attempts = this.attempts.get(identifier) || []
    
    // Remove old attempts outside the window
    const recentAttempts = attempts.filter(time => now - time < this.windowMs)
    
    this.attempts.set(identifier, recentAttempts)
    
    return recentAttempts.length < this.maxAttempts
  }

  recordAttempt(identifier: string): void {
    const now = Date.now()
    const attempts = this.attempts.get(identifier) || []
    attempts.push(now)
    this.attempts.set(identifier, attempts)
  }

  getRemainingTime(identifier: string): number {
    const attempts = this.attempts.get(identifier) || []
    if (attempts.length === 0) return 0
    
    const oldestAttempt = Math.min(...attempts)
    const timeLeft = this.windowMs - (Date.now() - oldestAttempt)
    
    return Math.max(0, timeLeft)
  }
} 