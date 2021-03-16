import axios from 'axios';
import {
    createSlice,
    createAsyncThunk,
} from '@reduxjs/toolkit';
import endpoints from '../../configs/endpoints';

const initialState = {
    loading: false,
    token: null,
    refresh: null,
    err: null,
}

export const signIn = createAsyncThunk(
    'signIn/signIn',
    async (data, api) => {
        try {
            api.dispatch(signInSlice.actions.loading())
            const response = await axios.post(endpoints.LOGIN, {
                "username": data.username,
                "password": data.password
            });

            return response.data
        } catch (err) {
            return api.rejectWithValue(err.response.data.error)
        }
    }
)

export const signInSlice = createSlice({
    name: 'signIn',
    initialState: initialState,
    reducers: {
        loading: (state, action) => {
            state.loading = true
        },
        reset: (state, action) => {
            state.loading = false
            state.token = null
            state.refresh = null
            state.err = null
        }
    },
    extraReducers: {
        [signIn.fulfilled]: (state, action) => {
            state.loading = false
            state.token = action.payload.accessToken
            state.refresh = action.payload.refreshToken
            state.err = null
        },
        [signIn.rejected]: (state, action) => {
            state.loading = false
            state.err = action.payload
        },
    }
})

