import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import EmailSuccess from "./EmailSuccess";

// STYLES
import { useStyles } from "./styles";
import { makeStyles } from "@material-ui/core";
import { Card,  Button} from "@material-ui/core";
// COMPONENTS

const localStyles = makeStyles(theme => ({
  conatiner: {
    display: "inline-block",
    margin: 20,
  },
  card: {
    // width: "50vw",
    maxWidth: 450,
    minWidth: 445,
    // height: "80vh",
    // position: "fixed",
    // left: "calc(50vw - 25vw / 2)",
    // top: "calc(50vh - 70vh / 2)",
    backgroundColor: theme.palette.secondary.dark,
    border: `1px solid ${theme.palette.secondary.main}`,
    // display: "flex",
    // flexDirection: "column",
    fontFamily: theme.typography.fontFamily
  },
  cardHeader: {
    height: "10%",
    color: "white",
    padding: "20px 40px",
    textAlign: "center"
  },
  // cardInputs: {
  //   height: "80%",
  //   display: "flex",
  //   flexDirection: "column",
  //   justifyContent: "space-evenly",
  //   alignItems: "center"
  // },
  cardFooter: {
    height: "15%",
    // padding: "10px 10px",
    color: "white",
    fontSize: ".75rem",
    textAlign: "center"
  },
  inputs: {
    backgroundColor: theme.palette.background.paper,
    width: "80%",
    position: "relative",
    // transition: 'border-bottom-color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
    pointerEvents: 'all',
    margin: "2% 10%",
  },
  links: {
    marginTop: 10,
    marginBottom: 30
  },
  cardForm: {
    display: "inline",
    pointerEvents: "all"
  }
}));

export default function  NewUserCard (props)  {
  const classes = useStyles();
  const localClass = localStyles();
  const [userName, setUserName] = useState("");
  const [userCompany, setUserCompany] = useState("");
  const [userTitle, setUserTitle] = useState("");
  const [userPhoneNum, setUserPhoneNum] = useState();
  const [userEmail, setUserEmail] = useState("");
  const [sent , setSent] = useState(false)
  //const [userPassword, setUserPassword] = useState("");

  useEffect(() => {}, [userEmail]);

  // const signUp = () => {
  //   const userData = {
  //     userName,
  //     userCompany,
  //     userTitle,
  //     userPhoneNum,
  //     userEmail,
  //     //  userPassword
  //   };
  //   props.handleNewUserSignUp(userData);
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Node App Not Deployed, But Here is Your Info", userName, userCompany, userPhoneNum, userTitle, userEmail)
    setSent(true)
    // const name = userName
    // const email = userEmail
    // const company = userCompany
    // const phone = userPhoneNum
    // const title = userTitle
    // fetch("http://localhost:3002/send", {
    //     method: "POST", 
    //     headers: {
    //       Accept: 'application/json',
    //       'Content-Type': 'application/json',
    //     },
    //     body:JSON.stringify({
    //         name: name,   
    //         email: email,
    //         title: title,  
    //         company: company,
    //         phone: phone,
    //     }),
    // }).then((response )=>{
    //     if (response.status === 200){
    //         setSent(true)

    //     }else if(response.status !==  200){
    //         alert("Message failed to send.")
    //     }
    // }).catch(err => console.log(err))
  }
  

  useEffect(()=> {
      ValidatorForm.addValidationRule('shortName', (value) => {
        if (value && userName.length < 3 ) {
            return false;
        } else { 
          return true;
        }
      }); 

      // if (userPhoneNum && userPhoneNum.length > 0) {
        ValidatorForm.addValidationRule('testPhone', (value) => {
          const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
          if(regex.test(value)) {
            return true;
          } else {
            return false
          }
        }); 
      // }   
  },[userName.length, userPhoneNum])

  return (
    !sent ? 
    <div className={localClass.conatiner}>
      {/* <Typography
        variant="h5"
        className={classes.cardTitle}
        style={{ fontSize: "2rem", top: "5%", justifyContent: "center" }}
      ></Typography> */}
      <Card color="secondary" className={localClass.card}>
        <div className={localClass.cardHeader}>
          <div style={{ marginTop: "5px", fontSize: "1rem" }}>
            Sign up as a buyer, financial institution or energy company.
          </div>
        </div>
        {/* <div className={localClass.cardInputs}> */}
        <Card className={localClass.cardForm}>
        <ValidatorForm
          onSubmit={handleSubmit}
          onError={errors => console.log(errors)}
          method="POST"
        >
          <TextValidator
            className={localClass.inputs}
            type="text"
            label="Full Name"
            variant="filled"
            validators={['shortName', 'required']}
            errorMessages={['this field is required', 'Name is not valid']}
            onChange={e => setUserName(e.target.value)}
            value={userName}
          />
          <TextValidator
            className={localClass.inputs}
            type="text"
            label="Company"
            variant="filled"
            validators={['required']}
            errorMessages={['this field is required']}
            onChange={e => setUserCompany(e.target.value)}
            value={userCompany}
          />
          <TextValidator
            className={localClass.inputs}
            type="text"
            label="Title"
            variant="filled"
            validators={['required']}
            errorMessages={['this field is required']}
            onChange={e => setUserTitle(e.target.value)}
            value={userTitle}
          />
          <TextValidator
            className={localClass.inputs}
            type="email"
            label="Email"
            variant="filled"
            validators={['required', 'isEmail']}
            errorMessages={['this field is required']}
            onChange={e => setUserEmail(e.target.value)}
            value={userEmail}
          />
          <TextValidator
            className={localClass.inputs}
            type="text"
            label="Phone Number"
            variant="filled"
            validators={['testPhone','required']}
            errorMessages={['this field is required']}
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
          
          {/* <div className={classes.secondaryInputs}></div> */}
          
          <Button
            variant="contained"
            disableElevation
            // onClick={signUp}
            type="submit"
            style={{ fontSize: "1.2em", color: "white",  marginTop: 30, backgroundColor: "rgba(23, 170, 221, 1)" ,  marginBottom: 15, width: "20vw"}}
          >
            Submit
          </Button>
          </ValidatorForm>
          </Card>
        {/* </div> */}
        <div className={localClass.cardFooter}>
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
          <div className={localClass.links}>
            Already have an account?{" "}
            <Link to="/" className={classes.signupLink}>
              {" "}
              Sign In
            </Link>
          </div>
        </div>
      </Card>
    </div>
    :   <EmailSuccess/>
  );
};

