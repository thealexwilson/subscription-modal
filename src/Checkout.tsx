import Button from './components/button'
import './Checkout.scss'

interface CheckoutProps {
  plan: string
  onBack: () => void
}

export default function Checkout({ plan, onBack }: CheckoutProps) {

  const planDetails = {
    free: { name: 'Free Plan', price: 0, period: 'month' },
    starter: { name: 'Starter Plan', price: 19.99, period: 'month' },
    pro: { name: 'Pro Plan', price: 49, period: 'month' },
  }

  const selectedPlan = planDetails[plan as keyof typeof planDetails] || planDetails.starter

  return (
    <div className="checkout">
      <div className="checkout-container">
        <h1 className="checkout-title">Complete Your Purchase</h1>
        
        <div className="checkout-content">
          <div className="checkout-summary">
            <h2 className="summary-title">Order Summary</h2>
            <div className="summary-plan">
              <div className="plan-info">
                <h3>{selectedPlan.name}</h3>
                <p>${selectedPlan.price}/{selectedPlan.period}</p>
              </div>
            </div>
            <div className="summary-total">
              <div className="total-row">
                <span>Subtotal</span>
                <span>${selectedPlan.price}</span>
              </div>
              <div className="total-row total-final">
                <span>Total</span>
                <span className="total-amount">${selectedPlan.price}/{selectedPlan.period}</span>
              </div>
            </div>
          </div>

          <div className="checkout-form">
            <h2 className="form-title">Payment Information</h2>
            <form className="payment-form">
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
