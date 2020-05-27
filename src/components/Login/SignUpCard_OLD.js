import React, { useState, useEffect } from "react";

// STYLES
import { makeStyles } from "@material-ui/core";
import { useStyles } from "./styles";
import { Card, Button, Typography } from "@material-ui/core";

// COMPONENTS
import NewUserCard from "./NewUserCard";

const BackgroundURI = "img/WellsBackgroundlogin.jpg";

const localStyles = makeStyles(theme => ({
  card: {
    maxWidth: "400px",
    paddingBottom: 25,
    paddingTop: 25,
    backgroundColor: theme.palette.secondary.dark,
    border: `1px solid ${theme.palette.secondary.main}`,
    fontFamily: theme.typography.fontFamily,
    margin: 10
  },
  cardContainer: {
    display: "flex",
    justifyContent: "center"
  },
  cardTitle: {
    // paddingTop: "40px",
    fontSize: "2rem",
    justifyContent: "center",
    color: "#FFFF",
    fontFamily: theme.typography.fontFamily
  },
  titleTop: {
    marginTop: "25px",
    fontSize: "3em",
    color: "#FFFF",
    fontFamily: theme.typography.fontFamily
  },
  cardInputs: {
    padding: "2%",
    color: "white"
  },
  rootNewUser: {
    textAlign: "center",
    display: "flex",
    height: "100%",
    flexDirection: "column",
    backgroundSize: "cover",
    // backgroundImage: `url(${BackgroundURI})`,
    // backgroundRepeat: "no-repeat",
    // backgroundPosition: "center",
    '&::-webkit-scrollbar': {
      width: '0 !important'
     },
  },
  displaNone: {
    display: "none"
  },
}));

const BuyersSvg = props => {
  return (
    <svg
      viewBox="0 0 96 96"
      xmlns="http://www.w3.org/2000/svg"
      xlink="http://www.w3.org/1999/xlink"
      width="150"
      height="150"
      // viewBox="0 0 11320 2490"
      // id="Icons_BoardRoom"
      // overflow="hidden"
    >
      <path
        fill="#FFFF"
        d="M21 32.19C23.7614 32.19 26 29.9514 26 27.19 26 24.4286 23.7614 22.19 21 22.19 18.2386 22.19 16 24.4286 16 27.19 16 29.9514 18.2386 32.19 21 32.19Z"
      />
      <path
        fill="#FFFF"
        d="M27.52 43.52C27.951 43.8309 28.4686 43.9988 29 44L36 44C37.3807 44 38.5 42.8807 38.5 41.5 38.5 40.1193 37.3807 39 36 39L29.82 39 25.06 35.51C24.0205 34.0817 22.2962 33.3187 20.54 33.51 17.9526 33.8317 16.0245 36.0531 16.07 38.66L16.07 53C16.07 55.7614 18.3086 58 21.07 58L26 58 26 58 32 58 32 70.72C32 72.1007 33.1193 73.22 34.5 73.22 35.8807 73.22 37 72.1007 37 70.72L37 55.47C37 54.0893 35.8807 52.97 34.5 52.97L26 52.97 26 42.39Z"
      />
      <path
        fill="#FFFF"
        d="M75 32.19C77.7614 32.19 80 29.9514 80 27.19 80 24.4286 77.7614 22.19 75 22.19 72.2386 22.19 70 24.4286 70 27.19 70 29.9514 72.2386 32.19 75 32.19Z"
      />
      <path
        fill="#FFFF"
        d="M75.46 33.46C73.7038 33.2687 71.9795 34.0317 70.94 35.46L66.18 39 60 39C58.6193 39 57.5 40.1193 57.5 41.5 57.5 42.8807 58.6193 44 60 44L67 44C67.5314 43.9988 68.049 43.8309 68.48 43.52L70 42.39 70 53 61.53 53C60.1493 53 59.03 54.1193 59.03 55.5L59.03 70.72C59.03 72.1007 60.1493 73.22 61.53 73.22 62.9107 73.22 64.03 72.1007 64.03 70.72L64.03 58 70.03 58 70.03 58 74.91 58C77.6714 58 79.91 55.7614 79.91 53L79.91 38.61C79.9567 36.0098 78.0394 33.791 75.46 33.46Z"
      />
      <path
        fill="#FFFF"
        d="M65 46 31 46C29.8954 46 29 46.8954 29 48 29 49.1046 29.8954 50 31 50L46 50 46 70 40 70 40 74 56 74 56 70 50 70 50 50 65 50C66.1046 50 67 49.1046 67 48 67 46.8954 66.1046 46 65 46Z"
      />
      <path
        fill="#FFFF"
        d="M28 60 14 60 14 40C14 38.8954 13.1046 38 12 38 10.8954 38 10 38.8954 10 40L10 62C10 63.1046 10.8954 64 12 64L18 64 18 70 14 70 14 74 26 74 26 70 22 70 22 64 28 64C29.1046 64 30 63.1046 30 62 30 60.8954 29.1046 60 28 60Z"
      />
      <path
        fill="#FFFF"
        d="M84 38.5C82.8954 38.5 82 39.3954 82 40.5L82 60 68 60C66.8954 60 66 60.8954 66 62 66 63.1046 66.8954 64 68 64L74 64 74 70 70 70 70 74 82 74 82 70 78 70 78 64 84 64C85.1046 64 86 63.1046 86 62L86 40.5C86 39.3954 85.1046 38.5 84 38.5Z"
      />
    </svg>
  );
};

const SellersSvg = props => {
  return (
    <svg
      viewBox="0 0 96 96"
      xmlns="http://www.w3.org/2000/svg"
      xlink="http://www.w3.org/1999/xlink"
      width="135"
      height="135"
      // viewBox="0 0 11320 2490"
      // id="Icons_BoardRoom"
      // overflow="hidden"
    >
      <circle fill="#FFFF" cx="30.5" cy="44.6" r="9" />
      <path fill="#FFFF" d="M72.5 88 72.5 79C72.5369 77.5751 71.862 76.2254 70.7 75.4 68.1096 73.3725 65.1055 71.9387 61.9 71.2 59.4966 70.4775 57.0086 70.0741 54.5 70 51.9855 70.0078 49.4881 70.4127 47.1 71.2 43.94 72.065 40.9599 73.4874 38.3 75.4 37.1718 76.2539 36.5062 77.5851 36.5 79L36.5 88Z" />
      <circle fill="#FFFF" cx="54.5" cy="58.6" r="9" />
      <path fill="#FFFF" d="M35.9 72.2 35.9 72.2C38.7079 70.1961 41.8121 68.644 45.1 67.6 42.8259 65.2303 41.5388 62.0841 41.5 58.8L41.5 58.4C40.3317 57.9105 39.1283 57.5094 37.9 57.2 35.4966 56.4775 33.0086 56.074 30.5 56 27.9855 56.0077 25.4881 56.4127 23.1 57.2 19.9721 58.1495 17.0054 59.5654 14.3 61.4 13.138 62.2254 12.4631 63.5751 12.5 65L12.5 74 34.1 74C34.5958 73.3042 35.2042 72.6958 35.9 72.2Z" />
      <path fill="#FFFF" d="M81.35 8 43.58 8C42.4241 8.011 41.4944 8.95407 41.5 10.11L41.5 35.86C41.4779 37.0196 42.3999 37.9776 43.5595 37.9997 43.5663 37.9998 43.5732 37.9999 43.58 38L49.58 38 49.58 46.44 57.87 38 81.35 38C82.5075 37.989 83.44 37.0476 83.44 35.89L83.44 10.11C83.4401 8.95245 82.5075 8.01097 81.35 8ZM62.29 34.25C61.0639 34.2499 60.0701 33.2559 60.0702 32.0298 60.0703 30.8037 61.0643 29.8099 62.2904 29.81 63.5047 29.8101 64.4936 30.7858 64.51 32 64.5321 33.2203 63.5607 34.2276 62.3404 34.2497 62.3236 34.25 62.3068 34.2501 62.29 34.25ZM63.72 25.1 63.72 28.25 60.87 28.25 60.87 22.36 62.29 22.36C64.77 22.36 66.37 20.91 66.37 18.68 66.4091 16.4712 64.6502 14.6489 62.4414 14.6098 62.391 14.6089 62.3405 14.609 62.29 14.61 60.2333 14.4189 58.4111 15.9312 58.22 17.9879 58.1986 18.2181 58.1986 18.4498 58.22 18.68L58.22 18.93 55.37 18.93 55.37 18.68C55.154 15.069 57.9062 11.9666 61.5172 11.7506 61.7746 11.7352 62.0326 11.735 62.29 11.75 66.0729 11.7056 69.1756 14.7362 69.22 18.5191 69.2206 18.5727 69.2206 18.6264 69.22 18.68 69.3171 21.9183 66.9349 24.6991 63.72 25.1Z" />
    </svg>
  );
};

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
      setShowSignUp(true);
    } else {
      setShowSignUp(false);
    }
  };

  const renderSignupNewCard = showSignUp ? (
    <NewUserCard
      className={localClass.newUser}
      handleNewUserSignUp={handleNewUserSignUp}
    />
  ) : (
    <div className={localClass.displaNone}></div>
  );

  const renderBody = !showSignUp ? (
    <>
      <div>
        <Typography variant="h4" className={localClass.titleTop}>
          Don't have an account?
        </Typography>
        <Typography
          variant="h5"
          style={{
            fontSize: "1.5em",
            color: "#FFFF",
            marginTop: "15px",
            marginBottom: "30px"
          }}
        >
          Tell us your story and get started today.
        </Typography>
      </div>
      <div className={localClass.cardContainer}>
        <Card color="secondary" className={localClass.card}>
          <div>
            <SellersSvg />
            <div
              className={localClass.cardTitle}
              style={{ color: "white", fontSize: "2rem", paddingTop: "4%" }}
            >
              OWNERS
            </div>
          </div>
          <div className={localClass.cardInputs}>
            <Typography style={{ textAlign: "center", paddingTop: "5%" }}>
              For owners and sellers of royalties or minerals looking to learn
              more about what they own
            </Typography>
          </div>
          <Button
            variant="contained"
            disableElevation
            // className={localClass.buttonDisable}
            style={{
              color: "white",
              backgroundColor: "rgb(98, 93, 113)",
              marginTop: 20,
              marginBottom: 15,
              width: "15vw"
            }}
            disabled
          >
            Coming Soon!
          </Button>
        </Card>

        <Card color="secondary" className={localClass.card}>
          <div>
            {/* <FontAwesomeIcon icon={faUsers} style={{ fontSize: "5.5rem" }} /> */}
            <BuyersSvg />
            <div
              className={localClass.cardTitle}
              style={{ color: "white", fontSize: "2rem" }}
            >
              BUYERS
            </div>
          </div>
          <div className={localClass.cardInputs}>
            <Typography style={{ textAlign: "center", paddingTop: "5%" }}>
              For buyers seeking potential deals and to streamline acquisition
              workflows
            </Typography>
          </div>
          <Button
            variant="contained"
            disableElevation
            style={{
              color: "white",
              marginTop: 20,
              backgroundColor: "rgba(23, 170, 221, 1)",
              marginBottom: 15,
              width: "15vw"
            }}
            onClick={showForm}
          >
            Sign Up
          </Button>
        </Card>
      </div>
    </>
  ) : (
    <div className={localClass.displaNone}></div>
  );



  return (
      <div className={localClass.rootNewUser}>
        {renderBody}
        {renderSignupNewCard}
      </div>
  );
};
export default SignUpCard;
