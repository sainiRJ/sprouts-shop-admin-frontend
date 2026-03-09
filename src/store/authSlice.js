import { createSlice } from "@reduxjs/toolkit";

// Access token and user info in memory only; refresh token is in httpOnly cookie
const initialState = {
  user: null,
  isAuthenticated: false,
  restoreAttempted: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setRestoreAttempted(state) {
      state.restoreAttempted = true;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, setRestoreAttempted, logout } = authSlice.actions;
export default authSlice.reducer;
