import { useState } from 'react'
import PricingPlans from './PricingPlans'
import Checkout from './Checkout'

export default function App() {
  const [selectedPlan, setSelectedPlan] = useState<string>("free")

  if (selectedPlan) {
    return <Checkout plan={selectedPlan} onBack={() => setSelectedPlan("free")} />
  }

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <PricingPlans onUpgrade={setSelectedPlan} />
      </div>
    </main>
  )
}