import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { axiosInstance } from '@/axiosDefault.jsx';

// Thunk to fetch from server
export const fetchMyOrder = createAsyncThunk('myOrders/fetchMyOrder',
  async (jsonData, { rejectWithValue }) => {
    try {
      const options = { headers: { 'Content-Type': 'application/json' } };
      const response = await axiosInstance.post('/api/myorders/fetch-order', jsonData, options);
      return response.data;
    }
    catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const myOrderSlice = createSlice({
  name: 'myOrder',
  initialState: {
    value: null // an Order
  },
  reducers: {
    setMyOrder: (state, action) => {
      state.value = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMyOrder.fulfilled, (state, action) => {
      console.log("fetchMyOrder.fulfilled " + action.payload.message);
      state.value = action.payload.order;
    })
    .addCase(fetchMyOrder.rejected, (state, action) => {
      console.log("fetchMyOrder.rejected " + action.payload);
      state.value = [];
    });
  }
})
export const { setMyOrder } = myOrderSlice.actions
export default myOrderSlice.reducer
