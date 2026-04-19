import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './LoginModal.css';

const LoginModal = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const emailInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && emailInputRef.current) {
      setTimeout(() => emailInputRef.current.focus(), 100);
    }
    // Reset state on open
    if (isOpen) {
      setHasError(false);
      setIsLoading(false);
    }
  }, [isOpen, isLogin]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (hasError) setHasError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setHasError(false);
    
    // Slight delay for premium loading feel
    setTimeout(async () => {
      let success = false;
      if (isLogin) {
        success = await login(formData.email, formData.password);
      } else {
        success = await register(formData.name, formData.email, formData.password);
      }
      
      setIsLoading(false);
      if (success) {
        onClose();
      } else {
        setHasError(true);
      }
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="modal-overlay flex-center"
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(15px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          transition={{ duration: 0.25 }}
        >
          <motion.div 
            className="auth-modal premium-glass"
            initial={{ scale: 0.6, opacity: 0, y: 150, rotate: -5 }}
            animate={{ scale: 1, opacity: 1, y: 0, rotate: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: 50, rotate: 3 }}
            transition={{ type: "spring", stiffness: 450, damping: 22, bounce: 0.5 }}
          >
            <div className="modal-header flex-between">
              <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
              <motion.button 
                className="btn-icon-glass flex-center"
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
              >
                <X size={20} />
              </motion.button>
            </div>
            
            <form onSubmit={handleSubmit} className="auth-form">
              <AnimatePresence>
                {!isLogin && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="input-group">
                      <motion.input 
                        name="name" 
                        type="text" 
                        placeholder="Full Name" 
                        className="glass-input" 
                        onChange={handleChange}
                        whileFocus={{ scale: 1.01, borderColor: '#FF6B00' }}
                        required={!isLogin}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="input-group">
                <motion.input 
                  ref={emailInputRef}
                  name="email" 
                  type="email" 
                  placeholder="Email address" 
                  className={`glass-input ${hasError ? 'error-shake' : ''}`}
                  onChange={handleChange}
                  whileFocus={{ scale: 1.01, borderColor: '#FF6B00' }}
                  required 
                />
              </div>

              <div className="input-group password-group">
                <motion.input 
                  name="password" 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="Password" 
                  className={`glass-input ${hasError ? 'error-shake' : ''}`}
                  onChange={handleChange}
                  whileFocus={{ scale: 1.01, borderColor: '#FF6B00' }}
                  required 
                />
                <button 
                  type="button" 
                  className="pwd-toggle text-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              <motion.button 
                type="submit" 
                className="btn-auth-submit mt-4 flex-center"
                whileHover={{ y: -3, boxShadow: '0 10px 20px rgba(255,107,0,0.4)', borderColor: 'rgba(255,107,0,0.8)' }}
                whileTap={{ scale: 0.97 }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                    <Loader2 size={20} />
                  </motion.div>
                ) : (
                  <span>{isLogin ? 'Sign In' : 'Sign Up'}</span>
                )}
              </motion.button>
            </form>
            
            <p className="auth-footer text-center mt-6 text-secondary">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span className="auth-link" onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Sign Up' : 'Log In'}
              </span>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
