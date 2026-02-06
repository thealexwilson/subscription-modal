import Button from './components/button'
import FormField from './components/FormField'
import './Checkout.scss'
import { useParams, useNavigate } from 'react-router-dom'
import { usePlanStore } from './store/usePlanStore'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { checkoutSchema, type CheckoutFormData } from './lib/checkoutSchema'
import { getPlanById } from './constants/plans'

export default function Checkout() {
  const { plan } = useParams<{ plan: string }>()
  const navigate = useNavigate()
  const { setSelectedPlan } = usePlanStore()

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  })

  const onBack = () => {
    navigate('/')
  }

  const onSubmit = (_data: CheckoutFormData) => {
    if (plan) {
      setSelectedPlan(plan)
    }
    navigate('/order-summary')
  }

  const currentPlan = getPlanById(plan ?? '')

  return (
    <div className="checkout">
      <div className="checkout-container">
        <h1 className="checkout-title">Complete Your Purchase</h1>
        
        <div className="checkout-content">
          <div className="checkout-summary">
            <h2 className="summary-title">Order Summary</h2>
            <div className="summary-plan">
              <div className="plan-info">
                <h3>{currentPlan.name}</h3>
                <p>${currentPlan.price}/{currentPlan.period}</p>
              </div>
            </div>
            <div className="summary-total">
              <div className="total-row">
                <span>Subtotal</span>
                <span>${currentPlan.price}</span>
              </div>
              <div className="total-row total-final">
                <span>Total</span>
                <span className="total-amount">${currentPlan.price}/{currentPlan.period}</span>
              </div>
            </div>
          </div>

          <div className="checkout-form">
            <h2 className="form-title">Payment Information</h2>
            <form className="payment-form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <FormField label="Email" htmlFor="email" error={errors.email?.message}>
                <input {...register('email')} type="email" id="email" placeholder="your@email.com" />
              </FormField>
              <FormField label="Card Number" htmlFor="cardNumber" error={errors.cardNumber?.message}>
                <input {...register('cardNumber')} type="text" id="cardNumber" placeholder="1234 5678 9012 3456" />
              </FormField>
              <div className="form-row">
                <FormField label="Expiry Date" htmlFor="expiry" error={errors.expiry?.message}>
                  <input {...register('expiry')} type="text" id="expiry" placeholder="MM/YY" />
                </FormField>
                <FormField label="CVV" htmlFor="cvv" error={errors.cvv?.message}>
                  <input {...register('cvv')} type="text" id="cvv" placeholder="123" />
                </FormField>
              </div>
              <div className="form-row">
                <FormField label="Billing Zipcode" htmlFor="zipcode" error={errors.zipcode?.message}>
                  <input {...register('zipcode')} type="text" id="zipcode" placeholder="12345" />
                </FormField>
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
