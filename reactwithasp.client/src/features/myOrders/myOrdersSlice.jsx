import { createSlice } from '@reduxjs/toolkit'
export const myOrdersSlice = createSlice({
  name: 'myOrders',
  initialState: {
    value: [] // Each entry is an Order that has be JSON serialised.
  },
  reducers: {
    setMyOrders: (state, action) => {
      state.value = action.payload;
    },
  }
})
export const { setMyOrders } = myOrdersSlice.actions
export default myOrdersSlice.reducer
