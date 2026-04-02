// @ts-nocheck
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus } from "lucide-react"; // Import thêm icon cộng trừ

const Cart = () => {
  // Rút các hàm Xóa và Sửa từ Kho chung ra xài
  const { cart, removeFromCart, updateQuantity } = useCart();

  const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  // NẾU GIỎ HÀNG TRỐNG
  if (cart.length === 0) {
    return (
      <div className="container mx-auto p-6 min-h-[70vh] flex flex-col items-center justify-center bg-white">
        <h1 className="text-2xl font-black uppercase mb-4 text-zinc-900">Giỏ hàng của bạn</h1>
        <p className="text-zinc-500 mb-8">Hiện chưa có sản phẩm nào trong giỏ hàng.</p>
        <Link to="/">
          <Button className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-none px-8 h-12 font-bold uppercase tracking-widest transition-all">
            TIẾP TỤC MUA SẮM
          </Button>
        </Link>
      </div>
    );
  }

  // NẾU CÓ ĐỒ TRONG GIỎ
  return (
    <div className="container mx-auto p-6 min-h-screen bg-white">
      <h1 className="text-2xl font-black uppercase mb-8 text-zinc-900">Giỏ hàng của bạn</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* CỘT TRÁI: Danh sách sản phẩm */}
        <div className="lg:w-2/3 space-y-6">
          {cart.map((item, index) => (
            <div key={index} className="flex items-center gap-6 border-b border-zinc-100 pb-6">
              <img src={item.image} alt={item.name} className="w-24 h-32 object-cover bg-gray-100 rounded-sm" />
              
              <div className="flex-1 space-y-1">
                <h3 className="font-bold text-sm uppercase text-zinc-900">{item.name}</h3>
                <p className="text-xs text-zinc-500">Màu: {item.color} | Size: {item.size}</p>
                <p className="text-sm font-bold text-red-600">{item.price.toLocaleString('vi-VN')} ₫</p>
              </div>

              <div className="flex items-center gap-6">
                
                {/* === CỤM NÚT SỬA SỐ LƯỢNG (+ / -) === */}
                <div className="flex items-center border border-zinc-200 rounded-md h-9">
                  <button 
                    onClick={() => updateQuantity(index, item.quantity - 1)}
                    className="w-8 h-full flex items-center justify-center hover:bg-zinc-100 transition-colors text-zinc-500"
                  >
                    <Minus size={14} />
                  </button>
                  
                  <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                  
                  <button 
                    onClick={() => updateQuantity(index, item.quantity + 1)}
                    className="w-8 h-full flex items-center justify-center hover:bg-zinc-100 transition-colors text-zinc-500"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* === NÚT XÓA SẢN PHẨM KHỎI GIỎ === */}
                <button 
                  onClick={() => {
                    if(window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
                      removeFromCart(index);
                    }
                  }}
                  className="text-zinc-400 hover:text-red-500 transition-colors p-2"
                >
                  <Trash2 size={18} />
                </button>

              </div>
            </div>
          ))}
        </div>

        {/* CỘT PHẢI: Bảng tính tiền */}
        <div className="lg:w-1/3">
          <div className="bg-zinc-50 p-6 rounded-sm space-y-4 border border-zinc-100 sticky top-24">
            <h2 className="font-bold uppercase tracking-widest border-b border-zinc-200 pb-4 text-zinc-900">Đơn hàng</h2>
            
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Tạm tính ({cart.reduce((a, b) => a + b.quantity, 0)} sản phẩm)</span>
              <span className="font-bold text-zinc-900">{totalPrice.toLocaleString('vi-VN')} ₫</span>
            </div>
            
            <div className="flex justify-between text-lg border-t border-zinc-200 pt-4 mt-4">
              <span className="font-black text-zinc-900">TỔNG CỘNG</span>
              <span className="font-black text-red-600">{totalPrice.toLocaleString('vi-VN')} ₫</span>
            </div>


            <Link to="/checkout" className="block w-full mt-6">
              <Button className="w-full h-14 bg-zinc-900 hover:bg-zinc-800 text-white rounded-none font-bold uppercase tracking-widest transition-all">
                TIẾN HÀNH THANH TOÁN
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;