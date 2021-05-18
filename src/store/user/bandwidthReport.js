import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import endpoints from "../../configs/endpoints";

const initialState = {
  loading: false,
  err: null,
  data: [],
  total: 0.0,
};

export const getMonthUsageBandwidth = createAsyncThunk(
  "bandwidthReport/getMonthUsageBandwidth",
  async (data, api) => {
    let temp = [];
    let curDate = new Date();
    let firstDate = new Date(curDate.getFullYear(), curDate.getMonth(), 1);
    let gap = curDate.getDate();
    let milestone = firstDate.getTime() / 1000;
    try {
      // api.dispatch(bandwidthReportSlice.actions.loading());
      for (let i = 1; i <= gap; i++) {
        const response = await axios.get(
          endpoints.GET_TOTAL_BANDWIDTH +
            `?from=${milestone + 3600 * 24 * (i - 1)}&to=${
              milestone + 3600 * 24 * i
            }`,
          {
            headers: {
              Authorization: `Bearer ${data.authToken}`,
            },
          }
        );
        temp.push({
          day: i.toString(),
          unit: "KB",
          bandwidth: Math.round((response.data * 100) / 8 / 1024 / 1024) / 100,
        });
      }
      return temp;
    } catch (err) {
      return api.rejectWithValue(err.response.data.error);
    }
  }
);

export const getTotalUsageBandwidth = createAsyncThunk(
  "bandwidthReport/getTotalUsageBandwidth",
  async (data, api) => {
    let curDate = new Date();
    let firstDate = new Date(curDate.getFullYear(), curDate.getMonth(), 1);
    try {
      // api.dispatch(bandwidthReportSlice.actions.loading());
      const response = await axios.get(
        endpoints.GET_TOTAL_BANDWIDTH +
          `?from=${firstDate.getTime() / 1000}&to=${Math.floor(
            curDate.getTime() / 1000
          )}`,
        {
          headers: {
            Authorization: `Bearer ${data.authToken}`,
          },
        }
      );
      return Math.round((response.data * 100) / 8 / 1024 / 1024) / 100;
    } catch (err) {
      return api.rejectWithValue(err.response.data.error);
    }
  }
);

export const bandwidthReportSlice = createSlice({
  name: "bandwidthReport",
  initialState: initialState,
  reducers: {
    loading: (state, action) => {
      state.loading = true;
    },
    reset: (state, action) => {
      state.loading = false;
      state.err = null;
      state.data = 0;
    },
  },
  extraReducers: {
    [getMonthUsageBandwidth.fulfilled]: (state, action) => {
      state.loading = false;
      state.err = null;
      state.data = action.payload;
    },
    [getMonthUsageBandwidth.rejected]: (state, action) => {
      state.loading = false;
      state.err = action.payload;
      state.data = [];
    },
    [getTotalUsageBandwidth.fulfilled]: (state, action) => {
      state.loading = false;
      state.err = null;
      state.total = action.payload;
    },
    [getTotalUsageBandwidth.rejected]: (state, action) => {
      state.loading = false;
      state.err = action.payload;
      state.total = 0.0;
    },
  },
});
