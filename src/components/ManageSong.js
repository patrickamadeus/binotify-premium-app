import React from 'react'
import ModalAddSong from './ModalAddSong';
import SongList from './SongList';
import Navbar from './Navbar';

const ManageSong = () => {
  const cookieList = document.cookie.replace(/\s/g, "").split(";");
  const cookieMap = new Map();
  cookieList.forEach(cookie => { const [key, value] = cookie.split("="); cookieMap.set(key, value);});
  console.log(cookieMap.get("isAdmin"));

  if (!cookieMap.get("isAdmin")) {
    window.location = "/";
}

if (cookieMap.get("isAdmin") === "true") {
    window.location = "/subscription";
}

  return (
    <div style={{
      backgroundColor: '#121212',
      position: 'absolute',
      width: '100%',
      height: '100%',
      padding: '20px',
      overflow: 'hidden'
    }}>
      <Navbar/>
      <div id="content">
        <div style={{position:'relative'}}>
          <div className='page__title'>
            Song Manager
          </div>
          <ModalAddSong id="add__song"/>
        </div>
        <SongList/>
      </div>
    </div>
  )
}

export default ManageSong;