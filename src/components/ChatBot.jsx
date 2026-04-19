import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import './ChatBot.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: "Hi! I'm your BiteRight AI Assistant. I can help you track orders, find food, and solve any queries you have!" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const botResponses = [
    { keywords: ['track', 'order', 'status', 'where'], reply: "You can track your order in real-time by going to the Tracking page! If you have a specific Order ID, type it here." },
    { keywords: ['delivery', 'time', 'how long'], reply: "We typically deliver within 15-30 minutes depending on your location and the restaurant's preparation time." },
    { keywords: ['hello', 'hi', 'hey'], reply: "Hello there! I can help you find options like veg, non-veg, desserts, and drinks from our menu. What are you craving?" },
    { keywords: ['veg', 'vegetarian', 'vegan'], reply: "For our vegetarian & vegan lovers, we recommend our highly-rated Truffle Mushroom Burger 🍔 or our fresh Vegan Buddha Bowl 🥗. Both are completely meat-free!" },
    { keywords: ['non-veg', 'meat', 'chicken', 'beef', 'pork'], reply: "Craving non-veg? Try our best-selling Spicy Inferno Pizza 🍕 or the fantastic Dragon Roll Sushi 🍣 for an amazing experience." },
    { keywords: ['dessert', 'sweet', 'chocolate', 'cake'], reply: "Satisfy your sweet tooth with our Double Choc Brownie 🍰! It's our highest-rated dessert at 4.9 stars." },
    { keywords: ['drink', 'smoothie', 'beverage', 'juice'], reply: "Quench your thirst with our refreshing Mango Tango Smoothie 🥤, delivered to you in just 10-15 minutes." },
    { keywords: ['menu', 'options', 'food', 'have', 'all'], reply: "Our menu features a wide variety of cuisines! We have Veg options like the Truffle Mushroom Burger and Vegan Buddha Bowl, Non-Veg dishes like the Spicy Inferno Pizza and Dragon Roll Sushi, plus Desserts like the Double Choc Brownie and Drinks like the Mango Tango Smoothie." },
    { keywords: ['payment', 'pay', 'stripe', 'card'], reply: "We accept all major credit cards, Apple Pay, Google Pay, and Crypto. Payments are 100% secured through our Stripe-style checkout." },
    { keywords: ['refund', 'cancel', 'wrong'], reply: "I'm sorry you had an issue. Please provide your Order ID, and I will connect you with a live human support agent immediately." }
  ];

  const getBotResponse = (userText) => {
    const textLower = userText.toLowerCase();
    for (let response of botResponses) {
      if (response.keywords.some(kw => textLower.includes(kw))) {
        return response.reply;
      }
    }
    return "I am an AI bot. I'm actively learning! Can you please rephrase your query? Or say 'track' to learn about tracking your order.";
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage = { id: Date.now(), sender: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate network latency / typing
    setTimeout(() => {
      const replyText = getBotResponse(userMessage.text);
      const botMessage = { id: Date.now() + 1, sender: 'bot', text: replyText };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // 1-2 second delay
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  return (
    <div className="chatbot-wrapper">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="chatbot-window glass-panel"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="chatbot-header">
              <div className="header-info">
                <div className="bot-avatar glass-panel-light flex-center">
                  <Bot size={20} className="icon-orange" />
                </div>
                <div>
                  <h3>BiteRight AI</h3>
                  <p className="status text-secondary"><span className="online-dot"></span> Online</p>
                </div>
              </div>
              <button className="btn-close" onClick={() => setIsOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="chatbot-messages">
              {messages.map(msg => (
                <div key={msg.id} className={`message-row ${msg.sender === 'user' ? 'user' : 'bot'}`}>
                  {msg.sender === 'bot' && (
                    <div className="msg-avatar"><Bot size={14}/></div>
                  )}
                  <div className={`message-bubble ${msg.sender}`}>
                    <p>{msg.text}</p>
                  </div>
                  {msg.sender === 'user' && (
                    <div className="msg-avatar user"><User size={14}/></div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="message-row bot">
                  <div className="msg-avatar"><Bot size={14}/></div>
                  <div className="message-bubble bot typing-indicator">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="chatbot-input glass-panel-light">
              <input 
                type="text" 
                placeholder="Ask me anything..." 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <button 
                className={`btn-send flex-center ${inputValue.trim() ? 'active' : ''}`}
                onClick={handleSend}
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button 
        className="chatbot-toggle btn-primary flex-center"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={isOpen ? { rotate: 90, opacity: 0, pointerEvents: 'none' } : { rotate: 0, opacity: 1, pointerEvents: 'auto' }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <MessageSquare size={24} />
      </motion.button>
    </div>
  );
};

export default ChatBot;
