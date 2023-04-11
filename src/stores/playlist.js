import { createSlice } from "@reduxjs/toolkit";


export const playlistSlice = createSlice({
    name : 'playlist',
    initialState : {
        playlist : []
    },
    reducers : {
        setPlaylist : (state, action) => {
            state.playlist = action.payload
        }
    }
})

export const { setPlaylist } = playlistSlice.actions

export default playlistSlice.reducer