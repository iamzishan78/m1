import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import EmailSuccess from "./EmailSuccess";
import {
  fade,
  ThemeProvider,
  withStyles,
  makeStyles,
  createMuiTheme,
} from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import { Card, Button } from "@material-ui/core";
// COMPONENTS

const useStyles = makeStyles(theme => ({
  conatiner: {
    paddingTop: 20,
    margin: "0 auto",
    height: "100%",
    // display: "flex",
    justifyContent: "center"
  },
  card: {
    //maxWidth: 450,
    //minWidth: 445,
    width: 500,
    backgroundColor: theme.palette.secondary.dark,
    border: `1px solid ${theme.palette.secondary.main}`,
    display: "flex",
    flexDirection: "column",
    fontFamily: theme.typography.fontFamily
  },
  cardHeader: {
    color: "white",
    padding: "20px 40px",
    textAlign: "center"
  },
  cardFooter: {
    height: "15%",
    color: "white",
    fontSize: ".75rem",
    textAlign: "center"
  },
  inputs: {
    backgroundColor: theme.palette.background.paper,
    width: "80%",
    position: "relative",
    borderBottom: "1px solid rgba(0, 0, 0, 0.42)",
    pointerEvents: "all",
    margin: "2% 10%"
  },
  inputsName: {
    backgroundColor: theme.palette.background.paper,
    width: "39%",
    position: "relative",
    borderBottom: "1px solid rgba(0, 0, 0, 0.42)",
    pointerEvents: "all",
    margin: "1% 1%",
    display: "inline-flex",
    // flexDirection: "row",
  },
  links: {
    marginTop: 10,
    marginBottom: 20
  },
  cardForm: {
    display: "contents",
    pointerEvents: "all"
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
    // position: 'relative',
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ced4da',
    fontSize: 16,
    width: '325px',
    padding: '10px',
    marginLeft: '75px',
    marginTop: '10px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
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

    '&:hover': {
      backgroundColor: '#fff',
    },

    '&$focused': {
      backgroundColor: '#fff',
      boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 2px`,
      borderColor: theme.palette.primary.main,
    },
  },
}))(InputBase);



export default function NewUserCard(props) {
  const classes = useStyles();
  const [userName, setUserName] = useState("");
  const [userLastName, setUserlastName] = useState("");
  const [userCompany, setUserCompany] = useState("");
  const [userTitle, setUserTitle] = useState("");
  const [userPhoneNum, setUserPhoneNum] = useState();
  const [userEmail, setUserEmail] = useState("");
  const [sent, setSent] = useState(false);
  //const [userPassword, setUserPassword] = useState("");

  useEffect(() => {}, [userEmail]);

  const handleSubmit = e => {
    e.preventDefault();
    alert(
      "Node App Not Deployed"
    );
    setSent(true);
  };

  useEffect(() => {
    ValidatorForm.addValidationRule("shortName", value => {
      if (value && userName.length < 2) {
        return false;
      } else {
        return true;
      }
    });

  }, [userName.length]);
  console.log(userName,
    userLastName,
    userCompany,
    userPhoneNum,
    userTitle,
    userEmail)
  return !sent ? (
    <div className={classes.conatiner}>
      <Card color="secondary" className={classes.card}>
        <div className={classes.cardHeader}>
          <div style={{ marginTop: "5px", fontSize: "1rem" }}>
            Sign up as a buyer, financial institution or energy company.
          </div>
        </div>
        <Card className={classes.cardForm}>


        <div 
            style={{ 
              marginTop: "15px", 
              fontSize: '14px',
              fontWeight: '900',
              fontFamily: "Tahoma, Geneva, sans-serif",
              color: 'white',
              textAlign: 'left',
              paddingLeft: '65px' }}
            >
            FIRST NAME
        </div>

        <BootstrapInput 
                type="fname"
                // label="Email"
                variant="outlined"
                // error={emailFlags.error}
                // placeholder={emailFlags.placeholder}
                // autoFocus={emailFlags.autoFocus}
                autoComplete= "true"
                // onKeyDown={e => onEnterKey(e)}
                // className={classes.inputs}
                // onChange={e => setUserEmail(e.target.value)}
                // onBlur={() => validateData("email", userEmail, setEmailFlags)}
                value={userEmail}
                />


<div 
            style={{ 
              marginTop: "15px", 
              fontSize: '14px',
              fontWeight: '900',
              fontFamily: "Tahoma, Geneva, sans-serif",
              color: 'white',
              textAlign: 'left',
              paddingLeft: '65px' }}
            >
            LAST NAME
        </div>

        <BootstrapInput 
                type="lname"
                // label="Email"
                variant="outlined"
                // error={emailFlags.error}
                // placeholder={emailFlags.placeholder}
                // autoFocus={emailFlags.autoFocus}
                autoComplete= "true"
                // onKeyDown={e => onEnterKey(e)}
                // className={classes.inputs}
                // onChange={e => setUserEmail(e.target.value)}
                // onBlur={() => validateData("email", userEmail, setEmailFlags)}
                value={userEmail}
                />                


        <div 
            style={{ 
              marginTop: "15px", 
              fontSize: '14px',
              fontWeight: '900',
              fontFamily: "Tahoma, Geneva, sans-serif",
              color: 'white',
              textAlign: 'left',
              paddingLeft: '65px' }}
            >
            EMAIL
        </div>

        <BootstrapInput 
                type="email"
                // label="Email"
                variant="outlined"
                // error={emailFlags.error}
                // placeholder={emailFlags.placeholder}
                // autoFocus={emailFlags.autoFocus}
                autoComplete= "true"
                // onKeyDown={e => onEnterKey(e)}
                // className={classes.inputs}
                onChange={e => setUserEmail(e.target.value)}
                // onBlur={() => validateData("email", userEmail, setEmailFlags)}
                value={userEmail}
                />

<div 
            style={{ 
              marginTop: "15px", 
              fontSize: '14px',
              fontWeight: '900',
              fontFamily: "Tahoma, Geneva, sans-serif",
              color: 'white',
              textAlign: 'left',
              paddingLeft: '65px' }}
            >
            COMPANY NAME
        </div>

        <BootstrapInput 
                type="company"
                // label="Email"
                variant="outlined"
                // error={emailFlags.error}
                // placeholder={emailFlags.placeholder}
                // autoFocus={emailFlags.autoFocus}
                autoComplete= "true"
                // onKeyDown={e => onEnterKey(e)}
                // className={classes.inputs}
                // onChange={e => setUserEmail(e.target.value)}
                // onBlur={() => validateData("email", userEmail, setEmailFlags)}
                value={userEmail}
                />

<div 
            style={{ 
              marginTop: "15px", 
              fontSize: '14px',
              fontWeight: '900',
              fontFamily: "Tahoma, Geneva, sans-serif",
              color: 'white',
              textAlign: 'left',
              paddingLeft: '65px' }}
            >
            MOBILE PHONE
        </div>

        <BootstrapInput 
                type="mobile"
                // label="Email"
                variant="outlined"
                // error={emailFlags.error}
                // placeholder={emailFlags.placeholder}
                // autoFocus={emailFlags.autoFocus}
                autoComplete= "true"
                // onKeyDown={e => onEnterKey(e)}
                // className={classes.inputs}
                // onChange={e => setUserEmail(e.target.value)}
                // onBlur={() => validateData("email", userEmail, setEmailFlags)}
                value={userEmail}
                />
                <div 
            style={{ 
              marginTop: "15px", 
              fontSize: '14px',
              fontWeight: '900',
              fontFamily: "Tahoma, Geneva, sans-serif",
              color: 'white',
              textAlign: 'left',
              paddingLeft: '65px' }}
            >
            OFFICE PHONE
        </div>

        <BootstrapInput 
                type="office"
                // label="Email"
                variant="outlined"
                // error={emailFlags.error}
                // placeholder={emailFlags.placeholder}
                // autoFocus={emailFlags.autoFocus}
                autoComplete= "true"
                // onKeyDown={e => onEnterKey(e)}
                // className={classes.inputs}
                // onChange={e => setUserEmail(e.target.value)}
                // onBlur={() => validateData("email", userEmail, setEmailFlags)}
                value={userEmail}
                />


          {/* <ValidatorForm
            onSubmit={handleSubmit}
            onError={errors => console.log(errors)}
            method="POST"
          >
            <TextValidator
              className={classes.inputsName}
              type="text"
              label="Fist Name"
              variant="filled"
              validators={["shortName", "required"]}
              errorMessages={["this field is required", "Name is not valid"]}
              onChange={e => setUserName(e.target.value)}
              value={userName}
            />
            <TextValidator
              className={classes.inputsName}
              type="text"
              label="Last Name"
              variant="filled"
              validators={["shortName", "required"]}
              errorMessages={["this field is required", "Last Name is not valid"]}
              onChange={e => setUserlastName(e.target.value)}
              value={userLastName}
            />
            <TextValidator
              className={classes.inputs}
              type="text"
              label="Company"
              variant="filled"
              validators={["required"]}
              errorMessages={["this field is required"]}
              onChange={e => setUserCompany(e.target.value)}
              value={userCompany}
            />
            <TextValidator
              className={classes.inputs}
              type="text"
              label="Title"
              variant="filled"
              validators={["required"]}
              errorMessages={["this field is required"]}
              onChange={e => setUserTitle(e.target.value)}
              value={userTitle}
            />
            <TextValidator
              className={classes.inputs}
              type="email"
              label="Email"
              variant="filled"
              validators={["required", "isEmail"]}
              errorMessages={["this field is required"]}
              onChange={e => setUserEmail(e.target.value)}
              value={userEmail}
            />
            <TextValidator
              className={classes.inputs}
              type="text"
              label="Phone Number"
              variant="filled"
              validators={["required"]}
              errorMessages={["this field is required"]}
              onChange={e => setUserPhoneNum(e.target.value)}
              value={userPhoneNum}
            />
            <Button
              variant="contained"
              disableElevation
              type="submit"
              style={{
                fontSize: "1.2em",
                color: "white",
                marginTop: 10,
                backgroundColor: "rgba(23, 170, 221, 1)",
                marginBottom: 5,
                width: "20vw"
              }}
            >
              Submit
            </Button>
          </ValidatorForm> */}


        </Card>
        <div className={classes.cardFooter}>
          <div>
            By signing up, you agree to the{" "}
            <a
              href="https://www.m1neral.com"
              target="_blank"
              rel="noopener noreferrer"
              className={classes.signupLink}
            >
              Terms and Conditions
            </a>
          </div>
          <div className={classes.links}>
            Already have an account?{" "}
            <Link to="/" className={classes.signupLink}>
              {" "}
              Sign In
            </Link>
          </div>
        </div>
      </Card>
    </div>
  ) : (
    <EmailSuccess />
  );
}
