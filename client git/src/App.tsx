// @ts-nocheck
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer'; 
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login'; 
import Products from './pages/Products';
import Admin from './pages/Admin';
import MyOrders from './pages/MyOrders';

// Tạo một Component khung xương để kiểm tra URL xem đang ở đâu
const AppLayout = ({ children }) => {
  const location = useLocation();
  
  // Nếu đường dẫn bắt đầu bằng "/admin" thì biến này là TRUE
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      
      {!isAdminPage && <Navbar />}
      
      <div className="flex-grow">
        {children}
      </div>
      {!isAdminPage && <Footer />}
      
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} /> 
          <Route path="/login" element={<Login />} /> 
          <Route path="/products" element={<Products />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/my-orders" element={<MyOrders />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;