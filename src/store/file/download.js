import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import endpoints from "../../configs/endpoints";

const initialState = {
    file: null,
    path: '',
    name: '',
    ttl: 0,
    err: null,
    downloading: false,
};

const download = createAsyncThunk("/download", async (data, api) => {

})

export const downloadSlice = createSlice({
    name: 'download',
    initialState: initialState,
    reducers: {
        downloading: (state,action) => {
            state.downloading = false;
        }
    }
})