import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { Card, TextField, Button} from "@material-ui/core";
import { validateData } from "./loginHelpers";

const useStyles = makeStyles(theme => ({

  cardTitle: {
    maxWidth: "400px",
    color: theme.palette.secondary.contrastText,
    display: "flex",
    justifyContent: "center",
    marginTop:" 80px",
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
    padding: "2%",
    paddingTop: "10%",
    paddingBottom: "20%",
    color: "white",
    justifyItems: "center"

  },
  cardInputs2: {
    paddingLeft: "2%",
    paddingRight: "2%",
    paddingTop: "20%",
    paddingBottom: "20%",
    color: "white",
    textAlign: "center",
    fontSize: "1.2em"
  },
  inputs: {
    backgroundColor: theme.palette.background.paper,
    width: "80%",
    margin: "10% 10%",
    justifyItems: "center"
  },

  secondaryInputs: {
    paddingTop: "1.5rem",
    fontSize: ".75rem",
    textAlign: "center"
  },
  button: {
    backgroundColor: theme.palette.secondary.main,
    width: "60%",
    marginLeft: "20%",
    marginTop: "5%",
    marginBottom: "10%",
    color: theme.palette.secondary.contrastText,
    alignItems: "center",
    justifyItems: "center"
  },
  button2: {
    backgroundColor: theme.palette.secondary.main,
    width: "60%",
    // marginLeft: "20%",
    marginTop: "10%",
    marginBottom: "10%",
    color: theme.palette.secondary.contrastText,
    alignItems: "center",
    justifyItems: "center"
  },
  close: {
    color: "#FFFF"
  },
  myRoot : {
    width: "100vw",
    height: "100%",
    display: "flex!important",
    backgroundSize: "cover",
    justifyContent: "center",
    '&::-webkit-scrollbar': {
      width: '0 !important'
     },
  }
 
}));

const BackgroundURI =
  "img/WellsBackgroundlogin.jpg";

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


const ForgotPassword = props => {
  const classes = useStyles();
  const [userEmail, setUserEmail] = useState("");
  const [resetPasswordBool, setResetPasswordBool] = useState(false);
  const [emailFlags, setEmailFlags] = useState({
    error: false,
    placeholder: null,
    autoFocus: false
  });

  useEffect(() => {}, [userEmail]);

  const resetPassword = () => {
    if (userEmail === "") {
      //set errorFlags
    } else {
        setResetPasswordBool(true)
    }
  };

  const onEnterKey = e =>{    
    if (userEmail === "") {
      //set errorFlags
    } else {
      if(e.keyCode === 13){
        e.preventDefault();
        setResetPasswordBool(true)
      }

    }
  }

  const renderScreens = (
      !resetPasswordBool ?
      <Card color="secondary" style={{backgroundColor: "rgba(38, 52, 81, 1)"}}
      className={classes.card}>
        
       <div className={classes.cardHeader}>
         <M1neralIconSvg style={{ marginTop: "10px" }} /> 

         <div style={{ marginTop: "20px", fontSize: "1.7rem" }}>Reset Password</div>
       </div>
       <div className={classes.cardInputs}>
        <div style={{ paddingLeft: "3vw"}}>Your Email</div>
         <TextField
           type="email"
          //  label="email"
           variant="filled"
           error={emailFlags.error}
           placeholder="example@mail.com"
           autoFocus={emailFlags.autoFocus}
           autoComplete= "true"
           className={classes.inputs}
           onChange={e => setUserEmail(e.target.value)}
           onBlur={() => validateData("email", userEmail, setEmailFlags)}
           value={userEmail}
           onKeyDown={e => onEnterKey(e)}
         />
         <Button
         variant="outlined"
         disableElevation
         className={classes.button}
         onClick={resetPassword}
           >
           SUBMIT
         </Button>
       </div>
     </Card> : 
     <Card color="secondary" style={{backgroundColor: "rgba(38, 52, 81, 1)"}}
     className={classes.card}>
      <div className={classes.cardHeader}>
        <M1neralIconSvg /> 
        <div style={{ marginTop: "5px", fontSize: "1.7rem" }}>Reset Password</div>
      </div>
      <div className={classes.cardInputs2}>
       Success! Directions to reset your password will be sent to {userEmail}
        <Button
        variant="outlined"
        disableElevation
        className={classes.button2}
        // onClick={goHome}
          >
        <Link className={classes.close} to="/">Done</Link>      
        </Button>
      </div>
    </Card>
  )

  return (
    <div className={classes.myRoot}>
      {renderScreens}
    </div>
  );
};
export default ForgotPassword;
