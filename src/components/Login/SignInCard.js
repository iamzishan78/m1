import React, { useState } from "react";
import { Link } from "react-router-dom";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";
import { Card, Button } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  select: {
    color: "white",
  },
  card: {
    width: "425px",
    height: "500px",
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
    marginLeft: "35px",
  },

  aadButton: {
    backgroundColor: "#e4a773",
    width: "125px",
    lineHeight: "1.4",
    marginTop: "35px",
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
    width: "275px",
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
  const { handleAADSignIn, showForm } = props;

  const classes = useStyles();
  const [tenant, setTenant] = useState("");
  const [tenantFlags, setTenantFlags] = useState({
    error: false,
    placeholder: null,
    autoFocus: false,
  });

  const onEnterKey = (e) => {
    if (tenant.trim() === "") {
      setTenantFlags({
        error: true,
        placeholder: "Please enter a valid Tenant",
        autoFocus: true,
      });
    } else {
      if (e.keyCode === 13) {
        e.preventDefault();
        handleAADSignIn(tenant);
      }
    }
  };

  const signInAAD = () => {
    if (tenant.trim() === "") {
      setTenantFlags({
        error: true,
        placeholder: "Please enter a valid Tenant",
        autoFocus: true,
      });
    } else {
      handleAADSignIn(tenant);
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
      Sign In with Microsoft
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
        Sign in
      </div>
      {!props.ready ? (
        <React.Fragment>
          <div
            style={{
              marginTop: "65px",
              fontSize: "14px",
              fontWeight: "900",
              fontFamily: "Tahoma, Geneva, sans-serif",
              color: "white",
              textAlign: "left",
              marginLeft: "65px",
            }}
          >
            TENANT
          </div>
          <BootstrapInput
            error={tenantFlags.error}
            placeholder={tenantFlags.placeholder}
            autoFocus={tenantFlags.autoFocus}
            autoComplete="true"
            onKeyDown={(e) => onEnterKey(e)}
            onChange={(e) => setTenant(e.target.value)}
            onBlur={() => {
              setTenantFlags({
                error: false,
                placeholder: null,
                autoFocus: false,
              });
            }}
            value={tenant}
          />
          {renderAADButtonAndLoader}
          <div className={classes.cardFooter}>
            Don't have an account?
            <div>
              <Link
                className={classes.signupLink}
                onClick={() => {
                  showForm();
                }}
              >
                Sign Up Here
              </Link>
            </div>
          </div>
        </React.Fragment>
      ) : (
        <CircularProgress
          color="secondary"
          size={50}
          className={classes.loader}
        />
      )}
    </Card>
  );
};
export default SignInCard;
