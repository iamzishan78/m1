import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography, TextField } from "@material-ui/core";
import moment from "moment";

const useStyles = makeStyles(() => ({
  titleText: {
    textTransform: "uppercase",
    margin: "5px 16px 10px",
    fontWeight: "bold",
  },
  fieldsSection: {
    margin: "10px 0px",
  },
}));

export default function HeaderFunction(props) {
  const classes = useStyles();
  return (
    <div>
      <Typography varient="h5" className={classes.titleText}>
        Check Header
      </Typography>
      <Grid
        container
        direction="row"
        display="flex"
        justifyContent="flex-start"
        alignItems="center"
        spacing={3}
        className={classes.fieldsSection}
      >
        <Grid item xs={4}>
          {/* Check number */}
          <TextField
            margin="dense"
            type="text"
            variant="filled"
            label="Check Number"
            fullWidth
            value={props?.details?.checkNumber || ""}
          />
        </Grid>
        {/* Purchaser name */}
        <Grid item xs={4}>
          <TextField
            margin="dense"
            type="text"
            variant="filled"
            label="Purchaser Name"
            fullWidth
            value={props?.details?.payor?.name || ""}
          />
        </Grid>
        {/* Check date */}
        <Grid item xs={4}>
          <TextField
            margin="dense"
            type="text"
            variant="filled"
            label="Check Date"
            fullWidth
            value={moment.utc(props?.details?.checkDate).format("MM/DD/YYYY") || ""}
          />
        </Grid>
        {/* Owner number */}
        <Grid item xs={4}>
          <TextField
            margin="dense"
            type="text"
            variant="filled"
            label="Owner Number"
            fullWidth
            value={props?.details?.payee?.number || ""}
          />
        </Grid>
        {/* Owner name */}
        <Grid item xs={4}>
          <TextField
            margin="dense"
            type="text"
            variant="filled"
            label="Owner Name"
            fullWidth
            value={props?.details?.payee?.name || ""}
          />
        </Grid>
        {/* Deposit date */}
        <Grid item xs={4}>
          <TextField
            margin="dense"
            type="text"
            variant="filled"
            label="Deposit Date"
            fullWidth
            value={moment.utc(props?.details?.depositDate).format("MM/DD/YYYY") || ""}
          />
        </Grid>
      </Grid>
    </div>
  );
}