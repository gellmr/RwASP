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

export const clearCartOnServer = createAsyncThunk('cart/clearCartOnServer',
  async (jsonData, { rejectWithValue }) => {
    try {
      // Tell the server to clear our Cart.
      const options = { headers: { 'Content-Type': 'application/json' } };
      const response = await axios.post('/api/cart/clear', { guestId:123 }, options);
      return response.data;
    }
    catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const cartSlice = createSlice({
  name: 'cart', // Name of slice
  initialState: {
    cartLines: [], // Array of objects. Each item (isp) is an InStockProduct...
    // {
    //   cartLineID: 1,
    //   isp: { id: 1, title: 'River Kayak', description: 'Tame the wilderness.', price: 350, category: 3 },
    //   qty: 5
    // }
    isLoading: false,
    guestID: undefined
  },
  reducers: {
    setCart: (state, action) => {
      const rowsFromServer = action.payload;
      state.cartLines = rowsFromServer; // Set products array.
    },
    setCartQuantity: (state, action) => {
      state.isLoading = true;
      // Find the item (isp) in our array of InStockProducts
      const cartIndex  = state.cartLines.findIndex(item => item.cartLineID === action.payload.cartLineID); // -1 if not found in cart.
      if ((cartIndex === -1))
      {
        // Doesnt exist. Add product to cart
        const payloadCopy = JSON.parse(JSON.stringify(action.payload)); // Ensure deep copy
        state.cartLines.push(payloadCopy);
      }
      else
      {
        // Already exists in cart...
        const currentCartLine = state.cartLines[cartIndex];
        const qtyDifference = action.payload.qty - currentCartLine.qty; // Eg -1 if we are subtracting.
        const isAddition = (qtyDifference > 0);
        const isSubtract = (qtyDifference < 0);
        const okSubtract = (action.payload.qty) >= 0;
        if (isAddition || (isSubtract && okSubtract))
        {
          // Add or Subtract the qty...
          const ispCopy = JSON.parse(JSON.stringify(action.payload.isp)); // Ensure deep copy of product
          state.cartLines = state.cartLines.map((row) => {
            if (row.isp.id == currentCartLine.isp.id) {
              return { cartLineID:row.cartLineID, qty:action.payload.qty, isp:ispCopy }; // Return updated item.
            }
            return row; // Return unchanged item.
          });
        }
      }
      state.isLoading = false;
    },
    removeFromCart: (state, action) => {
      state.cartLines = state.cartLines.filter(row => row.cartLineID !== action.payload.cartLineID);
    },
    clearCart: (state, action) => {
      state.cartLines = [];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(updateCartOnServer.fulfilled, (state, action) => {
      console.log("updateCartOnServer.fulfilled");
      state.guestID = action.payload.guestID; // Receive guest id from Server.
      // Ensure local state matches our server.
      const ispCopy = JSON.parse(JSON.stringify(action.payload.isp));
      state.cartLines = state.cartLines
      .filter(row => row.qty > 0 ) // Remove from cart if quantity is zero. Server has removed it from database.
      .map(row => {
        if (row.isp.id == action.payload.isp.id) {
          return { cartLineID: action.payload.cartLineID, isp:ispCopy, qty:action.payload.qty };
        }
        return row;
      });
    })
    .addCase(updateCartOnServer.rejected, (state, action) => {
      console.log("updateCartOnServer.rejected");
    })
    .addCase(clearCartOnServer.fulfilled, (state, action) => {
      console.log("clearCartOnServer.fulfilled");
      state.guestID = action.payload.guestID; // Receive guest id from Server.
    })
    .addCase(clearCartOnServer.rejected, (state, action) => {
      console.log("clearCartOnServer.rejected");
    });
  },
})
// Action creators are generated for each case reducer function
export const { setCart, setCartQuantity, removeFromCart, clearCart } = cartSlice.actions
export default cartSlice.reducer