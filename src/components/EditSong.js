import React, { useEffect } from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from './Navbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { BiPlay} from "react-icons/bi";
import '../styles/songList.css';

//import props


// helper n libs
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditSong = () => {

    const song_id = useParams().id;
    const navigate = useNavigate();
    const [songDetails, setDetails] = React.useState([]);

    // get document cookie
    const cookieList = document.cookie.replace(/\s/g, "").split(";");
    const cookieMap = new Map();
    cookieList.forEach(cookie => { const [key, value] = cookie.split("="); cookieMap.set(key, value);});
    const token = cookieMap.get("accessToken");

    if (!cookieMap.get("isAdmin")) {
        window.location = "/";
    }

    if (cookieMap.get("isAdmin") === "true") {
        window.location = "/subscription";
    }
    
    const editSongHandler = (e) => {
        e.preventDefault();
        const songData = new FormData(e.target);

        for (var pair of songData.entries()) {
          console.log(pair[0]+ ', ' + pair[1]); 
        }
    
        const cookieList = document.cookie.replace(/\s/g, "").split(";");
        const cookieMap = new Map();
        cookieList.forEach(cookie => {
          const [key, value] = cookie.split("=");
          cookieMap.set(key, value);
        });

        const token = cookieMap.get("accessToken");

        // if filename empty
        var fileName;
        var file = document.getElementById("file-edit-song").files[0];
        if (file) {
            fileName = file.name;
        } else{
            fileName = "";
        }

        console.log(document.getElementById("file-edit-song").files[0])

        console.log(fileName)

        const musicData = new FormData();
        musicData.append('music', file);

        axios({
          method: 'put',
          url: 'http://localhost:8083/api/premiumSong/updatePremiumSong',
          data: { 
            judul: songData.get("title"), 
            song_id : song_id , 
            audio_path : fileName },
          headers: {
            'Content-Type': 'application/json', 
            authorization : `Bearer ${token}` }
        })
        .then(function (response) {
            // set cookie from response
            fetch("http://localhost:8083/upload", {
                method: "POST",
                body: musicData,
              })
            .then((result) => {
                console.log("File Updated Successful");
            })
            .catch((err) => {
                console.log(err.message);
            });
            
            console.log(response.data);
            navigate("/manageSong")
        })
        .catch(function (e) {
            //handle error
            console.log(e)
            if (e.code){
                if (e.code === "ECONNREFUSED"){
                    console.log("Connection refused");
                }
                else if(e.code === "ERR_BAD_REQUEST"){
                    console.log("Bad request");
                }
            }
            window.location.reload();
        }); 
    }

    // get List Of Song once on page load
    useEffect(() => {
        axios({
        method: 'get',
        url: `http://localhost:8083/api/premiumSong/getPremiumSongDetailById?song_id=${song_id}`,
        headers: {'Content-Type': 'application/json', authorization : `Bearer ${token}` }
        })
        .then(function (response) {
            // set cookie from response
            setDetails(response.data.content)
        })
        .catch(function (e) {
            //handle error
            console.log(e)
            navigate("/manageSong")
        });
    }, [])    

    console.log(songDetails)

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
                <div className='page__title'>Edit Song</div>
                <div class='song__now' style={{
                    backgroundColor: '#1E1E1E',
                    borderRadius: '10px',
                    padding: '20px',
                    marginTop: '20px'
                }}>
                    <Row>   
                        <Col sm={10} style={{
                            display: 'flex',
                            alignItems: 'center',color:'white', fontWeight:'600', fontSize:'18pt'
                        }}>
                            {songDetails.judul}
                        </Col>
                    </Row>
                </div>
                <div class="song__form" style={{
                    marginTop: '20px'
                }}>
                    <Form onSubmit={editSongHandler}>
                        <Form.Group className="mb-3">
                            <Form.Label style={{color:'#B2B2B2', fontSize:'15px', letterSpacing:'2pt'}}>NEW TITLE</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                placeholder="Song Title"
                                autoFocus
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label style={{color:'#B2B2B2', fontSize:'15px', letterSpacing:'2pt'}}>NEW FILE</Form.Label>
                            <Form.Control
                                type="file"
                                id = "file-edit-song"
                                name="file"
                                placeholder="Enter file"                        
                                accept='.mp3'
                            />
                        </Form.Group>
                        
                        <Button type="submit"
                            className='def_button'
                            id="edit_song__button">
                            <span id="edit__song">
                                SAVE
                            </span>
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
  )
}

export default EditSong;