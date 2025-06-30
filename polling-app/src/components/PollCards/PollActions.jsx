import React, { useState } from 'react';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';

const PollActions = ({
  isVoteComplete,
  inputCaptured,
  onVoteSubmit,
  isBookmarked,
  toggleBookmark,
  isMyPoll,
  pollClosed,
  onClosePoll,
  onDelete,
}) => {
  const [loading, setLoading] = useState(false);

  const handleVoteClick = async () => {
    setLoading(true);
    try {
      await onVoteSubmit();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Voted or Closed badge */}
      {(isVoteComplete || pollClosed) && (
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${
            pollClosed
              ? 'bg-red-100 text-red-700'
              : 'bg-blue-100 text-blue-700'
          }`}
        >
          {pollClosed ? 'Closed' : 'Voted'}
        </span>
      )}

      {/* Owner-only actions */}
      {isMyPoll && !pollClosed && (
        <>
          <button
            onClick={onClosePoll}
            className="text-xs px-2 py-1 rounded-md bg-orange-100 text-orange-700 hover:bg-orange-200"
          >
            Close
          </button>

          <button
            onClick={onDelete}
            className="text-xs px-2 py-1 rounded-md bg-red-100 text-red-700 hover:bg-red-200"
          >
            Delete
          </button>
        </>
      )}

      {/* Bookmark icon */}
      <button
        className="text-xl text-slate-400 hover:text-teal-500"
        onClick={toggleBookmark}
        title={isBookmarked ? 'Remove Bookmark' : 'Add to Bookmarks'}
      >
        {isBookmarked ? <FaBookmark className="text-teal-600" /> : <FaRegBookmark />}
      </button>

      {/* Submit Vote Button */}
      {inputCaptured && !isVoteComplete && !pollClosed && (
        <button
          onClick={handleVoteClick}
          disabled={loading}
          className="text-xs px-3 py-1 rounded-md bg-teal-600 text-white hover:bg-teal-700 transition ml-2"
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      )}
    </div>
  );
};

export default PollActions;
