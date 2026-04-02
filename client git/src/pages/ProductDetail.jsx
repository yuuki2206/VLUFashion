// @ts-nocheck
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { useCart } from "../context/CartContext";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const cartContext = useCart();
  const addToCart = cartContext ? cartContext.addToCart : null;

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  // ĐÃ XÓA 2 DÒNG DỮ LIỆU ẢO Ở ĐÂY

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(data);
        setLoading(false);
        
        // Mẹo UX: Tự động chọn sẵn Màu và Size đầu tiên cho khách đỡ phải click nhiều
        if (data.colors && data.colors.length > 0) setSelectedColor(data.colors[0]);
        if (data.sizes && data.sizes.length > 0) setSelectedSize(data.sizes[0]);
        
      } catch (error) {
        console.error("Lỗi tải chi tiết:", error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!addToCart) {
      return alert("🚨 LỖI: Hệ thống Giỏ hàng chưa được kết nối! Bạn hãy kiểm tra lại file main.tsx xem đã bọc <CartProvider> chưa nhé!");
    }

    if (!selectedColor) return alert("Vui lòng chọn Màu sắc!");
    if (!selectedSize) return alert("Vui lòng chọn Kích thước!");

    addToCart({
      _id: product._id,
      name: product.name,
      price: product.basePrice,
      image: product.images[0],
      color: selectedColor,
      size: selectedSize,
      quantity: quantity
    });

    alert("🎉 Đã thêm thành công vào giỏ hàng!");
  };

  if (loading) return <div className="text-center mt-20 font-bold uppercase tracking-widest text-zinc-500">Đang tải...</div>;
  if (!product) return <div className="text-center mt-20 font-bold text-red-500 uppercase">Sản phẩm không tồn tại</div>;

  // Lấy danh sách màu và size từ Database (Nếu không có thì để mảng rỗng để không bị lỗi map)
  const productColors = product.colors || [];
  const productSizes = product.sizes || [];

  return (
    <div className="container mx-auto p-6 min-h-screen bg-white">
      <div className="flex flex-col md:flex-row gap-12 mt-8">
        {/* CỘT TRÁI: HÌNH ẢNH */}
        <div className="md:w-1/2">
          <div className="bg-gray-100 rounded-sm overflow-hidden sticky top-24">
            <img src={product.images[0]} alt={product.name} className="w-full h-auto object-cover" />
          </div>
        </div>

        {/* CỘT PHẢI: THÔNG TIN */}
        <div className="md:w-1/2 space-y-8">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-zinc-900 mb-2">{product.name}</h1>
            <p className="text-2xl font-bold text-red-600">{product.basePrice.toLocaleString('vi-VN')} ₫</p>
          </div>
          
          <div className="space-y-3">
            <p className="font-bold text-xs uppercase tracking-widest text-zinc-500">Mô tả sản phẩm</p>
            <p className="text-zinc-700 leading-relaxed text-sm whitespace-pre-wrap">{product.description}</p>
          </div>

          {/* MÀU SẮC (Chỉ hiện nếu có dữ liệu) */}
          {productColors.length > 0 && (
            <div className="space-y-3">
              <p className="font-bold text-xs uppercase tracking-widest text-zinc-900">
                Màu sắc: <span className="text-zinc-500 font-normal ml-1">{selectedColor || 'Chưa chọn'}</span>
              </p>
              <div className="flex flex-wrap gap-3">
                {productColors.map(color => (
                  <button 
                    key={color} onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 text-sm font-medium rounded-md border transition-all ${selectedColor === color ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-zinc-200 bg-white text-zinc-900 hover:border-zinc-900'}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* KÍCH THƯỚC (Chỉ hiện nếu có dữ liệu) */}
          {productSizes.length > 0 && (
            <div className="space-y-3">
              <p className="font-bold text-xs uppercase tracking-widest text-zinc-900">
                Kích thước: <span className="text-zinc-500 font-normal ml-1">{selectedSize || 'Chưa chọn'}</span>
              </p>
              <div className="flex flex-wrap gap-3">
                {productSizes.map(size => (
                  <button 
                    key={size} onClick={() => setSelectedSize(size)}
                    className={`min-w-12 px-3 h-10 flex items-center justify-center text-sm font-medium rounded-md border transition-all ${selectedSize === size ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-zinc-200 bg-white text-zinc-900 hover:border-zinc-900'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <p className="font-bold text-xs uppercase tracking-widest text-zinc-900">Số lượng</p>
            <div className="flex items-center border border-zinc-200 rounded-md w-32 h-10">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-full flex items-center justify-center hover:bg-zinc-100 transition-colors">-</button>
              <span className="flex-1 text-center text-sm font-bold">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-full flex items-center justify-center hover:bg-zinc-100 transition-colors">+</button>
            </div>
          </div>

          <Button onClick={handleAddToCart} className="w-full h-14 bg-zinc-900 hover:bg-zinc-800 text-white rounded-none text-sm font-bold uppercase tracking-widest transition-all">
            THÊM VÀO GIỎ HÀNG
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;