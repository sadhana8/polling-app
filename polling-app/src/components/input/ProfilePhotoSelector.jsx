// File: src/components/input/ProfilePhotoSelector.jsx
import React, { useRef, useState, useEffect } from 'react';
import { LuUser, LuUpload, LuTrash } from 'react-icons/lu';

const ProfilePhotoSelector = ({ image, setImage }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Create object URL for preview and clean up on unmount or image change
  useEffect(() => {
    if (image) {
      const objectUrl = URL.createObjectURL(image);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
    setPreviewUrl(null);
  }, [image]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  const onChooseFile = () => {
    inputRef.current?.click();
  };

  return (
    <div className='flex justify-center mb-6'>
      <input
        type='file'
        accept='image/*'
        ref={inputRef}
        onChange={handleImageChange}
        className='hidden'
      />

      {!image ? (
        <div className='w-20 h-20 flex items-center justify-center bg-sky-100 rounded-full relative'>
          <LuUser className='text-4xl text-[#00bfa6]' />
          <button
            type='button'
            className='w-8 h-8 flex items-center justify-center bg-sky-300 text-white rounded-full absolute -bottom-1 -right-1'
            onClick={onChooseFile}
            aria-label='Upload profile photo'
          >
            <LuUpload />
          </button>
        </div>
      ) : (
        <div className='relative'>
          <img
            src={previewUrl}
            alt='Profile preview'
            className='w-20 h-20 rounded-full object-cover'
          />
          <button
            type='button'
            className='w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1'
            onClick={handleRemoveImage}
            aria-label='Remove profile photo'
          >
            <LuTrash />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;
