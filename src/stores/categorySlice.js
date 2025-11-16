import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import categoryApi from '../api/categoryApi';
import { handleApiError, buildTree, addNodeToTree } from '../app/utils';

export const getAll = createAsyncThunk('category/gatAll', async (params = {}, { rejectWithValue }) => {
    try {
        return await categoryApi.getAll(params);
    } catch (error) {
        return handleApiError(error, rejectWithValue);
    }
});

export const create = createAsyncThunk('category/create', async (data, { rejectWithValue }) => {
    try {
        return await categoryApi.create(data);
    } catch (error) {
        return handleApiError(error, rejectWithValue);
    }
});

export const update = createAsyncThunk('category/update', async ({ id, data }, { rejectWithValue }) => {
    try {
        return await categoryApi.update(id, data);
    } catch (error) {
        return handleApiError(error, rejectWithValue);
    }
});

export const remove = createAsyncThunk('category/remove', async (id, { rejectWithValue }) => {
    try {
        return await categoryApi.remove(id);
    } catch (error) {
        return handleApiError(error, rejectWithValue);
    }
});

const categorySlice = createSlice({
    name: 'category',
    initialState: {
        categories: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearErrorState: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAll.fulfilled, (state, action) => {
                const { data, meta } = action.payload;
                state.categories = data;
                state.loading = false;
            })
            .addCase(create.fulfilled, (state, action) => {
                const data = action.payload;
                state.categories.push(data);
                state.loading = false;
            })
            .addCase(update.fulfilled, (state, action) => {
                const index = state.categories.findIndex(c => c.id === action.payload.id);

                if (index !== -1) {
                    state.categories[index] = action.payload;
                }
                state.loading = false;
            })
            .addCase(remove.fulfilled, (state, action) => {
                state.categories = state.categories.filter(c => c.id !== action.meta.arg);
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

export const { clearErrorState } = categorySlice.actions;
export default categorySlice.reducer;