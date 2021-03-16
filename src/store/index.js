import {
    configureStore,
} from '@reduxjs/toolkit';
import {signUpSlice} from "./user/signUp";
import {signInSlice} from "./user/signIn";

const store = configureStore({
    signUp: signUpSlice.reducer,
    signIn: signInSlice.reducer
});

export default store;