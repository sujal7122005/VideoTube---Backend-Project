# VideoTube API Documentation

Welcome to the VideoTube API collection. This documentation provides a comprehensive overview of all available endpoints, parameters, authentication methods, and usage examples for the VedioTube API.

---

## Overview

VideoTube is an API designed to support video-related operations. This collection currently contains the health check endpoint, which can be used to verify the availability and status of the VedioTube backend service.

---

## Authentication

No authentication is required for the health check endpoint. For future endpoints, authentication may be required. Common authentication methods in APIs include:

- **Bearer Token**: `Authorization: Bearer`
    
- **API Key**: Passed in headers or query parameters
    

If authentication is added, update your requests accordingly.

---

## Base URL

All endpoints use the `{{baseURL}}` variable. Set this variable to the root URL of your VedioTube backend (e.g., `http://localhost:8000`).

---

## Endpoints

### 1\. Health Check

- **Endpoint:** `GET {{baseURL}}/api/v1/healthcheck`
    
- **Description:** Checks the health and availability of the VedioTube backend service.
    
- **Parameters:** None
    
- **Headers:** None required
    
- **Request Body:** Not applicable
    
- **Response:**
    
    - **Status Code:** 200 OK (if healthy)
        
    - **Body:** Typically a JSON object indicating service status (e.g., `{ "status": "ok" }`)
        
- **Authentication:** Not required
    
- **Example Usage:**
    
    ``` http
        GET {{baseURL}}/api/v1/healthcheck
    
     ```
    

---

## Variables

- `baseURL`: The root URL for the API. Example: `http://localhost:8000`
    

---
Health Check

GET /api/v1/healthcheck
Used to verify API availability and server health.
---
User & Authentication Routes : 

POST /api/v1/users/register
Register a new user with avatar and cover image.

POST /api/v1/users/login
Login user using email or username.

POST /api/v1/users/refresh-token
Generate a new access token using refresh token.

POST /api/v1/users/logout
Logout the currently authenticated user.

POST /api/v1/users/change-password
Change account password.

GET /api/v1/users/current-user
Get details of the logged-in user.

PATCH /api/v1/users/update-details
Update user profile information.

PATCH /api/v1/users/update-avatar
Update user avatar image.

PATCH /api/v1/users/update-cover-image
Update user cover image.

GET /api/v1/users/channel/:username
Get public channel profile of a user.

GET /api/v1/users/user-watch-history
Get watch history of the logged-in user.
---
Video Routes : 

GET /api/v1/videos
Get all videos (supports search using query params).

POST /api/v1/videos/publish
Upload and publish a new video with thumbnail.

GET /api/v1/videos/getVideoById/:videoId
Get video details by video ID.

PATCH /api/v1/videos/updateVideoDetails/:videoId
Update video title, description, or thumbnail.

DELETE /api/v1/videos/deleteVideo/:videoId
Delete a video.

POST /api/v1/videos/toggle-publish/:videoId
Toggle publish/unpublish status of a video.
---

Comment Routes : 

POST /api/v1/comments/add-comment/:videoId
Add a comment to a video.

GET /api/v1/comments/get-video-comments/:videoId
Get all comments for a video.

PATCH /api/v1/comments/update-comment/:commentId
Update a comment.

DELETE /api/v1/comments/delete-comment/:commentId
Delete a comment.
---

Like Routes : 

POST /api/v1/likes/video-like-toggle/:videoId
Like or unlike a video.

POST /api/v1/likes/tweet-toggle/:tweetId
Like or unlike a tweet.

POST /api/v1/likes/comment/:commentId/toggle
Like or unlike a comment.

GET /api/v1/likes/get-liked-videos
Get all videos liked by the user.
---

Tweet Routes : 

POST /api/v1/tweets/create-tweet
Create a new tweet.

GET /api/v1/tweets/:userId
Get all tweets of a user.

PATCH /api/v1/tweets/update-tweet/:tweetId
Update an existing tweet.

DELETE /api/v1/tweets/delete-tweet/:tweetId
Delete a tweet.
---

Subscription Routes : 

POST /api/v1/subscriptions/toggle-subscription/:channelId
Subscribe or unsubscribe from a channel.

GET /api/v1/subscriptions/subscribers/:channelId
Get all subscribers of a channel.

GET /api/v1/subscriptions/subscribed-channels/:subscriberId
Get all channels subscribed by a user.
---
Playlist Routes : 

POST /api/v1/playlists/create-playlist
Create a new playlist.

GET /api/v1/playlists/user-playlists/:userId
Get all playlists created by a user.

GET /api/v1/playlists/get-playlist-by-Id/:playlistId
Get playlist details by ID.

POST /api/v1/playlists/playlist/:playlistId/add-video/:videoId
Add a video to a playlist.

DELETE /api/v1/playlists/playlist/:playlistId/remove-video/:videoId
Remove a video from a playlist.

PATCH /api/v1/playlists/update-playlist/:playlistId
Update playlist details.

DELETE /api/v1/playlists/delete-playlist/:playlistId
Delete a playlist.


