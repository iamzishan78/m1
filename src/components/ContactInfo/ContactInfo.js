import React, { useContext, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppContext } from "../../AppContext";
import { Grid } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Comments from "../Shared/Comments";
import Tags from "../Shared/Tagger";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  Contacts: {
    color: "#011133",
    "&:hover": {
      cursor: "pointer",
      color: "rgb(18, 150, 194)"
    }
  },
  paper: {
    height: "100%",
    marginLeft: "6px"
  },
  topBar: {
    color: "#12ABE0",
    backgroundColor: "rgb(239,239,239)",
    margin: "0 !important",
    paddingLeft: "10px !important",
    paddingTop: "15px",
    paddingBottom: "15px"
  },
  border: {
    borderBottom: "solid 1px rgb(212, 227, 247)",
    borderLeft: "solid 1px rgb(212, 227, 247)"
  },
  rightColumnGrid: {
    paddingTop: "5px",
    width: "100%"
  },
  dataSect: {
    color: "#595959",
    width: "100%",
    "& p": {
      marginLeft: "15px",
      wordWrap: "break-word"
    },
    "& .dataLabels": {
      fontWeight: "bold"
    }
  },
  pDealCard: {
    fontWeight: "bold !important",
    marginTop: "7 !important",
    marginBottom: "7!important"
  },
  divDealCard: {
    padding: "11px",
    paddingLeft: "15px",
    paddingRight: "15px"
  },
  userIcon: {
    backgroundColor: "#BBF4D6",
    width: "80px",
    height: "80px",
    margin: "20px",
    display: "inline-block",
    verticalAlign: "middle",
    borderRadius: "100%",
    fontFamily: "Helvetica, Arial, sans-serif",
    float: "left"
  },
  userIconText: {
    whiteSpace: "nowrap",
    verticalAlign: "middle",
    color: "#595959",
    textAlign: "center"
  },
  userName: {
    color: "#595959",
    minWidth: "50%",
    float: "left"
  },
  tags: {
    "& fieldset": {
      border: "1px solid rgba(32, 32, 32, 0)"
    }
  }
}));

export default function Contacts() {
  const classes = useStyles();
  let history = useHistory();
  const [stateApp] = useContext(AppContext);

  const ContactExample = {
    id: "1234",
    name: "James",
    lastName: "Sampleton",
    account: "Widgetz.io (sample)",
    email: "jamessampleton@gmail.com",
    asignedTo: "Jacob Avery",
    workPhone: "(473)-160-8265",
    mobilePhone: "1-926-555-9503",
    jobTitle: "CEO",
    department: "Engineering",
    status: "Qualified Lead",
    doNotDisturb: "No",
    address: "1552 camp st",
    zipcode: 92093,
    openDealsAmount: "7000",
    createAt: "11 days ago"
  };

  return (
    <Grid container spacing={0} style={{ height: "100%" }}>
      <Grid item xs={9}>
        <h3 className={`${classes.topBar} ${classes.border}`}>
          <span
            className={classes.Contacts}
            onClick={event => {
              history.push("/contacts");
            }}
          >
            Contacts
          </span>
          {` > ${ContactExample.name} ${ContactExample.lastName}`}
        </h3>
        <Grid item container>
          <Grid item xs={12} className={classes.border}>
            <div>
              <div className={classes.userIcon}>
                <h1 className={classes.userIconText}>
                  {`${ContactExample.name[0]}${ContactExample.lastName[0]}`}
                </h1>
              </div>
              <div className={classes.userName}>
                <h2>{`${ContactExample.name} ${ContactExample.lastName}`}</h2>
                <h4>
                  {`${ContactExample.jobTitle} - ${ContactExample.account}`}
                </h4>
              </div>
            </div>
            <div className={classes.tags}>
              <Tags
                public={false}
                source={stateApp.user}
                sourceLabel="user"
                sourceSourceId={stateApp.user.id}
                sourceName={stateApp.user.name}
                target={ContactExample}
                targetLabel={"contact"}
                targetSourceId={ContactExample.id}
                targetName={ContactExample.name}
              />
            </div>
          </Grid>
          <Grid
            item
            xs={12}
            container
            className={`${classes.border} ${classes.dataSect}`}
            spacing={1}
          >
            <Grid item xs={3}>
              <p className="dataLabels">Email</p>
            </Grid>
            <Grid item xs={3}>
              <p>{ContactExample.email}</p>
            </Grid>

            <Grid item xs={3}>
              <p className="dataLabels">Assigned To</p>
            </Grid>
            <Grid item xs={3}>
              <p>{ContactExample.asignedTo}</p>
            </Grid>

            <Grid item xs={3}>
              <p className="dataLabels">Mobile Phone</p>
            </Grid>
            <Grid item xs={3}>
              <p>{ContactExample.mobilePhone}</p>
            </Grid>

            <Grid item xs={3}>
              <p className="dataLabels">Work Phone</p>
            </Grid>
            <Grid item xs={3}>
              <p>{ContactExample.workPhone}</p>
            </Grid>

            <Grid item xs={3}>
              <p className="dataLabels">Address</p>
            </Grid>
            <Grid item xs={3}>
              <p>{ContactExample.address}</p>
            </Grid>

            <Grid item xs={3}>
              <p className="dataLabels">Zipcode</p>
            </Grid>
            <Grid item xs={3}>
              <p>{ContactExample.zipcode}</p>
            </Grid>

            <Grid item xs={3}>
              <p className="dataLabels">Job Title</p>
            </Grid>
            <Grid item xs={3}>
              <p>{ContactExample.jobTitle}</p>
            </Grid>

            <Grid item xs={3}>
              <p className="dataLabels">Department</p>
            </Grid>
            <Grid item xs={3}>
              <p>{ContactExample.department}</p>
            </Grid>

            <Grid item xs={3}>
              <p className="dataLabels">Status</p>
            </Grid>
            <Grid item xs={3}>
              <p>{ContactExample.status}</p>
            </Grid>

            <Grid item xs={3}>
              <p className="dataLabels">Do not disturb</p>
            </Grid>
            <Grid item xs={3}>
              <p>{ContactExample.doNotDisturb}</p>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid className={classes.border} style={{ height: "100%" }} item xs={3}>
        <div>
          <Grid container className={classes.rightColumnGrid} spacing={1}>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <div className={classes.divDealCard}>
                  <p className={classes.pDealCard}>
                    Add a deal for this contact?
                  </p>
                  <Button variant="contained" color="secondary">
                    Add Deal
                  </Button>
                </div>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Comments
                  targetLabel="contact"
                  targetSourceId={ContactExample.id}
                  targetName={ContactExample.name}
                />
              </Paper>
            </Grid>
          </Grid>
        </div>
      </Grid>
    </Grid>
  );
}
