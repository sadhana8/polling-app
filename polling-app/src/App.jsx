import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginForm from './pages/Auth/LoginForm';
import SignUpForm from './pages/Auth/SignUpForm';
import Home from './pages/Dashboard/Home';
import CreatePoll from './pages/Dashboard/CreatePoll';
import MyPolls from './pages/Dashboard/MyPolls';
import VotedPolls from './pages/Dashboard/VotedPolls';
import Bookmarks from './pages/Dashboard/Bookmarks';
import UserProvider from "./context/UserContext";

const App = () => {
  return (
    <div >
      <UserProvider>
      <Router>
        <Routes>
           <Route path="/" element={<Root />} />
           <Route path="/login" element={<LoginForm />} />
           <Route path="/signup" element={<SignUpForm />} />
           <Route path="/dashboard" element={<Home />} />
           <Route path="/create-poll" element={<CreatePoll />} />
           <Route path="/my-poll" element={<MyPolls />} />
           <Route path="/voted-poll" element={<VotedPolls />} />
           <Route path="/bookmarked-polls" element={<Bookmarks />} />
        </Routes>
      </Router>
      </UserProvider>
    </div>
  )
}

export default App;

//Define the root component to handle the initial redirect
const Root = () => {
  //Check if token exists in localstorage
  const isAuthenticated = !!localStorage.getItem("token");

  //Redirect to dashboard if authenticated, otherwise to login
  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
};
