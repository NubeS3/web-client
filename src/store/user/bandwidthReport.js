import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import endpoints from "../../configs/endpoints";

const initialState = {
  loading: false,
  err: null,
  data: [],
};

export const getTotalBandwidth = createAsyncThunk(
  "bandwidthReport/getTotalBandwidth",
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
          name: i.toString(),
          uv: Math.ceil(response.data / 8 / 1024),
          pv: 2400,
          amt: 2400,
        });
      }
      return temp;
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
    [getTotalBandwidth.fulfilled]: (state, action) => {
      state.loading = false;
      state.err = null;
      state.data = action.payload;
    },
    [getTotalBandwidth.rejected]: (state, action) => {
      state.loading = false;
      state.err = action.payload;
      state.data = [];
    },
  },
});
