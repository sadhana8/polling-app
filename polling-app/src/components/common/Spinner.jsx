import React from 'react';

const Spinner = () => (
  <div className="text-center py-10">
    <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto" />
    <p className="text-sm text-gray-500 mt-2">Loading...</p>
  </div>
);

export default Spinner;
