import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authApi from "../api/authApi";

export const sendOtp = createAsyncThunk("otp/sendOtp", async (payload) => {
    const response = await authApi.otp(payload);
    return response;
});

const otpSlice = createSlice({
    name: "otp",
    initialState: {
        loading: false,
        sent: false,
        error: null,
        countdown: 0,
        method: "sms"
    },
    reducers: {
        sendOtpState: (state, action) => {
            state.loading = false;
            state.sent = true;
            state.countdown = 60;
            state.method = action.payload.method;
        },
        setMethod: (state, action) => { state.method = action.payload; },
        setCountdown: (state, action) => { state.countdown = action.payload; },
        resetOtp: (state) => {
            state.sent = false;
            state.error = null;
            state.countdown = 0;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendOtp.fulfilled, (state) => {
                state.loading = false;
                state.sent = true;
                state.countdown = 60;
            })
            .addCase(sendOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { setMethod, setCountdown, resetOtp, sendOtpState } = otpSlice.actions;
export default otpSlice.reducer;
