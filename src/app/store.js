import { configureStore } from '@reduxjs/toolkit';
import bookReducer from '../stores/bookSlice';
import authReducer from '../stores/authSlice';
import otpReducer from '../stores/otpSlice';
import cartReducer from '../stores/cartSlice';
import addressReducer from '../stores/addressSlice';
import categoryReducer from '../stores/categorySlice';
import authorReducer from '../stores/authorSlice';
import publisherReducer from '../stores/publisherSlice';
import imageReducer from '../stores/imageSlice';
import userReducer from '../stores/userSlice';
import reviewReducer from '../stores/reviewSlice';
import policyReducer from '../stores/policySlice';

const store = configureStore({
    reducer: {
        books: bookReducer,
        auth: authReducer,
        otp: otpReducer,
        cart: cartReducer,
        address: addressReducer,
        category: categoryReducer,
        author: authorReducer,
        publisher: publisherReducer,
        image: imageReducer,
        user: userReducer,
        review: reviewReducer,
        policy: policyReducer,
    },
});

export default store;