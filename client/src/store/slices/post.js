import { createSlice } from "@reduxjs/toolkit";

export const postsSlice = createSlice({
	name: "posts",
	initialState: {
		posts: [],
		comments: [],
		post: null,
	},
	reducers: {
		setPosts: (state, action) => {
			state.posts = action.payload;
		},
		setPost: (state, action) => {
			state.post = action.payload;
		},
		setComments: (state, action) => {
			state.comments = action.payload;
		},
	},
});

export const { setPosts, setPost, setComments } = postsSlice.actions;

export default postsSlice.reducer;
