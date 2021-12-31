import React from "react";
import { makeStyles } from "@material-ui/styles";

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
      <div className={classes.root}>Will be working on it!!</div>
    </NavHeader>
  );
}
