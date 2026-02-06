import { describe, it, expect } from 'vitest'
import { checkoutSchema, luhnCheck, isValidExpiry } from './checkoutSchema'

// ── luhnCheck ──────────────────────────────────────────────

describe('luhnCheck', () => {
  it('accepts a valid Visa test card', () => {
    expect(luhnCheck('4242424242424242')).toBe(true)
  })

  it('accepts a valid Mastercard test card', () => {
    expect(luhnCheck('5555555555554444')).toBe(true)
  })

  it('rejects a number that fails the checksum', () => {
    expect(luhnCheck('4242424242424241')).toBe(false)
  })

  it('rejects a number that is too short', () => {
    expect(luhnCheck('42424242')).toBe(false)
  })

  it('strips spaces and dashes before checking', () => {
    expect(luhnCheck('4242 4242 4242 4242')).toBe(true)
    expect(luhnCheck('4242-4242-4242-4242')).toBe(true)
  })

  it('rejects an empty string', () => {
    expect(luhnCheck('')).toBe(false)
  })
})

// ── isValidExpiry ──────────────────────────────────────────

describe('isValidExpiry', () => {
  const jan2025 = new Date(2025, 0, 15) // Jan 15, 2025

  it('accepts a future MM/YY expiry', () => {
    expect(isValidExpiry('12/25', jan2025)).toBe(true)
  })

  it('accepts a future MM/YYYY expiry', () => {
    expect(isValidExpiry('06/2026', jan2025)).toBe(true)
  })

  it('accepts the current month (not yet expired)', () => {
    expect(isValidExpiry('01/25', jan2025)).toBe(true)
  })

  it('rejects a past expiry', () => {
    expect(isValidExpiry('12/24', jan2025)).toBe(false)
  })

  it('rejects an invalid month (00)', () => {
    expect(isValidExpiry('00/26', jan2025)).toBe(false)
  })

  it('rejects an invalid month (13)', () => {
    expect(isValidExpiry('13/26', jan2025)).toBe(false)
  })

  it('rejects malformed formats', () => {
    expect(isValidExpiry('1/25', jan2025)).toBe(false)
    expect(isValidExpiry('01-25', jan2025)).toBe(false)
    expect(isValidExpiry('0125', jan2025)).toBe(false)
    expect(isValidExpiry('', jan2025)).toBe(false)
  })
})

// ── checkoutSchema ─────────────────────────────────────────

/** Extract the first error message for a given field from a failed parse */
function getFieldError(data: Record<string, unknown>, field: string): string | undefined {
  const result = checkoutSchema.safeParse(data)
  if (result.success) return undefined
  
  return result.error.issues.find((i) => i.path[0] === field)?.message
}

describe('checkoutSchema', () => {
  const validData = {
    email: 'test@example.com',
    cardNumber: '4242424242424242',
    expiry: '12/30',
    cvv: '123',
    zipcode: '12345',
  }

  it('accepts valid checkout data', () => {
    const result = checkoutSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  // ── required field messages ──

  describe('required field messages', () => {
    it('shows "Email is required" for empty email', () => {
      expect(getFieldError({ ...validData, email: '' }, 'email')).toBe('Email is required')
    })

    it('shows "Card number is required" for empty card number', () => {
      expect(getFieldError({ ...validData, cardNumber: '' }, 'cardNumber')).toBe('Card number is required')
    })

    it('shows "Expiry date is required" for empty expiry', () => {
      expect(getFieldError({ ...validData, expiry: '' }, 'expiry')).toBe('Expiry date is required')
    })

    it('shows "CVV is required" for empty CVV', () => {
      expect(getFieldError({ ...validData, cvv: '' }, 'cvv')).toBe('CVV is required')
    })

    it('shows "Zipcode is required" for empty zipcode', () => {
      expect(getFieldError({ ...validData, zipcode: '' }, 'zipcode')).toBe('Zipcode is required')
    })
  })

  // ── email ──

  it('rejects an invalid email', () => {
    const result = checkoutSchema.safeParse({ ...validData, email: 'not-an-email' })
    expect(result.success).toBe(false)
  })

  it('rejects an empty email', () => {
    const result = checkoutSchema.safeParse({ ...validData, email: '' })
    expect(result.success).toBe(false)
  })

  // ── cardNumber ──

  it('accepts a card number with spaces', () => {
    const result = checkoutSchema.safeParse({ ...validData, cardNumber: '4242 4242 4242 4242' })
    expect(result.success).toBe(true)
  })

  it('accepts a card number with dashes', () => {
    const result = checkoutSchema.safeParse({ ...validData, cardNumber: '4242-4242-4242-4242' })
    expect(result.success).toBe(true)
  })

  it('rejects an invalid card number', () => {
    const result = checkoutSchema.safeParse({ ...validData, cardNumber: '1234567890123' })
    expect(result.success).toBe(false)
  })

  it('rejects an empty card number', () => {
    const result = checkoutSchema.safeParse({ ...validData, cardNumber: '' })
    expect(result.success).toBe(false)
  })

  // ── expiry ──

  it('rejects an expired date', () => {
    const result = checkoutSchema.safeParse({ ...validData, expiry: '01/20' })
    expect(result.success).toBe(false)
  })

  it('rejects a malformed expiry', () => {
    const result = checkoutSchema.safeParse({ ...validData, expiry: '1/30' })
    expect(result.success).toBe(false)
  })

  // ── cvv ──

  it('accepts a 3-digit CVV', () => {
    const result = checkoutSchema.safeParse({ ...validData, cvv: '123' })
    expect(result.success).toBe(true)
  })

  it('accepts a 4-digit CVV (Amex)', () => {
    const result = checkoutSchema.safeParse({ ...validData, cvv: '1234' })
    expect(result.success).toBe(true)
  })

  it('rejects a 2-digit CVV', () => {
    const result = checkoutSchema.safeParse({ ...validData, cvv: '12' })
    expect(result.success).toBe(false)
  })

  it('rejects a CVV with letters', () => {
    const result = checkoutSchema.safeParse({ ...validData, cvv: 'abc' })
    expect(result.success).toBe(false)
  })

  // ── zipcode ──

  it('accepts a 5-digit ZIP', () => {
    const result = checkoutSchema.safeParse({ ...validData, zipcode: '90210' })
    expect(result.success).toBe(true)
  })

  it('accepts a ZIP+4 format', () => {
    const result = checkoutSchema.safeParse({ ...validData, zipcode: '90210-1234' })
    expect(result.success).toBe(true)
  })

  it('rejects an empty zipcode', () => {
    const result = checkoutSchema.safeParse({ ...validData, zipcode: '' })
    expect(result.success).toBe(false)
  })

  it('rejects a short zipcode', () => {
    const result = checkoutSchema.safeParse({ ...validData, zipcode: '1234' })
    expect(result.success).toBe(false)
  })
})
