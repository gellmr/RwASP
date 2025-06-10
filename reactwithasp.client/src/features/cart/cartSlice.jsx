import { createSlice } from '@reduxjs/toolkit'
export const cartSlice = createSlice({
  name: 'cart', // name of slice
  initialState: {
    value: [] // array of objects. Each is like { id: 1, product: { id: 1, title: 'River Kayak', description: 'Tame the wilderness.', price: 350, category: 3 }, qty: 5}
  },
  reducers: {
    setCart: (state, action) => {
      state.value = action.payload; // set products array.
    },
    addToCart: (state, action) => {
      const idx = state.value.findIndex(item => item.id === action.payload.id);
      if (idx === -1) {
        state.value = [...state.value, action.payload]; // doesnt exist. Add product to cart
      } else {
        const payloadQty = action.payload.qty; // can be a negative value
        const existingQty = state.value[idx].qty;
        const isAddition = (payloadQty > 0);
        const isSubtract = (payloadQty < 0);
        if (isSubtract && (existingQty + payloadQty) >= 0) {
          // Subtract
          action.payload.qty += existingQty;
          state.value.splice(idx, 1, action.payload); // replace item at index
        } else if (isAddition) {
          // Add
          action.payload.qty += existingQty;
          state.value.splice(idx, 1, action.payload); // replace item at index
        }
      }
    },
    removeFromCart: (state, action) => {
      state.value = state.value.filter(prod => prod.id !== action.payload.id);
    },
    clearCart: (state, action) => {
      state.value = [];
    }
  }
})
// Action creators are generated for each case reducer function
export const { setCart, addToCart, removeFromCart, clearCart } = cartSlice.actions
export default cartSlice.reducer