import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './Components/Header/Header'
import Footer from './Components/Footer/Footer'
import Home from './Page/Home/Home'
import Shop from './Page/Shop/Shop'
import About from './Page/About/About'
import Contact from './Page/Contact/Contact'
import Register from './Page/Auth/Register'
import Privacy from './Page/Privacy/Privacy'
import Term from './Page/Term/Term'
import Login from './Page/Auth/Login'
import Forget from './Page/Auth/Forget'
import VerifyOtp from './Page/Auth/VerifyOtp'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductDetail from './Page/ProductDetail/ProductDetail'
import CartPage from './Page/Cart/Cart'
import CheckoutFlow from './Page/Cart/CheckoutFlow'
import Profile from './Page/Profile/Profile'
import TrackYourOrder from './Page/TrackYourOrder/TrackYourOrder'

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/shop' element={<Shop />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/forget' element={<Forget />} />
        <Route path='/Verify-Otp' element={<VerifyOtp />} />
        <Route path='/privacy' element={<Privacy />} />
        <Route path='/terms' element={<Term />} />
        <Route path='/product-page/:id' element={<ProductDetail />} />
        <Route path='/cart' element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutFlow />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/track-your-order" element={<TrackYourOrder />} />
      </Routes>
      <Footer />
      <ToastContainer />
    </Router>
  )
}

export default App
