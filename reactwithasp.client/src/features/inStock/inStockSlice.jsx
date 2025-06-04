import { createSlice } from '@reduxjs/toolkit'
export const inStockSlice = createSlice({
  name: 'inStock', // name of slice
  initialState: {
    value: [] // array of objects. Each is an inStock product.
  },
  reducers: {
    setInStock: (state, action) => {
      state.value = action.payload; // set our inStock products array.
    },
    setNoStock: (state, action) => {
      state.value = []; // no products available.
    }
  }
})
// Action creators are generated for each case reducer function
export const { setInStock, setNoStock } = inStockSlice.actions
export default inStockSlice.reducer

