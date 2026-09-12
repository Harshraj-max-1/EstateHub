import React, { useState } from 'react';
import { Copy, Check, Share2, MessageCircle, Send } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';

const ShareModal = ({ isOpen, onClose, property }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = window.location.href;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`Check out "${property?.title}" on EstateHub: ${shareUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const shareTwitter = () => {
    const text = encodeURIComponent(`Discover "${property?.title}" on EstateHub`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share Property"
      subtitle={`Share "${property?.title}" with friends or family`}
    >
      <div className="flex flex-col gap-6">
        {/* Copy Link Input */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Property Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300 focus:outline-none"
            />
            <Button
              onClick={handleCopy}
              variant={copied ? 'success' : 'primary'}
              size="sm"
              icon={copied ? Check : Copy}
            >
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
        </div>

        {/* Social Share Buttons */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Quick Share via
          </span>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={shareWhatsApp}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold text-xs border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </button>
            <button
              onClick={shareTwitter}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 font-bold text-xs border border-sky-200 dark:border-sky-800 hover:bg-sky-100 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
              X (Twitter)
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ShareModal;
