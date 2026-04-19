import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const OrderContext = createContext();

export const useOrder = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);

  const addToCart = (item) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQty = (id, change) => {
    setCartItems(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = i.qty + change;
        return newQty > 0 ? { ...i, qty: newQty } : i;
      }
      return i;
    }));
  };

  const placeOrder = async (userId) => {
    if (cartItems.length === 0) return;
    const total = cartItems.reduce((sum, item) => sum + (parseFloat(item.price.toString().replace('$', '')) * item.qty), 0) + 2.50; // + delivery
    
    try {
      const res = await axios.post('http://localhost:5000/api/orders', {
        userId: userId || null, // in case guest
        items: cartItems,
        total: total.toFixed(2)
      });
      setActiveOrder({
        id: res.data._id,
        items: [...cartItems],
        total: total.toFixed(2),
        status: res.data.status,
        timestamp: Date.now(), 
      });
      setCartItems([]);
      return true;
    } catch (err) {
      console.error("Order Failed", err);
      return false;
    }
  };

  return (
    <OrderContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQty,
      placeOrder,
      activeOrder
    }}>
      {children}
    </OrderContext.Provider>
  );
};
