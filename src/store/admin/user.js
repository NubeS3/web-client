import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import endpoints from "../../configs/endpoints";
import { adminManageSlice } from "./admin";

const initialState = {
    isLoading: false,
    done: false,
    err: null,
    userList: [],
    message: "",
};

export const getUserList = createAsyncThunk("adminManage/getUserList", async (data, api) => {
    try {
        api.dispatch(userManageSlice.actions.loading());
        const response = await axios.get(endpoints.GET_ALL_USER + `?limit=${data.limit}&offset=${data.offset}`, {
            headers: {
                Authorization: `Bearer ${data.authToken}`,
            }
        });

        return response.data;
    } catch (err) {
        return api.rejectWithValue(err.response.data.error);
    }
});

export const disableUser = createAsyncThunk("adminManage/disableMod", async (data, api) => {
    try {
        api.dispatch(adminManageSlice.actions.loading(true));
        const response = await axios.post(endpoints.BAN_USER, {
            username: data.username,
            is_ban: true,
        }, {
            headers: {
                Authorization: `Bearer ${data.authToken}`,
            }
        });
        return response.data;
    } catch (err) {
        return api.rejectWithValue(err.response.data.error);
    }
});

export const userManageSlice = createSlice({
    name: "userManage",
    initialState: initialState,
    reducers: {
        loading: (state, action) => {
            state.isLoading = true;
        },
    },
    extraReducers: {
        [getUserList.fulfilled]: (state, action) => {
            state.userList = action.payload;
            state = { ...state, isLoading: false };
            state.done = true;
            state.err = null;
        },
        [getUserList.rejected]: (state, action) => {
            state.isLoading = false;
            state.err = action.payload;
        },
        [disableUser.fulfilled]: (state, action) => {
            state.isLoading = false;
        },
        [disableUser.rejected]: (state, action) => {
            state.isLoading = false;
            state.err = action.payload;
        },
    },
});
