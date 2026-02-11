const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  semester: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  documentType: {
    type: String,
    required: true,
  },
  uploaderName: {
    type: String,
    required: true,
    trim: true,
  },

  // 🔥 Cloudinary fields
  fileUrl: {
    type: String,
    required: true,
  },

  publicId: {
    type: String,
    required: true, // used to delete from Cloudinary later
  },

  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Note", noteSchema);
