import PricingPlans from './PricingPlans'
import { 
  BrowserRouter, 
  Route, 
  Routes, 
} from 'react-router-dom'
import Checkout from './Checkout'

export default function Routing() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PricingPlans />} />
        <Route path="/checkout/:plan" element={<Checkout />} />
      </Routes>
    </BrowserRouter>
  )
}