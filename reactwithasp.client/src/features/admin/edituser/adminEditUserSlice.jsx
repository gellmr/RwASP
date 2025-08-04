import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { axiosInstance } from '@/axiosDefault.jsx';

export const updateUserOnServer = createAsyncThunk('adminEditUser/updateUserOnServer',
  async (updateData, { rejectWithValue }) => {
    try {
      let user = { ...updateData.user };
      user[updateData.field] = updateData.update;
      const options = { headers: { 'Content-Type': 'application/json' } };
      const response = await axiosInstance.post('/api/admin-user-update', user, options);
      return response.data;
    }
    catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

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
    setUserPhone: (state, action) => {
      state.user.phoneNumber = action.payload;
    },
    setUserEmail: (state, action) => {
      state.user.email = action.payload;
    },
    setUserPicture: (state, action) => {
      state.user.picture = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateUserOnServer.fulfilled, (state, action) => {
      console.log("updateUserOnServer.fulfilled " + action.payload.message);
      state.user = action.payload.persist;
    })
    .addCase(updateUserOnServer.rejected, (state, action) => {
      console.log("updateUserOnServer.rejected " + action.payload.message);
      state.user = action.payload.revert;
    });
  }
})

export const { setAdminEditUser, setUserPhone, setUserEmail, setUserPicture } = adminEditUserSlice.actions
export default adminEditUserSlice.reducer