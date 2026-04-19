import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Navigation, ChevronRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const MinimalSearch = () => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div 
      className={`search-container premium-glass ${isFocused ? 'focused' : ''}`}
      animate={{ scale: isFocused ? 1.02 : 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      <Search size={20} className="search-icon" />
      <input 
        type="text" 
        placeholder="What are you craving today?"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <button className="btn-primary search-btn">Find Food</button>
    </motion.div>
  );
};

const Home = () => {
  const navigate = useNavigate();

  const floatingCards = [
    { title: "Premium Angus Burger", price: "$18.00", rating: "4.9", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400", type: "center" },
    { title: "Salmon Nigiri", price: "$14.50", rating: "4.8", img: "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=400", type: "top-right" },
    { title: "Margherita Pizza", price: "$15.00", rating: "4.7", img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=400", type: "bottom-right" },
  ];

  const categories = [
    { name: "Burgers", icon: "🍔" }, { name: "Pizza", icon: "🍕" }, 
    { name: "Sushi", icon: "🍣" }, { name: "Healthy", icon: "🥗" },
    { name: "Desserts", icon: "🍩" }, { name: "Drinks", icon: "🥤" },
    { name: "Indian", icon: "🍛" }, { name: "Chinese", icon: "🥡" }
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-grid">
          
          <div className="hero-content-left">
            <div className="titles">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="hero-headline text-gradient-orange"
              >
                Crave it?
              </motion.h1>
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                className="hero-headline text-gradient"
              >
                We deliver it.
              </motion.h1>
            </div>

            <motion.p 
              className="hero-subtitle text-secondary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
            >
              Experience ultra-fast, premium food delivery. Clean your cravings with curated menus and real-time tracking.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
            >
              <MinimalSearch />
            </motion.div>
          </div>

          <div className="hero-visual-right relative-z1">
            <div className="controlled-layout-triangle">
              {floatingCards.map((card, idx) => (
                <motion.div
                  key={idx}
                  className={`premium-card premium-glass layout-pos-${card.type}`}
                  initial={{ opacity: 0, x: 20, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0, 
                    y: [0, -4, 0] // extremely constrained, slow 4px floating
                  }}
                  transition={{ 
                    opacity: { duration: 0.8, delay: idx * 0.2 },
                    x: { duration: 0.8, delay: idx * 0.2 },
                    y: { duration: 8, ease: "easeInOut", repeat: Infinity, delay: idx * 1.5 } 
                  }}
                  whileHover={{ 
                    translateY: -8, 
                    boxShadow: "0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
                    borderColor: "rgba(255,255,255,0.25)"
                  }}
                >
                  <div className="premium-card-img-wrapper">
                    <motion.div 
                      className="premium-card-img" 
                      style={{ backgroundImage: `url(${card.img})` }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                  </div>
                  <div className="premium-card-body">
                    <h4>{card.title}</h4>
                    <div className="flex-between mt-2">
                      <span className="price">{card.price}</span>
                      <span className="rating text-secondary flex-center gap-1">
                        <Star size={12} fill="var(--primary-neon)" color="var(--primary-neon)"/> {card.rating}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Categories Section - Clean Horizontal Scroll */}
      <section className="categories-section-clean">
        <motion.div 
          className="flex-between mb-4 header-align"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>Trending Categories</h2>
        </motion.div>
        
        <div className="categories-horizontal-scroll">
          {categories.map((cat, idx) => (
            <motion.div 
              key={idx}
              className="category-card-clean premium-glass flex-center flex-column"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate('/restaurants')}
            >
              <span className="cat-emoji">{cat.icon}</span>
              <h4>{cat.name}</h4>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
