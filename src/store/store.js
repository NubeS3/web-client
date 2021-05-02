import { configureStore } from "@reduxjs/toolkit";
import { authenSlice } from "./auth/auth"
import { signUpSlice } from "./user/signUp";
import { uploadSlice } from "./storage/upload";
import { downloadSlice } from "./storage/download"
import { bucketSlice } from "./storage/bucket";
import { userManageSlice} from "./admin/user";
import { adminManageSlice} from "./admin/admin";

const store = configureStore({
  reducer: {
    signUp: signUpSlice.reducer,
    authen: authenSlice.reducer,

    upload: uploadSlice.reducer,
    download: downloadSlice.reducer,
    bucket: bucketSlice.reducer,

    adminManage: adminManageSlice.reducer,
    userManage: userManageSlice.reducer,
  },
});

export default store;
