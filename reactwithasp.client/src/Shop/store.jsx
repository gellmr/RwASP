import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import inStockReducer from '@/features/inStock/inStockSlice.jsx'
import categoriesReducer from '@/features/categories/categoriesSlice.jsx'
import cartReducer    from '@/features/cart/cartSlice.jsx'
import searchReducer  from '@/features/search/searchSlice.jsx'
import adminOrdersReducer   from '@/features/admin/orders/adminOrdersSlice.jsx'
import backlogSearchReducer from '@/features/admin/orders/backlogSearch.jsx'
import adminProductsReducer from '@/features/admin/products/adminProductsSlice.jsx'
import adminUserAccountsReducer from '@/features/admin/useraccounts/adminUserAccountsSlice.jsx'
import adminUserOrdersReducer from '@/features/admin/userorders/adminUserOrdersSlice.jsx'
import adminEditUserReducer from '@/features/admin/edituser/adminEditUserSlice.jsx'
import loginReducer from '@/features/login/loginSlice.jsx'
import myOrdersReducer from '@/features/myOrders/myOrdersSlice.jsx'
import myOrderReducer from '@/features/myOrder/myOrderSlice.jsx'

// Configure the Redux store

const rootReducer = combineReducers({
  // name of slice:   name of Redux reducer object, (imported above).
  inStock:            inStockReducer,
  categories:         categoriesReducer,
  cart:               cartReducer,
  search:             searchReducer,
  adminOrders:        adminOrdersReducer,
  backlogSearch:      backlogSearchReducer,
  adminProducts:      adminProductsReducer,
  adminUserAccounts:  adminUserAccountsReducer,
  adminUserOrders:    adminUserOrdersReducer,
  adminEditUser:      adminEditUserReducer,
  login:              loginReducer,
  myOrders:           myOrdersReducer,
  myOrder:            myOrderReducer,
});

const persistConfig = { key: 'root', storage };
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Redux-persist adds non-serializable actions, so disable the check
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
      },
    }),
});

export const persistor = persistStore(store);