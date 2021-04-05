import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import endpoints from "../../configs/endpoints";
import localStorageKeys from "../../configs/localStorageKeys"

const initialState = {
    selectedBucket: {},
    bucketItemsList: [],
    bucketList: [],
    isLoading: false,
    err: null,  
};

//data payload: authToken, limit, offset
export const getAllBucket = createAsyncThunk("bucket/getAllBucket", async (data, api) => {
    try {
        api.dispatch(bucketSlice.actions.loading());
        const response = await axios.get(endpoints.GET_BUCKET + `?limit${data.limit}&offset=${data.offset}`, {
            headers: {
                Authorization: `Bearer ${data.authToken}`,
            }
        });

        return response.data;
    } catch (err) {
        return api.rejectWithValue(err.response.data.error);
    }
})

//data payload: authToken, name, region
export const createBucket = createAsyncThunk("bucket/createBucket", async (data, api) => {
    try {
        api.dispatch(bucketSlice.actions.loading());
        const response = await axios.post(endpoints.CREATE_BUCKET, {
            name: data.name,
            region: data.region,
        }, {
            headers: {
                Authorization: `Bearer ${data.authToken}`,
            }
        });
        return response.data
    } catch (error) {
        return api.rejectWithValue(error.response.data.error);
    }
})

//data payload: authToken, limit, offset
export const deleteBucket = createAsyncThunk("bucket/deleteBucket", async (data, api) => {
    try {
        api.dispatch(bucketSlice.actions.loading());
        const response = await axios.delete(endpoints.DELETE_BUCKET + `${data.bucketId}`, {
            headers: {
                Authorization: `Bearer ${data.authToken}`,
            }
        });

        return response.data;
    } catch (err) {
        return api.rejectWithValue(err.response.data.error);
    }
})

//data payload: authToken, limit, offset, bucketId
export const getBucketItems = createAsyncThunk("bucket/getBucketItems", async (data, api) => {
    try {
        api.dispatch(bucketSlice.actions.loading());
        const response = await axios.get(endpoints.GET_BUCKET_ITEMS + `?limit=${data.limit}&offset=${data.offset}&bucketId=${data.bucketId}`, {
            headers: {
                Authorization: `Bearer ${data.authToken}`,
            }
        });
        return response.data
    } catch (error) {
        return api.rejectWithValue(error.response.data.error);
    }
})

export const bucketSlice = createSlice({
    name: 'bucket',
    initialState: initialState,
    reducers: {
        loading: (state, action) => {
            state.isLoading = true;
        },
        getBucketList: (state, action) => {
            state.bucketList = action.payload;
        }
    },

    extraReducers: {
        [getAllBucket.fulfilled]: (state, action) => {
            state.bucketList = action.payload;
            //console.log(state.bucketList)
            state.isLoading = false;
        },
        [getAllBucket.rejected]: (state, action) => {
            state.isLoading = false;
            state.err = action.payload;
        },
        [createBucket.fulfilled]: (state, action) => {
            state.isLoading = false;
        },
        [createBucket.rejected]: (state, action) => {
            state.isLoading = false
            state.err = action.payload;
        },
        [deleteBucket.fulfilled]: (state, action) => {
            state.loading = false;
        },
        [deleteBucket.rejected]: (state, action) => {
            state.loading = false;
            state.err = action.payload;
        },
        [getBucketItems.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.bucketItemsList = action.payload
            console.log(state.bucketItemsList)
        },
        [getBucketItems.rejected]: (state, action) => {
            state.isLoading = false
            state.err = action.payload;
        },
    }
})