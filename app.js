const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);

// Load environment variables from .env file
require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;
const SESSION_SECRET = process.env.SESSION_SECRET || "secret-key";
const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3002";

const store = new MongoStore({
  uri: MONGODB_URI,
  collection: "sessions",
});
// const mongoConnect = require("./util/database").mongoConnect;
const mongoose = require("mongoose");
const casesRoutes = require("./routes/cases");
const socket = require("./socket");
const app = express();

// Middleware
app.use(
  cors({
    origin: FRONTEND_URL, // Your React app URL
    credentials: true, // Allow cookies to be sent
  })
); // Enable CORS for React frontend
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false, // Don't save uninitialized sessions
    cookie: {
      secure: false, // Set to true if using HTTPS
      httpOnly: true,
      maxAge: 1000 * 30 * 60 * 60 * 24, // 30 days (1000ms * 30 * 60 * 60 * 24)
      sameSite: "lax",
    },
    store: store,
  })
);

// API Routes
app.use("/api/cases", casesRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

// Error handling for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: error.message,
  });
});

// Connect to MongoDB and start server
// mongoConnect(() => {
//   app.listen(4000, () => {
//     console.log("Server is running on http://localhost:4000");
//     console.log("API endpoint: http://localhost:4000/api/cases");
//   });
// });

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
    socket.init(server);
  })
  .catch((err) => {
    console.log(err);
  });
