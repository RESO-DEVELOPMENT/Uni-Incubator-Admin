import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  token: undefined,
  member: undefined,
  isSockerConnected: false
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.member = action.payload.member;
      localStorage.setItem("TOKEN", action.payload.token);
    },
    loginAgain(state, action) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.member = action.payload.member;
      localStorage.setItem("TOKEN", action.payload.token);
    },
    logout(state) {
      state.token = undefined;
      state.user = undefined;
      state.member = undefined;
      localStorage.clear();
    },
  },
});

export const authAction = userSlice.actions;

export default userSlice.reducer;
