import { configureStore } from "@reduxjs/toolkit";
import playerReducer from "./player"
import playlistReducer from "./playlist"
import createdPlaylistReducer from "./createdPlaylist"
import searchStringReducer from "./searchString"

export default configureStore({
    reducer : {
        player : playerReducer,
        playlist : playlistReducer,
        createdPlaylist : createdPlaylistReducer,
        searchString : searchStringReducer,
    }
})