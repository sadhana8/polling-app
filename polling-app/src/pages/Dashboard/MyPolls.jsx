import React, { useContext, useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import useUserAuth from '../../hooks/useUserAuth';
import HeaderWithFilter from '../../components/layout/HeaderWithFilter';
import { useNavigate } from 'react-router-dom';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';
import PollCard from '../../components/PollCards/PollCard';
import InfiniteScroll from "react-infinite-scroll-component";
import { UserContext } from '../../context/UserContext';
import EmptyCard from '../../components/cards/EmptyCard';
import CREATE_ICON from '../../assets/images/create-icon.png'; // Adjust the path as necessary

const PAGE_SIZE = 10; // Define how many polls per page

const MyPolls = () => {
  useUserAuth();
  
  const {user} = useContext(UserContext);
  const navigate = useNavigate();

  const [allPolls, setAllPolls] = useState([]);
  const [ setStats] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [filterType, setFilterType] = useState("");

  const fetchAllPolls = async (overridePage = page) => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(
        `${API_PATHS.POLLS.GET_ALL}?page=${overridePage}&limit=${PAGE_SIZE}&type=${filterType}&creatorId=${user._id}`
      );

      if (response.data?.polls?.length > 0) {
        setAllPolls((prevPolls) =>
          overridePage === 1
            ? response.data.polls
            : [...prevPolls, ...response.data.polls]
        );
        setStats(response.data?.stats || []);
        setHasMore(response.data.polls.length === PAGE_SIZE);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching polls:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMorePolls =() => {
    setPage((prevPage) => prevPage + 1 );
  }
  
  useEffect(() => {
    setPage(1);
    fetchAllPolls(1);
  }, [filterType]);

  useEffect(() => {
    if (page !== 1) {
      fetchAllPolls();
    }
  }, [page]);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className='my-5 mx-auto'>
        <HeaderWithFilter
          title="My Polls"
          filterType={filterType}
          setFilterType={setFilterType}
        />

       {allPolls.length === 0 && !loading && (
        <EmptyCard
           imgSrc={CREATE_ICON}
           message="Welcome! You're the first user of the system, and there are no polls yet. Start by creating the first poll"
           btnText="Create Poll"
           onClick={() => navigate('/dashboard')} 
           />
       )}

         <InfiniteScroll 
          dataLength={allPolls.length}
          next={loadMorePolls}
          hasMore={hasMore}
          loader={<h4 className='info-text'>Loading...</h4>}
          endMessage={<p className='info-text'>No more polls to displsy.</p>}
          >

        {allPolls.map((poll) => (
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
       {/* REMOVE THIS IF USING PollCard */}
<div className='mt-4 space-y-4'>
  {allPolls.map((poll) => (
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


        {/* Loading indicator */}
        {loading && <p className='text-center text-gray-500 mt-4'>Loading...</p>}

        {/* Load more button */}
        {!loading && hasMore && (
          <div className='flex justify-center mt-4'>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              className='px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700'
            >
              Load More
            </button>
          </div>
        )}
        </InfiniteScroll>
      </div>
    </DashboardLayout>
  );
};

export default MyPolls;