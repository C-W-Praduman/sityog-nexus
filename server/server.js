require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Note = require("./models/Note");
const User = require("./models/User");

const cloudinary = require("./config/cloudinary");

const { CloudinaryStorage } = require("multer-storage-cloudinary");

const app = express();

app.use(cors());


app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✓ MongoDB connected"))
  .catch((err) => {
    console.error("✗ MongoDB connection failed:", err.message);
    process.exit(1);
  });

// Middleware


// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
};

// Configure cloudinary storage for multer and set it to handle PDF uploads
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "nexus_notes",
    resource_type: "raw", // IMPORTANT for PDFs
    format: async () => "pdf",
    public_id: (req, file) =>
      `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`,
  },
});

const upload = multer({ storage });

// Routes

// GET /api/notes - List all notes
app.get("/api/notes", async (req, res) => {
  try {
    let query = {};

    // Filter by semester if provided
    if (req.query.semester) {
      query.semester = req.query.semester;
    }

    // Filter by branch if provided
    if (req.query.branch) {
      query.branch = req.query.branch;
    }

    const notes = await Note.find(query).sort({ uploadedAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error("Error fetching notes:", err);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

// POST /api/upload - Upload a new note (Protected)
app.post(
  "/api/upload",
  authenticateToken,
  upload.single("file"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    
    try {
      const title = req.body.title || "Untitled Note";
      const semester = req.body.semester || "1";
      const uploaderName = req.body.uploaderName || "Anonymous";
      const branch = req.body.branch || "Common";
      const documentType = req.body.documentType || "Note";

      const newNote = new Note({
        title: title,
        semester: semester,
        branch: branch,
        documentType: documentType,
        uploaderName: uploaderName,
        fileUrl: req.file.path, // Cloudinary URL
        publicId: req.file.filename,
      });

      const savedNote = await newNote.save();
      res.status(201).json(savedNote);
    } catch (err) {
      console.error("Error saving note:", err);
      res.status(500).json({ error: "Failed to save note metadata" });
    }
  },
);

// --- AUTH ROUTES ---
const authController = require("./controllers/authController");
const {
  validateRegister,
  validateLogin,
  validateVerifyOTP,
  validateForgotPassword,
  validateResetPassword,
} = require("./middleware/authValidation");

// Register (Step 1)
app.post("/api/auth/register", validateRegister, authController.register);

// Verify OTP (Step 2)
app.post("/api/auth/verify-otp", validateVerifyOTP, authController.verifyOTP);

// Login
app.post("/api/auth/login", validateLogin, authController.login);

// Get current authenticated user profile
app.get('/api/auth/me', authenticateToken, authController.getProfile);

// Update current user profile
app.put('/api/auth/me', authenticateToken, authController.updateProfile);

// Forgot Password
app.post(
  "/api/auth/forgot-password",
  validateForgotPassword,
  authController.forgotPassword,
);

// Reset Password
app.post(
  "/api/auth/reset-password",
  validateResetPassword,
  authController.resetPassword,
);

// deleting api for the notes as host can delete the notes

app.delete("/api/deletenote/:id", authenticateToken, async (req, res) => {
  
  try {

    // Role check
    if (req.user.role !== "host") {
      return res.status(403).json({ error: "Access denied" });
    }

    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(note.publicId, {
      resource_type: "raw",
    });

    // Delete from MongoDB
    await Note.findByIdAndDelete(req.params.id);

    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete note" });
  }

})

// Start server
// module.exports = app;

app.listen(3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});
