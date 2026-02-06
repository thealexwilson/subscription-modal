import { create } from 'zustand'

interface PlanState {
  selectedPlan: string
  setSelectedPlan: (plan: string) => void
  currentPlan: string
  setCurrentPlan: (plan: string) => void
}

export const usePlanStore = create<PlanState>((set) => ({
  selectedPlan: 'free',
  setSelectedPlan: (plan) => set({ selectedPlan: plan }),
  currentPlan: 'free',
  setCurrentPlan: (plan) => set({ currentPlan: plan }),
}))
