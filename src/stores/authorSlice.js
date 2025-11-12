import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authorApi from "../api/authorApi";
import { handleApiError } from "../app/utils";

export const getAll = createAsyncThunk('author/getAll', async (params, { rejectWithValue }) => {
    try {
        return await authorApi.getAll(params);
    } catch (error) {
        return handleApiError(error, rejectWithValue);
    }
})

export const getById = createAsyncThunk('author/getById', async (id, { rejectWithValue }) => {
    try {
        return await authorApi.getById(id);
    } catch (error) {
        return handleApiError(error, rejectWithValue);
    }
})

export const create = createAsyncThunk('author/create', async (data, { rejectWithValue }) => {
    try {
        return await authorApi.create(data);
    } catch (error) {
        return handleApiError(error, rejectWithValue);
    }
});

export const update = createAsyncThunk('author/update', async ({ id, data }, { rejectWithValue }) => {
    try {
        return await authorApi.update(id, data);
    } catch (error) {
        return handleApiError(error, rejectWithValue);
    }
});

// export const remove = createAsyncThunk('author/delete', async (id, { rejectWithValue }) => {
//     try {
//         await authorApi.delete(id);
//         return id; // Trả về id để xóa khỏi state
//     } catch (error) {
//         return handleApiError(error, rejectWithValue);
//     }
// });

const authorSlice = createSlice({
    name: 'author',
    initialState: {
        authors: [],
        currentAuthor: null,
        loading: false,
        error: null,
        meta: null
    },
    reducers: {
        clearErrorState: (state) => {
            state.error = null
        },
        clearCurrentAuthor: (state) => {
            state.currentAuthor = null
        }
    },
    extraReducers: (builder) => {
        builder
            // Get All
            .addCase(getAll.fulfilled, (state, action) => {
                const { data, meta } = action.payload;
                state.authors = data;
                state.meta = meta;
                state.loading = false;
            })
            // Get By Id
            .addCase(getById.fulfilled, (state, action) => {
                const { data } = action.payload;
                state.currentAuthor = data;
                state.loading = false;
            })
            // Create
            .addCase(create.fulfilled, (state, action) => {
                const data = action.payload;
                state.authors.push(data);
                state.loading = false;
            })
            // Update
            .addCase(update.fulfilled, (state, action) => {
                const data = action.payload;
                const index = state.authors.findIndex(author => author.id === data.id);
                if (index !== -1) {
                    state.authors[index] = data;
                }
                if (state.currentAuthor && state.currentAuthor.id === data.id) {
                    state.currentAuthor = data;
                }
                state.loading = false;
            })
            // Delete
            // .addCase(remove.fulfilled, (state, action) => {
            //     const id = action.payload;
            //     state.authors = state.authors.filter(author => author.id !== id);
            //     if (state.currentAuthor && state.currentAuthor.id === id) {
            //         state.currentAuthor = null;
            //     }
            //     state.loading = false;
            // })
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

export const { clearErrorState, clearCurrentAuthor } = authorSlice.actions;
export default authorSlice.reducer;