import React, { useState, useContext, useEffect } from "react";
import { useLazyQuery, useApolloClient } from "@apollo/react-hooks";
import { AppContext } from "../../AppContext";
import {
  fade,
  ThemeProvider,
  withStyles,
  makeStyles,
  createMuiTheme,
} from '@material-ui/core/styles';
import ExpiredStorage from "expired-storage";
import { NavigationContext } from "../Navigation/NavigationContext";
import gql from "graphql-tag";
import SignInCard from "./SignInCard";
import { useHistory } from "react-router-dom";
import { Card, TextField, Button, Typography } from "@material-ui/core";
import NewUserCard from "./NewUserCard";
import Paper from '@material-ui/core/Paper';
import InputLabel from '@material-ui/core/InputLabel';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Link } from "react-router-dom";
import { validateData } from "./loginHelpers";
import InputBase from '@material-ui/core/InputBase';
import styled from "styled-components";


const localStyles = makeStyles(theme => ({
  myRoot: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  footer: {
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundColor: "#011133",
    display: "flex",
    flexDirection: "column",
    alignItems: 'center',
    paddingBottom: '1%'
  },
  headerWords: {
    color: "#011133",
    display: "flex",
    justifyContent: "center",
    marginTop:"40px",
    marginBottom: "20px",
    fontSize: '48px',
    fontWeight: '900',
    fontFamily: "Tahoma, Geneva, sans-serif",	
  },
  smallerWords: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
    fontSize: '24px',
    fontWeight: '900',
    fontFamily: "Tahoma, Geneva, sans-serif",	
  },
  conatiner: {
    paddingTop: 20,
    margin: "0 auto",
    height: "100%",
    justifyContent: "center"
  },
  signInCard: {
    width: '250px',
    height: '410px',
    marginBottom: 50,
    border: '1px solid #f0f4f5' ,
    fontFamily: theme.typography.fontFamily,
    "&:hover": {
      border: `3px solid #f0cfb3`,
    },
  },
  supportCard: {
    width: '500px',
    height: '500px',
    backgroundColor: '#e8eced',
    display: "flex",
    flexDirection: "column",
    fontFamily: theme.typography.fontFamily
  },
  signUpSupportCard: {
    width: '500px',
    height: '675px',
    backgroundColor: '#e8eced',
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
  },
  links: {
    marginTop: 10,
    marginBottom: 20
  },
  cardForm: {
    display: "contents",
    pointerEvents: "all"
  },
  rootNewUser: {
    textAlign: "center",
    display: "flex",
    height: "100%",
    flexDirection: "column",
    '&::-webkit-scrollbar': {
      width: '0 !important'
     },
  },
    cardContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  signInCardContainer: {
    paddingRight: 10,
    paddingLeft: 10
  },
  card: {
    width: "425px",
    height: "500px",
    backgroundColor: theme.palette.secondary.dark,
    backgroundColor: "#011133",
    fontFamily: theme.typography.fontFamily
  },

}));

const useStyles = makeStyles(theme => ({
  root: {
  },
  select: {
    color:'white'
  },
  card: {
    width: "425px",
    height: "500px",
    backgroundColor: theme.palette.secondary.dark,
    backgroundColor: "#011133",
    fontFamily: theme.typography.fontFamily
  },
  buttonLower: {
    backgroundColor: '#e4a773',
    color: "#011133",
    width: "150px",
    "&:hover" : {
      backgroundColor: '#f0cfb3',
    },
},
  inputs: {
    backgroundColor: theme.palette.background.paper,
    width: "80%",
    margin: "2% 10%",
  },
  cardFooter: {
    paddingBottom: "0px",
    paddingTop: "45px",
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontSize: ".75rem"
  },
  secondaryInputs: {
    paddingTop: "5px",
    fontSize: ".75rem",
    textAlign: "left",
    marginLeft: '65px',
  },
  button: {
    backgroundColor: '#e4a773',
    width: "100px",
    height: "50px",
    marginTop: "35px",
    color: "#011133",
    float: 'left',
    marginLeft: '60px',
    "&:hover" : {
      backgroundColor: '#f0cfb3',

    },
  },
  signupLink: {
    textDecoration: "none",
    color: theme.palette.secondary.main,
    cursor: "pointer",
    "&:hover" : {
      color: '#e4a773',
    }
  },
  passwordLink: {
    textDecoration: "none",
    color: theme.palette.secondary.main,
    cursor: "pointer",
    "&:hover" : {
      color: '#e4a773',
    }
  },
  cardFooter: {
    paddingBottom: "5px",
    paddingTop: "5px",
    color: "white",
    fontSize: ".75rem",
    //float: 'left',
    //marginLeft: '30px',

  },
 
}));



const BuyersSvg = props => {
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


const OperatorSvg = props => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0"
      y="0"
      width = "120"
      height = "150"
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


const SellersSvg = props => {
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


const M1neralLogoNavNoAuth = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 11320 2490"
    className={props.className}
  >
    <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
      <path
        fill="#12ABE0"
        d="M1396 1823c-201 202-528 202-729 0-15-15-30-31-43-48l-366 366c14 16 29 31 44 47 403 402 1056 402 1459 0 356-356 397-908 124-1309l-379 378c80 188 43 413-110 566zm-839-163c-80-188-43-413 110-566 201-201 528-201 729 0 16 15 30 32 43 48l366-366c-14-16-29-31-44-47L1032 0 302 729c-356 356-397 908-124 1309l379-378zm292-384c101-100 264-100 365 0 101 101 101 264 0 365s-264 101-365 0c-100-101-100-264 0-365z"
      ></path>
      <g transform="translate(2687 379)">
        <path
          fill="#12ABE0"
          d="M2703 1686L2703 64 2703 0 2505 64 2072 202 2132 432 2422 351 2422 1686z"
        ></path>
        <path fill="white" d="M8354 6L8354 1686 8633 1686 8633 6z"></path>
        <path
          fill="white"
          d="M1324 699c156 0 246 103 246 297v690h279V911c0-297-161-465-426-465-184 0-313 85-412 214-65-129-187-214-362-214-186 0-292 101-370 209V471H0v1215h279v-683c0-189 106-304 260-304s246 106 246 295v692h279v-686c0-195 108-301 260-301zM3099 471v1215h278v-686c0-188 113-301 274-301 166 0 260 108 260 297v690h279V913c0-283-159-467-433-467-189 0-301 99-380 214V471h-278zM5053 446c-347 0-594 285-594 633v4c0 376 272 631 624 631 223 0 382-90 497-228l-163-145c-97 95-194 145-329 145-180 0-320-110-350-308h893c2-28 5-53 5-79 0-349-196-653-583-653zm306 548h-624c26-189 145-320 316-320 184 0 290 140 308 320zM5916 471v1215h279v-462c0-323 170-481 414-481h16V448c-214-9-354 115-430 297V471h-279zM6759 1086c0 345 274 628 644 628 142 0 269-41 373-110v110h279V446h-279v107c-102-68-228-107-368-107-373 0-649 287-649 635v5zm649 386c-216 0-371-179-371-391v-5c0-211 143-386 366-386 219 0 373 177 373 391v5c0 209-142 386-368 386z"
        ></path>
      </g>
    </g>
  </svg>
);

const M1neralLogo2 = styled(M1neralLogoNavNoAuth)`
  width: 200px;
  padding-top: 50px;
  padding-bottom: 20px;
`;




const Login = props => {
  const [stateApp, setStateApp] = useContext(AppContext);
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [userName, setUserName] = useState(null);
  const [password, setPassword] = useState(null);
  const classes = useStyles();

  //const classes = useStyles();
  let history = useHistory();
  const localClass = localStyles();  
  const [showSignUp, setShowSignUp] = useState(false);
  const [tenant, setTenant] = useState("M1neral");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [emailFlags, setEmailFlags] = useState({
    error: false,
    placeholder: null,
    autoFocus: false
  });
  const [passwordFlags, setPasswordFlags] = useState({
    error: false,
    placeholder: null,
    autoFocus: false
  });

  useEffect(() => {}, [userEmail, userPassword]);


  



  const LOGINQUERY = gql`query {
    login(userName:"${userName}",password:"${password}",tenant:"${tenant}") {
      success
      message
      user {
        id
        email
        name
        authToken
        authTokenExpires
        tenant {
          id
          tenant
          graphQL
        }
        
      }
      
    }
  }`;

  const expiredStorage = new ExpiredStorage();
  const [login, { loading, data }] = useLazyQuery(LOGINQUERY);

  useEffect(() => {
    //on willmount if session is saved don't require login
    //let session = sessionStorage.getItem('user');
    const expiredStorage = new ExpiredStorage();
    let isExpired = expiredStorage.isExpired("user");
    if (!isExpired) {
      let user = expiredStorage.getItem("user");

      let sessionUser = JSON.parse(user);
      setStateApp(state => ({ ...state, user: sessionUser }));
      setStateNav(stateNav => ({ ...stateNav, defaultOn: true }))
    } else {
      setStateApp(state => ({ ...state, user: null }));
      setStateNav(stateNav => ({ ...stateNav, defaultOn: false }))
      expiredStorage.clear();
      history.push("/");
    }
  }, [history, setStateApp, setStateNav]);
 
  useEffect(() => {
    if (data) {
      //console.log('login success',data)
      if (data.login.success) {
        setStateApp(state => ({ ...state, user: data.login.user }));
        setStateNav(stateNav => ({ ...stateNav, defaultOn: true }))
        //window.sessionStorage.setItem('user', JSON.stringify(data.login.user));
        expiredStorage.setItem(
          "user",
          JSON.stringify(data.login.user),
          86400
        );
      } else {
        console.log("login failed", data);
        setStateApp(state => ({ ...state, user: null }));
        setStateNav(stateNav => ({ ...stateNav, defaultOn: false }))
        // window.sessionStorage.removeItem('user');
        expiredStorage.clear();
        //show login failed in the future
      }
    }
  }, [data, expiredStorage, setStateApp, setStateNav]);

  const handledSignIn = userData => {
    console.log("[Login.js] userData", userData);

    setUserName(userData.userEmail);
    setPassword(userData.userPassword);
    setTenant(userData.tenant);
    login();

  };

  
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





  const renderSignUpControls = !showSignUp ? (
    <>     
      <div>
      <Typography  className={localClass.headerWords}>
        Don't have an account? 
      </Typography>
      <Typography  className={localClass.smallerWords}>
        Sign up and get started today
      </Typography>
    </div>

      <div className={localClass.cardContainer}>
        <div className={localClass.signInCardContainer}>
        <Paper 
        elevation = {0}
        square={true}
        color="secondary" className={localClass.signInCard}>
          <div>
            <div  style={{
                marginTop: '20px',
                marginBottom: '15px'
            }}>
            <SellersSvg />
            </div>

            <div
              className={localClass.cardTitle}
              style={{ 
                color: "#011133", 
                fontSize: "24px"}}
            >
              LAND OWNERS
            </div>
          </div>
          <div className={localClass.cardInputs}>
            <Typography style={{ 
                  textAlign: "center", 
                  color: '#011133',
                  padding: "11%", 
                  }}>
              For owners and sellers of royalties or minerals looking to learn
              more about what they own
            </Typography>
          </div>
          <Button
            variant="outline"
            disableElevation
            type = 'submit'
            className={classes.buttonLower}
          >
            SIGN UP
          </Button>
        </Paper>
        </div>

        <div className={localClass.signInCardContainer}>
        <Paper 
        elevation = {0}
        square={true}
        color="secondary" className={localClass.signInCard}>
          <div>

          <div  style={{
                marginTop: '20px',
                marginLeft: '20px',
                marginBottom: '20px'
            }}>
            <BuyersSvg />
            </div>
            <div
              className={localClass.cardTitle}
              style={{ 
                color: "#011133", 
                fontSize: "24px" }}
            >
              MINERAL BUYERS
            </div>
          </div>
          <div className={localClass.cardInputs}>
            <Typography style={{ 
              textAlign: "center", 
              color: '#011133',
              padding: "10%" }}>
              For buyers seeking potential deals and to streamline acquisition
              workflows
            </Typography>
          </div>
          <Button
            variant="contained"
            disableElevation
            className={classes.buttonLower}
            onClick={showForm}
          >
            Sign Up
          </Button>
        </Paper>
        </div>

        <div className={localClass.signInCardContainer}>
        <Paper 
        id = "op_card"
        elevation = {0}
        square={true}
        color="secondary" className={localClass.signInCard}>
          <div>
          <div  style={{
                marginTop: '5px',
                marginBottom: '5px'
            }}>
            <OperatorSvg />
            </div>
            <div
              className={localClass.cardTitle}
              style={{ 
                color: "#011133", 
                fontSize: "24px" }}
            >
              OPERATORS
            </div>
          </div>
          <div className={localClass.cardInputs}>
            <Typography style={{ textAlign: "center", 
                                  color: '#011133',
                                  padding: "10%" }}>
              For operating companies looking to streamline
              land acquisition workflows
            </Typography>
          </div>
          
          <Button
            id = "op_button"
            variant="contained"
            disableElevation
            className={classes.buttonLower}
            onClick={showForm}
          >
            Sign Up
          </Button>
        </Paper>

        </div>


      </div>

    </>
  ) : (
    <div className={localClass.displaNone}></div>
  );




  const renderSignInControls = showSignUp ? (
    <>     
      <div>
      <Typography  className={localClass.headerWords}>
        Already have an account? 
      </Typography>
      <Typography  className={localClass.smallerWords}>
        Login to the Mineral Intelligence Platform
      </Typography>
    </div>

      <div className={localClass.cardContainer}>
        <div className={localClass.signInCardContainer}>
        <Paper 
        elevation = {0}
        square={true}
        color="secondary" className={localClass.signInCard}>
          <div>
            <div  style={{
                marginTop: '20px',
                marginBottom: '15px'
            }}>
            <SellersSvg />
            </div>

            <div
              className={localClass.cardTitle}
              style={{ 
                color: "#011133", 
                fontSize: "24px"}}
            >
              LAND OWNERS
            </div>
          </div>
          <div className={localClass.cardInputs}>
            <Typography style={{ 
                  textAlign: "center", 
                  color: '#011133',
                  padding: "11%", 
                  }}>
              For owners and sellers of royalties or minerals looking to learn
              more about what they own
            </Typography>
          </div>
          <Button
            variant="outline"
            disableElevation
            type = 'submit'
            className={classes.buttonLower}
          >
            SIGN IN
          </Button>
        </Paper>
        </div>

        <div className={localClass.signInCardContainer}>
        <Paper 
        elevation = {0}
        square={true}
        color="secondary" className={localClass.signInCard}>
          <div>

          <div  style={{
                marginTop: '20px',
                marginLeft: '20px',
                marginBottom: '20px'
            }}>
            <BuyersSvg />
            </div>
            <div
              className={localClass.cardTitle}
              style={{ 
                color: "#011133", 
                fontSize: "24px" }}
            >
              MINERAL BUYERS
            </div>
          </div>
          <div className={localClass.cardInputs}>
            <Typography style={{ 
              textAlign: "center", 
              color: '#011133',
              padding: "10%" }}>
              For buyers seeking potential deals and to streamline acquisition
              workflows
            </Typography>
          </div>
          <Button
            variant="contained"
            disableElevation
            className={classes.buttonLower}
            onClick={showForm}
          >
            Sign IN
          </Button>
        </Paper>
        </div>

        <div className={localClass.signInCardContainer}>
        <Paper 
        id = "op_card"
        elevation = {0}
        square={true}
        color="secondary" className={localClass.signInCard}>
          <div>
          <div  style={{
                marginTop: '5px',
                marginBottom: '5px'
            }}>
            <OperatorSvg />
            </div>
            <div
              className={localClass.cardTitle}
              style={{ 
                color: "#011133", 
                fontSize: "24px" }}
            >
              OPERATORS
            </div>
          </div>
          <div className={localClass.cardInputs}>
            <Typography style={{ textAlign: "center", 
                                  color: '#011133',
                                  padding: "10%" }}>
              For operating companies looking to streamline
              land acquisition workflows
            </Typography>
          </div>
          
          <Button
            id = "op_button"
            variant="contained"
            disableElevation
            className={classes.buttonLower}
            onClick={showForm}
          >
            Sign IN
          </Button>
        </Paper>

        </div>


      </div>

    </>
  ) : (
    <div className={localClass.displaNone}></div>
  );






  const renderSignupNewCard = showSignUp ? (
    <div>
    <div>
    <Typography variant="h4" style={{marginBottom: '10px'}} className={localClass.headerWords} >
      Close more deals in far less time. 
    </Typography>
    </div>

    <div>
    <Typography style={{ 
            marginTop: "5px", 
            marginBottom: '50px',
            fontSize: '24px',
            paddingLeft: '50px',
            paddingRight: '50px',
            fontFamily: "Tahoma, Geneva, sans-serif",
            // textAlign: 'left',
            // paddingLeft: '65px',
            // paddingRight: '45px',
            color: '#011133' ,
             }}>
      M1neral's platform allows you to identify more opportunities, manage interactions with 
      landowners, and streamline acquisition workflows all in a single location. 
      </Typography>
    </div>

    
    <div className={localClass.cardContainer}>

    <NewUserCard
      className={localClass.newUser}
      handleNewUserSignUp={handleNewUserSignUp}
    />




    <Card 
      elevation = {0}
      square={true}
      color="secondary" className={localClass.signUpSupportCard}>
      <div>
      <Typography style={{ 
            marginTop: "75px", 
            fontSize: '24px',
            fontWeight: '900',
            fontFamily: "Tahoma, Geneva, sans-serif",
            textAlign: 'left',
            paddingLeft: '65px',
            paddingRight: '45px',
            color: '#011133' 
            }}>
        Why M1neral? 
        </Typography>

      </div>
      <div>
      <Typography style={{ 
            marginTop: "25px", 
            fontSize: '18px',
            fontFamily: "Tahoma, Geneva, sans-serif",
            textAlign: 'left',
            paddingLeft: '65px',
            paddingRight: '45px',
            color: '#011133' ,            
            fontWeight: 600,
             }}>
        Connect the dots on a single platform. 
        </Typography>
        <Typography style={{ 
            marginTop: "25px", 
            fontSize: '18px',
            fontFamily: "Tahoma, Geneva, sans-serif",
            textAlign: 'left',
            paddingLeft: '65px',
            paddingRight: '45px',
            color: '#011133' ,
             }}>
        Search across datasets such as production, ownership, and valuation in a single place. Quick and easy. 
        </Typography>
      </div>

      <div>
      <Typography style={{ 
            marginTop: "25px", 
            fontSize: '18px',
            fontFamily: "Tahoma, Geneva, sans-serif",
            textAlign: 'left',
            paddingLeft: '65px',
            paddingRight: '45px',
            color: '#011133' ,
            fontWeight: 600,
             }}>
        Fit for purpose workflow tools. 
        </Typography>
        <Typography style={{ 
            marginTop: "25px", 
            fontSize: '18px',
            fontFamily: "Tahoma, Geneva, sans-serif",
            textAlign: 'left',
            paddingLeft: '65px',
            paddingRight: '45px',
            color: '#011133' 
             }}>
        Streamline your business process from deal sourcing to offer management
        to due-diligence with a built for purpose workflow solution. 
        </Typography>
      </div>
      <div>
      <Typography style={{ 
            marginTop: "25px", 
            fontSize: '18px',
            fontFamily: "Tahoma, Geneva, sans-serif",
            textAlign: 'left',
            paddingLeft: '65px',
            paddingRight: '45px',
            color: '#011133',
            fontWeight: 600,
             }}>
        Support when you need it most. 
        </Typography>
        <Typography style={{ 
            marginTop: "25px", 
            fontSize: '18px',
            fontFamily: "Tahoma, Geneva, sans-serif",
            textAlign: 'left',
            paddingLeft: '65px',
            paddingRight: '45px',
            color: '#011133' 
             }}>
        We are here and ready to answer any questions you 
        have along the way.  
        </Typography>
      </div>
      {/* <div>
      <Button
          variant="contained"
          disableElevation
          type="submit"
          style={{
            float: 'left',
            marginTop: "35px",
            marginLeft: '65px',
          }}
          color="secondary"
        >
          Contact Support
        </Button>
      </div> */}
    </Card>
    </div>

    </div>




  ) : (
    <div className={localClass.displaNone}></div>
  );















  const renderBody = !showSignUp ? (
    <>

      <div>
      <Typography variant="h4" className={localClass.headerWords}>
        Welcome back!
      </Typography>
      </div>


      <div className={localClass.cardContainer}>
        



      <SignInCard handleSignIn={handledSignIn} ready={loading} />

      
      <div>


      <Paper 
        elevation = {0}
        square={true}
      color="secondary" className={localClass.supportCard}>
        <div>
        <Typography style={{ 
              marginTop: "75px", 
              fontSize: '24px',
              fontWeight: '900',
              fontFamily: "Tahoma, Geneva, sans-serif",
              textAlign: 'left',
              paddingLeft: '65px',
              paddingRight: '45px',
              color: '#011133' 
              }}>
          Have questions about your account? Need help signing up? 
          </Typography>

        </div>
        <div>
        <Typography style={{ 
              marginTop: "25px", 
              fontSize: '18px',
              fontFamily: "Tahoma, Geneva, sans-serif",
              textAlign: 'left',
              paddingLeft: '65px',
              paddingRight: '45px',
              color: '#011133' 
               }}>
          Our support team is available and ready to help with any questions
          that you might have. 
          </Typography>
        </div>
        <div>
        <Button
            variant="contained"
            disableElevation
            type="submit"
            style={{
              float: 'left',
              marginTop: "35px",
              marginLeft: '65px',
            }}
            color="secondary"
          >
            Contact Support
          </Button>
        </div>
      </Paper>
      </div>
      </div>

      
    </>
  ) : (
    <div className={localClass.displaNone}></div>
  );



  

  const renderNoAcct = !showSignUp ? (
    <>


    </>
  ) : (
    <div className={localClass.displaNone}></div>
  );

  return (
      
    <div className={localClass.myRoot}>



      <div className={localClass.rootNewUser}>
        {renderBody}
        {renderSignupNewCard}
      </div>

      <div className={localClass.rootNewUser}>
        {renderSignUpControls}
        {renderSignInControls}

      </div>











      <div className={localClass.footer}>
        <div><M1neralLogo2/></div>

        <div style={{ 
                color: "#fff", 
                }}>
        © 2020 M1neral, LLC. All Rights Reserved.
        </div>

        <div style={{ 
                color: "#fff", 
                }}>
        Terms of Service | Privacy Policy
        </div>

        {/* <div style={{ 
                color: "#fff", 
                marginBottom: '50px',
                }}>
        Privacy Policy
        </div> */}

      </div>


    </div>
  );
};

export default Login;
