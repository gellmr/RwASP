import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios';

export const updateCartOnServer = createAsyncThunk( 'cart/updateCartOnServer',
  async (jsonData, { rejectWithValue }) => {
    try {
      // Notify the server our Cart has changed.
      const options = { headers: { 'Content-Type': 'application/json' } };
      const response = await axios.post('/api/cart/update', jsonData, options);
      return response.data;
    }
    catch (error) {
      return rejectWithValue(error.response.data); // This will trigger updateCartOnServer.rejected, with error.response.data as action.payload
    }
  }
);

export const cartSlice = createSlice({
  name: 'cart', // Name of slice
  initialState: {
    value: [], // Array of objects. Each object in the array is like...
    // {
    //   id: 1,
    //   product: { id: 1, title: 'River Kayak', description: 'Tame the wilderness.', price: 350, category: 3 },
    //   qty: 5
    // }
    isLoading: false,
  },
  reducers: {
    setCart: (state, action) => {
      state.value = action.payload; // Set products array.
    },
    addToCart: (state, action) => {
      state.isLoading = true;
      const cartIndex = state.value.findIndex(item => item.id === action.payload.id);
      const payloadQty = action.payload.qty; // Can be a negative value
      const isAddition = (payloadQty > 0);
      if ((cartIndex === -1) && isAddition)
      {
        // Doesnt exist. Add product to cart
        const newEntry = JSON.parse(JSON.stringify(action.payload)); // Ensure deep copy
        state.value.push(newEntry);
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
          const newProd = JSON.parse(JSON.stringify(action.payload.product)); // Ensure deep copy
          state.value = state.value.map((cProd) => {
            if (cProd.id == existingId) {
              return { id: existingId, qty: newQty, product: newProd }; // Return updated item.
            }
            return cProd; // Return unchanged item.
          });
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
  },
  extraReducers: (builder) => {
    builder.addCase(updateCartOnServer.fulfilled, (state, action) => {
      console.log("updateCartOnServer.fulfilled");
      // Server indicates successful update, and has given us the finalised cart state.
    })
    .addCase(updateCartOnServer.rejected, (state, action) => {
      console.log("updateCartOnServer.rejected");
      // TODO - Handle error cases by reverting the local state, or displaying an error message to the user.
    });
  },
})
// Action creators are generated for each case reducer function
export const { setCart, addToCart, removeFromCart, clearCart } = cartSlice.actions
export default cartSlice.reducer