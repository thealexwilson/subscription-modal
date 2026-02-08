export interface Plan {
  id: string
  name: string
  badge: string
  price: number
  period: string
  tasks: string
  zaps: string
  features: string[]
  featured?: boolean
}

export const TAX_RATE = 0.08

export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free Plan',
    badge: 'Free!',
    price: 0,
    period: 'month',
    tasks: '100 tasks/month',
    zaps: '5 Zaps',
    features: ['Single-step Zaps'],
    featured: true,
  },
  {
    id: 'starter',
    name: 'Starter Plan',
    badge: 'Most Popular!',
    price: 19.99,
    period: 'month',
    tasks: '750 tasks/month',
    zaps: '20 Zaps',
    features: ['Multi-step Zaps'],
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    badge: 'Advanced Features!',
    price: 49,
    period: 'month',
    tasks: '2,000 tasks/month',
    zaps: 'Unlimited Zaps',
    features: ['Premium apps', 'Priority support'],
  },
]

/**
 * Look up a plan by its id.
 * @param id - Plan identifier (e.g., 'free', 'starter', 'pro')
 * @returns Plan object, or the first plan (Free) if not found
 */
export function getPlanById(id: string): Plan {
  return PLANS.find((p) => p.id === id) ?? PLANS[0]
}
