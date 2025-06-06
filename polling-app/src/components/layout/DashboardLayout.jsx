import React from 'react';
import Navbar from "./Navbar";


const DashboardLayout = ({ children, activeMenu }) => {
  return (
    <div>
        <Navbar />
        <div className='max-[1080px]:hidden'>
            <SideMenu activeMenu={activeMenu} />
        </div>
        <div>
            {children}
        </div>
    </div>
  )
}

export default DashboardLayout;