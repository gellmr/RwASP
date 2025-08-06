import { createSlice } from '@reduxjs/toolkit'

export const adminOrdersSlice = createSlice({
  name: 'adminOrders', // Name of slice
  initialState: {
    lines: [] // Array of objects.
    // {
    //  accountType            'Guest'
    //  email                  'email@address.com'
    //  id                     '120'
    //  items                  'Drink Bottle'
    //  itemsOrdered           '3'
    //  orderPlacedDate        '6/08/2025 7:22:25 PM +08:00'
    //  orderStatus            'OrderPlaced'
    //  outstanding            '60.00'
    //  paymentReceivedAmount  '0.00'
    //  userID                 '72699C8D.....................0C817A9'
    //  userIDshort            '72699C8D...'
    //  username               'FirstName LastName'
    // }
  },
  reducers: {
    setAdminOrders: (state, action) => {
      state.lines = action.payload;
    }
  }
})

export const { setAdminOrders } = adminOrdersSlice.actions
export default adminOrdersSlice.reducer