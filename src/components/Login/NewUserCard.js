import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import EmailSuccess from "./EmailSuccess";

// STYLES
import { useStyles } from "./styles";
import { makeStyles } from "@material-ui/core";
import { Card, Button } from "@material-ui/core";
// COMPONENTS

const localStyles = makeStyles(theme => ({
  conatiner: {
    paddingTop: 20,
    margin: "0 auto",
    height: "100%",
    // display: "flex",
    justifyContent: "center"
  },
  card: {
    maxWidth: 450,
    minWidth: 445,
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



export default function NewUserCard(props) {
  const classes = useStyles();
  const localClass = localStyles();
  const [userName, setUserName] = useState("");
  const [userLastName, setUserlastName] = useState("");
  const [userCompany, setUserCompany] = useState("");
  const [userTitle, setUserTitle] = useState("");
  const [userPhoneNum, setUserPhoneNum] = useState();
  const [userEmail, setUserEmail] = useState("");
  const [sent, setSent] = useState(false);
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

  const handleSubmit = e => {
    e.preventDefault();
    alert(
      "Node App Not Deployed"
    );
    setSent(true);
    // const name = userName
    // const lastName = userLastName
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
              // lastName: lastName,
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
    <div className={localClass.conatiner}>
      <Card color="secondary" className={localClass.card}>
        <div className={localClass.cardHeader}>
          <div style={{ marginTop: "5px", fontSize: "1rem" }}>
            Sign up as a buyer, financial institution or energy company.
          </div>
        </div>
        <Card className={localClass.cardForm}>
          <ValidatorForm
            onSubmit={handleSubmit}
            onError={errors => console.log(errors)}
            method="POST"
          >
            <TextValidator
              className={localClass.inputsName}
              type="text"
              label="Fist Name"
              variant="filled"
              validators={["shortName", "required"]}
              errorMessages={["this field is required", "Name is not valid"]}
              onChange={e => setUserName(e.target.value)}
              value={userName}
            />
            <TextValidator
              className={localClass.inputsName}
              type="text"
              label="Last Name"
              variant="filled"
              validators={["shortName", "required"]}
              errorMessages={["this field is required", "Last Name is not valid"]}
              onChange={e => setUserlastName(e.target.value)}
              value={userLastName}
            />
            <TextValidator
              className={localClass.inputs}
              type="text"
              label="Company"
              variant="filled"
              validators={["required"]}
              errorMessages={["this field is required"]}
              onChange={e => setUserCompany(e.target.value)}
              value={userCompany}
            />
            <TextValidator
              className={localClass.inputs}
              type="text"
              label="Title"
              variant="filled"
              validators={["required"]}
              errorMessages={["this field is required"]}
              onChange={e => setUserTitle(e.target.value)}
              value={userTitle}
            />
            <TextValidator
              className={localClass.inputs}
              type="email"
              label="Email"
              variant="filled"
              validators={["required", "isEmail"]}
              errorMessages={["this field is required"]}
              onChange={e => setUserEmail(e.target.value)}
              value={userEmail}
            />
            <TextValidator
              className={localClass.inputs}
              type="text"
              label="Phone Number"
              variant="filled"
              validators={["required"]}
              errorMessages={["this field is required"]}
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
          </ValidatorForm>
        </Card>
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
  ) : (
    <EmailSuccess />
  );
}
