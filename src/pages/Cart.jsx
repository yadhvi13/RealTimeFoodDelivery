import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, CreditCard, ChevronRight, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const [success, setSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { cartItems, updateQty, removeFromCart, placeOrder } = useOrder();
  const { user } = useAuth();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.price.toString().replace('$', '')) * item.qty), 0);
  const delivery = cartItems.length > 0 ? 2.50 : 0;
  const total = subtotal + delivery;

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setIsProcessing(true);
    
    // Simulate real-world network delay for premium feel
    setTimeout(async () => {
      const isSuccess = await placeOrder(user ? user.id : null);
      setIsProcessing(false);
      if (isSuccess) {
        setSuccess(true);
      }
    }, 1500);
  };

  return (
    <motion.div 
      className="page-container cart-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div 
            key="success"
            className="success-overlay premium-glass flex-center"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="success-content text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
              >
                <CheckCircle size={80} className="success-icon" color="#FF6B00" />
              </motion.div>
              <h2>Order Confirmed.</h2>
              <p className="text-secondary">Your food is securely tracked and being prepared.</p>
              <button className="btn-primary mt-4" onClick={() => navigate('/tracking')}>Track Live Request</button>
            </div>
          </motion.div>
        ) : cartItems.length === 0 ? (
          <motion.div 
            key="empty"
            className="empty-cart-state flex-center flex-column"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p className="text-secondary">Discover trending premium menus and satisfy your cravings.</p>
            <button className="btn-primary mt-4 flex-center gap-2" onClick={() => navigate('/restaurants')}>
              Explore Menus <ArrowRight size={18} />
            </button>
          </motion.div>
        ) : (
          <div key="cart-content" className="cart-layout">
            <motion.div 
              className="cart-items-section"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h2 className="mb-4">Review Order</h2>
              
              <div className="items-list">
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <motion.div 
                      layout
                      key={item.id} 
                      className="cart-item premium-glass"
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, x: -20, filter: 'blur(4px)' }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="item-visual-wrapper">
                        <div className="item-visual" style={{ backgroundImage: `url(${item.img})` }}></div>
                      </div>
                      
                      <div className="item-details">
                        <h3>{item.name}</h3>
                        <p className="item-variant text-secondary">{item.cat} • {item.type === 'veg' ? 'Veg' : 'Non-Veg'}</p>
                        <p className="price-tag">${parseFloat(item.price).toFixed(2)}</p>
                      </div>

                      <div className="item-actions flex-center">
                        <div className="qty-pill premium-glass flex-center">
                          <button onClick={() => updateQty(item.id, -1)}>-</button>
                          <span>{item.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)}>+</button>
                        </div>
                        <motion.button 
                          className="btn-delete premium-glass flex-center" 
                          whileTap={{ rotate: [0, -10, 10, -10, 10, 0] }}
                          transition={{ duration: 0.3 }}
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.div 
              className="checkout-section"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              <div className="sticky-summary premium-glass elevated-glass">
                <h3>Summary</h3>
                
                <div className="price-breakdown">
                  <div className="flex-between line-item">
                    <span className="text-secondary">Subtotal</span>
                    <motion.span layout="position">${subtotal.toFixed(2)}</motion.span>
                  </div>
                  <div className="flex-between line-item">
                    <span className="text-secondary">Delivery Fee</span>
                    <motion.span layout="position">${delivery.toFixed(2)}</motion.span>
                  </div>
                  
                  <div className="soft-divider"></div>
                  
                  <div className="flex-between total-row">
                    <span>Total</span>
                    <motion.span layout="position" className="total-price">${total.toFixed(2)}</motion.span>
                  </div>
                </div>

                <div className="payment-card-input premium-glass flex-between mt-4">
                  <div className="flex-center gap-2">
                    <CreditCard size={20} className="icon-orange" />
                    <span className="text-secondary">•••• 4242</span>
                  </div>
                  <ChevronRight size={18} className="text-secondary" />
                </div>

                <motion.button 
                  className="btn-primary btn-pay w-100 flex-center mt-4" 
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                      <Loader2 size={20} />
                    </motion.div>
                  ) : (
                    <span>Pay ${total.toFixed(2)}</span>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Cart;
