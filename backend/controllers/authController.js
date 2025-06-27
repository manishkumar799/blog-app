const asyncHandler = require('express-async-handler');
const {
  registerUser,
  loginUser,
  getUserProfile
} = require('../services/authService');
const { registerSchema, loginSchema } = require('../validators/authValidator');
const generateToken = require('../utils/generateToken');

const register = asyncHandler(async (req, res) => {
  // Validate request body
  const { error } = registerSchema.validate(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  const user = await registerUser(req.body);

  generateToken(res, user.id);
  res.status(201).json(user);
});

const login = asyncHandler(async (req, res) => {
  // Validate request body
  const { error } = loginSchema.validate(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  const { email, password } = req.body;
  const user = await loginUser(email, password);

  generateToken(res, user.id);
  res.json(user);
});

const logout = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  res.status(200).json({ message: 'Logged out successfully' });
});

const getProfile = asyncHandler(async (req, res) => {
  const user = await getUserProfile(req.user.id);
  res.json(user);
});

module.exports = {
  register,
  login,
  logout,
  getProfile
};