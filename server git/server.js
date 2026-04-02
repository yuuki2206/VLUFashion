import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Kết nối Database
import connectDB from './config/db.js';

// Import các file định tuyến (Routes)
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js'; 
import uploadRoutes from './routes/uploadRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js'; // 🚀 ĐÃ BỔ SUNG: Import API Đơn hàng

// Khởi tạo cấu hình
dotenv.config();
connectDB();

const app = express();

// Middleware (Xử lý dữ liệu đầu vào)
app.use(cors());
app.use(express.json());

// ==========================================
// CÁC ĐƯỜNG DẪN API CHÍNH
// ==========================================
app.use('/api/users', authRoutes);       // API Quản lý Tài khoản
app.use('/api/products', productRoutes); // API Quản lý Sản phẩm
app.use('/api/upload', uploadRoutes);    // API Upload Hình ảnh
app.use('/api/categories', categoryRoutes); // API Danh mục
app.use('/api/orders', orderRoutes);     // 🚀 ĐÃ BỔ SUNG: Khởi chạy API Đơn hàng

// ==========================================
// CẤU HÌNH THƯ MỤC ẢNH PUBLIC
// ==========================================
// Mở khóa thư mục 'uploads' để Frontend lấy được ảnh hiển thị lên web
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Đường dẫn Test Server
app.get('/', (req, res) => {
  res.send('API VLU Fashion đang hoạt động tuyệt vời...');
});

// Khởi chạy Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server đang chạy ở port ${PORT}`);
});