import { createSlice } from '@reduxjs/toolkit'

export const adminOrdersSlice = createSlice({
  name: 'adminOrders', // Name of slice
  initialState: {
    lines: [] // Array of objects.
  },
  reducers: {
    setAdminOrders: (state, action) => {
      state.lines = action.payload;
    }
  }
})

export const { setAdminOrders } = adminOrdersSlice.actions
export default adminOrdersSlice.reducer