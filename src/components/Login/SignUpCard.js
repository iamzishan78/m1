import React, { useState, useEffect } from "react";

// STYLES
import { makeStyles } from "@material-ui/core";
import { useStyles } from "./styles";
import { Card, CardMedia,  Button, Typography } from "@material-ui/core";
import SvgIcon from '@material-ui/core/SvgIcon';
// COMPONENTS
import NewUserCard from "./NewUserCard";

const BackgroundURI =
  "img/WellsBackgroundlogin.jpg";

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
    // width: "100vw",
    display: "block",
  },
  cardTitle: {
    paddingTop: "40px",
    fontSize: "2rem",
    justifyContent: "center",
    color: "#FFFF"
  },
  cardInputs: {
    padding: "2%",
    color: "white",
  },
  rootNewUser: {
    textAlign: "center",
    // width: "100vw",
    // height: "100vh"
    },
  displaNone: {
      display: "none",
    },
    content :{
      backgroundSize: "cover",
      height: "100vh",
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
          style={{ fontSize: ".9rem",color: "#FFFF" ,marginTop: "15px", marginBottom: "30px"}}
        >
          Tell us your story and get started today.
        </Typography>
          <Card
            color="secondary"
            className={localClass.card}
          >
            <div>
            {/* <SvgIcon color="primary">
              <path fill="white" d="M271.06 144.3l54.27 14.3a8.59 8.59 0 0 1 6.63 8.1c0 4.6-4.09 8.4-9.12 8.4h-35.6a30 30 0 0 1-11.19-2.2c-5.24-2.2-11.28-1.7-15.3 2l-19 17.5a11.68 11.68 0 0 0-2.25 2.66a11.42 11.42 0 0 0 3.88 15.74a83.77 83.77 0 0 0 34.51 11.5V240c0 8.8 7.83 16 17.37 16h17.37c9.55 0 17.38-7.2 17.38-16v-17.6c32.93-3.6 57.84-31 53.5-63c-3.15-23-22.46-41.3-46.56-47.7l-54.27-14.3a8.59 8.59 0 0 1-6.63-8.1c0-4.6 4.09-8.4 9.12-8.4h35.6A30 30 0 0 1 332 83.1c5.23 2.2 11.28 1.7 15.3-2l19-17.5a11.31 11.31 0 0 0 2.17-2.6a11.43 11.43 0 0 0-3.84-15.78a83.82 83.82 0 0 0-34.52-11.5V16c0-8.8-7.82-16-17.37-16h-17.37C285.82 0 278 7.2 278 16v17.6c-32.89 3.6-57.85 31-53.51 63c3.14 23 22.51 41.3 46.57 47.7zm294.21 183.8c-11.8-10.7-30.2-10-42.6 0l-92.4 73.9a63.64 63.64 0 0 1-40 14H272a16 16 0 0 1 0-32h78.29c15.9 0 30.71-10.9 33.25-26.6a31.2 31.2 0 0 0 .46-5.46A32 32 0 0 0 352 320H192a117.66 117.66 0 0 0-74.1 26.29L71.4 384H16a16 16 0 0 0-16 16v96a16 16 0 0 0 16 16h356.77a64 64 0 0 0 40-14L564 377a32 32 0 0 0 1.28-48.9z" />
          
            </SvgIcon> */}
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
    <CardMedia
        media="img"
        image={BackgroundURI}
       // alt="Oil Dereks"
        className={localClass.content}
      >
    <div className={localClass.rootNewUser}> 
    {renderBody}
    {renderSignupNewCard}
    </div>
    </CardMedia>
  ) 
};
export default SignUpCard;


// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// // STYLES
// import { makeStyles } from "@material-ui/core";
// import { useStyles } from "./styles";
// import { Card, TextField, Button, Typography } from "@material-ui/core";
// // import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// // import { faHandHoldingUsd, faUsers } from "@fortawesome/free-solid-svg-icons";
// // COMPONENTS
// import NewUserCard from "./NewUserCard";

// const localStyles = makeStyles(theme => ({
//   card: {
//     width: "37.5vw",
//     maxWidth: "400px",
//     height: "50vh",
//     backgroundColor: theme.palette.secondary.dark,
//     border: `1px solid ${theme.palette.secondary.main}`,
//     display: "flex",
//     flexDirection: "column",
//     fontFamily: theme.typography.fontFamily,
//     margin: "1%",
//     justifyContent: "center"
//   },
//   cardContainer: {
//     width: "100vw",
//     position: "absolute",
//     top: "calc(50vh - 50vh / 2)",
//     display: "flex",
//     justifyContent: "center"
//   },
//   cardTitle: {
//     marginTop: "5%",
//     fontSize: "1.5rem",
//     justifyContent: "center"
//   },
//   cardInputs: {
//     height: "60%",
//     padding: "2%",
//     paddingTop: "4%",
//     color: "white",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center"
//   },
// }));

// const SignUpCard = props => {
//   const classes = useStyles();
//   const localClass = localStyles();
//   const [showSignUp, setShowSignUp] = useState(false);

//   useEffect(() => {
//     console.log("it changed");
//   }, [showSignUp]);

//   const handleNewUserSignUp = userData => {
//     console.log("userData", userData);
//   };

//   return !showSignUp ? (
//     <React.Fragment>
//       <Typography
//         variant="h5"
//         className={classes.cardTitle}
//         style={{ fontSize: "2rem", top: "13%", justifyContent: "center" }}
//       >
//         Don't have an account?
//       </Typography>
//       <Typography
//         variant="h5"
//         className={classes.cardTitle}
//         style={{ fontSize: ".9rem",paddingTop: "1.25%" , justifyContent: "center"}}
//       >
//         Tell us your story and get started today.
//       </Typography>
//       <div className={localClass.cardContainer}>
//         <Card
//           color="secondary"
//           className={localClass.card}
//           style={{ left: "20%" }}
//         >
//           <div className={classes.cardHeader}>
//             {/* <FontAwesomeIcon
//               icon={faHandHoldingUsd}
//               style={{ fontSize: "5.5rem" }}
//             /> */}
//             <div className={localClass.cardTitle} style={{ fontSize: "2rem"}}>OWNERS</div>
//           </div>
//           <div className={localClass.cardInputs}>
//             <Typography style={{ textAlign: "center", marginTop: "10%" }}>
//               For owners and sellers of royalties or minerals looking to learn
//               more about what they own
//             </Typography>
//           </div>
//           <div className={classes.cardFooter} style={{ alignItems: "unset" }}>
//             <Button
//               variant="contained"
//               disableElevation
//               className={classes.button}
//               disabled
//               style={{ color: "white", backgroundColor: "darkgray" }}
//             >
//               Coming Soon!
//             </Button>
//           </div>
//         </Card>
// ​
//         <Card color="secondary" className={localClass.card}>
//           <div className={classes.cardHeader}>
//             {/* <FontAwesomeIcon icon={faUsers} style={{ fontSize: "5.5rem" }} /> */}
//             <div className={localClass.cardTitle} style={{ fontSize: "2rem"}}>BUYERS</div>
//           </div>
//           <div className={localClass.cardInputs}>
//             <Typography style={{ textAlign: "center", marginTop: "10%" }}>
//               For buyers seeking potential deals and to streamline
//               acquisition workflows
//             </Typography>
//           </div>
//           <div className={classes.cardFooter} style={{ alignItems: "unset" }}>
//             <Button
//               variant="contained"
//               disableElevation
//               className={classes.button}
//               onClick={() => setShowSignUp(true)}
//             >
//               Sign Up
//             </Button>
//           </div>
//         </Card>
//       </div>
//     </React.Fragment>
//   ) : (
//     <NewUserCard handleNewUserSignUp={handleNewUserSignUp} />
//   );
// };
// export default SignUpCard;



