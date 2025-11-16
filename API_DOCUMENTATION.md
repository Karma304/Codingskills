# StoryVerse API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### User Management

#### Register User
```http
POST /users/register
```

**Request Body:**
```json
{
  "username": "string (required)",
  "email": "string (required)",
  "password": "string (required, min 6 chars)",
  "preferences": {
    "genres": ["Fantasy", "Sci-Fi"],
    "writingStyle": "descriptive",
    "tone": "emotional"
  }
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "preferences": {}
  },
  "token": "jwt_token_here"
}
```

#### Login
```http
POST /users/login
```

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com"
  },
  "token": "jwt_token_here"
}
```

#### Get Profile
```http
GET /users/profile
```

**Headers:** Requires authentication

**Response:**
```json
{
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "preferences": {},
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Update Preferences
```http
PUT /users/preferences
```

**Headers:** Requires authentication

**Request Body:**
```json
{
  "preferences": {
    "genres": ["Fantasy", "Romance"],
    "writingStyle": "poetic",
    "notifications": true
  }
}
```

---

### Story Management

#### Create Story
```http
POST /stories
```

**Headers:** Requires authentication

**Request Body:**
```json
{
  "title": "string (required)",
  "description": "string (optional)",
  "genre": "string (optional)",
  "setting": "string (optional)",
  "characters": ["array of strings (optional)"],
  "content": "string (required)",
  "status": "draft | published (default: draft)"
}
```

**Response:**
```json
{
  "message": "Story created successfully",
  "story": {
    "id": 1,
    "title": "My Epic Tale",
    "description": "An adventure story",
    "genre": "Fantasy",
    "content": "Once upon a time...",
    "status": "draft",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Get All Stories
```http
GET /stories?limit=20&offset=0&genre=Fantasy
```

**Query Parameters:**
- `limit`: Number of results (default: 20)
- `offset`: Pagination offset (default: 0)
- `genre`: Filter by genre (optional)

**Response:**
```json
{
  "stories": [
    {
      "id": 1,
      "title": "Story Title",
      "description": "Description",
      "genre": "Fantasy",
      "author_username": "johndoe",
      "likes_count": "5",
      "comments_count": "3",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

#### Get Story by ID
```http
GET /stories/:id
```

**Response:**
```json
{
  "story": {
    "id": 1,
    "title": "Story Title",
    "description": "Description",
    "content": "Full story content...",
    "genre": "Fantasy",
    "setting": "Medieval kingdom",
    "characters": ["Hero", "Villain"],
    "author_username": "johndoe",
    "likes_count": "5",
    "comments_count": "3",
    "status": "published",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Get My Stories
```http
GET /stories/my-stories
```

**Headers:** Requires authentication

**Response:**
```json
{
  "stories": [
    {
      "id": 1,
      "title": "My Story",
      "description": "Description",
      "status": "draft",
      "likes_count": "0",
      "comments_count": "0",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

#### Update Story
```http
PUT /stories/:id
```

**Headers:** Requires authentication

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "content": "Updated content",
  "status": "published"
}
```

**Response:**
```json
{
  "message": "Story updated successfully",
  "story": {
    "id": 1,
    "title": "Updated Title",
    "updated_at": "2024-01-01T12:00:00.000Z"
  }
}
```

#### Delete Story
```http
DELETE /stories/:id
```

**Headers:** Requires authentication

**Response:**
```json
{
  "message": "Story deleted successfully"
}
```

---

### Chapter Management

#### Add Chapter
```http
POST /stories/:id/chapters
```

**Headers:** Requires authentication

**Request Body:**
```json
{
  "title": "string (required)",
  "content": "string (required)",
  "orderIndex": "number (required)"
}
```

**Response:**
```json
{
  "message": "Chapter added successfully",
  "chapter": {
    "id": 1,
    "story_id": 1,
    "title": "Chapter 1",
    "content": "Chapter content...",
    "order_index": 1
  }
}
```

#### Get Chapters
```http
GET /stories/:id/chapters
```

**Response:**
```json
{
  "chapters": [
    {
      "id": 1,
      "story_id": 1,
      "title": "Chapter 1",
      "content": "Content...",
      "order_index": 1,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

### Social Features

#### Like Story
```http
POST /stories/:id/like
```

**Headers:** Requires authentication

**Response:**
```json
{
  "message": "Story liked successfully",
  "like": {
    "id": 1,
    "user_id": 1,
    "story_id": 1
  }
}
```

#### Unlike Story
```http
DELETE /stories/:id/like
```

**Headers:** Requires authentication

**Response:**
```json
{
  "message": "Story unliked successfully"
}
```

#### Add Comment
```http
POST /stories/:id/comments
```

**Headers:** Requires authentication

**Request Body:**
```json
{
  "content": "string (required)"
}
```

**Response:**
```json
{
  "message": "Comment added successfully",
  "comment": {
    "id": 1,
    "user_id": 1,
    "story_id": 1,
    "content": "Great story!",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Get Comments
```http
GET /stories/:id/comments
```

**Response:**
```json
{
  "comments": [
    {
      "id": 1,
      "user_id": 1,
      "username": "johndoe",
      "story_id": 1,
      "content": "Great story!",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

### AI Features

#### Generate Story
```http
POST /ai/generate-story
```

**Headers:** Requires authentication

**Request Body:**
```json
{
  "genre": "string (required)",
  "setting": "string (required)",
  "characters": ["array of strings (optional)"],
  "conflict": "string (optional)",
  "length": "short | medium | long (default: medium)",
  "style": "descriptive | dialogue-heavy | action-packed | poetic | humorous | dark",
  "tone": "neutral | emotional | suspenseful | lighthearted | serious | edgy",
  "plotTwist": "boolean (default: false)"
}
```

**Response:**
```json
{
  "message": "Story generated successfully",
  "content": "Generated story text...",
  "metadata": {
    "genre": "Fantasy",
    "setting": "Medieval kingdom",
    "characters": ["Hero", "Villain"],
    "style": "descriptive",
    "tone": "emotional"
  }
}
```

#### Enhance Story
```http
POST /ai/enhance-story
```

**Headers:** Requires authentication

**Request Body:**
```json
{
  "content": "string (required)",
  "enhancement": "more-dramatic | more-dialogue | more-description | add-twist | darker | lighter | faster-pace | slower-pace"
}
```

**Response:**
```json
{
  "message": "Story enhanced successfully",
  "content": "Enhanced story content..."
}
```

#### Generate Character
```http
POST /ai/generate-character
```

**Headers:** Requires authentication

**Request Body:**
```json
{
  "name": "string (optional)",
  "role": "string (optional)",
  "personality": "string (optional)",
  "background": "string (optional)"
}
```

**Response:**
```json
{
  "message": "Character generated successfully",
  "character": {
    "name": "Character Name",
    "age": "25",
    "appearance": "Physical description...",
    "personality": "Personality traits...",
    "background": "Character backstory...",
    "motivations": "What drives them...",
    "strengths": "Their strengths...",
    "weaknesses": "Their weaknesses..."
  }
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "error": "Access token required"
}
```

### 403 Forbidden
```json
{
  "error": "Invalid or expired token"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 409 Conflict
```json
{
  "error": "Resource already exists"
}
```

### 500 Internal Server Error
```json
{
  "error": "Something went wrong!"
}
```

---

## Rate Limiting

Rate limiting is not currently implemented but is recommended for production:
- 100 requests per 15 minutes per IP
- 1000 AI generations per day per user

## Best Practices

1. Always include error handling in your client code
2. Store JWT tokens securely (use AsyncStorage on mobile)
3. Refresh tokens before they expire
4. Validate input on both client and server
5. Use HTTPS in production
6. Implement pagination for large datasets
7. Cache frequently accessed data
8. Monitor AI API usage and costs