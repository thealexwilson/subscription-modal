import clsx from 'clsx'
import Button from './button'
import type { Plan } from '../constants/plans'

interface PlanCardProps {
  plan: Plan
  isCurrentPlan: boolean
  onSelect: (planId: string) => void
}

export default function PlanCard({ plan, isCurrentPlan, onSelect }: PlanCardProps) {
  const allFeatures = [plan.tasks, plan.zaps, ...plan.features]

  return (
    <div className={clsx('plan', plan.featured && 'plan-featured')}>
      <div className="plan-card plan-header">
        <h2 className="plan-name">{plan.name}</h2>
        <span className={clsx('plan-badge', !plan.featured && 'plan-badge-current')}>
          {plan.badge}
        </span>
        <div className="plan-price">
          <span className="price-amount">${plan.price}</span>
          <span className="price-period">/{plan.period}</span>
        </div>
      </div>

      <div className="plan-card plan-features">
        <ul className="plan-feature-list">
          {allFeatures.map((feature) => (
            <li key={feature} className="plan-feature">{feature}</li>
          ))}
        </ul>
      </div>

      <div className="plan-card plan-footer">
        {isCurrentPlan ? (
          <span className="current-plan-indicator">Current Plan</span>
        ) : (
          <Button
            variant="primary"
            className="upgrade-plan-indicator w-full"
            onClick={() => onSelect(plan.id)}
          >
            Select Plan
          </Button>
        )}
      </div>
    </div>
  )
}
