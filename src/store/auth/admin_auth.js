import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import endpoints from "../../configs/endpoints";
import localStorageKeys from "../../configs/localStorageKeys";

const initialState = {
  isValidating: false,
  isAdminValidAuthentication: false,
  adminToken: localStorage.getItem(localStorageKeys.TOKEN_ADMIN) || null,
  rfToken: null,
  isLoggingIn: false,
  err: null,
};

export const adminLogin = createAsyncThunk(
  "adminAuthen/adminLogin",
  async (data, api) => {
    // if (data) return data;
    // else return api.rejectWithValue(data);
    try {
      api.dispatch(adminAuthenSlice.actions.loggingIn());
      const response = await axios.post(endpoints.LOGIN_ADMIN, {
        username: data.username,
        password: data.password,
      });
      return response.data;
    } catch (err) {
      return api.rejectWithValue(err.response.data.error);
    }
  }
);

export const verifyAdminAuthentication = createAsyncThunk(
  "adminAuthen/verifyAdminAuthentication",
  async (data, api) => {
    try {
      api.dispatch(adminAuthenSlice.actions.validating());
      //   console.log(localStorage.getItem(localStorageKeys.TOKEN_ADMIN));
      if (data.adminToken) {
        return true;
      }
      return false;
    } catch (err) {
      return api.rejectWithValue(err.response.data.error);
    }
  }
);

export const clearAuthentication = createAsyncThunk(
  "adminAuthen/clearAuthentication",
  async (data, api) => {
    try {
      const response = {};
      //await axios.delete(endpoints.LOGOUT, {
      //   headers: {
      //     Authorization: data.authToken,
      //   },
      // });
      return response.data;
    } catch (err) {
      return api.rejectWithValue(err.response.data.error);
    }
  }
);

export const adminAuthenSlice = createSlice({
  name: "adminAuthen",
  initialState: initialState,
  reducers: {
    validating: (state, action) => {
      state.isValidating = true;
    },
    loggingIn: (state, action) => {
      state.isLoggingIn = true;
    },
    reset: (state, action) => {
      state.isValidating = false;
      state.isAdminValidAuthentication = false;
      state.authToken = null;
      state.rfToken = null;
      state.isLoggingIn = false;
      state.err = null;
    },
  },
  extraReducers: {
    [adminLogin.fulfilled]: (state, action) => {
      localStorage.setItem(
        localStorageKeys.TOKEN_ADMIN,
        action.payload.accessToken
      );
      state.isValidating = false;
      state.isAdminValidAuthentication = true;
      state.isLoggingIn = false;
      state.adminToken = action.payload.accessToken;
      state.rfToken = action.payload.refreshToken;
      state.err = null;
    },
    [adminLogin.rejected]: (state, action) => {
      state.isLoggingIn = false;
      state.err = action.payload;
    },
    [verifyAdminAuthentication.fulfilled]: (state, action) => {
      state.isValidating = false;
      state.isAdminValidAuthentication = action.payload;
      state.err = null;
    },
    [verifyAdminAuthentication.rejected]: (state, action) => {
      localStorage.removeItem(localStorageKeys.TOKEN_ADMIN);
      state.isAdmin = false;
      state.isValidating = false;
      state.isAdminValidAuthentication = false;
      state.adminToken = null;
      state.rfToken = null;
      state.err = action.payload;
    },
    [clearAuthentication.fulfilled]: (state, action) => {
      localStorage.removeItem(localStorageKeys.TOKEN_ADMIN);
      state.isValidating = false;
      state.isAdminValidAuthentication = false;
      state.adminToken = null;
      state.rfToken = null;
      state.err = null;
    },
    [clearAuthentication.rejected]: (state, action) => {
      localStorage.removeItem(localStorageKeys.TOKEN_ADMIN);
      state.isValidating = false;
      state.isAdminValidAuthentication = false;
      state.adminToken = null;
      state.rfToken = null;
      state.err = action.payload;
    },
  },
});
