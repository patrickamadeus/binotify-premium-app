// base
import { useState } from 'react'
import axios from 'axios'

// Components
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import logo from '../static/logo.png';
import { useNavigate } from 'react-router-dom';


const Register = () => {
    const cookieList = document.cookie.replace(/\s/g, "").split(";");
    const cookieMap = new Map();
    cookieList.forEach(cookie => { const [key, value] = cookie.split("="); cookieMap.set(key, value);});

    if (cookieMap.get("isAdmin") === "true") {
        window.location = "/subscription";
    }

    if (cookieMap.get("isAdmin") === "false") {
        window.location = "/manageSong";
    }

    const [warning, setWarning] = useState(" ");
    const navigate = useNavigate();

  const registerHandler = (e) => {
      e.preventDefault();
      const registerData = new FormData(e.target);

      // if password does not match
      if (registerData.get("password") !== registerData.get("confirmPassword")) {
        setWarning("Password does not match");
      } else{
        axios({
            method: 'post',
            url: 'http://localhost:8083/api/auth/register',
            data: 
            { 
              name: registerData.get("name"),
              username: registerData.get("username"),
              email: registerData.get("email"), 
              password: registerData.get("password"),
           },
           config: { headers: {'Content-Type': 'multipart/form-data' }}
        })
        .then(function (response) {
            console.log(response.data.message)
            warningHandler(response.data.message);
            navigate("/")
        })
        .catch(function (r) {
            //handle error
            warningHandler(r.response.data.message);
            console.log(r.response.data);
        }); 
      }


  }

  const warningHandler = (status) => {
      // implement axios post checking
      if (status === "USERNAME_EXIST") {
          setWarning("Username is already taken!");
      } else if (status === "EMAIL_EXIST") {
          setWarning("Email is already taken!");
      } else {
          setWarning("Internal Server Error");
      }
  } 

  return (
    <Form className = "auth-form" onSubmit={registerHandler}>
                
        <img src={logo} alt="logo" class="logo" width={"80%"} height={"30%"}/>

        <Form.Group className="mb-3" controlId="formBasicName" >
            <Form.Control id="name" type="text" placeholder="Enter name" name = "name" required/>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicUsername" >
            <Form.Control id="username" type="text" placeholder="Enter username" name = "username" required/>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail" >
            <Form.Control id="email" type="email" placeholder="Enter email" name = "email" required/>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control id="password" type="password" placeholder="Password" name = "password" required/>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
            <Form.Control id="confirmPassword" type="password" placeholder="Confirm Password" name = "confirmPassword" required/>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicWarning">
            <Form.Text className="text-muted">
                {warning}
            </Form.Text>
        </Form.Group>

        <Button id="sign_in__btn" variant="primary" type = "submit">
            Register
        </Button>

        <p style={{
            color:'white', 
            textAlign:'center',
            fontSize:'10pt',
            marginTop:'4pt'
        }}>
            Have an account? 
            <a href={"/"}
            class="linkOther">
                Login
            </a>
        </p>
        
    </Form>
  )
}

export default Register