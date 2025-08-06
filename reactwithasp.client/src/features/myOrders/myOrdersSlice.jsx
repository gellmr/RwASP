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
    value: [] // Each entry is an Order that has been JSON serialised.
    //{
    //  accountType        'Guest'
    //  appUser             null
    //  billingAddress     'Unit 10/150 Third Floor, 123 Streetname Bvd The Tall Apartment Building (Inc) MySuburb MyState MyCountry 6000'
    //  guest
    //  {
    //    email               'email@address.com'
    //    firstName           'FirstName'
    //    fullName            'FirstName LastName'
    //    id                  '72699c8d..................ddd0c817a9'
    //    lastName            'LastName'
    //    orders               null
    //  }
    //  guestID             '72699c8d....................d0c817a9'
    //  id                   120
    //  itemString          'Drink Bottle (x3) '
    //  orderedProducts
    //  [
    //    id  263
    //    inStockProduct
    //    {
    //      category           3
    //      description       'Dont forget to drink water, while your out doing water sports.'
    //      id                 1
    //      image             '/thumbs/tilt-bottle.png'
    //      price              20
    //      title             'Drink Bottle'
    //    }
    //    inStockProductID   1
    //    order              null
    //    orderID            null
    //    quantity           3
    //  ]
    //  orderPayments      null
    //  orderPaymentsReceived 0
    //  orderPlacedDate   '2025-08-06T19:22:25.2269759+08:00'
    //  orderStatus       'OrderPlaced'
    //  outstanding        60
    //  paymentReceivedDate null
    //  priceTotal         60
    //  quantityTotal      3
    //  readyToShipDate    null
    //  receivedDate       null
    //  shipDate           null
    //  shippingAddress   'Unit 10/150 Third Floor, 123 Streetname Bvd The Tall Apartment Building (Inc) MySuburb MyState MyCountry 6000'
    //  userID             null
    //  userOrGuestEmail  'email@address.com'
    //  userOrGuestId     '72699c8d.....................0c817a9'
    //  userOrGuestName   'FirstName LastName'
    //}
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
