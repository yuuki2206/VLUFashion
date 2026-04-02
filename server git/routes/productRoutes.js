import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// 1. LẤY DANH SÁCH & TÌM KIẾM
router.get('/', async (req, res) => {
  try {
    const searchKeyword = req.query.search;
    let query = {};

    if (searchKeyword) {
      const removeAccents = (str) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");
      };
      const slugKeyword = removeAccents(searchKeyword).toLowerCase().trim().replace(/\s+/g, '.*');

      query = {
        $or: [
          { name: { $regex: searchKeyword, $options: 'i' } },
          { slug: { $regex: slugKeyword, $options: 'i' } }
        ]
      };
    }

    const products = await Product.find(query).sort({ _id: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. LẤY CHI TIẾT 1 SẢN PHẨM
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. THÊM SẢN PHẨM MỚI
router.post('/', async (req, res) => {
  try {
    const generateSlug = (str) => {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D")
        .toLowerCase().trim().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
    };

    const product = new Product({
      name: req.body.name,
      slug: generateSlug(req.body.name),
      basePrice: req.body.basePrice,
      images: [req.body.image],
      description: req.body.description,
      
      // Lấy thêm 3 trường mới
      category: req.body.category || 'Chưa phân loại',
      colors: req.body.colors ? req.body.colors.split(',').map(c => c.trim()) : [],
      sizes: req.body.sizes ? req.body.sizes.split(',').map(s => s.trim()) : [],
      
      brand: 'VLU Fashion',
      countInStock: 100
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 4. SỬA SẢN PHẨM
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.name = req.body.name || product.name;
      product.basePrice = req.body.basePrice || product.basePrice;
      product.description = req.body.description || product.description;
      
      if (req.body.category) product.category = req.body.category;
      if (req.body.colors) product.colors = req.body.colors.split(',').map(c => c.trim());
      if (req.body.sizes) product.sizes = req.body.sizes.split(',').map(s => s.trim());

      if (req.body.image) product.images = [req.body.image];
      if (req.body.name) {
        product.slug = req.body.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase().trim().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-');
      }

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 5. XÓA SẢN PHẨM
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (product) {
      res.json({ message: 'Đã xóa sản phẩm thành công' });
    } else {
      res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;