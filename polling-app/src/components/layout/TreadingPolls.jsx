import React from 'react';

const TreadingPolls = ({stats}) => {
  return (
    <div className='bg-slate-100/50 rounded-lg mt-6 overflow-hidden sticky top-[80px] p-5'>
        <h6 className='text-sm text-black font-medium'> Treading </h6>
        <div className='mt-4'>
            {stats.map((item) => (
                <div className='flex items-center justify-betweenrounded-lg cursor-pointer mb-1 px-3 py-2 hover:bg-slate-300/30'>
                    <p className='text-xs text-slate-900'>{item.label}</p>
                    <span className='text-sm text-slate-700  rounded py-[12px] px-4'>{item.count}</span>
                </div>
            ))}
        </div>
    </div>
  )
}

export default TreadingPolls;