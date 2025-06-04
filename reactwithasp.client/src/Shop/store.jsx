import { configureStore } from '@reduxjs/toolkit'
import inStockReducer from '@/features/inStock/inStockSlice.jsx'
import categoriesReducer from '@/features/categories/categoriesSlice.jsx'
import cartReducer    from '@/features/cart/cartSlice.jsx'

export default configureStore({
  reducer: {
    // name of slice:   name of Redux reducer object, (imported above).
    inStock:            inStockReducer,
    categories:         categoriesReducer,
    cart:               cartReducer,
  }
})