import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import endpoints from "../../configs/endpoints";

const initialState = {
  accessKeyReqCount: { count: 0 },
  signedKeyReqCount: { count: 0 },
  isLoading: false,
  err: null,
};

export const countDateSignedKeyReq = createAsyncThunk(
  "bucketKey/countDateSignedKeyReq",
  async (data, api) => {
    try {
      api.dispatch(bucketKeySlice.actions.loading());
      const response = await axios.get(
        endpoints.COUNT_DATE_SIGNED_KEY_REQ +
          `/${data.public}?from=${data.fromDate}&to=${data.toDate}`,
        {
          headers: {
            Authorization: `Bearer ${data.authToken}`,
          },
        }
      );
      console.log(response.data);
      return response.data;
    } catch (err) {
      return api.rejectWithValue(err.response.data.error);
    }
  }
);

export const countAllSignedKeyReq = createAsyncThunk(
  "bucketKey/countAllSignedKeyReq",
  async (data, api) => {
    try {
      api.dispatch(bucketKeySlice.actions.loading());
      const response = await axios.get(
        endpoints.COUNT_ALL_SIGNED_KEY_REQ + `/${data.public}`,
        {
          headers: {
            Authorization: `Bearer ${data.authToken}`,
          },
        }
      );
      console.log(response.data);
      return response.data;
    } catch (err) {
      return api.rejectWithValue(err.response.data.error);
    }
  }
);

export const countDateAccessKeyReq = createAsyncThunk(
  "bucketKey/countDateAccessKeyReq",
  async (data, api) => {
    try {
      api.dispatch(bucketKeySlice.actions.loading());
      const response = await axios.get(
        endpoints.COUNT_DATE_ACCESS_KEY_REQ +
          `/${data.key}?from=${data.fromDate}&to=${data.toDate}`,
        {
          headers: {
            Authorization: `Bearer ${data.authToken}`,
          },
        }
      );
      console.log(response.data);
      return response.data;
    } catch (err) {
      return api.rejectWithValue(err.response.data.error);
    }
  }
);

export const countAllAccessKeyReq = createAsyncThunk(
  "bucketKey/countAllAccessKeyReq",
  async (data, api) => {
    try {
      api.dispatch(bucketKeySlice.actions.loading());
      const response = await axios.get(
        endpoints.COUNT_ALL_ACCESS_KEY_REQ + `/${data.key}`,
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

export const bucketKeySlice = createSlice({
  name: "bucketKey",
  initialState: initialState,
  reducers: {
    loading: (state, action) => {
      state.isLoading = true;
    },
  },

  extraReducers: {
    [countDateSignedKeyReq.fulfilled]: (state, action) => {
      state.signedKeyReqCount.count = action.payload
      state.loading = false;
    },
    [countDateSignedKeyReq.rejected]: (state, action) => {
      state.loading = false;
      state.err = action.payload;
    },

    [countAllSignedKeyReq.fulfilled]: (state, action) => {
      state.signedKeyReqCount.count = action.payload
      state.loading = false;
    },
    [countAllSignedKeyReq.rejected]: (state, action) => {
      state.loading = false;
      state.err = action.payload;
    },

    [countDateAccessKeyReq.fulfilled]: (state, action) => {
      state.accessKeyReqCount.count = action.payload
      state.loading = false;
    },
    [countDateAccessKeyReq.rejected]: (state, action) => {
      state.loading = false;
      state.err = action.payload;
    },

    [countAllAccessKeyReq.fulfilled]: (state, action) => {
      state.accessKeyReqCount.count = action.payload
      state.loading = false;
    },
    [countAllAccessKeyReq.rejected]: (state, action) => {
      state.loading = false;
      state.err = action.payload;
    },
  },
});
