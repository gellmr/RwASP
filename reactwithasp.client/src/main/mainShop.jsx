import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import ShopApp from '../Shop/ShopApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ShopApp />
  </StrictMode>,
)
