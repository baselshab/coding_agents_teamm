import React from 'react';

export const InputField = ({ label, id, error, type = 'text', ...props }) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <input
        id={id}
        type={type}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 sm:text-sm ${
          error
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
            : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'
        }`}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};