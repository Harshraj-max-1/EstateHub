const Notification = require('../models/Notification');

let ioInstance = null;

const setSocketIO = (io) => {
  ioInstance = io;
};

const createAndSendNotification = async ({ recipient, sender, type, title, message, link = '' }) => {
  try {
    const notification = await Notification.create({
      recipient,
      sender,
      type,
      title,
      message,
      link
    });

    // Populate sender details
    await notification.populate('sender', 'name avatar');

    // If socket.io is active, emit to the recipient's room
    if (ioInstance) {
      ioInstance.to(recipient.toString()).emit('new_notification', notification);
    }

    return notification;
  } catch (error) {
    console.error('[Notification Service Error]:', error.message);
  }
};

module.exports = { setSocketIO, createAndSendNotification };
