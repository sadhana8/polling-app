// File: src/components/input/OptionImageSelector.jsx
import React from 'react';
import { HiOutlineTrash, HiMiniPlus } from 'react-icons/hi2';

const OptionImageSelector = ({ imageList, setImageList }) => {
  const maxImages = 4;

  const handleAddImage = (event) => {
    const file = event.target.files[0];
    if (file && imageList.length < maxImages) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageList([
          ...imageList,
          { base64: reader.result, file }
        ]);
      };
      reader.readAsDataURL(file);
    }
    event.target.value = null;
  };

  const handleDeleteImage = (index) => {
    const updatedList = imageList.filter((_, idx) => idx !== index);
    setImageList(updatedList);
  };

  return (
    <div>
      {imageList?.length > 0 && (
        <div className='grid grid-cols-2 gap-4 mb-4'>
          {imageList.map((item, index) => (
            <div key={index} className='bg-gray-600/10 rounded-md relative'>
              <img
                src={item.base64}
                alt={`Selected_${index}`}
                className='w-full h-36 object-contain rounded-md'
              />
              <button
                onClick={() => handleDeleteImage(index)}
                className='text-red-500 bg-gray-100 rounded-full p-2 absolute top-2 right-2'
                aria-label={`Delete image ${index + 1}`}
              >
                <HiOutlineTrash className='text-lg' />
              </button>
            </div>
          ))}
        </div>
      )}

      {imageList.length < maxImages && (
        <div className='flex items-center gap-5'>
          <input
            type='file'
            accept='image/jpeg, image/png'
            onChange={handleAddImage}
            className='hidden'
            id='imageInput'
          />

          <label htmlFor='imageInput' className='btn-small text-nowrap py-1 cursor-pointer'>
            <HiMiniPlus className='text-lg' />
            Select Image
          </label>
        </div>
      )}
    </div>
  );
};

export default OptionImageSelector;
