import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ProductsProvider } from '@/Shop/ProductsContext';

import './main.css'
import ShopApp from '../Shop/ShopApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProductsProvider>
      <ShopApp />
    </ProductsProvider>
  </StrictMode>,
)
