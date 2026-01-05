

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { backendApi } from "../api.ts";

interface StoryFormData {
    name: string;
    category: string;
    content: string;
    imageUrl: string;
    author: string;
    authorEmail: string;
    createdAt: string;
    error: string | null | undefined;
    loading: boolean;
    success: boolean;
    isAuthenticated: boolean;
    emailSending: boolean;
    emailSent: boolean;
    emailError: string | null;
    storyId: string | null;
}

const initialState: StoryFormData = {
    name: '',
    category: '',
    content: '',
    imageUrl: '',
    author: 'Anonymous Writer',
    authorEmail: 'anonymous@storyapp.com',
    createdAt: new Date().toISOString(),
    error: null,
    loading: false,
    success: false,
    isAuthenticated: false,
    emailSending: false,
    emailSent: false,
    emailError: null,
    storyId: null,
};


export const createStoryWithEmail = createAsyncThunk(
    'story/createWithEmail',
    async (data: {
        name: string;
        category: string;
        content: string;
        imageUrl: string;
        author: string;
        authorEmail: string;
        createdAt: string;
    }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');

            if (!token) {
                throw new Error('No authentication token found');
            }

            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };



            const storyResponse = await backendApi.post("/story/save", data, config);
            const storyData = storyResponse.data;


            try {
                await backendApi.post("/email/story-confirmation", {
                    userEmail: data.authorEmail,
                    userName: data.author,
                    storyTitle: data.name,
                    storyId: storyData.id || storyData._id
                }, config);

                console.log('✅ Email sent successfully');
            } catch (emailError: any) {
                console.warn('⚠️ Story created but email failed:', emailError.message);
                // Don't fail the entire operation if email fails
            }

            return {
                story: storyData,
                emailSent: true
            };

        } catch (error: any) {

            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);


export const sendStoryConfirmationEmail = createAsyncThunk(
    'email/storyConfirmation',
    async (data: {
        userEmail: string;
        userName: string;
        storyTitle: string;
        storyId?: string;
    }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');

            if (!token) {
                throw new Error('No authentication token found');
            }

            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };

            const response = await backendApi.post("/email/story-confirmation", data, config);
            return response.data;

        } catch (error: any) {

            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);


export const createStoryRequest = createAsyncThunk(
    'story/create',
    async (data: {
        name: string;
        category: string;
        content: string;
        imageUrl: string;
        author: string;
        authorEmail: string;
        createdAt: string;
    }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');

            if (!token) {
                throw new Error('No authentication token found');
            }

            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };

            const response = await backendApi.post("/story/save", data, config);
            return response.data;

        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const startWritingSlice = createSlice({
    name: 'startWriting',
    initialState: initialState,
    reducers: {
        clearForm: (state) => {
            state.name = '';
            state.category = '';
            state.content = '';
            state.imageUrl = '';
            if (!state.isAuthenticated) {
                state.author = 'Anonymous Writer';
                state.authorEmail = 'anonymous@storyapp.com';
            }
            state.createdAt = new Date().toISOString();
            state.error = null;
            state.success = false;
            state.emailSending = false;
            state.emailSent = false;
            state.emailError = null;
            state.storyId = null;
        },

        updateFormField: (state, action) => {
            const { field, value } = action.payload;
            (state as any)[field] = value;
        },

        clearError: (state) => {
            state.error = null;
            state.emailError = null;
        },

        resetSuccess: (state) => {
            state.success = false;
            state.emailSent = false;
        },

        updateCreatedAt: (state) => {
            state.createdAt = new Date().toISOString();
        },

        setUserFromToken: (state, action) => {
            const { email, username } = action.payload;
            state.author = username;
            state.authorEmail = email;
            state.isAuthenticated = true;
        },

        clearAuthentication: (state) => {
            state.author = 'Anonymous Writer';
            state.authorEmail = 'anonymous@storyapp.com';
            state.isAuthenticated = false;
        },

        resetEmailState: (state) => {
            state.emailSending = false;
            state.emailSent = false;
            state.emailError = null;
        }
    },
    extraReducers: (builder) => {

        builder
            .addCase(createStoryWithEmail.pending, (state) => {
                state.loading = true;
                state.emailSending = true;
                state.error = null;
                state.emailError = null;
                state.success = false;
                state.emailSent = false;
            })
            .addCase(createStoryWithEmail.fulfilled, (state, action) => {
                state.loading = false;
                state.emailSending = false;
                state.success = true;
                state.emailSent = action.payload.emailSent;
                state.storyId = action.payload.story.id || action.payload.story._id;
                state.error = null;
                state.emailError = null;


                state.name = '';
                state.category = '';
                state.content = '';
                state.imageUrl = '';
                state.createdAt = new Date().toISOString();
            })
            .addCase(createStoryWithEmail.rejected, (state, action) => {
                state.loading = false;
                state.emailSending = false;
                state.success = false;
                state.emailSent = false;
                state.error = action.payload as string;

                if (action.payload?.toString().includes('authentication') ||
                    action.payload?.toString().includes('token') ||
                    action.payload?.toString().includes('unauthorized')) {
                    state.isAuthenticated = false;
                }
            });


        builder
            .addCase(sendStoryConfirmationEmail.pending, (state) => {
                state.emailSending = true;
                state.emailError = null;
            })
            .addCase(sendStoryConfirmationEmail.fulfilled, (state) => {
                state.emailSending = false;
                state.emailSent = true;
                state.emailError = null;
            })
            .addCase(sendStoryConfirmationEmail.rejected, (state, action) => {
                state.emailSending = false;
                state.emailSent = false;
                state.emailError = action.payload as string;
            });


        builder
            .addCase(createStoryRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createStoryRequest.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = null;
                state.storyId = action.payload.id || action.payload._id;


                state.name = '';
                state.category = '';
                state.content = '';
                state.imageUrl = '';
                state.createdAt = new Date().toISOString();
            })
            .addCase(createStoryRequest.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload as string;

                if (action.payload?.toString().includes('authentication') ||
                    action.payload?.toString().includes('token') ||
                    action.payload?.toString().includes('unauthorized')) {
                    state.isAuthenticated = false;
                }
            });
    }
});

export const {
    clearForm,
    updateFormField,
    clearError,
    resetSuccess,
    updateCreatedAt,
    setUserFromToken,
    clearAuthentication,
    resetEmailState
} = startWritingSlice.actions;

export const startWritingReducer = startWritingSlice.reducer;
export default startWritingSlice.reducer;