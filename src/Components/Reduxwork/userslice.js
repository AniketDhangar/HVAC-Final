// userslice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  userData: null,
  token: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { loggedUser, token } = action.payload;
      state.userData = loggedUser;
      state.token = token;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.userData = null;
      state.token = null;
      state.isLoggedIn = false;
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
