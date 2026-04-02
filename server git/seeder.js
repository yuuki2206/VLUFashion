import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Product from './models/Product.js';
import Category from './models/Category.js';

dotenv.config();
connectDB();

const importData = async () => {
  try {
    // Xóa dữ liệu cũ để tránh trùng lặp
    await Product.deleteMany();
    await Category.deleteMany();

    // 1. Tạo Danh mục (Đã thêm Quần Nam và Áo Nữ để phong phú hơn)
    const createdCategories = await Category.insertMany([
      { name: 'Áo Nam', slug: 'ao-nam', description: 'Thời trang nam' },            // Vị trí: 0
      { name: 'Váy Nữ', slug: 'vay-nu', description: 'Thời trang nữ' },             // Vị trí: 1
      { name: 'Quần Nam', slug: 'quan-nam', description: 'Quần thời trang nam' },   // Vị trí: 2
      { name: 'Áo Nữ', slug: 'ao-nu', description: 'Áo kiểu, áo thun nữ' }          // Vị trí: 3
    ]);

    // 2. Tạo 8 Sản phẩm chuẩn cấu trúc
    const sampleProducts = [
      // --- SẢN PHẨM 1 ---
      {
        name: 'Áo Thun Cổ Tròn Basic',
        slug: 'ao-thun-co-tron-basic',
        description: 'Áo thun form rộng, chất liệu cotton 100% thấm hút mồ hôi tốt.',
        category: createdCategories[0]._id, // Áo Nam
        brand: 'Local Brand',
        basePrice: 150000,
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800'],
        variants: [
          { sku: 'ATB-DEN-M', color: 'Đen', size: 'M', stock: 50 },
          { sku: 'ATB-DEN-L', color: 'Đen', size: 'L', stock: 30 },
          { sku: 'ATB-TRANG-M', color: 'Trắng', size: 'M', stock: 20 }
        ]
      },
      // --- SẢN PHẨM 2 ---
      {
        name: 'Váy Hoa Nhí Vintage',
        slug: 'vay-hoa-nhi-vintage',
        description: 'Váy thiết kế dáng dài, họa tiết hoa nhí phong cách Hàn Quốc.',
        category: createdCategories[1]._id, // Váy Nữ
        brand: 'Boutique',
        basePrice: 320000,
        images: ['https://images.unsplash.com/photo-1572804013309-279160d01504?auto=format&fit=crop&q=80&w=800'],
        variants: [
          { sku: 'VHN-XANH-S', color: 'Xanh nhạt', size: 'S', stock: 15 },
          { sku: 'VHN-XANH-M', color: 'Xanh nhạt', size: 'M', stock: 25 }
        ]
      },
      // --- SẢN PHẨM 3 ---
      {
        name: 'Áo Khoác Kaki Nón Rộng',
        slug: 'ao-khoac-kaki-non-rong',
        description: 'Áo khoác kaki 2 lớp chống nắng, chống bụi cực tốt. Thiết kế túi hộp tiện lợi.',
        category: createdCategories[0]._id, // Áo Nam
        brand: 'VLU Studio',
        basePrice: 450000,
        images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800'],
        variants: [
          { sku: 'AK-XAM-M', color: 'Xám', size: 'M', stock: 20 },
          { sku: 'AK-DEN-L', color: 'Đen', size: 'L', stock: 15 }
        ]
      },
      // --- SẢN PHẨM 4 ---
      {
        name: 'Quần Jean Nam Ống Suông',
        slug: 'quan-jean-nam-ong-suong',
        description: 'Quần jean ống suông phong cách bụi bặm, chất denim dày dặn không bai dão.',
        category: createdCategories[2]._id, // Quần Nam
        brand: 'Denim VLU',
        basePrice: 380000,
        images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800'],
        variants: [
          { sku: 'QJ-XANH-30', color: 'Xanh Đậm', size: '30', stock: 25 },
          { sku: 'QJ-XANH-32', color: 'Xanh Đậm', size: '32', stock: 20 }
        ]
      },
      // --- SẢN PHẨM 5 ---
      {
        name: 'Áo Sơ Mi Oxford Dài Tay',
        slug: 'ao-so-mi-oxford-dai-tay',
        description: 'Sơ mi Oxford thanh lịch, form chuẩn vừa vặn tôn dáng. Thích hợp cho môi trường công sở.',
        category: createdCategories[0]._id, // Áo Nam
        brand: 'VLU Workwear',
        basePrice: 280000,
        images: ['https://images.unsplash.com/photo-1596755094514-f87e32f6b717?auto=format&fit=crop&q=80&w=800'],
        variants: [
          { sku: 'SM-TRANG-M', color: 'Trắng', size: 'M', stock: 40 },
          { sku: 'SM-XANH-L', color: 'Xanh Biển', size: 'L', stock: 30 }
        ]
      },
      // --- SẢN PHẨM 6 ---
      {
        name: 'Chân Váy Xếp Ly Chữ A',
        slug: 'chan-vay-xep-ly-chu-a',
        description: 'Chân váy xếp ly cạp cao giúp hack dáng cực đỉnh. Bên trong có quần bảo hộ an toàn.',
        category: createdCategories[1]._id, // Váy Nữ
        brand: 'Boutique',
        basePrice: 190000,
        images: ['https://images.unsplash.com/photo-1583496924716-11883a48eef9?auto=format&fit=crop&q=80&w=800'],
        variants: [
          { sku: 'CV-DEN-S', color: 'Đen', size: 'S', stock: 30 },
          { sku: 'CV-XAM-M', color: 'Xám', size: 'M', stock: 25 }
        ]
      },
      // --- SẢN PHẨM 7 ---
      {
        name: 'Áo Kiểu Nữ Trễ Vai',
        slug: 'ao-kieu-nu-tre-vai',
        description: 'Áo trễ vai điệu đà, chất liệu voan lụa mềm mát, thích hợp đi biển, dạo phố.',
        category: createdCategories[3]._id, // Áo Nữ
        brand: 'VLU Style',
        basePrice: 220000,
        images: ['https://images.unsplash.com/photo-1550639525-c97d455acf70?auto=format&fit=crop&q=80&w=800'],
        variants: [
          { sku: 'AKN-TRANG-FS', color: 'Trắng', size: 'Freesize', stock: 50 },
          { sku: 'AKN-HONG-FS', color: 'Hồng Nhạt', size: 'Freesize', stock: 35 }
        ]
      },
      // --- SẢN PHẨM 8 ---
      {
        name: 'Quần Short Kaki Nam Túi Hộp',
        slug: 'quan-short-kaki-nam-tui-hop',
        description: 'Quần short nam cá tính với thiết kế túi hộp. Lưng thun dây rút thoải mái vận động.',
        category: createdCategories[2]._id, // Quần Nam
        brand: 'Local Brand',
        basePrice: 250000,
        images: ['https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=800'],
        variants: [
          { sku: 'QS-REU-M', color: 'Xanh Rêu', size: 'M', stock: 40 },
          { sku: 'QS-DEN-L', color: 'Đen', size: 'L', stock: 60 }
        ]
      }
    ];

    await Product.insertMany(sampleProducts);
    console.log(' Đã bơm 8 sản phẩm mẫu thành công!');
    process.exit();
  } catch (error) {
    console.error(` Lỗi: ${error.message}`);
    process.exit(1);
  }
};

importData();