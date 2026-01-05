
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { backendApi } from "../api.ts";

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

interface StoryState {
    stories: Story[];
    currentStory: Story | null;
    loading: boolean;
    error: string | null;
    deleteLoading: boolean;
    deleteError: string | null;
}

const initialState: StoryState = {
    stories: [],
    currentStory: null,
    loading: false,
    error: null,
    deleteLoading: false,
    deleteError: null,
};

export const fetchStoriesByCategory = createAsyncThunk(
    'story/getStories',
    async (categoryName: string) => {
        const encodedCategory = encodeURIComponent(categoryName);
        const response = await backendApi.get(`/story/${encodedCategory}`);
        return response.data;
    }
);

export const fetchStoryById = createAsyncThunk(
    'story/fetchStoryById',
    async (storyId: string, { rejectWithValue }) => {
        try {
            const response = await backendApi.get(`/story/all/${storyId}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.error || 'Failed to fetch story'
            );
        }
    }
);

export const deleteStory = createAsyncThunk(
    'story/deleteStory',
    async (storyId: string, { rejectWithValue }) => {
        try {
            const response = await backendApi.delete(`/story/delete/${storyId}`);
            return { storyId, response: response.data };
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.error || 'Failed to delete story'
            );
        }
    }
);

const storySlice = createSlice({
    name: "story",
    initialState,
    reducers: {
        clearStories: (state) => {
            state.stories = [];
            state.error = null;
        },
        clearCurrentStory: (state) => {
            state.currentStory = null;
            state.error = null;
        },
        clearDeleteError: (state) => {
            state.deleteError = null;
        },
    },
    extraReducers: (builder) => {
        builder

            .addCase(fetchStoriesByCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStoriesByCategory.fulfilled, (state, action: PayloadAction<Story[]>) => {
                state.loading = false;
                state.stories = action.payload;
            })
            .addCase(fetchStoriesByCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })


            .addCase(fetchStoryById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStoryById.fulfilled, (state, action: PayloadAction<Story>) => {
                state.loading = false;
                state.currentStory = action.payload;
            })
            .addCase(fetchStoryById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })


            .addCase(deleteStory.pending, (state) => {
                state.deleteLoading = true;
                state.deleteError = null;
            })
            .addCase(deleteStory.fulfilled, (state, action) => {
                state.deleteLoading = false;
                const { storyId } = action.payload;


                state.stories = state.stories.filter(story => story.id !== storyId);


                if (state.currentStory?.id === storyId) {
                    state.currentStory = null;
                }
            })
            .addCase(deleteStory.rejected, (state, action) => {
                state.deleteLoading = false;
                state.deleteError = action.payload as string;
            });
    },
});

export const { clearStories, clearCurrentStory, clearDeleteError } = storySlice.actions;
export default storySlice.reducer;
