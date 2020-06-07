import React, { useContext } from "react";
import { AppContext } from "../../AppContext";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Typography } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { Link } from "react-router-dom";

const localStyles = makeStyles((theme) => ({
  headerWords: {
    color: "#011133",
    display: "flex",
    justifyContent: "center",
    marginTop: "30px",
    marginBottom: "10px",
    fontSize: "48px",
    fontWeight: "900",
    fontFamily: "Tahoma, Geneva, sans-serif",
  },
  smallerWords: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
    fontSize: "24px",
    fontWeight: "900",
    fontFamily: "Tahoma, Geneva, sans-serif",
  },
  signInCard: {
    width: "250px",
    height: "410px",
    marginBottom: 50,
    border: "1px solid #f0f4f5",
    fontFamily: theme.typography.fontFamily,
    "&:hover": {
      border: `3px solid #f0cfb3`,
    },
  },
  cardContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  signInCardContainer: {
    paddingRight: 10,
    paddingLeft: 10,
  },
  buttonLower: {
    backgroundColor: "#e4a773",
    color: "#011133",
    width: "150px",
    "&:hover": {
      backgroundColor: "#f0cfb3",
    },
  },
}));

const BuyersSvg = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="120"
      height="120"
      overflow="hidden"
      viewBox="0 0 508 508"
    >
      <defs>
        <filter
          id="c"
          width="129.3%"
          height="140.8%"
          filterUnits="objectBoundingBox"
        >
          <feOffset
            dx="15"
            dy="15"
            in="SourceAlpha"
            result="shadowOffsetOuter1"
          ></feOffset>
          <feColorMatrix
            in="shadowOffsetOuter1"
            result="shadowMatrixOuter1"
            values="0 0 0 0 0.447058824 0 0 0 0 0.635294118 0 0 0 0 0.435294118 0 0 0 0.3 0"
          ></feColorMatrix>
          <feMerge>
            <feMergeNode in="shadowMatrixOuter1"></feMergeNode>
            <feMergeNode in="SourceGraphic"></feMergeNode>
          </feMerge>
        </filter>
      </defs>

      <path
        fill="#011133"
        strokeWidth="1"
        d="M102.5 98.3v131.1h98.3V98.3h-98.3zM184.4 213h-65.5v-98.3h65.5V213z"
        filter="url(#c)"
      ></path>
      <path
        fill="#011133"
        strokeWidth="1"
        d="M233.5 98.3H348.2V114.69999999999999H233.5z"
        filter="url(#c)"
      ></path>
      <path
        fill="#011133"
        strokeWidth="1"
        d="M233.5 155.7H348.2V172.1H233.5z"
        filter="url(#c)"
      ></path>
      <path
        fill="#011133"
        strokeWidth="1"
        d="M233.5 213H348.2V229.4H233.5z"
        filter="url(#c)"
      ></path>
      <path
        fill="#011133"
        strokeWidth="1"
        d="M102.4 270.4H348.20000000000005V286.79999999999995H102.4z"
        filter="url(#c)"
      ></path>
      <path
        fill="#011133"
        strokeWidth="1"
        d="M102.4 327.7H290.9V344.09999999999997H102.4z"
        filter="url(#c)"
      ></path>
      <path
        fill="#011133"
        strokeWidth="1"
        d="M102.4 426.1H217.10000000000002V442.5H102.4z"
        filter="url(#c)"
      ></path>
      <path
        fill="#011133"
        strokeWidth="1"
        d="M491.9 225c-13.7-13.6-40.2-17.8-57.9 0l-36.6 36.6V49.2h-49.2V0H4.1v458.8h49.2V508h344.1V377.5l94.5-94.5c16-16 16-42 0-58zM53.3 442.5H20.5V16.4h311.4v32.8H53.3v393.3zm16.4 49.1V65.5H381V278L246.8 412.2l-14.5 72.4 72.4-14.5 76.2-76.3v97.8H69.7zM266 416.2l23.2-23.2 34.8 34.8-23.3 23.2-34.7-34.8zm18.1 41.3l-30.9 6.2 6.2-30.9 24.7 24.7zm51.4-41.3l-34.8-34.8 139-139.1 34.8 34.8-139 139.1zm149.6-151.7L452.5 232c9.1-4.1 20.6-2.6 27.8 4.7 7.6 7.5 9.1 18.7 4.8 27.8z"
        filter="url(#c)"
      ></path>
      <path
        fill="#011133"
        strokeWidth="1"
        d="M375.65 292.146H457.549V308.546H375.65z"
        transform="rotate(-45.001 416.598 300.353)"
        filter="url(#c)"
      ></path>
    </svg>
  );
};

const OperatorSvg = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0"
      y="0"
      width="120"
      height="150"
      version="1.1"
      viewBox="0 0 57 57"
      xmlSpace="preserve"
    >
      <defs>
        <filter
          id="b"
          width="109.3%"
          height="110.8%"
          filterUnits="objectBoundingBox"
        >
          <feOffset
            dx="1"
            dy="2"
            in="SourceAlpha"
            result="shadowOffsetOuter1"
          ></feOffset>
          <feColorMatrix
            in="shadowOffsetOuter1"
            result="shadowMatrixOuter1"
            values="0 0 0 0 0.447058824 0 0 0 0 0.635294118 0 0 0 0 0.435294118 0 0 0 0.3 0"
          ></feColorMatrix>
          <feMerge>
            <feMergeNode in="shadowMatrixOuter1"></feMergeNode>
            <feMergeNode in="SourceGraphic"></feMergeNode>
          </feMerge>
        </filter>
      </defs>
      <path
        fill="#011133"
        d="M52.3 29.4h.6c1.2 0 2.2-.7 2.6-1.8l1.3-3.2c.1-.3.2-.7.2-1.1v-10c0-1.6-1.3-2.8-2.9-2.9h-1.9c-1.2 0-2.3.8-2.7 1.9l-5.1-2.1c-.5-2.1-2.4-3.6-4.6-3.6-.8 0-1.6.2-2.4.7L20.9.2c-1.4-.6-3.1.1-3.7 1.5-.6 1.4.1 3.1 1.5 3.7l.3.2v20.1c-1.5.3-2.8 1.3-3.4 2.8h-3.3c-.8 0-1.6.4-2.1 1l-5.6 6.4c-.5.5-.7 1.2-.7 1.9v12.6h-1c-1.6 0-2.8 1.3-2.9 2.9v1C0 55.7 1.3 57 2.9 57h51.3c1.6 0 2.8-1.3 2.9-2.9v-1c0-1.6-1.3-2.8-2.9-2.9h-5.7v-1c0-1.6-1.3-2.8-2.9-2.9v-3.8h1.9v-1.9h-1.9v-1l-2.1-14.3h1.2v-1.9h-1.4L42 15.6c.1 0 .2-.1.2-.1l7.1 3v8.1c.1 1.6 1.4 2.8 3 2.8zm-1-16.1c0-.5.4-1 1-1h1.9c.5 0 1 .4 1 1v10.1c0 .1 0 .2-.1.4L53.8 27c-.1.4-.5.6-.9.6h-.6c-.5 0-1-.4-1-1V13.3zm-8.5-1.9c0 1.6-1.3 2.9-2.9 2.9-1.6 0-2.9-1.3-2.9-2.9s1.3-2.9 2.9-2.9c1.6 0 2.9 1.3 2.9 2.9zM18.9 2.5c.2-.5.8-.7 1.3-.5L36 8.7c-.4.5-.6 1.1-.7 1.7L19.4 3.7c-.5-.2-.7-.7-.5-1.2zm16.4 10c.3 1.3 1.2 2.5 2.5 3.1l-1.2 8.1h-1.4v1.9h1.2l-2.1 14.1v1.1h-1.9v1.9h1.9v3.8c-1.6 0-2.8 1.3-2.9 2.9v1h-7.6v-8.6h1.9a6.7 6.7 0 000-13.4h-1.4c-.6-1.4-1.9-2.4-3.4-2.8V6.4l14.4 6.1zM21.9 50.3H10.5V39.9c0-.5.4-1 1-1H21c.5 0 1 .4 1 1v10.4zM20 27.5c1.6 0 2.9 1.3 2.9 2.9 0 1.6-1.3 2.9-2.9 2.9-1.6 0-2.9-1.3-2.9-2.9 0-1.6 1.3-2.9 2.9-2.9zM5.7 37.8c0-.2.1-.5.2-.6l5.6-6.4c.2-.2.4-.3.7-.3h2.9c0 2.6 2.1 4.8 4.8 4.8s4.8-2.1 4.8-4.8h1c2.6 0 4.8 2.1 4.8 4.8 0 2.6-2.1 4.8-4.8 4.8h-1.9c0-1.6-1.3-2.8-2.9-2.9h-9.5c-1.6 0-2.8 1.3-2.9 2.9v10.5H5.7V37.8zm48.5 14.4c.5 0 1 .4 1 1v1c0 .5-.4 1-1 1H2.9c-.5 0-1-.4-1-1v-1c0-.5.4-1 1-1h51.3zm-7.6-2.8v1H33.3v-1c0-.5.4-1 1-1h11.4c.4 0 .9.5.9 1zm-2.9-2.9h-7.6v-3.8h7.6v3.8zm0-6.5v.9h-7.6V40l2.1-14.3h3.4L43.7 40zm-2.4-16.3h-2.8l1.1-7.6h.6l1.1 7.6zm2.5-9.6c.4-.5.6-1.1.7-1.7l4.8 2.1v2.1l-5.5-2.5z"
        filter="url(#b)"
      ></path>
    </svg>
  );
};

const SellersSvg = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="144"
      height="123"
      viewBox="0 0 144 123"
    >
      <defs>
        <filter
          id="a"
          width="109.3%"
          height="110.8%"
          x="-4.6%"
          y="-5.4%"
          filterUnits="objectBoundingBox"
        >
          <feOffset
            dx="3"
            dy="3"
            in="SourceAlpha"
            result="shadowOffsetOuter1"
          ></feOffset>
          <feColorMatrix
            in="shadowOffsetOuter1"
            result="shadowMatrixOuter1"
            values="0 0 0 0 0.447058824 0 0 0 0 0.635294118 0 0 0 0 0.435294118 0 0 0 0.3 0"
          ></feColorMatrix>
          <feMerge>
            <feMergeNode in="shadowMatrixOuter1"></feMergeNode>
            <feMergeNode in="SourceGraphic"></feMergeNode>
          </feMerge>
        </filter>
      </defs>
      <path
        fill="#011133"
        fillRule="evenodd"
        d="M21.293 48.075h23.26v35.53a178.983 178.983 0 00-23.26 6.044V48.075zM32.83 12.18c6.41 0 11.54 1.831 11.54 4.212v11.355H21.293V16.391c0-2.38 5.127-4.212 11.537-4.212zM21.293 44.412h23.26V31.41h-23.26v13.003zm37.728-2.93h29.301l8.608 9.523H50.413l8.608-9.523zm25.638 39.376V62.91c0-1.1-.73-1.832-1.831-1.832H64.515c-1.099 0-1.831.733-1.831 1.832v18.13c-5.13.366-10.073 1.099-14.652 1.831V54.668H99.13v28.388c-4.397-.916-9.34-1.832-14.47-2.198zm-3.663-.183c-1.646 0-3.296-.183-5.128-.183-3.294 0-6.41.183-9.521.366V64.74h14.65v15.934zm21.613-47.251c0-5.86 8.606-20.512 13.55-28.204 4.764 7.508 13.555 22.343 13.555 28.204 0 6.776-5.128 12.453-11.723 13.37V33.606l6.044-6.044c.735-.732.735-1.831 0-2.564-.73-.732-1.831-.732-2.562 0l-3.482 3.48v-8.242c0-1.099-.73-1.831-1.831-1.831-1.097 0-1.832.732-1.832 1.831v15.568l-3.477-3.48c-.733-.733-1.832-.733-2.564 0-.735.732-.735 1.831 0 2.564l6.041 6.044v5.86c-6.59-.916-11.719-6.593-11.719-13.37zm-89.19 85.71h.366c.915 0 1.646-.732 1.831-1.464 1.646-10.44 8.79-20.146 14.102-26.74 5.859-1.648 13.37-3.479 21.611-4.761-6.595 6.96-14.836 17.948-16.85 30.951-.182.916.55 2.015 1.466 2.015h.366c.916 0 1.648-.733 1.832-1.465 2.197-14.286 12.82-26.19 19.23-32.234 5.86-.732 11.904-1.098 18.314-1.098-7.144 6.959-16.483 18.68-18.68 32.782-.184.916.547 2.015 1.463 2.015h.368c.916 0 1.648-.733 1.831-1.465 2.38-15.018 13.553-27.106 20.327-33.332 5.313.183 10.44.915 15.386 2.014-6.96 7.509-14.834 18.498-16.85 30.768-.182.916.549 2.015 1.464 2.015h.367c.915 0 1.65-.733 1.831-1.465 2.017-12.27 10.441-23.26 17.399-30.402a164.853 164.853 0 0114.104 4.212c-5.313 6.96-11.172 15.934-12.64 25.64-.18.916.552 2.015 1.468 2.015h.364c.916 0 1.65-.733 1.832-1.465 1.467-9.157 7.325-17.948 12.638-24.908 4.76 1.832 16.573 7.51 19.688 9.157.182.183.548.183.916.183.733 0 1.282-.366 1.648-.915.55-.916.184-2.015-.732-2.381-3.482-1.832-16.025-7.692-21.52-9.89v-38.46c8.608-.916 15.385-8.241 15.385-17.032S119.64 3.388 118.176.824c-.732-1.099-2.382-1.099-3.113 0-1.65 2.381-15.567 23.809-15.567 32.6 0 8.79 6.776 16.116 15.382 17.032v36.995c-3.478-1.282-7.326-2.38-11.353-3.48V52.837c0-.55-.185-.916-.551-1.282 0 0 0-.183-.182-.183L91.07 38.369c-.364-.367-.915-.55-1.28-.55H59.021c-.551 0-1.099.183-1.284.55l-8.789 9.706V16.391c0-5.494-7.694-7.875-15.203-7.875-7.507 0-16.114 2.381-16.114 7.875v74.54c-2.564.915-16.394 8.058-16.575 8.058-.916.366-1.282 1.465-.916 2.38.367.917 1.466 1.283 2.381.917 0 0 15.657-7.692 20.97-9.524-4.945 6.593-10.073 15.018-11.538 24.175-.185 1.099.55 2.015 1.465 2.198z"
        filter="url(#a)"
      ></path>
    </svg>
  );
};

const RenderSignUpControls = () => {
  const localClass = localStyles();
  const [, setStateApp] = useContext(AppContext);

  return (
    <>
      <div>
        <Typography className={localClass.headerWords}>
          Don't have an account?
        </Typography>
        {/* <Typography className={localClass.smallerWords}>
          Select your role to learn more now
        </Typography> */}
      </div>

      <div className={localClass.cardContainer}>
        <div className={localClass.signInCardContainer}>
          <Paper
            elevation={0}
            square={true}
            color="secondary"
            className={localClass.signInCard}
          >
            <div>
              <div
                style={{
                  marginTop: "20px",
                  marginBottom: "15px",
                }}
              >
                <SellersSvg />
              </div>

              <div
                className={localClass.cardTitle}
                style={{
                  color: "#011133",
                  fontSize: "24px",
                }}
              >
                LANDOWNERS
              </div>
            </div>
            <div className={localClass.cardInputs}>
              <Typography
                style={{
                  textAlign: "center",
                  color: "#011133",
                  padding: "11%",
                }}
              >
                For owners and sellers of royalties or minerals looking to learn
                more about what they own
              </Typography>
            </div>
            <Link
              // to="/signup"
              // onClick={() => {
              //   setStateApp((stateApp) => ({
              //     ...stateApp,
              //     signUpUserType: "LandOwner",
              //   }));
              // }}
            >
              <Button
                variant="outlined"
                disableElevation
                diabled
                type="submit"
                className={localClass.buttonLower}
              >
                COMING SOON
              </Button>
            </Link>
          </Paper>
        </div>

        <div className={localClass.signInCardContainer}>
          <Paper
            elevation={0}
            square={true}
            color="secondary"
            className={localClass.signInCard}
          >
            <div>
              <div
                style={{
                  marginTop: "20px",
                  marginLeft: "20px",
                  marginBottom: "20px",
                }}
              >
                <BuyersSvg />
              </div>
              <div
                className={localClass.cardTitle}
                style={{
                  color: "#011133",
                  fontSize: "24px",
                }}
              >
                MINERAL BUYERS
              </div>
            </div>
            <div className={localClass.cardInputs}>
              <Typography
                style={{
                  textAlign: "center",
                  color: "#011133",
                  padding: "10%",
                }}
              >
                For buyers seeking potential deals and to streamline acquisition
                workflows
              </Typography>
            </div>
            <Link
              to="/signup"
              onClick={() => {
                setStateApp((stateApp) => ({
                  ...stateApp,
                  signUpUserType: "MineralBuyer",
                }));
              }}
            >
              <Button
                variant="contained"
                disableElevation
                className={localClass.buttonLower}
              >
                LEARN MORE
              </Button>
            </Link>
          </Paper>
        </div>

        <div className={localClass.signInCardContainer}>
          <Paper
            id="op_card"
            elevation={0}
            square={true}
            color="secondary"
            className={localClass.signInCard}
          >
            <div>
              <div
                style={{
                  marginTop: "5px",
                  marginBottom: "5px",
                }}
              >
                <OperatorSvg />
              </div>
              <div
                className={localClass.cardTitle}
                style={{
                  color: "#011133",
                  fontSize: "24px",
                }}
              >
                OPERATORS
              </div>
            </div>
            <div className={localClass.cardInputs}>
              <Typography
                style={{
                  textAlign: "center",
                  color: "#011133",
                  padding: "10%",
                }}
              >
                For exploration and production companies seeking to streamline land acquisition
              </Typography>
            </div>
            <Link
              to="/signup"
              onClick={() => {
                setStateApp((stateApp) => ({
                  ...stateApp,
                  signUpUserType: "Operator",
                }));
              }}
            >
              <Button
                id="op_button"
                variant="contained"
                disableElevation
                className={localClass.buttonLower}
              >
                LEARN MORE
              </Button>
            </Link>
          </Paper>
        </div>
      </div>
    </>
  );
};

export default RenderSignUpControls;
