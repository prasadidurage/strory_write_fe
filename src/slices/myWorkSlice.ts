


import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { backendApi } from '../api.ts';

interface Story {
    id: string;
    name: string;
    category: string;
    author: string;
    authorEmail: string;
    content: string;
    imageUrl: string;
    createdAt: Date;
}

interface UserStoriesResponse {
    stories: Story[];
    count: number;
    userEmail: string;
}

interface UpdateStoryPayload {
    name: string;
    category: string;
    content: string;
    imageUrl: string;
}

interface MyWorkState {
    stories: Story[];
    loading: boolean;
    error: string;
    userEmail: string;
    selectedStory: Story | null;
    editingStory: Story | null;
    updateData: UpdateStoryPayload;
    isUpdating: boolean;
}

const initialState: MyWorkState = {
    stories: [],
    loading: true,
    error: '',
    userEmail: '',
    selectedStory: null,
    editingStory: null,
    updateData: {
        name: '',
        category: '',
        content: '',
        imageUrl: ''
    },
    isUpdating: false
};


export const loadUserStories = createAsyncThunk(
    'myWork/loadUserStories',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Please login to view your stories');
            }

            const userInfoString = localStorage.getItem('userInfo');
            if (!userInfoString) {
                throw new Error('User information not found. Please login again.');
            }

            const userInfo = JSON.parse(userInfoString);
            const email = userInfo.email;

            if (!email) {
                throw new Error('Email not found in user information. Please login again.');
            }

            const response = await backendApi.get('/story/my-stories');
            const data: UserStoriesResponse = response.data;

            return {
                stories: data.stories,
                userEmail: email
            };
        } catch (err: any) {
            console.error('Error loading user stories:', err);
            if (err.response?.status === 401) {
                return rejectWithValue('Session expired. Please login again.');
            }
            return rejectWithValue(err.response?.data?.error || err.message || 'Failed to load your stories');
        }
    }
);

export const deleteStory = createAsyncThunk(
    'myWork/deleteStory',
    async (storyId: string, { rejectWithValue }) => {
        try {

            if (!storyId || storyId.trim() === '') {
                throw new Error('Story ID is required');
            }

            console.log('Deleting story with ID:', storyId);
            await backendApi.delete(`/story/delete/${storyId}`);
            return storyId;
        } catch (err: any) {
            console.error('Error deleting story:', err);
            return rejectWithValue(err.response?.data?.error || err.message || 'Failed to delete story');
        }
    }
);

export const updateStory = createAsyncThunk(
    'myWork/updateStory',
    async ({ storyId, updateData }: { storyId: string; updateData: UpdateStoryPayload }, { rejectWithValue, getState }) => {
        try {

            if (!storyId || storyId.trim() === '') {
                throw new Error('Story ID is required for update');
            }

            if (!updateData.name.trim()) {
                throw new Error('Story name is required');
            }
            if (!updateData.content.trim()) {
                throw new Error('Story content is required');
            }
            if (!updateData.category.trim()) {
                throw new Error('Story category is required');
            }

            console.log('Updating story with ID:', storyId);
            console.log('Update data:', updateData);

            const response = await backendApi.put(`/story/update/${storyId}`, {
                name: updateData.name.trim(),
                category: updateData.category.trim(),
                content: updateData.content.trim(),
                imageUrl: updateData.imageUrl.trim() || null
            });

            console.log('Update response:', response.data);


            let updatedStory: Story;

            if (response.data && response.data.story) {

                updatedStory = response.data.story;
            } else if (response.data && response.data.id) {

                updatedStory = response.data;
            } else {

                const state = getState() as any;
                const currentStory = state.myWork.editingStory;

                updatedStory = {
                    ...currentStory,
                    name: updateData.name.trim(),
                    category: updateData.category.trim(),
                    content: updateData.content.trim(),
                    imageUrl: updateData.imageUrl.trim() || currentStory.imageUrl,

                    id: storyId,
                    author: currentStory.author,
                    authorEmail: currentStory.authorEmail,
                    createdAt: currentStory.createdAt
                };
            }


            if (!updatedStory.id) {
                updatedStory.id = storyId;
            }

            console.log('Final updated story:', updatedStory);
            return updatedStory;

        } catch (err: any) {
            console.error('Error updating story:', err);
            return rejectWithValue(err.response?.data?.error || err.message || 'Failed to update story');
        }
    }
);

const myWorkSlice = createSlice({
    name: 'myWork',
    initialState,
    reducers: {
        setSelectedStory: (state, action: PayloadAction<Story | null>) => {
            state.selectedStory = action.payload;
        },
        setEditingStory: (state, action: PayloadAction<Story | null>) => {
            state.editingStory = action.payload;
            if (action.payload) {
                console.log('Setting editing story:', action.payload);
                state.updateData = {
                    name: action.payload.name,
                    category: action.payload.category,
                    content: action.payload.content,
                    imageUrl: action.payload.imageUrl || ''
                };
            } else {
                state.updateData = {
                    name: '',
                    category: '',
                    content: '',
                    imageUrl: ''
                };
            }
        },
        setUpdateData: (state, action: PayloadAction<Partial<UpdateStoryPayload>>) => {
            state.updateData = { ...state.updateData, ...action.payload };
        },
        clearError: (state) => {
            state.error = '';
        },
        resetState: (state) => {
            state.selectedStory = null;
            state.editingStory = null;
            state.updateData = {
                name: '',
                category: '',
                content: '',
                imageUrl: ''
            };
            state.error = '';
        }
    },
    extraReducers: (builder) => {
        builder

            .addCase(loadUserStories.pending, (state) => {
                state.loading = true;
                state.error = '';
            })
            .addCase(loadUserStories.fulfilled, (state, action) => {
                state.loading = false;
                state.stories = action.payload.stories;
                state.userEmail = action.payload.userEmail;
            })
            .addCase(loadUserStories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(deleteStory.pending, (state) => {
                state.error = '';
            })
            .addCase(deleteStory.fulfilled, (state, action) => {
                state.stories = state.stories.filter(story => story.id !== action.payload);
            })
            .addCase(deleteStory.rejected, (state, action) => {
                state.error = action.payload as string;
            })

            .addCase(updateStory.pending, (state) => {
                state.isUpdating = true;
                state.error = '';
            })
            .addCase(updateStory.fulfilled, (state, action) => {
                state.isUpdating = false;
                const updatedStory = action.payload;


                if (updatedStory && updatedStory.id) {
                    state.stories = state.stories.map(story =>
                        story.id === updatedStory.id ? updatedStory : story
                    );
                } else {
                    console.error('Updated story is missing id:', updatedStory);
                }

                state.editingStory = null;
                state.updateData = {
                    name: '',
                    category: '',
                    content: '',
                    imageUrl: ''
                };
            })
            .addCase(updateStory.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = action.payload as string;
            });
    }
});

export const {
    setSelectedStory,
    setEditingStory,
    setUpdateData,
    clearError,
    resetState
} = myWorkSlice.actions;

export default myWorkSlice.reducer;