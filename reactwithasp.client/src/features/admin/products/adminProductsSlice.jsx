import { createSlice } from '@reduxjs/toolkit'

export const adminProductsSlice = createSlice({
  name: 'adminProducts',
  initialState: {
    value: [] // Array of objects.
  },
  reducers: {
    setAdminProducts: (state, action) => {
      state.value = action.payload;
    }
  }
})

export const { setAdminProducts } = adminProductsSlice.actions
export default adminProductsSlice.reducer