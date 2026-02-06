import Button from './components/button'
import './Confirmation.scss'
import { useNavigate } from 'react-router-dom'
import { usePlanStore } from './store/usePlanStore'
import { CircleCheck, Rocket, Zap, Calendar, CreditCard } from 'lucide-react'

const plans = {
  free: { name: 'Free Plan', price: 0, period: 'month', tasks: '100 tasks/month', zaps: '5 Zaps' },
  starter: { name: 'Starter Plan', price: 19.99, period: 'month', tasks: '750 tasks/month', zaps: '20 Zaps' },
  pro: { name: 'Pro Plan', price: 49, period: 'month', tasks: '2,000 tasks/month', zaps: 'Unlimited Zaps' },
}

const TAX_RATE = 0.08

export default function Confirmation() {
  const navigate = useNavigate()
  const { selectedPlan } = usePlanStore()

  const planDetails = plans[selectedPlan as keyof typeof plans] || plans.starter
  const tax = planDetails.price * TAX_RATE
  const total = planDetails.price + tax

  const orderDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const orderId = `ZAP-${Date.now().toString(36).toUpperCase()}`

  return (
    <div className="confirmation">
      <div className="confirmation-container">

        <div className="confirmation-success">
          <CircleCheck className="confirmation-success-icon" size={64} strokeWidth={1.5} />
          <h1 className="confirmation-success-title">Payment Successful</h1>
          <p className="confirmation-success-subtitle">
            Your subscription to the {planDetails.name} is now active.
          </p>
        </div>

        <div className="confirmation-card">
          <div className="confirmation-card-header">
            <h2>Order Confirmation</h2>
            <span className="confirmation-id">#{orderId}</span>
          </div>

          <div className="confirmation-details">
            <div className="confirmation-detail-row">
              <div className="confirmation-detail-label">
                <Calendar size={16} />
                <span>Date</span>
              </div>
              <span className="confirmation-detail-value">{orderDate}</span>
            </div>

            <div className="confirmation-detail-row">
              <div className="confirmation-detail-label">
                <CreditCard size={16} />
                <span>Payment</span>
              </div>
              <span className="confirmation-detail-value">**** **** **** 3456</span>
            </div>

            <div className="confirmation-detail-row">
              <div className="confirmation-detail-label">
                <Zap size={16} />
                <span>Plan</span>
              </div>
              <span className="confirmation-detail-value">{planDetails.name}</span>
            </div>
          </div>

          <div className="confirmation-divider" />

          <div className="confirmation-plan-summary">
            <h3>What's included</h3>
            <ul className="confirmation-features">
              <li>
                <CircleCheck size={16} />
                <span>{planDetails.tasks}</span>
              </li>
              <li>
                <CircleCheck size={16} />
                <span>{planDetails.zaps}</span>
              </li>
              <li>
                <CircleCheck size={16} />
                <span>Billed ${planDetails.price.toFixed(2)}/{planDetails.period}</span>
              </li>
            </ul>
          </div>

          <div className="confirmation-divider" />

          <div className="confirmation-totals">
            <div className="confirmation-line-item">
              <span>Subtotal</span>
              <span>${planDetails.price.toFixed(2)}</span>
            </div>
            <div className="confirmation-line-item">
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="confirmation-line-item confirmation-line-total">
              <span>Total charged</span>
              <span className="confirmation-total-amount">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="confirmation-actions">
          <Button variant="primary" className="w-full" onClick={() => navigate('/')}>
            <Rocket size={16} />
            Get Started
          </Button>
          <Button variant="secondary" className="w-full" onClick={() => navigate('/')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
