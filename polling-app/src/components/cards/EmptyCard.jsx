import React from 'react';

const EmptyCard = ({imgSrc, message, btnText, onClick }) => {
  return (
    <div className='bg-gray-100/50 flex flex-col items-center justify-center mt-6 py-20 rounded-lg'>
        <img src={imgSrc} alt="No notes" className='w-36 md:w-48 ' />
        <p className='w-2/3 text-xs md:text-[14px] text-slate-900 text-center leading-6 mt-7'>
        {message}
        </p>
        {
            btnText && onClick && (
                <button
                    className='mt-4 px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700'
                    onClick={onClick}
                >
                    {btnText}
                </button>
            )   
        }
    </div>
  )
}

export default EmptyCard;