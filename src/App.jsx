import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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
  const [isLoginModalOpen, setLoginModalOpen] = React.useState(false);

  return (
    <Router>
      <div className="app-container">
        {/* Navigation Bar */}
        <nav className="glass-nav flex-between">
          <div className="logo flex-center">
            <span className="text-gradient logo-text">BiteRight</span>
          </div>
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/restaurants" className="nav-link">Restaurants</Link>
            <Link to="/cart" className="nav-link">Cart {cartItems.length > 0 && `(${cartItems.length})`}</Link>
            <Link to="/tracking" className="nav-link">Tracking</Link>
          </div>
          <div className="nav-actions">
            {user ? (
              <div className="flex-center gap-2">
                <span className="text-secondary" style={{ marginRight: '1rem' }}>Hi, {user.name}</span>
                <button className="btn-glass" onClick={logout}>Logout</button>
              </div>
            ) : (
              <button className="btn-glass" onClick={() => setLoginModalOpen(true)}>Sign In</button>
            )}
          </div>
        </nav>

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
