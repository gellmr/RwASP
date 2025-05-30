import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import AdminApp from '../Admin/AdminApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AdminApp />
  </StrictMode>,
)
