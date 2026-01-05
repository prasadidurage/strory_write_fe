


import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { backendApi } from "../api.ts";


interface Category {
    id?: number ;
    name?: string;
}

interface HomeState {
    categories: Category[];
    loading: boolean;
    error: string | null;
    isDropdownOpen: boolean;
    selectedCategory: Category | null;
}

const initialState: HomeState = {
    categories: [],
    loading: false,
    error: null,
    isDropdownOpen: false,
    selectedCategory: null
};


export const getAllCategories = createAsyncThunk(
    'home/getAllCategories',
    async () => {
        const response = await backendApi.get<Category[]>('/category/all');
        return response.data;
    }
);

const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {
        toggleDropdown: (state) => {
            state.isDropdownOpen = !state.isDropdownOpen;
        },
        selectCategory: (state, action) => {
            state.selectedCategory = action.payload;
            state.isDropdownOpen = false;
        },
        closeDropdown: (state) => {
            state.isDropdownOpen = false;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(getAllCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch categories';
            });
    }
});

export const { toggleDropdown, selectCategory, closeDropdown, clearError } = homeSlice.actions;
export default homeSlice.reducer;