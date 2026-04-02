import express from 'express';
// Giả định bạn đã có file model Category.js, nếu tên khác thì bạn sửa lại đường dẫn nhé
import mongoose from 'mongoose'; 

const router = express.Router();

// Lấy Model Category trực tiếp (trường hợp bạn chưa tạo file Category.js trong thư mục models)
const Category = mongoose.models.Category || mongoose.model('Category', new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  description: { type: String }
}));

// API: GET /api/categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;