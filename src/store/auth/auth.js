import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import endpoints from "../../configs/endpoints";
import localStorageKeys from "../../configs/localStorageKeys";

const initialState = {
  isValidating: false,
  isValidAuthentication: false,
  authToken: localStorage.getItem(localStorageKeys.TOKEN) || null,
  rfToken: null,
  isLoggingIn: false,
  err: null,
};

export const login = createAsyncThunk("authen/login", async (data, api) => {
  // if (data) return data;
  // else return api.rejectWithValue(data);
  try {
    api.dispatch(authenSlice.actions.loggingIn());
    const response = await axios.post(endpoints.LOGIN, {
      username: data.username,
      password: data.password,
    });
    return response.data;
  } catch (err) {
    return api.rejectWithValue(err.response.data.error);
  }
});

export const verifyAuthentication = createAsyncThunk(
  "authen/verifyAuthentication",
  async (data, api) => {
    // if (data.authToken) return { authToken: "1234asdf", rfToken: "1234asdf" };
    // else return api.rejectWithValue(null);
    try {
      api.dispatch(authenSlice.actions.validating());
      // const response = await axios.post(endpoints.AUTHENTICATION, undefined, {
      //   headers: {
      //     Authorization: data.authToken,
      //   },
      // });
      if (localStorage.getItem(localStorageKeys.TOKEN))
        return data;
    } catch (err) {
      return api.rejectWithValue(err.response.data.error);
    }
  }
);

export const clearAuthentication = createAsyncThunk(
  "authen/clearAuthentication",
  async (data, api) => {
    try {
      const response = await axios.delete(endpoints.LOGOUT, {
        headers: {
          Authorization: data.authToken,
        },
      });
      return response.data;
    } catch (err) {
      return api.rejectWithValue(err.response.data.error);
    }
  }
);

export const authenSlice = createSlice({
  name: "authen",
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
      state.isValidAuthentication = false;
      state.authToken = null;
      state.rfToken = null;
      state.isLoggingIn = false;
      state.err = null;
    },
  },
  extraReducers: {
    [login.fulfilled]: (state, action) => {
      localStorage.setItem(localStorageKeys.TOKEN, action.payload.accessToken);
      localStorage.setItem(localStorageKeys.RFTOKEN, action.payload.refreshToken);
      console.log("Logged in")
      state.isValidating = false;
      state.isValidAuthentication = true;
      state.isLoggingIn = false;
      state.authToken = action.payload.accessToken;
      state.rfToken = action.payload.refreshToken;
      state.err = null;
    },
    [login.rejected]: (state, action) => {
      state.isLoggingIn = false;
      state.err = action.payload;
    },
    [verifyAuthentication.fulfilled]: (state, action) => {
      // localStorage.setItem(localStorageKeys.TOKEN, "1234asdf");
      // localStorage.setItem(localStorageKeys.RFTOKEN, "1234asdf");
      state.isValidating = false;
      state.isValidAuthentication = true;
      // state.authToken = "1234asdf";
      // state.rfToken = "1234asdf";
      state.err = null;
    },
    [verifyAuthentication.rejected]: (state, action) => {
      localStorage.removeItem(localStorageKeys.TOKEN);
      localStorage.removeItem(localStorageKeys.RFTOKEN);
      state.isValidating = false;
      state.isValidAuthentication = false;
      state.authToken = null;
      state.rfToken = null;
      state.err = action.payload;
    },
    [clearAuthentication.fulfilled]: (state, action) => {
      localStorage.removeItem(localStorageKeys.TOKEN);
      localStorage.removeItem(localStorageKeys.RFTOKEN);
      state.isValidating = false;
      state.isValidAuthentication = false;
      state.authToken = null;
      state.rfToken = null;
      state.err = null;
    },
    [clearAuthentication.rejected]: (state, action) => {
      localStorage.removeItem(localStorageKeys.TOKEN);
      localStorage.removeItem(localStorageKeys.RFTOKEN);
      state.isValidating = false;
      state.isValidAuthentication = false;
      state.authToken = null;
      state.rfToken = null;
      state.err = action.payload;
    },
  },
});
