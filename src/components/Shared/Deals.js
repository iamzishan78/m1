import React, { useState, useEffect, useContext } from "react";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
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
import { AppContext } from "../../AppContext";
import { TransactContext } from "../Transact/TransactContext";
import { UPDATETRANSACTION } from "../../graphQL/useMutationUpdateTransaction";
import { TRANSACTIONDATA } from "../../graphQL/useQueryTransactionData";
import Dialog from "../Transact/components/dialog";

const useStyles = makeStyles((theme) => ({
  root: {
    // backgroundColor: "#fff",
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
  dealTitle: {
    cursor: "pointer",
    "&:hover": {
      fontWeight: "bold",
      textDecoration: "underline",
    },
  },
}));

let formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function Deals({ contact, ...props }) {
  const [wonDeals, setWonDeals] = useState([]); // deal closed
  const [lostDeals, setLostDeals] = useState([]); // deal rejected
  const [activeDeals, setActiveDeals] = useState([]); // all other deals
  const [allDeals, setAllDeals] = useState([]); // all other deals
  const [updateTransaction] = useMutation(UPDATETRANSACTION);
  const [stateApp, setStateApp] = useContext(AppContext);
  const [getTransactionData, { data, loading }] = useLazyQuery(TRANSACTIONDATA);
  // const [stateTransact, setStateTransact] = useContext(TransactContext);

  useEffect(() => {
    if (stateApp.user && stateApp.user.mongoId) {
      console.log(stateApp.user);
      getTransactionData({
        variables: {
          userId: stateApp.user.mongoId,
        },
      });
    }
  }, [stateApp.user]);

  const classes = useStyles();
  const stringData = JSON.stringify(data);

  useEffect(() => {
    if (
      !loading &&
      data?.transactionData?.allData?.lanes &&
      data.transactionData.allData.lanes.length > 0
    ) {
      const lanes = data?.transactionData?.allData?.lanes;

      // get all deals
      const all = [];
      lanes.forEach((deal) => {
        deal.cards.forEach((card) => {
          if (contact?._id === card.contactId) all.push(card);
        });
      });
      console.log("all: ", all);
      setAllDeals(all);
    }
  }, [contact, stringData, data, loading]);

  useEffect(() => {
    let lost = [];
    let won = [];
    let others = [];
    allDeals.forEach((card) => {
      if (card.laneId === "lane5") lost.push(card);
      else if (card.laneId === "lane4") won.push(card);
      else others.push(card);
    });

    setWonDeals(won);
    setLostDeals(lost);
    setActiveDeals(others);
  }, [allDeals]);

  const getDealStatus = (laneId) => {
    if (laneId === "lane5") return "Lost";
    else if (laneId === "lane4") return "Won";
    else return "Active";
  };

  const sumOpenDeals = () => {
    let sum = 0;
    activeDeals.forEach(
      (card) =>
        (sum += parseFloat(card.label.split("$").join("").split(",").join("")))
    );
    const formatted = formatter.format(sum);
    return formatted.slice(0, formatted.length - 3);
  };

  const sumWonDeals = () => {
    let sum = 0;
    wonDeals.forEach(
      (card) =>
        (sum += parseFloat(card.label.split("$").join("").split(",").join("")))
    );
    const formatted = formatter.format(sum);
    return formatted.slice(0, formatted.length - 3);
  };

  const handleDataChange = (newData) => {
    if (data?.transactionData?._id) {
      updateTransaction({
        variables: {
          transactionId: data.transactionData._id,
          transaction: { allData: newData, user: stateApp.user.mongoId },
        },
        refetchQueries: ["getTransactionData", "getContact", "getContacts"],
        awaitRefetchQueries: true,
      });
    }
  };

  const handleOpenDialog = (deal) => {
    const laneId = deal ? deal.laneId : null;
    const cardId = deal ? deal.id : null;

    setStateApp((stateApp) => ({
      ...stateApp,
      dealDialog: true,
      activeDeal: {
        laneId,
        cardId,
      },
    }));
  };

  return (
    !loading && (
      <div className={classes.root} variant="outlined">
        <Dialog
          transactData={data?.transactionData?.allData}
          handleDataChange={handleDataChange}
          selectRowOpenContact={props.selectRowOpenContact}
          contact={contact}
        />
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
                onClick={handleOpenDialog}
                // gutterBottom
              >
                Add Deal
              </Button>
            </Grid>
          </Grid>
        </CardActions>
        {allDeals && allDeals.length > 0 ? (
          <CardContent>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <div
                style={{
                  textAlign: "center",
                }}
              >
                <Typography variant="h5">{sumOpenDeals()}</Typography>

                <Typography variant="caption" gutterBottom>
                  {activeDeals.length} Open Deals
                </Typography>
              </div>
              <div style={{ textAlign: "center" }}>
                <Typography variant="h5">{sumWonDeals()}</Typography>

                <Typography variant="caption" gutterBottom>
                  {wonDeals.length} Won Deals
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
                {allDeals.map((deal) => (
                  <TableRow key={deal.id}>
                    <TableCell
                      component="th"
                      scope="row"
                      className={classes.dealTitle}
                      onClick={() => handleOpenDialog(deal)}
                    >
                      {deal.title}
                    </TableCell>
                    <TableCell>{deal.label}</TableCell>
                    <TableCell>{getDealStatus(deal.laneId)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        ) : (
          <CardContent>No deals found</CardContent>
        )}
      </div>
    )
  );
}
