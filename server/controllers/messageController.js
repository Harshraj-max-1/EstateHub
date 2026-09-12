const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');
const { createAndSendNotification } = require('../services/notificationService');

// @desc    Get user's conversations
// @route   GET /api/messages/conversations
// @access  Private
exports.getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: { $in: [req.user.id] }
    })
      .populate('participants', 'name email avatar role agencyName')
      .populate('property', 'title slug price location images')
      .sort({ updatedAt: -1 })
      .lean();

    // Attach unread counts for each conversation
    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = await Message.countDocuments({
          conversation: conv._id,
          receiver: req.user.id,
          isRead: false
        });
        return { ...conv, unreadCount };
      })
    );

    res.status(200).json({
      success: true,
      conversations: conversationsWithUnread
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get or create conversation between users
// @route   POST /api/messages/conversations
// @access  Private
exports.getOrCreateConversation = async (req, res, next) => {
  try {
    const { receiverId, propertyId } = req.body;

    if (!receiverId) {
      return res.status(400).json({ success: false, message: 'Receiver ID is required.' });
    }

    if (receiverId.toString() === req.user.id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot chat with yourself.' });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [req.user.id, receiverId] },
      ...(propertyId ? { property: propertyId } : {})
    })
      .populate('participants', 'name email avatar role agencyName')
      .populate('property', 'title slug price location images');

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user.id, receiverId],
        property: propertyId || null
      });

      conversation = await Conversation.findById(conversation._id)
        .populate('participants', 'name email avatar role agencyName')
        .populate('property', 'title slug price location images');
    }

    res.status(200).json({
      success: true,
      conversation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get messages in a conversation
// @route   GET /api/messages/:conversationId
// @access  Private
exports.getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;

    // Verify user belongs to conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: { $in: [req.user.id] }
    });

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found or access denied.' });
    }

    // Mark unread messages as read
    await Message.updateMany(
      { conversation: conversationId, receiver: req.user.id, isRead: false },
      { isRead: true }
    );

    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'name avatar role')
      .sort({ createdAt: 1 })
      .lean();

    res.status(200).json({
      success: true,
      count: messages.length,
      messages
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res, next) => {
  try {
    const { conversationId, receiverId, content } = req.body;

    if (!conversationId || !receiverId || !content) {
      return res.status(400).json({ success: false, message: 'Please provide conversationId, receiverId, and content.' });
    }

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: { $in: [req.user.id] }
    });

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found.' });
    }

    const message = await Message.create({
      conversation: conversationId,
      sender: req.user.id,
      receiver: receiverId,
      content
    });

    await message.populate('sender', 'name avatar role');

    // Update conversation
    conversation.lastMessage = message._id;
    conversation.lastMessageText = content;
    conversation.lastMessageAt = new Date();
    await conversation.save();

    // Notify receiver
    createAndSendNotification({
      recipient: receiverId,
      sender: req.user.id,
      type: 'NEW_MESSAGE',
      title: 'New Message',
      message: `${req.user.name}: ${content.slice(0, 50)}${content.length > 50 ? '...' : ''}`,
      link: `/messages?conv=${conversationId}`
    }).catch((e) => console.error(e));

    res.status(201).json({
      success: true,
      message
    });
  } catch (error) {
    next(error);
  }
};
