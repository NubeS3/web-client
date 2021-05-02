import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import endpoints from "../../configs/endpoints";

const initialState = {
  loading: false,
  done: false,
  err: null,
  username: "",
  message: "",
};

export const signUp = createAsyncThunk("signUp/signUp", async (data, api) => {
  try {
    api.dispatch(signUpSlice.actions.loading());
    const response = await axios.post(endpoints.REGISTER, {
      firstname: data.firstname,
      lastname: data.lastname,
      username: data.username,
      password: data.password,
      email: data.email,
      dob: data.dob,
      company: data.company,
      gender: data.gender,
    });

    if (response) {
      api.dispatch(signUpSlice.actions.sendSignUpRequest(data.username))
    }

    return response.data;
  } catch (err) {
    return api.rejectWithValue(err.response.data.error);
  }
});

export const confirmOTP = createAsyncThunk("signUp/confirmOTP", async (data, api) => {
  try {
    const response = await axios.post(endpoints.CONFIRM_OTP, {
      username: data.username,
      otp: data.otp,
    })

    if (!response) {
      return api.rejectWithValue(response.data.error);
    }
    return response.data;
  } catch (err) {
    return api.rejectWithValue(err.response.data.error);
  }
});

export const resendOTP = createAsyncThunk("authen/resendOTP", async (data, api) => {
  try {
    api.dispatch(signUpSlice.actions.loggingIn());
    const response = await axios.post(endpoints.RESEND_OTP, {
      username: data.username,
    });
    return response.data;
  } catch (err) {
    return api.rejectWithValue(err.response.data.error)
  }
});

export const signUpSlice = createSlice({
  name: "signUp",
  initialState: initialState,
  reducers: {
    loading: (state, action) => {
      state.loading = true;
    },
    reset: (state, action) => {
      state.loading = false;
      state.done = false;
      state.err = null;
    },
    sendSignUpRequest: (state, action) => {
      state.username = action.payload
    }
  },
  extraReducers: {
    [signUp.fulfilled]: (state, action) => {
      state.loading = false;
      state.done = true;
      state.err = null;
    },
    [signUp.rejected]: (state, action) => {
      state.loading = false;
      state.err = action.payload;
    },

    [resendOTP.fulfilled]: (state, action) => {
      state.message = action.payload.message;
      state.loading = false;
      state.done = true;
      state.err = null;
    },
    [resendOTP.rejected]: (state, action) => {
      state.loading = false;
      state.err = action.payload;
    },
  },
});
