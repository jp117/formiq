import {
  validateEmail,
  validatePassword,
  validateName,
  sanitizeString,
  RateLimiter,
} from '../validation'

describe('Email Validation', () => {
  test('should accept valid email addresses', () => {
    const validEmails = [
      'user@example.com',
      'test.email@domain.co.uk',
      'user+tag@example.org',
      'firstname.lastname@company.com',
    ]

    validEmails.forEach(email => {
      const result = validateEmail(email)
      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
    })
  })

  test('should reject email with no @ symbol', () => {
    const result = validateEmail('invalid-email')
    expect(result.isValid).toBe(false)
    expect(result.error).toBeDefined()
  })

  test('should reject email with missing local part', () => {
    const result = validateEmail('@domain.com')
    expect(result.isValid).toBe(false)
    expect(result.error).toBeDefined()
  })

  test('should reject email with missing domain', () => {
    const result = validateEmail('user@')
    expect(result.isValid).toBe(false)
    expect(result.error).toBeDefined()
  })

  test('should reject emails without TLD', () => {
    const result = validateEmail('user@domain')
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('top-level domain')
  })

  test('should reject emails with consecutive dots', () => {
    const result = validateEmail('user..user@domain.com')
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('consecutive dots')
  })

  test('should reject emails starting with dot', () => {
    const result = validateEmail('.user@domain.com')
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('start or end with a dot')
  })

  test('should reject emails ending with dot', () => {
    const result = validateEmail('user.@domain.com')
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('start or end with a dot')
  })

  test('should reject emails with spaces', () => {
    const result = validateEmail('user name@domain.com')
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('cannot contain spaces')
  })

  test('should handle email normalization', () => {
    const email = '  USER@EXAMPLE.COM  '
    const result = validateEmail(email)
    expect(result.isValid).toBe(true)
  })

  test('should reject emails that are too long', () => {
    const longEmail = 'a'.repeat(250) + '@example.com'
    const result = validateEmail(longEmail)
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('too long')
  })

  test('should require email to be provided', () => {
    const result = validateEmail('')
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('required')
  })
})

describe('Password Validation', () => {
  test('should accept valid passwords', () => {
    const validPasswords = [
      'password123',
      'StrongPass1',
      'mySecure2024',
      'a1bcdefg',
    ]

    validPasswords.forEach(password => {
      const result = validatePassword(password)
      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
    })
  })

  test('should reject passwords that are too short', () => {
    const shortPasswords = ['123', 'abc', 'ab1', '1234567']

    shortPasswords.forEach(password => {
      const result = validatePassword(password)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('at least 8 characters')
    })
  })

  test('should reject passwords without letters and numbers', () => {
    const invalidPasswords = [
      'onlyletters',
      '12345678',
      'ONLYUPPERCASE',
      '!@#$%^&*()',
    ]

    invalidPasswords.forEach(password => {
      const result = validatePassword(password)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('at least one letter and one number')
    })
  })

  test('should reject passwords that are too long', () => {
    const longPassword = 'a1' + 'b'.repeat(127)
    const result = validatePassword(longPassword)
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('too long')
  })

  test('should require password to be provided', () => {
    const result = validatePassword('')
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('required')
  })
})

describe('Name Validation', () => {
  test('should accept valid names', () => {
    const validNames = [
      'John',
      'Mary-Jane',
      "O'Connor",
      'Jean-Pierre',
      'van der Berg',
    ]

    validNames.forEach(name => {
      const result = validateName(name, 'First Name')
      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
    })
  })

  test('should reject names with invalid characters', () => {
    const invalidNames = [
      'John123',
      'Mary@Jane',
      'User<script>',
      'Name!',
    ]

    invalidNames.forEach(name => {
      const result = validateName(name, 'First Name')
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('invalid characters')
    })
  })

  test('should reject names that are too long', () => {
    const longName = 'a'.repeat(51)
    const result = validateName(longName, 'First Name')
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('too long')
  })

  test('should require name to be provided', () => {
    const result = validateName('', 'First Name')
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('First Name is required')
  })

  test('should handle whitespace-only names', () => {
    const result = validateName('   ', 'Last Name')
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('Last Name is required')
  })
})

describe('String Sanitization', () => {
  test('should sanitize strings properly', () => {
    expect(sanitizeString('  hello world  ')).toBe('hello world')
    expect(sanitizeString('text<script>alert("xss")</script>')).toBe('textscriptalert("xss")/script')
    expect(sanitizeString('<>dangerous')).toBe('dangerous')
    expect(sanitizeString('')).toBe('')
  })

  test('should limit string length', () => {
    const longString = 'a'.repeat(300)
    const result = sanitizeString(longString)
    expect(result.length).toBe(255)
  })

  test('should handle null/undefined input', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(sanitizeString(null as any)).toBe('')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(sanitizeString(undefined as any)).toBe('')
  })
})

describe('Rate Limiter', () => {
  let rateLimiter: RateLimiter

  beforeEach(() => {
    rateLimiter = new RateLimiter(3, 1000) // 3 attempts per second for testing
  })

  test('should allow attempts within limit', () => {
    expect(rateLimiter.canAttempt('user1')).toBe(true)
    rateLimiter.recordAttempt('user1')
    
    expect(rateLimiter.canAttempt('user1')).toBe(true)
    rateLimiter.recordAttempt('user1')
    
    expect(rateLimiter.canAttempt('user1')).toBe(true)
  })

  test('should block attempts when limit exceeded', () => {
    // Make maximum allowed attempts
    for (let i = 0; i < 3; i++) {
      expect(rateLimiter.canAttempt('user1')).toBe(true)
      rateLimiter.recordAttempt('user1')
    }
    
    // Next attempt should be blocked
    expect(rateLimiter.canAttempt('user1')).toBe(false)
  })

  test('should track different users separately', () => {
    // Max out attempts for user1
    for (let i = 0; i < 3; i++) {
      rateLimiter.recordAttempt('user1')
    }
    
    expect(rateLimiter.canAttempt('user1')).toBe(false)
    expect(rateLimiter.canAttempt('user2')).toBe(true)
  })

  test('should reset after time window', async () => {
    // Max out attempts
    for (let i = 0; i < 3; i++) {
      rateLimiter.recordAttempt('user1')
    }
    
    expect(rateLimiter.canAttempt('user1')).toBe(false)
    
    // Wait for window to expire (using a short window for testing)
    await new Promise(resolve => setTimeout(resolve, 1100))
    
    expect(rateLimiter.canAttempt('user1')).toBe(true)
  })

  test('should calculate remaining time correctly', () => {
    rateLimiter.recordAttempt('user1')
    const remainingTime = rateLimiter.getRemainingTime('user1')
    
    expect(remainingTime).toBeGreaterThan(0)
    expect(remainingTime).toBeLessThanOrEqual(1000)
  })

  test('should return 0 remaining time for users with no attempts', () => {
    expect(rateLimiter.getRemainingTime('newuser')).toBe(0)
  })
}) 