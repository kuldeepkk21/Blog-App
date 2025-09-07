import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    allPosts: []
}

const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        setPosts: (state, action) => {
            state.allPosts = action.payload.allPosts;
        },
        addPost: (state, action) => {
            state.allPosts.push(action.payload.post);
        }
    }
})

export const {setPosts, addPost} = postSlice.actions;
export default postSlice.reducer