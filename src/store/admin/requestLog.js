import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import endpoints from "../../configs/endpoints";
import { getAccessKeyReqCount, getSignedKey } from "../storage/bucket";

const initialState = {
  isLoading: false,
  done: false,
  err: null,
  requestLogList: [
    {
      type: "",
      at: "",
      method: "",
      req: "",
      source_ip: "",
      from: "",
    },
  ],
  reqCount: 0,
  message: "",
};

export const getAuthLog = createAsyncThunk(
  "adminManage/getAuthLog",
  async (data, api) => {
    try {
      api.dispatch(requestLogManageSlice.actions.loading());
      const response = await axios.get(
        endpoints.GET_AUTH_REQ_LOG +
          `?limit=${data.limit}&offset=${data.offset}&from=${data.fromDate}&to=${data.toDate}&uid=${data.uid}`,
        {
          headers: {
            Authorization: `Bearer ${data.authToken}`,
          },
        }
      );
      let generalizedData = [];
      response.data.forEach((element) => {
        generalizedData.push({
          type: element.type,
          at: element.at,
          method: element.method,
          req: element.req,
          source_ip: element.source_ip,
          from: element.uid,
        });
      });

      return generalizedData;
    } catch (err) {
      return api.rejectWithValue(err.response.data.error);
    }
  }
);

export const getAccessKeyLog = createAsyncThunk(
  "adminManage/getAccessKeyLog",
  async (data, api) => {
    try {
      api.dispatch(requestLogManageSlice.actions.loading());
      const response = await axios.get(
        endpoints.GET_ACCESS_KEY_REQ_LOG +
          `?limit=${data.limit}&offset=${data.offset}&from=${data.fromDate}&to=${data.toDate}&key=${data.key}`,
        {
          headers: {
            Authorization: `Bearer ${data.authToken}`,
          },
        }
      );
      let generalizedData = [];
      response.data.forEach((element) => {
        generalizedData.push({
          type: element.type,
          at: element.at,
          method: element.method,
          req: element.req,
          source_ip: element.source_ip,
          from: element.key,
        });
      });

      return generalizedData;
    } catch (err) {
      return api.rejectWithValue(err.response.data.error);
    }
  }
);

export const getSignedKeyLog = createAsyncThunk(
  "adminManage/getSignedKeyLog",
  async (data, api) => {
    try {
      api.dispatch(requestLogManageSlice.actions.loading()); 
      const response = await axios.get(
        endpoints.GET_SIGNED_KEY_REQ_LOG +
          `?limit=${data.limit}&offset=${data.offset}&from=${data.fromDate}&to=${data.toDate}&public=${data.public}`,
        {
          headers: {
            Authorization: `Bearer ${data.authToken}`,
          },
        }
      );

      let generalizedData = [];
      response.data.forEach((element) => {
        generalizedData.push({
          type: element.type,
          at: element.at,
          method: element.method,
          req: element.req,
          source_ip: element.source_ip,
          from: element.public,
        });
      });

      return generalizedData;
    } catch (err) {
      return api.rejectWithValue(err.response.data.error);
    }
  }
);

export const getAccessKeyReqCount = createAsyncThunk(
  "adminManage/getAccessKeyReqCount",
  async (data, api) => {
    try {
      api.dispatch(requestLogManageSlice.actions.loading()); 
      const response = await axios.get(
        endpoints.GET_ACCESS_KEY_REQ_COUNT +
          `?limit=${data.limit}&offset=${data.offset}&from=${data.fromDate}&to=${data.toDate}&public=${data.key}`,
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

export const getSignedKeyReqCount = createAsyncThunk(
  "adminManage/getSignedKeyReqCount",
  async (data, api) => {
    try {
      api.dispatch(requestLogManageSlice.actions.loading()); 
      const response = await axios.get(
        endpoints.GET_SIGNED_KEY_REQ_COUNT +
          `?limit=${data.limit}&offset=${data.offset}&from=${data.fromDate}&to=${data.toDate}&public=${data.public}`,
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

export const resetLog = createAsyncThunk(
  "adminManage/resetLog",
  async (data, api) => {
    try {
      api.dispatch(requestLogManageSlice.actions.loading());
      const response = await { data: [] };

      return response.data;
    } catch (err) {
      return api.rejectWithValue(err.response.data.error);
    }
  }
);

export const requestLogManageSlice = createSlice({
  name: "logRequest",
  initialState: initialState,
  reducers: {
    loading: (state, action) => {
      state = { ...state, isLoading: action.payload };
    },
  },
  extraReducers: {
    [getAuthLog.fulfilled]: (state, action) => {
      state.requestLogList = action.payload;
      state = { ...state, isLoading: false };
      state.done = true;
      state.err = null;
    },
    [getAuthLog.rejected]: (state, action) => {
      state.isLoading = false;
      state.err = action.payload;
    },
    [getAccessKeyLog.fulfilled]: (state, action) => {
      state.requestLogList = action.payload;
      state = { ...state, isLoading: false };
      state.done = true;
      state.err = null;
    },
    [getAccessKeyLog.rejected]: (state, action) => {
      state.isLoading = false;
      state.err = action.payload;
    },
    [getSignedKey.fulfilled]: (state, action) => {
      state.requestLogList = action.payload;
      state = { ...state, isLoading: false };
      state.done = true;
      state.err = null;
    },
    [getSignedKey.rejected]: (state, action) => {
      state.isLoading = false;
      state.err = action.payload;
    },
    [getAccessKeyReqCount.fulfilled]: (state, action) => {
      state.reqCount = action.payload;
      state = { ...state, isLoading: false };
      state.done = true;
      state.err = null;
    },
    [getAccessKeyReqCount.rejected]: (state, action) => {
      state.isLoading = false;
      state.err = action.payload;
    },
    [getSignedKeyReqCount.fulfilled]: (state, action) => {
      state.reqCount = action.payload;
      state = { ...state, isLoading: false };
      state.done = true;
      state.err = null;
    },
    [getSignedKeyReqCount.rejected]: (state, action) => {
      state.isLoading = false;
      state.err = action.payload;
    },
    
    [resetLog.fulfilled]: (state, action) => {
      state.requestLogList = action.payload;
      state = { ...state, isLoading: false };
      state.done = true;
      state.err = null;
    },
    [resetLog.rejected]: (state, action) => {
      state.isLoading = false;
      state.err = action.payload;
    },
  },
});
