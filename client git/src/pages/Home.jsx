// @ts-nocheck
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, RefreshCw, HeadphonesIcon } from 'lucide-react'; // Thêm icon cho phần chính sách

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products');
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div className="text-center mt-20 font-bold uppercase tracking-widest text-zinc-500">Đang tải sản phẩm...</div>;

  return (
    <div className="bg-white min-h-screen">
      
      {/* === 1. HERO BANNER: ẢNH BÌA TO TRÀN MÀN HÌNH === */}
      <div className="relative w-full h-[70vh] bg-zinc-900 flex items-center justify-center overflow-hidden">
        {/* Ảnh nền */}
        <img 
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=2000" 
          alt="VLU Fashion Collection" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        
        {/* Nội dung trên Banner */}
        <div className="relative z-10 text-center space-y-6 px-4">
          <p className="text-white text-sm md:text-base font-bold tracking-[0.3em] uppercase">VLU Fashion 2026</p>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter drop-shadow-lg">
            Spring Collection
          </h1>
          <p className="text-zinc-200 text-lg max-w-lg mx-auto drop-shadow-md">
            Khám phá những thiết kế tối giản, thanh lịch và mang đậm dấu ấn cá nhân của bạn.
          </p>
          <a href="#product-list" className="inline-block mt-4 bg-white text-zinc-900 px-10 py-4 font-bold uppercase tracking-widest hover:bg-zinc-900 hover:text-white transition-all duration-300">
            MUA SẮM NGAY
          </a>
        </div>
      </div>

      {/* === 2. POLICY: CHÍNH SÁCH CỬA HÀNG === */}
      <div className="border-b border-zinc-100 py-10 bg-zinc-50">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center space-y-3">
            <Truck size={32} strokeWidth={1.5} className="text-zinc-900" />
            <h3 className="font-bold uppercase tracking-widest text-sm text-zinc-900">Giao hàng toàn quốc</h3>
            <p className="text-xs text-zinc-500">Miễn phí vận chuyển cho đơn hàng từ 500k</p>
          </div>
          <div className="flex flex-col items-center space-y-3">
            <RefreshCw size={32} strokeWidth={1.5} className="text-zinc-900" />
            <h3 className="font-bold uppercase tracking-widest text-sm text-zinc-900">Đổi trả dễ dàng</h3>
            <p className="text-xs text-zinc-500">Hỗ trợ đổi size/mẫu trong vòng 7 ngày</p>
          </div>
          <div className="flex flex-col items-center space-y-3">
            <HeadphonesIcon size={32} strokeWidth={1.5} className="text-zinc-900" />
            <h3 className="font-bold uppercase tracking-widest text-sm text-zinc-900">Hỗ trợ 24/7</h3>
            <p className="text-xs text-zinc-500">Luôn sẵn sàng giải đáp mọi thắc mắc của bạn</p>
          </div>
        </div>
      </div>

      {/* === 3. DANH SÁCH SẢN PHẨM (GIỮ NGUYÊN CODE CARD CỦA BẠN) === */}
      <div id="product-list" className="container mx-auto p-6 mt-8">
        <main>
          <h2 className="text-2xl font-black mb-8 uppercase tracking-widest text-zinc-900 text-center">
            Sản phẩm mới nhất ({products.length})
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <Link to={`/product/${product._id}`} key={product._id} className="block group">
                <Card className="border-none shadow-none cursor-pointer bg-transparent h-full flex flex-col">
                  <CardHeader className="p-0 overflow-hidden rounded-sm bg-gray-100 relative">
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="w-full h-[450px] object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </CardHeader>
                  
                  <CardContent className="pt-4 px-0 flex-grow text-center">
                    <CardTitle className="text-sm font-semibold text-zinc-800 uppercase tracking-tight line-clamp-1 hover:text-zinc-500 transition-colors">
                      {product.name}
                    </CardTitle>
                    <div className="flex items-center justify-center mt-2 space-x-2">
                      <p className="text-base font-bold text-red-600">
                        {product.basePrice.toLocaleString('vi-VN')} ₫
                      </p>
                    </div>
                  </CardContent>

                  <CardFooter className="px-0 pt-2 mt-auto">
                    <Button className="w-full bg-zinc-900 hover:bg-zinc-700 text-white rounded-none h-11 text-xs font-bold uppercase tracking-widest transition-all">
                      Xem chi tiết
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </main>
      </div>

    </div>
  );
};

export default Home;