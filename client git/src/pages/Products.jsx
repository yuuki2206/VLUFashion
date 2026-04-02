// @ts-nocheck
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Các State lưu trữ tiêu chí lọc
  const [selectedCategory, setSelectedCategory] = useState(''); // Rỗng là Tất cả
  const [selectedSize, setSelectedSize] = useState('');
  const [sortOrder, setSortOrder] = useState(''); // 'asc' hoặc 'desc'

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products');
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi tải sản phẩm", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // BỘ MÁY LỌC ĐÃ ĐƯỢC NÂNG CẤP THÔNG MINH HƠN
  useEffect(() => {
    let result = [...products];

    // Lọc theo Danh mục (Tìm chữ "Nam" hoặc "Nữ" trong tên danh mục)
    if (selectedCategory) {
      if (selectedCategory === 'Nam') {
        result = result.filter(p => p.category && p.category.toLowerCase().includes('nam'));
      } else if (selectedCategory === 'Nữ') {
        result = result.filter(p => p.category && p.category.toLowerCase().includes('nữ'));
      }
    }

    // Lọc theo Size
    if (selectedSize) {
      result = result.filter(p => p.sizes && p.sizes.includes(selectedSize));
    }

    // Sắp xếp theo Giá
    if (sortOrder === 'asc') {
      result.sort((a, b) => a.basePrice - b.basePrice);
    } else if (sortOrder === 'desc') {
      result.sort((a, b) => b.basePrice - a.basePrice);
    }

    setFilteredProducts(result);
  }, [products, selectedCategory, selectedSize, sortOrder]);

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedSize('');
    setSortOrder('');
  };

  if (loading) return <div className="text-center mt-20 font-bold uppercase tracking-widest text-zinc-500">Đang tải...</div>;

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-black uppercase tracking-tighter text-zinc-900 mb-8 pb-4 border-b">
        Tất cả sản phẩm
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* SIDEBAR BỘ LỌC */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-8">
          
          <div>
            <h3 className="font-black text-sm uppercase tracking-widest text-zinc-900 mb-4">Danh mục</h3>
            <div className="space-y-3 text-sm text-zinc-600 font-medium">
              <label className="flex items-center gap-3 cursor-pointer hover:text-zinc-900 transition-colors">
                <input type="radio" name="category" checked={selectedCategory === ''} onChange={() => setSelectedCategory('')} className="accent-zinc-900 w-4 h-4" />
                Tất cả sản phẩm
              </label>
              <label className="flex items-center gap-3 cursor-pointer hover:text-zinc-900 transition-colors">
                <input type="radio" name="category" checked={selectedCategory === 'Nam'} onChange={() => setSelectedCategory('Nam')} className="accent-zinc-900 w-4 h-4" />
                Thời trang Nam
              </label>
              <label className="flex items-center gap-3 cursor-pointer hover:text-zinc-900 transition-colors">
                <input type="radio" name="category" checked={selectedCategory === 'Nữ'} onChange={() => setSelectedCategory('Nữ')} className="accent-zinc-900 w-4 h-4" />
                Thời trang Nữ
              </label>
            </div>
          </div>

          <div>
            <h3 className="font-black text-sm uppercase tracking-widest text-zinc-900 mb-4">Kích thước</h3>
            <div className="flex flex-wrap gap-2">
              {['S', 'M', 'L', 'XL'].map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size === selectedSize ? '' : size)}
                  className={`w-10 h-10 flex items-center justify-center text-sm font-bold border rounded-sm transition-all ${selectedSize === size ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white text-zinc-500 hover:border-zinc-900 hover:text-zinc-900'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-black text-sm uppercase tracking-widest text-zinc-900 mb-4">Sắp xếp giá</h3>
            <select 
              value={sortOrder} 
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full border p-3 focus:border-zinc-900 focus:outline-none rounded-sm bg-white text-sm font-medium text-zinc-700 cursor-pointer"
            >
              <option value="">Mặc định</option>
              <option value="asc">Giá: Từ thấp đến cao</option>
              <option value="desc">Giá: Từ cao xuống thấp</option>
            </select>
          </div>

          {(selectedCategory || selectedSize || sortOrder) && (
            <button onClick={clearFilters} className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold uppercase text-xs tracking-widest rounded-sm transition-colors">
              Xóa bộ lọc
            </button>
          )}

        </div>

        {/* LƯỚI SẢN PHẨM */}
        <div className="flex-1">
          <p className="text-sm text-zinc-500 mb-6">Tìm thấy <span className="font-bold text-zinc-900">{filteredProducts.length}</span> sản phẩm.</p>
          
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-zinc-50 border border-dashed border-zinc-200 rounded-sm">
              <p className="font-bold text-zinc-500 uppercase tracking-widest">Không tìm thấy sản phẩm nào phù hợp!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product._id} className="border border-zinc-200 rounded-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow bg-white">
                  <div className="h-72 bg-zinc-100 overflow-hidden relative">
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col items-center text-center">
                    {/* Badge hiển thị Danh mục nhỏ xíu ở trên tên */}
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">{product.category}</span>
                    <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-900 mb-2 line-clamp-2">{product.name}</h3>
                    <p className="font-bold text-red-600 mt-auto">{product.basePrice?.toLocaleString('vi-VN')} ₫</p>
                  </div>

                  <Link to={`/product/${product._id}`} className="block w-full text-center py-4 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-widest transition-colors mt-auto">
                    XEM CHI TIẾT
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default Products;