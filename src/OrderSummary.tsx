import Button from './components/button'
import './OrderSummary.scss'
import { useNavigate } from 'react-router-dom'
import { usePlanStore } from './store/usePlanStore'
import { ArrowLeft, Zap, CircleCheck } from 'lucide-react'
import { getPlanById, TAX_RATE } from './constants/plans'

export const prorateCharges = (subtotal: number, daysInMonth: number, remainingDays: number) => {
  const proratedAmount = Math.round(((subtotal / daysInMonth) * remainingDays) * 100) / 100
  
  return proratedAmount + (proratedAmount * TAX_RATE)
}

export default function OrderSummary() {
  const navigate = useNavigate()
  const { selectedPlan, setCurrentPlan } = usePlanStore()

  const planDetails = getPlanById(selectedPlan)

  const subtotal = planDetails.price
  const tax = subtotal * TAX_RATE
  const total = subtotal + tax
  const now = new Date()
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const remainingDays = daysInMonth - now.getDate()
  // TODO: should we handle other date formats or locales?
  const nextBillingDate = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  const shouldProrate = () => {
    return selectedPlan !== 'free' && new Date().getDate() !== 1
  };

  const onCompletePurchase = () => {
    setCurrentPlan(selectedPlan)
    navigate('/confirmation')
  }

  return (
    <div className="os">
      <div className="os-container">

        <div className="os-header">
          <button className="os-back" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>
          <h1 className="os-title">Order Summary</h1>
          <p className="os-subtitle">Review your order before completing payment</p>
        </div>

        <div className="os-content">
          {/* Plan card */}
          <div className="os-plan-card">
            <div className="os-plan-badge">
              <Zap size={20} />
            </div>
            <div className="os-plan-info">
              <h2 className="os-plan-name">{planDetails.name}</h2>
              <p className="os-plan-price">
                <span className="os-plan-amount">${subtotal.toFixed(2)}</span>
                <span className="os-plan-period">/{planDetails.period}</span>
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="os-features-card">
            <h3 className="os-section-title">Plan includes</h3>
            <ul className="os-features">
              <li>
                <CircleCheck size={16} />
                <span>{planDetails.tasks}</span>
              </li>
              <li>
                <CircleCheck size={16} />
                <span>{planDetails.zaps}</span>
              </li>
              {planDetails.features.map((feature) => (
                <li key={feature}>
                  <CircleCheck size={16} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Billing breakdown */}
          <div className="os-billing-card">
            <h3 className="os-section-title">Billing details</h3>

            <div className="os-billing-rows">
              <div className="os-billing-row">
                <span>Plan price</span>
                <span>${subtotal.toFixed(2)}/{planDetails.period}</span>
              </div>
              <div className="os-billing-row">
                <span>Billing frequency</span>
                <span>Monthly</span>
              </div>
              <div className="os-billing-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="os-billing-row">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="os-billing-total">
              <span>Due today</span>
              { shouldProrate() ? (
                <div className="os-total-col">
                  <span className="os-total-amount">
                    ${prorateCharges(subtotal, daysInMonth, remainingDays).toFixed(2)}
                    {' '}
                    <span className="os-total-prorated">
                      (Prorated for {remainingDays} days)
                    </span>
                  </span>
                  <span className="os-total-next">
                    Next billing: ${total.toFixed(2)} on {nextBillingDate}
                  </span>
                </div>
              ) : (
                <span className="os-total-amount">${total.toFixed(2)}</span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="os-actions">
          <Button
            variant="primary"
            className="w-full"
            onClick={() => onCompletePurchase()}
          >
            Complete Purchase
          </Button>
          <Button variant="secondary" className="w-full" onClick={() => navigate('/')}>
            Cancel
          </Button>
        </div>

      </div>
    </div>
  )
}
