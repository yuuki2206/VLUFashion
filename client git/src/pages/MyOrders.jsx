// @ts-nocheck
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';

const MyOrders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchMyOrders = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/orders/user/${user._id}`);
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi tải đơn hàng:", error);
        setLoading(false);
      }
    };
    fetchMyOrders();
  }, [user, navigate]);

  if (loading) return <div className="text-center mt-20 font-bold uppercase tracking-widest text-zinc-500">Đang tải lịch sử...</div>;

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-black uppercase tracking-tighter text-zinc-900 mb-8 pb-4 border-b">
        Đơn hàng của tôi
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-zinc-50 border border-dashed border-zinc-200 rounded-sm">
          <Package size={48} className="mx-auto text-zinc-300 mb-4" />
          <p className="font-bold text-zinc-500 uppercase tracking-widest mb-4">Bạn chưa có đơn hàng nào!</p>
          <Link to="/" className="inline-block px-6 py-3 bg-zinc-900 text-white text-sm font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors">
            MUA SẮM NGAY
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="border border-zinc-200 rounded-sm bg-white overflow-hidden shadow-sm">
              <div className="bg-zinc-50 p-4 border-b border-zinc-200 flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Mã đơn: <span className="text-zinc-900 font-mono">#{order._id.substring(order._id.length - 8).toUpperCase()}</span></p>
                  <p className="text-xs text-zinc-500 mt-1">Đặt ngày: {new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                </div>
                <div>
                  <span className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-full 
                    ${order.status === 'Chờ xác nhận' ? 'bg-yellow-100 text-yellow-700' : 
                      order.status === 'Đang giao' ? 'bg-blue-100 text-blue-700' : 
                      order.status === 'Đã giao' ? 'bg-green-100 text-green-700' : 
                      'bg-red-100 text-red-700'}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-4">
                {order.orderItems.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-center">
                    <img src={item.image} alt={item.name} className="w-16 h-20 object-cover bg-zinc-100 rounded-sm" />
                    <div className="flex-1">
                      <p className="font-bold text-sm text-zinc-900">{item.name}</p>
                      <p className="text-xs text-zinc-500 mt-1">Màu: {item.color} | Size: {item.size}</p>
                      <p className="font-bold text-sm text-zinc-900 mt-1">x {item.qty}</p>
                    </div>
                    <p className="font-bold text-red-600">{(item.price * item.qty).toLocaleString('vi-VN')} ₫</p>
                  </div>
                ))}
              </div>

              <div className="bg-zinc-50 p-4 border-t border-zinc-200 flex justify-between items-center">
                <span className="font-bold uppercase tracking-widest text-xs text-zinc-500">Tổng thanh toán:</span>
                <span className="font-black text-xl text-red-600">{order.totalPrice.toLocaleString('vi-VN')} ₫</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;