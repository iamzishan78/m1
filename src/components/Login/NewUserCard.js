import React, { useState, useEffect, useContext, Component } from "react";
import { Link } from "react-router-dom";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import EmailSuccess from "./EmailSuccess";
import {
  fade,
  ThemeProvider,
  withStyles,
  makeStyles,
  createMuiTheme,
} from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";
import { Card, Button } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { AppContext } from "../../AppContext";
import { Frame } from "framer"


const useStyles = makeStyles((theme) => ({
  conatiner: {},
  card: {
    width: "500px",
    height: "935px",
    //backgroundColor: theme.palette.secondary.dark,
    backgroundColor: "#fafafa",
    //border: `1px solid ${theme.palette.secondary.main}`,
    display: "flex",
    flexDirection: "column",
    fontFamily: theme.typography.fontFamily,
  },
  cardHeader: {
    color: "white",
    //padding: "20px 40px",
    textAlign: "center",
  },
  cardFooter: {
    height: "15%",
    color: "white",
    fontSize: ".75rem",
    textAlign: "left",
    marginLeft: "65px",
    // float: 'left'
  },
  button: {
    backgroundColor: "#e4a773",
    width: "225px",
    height: "50px",
    marginTop: "25px",
    color: "#011133",
    float: "left",
    marginLeft: "65px",
    marginBottom: "15px",
    "&:hover": {
      backgroundColor: "#f0cfb3",
    },
  },
  link: {
    textDecoration: "none",
    color: theme.palette.secondary.main,
    cursor: "pointer",
    "&:hover": {
      color: "#e4a773",
    },
  },
  inputs: {
    backgroundColor: theme.palette.background.paper,
    width: "80%",
    position: "relative",
    borderBottom: "1px solid rgba(0, 0, 0, 0.42)",
    pointerEvents: "all",
    margin: "2% 10%",
  },
  inputsName: {
    backgroundColor: theme.palette.background.paper,
    width: "39%",
    position: "relative",
    borderBottom: "1px solid rgba(0, 0, 0, 0.42)",
    pointerEvents: "all",
    margin: "1% 1%",
    display: "inline-flex",
  },
  links: {
    marginTop: 10,
    marginBottom: 20,
    color: "#011133",
    },
  cardForm: {
    display: "contents",
    pointerEvents: "all",
  },
}));

const BootstrapInput = withStyles((theme) => ({
  root: {
    "label + &": {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    // position: 'relative',
    backgroundColor: theme.palette.common.white,
    border: "1px solid #ced4da",
    fontSize: 16,
    width: "350px",
    padding: "10px",
    marginLeft: "65px",
    marginRight: "10px",
    marginTop: "10px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),

    "&:hover": {
      backgroundColor: "#fff",
    },

    "&$focused": {
      backgroundColor: "#fff",
      boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 2px`,
      borderColor: theme.palette.primary.main,
    },
  },
}))(InputBase);





export default function NewUserCard(props) {
  const [stateApp] = useContext(AppContext);
  const classes = useStyles();
  const [userName, setUserName] = useState("");
  const [userLastName, setUserlastName] = useState("");
  const [userCompany, setUserCompany] = useState("");
  const [userTitle, setUserTitle] = useState("");
  const [userPhoneNum, setUserPhoneNum] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [emptyInputs, setEmptyInputs] = useState(false);

  //const [userPassword, setUserPassword] = useState("");

  useEffect(() => {
    setUserName("");
    setUserEmail("");
    setUserPhoneNum("");
    setUserCompany("");
  }, [emptyInputs]);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Node App Not Deployed");
    setSent(true);
  };

  useEffect(() => {
    ValidatorForm.addValidationRule("shortName", (value) => {
      if (value && userName.length < 2) {
        return false;
      } else {
        return true;
      }
    });
  }, [userName.length]);
  console.log(
    userName,
    userLastName,
    userCompany,
    userPhoneNum,
    userTitle,
    userEmail
  );




  // useEffect(() => {
  //   var script = document.createElement("script");
  //   script.type = "text/javascript";
  //   script.src =
  //     "https://m1neral.freshsales.io/web_forms/61c2b9f6feb20e6bc13b4c2d9beedea203e1fbbd4fb1993979372f393dee5b6f/form.js' crossorigin='anonymous' id='fs_61c2b9f6feb20e6bc13b4c2d9beedea203e1fbbd4fb1993979372f393dee5b6f";
  //   script.async = true;
  
  //   var x = document.getElementsByTagName("script")[0];
  //   x.parentNode.insertBefore(script, x);
  
  //   document.body.appendChild(script);
  
  //   return () => {
  //     document.body.removeChild(script);
  //   };
  // }, []);
  





  // const [loaded, error] = useScript(
  //   'https://m1neral.freshsales.io/web_forms/61c2b9f6feb20e6bc13b4c2d9beedea203e1fbbd4fb1993979372f393dee5b6f/form.js'   );


  // let cachedScripts = [];
  // function useScript(src) {
  //   // Keeping track of script loaded and error state
  //   const [state, setState] = useState({
  //     loaded: false,
  //     error: false
  //   });
  
  //   useEffect(
  //     () => {
  //       // If cachedScripts array already includes src that means another instance ...
  //       // ... of this hook already loaded this script, so no need to load again.
  //       if (cachedScripts.includes(src)) {
  //         setState({
  //           loaded: true,
  //           error: false
  //         });
  //       } else {
  //         cachedScripts.push(src);
  
  //         // Create script
  //         let script = document.createElement('script');
  //         //script.type = "application/json";
  //         script.src = src;
  //         script.crossorigin = 'anonymous';
  //         script.id = 'fs_61c2b9f6feb20e6bc13b4c2d9beedea203e1fbbd4fb1993979372f393dee5b6f';
  //         script.async = true;
  
  //         // Script event listener callbacks for load and error
  //         const onScriptLoad = () => {
  //           setState({
  //             loaded: true,
  //             error: false
  //           });
  //         };
  
  //         const onScriptError = () => {
  //           // Remove from cachedScripts we can try loading again
  //           const index = cachedScripts.indexOf(src);
  //           if (index >= 0) cachedScripts.splice(index, 1);
  //           script.remove();
  
  //           setState({
  //             loaded: true,
  //             error: true
  //           });
  //         };
  
  //         script.addEventListener('load', onScriptLoad);
  //         script.addEventListener('error', onScriptError);
  
  //         // Add script to document body
  //         document.body.appendChild(script);
  
  //         // Remove event listeners on cleanup
  //         return () => {
  //           script.removeEventListener('load', onScriptLoad);
  //           script.removeEventListener('error', onScriptError);
  //         };
  //       }
  //     },
  //     [src] // Only re-run effect if script src changes
  //   );
  
  //   return [state.loaded, state.error];
  // }






  useEffect(() => {
    const script = document.createElement('script');
  
    // script.src = "https://use.typekit.net/foobar.js";
    // script.async = true;

    script.src = 'https://m1neral.freshsales.io/web_forms/61c2b9f6feb20e6bc13b4c2d9beedea203e1fbbd4fb1993979372f393dee5b6f/form.js';
    script.crossorigin = 'anonymous';
    script.id = 'fs_61c2b9f6feb20e6bc13b4c2d9beedea203e1fbbd4fb1993979372f393dee5b6f';
    script.async = true;

  
    document.getElementById("parentID").appendChild(script);
  
    return () => {
      document.getElementById("parentID").removeChild(script);
    }
  }, []);














  return !sent ? (
    
    <div  className={classes.conatiner}>
      {/* {loaded && !error ? <div /> : <b>Something went wrong!</b>} */}

      <Card
        square={true}
        elevation={0}
        color="secondary"
        className={classes.card}
      >
        {/* <div className={classes.cardHeader}>
          <div style={{ marginTop: "5px", fontSize: "1rem" }}>
            Sign up as a buyer, financial institution or energy company.
          </div>
        </div> */}

        {/* <Card className={classes.cardForm}> */}
{/* 
        <div
          style={{
            marginTop: "75px",
            fontSize: "24px",
            fontWeight: "900",
            fontFamily: "Tahoma, Geneva, sans-serif",
            textAlign: "left",
            paddingLeft: "65px",
            color: "white",
          }}
        >
          Get in touch
        </div> */}


        <div id='parentID' />

        {/* <div
          style={{
            marginTop: "15px",
            fontSize: "14px",
            fontWeight: "900",
            fontFamily: "Tahoma, Geneva, sans-serif",
            color: "white",
            textAlign: "left",
            paddingLeft: "65px",
          }}
        >
          FULL NAME
        </div> */}

        {/* <BootstrapInput
          type="fname"
          // label="Email"
          variant="outlined"
          // error={emailFlags.error}
          // placeholder={emailFlags.placeholder}
          // autoFocus={emailFlags.autoFocus}
          autoComplete="true"
          // onKeyDown={e => onEnterKey(e)}
          // className={classes.inputs}
          onChange={(e) => setUserName(e.target.value)}
          // onBlur={() => validateData("email", userEmail, setEmailFlags)}
          value={userName}
        /> */}

        {/* 
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
                />                 */}

        {/* <div
          style={{
            marginTop: "15px",
            fontSize: "14px",
            fontWeight: "900",
            fontFamily: "Tahoma, Geneva, sans-serif",
            color: "white",
            textAlign: "left",
            paddingLeft: "65px",
          }}
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
          autoComplete="true"
          // onKeyDown={e => onEnterKey(e)}
          // className={classes.inputs}
          onChange={(e) => setUserEmail(e.target.value)}
          // onBlur={() => validateData("email", userEmail, setEmailFlags)}
          value={userEmail}
        />

        <div
          style={{
            marginTop: "15px",
            fontSize: "14px",
            fontWeight: "900",
            fontFamily: "Tahoma, Geneva, sans-serif",
            color: "white",
            textAlign: "left",
            paddingLeft: "65px",
          }}
        >
          COMPANY NAME
        </div> */}

        {/* <BootstrapInput
          type="company"
          // label="Email"
          variant="outlined"
          // error={emailFlags.error}
          // placeholder={emailFlags.placeholder}
          // autoFocus={emailFlags.autoFocus}
          autoComplete="true"
          // onKeyDown={e => onEnterKey(e)}
          // className={classes.inputs}
          onChange={(e) => setUserCompany(e.target.value)}
          // onBlur={() => validateData("email", userEmail, setEmailFlags)}
          value={userCompany}
        />

        <div
          style={{
            marginTop: "15px",
            fontSize: "14px",
            fontWeight: "900",
            fontFamily: "Tahoma, Geneva, sans-serif",
            color: "white",
            textAlign: "left",
            paddingLeft: "65px",
          }}
        >
          PHONE
        </div> */}

        {/* <BootstrapInput
          type="mobile"
          // label="Email"
          variant="outlined"
          // error={emailFlags.error}
          // placeholder={emailFlags.placeholder}
          // autoFocus={emailFlags.autoFocus}
          autoComplete="true"
          // onKeyDown={e => onEnterKey(e)}
          // className={classes.inputs}
          onChange={(e) => setUserPhoneNum(e.target.value)}
          // onBlur={() => validateData("email", userEmail, setEmailFlags)}
          value={userPhoneNum}
        /> */}

        {/* <div 
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
                /> */}

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

          </ValidatorForm> */}
        {/* <a
          href={
            userName.trim() !== ""
              ? `mailto:info@m1neral.com?subject="Access Request ${
                  stateApp.signUpUserType
                }"&body="${
                  userName.trim() !== "" ? "Name:" + userName.trim() : ""
                }${
                  userEmail.trim() !== "" ? "   Email:" + userEmail.trim() : ""
                }${
                  userCompany.trim() !== ""
                    ? "   Company:" + userCompany.trim()
                    : ""
                }${
                  userPhoneNum.trim() !== ""
                    ? "   Phone:" + userPhoneNum.trim()
                    : ""
                }"`
              : "#"
          }
          target={userName.trim() !== "" ? "_blank" : null}
          onClick={() => {
            setEmptyInputs(!emptyInputs);
          }}
        >
          <Button
            variant="outlined"
            disableElevation
            type="submit"
            className={classes.button}

            //onKeyDown={e => onEnterKey(e)}
          >
            REQUEST ACCESS
          </Button>
        </a> */}




        {/* <div className={classes.cardFooter}> */}
          {/* <div>
            By signing up, you agree to the{" "}
            <a
              href="https://www.m1neral.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{marginLeft: '10px'}} 
              className={classes.link}
            >
              Terms and Conditions
            </a>
          </div> */}
          {/* <div className={classes.links}>
            Already have an account?{" "}
            <Link
              to="/"
              style={{ marginLeft: "10px" }}
              className={classes.link}
            >
              {" "}
              Sign In
            </Link>
          </div> */}
        {/* </div> */}
      </Card>
    </div>
  ) : (
    <EmailSuccess />
  );
}
