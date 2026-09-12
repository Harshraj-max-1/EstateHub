require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const connectDB = require('./config/db');
const setupSocketIO = require('./sockets/socketHandler');
const { setSocketIO } = require('./services/notificationService');

// Connect to MongoDB
connectDB();

const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_URL || 'http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Pass IO instance to notification service and socket handlers
setSocketIO(io);
setupSocketIO(io);

const PORT = process.env.PORT || 5000;

const runningServer = server.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 EstateHub Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`🌐 Port: http://localhost:${PORT}`);
  console.log(`⚡ WebSocket Server initialized`);
  console.log(`=========================================`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[Unhandled Rejection Error]: ${err.message}`);
  // Close server & exit process
  runningServer.close(() => process.exit(1));
});
