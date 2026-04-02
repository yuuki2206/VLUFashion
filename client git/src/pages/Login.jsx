// @ts-nocheck
// 1. Nhớ import thêm useEffect
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '../context/AuthContext'; 

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  
  // 2. Lấy thêm biến 'user' từ AuthContext ra để kiểm tra
  const { user, login, register } = useAuth(); 

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');

  // 🚀 BỔ SUNG: KIỂM TRA NẾU ĐÃ ĐĂNG NHẬP THÌ ĐÁ BAY RA KHỎI TRANG NÀY
  useEffect(() => {
    if (user) {
      if (user.isAdmin) {
        navigate('/admin'); // Admin thì về thẳng trang Quản trị
      } else {
        navigate('/'); // Khách thì về Trang chủ
      }
    }
  }, [user, navigate]); // Cứ khi nào 'user' thay đổi là cái hook này chạy lại

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLogin) {
      const res = await login(email, password);
      if (res.success) {
        alert("🎉 Đăng nhập thành công!");
        // Lưu ý: Không cần navigate ở đây nữa vì cái useEffect ở trên sẽ tự động làm việc đó!
      } else {
        alert("🚨 " + res.message); 
      }
    } else {
      if (password !== confirmPassword) return alert("🚨 Mật khẩu xác nhận không khớp!");
      
      const res = await register(name, email, password, adminCode);
      if (res.success) {
        alert(" Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.");
        setIsLogin(true); 
        setPassword('');
        setConfirmPassword('');
        setAdminCode('');
      } else {
        alert(" " + res.message);
      }
    }
  };

  return (
    <div className="container mx-auto p-6 min-h-[80vh] flex items-center justify-center bg-white">
      <div className="w-full max-w-md bg-white p-8 border border-zinc-200 rounded-sm shadow-sm">
        <h2 className="text-2xl font-black uppercase text-center mb-8 text-zinc-900 tracking-tight">
          {isLogin ? 'Đăng nhập' : 'Đăng ký tài khoản'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Họ và Tên</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-zinc-300 rounded-sm px-4 py-3 focus:outline-none focus:border-zinc-900 transition-colors" placeholder="Nguyễn Văn Long" />
            </div>
          )}
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-zinc-300 rounded-sm px-4 py-3 focus:outline-none focus:border-zinc-900 transition-colors" placeholder="email@vlu.edu.vn" />
          </div>
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Mật khẩu</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-zinc-300 rounded-sm px-4 py-3 focus:outline-none focus:border-zinc-900 transition-colors" placeholder="••••••••" />
          </div>

          {!isLogin && (
            <>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Xác nhận mật khẩu</label>
                <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full border border-zinc-300 rounded-sm px-4 py-3 focus:outline-none focus:border-zinc-900 transition-colors" placeholder="••••••••" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Mã Quản Trị Viên (Nếu có)</label>
                <input type="password" value={adminCode} onChange={(e) => setAdminCode(e.target.value)} className="w-full border border-zinc-300 rounded-sm px-4 py-3 focus:outline-none focus:border-zinc-900 transition-colors bg-zinc-50" placeholder="Mã bí mật..." />
              </div>
            </>
          )}

          <Button type="submit" className="w-full h-14 bg-zinc-900 hover:bg-zinc-800 text-white rounded-none font-bold uppercase tracking-widest transition-all mt-2">
            {isLogin ? 'ĐĂNG NHẬP' : 'TẠO TÀI KHOẢN'}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-zinc-500 border-t border-zinc-100 pt-6">
          {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
          <button type="button" onClick={() => setIsLogin(!isLogin)} className="font-bold text-zinc-900 hover:underline focus:outline-none ml-1">
            {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;