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

const useStyles = makeStyles((theme) => ({
  conatiner: {},
  card: {
    width: "500px",
    height: "935px",
    //backgroundColor: theme.palette.secondary.dark,
    backgroundColor: "#fffff",
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



  useEffect(() => {
    const script = document.createElement('script');
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
      <Card
        square={true}
        elevation={0}
        color="secondary"
        className={classes.card}
      >
        <div id='parentID' />
      </Card>
    </div>
  ) : (
    <EmailSuccess />
  );
}
