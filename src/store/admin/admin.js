import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import endpoints from "../../configs/endpoints";

const initialState = {
  isLoading: false,
  done: false,
  err: null,
  adminList: [],
  message: "",
};

export const getAdminList = createAsyncThunk(
  "adminManage/getAdminList",
  async (data, api) => {
    try {
      api.dispatch(adminManageSlice.actions.loading());
      const response = await axios.get(
        endpoints.GET_ALL_ADMIN + `?limit=${data.limit}&offset=${data.offset}`,
        {
          headers: {
            Authorization: `Bearer ${data.authToken}`,
          },
        }
      );

      return response.data;
    } catch (err) {
      return api.rejectWithValue(err.response.data.error);
    }
  }
);

export const addMod = createAsyncThunk(
  "adminManage/addMod",
  async (data, api) => {
    try {
      api.dispatch(adminManageSlice.actions.loading(true));
      const response = await axios.post(
        endpoints.ADD_MOD,
        {
          username: data.username,
          password: data.password,
        },
        {
          headers: {
            Authorization: `Bearer ${data.authToken}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      return api.rejectWithValue(err.response.data.error);
    }
  }
);

export const disableMod = createAsyncThunk(
  "adminManage/disableMod",
  async (data, api) => {
    try {
      api.dispatch(adminManageSlice.actions.loading(true));
      const response = await axios.post(
        endpoints.BAN_MOD,
        {
          username: data.username,
          disable: true,
        },
        {
          headers: {
            Authorization: `Bearer ${data.authToken}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      return api.rejectWithValue(err.response.data.error);
    }
  }
);

export const adminManageSlice = createSlice({
  name: "adminManage",
  initialState: initialState,
  reducers: {
    loading: (state, action) => {
      state = { ...state, isLoading: action.payload };
    },
  },
  extraReducers: {
    [getAdminList.fulfilled]: (state, action) => {
      state.adminList = action.payload;
      state = { ...state, isLoading: false };
      state.done = true;
      state.err = null;
    },
    [getAdminList.rejected]: (state, action) => {
      state.isLoading = false;
      state.err = action.payload;
    },

    [addMod.fulfilled]: (state, action) => {
      state.isLoading = false;
      // state.adminList = [...state.adminList, ...action.payload]
    },
    [addMod.rejected]: (state, action) => {
      state.isLoading = false;
      state.err = action.payload;
    },
    [disableMod.fulfilled]: (state, action) => {
      state.isLoading = false;
      // state.adminList = [...state.adminList, ...action.payload]
    },
    [disableMod.rejected]: (state, action) => {
      state.isLoading = false;
      state.err = action.payload;
    },
  },
});
