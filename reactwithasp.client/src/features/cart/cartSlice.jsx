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
      const idx = state.value.findIndex(item => item.id === action.payload.id);
      if (idx === -1) {
        state.value = [...state.value, action.payload]; // add product to cart
      } else {
        action.payload.qty += state.value[idx].qty;
        state.value.splice(idx, 1, action.payload); // replace item at index
      }
    },
    removeFromCart: (state, action) => {
      state.value = state.value.filter(prod => prod.id !== action.payload.id);
    }
  }
})
// Action creators are generated for each case reducer function
export const { setCart, addToCart, removeFromCart } = cartSlice.actions
export default cartSlice.reducer