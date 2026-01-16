const { Case, User, File } = require("../models/case");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");

// GET /api/cases - Get all cases
const getCases = (req, res, next) => {
  const { page, limit } = req.query;
  Case.find()
    .skip((page - 1) * limit)
    .limit(limit)
    .then(async (cases) => {
      const casesCount = await Case.countDocuments();
      res.status(200).json({
        success: true,
        data: cases,
        totalCount: casesCount,
        message: "Cases fetched successfully",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        success: false,
        message: "Failed to fetch cases",
        error: err.message,
      });
    });
};

// GET /api/cases/:id - Get single case by ID
const getCaseById = (req, res, next) => {
  const caseId = req.params.id;
  Case.findById(caseId)
    .then((caseItem) => {
      if (!caseItem) {
        return res.status(404).json({
          success: false,
          message: "Case not found",
        });
      }
      res.status(200).json({
        success: true,
        data: caseItem,
        message: "Case fetched successfully",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        success: false,
        message: "Failed to fetch case",
        error: err.message,
      });
    });
};

// POST /api/cases - Create a new case
const createCase = (req, res, next) => {
  const { title, description, status, priority } = req.body;

  // Validation
  if (!title || !description) {
    return res.status(400).json({
      success: false,
      message: "Title and description are required",
    });
  }

  const newCase = new Case({ title, description, status, priority });
  newCase
    .save()
    .then((result) => {
      // Emit to all clients in the "cases" room
      const socket = require("../socket");
      socket.emitToRoom("cases", "caseCreated", {
        message: "A new case was created",
        case: newCase,
      });

      res.status(201).json({
        success: true,
        data: newCase,
        message: "Case created successfully",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        success: false,
        message: "Failed to create case",
        error: err.message,
      });
    });
};

// PUT /api/cases/:id - Update a case
const updateCase = (req, res, next) => {
  const caseId = req.params.id;
  const { title, description, status, priority } = req.body;

  Case.findById(caseId)
    .then((caseItem) => {
      if (!caseItem) {
        return res.status(404).json({
          success: false,
          message: "Case not found",
        });
      }

      let updatedCase = new Case({
        title: title || caseItem.title,
        description: description || caseItem.description,
        status: status || caseItem.status,
        priority: priority || caseItem.priority,
      });

      return updatedCase.save();
    })
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Case updated successfully",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        success: false,
        message: "Failed to update case",
        error: err.message,
      });
    });
};

// DELETE /api/cases/:id - Delete a case
const deleteCase = (req, res, next) => {
  const caseId = req.params.id;
  Case.findByIdAndDelete(caseId)
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Case deleted successfully",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        success: false,
        message: "Failed to delete case",
        error: err.message,
      });
    });
};

const login = async (req, res, next) => {
  console.log(req.session, "req.session before login");
  const { username, password } = req.body;
  const isUserExists = await User.findOne({ username: username });
  console.log(isUserExists, "isUserExists");
  console.log(password, "password");
  if (!isUserExists) {
    return res.status(400).json({
      success: false,
      message: "User does not exist",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, isUserExists.password);

  if (isPasswordValid) {
    req.session.isLoggedInSession = true;
    console.log(req.session, "req.session after login");

    // Express-session will auto-save at the end of the request
    res.status(200).json({ success: true, message: "Login successful" });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
};

const logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Session destroy error:", err);
    }
    res.status(200).json({ success: true, message: "Logout successful" });
  });
};

const isLoggedIn = (req, res, next) => {
  if (req.session.isLoggedInSession) {
    res.status(200).json({ success: true, message: "User is logged in" });
  } else {
    res.status(200).json({ success: false, message: "User is not logged in" });
  }
};

const signUp = async (req, res, next) => {
  const { username, password } = req.body;
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    console.log(validationErrors, "validationErrors");
    console.log(validationErrors.array(), "validationErrors.array()");
    return res.status(200).json({
      success: false,
      message: validationErrors.array()[0].msg,
    });
  }
  const isUserExists = await User.findOne({ username: username });
  console.log(isUserExists, "isUserExists");
  if (isUserExists) {
    return res.status(400).json({
      success: false,
      message: "User already exists",
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({ username, password: hashedPassword });
  newUser
    .save()
    .then((result) => {
      console.log(result, "result");
      res.status(200).json({
        success: true,
        message: "User signed up successfully",
        data: newUser,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const uploadFile = (req, res, next) => {
  console.log(req.file, "req.file");
  const newFile = new File({
    fileName: req.file.originalname,
    filePath: req.file.path,
    fileType: req.file.mimetype,
    fileSize: req.file.size,
  });
  newFile
    .save()
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "File uploaded successfully",
        data: newFile,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        success: false,
        message: "Failed to upload file",
        error: err.message,
      });
    });
};

const getFiles = (req, res, next) => {
  File.find()
    .then((files) => {
      res.status(200).json({
        success: true,
        message: "Files fetched successfully",
        data: files,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        success: false,
        message: "Failed to fetch files",
        error: err.message,
      });
    });
};

const getFileById = (req, res, next) => {
  const fileId = req.params.id;
  File.findById(fileId)
    .then((file) => {
      if (!file) {
        return res.status(404).json({
          success: false,
          message: "File not found",
        });
      }
      console.log(file.filePath, "file.filePath");

      // Check if file exists before streaming
      if (!fs.existsSync(file.filePath)) {
        return res.status(404).json({
          success: false,
          message: "File not found on disk",
        });
      }

      // Set proper headers for file download
      res.setHeader("Content-Type", file.fileType);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${file.fileName}"`
      );
      res.setHeader("Content-Length", file.fileSize);

      // Create a read stream and pipe it to the response
      const fileStream = fs.createReadStream(file.filePath);

      // Handle stream errors
      fileStream.on("error", (err) => {
        console.error("Stream error:", err);
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            message: "Failed to read file",
            error: err.message,
          });
        }
      });

      // Pipe the file stream to the response
      fileStream.pipe(res);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        success: false,
        message: "Failed to fetch file",
        error: err.message,
      });
    });
};

module.exports = {
  getCases,
  getCaseById,
  createCase,
  updateCase,
  deleteCase,
  login,
  logout,
  isLoggedIn,
  signUp,
  uploadFile,
  getFiles,
  getFileById,
};
