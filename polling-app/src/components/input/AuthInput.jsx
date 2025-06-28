// File: src/components/form/AuthInput.jsx
import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';

const AuthInput = ({
  value,
  onChange,
  label,
  placeholder,
  type = 'text',
  name = ''
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className='mb-6'>
      <label
        htmlFor={inputId}
        className='block text-sm font-medium text-slate-700 mb-1'
      >
        {label}
      </label>

      <div className='relative'>
        <input
          id={inputId}
          name={name || inputId}
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
          placeholder={placeholder}
          autoComplete={type === 'password' ? 'current-password' : 'off'}
          className='w-full px-4 py-3 pr-12 text-sm text-slate-900 bg-white rounded-md border border-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-150'
          value={value}
          onChange={onChange}
        />

        {type === 'password' && (
          <button
            type='button'
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className='absolute inset-y-0 right-3 flex items-center text-slate-500 cursor-pointer hover:text-primary'
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaRegEye size={18} /> : <FaRegEyeSlash size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthInput;
