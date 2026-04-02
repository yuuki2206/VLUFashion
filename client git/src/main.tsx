// @ts-nocheck
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// BẮT BUỘC PHẢI CÓ DÒNG NÀY ĐỂ NHẬP KHO CHỨA VÀO
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* KHO CHỨA PHẢI BỌC NGOÀI CÙNG NHƯ THẾ NÀY */}
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>,
)