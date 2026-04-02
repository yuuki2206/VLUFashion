import path from 'path';
import express from 'express';
import multer from 'multer';

const router = express.Router();

// Cấu hình nơi lưu và tên file ảnh
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // Ảnh sẽ được lưu vào thư mục server/uploads/
  },
  filename(req, file, cb) {
    // Đổi tên file để không bị trùng (Ví dụ: image-163234234.jpg)
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Bộ lọc chỉ cho phép up file ảnh
const checkFileType = (file, cb) => {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Chỉ hỗ trợ định dạng ảnh (JPG, PNG, WEBP)!');
  }
};

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// API Upload: Trả về đường dẫn để Frontend xài
router.post('/', upload.single('image'), (req, res) => {
  // Trả về URL đầy đủ (Ví dụ: http://localhost:5000/uploads/image-123.jpg)
  const imageUrl = `http://localhost:5000/${req.file.path.replace(/\\/g, '/')}`;
  res.send(imageUrl);
});

export default router;