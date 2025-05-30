import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// css imports
import 'bootstrap/dist/css/bootstrap.css';
import './main.css'
// js imports
//import 'jquery/dist/jquery.min.js';
import 'bootstrap/dist/js/bootstrap.min.js';
// other imports
import AdminApp from '../Admin/AdminApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AdminApp />
  </StrictMode>,
)
