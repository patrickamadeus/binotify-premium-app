import React from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import warning from 'warning';
import axios from 'axios';
import jwtDecode from '../jwt/jwt-decoder';
import '../styles/subsList.css'
import '../styles/songList.css'
import { BiPlus } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';

function ModalAddSong(props) {
  const [show, setShow] = React.useState(false);
  const [warning, setWarning] = React.useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const navigate = useNavigate();

  const addSongHandler = (e) => {
    e.preventDefault();
    const songData = new FormData(e.target);

    const cookieList = document.cookie.replace(/\s/g, "").split(";");
    const cookieMap = new Map();
    cookieList.forEach(cookie => {
      const [key, value] = cookie.split("=");
      cookieMap.set(key, value);
    });
    const file = document.getElementById("file-add-song").files[0]
    console.log(file)
    const fileName = file.name;
    const token = cookieMap.get("accessToken");
    const userId = jwtDecode(token).user_id;

    const musicData = new FormData();
    musicData.append('music', file);
    
    // send to database
    axios({
      method: 'post',
      url: 'http://localhost:8083/api/premiumSong/createPremiumSong',
      data: { judul: songData.get("title"), penyanyi_id : userId , audio_path : fileName },
      headers: {'Content-Type': 'application/json', authorization : `Bearer ${token}` }
    })
    .then(function (response) {
        fetch("http://localhost:8083/upload", {
          method: "POST",
          body: musicData,
        })
          .then((result) => {
            console.log("File Sent Successful");
          })
          .catch((err) => {
            console.log(err.message);
          });

        console.log(response.data);
        window.location.reload()
    })
    .catch(function (e) {
        //handle error
        console.log(e)
        const error = e.response.data;
        if(error.error === "Null token") {
          navigate("/");
        } else{
          setWarning(error);
        }
    }); 
  }

  return (
    <div>
      <Button 
        type="button" 
        className="def_button" id="add_song__button"
        onClick={handleShow}>
        <BiPlus style={{fontSize:"20px", color:"black", paddingRight:'3px'}}/>
        <span id="add__song">
            ADD SONG
        </span>
      </Button>

      <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      id="add_song__modal"
      centered
      >
        <Modal.Header closeButton
        style={{
          background:'radial-gradient(89.52% 9170.43% at 10.48% 51.52%, #946D21 0%, #BE9440 70.46%, #D0A44D 100%)',


          }}>
          <Modal.Title id="contained-modal-title-vcenter"
          style={{
            fontWeight:"700",

          }}>
              Add Song
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{
          background:'#5C5C5C'
        }}>
          <Form onSubmit={addSongHandler}>
              <Form.Group className="mb-3" controlId="formSongTitle">
              <Form.Label style={{color:'black', fontSize:'15px', fontWeight:'600',letterSpacing:'2pt'}}>TITLE</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Song Title"
                  name = "title"
                  autoFocus
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formSongFile">
              <Form.Label style={{color:'black', fontSize:'15px', fontWeight:'600',letterSpacing:'2pt'}}>FILE</Form.Label>
                  <Form.Control
                      type="file"
                      placeholder="Enter file"
                      name = "music"
                      id = "file-add-song"
                      accept='.mp3'
                      required
                  />
              </Form.Group>
            <Modal.Footer>
              <Button type = "submit" className='def_button' id="submit_button">
                <span id="submit">
                  SUBMIT
                </span>
              </Button>
              <p>{warning}</p>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ModalAddSong;