// reviewSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import reviewApi from '../api/reviewApi';
import { handleApiError } from '../app/utils';
// Async thunks
export const fetchReviews = createAsyncThunk(
    'reviews/fetchReviews',
    async (params, { rejectWithValue }) => {
        try {
            const response = await reviewApi.getAll(params);
            return response.data;
        } catch (error) {
            return handleApiError(error, rejectWithValue);
        }
    }
);

export const createReview = createAsyncThunk(
    'reviews/createReview',
    async (reviewData, { rejectWithValue }) => {
        try {
            const response = await reviewApi.create(reviewData);
            return response.data;
        } catch (error) {
            return handleApiError(error, rejectWithValue);
        }
    }
);

export const updateReview = createAsyncThunk(
    'reviews/updateReview',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await reviewApi.update(id, data);
            return response.data;
        } catch (error) {
            return handleApiError(error, rejectWithValue);
        }
    }
);

export const deleteReview = createAsyncThunk(
    'reviews/deleteReview',
    async (id, { rejectWithValue }) => {
        try {
            await reviewApi.delete(id);
            return id;
        } catch (error) {
            return handleApiError(error, rejectWithValue);
        }
    }
);

// Slice
const reviewSlice = createSlice({
    name: 'review',
    initialState: {
        items: [],
        loading: false,
        error: null,
        currentRequestId: undefined
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Reviews
            .addCase(fetchReviews.pending, (state, action) => {
                if (!state.loading) {
                    state.loading = true;
                    state.currentRequestId = action.meta.requestId;
                }
            })
            .addCase(fetchReviews.fulfilled, (state, action) => {
                if (state.loading && state.currentRequestId === action.meta.requestId) {
                    state.loading = false;
                    state.items = action.payload;
                    state.currentRequestId = undefined;
                }
            })
            .addCase(fetchReviews.rejected, (state, action) => {
                if (state.loading && state.currentRequestId === action.meta.requestId) {
                    state.loading = false;
                    state.error = action.payload;
                    state.currentRequestId = undefined;
                }
            })
            // Create Review
            .addCase(createReview.pending, (state) => {
                state.loading = true;
            })
            .addCase(createReview.fulfilled, (state, action) => {
                state.loading = false;
                state.items.push(action.payload);
            })
            .addCase(createReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Review
            .addCase(updateReview.fulfilled, (state, action) => {
                const index = state.items.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(updateReview.rejected, (state, action) => {
                state.error = action.payload;
            })
            // Delete Review
            .addCase(deleteReview.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item.id !== action.payload);
            })
            .addCase(deleteReview.rejected, (state, action) => {
                state.error = action.payload;
            });
    }
});

export const { clearError } = reviewSlice.actions;
export default reviewSlice.reducer;