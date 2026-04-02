// @ts-nocheck
import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  // ĐĂNG NHẬP
  const login = async (email, password) => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/users/login', { email, password });
      
      // BỔ SUNG: In ra console để bắt lỗi xem Backend có trả về isAdmin không!
      console.log("🔎 Dữ liệu Backend trả về lúc Đăng nhập:", data);

      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data)); 
      
      // Lấy isAdmin từ Backend trả ra cho hàm login dùng
      return { success: true, isAdmin: data.isAdmin }; 
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi đăng nhập!' };
    }
  };

  // ĐĂNG KÝ
  const register = async (name, email, password, adminCode) => {
    try {
      // Ném adminCode lên Backend
      await axios.post('http://localhost:5000/api/users/register', { name, email, password, adminCode });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi đăng ký!' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};