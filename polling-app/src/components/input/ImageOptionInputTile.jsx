// File: src/components/input/ImageOptionInputTile.jsx
import React from 'react';

const ImageOptionInputTile = ({ isSelected, imgUrl, onSelect }) => {
  const borderStyle = isSelected
    ? 'border-2 border-[#00a896]'
    : 'border border-transparent';

  return (
    <button
      className={`w-full flex items-center gap-2 bg-slate-200/40 mb-4 rounded-md overflow-hidden focus:outline-none focus:ring-2 focus:ring-sky-400 ${borderStyle}`}
      onClick={onSelect}
      aria-pressed={isSelected}
    >
      <img
        src={imgUrl}
        alt="Poll option"
        className='w-full h-36 object-contain'
      />
    </button>
  );
};

export default ImageOptionInputTile;
