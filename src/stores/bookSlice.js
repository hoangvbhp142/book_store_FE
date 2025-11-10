import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import bookApi from '../api/bookApi';

const fetchBooks = createAsyncThunk("books/fetchBooks", async () => {
    const response = await bookApi.getAll();
    return response;
});

const fetchBookById = createAsyncThunk("books/fetchBookById", async (id) => {
    const response = await bookApi.getById(id);
    return response;
});

const createBook = createAsyncThunk("/books/createBook", async (data) => {
    const response = await bookApi.create(data);
    return response;
});

const updateBook = createAsyncThunk(`/books/updateBook`, async ({ id, data }) => {
    const response = await bookApi.update(id, data);
    return response;
});

const deleteBook = createAsyncThunk(`/books/deleteBook`, async (id) => {
    const response = await bookApi.delete(id);
    return response;
});

const bookSlice = createSlice({
    'name': 'books',
    'initialState': {
        bookList: [],
        selectedBook: null,
        loading: false,
        error: null,
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
                state.loading = false;
                state.bookList = action.payload;
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