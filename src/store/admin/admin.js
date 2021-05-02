import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import endpoints from "../../configs/endpoints";

const initialState = {
    isLoading: false,
    done: false,
    err: null,
    adminList: [{uid: "FAKEID", name: "ADMIN_1"}],
    message: "",
};

export const getAdminList = createAsyncThunk("adminManage/getAdminList", async (data, api) => {
    try {
        api.dispatch(adminManageSlice.actions.loading());
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

export const adminManageSlice = createSlice({
    name: "adminManage",
    initialState: initialState,
    reducers: {
        loading: (state, action) => {
            state.isLoading = true;
        },
    },
    extraReducers: {
        [getAdminList.fulfilled]: (state, action) => {
            state.adminList = action.payload;
            state.loading = false;
            state.done = true;
            state.err = null;
        },
        [getAdminList.rejected]: (state, action) => {
            state.isLloading = false;
            state.err = action.payload;
        },
    },
});
