import { createSlice } from '@reduxjs/toolkit'

export const adminEditUserSlice = createSlice({
  name: 'adminEditUser',
  initialState: {
    user: null // The user we are currently editing: {
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
    setAdminEditUser: (state, action) => {
      state.user = action.payload;
    },
  }
})

export const { setAdminEditUser } = adminEditUserSlice.actions
export default adminEditUserSlice.reducer