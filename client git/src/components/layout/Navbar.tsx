// @ts-nocheck
import { Search, ShoppingBag, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useState, useRef, useEffect } from "react";

const Navbar = () => {
  const { totalItems } = useCart() || { totalItems: 0 };
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [navSearch, setNavSearch] = useState('');

  const handleNavSearch = (e) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/products?search=${navSearch}`);
      setNavSearch('');
    } else {
      navigate(`/products`); 
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => { 
    logout(); 
    setIsDropdownOpen(false); 
    alert("Đã đăng xuất!"); 
    navigate('/'); 
  };

  return (
    <nav className="border-b sticky top-0 bg-white z-50">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* LOGO */}
        <div className="flex-shrink-0">
          <Link to="/" className="text-2xl font-black tracking-tighter text-zinc-900">
            VLU FASHION
          </Link>
        </div>

        {/* MENU CHÍNH  */}
        <div className="hidden md:flex flex-1 justify-center">
          <ul className="flex space-x-8 text-xs font-bold uppercase tracking-widest text-zinc-900">
            <li><Link to="/" className="hover:text-zinc-500 transition-colors">TRANG CHỦ</Link></li>
            <li><Link to="/products" className="hover:text-zinc-500 transition-colors">SẢN PHẨM</Link></li>
            <li><Link to="/about" className="hover:text-zinc-500 transition-colors">LIÊN HỆ</Link></li>
          </ul>
        </div>

        {/* CÁC ICON BÊN PHẢI */}
        <div className="flex items-center space-x-6 text-zinc-900 flex-shrink-0">
          <form onSubmit={handleNavSearch} className="hidden lg:flex items-center border border-zinc-200 rounded-full px-4 py-2 bg-zinc-50 focus-within:border-zinc-900 focus-within:bg-white transition-colors">
            <input 
              type="text" 
              placeholder="Tìm sản phẩm..." 
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-32 focus:w-48 transition-all duration-300 text-zinc-900 placeholder:text-zinc-400"
            />
            <button type="submit" className="text-zinc-500 hover:text-zinc-900 transition-colors ml-2">
              <Search size={16} />
            </button>
          </form>
          
          {user ? (
            <div className="relative py-4" ref={dropdownRef}>
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="hover:text-zinc-500 transition-colors focus:outline-none flex items-center">
                <User size={20} />
              </button>
              
              {/* MENU DROPDOWN CỦA USER */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-14 mt-1 w-64 bg-white border border-zinc-200 shadow-xl rounded-sm transition-all z-50">
                  <div className="p-4 border-b border-zinc-100 flex items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center border border-zinc-200"><User size={20} className="text-zinc-500" /></div>
                    <div className="overflow-hidden">
                      <p className="font-bold text-sm text-zinc-900 truncate">{user.name}</p>
                      <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="p-2 space-y-1">
                    {/* BỔ SUNG: NÚT ĐƠN HÀNG CỦA TÔI */}
                    <Link 
                      to="/my-orders" 
                      onClick={() => setIsDropdownOpen(false)} // Bấm xong tự động đóng menu
                      className="block w-full text-left px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 rounded-sm font-medium"
                    >
                      Đơn hàng của tôi
                    </Link>

                    {/* NÚT ĐĂNG XUẤT */}
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-red-600 rounded-sm font-medium">
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="hover:text-zinc-500 transition-colors"><User size={20} /></Link>
          )}

          {/* GIỎ HÀNG */}
          <Link to="/cart" className="hover:text-zinc-500 transition-colors relative">
            <ShoppingBag size={20} />
            {totalItems > 0 && <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{totalItems}</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;