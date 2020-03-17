import React, { useState, useContext, useEffect } from "react";
import { useLazyQuery,useApolloClient } from '@apollo/react-hooks';
import { AppContext } from "../../AppContext";
import { makeStyles } from '@material-ui/core/styles';

import gql from "graphql-tag";
// STYLES
// import { useStyles } from "./styles";
import {
  CardMedia,
} from "@material-ui/core";

// COMPONENTS
// import M1neralLogoSvg from "../Shared/m1neralLogoSvg";
import SignInCard from "./SignInCard";
// import SignUpCard from "./SignUpCard";
//import { LOGINQUERY } from "../../graphQL/useQueryLogin";

const useStyles = makeStyles(theme => ({
  myRoot : {
    width: "100vw",
    height: "100%",
    display: "flex!important",
    backgroundSize: "cover",
    justifyContent: "center",
    backgroundImage: `url(${BackgroundURI})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",

    '&::-webkit-scrollbar': {
      width: '0 !important'
     },

  }
}));

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
  const [tenant,setTenant] = useState(null)
  const classes = useStyles();
  const LOGINQUERY = gql`query {
    login(userName:"${userName}",password:"${password}",tenant:"${tenant}") {
      success
      message
      user {
        id
        email
        name
        authToken
        authTokenExpires
        tenant {
          id
          tenant
          graphQL
        }
        
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
    setTenant(userData.tenant)
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
       <SignInCard handleSignIn={handledSignIn} ready={loading} />
    </div>
  );
};

export default Login;
