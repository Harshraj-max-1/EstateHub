import React from 'react';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';

const Select = React.forwardRef(
  (
    {
      label,
      error,
      options = [],
      placeholder = 'Select an option',
      className = '',
      wrapperClassName = '',
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={clsx('w-full flex flex-col gap-1.5', wrapperClassName)}>
        {label && (
          <label htmlFor={selectId} className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            className={clsx(
              'w-full rounded-xl border bg-white dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 text-sm transition-all duration-150 py-2.5 pl-3.5 pr-10 appearance-none focus:outline-none focus:ring-2 cursor-pointer',
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20',
              className
            )}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((opt) => {
              const val = typeof opt === 'object' ? opt.value : opt;
              const lbl = typeof opt === 'object' ? opt.label : opt;
              return (
                <option key={val} value={val} className="dark:bg-slate-900 dark:text-slate-100">
                  {lbl}
                </option>
              );
            })}
          </select>
          <div className="absolute right-3.5 text-slate-400 pointer-events-none flex items-center justify-center">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
