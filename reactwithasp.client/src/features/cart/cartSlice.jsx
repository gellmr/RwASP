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
    value: [], // Array of objects. Each item (isp) is an InStockProduct...
    // {
    //   ispID: 1,
    //   isp: { id: 1, title: 'River Kayak', description: 'Tame the wilderness.', price: 350, category: 3 },
    //   qty: 5
    // }
    isLoading: false,
  },
  reducers: {
    setCart: (state, action) => {
      const rowsFromServer = action.payload;
      state.value = rowsFromServer; // Set products array.
    },
    setCartQuantity: (state, action) => {
      state.isLoading = true;
      // Find the item (isp) in our array of InStockProducts
      const cartIndex  = state.value.findIndex(item => item.ispID === action.payload.ispID); // -1 if not found in cart.
      if ((cartIndex === -1))
      {
        // Doesnt exist. Add product to cart
        const payloadCopy = JSON.parse(JSON.stringify(action.payload)); // Ensure deep copy
        state.value.push(payloadCopy);
      }
      else
      {
        // Already exists in cart...
        const currentIsp = state.value[cartIndex];
        const qtyDifference = action.payload.qty - currentIsp.qty; // Eg -1 if we are subtracting.
        const isAddition = (qtyDifference > 0);
        const isSubtract = (qtyDifference < 0);
        const okSubtract = (action.payload.qty) >= 0;
        if (isAddition || (isSubtract && okSubtract))
        {
          // Add or Subtract the qty...
          const ispCopy = JSON.parse(JSON.stringify(action.payload.isp)); // Ensure deep copy of product
          state.value = state.value.map((row) => {
            if (row.ispID == currentIsp.ispID) {
              return { ispID:currentIsp.ispID, qty:action.payload.qty, isp:ispCopy }; // Return updated item.
            }
            return row; // Return unchanged item.
          });
        }
      }
      state.isLoading = false;
    },
    removeFromCart: (state, action) => {
      state.value = state.value.filter(row => row.ispID !== action.payload.ispID);
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
export const { setCart, setCartQuantity, removeFromCart, clearCart } = cartSlice.actions
export default cartSlice.reducer