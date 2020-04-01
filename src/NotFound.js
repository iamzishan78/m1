import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom";
// import SvgIcon from '@material-ui/core/SvgIcon';


const useStyles = makeStyles(theme => ({
  myRoot : {
    display: "inherit",
    // backgroundImage: `url(${BackgroundURI})`,
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPositionY: "10vh",
    height: "100%",
    '&::-webkit-scrollbar': {
      width: '0 !important'
     },

  },
  header: {
    fontSize: "3em",
    textAlign: "center",
    paddingTop: 20,
    color: "rgba(1, 17, 51, 1.0)",
    fontFamily: "Poppins"
  },
  link: {
    textAlign: "center",
    textDecoration: "none",
    display: "block",
    color: "rgba(1, 17, 51, 1.0)",
    fontFamily: "Poppins",
    paddingBottom: "5%",
    fontSize: "2em",
  },
  textWrap : {
    backgroundImage: `url(${BackgroundURI})`,
    display:"inline-flex",
    "-webkit-background-clip": "text",
    "-webkit-text-fill-color": "transparent", 
    fontSize: "4em",
    paddingLeft: "10px",
    marginBottom: 100,
    marginTop: 100,
    paddingRight: 10, 
  },
  wrap: {
    textAlign: "center",
  }
}));

const BackgroundURI = "img/static.gif";

export default function NotFound() {
  const classes = useStyles();

  return (
    <div className={classes.myRoot}>
      <h1 className={classes.header}>OOPS... THIS IS EMBARASSING</h1>
      <div className={classes.wrap}>
      <span className={classes.textWrap}>WE SCREWED UP</span>
      <span className={classes.textWrap}>404</span>
      <span className={classes.textWrap}>YOU CAN'T TYPE</span>
      </div>
      {/* <SvgIcon viewBox="0 0 50 20">
        <circle 
          cx="40" cy="40" r="30"
          style={{fill: "rgba(1, 17, 51, 1.0)" }}
        />
        <circle 
          cx="64" cy="40" r="30"
          style={{fill: "rgb(18, 171, 224)" , fillOpacity: 0.5}}
        />
      </SvgIcon> */}
      <Link className={classes.link} to="/" >TAKE ME TO THE <b>HOME PAGE</b></Link>
    </div>
  );
};

