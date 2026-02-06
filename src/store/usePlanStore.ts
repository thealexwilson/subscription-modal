import { create } from 'zustand'

interface PlanState {
  selectedPlan: string
  setSelectedPlan: (plan: string) => void
}

export const usePlanStore = create<PlanState>((set) => ({
  selectedPlan: 'free',
  setSelectedPlan: (plan) => set({ selectedPlan: plan }),
}))
