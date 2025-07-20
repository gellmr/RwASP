import { configureStore } from '@reduxjs/toolkit'
import inStockReducer from '@/features/inStock/inStockSlice.jsx'
import categoriesReducer from '@/features/categories/categoriesSlice.jsx'
import cartReducer    from '@/features/cart/cartSlice.jsx'
import searchReducer  from '@/features/search/searchSlice.jsx'
import adminOrdersReducer from '@/features/admin/orders/adminOrdersSlice.jsx'
import adminProductsReducer from '@/features/admin/products/adminProductsSlice.jsx'
import loginReducer from '@/features/login/loginSlice.jsx'
import myOrdersReducer from '@/features/myOrders/myOrdersSlice.jsx'

export default configureStore({
  reducer: {
    // name of slice:   name of Redux reducer object, (imported above).
    inStock:            inStockReducer,
    categories:         categoriesReducer,
    cart:               cartReducer,
    search:             searchReducer,
    adminOrders:        adminOrdersReducer,
    adminProducts:      adminProductsReducer,
    login:              loginReducer,
    myOrders:           myOrdersReducer,
  }
})