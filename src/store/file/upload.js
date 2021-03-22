import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import endpoints from "../../configs/endpoints";

const initialState = {
    file: null,
    path: '',
    name: '',
    ttl: 0,
    err: null,
};

const upload = createAsyncThunk("/upload", async (data, api) => {

})