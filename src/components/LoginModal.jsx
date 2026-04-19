import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginModal = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      const success = await login(formData.email, formData.password);
      if (success) onClose();
    } else {
      const success = await register(formData.name, formData.email, formData.password);
      if (success) onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div style={overlayStyle}>
      <motion.div 
        className="glass-panel" 
        style={modalStyle}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <button className="btn-close" onClick={onClose}><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {!isLogin && (
            <input 
              name="name" 
              type="text" 
              placeholder="Name" 
              className="search-input glass-panel-light" 
              style={{ padding: '0.8rem' }}
              onChange={handleChange}
              required 
            />
          )}
          <input 
            name="email" 
            type="email" 
            placeholder="Email" 
            className="search-input glass-panel-light" 
            style={{ padding: '0.8rem' }}
            onChange={handleChange}
            required 
          />
          <input 
            name="password" 
            type="password" 
            placeholder="Password" 
            className="search-input glass-panel-light" 
            style={{ padding: '0.8rem' }}
            onChange={handleChange}
            required 
          />
          
          <button type="submit" className="btn-primary" style={{ padding: '1rem', marginTop: '1rem' }}>
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-secondary)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span style={{ color: 'var(--primary-neon)', cursor: 'pointer' }} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign Up' : 'Log In'}
          </span>
        </p>
      </motion.div>
    </div>
  );
};

const overlayStyle = {
  position: 'fixed', inset: 0, background: 'rgba(5,5,5,0.8)', zIndex: 10000,
  display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)'
};

const modalStyle = {
  width: '400px', padding: '2rem', background: 'var(--bg-glass)'
};

export default LoginModal;
