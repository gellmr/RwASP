import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CartProvider } from '@/Shop/CartContext';

import './main.css'
import ShopApp from '../Shop/ShopApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
      <ShopApp />
    </CartProvider>
  </StrictMode>,
)
