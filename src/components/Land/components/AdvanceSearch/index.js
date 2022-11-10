import React from "react";
import { makeStyles } from "@material-ui/styles";

import AgreementAdvanceSearch from "components/Land/components/Agreements/components/AdvanceSearch/";
import { Typography, Divider } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  title: {
    padding: "20px 10px",
    fontWeight: "bold",
  },
}));

export default function AdvanceSearch({ activeModule }) {
  const classes = useStyles();

  return (
    <>
      <Divider />
      <Typography className={classes.title}>Advance Search</Typography>
      {activeModule.title === "Agreements" && <AgreementAdvanceSearch />}
      <Divider />
    </>
  );
}
