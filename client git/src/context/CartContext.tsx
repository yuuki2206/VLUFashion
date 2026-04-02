// @ts-nocheck
import { createContext, useState, useContext } from 'react';

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (newItem) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item._id === newItem._id && item.size === newItem.size && item.color === newItem.color
      );
      if (existingItemIndex >= 0) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += newItem.quantity;
        return updatedCart;
      } else {
        return [...prevCart, newItem];
      }
    });
  };

  const removeFromCart = (indexToRemove) => {
    setCart((prevCart) => prevCart.filter((_, index) => index !== indexToRemove));
  };


  const updateQuantity = (indexToUpdate, newQuantity) => {
    if (newQuantity < 1) return;
    setCart((prevCart) => {
      const updatedCart = [...prevCart];
      updatedCart[indexToUpdate].quantity = newQuantity;
      return updatedCart;
    });
  };

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
  
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, totalItems }}>
      {children}
    </CartContext.Provider>
  );
};