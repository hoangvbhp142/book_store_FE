import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import addressApi from "../api/addressApi";
import { handleApiError } from "../app/utils";


// ---------------------- ASYNC THUNKS ----------------------

export const getAll = createAsyncThunk("address/getAll", async (_, { rejectWithValue }) => {
    try {
        return await addressApi.getAll();
    } catch (error) {
        return handleApiError(error, rejectWithValue);
    }
})

export const getById = createAsyncThunk("address/getById", async (id, { rejectWithValue }) => {
    try {
        return await addressApi.getById(id);
    } catch (error) {
        return handleApiError(error, rejectWithValue);
    }
})

export const create = createAsyncThunk("address/create", async (payload, { rejectWithValue }) => {
    try {
        return await addressApi.create(payload)
    } catch (error) {
        return handleApiError(error, rejectWithValue);
    }
})

export const update = createAsyncThunk("address/update", async ({ id, payload }, { rejectWithValue }) => {
    try {
        return await addressApi.update(id, payload);
    } catch (error) {
        return handleApiError(error, rejectWithValue);
    }
})

export const remove = createAsyncThunk("address/remove", async (id, { rejectWithValue }) => {
    try {
        return await addressApi.remove(id);
    } catch (error) {
        return handleApiError(error, rejectWithValue);
    }
})

// ---------------------- SLICE ----------------------

const addressSlice = createSlice({
    name: 'address',
    initialState: {
        addresses: [],
        currentAddress: null,
        loading: false,
        error: null,
        meta: null
    },
    reducers: {
        clearAddressError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAll.fulfilled, (state, action) => {
                const { data, meta } = action.payload;
                state.addresses = data;
                state.meta = meta;
                state.loading = false;
            })
            .addCase(getById.fulfilled, (state, action) => {
                state.currentAddress = action.payload;
                state.loading = false;
            })
            .addCase(create.fulfilled, (state, action) => {
                state.addresses.push(action.payload);
                state.loading = false;
            })
            .addCase(update.fulfilled, (state, action) => {
                const index = state.addresses.findIndex(addr => addr.id === action.payload.id);
                if (index !== -1) {
                    state.addresses[index] = action.payload;
                }
                state.loading = false;
            })
            .addCase(remove.fulfilled, (state, action) => {
                state.addresses = state.addresses.filter(a => a.id !== action.meta.arg);
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
});

export const { clearAddressError } = addressSlice.actions;
export default addressSlice.reducer;