import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import endpoints from "../../configs/endpoints";

const initialState = {
    file: null,
    path: '',
    name: '',
    ttl: 0,
    err: null,
    uploading: false,
};

const upload = createAsyncThunk("storage/upload", async (data, api) => {

})

export const uploadSlice = createSlice({
    name: 'upload',
    initialState: initialState,
    reducers: {
        uploading: (state,action) => {
            state.uploading = false;
        }
    }
})

