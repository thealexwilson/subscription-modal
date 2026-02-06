import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import PricingPlans from './PricingPlans'
import OrderSummary from './OrderSummary'
import Checkout from './Checkout'
import Confirmation from './Confirmation'
import { usePlanStore } from './store/usePlanStore'

/** Render the full app with all routes, starting at the given path */
function renderApp(initialPath = '/') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/" element={<PricingPlans />} />
        <Route path="/checkout/:plan" element={<Checkout />} />
        <Route path="/order-summary" element={<OrderSummary />} />
        <Route path="/confirmation" element={<Confirmation />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('Plan selection flow', () => {
  afterEach(() => {
    cleanup()
  })

  beforeEach(() => {
    usePlanStore.setState({ selectedPlan: 'free', currentPlan: 'free' })
  })

  // ── Pricing Plans page ──

  describe('Pricing Plans page', () => {
    it('renders all three plans', () => {
      renderApp('/')
      expect(screen.getByText('Free Plan')).toBeDefined()
      expect(screen.getByText('Starter Plan')).toBeDefined()
      expect(screen.getByText('Pro Plan')).toBeDefined()
    })

    it('shows "Current Plan" indicator for the default plan', () => {
      renderApp('/')
      const indicators = screen.getAllByText('Current Plan')
      expect(indicators.length).toBeGreaterThanOrEqual(1)
    })

    it('shows "Select Plan" buttons for non-current plans', () => {
      renderApp('/')
      const selectButtons = screen.getAllByText('Select Plan')
      expect(selectButtons.length).toBe(2)
    })

    it('updates the Zustand store when selecting a plan', async () => {
      const user = userEvent.setup()
      renderApp('/')

      const selectButtons = screen.getAllByText('Select Plan')
      await user.click(selectButtons[1]) // Pro

      expect(usePlanStore.getState().selectedPlan).toBe('pro')
    })

    it('navigates to checkout when selecting the Starter plan', async () => {
      const user = userEvent.setup()
      renderApp('/')

      const selectButtons = screen.getAllByText('Select Plan')
      await user.click(selectButtons[0]) // Starter

      expect(await screen.findByText('Complete Your Purchase')).toBeDefined()
    })
  })

  // ── Order Summary page ──

  describe('Order Summary page', () => {
    it('displays the selected plan name', () => {
      usePlanStore.setState({ selectedPlan: 'starter' })
      renderApp('/order-summary')

      expect(screen.getByText('Starter Plan')).toBeDefined()
      expect(screen.getByText('Order Summary')).toBeDefined()
    })

    it('shows the plan price', () => {
      usePlanStore.setState({ selectedPlan: 'starter' })
      renderApp('/order-summary')

      // Price appears in multiple spots (plan card + billing breakdown)
      const priceElements = screen.getAllByText('$19.99')
      expect(priceElements.length).toBeGreaterThanOrEqual(1)
    })

    it('shows tax calculation at 8%', () => {
      usePlanStore.setState({ selectedPlan: 'pro' })
      renderApp('/order-summary')

      expect(screen.getByText('Tax (8%)')).toBeDefined()
      expect(screen.getByText('$3.92')).toBeDefined()
    })

    it('shows monthly billing frequency', () => {
      usePlanStore.setState({ selectedPlan: 'starter' })
      renderApp('/order-summary')

      expect(screen.getByText('Monthly')).toBeDefined()
    })

    it('navigates back to plans when clicking Cancel', async () => {
      const user = userEvent.setup()
      usePlanStore.setState({ selectedPlan: 'starter' })
      renderApp('/order-summary')

      await user.click(screen.getByText('Cancel'))

      expect(await screen.findByText('Choose Your Plan')).toBeDefined()
    })

    it('navigates to confirmation when clicking Complete Purchase', async () => {
      const user = userEvent.setup()
      usePlanStore.setState({ selectedPlan: 'starter' })
      renderApp('/order-summary')

      await user.click(screen.getByText('Complete Purchase'))

      expect(await screen.findByText('Payment Successful')).toBeDefined()
    })
  })

  // ── Checkout page ──

  describe('Checkout page', () => {
    it('displays the plan in the order summary sidebar', () => {
      renderApp('/checkout/starter')
      expect(screen.getByText('Starter Plan')).toBeDefined()
      expect(screen.getByText('Complete Your Purchase')).toBeDefined()
    })

    it('shows validation errors when submitting empty form', async () => {
      const user = userEvent.setup()
      renderApp('/checkout/starter')

      await user.click(screen.getByText('Complete Purchase'))

      expect(await screen.findByText('Email is required')).toBeDefined()
    })

    it('navigates to order summary after valid submission', async () => {
      const user = userEvent.setup()
      usePlanStore.setState({ selectedPlan: 'starter' })
      renderApp('/checkout/starter')

      await user.type(screen.getByPlaceholderText('your@email.com'), 'test@example.com')
      await user.type(screen.getByPlaceholderText('1234 5678 9012 3456'), '4242424242424242')
      await user.type(screen.getByPlaceholderText('MM/YY'), '12/30')
      await user.type(screen.getByPlaceholderText('123'), '999')
      await user.type(screen.getByPlaceholderText('12345'), '90210')
      await user.click(screen.getByText('Complete Purchase'))

      expect(await screen.findByText('Order Summary')).toBeDefined()
    })

    it('navigates back to plans when clicking Cancel', async () => {
      const user = userEvent.setup()
      renderApp('/checkout/starter')

      await user.click(screen.getByText('Cancel'))

      expect(await screen.findByText('Choose Your Plan')).toBeDefined()
    })
  })

  // ── Confirmation page ──

  describe('Confirmation page', () => {
    it('shows success message', () => {
      usePlanStore.setState({ selectedPlan: 'pro' })
      renderApp('/confirmation')

      expect(screen.getByText('Payment Successful')).toBeDefined()
    })

    it('displays the selected plan name', () => {
      usePlanStore.setState({ selectedPlan: 'pro' })
      renderApp('/confirmation')

      // Plan name appears in both success message and plan detail row
      const planRefs = screen.getAllByText(/Pro Plan/)
      expect(planRefs.length).toBeGreaterThanOrEqual(1)
    })

    it('displays the correct total with tax', () => {
      usePlanStore.setState({ selectedPlan: 'starter' })
      renderApp('/confirmation')

      // Starter: $19.99 + ($19.99 * 0.08) = $21.59
      expect(screen.getByText('$21.59')).toBeDefined()
    })

    it('shows "Get Started" and "Back to Dashboard" buttons', () => {
      usePlanStore.setState({ selectedPlan: 'starter' })
      renderApp('/confirmation')

      expect(screen.getByText('Get Started')).toBeDefined()
      expect(screen.getByText('Back to Dashboard')).toBeDefined()
    })

    it('navigates back to plans when clicking "Get Started"', async () => {
      const user = userEvent.setup()
      usePlanStore.setState({ selectedPlan: 'starter' })
      renderApp('/confirmation')

      await user.click(screen.getByText('Get Started'))

      expect(await screen.findByText('Choose Your Plan')).toBeDefined()
    })
  })

  // ── Full flow: Plans → Checkout → Order Summary → Confirmation ──

  describe('Full flow', () => {
    it('completes the entire purchase flow for the Starter plan', async () => {
      const user = userEvent.setup()
      renderApp('/')

      // 1. Select Starter plan from pricing page
      const selectButtons = screen.getAllByText('Select Plan')
      await user.click(selectButtons[0])

      // 2. Should navigate to checkout
      expect(await screen.findByText('Complete Your Purchase')).toBeDefined()
      expect(usePlanStore.getState().selectedPlan).toBe('starter')

      // 3. Fill out checkout form and submit
      await user.type(screen.getByPlaceholderText('your@email.com'), 'test@example.com')
      await user.type(screen.getByPlaceholderText('1234 5678 9012 3456'), '4242424242424242')
      await user.type(screen.getByPlaceholderText('MM/YY'), '12/30')
      await user.type(screen.getByPlaceholderText('123'), '999')
      await user.type(screen.getByPlaceholderText('12345'), '90210')
      await user.click(screen.getByText('Complete Purchase'))

      // 4. Should navigate to order summary
      expect(await screen.findByText('Order Summary')).toBeDefined()
      expect(screen.getByText('Starter Plan')).toBeDefined()
      expect(screen.getByText('Tax (8%)')).toBeDefined()

      // 5. Complete purchase from order summary
      await user.click(screen.getByText('Complete Purchase'))

      // 6. Should navigate to confirmation page
      expect(await screen.findByText('Payment Successful')).toBeDefined()
      const planRefs = screen.getAllByText(/Starter Plan/)
      expect(planRefs.length).toBeGreaterThanOrEqual(1)
      expect(screen.getByText('Get Started')).toBeDefined()
    })
  })
})
