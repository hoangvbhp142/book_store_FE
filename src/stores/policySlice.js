import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import policyApi from "../api/policyApi";
import { handleApiError } from "../app/utils";

// ---------------------- ASYNC THUNKS ----------------------

export const getAllPolicies = createAsyncThunk("policy/getAll", async (_, { rejectWithValue }) => {
    try {
        return await policyApi.getAll();
    } catch (error) {
        return handleApiError(error, rejectWithValue);
    }
})

export const getPolicyById = createAsyncThunk("policy/getById", async (id, { rejectWithValue }) => {
    try {
        return await policyApi.getById(id);
    } catch (error) {
        return handleApiError(error, rejectWithValue);
    }
})

export const createPolicy = createAsyncThunk("policy/create", async (payload, { rejectWithValue }) => {
    try {
        return await policyApi.create(payload)
    } catch (error) {
        return handleApiError(error, rejectWithValue);
    }
})

export const updatePolicy = createAsyncThunk("policy/update", async ({ id, payload }, { rejectWithValue }) => {
    try {
        return await policyApi.update(id, payload);
    } catch (error) {
        return handleApiError(error, rejectWithValue);
    }
})

export const removePolicy = createAsyncThunk("policy/remove", async (id, { rejectWithValue }) => {
    try {
        return await policyApi.remove(id);
    } catch (error) {
        return handleApiError(error, rejectWithValue);
    }
})

// ---------------------- SLICE ----------------------

const policySlice = createSlice({
    name: 'policy',
    initialState: {
        policies: [],
        currentPolicy: null,
        loading: false,
        error: null,
        meta: null
    },
    reducers: {
        clearPolicyError: (state) => {
            state.error = null;
        },
        clearCurrentPolicy: (state) => {
            state.currentPolicy = null;
        },
        setCurrentPolicy: (state, action) => {
            state.currentPolicy = action.payload;
        },
        resetPolicyState: (state) => {
            state.policies = [];
            state.currentPolicy = null;
            state.loading = false;
            state.error = null;
            state.meta = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllPolicies.fulfilled, (state, action) => {
                const { data, meta } = action.payload;
                state.policies = data;
                state.meta = meta;
                state.loading = false;
            })
            .addCase(getPolicyById.fulfilled, (state, action) => {
                state.currentPolicy = action.payload;
                state.loading = false;
            })
            .addCase(createPolicy.fulfilled, (state, action) => {
                state.policies.push(action.payload);
                state.loading = false;
            })
            .addCase(updatePolicy.fulfilled, (state, action) => {
                const index = state.policies.findIndex(policy => policy.id === action.payload.id);
                if (index !== -1) {
                    state.policies[index] = action.payload;
                }
                // Cập nhật currentPolicy nếu đang chỉnh sửa
                if (state.currentPolicy && state.currentPolicy.id === action.payload.id) {
                    state.currentPolicy = action.payload;
                }
                state.loading = false;
            })
            .addCase(removePolicy.fulfilled, (state, action) => {
                state.policies = state.policies.filter(policy => policy.id !== action.meta.arg);
                state.loading = false;
            })
            // Matcher chung cho pending & rejected
            .addMatcher(
                (action) => action.type.startsWith("policy/") && action.type.endsWith("/pending"),
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                (action) => action.type.startsWith("policy/") && action.type.endsWith("/rejected"),
                (state, action) => {
                    state.loading = false;
                    state.error = action.payload || "Đã xảy ra lỗi không xác định";
                }
            );
    }
});

export const {
    clearPolicyError,
    clearCurrentPolicy,
    setCurrentPolicy,
    resetPolicyState
} = policySlice.actions;

export default policySlice.reducer;