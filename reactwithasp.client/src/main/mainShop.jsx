import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import './main.css'
import ShopLayout from "@/layouts/ShopLayout";
import Shop from '../Shop/Shop.jsx'
import Cart from '../Shop/Cart.jsx'
import store from '@/Shop/store.jsx'
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route element={<ShopLayout />}>
            <Route path="/cart" element={<Cart />} />

            <Route path="/:page?" element={<Shop />} />
            <Route path="/category/:category/:page?" element={<Shop />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
)