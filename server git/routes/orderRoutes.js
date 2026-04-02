import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();

// 1. TẠO ĐƠN HÀNG MỚI (Khách hàng dùng)
router.post('/', async (req, res) => {
  try {
    const { user, orderItems, shippingAddress, totalPrice } = req.body;
    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'Không có sản phẩm nào' });
    }
    const order = new Order({ user, orderItems, shippingAddress, totalPrice });
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. LẤY TẤT CẢ ĐƠN HÀNG (Admin dùng)
router.get('/', async (req, res) => {
  try {
    // Lấy tất cả và sắp xếp ngày mới nhất lên đầu
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. CẬP NHẬT TRẠNG THÁI (Admin dùng)
router.put('/:id/status', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = req.body.status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// 4. LẤY ĐƠN HÀNG CỦA MỘT USER CỤ THỂ (Dành cho chức năng Lịch sử mua hàng)
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;