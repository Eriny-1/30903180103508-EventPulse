const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

// ==================== REGISTER ====================

const register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Check required fields
  if (!name || !email || !password) {
    return next(new AppError("Name, email and password are required", 400));
  }

  // Check duplicate email
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return next(new AppError("Email is already registered", 400));
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "attendee",
  });

  // Create JWT
  const token = jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  res.status(201).json({
    status: "success",
    token,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// ==================== LOGIN ====================

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Check required fields
  if (!email || !password) {
    return next(new AppError("Email and password are required", 400));
  }

  // Find user and include password
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new AppError("Invalid email or password", 401));
  }

  // Compare password
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return next(new AppError("Invalid email or password", 401));
  }

  // Create JWT
  const token = jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  res.status(200).json({
    status: "success",
    token,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// ==================== EXPORT ====================

module.exports = {
  register,
  login,
};
