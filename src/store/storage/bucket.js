import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import endpoints from "../../configs/endpoints";
import localStorageKeys from "../../configs/localStorageKeys"

const initialState = {
    selectedBucket: {},
    bucketFileList: [],
    bucketFolderList: [],
    folderChildrenList: [],
    bucketList: [],
    accessKeyList: [],
    signedKeyList: [],
    accessKeyReqCount: null,
    signedKeyReqCount: null,
    isLoading: false,
    err: null, 
};

//data payload: authToken, limit, offset
export const getAllBucket = createAsyncThunk("bucket/getAllBucket", async (data, api) => {
    try {
        api.dispatch(bucketSlice.actions.loading());
        const response = await axios.get(endpoints.GET_BUCKET + `?limit=${data.limit}&offset=${data.offset}`, {
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
        //console.log(data.authToken)
        const response = await axios.post(endpoints.CREATE_BUCKET, {
            name: data.name,
            region: data.region.name,
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
export const getBucketFiles = createAsyncThunk("bucket/getBucketFiles", async (data, api) => {
    try {
        api.dispatch(bucketSlice.actions.loading());
        const response = await axios.get(endpoints.GET_BUCKET_FILE + `?limit=${data.limit}&offset=${data.offset}&bucketId=${data.bucketId}`, {
            headers: {
                Authorization: `Bearer ${data.authToken}`,
            }
        });
        return response.data
    } catch (error) {
        return api.rejectWithValue(error.response.data.error);
    }
})

//data payload: authToken, limit, offset, bucketId
export const getBucketFolders = createAsyncThunk("bucket/getBucketFolders", async (data, api) => {
    try {
        api.dispatch(bucketSlice.actions.loading());
        const response = await axios.get(endpoints.GET_BUCKET_FOLDER + `?limit=${data.limit}&offset=${data.offset}&bucketId=${data.bucketId}`, {
            headers: {
                Authorization: `Bearer ${data.authToken}`,
            }
        });
        return response.data
    } catch (error) {
        return api.rejectWithValue(error.response.data.error);
    }
})

export const getChildrenByPath = createAsyncThunk("bucket/getChildrenByPath", async (data, api) => {
    try {
        api.dispatch(bucketSlice.actions.loading());
        const response = await axios.get(endpoints.GET_CHILDREN_BY_PATH + `${data.full_path}`, {
            headers: {
                Authorization: `Bearer ${data.authToken}`,
            }
        });
        return response.data
    } catch (error) {
        return api.rejectWithValue(error.response.data.error);
    }
})

//data payload: authToken, limit, offset, bucketId
export const createBucketFolder = createAsyncThunk("bucket/createBucketFolder", async (data, api) => {
    try {
        api.dispatch(bucketSlice.actions.loading());
        const response = await axios.post(endpoints.CREATE_BUCKET_FOLDER, {
                name: data.name,
                parent_path: data.parent_path
            },
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

export const getBucketAccessKey = createAsyncThunk("bucket/getAllBucketKey", async (data, api) => {
    try {
        api.dispatch(bucketSlice.actions.loading()); 
        const response = await axios.get(endpoints.GET_ACCESS_KEY + `${data.bucketId}?limit=${data.limit}&offset=${data.offset}`, {
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
export const createBucketKey = createAsyncThunk("bucket/createBucketKey", async (data, api) => {
    try {
        api.dispatch(bucketSlice.actions.loading());
        const response = await axios.post(endpoints.CREATE_ACCESS_KEY, {
            bucket_id: data.bucketId,
            expired_date: data.expiringDate,
            permissions: data.permissions,
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
export const deleteBucketKey = createAsyncThunk("bucket/deleteBucketKey", async (data, api) => {
    try {
        api.dispatch(bucketSlice.actions.loading());
        const response = await axios.delete(endpoints.DELETE_ACCESS_KEY + `${data.bucketId}/${data.accessKey}`, {
            headers: {
                Authorization: `Bearer ${data.authToken}`,
            }
        });
        console.log(response.data)
        return response.data;
    } catch (err) {
        return api.rejectWithValue(err.response.data.error);
    }
})

export const getSignedKey = createAsyncThunk("bucket/getSignedKey", async (data, api) => {
    try {
        api.dispatch(bucketSlice.actions.loading());
        const response = await axios.get(endpoints.GET_SIGNED_KEY + `${data.bucketId}?limit=${data.limit}&offset=${data.offset}`, {
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
export const createSignedKey = createAsyncThunk("bucket/createSignedKey", async (data, api) => {
    try {
        api.dispatch(bucketSlice.actions.loading());
        const response = await axios.post(endpoints.CREATE_SIGNED_KEY, {
            bucket_id: data.bucketId,
            expired_date: data.expiringDate,
            permissions: data.permissions,
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
export const deleteSignedKey = createAsyncThunk("bucket/deleteSignedKey", async (data, api) => {
    try {
        api.dispatch(bucketSlice.actions.loading());
        const response = await axios.delete(endpoints.DELETE_SIGNED_KEY + `/${data.bucketId}/${data.publicKey}`, {
            headers: {
                Authorization: `Bearer ${data.authToken}`,
            }
        });
        console.log(response.data)
        return response.data;
    } catch (err) {
        return api.rejectWithValue(err.response.data.error);
    }
})

export const getSignedKeyReqCount = createAsyncThunk("bucket/getSignedKeyReqCount", async (data, api) => {
    try {
        api.dispatch(bucketSlice.actions.loading());
        const response = await axios.delete(endpoints.GET_SIGNED_KEY_REQ_COUNT + `/${data.publicKey}`, {
            headers: {
                Authorization: `Bearer ${data.authToken}`,
            }
        });
        console.log(response.data)
        return response.data;
    } catch (err) {
        return api.rejectWithValue(err.response.data.error);
    }
})

export const getAccessKeyReqCount = createAsyncThunk("bucket/getAccessKeyReqCount", async (data, api) => {
    try {
        api.dispatch(bucketSlice.actions.loading());
        const response = await axios.delete(endpoints.GET_ACCESS_KEY_REQ_COUNT + `/${data.accessKey}`, {
            headers: {
                Authorization: `Bearer ${data.authToken}`,
            }
        });
        console.log(response.data)
        return response.data;
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
        getBucketList: (state, action) => {
            state.bucketList = action.payload;
        }
    },

    extraReducers: {
        [getAllBucket.fulfilled]: (state, action) => {
            let newBucketList = [...state.bucketList];
            newBucketList = action.payload;
            state.bucketList = newBucketList;
            // state.bucketList = action.payload;
            //console.log(state.bucketList
            //state.bucketList = newBucketList;
            state.isLoading = false;
        },
        [getAllBucket.rejected]: (state, action) => {
            state.isLoading = false;
            state.err = action.payload;
        },
        [createBucket.fulfilled]: (state, action) => {
            state.bucketList = [...state.bucketList, ...action.payload]
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

        [getBucketFiles.fulfilled]: (state, action) => {
            state.bucketFileList = action.payload;
            state.isLoading = false;
        },
        [getBucketFiles.rejected]: (state, action) => {
            state.isLoading = false
            state.err = action.payload;
        },

        [getBucketFolders.fulfilled]: (state, action) => {
            state.bucketFolderList = action.payload;
            state.isLoading = false;
        },
        [getBucketFolders.rejected]: (state, action) => {
            state.isLoading = false
            state.err = action.payload;
        },
        [createBucketFolder.fulfilled]: (state, action) => {
            state.bucketFolderList = [...state.bucketFolderList, ...action.payload]
            state.isLoading = false;
        },
        [createBucketFolder.rejected]: (state, action) => {
            state.isLoading = false
            state.err = action.payload;
        },

        [getChildrenByPath.fulfilled]: (state, action) => {
            state.folderChildrenList = action.payload;
            state.isLoading = false;
        },
        [getChildrenByPath.rejected]: (state, action) => {
            state.isLoading = false
            state.err = action.payload;
        },

        [getBucketAccessKey.fulfilled]: (state, action) => {
            state.accessKeyList = action.payload;
            state.isLoading = false;
        },
        [getBucketAccessKey.rejected]: (state, action) => {
            state.isLoading = false;
            state.err = action.payload;
        },
        [createBucketKey.fulfilled]: (state, action) => {
            state.accessKeyList = [...state.accessKeyList, ...action.payload]
            state.isLoading = false;
        },
        [createBucketKey.rejected]: (state, action) => {
            state.isLoading = false
            state.err = action.payload;
        },
        [deleteBucketKey.fulfilled]: (state, action) => {
            state.loading = false;
        },
        [deleteBucketKey.rejected]: (state, action) => {
            state.loading = false;
            state.err = action.payload;
        },

        [getSignedKey.fulfilled]: (state, action) => {
            state.signedKeyList = action.payload
            state.isLoading = false;
        },
        [getSignedKey.rejected]: (state, action) => {
            state.err = action.payload
            state.isLoading = false;
        },

        [createSignedKey.fulfilled]: (state, action) => {
            state.signedKeyList = [...state.signedKeyList, ...action.payload]
            state.isLoading = false;
        },
        [createSignedKey.rejected]: (state, action) => {
            state.isLoading = false
            state.err = action.payload;
        },
        [deleteSignedKey.fulfilled]: (state, action) => {
            state.loading = false;
        },
        [deleteSignedKey.rejected]: (state, action) => {
            state.loading = false;
            state.err = action.payload;
        },

        [getSignedKeyReqCount.fulfilled]: (state, action) => {
            state.loading = false;
        },
        [getSignedKeyReqCount.rejected]: (state, action) => {
            state.loading = false;
            state.err = action.payload;
        },
        [getAccessKeyReqCount.fulfilled]: (state, action) => {
            state.accessKeyReqCount = action.payload
            state.loading = false;
        },
        [getAccessKeyReqCount.rejected]: (state, action) => {
            state.loading = false;
            state.err = action.payload;
        },
    }
})