import mongoose from 'mongoose';

// Tạm thời nới lỏng cái variantSchema (Bỏ required: true) 
// Để khi bạn chỉ nhập màu/size cơ bản thì MongoDB không báo lỗi bắt buộc nhập SKU, Stock.
const variantSchema = new mongoose.Schema({
  sku: { type: String, sparse: true }, // sparse: true giúp không bị lỗi unique khi để trống
  color: { type: String },
  size: { type: String },
  stock: { type: Number, min: 0 },
  priceDifference: { type: Number, default: 0 }, 
  colorImage: { type: String } 
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  
  // 1. ĐÃ SỬA: Chuyển category thành String để bạn gõ chữ "Áo", "Quần" thoải mái
  category: { type: String, default: 'Chưa phân loại' },
  
  // 2. ĐÃ THÊM: Chỗ chứa cho 2 ô Màu sắc và Size trên Admin
  colors: [{ type: String }],
  sizes: [{ type: String }],

  brand: { type: String, default: 'VLU Fashion' },
  basePrice: { type: Number, required: true },
  discountPrice: { type: Number }, 
  images: [{ type: String }], 
  variants: [variantSchema], 
  averageRating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);