require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const mongoose = require("mongoose");
const Note = require("./models/Note");
const User = require("./models/User");

const cloudinary = require("./config/cloudinary");

const { CloudinaryStorage } = require("multer-storage-cloudinary");

const app = express();

app.use(cors({
  origin: ["https://sityog-nexus.vercel.app", "http://localhost:5173", "http://localhost:3000"],
  credentials: true,
}));

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


const admin = require("./config/firebase");

// Authentication Middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    // Find the user in our database using the Firebase UID or email
    let user = await User.findOne({ 
      $or: [
        { firebaseUid: decodedToken.uid },
        { email: decodedToken.email.toLowerCase() }
      ]
    });

    if (!user) {
       // If user doesn't exist in DB but has valid Firebase token, we could sync them here or reject
       // For now, let's reject and expect /sync-user to have been called
       return res.status(404).json({ error: "User not found in database. Please register." });
    }

    if (user.isBlocked) {
       return res.status(403).json({ error: "Your account has been blocked. Please contact the administrator." });
    }

    req.user = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      uid: decodedToken.uid
    };
    next();
  } catch (err) {
    console.error("Auth Error:", err);
    res.status(403).json({ error: "Invalid or expired token" });
  }
};

const isHost = (req, res, next) => {
  if (req.user && (req.user.role === 'host' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ error: "Access denied. Host privileges required." });
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

app.get("/", (req, res) => {
  res.send("Welcome to the Nexus Notes API");
});


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
// const authController = require("./controllers/authController");

// Note: Firebase handles authentication (register, login, password reset)

// Get current authenticated user profile
app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.status(200).json({ user: req.user });
});

// Update user profile (Firebase users)
app.put('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const { name, mobile, rollNo, branch, semester } = req.body;
    const userId = req.user.id;
    
    const update = {};
    if (name !== undefined) update.name = name;
    if (mobile !== undefined) update.mobile = mobile;
    if (rollNo !== undefined) update.rollNo = rollNo;
    if (branch !== undefined) update.branch = branch;
    if (semester !== undefined) update.semester = semester;
    
    const updated = await User.findByIdAndUpdate(
      userId,
      update,
      { new: true }
    ).select('-password');
    
    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json({ user: updated });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Sync Firebase user with database
app.post('/api/auth/sync-user', async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email } = decodedToken;
    const { name } = req.body; // Name might come from client if not in token
    
    // Find or create user
    let user = await User.findOne({ 
      $or: [
        { firebaseUid: uid },
        { email: email.toLowerCase() }
      ]
    });
    
    if (!user) {
      user = new User({
        name: name || decodedToken.name || email.split('@')[0],
        email: email.toLowerCase(),
        password: 'FIREBASE_AUTH',
        isVerified: true,
        firebaseUid: uid
      });
    } else {
      if (name) user.name = name;
      user.firebaseUid = uid;
      user.isVerified = true;
    }
    
    const savedUser = await user.save();
    
    res.status(200).json({ 
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        branch: savedUser.branch,
        semester: savedUser.semester,
        mobile: savedUser.mobile,
        rollNo: savedUser.rollNo
      }
    });
  } catch (err) {
    console.error('Sync user error:', err);
    res.status(500).json({ error: 'Failed to sync user' });
  }
});

// Firebase handles password reset via sendPasswordResetEmail

// deleting api for the notes as host can delete the notes
app.delete("/api/deletenote/:id", authenticateToken, isHost, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    // Delete from Cloudinary
    if (note.publicId) {
      await cloudinary.uploader.destroy(note.publicId, {
        resource_type: "raw",
      });
    }

    // Delete from MongoDB
    await Note.findByIdAndDelete(req.params.id);

    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    console.error("Delete note error:", err);
    res.status(500).json({ error: "Failed to delete note" });
  }
});

// Admin User Management Routes
app.get('/api/admin/users', authenticateToken, isHost, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ users });
  } catch (err) {
    console.error('Fetch users error:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.put('/api/admin/users/:id/block', authenticateToken, isHost, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    user.isBlocked = !user.isBlocked;
    await user.save();
    
    res.status(200).json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`, user });
  } catch (err) {
    console.error('Block user error:', err);
    res.status(500).json({ error: 'Failed to toggle block status' });
  }
});

app.delete('/api/admin/users/:id', authenticateToken, isHost, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // Also delete user from Firebase if possible (optional but recommended)
    try {
      if (user.firebaseUid) {
        await admin.auth().deleteUser(user.firebaseUid);
      }
    } catch (fbErr) {
      console.error('Firebase delete user error:', fbErr);
      // Continue deleting from MongoDB even if Firebase deletion fails
    }
    
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

app.get('/api/admin/users/:id', authenticateToken, isHost, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ user });
  } catch (err) {
    console.error('Fetch user detail error:', err);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
});

app.put('/api/admin/users/:id', authenticateToken, isHost, async (req, res) => {
  try {
    const { name, mobile, rollNo, branch, semester, role } = req.body;
    
    // Prevent unprivileged role escalation or modification of self/other hosts if needed
    // For now, assume host is trusted
    
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { name, mobile, rollNo, branch, semester, role },
      { new: true }
    ).select('-password');
    
    if (!updated) return res.status(404).json({ error: 'User not found' });
    
    res.status(200).json({ message: 'User updated successfully', user: updated });
  } catch (err) {
    console.error('Update user detail error:', err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Start server
// module.exports = app;

app.listen(3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});
