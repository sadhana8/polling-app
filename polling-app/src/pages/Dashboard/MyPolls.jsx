import React, { useContext, useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import useUserAuth from '../../hooks/useUserAuth';
import HeaderWithFilter from '../../components/layout/HeaderWithFilter';
import { useNavigate } from 'react-router-dom';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';
import PollCard from '../../components/PollCards/PollCard';
import InfiniteScroll from 'react-infinite-scroll-component';
import { UserContext } from '../../context/UserContext';
import EmptyCard from '../../components/cards/EmptyCard';
import Spinner from '../../components/common/Spinner';
import CREATE_ICON from '../../assets/images/create-icon.png';
import { Toaster } from "react-hot-toast";

const PAGE_SIZE = 10;

const MyPolls = () => {
  useUserAuth();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [allPolls, setAllPolls] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [error, setError] = useState('');

  const fetchAllPolls = async (overridePage = page) => {
    if (loading || !user?._id) return;

    setLoading(true);
    setError('');

    try {
      const response = await axiosInstance.get(
        `${API_PATHS.POLLS.GET_ALL}?page=${overridePage}&limit=${PAGE_SIZE}&type=${filterType}&creatorId=${user._id}`
      );

      const newPolls = response.data?.polls || [];

      if (overridePage === 1) {
        setAllPolls(newPolls);
      } else {
        setAllPolls((prevPolls) => [...prevPolls, ...newPolls]);
      }

      setHasMore(newPolls.length === PAGE_SIZE);
    } catch (err) {
      console.error('Error fetching polls:', err);
      setError('Failed to load your polls.');
    } finally {
      setLoading(false);
    }
  };

  const loadMorePolls = () => {
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    setPage(1);
    fetchAllPolls(1);
  }, [filterType]);

  useEffect(() => {
    if (page !== 1) {
      fetchAllPolls();
    }
  }, [page]);

  const handleClosePoll = async (pollId) => {
    try {
      await axiosInstance.patch(API_PATHS.POLLS.CLOSE(pollId));
      Toaster.success("Poll closed successfully");
      fetchAllPolls(1);
    } catch (error) {
      Toaster.error("Failed to close poll", error?.response?.data?.message || "An error occurred" );
    }
  };

  const handleDeletePoll = async (pollId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this poll?");
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(API_PATHS.POLLS.DELETE(pollId));
      Toaster.success("Poll deleted successfully");
      fetchAllPolls(1);
    } catch (error) {
     Toaster.error("Failed to delete poll", error?.response?.data?.message || "An error occurred");
    }
  };

  return (
    <DashboardLayout activeMenu="My polls">
      <div className='bg-gray-100/80 my-5 p-5 rounded-lg mx-auto'>
        <HeaderWithFilter
          title="My Polls"
          filterType={filterType}
          setFilterType={setFilterType}
        />

        {loading && page === 1 && <Spinner />}
        {error && <p className='text-red-500 mt-4'>{error}</p>}

        {!loading && allPolls.length === 0 && !error && (
          <EmptyCard
            imgSrc={CREATE_ICON}
            message="Welcome! You haven't created any polls yet."
            btnText="Create Poll"
            onClick={() => navigate('/create-poll')}
          />
        )}

        {allPolls.length > 0 && (
          <InfiniteScroll
            dataLength={allPolls.length}
            next={loadMorePolls}
            hasMore={hasMore}
            loader={<Spinner />}
            endMessage={<p className='info-text text-center'>No more polls to display.</p>}
          >
            {allPolls.map((poll) => (
              <PollCard
                key={`my_${poll._id}`}
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
                showActions={true}
                onClose={handleClosePoll}
                onDelete={handleDeletePoll}
              />
            ))}
          </InfiniteScroll>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyPolls;
