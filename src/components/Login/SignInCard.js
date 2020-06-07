import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";
import { Card, Button } from "@material-ui/core";
import { AppContext } from "../../AppContext";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  select: {
    color: "white",
  },
  card: {
    width: "400px",
    height: "425px",
    backgroundColor: theme.palette.secondary.dark,
    backgroundColor: "#011133",
    fontFamily: theme.typography.fontFamily,
  },

  cardFooter: {
    paddingBottom: "0px",
    paddingTop: "45px",
    color: "white",
    fontSize: ".75rem",
    float: "left",
    marginLeft: "30px",
  },

  aadButton: {
    backgroundColor: "#e4a773",
    width: "125px",
    lineHeight: "1.4",
    marginTop: "35px",
    paddingTop: '12px',
    paddingBottom: '12px',
    color: "#011133",
    float: "left",
    marginLeft: "65px",
    "&:hover": {
      backgroundColor: "#f0cfb3",
    },
  },
  signupLink: {
    textDecoration: "none",
    color: theme.palette.secondary.main,
    cursor: "pointer",
    "&:hover": {
      color: "#e4a773",
    },
  },
  errorSection: {
    margin: "120px 65px 14px 65px",
    padding: "10px",
    color: "#E4A773",
    background: "#e4a77347",
    maxHeight: "90px",
    overflowY: "auto",
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
    backgroundColor: theme.palette.common.white,
    border: "1px solid #ced4da",
    fontSize: 16,
    width: "250px",
    height: "25px",
    padding: "10px",
    marginTop: "10px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
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
  },
}))(InputBase);

const SignInCard = (props) => {
  const { handleAADSignIn } = props;

  const [, setStateApp] = useContext(AppContext);
  const classes = useStyles();
  const [tenant, setTenant] = useState("");
  const [error, setError] = useState(null);
  const [tenantFlags, setTenantFlags] = useState({
    error: false,
    placeholder: null,
    autoFocus: false,
  });

  const updateTenantFlags = (errorText) => {
    setTenantFlags({
      error: true,
      placeholder: "Please enter a valid name",
      autoFocus: true,
    });
    setTenant("");
    errorText ? setError(errorText) : setError(null);
  };

  const onEnterKey = (e) => {
    if (tenant.trim() === "") {
      updateTenantFlags();
    } else {
      if (e.keyCode === 13) {
        e.preventDefault();
        setError(null);
        handleAADSignIn(tenant, updateTenantFlags);
      }
    }
  };

  const signInAAD = () => {
    if (tenant.trim() === "") {
      updateTenantFlags();
    } else {
      setError(null);
      handleAADSignIn(tenant, updateTenantFlags);
    }
  };

  const renderAADButtonAndLoader = props.ready ? (
    <CircularProgress color="secondary" size={28} className={classes.loader} />
  ) : (
    <Button
      variant="outlined"
      disableElevation
      type="submit"
      className={classes.aadButton}
      onClick={signInAAD}
      onKeyDown={(e) => onEnterKey(e)}
    >
      Sign In
    </Button>
  );

  return (
    <Card square={true} className={classes.card}>
      <div
        style={{
          marginTop: "75px",
          fontSize: "24px",
          fontWeight: "900",
          fontFamily: "Tahoma, Geneva, sans-serif",
          textAlign: "left",
          paddingLeft: "65px",
          color: "white",
        }}
      >
        Log in to the M1neral Platform
      </div>
      {!props.ready ? (
        <React.Fragment>
          <div
            style={{
              marginTop: "55px",
              fontSize: "14px",
              fontWeight: "900",
              fontFamily: "Tahoma, Geneva, sans-serif",
              color: "white",
              textAlign: "left",
              marginLeft: "65px",
            }}
          >
            Please enter your company domain name
          </div>
          <BootstrapInput
            error={tenantFlags.error}
            placeholder={tenantFlags.placeholder}
            autoFocus={tenantFlags.autoFocus}
            autoComplete="true"
            onKeyDown={(e) => onEnterKey(e)}
            onChange={(e) => setTenant(e.target.value)}
            onBlur={() => {
              setError(null);
              setTenantFlags({
                error: false,
                placeholder: null,
                autoFocus: false,
              });
            }}
            onClick={() => {
              setError(null);
            }}
            value={tenant}
          />
          {renderAADButtonAndLoader}
          {/* <div className={classes.cardFooter}>
            Don't have an account?
            <div>
              <Link
                to="/signup"
                className={classes.signupLink}
                onClick={() => {
                  setStateApp((stateApp) => ({
                    ...stateApp,
                    signUpUserType: null,
                  }));
                }}
              >
                Sign Up Here
              </Link>
            </div>
          </div>  */}
        </React.Fragment>
      ) : (
        <CircularProgress
          color="secondary"
          size={50}
          className={classes.loader}
        />
      )}
      {error && (
        <p id="errorSection" className={classes.errorSection}>
          {error}
        </p>
      )}
    </Card>
  );
};
export default SignInCard;
