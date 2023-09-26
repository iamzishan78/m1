import React from "react";
import { Grid, TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  actionBar: {
    backgroundColor: "#f7f7f7",
    width: "100%",
    minHeight: "65px",
    marginTop: "25px",
    "& .MuiAutocomplete-root": {
      minWidth: "250px",
    },
  },
}));

const options = ["Unit NRA Calculation"];

const LastCheckDateFilter = ({ }) => {
  const classes = useStyles();

  return (
    <div className={classes.actionBar}>
      <Grid
        container
        alignItems="center"
        // justifyContent="space-between"
        spacing={2}
        style={{ padding: "12px 0px 0px 45px", width: "100%" }}
      >
        <Autocomplete
          size="small"
          onChange={(event, newValue) => {
            if (newValue === null) {
              //   handleDateTypeChange("This Month");
            } else {
              //   handleDateTypeChange(newValue);
            }
          }}
          options={options}
          renderInput={(params) => (
            <TextField {...params} label="" variant="outlined" placeholder="" style={{ backgroundColor: "white" }} />
          )}
          defaultValue={options[0]}
          disableListWrap
          id="custom-date-dropdown"
        />
      </Grid>
    </div>
  );
};

export default LastCheckDateFilter;
