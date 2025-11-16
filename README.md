# StoryVerse - Social Storytelling App

**Arbeitstitel: StoryVerse – Deine Story. Dein Universum. Von dir + AI erschaffen.**

A comprehensive social storytelling platform where users can create, edit, and publish personalized stories with AI assistance. The platform combines AI-powered story creation, writing tools, story publishing, and community engagement features.

## 🎯 Core Concept

StoryVerse is a Social-Storytelling-App that enables users to generate personalized stories, characters, worlds, plots, and even complete books with the help of AI. The platform integrates AI story creation, writing tools, story publishing, and social/community features.

## 🚀 Key Features

### MVP Features (Implemented)

- ✅ **AI Story Generator** - Generate stories with customizable prompts and parameters
- ✅ **Story Editor** - Full-featured editor with chapter structure support
- ✅ **User Profiles** - User authentication and profile management
- ✅ **Publish & Share** - Public story library and sharing capabilities
- ✅ **Social Features** - Likes and comments system

### Advanced Features (Future Development)

- 🔄 Collaborative Writing Mode
- 🔄 AI Character Bible & Lore System
- 🔄 AI Voice & Audio-Drama Generator
- 🔄 Cover Art Generator (AI Images)
- 🔄 Story Series + Season System
- 🔄 Token Rewards for Activity/Quality
- 🔄 Story Analytics (Sentiment, Tension Curve)

## 🛠️ Technology Stack

### Backend
- **Framework**: Node.js with Express
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **AI Integration**: OpenAI API (GPT models)

### Frontend
- **Framework**: React Native (Expo)
- **Navigation**: React Navigation
- **State Management**: Context API
- **Storage**: AsyncStorage

## 📦 Project Structure

```
Codingskills/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth & validation
│   │   ├── config/         # Configuration files
│   │   └── server.js       # Entry point
│   ├── database/
│   │   └── schema.sql      # Database schema
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── screens/        # App screens
│   │   ├── services/       # API services
│   │   ├── contexts/       # React contexts
│   │   └── navigation/     # Navigation setup
│   ├── App.js              # Main app component
│   └── package.json
└── README.md
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn
- Expo CLI (for React Native development)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Configure your environment variables:
   ```
   PORT=3000
   DATABASE_URL=postgresql://user:password@localhost:5432/storyverse
   JWT_SECRET=your_jwt_secret_here
   AI_API_KEY=your_openai_api_key_here
   NODE_ENV=development
   ```

5. Set up the database:
   ```bash
   psql -U postgres -d storyverse -f database/schema.sql
   ```

6. Start the backend server:
   ```bash
   npm run dev
   ```

The backend API will be available at `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update API configuration in `src/services/api.js` if needed

4. Start the Expo development server:
   ```bash
   npm start
   ```

5. Run on your preferred platform:
   - Press `a` for Android
   - Press `i` for iOS
   - Press `w` for web

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (authenticated)
- `PUT /api/users/preferences` - Update user preferences (authenticated)

### Story Endpoints

- `POST /api/stories` - Create a new story (authenticated)
- `GET /api/stories` - Get all published stories
- `GET /api/stories/my-stories` - Get current user's stories (authenticated)
- `GET /api/stories/:id` - Get story by ID
- `PUT /api/stories/:id` - Update story (authenticated)
- `DELETE /api/stories/:id` - Delete story (authenticated)

### Chapter Endpoints

- `POST /api/stories/:id/chapters` - Add chapter to story (authenticated)
- `GET /api/stories/:id/chapters` - Get all chapters for a story

### Social Endpoints

- `POST /api/stories/:id/like` - Like a story (authenticated)
- `DELETE /api/stories/:id/like` - Unlike a story (authenticated)
- `POST /api/stories/:id/comments` - Add comment (authenticated)
- `GET /api/stories/:id/comments` - Get story comments

### AI Endpoints

- `POST /api/ai/generate-story` - Generate story with AI (authenticated)
- `POST /api/ai/enhance-story` - Enhance existing story content (authenticated)
- `POST /api/ai/generate-character` - Generate character profile (authenticated)

## 🎨 User Flow

1. **Onboarding**
   - Select theme interests (Fantasy, Romance, Sci-Fi, Horror, etc.)
   - Choose writing style (humorous, dark, emotional, etc.)

2. **Story Generation**
   - Select genre, setting, characters
   - Define conflicts and goals
   - Choose length and format
   - AI generates the first version
   - Live editing capabilities

3. **Editor & Collaboration**
   - Full-featured editor
   - Chapter management
   - AI rewrite assistance

4. **Publish & Community**
   - Public library
   - Likes and comments
   - Story remixing capabilities

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- SQL injection prevention
- CORS configuration

## 🌟 Unique Selling Points

| Feature | Other Platforms | StoryVerse |
|---------|----------------|------------|
| AI Story Generator | Rare | ✅ |
| AI Character & Lore System | Rare | ✅ |
| Remix Stories | Rare | ✅ (Planned) |
| Gamification | Partial | ✅ (Planned) |
| Audio Transformation | Very Rare | ✅ (Planned) |

## 💰 Monetization (Planned)

- Freemium model (limited story generations)
- Premium subscriptions (more AI tokens, storage, cover art)
- Marketplace for cover artists/voice actors
- Story tipping (creators earn)
- Ads in free mode

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License

## 👥 Authors

StoryVerse Development Team

## 🙏 Acknowledgments

- OpenAI for AI capabilities
- React Native community
- Express.js community
- All contributors and testers
