import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import endpoints from "../../configs/endpoints";

const initialState = {
    file: null,
    path: '',
    name: '',
    ttl: 0,
    err: null,
    isLoading: false,
};

export const downloadSingle = createAsyncThunk("storage/downloadSingle", async (data, api) => {
    try {
        api.dispatch(downloadSlice.actions.downloading());
        console.log(data.bucketId)
        const response = await axios.get(endpoints.DOWNLOAD + `${data.full_path}?bucketId=${data.bucketId}`,
            {
                responseType: "arraybuffer",
                headers: {
                    Authorization: `Bearer ${data.authToken}`,
                }
            })
        const url = window.URL.createObjectURL(new Blob([response.data], {type : "application/octet-stream"}));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', data.fileName);
        document.body.appendChild(link);
        link.click();
        return response.data
    } catch (error) {
        return api.rejectWithValue(error.response.data.error);
    }
})

export const downloadSlice = createSlice({
    name: 'download',
    initialState: initialState,
    reducers: {
        downloading: (state, action) => {
            state.isLoading = true;
        }
    },
    extraReducers: {
        [downloadSingle.fulfilled]: (state, action) => {
            state.isLoading = false;
        },
        [downloadSingle.rejected]: (state, action) => {
            console.log(action.payload)
            state.err = action.payload;
            state.isLoading = false;
        },
    }
})