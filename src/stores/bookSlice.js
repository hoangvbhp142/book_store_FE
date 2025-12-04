import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import bookApi from '../api/bookApi';
import { handleApiError } from '../app/utils';

const fetchBooks = createAsyncThunk("books/fetchBooks", async ({ params, isAdmin = false }, { rejectWithValue }) => {
    try {
        const response = await bookApi.getAll(params, isAdmin);        
        return response;
    } catch (error) {
        return handleApiError(error, rejectWithValue);
    }
});

const fetchBookById = createAsyncThunk("books/fetchBookById", async ({ id, isAdmin = false }, { rejectWithValue }) => {
    try {
        const response = await bookApi.getById(id, isAdmin);
        console.log(response);
        
        return response;
    } catch (error) {
        return handleApiError(error, rejectWithValue);
    }
});

const createBook = createAsyncThunk("/books/createBook", async (data, { rejectWithValue }) => {
    try {
        const response = await bookApi.create(data);
        return response;
    } catch (error) {
        return handleApiError(error, rejectWithValue);
    }
});

const updateBook = createAsyncThunk(`/books/updateBook`, async ({ id, data }, { rejectWithValue }) => {
    try {
        const response = await bookApi.update(id, data);
        return response;
    } catch (error) {
        return handleApiError(error, rejectWithValue)
    }
});

const deleteBook = createAsyncThunk(`/books/deleteBook`, async (id, { rejectWithValue }) => {
    try {
        const response = await bookApi.delete(id);
        return response;
    } catch (error) {
        return handleApiError(error, rejectWithValue);
    }
});

const bookSlice = createSlice({
    'name': 'books',
    'initialState': {
        bookList: [],
        selectedBook: null,
        loading: false,
        error: null,
        meta: null,
    },
    reducers: {

    },
    extraReducers: (builder) => {
        //fetch books
        builder
            .addCase(fetchBooks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBooks.fulfilled, (state, action) => {
                const { data, meta } = action.payload
                state.loading = false;
                state.bookList = data;
                state.meta = meta;
            })
            .addCase(fetchBooks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });

        //fetch book by id
        builder
            .addCase(fetchBookById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBookById.fulfilled, (state, action) => {
                console.log(action.payload);
                
                state.loading = false;
                state.selectedBook = action.payload;
            })
            .addCase(fetchBookById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });

        //create book
        builder
            .addCase(createBook.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createBook.fulfilled, (state, action) => {
                state.loading = false;
                state.bookList.push(action.payload);;
            })
            .addCase(createBook.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });

        //update book
        builder
            .addCase(updateBook.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateBook.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.bookList.findIndex(book => book.id === action.payload.id);
                if (index !== -1) {
                    state.bookList[index] = action.payload;
                }
            })
            .addCase(updateBook.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });

        //delete book
        builder
            .addCase(deleteBook.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteBook.fulfilled, (state, action) => {
                state.loading = false;
                state.bookList = state.bookList.filter(book => book.id !== action.meta.arg);
            })
            .addCase(deleteBook.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export {
    fetchBooks,
    fetchBookById,
    createBook,
    updateBook,
    deleteBook
};

export default bookSlice.reducer;