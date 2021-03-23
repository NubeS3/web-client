import { configureStore } from "@reduxjs/toolkit";
import { authenSlice } from "./auth/auth"
import { signUpSlice } from "./user/signUp";
import { uploadSlice } from "./file/upload";
import { downloadSlice } from "./file/download"

const store = configureStore({
  reducer: {
    signUp: signUpSlice.reducer,
    authen: authenSlice.reducer,

    upload: uploadSlice.reducer,
    download: downloadSlice.reducer,
  },
});

export default store;
