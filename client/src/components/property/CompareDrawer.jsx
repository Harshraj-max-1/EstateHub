import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, X, ArrowRight } from 'lucide-react';
import { useCompare } from '../../context/CompareContext';
import { formatPrice, getImageUrl } from '../../utils/formatters';
import Button from '../common/Button';

const CompareDrawer = () => {
  const { comparedProperties, removeFromCompare, clearCompare } = useCompare();

  if (comparedProperties.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-2xl w-[92%] sm:w-full bg-slate-900/95 dark:bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-3 sm:p-4 shadow-2xl border border-slate-700/80 flex items-center justify-between gap-4 animate-in slide-in-from-bottom-4 duration-200">
      <div className="flex items-center gap-3 overflow-x-auto">
        <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 pl-1">
          <Scale className="w-4 h-4" />
          <span className="hidden sm:inline">Compare</span>
          <span>({comparedProperties.length}/4)</span>
        </div>

        <div className="flex items-center gap-2">
          {comparedProperties.map((prop) => (
            <div
              key={prop._id}
              className="relative group h-12 w-12 rounded-xl overflow-hidden border border-slate-700 flex-shrink-0"
            >
              <img
                src={getImageUrl(prop.images?.[0]?.url)}
                alt={prop.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => removeFromCompare(prop._id)}
                className="absolute inset-0 bg-red-600/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white"
                title="Remove"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={clearCompare}
          className="text-xs font-semibold text-slate-400 hover:text-white px-2 py-1 transition-colors cursor-pointer"
        >
          Clear
        </button>
        <Link to="/compare">
          <Button size="sm" variant="primary" icon={ArrowRight} iconPosition="right">
            Compare Now
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CompareDrawer;
