import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { backendApi } from '../api.ts';


export interface UserDto {
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
}

interface AdminUserState {
    users: UserDto[];
    loading: boolean;
    error: string | null;
    searchTerm: string;
    showViewModal: boolean;
    selectedUser: UserDto | null;
}

const initialState: AdminUserState = {
    users: [],
    loading: false,
    error: null,
    searchTerm: '',
    showViewModal: false,
    selectedUser: null
};


export const fetchUsers = createAsyncThunk(
    'adminUser/fetchUsers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await backendApi.get('/user/all');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch users');
        }
    }
);

export const deleteUser = createAsyncThunk(
    'adminUser/deleteUser',
    async (userId: string, { rejectWithValue }) => {
        try {
            await backendApi.delete(`/user/delete/${userId}`);
            return userId;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to delete user');
        }
    }
);

export const getUserById = createAsyncThunk(
    'adminUser/getUserById',
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await backendApi.get(`/user/${userId}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch user details');
        }
    }
);

const adminUserSlice = createSlice({
    name: 'adminUser',
    initialState,
    reducers: {
        setSearchTerm: (state, action: PayloadAction<string>) => {
            state.searchTerm = action.payload;
        },
        setShowViewModal: (state, action: PayloadAction<boolean>) => {
            state.showViewModal = action.payload;
        },
        setSelectedUser: (state, action: PayloadAction<UserDto | null>) => {
            state.selectedUser = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        openViewModal: (state, action: PayloadAction<UserDto>) => {
            state.showViewModal = true;
            state.selectedUser = action.payload;
        },
        closeViewModal: (state) => {
            state.showViewModal = false;
            state.selectedUser = null;
        }
    },
    extraReducers: (builder) => {

        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });


        builder
            .addCase(deleteUser.pending, (state) => {
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter(user => user.id !== action.payload);
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.error = action.payload as string;
            });


        builder
            .addCase(getUserById.pending, (state) => {
                state.error = null;
            })
            .addCase(getUserById.fulfilled, (state, action) => {
                state.selectedUser = action.payload;
            })
            .addCase(getUserById.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    }
});

export const {
    setSearchTerm,
    setShowViewModal,
    setSelectedUser,
    clearError,
    openViewModal,
    closeViewModal
} = adminUserSlice.actions;

export default adminUserSlice.reducer;