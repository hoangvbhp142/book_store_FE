import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userApi from "../api/userApi";
import { handleApiError } from "../app/utils";

export const getAll = createAsyncThunk("user/getAll", async (params, { rejectWithValue }) => {
    try {
        return await userApi.getAll(params);
    } catch (error) {
        handleApiError(error, rejectWithValue);
    }
})

export const getById = createAsyncThunk("user/getById", async (id, { rejectWithValue }) => {
    try {
        return await userApi.getById(id);
    } catch (error) {
        handleApiError(error, rejectWithValue);
    }
})

export const update = createAsyncThunk("user/update", async ({ id, data }, { rejectWithValue }) => {
    try {
        return await userApi.update(id, data);
    } catch (error) {
        handleApiError(error, rejectWithValue);
    }
})

const userSlice = createSlice({
    name: "user",
    initialState: {
        userList: [],
        selectedUser: null,
        loading: false,
        error: null,
        meta: null,
    },
    reducers: {
        clearUserState: (state) => {
            state.loading = false;
            state.error = null;
            state.userList = [];
            state.selectedUser = null;
            state.meta = null;
        },
        resetError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAll.fulfilled, (state, action) => {
                const { data, meta } = action.payload;
                console.log(action.payload);
                
                state.loading = false;
                state.userList = data;
                state.meta = meta;
            })
            .addCase(getById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedUser = action.payload;
            })
            .addCase(update.fulfilled, (state, action) => {
                const index = state.userList.findIndex(u => u.id === action.meta.arg);
                if (index !== -1) {
                    state.userList[index] = action.payload;
                }
                state.loading = false;
            })
            // Matcher chung cho pending & rejected
            .addMatcher(
                (action) => action.type.endsWith("/pending"),
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                (action) => action.type.endsWith("/rejected"),
                (state, action) => {
                    state.loading = false;
                    state.error = action.payload || "Đã xảy ra lỗi không xác định";
                }
            );
    }
})

export const {clearUserState, resetError} = userSlice.actions;
export default userSlice.reducer;