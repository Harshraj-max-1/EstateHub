const express = require('express');
const {
  bookAppointment,
  getAgentAppointments,
  getBuyerAppointments,
  updateAppointmentStatus
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect);

router.post('/', bookAppointment);
router.get('/my', getBuyerAppointments);
router.get('/agent', authorize('AGENT', 'ADMIN'), getAgentAppointments);
router.put('/:id/status', updateAppointmentStatus);

module.exports = router;
