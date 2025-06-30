import React, { useContext, useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import useUserAuth from '../../hooks/useUserAuth';
import { useNavigate } from 'react-router-dom';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';
import PollCard from '../../components/PollCards/PollCard';
import InfiniteScroll from "react-infinite-scroll-component";
import EmptyCard from '../../components/cards/EmptyCard';
import BOOKMARK_ICON from '../../assets/images/bookmark-icon.png';
import { UserContext } from '../../context/UserContext';

const PAGE_SIZE = 10;

const Bookmarks = () => {
  useUserAuth();

  const navigate = useNavigate();
  const { User } = useContext(UserContext);

  const [bookmarkedPolls, setBookmarkedPolls] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchBookmarkedPolls = async () => {
    if (loading) return;

    setLoading(true);

    try {
      // Assuming API supports pagination via query params like ?page=1&limit=10
      const response = await axiosInstance.get(API_PATHS.POLLS.GET_BOOKMARKED, {
        params: { page, limit: PAGE_SIZE },
      });

      const polls = response.data?.polls || [];

      if (page === 1) {
        setBookmarkedPolls(polls);
      } else {
        setBookmarkedPolls((prevPolls) => [...prevPolls, ...polls]);
      }

      setHasMore(polls.length === PAGE_SIZE);
    } catch (error) {
      console.error("Error fetching polls:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMorePolls = () => {
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    fetchBookmarkedPolls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <DashboardLayout activeMenu="Bookmarks">
      <div className="my-5 mx-auto">
        <h2 className="text-xl font-medium text-black">Bookmarks</h2>

        {bookmarkedPolls.length === 0 && !loading && (
          <EmptyCard
            imgSrc={BOOKMARK_ICON}
            message="You haven't Bookmarked polls yet! Start bookmarking your favorites to keep track of them!"
            btnText="Explore"
            onClick={() => navigate('/dashboard')}
          />
        )}

        <InfiniteScroll
          dataLength={bookmarkedPolls.length}
          next={loadMorePolls}
          hasMore={hasMore}
          loader={<h4 className="info-text">Loading...</h4>}
          endMessage={<p className="info-text">No more polls to display.</p>}
        >
          {bookmarkedPolls.map((poll) => (
            <PollCard
              key={`dashboard_${poll._id}`}
              pollId={poll._id}
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
        </InfiniteScroll>
      </div>
    </DashboardLayout>
  );
};

export default Bookmarks;
