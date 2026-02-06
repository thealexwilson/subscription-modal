import Button from './components/button'
import './Checkout.scss'
import { useParams, useNavigate } from 'react-router-dom'
import { usePlanStore } from './store/usePlanStore'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Luhn check (common credit-card checksum)
function luhnCheck(raw: string) {
  const digits = raw.replace(/\D/g, "");
  let sum = 0;
  let shouldDouble = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i]);
    if (shouldDouble) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    shouldDouble = !shouldDouble;
  }
  return digits.length >= 12 && sum % 10 === 0;
}

// Expiry check for "MM/YY" or "MM/YYYY"
function isValidExpiry(exp: string, now = new Date()) {
  const m = exp.match(/^(\d{2})\/(\d{2}|\d{4})$/);
  if (!m) return false;

  const month = Number(m[1]);
  let year = Number(m[2]);
  if (month < 1 || month > 12) return false;

  if (m[2].length === 2) {
    // interpret YY as 20YY (common in payment forms)
    year = 2000 + year;
  }

  // Expiry is typically valid through the end of the month
  const expiryEnd = new Date(year, month, 0, 23, 59, 59, 999); // day 0 => last day of previous month; month is 1-based here so this works
  return expiryEnd >= now;
}

const checkoutSchema = z.object({
  email: z.email('Invalid email address'),
  cardNumber: z
    .string()
    // .string().min(1, 'Card number is required')
    .transform((s: string) => s.replace(/\s|-/g, "")) // allow "4242 4242..." or "4242-..."
    .refine((s: string) => /^\d{12,19}$/.test(s), { message: "Invalid card number format" })
    .refine((s: string) => luhnCheck(s), { message: "Invalid card number" }),
  expiry: z
    .string()
    // .string().min(1, 'Expiry date is required')
    .refine((s: string) => isValidExpiry(s), { message: "Invalid or expired date" }),
  cvv: z
    .string()
    // .string().min(1, 'CVV is required')
    .refine((s: string) => /^\d{3,4}$/.test(s), { message: "Invalid CVV" }),
  zipcode: z
    // .string()
    .string().min(1, 'Zipcode is required')
    // US ZIP: 12345 or 12345-6789
    .refine((s: string) => /^\d{5}(-\d{4})?$/.test(s), { message: "Invalid ZIP code" }),  
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

export default function Checkout() {
  const { plan } = useParams<{ plan: string }>()
  const navigate = useNavigate()
  const { setSelectedPlan } = usePlanStore()

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  })

  console.log("errors: ", errors);

  const onBack = () => {
    navigate('/')
  }

  const onSubmit = (_data: CheckoutFormData) => {
    if (plan) {
      setSelectedPlan(plan)
    }
    navigate('/')
  }
  
  // TODO: could probably move this into a const file or make these an enum or something
  const plans = {
    free: { name: 'Free Plan', price: 0, period: 'month' },
    starter: { name: 'Starter Plan', price: 19.99, period: 'month' },
    pro: { name: 'Pro Plan', price: 49, period: 'month' },
  }

  // TODO: this shouldnt be keyof - should be real enum values like FREE, STARTER, PRO
  const currentPlan = plans[plan as keyof typeof plans] || plans.starter

  return (
    // TODO: could clean this up with reusable components
    <div className="checkout">
      <div className="checkout-container">
        <h1 className="checkout-title">Complete Your Purchase</h1>
        
        <div className="checkout-content">
          <div className="checkout-summary">
            <h2 className="summary-title">Order Summary</h2>
            <div className="summary-plan">
              <div className="plan-info">
                <h3>{currentPlan.name}</h3>
                <p>${currentPlan.price}/{currentPlan.period}</p>
              </div>
            </div>
            <div className="summary-total">
              <div className="total-row">
                <span>Subtotal</span>
                <span>${currentPlan.price}</span>
              </div>
              <div className="total-row total-final">
                <span>Total</span>
                <span className="total-amount">${currentPlan.price}/{currentPlan.period}</span>
              </div>
            </div>
          </div>

          <div className="checkout-form">
            <h2 className="form-title">Payment Information</h2>
            <form className="payment-form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input {...register('email')} type="email" id="email" placeholder="your@email.com" />
                {errors.email && <p className="form-error">{errors.email.message}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="card">Card Number</label>
                <input {...register('cardNumber')} type="text" id="cardNumber" name="cardNumber" placeholder="1234 5678 9012 3456" />
                {errors.cardNumber && <p className="form-error">{errors.cardNumber.message}</p>}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expiry">Expiry Date</label>
                  <input {...register('expiry')} type="text" id="expiry" name="expiry" placeholder="MM/YY" />
                  {errors.expiry && <p className="form-error">{errors.expiry.message}</p>}
                </div>
                <div className="form-group">
                  <label htmlFor="cvv">CVV</label>
                  <input {...register('cvv')} type="text" id="cvv" name="cvv" placeholder="123" />
                  {errors.cvv && <p className="form-error">{errors.cvv.message}</p>}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="zipcode">Billing Zipcode</label>
                  <input {...register('zipcode')} type="text" id="zipcode" name="zipcode" placeholder="12345" />
                  {errors.zipcode && <p className="form-error">{errors.zipcode.message}</p>}
                </div>
              </div>
              <div className="form-actions">
                <Button variant="primary" className="w-full" type="submit">
                  Complete Purchase
                </Button>
                <Button variant="secondary" className="w-full" type="button" onClick={onBack}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
