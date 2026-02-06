import { describe, it, expect } from 'vitest'
import { prorateCharges } from './OrderSummary'

const TAX_RATE = 0.08

describe('prorateCharges', () => {
  it('prorates a full month to the full price + tax', () => {
    // 30-day month, 30 remaining days = full price
    const result = prorateCharges(19.99, 30, 30)
    const expected = 19.99 + (19.99 * TAX_RATE)
    expect(result).toBeCloseTo(expected, 2)
  })

  it('prorates half a month correctly', () => {
    // 30-day month, 15 remaining days = half price
    const result = prorateCharges(19.99, 30, 15)
    const dailyRate = 19.99 / 30
    const prorated = Math.round((dailyRate * 15) * 100) / 100
    const expected = prorated + (prorated * TAX_RATE)
    expect(result).toBeCloseTo(expected, 2)
  })

  it('returns 0 when 0 days remaining', () => {
    const result = prorateCharges(19.99, 30, 0)
    expect(result).toBe(0)
  })

  it('returns 0 for a free plan (price = 0)', () => {
    const result = prorateCharges(0, 30, 15)
    expect(result).toBe(0)
  })

  it('handles a 28-day month (February)', () => {
    const result = prorateCharges(49, 28, 14)
    const dailyRate = 49 / 28
    const prorated = Math.round((dailyRate * 14) * 100) / 100
    const expected = prorated + (prorated * TAX_RATE)
    expect(result).toBeCloseTo(expected, 2)
  })

  it('handles a 31-day month', () => {
    const result = prorateCharges(49, 31, 10)
    const dailyRate = 49 / 31
    const prorated = Math.round((dailyRate * 10) * 100) / 100
    const expected = prorated + (prorated * TAX_RATE)
    expect(result).toBeCloseTo(expected, 2)
  })

  it('prorates 1 remaining day correctly', () => {
    const result = prorateCharges(19.99, 30, 1)
    const dailyRate = 19.99 / 30
    const prorated = Math.round((dailyRate * 1) * 100) / 100
    const expected = prorated + (prorated * TAX_RATE)
    expect(result).toBeCloseTo(expected, 2)
  })

  it('includes 8% tax on the prorated amount', () => {
    // Verify tax is applied to the prorated amount, not the full price
    const result = prorateCharges(100, 30, 15)
    const prorated = Math.round(((100 / 30) * 15) * 100) / 100
    const withTax = prorated + (prorated * TAX_RATE)
    expect(result).toBeCloseTo(withTax, 2)

    // Should NOT equal full price tax
    const fullPriceTax = 100 + (100 * TAX_RATE)
    expect(result).not.toBeCloseTo(fullPriceTax, 2)
  })

  it('rounds the prorated base to 2 decimal places before applying tax', () => {
    // 19.99 / 30 = 0.66633... * 7 = 4.66433... rounds to 4.66
    const result = prorateCharges(19.99, 30, 7)
    const prorated = Math.round(((19.99 / 30) * 7) * 100) / 100 // 4.66
    const expected = prorated + (prorated * TAX_RATE)
    expect(result).toBeCloseTo(expected, 2)
  })
})
