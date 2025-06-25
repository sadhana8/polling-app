import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import useUserAuth from '../../hooks/useUserAuth';
import { useNavigate } from 'react-router-dom';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';
import PollCard from '../../components/PollCards/PollCard';
import EmptyCard from '../../components/cards/EmptyCard';
import CREATE_ICON from '../../assets/images/create-icon.png'; // Adjust the path as necessary


const PAGE_SIZE = 10; // Define how many polls per page

const VotedPolls = () => {
  useUserAuth();

  const navigate = useNavigate();

  const [votedPolls, setVotedPolls] = useState([]);

  const [loading, setLoading] = useState(false);

 
  const fetchAllPolls = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(API_PATHS.POLLS.VOTED_POLLS);

      if (response.data?.polls?.length > 0) {
        setVotedPolls((prevPolls) => [...prevPolls, ...response.data.polls]);
        
      }
    } catch (error) {
      console.error("Error fetching polls:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAllPolls();
    return () => {};
  }, []);

  

  return (
    <DashboardLayout activeMenu="Voted Polls">
      <div className='my-5 mx-auto'>
        <h2 className='text-xl font-medium text-black'>Voted Polls</h2>

            {votedPolls.length > 0 && !loading && (
        <EmptyCard
           imgSrc={CREATE_ICON}
           message="You have not voted on any polls yet! Start exploring and share your opinion by voting on polls now!"
           btnText="Explore"
           onClick={() => navigate('/dashboard')} 
           />
       )}


        {votedPolls.map((poll) => (
          <PollCard
          key={`dashboard_${poll._id}`}
          pollId= {poll._id}
          question={poll.question}
          type={poll.type}
          options={poll.options}
          voters={poll.voters.length || 0}
          responses={poll.responses || []}
          creatorProfileImg={poll.creator.profileImageUrl || null}
          creatorName={poll.creator.fullName}
          creatorUsername={poll.creator.username}
          userHasVoted={poll.userHasVoted || false}
          isPollClosed={poll.closed || false}
          createdAt={poll.createdAt || false}
          />

        ))}

        {/* Optional: Render Polls */}
        <div className='mt-4 space-y-4'>
          {votedPolls.map((poll) => (
            <div
              key={poll._id}
              className='p-4 border rounded shadow-sm hover:shadow-md cursor-pointer'
              onClick={() => navigate(`/poll/${poll._id}`)}
            >
              <h3 className='text-lg font-semibold'>{poll.question}</h3>
              <p className='text-sm text-gray-600'>Type: {poll.type}</p>
            </div>
          ))}
        </div>  

      </div>
    </DashboardLayout>
  );
};

export default VotedPolls;
