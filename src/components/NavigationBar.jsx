import { AppBar, Button, Dialog, DialogActions, DialogContent, DialogTitle, InputLabel, MenuItem, Select, TextField, Toolbar, Typography, } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import './Components.css'

const NavigationBar = () => {

  //use state hooks to store relevant values
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [occupation, setOccupation] = useState("");
  const [isUsernameError, setIsUsernameError] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [isOccupationError, setIsOccupationError] = useState(false);
  const [isOpenLogin, setIsOpenLogin] = useState(false);
  const [isOpenRegister, setIsOpenRegister] = useState(false);
  const [userId, setUserId] = useState('')
  const navigate = useNavigate();

  useEffect(() => {
    setUserId(sessionStorage.getItem("UserId"))
  }, [])

  //handles user login and registration
  //action stores "login" or "register"
  const onSubmit = (action) => {

    //checks for missing data
    setIsUsernameError(false);
    setIsPasswordError(false);
    setIsOccupationError(false);

    let flag = false;
    if (username === "") {
      setIsUsernameError(true);
      flag = true;
    }

    if (password === "") {
      setIsPasswordError(true);
      flag = true;
    }

    if (occupation === "") {
      setIsOccupationError(true);
      flag = true;
    }

    if (flag) {
      return;
    }

    const data = {
      username: username,
      password: password,
      occupation: occupation,
    };

    //sends a post request with user details to login or register the user
    axios.post(`https://sp-nus-module-digitisation-74b6b485ab94.herokuapp.com/userauth/${action}`, data)
      .then((response) => {
        //unsuccessful 
        if (response.data.error) {
          alert(response.data.error);
          return;
        }
        //success and stores details in session storage
        sessionStorage.setItem("UserId", response.data);
        sessionStorage.setItem("Username", username);
        sessionStorage.setItem("Occupation", occupation);

        //closes the dialog
        setIsOpenRegister(false);
        navigate("home");

        //reloads the page
        window.location.reload();
      });
  }

  //content displayed within the dialog
  const dialogContent = () => {
    return (
      <>
        {/*username*/}
        <TextField
          variant="standard"
          required
          margin="normal"
          label="Username"
          error={isUsernameError}
          fullWidth
          onChange={(e) => setUsername(e.target.value)}
          className="username-input"
        ></TextField>

        {/*password*/}
        <TextField
          className="password-input"
          type="password"
          variant="standard"
          required
          margin="normal"
          label="Password"
          fullWidth
          error={isPasswordError}
          onChange={(e) => setPassword(e.target.value)}
        ></TextField>

        {/*occupation*/}
        <InputLabel required className="occupation-input" >
          Occupation
        </InputLabel>
        <Select
          fullWidth
          error={isOccupationError}
          onChange={(e) => setOccupation(e.target.value)}
        >
          <MenuItem value="Student">Student</MenuItem>
          <MenuItem value="Instructor">Instructor</MenuItem>
        </Select>

      </>
    )
  }

  return (

    <AppBar position="static">
      {/*dialog for user login*/}
      <Dialog open={isOpenLogin} onClose={() => setIsOpenLogin(false)}>
        <DialogTitle className="login-header">
          <Typography className="login-title"><strong>Welcome back!</strong></Typography>
        </DialogTitle>
        <DialogContent>
          {dialogContent()}
        </DialogContent>
        <DialogActions className="login-action">
          <Button fullWidth onClick={() => { setIsOpenLogin(false); }} className="login-button">
            Cancel
          </Button>
          <Button fullWidth type="submit" onClick={() => onSubmit("login")} className="login-button">
            Log In
          </Button>
        </DialogActions>
      </Dialog>

      {/*dialog for user registration*/}
      <Dialog open={isOpenRegister} onClose={() => setIsOpenRegister(false)}>
        <DialogTitle className="register-header">
          <Typography className="register-title"><strong>Hello there!</strong></Typography>
        </DialogTitle>
        <DialogContent>
          {dialogContent()}
        </DialogContent>
        <DialogActions className="register-action">
          <Button fullWidth onClick={() => { setIsOpenRegister(false) }} className="register-button">
            Cancel
          </Button>
          <Button fullWidth type="submit" onClick={() => onSubmit("register")} className="register-button">
            Register
          </Button>
        </DialogActions>
      </Dialog>

      {/*contents of navigation bar*/}
      <Toolbar className="toolbar-container">
        <Typography
          onClick={() => { navigate("/home"); }}
          variant="h6"
          className="toolbar-title"
        >
          Singapore Polytechnic
        </Typography>

        {/*displays username and logout button if the user is logged in*/}
        {userId && (
          <>
            <Typography className="toolbar-username">
              {sessionStorage.getItem('Username')}
            </Typography>
            <Button disableRipple
              onClick={() => { sessionStorage.clear(); localStorage.clear(); navigate("/"); }}
              color="inherit" className="toolbar-logout"
            >
              Logout
            </Button>
          </>
        )}

        {/*displays login and register button if the user is not logged in*/}
        {!userId && (
          <>
            <Button disableRipple onClick={() => setIsOpenLogin(true)} color="inherit" className="toolbar-login">
              Login
            </Button>
            <Button disableRipple onClick={() => setIsOpenRegister(true)} color="inherit" className="toolbar-register">
              Register
            </Button>
          </>
        )}

      </Toolbar>
    </AppBar>
  );
}

export default NavigationBar;
