import PricingPlans from './PricingPlans'
import { 
  BrowserRouter, 
  Route, 
  Routes, 
} from 'react-router-dom'
import Checkout from './Checkout'
import OrderSummary from './OrderSummary'
import Confirmation from './Confirmation'

export default function Routing() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PricingPlans />} />
        <Route path="/checkout/:plan" element={<Checkout />} />
        <Route path="/order-summary" element={<OrderSummary />} />
        <Route path="/confirmation" element={<Confirmation />} />
      </Routes>
    </BrowserRouter>
  )
}