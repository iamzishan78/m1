import React from "react";
import { makeStyles } from "@material-ui/styles";
import { Grid, Button } from "@material-ui/core";

import NavHeader from "components/Revenue/components/Common/NavHeader";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3)
  }
}));

export default function LineItem(props) {
  const classes = useStyles();

  return (
    <NavHeader title="94782044-EXXON MOBIL CORP">
      <div className={classes.root}>
        <Grid container display="flex" direction="row" alignItems="center" justify="space-between">
          <Grid item>
            <Button variant="outlined">Input Mode</Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary">Input Mode</Button>
          </Grid>
        </Grid>
      </div>
    </NavHeader>
  );
}
