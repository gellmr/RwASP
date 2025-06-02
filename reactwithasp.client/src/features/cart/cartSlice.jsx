import { createSlice } from '@reduxjs/toolkit'
export const cartSlice = createSlice({
  name: 'cart', // name of slice
  initialState: {
    value: [] // array of objects. Each is a product in the cart.
  },
  reducers: {
    setCart: (state, action) => {
      state.value = action.payload; // set products array.
    },
    addToCart: (state, action) => {
      state.value = [ ...state.value, action.payload ]; // add product to cart
    }
  }
})
// Action creators are generated for each case reducer function
export const { setCart, addToCart } = cartSlice.actions
export default cartSlice.reducer