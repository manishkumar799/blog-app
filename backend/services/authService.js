const { User } = require('../models');

const registerUser = async (userData) => {
  const userExists = await User.findOne({ where: { email: userData.email } });
  if (userExists) {
    throw new Error('User already exists');
  }

  const user = await User.create(userData);
  return {
    id: user.id,
    username: user.username,
    email: user.email
  };
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ where: { email } });

  if (!user || !(await user.matchPassword(password))) {
    throw new Error('Invalid email or password');
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email
  };
};

const getUserProfile = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password'] }
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile
};