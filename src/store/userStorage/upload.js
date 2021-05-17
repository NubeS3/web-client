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

export const uploadFile = createAsyncThunk("storage/uploadFile", async (data, api) => {
    try {
        api.dispatch(uploadSlice.actions.loading());

        console.log(data.file)
        var bodyFormData = new FormData();
        bodyFormData.append('file', data.file)
        bodyFormData.append('path', data.full_path)
        bodyFormData.append('name', data.file.name)
        bodyFormData.append('bucket_id', data.bucketId)
        bodyFormData.append('hidden', false)
        
        const response = await axios.post(endpoints.UPLOAD,
            bodyFormData,
            {
                headers: {
                    Authorization: `Bearer ${data.authToken}`,
                }
            });
        return response.data
    } catch (error) {
        return api.rejectWithValue(error.response.data.error);
    }
})

export const uploadSlice = createSlice({
    name: 'upload',
    initialState: initialState,
    reducers: {
        loading: (state, action) => {
            state.uploading = false;
        }
    },
    extraReducers: {
        [uploadFile.fulfilled]: (state, action) => {
            state.isLoading = false;
        },
        [uploadFile.rejected]: (state, action) => {
            state.err = action.payload;
            state.isLoading = false;
            alert(action.payload)
        },
    }
})

