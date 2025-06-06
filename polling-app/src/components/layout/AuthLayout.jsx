import React from 'react';

import UI_ELEMENT from '../../assets/images/ui-element.png';
import CARD_1 from '../../assets/images/auth-card-1.png';
import CARD_2 from '../../assets/images/auth-card-2.png';
import CARD_3 from '../../assets/images/auth-card-3.png';

const AuthLayout = ({ children }) => {
  return (
    <div className="flex h-screen">
      {/* Left Auth Form Section */}
      <div className="w-full md:w-1/2 px-8 md:px-12 pt-6 pb-10 flex flex-col">
        <h2 className="text-xl font-semibold text-black mb-6">Polling App</h2>
        <div className="flex-grow flex items-center">{children}</div>
      </div>

      {/* Right Decorative Section */}
      <div className="hidden md:block w-1/2 h-full bg-sky-50 relative overflow-hidden bg-cover bg-no-repeat bg-center bg-auth-bg-img">
        <img
          src={UI_ELEMENT}
          alt="UI Element Top"
          className="w-1/2 absolute right-0 top-14"
        />
        <img
          src={UI_ELEMENT}
          alt="UI Element Bottom"
          className="w-[55%] rotate-180 absolute left-0 -bottom-[20%]"
        />

        <img
          src={CARD_1}
          alt="Card 1"
          className="w-64 lg:w-72 absolute top-[8%] left-[10%] shadow-lg shadow-blue-400/15 rounded-lg"
        />
        <img
          src={CARD_3}
          alt="Card 3"
          className="w-64 lg:w-72 absolute top-[34%] left-[54%] shadow-lg shadow-blue-400/15 rounded-lg"
        />
        <img
          src={CARD_2}
          alt="Card 2"
          className="w-64 lg:w-72 absolute top-[70%] left-[10%] shadow-lg shadow-blue-400/15 rounded-lg"
        />
      </div>
    </div>
  );
};

export default AuthLayout;
