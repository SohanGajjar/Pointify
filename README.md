# Pointify - Points Management System

A modern full-stack application built with React Native (Expo) and Node.js for managing user points and activities.

## 🏗️ Project Structure

```
Pointify-2/
├── Backend/                    # Node.js API Server
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   ├── controllers/       # Route controllers
│   │   ├── middleware/        # Custom middleware
│   │   ├── models/           # Database models
│   │   ├── routes/           # API routes
│   │   ├── utils/            # Utility functions
│   │   ├── app.js            # Express app configuration
│   │   └── server.js         # Server entry point
│   ├── env.example           # Environment variables template
│   └── package.json
│
└── Frontend/                  # React Native (Expo) App
    └── pointify/
        ├── src/
        │   ├── config/       # App configuration
        │   ├── services/     # API services
        │   └── types/        # TypeScript types
        ├── app/              # Expo Router pages
        ├── components/       # Reusable components
        ├── screens/          # Screen components
        └── package.json
```

## 🚀 Features

- **Authentication System**
  - User registration and login
  - JWT token-based authentication
  - Persistent login sessions
  - Secure password hashing

- **User Dashboard**
  - Personalized welcome screen
  - Points tracking
  - Activity history
  - User statistics

- **Security Features**
  - Rate limiting
  - CORS protection
  - Helmet security headers
  - Input validation
  - Error handling

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (with in-memory fallback)
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security middleware
- **Express Rate Limit** - Rate limiting

### Frontend
- **React Native** - Mobile framework
- **Expo** - Development platform
- **TypeScript** - Type safety
- **Expo Router** - Navigation
- **AsyncStorage** - Local storage

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (for mobile development)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp env.example .env
   ```

4. Update environment variables in `.env`:
   ```env
   PORT=3000
   NODE_ENV=development
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd Frontend/pointify
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run web    # For web development
   npm run ios    # For iOS simulator
   npm run android # For Android emulator
   ```

## 🔧 API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/verify` - Token verification

### Health Check
- `GET /api/v1/health` - API health status

## 🏃‍♂️ Development

### Backend Development
```bash
cd Backend
npm run dev          # Start development server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
npm test             # Run tests
```

### Frontend Development
```bash
cd Frontend/pointify
npm run web          # Start web development
npm run ios          # Start iOS development
npm run android      # Start Android development
npm run lint         # Run ESLint
```

## 🧪 Testing

### Backend Testing
```bash
cd Backend
npm test             # Run all tests
npm run test:watch   # Run tests in watch mode
```

## 📱 Mobile Development

The app supports multiple platforms:
- **Web** - Runs in browser
- **iOS** - iOS simulator/device
- **Android** - Android emulator/device

## 🔒 Security

- JWT tokens for authentication
- Password hashing with bcrypt
- Rate limiting to prevent abuse
- CORS protection
- Input validation and sanitization
- Error handling without sensitive data exposure

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Build the application
3. Deploy to your preferred platform (Heroku, AWS, etc.)

### Frontend Deployment
1. Build for production:
   ```bash
   npm run build
   ```
2. Deploy to Expo or build native apps

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue in the GitHub repository or contact the development team.

## 🔄 Version History

- **v1.0.0** - Initial release with authentication and basic dashboard 