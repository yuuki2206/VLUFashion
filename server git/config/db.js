import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Kết nối thành công: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Lỗi kết nối MongoDB: ${error.message}`);
    process.exit(1); // Dừng server nếu lỗi DB
  }
};

export default connectDB;