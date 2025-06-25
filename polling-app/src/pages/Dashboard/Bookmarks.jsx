import React, { useContext, useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import useUserAuth from '../../hooks/useUserAuth';
import { useNavigate } from 'react-router-dom';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';
import PollCard from '../../components/PollCards/PollCard';
import InfiniteScroll from "react-infinite-scroll-component";
import EmptyCard from '../../components/cards/EmptyCard';
import BOOKMARK_ICON from '../../assets/images/bookmark-icon.png'; // Adjust the path as necessary
import { UserContext } from '../../context/UserContext';

const PAGE_SIZE = 10; // Define how many polls per page

const Bookmarks = () => {
  useUserAuth();

  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [bookmaredPolls, setBookmarkedPolls] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

 
  const fetchbookmaredPolls = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(API_PATHS.POLLS.GET_BOOKMARKED);

      if (response.data?.polls?.length > 0) {
        setBookmarkedPolls((prevPolls) => [...prevPolls, ...response.data.polls]);
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
      fetchbookmaredPolls();
       return () => {};
  }, [page]);

  return (
    <DashboardLayout activeMenu="Bookmarks">
      <div className='my-5 mx-auto'>
        <h2 className='text-xl font-medium text-black'>Bookmarks</h2>

            {bookmaredPolls.length > 0 && !loading && (
        <EmptyCard
           imgSrc={BOOKMARK_ICON}
           message="You haven't Bookmarked polls yet! Start bookmarking your favorites to keep track of them!"
           btnText="Explore"
           onClick={() => navigate('/dashboard')} 
           />
       )}

         <InfiniteScroll 
          dataLength={bookmaredPolls.length}
          next={loadMorePolls}
          hasMore={hasMore}
          loader={<h4 className='info-text'>Loading...</h4>}
          endMessage={<p className='info-text'>No more polls to displsy.</p>}
          >

        {bookmaredPolls.map((poll) => {
          if(!user.bookmarkedPolls?.includes(poll._id)) return null;
          return ( // Ensure the poll is bookmarked by the user
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
          
        )})}
      

        {/* Optional: Render Polls */}
        <div className='mt-4 space-y-4'>
          {bookmaredPolls.map((poll) => (
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

export default Bookmarks;
