import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageSquare, MapPin } from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import io from 'socket.io-client';
import './Tracking.css';

const Tracking = () => {
  const { activeOrder } = useOrder();
  const [status, setStatus] = useState(activeOrder?.status || 'No Order Yet');

  useEffect(() => {
    if (!activeOrder) return;
    
    // Setup Socket
    const socket = io('http://localhost:5000');
    
    socket.on('orderUpdate', (data) => {
      if (data.orderId === activeOrder.id) {
        setStatus(data.status);
      }
    });

    return () => socket.disconnect();
  }, [activeOrder]);

  const getProgress = () => {
    switch(status) {
      case 'Order Placed': return 15;
      case 'Preparing': return 40;
      case 'On the Way': return 75;
      case 'Delivered': return 100;
      default: return 0;
    }
  };

  const progress = getProgress();

  const steps = [
    { id: 1, title: "Order Confirmed", active: progress >= 15 },
    { id: 2, title: "Preparing Food", active: progress >= 40 },
    { id: 3, title: "On the Way", active: progress >= 75 },
    { id: 4, title: "Delivered", active: progress === 100 }
  ];

  if (!activeOrder) {
    return (
      <div className="page-container flex-center" style={{ minHeight: '60vh' }}>
        <div className="glass-panel text-center" style={{ padding: '3rem' }}>
          <h2>No Active Order Tracking</h2>
          <p className="text-secondary mt-4">Place an order from your cart to see live tracking!</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="tracking-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="map-container">
        <div className="map-grid"></div>
        <svg className="route-svg" viewBox="0 0 800 400" preserveAspectRatio="none">
          <path d="M 100,300 Q 200,300 300,200 T 500,200 T 700,100" stroke="var(--primary-glow)" strokeWidth="4" fill="none" strokeDasharray="10, 10" />
        </svg>

        <motion.div 
          className="delivery-icon glass-panel flex-center"
          animate={{ x: [100, 300, 500, 700], y: [300, 200, 200, 100] }}
          transition={{ duration: 20, ease: "linear", repeat: Infinity }}
        >
          🛵
        </motion.div>

        <div className="destination-pin" style={{ left: '700px', top: '100px' }}>
          <MapPin size={30} className="icon-orange animate-float" />
        </div>
      </div>

      <div className="tracking-panel glass-panel">
        <div className="eta-header text-center">
          <p className="text-secondary">Expected Arrival</p>
          <motion.h2 className="text-gradient">15 - 20 Min</motion.h2>
          <div className="progress-bar-bg mt-4">
            <motion.div className="progress-bar-fill" style={{ width: `${progress}%` }}></motion.div>
          </div>
        </div>

        <div className="timeline mt-4">
          {steps.map((step, idx) => (
            <div key={step.id} className={`timeline-step ${step.active ? 'active' : ''}`}>
              <div className="step-indicator">
                <div className="dot"></div>
                {idx !== steps.length - 1 && <div className="line"></div>}
              </div>
              <div className="step-content">
                <h4>{step.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Tracking;
