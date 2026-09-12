const express = require('express');
const {
  getConversations,
  getOrCreateConversation,
  getMessages,
  sendMessage
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/conversations', getConversations);
router.post('/conversations', getOrCreateConversation);
router.get('/:conversationId', getMessages);
router.post('/', sendMessage);

module.exports = router;
