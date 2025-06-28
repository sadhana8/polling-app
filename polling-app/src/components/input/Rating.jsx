// File: src/components/input/Rating.jsx
import React, { useState } from 'react';
import { HiMiniStar } from 'react-icons/hi2';

const Rating = ({
  maxStars = 5,
  value = 0,
  onChange,
  readOnly = false
}) => {
  const [hoverValue, setHoverValue] = useState(0);

  const handleClick = (rating) => {
    if (!readOnly && onChange) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating) => {
    if (!readOnly) {
      setHoverValue(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverValue(0);
    }
  };

  return (
    <div className={`flex gap-2 ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}>
      {[...Array(maxStars)].map((_, index) => {
        const starValue = index + 1;
        const isActive = starValue <= (hoverValue || value);
        return (
          <span
            key={index}
            className={`text-3xl transition-colors ${
              isActive ? 'text-yellow-400' : 'text-gray-300'
            }`}
            role={!readOnly ? 'button' : undefined}
            tabIndex={!readOnly ? 0 : -1}
            aria-label={`Rate ${starValue} star${starValue > 1 ? 's' : ''}`}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
          >
            <HiMiniStar />
          </span>
        );
      })}
    </div>
  );
};

export default Rating;
