import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../../AppContext";
import { makeStyles } from "@material-ui/core/styles";
import { Card, Typography } from "@material-ui/core";
import NewUserCard from "./NewUserCard";
import styled from "styled-components";
import RenderSignUpControls from "./RenderSignUpControls";
import { Link } from "react-router-dom";


const localStyles = makeStyles((theme) => ({
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
    alignItems: "center",
    paddingBottom: "1%",
  },

  headerWords: {
    color: "#011133",
    display: "flex",
    justifyContent: "center",
    marginTop: "40px",
    marginBottom: "20px",
    fontSize: "48px",
    fontWeight: "900",
    fontFamily: "Tahoma, Geneva, sans-serif",
  },
  signUpSupportCard: {
    width: "500px",
    height: "735px",
    backgroundColor: "#e8eced",
    display: "flex",
    flexDirection: "column",
    fontFamily: theme.typography.fontFamily,
  },
  rootNewUser: {
    textAlign: "center",
    display: "flex",
    height: "100%",
    flexDirection: "column",
    "&::-webkit-scrollbar": {
      width: "0 !important",
    },
  },
  cardContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  link: {
    textDecoration: "none",
    color: theme.palette.secondary.main,
    cursor: "pointer",
    "&:hover": {
      color: "#e4a773",
    },
  },
  links: {
    marginTop: 10,
    marginBottom: 20,
    color: "#011133",
    },
  cardFooter: {
    height: "15%",
    color: "white",
    // fontSize: "1rem",
    // textAlign: "left",
    // marginLeft: "65px",
    marginTop: "110px",
    fontSize: "18px",
    fontFamily: "Tahoma, Geneva, sans-serif",
    textAlign: "left",
    paddingLeft: "65px",
    fontWeight: 600,
    // float: 'left'
  },
}));

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

const Login = (props) => {
  const [stateApp, setStateApp] = useContext(AppContext);
  const localClass = localStyles();
  const [signUpUserType, setSignUpUserType] = useState(stateApp.signUpUserType);

  useEffect(() => {
    setSignUpUserType(stateApp.signUpUserType);
  }, [stateApp.signUpUserType]);

  const handleNewUserSignUp = (userData) => {
    console.log("userData", userData);
  };

  const renderSignupNewCard = signUpUserType ? (
    <div style={{ marginBottom: "170px" }}>
      <div>
        <Typography
          variant="h4"
          style={{ marginBottom: "10px" }}
          className={localClass.headerWords}
        >
          {signUpUserType === "MineralBuyer"
            ? "Close more deals in far less time."
            : "Acquire smarter & eliminate wasted time."}
        </Typography>
      </div>

      <div>
        <Typography
          style={{
            margin: "auto",
            paddingBottom: "50px",
            maxWidth: "1050px",
            fontSize: "24px",
            fontFamily: "Tahoma, Geneva, sans-serif",
            color: "#011133",
          }}
        >
          {signUpUserType === "MineralBuyer"
            ? "M1neral's platform allows you to identify more opportunities, manage interactions with landowners, and streamline acquisition workflows all in a single location."
            : "M1neral offers an end-to-end acquisition workflow solution. Work with brokers and agents on single platform to see status and details of negotiation along the way."}
        </Typography>
      </div>

      <div className={localClass.cardContainer}>
        <NewUserCard
          className={localClass.newUser}
          handleNewUserSignUp={handleNewUserSignUp}
        />

        <Card
          elevation={0}
          square={true}
          color="secondary"
          className={localClass.signUpSupportCard}
        >
          <div>
            <Typography
              style={{
                marginTop: "75px",
                fontSize: "24px",
                fontWeight: "900",
                fontFamily: "Tahoma, Geneva, sans-serif",
                textAlign: "left",
                paddingLeft: "65px",
                paddingRight: "45px",
                color: "#011133",
              }}
            >
              Why M1neral?
            </Typography>
          </div>
          <div>
            <Typography
              style={{
                marginTop: "25px",
                fontSize: "18px",
                fontFamily: "Tahoma, Geneva, sans-serif",
                textAlign: "left",
                paddingLeft: "65px",
                paddingRight: "45px",
                color: "#011133",
                fontWeight: 600,
              }}
            >
              Connect the dots on a single platform.
            </Typography>
            <Typography
              style={{
                marginTop: "25px",
                fontSize: "18px",
                fontFamily: "Tahoma, Geneva, sans-serif",
                textAlign: "left",
                paddingLeft: "65px",
                paddingRight: "45px",
                color: "#011133",
              }}
            >
              Search across datasets such as production, ownership, and
              valuation in a single place. Quick and easy.
            </Typography>
          </div>

          <div>
            <Typography
              style={{
                marginTop: "25px",
                fontSize: "18px",
                fontFamily: "Tahoma, Geneva, sans-serif",
                textAlign: "left",
                paddingLeft: "65px",
                paddingRight: "45px",
                color: "#011133",
                fontWeight: 600,
              }}
            >
              Fit for purpose workflow tools.
            </Typography>
            <Typography
              style={{
                marginTop: "25px",
                fontSize: "18px",
                fontFamily: "Tahoma, Geneva, sans-serif",
                textAlign: "left",
                paddingLeft: "65px",
                paddingRight: "45px",
                color: "#011133",
              }}
            >
              Streamline your business process from deal sourcing to offer
              management to due-diligence with a built for purpose workflow
              solution.
            </Typography>
          </div>
          <div>
            <Typography
              style={{
                marginTop: "25px",
                fontSize: "18px",
                fontFamily: "Tahoma, Geneva, sans-serif",
                textAlign: "left",
                paddingLeft: "65px",
                paddingRight: "45px",
                color: "#011133",
                fontWeight: 600,
              }}
            >
              Support when you need it most.
            </Typography>
            <Typography
              style={{
                marginTop: "25px",
                fontSize: "18px",
                fontFamily: "Tahoma, Geneva, sans-serif",
                textAlign: "left",
                paddingLeft: "65px",
                paddingRight: "45px",
                color: "#011133",
              }}
            >
              We are here and ready to answer any questions you have along the
              way.
            </Typography>
          </div>

          <div className={localClass.cardFooter}>
          {/* <div>
            By signing up, you agree to the{" "}
            <a
              href="https://www.m1neral.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{marginLeft: '10px'}} 
              className={classes.link}
            >
              Terms and Conditions
            </a>
          </div> */}
          <div 
          
          className={localClass.links}>
            Already have an account?{" "}
            <Link
              to="/"
              style={{ marginLeft: "10px" }}
              className={localClass.link}
            >
              {" "}
              Sign In
            </Link>
          </div>
        </div>

        </Card>
      </div>
    </div>
  ) : (
    <RenderSignUpControls />
  );





  return (
    <div className={localClass.myRoot}>
      <div className={localClass.rootNewUser}>{renderSignupNewCard}</div>

      <div className={localClass.footer}>
        <div>
          <M1neralLogo2 />
        </div>

        <div
          style={{
            color: "#fff",
          }}
        >
          © 2020 M1neral, LLC. All Rights Reserved.
        </div>

        <div
          style={{
            color: "#fff",
          }}
        >
          {/* Terms of Service | Privacy Policy */}
        </div>
      </div>
    </div>
  );
};

export default Login;
