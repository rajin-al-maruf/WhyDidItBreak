const User = require('../models/user.model.js');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string' || !name.trim() || !email.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and password are required.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const userExist = await User.findOne({ email: cleanEmail });

    if (userExist) {
      return res.status(400).json({success: false, message: 'An account with this email already exists.',});
    }

    const user = await User.create({name, email: cleanEmail, password});

    return res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      user: {id: user._id, name: user.name, email: user.email,}
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid name, email or password',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
      return res.status(400).json({success: false, message: 'A valid email and password are required'});
    }

    const user = await User.findOne({email: email.trim().toLowerCase()}).select('+password');

    if(!user){
        return res.status(400).json({ success: false, message: "User not registered"})
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({success: false,message: 'Invalid password'});
    }

    const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({success: false, message: 'Internal server error'});
  }
};

const getMe = (req, res) => {
  return res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    },
  });
};

module.exports = { registerUser, loginUser, getMe };