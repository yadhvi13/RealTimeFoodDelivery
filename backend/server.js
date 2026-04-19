const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Enable CORS
app.use(cors());
app.use(express.json());

// Socket.io setup
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/fooddeliveryDB')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err.message));

// Schemas
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, // In production, this would be hashed
});
const User = mongoose.model('User', userSchema);

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: Array,
  total: Number,
  status: { type: String, default: 'Order Placed' }, // Order Placed, Preparing, On the Way, Delivered
  createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', orderSchema);

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    user = new User({ name, email, password });
    await user.save();
    res.json({ message: "Registration successful", userId: user._id, name: user.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    
    res.json({ message: "Login successful", userId: user._id, name: user.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Order Routes
app.post('/api/orders', async (req, res) => {
  try {
    const { userId, items, total } = req.body;
    const order = new Order({ userId, items, total });
    await order.save();

    console.log(`New Order Placed: ${order._id}`);
    
    // Auto-update order status simulation
    setTimeout(async () => {
      order.status = 'Preparing';
      await order.save();
      io.emit('orderUpdate', { orderId: order._id, status: order.status });
    }, 10000);

    setTimeout(async () => {
      order.status = 'On the Way';
      await order.save();
      io.emit('orderUpdate', { orderId: order._id, status: order.status });
    }, 20000);

    setTimeout(async () => {
      order.status = 'Delivered';
      await order.save();
      io.emit('orderUpdate', { orderId: order._id, status: order.status });
    }, 35000);

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Real-time socket connections
io.on('connection', (socket) => {
  console.log('⚡ A client connected:', socket.id);
  socket.on('disconnect', () => console.log('❌ Client disconnected:', socket.id));
});

const PORT = 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
