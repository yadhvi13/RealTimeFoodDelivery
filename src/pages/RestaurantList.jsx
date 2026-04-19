import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Star, Clock, Plus, Heart, ShoppingBag } from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { generateMenuData } from '../data/menuData';
import './RestaurantList.css';

const SkeletonCard = () => (
  <div className="dish-card glass-panel skeleton-card">
    <div className="skeleton-img"></div>
    <div className="dish-card-content">
      <div className="skeleton-line" style={{ width: '40%' }}></div>
      <div className="skeleton-line" style={{ width: '80%', height: '20px', marginTop: '10px' }}></div>
      <div className="skeleton-line" style={{ width: '50%', marginTop: 'auto' }}></div>
    </div>
  </div>
);

const RestaurantList = () => {
  const { addToCart, cartItems } = useOrder();
  
  // Data States
  const [dishes, setDishes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter States
  const [showFilters, setShowFilters] = useState(true);
  const [priceRange, setPriceRange] = useState(30);
  const [minRating, setMinRating] = useState(0);
  const [vegState, setVegState] = useState('all'); // 'all', 'veg', 'non-veg'
  const [category, setCategory] = useState('all');
  
  // Interaction States
  const [hoveredDish, setHoveredDish] = useState(null);
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('btr_favs')) || []);

  useEffect(() => {
    // Simulate API delay network loading
    setTimeout(() => {
      setDishes(generateMenuData());
      setIsLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
    localStorage.setItem('btr_favs', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFav = (id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleAddToCart = (e, dish) => {
    e.stopPropagation(); // prevent favorite trigger if grouped
    addToCart(dish);
    // Real time toast trigger simulation could happen here or in App
  };

  // Filter Logic
  const filteredDishes = useMemo(() => {
    return dishes.filter(dish => {
      const discountedPrice = dish.price - dish.discount;
      if (discountedPrice > priceRange) return false;
      if (dish.rating < minRating) return false;
      if (vegState !== 'all' && dish.type !== vegState) return false;
      if (category !== 'all' && dish.cat !== category) return false;
      return true;
    });
  }, [dishes, priceRange, minRating, vegState, category]);

  const allCategories = ['all', ...Array.from(new Set(dishes.map(d => d.cat)))];

  const getItemQty = (id) => {
    const item = cartItems.find(i => i.id === id);
    return item ? item.qty : 0;
  };

  const handleUpdateQty = (e, id, change) => {
    e.stopPropagation();
    updateQty(id, change);
  };

  return (
    <motion.div 
      className="page-container restaurant-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Ultra Premium Next-Gen Hero Banner */}
      <section className="hero-banner glass-panel">
        <div className="hero-blur-bg"></div>
        <div className="hero-overlay"></div>
        
        <motion.div 
          className="hero-content glass-panel-light"
          initial={{ y: 50, opacity: 0, filter: 'blur(10px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="hero-badge flex-center">Featured</div>
          <h1 className="hero-title text-gradient">Gourmet Haven</h1>
          <div className="hero-meta flex-center gap-2">
            <span className="rating"><Star size={18} fill="var(--accent-yellow)"/> 4.9 Superb</span>
            <span className="dot">•</span>
            <span className="time"><Clock size={16}/> 15-25 min</span>
          </div>
          
          <div className="hero-actions">
            <button className="btn-glass flex-center"><Heart size={18}/> Favorite Menu</button>
            <button className="btn-glass flex-center">Share</button>
          </div>
        </motion.div>
      </section>

      <div className="page-header flex-between mt-4">
        <div>
          <h2>Explore Menu</h2>
          {!isLoading && <p className="text-secondary">{filteredDishes.length} items found</p>}
        </div>
        <button className="btn-glass flex-center filter-toggle" onClick={() => setShowFilters(!showFilters)}>
          <Filter size={18} /> {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      <div className="content-layout">
        <AnimatePresence>
          {showFilters && (
            <motion.aside 
              className="filter-sidebar glass-panel"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="filter-content">
                <h3>Category</h3>
                <div className="filter-group">
                  <select 
                    className="glass-select" 
                    value={category} 
                    onChange={e => setCategory(e.target.value)}
                  >
                    {allCategories.map(c => (
                      <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                  </select>
                </div>

                <h3>Type</h3>
                <div className="filter-group row-group toggle-group">
                  <button className={`price-btn ${vegState === 'all' ? 'active' : ''}`} onClick={() => setVegState('all')}>All</button>
                  <button className={`price-btn ${vegState === 'veg' ? 'active' : ''}`} onClick={() => setVegState('veg')}>Veg</button>
                  <button className={`price-btn ${vegState === 'non-veg' ? 'active' : ''}`} onClick={() => setVegState('non-veg')}>Non-Veg</button>
                </div>

                <h3>Max Price: ${priceRange}</h3>
                <div className="filter-group">
                  <input 
                    type="range" 
                    min="5" max="50" step="1" 
                    value={priceRange} 
                    onChange={e => setPriceRange(Number(e.target.value))}
                    className="price-slider"
                  />
                </div>

                <h3>Rating</h3>
                <div className="filter-group row-group">
                  {[0, 3.5, 4.0, 4.5].map(rtg => (
                    <button 
                      key={rtg}
                      className={`price-btn rating-btn ${minRating === rtg ? 'active' : ''}`}
                      onClick={() => setMinRating(rtg)}
                    >
                      {rtg === 0 ? 'Any' : `${rtg}★+`}
                    </button>
                  ))}
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <main className="dishes-main">
          {isLoading ? (
            <div className={`dishes-grid ${showFilters ? 'with-filters' : 'no-filters'}`}>
              {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filteredDishes.length === 0 ? (
            <div className="empty-state text-center">
              <h2>No items found 😢</h2>
              <p>Try adjusting your filters to discover more food.</p>
              <button className="btn-primary mt-4" onClick={() => {
                setCategory('all'); setVegState('all'); setPriceRange(50); setMinRating(0);
              }}>Reset Filters</button>
            </div>
          ) : (
            <motion.div layout className={`dishes-grid ${showFilters ? 'with-filters' : 'no-filters'}`}>
              <AnimatePresence>
                {filteredDishes.map((dish) => (
                  <motion.div 
                    layout
                    key={dish.id} 
                    className="dish-card glass-panel"
                    onHoverStart={() => setHoveredDish(dish.id)}
                    onHoverEnd={() => setHoveredDish(null)}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, filter: 'blur(5px)' }}
                    whileHover={{ translateY: -10, boxShadow: '0 0 30px rgba(255, 107, 0, 0.3)', borderColor: 'rgba(255, 107, 0, 0.5)' }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <div className="dish-image-wrapper">
                      <motion.div 
                        className="dish-card-img" 
                        style={{ backgroundImage: `url(${dish.img})` }}
                        animate={{ scale: hoveredDish === dish.id ? 1.1 : 1 }}
                        transition={{ duration: 0.4 }}
                      />
                      {dish.pop && <span className="pop-badge">🔥 Popular</span>}
                      
                      <motion.button 
                        className={`heart-btn ${favorites.includes(dish.id) ? 'liked' : ''} flex-center`}
                        whileTap={{ scale: 0.8 }}
                        animate={favorites.includes(dish.id) ? { scale: [1, 1.3, 1] } : {}}
                        transition={{ duration: 0.4 }}
                        onClick={() => toggleFav(dish.id)}
                      >
                        <Heart size={16} fill={favorites.includes(dish.id) ? '#ff3333' : 'none'} color={favorites.includes(dish.id) ? '#ff3333' : '#fff'} />
                      </motion.button>
                    </div>

                    <div className="dish-card-content relative-z1">
                      <div className="flex-between">
                        <span className="rating"><Star size={14} className="star-icon" fill="var(--accent-yellow)"/> {dish.rating}</span>
                        <span className="time"><Clock size={14} /> {dish.time}</span>
                      </div>
                      
                      <h3>{dish.name}</h3>
                      
                      <div className="tag-group">
                        <span className={`type-tag ${dish.type}`}>{dish.type === 'veg' ? '🟢 Veg' : '🔴 Non'}</span>
                        <span className="cat-tag">{dish.cat}</span>
                      </div>
                      
                      <div className="card-footer flex-between">
                        <div className="price-block">
                          {dish.discount > 0 ? (
                            <>
                              <span className="price discounted">${(dish.price - dish.discount).toFixed(2)}</span>
                              <span className="price original strike">${dish.price.toFixed(2)}</span>
                            </>
                          ) : (
                            <span className="price">${dish.price.toFixed(2)}</span>
                          )}
                        </div>

                        {/* Morphing Add to Cart Behavior */}
                        <div className="morph-cart-container">
                          {getItemQty(dish.id) > 0 ? (
                            <motion.div 
                              className="qty-morph glass-panel-light flex-between"
                              initial={{ width: 40, opacity: 0 }}
                              animate={{ width: 100, opacity: 1 }}
                              exit={{ width: 40, opacity: 0 }}
                            >
                              <button onClick={(e) => handleUpdateQty(e, dish.id, -1)}>-</button>
                              <span>{getItemQty(dish.id)}</span>
                              <button onClick={(e) => handleUpdateQty(e, dish.id, 1)}>+</button>
                            </motion.div>
                          ) : (
                            <motion.button 
                              className="btn-add-circle flex-center"
                              whileHover={{ scale: 1.1, backgroundColor: 'var(--primary-neon)' }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => handleAddToCart(e, { ...dish, price: (dish.price - dish.discount).toString() })}
                            >
                              <Plus size={20} />
                            </motion.button>
                          )}
                        </div>
                      </div>
                      
                      {/* Particle Effect Layer */}
                      {favorites.includes(dish.id) && <div className="particles-burst"></div>}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </main>
      </div>
    </motion.div>
  );
};

export default RestaurantList;
