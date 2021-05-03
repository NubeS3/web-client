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

export const getUserList = createAsyncThunk("userManage/getUserList", async (data, api) => {
    try {
        api.dispatch(userManageSlice.actions.loading());
        // const response = await axios.post(endpoints.REGISTER, {
        //   firstname: data.firstname,
        //   lastname: data.lastname,
        //   username: data.username,
        //   password: data.password,
        //   email: data.email,
        //   dob: data.dob,
        //   company: data.company,
        //   gender: data.gender,
        // });
        const response = []

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
            state.adminList = action.payload;
            state.loading = false;
            state.done = true;
            state.err = null;
        },
        [getUserList.rejected]: (state, action) => {
            state.isLoading = false;
            state.err = action.payload;
        },
        [disableUser.fulfilled]: (state, action) => {
            state.isLoading = false;
            // state.adminList = [...state.adminList, ...action.payload]
        },
        [disableUser.rejected]: (state, action) => {
            state.isLoading = false;
            state.err = action.payload;
        },
    },
});
