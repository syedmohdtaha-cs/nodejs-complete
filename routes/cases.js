const express = require("express");
const router = express.Router();

const casesController = require("../controllers/cases");
const { requireAuth } = require("../middleware/auth");

const { check } = require("express-validator");

const upload = require("../util/multerConfig");

// Public routes (no auth required)
// POST /api/login - Login
router.post("/login", casesController.login);

// GET /api/cases/me - Check if user is logged in
router.get("/me", casesController.isLoggedIn);

// GET /api/files - Get all files
router.get("/files", requireAuth, casesController.getFiles);

// GET /api/files/:id - Get single file
router.get("/files/:id", requireAuth, casesController.getFileById);

// Protected routes (auth required)
// GET /api/cases - Get all cases
router.get("/", requireAuth, casesController.getCases);

// GET /api/cases/:id - Get single case
router.get("/:id", requireAuth, casesController.getCaseById);

// POST /api/cases - Create new case
router.post("/", requireAuth, casesController.createCase);

// PUT /api/cases/:id - Update case
router.put("/:id", requireAuth, casesController.updateCase);

// DELETE /api/cases/:id - Delete case
router.delete("/:id", requireAuth, casesController.deleteCase);

// POST /api/logout - Logout
router.post("/logout", requireAuth, casesController.logout);

// POST /api/signup - Signup
router.post(
  "/signup",
  check("username").isEmail().withMessage("Username must be a valid email"),
  casesController.signUp
);

// POST /api/upload - Upload file
router.post(
  "/upload",
  requireAuth,
  upload.single("file"),
  casesController.uploadFile
);

module.exports = router;
