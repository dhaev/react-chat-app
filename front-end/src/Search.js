import React, { useState } from 'react';
import { Popover, OverlayTrigger } from 'react-bootstrap';
import { getRequest } from './Axios.js';
import { useGlobalState } from './GlobalStateProvider';
import { useMarkAsRead,ChatListItem } from './UserList'
import { debounce } from 'lodash'; // import debounce from lodash

const Search = () => {
  const { setChatHeader, selectedChat, setSelectedChat} = useGlobalState();
  const markAsRead = useMarkAsRead();
  const [inputValue, setInputValue] = useState('');
  const [data, setData] = useState(null);

  const handleSearch = debounce(async () => { // wrap handleSearch with debounce
    if (inputValue) {
      try {
        const response = await getRequest('/home/searchUsers', { searchQuery: inputValue });
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    } else {
      setData(null);
    }
  }, 300);

  const popover = (
    // <Popover id="popover-basic" className="no-arrow">
    //   <Popover.Body>
      <div className="container-fluid w-25  over-lay chats  overflow-auto" id="chats">
      {(data && data.length > 0) ? data.map((contact) => (
       <ChatListItem
       key={contact._id}
       contact={contact}
       selectedChat={selectedChat}
       setSelectedChat={setSelectedChat}
       markAsRead={markAsRead}
       setChatHeader={setChatHeader}
     />
      )) : "No results found."}
    </div>
    
    //   </Popover.Body>
    // </Popover>
  );

  return (
    <>
      <OverlayTrigger trigger="focus" placement="bottom" overlay={popover} rootClose={false}>
      <div className="p-3 input-group border-bottom mb-1">
      <input
        type="text"
        className="form-control"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onKeyUp={handleSearch}
        placeholder='find a user...'
      />
      <button className="btn btn-info fa fa-search" ></button>
    
    </div>

      </OverlayTrigger>
    </>
  );
};

export default Search;
