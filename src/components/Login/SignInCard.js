import React, { useState, useEffect,useContext } from "react";
import { AppContext } from "../../AppContext";
import { Link } from "react-router-dom";
import {
  fade,
  ThemeProvider,
  withStyles,
  makeStyles,
  createMuiTheme,
} from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import { Card, TextField, Button, Typography } from "@material-ui/core";
import CircularProgress from '@material-ui/core/CircularProgress';
import ForgotPassword from './ForgotPassword';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
// COMPONENTS
//import M1neralIconSvg from "../../ui_Elements/m1neralIconSvg";
// HELPERS
import { validateData } from "./loginHelpers";
import Paper from '@material-ui/core/Paper';
//import autocomplete from '@material-ui/lab/Autocomplete';

const useStyles = makeStyles(theme => ({
  root: {
  },
  select: {
    color:'white'
  },
  card: {
    width: "425px",
    height: "500px",
    backgroundColor: theme.palette.secondary.dark,
    backgroundColor: "#011133",
    fontFamily: theme.typography.fontFamily
  },

  inputs: {
    backgroundColor: theme.palette.background.paper,
    width: "80%",
    margin: "2% 10%",
  },
  cardFooter: {
    paddingBottom: "0px",
    paddingTop: "45px",
    color: "white",
    fontSize: ".75rem",
    float: 'left',
    marginLeft: '30px',

  },
  secondaryInputs: {
    paddingTop: "5px",
    fontSize: ".75rem",
    textAlign: "left",
    marginLeft: '65px',
  },
  button: {
    backgroundColor: '#e4a773',
    width: "125px",
    height: "50px",
    marginTop: "35px",
    color: "#011133",
    float: 'left',
    marginLeft: '60px',
    "&:hover" : {
      backgroundColor: '#f0cfb3',
    },
  },
  aadButton: {
    backgroundColor: '#e4a773',
    width: "125px",
    height: "50px",
    marginTop: "35px",
    color: "#011133",
    float: 'left',
    marginLeft: '60px',
    "&:hover" : {
      backgroundColor: '#f0cfb3',
    },
  },
  signupLink: {
    textDecoration: "none",
    color: theme.palette.secondary.main,
    cursor: "pointer",
    "&:hover" : {
      color: '#e4a773',
    }
  },
  passwordLink: {
    textDecoration: "none",
    color: theme.palette.secondary.main,
    cursor: "pointer",
    "&:hover" : {
      color: '#e4a773',
    }
  },
}));



const BootstrapInput = withStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ced4da',
    fontSize: 16,
    width: '275px',
    // height: 30,
    padding: '10px',
    //marginLeft: '100',
    marginTop: '10px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),

    // '&:hover': {
    //   backgroundColor: '#fff',
    // },

    // '&$focused': {
    //   backgroundColor: '#fff',
    //   boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 2px`,
    //   borderColor: theme.palette.secondary.main,
    // },
  },
}))(InputBase);





const SignInCard = props => {
  const [stateApp,setStateApp] = useContext(AppContext)
  const classes = useStyles();
  const [tenant, setTenant] = useState("M1neral");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [emailFlags, setEmailFlags] = useState({
    error: false,
    placeholder: null,
    autoFocus: false
  });
  const [passwordFlags, setPasswordFlags] = useState({
    error: false,
    placeholder: null,
    autoFocus: false
  });

  useEffect(() => {}, [userEmail, userPassword]);

  const signIn = () => {
    if (userEmail === "" || userPassword === "") {
      //set errorFlags
    } else {
      const userData = {
        userEmail,
        userPassword,
        tenant
      };
      const { handleSignIn } = props;
      handleSignIn(userData);
    }
  };

  const onEnterKey = e =>{    
    if (userEmail === "" || userPassword === "") {
      //set errorFlags
    } else {
      const userData = {
        userEmail,
        userPassword,
        tenant
      };
      const { handleSignIn } = props;
      if(e.keyCode === 13){
        e.preventDefault();
        handleSignIn(userData);
      }

    }
  }

  const signInAAD = () => {
    if (userEmail === "" || userPassword === "") {
      //set errorFlags
    } else {
      const userData = {
        userEmail,
        userPassword,
        tenant
      };
      const { handleAADSignIn } = props;
      handleAADSignIn(userData);
    }
  };

  const renderButtonAndLoader = (
    props.ready ?
      <CircularProgress color="secondary" size={28} className={classes.loader} />
      : 
        <Button
          variant="outlined"
          disableElevation
          type="submit"
          className={classes.button}
          onClick={signIn}
          onKeyDown={e => onEnterKey(e)}
            >
            Sign In
        </Button>
  )

  const renderAADButtonAndLoader = (
    props.ready ?
      <CircularProgress color="secondary" size={28} className={classes.loader} />
      : 
        <Button
        variant="outlined"
        disableElevation
        type="submit"
        className={classes.aadButton}
        onClick={signInAAD}
        onKeyDown={e => onEnterKey(e)}
          >
          Sign In with AAD
      </Button>
  )

  const handleTenantChange = (e) => {
    setTenant(e.target.value)
    console.log(tenant)
    let t = e.target.value;
    let graphQL;
    if(t === 'M1neral') {
      //graphQL = 'https://m1gql.azurewebsites.net/api/m1graph?code=u2MVayEXvQefTpUXaydX4JtA7nQG4fFJEkHGJEaFyYuZwgYaENcdqA=='
      graphQL =  'https://m1graphql.azurewebsites.net/api/m1neral?code=kNAzP9HYSsEwdWhlLa55AIGeKj2iiFFOpXaTMRh9IuTODWpNobIX3g=='
    }
    else if(t === 'c1') {
      graphQL = 'https://m1graphql.azurewebsites.net/api/tenant1?code=q7/gFC0gYxRasZrbGWxAIIQ4voHIMT/6vLv7iTESk1cQO3ChAqHCXw=='
    }
    else if(t === 'c2') {
      graphQL = 'https://m1graphql.azurewebsites.net/api/tenant2?code=XxuZEkb91cXRlu5px2VqW7O5u0XyO1kEKSAzVzBXagf01nyG7jqryg=='
    }
    // else if (t === 'm1dev') {
    //   graphQL = 'https://m1graph.azurewebsites.net/api/m1graph?code=MHYChoSzLKszMTCsH9gRhPyCWGLDaU6qNFHB2YYrXHs9YXNV0BO5zA=='
  
    // }
    // else if (t === 'm1auth') {
    // graphQL = 'https://m1graph.azurewebsites.net/api/m1graphauth'
    // }
    setStateApp(state => ({...state,apolloClientEndpoint:graphQL}))
  }


  return (
    <div>
      <Card
        square = {true}
        className = {classes.card}
          >
          <div 
            style={{ 
              marginTop: "75px", 
              fontSize: '24px',
              fontWeight: '900',
              fontFamily: "Tahoma, Geneva, sans-serif",
              textAlign: 'left',
              paddingLeft: '65px',
              color: 'white' 
            }}
            >
              Sign in
            </div>


        <div 
            style={{ 
              marginTop: "25px", 
              fontSize: '14px',
              fontWeight: '900',
              fontFamily: "Tahoma, Geneva, sans-serif",
              color: 'white',
              textAlign: 'left',
              marginLeft: '65px' }}
            >
            EMAIL
        </div>

            <BootstrapInput 
                error={emailFlags.error}
                placeholder={emailFlags.placeholder}
                autoFocus={emailFlags.autoFocus}
                autoComplete= "true"
                onKeyDown={e => onEnterKey(e)}
                onChange={e => setUserEmail(e.target.value)}
                onBlur={() => validateData("email", userEmail, setEmailFlags)}
                value={userEmail}
                />


          <div 
            style={{ 
              marginTop: "30px", 
              fontSize: '14px',
              fontWeight: '900',
              fontFamily: "Tahoma, Geneva, sans-serif",
              color: 'white',
              textAlign: 'left',
              marginLeft: '65px' }}            
            >
            PASSWORD
          </div>

            <BootstrapInput 
                defaultValue="" 
                error={passwordFlags.error}
                placeholder={passwordFlags.placeholder}
                autoFocus={passwordFlags.autoFocus}
                onChange={e => setUserPassword(e.target.value)}
                onKeyDown={e => onEnterKey(e)}
                onBlur={() =>
                  validateData("password", userPassword, setPasswordFlags)
                }
                value={userPassword}
                autoComplete= "true"
                type="password"
                />

          <div className={classes.secondaryInputs}>
            <Link to="/forgotpassword" className={classes.passwordLink}>Forgot Password?</Link>
          </div>

        {renderButtonAndLoader}

        {renderAADButtonAndLoader}

        <div className={classes.cardFooter}>
          Don't have an account?
          <div>
            <Link 
              className={classes.signupLink}>
              Sign Up Here
            </Link>
          </div>
        </div>

        </Card>
    </div>

  );
};
export default SignInCard;
