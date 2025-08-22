import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '@/axiosDefault.jsx';
import { nullOrUndefined } from '@/MgUtility.js';

// Thunk to fetch My Orders from server
export const fetchMyOrders = createAsyncThunk('myOrders/fetchMyOrders',
  async (jsonData, { rejectWithValue }) => {
    try {
      if (nullOrUndefined(jsonData.gid) && nullOrUndefined(jsonData.uid)) {
        return rejectWithValue("No id was provided");
      }
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
    value: [] // Each entry is an Order
    //{
    //  accountType        'Guest'
    //  appUser             null
    //  billAddress {
    //    id           281
    //    line1        "Unit 10"
    //    line2        "24 Stewart Street"
    //    line3        "Leave behind the door, Watch out for dog. Thanks"
    //    city         "Balcatta"
    //    state        "WA"
    //    country      "Australia"
    //    zip          "6000"
    //  }
    //  billAddressID  281
    //  guest {
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
    //  shipAddress {
    //    id           282
    //    line1        "123 Rivergum way"
    //    line2        ""
    //    line3        ""
    //    city         "Springfield"
    //    state        "WA"
    //    country      "Australia"
    //    zip          "6525"
    //  }
    //  shipAddressID  282
    //  shipDate           null
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
