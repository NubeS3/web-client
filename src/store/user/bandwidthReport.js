import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import endpoints from "../../configs/endpoints";

const initialState = {
  loading: false,
  err: null,
  data: 0,
};

export const getTotalBandwidth = createAsyncThunk(
  "bandwidthReport/getTotalBandwidth",
  async (data, api) => {
    try {
      // api.dispatch(bandwidthReportSlice.actions.loading());
      const response = await axios.get(
        endpoints.GET_TOTAL_BANDWIDTH + `?from=${data.from}&to=${data.to}`,
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
      state.data = 0;
    },
  },
});
