import React, { useState } from 'react';
import { Popover, OverlayTrigger } from 'react-bootstrap';
import { getRequest } from './Axios.js';
import { useGlobalState } from './GlobalStateProvider';

const ContactList = ({ data, setChatHeader, setChatMessage }) => {
  return (
    <div className="container-fluid chats" id="chats">
      {(data && data.length > 0) ? data.map((contact) => (
        <div key={contact._id} 
        className= "p-2 justify-content-between align-items-center conversations"  
        onMouseDown={() => {
            setChatMessage(new Map());
            setChatHeader(contact);
          }} >
          <img src={contact.image} alt="" className="avatar img-fluid" />
          <span className="">{contact.displayName}</span>
        </div>
      )): "No results found."} 
    </div>
  );
};

const Search = () => {
  const { setChatHeader, setChatMessage } = useGlobalState(); 
  const [inputValue, setInputValue] = useState('');
  const [data, setData] = useState(null);

  const handleSearch = async () => {
    if(inputValue){
      try {
        const response = await getRequest('/home/searchUsers', {searchQuery: inputValue});
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    } else {
      setData(null);
    }
  };

  const popover = (
    <Popover id="popover-basic" className="no-arrow">
      <Popover.Body>
        <ContactList data={data} setChatHeader={setChatHeader} setChatMessage={setChatMessage} />
      </Popover.Body>
    </Popover>
  );

  return (
    <>
      <OverlayTrigger trigger="focus" placement="bottom" overlay={popover} rootClose={false}>
        <div className="p-2 input-group-sm"> 
          <input
            className="form-control"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyUp={handleSearch}
          />
        </div>
      </OverlayTrigger>
    </>
  );
};

export default Search;
