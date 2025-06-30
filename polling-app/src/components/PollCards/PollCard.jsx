import React, { useCallback, useContext, useState, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';
import PollActions from './PollActions';
import PollContent from './PollContent';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';
import PollingResultContent from './PollingResultContent';
import UserProfileInfo from '../../components/cards/UserProfileInfo';

const PollCard = ({
  pollId,
  question,
  type,
  options,
  voters,
  responses,
  creatorProfileImg,
  creatorName,
  creatorUsername,
  userHasVoted,
  isMyPoll,
  isPollClosed,
  createdAt,
}) => {
  const { user, onUserVoted, toggleBookmarkId, onPollCreateOrDelete } = useContext(UserContext);

  const [selectedOptionIndex, setSelectedOptionIndex] = useState(-1);
  const [rating, setRating] = useState(0);
  const [userResponse, setUserResponse] = useState('');
  const [isVoteComplete, setIsVoteComplete] = useState(userHasVoted);
  const [pollResult, setPollResult] = useState({ options, voters, responses });

  const [pollClosed, setPollClosed] = useState(isPollClosed || false);
  const [pollDeleted, setPollDeleted] = useState(false);

  // ⚠️ IMPORTANT: Dynamic bookmark state synced with UserContext
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (user?.bookmarkedPolls?.includes(pollId)) {
      setIsBookmarked(true);
    } else {
      setIsBookmarked(false);
    }
  }, [user.bookmarkedPolls, pollId]);

  const handleInput = (value) => {
    if (type === 'rating') setRating(value);
    else if (type === 'open-ended') setUserResponse(value);
    else setSelectedOptionIndex(value);
  };

  const getPostData = useCallback(() => {
    if (type === 'open-ended') {
      return { responseText: userResponse, voterId: user._id };
    }
    if (type === 'rating') {
      return { optionIndex: rating - 1, voterId: user._id };
    }
    return { optionIndex: selectedOptionIndex, voterId: user._id };
  }, [type, userResponse, rating, selectedOptionIndex, user]);

  const getPollDetail = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.POLLS.GET_BY_ID(pollId));
      if (response.data) {
        const pollDetails = response.data;
        setPollResult({
          options: pollDetails.options || [],
          voters: pollDetails.voters.length || 0,
          responses: pollDetails.responses || [],
        });
      }
    } catch (error) {
      console.error(error.response?.data?.message || 'Error getting poll details');
    }
  };

  const handleVoteSubmit = async () => {
    try {
      await axiosInstance.post(API_PATHS.POLLS.VOTE(pollId), getPostData());
      await getPollDetail();
      setIsVoteComplete(true);
      onUserVoted();
      toast.success('Vote submitted successfully!');
    } catch (error) {
      console.error(error.response?.data?.message || 'Error submitting vote');
      toast.error('Error submitting vote. Please try again.');
    }
  };

  const toggleBookmark = async () => {
    try {
      const response = await axiosInstance.post(API_PATHS.POLLS.BOOKMARK(pollId));
      toggleBookmarkId(pollId); // Updates UserContext
      setIsBookmarked((prev) => !prev); // Local optimistic update
      toast.success(response.data.message || 'Bookmark updated!');
    } catch (error) {
      console.error('Bookmark error:', error?.response?.data || error.message);
      toast.error('Error bookmarking poll. Please try again.');
    }
  };

  const closePoll = async () => {
    try {
      const response = await axiosInstance.post(API_PATHS.POLLS.CLOSE(pollId));
      if (response.data) {
        setPollClosed(true);
        toast.success(response.data?.message || 'Poll closed successfully!');
      }
    } catch (error) {
      toast.error('Error closing the poll.');
      console.error('Error closing poll', error);
    }
  };

  const deletePoll = async () => {
    try {
      const response = await axiosInstance.post(API_PATHS.POLLS.DELETE(pollId));
      if (response.data) {
        setPollDeleted(true);
        onPollCreateOrDelete();
        toast.success(response.data?.message || 'Poll deleted successfully!');
      }
    } catch (error) {
      toast.error('Error deleting the poll.');
      console.error('Error deleting poll', error);
    }
  };

  if (pollDeleted) return null;

  return (
    <div className="bg-white shadow-md rounded-xl px-6 py-5 my-6 transition-transform transform hover:scale-[1.01] duration-200 ease-in-out">
      <div className="flex items-start justify-between">
        <UserProfileInfo
          imgUrl={creatorProfileImg}
          fullname={creatorName}
          username={creatorUsername}
          createdAt={createdAt}
        />

        <PollActions
          pollId={pollId}
          isVoteComplete={isVoteComplete}
          inputCaptured={!!(userResponse || selectedOptionIndex >= 0 || rating)}
          onVoteSubmit={handleVoteSubmit}
          isBookmarked={isBookmarked}
          toggleBookmark={toggleBookmark}
          isMyPoll={isMyPoll}
          pollClosed={pollClosed}
          onClosePoll={closePoll}
          onDelete={deletePoll}
        />
      </div>

      <div className="ml-14 mt-4">
        <p className="text-base font-semibold text-gray-800 mb-3">{question}</p>

        {isVoteComplete || pollClosed ? (
          <PollingResultContent
            type={type}
            options={pollResult.options || []}
            voters={pollResult.voters}
            responses={pollResult.responses || []}
          />
        ) : (
          <PollContent
            type={type}
            options={options}
            selectedOptionIndex={selectedOptionIndex}
            onOptionSelect={handleInput}
            rating={rating}
            onRatingChange={handleInput}
            userResponse={userResponse}
            onResponseChange={handleInput}
          />
        )}
      </div>
    </div>
  );
};

export default PollCard;
