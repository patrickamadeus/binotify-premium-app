import React from 'react'

import {Button, Container} from 'react-bootstrap'
import Dropdown from 'react-bootstrap/Dropdown';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate } from 'react-router-dom'
import logo from '../static/logo.png';
import '../styles/navbar.css'

const Navbar = () => {

  const navigate = useNavigate();

  // logout handler clear cookie
  const logoutHandler = () => {
    // clear all cookie
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    navigate("/");
  }

  return (
    <Container id="navbar">
        <Row id="row">
            <Col sm={10} style={{display:"flex", alignItems:"center", justifyContent:"flex-start"}}>
                <img id="logo" src={logo} alt="logo" ></img>
            </Col>
            <Col sm={2} style={{display:"flex", alignItems:"center", justifyContent:"flex-end", paddingRight:'0px'}}>
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        <img
                            src="https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/df/df7789f313571604c0e4fb82154f7ee93d9989c6.jpg"
                            alt="User avatar"
                        />
                        <span style={{color:'white'}}>Username</span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu id="menu" >
                        <Dropdown.Item>
                            <Button id='logout' variant="primary" type="submit" onClick={logoutHandler}>
                                Logout
                            </Button>
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Col>
        </Row>
    </Container>
    
  )
}

export default Navbar