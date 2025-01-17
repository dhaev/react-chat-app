import React from 'react';
import UserProfile from './UserProfile';
import Search from './Search';
import ChatList from './ChatList';

function ProfileWrapper() {
  return (
    <div className="col-3 d-flex flex-column vh-100 border border-right ">
      <UserProfile />
      <Search />
      <ChatList />
    </div>
  );
}

export default ProfileWrapper;