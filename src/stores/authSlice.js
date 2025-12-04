import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authApi from "../api/authApi";
import users from "../data/users.js";

const handleApiError = (error, rejectWithValue) => {
    if (error.response && error.response.data) {
        const message = error.response.data.message;
        if (Array.isArray(message)) {
            return rejectWithValue(message.join(", "));
        }
        return rejectWithValue(message || "Đã xảy ra lỗi");
    }
    return rejectWithValue(error.message || "Đã xảy ra lỗi không xác định");
};

// ---------------------- ASYNC THUNKS ----------------------

export const otp = createAsyncThunk("auth/otp", async (data, { rejectWithValue }) => {
    try {
        const response = await authApi.otp(data);
        return response;
    } catch (error) {
        return handleApiError(error, rejectWithValue);
    }
});

export const register = createAsyncThunk("auth/register", async (data, { rejectWithValue }) => {
    try {
        const response = await authApi.register(data);
        return response;
    } catch (error) {
        return handleApiError(error, rejectWithValue);
    }
});

export const login = createAsyncThunk("auth/login", async (data, { rejectWithValue }) => {
    try {
        const response = await authApi.login(data);
        return response;
    } catch (error) {
        return handleApiError(error, rejectWithValue);
    }
});

export const refresh = createAsyncThunk("auth/refresh", async (data, { rejectWithValue }) => {
    try {
        const response = await authApi.refresh(data);
        return response;
    } catch (error) {
        return handleApiError(error, rejectWithValue);
    }
});

export const logout = createAsyncThunk("auth/logout", async (data, { rejectWithValue }) => {
    try {
        const response = await authApi.logout(data);
        return response;
    } catch (error) {
        return handleApiError(error, rejectWithValue);
    }
});

export const updateProfile = createAsyncThunk("auth/updateProfile", async (data, { rejectWithValue }) => {
    try {
        const response = await authApi.updateProfile(data);
        return response;
    } catch (error) {
        return handleApiError(error, rejectWithValue);
    }
});

// ---------------------- SLICE ----------------------

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        otp: null,
        user: JSON.parse(localStorage.getItem('userData')) || null,
        token: localStorage.getItem("accessToken") || null,
        refreshToken: localStorage.getItem("refreshToken") || null,
        loading: false,
        error: null,
    },
    reducers: {
        otpState: (state, action) => {
            state.otp = action.payload;
        },
        registerState: (state, action) => {
            const existingUser = users.find(u => u.email === action.payload.email);
            if (existingUser) {
                state.error = "Email đã được sử dụng";
                return;
            }
            const newUser = {
                id: users.length + 1,
                username: action.payload.username,
                password: action.payload.password,
                email: action.payload.email,
                role: 'Customer'
            };
            users.push(newUser);
            state.user = newUser;
            state.token = "customer-token";
            state.error = null;
        },
        loginState: (state, action) => {
            const user = users.find(
                u => u.username === action.payload.username && u.password === action.payload.password
            );

            if (!user) {
                state.error = "Thông tin đăng nhập không chính xác";
                return;
            }

            state.user = user;
            state.token = user.role === 'Admin' ? "admin-token" : "customer-token";
            state.error = null;
        },
        logoutState: (state) => {
            state.user = null;
            state.token = null;
            state.refreshToken = null;
            state.loading = false;
            state.error = null;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // otp
            .addCase(otp.fulfilled, (state, action) => {
                state.loading = false;
                state.otp = action.payload;
            })
            // register
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.user = {
                    fullName: action.payload.fullName,
                    email: action.payload.email,
                    phone: action.payload.phone,
                    role: action.payload.role
                };
                state.token = action.payload.token;
                state.refreshToken = action.payload.refreshToken;
            })
            // login
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = {
                    fullName: action.payload.fullName,
                    email: action.payload.email,
                    phone: action.payload.phone,
                    role: action.payload.role
                };
                state.token = action.payload.token;
                state.refreshToken = action.payload.refreshToken;
            })
            // refresh
            .addCase(refresh.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
            })
            // logout
            .addCase(logout.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.token = null;
                state.refreshToken = null;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = {
                    ...state.user,
                    ...action.payload
                }

                const userData = JSON.parse(localStorage.getItem('userData')) || {};
                const updatedUserData = { ...userData, ...action.payload };
                localStorage.setItem('userData', JSON.stringify(updatedUserData));
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
});

export const { registerState, loginState, logoutState, setError } = authSlice.actions;
export default authSlice.reducer;
