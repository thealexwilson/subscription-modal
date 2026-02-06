import Button from './components/button'
import './Checkout.scss'
import { useParams, useNavigate } from 'react-router-dom'
import { usePlanStore } from './store/usePlanStore'

export default function Checkout() {
  const { plan } = useParams<{ plan: string }>()
  const navigate = useNavigate()
  const { setSelectedPlan } = usePlanStore()

  const onBack = () => {
    navigate('/')
  }

  const handleCompletePurchase = (e: React.SubmitEvent) => {
    e.preventDefault()

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
            <form className="payment-form" onSubmit={handleCompletePurchase}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" placeholder="your@email.com" required />
              </div>
              <div className="form-group">
                <label htmlFor="card">Card Number</label>
                <input type="text" id="card" name="card" placeholder="1234 5678 9012 3456" required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expiry">Expiry Date</label>
                  <input type="text" id="expiry" name="expiry" placeholder="MM/YY" required />
                </div>
                <div className="form-group">
                  <label htmlFor="cvv">CVV</label>
                  <input type="text" id="cvv" name="cvv" placeholder="123" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expiry">Billing Zipcode</label>
                  <input type="text" id="zipcode" name="zipcode" placeholder="12345" required />
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
