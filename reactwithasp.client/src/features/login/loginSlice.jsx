import { createSlice } from '@reduxjs/toolkit'
import { nullOrUndefined } from '@/MgUtility.js';

export const loginSlice = createSlice({
  name: 'login',
  initialState: {
    // If we are not logged in yet, and also have not fetched
    // a guest id yet, both variables below will be null.

    // The type of login, or null if we are NOT logged in.
    // value: {
    //   loginResult: 'Success',
    //   loginType: 'VIP AppUser',
    //   appUserId: '392943d5-e5ce-4f7a-93ed-d3407b0b61eb'
    // }
    value: null,

    // The guest id, or null if we ARE logged in.
    guest: null,
  },
  reducers: {
    setLogin: (state, action) => {
      if (action.payload == null) {
        state.value = null; // Log out
      } else {
        // Receive login information from server.
        state.value = action.payload;
        if (!nullOrUndefined(action.payload.appUserId)) {
          state.guest = null; // We are logged in. Clear the guest id.
        }
      }
    },
    setGuest: (state, action) => {
      // The application needs to log out before requesting a new guest id.
      // If we are NOT logged in...
      if (state.value == null) {
        state.guest = action.payload; // Receive guest id from server.
      }
    }
  }
})
export const { setLogin, setGuest } = loginSlice.actions
export default loginSlice.reducer
