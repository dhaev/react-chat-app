import React, { useRef, useState } from 'react';
import {OverlayTrigger } from 'react-bootstrap';
import { debounce } from 'lodash';
import { getRequest } from '../Utils/Axios.js';
import { useMarkAsRead } from '../Hook/useMarkAsRead';
import { FIND_USER } from '../Utils/apiEndpoints';
import { useGlobalState } from '../Provider/GlobalStateProvider';
import { ChatListItem } from './UserList.js';

const Search = () => {
  const { setSelectedChat, selectedChat } = useGlobalState();
  const markAsRead = useMarkAsRead();
  const inputValue = useRef('');
  const [data, setData] = useState(null);

  const handleSearch = debounce(async () => {
    if (inputValue.current.value && inputValue.current.value.trim() !=='') {
      try {
        const response = await getRequest( FIND_USER , { searchQuery: inputValue.current.value });
        setData(response.data);
      } catch (error) {
        // handle error
      }
    } else {
      setData(null);
    }
  }, 300);

  const popover = (
    <div className="container-fluid over-lay search-users search-list" id="search-users" >
      {(data && data.length > 0) ? data.map((contact) => (
        <ChatListItem
          key={contact._id}
          contact={contact}
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          markAsRead={markAsRead}
        />
      )) : ""}
    </div>
  );

  return (
    <>
      <OverlayTrigger trigger="focus" placement="bottom" overlay={popover} rootClose={false}>
        <div className="p-3 input-group border-bottom mb-1">
          <input
            type="text"
            className="form-control"
            ref={inputValue}
            onKeyUp={handleSearch}
            placeholder='find users...'
          />
          <button className="btn btn-info fa fa-search"></button>
        </div>
      </OverlayTrigger>
    </>
  );
};

export default Search;
