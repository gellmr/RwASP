import { createSlice } from '@reduxjs/toolkit'
import { nullOrUndefined } from '@/MgUtility.js';

export const loginSlice = createSlice({
  name: 'login',
  initialState: {
    // If we are not logged in yet, and also have not fetched
    // a guest id yet, both variables below will be null.

    // The type of login, or null if we are NOT logged in.
    // user: {
    //   loginResult:    'Success',
    //   loginType:      'User',
    //   isGoogleSignIn:  false,
    //   appUserId: 'e35f7679-21dc-4f8e-8bea-2e3d41d72393',
    //   fullname:  'Diana Walters'
    //   firstname: 'Diana'
    //   lastname:  'Walters'
    //   email:     'name@email.address'
    // }
    user: null,

    // The guest {id, fullname, firstname, lastname} ...or null if we ARE logged in.
    guest: null,
  },
  reducers: {
    setLogin: (state, action) => {
      if (action.payload == null) {
        state.user = null; // Log out
      } else {
        // Receive login information from server.
        state.user = action.payload;
        if (!nullOrUndefined(action.payload.appUserId)) {
          state.guest = null; // We are logged in. Clear the guest id.
        }
      }
    },
    setGuest: (state, action) => {
      // The application needs to log out before requesting a new guest id.
      // If we are NOT logged in...
      if (state.user == null) {
        state.guest = action.payload; // Receive guest id and fullname from server.
      }
    }
  }
})
export const { setLogin, setGuest } = loginSlice.actions
export default loginSlice.reducer
