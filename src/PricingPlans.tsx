import Button from './components/button'
import './PricingPlans.scss'
import { useNavigate } from 'react-router-dom'
import { usePlanStore } from './store/usePlanStore'

export default function PricingPlans() {
  const navigate = useNavigate()

  const { selectedPlan, setSelectedPlan } = usePlanStore()

  const onSelectPlan = (plan: string) => {
    setSelectedPlan(plan)
    navigate(`/checkout/${plan}`)
  }

  return (
    <div className="pricing-plans">
      <div className="pricing-header">
        <h1 className="pricing-title">Choose Your Plan</h1>
        <p className="pricing-subtitle">Automate your work with Zapier</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        {/* TODO: Each plan could be moved out into a reusable component */}
        <div className='plan plan-featured'>
          <div className='plan-card plan-header'>
            <h2 className="plan-name">Free Plan</h2>
            <span className="plan-badge plan-badge">Free!</span>
            <div className="plan-price">
              <span className="price-amount">$0</span>
              <span className="price-period">/month</span>
            </div>
          </div>
          <div className='plan-card plan-features'>
            <ul className="plan-feature-list">
              <li className='plan-feature'>100 tasks/month</li>
              <li className='plan-feature'>5 Zaps</li>
              <li className='plan-feature'>Single-step Zaps</li>
            </ul>
          </div>
          <div className='plan-card plan-footer'>
            {/* TODO: Move out into a reusable component */}
            { selectedPlan === 'free' ? (
              <span className="current-plan-indicator">Current Plan</span>
            ) : (
              <Button 
                variant="primary" 
                className="upgrade-plan-indicator w-full" 
                onClick={() => onSelectPlan('free')}
              >
                Select Plan
              </Button>
            )}
          </div>
        </div>

        <div className='plan'>
          <div className='plan-card plan-header'> 
            <h2 className="plan-name">Starter Plan</h2>
            <span className="plan-badge plan-badge-current">Most Popular!</span>
            <div className="plan-price">
              <span className="price-amount">$19.99</span>
              <span className="price-period">/month</span>
            </div>
          </div>
          <div className='plan-card plan-features'>
            <ul className="plan-feature-list">
              <li className='plan-feature'>750 tasks/month</li>
              <li className='plan-feature'>20 Zaps</li>
              <li className='plan-feature'>Multi-step Zaps</li>
            </ul>
          </div>
          <div className='plan-card plan-footer'>
            { selectedPlan === 'starter' ? (
              <span className="current-plan-indicator">Current Plan</span>
            ) : (
              <Button 
                variant="primary" 
                className="upgrade-plan-indicator w-full" 
                onClick={() => onSelectPlan('starter')}
              >
                Select Plan
              </Button>
            )}
          </div>
        </div>

        <div className='plan'>
          <div className='plan-card plan-header'>
            <h2 className="plan-name">Pro Plan</h2>
            <span className="plan-badge plan-badge-current">Advanced Features!</span>
            <div className="plan-price">
              <span className="price-amount">$49</span>
              <span className="price-period">/month</span>
            </div>
          </div>
          <div className='plan-card plan-features'>
            <ul className="plan-feature-list">
              <li className='plan-feature'>2,000 tasks/month</li>
              <li className='plan-feature'>Unlimited Zaps</li>
              <li className='plan-feature'>Premium apps</li>
            </ul>
          </div>
          <div className='plan-card plan-footer'>
            { selectedPlan === 'pro' ? (
              <span className="current-plan-indicator">Current Plan</span>
            ) : (
              <Button 
                variant="primary" 
                className="upgrade-plan-indicator w-full" 
                onClick={() => onSelectPlan('pro')}
              >
                Select Plan
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
