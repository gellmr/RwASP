import { createSlice } from '@reduxjs/toolkit'

export const adminUserAccountsSlice = createSlice({
  name: 'adminUserAccounts',
  initialState: {
    users: [] // Array of objects.
  },
  reducers: {
    setAdminUserAccounts: (state, action) => {
      state.users = action.payload;
    }
  }
})

export const { setAdminUserAccounts } = adminUserAccountsSlice.actions
export default adminUserAccountsSlice.reducer