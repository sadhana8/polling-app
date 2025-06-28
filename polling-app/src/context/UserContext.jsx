// File: src/context/UserContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  const updateUser = (userData) => {
    setUser(userData);
  };

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUserStats = (key, value) => {
    setUser((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const onUserVoted = () => {
    const totalPollsVotes = user?.totalPollsVotes || 0;
    updateUserStats("totalPollsVotes", totalPollsVotes + 1);
  };

  const onPollCreateOrDelete = (type = "create") => {
    const totalPollsCreated = user?.totalPollsCreated || 0;
    updateUserStats("totalPollsCreated", type === "create" ? totalPollsCreated + 1 : totalPollsCreated - 1);
  };

const toggleBookmarkId = (id) => {
  const bookmarks = user.bookmarkedPolls || [];
  const index = bookmarks.indexOf(id);

  if (index === -1) {
    setUser((prev) => ({
      ...prev,
      bookmarkedPolls: [...bookmarks, id],
      totalPollsBookmarked: prev.totalPollsBookmarked + 1,
    }));
  } else {
    setUser((prev) => ({
      ...prev,
      bookmarkedPolls: bookmarks.filter((item) => item !== id),
      totalPollsBookmarked: prev.totalPollsBookmarked - 1,
    }));
  }
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
