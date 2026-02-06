import { z } from 'zod'

/** Luhn check (common credit-card checksum) */
export function luhnCheck(raw: string): boolean {
  const digits = raw.replace(/\D/g, '')
  let sum = 0
  let shouldDouble = false

  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i])
    if (shouldDouble) {
      d *= 2
      if (d > 9) d -= 9
    }
    sum += d
    shouldDouble = !shouldDouble
  }
  return digits.length >= 12 && sum % 10 === 0
}

/** Expiry check for "MM/YY" or "MM/YYYY" */
export function isValidExpiry(exp: string, now = new Date()): boolean {
  const m = exp.match(/^(\d{2})\/(\d{2}|\d{4})$/)
  if (!m) return false

  const month = Number(m[1])
  let year = Number(m[2])
  if (month < 1 || month > 12) return false

  if (m[2].length === 2) {
    year = 2000 + year
  }

  const expiryEnd = new Date(year, month, 0, 23, 59, 59, 999)
  return expiryEnd >= now
}

export const checkoutSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .pipe(z.email('Invalid email address')),
  cardNumber: z
    .string()
    .min(1, 'Card number is required')
    .transform((s: string) => s.replace(/\s|-/g, ''))
    .refine((s: string) => /^\d{12,19}$/.test(s), { message: 'Invalid card number format' })
    .refine((s: string) => luhnCheck(s), { message: 'Invalid card number' }),
  expiry: z
    .string()
    .min(1, 'Expiry date is required')
    .refine((s: string) => isValidExpiry(s), { message: 'Invalid or expired date' }),
  cvv: z
    .string()
    .min(1, 'CVV is required')
    .refine((s: string) => /^\d{3,4}$/.test(s), { message: 'Invalid CVV' }),
  zipcode: z
    .string()
    .min(1, 'Zipcode is required')
    .refine((s: string) => /^\d{5}(-\d{4})?$/.test(s), { message: 'Invalid ZIP code' }),
})

export type CheckoutFormData = z.infer<typeof checkoutSchema>
