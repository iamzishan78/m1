import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// STYLES
import { useStyles } from "./styles";
import { makeStyles } from "@material-ui/core";
import { Card, TextField, Button, Typography } from "@material-ui/core";
// COMPONENTS
const localStyles = makeStyles(theme => ({
  card: {
    width: "40vw",
    maxWidth: "400px",
    height: "70vh",
    position: "fixed",
    left: "calc(50vw - 25vw / 2)",
    top: "calc(50vh - 70vh / 2)",
    backgroundColor: theme.palette.secondary.dark,
    border: `1px solid ${theme.palette.secondary.main}`,
    display: "flex",
    flexDirection: "column",
    fontFamily: theme.typography.fontFamily
  },
  cardHeader: {
    height: "10%",
    color: "white",
    padding: "20px 40px",
    textAlign: "center"
  },
  cardInputs: {
    height: "80%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center"
  },
  cardFooter: {
    height: "15%",
   // padding: "10px 10px",
    color: "white",
    fontSize: ".75rem",
    textAlign: "center"
  },
  inputs: {
    backgroundColor: theme.palette.background.paper,
    width: "80%"
  }
}));

const NewUserCard = props => {
  const classes = useStyles();
  const localClass = localStyles();
  const [userName, setUserName] = useState("");
  const [userCompany, setUserCompany] = useState("");
  const [userTitle, setUserTitle] = useState("");
  const [userPhoneNum, setUserPhoneNum] = useState("");
  const [userEmail, setUserEmail] = useState("");
  //const [userPassword, setUserPassword] = useState("");

  useEffect(() => {}, [userEmail]);

  const signUp = () => {
    const userData = {
      userName,
      userCompany,
      userTitle,
      userPhoneNum,
      userEmail
    //  userPassword
    };
    props.handleNewUserSignUp(userData);
  };

  return (
    <React.Fragment>
     
      <Typography variant="h5" className={classes.cardTitle}
        style={{ fontSize: "2rem", top: "5%", justifyContent: "center" }}>
      
      </Typography> 

      <Card color="secondary" className={localClass.card}>
        <div className={localClass.cardHeader}>
          <div style={{ marginTop: "5px", fontSize: "1rem" }}>
            Sign up as a buyer, financial institution or energy company.
          </div>
        </div>
        <div className={localClass.cardInputs}>
          <TextField
            className={localClass.inputs}
            type="text"
            label="Full Name"
            variant="filled"
            onChange={e => setUserName(e.target.value)}
            value={userName}
          />
          <TextField
            className={localClass.inputs}
            type="text"
            label="Company"
            variant="filled"
            onChange={e => setUserCompany(e.target.value)}
            value={userCompany}
          />
          <TextField
            className={localClass.inputs}
            type="text"
            label="Title"
            variant="filled"
            onChange={e => setUserTitle(e.target.value)}
            value={userTitle}
          />
          <TextField
            className={localClass.inputs}
            type="email"
            label="Email"
            variant="filled"
            onChange={e => setUserEmail(e.target.value)}
            value={userEmail}
          />
          <TextField
            className={localClass.inputs}
            type="text"
            label="Phone Number"
            variant="filled"
            onChange={e => setUserPhoneNum(e.target.value)}
            value={userPhoneNum}
          />

         {/* <TextField
            className={localClass.inputs}
            type="password"
            label="Password"
            variant="filled"
            onChange={e => setUserPassword(e.target.value)}
            value={userPassword}
          />
          <TextField
            className={localClass.inputs}
            type="password"
            label="Confirm Password"
            variant="filled"
            // onChange={e => setUserPassword(e.target.value)}
            value={userPassword} 
          /> */}

          <Button
            variant="contained"
            disableElevation
            className={classes.button}
            onClick={signUp}
            style={{ marginLeft: "0" }}
          >
            Submit
          </Button>
          <div className={classes.secondaryInputs}></div>
        </div>
        <div className={localClass.cardFooter}>
          <div>By signing up, you agree to the  <a href="https://www.m1neral.com" target="_blank" className={classes.signupLink} >Terms and Conditions
            </a></div>
          <div>
            Already have an account?  <Link to="/" className={classes.signupLink}> Sign In
            </Link>
            
            </div>
        </div>
      </Card>
    </React.Fragment>
  );
};
export default NewUserCard;
