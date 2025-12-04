import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import imageApi from "../api/imageApi";
import { handleApiError } from "../app/utils";

export const upload = createAsyncThunk('image/upload', async (file, { rejectedWithValue }) => {
    try {
        return await imageApi.upload(file);
    } catch (error) {
        handleApiError(error, rejectedWithValue);
    }
});

export const multipleUpload = createAsyncThunk('image/multipleUpload', async (files, { rejectedWithValue }) => {
    try {
        return await imageApi.multipleUpload(files);
    } catch (error) {
        handleApiError(error, rejectedWithValue);
    }
});

const imageSlice = createSlice({
    name: 'image',
    initialState: {
        imageUrl: null,
        imageUrls: [],
        loading: false,
        error: null
    },
    reducers: {
        clearImageState: (state) => {
            state.imageUrl = null;
            state.imageUrls = [];
            state.loading = false;
            state.error = null;
        },
        resetError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(upload.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.imageUrl = action.payload;
            })
            .addCase(multipleUpload.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.imageUrls = action.payload
            })
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

export const { clearImageState, resetError } = imageSlice.actions;
export default imageSlice.reducer;