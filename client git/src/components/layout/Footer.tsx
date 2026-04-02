// @ts-nocheck
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-zinc-50 border-t border-zinc-200 py-10 mt-auto">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Cột trái: Logo */}
        <div className="text-2xl font-black tracking-tighter text-zinc-900">
          VLU FASHION
        </div>
        
        {/* Ở giữa: Bản quyền */}
        <div className="text-xs text-zinc-500 font-medium">
          © 2026 VLU Fashion. Tất cả các quyền được bảo lưu.
        </div>
        
        {/* Cột phải: Các link cơ bản */}
        <div className="flex space-x-6 text-xs font-bold uppercase tracking-widest text-zinc-500">
          <Link to="#" className="hover:text-zinc-900 transition-colors">Chính sách</Link>
          <Link to="#" className="hover:text-zinc-900 transition-colors">Điều khoản</Link>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;