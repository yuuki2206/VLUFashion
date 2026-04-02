import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'vlu_secret_key', { expiresIn: '30d' });
};

// 1. API ĐĂNG KÝ (POST /api/users/register)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, adminCode } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email đã được sử dụng!' });

    const isAdmin = adminCode === '123456789' ? true : false;

    const user = await User.create({ name, email, password, isAdmin });
    if (user) {
      res.status(201).json({
        _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Dữ liệu không hợp lệ!' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. API ĐĂNG NHẬP (POST /api/users/login)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      // RÀ LỖI Ở ĐÂY: Trả về isAdmin cho Frontend
      res.json({
        _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Sai email hoặc mật khẩu!' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;