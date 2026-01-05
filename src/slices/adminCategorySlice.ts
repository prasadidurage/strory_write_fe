import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { backendApi } from '../api.ts';


export interface CategoryDto {
    id: string;
    name: string;
    description: string;
}

interface CategoryFormData {
    name: string;
    description: string;
}

interface AdminCategoryState {
    categories: CategoryDto[];
    loading: boolean;
    submitting: boolean;
    error: string | null;
    searchTerm: string;
    showModal: boolean;
    editingCategory: CategoryDto | null;
    formData: CategoryFormData;
}

const initialState: AdminCategoryState = {
    categories: [],
    loading: false,
    submitting: false,
    error: null,
    searchTerm: '',
    showModal: false,
    editingCategory: null,
    formData: {
        name: '',
        description: ''
    }
};


export const fetchCategories = createAsyncThunk(
    'adminCategory/fetchCategories',
    async (_, { rejectWithValue }) => {
        try {
            const response = await backendApi.get('/category/all');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch categories');
        }
    }
);

export const createCategory = createAsyncThunk(
    'adminCategory/createCategory',
    async (categoryData: CategoryFormData, { rejectWithValue }) => {
        try {
            const response = await backendApi.post('/category/save', categoryData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to create category');
        }
    }
);

export const updateCategory = createAsyncThunk(
    'adminCategory/updateCategory',
    async ({ id, categoryData }: { id: string; categoryData: CategoryFormData }, { rejectWithValue }) => {
        try {
            const response = await backendApi.put(`/category/update/${id}`, categoryData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to update category');
        }
    }
);

export const deleteCategory = createAsyncThunk(
    'adminCategory/deleteCategory',
    async (categoryId: string, { rejectWithValue }) => {
        try {
            await backendApi.delete(`/category/delete/${categoryId}`);
            return categoryId;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to delete category');
        }
    }
);

const adminCategorySlice = createSlice({
    name: 'adminCategory',
    initialState,
    reducers: {
        setSearchTerm: (state, action: PayloadAction<string>) => {
            state.searchTerm = action.payload;
        },
        setShowModal: (state, action: PayloadAction<boolean>) => {
            state.showModal = action.payload;
        },
        setEditingCategory: (state, action: PayloadAction<CategoryDto | null>) => {
            state.editingCategory = action.payload;
        },
        setFormData: (state, action: PayloadAction<CategoryFormData>) => {
            state.formData = action.payload;
        },
        updateFormField: (state, action: PayloadAction<{ name: keyof CategoryFormData; value: string }>) => {
            state.formData[action.payload.name] = action.payload.value;
        },
        resetForm: (state) => {
            state.formData = {
                name: '',
                description: ''
            };
            state.editingCategory = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        openAddModal: (state) => {
            state.showModal = true;
            state.editingCategory = null;
            state.formData = {
                name: '',
                description: ''
            };
        },
        openEditModal: (state, action: PayloadAction<CategoryDto>) => {
            state.showModal = true;
            state.editingCategory = action.payload;
            state.formData = {
                name: action.payload.name,
                description: action.payload.description
            };
        },
        closeModal: (state) => {
            state.showModal = false;
            state.editingCategory = null;
            state.formData = {
                name: '',
                description: ''
            };
        }
    },
    extraReducers: (builder) => {

        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });


        builder
            .addCase(createCategory.pending, (state) => {
                state.submitting = true;
                state.error = null;
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.submitting = false;
                state.categories.push(action.payload);
                state.showModal = false;
                state.formData = {
                    name: '',
                    description: ''
                };
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload as string;
            });


        builder
            .addCase(updateCategory.pending, (state) => {
                state.submitting = true;
                state.error = null;
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                state.submitting = false;
                const index = state.categories.findIndex(cat => cat.id === action.payload.id);
                if (index !== -1) {
                    state.categories[index] = action.payload;
                }
                state.showModal = false;
                state.editingCategory = null;
                state.formData = {
                    name: '',
                    description: ''
                };
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload as string;
            });


        builder
            .addCase(deleteCategory.pending, (state) => {
                state.error = null;
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.categories = state.categories.filter(cat => cat.id !== action.payload);
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    }
});

export const {
    setSearchTerm,
    setShowModal,
    setEditingCategory,
    setFormData,
    updateFormField,
    resetForm,
    clearError,
    openAddModal,
    openEditModal,
    closeModal
} = adminCategorySlice.actions;

export default adminCategorySlice.reducer;