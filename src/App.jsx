import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Home from './pages/Home';
import RestaurantList from './pages/RestaurantList';
import Cart from './pages/Cart';
import Tracking from './pages/Tracking';
import ChatBot from './components/ChatBot';
import LoginModal from './components/LoginModal';
import { useOrder } from './context/OrderContext';
import { useAuth } from './context/AuthContext';
import './App.css';

function App() {
  const { cartItems } = useOrder();
  const { user, logout } = useAuth();
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Router>
      <div className="app-container">
        {/* Navigation Bar */}
        <nav className="glass-nav flex-between">
          <div className="logo flex-center">
            <span className="text-gradient logo-text">BiteRight</span>
          </div>

          {/* Desktop Links */}
          <div className="nav-links desktop-only">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/restaurants" className="nav-link">Restaurants</Link>
            <Link to="/cart" className="nav-link">Cart {cartItems.length > 0 && `(${cartItems.length})`}</Link>
            <Link to="/tracking" className="nav-link">Tracking</Link>
          </div>
          
          <div className="nav-actions desktop-only">
            {user ? (
              <div className="flex-center gap-2">
                <span className="text-secondary" style={{ marginRight: '1rem' }}>Hi, {user.name}</span>
                <button className="btn-glass" onClick={logout}>Logout</button>
              </div>
            ) : (
              <button className="btn-glass" onClick={() => setLoginModalOpen(true)}>Sign In</button>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="hamburger mobile-only" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </div>
        </nav>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="mobile-menu premium-glass"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mobile-nav-links">
                <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
                <Link to="/restaurants" className="nav-link" onClick={() => setIsMenuOpen(false)}>Restaurants</Link>
                <Link to="/cart" className="nav-link" onClick={() => setIsMenuOpen(false)}>Cart {cartItems.length > 0 && `(${cartItems.length})`}</Link>
                <Link to="/tracking" className="nav-link" onClick={() => setIsMenuOpen(false)}>Tracking</Link>
                
                {user ? (
                  <>
                    <span className="text-secondary mb-2 block">Hi, {user.name}</span>
                    <button className="btn-primary w-100" onClick={() => { logout(); setIsMenuOpen(false); }}>Logout</button>
                  </>
                ) : (
                  <button className="btn-primary w-100" onClick={() => { setLoginModalOpen(true); setIsMenuOpen(false); }}>Sign In</button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/restaurants" element={<RestaurantList />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/tracking" element={<Tracking />} />
          </Routes>
        </main>
        <ChatBot />
        <LoginModal isOpen={isLoginModalOpen} onClose={() => setLoginModalOpen(false)} />
      </div>
    </Router>
  );
}

export default App;
