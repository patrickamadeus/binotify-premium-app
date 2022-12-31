import './App.css';

//libs
import { BrowserRouter, Route , Routes, Navigate} from "react-router-dom";
import jwtDecode from './jwt/jwt-decoder';

//components
import Login from "./components/Login";
import Register from "./components/Register";
import ManageSong from "./components/ManageSong";
import Subscription from "./components/Subscription";
import EditSong from "./components/EditSong";

function App() {

  // get document cookie
  const cookieList = document.cookie.replace(/\s/g, "").split(";");
  const cookieMap = new Map();
  cookieList.forEach(cookie => {
    const [key, value] = cookie.split("=");
    cookieMap.set(key, value);
  });

  const isLoggedIn = cookieMap.has("accessToken");
  const isAdmin =  cookieMap.get("isAdmin") === "true";

  console.log(jwtDecode(cookieMap.get("accessToken")));

  return (
    <div className = "app">
      <BrowserRouter>
        <Routes>
          <Route path = "/" element = { <Login/> } />
          <Route path = "/register" element = {<Register />} />
          <Route path = "/manageSong" element = {<ManageSong/>} />
          <Route path = "/subscription" element = { <Subscription/>} />
          <Route path = "/editSong/:id" element = { <EditSong/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
