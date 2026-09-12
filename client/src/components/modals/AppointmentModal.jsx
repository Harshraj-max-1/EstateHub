import React, { useState } from 'react';
import { Calendar, CheckCircle2 } from 'lucide-react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { TIME_SLOTS } from '../../utils/constants';
import api from '../../api/axios';

const AppointmentModal = ({ isOpen, onClose, property }) => {
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    visitDate: tomorrowStr,
    timeSlot: TIME_SLOTS[1],
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.visitDate || !formData.timeSlot) {
      setError('Please choose a date and time slot.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await api.post('/appointments', {
        propertyId: property._id,
        ...formData
      });
      if (res.data.success) {
        setSuccess(true);
      }
    } catch (err) {
      setError(err.message || 'Failed to book appointment.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setError('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Schedule Property Visit"
      subtitle={`Book an in-person or guided site tour of ${property?.title}`}
    >
      {success ? (
        <div className="flex flex-col items-center justify-center text-center py-6 gap-3">
          <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white">
            Visit Request Submitted!
          </h4>
          <p className="text-xs text-slate-500 max-w-sm">
            Your appointment has been sent to the agent for confirmation on{' '}
            <strong className="text-slate-800 dark:text-slate-200">{formData.visitDate}</strong> ({formData.timeSlot}). You will receive a notification once confirmed.
          </p>
          <Button onClick={handleClose} variant="primary" size="sm" className="mt-4">
            Done
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 text-xs font-medium border border-red-200 dark:border-red-900">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Preferred Visit Date"
              type="date"
              min={tomorrowStr}
              value={formData.visitDate}
              onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
              required
            />

            <Select
              label="Preferred Time Slot"
              options={TIME_SLOTS}
              value={formData.timeSlot}
              onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
              placeholder=""
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Notes for Agent (Optional)
            </label>
            <textarea
              rows={3}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              placeholder="e.g. Coming with family, will need parking space..."
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" onClick={handleClose} variant="ghost" size="sm">
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" icon={Calendar} isLoading={loading}>
              Request Visit
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default AppointmentModal;
