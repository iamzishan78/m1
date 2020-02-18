import React, { useState, useContext, useEffect } from "react";
import { useLazyQuery } from '@apollo/react-hooks';
import { AppContext } from "../../AppContext";
import gql from "graphql-tag";
// STYLES
import { useStyles } from "./styles";
import {
  Typography,
  CardMedia,
  Card,
  TextField,
  Button
} from "@material-ui/core";

// COMPONENTS
import M1neralLogoSvg from "../Shared/m1neralLogoSvg";
import SignInCard from "./SignInCard";
import SignUpCard from "./SignUpCard";
//import { LOGINQUERY } from "../../graphQL/useQueryLogin";


const BackgroundURI =
  "img/WellsBackgroundlogin.jpg";


/*
'/' - Login
-> Sign In
-> Forgot Password?
-> Sign Up

*/

const Login = props => {

  
  const [stateApp,setStateApp] = useContext(AppContext)
  const [userName,setUserName] = useState(null)
  const [password,setPassword] = useState(null)
  
  const LOGINQUERY = gql`query {
    login(userName:"${userName}",password:"${password}") {
      success
      message
      user {
        id
        email
        name
        authToken
        authTokenExpires
        
      }
      
    }
  }`
  useEffect( () => {
    //on willmount if session is saved don't require login
  let session = sessionStorage.getItem('user');
  if(session) {
    let sessionUser = JSON.parse(session)
    setStateApp(state => ({...state,user:sessionUser}))
  }
},[])

  const [login, { loading, data }] = useLazyQuery(LOGINQUERY);
  //const { path } = props.path ? props.path : 'signin';
  const classes = useStyles();
  // const [invalidEmail, setValidEmail] = useState(true);

  useEffect( () => {

    if (data) {
      console.log('login success',data)
      if(data.login.success){
        setStateApp(state => ({...state,user:data.login.user}))
        window.sessionStorage.setItem('user', JSON.stringify(data.login.user));
      }
      else {
        console.log('login failed',data)
        setStateApp(state => ({...state,user:null}))
        window.sessionStorage.removeItem('user');
        //show login failed in the future
      }
      
    }

  },[data])

  const handledSignIn = userData => {
    console.log("[Login.js] userData", userData);

    setUserName(userData.userEmail)
    setPassword(userData.userPassword)
    login()
  };

  /* const routeUserRequest = () => {
    switch (path) {
      case "signin":
        return <SignInCard handleSignIn={handledSignIn} />;
      case "signup":
        return <SignUpCard handleSignIn={handledSignIn} />;
    }
  }; */

  return (
    <div className={classes.myRoot}>

      <CardMedia
        media="img"
        image={BackgroundURI}
       // alt="Oil Dereks"
        className={classes.content}
      >
       <SignInCard handleSignIn={handledSignIn} ready={loading} />;
      </CardMedia>
    </div>
  );
};

export default Login;
