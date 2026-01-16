# Case Management System - Backend API

A Node.js/Express backend API for managing cases with MongoDB database and real-time updates using Socket.IO.

## 🔐 Environment Variables Setup

This project uses environment variables to keep sensitive information like database credentials secure.

### Setup Instructions

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit the `.env` file with your actual credentials:**
   ```bash
   # MongoDB Configuration
   MONGODB_URI=your-actual-mongodb-connection-string
   
   # Session Configuration
   SESSION_SECRET=your-secure-random-secret-key
   
   # Server Configuration
   PORT=4000
   
   # Frontend URL
   FRONTEND_URL=http://localhost:3002
   ```

3. **Important Notes:**
   - **Never commit the `.env` file to version control** (it's already in `.gitignore`)
   - The `.env.example` file is a template and should be committed to git
   - Generate a strong random string for `SESSION_SECRET` in production
   - Update `MONGODB_URI` with your actual MongoDB connection string

### Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string with credentials | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `SESSION_SECRET` | Secret key for session encryption | `your-random-secret-key-here` |
| `PORT` | Port number for the server | `4000` |
| `FRONTEND_URL` | URL of the frontend application for CORS | `http://localhost:3002` |

## 📦 Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables** (see above)

3. **Start the development server:**
   ```bash
   npm start
   ```

   Or for production:
   ```bash
   npm run start-server
   ```

## 🚀 API Endpoints

- `GET /api/health` - Health check endpoint
- `GET /api/cases` - Get all cases
- `POST /api/cases` - Create a new case
- `PUT /api/cases/:id` - Update a case
- `DELETE /api/cases/:id` - Delete a case

## 🔒 Security Best Practices

1. ✅ Environment variables are stored in `.env` file (not committed to git)
2. ✅ `.env` is listed in `.gitignore`
3. ✅ `.env.example` provides a template for other developers
4. ✅ Sensitive data is never hardcoded in source files

## 🛠️ Technologies Used

- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Socket.IO** - Real-time communication
- **dotenv** - Environment variable management
- **express-session** - Session management
- **multer** - File upload handling

## 📝 License

ISC

