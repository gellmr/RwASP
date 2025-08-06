import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { axiosInstance } from '@/axiosDefault.jsx';

// Thunk to fetch My Orders from server
export const fetchMyOrders = createAsyncThunk('myOrders/fetchMyOrders',
  async (jsonData, { rejectWithValue }) => {
    try {
      const options = { headers: { 'Content-Type': 'application/json' } };
      const response = await axiosInstance.post('/api/myorders/fetch-orders', jsonData, options);
      return response.data;
    }
    catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const myOrdersSlice = createSlice({
  name: 'myOrders',
  initialState: {
    value: [] // Each entry is an Order that has be JSON serialised.
  },
  reducers: {
    setMyOrders: (state, action) => {
      state.value = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMyOrders.fulfilled, (state, action) => {
      console.log("fetchMyOrders.fulfilled " + action.payload.message);
      state.value = action.payload.rows;
    })
    .addCase(fetchMyOrders.rejected, (state, action) => {
      console.log("fetchMyOrders.rejected " + action.payload);
      state.value = [];
    });
  }
})
export const { setMyOrders } = myOrdersSlice.actions
export default myOrdersSlice.reducer
