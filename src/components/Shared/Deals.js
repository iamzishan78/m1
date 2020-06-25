import React, { useState, useEffect, useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#fff",
  },
  timelineItemRight: {
    "&:before": {
      content: "none",
    },
  },

  timelineText: {
    "& .MuiTypography-body1": { fontSize: "0.85rem" },
    "& .MuiTypography-body2": { fontSize: "0.7rem" },
    "&  p": {
      margin: "0",
    },
  },
  blue: {
    color: theme.palette.secondary.main,
  },
  todayDot: {
    fontSize: "8px",
  },
}));

function createData(name, amount, status) {
  return { name, amount, status };
}

const rows = [
  createData("Johnson - 6 NRA", "$765,000", "Active"),
  createData("Johnson - 84 NRA", "$10,234.2043", "Lost"),
];

export default function Activities({
  contact,
  transactData,
  transactId,
  ...props
}) {
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [wonDeals, setWonDeals] = useState([]); // deal closed
  const [lostDeals, setLostDeals] = useState([]); // deal rejected
  const [activeDeals, setActiveDeals] = useState([]); // all other deals

  const classes = useStyles();
  console.log("CONTACT: ", contact);

  useEffect(() => {
    console.log("Transact data: ", transactData);
    if (transactData && transactData.lanes && transactData.lanes.length > 0) {
      const { lanes } = transactData;
      // get lost deals
      const lost = lanes.find((obj) => obj.title === "Offer Rejected")?.cards;

      if (lost && lost.length > 0) {
        let lostFiltered = [];
        lost.forEach((card) => {
          if (contact?._id === card.contactId) lostFiltered.push(card);
        });
        setLostDeals(lostFiltered);
      } else {
        setLostDeals([]);
      }

      // get won deals
      const won = lanes.find((obj) => obj.title === "Deal Closed")?.cards;

      if (won && won.length > 0) {
        let wonFiltered = [];
        won.forEach((card) => {
          if (contact?._id === card.contactId) wonFiltered.push(card);
        });
        setWonDeals(wonFiltered);
      } else {
        setWonDeals([]);
      }

      // get all other deals
      const otherDeals = lanes.filter(
        (obj) => obj.title !== "Deal Closed" && obj.title !== "Offer Rejected"
      );
      const otherDealCards = [];
      otherDeals.forEach((deal) => {
        deal.cards.forEach((card) => {
          if (contact?._id === card.contactId) otherDealCards.push(card);
        });
      });
      setActiveDeals(otherDealCards);
    }
  }, [contact, transactData, transactId]);

  console.log("WON: ", wonDeals);
  console.log("LOST: ", lostDeals);
  console.log("OTHER: ", activeDeals);

  return (
    <Card className={classes.root} variant="outlined">
      <CardActions>
        <Grid container justify="space-between">
          <Grid item>
            <Typography variant="button" gutterBottom>
              Deals
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setActivityModalOpen(true)}
              gutterBottom
            >
              Add Deal
            </Button>
          </Grid>
        </Grid>
      </CardActions>
      <CardContent>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <div
            style={{
              textAlign: "center",
            }}
          >
            <Typography variant="h5">$765,000</Typography>

            <Typography variant="caption" gutterBottom>
              1 Open Deals
            </Typography>
          </div>
          <div style={{ textAlign: "center" }}>
            <Typography variant="h5">$0</Typography>

            <Typography variant="caption" gutterBottom>
              0 Won Deals
            </Typography>
          </div>
        </div>
        <Table className={classes.table} size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Name</strong>
              </TableCell>
              <TableCell>
                <strong>Amount</strong>
              </TableCell>
              <TableCell>
                <strong>Status</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell>{row.amount}</TableCell>
                <TableCell>{row.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
