import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import cartApi from "../api/cartApi";

const calcTotal = (items) => items.reduce((sum, i) => {
    if (i.isChecked != null && i.isChecked === true) {
        if (i.type === 'buy')
            return sum + i.price * i.quantity;
        if (i.type === 'rent')
            return sum + i.deposit + i.price;
    }
    return sum;
}, 0);


const addToCart = createAsyncThunk("cart/addToCart", async (data) => {
    const response = await cartApi.addToCart(data);
    return response;
});

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        total: 0,
        loading: false,
        error: null
    },
    reducers: {
        //add items to cart
        addItems: (state, action) => {
            const item = action.payload;

            const existingItem = state.items.find(i => i.id === item.id && i.type === item.type);
            if (existingItem) {
                existingItem.quantity += item.quantity ?? 1;
            }
            else {
                state.items.push(item);
            }

            state.total = calcTotal(state.items);
        },
        //update items
        updateItems: (state, action) => {
            const updatetedItem = action.payload;
            const index = state.items.findIndex(i => i.id === updatetedItem.id);
            if (index !== -1) {
                state.items[index] = {
                    ...state.items[index],
                    ...updatetedItem
                };
            }

            state.total = calcTotal(state.items);
        },
        //remove items from cart
        removeItems: (state, action) => {
            const itemId = action.payload;
            state.items = state.items.filter(i => i.id !== itemId);
            state.total = state.total = calcTotal(state.items);
        },
        //clear cart
        clearCart: (state) => {
            state.items = [];
            state.total = 0;
        }
    },
    extraReducers: (builder) => {
        builder
            //add to cart
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items;
                state.total = action.payload.total;
            })
            //pending matcher
            .addMatcher(
                (action) => action.type.endsWith("/pending"),
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            //rejected matcher
            .addMatcher(
                (action) => action.type.endsWith("/rejected"),
                (state, action) => {
                    state.loading = false;
                    state.error = action.error.message;
                }
            );
    }
});

export const { addItems, updateItems, removeItems, clearCart } = cartSlice.actions;
export { addToCart };
export default cartSlice.reducer;