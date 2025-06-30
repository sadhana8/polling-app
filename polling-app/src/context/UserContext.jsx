// File: src/context/UserContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Keep localStorage in sync with state
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const updateUser = (userData) => {
    setUser(userData);
  };

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Safely update any single user stat (created, voted, bookmarked)
  const updateUserStats = (key, value) => {
    setUser((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Call this after a vote is submitted
  const onUserVoted = () => {
    const currentVotes = user?.totalPollsVotes || 0;
    updateUserStats('totalPollsVotes', currentVotes + 1);
  };

  // Call this after poll creation/deletion
  const onPollCreateOrDelete = (type = 'create') => {
    const currentCreated = user?.totalPollsCreated || 0;
    updateUserStats(
      'totalPollsCreated',
      type === 'create' ? currentCreated + 1 : Math.max(0, currentCreated - 1)
    );
  };

  // Bookmark toggle logic
  const toggleBookmarkId = (id) => {
    const bookmarks = user?.bookmarkedPolls || [];
    const isAlreadyBookmarked = bookmarks.includes(id);

    const updatedBookmarks = isAlreadyBookmarked
      ? bookmarks.filter((pollId) => pollId !== id)
      : [...bookmarks, id];

    setUser((prev) => ({
      ...prev,
      bookmarkedPolls: updatedBookmarks,
      totalPollsBookmarked: isAlreadyBookmarked
        ? Math.max(0, (prev.totalPollsBookmarked || 0) - 1)
        : (prev.totalPollsBookmarked || 0) + 1,
    }));
  };

  return (
    <UserContext.Provider
      value={{
        user,
        updateUser,
        clearUser,
        onPollCreateOrDelete,
        onUserVoted,
        toggleBookmarkId,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
