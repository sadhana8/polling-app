// File: src/pages/VotedPolls.jsx
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import useUserAuth from '../../hooks/useUserAuth';
import { useNavigate } from 'react-router-dom';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';
import PollCard from '../../components/PollCards/PollCard';
import EmptyCard from '../../components/cards/EmptyCard';
import CREATE_ICON from '../../assets/images/create-icon.png';
import Spinner from '../../components/common/Spinner';
import HeaderWithFilter from '../../components/layout/HeaderWithFilter';
import { POLL_TYPE } from '../../utils/data';

const VotedPolls = () => {
  useUserAuth();
  const navigate = useNavigate();

  const [allPolls, setAllPolls] = useState([]);
  const [filteredPolls, setFilteredPolls] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAllPolls = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axiosInstance.get(API_PATHS.POLLS.VOTED_POLLS);
      const polls = response.data.polls || [];
      setAllPolls(polls);
      setFilteredPolls(polls);
    } catch (err) {
      setError('Failed to fetch voted polls.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPolls();
  }, []);

  useEffect(() => {
    if (filterType === '') {
      setFilteredPolls(allPolls);
    } else {
      const filtered = allPolls.filter((poll) => poll.type === filterType);
      setFilteredPolls(filtered);
    }
  }, [filterType, allPolls]);

  return (
    <DashboardLayout activeMenu="Voted Polls">
      <div className="bg-gray-100/80 my-5 p-5 rounded-lg mx-auto">
        <HeaderWithFilter
          title="Voted Polls"
          filterType={filterType}
          setFilterType={setFilterType}
        />

        {loading && <Spinner />}
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

        {!loading && filteredPolls.length === 0 && !error && (
          <EmptyCard
            imgSrc={CREATE_ICON}
            message="You have not voted on any polls yet!"
            btnText="Explore"
            onClick={() => navigate('/dashboard')}
          />
        )}

        <div className="grid gap-6 mt-6">
          {filteredPolls.map((poll) => (
            <PollCard
              key={`voted_${poll._id}`}
              pollId={poll._id}
              question={poll.question}
              type={poll.type}
              options={poll.options}
              voters={poll.voters?.length || 0}
              responses={poll.responses || []}
              creatorProfileImg={poll.creator?.profileImageUrl || null}
              creatorName={poll.creator?.fullName}
              creatorUsername={poll.creator?.username}
              userHasVoted={poll.userHasVoted || false}
              isPollClosed={poll.closed || false}
              createdAt={poll.createdAt || null}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VotedPolls;
