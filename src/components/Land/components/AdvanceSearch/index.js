import React, { useMemo } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/styles";

import AgreementAdvanceSearch from "components/Land/components/Agreements/components/AdvanceSearch/";
import { Typography, Divider } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  title: {
    padding: "20px 10px 10px 10px",
    //fontWeight: "bold",
  },
}));

export default function AdvanceSearch({ activeModule }) {
  const classes = useStyles();
  const history = useHistory();
  console.log("isASActive", activeModule.title)
  const isASActive = useMemo(
    () => activeModule.title === "Agreements" || history.location.pathname === "/land/agreements",
    [activeModule, history.location]
  );

  return (
    <>
      {isASActive && (
        <>
          <Divider />
          <div style={{ paddingLeft: '23px', color: "#29abe0" }}>
            <Typography className={classes.title}>Advanced Search</Typography>
          </div>
          {activeModule.title === "Agreements" && <AgreementAdvanceSearch />}

          <Divider />
        </>
      )}
    </>
  );
}
