import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Phone, MessageSquare, Star, Navigation, MapPin, Bike } from 'lucide-react';
import { io } from 'socket.io-client';
import { useOrder } from '../context/OrderContext';
import './Tracking.css';

const socket = io('http://localhost:5000');

const Tracking = () => {
  const { activeOrder } = useOrder();
  
  const [statusStep, setStatusStep] = useState(0);
  const [progress, setProgress] = useState(5); // 0 to 100
  const [eta, setEta] = useState(20);
  const [distance, setDistance] = useState(2.4);
  const [liveToast, setLiveToast] = useState("Order received by restaurant ✨");

  const steps = [
    { title: "Order Confirmed", desc: "Restaurant has received your order" },
    { title: "Preparing", desc: "Your food is being packed" },
    { title: "On the Way", desc: "Delivery partner is approaching" },
    { title: "Delivered", desc: "Enjoy your meal!" }
  ];

  // Real-Time Socket.IO Master Engine
  useEffect(() => {
    if (!activeOrder) return; // Wait for active order context

    // Map initial statuses
    const mapStatus = (statusStr) => {
      const tsMap = {
        'Order Placed': { p: 10, step: 0, t: "Order received by restaurant ✨", d: 2.4, e: 20 },
        'Preparing': { p: 40, step: 1, t: "Preparing your food 🍳", d: 2.4, e: 15 },
        'On the Way': { p: 85, step: 2, t: "Rider picked up your order 🚴", d: 1.2, e: 8 },
        'Delivered': { p: 100, step: 3, t: "Arriving right now! 📍", d: 0, e: 0 }
      };
      return tsMap[statusStr] || tsMap['Order Placed'];
    };

    // Apply init state
    const initState = mapStatus(activeOrder.status);
    setProgress(initState.p);
    setStatusStep(initState.step);

    // Subscribe to Node Server Events
    const handleUpdate = (data) => {
      // Check if event belongs to the user's active session
      if (data.orderId === activeOrder.id) {
        const update = mapStatus(data.status);
        setProgress(update.p);
        setStatusStep(update.step);
        setLiveToast(update.t);
        setDistance(update.d);
        setEta(update.e);
      }
    };

    socket.on('orderUpdate', handleUpdate);

    return () => {
      socket.off('orderUpdate', handleUpdate);
    };
  }, [activeOrder]);

  // Complex SVG Route string matching
  const mapPath = "M 0,350 C 200,300 150,100 400,150 S 600,450 800,200 S 1000,100 1200,250";

  return (
    <motion.div 
      className="page-container tracking-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Background Interactive Map Layer */}
      <div className="map-container parallax-grid">
        <div className="grid-overlay"></div>
        
        <div className="route-wrapper">
          <svg className="route-svg" viewBox="0 0 1200 500">
            {/* Base inactive path */}
            <path 
              className="path-base"
              d={mapPath} 
              fill="none" 
              stroke="rgba(255,107,0,0.15)" 
              strokeWidth="10"
              strokeDasharray="15 15"
            />
            {/* Active drawing path overlapping */}
            <motion.path 
              className="path-active"
              d={mapPath} 
              fill="none" 
              stroke="#FF6B00" 
              strokeWidth="10"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: progress / 100 }}
              transition={{ ease: "linear", duration: 0.1 }}
            />
          </svg>

          {/* Dynamic Rider Node utilizing offset-path */}
          <motion.div 
            className="rider-node flex-center"
            style={{ offsetPath: `path('${mapPath}')`, offsetDistance: `${progress}%` }}
          >
            <div className="rider-pulse"></div>
            <motion.div 
              className="rider-icon-wrapper"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              <Bike size={24} color="white" />
            </motion.div>
          </motion.div>

          {/* Destination Pin */}
          <div className="destination-node flex-center">
            <MapPin size={38} color="#FF6B00" />
          </div>
        </div>
      </div>

      {/* Floating Live Toast Network Alert */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={liveToast}
          className="tracking-toast premium-glass"
          initial={{ y: -50, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -20, opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4, type: "spring" }}
        >
          {liveToast}
        </motion.div>
      </AnimatePresence>

      {/* Tracking Card UI */}
      <motion.div 
        className="tracking-panel premium-glass"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        whileHover={{ translateY: -5, boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)' }}
      >
        <div className="panel-header flex-between">
          <div className="eta-container">
            <span className="text-secondary text-sm block">Estimated Time</span>
            <div className="eta-live flex-center gap-2">
              <h2>{eta} <span className="text-muted">mins</span></h2>
              {eta > 0 && <span className="live-dot" />}
            </div>
          </div>
          <div className="distance-container text-right">
            <span className="text-secondary text-sm block">Distance</span>
            <div className="flex-center gap-1 justify-end">
              <Navigation size={14} className="icon-orange" />
              <h3>{distance.toFixed(1)} km</h3>
            </div>
          </div>
        </div>

        {/* Partner Info */}
        <div className="partner-card premium-glass-light flex-between mt-4">
          <div className="flex-center gap-3">
            <div className="partner-avatar">
              <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop" alt="Driver" />
            </div>
            <div className="partner-details">
              <h4>Alex Johnson</h4>
              <span className="rating text-secondary flex-center gap-1">
                <Star size={14} fill="var(--accent-yellow)" color="var(--accent-yellow)"/> 4.8
              </span>
            </div>
          </div>
          <div className="flex-center gap-2">
            <button className="btn-circle call flex-center"><Phone size={18} /></button>
            <button className="btn-circle chat flex-center"><MessageSquare size={18} /></button>
          </div>
        </div>

        {/* Timeline Engine */}
        <div className="timeline-dynamic mt-5">
          {steps.map((step, idx) => {
            const isActive = idx === statusStep;
            const isPast = idx < statusStep;
            
            return (
              <div key={idx} className={`time-step ${isActive ? 'active' : ''} ${isPast ? 'completed' : ''}`}>
                <div className="step-geo">
                  <motion.div 
                    className="dot flex-center"
                    animate={isActive ? { scale: [1, 1.2, 1], boxShadow: '0 0 15px rgba(255,107,0,0.5)' } : { scale: 1 }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    {isPast && <Check size={12} strokeWidth={4} color="white" />}
                  </motion.div>
                  {idx < steps.length - 1 && <div className="line" />}
                </div>
                <motion.div 
                  className="step-text"
                  animate={{ opacity: isActive || isPast ? 1 : 0.4, x: isActive ? 5 : 0 }}
                >
                  <h4 className={isActive ? 'text-gradient-orange' : ''}>{step.title}</h4>
                  <p>{step.desc}</p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Tracking;
