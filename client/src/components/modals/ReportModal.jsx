import React, { useState } from 'react';
import { Flag, CheckCircle2 } from 'lucide-react';
import Modal from '../common/Modal';
import Select from '../common/Select';
import Button from '../common/Button';
import api from '../../api/axios';

const ReportModal = ({ isOpen, onClose, property }) => {
  const reasons = [
    'Fake listing',
    'Incorrect information',
    'Fraud',
    'Duplicate listing',
    'Inappropriate content',
    'Other'
  ];

  const [reason, setReason] = useState(reasons[0]);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Please provide details explaining why you are reporting this listing.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await api.post('/reports', {
        propertyId: property._id,
        reason,
        description
      });
      if (res.data.success) {
        setSuccess(true);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit report.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setError('');
    setDescription('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Report Listing"
      subtitle={`Flag "${property?.title}" for admin moderation`}
    >
      {success ? (
        <div className="flex flex-col items-center justify-center text-center py-6 gap-3">
          <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white">
            Report Submitted
          </h4>
          <p className="text-xs text-slate-500 max-w-sm">
            Thank you for helping keep EstateHub safe. Our trust and safety team will review this listing.
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

          <Select
            label="Reason for reporting"
            options={reasons}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder=""
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Provide specific details
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              placeholder="Explain the problem with this listing (e.g. wrong photos, unverified seller, price mismatch)..."
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" onClick={handleClose} variant="ghost" size="sm">
              Cancel
            </Button>
            <Button type="submit" variant="danger" size="sm" icon={Flag} isLoading={loading}>
              Submit Report
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default ReportModal;
