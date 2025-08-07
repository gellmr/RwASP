import { createSlice } from '@reduxjs/toolkit'

export const adminUserOrdersSlice = createSlice({
  name: 'adminUserOrders',
  initialState: {
    orders: []
  },
  reducers: {
    setAdminUserOrders: (state, action) => {
      state.orders = action.payload;
    },
  }
})

export const { setAdminUserOrders } = adminUserOrdersSlice.actions
export default adminUserOrdersSlice.reducer