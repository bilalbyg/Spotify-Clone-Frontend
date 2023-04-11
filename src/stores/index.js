import { configureStore } from "@reduxjs/toolkit";
import playerReducer from "./player"
import playlistReducer from "./playlist"

export default configureStore({
    reducer : {
        player : playerReducer,
        playlist : playlistReducer,
    }
})