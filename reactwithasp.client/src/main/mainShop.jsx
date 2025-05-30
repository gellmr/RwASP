import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// css imports
import 'bootstrap/dist/css/bootstrap.css';
import './main.css'
// js imports
import 'bootstrap/dist/js/bootstrap.min.js';
// other imports
import ShopApp from '../Shop/ShopApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ShopApp />
  </StrictMode>,
)
