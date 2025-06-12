import { createSlice } from '@reduxjs/toolkit'
export const cartSlice = createSlice({
  name: 'cart', // name of slice
  initialState: {
    value: [], // array of objects. Each object in the array is like...
    // {
    //   id: 1,
    //   product: { id: 1, title: 'River Kayak', description: 'Tame the wilderness.', price: 350, category: 3 },
    //   qty: 5
    // }
    isLoading: false,
  },
  reducers: {
    setCart: (state, action) => {
      state.value = action.payload; // set products array.
    },
    addToCart: (state, action) => {
      state.isLoading = true;
      const cartIndex = state.value.findIndex(item => item.id === action.payload.id);
      const payloadQty = action.payload.qty; // can be a negative value
      const isAddition = (payloadQty > 0);
      if ((cartIndex === -1) && isAddition)
      {
        // Doesnt exist. Add product to cart
        const newEntry = JSON.parse(JSON.stringify(action.payload)); // ensure deep copy
        state.value.push(newEntry);
        //console.log("Create in cart. Qty: " + newEntry.qty);
      }
      else
      {
        // Already exists in cart...
        const existingQty = state.value[cartIndex].qty;
        const isSubtract = (payloadQty < 0);
        const okSubtract = (existingQty + payloadQty) >= 0;
        if (isAddition || (isSubtract && okSubtract))
        {
          // Add or Subtract the qty...
          const existingId = state.value[cartIndex].id;
          const newQty = existingQty + action.payload.qty;
          const newProd = JSON.parse(JSON.stringify(action.payload.product)); // ensure deep copy
          state.value = state.value.map((cProd) => {
            if (cProd.id == existingId) {
              return { id: existingId, qty: newQty, product: newProd }; // return updated item.
            }
            return cProd; // return unchanged item.
          });
          //console.log("Add or Subtract. Product: " + newProd.title + " newQty: " + newQty);
        }
      }
      state.isLoading = false;
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