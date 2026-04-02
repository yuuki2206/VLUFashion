// @ts-nocheck
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Plus, Edit, Trash2, LogOut, UploadCloud, ArrowLeft, ShoppingCart } from 'lucide-react';

const Admin = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('products'); 
  const [orders, setOrders] = useState([]);

  const [products, setProducts] = useState([]);
  const [dbCategories, setDbCategories] = useState([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editProductId, setEditProductId] = useState(null);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [colors, setColors] = useState('');
  const [sizes, setSizes] = useState('');

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/products');
      setProducts(data);
    } catch (error) {
      console.error("Lỗi tải sản phẩm", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/categories');
      setDbCategories(data);
    } catch (error) {
      console.error("Lỗi tải danh mục", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/orders');
      setOrders(data);
    } catch (error) {
      console.error("Lỗi tải đơn hàng", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories(); 
    fetchOrders(); 
  }, []);

  if (!user || !user.isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-bold text-red-600">🚨 BẠN KHÔNG CÓ QUYỀN TRUY CẬP TRANG NÀY!</h1>
        <Link to="/" className="text-blue-600 hover:underline">Quay lại Trang chủ</Link>
      </div>
    );
  }

  const uploadFileHandler = async (e) => { 
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    try {
      const { data } = await axios.post('http://localhost:5000/api/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' }});
      setImage(data); setUploading(false);
    } catch (error) {
      console.error(error); setUploading(false); alert('Lỗi upload ảnh!');
    }
  };

  const openAddModal = () => {
    setEditProductId(null); setName(''); setPrice(''); setDescription(''); setImage(''); setCategory(''); setColors(''); setSizes(''); setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditProductId(product._id); setName(product.name); setPrice(product.basePrice); setDescription(product.description || ''); setImage(product.images[0]); setCategory(product.category || ''); setColors(product.colors ? product.colors.join(', ') : ''); setSizes(product.sizes ? product.sizes.join(', ') : ''); setIsModalOpen(true);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!image) return alert("Vui lòng tải ảnh lên!");
    if (!category) return alert("Vui lòng chọn danh mục!");
    try {
      const payload = { name, basePrice: Number(price), description, image, category, colors, sizes };
      if (editProductId) {
        await axios.put(`http://localhost:5000/api/products/${editProductId}`, payload);
        alert('🎉 Đã cập nhật!');
      } else {
        await axios.post('http://localhost:5000/api/products', payload);
        alert('🎉 Đã thêm!');
      }
      setIsModalOpen(false); fetchProducts();
    } catch (error) { alert('Lỗi xử lý!'); }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Xóa sản phẩm này?')) {
      try { await axios.delete(`http://localhost:5000/api/products/${id}`); fetchProducts(); } catch (error) { alert('Lỗi khi xóa!'); }
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, { status: newStatus });
      fetchOrders(); 
    } catch (error) {
      alert('Lỗi khi cập nhật trạng thái đơn hàng!');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex relative">
      <div className="w-64 bg-zinc-900 text-white p-6 flex flex-col fixed h-full z-10">
        <h2 className="text-xl font-black tracking-widest uppercase border-b border-zinc-700 pb-4 mb-6">VLU ADMIN</h2>
        <nav className="flex-1 space-y-2">
          
          <button 
            onClick={() => setActiveTab('products')} 
            className={`flex items-center gap-3 px-4 py-3 rounded-md font-bold text-sm w-full text-left transition-colors ${activeTab === 'products' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
          >
            <Package size={18} /> Sản phẩm
          </button>

          <button 
            onClick={() => setActiveTab('orders')} 
            className={`flex items-center gap-3 px-4 py-3 rounded-md font-bold text-sm w-full text-left transition-colors ${activeTab === 'orders' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
          >
            <ShoppingCart size={18} /> Đơn hàng
            {orders.length > 0 && <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{orders.length}</span>}
          </button>

          <Link to="/" className="flex items-center gap-3 text-zinc-400 hover:bg-zinc-800 hover:text-white px-4 py-3 rounded-md font-bold text-sm w-full text-left transition-colors mt-4">
            <ArrowLeft size={18} /> Xem cửa hàng
          </Link>
        </nav>
        <div className="border-t border-zinc-700 pt-4 mt-auto">
          <p className="text-xs text-zinc-400 mb-4">Xin chào, {user.name}</p>
          <button onClick={() => { logout(); navigate('/'); }} className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 w-full transition-colors">
            <LogOut size={16} /> Đăng xuất
          </button>
        </div>
      </div>

      <div className="flex-1 p-10 ml-64">
        
        {activeTab === 'products' && (
          <>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-black text-zinc-900 uppercase tracking-tighter">Quản lý Sản phẩm</h1>
              <button onClick={openAddModal} className="flex items-center gap-2 bg-zinc-900 text-white px-6 py-3 font-bold text-sm uppercase tracking-widest hover:bg-zinc-800 rounded-sm transition-colors">
                <Plus size={18} /> Thêm Sản Phẩm
              </button>
            </div>

            <div className="bg-white border border-zinc-200 rounded-sm shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-100 text-zinc-600 font-bold uppercase tracking-widest text-xs">
                  <tr>
                    <th className="p-4 w-24">Hình ảnh</th>
                    <th className="p-4">Tên sản phẩm</th>
                    <th className="p-4 w-40">Danh mục</th>
                    <th className="p-4 w-40">Giá bán</th>
                    <th className="p-4 text-center w-32">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-zinc-50 transition-colors">
                      <td className="p-4"><img src={product.images[0]} alt={product.name} className="w-12 h-16 object-cover bg-zinc-200 rounded-sm" /></td>
                      <td className="p-4 font-bold text-zinc-900 line-clamp-2">{product.name}</td>
                      <td className="p-4 text-zinc-600">{product.category || 'N/A'}</td>
                      <td className="p-4 text-red-600 font-bold">{product.basePrice?.toLocaleString('vi-VN')} ₫</td>
                      <td className="p-4 text-center space-x-4">
                        <button onClick={() => openEditModal(product)} className="text-blue-600 hover:text-blue-800 transition-colors"><Edit size={18} /></button>
                        <button onClick={() => deleteHandler(product._id)} className="text-red-600 hover:text-red-800 transition-colors"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ========================================================================= */}
        {/* ĐÃ CẬP NHẬT: TAB ĐƠN HÀNG VỚI 3 THẺ THỐNG KÊ DOANH THU */}
        {/* ========================================================================= */}
        {activeTab === 'orders' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-black text-zinc-900 uppercase tracking-tighter">Quản lý Đơn hàng</h1>
            </div>

            {/* THẺ THỐNG KÊ */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-sm border border-zinc-200 shadow-sm flex flex-col justify-center items-center">
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Tổng số đơn hàng</p>
                <p className="text-3xl font-black text-zinc-900">{orders.length}</p>
              </div>
              <div className="bg-white p-6 rounded-sm border border-zinc-200 shadow-sm flex flex-col justify-center items-center">
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Tổng doanh thu</p>
                <p className="text-3xl font-black text-red-600">
                  {orders.filter(o => o.status !== 'Đã hủy').reduce((sum, order) => sum + (order.totalPrice || 0), 0).toLocaleString('vi-VN')} ₫
                </p>
              </div>
              <div className="bg-white p-6 rounded-sm border border-zinc-200 shadow-sm flex flex-col justify-center items-center">
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Khách hàng</p>
                <p className="text-3xl font-black text-blue-600">
                  {new Set(orders.map(o => o.user?._id || o.user)).size}
                </p>
              </div>
            </div>

            {/* BẢNG DANH SÁCH ĐƠN HÀNG */}
            <div className="bg-white border border-zinc-200 rounded-sm shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-100 text-zinc-600 font-bold uppercase tracking-widest text-xs">
                  <tr>
                    <th className="p-4 w-40">Mã ĐH / Ngày</th>
                    <th className="p-4">Khách hàng</th>
                    <th className="p-4">Sản phẩm</th>
                    <th className="p-4 w-32 text-right">Tổng tiền</th>
                    <th className="p-4 w-48 text-center">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-zinc-50 transition-colors items-start">
                      
                      <td className="p-4 align-top">
                        <p className="font-mono text-xs text-zinc-500 mb-1">#{order._id.substring(order._id.length - 6)}</p>
                        <p className="font-bold text-zinc-900">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                      </td>

                      <td className="p-4 align-top">
                        <p className="font-bold text-zinc-900">{order.shippingAddress?.fullName}</p>
                        <p className="text-zinc-600 mt-1">{order.shippingAddress?.phone}</p>
                        <p className="text-xs text-zinc-500 mt-1 line-clamp-2" title={order.shippingAddress?.address}>{order.shippingAddress?.address}</p>
                      </td>

                      <td className="p-4 align-top">
                        <div className="space-y-2">
                          {order.orderItems?.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                              <img src={item.image} className="w-8 h-10 object-cover rounded-sm border" />
                              <div className="text-xs">
                                <p className="font-bold text-zinc-900 line-clamp-1">{item.name}</p>
                                <p className="text-zinc-500">SL: {item.qty} | {item.size} | {item.color}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="p-4 align-top text-right">
                        <p className="font-bold text-red-600">{order.totalPrice?.toLocaleString('vi-VN')} ₫</p>
                        <p className="text-[10px] font-bold text-zinc-400 mt-1">COD</p>
                      </td>

                      <td className="p-4 align-top text-center">
                        <select 
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                          className={`border p-2 rounded-sm text-xs font-bold uppercase tracking-widest w-full outline-none cursor-pointer transition-colors
                            ${order.status === 'Chờ xác nhận' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                              order.status === 'Đang giao' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                              order.status === 'Đã giao' ? 'bg-green-50 text-green-700 border-green-200' : 
                              'bg-red-50 text-red-700 border-red-200'}`}
                        >
                          <option value="Chờ xác nhận">⏳ Chờ xác nhận</option>
                          <option value="Đang giao">🚚 Đang giao</option>
                          <option value="Đã giao">✅ Đã giao</option>
                          <option value="Đã hủy">❌ Đã hủy</option>
                        </select>
                      </td>

                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-zinc-500 font-bold uppercase tracking-widest">Chưa có đơn hàng nào!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm shadow-2xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
             {/* ... (Toàn bộ Form Modal của bạn mình giữ nguyên không đụng chạm) ... */}
            <h2 className="text-xl font-black uppercase mb-6 text-zinc-900 border-b pb-4">
              {editProductId ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
            </h2>
            <form onSubmit={submitHandler} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Tên sản phẩm</label><input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full border p-2 focus:border-zinc-900 focus:outline-none rounded-sm" /></div>
                <div><label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Giá bán (VND)</label><input type="number" required value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border p-2 focus:border-zinc-900 focus:outline-none rounded-sm" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Danh mục</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border p-2 focus:border-zinc-900 focus:outline-none rounded-sm bg-white" required>
                    <option value="" disabled>-- Chọn danh mục --</option>
                    <optgroup label="  THỜI TRANG NAM">
                      <option value="Áo Nam">Áo Nam</option>
                      <option value="Quần Nam">Quần Nam</option>
                    </optgroup>
                    <optgroup label=" THỜI TRANG NỮ">
                      <option value="Áo Nữ">Áo Nữ</option>
                      <option value="Quần Nữ">Quần Nữ</option>
                      <option value="Váy Nữ">Váy Nữ</option>
                    </optgroup>
                  </select>
                </div>
                <div><label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Kích cỡ (Cách dấu phẩy)</label><input type="text" placeholder="VD: S, M, L, XL" value={sizes} onChange={(e) => setSizes(e.target.value)} className="w-full border p-2 focus:border-zinc-900 focus:outline-none rounded-sm" /></div>
              </div>
              <div><label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Màu sắc (Cách dấu phẩy)</label><input type="text" placeholder="VD: Đen, Trắng, Xanh Navy" value={colors} onChange={(e) => setColors(e.target.value)} className="w-full border p-2 focus:border-zinc-900 focus:outline-none rounded-sm" /></div>
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Hình ảnh sản phẩm</label>
                <div className="border-2 border-dashed border-zinc-300 p-4 text-center relative hover:bg-zinc-50 transition-colors cursor-pointer rounded-sm">
                  <input type="file" onChange={uploadFileHandler} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <UploadCloud size={32} className="mx-auto text-zinc-400 mb-2" />
                  {uploading ? <p className="text-sm font-bold text-blue-500">Đang tải ảnh lên...</p> : <p className="text-sm text-zinc-500">Bấm vào đây tải ảnh</p>}
                </div>
                {image && <img src={image} alt="Preview" className="mt-2 h-24 object-cover rounded-sm border" />}
              </div>
              <div><label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Mô tả chi tiết</label><textarea required rows="3" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border p-2 focus:border-zinc-900 focus:outline-none rounded-sm"></textarea></div>
              <div className="flex gap-4 pt-4 border-t mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-zinc-200 hover:bg-zinc-300 font-bold uppercase text-sm rounded-sm transition-colors">Hủy</button>
                <button type="submit" className="flex-1 py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold uppercase text-sm rounded-sm transition-colors">{editProductId ? 'Cập nhật' : 'Lưu sản phẩm'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;