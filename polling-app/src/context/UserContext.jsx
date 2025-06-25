/* eslint-disable react-refresh/only-export-components */
// src/context/UserContext.jsx

import React, { createContext, useState } from 'react';


// Create the context
export const UserContext = createContext();

// Create the provider
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  //Function to update user data
  const updateUser = (userData) => {
    setUser(userData);
  };

  //Function to clear user data (e.g., on logout)
  const clearUser = () => {
    setUser(null);
  };

  //Update user stats

  const updateUserStats = (key, value) => {
    setUser((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  //Update totalPollsVotes count locally
  const onUserVoted = () => {
    const totalPollsVotes = user.totalPollsVotes || 0;
    updateUserStats("totalPollsVotes", totalPollsVotes + 1);
  };

  //Update totalpollsCreated count locally
const onPollCreateOrDelete = (type = "create") => {
  const totalPollsCreated = user?.totalPollsCreated || 0;
  updateUserStats({
    totalPollsCreated:
      type === "create" ? totalPollsCreated + 1 : totalPollsCreated - 1,
  });
};

//Add or Remove poll id from bookmarkedPolls
const toggleBookmark = (id) => {
  const bookmarks = user.bookmarkedPolls || [];

  const index = bookmarks.indexOf(id);

  if(index === -1){
    //Add the Id if it's not in the array
    setUser((prev) => ({
      ...prev,
      bookmarkedPolls: [...bookmarks, id],
      totalPollsBookmarked: prev.totalPollsBookmarked + 1,
    }));
  } else {

    //Remove the ID if it's already in the array
    setUser((prev) => ({
      ...prev,
      bookmarkedPolls: bookmarks.filter((item) => item !== id),
      totalPollsBookmarked: prev.totalPollsBookmarked -1,
    }));
  }
};
  return (
    <UserContext.Provider value={{ user, updateUser, clearUser , onPollCreateOrDelete,onUserVoted, toggleBookmark }}>
      {children}
    </UserContext.Provider>
  );
};
