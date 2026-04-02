import Product from '../models/Product.js';

// @desc    Lấy danh sách tất cả sản phẩm
// @route   GET /api/products
// @access  Public (Ai cũng xem được)
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi Server khi tải danh sách sản phẩm', error: error.message });
  }
};

// @desc    Lấy chi tiết 1 sản phẩm theo ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: 'Không tìm thấy sản phẩm này' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi Server hoặc ID không hợp lệ', error: error.message });
  }
};