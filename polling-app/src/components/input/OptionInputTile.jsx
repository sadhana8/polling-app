// File: src/components/input/OptionInputTile.jsx
import React from 'react';
import { MdRadioButtonChecked, MdRadioButtonUnchecked } from 'react-icons/md';

const OptionInputTile = ({ isSelected, label, onSelect }) => {
  return (
    <button
      type="button"
      className={`w-full flex items-center gap-2 px-3 py-1 mb-4 border rounded-md ${
        isSelected
          ? 'text-white bg-[#00a896] border-sky-400'
          : 'text-black bg-slate-200/80 border-slate-200'
      }`}
      onClick={onSelect}
      aria-pressed={isSelected}
    >
      {isSelected ? (
        <MdRadioButtonChecked className="text-lg text-white" />
      ) : (
        <MdRadioButtonUnchecked className="text-lg text-slate-400" />
      )}
      <span className="text-[13px]">{label}</span>
    </button>
  );
};

export default OptionInputTile;
