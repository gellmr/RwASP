import { createSlice } from '@reduxjs/toolkit'

export const backlogSearchSlice = createSlice({
  name: 'backlogSearch',
  initialState: {
    value: "",
    revert: ""
  },
  reducers: {
    setBacklogSearch: (state, action) => {
      state.revert = state.value;
      state.value = action.payload;
    }
  }
})
export const { setBacklogSearch } = backlogSearchSlice.actions
export default backlogSearchSlice.reducer
