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
    //FullName               "Ivan Brown"     // Display name can contain spaces
    //UserName               "IvanBrown"   }  // URL friendly .NET Identity name.  Alphanum and -._@+
  },
  reducers: {
    setAdminUserAccounts: (state, action) => {
      state.users = action.payload;
    },
    updateUserPic: (state, action) => {
      const utype = action.payload.usertype;
      const idval = action.payload.idval;
      const newpic = action.payload.picture;
      state.users = state.users.map(row => {
        if (((utype === "guest") && (row.guestID === idval)) || (row.id === idval)){
          const rowCopy = JSON.parse(JSON.stringify(row)); // Ensure deep copy
          return { ...rowCopy, picture: newpic };
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