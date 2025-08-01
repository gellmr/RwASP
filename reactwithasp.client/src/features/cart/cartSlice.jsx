import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { axiosInstance } from '@/axiosDefault.jsx';

export const updateCartOnServer = createAsyncThunk( 'cart/updateCartOnServer',
  async (jsonData, { rejectWithValue }) => {
    try {
      // Notify the server our Cart has changed.
      const options = { headers: { 'Content-Type': 'application/json' } };
      const response = await axiosInstance.post('/api/cart/update', jsonData, options);
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
      const response = await axiosInstance.post('/api/cart/clear', { guestId:123 }, options);
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
      const ispCopy = (action.payload.isp === null) ? null : JSON.parse(JSON.stringify(action.payload.isp));
      const removal = (action.payload.qty === 0) ? true : false;
      if (removal) {
        // Keep rows, if they are not the one we just deleted, and also they must have quantity > 0. Otherwise remove.
        state.cartLines = state.cartLines.filter(row => (row.cartLineID != action.payload.cartLineID) && row.qty > 0); // Keep, if condition resolves as true.
      } else {
        // Added to Cart / Updating quantity
        state.cartLines = state.cartLines.map(row =>
        {
          const added = (row.cartLineID === null && row.isp.id === action.payload.isp.id);
          const updated = ((row.cartLineID === action.payload.cartLineID) && (row.isp.id === action.payload.isp.id));
          if ( added || updated ) {
            return { cartLineID: action.payload.cartLineID, isp: ispCopy, qty: action.payload.qty }; // Row was added / updated.
          }
          return row; // Unchanged row
        }).filter(row => row.qty > 0); // Keep, if condition resolves as true.
      }
    })

    .addCase(updateCartOnServer.rejected, (state, action) => {
      console.log("updateCartOnServer.rejected");
      if (action.payload.error == "ispRemove") {
        // Stale cookie has outdated ispID. Remove row from cart...
        state.cartLines = state.cartLines.filter(row => (row.isp.id != action.payload.ispRemove));
      }
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