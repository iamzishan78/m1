import React from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/styles";
import { Typography, IconButton, Grid, Breadcrumbs } from "@material-ui/core";
import { NavigateNext as NavigateNextIcon, Close as CloseIcon } from "@material-ui/icons";
import Link from "@material-ui/core/Link";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    backgroundColor: "#f3f3f3",
    width: "100%",
  },
  navSection: {
    minHeight: 56,
    padding: "10px 20px",
    backgroundColor: "#fff",
  },
}));

export default function DetailComponents(props) {
  const history = useHistory();
  const classes = useStyles(props);
  const { title } = props;

  const { activeModule } = useSelector(({ Revenue }) => Revenue);

  return (
    <div className={classes.root}>
      {/**
       * Detail Header
       */}
      <div className={classes.navSection}>
        <Grid container alignItems="center" direction="row" display="flex" justify="space-between">
          <Grid item>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
              <Link
                style={{ marginLeft: "5px", fontSize: "16px", cursor: "pointer", fontWeight: "bold" }}
                color="inherit"
                onClick={() => history.push("/revenue/statements")}
              >
                {activeModule.title}
              </Link>
              <Typography style={{ color: "#18AADD", fontSize: "16px", marginLeft: "5px" }}>{title}</Typography>
            </Breadcrumbs>
          </Grid>
          <Grid item>
            <IconButton onClick={() => history.push("/revenue/statements")}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Grid>
        </Grid>
      </div>
      {props.children}
    </div>
  );
}
