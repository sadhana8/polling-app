import React from 'react';
import DashboardLayout from './DashboardLayout';

const Navbar = () => {
  return (
    <div className='flex gap-5 border-b border-white-100 bg-slate-50/50 backdrop-blur-[2px]p-4 sticky top-0 z-30'>
        <h2 className="text-lg font-medium text-black">Polling App</h2>
    </div>
  )
}

export default Navbar