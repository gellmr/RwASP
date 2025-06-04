import { createSlice } from '@reduxjs/toolkit'
export const categoriesSlice = createSlice({
  name: 'categories', // name of slice
  initialState: {
    value: [] // array of objects. Each is a category.
  },
  reducers: {
    setCategories: (state, action) => {
      state.value = action.payload; // set our categories array.
    },
    setNoCategories: (state, action) => {
      state.value = []; // no categories available.
    }
  }
})
export const { setCategories, setNoCategories } = categoriesSlice.actions
export default categoriesSlice.reducer