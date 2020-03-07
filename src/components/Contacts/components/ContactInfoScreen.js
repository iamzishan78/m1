import React, { useContext, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppContext } from "../../../AppContext";
import { Container, Grid } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Comments from "../../Shared/Comments";
import Tags from "../../Shared/Tagger";

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
  const [stateApp, setStateApp] = useContext(AppContext);

  const ContactExample = {
    basic: {
      id: "1234",
      name: "James",
      lastName: "Sampleton",
      accounts: ["Widgetz.io (sample)"],
      emails: ["jamessampleton@gmail.com"],
      salesOwner: "Jacob Avery",
      phones: [
        { id: "Work", phone: "(473)-160-8265" },
        { id: "Mobile", phone: "1-926-555-9503" }
      ]
    },
    others: {
      jobTitle: "CEO",
      department: "Engineering",
      status: "Qualified Lead",
      doNotDisturb: "No",
      addres: "1552 camp st",
      zipcode: 92093,
      openDealsAmount: "$ 7,000.00",
      createAt: "11 days ago"
    }
  };

  return (
    <Grid container spacing={0} style={{ height: "100%" }}>
      <Grid item xs={9}>
        <h3 className={`${classes.topBar} ${classes.border}`}>
          <span
            className={classes.Contacts}
            onClick={event => {
              event.preventDefault();
              setStateApp(stateApp => ({
                ...stateApp,
                selectedContact: null
              }));
            }}
          >
            Contacts
          </span>
          {` > ${ContactExample.basic.name} ${ContactExample.basic.lastName}`}
        </h3>
        <Grid item container>
          <Grid item xs={12} className={classes.border}>
            <div>
              <div className={classes.userIcon}>
                <h1 className={classes.userIconText}>
                  {`${ContactExample.basic.name[0]}${ContactExample.basic.lastName[0]}`}
                </h1>
              </div>
              <div className={classes.userName}>
                <h2>
                  {`${ContactExample.basic.name} ${ContactExample.basic.lastName}`}
                </h2>
                <h4>
                  {`${ContactExample.others.jobTitle} - ${ContactExample.basic.accounts[0]}`}
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
              <p className="dataLabels">Emails</p>
            </Grid>
            <Grid item xs={3}>
              <p>
                {ContactExample.basic.emails.map(email => {
                  return `${email} `;
                })}
              </p>
            </Grid>

            <Grid item xs={3}>
              <p className="dataLabels">Sales owner</p>
            </Grid>
            <Grid item xs={3}>
              <p>{ContactExample.basic.salesOwner}</p>
            </Grid>

            {ContactExample.basic.phones.map(each => {
              return (
                <Grid container item xs={6}>
                  <Grid item xs={6}>
                    <p className="dataLabels">{each.id}</p>
                  </Grid>
                  <Grid item xs={6}>
                    <p>{each.phone}</p>
                  </Grid>
                </Grid>
              );
            })}

            <Grid item xs={3}>
              <p className="dataLabels">Addres</p>
            </Grid>
            <Grid item xs={3}>
              <p>{ContactExample.others.addres}</p>
            </Grid>

            <Grid item xs={3}>
              <p className="dataLabels">Zipcode</p>
            </Grid>
            <Grid item xs={3}>
              <p>{ContactExample.others.zipcode}</p>
            </Grid>

            <Grid item xs={3}>
              <p className="dataLabels">Job Title</p>
            </Grid>
            <Grid item xs={3}>
              <p>{ContactExample.others.jobTitle}</p>
            </Grid>

            <Grid item xs={3}>
              <p className="dataLabels">Department</p>
            </Grid>
            <Grid item xs={3}>
              <p>{ContactExample.others.department}</p>
            </Grid>

            <Grid item xs={3}>
              <p className="dataLabels">Status</p>
            </Grid>
            <Grid item xs={3}>
              <p>{ContactExample.others.status}</p>
            </Grid>

            <Grid item xs={3}>
              <p className="dataLabels">Do not disturb</p>
            </Grid>
            <Grid item xs={3}>
              <p>{ContactExample.others.doNotDisturb}</p>
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
                <Comments />
              </Paper>
            </Grid>
          </Grid>
        </div>
      </Grid>
    </Grid>
  );
}
