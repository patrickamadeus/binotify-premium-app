// base
import { useState } from 'react'
import axios from 'axios'

// Components
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import logo from '../static/logo.png';
import { useNavigate } from 'react-router-dom';

// helper
import jwtDecode from '../jwt/jwt-decoder';

const Login = () => {
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
    const loginHandler = (e) => {
        e.preventDefault();
        const loginData = new FormData(e.target);

        axios({
            method: 'post',
            url: 'http://localhost:8083/api/auth/login',
            data: { email: loginData.get("email"), password: loginData.get("password") },
            config: { headers: {'Content-Type': 'multipart/form-data' }}
        })
        .then(function (response) {
            // set cookie from response
            document.cookie = `accessToken=${response.data.token.accessToken}`;
            document.cookie = `isAdmin=${jwtDecode(response.data.token.accessToken).isAdmin}`;
            const page = jwtDecode(response.data.token.accessToken).isAdmin ? "/subscription" : "/manageSong";
            navigate(page);
        })
        .catch(function (r) {
            //handle error
            warningHandler(r.response.data.message);
            console.log(r.response.data);
        }); 

    }

    const warningHandler = (status) => {
        // implement axios post checking
        if (status === "INVALID_EMAIL") {
            setWarning("Email is not registered");
        } else if (status === "INVALID_PASSWORD") {
            setWarning("Password is incorrect");
        } else {
            setWarning("Internal Server Error");
        }
    }  

    return (
        <Form className = "auth-form" onSubmit={loginHandler}>
            
            <img src={logo} alt="logo" class="logo" width={"80%"} height={"30%"}/>

            <Form.Group className="mb-3" controlId="formBasicEmail" >
                <Form.Control id="email" type="email" placeholder="Enter email" name = "email" required/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Control id="password" type="password" placeholder="Password" name = "password" required/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicWarning">
                <Form.Text className="text-muted">
                    {warning}
                </Form.Text>
            </Form.Group>

            <Button id="sign_in__btn" variant="primary" type = "submit">
                SIGN IN
            </Button>

            <p style={{
                color:'white', 
                textAlign:'center',
                fontSize:'10pt',
                marginTop:'4pt'
            }}>
                Don't have an account? 
                <a href={"/register"}
                class="linkOther">
                    Sign Up
                </a>
            </p>
            
        </Form>
    )
}

export default Login