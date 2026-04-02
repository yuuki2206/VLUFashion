// @ts-nocheck
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from "@/components/ui/button";

const Checkout = () => {
  const { cart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // State thông tin giao hàng
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // 1. Bảo vệ trang: Chưa đăng nhập thì đá về Login
  useEffect(() => {
    if (!user) {
      alert("Vui lòng đăng nhập để tiến hành đặt hàng!");
      navigate('/login');
    } else {
      setFullName(user.name); // Tự động điền sẵn tên User
    }
  }, [user, navigate]);

  // 2. Nếu giỏ hàng trống thì đá về trang chủ
  useEffect(() => {
    if (cart.length === 0) {
      navigate('/');
    }
  }, [cart, navigate]);

  // Tính tổng tiền
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Xử lý chốt đơn
  const submitOrderHandler = async (e) => {
    e.preventDefault();
    try {
      // Gom cục dữ liệu chuẩn bị gửi Backend
      const orderData = {
        user: user._id,
        orderItems: cart.map(item => ({
          name: item.name,
          qty: item.quantity,
          image: item.image,
          price: item.price,
          product: item._id,
          
          // ĐÃ BỔ SUNG MÀU VÀ SIZE
          color: item.color, 
          size: item.size
        })),
        shippingAddress: { fullName, phone, address },
        totalPrice
      };

      // Gửi xuống Backend
      await axios.post('http://localhost:5000/api/orders', orderData);
      
      alert('🎉 Đặt hàng thành công! (Mã vận chuyển COD)');
      // Đáng lẽ chỗ này sẽ gọi hàm clearCart() để xóa giỏ hàng, tạm thời mình cho về trang chủ trước
      navigate('/');
      window.location.reload(); // Reset lại giỏ hàng (Cách chữa cháy nhanh)
      
    } catch (error) {
      // ĐÃ BỔ SUNG BẮT MẠCH LỖI TỪ BACKEND
      const errorMsg = error.response?.data?.message || error.message;
      alert('🚨 Lỗi Backend: ' + errorMsg);
      console.error("Chi tiết lỗi:", error);
    }
  };

  if (!user || cart.length === 0) return null; // Tránh nháy giao diện khi đang bẻ lái

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-black uppercase tracking-tighter text-zinc-900 mb-8 pb-4 border-b">
        Thanh toán & Giao hàng
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* CỘT TRÁI: FORM ĐIỀN THÔNG TIN */}
        <div className="md:w-2/3">
          <div className="bg-zinc-50 p-6 rounded-sm border border-zinc-200">
            <h2 className="text-xl font-bold uppercase mb-6 text-zinc-900 tracking-widest text-sm">Thông tin nhận hàng</h2>
            
            <form onSubmit={submitOrderHandler} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Người nhận</label>
                <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full border p-3 focus:border-zinc-900 focus:outline-none rounded-sm bg-white" placeholder="Nguyễn Văn A" />
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Số điện thoại</label>
                <input type="text" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border p-3 focus:border-zinc-900 focus:outline-none rounded-sm bg-white" placeholder="0909..." />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Địa chỉ giao hàng cụ thể</label>
                <textarea required rows="3" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border p-3 focus:border-zinc-900 focus:outline-none rounded-sm bg-white" placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện..."></textarea>
              </div>

              <div className="pt-4 border-t border-zinc-200 mt-6">
                <Button type="submit" className="w-full h-14 bg-zinc-900 hover:bg-zinc-800 text-white rounded-none text-sm font-bold uppercase tracking-widest transition-all">
                  ĐẶT HÀNG (THANH TOÁN KHI NHẬN HÀNG)
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
        <div className="md:w-1/3">
          <div className="border border-zinc-200 p-6 rounded-sm sticky top-24">
            <h2 className="text-xl font-bold uppercase mb-6 text-zinc-900 tracking-widest text-sm border-b pb-4">Tóm tắt đơn hàng</h2>
            
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
              {cart.map((item, index) => (
                <div key={index} className="flex gap-4 items-center">
                  <img src={item.image} alt={item.name} className="w-16 h-20 object-cover bg-zinc-100 rounded-sm" />
                  <div className="flex-1">
                    <p className="font-bold text-sm text-zinc-900 line-clamp-1">{item.name}</p>
                    <p className="text-xs text-zinc-500 mt-1">SL: {item.quantity} | {item.size} | {item.color}</p>
                    <p className="font-bold text-red-600 text-sm mt-1">{item.price?.toLocaleString('vi-VN')} ₫</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-zinc-200 pt-4 flex justify-between items-center">
              <span className="font-bold uppercase tracking-widest text-sm text-zinc-500">Tổng cộng:</span>
              <span className="font-black text-xl text-red-600">{totalPrice.toLocaleString('vi-VN')} ₫</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;