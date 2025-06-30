import React from 'react';
import CharAvatar from './CharAvatar';

// Small reusable component to show stat label + value
const StatsInfo = ({ label, value }) => {
  return (
    <div className='text-center'>
      <p className='font-medium text-gray-950'>{value}</p>
      <p className='text-xs text-slate-700/80 mt-[2px]'>{label}</p>
    </div>
  );
};

const UserDetailsCard = ({
  profileImageUrl,
  fullname,
  username,
  totalPollsVotes = 0,
  totalPollsCreated = 0,
  totalPollsBookmarked = 0, // ✅ renamed for correctness
}) => {
  return (
    <div className='bg-slate-100/50 rounded-lg mt-16 overflow-hidden'>
      {/* Background header with avatar */}
      <div
        className="w-full h-32 bg-cover flex justify-center bg-sky-200 relative"
        style={{ backgroundImage: "url('/src/assets/images/profile-bg.png')" }}
      >
        <div className='absolute -bottom-10 rounded-full overflow-hidden border-2 border-[#00bfa6]'>
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt="Profile"
              className='w-20 h-20 bg-slate-400 rounded-full object-cover'
            />
          ) : (
            <CharAvatar
              fullName={fullname}
              width="w-20"
              height="h-20"
              style="text-xl"
            />
          )}
        </div>
      </div>

      {/* User info and stats */}
      <div className='mt-12 px-5'>
        <div className='text-center pt-1'>
          <h5 className='text-lg text-gray-500 font-medium leading-6'>
            {fullname}
          </h5>
          <span className='text-[13px] font-medium text-slate-700/60'>
            @{username}
          </span>
        </div>

        <div className='flex items-center justify-center gap-6 flex-wrap my-6'>
          <StatsInfo label="Polls Created" value={totalPollsCreated} />
          <StatsInfo label="Polls Voted" value={totalPollsVotes} />
          <StatsInfo label="Polls Bookmarked" value={totalPollsBookmarked} />
        </div>
      </div>
    </div>
  );
};

export default UserDetailsCard;
