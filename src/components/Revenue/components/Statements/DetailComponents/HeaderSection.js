import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography, TextField } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  titleText: {
    textTransform: "uppercase",
    margin: "5px 16px 10px",
    color: "#5a5a5a",
  },
  fieldsSection: {
    margin: "10px 0px",
    "& .MuiInputBase-root": {
      borderRadius: "8px",
    },
  },
}));

export default function HeaderFunction(props) {
  const classes = useStyles();
  return (
    <div>
      <Typography varient="h5" className={classes.titleText}>
        Header
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
        <Grid item xs={3}>
          <TextField
            margin="dense"
            type="number"
            variant="outlined"
            label="Check Number"
            fullWidth
            InputProps={{
              classes: {
                root: classes.dateRoot,
              },
            }}
          />
        </Grid>
        <Grid item xs={5}>
          <TextField margin="dense" type="text" variant="outlined" label="Purchaser Name" fullWidth />
        </Grid>
        <Grid item xs={3}>
          <TextField
            margin="dense"
            type="date"
            variant="outlined"
            label="Check Date"
            placeholder=""
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField margin="dense" type="number" variant="outlined" label="Owner Number" fullWidth />
        </Grid>
        <Grid item xs={5}>
          <TextField margin="dense" type="text" variant="outlined" label="Owner Name" fullWidth />
        </Grid>
        <Grid item xs={3}>
          <TextField
            margin="dense"
            type="date"
            variant="outlined"
            label="Deposit Date"
            placeholder=""
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField margin="dense" type="number" variant="outlined" label="Check Amount" fullWidth />
        </Grid>
      </Grid>
    </div>
  );
}
