import React from 'react'
import SubsList from './SubsList' 
import Navbar from './Navbar'

const Subscription = () => {

  const cookieList = document.cookie.replace(/\s/g, "").split(";");
  const cookieMap = new Map();
  cookieList.forEach(cookie => { const [key, value] = cookie.split("="); cookieMap.set(key, value);});
  console.log(cookieMap.get("isAdmin"));

  if (!cookieMap.get("isAdmin")) {
    window.location = "/";
}

if (cookieMap.get("isAdmin") === "false") {
    window.location = "/manageSong";
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
        <div className='page__title'>
          Subscription List
        </div>
        <SubsList/>
      </div>
    </div>
  )
}

export default Subscription