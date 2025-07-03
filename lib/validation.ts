// Input validation and sanitization utilities

export interface ValidationResult {
  isValid: boolean
  error?: string
}

// Email validation with comprehensive rules
export function validateEmail(email: string): ValidationResult {
  if (!email || email.trim().length === 0) {
    return { isValid: false, error: 'Email is required' }
  }

  // Trim and normalize
  const normalizedEmail = email.trim().toLowerCase()

  if (normalizedEmail.length > 254) {
    return { isValid: false, error: 'Email address is too long' }
  }

  // Check for spaces
  if (normalizedEmail.includes(' ')) {
    return { isValid: false, error: 'Email address cannot contain spaces' }
  }

  // Split into local and domain parts
  const parts = normalizedEmail.split('@')
  if (parts.length !== 2) {
    return { isValid: false, error: 'Email must contain exactly one @ symbol' }
  }

  const [localPart, domainPart] = parts

  // Validate local part (before @)
  if (localPart.length === 0) {
    return { isValid: false, error: 'Email must have a local part before @' }
  }

  if (localPart.length > 64) {
    return { isValid: false, error: 'Email local part is too long' }
  }

  // Local part cannot start or end with dot or dash
  if (localPart.startsWith('.') || localPart.endsWith('.')) {
    return { isValid: false, error: 'Email local part cannot start or end with a dot' }
  }

  if (localPart.startsWith('-') || localPart.endsWith('-')) {
    return { isValid: false, error: 'Email local part cannot start or end with a dash' }
  }

  // Local part cannot have consecutive dots
  if (localPart.includes('..')) {
    return { isValid: false, error: 'Email local part cannot contain consecutive dots' }
  }

  // Local part valid characters
  if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(localPart)) {
    return { isValid: false, error: 'Email local part contains invalid characters' }
  }

  // Validate domain part (after @)
  if (domainPart.length === 0) {
    return { isValid: false, error: 'Email must have a domain part after @' }
  }

  if (domainPart.length > 253) {
    return { isValid: false, error: 'Email domain is too long' }
  }

  // Domain cannot start or end with dot or dash
  if (domainPart.startsWith('.') || domainPart.endsWith('.')) {
    return { isValid: false, error: 'Email domain cannot start or end with a dot' }
  }

  if (domainPart.startsWith('-') || domainPart.endsWith('-')) {
    return { isValid: false, error: 'Email domain cannot start or end with a dash' }
  }

  // Domain must have at least one dot (TLD required)
  if (!domainPart.includes('.')) {
    return { isValid: false, error: 'Email domain must include a top-level domain' }
  }

  // Split domain into labels
  const domainLabels = domainPart.split('.')
  
  // Each domain label must be valid
  for (const label of domainLabels) {
    if (label.length === 0) {
      return { isValid: false, error: 'Email domain cannot contain empty parts' }
    }
    
    if (label.length > 63) {
      return { isValid: false, error: 'Email domain label is too long' }
    }
    
    if (label.startsWith('-') || label.endsWith('-')) {
      return { isValid: false, error: 'Email domain labels cannot start or end with a dash' }
    }
    
    if (!/^[a-zA-Z0-9-]+$/.test(label)) {
      return { isValid: false, error: 'Email domain contains invalid characters' }
    }
  }

  // TLD (last part) must be at least 2 characters and only letters
  const tld = domainLabels[domainLabels.length - 1]
  if (tld.length < 2) {
    return { isValid: false, error: 'Email top-level domain must be at least 2 characters' }
  }
  
  if (!/^[a-zA-Z]+$/.test(tld)) {
    return { isValid: false, error: 'Email top-level domain must contain only letters' }
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