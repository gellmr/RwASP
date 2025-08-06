import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import '@/main/main.css'
import ShopLayout from "@/layouts/ShopLayout";
import NoShopLayout from "@/layouts/NoShopLayout";
import Shop from '@/Shop/Shop.jsx'
import Cart from '@/Shop/Cart.jsx'
import MyOrders from '@/Shop/MyOrders.jsx'
import MyOrderDetail from '@/Shop/MyOrderDetail.jsx'
import Checkout from '@/Shop/Checkout.jsx'
import CheckoutSuccess from '@/Shop/CheckoutSuccess.jsx'
import store from '@/Shop/store.jsx'
import AdminLogin from "@/Admin/AdminLogin.jsx";
import AdminLayout from "@/Admin/AdminLayout.jsx";
import AdminOrders from "@/Admin/AdminOrders.jsx";
import AdminOrder from "@/Admin/AdminOrder.jsx";
import AdminProducts from "@/Admin/AdminProducts.jsx";
import AdminUserAccounts from "@/Admin/AdminUserAccounts.jsx";
import AdminUserEdit from "@/Admin/AdminUserEdit.jsx";
import AdminUserOrders from "@/Admin/AdminUserOrders.jsx";
import AdminUserPayments from "@/Admin/AdminUserPayments.jsx";
import LoginLayout from "@/layouts/LoginLayout.jsx";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')).render(
  //<StrictMode>
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route element={<LoginLayout />}>
            <Route path="/admin" element={<AdminLogin />} />
          </Route>

          <Route element={<AdminLayout />}>
            <Route path="/admin/orders/:page?" element={<AdminOrders />} />
            <Route path="/admin/order/:orderid?" element={<AdminOrder />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/useraccounts" element={<AdminUserAccounts />} />
            <Route path="/admin/user/:userid/edit"   element={<AdminUserEdit />} />
            <Route path="/admin/user/:userid/orders" element={<AdminUserOrders />} />
            <Route path="/admin/user/:userid/payments" element={<AdminUserPayments />} />
          </Route>

          <Route element={<ShopLayout />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/:page?" element={<Shop />} />
            <Route path="/category/:category/:page?" element={<Shop />} />
            <Route path="/myorders" element={<MyOrders />} />
            <Route path="/myorders/:orderid" element={<MyOrderDetail />} />
          </Route>

          <Route element={<NoShopLayout />}>
            <Route path="/checkoutsuccess" element={<CheckoutSuccess />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </GoogleOAuthProvider>
  //</StrictMode>
)