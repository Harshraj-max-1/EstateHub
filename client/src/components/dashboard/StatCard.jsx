import React from 'react';
import clsx from 'clsx';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel = 'vs last month',
  color = 'indigo',
  className = ''
}) => {
  const colorMap = {
    indigo: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900',
    emerald: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900',
    amber: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900',
    purple: 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900',
    rose: 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900',
    blue: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900'
  };

  return (
    <div
      className={clsx(
        'rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm flex flex-col justify-between transition-all hover:shadow-md',
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {value}
          </span>
        </div>
        {Icon && (
          <div
            className={clsx(
              'w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xs',
              colorMap[color] || colorMap.indigo
            )}
          >
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {trend !== undefined && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 text-xs">
          {trend >= 0 ? (
            <span className="flex items-center text-emerald-600 dark:text-emerald-400 font-bold">
              <ArrowUpRight className="w-3.5 h-3.5" /> +{trend}%
            </span>
          ) : (
            <span className="flex items-center text-red-600 dark:text-red-400 font-bold">
              <ArrowDownRight className="w-3.5 h-3.5" /> {trend}%
            </span>
          )}
          <span className="text-slate-400">{trendLabel}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
