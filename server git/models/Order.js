import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  orderItems: [
    {
      name: { type: String, required: true },
      qty: { type: Number, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true },
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      
      // BỔ SUNG 2 DÒNG NÀY ĐỂ ADMIN BIẾT ĐƯỜNG MÀ GIAO HÀNG:
      color: { type: String, required: true }, 
      size: { type: String, required: true }   
    }
  ],
  
  shippingAddress: {
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
  },
  
  totalPrice: { type: Number, required: true },
  status: { type: String, default: 'Chờ xác nhận' },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);