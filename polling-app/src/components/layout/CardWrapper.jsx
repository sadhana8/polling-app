// File: src/components/layout/CardWrapper.jsx
import React from 'react';

const CardWrapper = ({ children, className = '', title = '', subtitle = '' }) => {
  return (
    <div className={`bg-white p-6 rounded-xl shadow-md ${className}`}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h2 className="text-xl font-semibold text-gray-800">{title}</h2>}
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

export default CardWrapper;
