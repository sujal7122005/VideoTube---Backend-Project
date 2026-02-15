<div align="center">
  
# 🎬 VideoTube Backend

### A Professional YouTube-like Video Streaming Platform API

[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v9-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media%20Storage-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com/)

**A production-ready RESTful API for video sharing, social engagement, and content management**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [API Documentation](#-api-documentation) • [Database Schema](#-database-schema)

</div>

---

## 📖 Overview

**VideoTube** is a comprehensive backend API that powers a video-sharing platform similar to YouTube. It provides robust features for user authentication, video management, social interactions (likes, comments, subscriptions), playlists, and a Twitter-like tweet system. Built with modern technologies and best practices, this API is designed to be scalable, secure, and production-ready.

### 🎯 Key Highlights

- **Complete Authentication System** - JWT-based access & refresh tokens with secure cookie handling
- **Video Management** - Upload, stream, and manage videos with Cloudinary integration
- **Social Features** - Subscriptions, likes, comments, and watch history
- **Content Organization** - Playlists and user channels
- **Tweet System** - Twitter-like microblogging functionality
- **RESTful Architecture** - Clean, predictable API endpoints
- **Production Ready** - Error handling, pagination, and security best practices

---

## ✨ Features

### 👤 User Management

- User registration with avatar and cover image upload
- Secure login with JWT access & refresh tokens
- Password hashing with bcrypt
- Token refresh mechanism
- Profile update (details, avatar, cover image)
- Channel profile with subscriber statistics
- Watch history tracking

### 📹 Video Features

- Video upload with thumbnail support
- Cloudinary cloud storage integration
- Video publish/unpublish toggle
- Search videos with pagination
- Filter by user/channel
- View count tracking

### 💬 Social Engagement

- **Comments** - Add, edit, delete comments on videos
- **Likes** - Like/unlike videos, tweets, and comments
- **Subscriptions** - Subscribe/unsubscribe to channels
- **Watch History** - Track viewed videos

### 📋 Playlists

- Create and manage playlists
- Add/remove videos from playlists
- Get user's playlists
- Update playlist details

### 🐦 Tweets

- Create, edit, delete tweets (280 char limit)
- Get user's tweets
- Like tweets

---

## 🛠 Tech Stack

| Category             | Technology                |
| -------------------- | ------------------------- |
| **Runtime**          | Node.js                   |
| **Framework**        | Express.js v5             |
| **Database**         | MongoDB with Mongoose ODM |
| **Authentication**   | JWT (JSON Web Tokens)     |
| **Password Hashing** | bcrypt                    |
| **File Upload**      | Multer                    |
| **Cloud Storage**    | Cloudinary                |
| **Environment**      | dotenv                    |
| **CORS**             | cors                      |
| **Dev Tools**        | Nodemon, Prettier         |

---

## 📁 Project Structure

```
videotube/
├── public/
│   └── uploads/              # Temporary file uploads
├── src/
│   ├── controllers/          # Route handlers & business logic
│   │   ├── comment.controllers.js
│   │   ├── healthcheck.controllers.js
│   │   ├── like.controllers.js
│   │   ├── playlist.controllers.js
│   │   ├── subscription.controllers.js
│   │   ├── tweet.controllers.js
│   │   ├── user.controllers.js
│   │   └── video.controllers.js
│   ├── db/
│   │   └── index.js          # MongoDB connection
│   ├── middlewares/
│   │   ├── auth.middlewares.js    # JWT authentication
│   │   └── multer.middleware.js   # File upload handling
│   ├── models/               # MongoDB schemas
│   │   ├── comment.models.js
│   │   ├── like.models.js
│   │   ├── playlist.models.js
│   │   ├── subscriptions.models.js
│   │   ├── tweet.models.js
│   │   ├── users.models.js
│   │   └── videos.models.js
│   ├── routes/               # API routes
│   │   ├── comment.routes.js
│   │   ├── healthcheck.routes.js
│   │   ├── like.routes.js
│   │   ├── playlist.routes.js
│   │   ├── subscription.routes.js
│   │   ├── tweet.routes.js
│   │   ├── user.routes.js
│   │   └── video.routes.js
│   ├── utils/                # Helper utilities
│   │   ├── ApiErrors.js      # Custom error class
│   │   ├── ApiResponse.js    # Standardized API response
│   │   ├── async_Handler.js  # Async error wrapper
│   │   └── cloudinary.js     # Cloudinary upload utilities
│   ├── app.js                # Express app configuration
│   ├── constants.js          # App constants
│   └── index.js              # Server entry point
├── .env                      # Environment variables
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Installation

### Prerequisites

- **Node.js** v18 or higher
- **MongoDB** (local or Atlas cloud)
- **Cloudinary Account** (for media storage)

### Step-by-Step Setup

#### 1. Clone the repository

```bash
git clone https://github.com/sujal7122005/VideoTube---Backend-Project.git
cd VideoTube---Backend-Project
```

#### 2. Install dependencies

```bash
npm install
```

#### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=8000
CORS_ORIGIN=*

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017

# JWT Configuration
JWT_ACCESS_TOKEN_SECRET=your_access_token_secret_key
JWT_REFRESH_TOKEN_SECRET=your_refresh_token_secret_key
ACCESS_TOKEN_EXPIRES=1d
REFRESH_TOKEN_EXPIRES=10d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### 4. Start the server

**Development mode (with hot reload):**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

The server will start at `http://localhost:8000`

---

## 📚 API Documentation

### Base URL

```
http://localhost:8000/api/v1
```

### Authentication

Most endpoints require JWT authentication. Include the token in:

- **Cookie**: `accessToken=<your_token>`
- **Header**: `Authorization: Bearer <your_token>`

---

### 🏥 Health Check

| Method | Endpoint       | Description      | Auth |
| ------ | -------------- | ---------------- | ---- |
| `GET`  | `/healthcheck` | Check API status | ❌   |

---

### 👤 User & Authentication

| Method  | Endpoint                    | Description                                 | Auth |
| ------- | --------------------------- | ------------------------------------------- | ---- |
| `POST`  | `/users/register`           | Register new user with avatar & cover image | ❌   |
| `POST`  | `/users/login`              | Login with email/username & password        | ❌   |
| `POST`  | `/users/logout`             | Logout current user                         | ✅   |
| `POST`  | `/users/refresh-token`      | Refresh access token                        | ❌   |
| `POST`  | `/users/change-password`    | Change account password                     | ✅   |
| `GET`   | `/users/current-user`       | Get current user details                    | ✅   |
| `PATCH` | `/users/update-details`     | Update profile information                  | ✅   |
| `PATCH` | `/users/update-avatar`      | Update avatar image                         | ✅   |
| `PATCH` | `/users/update-cover-image` | Update cover image                          | ✅   |
| `GET`   | `/users/channel/:username`  | Get channel profile                         | ✅   |
| `GET`   | `/users/user-watch-history` | Get watch history                           | ✅   |

#### Register User - Example Request

```http
POST /api/v1/users/register
Content-Type: multipart/form-data

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "securePassword123",
  "avatar": <file>,
  "coverImage": <file>
}
```

---

### 📹 Videos

| Method   | Endpoint                              | Description                               | Auth |
| -------- | ------------------------------------- | ----------------------------------------- | ---- |
| `GET`    | `/videos`                             | Get all videos (with search & pagination) | ✅   |
| `POST`   | `/videos/publish`                     | Upload and publish video                  | ✅   |
| `GET`    | `/videos/getVideoById/:videoId`       | Get video by ID                           | ✅   |
| `PATCH`  | `/videos/updateVideoDetails/:videoId` | Update video details                      | ✅   |
| `DELETE` | `/videos/deleteVideo/:videoId`        | Delete video                              | ✅   |
| `POST`   | `/videos/toggle-publish/:videoId`     | Toggle publish status                     | ✅   |

#### Publish Video - Example Request

```http
POST /api/v1/videos/publish
Content-Type: multipart/form-data
Authorization: Bearer <access_token>

{
  "title": "My Amazing Video",
  "description": "This is a great video about...",
  "videoFile": <video_file>,
  "thumbnail": <image_file>
}
```

---

### 💬 Comments

| Method   | Endpoint                                | Description          | Auth |
| -------- | --------------------------------------- | -------------------- | ---- |
| `POST`   | `/comments/add-comment/:videoId`        | Add comment to video | ✅   |
| `GET`    | `/comments/get-video-comments/:videoId` | Get video comments   | ✅   |
| `PATCH`  | `/comments/update-comment/:commentId`   | Update comment       | ✅   |
| `DELETE` | `/comments/delete-comment/:commentId`   | Delete comment       | ✅   |

---

### ❤️ Likes

| Method | Endpoint                            | Description          | Auth |
| ------ | ----------------------------------- | -------------------- | ---- |
| `POST` | `/likes/video-like-toggle/:videoId` | Toggle video like    | ✅   |
| `POST` | `/likes/tweet-toggle/:tweetId`      | Toggle tweet like    | ✅   |
| `POST` | `/likes/comment/:commentId/toggle`  | Toggle comment like  | ✅   |
| `GET`  | `/likes/get-liked-videos`           | Get all liked videos | ✅   |

---

### 🐦 Tweets

| Method   | Endpoint                        | Description       | Auth |
| -------- | ------------------------------- | ----------------- | ---- |
| `POST`   | `/tweets/create-tweet`          | Create new tweet  | ✅   |
| `GET`    | `/tweets/:userId`               | Get user's tweets | ✅   |
| `PATCH`  | `/tweets/update-tweet/:tweetId` | Update tweet      | ✅   |
| `DELETE` | `/tweets/delete-tweet/:tweetId` | Delete tweet      | ✅   |

---

### 🔔 Subscriptions

| Method | Endpoint                                           | Description             | Auth |
| ------ | -------------------------------------------------- | ----------------------- | ---- |
| `POST` | `/subscriptions/toggle-subscription/:channelId`    | Toggle subscription     | ✅   |
| `GET`  | `/subscriptions/subscribers/:channelId`            | Get channel subscribers | ✅   |
| `GET`  | `/subscriptions/subscribed-channels/:subscriberId` | Get subscribed channels | ✅   |

---

### 📋 Playlists

| Method   | Endpoint                                                | Description                | Auth |
| -------- | ------------------------------------------------------- | -------------------------- | ---- |
| `POST`   | `/playlists/create-playlist`                            | Create playlist            | ✅   |
| `GET`    | `/playlists/user-playlists/:userId`                     | Get user's playlists       | ✅   |
| `GET`    | `/playlists/get-playlist-by-Id/:playlistId`             | Get playlist by ID         | ✅   |
| `POST`   | `/playlists/playlist/:playlistId/add-video/:videoId`    | Add video to playlist      | ✅   |
| `DELETE` | `/playlists/playlist/:playlistId/remove-video/:videoId` | Remove video from playlist | ✅   |
| `PATCH`  | `/playlists/update-playlist/:playlistId`                | Update playlist            | ✅   |
| `DELETE` | `/playlists/delete-playlist/:playlistId`                | Delete playlist            | ✅   |

---

## 🗄 Database Schema

### Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    User     │       │    Video    │       │   Comment   │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ _id         │◄──────│ owner       │   ┌──►│ _id         │
│ username    │       │ _id         │◄──┘   │ content     │
│ email       │       │ title       │       │ commentedBy │──►User
│ fullName    │       │ description │       │ video       │──►Video
│ password    │       │ videoFile   │       │ createdAt   │
│ avatar      │       │ thumbnail   │       └─────────────┘
│ coverImage  │       │ views       │
│ watchHistory│──────►│ ispublished │       ┌─────────────┐
│ refreshToken│       │ createdAt   │       │    Like     │
│ createdAt   │       └─────────────┘       ├─────────────┤
└─────────────┘                             │ _id         │
      ▲                                     │ likedBy     │──►User
      │         ┌─────────────┐             │ video       │──►Video
      │         │Subscription │             │ tweet       │──►Tweet
      │         ├─────────────┤             │ comment     │──►Comment
      └─────────│ subscribers │             └─────────────┘
                │ subscribedTo│
                │ createdAt   │             ┌─────────────┐
                └─────────────┘             │   Playlist  │
                                            ├─────────────┤
┌─────────────┐                             │ _id         │
│    Tweet    │                             │ name        │
├─────────────┤                             │ description │
│ _id         │                             │ videos      │──►[Video]
│ content     │                             │ owner       │──►User
│ tweetedBy   │──►User                      │ createdAt   │
│ createdAt   │                             └─────────────┘
└─────────────┘
```

### Models Overview

| Model            | Description                     | Key Fields                                                          |
| ---------------- | ------------------------------- | ------------------------------------------------------------------- |
| **User**         | User accounts & authentication  | username, email, password, avatar, coverImage, watchHistory         |
| **Video**        | Video content                   | title, description, videoFile, thumbnail, views, owner, ispublished |
| **Comment**      | Video comments                  | content, commentedBy, video                                         |
| **Like**         | Likes on videos/tweets/comments | likedBy, video, tweet, comment                                      |
| **Subscription** | Channel subscriptions           | subscribers, subscribedTo                                           |
| **Playlist**     | Video playlists                 | name, description, videos, owner                                    |
| **Tweet**        | Microblog posts (280 chars)     | content, tweetedBy                                                  |

---

## 🔐 Security Features

- **Password Hashing**: All passwords are hashed using bcrypt with salt rounds
- **JWT Authentication**: Secure token-based authentication with access & refresh tokens
- **HTTP-Only Cookies**: Tokens stored in secure, HTTP-only cookies
- **Input Validation**: Request validation on all endpoints
- **CORS Configuration**: Configurable cross-origin resource sharing
- **Error Handling**: Centralized error handling with custom error classes

---

## 📝 API Response Format

### Success Response

```json
{
  "statuscode": 200,
  "message": "Success message",
  "data": { ... },
  "Success": true
}
```

### Error Response

```json
{
  "statuscode": 400,
  "message": "Error message",
  "data": null,
  "Success": false,
  "error": []
}
```

---

## 🧪 Testing the API

You can test the API using:

- **Postman**: Import the collection and set the `baseURL` variable



---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

**Sujal**

- GitHub: [@sujal7122005](https://github.com/sujal7122005)

---

## 🙏 Acknowledgments

- Inspired by YouTube's backend architecture
- Built following best practices from the Node.js community
- Thanks to all open-source contributors whose libraries made this possible

---

<div align="center">

**⭐ If you found this project helpful, please give it a star!**

Made with ❤️ by Sujal

</div>
