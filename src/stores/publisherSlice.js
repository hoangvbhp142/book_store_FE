import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import publisherApi from "../api/publisherApi"; // Đổi thành publisherApi
import { handleApiError } from "../app/utils";

export const getAll = createAsyncThunk('publisher/getAll', async (params, { rejectWithValue }) => { // Đổi tên action
    try {
        return await publisherApi.getAll(params); // Đổi thành publisherApi
    } catch (error) {
        return handleApiError(error, rejectWithValue);
    }
})

export const getById = createAsyncThunk('publisher/getById', async (id, { rejectWithValue }) => { // Đổi tên action
    try {
        return await publisherApi.getById(id); // Đổi thành publisherApi
    } catch (error) {
        return handleApiError(error, rejectWithValue);
    }
})

export const create = createAsyncThunk('publisher/create', async (data, { rejectWithValue }) => { // Đổi tên action
    try {
        return await publisherApi.create(data); // Đổi thành publisherApi
    } catch (error) {
        return handleApiError(error, rejectWithValue);
    }
});

export const update = createAsyncThunk('publisher/update', async ({ id, data }, { rejectWithValue }) => { // Đổi tên action
    try {
        return await publisherApi.update(id, data); // Đổi thành publisherApi
    } catch (error) {
        return handleApiError(error, rejectWithValue);
    }
});

export const remove = createAsyncThunk('publisher/delete', async (id, { rejectWithValue }) => { // Đổi tên action
    try {
        await publisherApi.remove(id); // Đổi thành publisherApi
        return id; // Trả về id để xóa khỏi state
    } catch (error) {
        return handleApiError(error, rejectWithValue);
    }
});

const publisherSlice = createSlice({ // Đổi tên slice
    name: 'publisher', // Đổi tên slice
    initialState: {
        publishers: [], // Đổi thành publishers
        currentPublisher: null, // Đổi thành currentPublisher
        loading: false,
        error: null,
        meta: null
    },
    reducers: {
        clearErrorState: (state) => {
            state.error = null
        },
        clearCurrentPublisher: (state) => { // Đổi tên action
            state.currentPublisher = null // Đổi thành currentPublisher
        }
    },
    extraReducers: (builder) => {
        builder
            // Get All
            .addCase(getAll.fulfilled, (state, action) => {
                const { data, meta } = action.payload;
                state.publishers = data; // Đổi thành publishers
                state.meta = meta;
                state.loading = false;
            })
            // Get By Id
            .addCase(getById.fulfilled, (state, action) => {
                const { data } = action.payload;
                state.currentPublisher = data; // Đổi thành currentPublisher
                state.loading = false;
            })
            // Create
            .addCase(create.fulfilled, (state, action) => {
                const data = action.payload;
                state.publishers.push(data); // Đổi thành publishers
                state.loading = false;
            })
            // Update
            .addCase(update.fulfilled, (state, action) => {
                const data = action.payload;
                const index = state.publishers.findIndex(publisher => publisher.id === data.id); // Đổi thành publishers
                if (index !== -1) {
                    state.publishers[index] = data; // Đổi thành publishers
                }
                if (state.currentPublisher && state.currentPublisher.id === data.id) { // Đổi thành currentPublisher
                    state.currentPublisher = data; // Đổi thành currentPublisher
                }
                state.loading = false;
            })
            // Delete
            .addCase(remove.fulfilled, (state, action) => {
                const id = action.payload;
                state.publishers = state.publishers.filter(publisher => publisher.id !== id); // Đổi thành publishers
                if (state.currentPublisher && state.currentPublisher.id === id) { // Đổi thành currentPublisher
                    state.currentPublisher = null; // Đổi thành currentPublisher
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

export const { clearErrorState, clearCurrentPublisher } = publisherSlice.actions; // Đổi tên export
export default publisherSlice.reducer;