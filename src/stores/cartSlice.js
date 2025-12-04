import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cartApi from '../api/cartApi';
import { handleApiError } from '../app/utils';

// Async thunks
const fetchCart = createAsyncThunk("cart/fetchCart", async (_, { rejectWithValue }) => {
    try {
        const response = await cartApi.getCart();
        return response;
    } catch (error) {
        return handleApiError(error, rejectWithValue);
    }
});

const addToCart = createAsyncThunk("cart/addToCart", async (cartData, { rejectWithValue }) => {
    try {
        const response = await cartApi.addToCart(cartData);
        return response;
    } catch (error) {
        return handleApiError(error, rejectWithValue);
    }
});

const updateCartItem = createAsyncThunk("cart/updateCartItem", async ({ itemId, data }, { rejectWithValue }) => {
    try {
        const response = await cartApi.updateCartItem(itemId, data);
        return response;
    } catch (error) {
        return handleApiError(error, rejectWithValue);
    }
});

const removeCartItem = createAsyncThunk("cart/removeCartItem", async (itemId, { rejectWithValue }) => {
    try {
        const response = await cartApi.removeCartItem(itemId);
        return response;
    } catch (error) {
        return handleApiError(error, rejectWithValue);
    }
});

const clearCart = createAsyncThunk("cart/clearCart", async (_, { rejectWithValue }) => {
    try {
        const response = await cartApi.clearCart();
        return response;
    } catch (error) {
        return handleApiError(error, rejectWithValue);
    }
});

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        total: 0,
        loading: false,
        error: null,
    },
    reducers: {
        // Reset cart state
        resetCart: (state) => {
            state.items = [];
            state.total = 0;
            state.error = null;
        },

        // Set loading state manually if needed
        setLoading: (state, action) => {
            state.loading = action.payload;
        },

        toggleItemSelection: (state, action) => {
            const { itemId, type } = action.payload;
            const item = state.items.find(item => item.id === itemId && item.type === type);
            if (item) {
                item.isChecked = !item.isChecked;
                // Tính lại tổng tiền dựa trên các mục được chọn
                state.total = calcTotal(state.items);
            }
        },
    },
    extraReducers: (builder) => {
        // Fetch cart
        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                const { data, meta } = action.payload;
                state.loading = false;
                state.items = data || [];
                //state.total = action.payload.total || 0;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });

        // Add to cart
        builder
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                // Update state from API response
                if (action.payload.items) {
                    state.items = action.payload.items;
                    state.total = action.payload.total;
                }
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });

        // Update cart item
        builder
            .addCase(updateCartItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCartItem.fulfilled, (state, action) => {
                state.loading = false;
                const updatedItem = action.payload;
                const index = state.items.findIndex(item => item.id === updatedItem.id);

                if (index !== -1) {
                    state.items[index] = updatedItem;
                    // Recalculate total if needed, or get from API response
                    state.total = action.payload.total || state.total;
                }
            })
            .addCase(updateCartItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });

        // Remove cart item
        builder
            .addCase(removeCartItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeCartItem.fulfilled, (state, action) => {
                state.loading = false;
                const removedItemId = action.meta.arg;
                state.items = state.items.filter(item => item.id !== removedItemId);
                state.total = action.payload.total || state.total;
            })
            .addCase(removeCartItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });

        // Clear cart
        builder
            .addCase(clearCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(clearCart.fulfilled, (state) => {
                state.loading = false;
                state.items = [];
                state.total = 0;
            })
            .addCase(clearCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export {
    fetchCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart
};

export const {
    resetCart,
    setLoading,
    toggleItemSelection
} = cartSlice.actions;

export default cartSlice.reducer;