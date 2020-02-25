import React, { useState, useEffect } from "react";

// STYLES
import { makeStyles } from "@material-ui/core";
import { useStyles } from "./styles";
import { Card, TextField, Button, Typography } from "@material-ui/core";
// COMPONENTS
import NewUserCard from "./NewUserCard";

const localStyles = makeStyles(theme => ({
  card: {
    width: "37.5vw",
    maxWidth: "400px",
    height: "50vh",
    backgroundColor: theme.palette.secondary.dark,
    border: `1px solid ${theme.palette.secondary.main}`,
    display: "inline-block",
    fontFamily: theme.typography.fontFamily,
    margin: 10,
  },
  cardContainer: {
    width: "100vw",
    display: "block",
  },
  cardTitle: {
    marginTop: "40px",
    fontSize: "2rem",
    justifyContent: "center"
  },
  cardInputs: {
    padding: "2%",
    color: "white",
  },
  rootNewUser: {
    textAlign: "center",
    width: "100vw",
    height: "100vh"
    },
  displaNone: {
      display: "none",
    }
}));

const SignUpCard = props => {
  
  const classes = useStyles();
  const localClass = localStyles();
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    console.log("it changed");
  }, [showSignUp]);

  const handleNewUserSignUp = userData => {
    console.log("userData", userData);
  };

  const showForm = () => {
    if (!showSignUp) {
      setShowSignUp(true)
    } else {
      setShowSignUp(false)
    }
  }

  const renderSignupNewCard = (
    showSignUp ? 
      <NewUserCard className={localClass.newUser} handleNewUserSignUp={handleNewUserSignUp} />
    : <div className={localClass.displaNone} ></div>
  )
  
  const renderBody = (
    !showSignUp ? (
        <div className={localClass.cardContainer}>
          <Typography
          variant="h4"
          className={localClass.cardTitle}
        >
          Don't have an account?
        </Typography>
        <Typography
          variant="h5"
          style={{ fontSize: ".9rem", marginTop: "15px", marginBottom: "30px"}}
        >
          Tell us your story and get started today.
        </Typography>
          <Card
            color="secondary"
            className={localClass.card}
          >
            <div>
             {/*  <FontAwesomeIcon
                icon={faHandHoldingUsd}
                style={{ fontSize: "5.5rem" }}
              /> */}
              <div className={localClass.cardTitle} style={{ color: "white",  fontSize: "2rem"}}>OWNERS</div>
            </div>
            <div className={localClass.cardInputs}>
              <Typography style={{ textAlign: "center", marginTop: "10%" }}>
                For owners and sellers of royalties or minerals looking to learn
                more about what they own
              </Typography>
            </div>
              <Button
                variant="contained"
                disableElevation
                // className={localClass.buttonDisable}
                style={{color: "white", backgroundColor: "darkgray", marginTop: 30, marginBottom: 15 , width: "15vw"}}
                disabled
              >
                Coming Soon!
              </Button>
          </Card>
  
          <Card color="secondary" className={localClass.card}>
            <div>
              {/* <FontAwesomeIcon icon={faUsers} style={{ fontSize: "5.5rem" }} /> */}
              <div className={localClass.cardTitle} style={{ color: "white",fontSize: "2rem"}}>BUYERS</div>
            </div>
            <div className={localClass.cardInputs}>
              <Typography style={{ textAlign: "center", marginTop: "10%" }}>
                For buyers seeking potential deals and to streamline
                acquisition workflows
              </Typography>
            </div>
              <Button
                variant="contained"
                disableElevation
                style={{color: "white",  marginTop: 30, backgroundColor: "rgba(23, 170, 221, 1)" ,  marginBottom: 15, width: "15vw"}}
                onClick={showForm}
              >
                Sign Up
              </Button>
          </Card>
        </div>
    ) : (
      <div className={localClass.displaNone} ></div>
    ) 
  )


  return (
    <div className={localClass.rootNewUser}> 
    {renderBody}
    {renderSignupNewCard}
    </div>
  ) 
};
export default SignUpCard;
