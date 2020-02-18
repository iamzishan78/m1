import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
    display: "flex",
    flexDirection: "column",
    fontFamily: theme.typography.fontFamily,
    margin: "1%",
    justifyContent: "center"
  },
  cardContainer: {
    width: "100vw",
    position: "absolute",
    top: "calc(50vh - 50vh / 2)",
    display: "flex",
    justifyContent: "center"
  },
  cardTitle: {
    marginTop: "5%",
    fontSize: "1.5rem",
    justifyContent: "center"
  },
  cardInputs: {
    height: "60%",
    padding: "2%",
    paddingTop: "4%",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
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

  return !showSignUp ? (
    <React.Fragment>
      <Typography
        variant="h5"
        className={classes.cardTitle}
        style={{ fontSize: "2rem", top: "13%", justifyContent: "center" }}
      >
        Don't have an account?
      </Typography>
      <Typography
        variant="h5"
        className={classes.cardTitle}
        style={{ fontSize: ".9rem",paddingTop: "1.25%" , justifyContent: "center"}}
      >
        Tell us your story and get started today.
      </Typography>
      <div className={localClass.cardContainer}>
        <Card
          color="secondary"
          className={localClass.card}
          style={{ left: "20%" }}
        >
          <div className={classes.cardHeader}>
           {/*  <FontAwesomeIcon
              icon={faHandHoldingUsd}
              style={{ fontSize: "5.5rem" }}
            /> */}
            <div className={localClass.cardTitle} style={{ fontSize: "2rem"}}>OWNERS</div>
          </div>
          <div className={localClass.cardInputs}>
            <Typography style={{ textAlign: "center", marginTop: "10%" }}>
              For owners and sellers of royalties or minerals looking to learn
              more about what they own
            </Typography>
          </div>
          <div className={classes.cardFooter} style={{ alignItems: "unset" }}>
            <Button
              variant="contained"
              disableElevation
              className={classes.button}
              disabled
              style={{ color: "white", backgroundColor: "darkgray" }}
            >
              Coming Soon!
            </Button>
          </div>
        </Card>

        <Card color="secondary" className={localClass.card}>
          <div className={classes.cardHeader}>
            {/* <FontAwesomeIcon icon={faUsers} style={{ fontSize: "5.5rem" }} /> */}
            <div className={localClass.cardTitle} style={{ fontSize: "2rem"}}>BUYERS</div>
          </div>
          <div className={localClass.cardInputs}>
            <Typography style={{ textAlign: "center", marginTop: "10%" }}>
              For buyers seeking potential deals and to streamline
              acquisition workflows
            </Typography>
          </div>
          <div className={classes.cardFooter} style={{ alignItems: "unset" }}>
            <Button
              variant="contained"
              disableElevation
              className={classes.button}
              onClick={() => setShowSignUp(true)}
            >
              Sign Up
            </Button>
          </div>
        </Card>
      </div>
    </React.Fragment>
  ) : (
    <NewUserCard handleNewUserSignUp={handleNewUserSignUp} />
  );
};
export default SignUpCard;
