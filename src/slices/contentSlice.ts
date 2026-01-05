
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { backendApi } from "../api";

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
    storyLoading: boolean;
    error: string | null;
    storyError: string | null;
}

const initialState: StoryState = {
    stories: [],
    currentStory: null,
    loading: false,
    storyLoading: false,
    error: null,
    storyError: null,
};


export const fetchStoriesByCategory = createAsyncThunk(
    'story/getStoriesByCategory',
    async (categoryName: string) => {
        const encodedCategory = encodeURIComponent(categoryName);
        const response = await backendApi.get(`/story/${encodedCategory}`);
        return response.data;
    }
);


export const fetchStoryById = createAsyncThunk(
    'story/getStory',
    async (storyId: string, { rejectWithValue }) => {
        try {
            const response = await backendApi.get<Story>(`/story/all/${storyId}`);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.error || "Failed to fetch story");
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
            state.storyError = null;
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
                state.storyLoading = true;
                state.storyError = null;
            })
            .addCase(fetchStoryById.fulfilled, (state, action: PayloadAction<Story>) => {
                state.storyLoading = false;
                state.currentStory = action.payload;
            })
            .addCase(fetchStoryById.rejected, (state, action) => {
                state.storyLoading = false;
                state.storyError = action.payload as string;
            });
    },
});

export const { clearStories, clearCurrentStory } = storySlice.actions;
export default storySlice.reducer;