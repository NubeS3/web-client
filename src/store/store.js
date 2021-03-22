import { configureStore } from "@reduxjs/toolkit";
import { signUpSlice } from "./user/signUp";
import { authenSlice } from "./auth/auth";

const store = configureStore({
  reducer: {
    signUp: signUpSlice.reducer,
    authen: authenSlice.reducer,
  },
});

export default store;
