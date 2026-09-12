const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

const setupSocketIO = (io) => {
  const onlineUsers = new Map(); // userId -> Set of socketIds

  io.on('connection', (socket) => {
    // User authenticates/joins socket
    socket.on('setup', (userId) => {
      if (!userId) return;
      socket.userId = userId;
      socket.join(userId.toString());

      if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, new Set());
      }
      onlineUsers.get(userId).add(socket.id);

      io.emit('online_users', Array.from(onlineUsers.keys()));
    });

    // Join conversation room
    socket.on('join_conversation', (conversationId) => {
      socket.join(conversationId);
    });

    // Leave conversation room
    socket.on('leave_conversation', (conversationId) => {
      socket.leave(conversationId);
    });

    // Real-time typing indicator
    socket.on('typing', ({ conversationId, userId, userName }) => {
      socket.to(conversationId).emit('user_typing', { conversationId, userId, userName });
    });

    socket.on('stop_typing', ({ conversationId, userId }) => {
      socket.to(conversationId).emit('user_stop_typing', { conversationId, userId });
    });

    // Handle new message dispatch
    socket.on('send_direct_message', async (data) => {
      const { conversationId, senderId, receiverId, content } = data;
      try {
        const message = await Message.create({
          conversation: conversationId,
          sender: senderId,
          receiver: receiverId,
          content
        });

        await message.populate('sender', 'name avatar role');

        // Update conversation last message
        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: message._id,
          lastMessageText: content,
          lastMessageAt: new Date()
        });

        // Broadcast to the conversation room and the receiver directly
        io.to(conversationId).emit('new_message_received', message);
        io.to(receiverId.toString()).emit('new_message_notification', {
          conversationId,
          message
        });
      } catch (err) {
        console.error('[Socket Message Send Error]:', err.message);
      }
    });

    // Mark messages as read
    socket.on('mark_read', async ({ conversationId, userId }) => {
      try {
        await Message.updateMany(
          { conversation: conversationId, receiver: userId, isRead: false },
          { isRead: true }
        );
        socket.to(conversationId).emit('messages_marked_read', { conversationId, userId });
      } catch (err) {
        console.error('[Socket Mark Read Error]:', err.message);
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      if (socket.userId && onlineUsers.has(socket.userId)) {
        const userSockets = onlineUsers.get(socket.userId);
        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
          onlineUsers.delete(socket.userId);
        }
        io.emit('online_users', Array.from(onlineUsers.keys()));
      }
    });
  });
};

module.exports = setupSocketIO;
