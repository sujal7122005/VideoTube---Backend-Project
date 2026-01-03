import { Router } from "express";

import { createPlaylist, getUserPlaylists, getPlaylistById, addVideoToPlaylist, removeVideoFromPlaylist, deletePlaylist, updatePlaylist } from "../controllers/playlist.controllers.js";

import { authenticateUser } from "../middlewares/auth.middlewares.js";

const Playlistrouter = Router();

Playlistrouter.route("/create-playlist").post(authenticateUser, createPlaylist);
Playlistrouter.route("/user-playlists/:userId").get(getUserPlaylists);
Playlistrouter.route("/get-playlist-by-Id/:playlistId").get(getPlaylistById);
Playlistrouter.route("/playlist/:playlistId/add-video/:videoId").post(authenticateUser, addVideoToPlaylist);
Playlistrouter.route("/playlist/:playlistId/remove-video/:videoId").delete(authenticateUser, removeVideoFromPlaylist);
Playlistrouter.route("/delete-playlist/:playlistId").delete(authenticateUser, deletePlaylist);
Playlistrouter.route("/update-playlist/:playlistId").patch(authenticateUser, updatePlaylist);

export { Playlistrouter };