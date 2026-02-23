import mongoose from "mongoose";

// User Schema definition
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Ensures no duplicate emails
    match: [/\S+@\S+\.\S+/, 'Email is not valid'],
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'moderator'], // Define user roles
    default: 'user',
  },
  fullName: {
    type: String,
    required: true,
    minlength: [3, 'Full name must be at least 3 characters long'],
    maxlength: [100, 'Full name must be less than 100 characters'],
  },
  phoneNumber: {
    type: String,
    required: false,
    match: [/^\d{10}$/, 'Phone number must be a 10-digit number'],
  },
  profilePictureUrl: {
    type: String,
    required: false,
  },
  isVerified: {
    type: Boolean,
    default: false, // Initially set to false until user verifies email
  },
  lastMailedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create User model from schema
const UserModel = mongoose.models.User || mongoose.model("User", userSchema);
export default UserModel;
