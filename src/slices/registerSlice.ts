import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { backendApi } from "../api";

interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
}

interface UserDto {
    name: string;
    email: string;
    password: string;
    role: string;
}

interface RegisterState {
    name: string;
    email: string;
    password: string;
    termsAccepted: boolean;
    loading: boolean;
    error: string | null;
    success: boolean;
    savedUser: User | null;
}

const initialState: RegisterState = {
    name: '',
    email: '',
    password: '',
    termsAccepted: false,
    loading: false,
    error: null,
    success: false,
    savedUser: null,
};


export const registerUser = createAsyncThunk(
    'register/registerUser',
    async (userData: UserDto, { rejectWithValue }) => {
        try {
            const response = await backendApi.post('/user/save', userData);
            return response.data;
        } catch (error: any) {
            if (error.response?.data?.error) {
                return rejectWithValue(error.response.data.error);
            }
            return rejectWithValue('Something went wrong during registration');
        }
    }
);

const registerSlice = createSlice({
    name: "register",
    initialState,
    reducers: {
        updateFormField: (state, action: PayloadAction<{ field: string; value: string | boolean }>) => {
            const { field, value } = action.payload;
            (state as any)[field] = value;
        },
        clearForm: (state) => {
            state.name = '';
            state.email = '';
            state.password = '';
            state.termsAccepted = false;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        resetSuccess: (state) => {
            state.success = false;
            state.savedUser = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.loading = false;
                state.success = true;
                state.savedUser = action.payload;

                state.name = '';
                state.email = '';
                state.password = '';
                state.termsAccepted = false;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { updateFormField, clearForm, clearError, resetSuccess } = registerSlice.actions;
export default registerSlice.reducer;

