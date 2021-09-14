import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, FormControl, TextField, Select } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  basicInfoRoot: {
    padding: "25px",
    "& .MuiInputBase-root": {
      height: "40px !important",
      "& .MuiSelect-root": {
        backgroundColor: "transparent",
      },
    },
  },
  stickyHeader: {
    padding: "25px",
  },
  panelInfo: {
    padding: "25px",
  },
  label: {
    margin: "15px 0px 0px",
  },
  formControl: {
    minWidth: "100%",
    maxHeight: "45px",
    marginBottom: 0,
  },
}));

const BasicInfo = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.basicInfoRoot}>
      <Grid container display="flex" alignItems="center">
        <Grid item xs={12}>
          <h3 className={classes.label}>Flowline Name</h3>
          <TextField margin="dense" variant="outlined" placeholder="Click to enter deal name" required fullWidth />
        </Grid>
        <Grid item xs={12}>
          <h3 className={classes.label}>Project Tie</h3>
          <FormControl variant="outlined" className={classes.formControl}>
            <Select
              native
              //   onChange={handleChange}
            >
              <option value={0}>Project A</option>
              <option value={1}>Project B</option>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <h3 className={classes.label}>Flow Milestone Date</h3>
          <FormControl variant="outlined" className={classes.formControl}>
            <Select
              native
              //   onChange={handleChange}
            >
              <option value={0}>Project A</option>
              <option value={1}>Project B</option>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <h3 className={classes.label}>Detail Card Section</h3>
          <FormControl variant="outlined" className={classes.formControl}>
            <Select
              native
              //   onChange={handleChange}
            >
              <option value={0}>Project A</option>
              <option value={1}>Project B</option>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <h3 className={classes.label}>Flow Status</h3>
          <FormControl variant="outlined" className={classes.formControl}>
            <Select
              native
              defaultValue={-1}
              //   onChange={handleChange}
            >
              <option value={0}>Won</option>
              <option value={1}>Lost</option>
              <option value={2}>Passed</option>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </div>
  );
};

export default BasicInfo;
