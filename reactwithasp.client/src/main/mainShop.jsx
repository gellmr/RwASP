import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import '@/main/main.css'
import ShopLayout from "@/layouts/ShopLayout";
import Shop from '../Shop/Shop.jsx'
import Cart from '../Shop/Cart.jsx'
import Checkout from '../Shop/Checkout.jsx'
import CheckoutSuccess from '../Shop/CheckoutSuccess.jsx'
import store from '@/Shop/store.jsx'
import AdminLogin from "@/Admin/AdminLogin.jsx";
import AdminLayout from "@/Admin/AdminLayout.jsx";
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminLogin />} />
          </Route>

          <Route element={<ShopLayout />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkoutsuccess" element={<CheckoutSuccess />} />
            <Route path="/:page?" element={<Shop />} />
            <Route path="/category/:category/:page?" element={<Shop />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
)