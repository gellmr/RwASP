import { createSlice } from '@reduxjs/toolkit'

export const adminUserAccountsSlice = createSlice({
  name: 'adminUserAccounts',
  initialState: {
    users: [] // Array of objects. Each object contains values like: {
    //Email                   "user-111@gmail.com"
    //EmailConfirmed          true
    //GuestID                 null
    //Id                      "392943d.....................7b0b61eb"
    //PhoneNumber             "04 1234 4321"
    //PhoneNumberConfirmed    true
    //Picture                 null
    //UserName                "user111" }
  },
  reducers: {
    setAdminUserAccounts: (state, action) => {
      state.users = action.payload;
    },
    updateUserPic: (state, action) => {
      state.users = state.users.map(row => {
        if (row.id === action.payload.userId) {
          const rowCopy = JSON.parse(JSON.stringify(row)); // Ensure deep copy
          return { ...rowCopy, picture: action.payload.picture };
        }
        else {
          return row; // Unchanged row
        }
      });
    }
  }
})

export const { setAdminUserAccounts, updateUserPic } = adminUserAccountsSlice.actions
export default adminUserAccountsSlice.reducer