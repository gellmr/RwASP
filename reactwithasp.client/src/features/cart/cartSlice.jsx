import { createSlice } from '@reduxjs/toolkit'
export const cartSlice = createSlice({
  name: 'cart', // name of slice
  initialState: {
    value: [] // array of objects. Each is a product in the cart.
  },
  reducers: {
    addToCart: (state, action) => {
      state.value = [ ...state.value, action.payload ]; // add product to cart
    }
  }
})
// Action creators are generated for each case reducer function
export const { addToCart } = cartSlice.actions
export default cartSlice.reducer

