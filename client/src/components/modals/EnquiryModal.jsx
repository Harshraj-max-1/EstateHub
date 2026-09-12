import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const EnquiryModal = ({ isOpen, onClose, property }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    message: `Hi, I am interested in "${property?.title}". Please provide more details regarding availability and paperwork.`
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await api.post('/enquiries', {
        propertyId: property._id,
        ...formData
      });
      if (res.data.success) {
        setSuccess(true);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit enquiry.');
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
      title="Contact Property Agent"
      subtitle={`Send a direct enquiry for ${property?.title}`}
    >
      {success ? (
        <div className="flex flex-col items-center justify-center text-center py-6 gap-3">
          <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white">
            Enquiry Sent Successfully!
          </h4>
          <p className="text-xs text-slate-500 max-w-sm">
            The property agent has received your details and message. They will respond shortly via email or phone.
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

          <Input
            label="Your Full Name"
            placeholder="e.g. Rahul Kapoor"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. rahul@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              label="Phone Number"
              placeholder="e.g. +91 98765 43210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Your Message
            </label>
            <textarea
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              placeholder="Write your questions or requested details here..."
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" onClick={handleClose} variant="ghost" size="sm">
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" icon={Send} isLoading={loading}>
              Send Enquiry
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default EnquiryModal;
