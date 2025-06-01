import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import ShopApp from '../Shop/ShopApp.jsx'
import store from '@/Shop/store.jsx'
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ShopApp />
    </Provider>
  </StrictMode>
)