import React, { useState } from 'react';
import { Star, CheckCircle2 } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import api from '../../api/axios';

const ReviewModal = ({ isOpen, onClose, agent, property, onReviewSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please write a short review explaining your experience.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await api.post('/reviews', {
        agentId: agent._id,
        propertyId: property?._id,
        rating,
        comment
      });
      if (res.data.success) {
        setSuccess(true);
        if (onReviewSubmitted) onReviewSubmitted(res.data.review);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit review.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setError('');
    setComment('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Write Agent Review"
      subtitle={`Share your experience working with ${agent?.name}`}
    >
      {success ? (
        <div className="flex flex-col items-center justify-center text-center py-6 gap-3">
          <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white">
            Thank you for your review!
          </h4>
          <p className="text-xs text-slate-500 max-w-sm">
            Your verified feedback has been published on {agent?.name}'s profile.
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

          {/* Star Rating Selector */}
          <div className="flex flex-col items-center gap-2 py-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Select Rating
            </span>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 text-slate-300 hover:scale-110 transition-transform cursor-pointer"
                >
                  <Star
                    className={`w-8 h-8 ${
                      (hoverRating || rating) >= star
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300 dark:text-slate-700'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {rating === 5 && 'Outstanding (5/5)'}
              {rating === 4 && 'Very Good (4/5)'}
              {rating === 3 && 'Average (3/5)'}
              {rating === 2 && 'Below Average (2/5)'}
              {rating === 1 && 'Poor Experience (1/5)'}
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Your Review / Feedback
            </label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              placeholder="Tell others about communication, punctuality, property accuracy, and professionalism..."
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" onClick={handleClose} variant="ghost" size="sm">
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={loading}>
              Publish Review
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default ReviewModal;
