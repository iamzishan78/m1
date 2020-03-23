import React, { useState, useEffect,useContext } from "react";
import { AppContext } from "../../AppContext";
import { Link } from "react-router-dom";
import { makeStyles, useTheme } from "@material-ui/core/styles";
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
// import Autocomplete from '@material-ui/lab/Autocomplete';

const useStyles = makeStyles(theme => ({
  root: {
    padding: "0",
    width: "100%",
    height: "100%",
  },
  select: {
    color:'white'
  },
  form: {
    display:'flex',
    flexDirection:'column',
    justifyContent:'center'
  },
  formControl: {
    display:'flex',
    justifyContent:'center',
    paddingLeft:'25px',
    paddingRight:'25px'
    
  },
  notchedOutline: {
    color: "green"
  },
  appBar: {
    height: "64px",
    background: theme.palette.primary.main,
    display: "flex",
    alignItems: "center"
  },
  content: {
    height: "100vh",
    width: "100vw"
  },
  cardTitle: {
    maxWidth: "400px",
    color: theme.palette.secondary.contrastText,
    display: "flex",
    justifyContent: "center",
    marginTop:"20px",
  },
  card: {
    width: "35vw",
    maxWidth: "400px",
    position: "absolute",
    top: "calc(50vh - 50vh / 2)",
    backgroundColor: theme.palette.secondary.dark,
    border: `1px solid ${theme.palette.secondary.main}`,
    display: "flex",
    flexDirection: "column",
    fontFamily: theme.typography.fontFamily
  },
  cardHeader: {
    color: "white",
    paddingTop: "4%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  cardInputs: {
    // height: "60%",
    padding: "2%",
    paddingTop: "4%",
    color: "white",
    justifyItems: "center"

  },
  inputs: {
    backgroundColor: theme.palette.background.paper,
    width: "80%",
    margin: "2% 10%",
    justifyItems: "center"
  

  },
  cardFooter: {
    paddingBottom: "4%",
    paddingTop: "4%",
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontSize: ".75rem"
  },
  secondaryInputs: {
    paddingTop: "1.5rem",
    fontSize: ".75rem",
    textAlign: "center"
  },
  button: {
    backgroundColor: theme.palette.secondary.main,
    width: "40%",
    marginLeft: "30%",
    marginTop: "1.5%",
    color: theme.palette.secondary.contrastText,
    alignItems: "center",
    justifyItems: "center"
  },
  signupLink: {
    textDecoration: "none",
    color: theme.palette.secondary.main,
    cursor: "pointer"
  },
  passwordLink: {
    textDecoration: "none",
    color: "#FFFF",
    cursor: "pointer",
    "&:hover" : {
      color: theme.palette.secondary.main,
    }
  },
  loader: {
    marginLeft: "45%",
  }
 
}));


const M1neralIconSvg = props => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="50"
      height="50"
      // viewBox="0 0 11320 2490"
      viewBox="0 0 2100 2500"
      
    >
      <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <path
          fill="#12ABE0"
          d="M1396 1823c-201 202-528 202-729 0-15-15-30-31-43-48l-366 366c14 16 29 31 44 47 403 402 1056 402 1459 0 356-356 397-908 124-1309l-379 378c80 188 43 413-110 566zm-839-163c-80-188-43-413 110-566 201-201 528-201 729 0 16 15 30 32 43 48l366-366c-14-16-29-31-44-47L1032 0 302 729c-356 356-397 908-124 1309l379-378zm292-384c101-100 264-100 365 0 101 101 101 264 0 365s-264 101-365 0c-100-101-100-264 0-365z"
        ></path>
      </g>
    </svg>
  );
};


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
    <React.Fragment>
      <Typography variant="h4" className={classes.cardTitle}>
        Welcome Back!
      </Typography>
      <Card color="secondary" style={{backgroundColor: "rgba(38, 52, 81, 1)"}}
       className={classes.card}>
        <div className={classes.cardHeader}>
          <M1neralIconSvg /> 
          <div style={{ marginTop: "5px", fontSize: "1.7rem" }}>Sign In</div>
        </div>
        <div className={classes.cardInputs}>
        <form className={classes.form} onSubmit={signIn} onKeyDown={e => onEnterKey(e)}>


        <FormControl className={classes.formControl}>
        <Select className={classes.select}  
          labelId="tenant-label"
          id="tenant" variant="outlined"
          value={tenant}
          onChange={handleTenantChange}
        >
          <MenuItem value="c1">Tenant 1</MenuItem>
          <MenuItem value="c2">Tenant 2</MenuItem>
          <MenuItem value="M1neral">M1neral</MenuItem>
          {/* <MenuItem value="m1dev">M1neral Dev</MenuItem>
          <MenuItem value="m1auth">M1neral Auth</MenuItem> */}
        </Select>
      </FormControl>


          <TextField
            type="email"
            label="Email"
            variant="filled"
            error={emailFlags.error}
            placeholder={emailFlags.placeholder}
            autoFocus={emailFlags.autoFocus}
            autoComplete= "true"
            
            onKeyDown={e => onEnterKey(e)}
            className={classes.inputs}
            onChange={e => setUserEmail(e.target.value)}
            onBlur={() => validateData("email", userEmail, setEmailFlags)}
            value={userEmail}
        
          
          
          />

          <TextField
            type="password"
            label="Password"
            variant="filled"
            error={passwordFlags.error}
            placeholder={passwordFlags.placeholder}
            autoFocus={passwordFlags.autoFocus}
            className={classes.inputs}
            onChange={e => setUserPassword(e.target.value)}
            onKeyDown={e => onEnterKey(e)}
            onBlur={() =>
              validateData("password", userPassword, setPasswordFlags)
            }
            //autoComplete="current-password"
            value={userPassword}
            autoComplete= "true"
             
            
          />
          {renderButtonAndLoader}
          </form>
          <div className={classes.secondaryInputs}>
            {/* <div>Remember Me</div> */}
            <Link to="/forgotpassword" className={classes.passwordLink}>Forgot Password?</Link>
          </div>
        </div>
        <div className={classes.cardFooter}>
          <div>Don't have an account?</div>
          <div>
            <Link to="/signup" className={classes.signupLink}>
              Sign Up Here
            </Link>
          </div>
        </div>
      </Card>
    </React.Fragment>
  );
};
export default SignInCard;
