import React from 'react';

export const PropertyCardSkeleton = () => {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden animate-pulse shadow-sm flex flex-col">
      {/* Image Skeleton */}
      <div className="h-56 bg-slate-200 dark:bg-slate-800 w-full" />
      {/* Content Skeleton */}
      <div className="p-5 flex flex-col gap-3.5 flex-1">
        <div className="flex justify-between items-center">
          <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-md" />
          <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded-full" />
        </div>
        <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-md" />
        <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded-md" />
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between mt-auto">
          <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded-md" />
          <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded-md" />
          <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export const TableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="w-full animate-pulse flex flex-col gap-3">
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="h-14 bg-slate-100 dark:bg-slate-800/60 rounded-xl w-full" />
      ))}
    </div>
  );
};
