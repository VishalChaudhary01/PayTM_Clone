import  { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Signup } from './pages/SignupPage'
import { Signin } from './pages/SigninPage'
import { Dashboard } from './pages/Dashboard'
import { SendMoney } from './pages/SendMoneyPage'


export default function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/signup' element={<Signup />} />
      <Route path='/signin' element={<Signin />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/send' element={<SendMoney />} />
    </Routes>
    </BrowserRouter>
    </>
  )
}