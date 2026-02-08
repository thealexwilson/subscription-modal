import './PricingPlans.scss'
import { useNavigate } from 'react-router-dom'
import { usePlanStore } from './store/usePlanStore'
import PlanCard from './components/PlanCard'
import { PLANS } from './constants/plans'

export default function PricingPlans() {
  const navigate = useNavigate()
  const { selectedPlan, setSelectedPlan } = usePlanStore()

  const onSelectPlan = (planId: string) => {
    setSelectedPlan(planId)
    navigate(`/checkout/${planId}`)
  }

  return (
    <div className="pricing-plans">
      <div className="pricing-header">
        <h1 className="pricing-title">Choose Your Plan</h1>
        <p className="pricing-subtitle">Choose the plan that works for you</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PLANS.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isCurrentPlan={selectedPlan === plan.id}
            onSelect={onSelectPlan}
          />
        ))}
      </div>
    </div>
  )
}
