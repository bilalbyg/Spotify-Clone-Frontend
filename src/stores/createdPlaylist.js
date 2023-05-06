import { createSlice } from "@reduxjs/toolkit";


export const createdPlaylistSlice = createSlice({
    name : 'createdPlaylist',
    initialState : {
        createdPlaylist : []
    },
    reducers : {
        setCreatedPlaylist : (state, action) => {
            state.createdPlaylist = action.payload
        }
    }
})

export const { setCreatedPlaylist } = createdPlaylistSlice.actions

export default createdPlaylistSlice.reducer