import { createSlice } from '@reduxjs/toolkit'
export const loginSlice = createSlice({
  name: 'login',
  initialState: {
    value: ""
  },
  reducers: {
    setLogin: (state, action) => {
      state.value = action.payload;
    }
  }
})
export const { setLogin } = loginSlice.actions
export default loginSlice.reducer
