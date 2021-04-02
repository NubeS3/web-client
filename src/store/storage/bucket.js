import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import endpoints from "../../configs/endpoints";
import localStorageKeys from "../../configs/localStorageKeys"

const initialState = {
    selectedBucket: {},
    fileList: [],
    bucketList: [],
    isLoading: false,
    authToken: localStorage.getItem(localStorageKeys.TOKEN) || null,
    err: null,
};

const getAllBucket = createAsyncThunk("bucket/getAllBucket", async (data, api) => {
    try {
        api.dispatch(bucketSlice.actions.loading());
        const response = await axios.get(endpoints.GETBUCKET, {
            headers: {
                Authorization: data.authToken,
            }
        });

        let payload = []
        for(var i in response){
            payload.push({
                id: response.data.id,
                uid: response.data.uid,
                name: response.data.name,
                region: response.data.region,
                created_at: response.data.created_at
            })
        }
        return payload;
      } catch (err) {
        return api.rejectWithValue(err.response.data.error);
      }
})

export const bucketSlice = createSlice({
    name: 'bucket',
    initialState: initialState,
    reducers: {
        loading: (state, action) => {
            state.isLoading = true;
        },
        getBucketList: (state,action) => {
            state.bucketList = action.payload;
        }
    },
    extraReducer: {
        [getAllBucket.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.bucketList = action.payload;
        },
        [getAllBucket.rejected]: (state, action) => {
            state.isLoading = false;
            state.err = action.payload;
        },

    }
})